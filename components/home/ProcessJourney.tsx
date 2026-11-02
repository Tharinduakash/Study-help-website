"use client";

import { useRef } from "react";
import { motion, useScroll } from "framer-motion";

// The connecting line fills as the visitor scrolls through the steps.
export function ProcessJourney({ steps }: { steps: { title: string; text: string }[] }) {
  const ref = useRef<HTMLOListElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 80%", "end 55%"] });

  return (
    <ol ref={ref} className="relative grid gap-9 lg:grid-cols-4 lg:gap-8">
      <span aria-hidden className="absolute top-6 bottom-6 left-6 w-0.5 bg-deep/12 lg:top-6 lg:right-[12%] lg:bottom-auto lg:left-6 lg:h-0.5 lg:w-auto" />
      <motion.span aria-hidden style={{ scaleY: scrollYProgress }} className="absolute top-6 bottom-6 left-6 w-0.5 origin-top bg-ocean lg:hidden" />
      <motion.span aria-hidden style={{ scaleX: scrollYProgress }} className="absolute top-6 right-[12%] left-6 hidden h-0.5 origin-left bg-ocean lg:block" />
      {steps.map((step, index) => (
        <motion.li key={step.title} initial={{ opacity: 0, y: 28 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-60px" }} transition={{ duration: 0.6, delay: index * 0.14 }} className="relative flex gap-5 lg:block">
          <motion.span initial={{ scale: 0 }} whileInView={{ scale: 1 }} viewport={{ once: true, margin: "-60px" }} transition={{ type: "spring", stiffness: 260, damping: 16, delay: 0.1 + index * 0.14 }} className="relative grid size-12 shrink-0 place-items-center rounded-full bg-deep font-display font-bold text-white ring-6 ring-foam">{index + 1}</motion.span>
          <div className="lg:mt-5">
            <h3 className="font-display text-lg font-semibold">{step.title}</h3>
            <p className="mt-1.5 leading-relaxed text-deep/75">{step.text}</p>
          </div>
        </motion.li>
      ))}
    </ol>
  );
}
