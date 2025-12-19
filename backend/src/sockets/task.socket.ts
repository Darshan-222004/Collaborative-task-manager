/**
 * TaskSocket - WebSocket event handlers for real-time task updates across clients
 * Manages Socket.io events for task creation, updates, deletion, and targeted assignment notifications
 */

import { Server } from 'socket.io';
import { AuthenticatedSocket, socketAuthMiddleware, userSocketMap, emitToUser } from '../config/socket';
import logger from '../utils/logger';

/**
 * Initializes Socket.io event handlers for real-time task updates
 */
export const initializeSocket = (io: Server): void => {
    // Apply authentication middleware
    io.use(socketAuthMiddleware);

    io.on('connection', (socket: AuthenticatedSocket) => {
        const userId = socket.userId!;

        logger.info(`User connected: ${userId}`);

        // Store socket mapping
        userSocketMap.set(userId, socket.id);

        // Join user's personal room
        socket.join(`user:${userId}`);

        /**
         * Handle task creation event
         */
        socket.on('task:created', (data) => {
            logger.debug('Task created event received', data);

            // Notify assigned user
            if (data.assignedToId && data.assignedToId !== userId) {
                io.to(`user:${data.assignedToId}`).emit('task:assigned', {
                    task: data,
                    message: `You have been assigned a new task: ${data.title}`,
                });
            }

            // Broadcast to all connected users
            socket.broadcast.emit('task:created', data);
        });

        /**
         * Handle task update event
         */
        socket.on('task:updated', (data) => {
            logger.debug('Task updated event received', data);

            // If assignee changed, notify new assignee
            if (data.assignedToId && data.previousAssignedToId !== data.assignedToId) {
                io.to(`user:${data.assignedToId}`).emit('task:assigned', {
                    task: data,
                    message: `You have been assigned to task: ${data.title}`,
                });
            }

            // Broadcast to all users
            socket.broadcast.emit('task:updated', data);
        });

        /**
         * Handle task deletion event
         */
        socket.on('task:deleted', (data) => {
            logger.debug('Task deleted event received', data);

            // Broadcast to all users
            socket.broadcast.emit('task:deleted', { taskId: data.taskId });
        });

        /**
         * Handle task status change event
         */
        socket.on('task:status_changed', (data) => {
            logger.debug('Task status changed', data);

            // Notify creator if different from updater
            if (data.creatorId && data.creatorId !== userId) {
                io.to(`user:${data.creatorId}`).emit('task:status_changed', data);
            }

            // Broadcast to all users
            socket.broadcast.emit('task:status_changed', data);
        });

        /**
         * Handle disconnection
         */
        socket.on('disconnect', () => {
            logger.info(`User disconnected: ${userId}`);
            userSocketMap.delete(userId);
        });
    });

    logger.info('Socket.io event handlers initialized');
};

/**
 * Emit task assignment notification
 */
export const notifyTaskAssignment = (io: Server, userId: string, task: any): void => {
    io.to(`user:${userId}`).emit('task:assigned', {
        task,
        message: `You have been assigned to task: ${task.title}`,
        timestamp: new Date().toISOString(),
    });
};

/**
 * Broadcast task update to all connected clients
 */
export const broadcastTaskUpdate = (io: Server, task: any): void => {
    io.emit('task:updated', task);
};
