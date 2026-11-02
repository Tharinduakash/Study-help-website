import Link from "next/link";
import { ExternalLink, LogOut } from "lucide-react";
import { AdminNav } from "@/components/admin/AdminNav";
import { Logo } from "@/components/shared/Logo";
import { logout } from "@/lib/auth/actions";
import { requireAdmin } from "@/lib/auth/session";

export default async function PanelLayout({ children }: { children: React.ReactNode }) {
  const admin = await requireAdmin();
  return (
    <div className="flex min-h-svh flex-col bg-abyss lg:flex-row">
      <aside className="border-b border-aqua/10 p-4 lg:sticky lg:top-0 lg:flex lg:h-svh lg:w-60 lg:shrink-0 lg:flex-col lg:border-r lg:border-b-0">
        <div className="mb-4 px-2"><Logo /></div>
        <AdminNav />
        <div className="mt-4 flex items-center justify-between gap-3 px-3 text-sm text-mist lg:mt-auto lg:flex-col lg:items-start">
          <span className="truncate">{admin.name}</span>
          <div className="flex gap-4">
            <Link href="/" target="_blank" className="inline-flex items-center gap-1.5 hover:text-white"><ExternalLink className="size-3.5" aria-hidden />Site</Link>
            <form action={logout}><button type="submit" className="inline-flex items-center gap-1.5 hover:text-white"><LogOut className="size-3.5" aria-hidden />Sign out</button></form>
          </div>
        </div>
      </aside>
      <main className="min-w-0 flex-1 p-4 sm:p-6 lg:p-10">{children}</main>
    </div>
  );
}
