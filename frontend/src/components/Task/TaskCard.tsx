import { format } from 'date-fns';
import { Calendar, Clock, AlertCircle } from 'lucide-react';
import { cn } from '../../lib/utils';

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

const priorityConfig = {
    Low: {
        bg: 'bg-gradient-to-r from-blue-50 to-blue-100',
        text: 'text-blue-700',
        border: 'border-l-4 border-blue-500',
        icon: 'text-blue-500'
    },
    Medium: {
        bg: 'bg-gradient-to-r from-green-50 to-green-100',
        text: 'text-green-700',
        border: 'border-l-4 border-green-500',
        icon: 'text-green-500'
    },
    High: {
        bg: 'bg-gradient-to-r from-orange-50 to-orange-100',
        text: 'text-orange-700',
        border: 'border-l-4 border-orange-500',
        icon: 'text-orange-500'
    },
    Urgent: {
        bg: 'bg-gradient-to-r from-red-50 to-red-100',
        text: 'text-red-700',
        border: 'border-l-4 border-red-500',
        icon: 'text-red-500'
    },
};

const statusColors = {
    'To Do': 'bg-gray-100 text-gray-700 border border-gray-300',
    'In Progress': 'bg-yellow-100 text-yellow-700 border border-yellow-300',
    'Review': 'bg-purple-100 text-purple-700 border border-purple-300',
    'Completed': 'bg-green-100 text-green-700 border border-green-300',
};

/**
 * Enhanced task card component with modern design, gradients, and animations.
 */
export default function TaskCard({ task, onClick }: TaskCardProps) {
    const config = priorityConfig[task.priority];
    const isOverdue = new Date(task.dueDate) < new Date() && task.status !== 'Completed';

    return (
        <div
            className={cn(
                "group relative bg-white rounded-xl shadow-md border border-gray-200 p-5 cursor-pointer",
                "transition-all duration-300 hover:shadow-2xl hover:-translate-y-1",
                "animate-fade-in",
                config.border
            )}
            onClick={() => onClick?.(task)}
        >
            {/* Priority indicator gradient overlay */}
            <div className={cn("absolute top-0 right-0 w-24 h-24 opacity-10 rounded-bl-full", config.bg)} />

            {/* Header with badges */}
            <div className="flex justify-between items-start mb-3 relative z-10">
                <span className={cn(
                    "px-3 py-1 rounded-full text-xs font-semibold",
                    config.bg,
                    config.text
                )}>
                    {task.priority}
                </span>
                <span className={cn(
                    "px-3 py-1 rounded-full text-xs font-medium",
                    statusColors[task.status]
                )}>
                    {task.status}
                </span>
            </div>

            {/* Task content */}
            <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-1 group-hover:text-primary-700 transition-colors">
                {task.title}
            </h3>
            <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                {task.description}
            </p>

            {/* Footer with date/time */}
            <div className="flex items-center justify-between text-sm text-gray-500">
                <div className="flex items-center space-x-4">
                    <div className="flex items-center">
                        <Calendar className="w-4 h-4 mr-1.5" />
                        <span>{format(new Date(task.dueDate), 'MMM d, yyyy')}</span>
                    </div>
                    <div className="flex items-center">
                        <Clock className="w-4 h-4 mr-1.5" />
                        <span>{format(new Date(task.dueDate), 'h:mm a')}</span>
                    </div>
                </div>

                {isOverdue && (
                    <div className="flex items-center text-red-600 font-medium">
                        <AlertCircle className="w-4 h-4 mr-1" />
                        <span className="text-xs">Overdue</span>
                    </div>
                )}
            </div>

            {/* Hover effect indicator */}
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-primary-500 to-accent-500 rounded-b-xl transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300" />
        </div>
    );
}
