import { z } from "zod";

export const MAX_FILE_SIZE = 10 * 1024 * 1024;
export const MAX_FILES = 5;
export const ALLOWED_EXTENSIONS = [".pdf", ".doc", ".docx", ".xls", ".xlsx", ".ppt", ".pptx", ".csv", ".txt", ".png", ".jpg", ".jpeg", ".zip"];

// Shared by the form and the server action so both enforce the same rules.
export const inquirySchema = z.object({
  category: z.string().trim().max(120).optional(),
  service: z.string().trim().max(120).optional(),
  name: z.string().trim().min(2, "Enter your name").max(120),
  email: z.email("Enter a valid email address").max(200),
  phone: z.string().trim().max(30).regex(/^[+\d\s()-]*$/, "Enter a valid contact number").optional(),
  message: z.string().trim().min(10, "Describe your requirements in a little more detail").max(5000),
  deadline: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Enter a valid date").optional(),
});

export function fileError(file: { name: string; size: number }): string | null {
  const name = file.name.toLowerCase();
  if (!ALLOWED_EXTENSIONS.some((extension) => name.endsWith(extension))) {
    return `${file.name}: this file type is not allowed`;
  }
  if (file.size > MAX_FILE_SIZE) return `${file.name}: files must be 10 MB or smaller`;
  return null;
}

export type InquiryState =
  | { status: "idle" }
  | { status: "invalid"; errors: Record<string, string | undefined> }
  | { status: "error"; message: string }
  | { status: "success"; reference: string };
