import Link from "next/link";
import type { ComponentProps } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

export const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 rounded-full font-semibold transition duration-300 disabled:pointer-events-none disabled:opacity-60",
  {
    variants: {
      variant: {
        primary: "bg-gradient-to-r from-cyan to-aqua text-abyss hover:shadow-[0_0_30px_-6px_var(--color-cyan)]",
        outline: "border border-aqua/40 text-white hover:border-aqua hover:bg-aqua/10",
        dark: "bg-abyss text-white hover:bg-deep",
      },
      size: {
        md: "h-11 px-6 text-sm",
        lg: "h-13 px-8 text-base",
      },
    },
    defaultVariants: { variant: "primary", size: "md" },
  },
);

type ButtonLinkProps = ComponentProps<typeof Link> & VariantProps<typeof buttonVariants>;

export function ButtonLink({ className, variant, size, ...props }: ButtonLinkProps) {
  return <Link className={cn(buttonVariants({ variant, size }), className)} {...props} />;
}
