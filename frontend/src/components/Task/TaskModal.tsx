import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { X } from 'lucide-react';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { createPortal } from 'react-dom';

const taskSchema = z.object({
    title: z.string().min(1, 'Title is required').max(100),
    description: z.string().min(1, 'Description is required'),
    dueDate: z.string().min(1, 'Due date is required'), // Simplified validation
    priority: z.enum(['Low', 'Medium', 'High', 'Urgent']),
    status: z.enum(['To Do', 'In Progress', 'Review', 'Completed']),
    assignedToId: z.string().min(1, 'Assignee is required'),
});

type TaskForm = z.infer<typeof taskSchema>;

interface TaskModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (data: TaskForm) => void;
    onDelete?: () => void;
    isLoading?: boolean;
    initialData?: Partial<TaskForm>;
    users?: { _id: string; name: string }[]; // For assignee dropdown
}

/**
 * Modal component for creating and editing tasks.
 * Uses a portal to render outside the main DOM hierarchy.
 */
export default function TaskModal({
    isOpen,
    onClose,
    onSubmit,
    onDelete,
    isLoading,
    initialData,
    users = []
}: TaskModalProps) {
    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<TaskForm>({
        resolver: zodResolver(taskSchema),
        defaultValues: {
            priority: 'Medium',
            status: 'To Do',
            ...initialData,
        },
    });

    // Reset form when initialData changes
    useEffect(() => {
        if (isOpen) {
            reset({
                priority: 'Medium',
                status: 'To Do',
                ...initialData,
                // Ensure date is formatted for input type="datetime-local" if needed
                dueDate: initialData?.dueDate ? new Date(initialData.dueDate).toISOString().slice(0, 16) : undefined
            });
        }
    }, [isOpen, initialData, reset]);

    if (!isOpen) return null;

    return createPortal(
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
            <div className="w-full max-w-lg rounded-lg bg-white shadow-xl">
                <div className="flex items-center justify-between border-b px-6 py-4">
                    <h2 className="text-lg font-semibold text-gray-900">
                        {initialData ? 'Edit Task' : 'Create New Task'}
                    </h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-500">
                        <X className="h-5 w-5" />
                    </button>
                </div>

                <form onSubmit={handleSubmit((data) => {
                    // Convert datetime-local string to ISO string for backend
                    const isoDate = new Date(data.dueDate).toISOString();
                    onSubmit({ ...data, dueDate: isoDate });
                })} className="p-6 space-y-4">
                    <Input
                        label="Title"
                        placeholder="Task title"
                        error={errors.title?.message}
                        {...register('title')}
                    />

                    <div className="space-y-1">
                        <label className="text-sm font-medium text-gray-700">Description</label>
                        <textarea
                            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 min-h-[100px]"
                            placeholder="Task description..."
                            {...register('description')}
                        />
                        {errors.description && (
                            <p className="text-xs text-red-500">{errors.description.message}</p>
                        )}
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <Input
                            label="Due Date"
                            type="datetime-local"
                            error={errors.dueDate?.message}
                            {...register('dueDate')}
                        />

                        <div className="space-y-1">
                            <label className="text-sm font-medium text-gray-700">Priority</label>
                            <select
                                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
                                {...register('priority')}
                            >
                                <option value="Low">Low</option>
                                <option value="Medium">Medium</option>
                                <option value="High">High</option>
                                <option value="Urgent">Urgent</option>
                            </select>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                            <label className="text-sm font-medium text-gray-700">Status</label>
                            <select
                                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
                                {...register('status')}
                            >
                                <option value="To Do">To Do</option>
                                <option value="In Progress">In Progress</option>
                                <option value="Review">Review</option>
                                <option value="Completed">Completed</option>
                            </select>
                        </div>

                        <div className="space-y-1">
                            <label className="text-sm font-medium text-gray-700">Assignee</label>
                            <select
                                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
                                {...register('assignedToId')}
                            >
                                <option value="">Select User</option>
                                {users.map(user => (
                                    <option key={user._id} value={user._id}>
                                        {user.name}
                                    </option>
                                ))}
                            </select>
                            {errors.assignedToId && (
                                <p className="text-xs text-red-500">{errors.assignedToId.message}</p>
                            )}
                        </div>
                    </div>

                    <div className="mt-6 flex justify-between">
                        {initialData && onDelete && (
                            <Button
                                type="button"
                                variant="danger"
                                onClick={onDelete}
                                isLoading={isLoading}
                            >
                                Delete
                            </Button>
                        )}
                        <div className="flex space-x-3 ml-auto">
                            <Button type="button" variant="outline" onClick={onClose}>
                                Cancel
                            </Button>
                            <Button type="submit" isLoading={isLoading}>
                                {initialData ? 'Update Task' : 'Create Task'}
                            </Button>
                        </div>
                    </div>
                </form>
            </div>
        </div>,
        document.body
    );
}
