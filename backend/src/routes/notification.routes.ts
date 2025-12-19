import { Router } from 'express';
import notificationController from '../controllers/notification.controller';
import { authenticate } from '../middlewares/auth.middleware';

const router = Router();

/**
 * Notification Routes - All routes require authentication
 */

// Get all notifications
router.get('/', authenticate, notificationController.getNotifications);

// Get unread count
router.get('/unread-count', authenticate, notificationController.getUnreadCount);

// Mark single notification as read
router.patch('/:id/read', authenticate, notificationController.markAsRead);

// Mark all notifications as read
router.patch('/mark-all-read', authenticate, notificationController.markAllAsRead);

export default router;
