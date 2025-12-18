import { CreateTaskInput, UpdateTaskInput, TaskQueryInput } from '../dtos/task.dto';
import taskRepository from '../repositories/task.repository';
import userRepository from '../repositories/user.repository';
import { AppError } from '../middlewares/error.middleware';
import logger from '../utils/logger';

/**
 * Task Service - Business logic for task operations
 */
export class TaskService {

    /**
     * Creates a new task
     */
    async createTask(data: CreateTaskInput, creatorId: string): Promise<any> {
        // Verify assigned user exists
        const assignedUser = await userRepository.findById(data.assignedToId);
        if (!assignedUser) {
            throw new AppError('Assigned user not found', 404);
        }

        const task = await taskRepository.create({
            ...data,
            creatorId,
        });

        logger.info(`Task created by ${creatorId}, assigned to ${data.assignedToId}`);

        return task.toJSON();
    }

    /**
     * Gets a task by ID
     */
    async getTaskById(taskId: string): Promise<any> {
        const task = await taskRepository.findById(taskId);
        if (!task) {
            throw new AppError('Task not found', 404);
        }

        return task.toJSON();
    }

    /**
     * Gets all tasks with filtering and pagination
     */
    async getAllTasks(query: TaskQueryInput): Promise<any> {
        const result = await taskRepository.findAll(query);

        return {
            tasks: result.tasks.map((task) => task.toJSON()),
            pagination: {
                total: result.total,
                page: result.page,
                limit: result.limit,
                pages: Math.ceil(result.total / result.limit),
            },
        };
    }

    /**
     * Updates a task
     */
    async updateTask(taskId: string, data: UpdateTaskInput, userId: string): Promise<any> {
        // Check if task exists
        const existingTask = await taskRepository.findById(taskId);
        if (!existingTask) {
            throw new AppError('Task not found', 404);
        }

        // Verify assigned user exists if being changed
        if (data.assignedToId) {
            const assignedUser = await userRepository.findById(data.assignedToId);
            if (!assignedUser) {
                throw new AppError('Assigned user not found', 404);
            }
        }

        const task = await taskRepository.update(taskId, data);

        logger.info(`Task ${taskId} updated by user ${userId}`);

        return task?.toJSON();
    }

    /**
     * Deletes a task
     */
    async deleteTask(taskId: string, userId: string): Promise<void> {
        const task = await taskRepository.findById(taskId);
        if (!task) {
            throw new AppError('Task not found', 404);
        }

        // Only creator can delete
        if (task.creatorId.toString() !== userId) {
            throw new AppError('Only the task creator can delete this task', 403);
        }

        await taskRepository.delete(taskId);

        logger.info(`Task ${taskId} deleted by user ${userId}`);
    }

    /**
     * Gets tasks assigned to a user
     */
    async getAssignedTasks(userId: string): Promise<any[]> {
        const result = await taskRepository.findAll({
            assignedToId: userId,
            sortBy: 'dueDate',
            sortOrder: 'asc',
        });

        return result.tasks.map((task) => task.toJSON());
    }

    /**
     * Gets tasks created by a user
     */
    async getCreatedTasks(userId: string): Promise<any[]> {
        const result = await taskRepository.findAll({
            creatorId: userId,
            sortBy: 'createdAt',
            sortOrder: 'desc',
        });

        return result.tasks.map((task) => task.toJSON());
    }

    /**
     * Gets overdue tasks for a user
     */
    async getOverdueTasks(userId: string): Promise<any[]> {
        const tasks = await taskRepository.findOverdueTasks(userId);
        return tasks.map((task) => task.toJSON());
    }
}

export default new TaskService();
