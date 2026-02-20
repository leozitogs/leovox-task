export interface User {
  id: number;
  name: string;
  email: string;
  created_at?: string;
}

export interface Task {
  id: number;
  user_id: number;
  title: string;
  description: string | null;
  due_date: string | null;
  priority: "low" | "medium" | "high" | "urgent";
  status: "todo" | "in_progress" | "done";
  category: string;
  tags: string[];
  reminder_sent: boolean;
  created_at: string;
  updated_at: string;
}

export interface TaskFilters {
  status?: string;
  priority?: string;
  category?: string;
  search?: string;
  sort_by?: string;
  sort_dir?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
}

export interface DashboardStats {
  total: number;
  todo: number;
  in_progress: number;
  done: number;
  urgent: number;
  overdue: number;
  due_today: number;
  categories: Record<string, number>;
}

export interface AuthResponse {
  user: User;
  token: string;
}

export interface AIParseResponse {
  message: string;
  task: Task;
  parsed: {
    title: string;
    description: string | null;
    due_date: string | null;
    priority: string;
    category: string;
    tags: string[];
  };
}
