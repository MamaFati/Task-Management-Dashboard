import type { Task } from '@/hooks/useTask';
import { store } from '@/store';
import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: { 'Content-Type': 'application/json' },
});

// Task-related endpoints
// Add auth token to requests
  api.interceptors.request.use((config) => {
    const token = store.getState().auth.token;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  });

  export const login = async (credentials: { username: string; password: string }) => {
    const response = await api.post('/auth/login', credentials);
    return response.data;
  };

  export const fetchTodos = async (): Promise<Task[]> => {
    const response = await api.get('/todos');
    return response.data.todos;
  };

  export const addTodo = async (todo: Omit<Task, 'id'>): Promise<Task> => {
    const response = await api.post('/todos/add', todo);
    return response.data;
  };

  export const updateTodo = async (id: number, todo: Partial<Task>): Promise<Task> => {
    const response = await api.put(`/todos/${id}`, todo);
    return response.data;
  };

  export const deleteTodo = async (id: number): Promise<void> => {
    await api.delete(`/todos/${id}`);
  };