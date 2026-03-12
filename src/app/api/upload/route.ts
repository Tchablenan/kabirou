import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { writeFile, mkdir } from "fs/promises";
import { join } from "path";
import fs from "fs";

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    const folder = (formData.get("folder") as string) || "misc";

    if (!file || !(file instanceof File)) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Path to save the file
    const relativePath = `uploads/${folder}`;
    const uploadDir = join(process.cwd(), "public", relativePath);

    // Ensure directory exists
    if (!fs.existsSync(uploadDir)) {
      await mkdir(uploadDir, { recursive: true });
    }

    const uniquePrefix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const safeFilename = file.name.replace(/[^a-zA-Z0-9.]/g, "_");
    const filename = `${uniquePrefix}-${safeFilename}`;
    const filepath = join(uploadDir, filename);

    await writeFile(filepath, buffer);

    const imageUrl = `/${relativePath}/${filename}`;

    return NextResponse.json({ 
      url: imageUrl,
      message: "File uploaded successfully" 
    });
  } catch (error: any) {
    console.error("Upload error:", error);
    return NextResponse.json(
      { error: "Internal Server Error during upload" },
      { status: 500 }
    );
  }
}
