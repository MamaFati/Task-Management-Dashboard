import { useForm } from 'react-hook-form';
import { useTasks } from '@/hooks/useTask';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import type { Task } from '@/hooks/useTask';

interface TaskFormProps {
  task?: Task; // Optional for editing
  onClose: () => void;
}

interface FormData {
  title: string;
  description?: string;
  status: 'To Do' | 'In Progress' | 'Done';
}

const TaskForm = ({ task, onClose }: TaskFormProps) => {
  const { register, handleSubmit, formState: { errors }, reset, setValue } = useForm<FormData>({
    defaultValues: task
      ? { title: task.title, description: task.description, status: task.status }
      : { title: '', description: '', status: 'To Do' },
  });
  const { addTask, updateTask, addTaskStatus, updateTaskStatus } = useTasks();

  const onSubmit = (data: FormData) => {
    if (task) {
      updateTask({ id: task.id, todo: data });
    } else {
      addTask(data);
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
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              placeholder="Enter task title"
              {...register('title', { required: 'Title is required' })}
            />
            {errors.title && (
              <p className="text-red-500 text-sm mt-1">{errors.title.message}</p>
            )}
          </div>
          <div>
            <Label htmlFor="description">Description</Label>
            <Input
              id="description"
              placeholder="Enter task description (optional)"
              {...register('description')}
            />
          </div>
          <div>
            <Label htmlFor="status">Status</Label>
            <Select
              defaultValue={task?.status || 'To Do'}
              onValueChange={(value) => setValue('status', value as 'To Do' | 'In Progress' | 'Done')}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="To Do">To Do</SelectItem>
                <SelectItem value="In Progress">In Progress</SelectItem>
                <SelectItem value="Done">Done</SelectItem>
              </SelectContent>
            </Select>
            {errors.status && (
              <p className="text-red-500 text-sm mt-1">{errors.status.message}</p>
            )}
          </div>
          <div className="flex justify-end space-x-2">
            <Button variant="outline" type="button" onClick={onClose}>
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={addTaskStatus.isPending || updateTaskStatus.isPending}
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