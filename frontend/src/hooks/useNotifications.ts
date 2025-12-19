/**
 * useNotifications Hook - React Query hooks for notification fetching and mutations with auto-refetch
 * Manages notification list, unread count, mark as read actions, and automatic polling for new notifications
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { notificationApi, Notification } from '../api/notifications';
import toast from 'react-hot-toast';

/**
 * Hook to fetch user's notifications
 */
export const useNotifications = (includeRead: boolean = true) => {
    return useQuery({
        queryKey: ['notifications', includeRead],
        queryFn: () => notificationApi.getNotifications(includeRead),
        refetchInterval: 30000, // Refetch every 30 seconds
    });
};

/**
 * Hook to get unread notification count
 */
export const useUnreadCount = () => {
    return useQuery({
        queryKey: ['notifications', 'unreadCount'],
        queryFn: notificationApi.getUnreadCount,
        refetchInterval: 15000, // Refetch every 15 seconds
    });
};

/**
 * Mutation to mark notification as read
 */
export const useMarkAsRead = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: notificationApi.markAsRead,
        onSuccess: () => {
            // Invalidate and refetch notifications
            queryClient.invalidateQueries({ queryKey: ['notifications'] });
        },
        onError: () => {
            toast.error('Failed to mark notification as read');
        },
    });
};

/**
 * Mutation to mark all notifications as read
 */
export const useMarkAllAsRead = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: notificationApi.markAllAsRead,
        onSuccess: (count) => {
            // Invalidate and refetch all notification queries
            queryClient.invalidateQueries({ queryKey: ['notifications'] });
            toast.success(`${count} notifications marked as read`);
        },
        onError: () => {
            toast.error('Failed to mark all notifications as read');
        },
    });
};
