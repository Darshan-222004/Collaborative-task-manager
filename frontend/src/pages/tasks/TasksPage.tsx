/**
 * TasksPage - Main task management view with filtering, sorting, and real-time updates
 * Displays all tasks in a grid with filters for status/priority, search, and task creation modal integration
 */

import { useState } from 'react';
import { Plus, Filter, SortAsc } from 'lucide-react';
import { useTasks, useTaskMutations, useUsers, useTaskSocket } from '../../hooks/useTasks';
import TaskCard from '../../components/Task/TaskCard';
import TaskModal from '../../components/Task/TaskModal';
import { Button } from '../../components/ui/Button';

export default function TasksPage() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingTask, setEditingTask] = useState<any>(null);
    const [filterStatus, setFilterStatus] = useState<string>('');
    const [sortBy, setSortBy] = useState<string>('dueDate'); // default sort

    // Real-time updates
    useTaskSocket();

    // Data fetching
    const { data: tasks = [], isLoading, error } = useTasks({
        status: filterStatus || undefined,
        sortBy,
    });

    const { data: users = [] } = useUsers();
    const { createTask, updateTask, deleteTask } = useTaskMutations();

    const handleCreate = (data: any) => {
        createTask.mutate(data, {
            onSuccess: () => {
                setIsModalOpen(false);
            }
        });
    };

    const handleUpdate = (data: any) => {
        if (!editingTask) return;
        updateTask.mutate({ id: editingTask._id, data }, {
            onSuccess: () => {
                setIsModalOpen(false);
                setEditingTask(null);
            }
        });
    };

    const handleEditClick = (task: any) => {
        setEditingTask(task);
        setIsModalOpen(true);
    };

    const handleModalClose = () => {
        setIsModalOpen(false);
        setEditingTask(null);
    };

    const handleDelete = () => {
        if (!editingTask) return;
        if (confirm('Are you sure you want to delete this task?')) {
            deleteTask.mutate(editingTask._id, {
                onSuccess: () => {
                    setIsModalOpen(false);
                    setEditingTask(null);
                }
            });
        }
    };

    if (error) return <div className="p-8 text-red-500">Error loading tasks</div>;

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <h1 className="text-2xl font-semibold text-gray-900">All Tasks</h1>
                <Button onClick={() => setIsModalOpen(true)}>
                    <Plus className="h-4 w-4 mr-2" />
                    New Task
                </Button>
            </div>

            {/* Filters & Control Bar */}
            <div className="flex flex-wrap items-center gap-4 bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                <div className="flex items-center gap-2">
                    <Filter className="h-4 w-4 text-gray-400" />
                    <select
                        className="text-sm border-none focus:ring-0 text-gray-600 font-medium"
                        value={filterStatus}
                        onChange={(e) => setFilterStatus(e.target.value)}
                    >
                        <option value="">All Statuses</option>
                        <option value="To Do">To Do</option>
                        <option value="In Progress">In Progress</option>
                        <option value="Review">Review</option>
                        <option value="Completed">Completed</option>
                    </select>
                </div>

                <div className="h-4 w-px bg-gray-200" />

                <div className="flex items-center gap-2">
                    <SortAsc className="h-4 w-4 text-gray-400" />
                    <select
                        className="text-sm border-none focus:ring-0 text-gray-600 font-medium"
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value)}
                    >
                        <option value="dueDate">Due Date</option>
                        <option value="createdAt">Created Date</option>
                        <option value="priority">Priority</option>
                    </select>
                </div>
            </div>

            {/* Task Grid */}
            {isLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[1, 2, 3].map((n) => (
                        <div key={n} className="h-48 bg-gray-100 rounded-lg animate-pulse" />
                    ))}
                </div>
            ) : tasks.length === 0 ? (
                <div className="text-center py-12 bg-white rounded-lg border border-dashed border-gray-300">
                    <p className="text-gray-500">No tasks found. Create one to get started!</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {tasks.map((task: any) => (
                        <TaskCard
                            key={task._id}
                            task={task}
                            onClick={handleEditClick}
                        />
                    ))}
                </div>
            )}

            {/* Create/Edit Modal */}
            <TaskModal
                isOpen={isModalOpen}
                onClose={handleModalClose}
                onSubmit={editingTask ? handleUpdate : handleCreate}
                onDelete={editingTask ? handleDelete : undefined}
                isLoading={createTask.isPending || updateTask.isPending || deleteTask.isPending}
                initialData={editingTask}
                users={users}
            />
        </div>
    );
}
