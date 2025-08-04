import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import type { RootState, AppDispatch } from '@/store';
import { setStatusFilter } from '@/store/filterSlice';
import { logout } from '@/store/authSlice';
import { useNavigate } from 'react-router-dom';
import { useTasks, type Task } from '@/hooks/useTask';
import {Button} from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
// import { useMutation } from '@tanstack/react-query';
import TaskForm from '@/components/TaskForm';

const TaskList = () => {
  const { tasks, isLoading, error, deleteTask, deleteTaskStatus } = useTasks();
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const statusFilter = useSelector((state: RootState) => state.filter.status);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | undefined>(undefined);

  const filteredTasks = tasks?.filter((task) =>
    statusFilter === 'All' ? true : task.status === statusFilter
  );

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  if (isLoading) {
    return (
      <div className="space-y-2">
        {[...Array(6)].map((_, index) => (
          <Skeleton key={index} className="h-12 w-full rounded" />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center p-6 bg-red-50 dark:bg-red-900/20 rounded-lg text-red-600 dark:text-red-400">
        <svg className="w-8 h-8 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <p className="text-lg font-medium">Error: {(error as Error).message}</p>
      </div>
    );
  }

  if (!filteredTasks || filteredTasks.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-6 bg-gray-50 dark:bg-gray-800 rounded-lg text-gray-600 dark:text-gray-400">
        <svg className="w-8 h-8 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
        </svg>
        <p className="text-lg font-medium">No tasks available. Add a task to get started!</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <Select
          value={statusFilter}
          onValueChange={(value) =>
            dispatch(setStatusFilter(value as 'All' | 'To Do' | 'In Progress' | 'Done'))
          }
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="All">All</SelectItem>
            <SelectItem value="To Do">To Do</SelectItem>
            <SelectItem value="In Progress">In Progress</SelectItem>
            <SelectItem value="Done">Done</SelectItem>
          </SelectContent>
        </Select>
        <div className="flex space-x-2">
          <Button onClick={() => setIsFormOpen(true)}>Add Task</Button>
          <Button
            variant="outline"
            onClick={handleLogout}
            className="text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            Logout
          </Button>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white dark:bg-gray-800 rounded-lg shadow-lg">
          <thead className="bg-gray-100 dark:bg-gray-700">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-200 uppercase tracking-wider">
                Icon
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-200 uppercase tracking-wider">
                Title
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-200 uppercase tracking-wider">
                Description
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-200 uppercase tracking-wider">
                Status
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-200 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredTasks.map((task, index) => (
              <tr
                key={task.id}
                className={`
                  border-b dark:border-gray-700
                  ${index % 2 === 0 ? 'bg-white dark:bg-gray-800' : 'bg-gray-50 dark:bg-gray-900/50'}
                  hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200
                `}
              >
                <td className="px-4 py-3">
                  <svg
                    className="w-5 h-5 text-gray-500 dark:text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                    />
                  </svg>
                </td>
                <td className="px-4 py-3 font-medium text-gray-900 dark:text-gray-100 truncate max-w-[150px] sm:max-w-[200px]">
                  {task.title}
                </td>
                <td className="px-4 py-3 text-gray-600 dark:text-gray-400 truncate max-w-[200px] sm:max-w-[300px]">
                  {task.description || 'No description'}
                </td>
                <td className="px-4 py-3">
                  <span
                    className={`
                      inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                      ${task.status === 'To Do' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' : 
                        task.status === 'In Progress' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' : 
                        'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'}
                    `}
                  >
                    {task.status}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                      onClick={() => {
                        setEditingTask(task);
                        setIsFormOpen(true);
                      }}
                    >
                      Edit
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      className="bg-red-700 hover:bg-red-600 dark:hover:bg-red-700"
                      onClick={() => deleteTask(task.id)}
                      disabled={deleteTaskStatus.isPending}
                    >
                      {deleteTaskStatus.isPending ? 'Deleting...' : 'Delete'}
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {isFormOpen && (
        <TaskForm
          task={editingTask}
          onClose={() => {
            setIsFormOpen(false);
            setEditingTask(undefined);
          }}
        />
      )}
    </div>
  );
};

export default TaskList;