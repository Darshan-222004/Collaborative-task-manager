"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TaskController = void 0;
const task_service_1 = __importDefault(require("../services/task.service"));
const task_dto_1 = require("../dtos/task.dto");
const error_middleware_1 = require("../middlewares/error.middleware");
/**
 * Task Controller - HTTP handlers for task endpoints
 */
class TaskController {
    constructor() {
        /**
         * Create a new task
         * POST /api/v1/tasks
         */
        this.createTask = (0, error_middleware_1.asyncHandler)(async (req, res) => {
            const validatedData = task_dto_1.CreateTaskDTO.parse(req.body);
            const task = await task_service_1.default.createTask(validatedData, req.userId);
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
        this.getAllTasks = (0, error_middleware_1.asyncHandler)(async (req, res) => {
            const validatedQuery = task_dto_1.TaskQueryDTO.parse(req.query);
            const result = await task_service_1.default.getAllTasks(validatedQuery);
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
        this.getTaskById = (0, error_middleware_1.asyncHandler)(async (req, res) => {
            const task = await task_service_1.default.getTaskById(req.params.id);
            res.status(200).json({
                success: true,
                data: task,
            });
        });
        /**
         * Update a task
         * PATCH /api/v1/tasks/:id
         */
        this.updateTask = (0, error_middleware_1.asyncHandler)(async (req, res) => {
            const validatedData = task_dto_1.UpdateTaskDTO.parse(req.body);
            const task = await task_service_1.default.updateTask(req.params.id, validatedData, req.userId);
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
        this.deleteTask = (0, error_middleware_1.asyncHandler)(async (req, res) => {
            await task_service_1.default.deleteTask(req.params.id, req.userId);
            res.status(200).json({
                success: true,
                message: 'Task deleted successfully',
            });
        });
        /**
         * Get tasks assigned to current user
         * GET /api/v1/tasks/assigned/me
         */
        this.getMyAssignedTasks = (0, error_middleware_1.asyncHandler)(async (req, res) => {
            const tasks = await task_service_1.default.getAssignedTasks(req.userId);
            res.status(200).json({
                success: true,
                data: tasks,
            });
        });
        /**
         * Get tasks created by current user
         * GET /api/v1/tasks/created/me
         */
        this.getMyCreatedTasks = (0, error_middleware_1.asyncHandler)(async (req, res) => {
            const tasks = await task_service_1.default.getCreatedTasks(req.userId);
            res.status(200).json({
                success: true,
                data: tasks,
            });
        });
        /**
         * Get overdue tasks for current user
         * GET /api/v1/tasks/overdue/me
         */
        this.getMyOverdueTasks = (0, error_middleware_1.asyncHandler)(async (req, res) => {
            const tasks = await task_service_1.default.getOverdueTasks(req.userId);
            res.status(200).json({
                success: true,
                data: tasks,
            });
        });
    }
}
exports.TaskController = TaskController;
exports.default = new TaskController();
