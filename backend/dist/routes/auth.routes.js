"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_controller_1 = __importDefault(require("../controllers/auth.controller"));
const auth_middleware_1 = require("../middlewares/auth.middleware");
const router = (0, express_1.Router)();
/**
 * Auth Routes
 */
// Public routes
router.post('/register', auth_controller_1.default.register);
router.post('/login', auth_controller_1.default.login);
// Protected routes
router.get('/profile', auth_middleware_1.authenticate, auth_controller_1.default.getProfile);
router.patch('/profile', auth_middleware_1.authenticate, auth_controller_1.default.updateProfile);
router.get('/users', auth_middleware_1.authenticate, auth_controller_1.default.getAllUsers);
exports.default = router;
