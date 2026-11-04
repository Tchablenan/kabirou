import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { uploadToStorage, UploadError } from "@/lib/storage";

// Champs renvoyés au navigateur (jamais le mot de passe)
const PUBLIC_FIELDS = {
  id: true,
  name: true,
  image: true,
  professionalTitleEn: true,
  professionalTitleFr: true,
  aboutEn: true,
  aboutFr: true,
  githubUrl: true,
  linkedinUrl: true,
  twitterUrl: true,
  facebookUrl: true,
} as const;

export async function GET() {
  try {
    // L'e-mail (identifiant de connexion) n'est renvoyé qu'à l'admin connecté
    const session = await getServerSession(authOptions);
    const user = await prisma.user.findFirst({
      select: { ...PUBLIC_FIELDS, email: Boolean(session) },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }
    return NextResponse.json(user);
  } catch (error) {
    console.error("Profile GET error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

const text = (v: FormDataEntryValue | null, max: number) =>
  typeof v === "string" ? v.trim().slice(0, max) : null;

const url = (v: FormDataEntryValue | null) => {
  const s = text(v, 300);
  return s && /^https?:\/\//i.test(s) ? s : s ? null : s;
};

export async function PUT(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const formData = await req.formData();
    const name = text(formData.get("name"), 100);
    if (!name) {
      return NextResponse.json({ error: "Le nom est obligatoire" }, { status: 400 });
    }

    let imageUrl: string | null | undefined = undefined;
    const avatar = formData.get("avatar");
    if (avatar instanceof File && avatar.size > 0) {
      imageUrl = await uploadToStorage(avatar, "avatars");
    }

    const updatedUser = await prisma.user.update({
      where: { email: session.user.email },
      data: {
        name,
        professionalTitleEn: text(formData.get("professionalTitleEn"), 150),
        professionalTitleFr: text(formData.get("professionalTitleFr"), 150),
        aboutEn: text(formData.get("aboutEn"), 5000),
        aboutFr: text(formData.get("aboutFr"), 5000),
        githubUrl: url(formData.get("githubUrl")),
        linkedinUrl: url(formData.get("linkedinUrl")),
        twitterUrl: url(formData.get("twitterUrl")),
        facebookUrl: url(formData.get("facebookUrl")),
        ...(imageUrl !== undefined && { image: imageUrl }),
      },
      select: { ...PUBLIC_FIELDS, email: true },
    });

    return NextResponse.json({
      message: "Profil mis à jour",
      user: updatedUser,
      imageUrl: updatedUser.image,
    });
  } catch (error) {
    if (error instanceof UploadError) {
      return NextResponse.json({ error: error.message }, { status: error.status });
    }
    console.error("Profile update error:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
