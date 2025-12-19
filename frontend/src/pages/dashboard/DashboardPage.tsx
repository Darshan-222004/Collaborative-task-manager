/**
 * DashboardPage - User dashboard displaying task statistics, assigned/created tasks, and overdue items with hero section
 * Features real-time stats, completion metrics, quick navigation, and skeleton loading states for optimal UX
 */

import { Link } from 'react-router-dom';
import { useDashboardStats, useAssignedTasks, useCreatedTasks, useOverdueTasks } from '../../hooks/useDashboard';
import TaskCard from '../../components/Task/TaskCard';
import { useAuthStore } from '../../store/authStore';
import {
    Activity,
    AlertTriangle,
    CheckCircle2,
    ClipboardList,
    Clock3,
    Rocket,
    Sparkles
} from 'lucide-react';
import { Button } from '../../components/ui/Button';

export default function DashboardPage() {
    const { user } = useAuthStore();
    const { data: stats, isLoading: statsLoading } = useDashboardStats();
    const { data: assignedTasks = [], isLoading: assignedLoading } = useAssignedTasks();
    const { data: createdTasks = [], isLoading: createdLoading } = useCreatedTasks();
    const { data: overdueTasks = [], isLoading: overdueLoading } = useOverdueTasks();

    const completionRate = stats?.total
        ? Math.round(((stats.completed ?? 0) / stats.total) * 100)
        : 0;

    const statCards = [
        {
            label: 'Total Tasks',
            value: stats?.total ?? 0,
            icon: ClipboardList,
            tone: 'from-primary-50 via-white to-primary-100',
            pill: 'Workspace',
            iconBg: 'bg-primary-100 text-primary-700',
            subtitle: "Everything you're tracking"
        },
        {
            label: 'Completed',
            value: stats?.completed ?? 0,
            icon: CheckCircle2,
            tone: 'from-emerald-50 via-white to-emerald-100',
            pill: 'Shipped',
            iconBg: 'bg-emerald-100 text-emerald-700',
            subtitle: 'Wins for the team'
        },
        {
            label: 'Pending',
            value: stats?.pending ?? 0,
            icon: Activity,
            tone: 'from-indigo-50 via-white to-indigo-100',
            pill: 'In motion',
            iconBg: 'bg-indigo-100 text-indigo-700',
            subtitle: 'Currently being worked on'
        },
        {
            label: 'Overdue',
            value: stats?.overdue ?? 0,
            icon: AlertTriangle,
            tone: 'from-rose-50 via-white to-rose-100',
            pill: 'Attention',
            iconBg: 'bg-rose-100 text-rose-700',
            subtitle: 'Needs action soon'
        },
    ];

    return (
        <div className="space-y-8 animate-fade-in">
            {/* Hero */}
            <section className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-primary-600 via-primary-500 to-accent-600 text-white shadow-2xl">
                <div className="absolute inset-0 opacity-40 bg-[radial-gradient(circle_at_top_left,#fff,transparent_50%)]" />
                <div className="absolute inset-y-0 right-0 w-1/3 bg-white/10 blur-3xl" />

                <div className="relative p-8 md:p-10 space-y-6">
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                        <div className="space-y-3 max-w-3xl">
                            <p className="text-sm uppercase tracking-[0.2em] text-white/70">Welcome back</p>
                            <div className="flex items-center gap-2 text-3xl md:text-4xl font-bold">
                                <span>Hey {user?.name ? user.name : 'there'},</span>
                                <Sparkles className="h-7 w-7 text-amber-200 drop-shadow" />
                            </div>
                            <p className="text-white/80 text-base max-w-2xl">
                                Your mission control for everything tasks. Glide through stats, spot risks early,
                                and keep the team in flow.
                            </p>

                            <div className="flex flex-wrap items-center gap-3">
                                <Link
                                    to="/tasks"
                                    className="inline-flex items-center gap-2 rounded-xl bg-white text-primary-700 px-4 py-2.5 text-sm font-semibold shadow-lg shadow-primary-900/20 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-xl"
                                >
                                    <ClipboardList className="h-4 w-4" />
                                    Open tasks board
                                </Link>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    className="border-white/50 text-white hover:bg-white/10 hover:text-white"
                                >
                                    <Activity className="mr-2 h-4 w-4" />
                                    Live updates on
                                </Button>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4 min-w-[240px] lg:min-w-[280px]">
                            <div className="rounded-2xl border border-white/30 bg-white/10 backdrop-blur-xl p-4 shadow-lg">
                                <div className="flex items-center justify-between text-sm text-white/70">
                                    <span>Completion</span>
                                    <CheckCircle2 className="h-4 w-4" />
                                </div>
                                <p className="mt-2 text-3xl font-semibold">{completionRate}%</p>
                                <div className="mt-3 h-2 w-full rounded-full bg-white/20 overflow-hidden">
                                    <div
                                        className="h-full rounded-full bg-gradient-to-r from-white to-amber-200"
                                        style={{ width: `${completionRate}%` }}
                                    />
                                </div>
                            </div>
                            <div className="rounded-2xl border border-white/30 bg-white/10 backdrop-blur-xl p-4 shadow-lg">
                                <div className="flex items-center justify-between text-sm text-white/70">
                                    <span>Overdue</span>
                                    <Clock3 className="h-4 w-4" />
                                </div>
                                <p className="mt-2 text-3xl font-semibold flex items-center gap-2">
                                    {stats?.overdue ?? 0}
                                    <span className="text-xs font-medium text-white/70">tasks</span>
                                </p>
                                <p className="mt-2 text-xs text-white/80 flex items-center gap-2">
                                    <AlertTriangle className="h-4 w-4 text-amber-200" />
                                    Stay ahead of deadlines today.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
                {statsLoading ? (
                    Array.from({ length: 4 }).map((_, i) => (
                        <div
                            key={i}
                            className="overflow-hidden rounded-2xl bg-white/60 backdrop-blur border border-gray-100 px-4 py-5 sm:p-6 shadow animate-pulse"
                        >
                            <div className="h-4 bg-gray-100 rounded w-24 mb-3" />
                            <div className="h-8 bg-gray-100 rounded w-16" />
                        </div>
                    ))
                ) : (
                    statCards.map((card) => (
                        <div
                            key={card.label}
                            className="group relative overflow-hidden rounded-2xl border border-gray-100 bg-white/90 backdrop-blur shadow-md transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl"
                        >
                            <div className={`absolute inset-0 bg-gradient-to-br ${card.tone} opacity-70`} />
                            <div className="relative p-5 space-y-3">
                                <div className="flex items-center justify-between">
                                    <span className="inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold bg-white/70 text-gray-700 shadow-sm">
                                        {card.pill}
                                    </span>
                                    <div className={`rounded-xl p-2 ${card.iconBg} shadow-sm`}>
                                        <card.icon className="h-5 w-5" />
                                    </div>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-600">{card.label}</p>
                                    <p className="text-3xl font-bold text-gray-900">{card.value}</p>
                                </div>
                                <p className="text-xs text-gray-500">{card.subtitle}</p>
                                <div className="h-1 w-full rounded-full bg-white/70">
                                    <div className="h-full w-3/4 rounded-full bg-gradient-to-r from-primary-500 to-accent-500 group-hover:w-full transition-all duration-500" />
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* Task & focus sections */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                <div className="xl:col-span-2 space-y-6">
                    {/* My Assigned Tasks */}
                    <div className="rounded-2xl border border-gray-100 bg-white/90 backdrop-blur shadow-lg hover:shadow-xl transition-shadow">
                        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
                            <div className="flex items-center gap-3">
                                <div className="p-2 rounded-xl bg-primary-50 text-primary-700">
                                    <Activity className="h-5 w-5" />
                                </div>
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-900">My Assigned Tasks</h3>
                                    <p className="text-sm text-gray-500">Up to three of your next priorities</p>
                                </div>
                            </div>
                            <Link
                                to="/tasks"
                                className="text-sm font-semibold text-primary-600 hover:text-primary-700"
                            >
                                View all
                            </Link>
                        </div>
                        <div className="px-5 py-5">
                            {assignedLoading ? (
                                <div className="space-y-3">
                                    {Array.from({ length: 3 }).map((_, i) => (
                                        <div key={i} className="h-32 bg-gray-100 rounded-xl animate-pulse" />
                                    ))}
                                </div>
                            ) : assignedTasks.length === 0 ? (
                                <div className="mt-2 text-center text-sm text-gray-500 py-10 rounded-xl border border-dashed border-gray-200">
                                    Nothing assigned yet. Enjoy the calm or grab a task to start.
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
                    <div className="rounded-2xl border border-gray-100 bg-white/90 backdrop-blur shadow-lg hover:shadow-xl transition-shadow">
                        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
                            <div className="flex items-center gap-3">
                                <div className="p-2 rounded-xl bg-accent-50 text-accent-700">
                                    <Rocket className="h-5 w-5" />
                                </div>
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-900">Tasks I Created</h3>
                                    <p className="text-sm text-gray-500">What you've kicked off recently</p>
                                </div>
                            </div>
                            <Link
                                to="/tasks"
                                className="text-sm font-semibold text-primary-600 hover:text-primary-700"
                            >
                                Manage
                            </Link>
                        </div>
                        <div className="px-5 py-5">
                            {createdLoading ? (
                                <div className="space-y-3">
                                    {Array.from({ length: 3 }).map((_, i) => (
                                        <div key={i} className="h-32 bg-gray-100 rounded-xl animate-pulse" />
                                    ))}
                                </div>
                            ) : createdTasks.length === 0 ? (
                                <div className="mt-2 text-center text-sm text-gray-500 py-10 rounded-xl border border-dashed border-gray-200">
                                    You haven't created tasks yet. Spin up a new one to set the pace.
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

                <div className="space-y-6">
                    {/* Focus card */}
                    <div className="relative overflow-hidden rounded-2xl border border-gray-100 bg-gradient-to-br from-white via-white to-primary-50 shadow-lg">
                        <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-primary-100 blur-3xl" />
                        <div className="relative p-5 space-y-4">
                            <div className="flex items-start justify-between gap-3">
                                <div>
                                    <p className="text-xs font-semibold uppercase tracking-wide text-primary-600">Momentum</p>
                                    <h3 className="text-lg font-semibold text-gray-900">Keep work flowing</h3>
                                    <p className="text-sm text-gray-600">A quick health check on your current slate.</p>
                                </div>
                                <div className="p-2 rounded-xl bg-primary-50 text-primary-700">
                                    <Activity className="h-5 w-5" />
                                </div>
                            </div>

                            <div className="space-y-3">
                                <div className="flex items-center justify-between text-sm text-gray-600">
                                    <span className="flex items-center gap-2">
                                        <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                                        Completion
                                    </span>
                                    <span className="text-gray-900 font-semibold">{completionRate}%</span>
                                </div>
                                <div className="h-2 w-full rounded-full bg-gray-100 overflow-hidden">
                                    <div
                                        className="h-full rounded-full bg-gradient-to-r from-primary-500 via-primary-400 to-accent-500"
                                        style={{ width: `${completionRate}%` }}
                                    />
                                </div>

                                <div className="flex items-center justify-between text-sm text-gray-600">
                                    <span className="flex items-center gap-2">
                                        <Clock3 className="h-4 w-4 text-indigo-500" />
                                        Pending
                                    </span>
                                    <span className="text-gray-900 font-semibold">{stats?.pending ?? 0}</span>
                                </div>
                                <div className="flex items-center justify-between text-sm text-gray-600">
                                    <span className="flex items-center gap-2">
                                        <AlertTriangle className="h-4 w-4 text-rose-500" />
                                        Overdue
                                    </span>
                                    <span className="text-gray-900 font-semibold">{stats?.overdue ?? 0}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Overdue Tasks */}
                    <div className="rounded-2xl border border-gray-100 bg-white/90 backdrop-blur shadow-lg hover:shadow-xl transition-shadow">
                        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
                            <div className="flex items-center gap-3">
                                <div className="p-2 rounded-xl bg-rose-50 text-rose-700">
                                    <Clock3 className="h-5 w-5" />
                                </div>
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-900">Overdue Tasks</h3>
                                    <p className="text-sm text-gray-500">Pull these back on track</p>
                                </div>
                            </div>
                            <span className="rounded-full bg-rose-100 text-rose-700 px-3 py-1 text-xs font-semibold">
                                {overdueTasks.length} items
                            </span>
                        </div>

                        <div className="px-5 py-5">
                            {overdueLoading ? (
                                <div className="space-y-3">
                                    {Array.from({ length: 2 }).map((_, i) => (
                                        <div key={i} className="h-28 bg-gray-100 rounded-xl animate-pulse" />
                                    ))}
                                </div>
                            ) : overdueTasks.length === 0 ? (
                                <div className="text-center text-sm text-gray-500 py-10 rounded-xl border border-dashed border-gray-200">
                                    No overdue work. Keep the streak going!
                                </div>
                            ) : (
                                <div className="space-y-3 max-h-[520px] overflow-auto pr-1 custom-scrollbar">
                                    {overdueTasks.map((task: any) => (
                                        <TaskCard key={task._id} task={task} />
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
