"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight, Star } from "lucide-react";
import type { Testimonial } from "@/lib/content/general";

export function TestimonialCarousel({ items }: { items: Testimonial[] }) {
  const [index, setIndex] = useState(0);
  const item = items[index];
  const move = (step: number) => setIndex((index + step + items.length) % items.length);

  return (
    <div className="glass mx-auto max-w-3xl rounded-3xl p-8 md:p-12">
      <AnimatePresence mode="wait">
        <motion.figure key={index} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.3 }}>
          <div className="flex gap-1 text-aqua" aria-label={`Rated ${item.rating} out of 5`} role="img">
            {Array.from({ length: item.rating }, (_, star) => <Star key={star} className="size-4 fill-current" aria-hidden />)}
          </div>
          <blockquote className="mt-5 font-display text-xl leading-relaxed md:text-2xl">{item.quote}</blockquote>
          <figcaption className="mt-6 text-sm text-mist"><strong className="text-white">{item.name}</strong> · {item.service}</figcaption>
        </motion.figure>
      </AnimatePresence>
      {items.length > 1 && (
        <div className="mt-7 flex gap-2">
          <button type="button" aria-label="Previous review" onClick={() => move(-1)} className="grid size-11 place-items-center rounded-full border border-aqua/30 hover:border-aqua"><ChevronLeft className="size-5" aria-hidden /></button>
          <button type="button" aria-label="Next review" onClick={() => move(1)} className="grid size-11 place-items-center rounded-full border border-aqua/30 hover:border-aqua"><ChevronRight className="size-5" aria-hidden /></button>
        </div>
      )}
    </div>
  );
}
