"use client";

import { startTransition, useActionState, type FormEvent } from "react";
import { CheckCircle2, LoaderCircle } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import type { FormState } from "@/lib/form-state";
import { submitReview } from "@/lib/review-actions";

const fieldClass = "mt-1.5 w-full rounded-xl border border-aqua/20 bg-white/5 px-4 py-3 text-white focus:border-cyan focus:outline-none";

export function ReviewForm({ services }: { services: string[] }) {
  const [state, action, pending] = useActionState<FormState, FormData>(submitReview, {});
  const error = (name: string) => state.errors?.[name] && <p role="alert" className="mt-1.5 text-sm text-red-300">{state.errors[name]}</p>;

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    startTransition(() => action(data));
  }

  if (state.ok) {
    return (
      <div role="status" className="glass rounded-2xl p-8 text-center">
        <CheckCircle2 className="mx-auto size-10 text-aqua" aria-hidden />
        <p className="mt-4 text-lg">{state.message}</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-5">
      <div aria-hidden className="absolute -left-[9999px]"><label>Leave this field empty<input name="website" tabIndex={-1} autoComplete="off" /></label></div>
      <div className="grid gap-5 sm:grid-cols-2">
        <div><label htmlFor="review-name" className="text-sm font-medium">Display name</label><input id="review-name" name="name" className={fieldClass} />{error("name")}</div>
        <div>
          <label htmlFor="review-service" className="text-sm font-medium">Service used</label>
          <select id="review-service" name="service" defaultValue="" className={fieldClass}>
            <option value="" className="text-abyss">Select a service</option>
            {services.map((service) => <option key={service} className="text-abyss">{service}</option>)}
          </select>
          {error("service")}
        </div>
      </div>
      <div>
        <label htmlFor="review-rating" className="text-sm font-medium">Rating</label>
        <select id="review-rating" name="rating" defaultValue="" className={fieldClass}>
          <option value="" className="text-abyss">Choose a rating</option>
          {[5, 4, 3, 2, 1].map((rating) => <option key={rating} value={rating} className="text-abyss">{rating} out of 5</option>)}
        </select>
        {error("rating")}
      </div>
      <div><label htmlFor="review-quote" className="text-sm font-medium">Your review</label><textarea id="review-quote" name="quote" rows={5} className={fieldClass} />{error("quote")}</div>
      <div>
        <label className="flex gap-3 text-sm text-mist"><input type="checkbox" name="consent" className="mt-0.5 size-4 accent-cyan" />I agree that Study Help may publish this review with my display name.</label>
        {error("consent")}
      </div>
      {state.message && <p role="alert" className="text-sm text-amber-100">{state.message}</p>}
      <button type="submit" disabled={pending} className={buttonVariants({ size: "lg" })}>
        {pending && <LoaderCircle className="size-4 animate-spin" aria-hidden />}Submit Review
      </button>
    </form>
  );
}
