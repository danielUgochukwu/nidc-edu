import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { resend } from "@/lib/resend";

const contactSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  subject: z.enum([
    "General Inquiry",
    "Partnership",
    "Institutional Funding",
    "Media",
    "Other",
  ]),
  message: z.string().min(10),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = contactSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: { message: "Invalid request body", code: "VALIDATION_ERROR" } },
        { status: 400 },
      );
    }

    const { name, email, subject, message } = parsed.data;

    await resend.emails.send({
      from: "NIDC Contact Form <no-reply@nidc.org>",
      to: "partnerships@nidcfoundation.org",
      replyTo: email,
      subject: `[${subject}] from ${name}`,
      html: `<p><strong>From:</strong> ${name} (${email})</p><p><strong>Subject:</strong> ${subject}</p><p><strong>Message:</strong></p><p>${message}</p>`,
    });

    return NextResponse.json({ data: { success: true } }, { status: 200 });
  } catch (error) {
    console.error("[POST /api/contact]", error);
    return NextResponse.json(
      { error: { message: "Internal server error", code: "INTERNAL_ERROR" } },
      { status: 500 },
    );
  }
}
