import { createClient } from "@supabase/supabase-js";

/**
 * Envoi de fichiers vers Supabase Storage (bucket « Portfolio »).
 * Le type réel est déterminé à partir du contenu du fichier (signature),
 * jamais à partir de ce que déclare le navigateur.
 */

const BUCKET = "Portfolio";
const MAX_BYTES = 10 * 1024 * 1024; // 10 Mo

export const ALLOWED_FOLDERS = ["projects", "skills", "companies", "blogs", "documents", "avatars", "misc"] as const;
type Folder = (typeof ALLOWED_FOLDERS)[number];

type Kind = { mime: string; ext: string };

const IMAGE_KINDS = ["image/png", "image/jpeg", "image/webp", "image/gif", "image/avif"];

function sniff(buf: Buffer): Kind | null {
  const hex = (start: number, end: number) => buf.subarray(start, end).toString("hex");
  const ascii = (start: number, end: number) => buf.subarray(start, end).toString("latin1");
  if (hex(0, 8) === "89504e470d0a1a0a") return { mime: "image/png", ext: "png" };
  if (hex(0, 3) === "ffd8ff") return { mime: "image/jpeg", ext: "jpg" };
  if (ascii(0, 6) === "GIF87a" || ascii(0, 6) === "GIF89a") return { mime: "image/gif", ext: "gif" };
  if (ascii(0, 4) === "RIFF" && ascii(8, 12) === "WEBP") return { mime: "image/webp", ext: "webp" };
  if (ascii(4, 8) === "ftyp" && ["avif", "avis"].includes(ascii(8, 12))) return { mime: "image/avif", ext: "avif" };
  if (ascii(0, 5) === "%PDF-") return { mime: "application/pdf", ext: "pdf" };
  return null;
}

export class UploadError extends Error {
  constructor(message: string, public status = 400) {
    super(message);
  }
}

export async function uploadToStorage(file: File, folderInput: string): Promise<string> {
  const folder = (ALLOWED_FOLDERS as readonly string[]).includes(folderInput) ? (folderInput as Folder) : null;
  if (!folder) throw new UploadError("Dossier non autorisé");
  if (file.size === 0) throw new UploadError("Fichier vide");
  if (file.size > MAX_BYTES) throw new UploadError("Fichier trop volumineux (10 Mo maximum)", 413);

  const buffer = Buffer.from(await file.arrayBuffer());
  const kind = sniff(buffer);
  // PDF uniquement pour les documents (CV) ; partout ailleurs, des images (SVG exclu : il peut contenir du script)
  const allowed = folder === "documents" ? ["application/pdf", ...IMAGE_KINDS] : IMAGE_KINDS;
  if (!kind || !allowed.includes(kind.mime)) {
    throw new UploadError(
      folder === "documents"
        ? "Format non accepté (PDF, PNG, JPEG, WebP, GIF ou AVIF)"
        : "Format non accepté (PNG, JPEG, WebP, GIF ou AVIF)",
      415
    );
  }

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) throw new UploadError("Stockage non configuré", 500);

  const base = file.name
    .replace(/\.[^.]*$/, "")
    .replace(/[^a-zA-Z0-9_-]/g, "_")
    .slice(0, 60) || "fichier";
  const path = `${folder}/${Date.now()}-${Math.round(Math.random() * 1e9)}-${base}.${kind.ext}`;

  const supabase = createClient(url, key, { auth: { persistSession: false } });
  const { error } = await supabase.storage.from(BUCKET).upload(path, buffer, {
    contentType: kind.mime,
    upsert: false,
  });
  if (error) {
    console.error("Supabase Storage error:", error);
    throw new UploadError("Échec de l'envoi vers le stockage", 500);
  }
  return supabase.storage.from(BUCKET).getPublicUrl(path).data.publicUrl;
}
