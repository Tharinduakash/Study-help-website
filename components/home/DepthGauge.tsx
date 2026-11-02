"use client";

import { useRef } from "react";
import { motion, useMotionValueEvent, useScroll } from "framer-motion";

const MAX_DEPTH = 1000;

// The homepage's signature detail: scrolling reads as a descent into the ocean.
export function DepthGauge() {
  const { scrollYProgress } = useScroll();
  const label = useRef<HTMLSpanElement>(null);

  useMotionValueEvent(scrollYProgress, "change", (progress) => {
    if (label.current) label.current.textContent = `${Math.round(progress * MAX_DEPTH)} m`;
  });

  return (
    <div aria-hidden className="pointer-events-none fixed top-1/2 right-5 z-30 hidden h-56 -translate-y-1/2 flex-col items-center gap-3 xl:flex">
      <div className="relative w-px flex-1 bg-aqua/20">
        <motion.div className="absolute inset-x-0 top-0 h-full origin-top bg-cyan" style={{ scaleY: scrollYProgress }} />
      </div>
      <span ref={label} className="font-display text-[11px] tabular-nums text-aqua mix-blend-difference">0 m</span>
    </div>
  );
}
