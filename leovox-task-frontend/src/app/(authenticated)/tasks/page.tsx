"use client";

import React, { useEffect, useState, useCallback, useRef } from "react";
import { motion } from "framer-motion";
import { Search, Filter, SlidersHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { TaskList } from "@/components/tasks/TaskList";
import { CreateTaskDialog } from "@/components/tasks/CreateTaskDialog";
import { tasksApi } from "@/lib/api";
import type { Task } from "@/types";
import { cn } from "@/lib/utils";
import gsap from "gsap";

const statusFilters = [
  { value: "", label: "Todas" },
  { value: "todo", label: "A Fazer" },
  { value: "in_progress", label: "Em Progresso" },
  { value: "done", label: "Concluídas" },
];

const priorityFilters = [
  { value: "", label: "Todas" },
  { value: "urgent", label: "Urgente" },
  { value: "high", label: "Alta" },
  { value: "medium", label: "Média" },
  { value: "low", label: "Baixa" },
];

export default function TasksPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [priorityFilter, setPriorityFilter] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const headerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (headerRef.current) {
      gsap.fromTo(
        headerRef.current,
        { opacity: 0, y: -20 },
        { opacity: 1, y: 0, duration: 0.6, ease: "expo.out" }
      );
    }
  }, []);

  const loadTasks = useCallback(async () => {
    setIsLoading(true);
    try {
      const params: Record<string, string> = {
        page: currentPage.toString(),
        per_page: "15",
        sort_by: "created_at",
        sort_dir: "desc",
      };
      if (search) params.search = search;
      if (statusFilter) params.status = statusFilter;
      if (priorityFilter) params.priority = priorityFilter;

      const response = await tasksApi.list(params);
      setTasks(response.data.data);
      setTotalPages(response.data.last_page);
    } catch (error) {
      console.error("Erro ao carregar tarefas:", error);
    } finally {
      setIsLoading(false);
    }
  }, [currentPage, search, statusFilter, priorityFilter]);

  useEffect(() => {
    loadTasks();
  }, [loadTasks]);

  useEffect(() => {
    setCurrentPage(1);
  }, [search, statusFilter, priorityFilter]);

  const handleStatusChange = async (taskId: number, status: string) => {
    try {
      await tasksApi.updateStatus(taskId, status);
      loadTasks();
    } catch (error) {
      console.error("Erro ao atualizar status:", error);
    }
  };

  const handleDelete = async (taskId: number) => {
    try {
      await tasksApi.delete(taskId);
      loadTasks();
    } catch (error) {
      console.error("Erro ao deletar tarefa:", error);
    }
  };

  const activeFiltersCount = [statusFilter, priorityFilter].filter(Boolean).length;

  return (
    <div className="p-6 lg:p-8 xl:p-10 max-w-[1400px] mx-auto">
      {/* Header */}
      <div ref={headerRef} className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4 opacity-0">
        <div>
          <h1 className="text-3xl lg:text-4xl font-bold font-heading tracking-tight">Tarefas</h1>
          <p className="text-text-secondary mt-2 text-sm lg:text-base">
            Gerencie todas as suas tarefas
          </p>
        </div>
        <CreateTaskDialog onTaskCreated={loadTasks} />
      </div>

      {/* Search & Filters */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.5 }}
        className="mb-6 space-y-4"
      >
        <div className="flex gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" strokeWidth={1.5} />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar tarefas..."
              className="flex h-12 w-full rounded-xl bg-white/[0.04] backdrop-blur-sm border border-white/[0.08] pl-11 pr-4 py-3 text-sm text-text placeholder:text-text-muted/50 transition-all duration-300 focus:outline-none focus:bg-white/[0.06] focus:border-primary/40 focus:shadow-[0_0_0_3px_rgba(0,255,65,0.08),0_0_20px_rgba(0,255,65,0.05)] hover:border-white/[0.15]"
            />
          </div>
          <Button
            variant={showFilters ? "secondary" : "outline"}
            onClick={() => setShowFilters(!showFilters)}
            className="relative h-12 px-5"
          >
            <SlidersHorizontal className="w-4 h-4 mr-2" strokeWidth={1.5} />
            Filtros
            {activeFiltersCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-primary text-background text-[10px] flex items-center justify-center font-bold shadow-[0_0_10px_rgba(0,255,65,0.3)]">
                {activeFiltersCount}
              </span>
            )}
          </Button>
        </div>

        {showFilters && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="glass-card rounded-2xl p-5 space-y-5"
          >
            <div>
              <label className="text-xs font-medium text-text-secondary uppercase tracking-wider mb-3 flex items-center gap-2">
                <Filter className="w-3.5 h-3.5" strokeWidth={1.5} /> Status
              </label>
              <div className="flex flex-wrap gap-2">
                {statusFilters.map((filter) => (
                  <motion.button
                    key={filter.value}
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => setStatusFilter(filter.value)}
                    className={cn(
                      "px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200",
                      statusFilter === filter.value
                        ? "bg-primary/15 text-primary border border-primary/25 shadow-[0_0_10px_rgba(0,255,65,0.1)]"
                        : "bg-white/[0.03] text-text-secondary border border-white/[0.06] hover:border-white/[0.12] hover:bg-white/[0.05]"
                    )}
                  >
                    {filter.label}
                  </motion.button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-xs font-medium text-text-secondary uppercase tracking-wider mb-3 flex items-center gap-2">
                <Filter className="w-3.5 h-3.5" strokeWidth={1.5} /> Prioridade
              </label>
              <div className="flex flex-wrap gap-2">
                {priorityFilters.map((filter) => (
                  <motion.button
                    key={filter.value}
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => setPriorityFilter(filter.value)}
                    className={cn(
                      "px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200",
                      priorityFilter === filter.value
                        ? "bg-primary/15 text-primary border border-primary/25 shadow-[0_0_10px_rgba(0,255,65,0.1)]"
                        : "bg-white/[0.03] text-text-secondary border border-white/[0.06] hover:border-white/[0.12] hover:bg-white/[0.05]"
                    )}
                  >
                    {filter.label}
                  </motion.button>
                ))}
              </div>
            </div>

            {activeFiltersCount > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setStatusFilter("");
                  setPriorityFilter("");
                }}
                className="text-text-muted hover:text-danger"
              >
                Limpar filtros
              </Button>
            )}
          </motion.div>
        )}

        {/* Active filters badges */}
        {activeFiltersCount > 0 && !showFilters && (
          <div className="flex gap-2">
            {statusFilter && (
              <Badge variant="default" className="cursor-pointer hover:bg-primary/20 transition-colors" onClick={() => setStatusFilter("")}>
                Status: {statusFilters.find((f) => f.value === statusFilter)?.label} ×
              </Badge>
            )}
            {priorityFilter && (
              <Badge variant="default" className="cursor-pointer hover:bg-primary/20 transition-colors" onClick={() => setPriorityFilter("")}>
                Prioridade: {priorityFilters.find((f) => f.value === priorityFilter)?.label} ×
              </Badge>
            )}
          </div>
        )}
      </motion.div>

      {/* Task List */}
      <TaskList
        tasks={tasks}
        isLoading={isLoading}
        onStatusChange={handleStatusChange}
        onDelete={handleDelete}
      />

      {/* Pagination */}
      {totalPages > 1 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="flex items-center justify-center gap-3 mt-8"
        >
          <Button
            variant="outline"
            size="sm"
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((p) => p - 1)}
          >
            Anterior
          </Button>
          <span className="text-sm text-text-secondary font-medium px-3">
            Página {currentPage} de {totalPages}
          </span>
          <Button
            variant="outline"
            size="sm"
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage((p) => p + 1)}
          >
            Próxima
          </Button>
        </motion.div>
      )}
    </div>
  );
}
