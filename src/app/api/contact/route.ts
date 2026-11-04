import { Resend } from "resend";
import { NextResponse } from "next/server";
import * as z from "zod";
import { escapeHtml, singleLine } from "@/lib/sanitize";
import { clientIp, rateLimitHit, tooManyRequests } from "@/lib/rate-limit";

const resend = new Resend(process.env.RESEND_API_KEY);

const contactSchema = z.object({
  name: z.string().trim().min(1).max(100),
  email: z.string().trim().max(200).email(),
  subject: z.string().trim().min(1).max(150),
  message: z.string().trim().min(1).max(5000),
  // Champ piège invisible : un humain le laisse vide, un robot le remplit
  website: z.string().max(200).optional(),
});

export async function POST(req: Request) {
  const limit = await rateLimitHit(`contact:${clientIp(req.headers)}`, 5, 60 * 60);
  if (!limit.ok) return tooManyRequests(limit.retryAfter);

  const parsed = contactSchema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid fields" }, { status: 400 });
  }
  const { name, email, subject, message, website } = parsed.data;

  // Robot détecté : on répond comme si tout allait bien, sans rien envoyer
  if (website) return NextResponse.json({ ok: true });

  try {
    const { error } = await resend.emails.send({
      from: "onboarding@resend.dev",
      to: [process.env.CONTACT_EMAIL as string],
      subject: `Portfolio Contact: ${singleLine(subject)}`,
      replyTo: email,
      html: `
        <h2>Nouveau message de contact</h2>
        <p><strong>Nom :</strong> ${escapeHtml(name)}</p>
        <p><strong>Email :</strong> ${escapeHtml(email)}</p>
        <p><strong>Sujet :</strong> ${escapeHtml(subject)}</p>
        <p><strong>Message :</strong></p>
        <p>${escapeHtml(message).replace(/\n/g, "<br>")}</p>
      `,
    });

    if (error) {
      console.error("Resend error:", error);
      return NextResponse.json({ error: "Email not sent" }, { status: 502 });
    }
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Contact API error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
