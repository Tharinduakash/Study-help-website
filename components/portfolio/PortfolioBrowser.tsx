"use client";

import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Search, X } from "lucide-react";
import { portfolioCategories, type PortfolioProject } from "@/lib/content/portfolio";
import { cn } from "@/lib/utils";
import { ProjectCard } from "./ProjectCard";

// Picks which cards span two columns so the three-column grid always finishes level.
function wideCards(total: number) {
  if (total < 4) return new Set<number>();
  const needed = [3, 2, 1][total % 3];
  return new Set(needed === 1 ? [0] : needed === 2 ? [0, total - 1] : [0, 3, total - 1]);
}

export function PortfolioBrowser({ projects }: { projects: PortfolioProject[] }) {
  const [category, setCategory] = useState("All");
  const [query, setQuery] = useState("");

  const visible = useMemo(() => {
    const term = query.trim().toLowerCase();
    return projects.filter((project) => {
      const matchesCategory = category === "All" || project.category === category;
      const haystack = [project.title, project.summary, project.category, ...project.tags].join(" ").toLowerCase();
      return matchesCategory && haystack.includes(term);
    });
  }, [projects, category, query]);

  const wide = wideCards(visible.length);
  const countFor = (name: string) => (name === "All" ? projects.length : projects.filter((project) => project.category === name).length);

  return (
    <>
      <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative w-full max-w-xl">
          <Search className="pointer-events-none absolute top-1/2 left-5 z-10 size-5 -translate-y-1/2 text-aqua" aria-hidden />
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search projects or technologies"
            aria-label="Search projects"
            className="glass h-14 w-full rounded-full pr-14 pl-13 text-base text-white placeholder:text-mist/70 focus:border-cyan focus:outline-none [&::-webkit-search-cancel-button]:hidden"
          />
          {query && (
            <button type="button" aria-label="Clear search" onClick={() => setQuery("")} className="absolute top-1/2 right-2 grid size-11 -translate-y-1/2 place-items-center rounded-full text-mist hover:text-white">
              <X className="size-5" aria-hidden />
            </button>
          )}
        </div>
        <p aria-live="polite" className="shrink-0 text-sm text-mist"><span className="font-display text-lg font-bold text-white">{visible.length}</span> {visible.length === 1 ? "project" : "projects"}</p>
      </div>

      <div className="no-scrollbar -mx-4 mb-8 flex gap-1.5 overflow-x-auto px-4 sm:-mx-6 sm:px-6 md:mx-0 md:mb-10 md:flex-wrap md:rounded-3xl md:border md:border-aqua/12 md:bg-white/3 md:p-2">
        {["All", ...portfolioCategories].map((name) => {
          const selected = category === name;
          return (
            <button
              key={name}
              type="button"
              aria-pressed={selected}
              onClick={() => setCategory(name)}
              className={cn("relative min-h-11 shrink-0 rounded-full px-4 text-sm whitespace-nowrap transition-colors", selected ? "font-semibold text-abyss" : "text-mist hover:text-white")}
            >
              {selected && <motion.span layoutId="portfolio-filter" aria-hidden className="absolute inset-0 rounded-full bg-linear-to-r from-cyan to-aqua" transition={{ type: "spring", stiffness: 340, damping: 32 }} />}
              <span className="relative">{name}<span className={cn("ml-1.5 text-xs", selected ? "text-abyss/70" : "text-mist/60")}>{countFor(name)}</span></span>
            </button>
          );
        })}
      </div>

      <motion.div layout className="grid gap-5 sm:grid-cols-2 lg:auto-rows-[26rem] lg:grid-cols-3">
        <AnimatePresence mode="popLayout">
          {visible.map((project, index) => (
            <motion.div
              key={project.slug}
              layout
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              transition={{ duration: 0.28 }}
              className={cn(wide.has(index) && "lg:col-span-2", index === visible.length - 1 && visible.length % 2 === 1 && "sm:col-span-2 lg:col-span-1", index === visible.length - 1 && wide.has(index) && "lg:col-span-2")}
            >
              <ProjectCard project={project} />
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>
      {visible.length === 0 && (
        <div className="glass rounded-3xl p-10 text-center">
          <p className="font-display text-xl font-semibold">No projects match your search.</p>
          <button type="button" onClick={() => { setQuery(""); setCategory("All"); }} className="mt-3 min-h-11 font-semibold text-aqua hover:underline">Show all projects</button>
        </div>
      )}
    </>
  );
}
