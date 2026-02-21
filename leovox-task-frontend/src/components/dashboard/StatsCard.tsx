"use client";

import React, { useEffect, useState, useRef } from "react";
import { motion, useInView } from "framer-motion";
import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";

interface StatsCardProps {
  title: string;
  value: number;
  icon: LucideIcon;
  color?: string;
  trend?: string;
  delay?: number;
}

function AnimatedNumber({ target, inView }: { target: number; inView: boolean }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!inView) return;
    let start = 0;
    const duration = 1200;
    const step = target / (duration / 16);
    const timer = setInterval(() => {
      start += step;
      if (start >= target) {
        setCount(target);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, 16);
    return () => clearInterval(timer);
  }, [inView, target]);

  return <>{count}</>;
}

export function StatsCard({
  title,
  value,
  icon: Icon,
  color = "text-primary",
  trend,
  delay = 0,
}: StatsCardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  const getIconBg = () => {
    if (color.includes("danger")) return "bg-danger/10 border-danger/20";
    if (color.includes("warning")) return "bg-warning/10 border-warning/20";
    if (color.includes("info")) return "bg-info/10 border-info/20";
    if (color.includes("success")) return "bg-success/10 border-success/20";
    return "bg-primary/10 border-primary/20";
  };

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay, ease: [0.16, 1, 0.3, 1] }}
      whileHover={{ y: -2, transition: { duration: 0.2 } }}
      className="glass-card rounded-[12px] p-5 gradient-border relative noise-overlay"
    >
      <div className="relative z-10">
        {/* Top: icon + label */}
        <div className="flex items-center gap-3 mb-4">
          <div
            className={cn(
              "w-10 h-10 rounded-[10px] flex items-center justify-center border",
              getIconBg()
            )}
          >
            <Icon className={cn("w-5 h-5", color)} strokeWidth={1.5} />
          </div>
          <p className="text-[0.8125rem] text-text-secondary font-medium uppercase tracking-[0.05em] font-sans">
            {title}
          </p>
        </div>

        {/* Number */}
        <p className="text-[2.5rem] font-extrabold font-heading tracking-tight text-text-primary leading-none">
          <AnimatedNumber target={value} inView={isInView} />
        </p>

        {/* Trend indicator */}
        {trend && (
          <p
            className={cn(
              "text-xs mt-2 font-medium",
              trend.startsWith("↑") ? "text-success" : trend.startsWith("↓") ? "text-danger" : "text-text-tertiary"
            )}
          >
            {trend}
          </p>
        )}
      </div>
    </motion.div>
  );
}
