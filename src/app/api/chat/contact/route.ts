import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

const CONVERSATION_ID = /^[0-9a-f-]{36}$/i;
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const PHONE = /^\+?[0-9 ().-]{6,20}$/;

// Coordonnées laissées par le visiteur dans le chat, pour que Kabirou puisse le recontacter.
export async function POST(req: Request) {
  try {
    const { conversationId, name, contact } = await req.json();

    if (typeof conversationId !== "string" || !CONVERSATION_ID.test(conversationId)) {
      return NextResponse.json({ error: "Invalid conversation" }, { status: 400 });
    }

    const cleanName = typeof name === "string" ? name.trim().slice(0, 100) : "";
    const cleanContact = typeof contact === "string" ? contact.trim() : "";

    let visitorEmail: string | undefined;
    let visitorPhone: string | undefined;
    if (EMAIL.test(cleanContact) && cleanContact.length <= 200) {
      visitorEmail = cleanContact.toLowerCase();
    } else if (PHONE.test(cleanContact) && cleanContact.replace(/\D/g, "").length >= 6) {
      visitorPhone = cleanContact;
    } else {
      return NextResponse.json({ error: "Invalid contact" }, { status: 400 });
    }

    const exists = await prisma.conversation.findUnique({ where: { id: conversationId }, select: { id: true } });
    if (!exists) {
      return NextResponse.json({ error: "Conversation not found" }, { status: 404 });
    }

    await prisma.conversation.update({
      where: { id: conversationId },
      data: {
        ...(cleanName && { visitorName: cleanName }),
        ...(visitorEmail && { visitorEmail }),
        ...(visitorPhone && { visitorPhone }),
      },
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Chat contact error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
