"use client";

import { useRef } from "react";
import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";

// The photo drifts slower than the page, giving the section depth. Scroll-linked styles
// ignore the global motion setting, so reduced motion is handled with CSS instead.
export function ParallaxImage({ src, className }: { src: string; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], ["-7%", "7%"]);

  return (
    <div ref={ref} className={className}>
      <motion.div style={{ y }} className="absolute -inset-y-[9%] inset-x-0 motion-reduce:transform-none!">
        <Image src={src} alt="" fill sizes="(min-width: 1024px) 50vw, 100vw" className="object-cover" />
      </motion.div>
    </div>
  );
}
