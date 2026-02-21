"use client";

import React from "react";
import { motion } from "framer-motion";
import {
  Clock,
  Tag,
  Trash2,
  CheckCircle2,
  Circle,
  PlayCircle,
  AlertTriangle,
  Calendar,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { Task } from "@/types";
import {
  formatRelativeDate,
  getPriorityColor,
  getPriorityLabel,
  getStatusLabel,
  cn,
} from "@/lib/utils";

interface TaskCardProps {
  task: Task;
  onStatusChange: (taskId: number, status: string) => void;
  onDelete: (taskId: number) => void;
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

export function TaskCard({ task, onStatusChange, onDelete }: TaskCardProps) {
  const isOverdue =
    task.due_date && new Date(task.due_date) < new Date() && task.status !== "done";

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -100 }}
      transition={{ duration: 0.25 }}
      whileHover={{ x: 4 }}
    >
      <div
        className={cn(
          "glass-card rounded-[12px] p-5 transition-all duration-300",
          task.status === "done" && "opacity-50",
          isOverdue && "border-danger/20 hover:border-danger/30"
        )}
      >
        <div className="flex items-start gap-4">
          {/* Status toggle */}
          <motion.button
            whileHover={{ scale: 1.15 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => onStatusChange(task.id, nextStatus(task.status))}
            className="mt-0.5 transition-all duration-200 flex-shrink-0"
            title={`Mudar para: ${getStatusLabel(nextStatus(task.status))}`}
          >
            {statusIcon(task.status)}
          </motion.button>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1.5">
              <h3
                className={cn(
                  "text-sm font-semibold truncate text-text-primary",
                  task.status === "done" && "line-through text-text-tertiary"
                )}
              >
                {task.title}
              </h3>
              {isOverdue && (
                <AlertTriangle className="w-4 h-4 text-danger flex-shrink-0" strokeWidth={1.5} />
              )}
            </div>

            {task.description && (
              <p className="text-xs text-text-secondary mb-3 line-clamp-1 leading-relaxed">
                {task.description}
              </p>
            )}

            <div className="flex flex-wrap items-center gap-2">
              <Badge variant={priorityBadgeVariant(task.priority)}>
                <span className={cn("mr-1.5 text-[8px]", getPriorityColor(task.priority))}>
                  ●
                </span>
                {getPriorityLabel(task.priority)}
              </Badge>

              <Badge variant="outline">{task.category}</Badge>

              {task.due_date && (
                <div
                  className={cn(
                    "flex items-center gap-1.5 text-xs",
                    isOverdue ? "text-danger" : "text-text-secondary"
                  )}
                >
                  <Calendar className="w-3 h-3" strokeWidth={1.5} />
                  <span>{formatRelativeDate(task.due_date)}</span>
                </div>
              )}

              {task.tags && task.tags.length > 0 && (
                <div className="flex items-center gap-1.5">
                  <Tag className="w-3 h-3 text-text-tertiary" strokeWidth={1.5} />
                  {task.tags.slice(0, 3).map((tag) => (
                    <span key={tag} className="text-xs text-text-tertiary">
                      #{tag}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Actions */}
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => onDelete(task.id)}
            className="text-text-tertiary hover:text-danger transition-colors flex-shrink-0 p-2 rounded-[10px] hover:bg-danger/10"
          >
            <Trash2 className="w-4 h-4" strokeWidth={1.5} />
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}
