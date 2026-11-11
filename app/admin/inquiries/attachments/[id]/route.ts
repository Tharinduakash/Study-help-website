import { NextResponse } from "next/server";
import { getAttachment } from "@/lib/admin/queries";
import { getCurrentUser } from "@/lib/auth/session";
import { securityLog } from "@/lib/security-log";
import { signedDownloadUrl } from "@/lib/storage";
import { isUuid } from "@/lib/utils";

// Customer files have no public address. Each download checks the admin session,
// then redirects to a link that expires after 60 seconds.
export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const attachment = isUuid(id) ? await getAttachment(id) : null;
  if (!attachment) return new NextResponse("Not found", { status: 404 });
  securityLog("attachment_downloaded", { attachmentId: id, userId: (await getCurrentUser())?.id ?? "unknown" });
  const url = await signedDownloadUrl(attachment.storagePath, attachment.fileName);
  return NextResponse.redirect(url, { headers: { "Cache-Control": "no-store" } });
}
