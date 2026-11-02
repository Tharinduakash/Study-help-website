import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";

const url = process.env.DATABASE_URL;
if (!url) throw new Error("DATABASE_URL is not set. See .env.example.");

// Reuse one pool across hot reloads. prepare: false is required by the
// transaction-mode poolers Supabase and Neon provide for serverless hosting.
const globalForDb = globalThis as unknown as { sql?: ReturnType<typeof postgres> };
export const sqlClient = globalForDb.sql ?? postgres(url, { prepare: false, max: 3 });
if (process.env.NODE_ENV !== "production") globalForDb.sql = sqlClient;

export const db = drizzle(sqlClient, { schema });
