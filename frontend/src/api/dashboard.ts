/**
 * Dashboard API Service - HTTP client functions for fetching dashboard statistics and task lists
 * Provides methods to retrieve aggregated stats, assigned tasks, created tasks, and overdue tasks for current user
 */

import api from '../lib/axios';

/**
 * Dashboard API Service
 */

interface DashboardStats {
    total: number;
    completed: number;
    pending: number;
    overdue: number;
    assignedToMe: number;
    createdByMe: number;
}

export const dashboardApi = {
    /**
     * Get dashboard statistics
     */
    getStats: async (): Promise<DashboardStats> => {
        const response = await api.get<{ success: boolean; data: DashboardStats }>('/dashboard/stats');
        return response.data.data;
    },

    /**
     * Get tasks assigned to current user
     */
    getAssignedTasks: async (): Promise<any[]> => {
        const response = await api.get<{ success: boolean; data: any[] }>('/dashboard/assigned');
        return response.data.data;
    },

    /**
     * Get tasks created by current user
     */
    getCreatedTasks: async (): Promise<any[]> => {
        const response = await api.get<{ success: boolean; data: any[] }>('/dashboard/created');
        return response.data.data;
    },

    /**
     * Get overdue tasks
     */
    getOverdueTasks: async (): Promise<any[]> => {
        const response = await api.get<{ success: boolean; data: any[] }>('/dashboard/overdue');
        return response.data.data;
    },
};
