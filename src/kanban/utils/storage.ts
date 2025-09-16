// src/kanban/utils/storage.ts

export interface Task {
  id: string;
  title: string;
  description?: string;
  due_date?: string;
  column_key: "todo" | "inProgress" | "done";
}

export const STORAGE_KEY = "kanban_tasks";

// Fetch tasks from localStorage
export function getStoredTasks(): Task[] {
  const data = localStorage.getItem(STORAGE_KEY);
  return data ? JSON.parse(data) : [];
}

// Save tasks to localStorage
export function saveTasks(tasks: Task[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
}
