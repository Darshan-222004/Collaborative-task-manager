import { Request, Response } from 'express';
import taskService from '../services/task.service';
import { CreateTaskDTO, UpdateTaskDTO, TaskQueryDTO } from '../dtos/task.dto';
import { asyncHandler } from '../middlewares/error.middleware';
import { AuthRequest } from '../middlewares/auth.middleware';

/**
 * Task Controller - HTTP handlers for task endpoints
 */
export class TaskController {

    /**
     * Create a new task
     * POST /api/v1/tasks
     */
    createTask = asyncHandler(async (req: AuthRequest, res: Response): Promise<void> => {
        const validatedData = CreateTaskDTO.parse(req.body);
        const task = await taskService.createTask(validatedData, req.userId!);

        res.status(201).json({
            success: true,
            message: 'Task created successfully',
            data: task,
        });
    });

    /**
     * Get all tasks with filtering and pagination
     * GET /api/v1/tasks
     */
    getAllTasks = asyncHandler(async (req: Request, res: Response): Promise<void> => {
        const validatedQuery = TaskQueryDTO.parse(req.query);
        const result = await taskService.getAllTasks(validatedQuery);

        res.status(200).json({
            success: true,
            data: result.tasks,
            pagination: result.pagination,
        });
    });

    /**
     * Get task by ID
     * GET /api/v1/tasks/:id
     */
    getTaskById = asyncHandler(async (req: Request, res: Response): Promise<void> => {
        const task = await taskService.getTaskById(req.params.id);

        res.status(200).json({
            success: true,
            data: task,
        });
    });

    /**
     * Update a task
     * PATCH /api/v1/tasks/:id
     */
    updateTask = asyncHandler(async (req: AuthRequest, res: Response): Promise<void> => {
        const validatedData = UpdateTaskDTO.parse(req.body);
        const task = await taskService.updateTask(req.params.id, validatedData, req.userId!);

        res.status(200).json({
            success: true,
            message: 'Task updated successfully',
            data: task,
        });
    });

    /**
     * Delete a task
     * DELETE /api/v1/tasks/:id
     */
    deleteTask = asyncHandler(async (req: AuthRequest, res: Response): Promise<void> => {
        await taskService.deleteTask(req.params.id, req.userId!);

        res.status(200).json({
            success: true,
            message: 'Task deleted successfully',
        });
    });

    /**
     * Get tasks assigned to current user
     * GET /api/v1/tasks/assigned/me
     */
    getMyAssignedTasks = asyncHandler(async (req: AuthRequest, res: Response): Promise<void> => {
        const tasks = await taskService.getAssignedTasks(req.userId!);

        res.status(200).json({
            success: true,
            data: tasks,
        });
    });

    /**
     * Get tasks created by current user
     * GET /api/v1/tasks/created/me
     */
    getMyCreatedTasks = asyncHandler(async (req: AuthRequest, res: Response): Promise<void> => {
        const tasks = await taskService.getCreatedTasks(req.userId!);

        res.status(200).json({
            success: true,
            data: tasks,
        });
    });

    /**
     * Get overdue tasks for current user
     * GET /api/v1/tasks/overdue/me
     */
    getMyOverdueTasks = asyncHandler(async (req: AuthRequest, res: Response): Promise<void> => {
        const tasks = await taskService.getOverdueTasks(req.userId!);

        res.status(200).json({
            success: true,
            data: tasks,
        });
    });
}

export default new TaskController();
