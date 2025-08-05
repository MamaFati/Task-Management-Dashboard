import { useForm } from 'react-hook-form';
import { useTasks } from '@/hooks/useTask';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import type { Task } from '@/hooks/useTask';
import type { RootState } from '@/store';
import { useSelector } from 'react-redux';

interface TaskFormProps {
  task?: Task;
  onClose: () => void;
}

interface FormData {
  todo: string;
  completed: boolean;
}

const TaskForm = ({ task, onClose }: TaskFormProps) => {
  const { register, handleSubmit, formState: { errors }, reset, setValue } = useForm<FormData>({
    defaultValues: task
      ? { todo: task.todo, completed: task.completed }
      : { todo: '', completed: false },
  });
  const { addTask, updateTask, addTaskStatus, updateTaskStatus } = useTasks();
  const user = useSelector((state: RootState) => state.auth.user);

  const onSubmit = (data: FormData) => {
    const payload = { ...data, userId: user?.id || 152 }; // Fallback to 152 if no user
    if (task) {
      updateTask({ id: task.id, todo: payload });
    } else {
      addTask(payload);
    }
    reset();
    onClose();
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{task ? 'Edit Task' : 'Add Task'}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <Label htmlFor="todo">Task</Label>
            <Input
              id="todo"
              placeholder="Enter task"
              {...register('todo', { required: 'Task is required' })}
            />
            {errors.todo && (
              <p className="text-red-500 text-sm mt-1">{errors.todo.message}</p>
            )}
          </div>
          <div>
            <Label htmlFor="completed">Status</Label>
            <Select
              defaultValue={task?.completed ? 'Done' : 'Pending'}
              onValueChange={(value) => setValue('completed', value === 'Done')}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Pending">Pending</SelectItem>
                <SelectItem value="Done">Done</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex justify-end space-x-2">
            <Button variant="outline" type="button" onClick={onClose}>
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={addTaskStatus.isPending || updateTaskStatus.isPending}
              className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600"
            >
              {addTaskStatus.isPending || updateTaskStatus.isPending ? 'Saving...' : 'Save'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default TaskForm;