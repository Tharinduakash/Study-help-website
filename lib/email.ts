import "server-only";
import { siteConfig } from "@/lib/site-config";

type InquiryAlert = {
  id: string;
  reference: string;
  name: string;
  email: string;
  phone?: string | null;
  service?: string | null;
  deadline?: string | null;
  message: string;
  fileCount: number;
};

// A failed alert must never lose an inquiry: it is already saved, so log and carry on.
export async function notifyAdmin(inquiry: InquiryAlert) {
  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.ADMIN_NOTIFICATION_EMAIL;
  const from = process.env.EMAIL_FROM;
  if (!apiKey || !to || !from) {
    console.warn(`Admin email skipped for ${inquiry.reference}: email is not configured.`);
    return false;
  }

  const text = [
    `New inquiry ${inquiry.reference}`,
    "",
    `Name: ${inquiry.name}`,
    `Email: ${inquiry.email}`,
    `Phone: ${inquiry.phone || "Not given"}`,
    `Service: ${inquiry.service || "Not selected"}`,
    `Deadline: ${inquiry.deadline || "Not given"}`,
    `Files: ${inquiry.fileCount}`,
    "",
    inquiry.message,
    "",
    `Open in the dashboard: ${siteConfig.url}/admin/inquiries/${inquiry.id}`,
  ].join("\n");

  try {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({ from, to, reply_to: inquiry.email, subject: `New inquiry ${inquiry.reference}: ${inquiry.service ?? inquiry.name}`, text }),
      signal: AbortSignal.timeout(6000),
    });
    if (!response.ok) throw new Error(`Resend responded ${response.status}: ${await response.text()}`);
    return true;
  } catch (error) {
    console.error(`Admin email failed for ${inquiry.reference}`, error);
    return false;
  }
}
