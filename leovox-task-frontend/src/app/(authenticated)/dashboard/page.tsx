"use client";

import React, { useEffect, useState, useCallback } from "react";
import { motion } from "framer-motion";
import {
  BarChart3,
  Circle,
  Clock,
  CheckCircle,
  AlertTriangle,
  CalendarClock,
  Plus,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { dashboardApi, tasksApi } from "@/lib/api";
import { StatsCard } from "@/components/dashboard/StatsCard";
import { ActivityChart } from "@/components/dashboard/ActivityChart";
import { RecentTasks } from "@/components/dashboard/RecentTasks";
import { CreateTaskDialog } from "@/components/tasks/CreateTaskDialog";
import type { Task } from "@/types";

interface DashboardStats {
  total: number;
  todo: number;
  in_progress: number;
  done: number;
  urgent: number;
  overdue: number;
  due_today: number;
}

function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return "Bom dia,";
  if (hour < 18) return "Boa tarde,";
  return "Boa noite,";
}

function getFormattedDate(): string {
  return new Intl.DateTimeFormat("pt-BR", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date());
}

export default function DashboardPage() {
  const { user } = useAuth();
  const [stats, setStats] = useState<DashboardStats>({
    total: 0,
    todo: 0,
    in_progress: 0,
    done: 0,
    urgent: 0,
    overdue: 0,
    due_today: 0,
  });
  const [recentTasks, setRecentTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchData = useCallback(async () => {
    try {
      const [statsRes, tasksRes] = await Promise.all([
        dashboardApi.getStats(),
        tasksApi.list({ per_page: "5", sort_by: "created_at", sort_dir: "desc" }),
      ]);
      setStats(statsRes.data);
      const tasksData = Array.isArray(tasksRes.data)
        ? tasksRes.data
        : tasksRes.data?.data || [];
      setRecentTasks(tasksData);
    } catch (error) {
      console.error("Erro ao carregar dashboard:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleStatusChange = async (taskId: number, status: string) => {
    try {
      await tasksApi.updateStatus(taskId, status);
      fetchData();
    } catch (error) {
      console.error("Erro ao atualizar status:", error);
    }
  };

  const firstName = user?.name?.split(" ")[0] || "Usuário";

  const metricsConfig = [
    { title: "Total de Tarefas", value: stats.total, icon: BarChart3, color: "text-info" },
    { title: "A Fazer", value: stats.todo, icon: Circle, color: "text-text-secondary" },
    { title: "Em Progresso", value: stats.in_progress, icon: Clock, color: "text-warning" },
    { title: "Concluídas", value: stats.done, icon: CheckCircle, color: "text-success" },
    { title: "Urgentes", value: stats.urgent, icon: AlertTriangle, color: "text-danger" },
    { title: "Vencem Hoje", value: stats.due_today, icon: CalendarClock, color: "text-primary" },
  ];

  return (
    <div className="space-y-8 max-w-[1400px] mx-auto">
      {/* ── Header ── */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      >
        <p className="text-text-secondary font-sans text-base">
          {getGreeting()}{" "}
          <span className="text-primary font-heading font-bold text-glow">
            {firstName}
          </span>
        </p>
        <p className="text-text-tertiary text-sm mt-1 capitalize">
          {getFormattedDate()}
        </p>
      </motion.div>

      {/* ── Metrics Grid (3x2 desktop, 2x3 tablet, 1x6 mobile) ── */}
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div
              key={i}
              className="h-[140px] rounded-[12px] animate-shimmer border border-border"
              style={{ animationDelay: `${i * 0.1}s` }}
            />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {metricsConfig.map((metric, index) => (
            <StatsCard
              key={metric.title}
              title={metric.title}
              value={metric.value}
              icon={metric.icon}
              color={metric.color}
              delay={index * 0.08}
            />
          ))}
        </div>
      )}

      {/* ── Chart + Recent Tasks (side by side on desktop) ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ActivityChart />
        <RecentTasks
          tasks={recentTasks}
          isLoading={isLoading}
          onStatusChange={handleStatusChange}
        />
      </div>

      {/* ── Floating Action Button ── */}
      <CreateTaskDialog onTaskCreated={fetchData}>
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-primary text-black flex items-center justify-center shadow-lg glow-primary animate-pulse-glow cursor-pointer"
          aria-label="Nova Tarefa"
        >
          <Plus className="w-6 h-6" strokeWidth={2} />
        </motion.button>
      </CreateTaskDialog>
    </div>
  );
}
