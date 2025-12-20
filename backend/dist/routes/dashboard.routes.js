"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const dashboard_controller_1 = __importDefault(require("../controllers/dashboard.controller"));
const auth_middleware_1 = require("../middlewares/auth.middleware");
const router = (0, express_1.Router)();
/**
 * Dashboard Routes - All routes require authentication
 */
// Get dashboard statistics
router.get('/stats', auth_middleware_1.authenticate, dashboard_controller_1.default.getStats);
// Get tasks assigned to current user
router.get('/assigned', auth_middleware_1.authenticate, dashboard_controller_1.default.getAssignedTasks);
// Get tasks created by current user
router.get('/created', auth_middleware_1.authenticate, dashboard_controller_1.default.getCreatedTasks);
// Get overdue tasks for current user
router.get('/overdue', auth_middleware_1.authenticate, dashboard_controller_1.default.getOverdueTasks);
exports.default = router;
