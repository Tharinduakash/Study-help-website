import type { z } from "zod";

export type FormState = { ok?: boolean; message?: string; errors?: Record<string, string | undefined> };

export function invalid(error: z.ZodError): FormState {
  const errors: Record<string, string> = {};
  for (const issue of error.issues) errors[String(issue.path[0])] ??= issue.message;
  return { message: "Please fix the highlighted fields.", errors };
}
