"use server";

import { z } from "zod";
import { db } from "@/lib/db";

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

  const key = process.env.RESEND_API_KEY;
  const to = process.env.CONTACT_NOTIFY_EMAIL;
  if (key && to) {
    await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        from: "Co3 Website <onboarding@resend.dev>",
        to: [to],
        reply_to: data.email,
        subject: `New enquiry from ${data.name}${data.company ? ` (${data.company})` : ""}`,
        text: `${data.body}\n\nService: ${data.service ?? "-"}\nBudget: ${data.budget ?? "-"}\nEmail: ${data.email}`,
      }),
    }).catch(() => undefined);
  }

  return { ok: true, message: "Message received. We'll be in touch within one business day." };
}
