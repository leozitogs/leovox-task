"use client";

import React from "react";
import { motion } from "framer-motion";
import { Search, SlidersHorizontal } from "lucide-react";
import { cn } from "@/lib/utils";

interface FilterChip {
  key: string;
  label: string;
  count?: number;
  colorClass?: string;
}

interface TaskFiltersProps {
  search: string;
  onSearchChange: (value: string) => void;
  activeFilter: string;
  onFilterChange: (filter: string) => void;
  counts: {
    all: number;
    todo: number;
    in_progress: number;
    done: number;
    urgent: number;
  };
}

export function TaskFilters({
  search,
  onSearchChange,
  activeFilter,
  onFilterChange,
  counts,
}: TaskFiltersProps) {
  const chips: FilterChip[] = [
    { key: "all", label: "Todas", count: counts.all },
    { key: "todo", label: "A Fazer", count: counts.todo },
    { key: "in_progress", label: "Em Progresso", count: counts.in_progress },
    { key: "done", label: "Concluídas", count: counts.done },
    { key: "urgent", label: "Urgentes", count: counts.urgent, colorClass: "text-danger" },
  ];

  return (
    <div className="space-y-4">
      {/* Search bar */}
      <div className="relative">
        <Search
          className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-text-tertiary"
          strokeWidth={1.5}
        />
        <input
          type="text"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Buscar tarefas..."
          className="flex h-11 w-full rounded-[10px] bg-surface border border-border pl-11 pr-4 py-2.5 text-sm text-text-primary placeholder:text-text-tertiary transition-all duration-300 font-sans focus:outline-none focus:border-primary/40 focus:shadow-[0_0_0_3px_rgba(0,255,65,0.08),0_0_20px_rgba(0,255,65,0.05)] hover:border-border-hover"
        />
      </div>

      {/* Filter chips */}
      <div className="flex flex-wrap items-center gap-2">
        {chips.map((chip) => {
          const isActive = activeFilter === chip.key;
          return (
            <motion.button
              key={chip.key}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => onFilterChange(chip.key)}
              className={cn(
                "inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-sm font-medium transition-all duration-200 border",
                isActive
                  ? "bg-primary-muted border-primary/30 text-primary"
                  : "bg-surface border-border text-text-secondary hover:border-border-hover hover:text-text-primary"
              )}
            >
              <span className={chip.colorClass && !isActive ? chip.colorClass : ""}>
                {chip.label}
              </span>
              {chip.count !== undefined && (
                <span
                  className={cn(
                    "text-xs px-1.5 py-0.5 rounded-full min-w-[20px] text-center",
                    isActive
                      ? "bg-primary/20 text-primary"
                      : "bg-surface-hover text-text-tertiary"
                  )}
                >
                  {chip.count}
                </span>
              )}
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
