import { format } from 'date-fns';
import { Calendar, Clock } from 'lucide-react';
import { cn } from '../../lib/utils';
// Note: We'll need to define shared types properly later, using local for now
interface Task {
    _id: string;
    title: string;
    description: string;
    dueDate: string;
    priority: 'Low' | 'Medium' | 'High' | 'Urgent';
    status: 'To Do' | 'In Progress' | 'Review' | 'Completed';
    assignedToId: { _id: string; name: string } | string;
}

interface TaskCardProps {
    task: Task;
    onClick?: (task: Task) => void;
}

const priorityColors = {
    Low: 'bg-blue-100 text-blue-800',
    Medium: 'bg-green-100 text-green-800',
    High: 'bg-orange-100 text-orange-800',
    Urgent: 'bg-red-100 text-red-800',
};

const statusColors = {
    'To Do': 'bg-gray-100 text-gray-800',
    'In Progress': 'bg-yellow-100 text-yellow-800',
    'Review': 'bg-purple-100 text-purple-800',
    'Completed': 'bg-green-100 text-green-800',
};

/**
 * Component to display a single task summary card.
 */
export default function TaskCard({ task, onClick }: TaskCardProps) {
    return (
        <div
            className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 hover:shadow-md transition-shadow cursor-pointer"
            onClick={() => onClick?.(task)}
        >
            <div className="flex justify-between items-start mb-2">
                <span className={cn("px-2.5 py-0.5 rounded-full text-xs font-medium", priorityColors[task.priority])}>
                    {task.priority}
                </span>
                <span className={cn("px-2.5 py-0.5 rounded-full text-xs font-medium", statusColors[task.status])}>
                    {task.status}
                </span>
            </div>

            <h3 className="text-lg font-medium text-gray-900 mb-1 line-clamp-1">{task.title}</h3>
            <p className="text-sm text-gray-500 mb-4 line-clamp-2">{task.description}</p>

            <div className="flex items-center text-sm text-gray-500 space-x-4">
                <div className="flex items-center">
                    <Calendar className="w-4 h-4 mr-1.5" />
                    {format(new Date(task.dueDate), 'MMM d, yyyy')}
                </div>
                <div className="flex items-center">
                    <Clock className="w-4 h-4 mr-1.5" />
                    {format(new Date(task.dueDate), 'h:mm a')}
                </div>
            </div>
        </div>
    );
}
