/**
 * useTasks Hook - React Query hooks for task data fetching, mutations, and real-time Socket.io synchronization
 * Provides CRUD operations, caching, optimistic updates, and automatic cache invalidation on WebSocket events
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../lib/axios';
import { useEffect } from 'react';
import { getSocket } from '../lib/socket';
import toast from 'react-hot-toast';

// Types (should share with backend or be more robust)
interface Task {
    _id: string;
    title: string;
    description: string;
    dueDate: string;
    priority: 'Low' | 'Medium' | 'High' | 'Urgent';
    status: 'To Do' | 'In Progress' | 'Review' | 'Completed';
    creatorId: { _id: string; name: string };
    assignedToId: { _id: string; name: string };
}

interface CreateTaskInput {
    title: string;
    description: string;
    dueDate: string;
    priority: string;
    status: string;
    assignedToId: string;
}

interface UpdateTaskInput extends Partial<CreateTaskInput> { }

/**
 * Hook to fetch all tasks with optional filters
 */
export const useTasks = (filters?: any) => {
    return useQuery({
        queryKey: ['tasks', filters],
        queryFn: async () => {
            // Filter out undefined, null, and empty string values
            const cleanFilters = Object.entries(filters || {}).reduce((acc, [key, value]) => {
                if (value !== undefined && value !== null && value !== '') {
                    acc[key] = value;
                }
                return acc;
            }, {} as Record<string, any>);

            const params = new URLSearchParams(cleanFilters);
            const response = await api.get<{ data: Task[] }>(`/tasks?${params.toString()}`);
            return response.data.data;
        },
    });
};

/**
 * Hook for task mutations (Create, Update, Delete)
 */
export const useTaskMutations = () => {
    const queryClient = useQueryClient();

    const createTask = useMutation({
        mutationFn: async (data: CreateTaskInput) => {
            const response = await api.post('/tasks', data);
            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['tasks'] });
            toast.success('Task created successfully');
        },
    });

    const updateTask = useMutation({
        mutationFn: async ({ id, data }: { id: string; data: UpdateTaskInput }) => {
            const response = await api.patch(`/tasks/${id}`, data);
            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['tasks'] });
            toast.success('Task updated successfully');
        },
    });

    const deleteTask = useMutation({
        mutationFn: async (id: string) => {
            await api.delete(`/tasks/${id}`);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['tasks'] });
            toast.success('Task deleted');
        },
    });

    return { createTask, updateTask, deleteTask };
};

/**
 * Hook to fetch all users for assignment dropdown
 */
export const useUsers = () => {
    return useQuery({
        queryKey: ['users'],
        queryFn: async () => {
            const response = await api.get<{ data: { _id: string; name: string }[] }>('/auth/users');
            return response.data.data;
        },
    });
};

/**
 * Hook to listen for real-time task updates
 */
export const useTaskSocket = () => {
    const queryClient = useQueryClient();

    useEffect(() => {
        const socket = getSocket();
        if (!socket.connected) socket.connect();

        const handleTaskUpdate = () => {
            queryClient.invalidateQueries({ queryKey: ['tasks'] });
            // Identify detailed update type if possible, or just re-fetch
            // Could also update cache directly for stricter optimistic UI
        };

        socket.on('task:created', handleTaskUpdate);
        socket.on('task:updated', handleTaskUpdate);
        socket.on('task:deleted', handleTaskUpdate);
        socket.on('task:status_changed', handleTaskUpdate); // If backend emits this specific event

        return () => {
            socket.off('task:created', handleTaskUpdate);
            socket.off('task:updated', handleTaskUpdate);
            socket.off('task:deleted', handleTaskUpdate);
            socket.off('task:status_changed', handleTaskUpdate);
        };
    }, [queryClient]);
};
