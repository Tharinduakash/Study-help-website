"use client";

import type { PointerEvent } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, useMotionValue, useSpring } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import type { PortfolioProject } from "@/lib/content/portfolio";
import { ProjectCover } from "./ProjectCover";

export function SampleBadge() {
  return <span className="rounded-full bg-abyss/85 px-2.5 py-1 text-[11px] font-semibold text-aqua ring-1 ring-aqua/30">Sample concept</span>;
}

// Full-image card. With a mouse it tilts towards the pointer and reveals its details;
// touch screens have no hover, so they always show them.
export function ProjectCard({ project }: { project: PortfolioProject }) {
  const tiltX = useMotionValue(0);
  const tiltY = useMotionValue(0);
  const rotateX = useSpring(tiltX, { stiffness: 180, damping: 18 });
  const rotateY = useSpring(tiltY, { stiffness: 180, damping: 18 });

  function onMove(event: PointerEvent<HTMLElement>) {
    if (event.pointerType !== "mouse") return;
    const box = event.currentTarget.getBoundingClientRect();
    tiltY.set(((event.clientX - box.left) / box.width - 0.5) * 7);
    tiltX.set(((event.clientY - box.top) / box.height - 0.5) * -7);
    event.currentTarget.style.setProperty("--glow-x", `${event.clientX - box.left}px`);
    event.currentTarget.style.setProperty("--glow-y", `${event.clientY - box.top}px`);
  }

  function onLeave() {
    tiltX.set(0);
    tiltY.set(0);
  }

  return (
    <motion.div style={{ rotateX, rotateY, transformPerspective: 1100 }} onPointerMove={onMove} onPointerLeave={onLeave} className="group h-full">
      <Link href={`/portfolio/${project.slug}`} className="relative isolate flex h-full min-h-96 flex-col justify-end overflow-hidden rounded-3xl border border-aqua/15 bg-deep p-6 transition-[border-color,box-shadow] duration-300 hover:border-cyan/60 hover:shadow-[0_18px_50px_-22px_var(--color-cyan)]">
        <div className="absolute inset-0 -z-20 transition-transform duration-700 group-hover:scale-105 motion-reduce:transform-none">
          {project.coverImageUrl
            ? <Image src={project.coverImageUrl} alt="" fill sizes="(min-width: 1024px) 50vw, (min-width: 640px) 50vw, 100vw" className="object-cover" />
            : <div className="grid h-full place-items-center"><ProjectCover variant={project.cover} title={project.title} /></div>}
        </div>
        <div aria-hidden className="absolute inset-0 -z-10 bg-linear-to-t from-abyss from-10% via-abyss/80 via-30% to-transparent to-60%" />
        <div aria-hidden className="absolute inset-0 -z-10 bg-linear-to-t from-abyss from-30% via-abyss/70 via-60% to-transparent opacity-0 transition-opacity duration-300 group-focus-within:opacity-100 group-hover:opacity-100 [@media(hover:none)]:opacity-100" />
        <div aria-hidden className="pointer-events-none absolute inset-0 -z-10 opacity-0 transition-opacity duration-300 group-hover:opacity-100" style={{ background: "radial-gradient(320px circle at var(--glow-x, 50%) var(--glow-y, 50%), rgb(39 197 245 / 0.2), transparent 70%)" }} />

        {project.isSample && <div className="absolute top-4 left-4"><SampleBadge /></div>}
        <span aria-hidden className="absolute top-4 right-4 grid size-10 place-items-center rounded-full bg-abyss/70 text-aqua ring-1 ring-aqua/30 backdrop-blur transition duration-300 group-hover:bg-cyan group-hover:text-abyss">
          <ArrowUpRight className="size-5 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </span>

        <p className="text-xs font-bold tracking-[0.16em] text-aqua uppercase">{project.category}</p>
        <h3 className="mt-2 font-display text-xl font-bold text-white">{project.title}</h3>
        <div className="grid transition-[grid-template-rows,opacity] duration-300 [@media(hover:hover)]:grid-rows-[0fr] [@media(hover:hover)]:opacity-0 [@media(hover:hover)]:group-focus-within:grid-rows-[1fr] [@media(hover:hover)]:group-focus-within:opacity-100 [@media(hover:hover)]:group-hover:grid-rows-[1fr] [@media(hover:hover)]:group-hover:opacity-100">
          <div className="min-h-0 overflow-hidden">
            <p className="mt-2 text-sm leading-relaxed text-mist">{project.summary}</p>
            <ul className="mt-3 flex flex-wrap gap-1.5">
              {project.tags.map((tag) => <li key={tag} className="rounded-full border border-aqua/20 bg-abyss/50 px-2.5 py-1 text-xs text-mist">{tag}</li>)}
            </ul>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
