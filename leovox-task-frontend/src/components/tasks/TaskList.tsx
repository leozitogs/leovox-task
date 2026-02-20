"use client";

import React from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ListTodo } from "lucide-react";
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
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="h-24 rounded-2xl bg-white/[0.03] border border-white/[0.06] animate-shimmer"
            style={{ animationDelay: `${i * 0.15}s` }}
          />
        ))}
      </div>
    );
  }

  if (tasks.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col items-center justify-center py-20 text-center"
      >
        <div className="w-20 h-20 rounded-2xl bg-white/[0.04] border border-white/[0.08] flex items-center justify-center mb-5">
          <ListTodo className="w-9 h-9 text-text-muted" strokeWidth={1.5} />
        </div>
        <h3 className="text-lg font-bold text-text-secondary mb-2 font-heading">
          Nenhuma tarefa encontrada
        </h3>
        <p className="text-sm text-text-muted max-w-sm leading-relaxed">
          Use o chat com IA para criar tarefas por linguagem natural ou adicione manualmente.
        </p>
      </motion.div>
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
