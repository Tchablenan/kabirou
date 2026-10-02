import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// Historique d'une conversation, utilisé par le widget visiteur et par l'admin.
// role : "user" pour le visiteur, "admin" pour les réponses de Kabirou.
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const conversationId = searchParams.get("conversationId");

  if (!conversationId) {
    return NextResponse.json({ messages: [] });
  }

  try {
    const [messages, conversation] = await Promise.all([
      prisma.message.findMany({
        where: { conversationId },
        orderBy: { createdAt: "asc" },
      }),
      prisma.conversation.findUnique({
        where: { id: conversationId },
        select: { visitorEmail: true, visitorPhone: true },
      }),
    ]);

    return NextResponse.json({
      // Indique seulement si des coordonnées existent, sans jamais les renvoyer
      hasContact: Boolean(conversation?.visitorEmail || conversation?.visitorPhone),
      messages: messages.map((m) => ({
        id: m.id,
        role: m.role === "USER" ? "user" : "admin",
        text: m.content,
        createdAt: m.createdAt,
      })),
    });
  } catch (error) {
    console.error("Failed to fetch messages:", error);
    return NextResponse.json({ error: "Failed to fetch messages" }, { status: 500 });
  }
}
