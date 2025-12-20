"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationController = void 0;
const error_middleware_1 = require("../middlewares/error.middleware");
const notification_service_1 = __importDefault(require("../services/notification.service"));
/**
 * Notification Controller - HTTP handlers for notification endpoints
 */
class NotificationController {
    constructor() {
        /**
         * Get all notifications for current user
         * GET /api/v1/notifications
         */
        this.getNotifications = (0, error_middleware_1.asyncHandler)(async (req, res) => {
            const userId = req.userId;
            const includeRead = req.query.includeRead !== 'false'; // Default true
            const notifications = await notification_service_1.default.getUserNotifications(userId, includeRead);
            res.status(200).json({
                success: true,
                data: notifications,
            });
        });
        /**
         * Get unread notification count
         * GET /api/v1/notifications/unread-count
         */
        this.getUnreadCount = (0, error_middleware_1.asyncHandler)(async (req, res) => {
            const userId = req.userId;
            const count = await notification_service_1.default.getUnreadCount(userId);
            res.status(200).json({
                success: true,
                data: { count },
            });
        });
        /**
         * Mark a notification as read
         * PATCH /api/v1/notifications/:id/read
         */
        this.markAsRead = (0, error_middleware_1.asyncHandler)(async (req, res) => {
            const userId = req.userId;
            const notificationId = req.params.id;
            const notification = await notification_service_1.default.markNotificationAsRead(notificationId, userId);
            res.status(200).json({
                success: true,
                message: 'Notification marked as read',
                data: notification,
            });
        });
        /**
         * Mark all notifications as read
         * PATCH /api/v1/notifications/mark-all-read
         */
        this.markAllAsRead = (0, error_middleware_1.asyncHandler)(async (req, res) => {
            const userId = req.userId;
            const count = await notification_service_1.default.markAllAsRead(userId);
            res.status(200).json({
                success: true,
                message: `${count} notifications marked as read`,
                data: { count },
            });
        });
    }
}
exports.NotificationController = NotificationController;
exports.default = new NotificationController();
