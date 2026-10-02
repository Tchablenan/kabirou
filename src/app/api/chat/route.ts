import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

const MAX_LENGTH = 2000;
const CONVERSATION_ID = /^[0-9a-f-]{36}$/i;

function escapeHtml(text: string) {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

// Message d'un visiteur : enregistré puis notifié par e-mail. Kabirou répond depuis l'admin.
export async function POST(req: Request) {
  try {
    const { conversationId, content } = await req.json();

    if (typeof conversationId !== "string" || !CONVERSATION_ID.test(conversationId)) {
      return NextResponse.json({ error: "Invalid conversation" }, { status: 400 });
    }
    const text = typeof content === "string" ? content.trim() : "";
    if (!text || text.length > MAX_LENGTH) {
      return NextResponse.json({ error: "Invalid message" }, { status: 400 });
    }

    await prisma.conversation.upsert({
      where: { id: conversationId },
      update: { updatedAt: new Date() },
      create: { id: conversationId },
    });

    const message = await prisma.message.create({
      data: { content: text, role: "USER", conversationId },
    });

    try {
      await resend.emails.send({
        from: "onboarding@resend.dev",
        to: [process.env.CONTACT_EMAIL as string],
        subject: "Nouveau message sur le Chat Portfolio",
        html: `
          <h2>Nouveau message de visiteur</h2>
          <p><strong>Conversation :</strong> ${conversationId}</p>
          <p>${escapeHtml(text).replace(/\n/g, "<br>")}</p>
          <p><a href="${process.env.NEXTAUTH_URL}/admin/conversations">Répondre depuis l'admin</a></p>
        `,
      });
    } catch (e) {
      console.error("Failed to send email notification:", e);
    }

    return NextResponse.json({
      message: {
        id: message.id,
        role: "user",
        text: message.content,
        createdAt: message.createdAt,
      },
    });
  } catch (error) {
    console.error("Chat API error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
