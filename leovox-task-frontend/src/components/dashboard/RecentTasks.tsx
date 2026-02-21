"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  CheckCircle2,
  Circle,
  PlayCircle,
  ArrowRight,
  ListTodo,
  MessageSquare,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { Task } from "@/types";
import {
  cn,
  formatRelativeDate,
  getPriorityLabel,
} from "@/lib/utils";

interface RecentTasksProps {
  tasks: Task[];
  isLoading: boolean;
  onStatusChange?: (taskId: number, status: string) => void;
}

const priorityBadgeVariant = (priority: string) => {
  switch (priority) {
    case "urgent":
      return "destructive" as const;
    case "high":
      return "warning" as const;
    case "medium":
      return "default" as const;
    case "low":
      return "secondary" as const;
    default:
      return "outline" as const;
  }
};

const statusIcon = (status: string) => {
  switch (status) {
    case "done":
      return <CheckCircle2 className="w-5 h-5 text-success" strokeWidth={1.5} />;
    case "in_progress":
      return <PlayCircle className="w-5 h-5 text-info" strokeWidth={1.5} />;
    default:
      return <Circle className="w-5 h-5 text-text-tertiary" strokeWidth={1.5} />;
  }
};

const nextStatus = (current: string): string => {
  switch (current) {
    case "todo":
      return "in_progress";
    case "in_progress":
      return "done";
    case "done":
      return "todo";
    default:
      return "todo";
  }
};

export function RecentTasks({ tasks, isLoading, onStatusChange }: RecentTasksProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.4 }}
      className="glass-card rounded-[12px] p-6 noise-overlay relative"
    >
      <div className="relative z-10">
        {/* Header */}
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-[1.25rem] font-bold font-heading text-text-primary">
            Tarefas Recentes
          </h3>
          <Link href="/tasks">
            <span className="text-sm text-primary hover:text-primary-hover transition-colors font-medium flex items-center gap-1">
              Ver todas
              <ArrowRight className="w-3.5 h-3.5" strokeWidth={1.5} />
            </span>
          </Link>
        </div>

        {/* Loading state */}
        {isLoading && (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="h-14 rounded-[10px] animate-shimmer"
                style={{ animationDelay: `${i * 0.15}s` }}
              />
            ))}
          </div>
        )}

        {/* Empty state */}
        {!isLoading && tasks.length === 0 && (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="w-16 h-16 rounded-[12px] bg-surface border border-border flex items-center justify-center mb-4">
              <ListTodo className="w-7 h-7 text-text-tertiary" strokeWidth={1.5} />
            </div>
            <h4 className="text-base font-bold text-text-secondary mb-1.5 font-heading">
              Nenhuma tarefa ainda
            </h4>
            <p className="text-sm text-text-tertiary mb-4 max-w-[240px]">
              Que tal criar uma no Chat IA?
            </p>
            <Link href="/chat">
              <Button variant="outline" size="sm">
                <MessageSquare className="w-4 h-4 mr-2" strokeWidth={1.5} />
                Ir para Chat IA
              </Button>
            </Link>
          </div>
        )}

        {/* Task list */}
        {!isLoading && tasks.length > 0 && (
          <div className="space-y-2">
            {tasks.slice(0, 5).map((task) => (
              <motion.div
                key={task.id}
                whileHover={{ x: 4 }}
                className={cn(
                  "flex items-center gap-3 p-3 rounded-[10px] transition-colors duration-200 hover:bg-surface-hover cursor-default",
                  task.status === "done" && "opacity-50"
                )}
              >
                {/* Status toggle */}
                <button
                  onClick={() => onStatusChange?.(task.id, nextStatus(task.status))}
                  className="flex-shrink-0 transition-transform hover:scale-110"
                >
                  {statusIcon(task.status)}
                </button>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <p
                    className={cn(
                      "text-sm font-medium truncate text-text-primary",
                      task.status === "done" && "line-through text-text-tertiary"
                    )}
                  >
                    {task.title}
                  </p>
                  {task.due_date && (
                    <p className="text-xs text-text-tertiary mt-0.5">
                      {formatRelativeDate(task.due_date)}
                    </p>
                  )}
                </div>

                {/* Badges */}
                <div className="flex items-center gap-1.5 flex-shrink-0">
                  <Badge variant={priorityBadgeVariant(task.priority)} className="text-[10px] px-2 py-0">
                    {getPriorityLabel(task.priority)}
                  </Badge>
                  <Badge variant="outline" className="text-[10px] px-2 py-0">
                    {task.category}
                  </Badge>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
}
