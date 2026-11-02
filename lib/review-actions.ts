"use server";

import { z } from "zod";
import { db } from "@/db";
import { testimonials } from "@/db/schema";
import { invalid, type FormState } from "@/lib/form-state";
import { clientKey, consumeRateLimit } from "@/lib/rate-limit";

const reviewSchema = z.object({
  name: z.string().trim().min(2, "Enter the name to display").max(120),
  service: z.string().trim().min(2, "Tell us which service you used").max(120),
  rating: z.coerce.number("Choose a rating").int().min(1, "Choose a rating").max(5),
  quote: z.string().trim().min(20, "Please write a little more").max(1000),
  consent: z.literal("on", "Please confirm we may publish your review"),
});

// Reviews always start as pending, so nothing appears publicly until an admin approves it.
export async function submitReview(_previous: FormState, formData: FormData): Promise<FormState> {
  if (formData.get("website")) return { message: "We could not process your review." };

  const parsed = reviewSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return invalid(parsed.error);

  if (!(await consumeRateLimit(`review:${await clientKey()}`, 3, 3600))) return { message: "Too many reviews. Please try again later." };

  const { name, service, rating, quote } = parsed.data;
  await db.insert(testimonials).values({ name, service, rating, quote, status: "pending" });
  return { ok: true, message: "Thank you. Your review will appear once our team has approved it." };
}
