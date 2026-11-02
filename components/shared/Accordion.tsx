"use client";

import { useId, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Plus } from "lucide-react";
import type { Faq } from "@/lib/content/services";
import { cn } from "@/lib/utils";

export function Accordion({ items, light = false }: { items: Faq[]; light?: boolean }) {
  const [open, setOpen] = useState<number | null>(0);
  const baseId = useId();

  return (
    <div className={cn("divide-y border-y", light ? "divide-deep/15 border-deep/15" : "divide-aqua/15 border-aqua/15")}>
      {items.map((item, index) => {
        const isOpen = open === index;
        const panelId = `${baseId}-${index}`;
        return (
          <div key={item.question}>
            <h3>
              <button
                type="button"
                aria-expanded={isOpen}
                aria-controls={panelId}
                onClick={() => setOpen(isOpen ? null : index)}
                className="flex w-full items-center justify-between gap-6 py-5 text-left font-display text-base font-medium sm:text-lg"
              >
                {item.question}
                <Plus className={cn("size-5 shrink-0 transition-transform duration-300", light ? "text-ocean" : "text-aqua", isOpen && "rotate-45")} aria-hidden />
              </button>
            </h3>
            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div
                  id={panelId}
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.28 }}
                  className="overflow-hidden"
                >
                  <p className={cn("max-w-2xl pb-6 leading-relaxed", light ? "text-deep/75" : "text-mist")}>{item.answer}</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}
