import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL
});

// Task-related endpoints
export const fetchTodos = async () => {
  try{
     const { data } = await api.get('/todos');
  console.log(data.todos);
  return data.todos ?? [];
  } catch (error) {
    console.error('Error fetching tasks:', error);
    return [];

  }
  // DummyJSON returns todos in a "todos" array
};

export const addTodo = async (todo: { title: string; description?: string; status: string }) => {
  const { data } = await api.post('/todos/add', {
    ...todo,
    userId: 1, // Hardcode userId for simplicity, as per DummyJSON docs
  });
  return data;
};

export const updateTodo = async (id: number, todo: Partial<{ title: string; description?: string; status: string }>) => {
  const { data } = await api.put(`/todos/${id}`, todo);
  return data;
};

export const deleteTodo = async (id: number) => {
  const { data } = await api.delete(`/todos/${id}`);
  return data;
};

// Authentication endpoint
export const login = async (credentials: { username: string; password: string }) => {
  const { data } = await api.post('/auth/login', credentials);
  return data;
};