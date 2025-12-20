"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DashboardController = void 0;
const error_middleware_1 = require("../middlewares/error.middleware");
const task_service_1 = __importDefault(require("../services/task.service"));
/**
 * Dashboard Controller - Provides aggregated statistics and views
 */
class DashboardController {
    constructor() {
        /**
         * Get dashboard statistics for the current user
         * GET /api/v1/dashboard/stats
         */
        this.getStats = (0, error_middleware_1.asyncHandler)(async (req, res) => {
            const userId = req.userId;
            const stats = await task_service_1.default.getDashboardStats(userId);
            res.status(200).json({
                success: true,
                data: stats,
            });
        });
        /**
         * Get tasks assigned to current user
         * GET /api/v1/dashboard/assigned
         */
        this.getAssignedTasks = (0, error_middleware_1.asyncHandler)(async (req, res) => {
            const userId = req.userId;
            const tasks = await task_service_1.default.getTasksAssignedToUser(userId);
            res.status(200).json({
                success: true,
                data: tasks,
            });
        });
        /**
         * Get tasks created by current user
         * GET /api/v1/dashboard/created
         */
        this.getCreatedTasks = (0, error_middleware_1.asyncHandler)(async (req, res) => {
            const userId = req.userId;
            const tasks = await task_service_1.default.getTasksCreatedByUser(userId);
            res.status(200).json({
                success: true,
                data: tasks,
            });
        });
        /**
         * Get overdue tasks for current user
         * GET /api/v1/dashboard/overdue
         */
        this.getOverdueTasks = (0, error_middleware_1.asyncHandler)(async (req, res) => {
            const userId = req.userId;
            const tasks = await task_service_1.default.getOverdueTasks(userId);
            res.status(200).json({
                success: true,
                data: tasks,
            });
        });
    }
}
exports.DashboardController = DashboardController;
exports.default = new DashboardController();
