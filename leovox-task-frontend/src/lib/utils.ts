import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(dateString: string | null): string {
  if (!dateString) return "Sem data";
  const date = new Date(dateString);
  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

export function formatRelativeDate(dateString: string | null): string {
  if (!dateString) return "Sem data";
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = date.getTime() - now.getTime();
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffMs < 0) {
    if (diffDays === 0) return "Atrasada (hoje)";
    return `Atrasada (${Math.abs(diffDays)} dia${Math.abs(diffDays) > 1 ? "s" : ""})`;
  }
  if (diffHours < 1) return "Em menos de 1 hora";
  if (diffHours < 24) return `Em ${diffHours} hora${diffHours > 1 ? "s" : ""}`;
  if (diffDays === 0) return "Hoje";
  if (diffDays === 1) return "Amanhã";
  return `Em ${diffDays} dias`;
}

export function getPriorityColor(priority: string): string {
  switch (priority) {
    case "urgent":
      return "text-danger";
    case "high":
      return "text-warning";
    case "medium":
      return "text-primary";
    case "low":
      return "text-text-secondary";
    default:
      return "text-text-secondary";
  }
}

export function getPriorityLabel(priority: string): string {
  switch (priority) {
    case "urgent":
      return "Urgente";
    case "high":
      return "Alta";
    case "medium":
      return "Média";
    case "low":
      return "Baixa";
    default:
      return priority;
  }
}

export function getStatusLabel(status: string): string {
  switch (status) {
    case "todo":
      return "A Fazer";
    case "in_progress":
      return "Em Progresso";
    case "done":
      return "Concluída";
    default:
      return status;
  }
}
