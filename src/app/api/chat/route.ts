
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  try {
    const { messages, conversationId: initialConversationId } = await req.json();
    const lastMessage = messages[messages.length - 1];
    
    if (!lastMessage || lastMessage.role !== 'user') {
      return NextResponse.json({ error: "Invalid message" }, { status: 400 });
    }

    const userContent = lastMessage.content;
    let conversationId = initialConversationId;

    // Ensure conversation exists
    if (conversationId) {
      await (prisma.conversation.upsert({
        where: { id: conversationId },
        update: {},
        create: { id: conversationId } as any,
      }) as any);
    } else {
      const conv = await (prisma.conversation.create({
        data: {}
      }) as any);
      conversationId = conv.id;
    }

    // Save message
    await prisma.message.create({
      data: { 
        content: userContent, 
        role: "USER" as any, 
        conversationId 
      },
    });

    // Send notification to Kabirou
    try {
      await resend.emails.send({
        from: 'onboarding@resend.dev',
        to: [process.env.CONTACT_EMAIL as string],
        subject: `Nouveau message sur le Chat Portfolio`,
        html: `
          <h2>Nouveau message de visiteur</h2>
          <p><strong>Conversation ID:</strong> ${conversationId}</p>
          <p><strong>Message:</strong></p>
          <p>${userContent.replace(/\n/g, '<br>')}</p>
          <p><a href="${process.env.NEXTAUTH_URL}/admin/conversations">Gérer la conversation dans l'admin</a></p>
        `,
      });
    } catch (e) {
      console.error("Failed to send email notification:", e);
    }

    // Return response to visitor
    return NextResponse.json({
      role: "assistant",
      content: "Merci ! Kabirou a été prévenu et vous répondra personnellement ici-même un instant à l'autre.",
      conversationId, // Return the ID so the client can save it
    });

  } catch (error) {
    console.error("Chat API error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
