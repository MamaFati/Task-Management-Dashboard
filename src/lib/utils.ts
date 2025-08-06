import type { Task } from "@/hooks/useTask";
 
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
 


 
export const getDeletedTaskIds = (): number[] => {
  try {
    const deletedIds = localStorage.getItem('deletedTaskIds');
    return deletedIds ? JSON.parse(deletedIds) : [];
  } catch {
    return [];
  }
};

export const addDeletedTaskId = (id: number) => {
  const deletedIds = getDeletedTaskIds();
  if (!deletedIds.includes(id)) {
    deletedIds.push(id);
    localStorage.setItem('deletedTaskIds', JSON.stringify(deletedIds));
  }
};

export const getLocalTasks = (): Task[] => {
  try {
    const localTasks = localStorage.getItem('localTasks');
    return localTasks ? JSON.parse(localTasks) : [];
  } catch {
    return [];
  }
};

export const addLocalTask = (task: Task) => {
  const localTasks = getLocalTasks();
  localTasks.push(task);
  localStorage.setItem('localTasks', JSON.stringify(localTasks));
};

export const updateLocalTask = (id: number, updatedTask: Partial<Task>) => {
  const localTasks = getLocalTasks();
  const updatedTasks = localTasks.map((task) =>
    task.id === id ? { ...task, ...updatedTask } : task
  );
  localStorage.setItem('localTasks', JSON.stringify(updatedTasks));
};

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
