import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { writeFile, mkdir } from "fs/promises";
import { join } from "path";
import fs from "fs";

export async function PUT(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const formData = await req.formData();
    const name = formData.get("name") as string | null;
    const avatar = formData.get("avatar") as File | null;

    console.log("Profile update request:", { name, avatarName: avatar?.name, avatarSize: avatar?.size });

    if (!name || name.trim() === "") {
      return NextResponse.json(
        { error: "Le nom est obligatoire" },
        { status: 400 }
      );
    }

    let imageUrl = session.user.image;

    // Handle avatar upload if provided
    if (avatar && avatar instanceof File && avatar.name && avatar.name !== "undefined") {
      console.log("Processing avatar upload...");
      const bytes = await avatar.arrayBuffer();
      const buffer = Buffer.from(bytes);

      // We save the file locally in the public folder.
      const uploadDir = join(process.cwd(), "public/uploads/avatars");
      
      // Ensure the directory exists
      if (!fs.existsSync(uploadDir)) {
        console.log("Creating upload directory:", uploadDir);
        await mkdir(uploadDir, { recursive: true });
      }

      const uniquePrefix = Date.now() + "-" + Math.round(Math.random() * 1e9);
      const safeFilename = avatar.name.replace(/[^a-zA-Z0-9.]/g, "_");
      const filename = `${uniquePrefix}-${safeFilename}`;
      const filepath = join(uploadDir, filename);

      console.log("Saving file to:", filepath);
      await writeFile(filepath, buffer);
      
      // The publicly accessible URL
      imageUrl = `/uploads/avatars/${filename}`;
      console.log("New image URL:", imageUrl);
    }

    // Update user in database
    console.log("Updating user in database for email:", session.user.email);
    const updatedUser = await prisma.user.update({
      where: { email: session.user.email },
      data: {
        name,
        ...(imageUrl !== undefined && { image: imageUrl }),
      },
    });

    console.log("User updated successfully:", updatedUser.id);

    return NextResponse.json({
      message: "Profil mis à jour",
      user: {
        name: updatedUser.name,
        image: updatedUser.image,
      },
      imageUrl,
    });
  } catch (error: any) {
    console.error("Profile update error details:", {
      message: error.message,
      stack: error.stack,
      error
    });
    return NextResponse.json(
      { error: `Erreur serveur lors de la mise à jour: ${error.message}` },
      { status: 500 }
    );
  }
}
