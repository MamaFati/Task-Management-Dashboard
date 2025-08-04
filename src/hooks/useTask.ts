import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchTodos, addTodo, updateTodo, deleteTodo } from '@/lib/api';

export interface Task {
  id: number;
  title: string;
  description?: string;
  status: 'To Do' | 'In Progress' | 'Done';
}

export const useTasks = () => {
  const queryClient = useQueryClient();

  // Fetch all tasks
  const { data: tasks, isLoading, error } = useQuery<Task[], Error>({
    queryKey: ['tasks'],
    queryFn: fetchTodos,
  });

  // Add a task
  const addMutation = useMutation({
    mutationFn: addTodo,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
    },
    onError: (error: any) => {
      console.error('Add task error:', error);
    },
  });

  // Update a task
  const updateMutation = useMutation({
    mutationFn: ({ id, todo }: { id: number; todo: Partial<Task> }) => updateTodo(id, todo),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
    },
    onError: (error: any) => {
      console.error('Update task error:', error);
    },
  });

  // Delete a task
  const deleteMutation = useMutation({
    mutationFn: deleteTodo,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
    },
    onError: (error: any) => {
      console.error('Delete task error:', error);
    },
  });

  return {
    tasks,
    isLoading,
    error,
    addTask: addMutation.mutate,
    addTaskStatus: {
      isPending: addMutation.isPending,
      error: addMutation.error,
    },
    updateTask: updateMutation.mutate,
    updateTaskStatus: {
      isPending: updateMutation.isPending,
      error: updateMutation.error,
    },
    deleteTask: deleteMutation.mutate,
    deleteTaskStatus: {
      isPending: deleteMutation.isPending,
      error: deleteMutation.error,
    },
  };
};