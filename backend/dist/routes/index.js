"use strict";
/**
 * Main API Router - Central routing configuration consolidating all API endpoint modules
 * Mounts authentication, task management, dashboard, and notification routes under /api/v1prefix
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_routes_1 = __importDefault(require("./auth.routes"));
const task_routes_1 = __importDefault(require("./task.routes"));
const dashboard_routes_1 = __importDefault(require("./dashboard.routes"));
const notification_routes_1 = __importDefault(require("./notification.routes"));
const router = (0, express_1.Router)();
/**
 * Central route definitions
 */
router.use('/auth', auth_routes_1.default);
router.use('/tasks', task_routes_1.default);
router.use('/dashboard', dashboard_routes_1.default);
router.use('/notifications', notification_routes_1.default);
exports.default = router;
