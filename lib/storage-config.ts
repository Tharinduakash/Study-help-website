export const PRIVATE_BUCKET = "inquiry-files";
export const MEDIA_BUCKET = "site-media";
export const MAX_IMAGE_SIZE = 8 * 1024 * 1024;
// SVG is excluded on purpose: it can carry scripts.
export const IMAGE_MIME_TYPES = ["image/jpeg", "image/png", "image/webp"] as const;
