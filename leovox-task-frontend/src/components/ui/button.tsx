"use client";

import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-[10px] text-sm font-semibold transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-40 cursor-pointer relative overflow-hidden active:scale-[0.97]",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-black hover:bg-primary-hover hover:shadow-[0_0_25px_rgba(0,255,65,0.3)] btn-shine font-bold",
        destructive:
          "bg-danger text-white hover:shadow-[0_0_20px_rgba(255,68,68,0.3)] btn-shine",
        outline:
          "border border-border bg-transparent text-text-primary hover:bg-surface-hover hover:border-border-hover backdrop-blur-sm",
        secondary:
          "bg-surface text-text-primary hover:bg-surface-hover border border-border backdrop-blur-sm",
        ghost:
          "text-text-secondary hover:bg-surface-hover hover:text-text-primary",
        link:
          "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-11 px-5 py-2.5",
        sm: "h-9 rounded-[8px] px-3.5 text-xs",
        lg: "h-12 rounded-[10px] px-8 text-base",
        icon: "h-11 w-11 rounded-[10px]",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
