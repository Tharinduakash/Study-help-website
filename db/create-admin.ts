import { hashPassword, MIN_PASSWORD_LENGTH } from "@/lib/auth/password";
import { db, sqlClient } from "./index";
import { users } from "./schema";

// ADMIN_EMAIL=you@example.com ADMIN_NAME="Your Name" ADMIN_PASSWORD=... pnpm admin:create
// Running it again for the same email resets that admin's password.
async function main() {
  const email = process.env.ADMIN_EMAIL?.trim().toLowerCase();
  const name = process.env.ADMIN_NAME?.trim() || "Administrator";
  const password = process.env.ADMIN_PASSWORD;

  if (!email || !password) throw new Error("Set ADMIN_EMAIL and ADMIN_PASSWORD.");
  if (password.length < MIN_PASSWORD_LENGTH) throw new Error(`ADMIN_PASSWORD must be at least ${MIN_PASSWORD_LENGTH} characters.`);

  const passwordHash = await hashPassword(password);
  await db.insert(users).values({ email, name, passwordHash }).onConflictDoUpdate({ target: users.email, set: { name, passwordHash } });
  console.log(`Admin ready: ${email}`);
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
}).finally(() => sqlClient.end());
