import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const conversations = (await prisma.conversation.findMany({
      include: {
        _count: {
          select: { messages: true }
        },
        messages: {
          orderBy: { createdAt: "desc" },
          take: 1
        }
      },
      orderBy: { updatedAt: "desc" },
    })) as any[];

    const formattedConversations = conversations.map((c) => ({
      id: c.id,
      visitorName: c.visitorName || "Anonyme",
      visitorEmail: c.visitorEmail || "N/A",
      visitorPhone: c.visitorPhone || "N/A",
      status: c.status,
      messageCount: c._count.messages,
      lastMessage: c.messages[0]?.content || "Aucun message",
      updatedAt: c.updatedAt,
    }));

    return NextResponse.json({
      data: formattedConversations,
      pagination: { total: formattedConversations.length, page: 1 },
      empty: formattedConversations.length === 0
    });
  } catch (error: any) {
    console.error("Conversations fetch error:", error);
    return NextResponse.json(
      { error: "Erreur lors de la récupération des conversations" },
      { status: 500 }
    );
  }
}
