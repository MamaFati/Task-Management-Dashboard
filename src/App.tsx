import TaskList from '@/components/taskList';

function App() {
  return (
    <div className="flex items-center justify-center bg-gray-100  w-full p-4">
      <div>
        <h1 className="text-2xl font-bold mb-4">Task Management Dashboard</h1>
        <TaskList />
      </div>
    </div>
  );
}

export default App;