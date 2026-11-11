"use client";

import type { ComponentProps } from "react";
import { Select as SelectPrimitive } from "radix-ui";
import { Check, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

// shadcn/ui Select, restyled for the site theme. Passing `name` to Select submits the value with the form.
export const Select = SelectPrimitive.Root;
export const SelectValue = SelectPrimitive.Value;

export function SelectTrigger({ className, children, ...props }: ComponentProps<typeof SelectPrimitive.Trigger>) {
  return (
    <SelectPrimitive.Trigger
      className={cn(
        "flex w-full items-center justify-between gap-2 rounded-xl border border-aqua/20 bg-white/5 px-4 py-3 text-left text-white transition-colors hover:border-aqua/40 focus:border-cyan focus:outline-none disabled:cursor-not-allowed disabled:opacity-50 data-[placeholder]:text-mist/70 [&>span]:truncate",
        className,
      )}
      {...props}
    >
      {children}
      <SelectPrimitive.Icon asChild><ChevronDown className="size-4 shrink-0 text-mist transition-transform duration-200 [[data-state=open]>&]:rotate-180" aria-hidden /></SelectPrimitive.Icon>
    </SelectPrimitive.Trigger>
  );
}

export function SelectContent({ className, children, position = "popper", ...props }: ComponentProps<typeof SelectPrimitive.Content>) {
  return (
    <SelectPrimitive.Portal>
      <SelectPrimitive.Content
        position={position}
        sideOffset={6}
        className={cn(
          "relative z-50 max-h-(--radix-select-content-available-height) min-w-(--radix-select-trigger-width) overflow-hidden rounded-xl border border-aqua/20 bg-abyss/95 text-white shadow-[0_20px_50px_-12px_rgba(0,0,0,0.6)] backdrop-blur-xl",
          className,
        )}
        {...props}
      >
        <SelectPrimitive.Viewport className="p-1.5">{children}</SelectPrimitive.Viewport>
      </SelectPrimitive.Content>
    </SelectPrimitive.Portal>
  );
}

export function SelectItem({ className, children, ...props }: ComponentProps<typeof SelectPrimitive.Item>) {
  return (
    <SelectPrimitive.Item
      className={cn(
        "relative flex cursor-pointer items-center rounded-lg py-2.5 pr-9 pl-3 text-sm outline-none select-none data-[disabled]:pointer-events-none data-[disabled]:opacity-50 data-[highlighted]:bg-cyan/15 data-[highlighted]:text-white data-[state=checked]:text-aqua",
        className,
      )}
      {...props}
    >
      <SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText>
      <SelectPrimitive.ItemIndicator className="absolute right-3"><Check className="size-4" aria-hidden /></SelectPrimitive.ItemIndicator>
    </SelectPrimitive.Item>
  );
}
