import Link from "next/link";
import type { ComponentPropsWithoutRef, ReactNode } from "react";

type Variant = "primary" | "secondary" | "accent" | "ghost";

const variants: Record<Variant, string> = {
  primary:
    "border-cyan-300/70 bg-cyan-300/15 text-cyan-50 shadow-[0_0_20px_rgba(0,245,255,0.25)] hover:bg-cyan-300/25",
  secondary:
    "border-pink-300/70 bg-pink-400/15 text-pink-50 shadow-[0_0_20px_rgba(255,60,172,0.25)] hover:bg-pink-400/25",
  accent:
    "border-yellow-200/70 bg-yellow-300/15 text-yellow-50 shadow-[0_0_20px_rgba(255,230,0,0.2)] hover:bg-yellow-300/25",
  ghost: "border-slate-300/25 bg-slate-950/25 text-slate-100 hover:bg-slate-100/10"
};

const baseClass =
  "inline-flex items-center justify-center gap-2 rounded-sm border px-4 py-3 text-sm font-bold transition duration-200 hover:-translate-y-0.5 active:translate-y-0 disabled:cursor-not-allowed disabled:opacity-55";

type ButtonProps = ComponentPropsWithoutRef<"button"> & {
  variant?: Variant;
  icon?: ReactNode;
};

type LinkProps = ComponentPropsWithoutRef<typeof Link> & {
  variant?: Variant;
  icon?: ReactNode;
};

export function ArcadeButton({ className = "", variant = "primary", icon, children, ...props }: ButtonProps) {
  return (
    <button className={`${baseClass} ${variants[variant]} ${className}`} {...props}>
      {icon}
      {children}
    </button>
  );
}

export function ArcadeLink({ className = "", variant = "primary", icon, children, ...props }: LinkProps) {
  return (
    <Link className={`${baseClass} ${variants[variant]} ${className}`} {...props}>
      {icon}
      {children}
    </Link>
  );
}
