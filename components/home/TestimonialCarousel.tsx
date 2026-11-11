"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight, Quote, Star } from "lucide-react";
import type { Testimonial } from "@/lib/content/general";

export function TestimonialCarousel({ items }: { items: Testimonial[] }) {
  const [index, setIndex] = useState(0);
  const item = items[index];
  const move = (step: number) => setIndex((index + step + items.length) % items.length);

  return (
    <div className="glass relative overflow-hidden rounded-3xl p-6 sm:p-8">
      <Quote aria-hidden className="absolute top-5 right-6 size-14 rotate-180 text-aqua/10 sm:size-16" />
      <AnimatePresence mode="wait">
        <motion.figure key={index} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.3 }}>
          <div className="flex gap-0.5" aria-label={`Rated ${item.rating} out of 5`} role="img">
            {Array.from({ length: 5 }, (_, star) => <Star key={star} className={star < item.rating ? "size-4 fill-amber-300 text-amber-300" : "size-4 text-aqua/25"} aria-hidden />)}
          </div>
          <blockquote className="mt-4 line-clamp-6 text-base leading-relaxed break-words text-white/90 sm:text-lg">&ldquo;{item.quote}&rdquo;</blockquote>
          <figcaption className="mt-6 flex items-center gap-3">
            <span aria-hidden className="grid size-10 shrink-0 place-items-center rounded-full bg-gradient-to-br from-cyan to-aqua font-display font-bold text-abyss uppercase">{item.name.charAt(0)}</span>
            <span className="min-w-0 text-sm leading-tight">
              <strong className="block truncate text-white">{item.name}</strong>
              <span className="block truncate text-mist">{item.service}</span>
            </span>
          </figcaption>
        </motion.figure>
      </AnimatePresence>
      {items.length > 1 && (
        <div className="mt-6 flex items-center justify-between border-t border-aqua/10 pt-5">
          <span className="text-sm text-mist" aria-live="polite">{index + 1} / {items.length}</span>
          <div className="flex gap-2">
            <button type="button" aria-label="Previous review" onClick={() => move(-1)} className="grid size-9 place-items-center rounded-full border border-aqua/30 transition-colors hover:border-aqua hover:bg-aqua/10"><ChevronLeft className="size-4" aria-hidden /></button>
            <button type="button" aria-label="Next review" onClick={() => move(1)} className="grid size-9 place-items-center rounded-full border border-aqua/30 transition-colors hover:border-aqua hover:bg-aqua/10"><ChevronRight className="size-4" aria-hidden /></button>
          </div>
        </div>
      )}
    </div>
  );
}
