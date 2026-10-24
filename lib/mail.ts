import "server-only";
import nodemailer, { type Mail } from "nodemailer";
import { site } from "@/lib/site";

type Message = { to: string; subject: string; text: string; html: string; replyTo?: string };

let transport: Mail | undefined;

/** SMTP transport built from env; null when SMTP isn't configured so callers can skip email. */
function getTransport() {
  const { SMTP_HOST: host, SMTP_USER: user, SMTP_PASS: pass } = process.env;
  if (!host || !user || !pass) return null;
  const port = Number(process.env.SMTP_PORT || 465);
  transport ??= nodemailer.createTransport({
    host,
    port,
    secure: process.env.SMTP_SECURE ? process.env.SMTP_SECURE === "true" : port === 465,
    auth: { user, pass },
  });
  return transport;
}

/** Sends one email. Never throws: failures are logged and reported as false. */
export async function sendMail(message: Message) {
  const smtp = getTransport();
  if (!smtp) return false;
  try {
    await smtp.sendMail({ from: process.env.MAIL_FROM || `"${site.name}" <${process.env.SMTP_USER}>`, ...message });
    return true;
  } catch (error) {
    console.error(`[mail] failed to send "${message.subject}"`, error);
    return false;
  }
}

export const escapeHtml = (value: string) =>
  value.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);

/** Branded, table-based email shell with flat colours that render in every client. `body` must already be escaped. */
export function emailLayout({ heading, body, preheader = "" }: { heading: string; body: string; preheader?: string }) {
  return `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width"><title>${escapeHtml(heading)}</title></head>
<body style="margin:0;background:#f4f6fc;font-family:Inter,Segoe UI,Helvetica,Arial,sans-serif;color:#0b0f3a">
<span style="display:none;max-height:0;overflow:hidden">${escapeHtml(preheader)}</span>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f4f6fc;padding:32px 16px">
<tr><td align="center">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;background:#ffffff;border:1px solid #dde2f2;border-radius:16px;overflow:hidden">
<tr><td style="background:#05061a;padding:20px 28px;font-family:Exo,Segoe UI,Arial,sans-serif;font-size:18px;font-weight:700;color:#f5f7ff">
Co<span style="color:#3df2ff">3</span> <span style="font-weight:400;color:#8a93c9;font-size:13px">&nbsp;${escapeHtml(site.name)}</span></td></tr>
<tr><td style="padding:28px">
<h1 style="margin:0 0 16px;font-size:20px;line-height:1.3;color:#0b0f3a">${escapeHtml(heading)}</h1>
${body}
</td></tr>
<tr><td style="padding:16px 28px;border-top:1px solid #dde2f2;font-size:12px;color:#6b7299"><a href="${site.url}" style="color:#1e2a8c">${site.url.replace(/^https?:\/\//, "")}</a></td></tr>
</table></td></tr></table></body></html>`;
}
