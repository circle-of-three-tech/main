import { NextResponse } from "next/server";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { put } from "@vercel/blob";
import { getCurrentUser } from "@/lib/auth";
import { slugify } from "@/lib/utils";

const MAX_BYTES = 8 * 1024 * 1024;
const TYPES = new Set(["image/png", "image/jpeg", "image/webp", "image/avif", "image/gif", "image/svg+xml"]);

/** Image upload for the dashboard: Vercel Blob in production, /public/uploads locally. */
export async function POST(request: Request) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const form = await request.formData();
  const file = form.get("file");
  if (!(file instanceof File)) return NextResponse.json({ error: "No file" }, { status: 400 });
  if (!TYPES.has(file.type)) return NextResponse.json({ error: "Unsupported image type" }, { status: 415 });
  if (file.size > MAX_BYTES) return NextResponse.json({ error: "Image must be under 8MB" }, { status: 413 });

  const ext = path.extname(file.name).toLowerCase() || ".png";
  const name = `${slugify(path.basename(file.name, ext)) || "image"}-${Date.now().toString(36)}${ext}`;

  if (process.env.BLOB_READ_WRITE_TOKEN) {
    const blob = await put(`uploads/${name}`, file, { access: "public", contentType: file.type });
    return NextResponse.json({ url: blob.url });
  }
  if (process.env.VERCEL) {
    return NextResponse.json({ error: "Image storage is not configured. Add BLOB_READ_WRITE_TOKEN." }, { status: 500 });
  }
  const dir = path.join(process.cwd(), "public", "uploads");
  await mkdir(dir, { recursive: true });
  await writeFile(path.join(dir, name), Buffer.from(await file.arrayBuffer()));
  return NextResponse.json({ url: `/uploads/${name}` });
}
