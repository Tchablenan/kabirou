"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Upload, X, Loader2, FileText, ExternalLink } from "lucide-react";
import { toast } from "react-toastify";

interface DocumentUploadProps {
  value?: string | null;
  onChange: (url: string) => void;
  label?: string;
  accept?: string;
  maxMB?: number;
}

export default function DocumentUpload({
  value,
  onChange,
  label = "Document",
  accept = "application/pdf",
  maxMB = 10,
}: DocumentUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const filename = value ? decodeURIComponent(value.split("/").pop() ?? "") : null;

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > maxMB * 1024 * 1024) {
      toast.error(`Le fichier est trop volumineux (max ${maxMB}MB)`);
      return;
    }

    setIsUploading(true);
    const formData = new FormData();
    formData.append("file", file);
    formData.append("folder", "documents");

    try {
      const res = await fetch("/api/upload", { method: "POST", body: formData });
      if (res.ok) {
        const data = await res.json();
        onChange(data.url);
        toast.success("Document téléchargé avec succès");
      } else {
        toast.error("Échec du téléchargement");
      }
    } catch {
      toast.error("Erreur de connexion lors de l'upload");
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  return (
    <div className="space-y-3">
      <label className="text-sm font-medium text-foreground">{label}</label>

      {value ? (
        <div className="flex items-center gap-3 p-3 rounded-lg border border-border bg-muted/30">
          <FileText className="size-8 text-primary shrink-0" />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-foreground truncate">{filename}</p>
            <a
              href={value}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-primary flex items-center gap-1 hover:underline mt-0.5"
            >
              <ExternalLink className="size-3" /> Visualiser le fichier
            </a>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <Button type="button" variant="outline" size="sm" onClick={() => fileInputRef.current?.click()} disabled={isUploading}>
              {isUploading ? <Loader2 className="size-4 animate-spin" /> : <Upload className="size-4" />}
              <span className="ml-2">Remplacer</span>
            </Button>
            <Button type="button" variant="ghost" size="icon" className="size-8 text-destructive hover:bg-destructive/10" onClick={() => onChange("")}>
              <X className="size-4" />
            </Button>
          </div>
        </div>
      ) : (
        <div
          className="border-2 border-dashed border-border rounded-lg p-8 text-center cursor-pointer hover:border-primary/50 hover:bg-muted/20 transition-colors"
          onClick={() => fileInputRef.current?.click()}
        >
          {isUploading ? (
            <Loader2 className="size-8 mx-auto text-muted-foreground animate-spin mb-2" />
          ) : (
            <FileText className="size-8 mx-auto text-muted-foreground mb-2" />
          )}
          <p className="text-sm font-medium text-foreground mb-1">
            {isUploading ? "Upload en cours..." : "Cliquer pour choisir un fichier"}
          </p>
          <p className="text-xs text-muted-foreground">PDF · Max {maxMB}MB</p>
        </div>
      )}

      <input type="file" ref={fileInputRef} className="hidden" accept={accept} onChange={handleUpload} />
    </div>
  );
}
