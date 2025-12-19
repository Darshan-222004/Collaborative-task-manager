import { useDashboardStats, useAssignedTasks, useCreatedTasks, useOverdueTasks } from '../../hooks/useDashboard';
import TaskCard from '../../components/Task/TaskCard';

export default function DashboardPage() {
    const { data: stats, isLoading: statsLoading } = useDashboardStats();
    const { data: assignedTasks = [], isLoading: assignedLoading } = useAssignedTasks();
    const { data: createdTasks = [], isLoading: createdLoading } = useCreatedTasks();
    const { data: overdueTasks = [], isLoading: overdueLoading } = useOverdueTasks();

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-semibold text-gray-900">Dashboard</h1>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
                {statsLoading ? (
                    // Loading skeleton
                    Array.from({ length: 4 }).map((_, i) => (
                        <div key={i} className="overflow-hidden rounded-lg bg-gray-100 shadow px-4 py-5 sm:p-6 animate-pulse">
                            <div className="h-4 bg-gray-200 rounded w-24 mb-2"></div>
                            <div className="h-8 bg-gray-200 rounded w-16"></div>
                        </div>
                    ))
                ) : (
                    <>
                        <div className="overflow-hidden rounded-lg bg-white shadow px-4 py-5 sm:p-6">
                            <dt className="truncate text-sm font-medium text-gray-500">Total Tasks</dt>
                            <dd className="mt-1 text-3xl font-semibold tracking-tight text-gray-900">{stats?.total ?? 0}</dd>
                        </div>
                        <div className="overflow-hidden rounded-lg bg-white shadow px-4 py-5 sm:p-6">
                            <dt className="truncate text-sm font-medium text-gray-500">Completed</dt>
                            <dd className="mt-1 text-3xl font-semibold tracking-tight text-green-600">{stats?.completed ?? 0}</dd>
                        </div>
                        <div className="overflow-hidden rounded-lg bg-white shadow px-4 py-5 sm:p-6">
                            <dt className="truncate text-sm font-medium text-gray-500">Pending</dt>
                            <dd className="mt-1 text-3xl font-semibold tracking-tight text-yellow-600">{stats?.pending ?? 0}</dd>
                        </div>
                        <div className="overflow-hidden rounded-lg bg-white shadow px-4 py-5 sm:p-6">
                            <dt className="truncate text-sm font-medium text-gray-500">Overdue</dt>
                            <dd className="mt-1 text-3xl font-semibold tracking-tight text-red-600">{stats?.overdue ?? 0}</dd>
                        </div>
                    </>
                )}
            </div>

            {/* Recent Tasks */}
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                {/* My Assigned Tasks */}
                <div className="bg-white shadow sm:rounded-lg">
                    <div className="px-4 py-5 sm:p-6">
                        <h3 className="text-base font-semibold leading-6 text-gray-900 mb-4">My Assigned Tasks</h3>
                        {assignedLoading ? (
                            <div className="space-y-3">
                                {Array.from({ length: 3 }).map((_, i) => (
                                    <div key={i} className="h-32 bg-gray-100 rounded animate-pulse"></div>
                                ))}
                            </div>
                        ) : assignedTasks.length === 0 ? (
                            <div className="mt-4 text-center text-sm text-gray-500 py-8">
                                No tasks assigned yet.
                            </div>
                        ) : (
                            <div className="space-y-3">
                                {assignedTasks.slice(0, 3).map((task: any) => (
                                    <TaskCard key={task._id} task={task} />
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* Tasks I Created */}
                <div className="bg-white shadow sm:rounded-lg">
                    <div className="px-4 py-5 sm:p-6">
                        <h3 className="text-base font-semibold leading-6 text-gray-900 mb-4">Tasks I Created</h3>
                        {createdLoading ? (
                            <div className="space-y-3">
                                {Array.from({ length: 3 }).map((_, i) => (
                                    <div key={i} className="h-32 bg-gray-100 rounded animate-pulse"></div>
                                ))}
                            </div>
                        ) : createdTasks.length === 0 ? (
                            <div className="mt-4 text-center text-sm text-gray-500 py-8">
                                No tasks created yet.
                            </div>
                        ) : (
                            <div className="space-y-3">
                                {createdTasks.slice(0, 3).map((task: any) => (
                                    <TaskCard key={task._id} task={task} />
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Overdue Tasks Section */}
            {!overdueLoading && overdueTasks.length > 0 && (
                <div className="bg-white shadow sm:rounded-lg">
                    <div className="px-4 py-5 sm:p-6">
                        <h3 className="text-base font-semibold leading-6 text-red-700 mb-4">⚠️ Overdue Tasks</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {overdueTasks.map((task: any) => (
                                <TaskCard key={task._id} task={task} />
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
