"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const task_controller_1 = __importDefault(require("../controllers/task.controller"));
const auth_middleware_1 = require("../middlewares/auth.middleware");
const router = (0, express_1.Router)();
/**
 * Task Routes - All routes require authentication
 */
router.use(auth_middleware_1.authenticate);
// Dashboard routes
router.get('/assigned/me', task_controller_1.default.getMyAssignedTasks);
router.get('/created/me', task_controller_1.default.getMyCreatedTasks);
router.get('/overdue/me', task_controller_1.default.getMyOverdueTasks);
// CRUD routes
router.post('/', task_controller_1.default.createTask);
router.get('/', task_controller_1.default.getAllTasks);
router.get('/:id', task_controller_1.default.getTaskById);
router.patch('/:id', task_controller_1.default.updateTask);
router.delete('/:id', task_controller_1.default.deleteTask);
exports.default = router;
