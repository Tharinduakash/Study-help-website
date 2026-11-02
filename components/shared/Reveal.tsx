"use client";

import type { ReactNode } from "react";
import { motion } from "framer-motion";

const ease = [0.22, 1, 0.36, 1] as const;
const effects = {
  up: { opacity: 0, y: 24 },
  left: { opacity: 0, x: -48 },
  right: { opacity: 0, x: 48 },
  scale: { opacity: 0, y: 32, scale: 0.94 },
  blur: { opacity: 0, y: 16, filter: "blur(10px)" },
};

export type RevealEffect = keyof typeof effects;

export function Reveal({ children, delay = 0, className, effect = "up" }: { children: ReactNode; delay?: number; className?: string; effect?: RevealEffect }) {
  return (
    <motion.div
      className={className}
      initial={effects[effect]}
      whileInView={{ opacity: 1, x: 0, y: 0, scale: 1, filter: "blur(0px)" }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.7, delay, ease }}
    >
      {children}
    </motion.div>
  );
}

// Headings rise word by word from behind a mask, matching the homepage hero.
export function RevealHeading({ text, className, as: Tag = "h2", delay = 0 }: { text: string; className?: string; as?: "h2" | "h3"; delay?: number }) {
  const MotionTag = motion[Tag];
  return (
    <MotionTag className={className} initial="hidden" whileInView="shown" viewport={{ once: true, margin: "-60px" }} transition={{ staggerChildren: 0.06, delayChildren: delay }}>
      {text.split(" ").map((word, index) => (
        <span key={index}>
          <span className="inline-block overflow-hidden pb-[0.1em] align-bottom">
            <motion.span className="inline-block" variants={{ hidden: { y: "105%" }, shown: { y: 0 } }} transition={{ duration: 0.75, ease }}>{word}</motion.span>
          </span>{" "}
        </span>
      ))}
    </MotionTag>
  );
}
