
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const conversationId = searchParams.get("conversationId");

  if (!conversationId) {
    return NextResponse.json({ messages: [] });
  }

  try {
    const messages = await prisma.message.findMany({
      where: { conversationId },
      orderBy: { createdAt: "asc" },
    });

    // Format for useChat
    const formattedMessages = messages.map((m: any) => ({
      id: m.id,
      role: m.role === "USER" ? "user" : "assistant",
      parts: [{ type: "text", text: m.content }],
      createdAt: m.createdAt,
    }));

    return NextResponse.json({ messages: formattedMessages });
  } catch (error) {
    console.error("Failed to fetch messages:", error);
    return NextResponse.json({ error: "Failed to fetch messages" }, { status: 500 });
  }
}
