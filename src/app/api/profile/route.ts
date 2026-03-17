import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { writeFile, mkdir } from "fs/promises";
import { join } from "path";
import fs from "fs";

export async function GET(req: NextRequest) {
  try {
    const user = await prisma.user.findFirst({
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
        professionalTitleEn: true,
        professionalTitleFr: true,
        aboutEn: true,
        aboutFr: true,
        githubUrl: true,
        linkedinUrl: true,
        twitterUrl: true,
        facebookUrl: true,
      }
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json(user);
  } catch (error: any) {
    console.error("Profile GET error:", error);
    return NextResponse.json(
      { error: `Internal Server Error: ${error.message}` },
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const formData = await req.formData();
    const name = formData.get("name") as string | null;
    const professionalTitleEn = formData.get("professionalTitleEn") as string | null;
    const professionalTitleFr = formData.get("professionalTitleFr") as string | null;
    const aboutEn = formData.get("aboutEn") as string | null;
    const aboutFr = formData.get("aboutFr") as string | null;
    const githubUrl = formData.get("githubUrl") as string | null;
    const linkedinUrl = formData.get("linkedinUrl") as string | null;
    const twitterUrl = formData.get("twitterUrl") as string | null;
    const facebookUrl = formData.get("facebookUrl") as string | null;
    const avatar = formData.get("avatar") as File | null;

    if (!name || name.trim() === "") {
      return NextResponse.json(
        { error: "Le nom est obligatoire" },
        { status: 400 }
      );
    }

    let imageUrl = session.user.image;

    // Handle avatar upload if provided
    if (avatar && avatar instanceof File && avatar.name && avatar.name !== "undefined") {
      const bytes = await avatar.arrayBuffer();
      const buffer = Buffer.from(bytes);

      const uploadDir = join(process.cwd(), "public/uploads/avatars");
      
      if (!fs.existsSync(uploadDir)) {
        await mkdir(uploadDir, { recursive: true });
      }

      const uniquePrefix = Date.now() + "-" + Math.round(Math.random() * 1e9);
      const safeFilename = avatar.name.replace(/[^a-zA-Z0-9.]/g, "_");
      const filename = `${uniquePrefix}-${safeFilename}`;
      const filepath = join(uploadDir, filename);

      await writeFile(filepath, buffer);
      imageUrl = `/uploads/avatars/${filename}`;
    }

    // Update user in database
    const updatedUser = await prisma.user.update({
      where: { email: session.user.email },
      data: {
        name,
        professionalTitleEn,
        professionalTitleFr,
        aboutEn,
        aboutFr,
        githubUrl,
        linkedinUrl,
        twitterUrl,
        facebookUrl,
        ...(imageUrl !== undefined && { image: imageUrl }),
      },
    });

    return NextResponse.json({
      message: "Profil mis à jour",
      user: updatedUser,
      imageUrl,
    });
  } catch (error: any) {
    console.error("Profile update error:", error);
    return NextResponse.json(
      { error: `Erreur serveur: ${error.message}` },
      { status: 500 }
    );
  }
}
