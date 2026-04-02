import * as React from "react";

import { cn } from "@/lib/utils";

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "default" | "secondary" | "ghost";
  size?: "default" | "sm";
};

export function Button({ className, variant = "default", size = "default", ...props }: ButtonProps) {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-2xl text-sm font-medium transition-all focus:outline-none focus:ring-2 focus:ring-white/30 disabled:pointer-events-none disabled:opacity-50",
        variant === "default" && "bg-white text-slate-950 shadow-lg shadow-cyan-500/20 hover:scale-[1.01]",
        variant === "secondary" && "bg-white/8 text-white ring-1 ring-white/10 hover:bg-white/12",
        variant === "ghost" && "bg-transparent text-white hover:bg-white/8",
        size === "default" && "h-11 px-5",
        size === "sm" && "h-9 px-4 text-xs",
        className,
      )}
      {...props}
    />
  );
}
