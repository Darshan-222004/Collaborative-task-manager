/**
 * Main API Router - Central routing configuration consolidating all API endpoint modules
 * Mounts authentication, task management, dashboard, and notification routes under /api/v1prefix
 */

import { Router } from 'express';
import authRoutes from './auth.routes';
import taskRoutes from './task.routes';
import dashboardRoutes from './dashboard.routes';
import notificationRoutes from './notification.routes';

const router = Router();

/**
 * Central route definitions
 */
router.use('/auth', authRoutes);
router.use('/tasks', taskRoutes);
router.use('/dashboard', dashboardRoutes);
router.use('/notifications', notificationRoutes);

export default router;
