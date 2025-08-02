import { useTasks } from '@/hooks/useTask';
import { Button} from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';


const TaskList = () => {
  const { tasks, isLoading, error } = useTasks();

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

  if (!tasks || tasks.length === 0) {
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
          {tasks.map((task, index) => (
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
                    
                    onClick={() => alert('Edit not implemented yet')}
                  >
                    Edit
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                     
                    onClick={() => alert('Delete not implemented yet')}
                  >
                    Delete
                  </Button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TaskList;