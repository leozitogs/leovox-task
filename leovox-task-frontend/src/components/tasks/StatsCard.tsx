"use client";

import React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";

interface StatsCardProps {
  title: string;
  value: number;
  icon: LucideIcon;
  color?: string;
  delay?: number;
}

export function StatsCard({ title, value, icon: Icon, color = "text-primary", delay = 0 }: StatsCardProps) {
  // Map text color to bg color for the icon circle
  const getBgColor = () => {
    if (color.includes("danger")) return "bg-danger/10 border-danger/20";
    if (color.includes("warning")) return "bg-warning/10 border-warning/20";
    if (color.includes("info")) return "bg-info/10 border-info/20";
    if (color.includes("success")) return "bg-success/10 border-success/20";
    return "bg-primary/10 border-primary/20";
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay, ease: [0.16, 1, 0.3, 1] }}
      whileHover={{ y: -3, transition: { duration: 0.2 } }}
      className="glass-card rounded-2xl p-5 gradient-border relative noise-overlay"
    >
      <div className="relative z-10">
        <div className="flex items-start justify-between mb-4">
          <div className={cn(
            "w-11 h-11 rounded-xl flex items-center justify-center border",
            getBgColor()
          )}>
            <Icon className={cn("w-5 h-5", color)} strokeWidth={1.5} />
          </div>
        </div>
        <p className={cn("text-4xl font-bold font-heading tracking-tight", color)}>
          {value}
        </p>
        <p className="text-xs text-text-muted uppercase tracking-wider mt-1.5 font-medium">
          {title}
        </p>
      </div>
    </motion.div>
  );
}
