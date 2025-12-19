import notificationRepository from '../repositories/notification.repository';
import { NotificationType } from '../models/Notification';
import logger from '../utils/logger';

/**
 * Notification Service - Business logic for notifications
 */
export class NotificationService {

    /**
     * Creates a task assignment notification
     */
    async createTaskAssignmentNotification(
        userId: string,
        taskId: string,
        taskTitle: string
    ): Promise<any> {
        const notification = await notificationRepository.create({
            userId,
            taskId,
            type: NotificationType.TASK_ASSIGNED,
            message: `You have been assigned to task: "${taskTitle}"`,
        });

        logger.info(`Task assignment notification created for user ${userId}`);
        return notification.toJSON();
    }

    /**
     * Creates a task update notification
     */
    async createTaskUpdateNotification(
        userId: string,
        taskId: string,
        taskTitle: string,
        updateType: string
    ): Promise<any> {
        const notification = await notificationRepository.create({
            userId,
            taskId,
            type: NotificationType.TASK_UPDATED,
            message: `Task "${taskTitle}" was ${updateType}`,
        });

        logger.info(`Task update notification created for user ${userId}`);
        return notification.toJSON();
    }

    /**
     * Gets all notifications for a user
     */
    async getUserNotifications(userId: string, includeRead: boolean = true): Promise<any[]> {
        const notifications = await notificationRepository.findByUserId(userId, includeRead);
        return notifications.map(n => n.toJSON());
    }

    /**
     * Marks a notification as read
     */
    async markNotificationAsRead(notificationId: string, userId: string): Promise<any> {
        const notification = await notificationRepository.markAsRead(notificationId, userId);
        if (!notification) {
            throw new Error('Notification not found or access denied');
        }
        return notification.toJSON();
    }

    /**
     * Marks all notifications as read
     */
    async markAllAsRead(userId: string): Promise<number> {
        const count = await notificationRepository.markAllAsRead(userId);
        return count;
    }

    /**
     * Gets unread notification count
     */
    async getUnreadCount(userId: string): Promise<number> {
        return await notificationRepository.getUnreadCount(userId);
    }
}

export default new NotificationService();
