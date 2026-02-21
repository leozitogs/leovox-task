"use client";

import React from "react";
import { AnimatePresence, motion } from "framer-motion";
import { TaskCard } from "./TaskCard";
import type { Task } from "@/types";

interface TaskListProps {
  tasks: Task[];
  isLoading: boolean;
  onStatusChange: (taskId: number, status: string) => void;
  onDelete: (taskId: number) => void;
}

export function TaskList({ tasks, isLoading, onStatusChange, onDelete }: TaskListProps) {
  if (isLoading) {
    return (
      <div className="space-y-3">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="h-[88px] rounded-[12px] animate-shimmer border border-border"
            style={{ animationDelay: `${i * 0.15}s` }}
          />
        ))}
      </div>
    );
  }

  return (
    <motion.div layout className="space-y-3">
      <AnimatePresence mode="popLayout">
        {tasks.map((task) => (
          <TaskCard
            key={task.id}
            task={task}
            onStatusChange={onStatusChange}
            onDelete={onDelete}
          />
        ))}
      </AnimatePresence>
    </motion.div>
  );
}
