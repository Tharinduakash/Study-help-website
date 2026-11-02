import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";

const url = process.env.DATABASE_URL;
if (!url) throw new Error("DATABASE_URL is not set. See .env.example.");

// Reuse one pool across hot reloads. prepare: false is required by the
// transaction-mode poolers Supabase and Neon provide for serverless hosting.
// Idle connections are closed before the pooler drops them, so a stale socket is never reused.
const globalForDb = globalThis as unknown as { sql?: ReturnType<typeof postgres> };
export const sqlClient =
  globalForDb.sql ?? postgres(url, { prepare: false, max: 3, idle_timeout: 20, connect_timeout: 15 });
if (process.env.NODE_ENV !== "production") globalForDb.sql = sqlClient;

export const db = drizzle(sqlClient, { schema });
