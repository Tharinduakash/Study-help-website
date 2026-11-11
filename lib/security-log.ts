import "server-only";

// One JSON line per security event, searchable in the hosting logs (Vercel > Logs).
// Only ids and hashed IPs go in: never passwords, tokens, cookies or email addresses.
export function securityLog(event: string, details: Record<string, string | boolean | number> = {}) {
  console.warn(JSON.stringify({ type: "security", event, at: new Date().toISOString(), ...details }));
}
