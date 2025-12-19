import { Request, Response } from 'express';
import { AuthRequest } from '../middlewares/auth.middleware';
import { asyncHandler } from '../middlewares/error.middleware';
import taskService from '../services/task.service';

/**
 * Dashboard Controller - Provides aggregated statistics and views
 */
export class DashboardController {

    /**
     * Get dashboard statistics for the current user
     * GET /api/v1/dashboard/stats
     */
    getStats = asyncHandler(async (req: AuthRequest, res: Response): Promise<void> => {
        const userId = req.userId!;
        const stats = await taskService.getDashboardStats(userId);

        res.status(200).json({
            success: true,
            data: stats,
        });
    });

    /**
     * Get tasks assigned to current user
     * GET /api/v1/dashboard/assigned
     */
    getAssignedTasks = asyncHandler(async (req: AuthRequest, res: Response): Promise<void> => {
        const userId = req.userId!;
        const tasks = await taskService.getTasksAssignedToUser(userId);

        res.status(200).json({
            success: true,
            data: tasks,
        });
    });

    /**
     * Get tasks created by current user
     * GET /api/v1/dashboard/created
     */
    getCreatedTasks = asyncHandler(async (req: AuthRequest, res: Response): Promise<void> => {
        const userId = req.userId!;
        const tasks = await taskService.getTasksCreatedByUser(userId);

        res.status(200).json({
            success: true,
            data: tasks,
        });
    });

    /**
     * Get overdue tasks for current user
     * GET /api/v1/dashboard/overdue
     */
    getOverdueTasks = asyncHandler(async (req: AuthRequest, res: Response): Promise<void> => {
        const userId = req.userId!;
        const tasks = await taskService.getOverdueTasks(userId);

        res.status(200).json({
            success: true,
            data: tasks,
        });
    });
}

export default new DashboardController();
