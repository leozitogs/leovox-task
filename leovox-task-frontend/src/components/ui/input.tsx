import * as React from "react";
import { cn } from "@/lib/utils";

const Input = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-11 w-full rounded-xl bg-white/[0.04] backdrop-blur-sm border border-white/[0.08] px-4 py-2.5 text-sm text-text placeholder:text-text-muted/60 transition-all duration-300 ease-out",
          "focus:outline-none focus:bg-white/[0.06] focus:border-primary/40 focus:shadow-[0_0_0_3px_rgba(0,255,65,0.08),0_0_20px_rgba(0,255,65,0.05)]",
          "hover:border-white/[0.15] hover:bg-white/[0.05]",
          "disabled:cursor-not-allowed disabled:opacity-40",
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Input.displayName = "Input";

export { Input };
