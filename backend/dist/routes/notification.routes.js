"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const notification_controller_1 = __importDefault(require("../controllers/notification.controller"));
const auth_middleware_1 = require("../middlewares/auth.middleware");
const router = (0, express_1.Router)();
/**
 * Notification Routes - All routes require authentication
 */
// Get all notifications
router.get('/', auth_middleware_1.authenticate, notification_controller_1.default.getNotifications);
// Get unread count
router.get('/unread-count', auth_middleware_1.authenticate, notification_controller_1.default.getUnreadCount);
// Mark single notification as read
router.patch('/:id/read', auth_middleware_1.authenticate, notification_controller_1.default.markAsRead);
// Mark all notifications as read
router.patch('/mark-all-read', auth_middleware_1.authenticate, notification_controller_1.default.markAllAsRead);
exports.default = router;
