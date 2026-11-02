"use client";

import { createContext, startTransition, useActionState, useContext, useEffect, useRef, useState, type FormEvent, type ReactNode } from "react";
import Image from "next/image";
import { LoaderCircle, Trash2, Upload } from "lucide-react";
import { useRouter } from "next/navigation";
import { buttonVariants } from "@/components/ui/button";
import { addGalleryImage, requestImageUpload } from "@/lib/admin/actions";
import type { FormState } from "@/lib/form-state";
import { cn } from "@/lib/utils";

type Action = (previous: FormState, formData: FormData) => Promise<FormState>;

const StateContext = createContext<FormState>({});

export const inputClass = "mt-1.5 w-full rounded-lg border border-aqua/20 bg-white/5 px-3.5 py-2.5 text-base text-white focus:border-cyan md:text-sm focus:outline-none";

// Submits by hand rather than through <form action>, because React resets
// uncontrolled inputs after an action and would wipe typed values on a validation error.
export function AdminForm({ action, children, submitLabel = "Save", resetOnSuccess = false, className }: { action: Action; children: ReactNode; submitLabel?: string; resetOnSuccess?: boolean; className?: string }) {
  const [state, dispatch, pending] = useActionState<FormState, FormData>(action, {});
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state.ok && resetOnSuccess) formRef.current?.reset();
  }, [state, resetOnSuccess]);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    startTransition(() => dispatch(data));
  }

  return (
    <StateContext.Provider value={state}>
      <form ref={formRef} onSubmit={handleSubmit} className={cn("space-y-5", className)}>
        {children}
        <div className="flex flex-wrap items-center gap-4">
          <button type="submit" disabled={pending} className={buttonVariants()}>
            {pending && <LoaderCircle className="size-4 animate-spin" aria-hidden />}{submitLabel}
          </button>
          {state.message && <p role="status" className={cn("text-sm", state.ok ? "text-aqua" : "text-amber-200")}>{state.message}</p>}
        </div>
      </form>
    </StateContext.Provider>
  );
}

type FieldProps = { name: string; label: string; hint?: string };

function Wrapper({ name, label, hint, children }: FieldProps & { children: ReactNode }) {
  const { errors } = useContext(StateContext);
  return (
    <div>
      <label htmlFor={name} className="text-sm font-medium">{label}</label>
      {children}
      {hint && <p className="mt-1 text-xs text-mist">{hint}</p>}
      {errors?.[name] && <p role="alert" className="mt-1 text-sm text-red-300">{errors[name]}</p>}
    </div>
  );
}

export function TextField({ name, label, hint, defaultValue, type = "text", required, step, autoComplete }: FieldProps & { defaultValue?: string | number | null; type?: string; required?: boolean; step?: string; autoComplete?: string }) {
  return <Wrapper name={name} label={label} hint={hint}><input id={name} name={name} type={type} step={step} required={required} autoComplete={autoComplete} defaultValue={defaultValue ?? ""} className={cn(inputClass, "[color-scheme:dark]")} /></Wrapper>;
}

export function TextAreaField({ name, label, hint, defaultValue, rows = 4 }: FieldProps & { defaultValue?: string | null; rows?: number }) {
  return <Wrapper name={name} label={label} hint={hint}><textarea id={name} name={name} rows={rows} defaultValue={defaultValue ?? ""} className={inputClass} /></Wrapper>;
}

export function SelectField({ name, label, hint, defaultValue, options }: FieldProps & { defaultValue?: string | null; options: { value: string; label: string }[] }) {
  return (
    <Wrapper name={name} label={label} hint={hint}>
      <select id={name} name={name} defaultValue={defaultValue ?? ""} className={inputClass}>
        {options.map((option) => <option key={option.value} value={option.value} className="text-abyss">{option.label}</option>)}
      </select>
    </Wrapper>
  );
}

export function CheckField({ name, label, defaultChecked }: { name: string; label: string; defaultChecked?: boolean }) {
  return <label className="flex items-center gap-2.5 text-sm"><input type="checkbox" name={name} defaultChecked={defaultChecked} className="size-4 accent-cyan" />{label}</label>;
}

async function uploadImage(folder: string, file: File) {
  const ticket = await requestImageUpload({ folder, name: file.name, type: file.type, size: file.size });
  if ("error" in ticket) throw new Error(ticket.error);
  const response = await fetch(ticket.signedUrl, { method: "PUT", body: file, headers: { "Content-Type": file.type } });
  if (!response.ok) throw new Error("The upload failed. Please try again.");
  return ticket.publicUrl;
}

export function ImageField({ name, label, folder, defaultValue }: { name: string; label: string; folder: "services" | "portfolio" | "team"; defaultValue?: string | null }) {
  const [url, setUrl] = useState(defaultValue ?? "");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function onFile(file?: File) {
    if (!file) return;
    setBusy(true);
    setError("");
    try {
      setUrl(await uploadImage(folder, file));
    } catch (problem) {
      setError(problem instanceof Error ? problem.message : "The upload failed.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div>
      <p className="text-sm font-medium">{label}</p>
      <input type="hidden" name={name} value={url} />
      <div className="mt-1.5 flex flex-wrap items-center gap-3">
        {url && <Image src={url} alt="" width={120} height={80} unoptimized className="h-20 w-30 rounded-lg border border-aqua/20 object-cover" />}
        <label className={cn(buttonVariants({ variant: "outline" }), "cursor-pointer")}>
          {busy ? <LoaderCircle className="size-4 animate-spin" aria-hidden /> : <Upload className="size-4" aria-hidden />}
          {url ? "Replace image" : "Upload image"}
          <input type="file" accept="image/jpeg,image/png,image/webp" className="sr-only" disabled={busy} onChange={(event) => onFile(event.target.files?.[0])} />
        </label>
        {url && <button type="button" onClick={() => setUrl("")} className="text-sm text-mist hover:text-white">Remove</button>}
      </div>
      <p className="mt-1 text-xs text-mist">JPG, PNG or WebP, up to 8 MB.</p>
      {error && <p role="alert" className="mt-1 text-sm text-red-300">{error}</p>}
    </div>
  );
}

export function GalleryUpload({ projectId }: { projectId: string }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function onFiles(files: FileList | null) {
    if (!files?.length) return;
    setBusy(true);
    setError("");
    try {
      for (const file of Array.from(files)) await addGalleryImage(projectId, await uploadImage("portfolio", file));
      router.refresh();
    } catch (problem) {
      setError(problem instanceof Error ? problem.message : "The upload failed.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div>
      <label className={cn(buttonVariants({ variant: "outline" }), "cursor-pointer")}>
        {busy ? <LoaderCircle className="size-4 animate-spin" aria-hidden /> : <Upload className="size-4" aria-hidden />}Add gallery images
        <input type="file" multiple accept="image/jpeg,image/png,image/webp" className="sr-only" disabled={busy} onChange={(event) => onFiles(event.target.files)} />
      </label>
      {error && <p role="alert" className="mt-2 text-sm text-red-300">{error}</p>}
    </div>
  );
}

// A small one-click action with optional confirmation, used for delete, approve and reject.
export function ActionButton({ action, fields, label, confirm, tone = "default" }: { action: Action; fields: Record<string, string>; label: string; confirm?: string; tone?: "default" | "danger" }) {
  const [state, dispatch, pending] = useActionState<FormState, FormData>(action, {});

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (confirm && !window.confirm(confirm)) return;
    const data = new FormData(event.currentTarget);
    startTransition(() => dispatch(data));
  }

  return (
    <form onSubmit={handleSubmit} className="inline-flex flex-col">
      {Object.entries(fields).map(([name, value]) => <input key={name} type="hidden" name={name} value={value} />)}
      <button type="submit" disabled={pending} className={cn("inline-flex items-center gap-1.5 text-sm font-medium disabled:opacity-50", tone === "danger" ? "text-red-300 hover:text-red-200" : "text-aqua hover:underline")}>
        {tone === "danger" && <Trash2 className="size-3.5" aria-hidden />}{label}
      </button>
      {state.message && !state.ok && <span role="alert" className="mt-1 max-w-xs text-xs text-amber-200">{state.message}</span>}
    </form>
  );
}
