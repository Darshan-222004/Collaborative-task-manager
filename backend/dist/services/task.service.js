"use strict";
/**
 * TaskService - Core business logic layer for all task-related operations and workflows
 * Orchestrates task creation, updates, validation, assignment logic, and notification triggers between repositories
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TaskService = void 0;
const task_repository_1 = __importDefault(require("../repositories/task.repository"));
const user_repository_1 = __importDefault(require("../repositories/user.repository"));
const error_middleware_1 = require("../middlewares/error.middleware");
const logger_1 = __importDefault(require("../utils/logger"));
const notification_service_1 = __importDefault(require("./notification.service"));
/**
 * Task Service - Business logic for task operations
 */
class TaskService {
    /**
     * Creates a new task
     */
    async createTask(data, creatorId) {
        // Verify assigned user exists
        const assignedUser = await user_repository_1.default.findById(data.assignedToId);
        if (!assignedUser) {
            throw new error_middleware_1.AppError('Assigned user not found', 404);
        }
        const task = await task_repository_1.default.create({
            ...data,
            creatorId,
        });
        logger_1.default.info(`Task created by ${creatorId}, assigned to ${data.assignedToId}`);
        // Create notification for assigned user (if not assigning to self)
        if (data.assignedToId !== creatorId) {
            await notification_service_1.default.createTaskAssignmentNotification(data.assignedToId, task._id.toString(), data.title);
        }
        return task.toJSON();
    }
    /**
     * Gets a task by ID
     */
    async getTaskById(taskId) {
        const task = await task_repository_1.default.findById(taskId);
        if (!task) {
            throw new error_middleware_1.AppError('Task not found', 404);
        }
        return task.toJSON();
    }
    /**
     * Gets all tasks with filtering and pagination
     */
    async getAllTasks(query) {
        const result = await task_repository_1.default.findAll(query);
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
    async updateTask(taskId, data, userId) {
        // Check if task exists
        const existingTask = await task_repository_1.default.findById(taskId);
        if (!existingTask) {
            throw new error_middleware_1.AppError('Task not found', 404);
        }
        // Verify assigned user exists if being changed
        if (data.assignedToId) {
            const assignedUser = await user_repository_1.default.findById(data.assignedToId);
            if (!assignedUser) {
                throw new error_middleware_1.AppError('Assigned user not found', 404);
            }
        }
        const task = await task_repository_1.default.update(taskId, data);
        logger_1.default.info(`Task ${taskId} updated by user ${userId}`);
        return task?.toJSON();
    }
    /**
     * Deletes a task
     */
    async deleteTask(taskId, userId) {
        const task = await task_repository_1.default.findById(taskId);
        if (!task) {
            throw new error_middleware_1.AppError('Task not found', 404);
        }
        // Only creator can delete
        if (task.creatorId.toString() !== userId) {
            throw new error_middleware_1.AppError('Only the task creator can delete this task', 403);
        }
        await task_repository_1.default.delete(taskId);
        logger_1.default.info(`Task ${taskId} deleted by user ${userId}`);
    }
    /**
     * Gets tasks assigned to a user
     */
    async getTasksAssignedToUser(userId) {
        const result = await task_repository_1.default.findAll({
            assignedToId: userId,
            sortBy: 'dueDate',
            sortOrder: 'asc',
            page: 1,
            limit: 100,
        });
        return result.tasks.map((task) => task.toJSON());
    }
    /**
     * Gets tasks created by a user
     */
    async getTasksCreatedByUser(userId) {
        const result = await task_repository_1.default.findAll({
            creatorId: userId,
            sortBy: 'createdAt',
            sortOrder: 'desc',
            page: 1,
            limit: 100,
        });
        return result.tasks.map((task) => task.toJSON());
    }
    /**
     * Gets overdue tasks for a user
     */
    async getOverdueTasks(userId) {
        const tasks = await task_repository_1.default.findOverdueTasks(userId);
        return tasks.map((task) => task.toJSON());
    }
    /**
     * Gets dashboard statistics for a user
     */
    async getDashboardStats(userId) {
        const [assignedTasks, createdTasks, overdueTasks] = await Promise.all([
            this.getTasksAssignedToUser(userId),
            this.getTasksCreatedByUser(userId),
            this.getOverdueTasks(userId),
        ]);
        // Calculate statistics
        const total = assignedTasks.length + createdTasks.length;
        const completed = [...assignedTasks, ...createdTasks].filter(task => task.status === 'Completed').length;
        const pending = [...assignedTasks, ...createdTasks].filter(task => task.status !== 'Completed').length;
        return {
            total,
            completed,
            pending,
            overdue: overdueTasks.length,
            assignedToMe: assignedTasks.length,
            createdByMe: createdTasks.length,
        };
    }
}
exports.TaskService = TaskService;
exports.default = new TaskService();
