"use client";

import { useEffect, useState, type PointerEvent } from "react";
import { motion } from "framer-motion";
import { Target, Telescope } from "lucide-react";
import { cn } from "@/lib/utils";

const rotateEvery = 6;

// Two panels that take turns in focus. They rotate on their own until the visitor
// interacts, and stay put for anyone who prefers reduced motion.
export function MissionVision({ mission, vision }: { mission: string; vision: string }) {
  const panels = [
    { title: "Our mission", label: "What we do today", text: mission, icon: Target },
    { title: "Our vision", label: "Where we are heading", text: vision, icon: Telescope },
  ];
  const [active, setActive] = useState(0);
  const [autoplay, setAutoplay] = useState(true);

  useEffect(() => {
    if (!autoplay || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const timer = window.setInterval(() => setActive((current) => (current + 1) % panels.length), rotateEvery * 1000);
    return () => window.clearInterval(timer);
  }, [autoplay, panels.length]);

  const choose = (index: number) => {
    setAutoplay(false);
    setActive(index);
  };

  const moveGlow = (event: PointerEvent<HTMLElement>) => {
    const box = event.currentTarget.getBoundingClientRect();
    event.currentTarget.style.setProperty("--glow-x", `${event.clientX - box.left}px`);
    event.currentTarget.style.setProperty("--glow-y", `${event.clientY - box.top}px`);
  };

  return (
    <div className="flex flex-col gap-4 md:flex-row md:gap-6">
      {panels.map(({ title, label, text, icon: Icon }, index) => {
        const isActive = active === index;
        return (
          <article
            key={title}
            onPointerEnter={(event) => event.pointerType === "mouse" && choose(index)}
            onPointerMove={moveGlow}
            style={{ flexGrow: isActive ? 1.55 : 1 }}
            className={cn(
              "group relative min-h-64 overflow-hidden md:basis-0 rounded-3xl border p-7 transition-[flex-grow,border-color,background-color,box-shadow] duration-500 md:min-h-80 md:p-9",
              isActive ? "border-cyan/60 bg-deep/80 shadow-[0_0_50px_-18px_var(--color-cyan)]" : "border-aqua/15 bg-white/3",
            )}
          >
            <div aria-hidden className={cn("pointer-events-none absolute inset-0 transition-opacity duration-500", isActive ? "opacity-100" : "opacity-0")} style={{ background: "radial-gradient(340px circle at var(--glow-x, 75%) var(--glow-y, 20%), rgb(39 197 245 / 0.2), transparent 70%)" }} />
            <Icon aria-hidden className={cn("pointer-events-none absolute -right-8 -bottom-8 size-52 transition-all duration-700", isActive ? "rotate-0 text-cyan/15" : "-rotate-12 text-aqua/5")} strokeWidth={1} />

            <div className="relative flex h-full flex-col">
              <span className="relative grid size-13 shrink-0 place-items-center rounded-2xl bg-cyan/12 text-aqua">
                {isActive && <span aria-hidden className="absolute inset-0 rounded-2xl border border-cyan/60 motion-safe:animate-ping" />}
                <Icon className="size-6" aria-hidden />
              </span>
              <p className="mt-6 text-xs font-bold tracking-[0.18em] text-aqua uppercase">{label}</p>
              <h2 className="mt-2 font-display text-2xl font-bold md:text-3xl">
                {/* The stretched hit area makes the whole panel clickable and keyboard reachable. */}
                <button type="button" aria-pressed={isActive} onClick={() => choose(index)} onFocus={() => choose(index)} className="text-left after:absolute after:inset-0 after:content-['']">
                  {title}
                </button>
              </h2>
              <p className={cn("mt-3 max-w-xl leading-relaxed transition-colors duration-500", isActive ? "text-lg text-white" : "text-mist")}>{text}</p>
            </div>

            {isActive && autoplay && (
              <motion.span
                key={active}
                aria-hidden
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: rotateEvery, ease: "linear" }}
                className="absolute inset-x-0 bottom-0 h-0.5 origin-left bg-linear-to-r from-cyan to-aqua motion-reduce:hidden"
              />
            )}
          </article>
        );
      })}
    </div>
  );
}
