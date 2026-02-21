"use client";

import React, { useEffect, useState, useCallback, useMemo } from "react";
import { motion } from "framer-motion";
import { Plus, SlidersHorizontal, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { TaskList } from "@/components/tasks/TaskList";
import { TaskFilters } from "@/components/tasks/TaskFilters";
import { CreateTaskDialog } from "@/components/tasks/CreateTaskDialog";
import { EmptyState } from "@/components/tasks/EmptyState";
import { tasksApi } from "@/lib/api";
import { useDebounce } from "@/hooks/useDebounce";
import type { Task } from "@/types";
import { cn } from "@/lib/utils";

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
  const [activeFilter, setActiveFilter] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("");
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const debouncedSearch = useDebounce(search, 300);

  const fetchTasks = useCallback(async () => {
    setIsLoading(true);
    try {
      const params: Record<string, string> = {
        page: currentPage.toString(),
        per_page: "15",
        sort_by: "created_at",
        sort_dir: "desc",
      };
      if (debouncedSearch) params.search = debouncedSearch;
      if (priorityFilter) params.priority = priorityFilter;

      const response = await tasksApi.list(params);
      const tasksData = Array.isArray(response.data)
        ? response.data
        : response.data?.data || [];
      setTasks(tasksData);
      if (response.data?.last_page) {
        setTotalPages(response.data.last_page);
      }
    } catch (error) {
      console.error("Erro ao carregar tarefas:", error);
    } finally {
      setIsLoading(false);
    }
  }, [currentPage, debouncedSearch, priorityFilter]);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedSearch, priorityFilter]);

  const handleStatusChange = async (taskId: number, status: string) => {
    try {
      await tasksApi.updateStatus(taskId, status);
      fetchTasks();
    } catch (error) {
      console.error("Erro ao atualizar status:", error);
    }
  };

  const handleDelete = async (taskId: number) => {
    try {
      await tasksApi.delete(taskId);
      fetchTasks();
    } catch (error) {
      console.error("Erro ao deletar tarefa:", error);
    }
  };

  // Compute filter counts from loaded tasks
  const counts = useMemo(() => {
    return {
      all: tasks.length,
      todo: tasks.filter((t) => t.status === "todo").length,
      in_progress: tasks.filter((t) => t.status === "in_progress").length,
      done: tasks.filter((t) => t.status === "done").length,
      urgent: tasks.filter((t) => t.priority === "urgent").length,
    };
  }, [tasks]);

  // Client-side status filter
  const filteredTasks = useMemo(() => {
    if (activeFilter === "all") return tasks;
    if (activeFilter === "urgent") return tasks.filter((t) => t.priority === "urgent");
    return tasks.filter((t) => t.status === activeFilter);
  }, [tasks, activeFilter]);

  const isEmpty = !isLoading && tasks.length === 0 && !debouncedSearch && !priorityFilter;

  return (
    <div className="space-y-6 max-w-[1400px] mx-auto">
      {/* ── Header ── */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
      >
        <div>
          <h1 className="text-[2rem] font-extrabold font-heading tracking-tight text-text-primary">
            Tarefas{" "}
            {!isLoading && (
              <span className="text-text-secondary text-lg font-normal">
                ({counts.all} tarefa{counts.all !== 1 ? "s" : ""})
              </span>
            )}
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant={showAdvancedFilters ? "secondary" : "outline"}
            size="sm"
            onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
            className="relative"
          >
            <SlidersHorizontal className="w-4 h-4 mr-2" strokeWidth={1.5} />
            Filtros
            {priorityFilter && (
              <span className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-primary text-black text-[10px] flex items-center justify-center font-bold">
                1
              </span>
            )}
          </Button>
          <CreateTaskDialog onTaskCreated={fetchTasks}>
            <Button>
              <Plus className="w-4 h-4 mr-2" strokeWidth={1.5} />
              Nova Tarefa
            </Button>
          </CreateTaskDialog>
        </div>
      </motion.div>

      {/* ── Search + Status Chips ── */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
      >
        <TaskFilters
          search={search}
          onSearchChange={setSearch}
          activeFilter={activeFilter}
          onFilterChange={setActiveFilter}
          counts={counts}
        />
      </motion.div>

      {/* ── Advanced Filters ── */}
      {showAdvancedFilters && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          className="glass-card rounded-[12px] p-5 space-y-4"
        >
          <div>
            <label className="text-xs font-medium text-text-secondary uppercase tracking-[0.05em] mb-3 flex items-center gap-2">
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
                    "px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 border",
                    priorityFilter === filter.value
                      ? "bg-primary-muted text-primary border-primary/30"
                      : "bg-surface text-text-secondary border-border hover:border-border-hover"
                  )}
                >
                  {filter.label}
                </motion.button>
              ))}
            </div>
          </div>

          {priorityFilter && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setPriorityFilter("")}
              className="text-text-tertiary hover:text-danger"
            >
              Limpar filtros
            </Button>
          )}
        </motion.div>
      )}

      {/* ── Active filter badges ── */}
      {priorityFilter && !showAdvancedFilters && (
        <div className="flex gap-2">
          <Badge
            variant="default"
            className="cursor-pointer hover:bg-primary/20 transition-colors"
            onClick={() => setPriorityFilter("")}
          >
            Prioridade: {priorityFilters.find((f) => f.value === priorityFilter)?.label} ×
          </Badge>
        </div>
      )}

      {/* ── Content ── */}
      {isEmpty ? (
        <EmptyState onCreateTask={() => {}} />
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.2 }}
        >
          {filteredTasks.length === 0 && !isLoading ? (
            <div className="text-center py-16">
              <p className="text-text-secondary text-sm">
                Nenhuma tarefa encontrada com os filtros atuais.
              </p>
            </div>
          ) : (
            <TaskList
              tasks={filteredTasks}
              isLoading={isLoading}
              onStatusChange={handleStatusChange}
              onDelete={handleDelete}
            />
          )}
        </motion.div>
      )}

      {/* ── Pagination ── */}
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
