import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
  import toast from 'react-hot-toast';
  import { fetchTodos, addTodo, updateTodo, deleteTodo } from '@/lib/api';

  export interface Task {
    id: number;
    todo: string;
    completed: boolean;
    userId: number;
  }

  // Store deleted task IDs in localStorage
  const getDeletedTaskIds = (): number[] => {
    try {
      const deletedIds = localStorage.getItem('deletedTaskIds');
      return deletedIds ? JSON.parse(deletedIds) : [];
    } catch {
      return [];
    }
  };

  const addDeletedTaskId = (id: number) => {
    const deletedIds = getDeletedTaskIds();
    if (!deletedIds.includes(id)) {
      deletedIds.push(id);
      localStorage.setItem('deletedTaskIds', JSON.stringify(deletedIds));
    }
  };

  // Store added tasks in localStorage
  const getLocalTasks = (): Task[] => {
    try {
      const localTasks = localStorage.getItem('localTasks');
      return localTasks ? JSON.parse(localTasks) : [];
    } catch {
      return [];
    }
  };

  const addLocalTask = (task: Task) => {
    const localTasks = getLocalTasks();
    localTasks.push(task);
    localStorage.setItem('localTasks', JSON.stringify(localTasks));
  };

  const updateLocalTask = (id: number, updatedTask: Partial<Task>) => {
    const localTasks = getLocalTasks();
    const updatedTasks = localTasks.map((task) =>
      task.id === id ? { ...task, ...updatedTask } : task
    );
    localStorage.setItem('localTasks', JSON.stringify(updatedTasks));
  };

  export const useTasks = () => {
    const queryClient = useQueryClient();

    const { data: tasks, isLoading, error } = useQuery<Task[], Error>({
      queryKey: ['tasks'],
      queryFn: async () => {
        const response = await fetchTodos();
        const deletedIds = getDeletedTaskIds();
        const localTasks = getLocalTasks();
        // Combine API tasks (excluding deleted) with local tasks
        const filteredApiTasks = response.filter((task) => !deletedIds.includes(task.id));
        // Avoid duplicates by prioritizing local tasks
        const allTasks = [
          ...localTasks,
          ...filteredApiTasks.filter(
            (apiTask) => !localTasks.some((localTask) => localTask.id === apiTask.id)
          ),
        ];
        return allTasks;
      },
      onError: () => {
        toast.error('Failed to fetch tasks');
      },
    });

    const addMutation = useMutation({
      mutationFn: addTodo,
      onMutate: async (newTask: Omit<Task, 'id'>) => {
        await queryClient.cancelQueries({ queryKey: ['tasks'] });
        const previousTasks = queryClient.getQueryData<Task[]>(['tasks']);
        // Generate a temporary ID for the new task
        const tempId = Math.max(0, ...(previousTasks?.map((t) => t.id) || []), ...getLocalTasks().map((t) => t.id)) + 1;
        const optimisticTask: Task = { ...newTask, id: tempId };
        // Optimistically add task to cache
        queryClient.setQueryData<Task[]>(['tasks'], (old) => (old ? [...old, optimisticTask] : [optimisticTask]));
        // Store in localStorage
        addLocalTask(optimisticTask);
        return { previousTasks };
      },
      onSuccess: (data) => {
        // Update localStorage with actual ID if API provides it
        const localTasks = getLocalTasks();
        const updatedTasks = localTasks.map((task) =>
          task.id === data.id ? { ...task, id: data.id } : task
        );
        localStorage.setItem('localTasks', JSON.stringify(updatedTasks));
        queryClient.invalidateQueries({ queryKey: ['tasks'] });
        toast.success('Task added successfully');
      },
      onError: (err, newTask, context) => {
        queryClient.setQueryData(['tasks'], context?.previousTasks);
        // Remove from localStorage on error
        const localTasks = getLocalTasks().filter((task) => task.todo !== newTask.todo);
        localStorage.setItem('localTasks', JSON.stringify(localTasks));
        toast.error('Failed to add task');
      },
      onSettled: () => {
        queryClient.invalidateQueries({ queryKey: ['tasks'] });
      },
    });

    const updateMutation = useMutation({
      mutationFn: ({ id, todo }: { id: number; todo: Partial<Task> }) => updateTodo(id, todo),
      onMutate: async ({ id, todo }: { id: number; todo: Partial<Task> }) => {
        await queryClient.cancelQueries({ queryKey: ['tasks'] });
        const previousTasks = queryClient.getQueryData<Task[]>(['tasks']);
        // Optimistically update task in cache
        queryClient.setQueryData<Task[]>(['tasks'], (old) =>
          old
            ? old.map((task) => (task.id === id ? { ...task, ...todo } : task))
            : []
        );
        // Update localStorage
        updateLocalTask(id, todo);
        return { previousTasks };
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['tasks'] });
        toast.success('Task updated successfully');
      },
      onError: (err, { id }, context) => {
        queryClient.setQueryData(['tasks'], context?.previousTasks);
        // Revert localStorage on error
        const previousTasks = context?.previousTasks || [];
        const originalTask = previousTasks.find((task) => task.id === id);
        if (originalTask) {
          updateLocalTask(id, originalTask);
        }
        toast.error('Failed to update task');
      },
      onSettled: () => {
        queryClient.invalidateQueries({ queryKey: ['tasks'] });
      },
    });

    const deleteMutation = useMutation({
      mutationFn: deleteTodo,
      onMutate: async (id: number) => {
        await queryClient.cancelQueries({ queryKey: ['tasks'] });
        const previousTasks = queryClient.getQueryData<Task[]>(['tasks']);
        queryClient.setQueryData<Task[]>(['tasks'], (old) =>
          old ? old.filter((task) => task.id !== id) : []
        );
        addDeletedTaskId(id);
        return { previousTasks };
      },
      onSuccess: () => {
        toast.success('Task deleted successfully');
      },
      onError: (err, id, context) => {
        queryClient.setQueryData(['tasks'], context?.previousTasks);
        const deletedIds = getDeletedTaskIds().filter((deletedId) => deletedId !== id);
        localStorage.setItem('deletedTaskIds', JSON.stringify(deletedIds));
        toast.error('Failed to delete task');
      },
      onSettled: () => {
        queryClient.invalidateQueries({ queryKey: ['tasks'] });
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