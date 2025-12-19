import { Response } from 'express';
import { AuthRequest } from '../middlewares/auth.middleware';
import { asyncHandler } from '../middlewares/error.middleware';
import notificationService from '../services/notification.service';

/**
 * Notification Controller - HTTP handlers for notification endpoints
 */
export class NotificationController {

    /**
     * Get all notifications for current user
     * GET /api/v1/notifications
     */
    getNotifications = asyncHandler(async (req: AuthRequest, res: Response): Promise<void> => {
        const userId = req.userId!;
        const includeRead = req.query.includeRead !== 'false'; // Default true

        const notifications = await notificationService.getUserNotifications(userId, includeRead);

        res.status(200).json({
            success: true,
            data: notifications,
        });
    });

    /**
     * Get unread notification count
     * GET /api/v1/notifications/unread-count
     */
    getUnreadCount = asyncHandler(async (req: AuthRequest, res: Response): Promise<void> => {
        const userId = req.userId!;
        const count = await notificationService.getUnreadCount(userId);

        res.status(200).json({
            success: true,
            data: { count },
        });
    });

    /**
     * Mark a notification as read
     * PATCH /api/v1/notifications/:id/read
     */
    markAsRead = asyncHandler(async (req: AuthRequest, res: Response): Promise<void> => {
        const userId = req.userId!;
        const notificationId = req.params.id;

        const notification = await notificationService.markNotificationAsRead(notificationId, userId);

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
    markAllAsRead = asyncHandler(async (req: AuthRequest, res: Response): Promise<void> => {
        const userId = req.userId!;
        const count = await notificationService.markAllAsRead(userId);

        res.status(200).json({
            success: true,
            message: `${count} notifications marked as read`,
            data: { count },
        });
    });
}

export default new NotificationController();
