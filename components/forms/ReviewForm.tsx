"use client";

import { startTransition, useActionState, useState, type FormEvent } from "react";
import { CheckCircle2, LoaderCircle, Star } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { FormState } from "@/lib/form-state";
import { submitReview } from "@/lib/review-actions";
import { cn } from "@/lib/utils";

const ratingLabels = ["Poor", "Fair", "Good", "Very good", "Excellent"];

// Native radios keep keyboard and screen reader support; the stars are only their labels.
function StarRating({ name }: { name: string }) {
  const [value, setValue] = useState(0);
  const [hover, setHover] = useState(0);
  const shown = hover || value;
  return (
    <div className="flex flex-wrap items-center gap-2">
      <div className="-ml-1 flex" onMouseLeave={() => setHover(0)}>
        {ratingLabels.map((label, index) => {
          const rating = index + 1;
          return (
            <label key={rating} onMouseEnter={() => setHover(rating)} className="cursor-pointer p-0.5 has-[:focus-visible]:rounded-md has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-cyan">
              <input type="radio" name={name} value={rating} checked={value === rating} onChange={() => setValue(rating)} className="sr-only" />
              <span className="sr-only">{rating} out of 5, {label}</span>
              <Star aria-hidden className={cn("size-6 transition duration-150 sm:size-7", rating <= shown ? "fill-amber-300 text-amber-300" : "text-aqua/30", rating === hover && "scale-110")} />
            </label>
          );
        })}
      </div>
      <span aria-hidden className="text-xs text-mist">{shown ? `${shown}/5 · ${ratingLabels[shown - 1]}` : "Tap a star"}</span>
    </div>
  );
}

const fieldClass = "mt-1 w-full rounded-lg border border-aqua/20 bg-white/5 px-3.5 py-2.5 text-sm text-white focus:border-cyan focus:outline-none";
const labelClass = "text-xs font-medium text-mist";

export function ReviewForm({ services }: { services: string[] }) {
  const [state, action, pending] = useActionState<FormState, FormData>(submitReview, {});
  const error = (name: string) => state.errors?.[name] && <p role="alert" className="mt-1 text-xs text-red-300">{state.errors[name]}</p>;

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    startTransition(() => action(data));
  }

  if (state.ok) {
    return (
      <div role="status" className="py-6 text-center">
        <CheckCircle2 className="mx-auto size-9 text-aqua" aria-hidden />
        <p className="mt-3">{state.message}</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-3.5">
      <div aria-hidden className="absolute -left-[9999px]"><label>Leave this field empty<input name="website" tabIndex={-1} autoComplete="off" /></label></div>
      <fieldset>
        <legend className={cn(labelClass, "mb-1")}>Your rating</legend>
        <StarRating name="rating" />
        {error("rating")}
      </fieldset>
      <div className="grid gap-3.5 sm:grid-cols-2">
        <div><label htmlFor="review-name" className={labelClass}>Display name</label><input id="review-name" name="name" className={fieldClass} />{error("name")}</div>
        <div>
          <label htmlFor="review-service" className={labelClass}>Service used</label>
          <Select name="service">
            <SelectTrigger id="review-service" className="mt-1 rounded-lg px-3.5 py-2.5 text-sm"><SelectValue placeholder="Select a service" /></SelectTrigger>
            <SelectContent>
              {services.map((service) => <SelectItem key={service} value={service}>{service}</SelectItem>)}
            </SelectContent>
          </Select>
          {error("service")}
        </div>
      </div>
      <div><label htmlFor="review-quote" className={labelClass}>Your feedback</label><textarea id="review-quote" name="quote" rows={3} placeholder="What did we do well, and what could we do better?" className={cn(fieldClass, "resize-none placeholder:text-mist/50")} />{error("quote")}</div>
      {state.message && <p role="alert" className="text-xs text-amber-100">{state.message}</p>}
      <div className="flex flex-col gap-3 pt-1 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <label className="flex gap-2.5 text-xs leading-relaxed text-mist"><input type="checkbox" name="consent" className="mt-0.5 size-3.5 shrink-0 accent-cyan" />I agree Study Help may publish this review with my name.</label>
          {error("consent")}
        </div>
        <button type="submit" disabled={pending} className={cn(buttonVariants(), "h-10 shrink-0 px-5")}>
          {pending && <LoaderCircle className="size-4 animate-spin" aria-hidden />}Submit Review
        </button>
      </div>
    </form>
  );
}
