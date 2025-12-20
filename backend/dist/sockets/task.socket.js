"use strict";
/**
 * TaskSocket - WebSocket event handlers for real-time task updates across clients
 * Manages Socket.io events for task creation, updates, deletion, and targeted assignment notifications
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.broadcastTaskUpdate = exports.notifyTaskAssignment = exports.initializeSocket = void 0;
const socket_1 = require("../config/socket");
const logger_1 = __importDefault(require("../utils/logger"));
/**
 * Initializes Socket.io event handlers for real-time task updates
 */
const initializeSocket = (io) => {
    // Apply authentication middleware
    io.use(socket_1.socketAuthMiddleware);
    io.on('connection', (socket) => {
        const userId = socket.userId;
        logger_1.default.info(`User connected: ${userId}`);
        // Store socket mapping
        socket_1.userSocketMap.set(userId, socket.id);
        // Join user's personal room
        socket.join(`user:${userId}`);
        /**
         * Handle task creation event
         */
        socket.on('task:created', (data) => {
            logger_1.default.debug('Task created event received', data);
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
            logger_1.default.debug('Task updated event received', data);
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
            logger_1.default.debug('Task deleted event received', data);
            // Broadcast to all users
            socket.broadcast.emit('task:deleted', { taskId: data.taskId });
        });
        /**
         * Handle task status change event
         */
        socket.on('task:status_changed', (data) => {
            logger_1.default.debug('Task status changed', data);
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
            logger_1.default.info(`User disconnected: ${userId}`);
            socket_1.userSocketMap.delete(userId);
        });
    });
    logger_1.default.info('Socket.io event handlers initialized');
};
exports.initializeSocket = initializeSocket;
/**
 * Emit task assignment notification
 */
const notifyTaskAssignment = (io, userId, task) => {
    io.to(`user:${userId}`).emit('task:assigned', {
        task,
        message: `You have been assigned to task: ${task.title}`,
        timestamp: new Date().toISOString(),
    });
};
exports.notifyTaskAssignment = notifyTaskAssignment;
/**
 * Broadcast task update to all connected clients
 */
const broadcastTaskUpdate = (io, task) => {
    io.emit('task:updated', task);
};
exports.broadcastTaskUpdate = broadcastTaskUpdate;
