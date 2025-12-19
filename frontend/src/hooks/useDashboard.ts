import { useQuery } from '@tanstack/react-query';
import { dashboardApi } from '../api/dashboard';

/**
 * Hook to fetch dashboard statistics
 */
export const useDashboardStats = () => {
    return useQuery({
        queryKey: ['dashboard', 'stats'],
        queryFn: dashboardApi.getStats,
    });
};

/**
 * Hook to fetch tasks assigned to current user
 */
export const useAssignedTasks = () => {
    return useQuery({
        queryKey: ['dashboard', 'assigned'],
        queryFn: dashboardApi.getAssignedTasks,
    });
};

/**
 * Hook to fetch tasks created by current user
 */
export const useCreatedTasks = () => {
    return useQuery({
        queryKey: ['dashboard', 'created'],
        queryFn: dashboardApi.getCreatedTasks,
    });
};

/**
 * Hook to fetch overdue tasks
 */
export const useOverdueTasks = () => {
    return useQuery({
        queryKey: ['dashboard', 'overdue'],
        queryFn: dashboardApi.getOverdueTasks,
    });
};
