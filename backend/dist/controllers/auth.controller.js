"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
const auth_service_1 = __importDefault(require("../services/auth.service"));
const auth_dto_1 = require("../dtos/auth.dto");
const error_middleware_1 = require("../middlewares/error.middleware");
/**
 * Auth Controller - HTTP handlers for authentication endpoints
 */
class AuthController {
    constructor() {
        /**
         * Register a new user
         * POST /api/v1/auth/register
         */
        this.register = (0, error_middleware_1.asyncHandler)(async (req, res) => {
            const validatedData = auth_dto_1.RegisterDTO.parse(req.body);
            const result = await auth_service_1.default.register(validatedData);
            res.status(201).json({
                success: true,
                message: 'User registered successfully',
                data: result,
            });
        });
        /**
         * Login existing user
         * POST /api/v1/auth/login
         */
        this.login = (0, error_middleware_1.asyncHandler)(async (req, res) => {
            const validatedData = auth_dto_1.LoginDTO.parse(req.body);
            const result = await auth_service_1.default.login(validatedData);
            res.status(200).json({
                success: true,
                message: 'Login successful',
                data: result,
            });
        });
        /**
         * Get current user profile
         * GET /api/v1/auth/profile
         */
        this.getProfile = (0, error_middleware_1.asyncHandler)(async (req, res) => {
            const user = await auth_service_1.default.getProfile(req.userId);
            res.status(200).json({
                success: true,
                data: user,
            });
        });
        /**
         * Update current user profile
         * PATCH /api/v1/auth/profile
         */
        this.updateProfile = (0, error_middleware_1.asyncHandler)(async (req, res) => {
            const validatedData = auth_dto_1.UpdateProfileDTO.parse(req.body);
            const user = await auth_service_1.default.updateProfile(req.userId, validatedData);
            res.status(200).json({
                success: true,
                message: 'Profile updated successfully',
                data: user,
            });
        });
        /**
         * Get all users (for assignee dropdown)
         * GET /api/v1/auth/users
         */
        this.getAllUsers = (0, error_middleware_1.asyncHandler)(async (req, res) => {
            const users = await auth_service_1.default.getAllUsers();
            res.status(200).json({
                success: true,
                data: users,
            });
        });
    }
}
exports.AuthController = AuthController;
exports.default = new AuthController();
