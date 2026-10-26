/**
 * pg currently treats sslmode=require/prefer/verify-ca as verify-full and warns
 * that this will change in pg v9. The Vercel Prisma Postgres integration sets
 * sslmode=require, so make the current (fully verified) behaviour explicit.
 */
export function databaseUrl(url = process.env.DATABASE_URL) {
  if (!url) throw new Error("DATABASE_URL is not set");
  return url.replace(/([?&])sslmode=(require|prefer|verify-ca)\b/, "$1sslmode=verify-full");
}
