"use strict";
/**
 * NotificationRepository - Data access layer for Notification collection in MongoDB
 * Handles CRUD operations for notifications including filtering by read status and counting unread items
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationRepository = void 0;
const Notification_1 = __importDefault(require("../models/Notification"));
const logger_1 = __importDefault(require("../utils/logger"));
/**
 * Notification Repository - Database operations for notifications
 */
class NotificationRepository {
    /**
     * Creates a new notification
     */
    async create(notificationData) {
        try {
            const notification = new Notification_1.default(notificationData);
            await notification.save();
            logger_1.default.info(`Notification created for user ${notificationData.userId}`);
            return notification;
        }
        catch (error) {
            logger_1.default.error('Error creating notification:', error);
            throw error;
        }
    }
    /**
     * Gets all notifications for a user
     */
    async findByUserId(userId, includeRead = true) {
        try {
            const filter = { userId };
            if (!includeRead) {
                filter.isRead = false;
            }
            const notifications = await Notification_1.default.find(filter)
                .populate('taskId', 'title status priority')
                .sort({ createdAt: -1 })
                .limit(50); // Limit to recent 50 notifications
            return notifications;
        }
        catch (error) {
            logger_1.default.error('Error fetching notifications:', error);
            throw error;
        }
    }
    /**
     * Marks a notification as read
     */
    async markAsRead(notificationId, userId) {
        try {
            const notification = await Notification_1.default.findOneAndUpdate({ _id: notificationId, userId }, // Ensure user owns this notification
            { $set: { isRead: true } }, { new: true }).populate('taskId', 'title status priority');
            if (notification) {
                logger_1.default.info(`Notification ${notificationId} marked as read`);
            }
            return notification;
        }
        catch (error) {
            logger_1.default.error('Error marking notification as read:', error);
            throw error;
        }
    }
    /**
     * Marks all notifications as read for a user
     */
    async markAllAsRead(userId) {
        try {
            const result = await Notification_1.default.updateMany({ userId, isRead: false }, { $set: { isRead: true } });
            logger_1.default.info(`Marked ${result.modifiedCount} notifications as read for user ${userId}`);
            return result.modifiedCount;
        }
        catch (error) {
            logger_1.default.error('Error marking all notifications as read:', error);
            throw error;
        }
    }
    /**
     * Gets count of unread notifications
     */
    async getUnreadCount(userId) {
        try {
            const count = await Notification_1.default.countDocuments({
                userId,
                isRead: false,
            });
            return count;
        }
        catch (error) {
            logger_1.default.error('Error getting unread notification count:', error);
            throw error;
        }
    }
    /**
     * Deletes old read notifications (cleanup)
     */
    async deleteOldReadNotifications(daysOld = 30) {
        try {
            const cutoffDate = new Date();
            cutoffDate.setDate(cutoffDate.getDate() - daysOld);
            const result = await Notification_1.default.deleteMany({
                isRead: true,
                createdAt: { $lt: cutoffDate },
            });
            logger_1.default.info(`Deleted ${result.deletedCount} old notifications`);
            return result.deletedCount;
        }
        catch (error) {
            logger_1.default.error('Error deleting old notifications:', error);
            throw error;
        }
    }
}
exports.NotificationRepository = NotificationRepository;
exports.default = new NotificationRepository();
