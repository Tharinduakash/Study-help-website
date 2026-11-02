"use server";

import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";
import { z } from "zod";
import { db } from "@/db";
import { sessions, users } from "@/db/schema";
import { decoyHash, hashPassword, MIN_PASSWORD_LENGTH, verifyPassword } from "@/lib/auth/password";
import { createSession, destroySession, requireAdmin } from "@/lib/auth/session";
import { clientKey, consumeRateLimit, clearRateLimit } from "@/lib/rate-limit";
import type { FormState } from "@/lib/form-state";

const credentials = z.object({ email: z.email().max(200), password: z.string().min(1).max(200) });

export async function login(_previous: FormState, formData: FormData): Promise<FormState> {
  const parsed = credentials.safeParse({ email: String(formData.get("email") ?? "").trim().toLowerCase(), password: formData.get("password") });
  if (!parsed.success) return { message: "Enter your email and password." };
  const { email, password } = parsed.data;

  const limitKey = `login:${await clientKey()}:${email}`;
  if (!(await consumeRateLimit(limitKey, 5, 15 * 60))) return { message: "Too many attempts. Try again in 15 minutes." };

  const [user] = await db.select().from(users).where(eq(users.email, email)).limit(1);
  const valid = await verifyPassword(password, user?.passwordHash ?? decoyHash);
  if (!user || !valid) return { message: "Incorrect email or password." };

  await clearRateLimit(limitKey);
  await db.update(users).set({ lastLoginAt: new Date() }).where(eq(users.id, user.id));
  await createSession(user.id);
  redirect("/admin");
}

export async function logout() {
  await destroySession();
  redirect("/admin/login");
}

const passwordChange = z.object({
  current: z.string().min(1, "Enter your current password").max(200),
  next: z.string().min(MIN_PASSWORD_LENGTH, `Use at least ${MIN_PASSWORD_LENGTH} characters`).max(200),
});

export async function changePassword(_previous: FormState, formData: FormData): Promise<FormState> {
  const admin = await requireAdmin();
  const parsed = passwordChange.safeParse({ current: formData.get("current"), next: formData.get("next") });
  if (!parsed.success) return { message: parsed.error.issues[0].message };

  const [user] = await db.select().from(users).where(eq(users.id, admin.id)).limit(1);
  if (!(await verifyPassword(parsed.data.current, user.passwordHash))) return { message: "Your current password is incorrect." };

  await db.update(users).set({ passwordHash: await hashPassword(parsed.data.next) }).where(eq(users.id, admin.id));
  // Sign out everywhere: revoke every session, then issue a fresh one for this browser.
  await db.delete(sessions).where(eq(sessions.userId, admin.id));
  await createSession(admin.id);
  return { ok: true, message: "Password changed. Other devices have been signed out." };
}
