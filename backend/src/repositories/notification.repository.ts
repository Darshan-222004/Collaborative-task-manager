import { Notification, INotification, NotificationType } from '../models/Notification';
import logger from '../utils/logger';

/**
 * Notification Repository - Database operations for notifications
 */
export class NotificationRepository {

    /**
     * Creates a new notification
     */
    async create(notificationData: {
        userId: string;
        taskId: string;
        type: NotificationType;
        message: string;
    }): Promise<INotification> {
        try {
            const notification = new Notification(notificationData);
            await notification.save();
            logger.info(`Notification created for user ${notificationData.userId}`);
            return notification;
        } catch (error) {
            logger.error('Error creating notification:', error);
            throw error;
        }
    }

    /**
     * Gets all notifications for a user
     */
    async findByUserId(userId: string, includeRead: boolean = true): Promise<INotification[]> {
        try {
            const filter: any = { userId };
            if (!includeRead) {
                filter.isRead = false;
            }

            const notifications = await Notification.find(filter)
                .populate('taskId', 'title status priority')
                .sort({ createdAt: -1 })
                .limit(50); // Limit to recent 50 notifications

            return notifications;
        } catch (error) {
            logger.error('Error fetching notifications:', error);
            throw error;
        }
    }

    /**
     * Marks a notification as read
     */
    async markAsRead(notificationId: string, userId: string): Promise<INotification | null> {
        try {
            const notification = await Notification.findOneAndUpdate(
                { _id: notificationId, userId }, // Ensure user owns this notification
                { $set: { isRead: true } },
                { new: true }
            ).populate('taskId', 'title status priority');

            if (notification) {
                logger.info(`Notification ${notificationId} marked as read`);
            }

            return notification;
        } catch (error) {
            logger.error('Error marking notification as read:', error);
            throw error;
        }
    }

    /**
     * Marks all notifications as read for a user
     */
    async markAllAsRead(userId: string): Promise<number> {
        try {
            const result = await Notification.updateMany(
                { userId, isRead: false },
                { $set: { isRead: true } }
            );

            logger.info(`Marked ${result.modifiedCount} notifications as read for user ${userId}`);
            return result.modifiedCount;
        } catch (error) {
            logger.error('Error marking all notifications as read:', error);
            throw error;
        }
    }

    /**
     * Gets count of unread notifications
     */
    async getUnreadCount(userId: string): Promise<number> {
        try {
            const count = await Notification.countDocuments({
                userId,
                isRead: false,
            });
            return count;
        } catch (error) {
            logger.error('Error getting unread notification count:', error);
            throw error;
        }
    }

    /**
     * Deletes old read notifications (cleanup)
     */
    async deleteOldReadNotifications(daysOld: number = 30): Promise<number> {
        try {
            const cutoffDate = new Date();
            cutoffDate.setDate(cutoffDate.getDate() - daysOld);

            const result = await Notification.deleteMany({
                isRead: true,
                createdAt: { $lt: cutoffDate },
            });

            logger.info(`Deleted ${result.deletedCount} old notifications`);
            return result.deletedCount;
        } catch (error) {
            logger.error('Error deleting old notifications:', error);
            throw error;
        }
    }
}

export default new NotificationRepository();
