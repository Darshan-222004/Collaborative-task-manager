import api from '../lib/axios';

/**
 * Notification API Service
 */

export interface Notification {
    _id: string;
    userId: string;
    taskId: {
        _id: string;
        title: string;
        status: string;
        priority: string;
    };
    type: 'task_assigned' | 'task_updated' | 'task_completed';
    message: string;
    isRead: boolean;
    createdAt: string;
}

export const notificationApi = {
    /**
     * Get all notifications for current user
     */
    getNotifications: async (includeRead: boolean = true): Promise<Notification[]> => {
        const response = await api.get<{ success: boolean; data: Notification[] }>(
            `/notifications?includeRead=${includeRead}`
        );
        return response.data.data;
    },

    /**
     * Get unread notification count
     */
    getUnreadCount: async (): Promise<number> => {
        const response = await api.get<{ success: boolean; data: { count: number } }>(
            '/notifications/unread-count'
        );
        return response.data.data.count;
    },

    /**
     * Mark notification as read
     */
    markAsRead: async (notificationId: string): Promise<Notification> => {
        const response = await api.patch<{ success: boolean; data: Notification }>(
            `/notifications/${notificationId}/read`
        );
        return response.data.data;
    },

    /**
     * Mark all notifications as read
     */
    markAllAsRead: async (): Promise<number> => {
        const response = await api.patch<{ success: boolean; data: { count: number } }>(
            '/notifications/mark-all-read'
        );
        return response.data.data.count;
    },
};
