"use client";

import { motion } from "framer-motion";
import { ArrowDown } from "lucide-react";
import { ButtonLink } from "@/components/ui/button";
import { OceanCanvas } from "./OceanCanvas";

const ease = [0.22, 1, 0.36, 1] as const;
const rays = [
  { left: "12%", width: "9rem", angle: "13deg", delay: "0s" },
  { left: "36%", width: "14rem", angle: "6deg", delay: "-4s" },
  { left: "60%", width: "8rem", angle: "-5deg", delay: "-8s" },
  { left: "78%", width: "12rem", angle: "-13deg", delay: "-2s" },
];

export function Hero({ headline, text }: { headline: string; text: string }) {
  return (
    <section className="relative flex min-h-svh items-center overflow-hidden bg-[linear-gradient(180deg,#0b5e96_0%,#092b4c_38%,#061426_100%)] px-4 pt-24 pb-20 sm:px-6">
      <div aria-hidden className="absolute inset-0">
        {rays.map((ray) => (
          <span key={ray.left} className="light-ray" style={{ left: ray.left, width: ray.width, animationDelay: ray.delay, "--ray-angle": ray.angle } as React.CSSProperties} />
        ))}
      </div>
      <OceanCanvas />
      <div className="relative mx-auto w-full max-w-6xl">
        <motion.p initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, ease }} className="mb-6 text-xs font-bold uppercase tracking-[0.26em] text-aqua">
          Academic · Technology · Creative
        </motion.p>
        <h1 className="max-w-4xl font-display text-[2.75rem] leading-[1.05] font-bold tracking-tight sm:text-6xl md:text-7xl lg:text-[5.5rem]">
          {headline.split(" ").map((word, index) => (
            <span key={index}><span className="inline-block overflow-hidden pb-[0.08em] align-bottom">
              <motion.span className="inline-block" initial={{ y: "110%" }} animate={{ y: 0 }} transition={{ duration: 0.85, delay: 0.1 + index * 0.07, ease }}>
                {word}
              </motion.span>
            </span>{" "}</span>
          ))}
        </h1>
        <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.65, ease }}>
          {text && <p className="mt-7 max-w-xl text-lg leading-relaxed text-mist sm:text-xl">{text}</p>}
          <div className="mt-9 flex flex-col gap-3 sm:flex-row">
            <ButtonLink href="/services" size="lg">Explore Our Services</ButtonLink>
            <ButtonLink href="/portfolio" size="lg" variant="outline" className="bg-abyss/55 backdrop-blur-sm">Discover Our Work</ButtonLink>
          </div>
        </motion.div>
      </div>
      <a href="#services" aria-label="Scroll to services" className="absolute bottom-6 left-1/2 hidden -translate-x-1/2 text-aqua/80 sm:block"><ArrowDown className="size-5 motion-safe:animate-bounce" aria-hidden /></a>
    </section>
  );
}
