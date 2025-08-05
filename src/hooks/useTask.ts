import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { fetchTodos, addTodo, updateTodo, deleteTodo } from '@/lib/api';

export interface Task {
  id:  number;
  todo: string;
  completed: boolean;
  userId: number;
}

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
      const filteredApiTasks = response.filter((task) => !deletedIds.includes(task.id));
      const allTasks = [
        ...localTasks,
        ...filteredApiTasks.filter(
          (apiTask) => !localTasks.some((localTask) => localTask.id === apiTask.id)
        ),
      ];
      return allTasks;
    },
    // onError: (err: any) => {
    //   toast.error(err.response?.data?.message || 'Failed to fetch tasks');
    // },
  });

  const addMutation = useMutation({
    mutationFn: addTodo,
    onMutate: async (newTask: Omit<Task, 'id'>) => {
      await queryClient.cancelQueries({ queryKey: ['tasks'] });
      const previousTasks = queryClient.getQueryData<Task[]>(['tasks']);
      const tempId = Math.max(0, ...(previousTasks?.map((t) => t.id) || []), ...getLocalTasks().map((t) => t.id)) + 1;
      const optimisticTask: Task = { ...newTask, id: tempId };
      queryClient.setQueryData<Task[]>(['tasks'], (old) => (old ? [...old, optimisticTask] : [optimisticTask]));
      addLocalTask(optimisticTask);
      return { previousTasks };
    },
    onSuccess: (data) => {
      const localTasks = getLocalTasks();
      const updatedTasks = localTasks.map((task) =>
        task.id === data.id ? { ...task, id: data.id } : task
      );
      localStorage.setItem('localTasks', JSON.stringify(updatedTasks));
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      toast.success('Task added successfully');
    },
    onError: (_err, newTask, context) => {
      queryClient.setQueryData(['tasks'], context?.previousTasks);
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
      queryClient.setQueryData<Task[]>(['tasks'], (old) =>
        old
          ? old.map((task) => (task.id === id ? { ...task, ...todo } : task))
          : []
      );
      updateLocalTask(id, todo);
      return { previousTasks };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      toast.success('Task updated successfully');
    },
    onError: (_err, { id }, context) => {
      queryClient.setQueryData(['tasks'], context?.previousTasks);
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
    onError: (_err, id, context) => {
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