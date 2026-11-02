import "server-only";
import { createHash } from "node:crypto";
import { eq, sql } from "drizzle-orm";
import { headers } from "next/headers";
import { db } from "@/db";
import { rateLimits } from "@/db/schema";

// Hashed so the table never stores raw visitor IP addresses.
export async function clientKey() {
  const list = await headers();
  const ip = list.get("x-forwarded-for")?.split(",")[0]?.trim() || list.get("x-real-ip") || "unknown";
  return createHash("sha256").update(ip).digest("hex").slice(0, 32);
}

// Stored in Postgres because serverless instances share no memory. Returns false once over the limit.
export async function consumeRateLimit(key: string, limit: number, windowSeconds: number) {
  const resetAt = new Date(Date.now() + windowSeconds * 1000);
  const [row] = await db
    .insert(rateLimits)
    .values({ key, count: 1, resetAt })
    .onConflictDoUpdate({
      target: rateLimits.key,
      set: {
        count: sql`case when ${rateLimits.resetAt} < now() then 1 else ${rateLimits.count} + 1 end`,
        resetAt: sql`case when ${rateLimits.resetAt} < now() then excluded.reset_at else ${rateLimits.resetAt} end`,
      },
    })
    .returning({ count: rateLimits.count });
  return row.count <= limit;
}

export async function clearRateLimit(key: string) {
  await db.delete(rateLimits).where(eq(rateLimits.key, key));
}
