"use client";

import React, { useEffect, useState, useCallback, useRef } from "react";
import { motion } from "framer-motion";
import {
  ListTodo,
  PlayCircle,
  CheckCircle2,
  AlertTriangle,
  Clock,
  TrendingUp,
  CalendarClock,
} from "lucide-react";
import { StatsCard } from "@/components/tasks/StatsCard";
import { TaskList } from "@/components/tasks/TaskList";
import { dashboardApi, tasksApi } from "@/lib/api";
import { useAuth } from "@/contexts/AuthContext";
import type { DashboardStats, Task } from "@/types";
import gsap from "gsap";

export default function DashboardPage() {
  const { user } = useAuth();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [recentTasks, setRecentTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const headerRef = useRef<HTMLDivElement>(null);

  const loadData = useCallback(async () => {
    try {
      const [statsRes, tasksRes] = await Promise.all([
        dashboardApi.getStats(),
        tasksApi.list({ per_page: "5", sort_by: "created_at", sort_dir: "desc" }),
      ]);
      setStats(statsRes.data);
      setRecentTasks(tasksRes.data.data);
    } catch (error) {
      console.error("Erro ao carregar dashboard:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  useEffect(() => {
    if (headerRef.current) {
      gsap.fromTo(
        headerRef.current,
        { opacity: 0, y: -20 },
        { opacity: 1, y: 0, duration: 0.6, ease: "expo.out" }
      );
    }
  }, []);

  const handleStatusChange = async (taskId: number, status: string) => {
    try {
      await tasksApi.updateStatus(taskId, status);
      loadData();
    } catch (error) {
      console.error("Erro ao atualizar status:", error);
    }
  };

  const handleDelete = async (taskId: number) => {
    try {
      await tasksApi.delete(taskId);
      loadData();
    } catch (error) {
      console.error("Erro ao deletar tarefa:", error);
    }
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Bom dia";
    if (hour < 18) return "Boa tarde";
    return "Boa noite";
  };

  return (
    <div className="p-6 lg:p-8 xl:p-10 max-w-[1400px] mx-auto">
      {/* Header */}
      <div ref={headerRef} className="mb-10 opacity-0">
        <h1 className="text-3xl lg:text-4xl font-bold font-heading tracking-tight">
          {getGreeting()},{" "}
          <span className="text-primary text-glow">{user?.name?.split(" ")[0]}</span>
        </h1>
        <p className="text-text-secondary mt-2 text-sm lg:text-base">
          Aqui está o resumo das suas tarefas.
        </p>
      </div>

      {/* Stats Grid */}
      {stats && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 mb-10">
          <StatsCard title="Total" value={stats.total} icon={TrendingUp} delay={0} />
          <StatsCard title="A Fazer" value={stats.todo} icon={ListTodo} delay={0.06} />
          <StatsCard
            title="Em Progresso"
            value={stats.in_progress}
            icon={PlayCircle}
            color="text-info"
            delay={0.12}
          />
          <StatsCard
            title="Concluídas"
            value={stats.done}
            icon={CheckCircle2}
            color="text-success"
            delay={0.18}
          />
          <StatsCard
            title="Urgentes"
            value={stats.urgent}
            icon={AlertTriangle}
            color="text-danger"
            delay={0.24}
          />
          <StatsCard
            title="Atrasadas"
            value={stats.overdue}
            icon={Clock}
            color="text-warning"
            delay={0.3}
          />
          <StatsCard
            title="Vencem Hoje"
            value={stats.due_today}
            icon={CalendarClock}
            color="text-info"
            delay={0.36}
          />
        </div>
      )}

      {/* Loading skeleton for stats */}
      {!stats && isLoading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 mb-10">
          {[1, 2, 3, 4, 5, 6, 7].map((i) => (
            <div
              key={i}
              className="h-32 rounded-2xl bg-white/[0.03] border border-white/[0.06] animate-shimmer"
            />
          ))}
        </div>
      )}

      {/* Recent Tasks */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.5 }}
      >
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-xl lg:text-2xl font-bold font-heading tracking-tight">
            Tarefas Recentes
          </h2>
        </div>
        <TaskList
          tasks={recentTasks}
          isLoading={isLoading}
          onStatusChange={handleStatusChange}
          onDelete={handleDelete}
        />
      </motion.div>
    </div>
  );
}
