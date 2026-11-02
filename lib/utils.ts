import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function isUuid(value: string) {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(value);
}

export function slugify(value: string) {
  return value.toLowerCase().normalize("NFKD").replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 100);
}

// Returns a privacy-friendly embed address for YouTube links, or null for any other host.
export function youtubeEmbedUrl(url: string) {
  try {
    const parsed = new URL(url);
    const host = parsed.hostname.replace(/^www[.]/, "");
    const id = host === "youtu.be" ? parsed.pathname.slice(1) : host === "youtube.com" ? parsed.searchParams.get("v") : null;
    return id && /^[A-Za-z0-9_-]+$/.test(id) ? `https://www.youtube-nocookie.com/embed/${id}` : null;
  } catch {
    return null;
  }
}

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
