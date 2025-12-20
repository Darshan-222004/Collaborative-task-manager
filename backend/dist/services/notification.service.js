"use strict";
/**
 * NotificationService - Business logic for creating and managing persistent in-app notifications
 * Handles notification creation for task assignments/updates and provides methods for marking notifications as read
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationService = void 0;
const notification_repository_1 = __importDefault(require("../repositories/notification.repository"));
const Notification_1 = require("../models/Notification");
const logger_1 = __importDefault(require("../utils/logger"));
/**
 * Notification Service - Business logic for notifications
 */
class NotificationService {
    /**
     * Creates a task assignment notification
     */
    async createTaskAssignmentNotification(userId, taskId, taskTitle) {
        const notification = await notification_repository_1.default.create({
            userId,
            taskId,
            type: Notification_1.NotificationType.TASK_ASSIGNED,
            message: `You have been assigned to task: "${taskTitle}"`,
        });
        logger_1.default.info(`Task assignment notification created for user ${userId}`);
        return notification.toJSON();
    }
    /**
     * Creates a task update notification
     */
    async createTaskUpdateNotification(userId, taskId, taskTitle, updateType) {
        const notification = await notification_repository_1.default.create({
            userId,
            taskId,
            type: Notification_1.NotificationType.TASK_UPDATED,
            message: `Task "${taskTitle}" was ${updateType}`,
        });
        logger_1.default.info(`Task update notification created for user ${userId}`);
        return notification.toJSON();
    }
    /**
     * Gets all notifications for a user
     */
    async getUserNotifications(userId, includeRead = true) {
        const notifications = await notification_repository_1.default.findByUserId(userId, includeRead);
        return notifications.map(n => n.toJSON());
    }
    /**
     * Marks a notification as read
     */
    async markNotificationAsRead(notificationId, userId) {
        const notification = await notification_repository_1.default.markAsRead(notificationId, userId);
        if (!notification) {
            throw new Error('Notification not found or access denied');
        }
        return notification.toJSON();
    }
    /**
     * Marks all notifications as read
     */
    async markAllAsRead(userId) {
        const count = await notification_repository_1.default.markAllAsRead(userId);
        return count;
    }
    /**
     * Gets unread notification count
     */
    async getUnreadCount(userId) {
        return await notification_repository_1.default.getUnreadCount(userId);
    }
}
exports.NotificationService = NotificationService;
exports.default = new NotificationService();
