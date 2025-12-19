import { Router } from 'express';
import dashboardController from '../controllers/dashboard.controller';
import { authenticate } from '../middlewares/auth.middleware';

const router = Router();

/**
 * Dashboard Routes - All routes require authentication
 */

// Get dashboard statistics
router.get('/stats', authenticate, dashboardController.getStats);

// Get tasks assigned to current user
router.get('/assigned', authenticate, dashboardController.getAssignedTasks);

// Get tasks created by current user
router.get('/created', authenticate, dashboardController.getCreatedTasks);

// Get overdue tasks for current user
router.get('/overdue', authenticate, dashboardController.getOverdueTasks);

export default router;
