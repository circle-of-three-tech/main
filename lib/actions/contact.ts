"use server";

import { z } from "zod";
import { after } from "next/server";
import { db } from "@/lib/db";
import { emailLayout, escapeHtml, sendMail } from "@/lib/mail";
import { getSettings } from "@/lib/queries";
import { site } from "@/lib/site";

const schema = z.object({
  name: z.string().trim().min(2, "Please tell us your name").max(120),
  email: z.email("Enter a valid email address").max(200),
  company: z.string().trim().max(160).optional(),
  service: z.string().trim().max(120).optional(),
  budget: z.string().trim().max(60).optional(),
  body: z.string().trim().min(10, "A few more details will help us reply well").max(5000),
});

export type ContactState = { ok: boolean; message?: string; errors?: Partial<Record<keyof z.infer<typeof schema>, string>> };

export async function submitContact(_prev: ContactState, formData: FormData): Promise<ContactState> {
  // Honeypot: real people never fill this hidden field.
  if (formData.get("website")) return { ok: true };

  const parsed = schema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) {
    const errors: ContactState["errors"] = {};
    for (const issue of parsed.error.issues) errors[issue.path[0] as keyof typeof errors] ??= issue.message;
    return { ok: false, errors };
  }

  const data = parsed.data;
  await db.message.create({ data: { ...data, company: data.company || null, service: data.service || null, budget: data.budget || null } });

  // Email after responding so a slow or failing SMTP server never blocks the form; the inbox already has the message.
  after(() => notify(data));

  return { ok: true, message: "Message received. We'll be in touch within one business day." };
}

async function notify(data: z.infer<typeof schema>) {
  const team = process.env.CONTACT_NOTIFY_EMAIL || (await getSettings()).email;
  const firstName = data.name.split(/\s+/)[0];
  const details = [
    ["Name", data.name],
    ["Email", data.email],
    ["Company", data.company],
    ["Service", data.service],
    ["Budget", data.budget],
  ].filter((row): row is [string, string] => Boolean(row[1]));
  const paragraphs = (text: string) =>
    escapeHtml(text).split(/\n{2,}/).map((p) => `<p style="margin:0 0 12px;line-height:1.6">${p.replace(/\n/g, "<br>")}</p>`).join("");

  await Promise.all([
    sendMail({
      to: team,
      replyTo: `"${data.name.replace(/"/g, "")}" <${data.email}>`,
      subject: `New enquiry from ${data.name}${data.company ? ` (${data.company})` : ""}`,
      text: `${details.map(([k, v]) => `${k}: ${v}`).join("\n")}\n\n${data.body}\n\nReply to this email to answer ${firstName} directly, or open the inbox: ${site.url}/dashboard/messages`,
      html: emailLayout({
        heading: "New website enquiry",
        preheader: data.body.slice(0, 120),
        body: `<table role="presentation" cellpadding="0" cellspacing="0" style="margin:0 0 20px;font-size:14px">${details
          .map(([k, v]) => `<tr><td style="padding:4px 16px 4px 0;color:#6b7299">${k}</td><td style="padding:4px 0">${escapeHtml(v)}</td></tr>`)
          .join("")}</table>
<div style="padding:16px;border:1px solid #dde2f2;border-radius:12px;font-size:15px">${paragraphs(data.body)}</div>
<p style="margin:20px 0 0;font-size:14px;color:#6b7299">Reply to this email to answer ${escapeHtml(firstName)} directly, or <a href="${site.url}/dashboard/messages" style="color:#1e2a8c">open the inbox</a>.</p>`,
      }),
    }),
    sendMail({
      to: data.email,
      replyTo: team,
      subject: `We received your message | ${site.name}`,
      text: `Hi ${firstName},\n\nThanks for reaching out to ${site.name}. We've received your message and will reply within one business day.\n\nThe Co3 team\n${site.url}`,
      html: emailLayout({
        heading: `Thanks, ${firstName}. We've got your message.`,
        preheader: "We'll reply within one business day.",
        body: `<p style="margin:0 0 12px;line-height:1.6">Thanks for reaching out to ${escapeHtml(site.name)}. Someone from the team will reply within one business day. If anything changes in the meantime, just reply to this email.</p>
<p style="margin:20px 0 0;line-height:1.6">The Co3 team</p>`,
      }),
    }),
  ]);
}
