"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Star, X } from "lucide-react";
import { ReviewForm } from "@/components/forms/ReviewForm";
import { Reveal, RevealHeading } from "@/components/shared/Reveal";
import { buttonVariants } from "@/components/ui/button";
import type { Testimonial } from "@/lib/content/general";
import { TestimonialCarousel } from "./TestimonialCarousel";

// The form replaces the carousel in place, so the section never grows to a full page.
// With nothing approved yet, the form fills that space instead of leaving it empty.
export function ReviewsSection({ items, services }: { items: Testimonial[]; services: string[] }) {
  const [writing, setWriting] = useState(false);
  const showForm = writing || items.length === 0;
  const average = items.length ? items.reduce((sum, item) => sum + item.rating, 0) / items.length : 0;

  return (
    <section id="reviews" className="scroll-mt-20 bg-abyss px-4 py-14 text-white sm:px-6 sm:py-20 lg:py-24">
      <div className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-[1fr_1.6fr] lg:gap-16">
        <Reveal effect="left" className="lg:self-center">
          <p className="mb-3 text-xs font-bold tracking-[0.22em] text-aqua uppercase">Reviews</p>
          <RevealHeading text="What our customers say." className="font-display text-3xl font-bold tracking-tight sm:text-4xl md:text-[2.75rem] md:leading-[1.12]" delay={0.1} />
          {items.length > 0 ? (
            <div className="mt-5 flex items-center gap-3">
              <span className="font-display text-4xl font-bold">{average.toFixed(1)}</span>
              <div>
                <div role="img" aria-label={`Average ${average.toFixed(1)} out of 5`} className="flex gap-0.5">
                  {Array.from({ length: 5 }, (_, star) => <Star key={star} aria-hidden className={star < Math.round(average) ? "size-4 fill-amber-300 text-amber-300" : "size-4 text-aqua/25"} />)}
                </div>
                <p className="mt-1 text-sm text-mist">from {items.length} {items.length === 1 ? "review" : "reviews"}</p>
              </div>
            </div>
          ) : (
            <p className="mt-4 text-lg leading-relaxed text-mist">Worked with us? Rate us and share your feedback. Your review helps other students choose with confidence.</p>
          )}
          {!showForm && <button type="button" onClick={() => setWriting(true)} className={buttonVariants({ className: "mt-7" })}>Write a review</button>}
        </Reveal>

        <AnimatePresence mode="wait" initial={false}>
          {showForm ? (
            <motion.div key="form" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} transition={{ duration: 0.25 }} className="glass relative rounded-3xl p-5 sm:p-6">
              {items.length > 0 && <button type="button" aria-label="Close review form" onClick={() => setWriting(false)} className="absolute top-3 right-3 grid size-8 place-items-center rounded-full text-mist hover:bg-white/5 hover:text-white"><X className="size-4" aria-hidden /></button>}
              <ReviewForm services={services} />
            </motion.div>
          ) : (
            <motion.div key="carousel" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}>
              <TestimonialCarousel items={items} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
