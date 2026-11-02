import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { AdminForm, TextField } from "@/components/admin/form";
import { LogoMark } from "@/components/shared/Logo";
import { login } from "@/lib/auth/actions";
import { getCurrentUser } from "@/lib/auth/session";

export const metadata: Metadata = { title: "Sign in" };

export default async function LoginPage() {
  if (await getCurrentUser()) redirect("/admin");
  return (
    <main className="grid flex-1 place-items-center bg-gradient-to-b from-deep to-abyss px-4 py-16">
      <div className="w-full max-w-sm rounded-2xl border border-aqua/15 bg-abyss/70 p-8">
        <LogoMark className="mx-auto h-16 w-auto" />
        <h1 className="mt-4 text-center font-display text-2xl font-semibold">Study Help Admin</h1>
        <AdminForm action={login} submitLabel="Sign in" className="mt-7">
          <TextField name="email" label="Email" type="email" autoComplete="username" required />
          <TextField name="password" label="Password" type="password" autoComplete="current-password" required />
        </AdminForm>
      </div>
    </main>
  );
}
