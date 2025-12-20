"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
/**
 * AuthService - Handles user authentication, registration, and session management with JWT tokens
 * Provides secure login/register flows with bcrypt password hashing and token generation for protected routes
 */
const user_repository_1 = __importDefault(require("../repositories/user.repository"));
const jwt_1 = require("../utils/jwt");
const error_middleware_1 = require("../middlewares/error.middleware");
const logger_1 = __importDefault(require("../utils/logger"));
/**
 * Auth Service - Business logic for authentication operations
 */
class AuthService {
    /**
     * Registers a new user
     */
    async register(data) {
        // Check if email already exists
        const existingUser = await user_repository_1.default.findByEmail(data.email);
        if (existingUser) {
            throw new error_middleware_1.AppError('Email already registered', 409);
        }
        // Create user
        const user = await user_repository_1.default.create(data);
        // Generate JWT token
        const token = (0, jwt_1.generateToken)({
            userId: user._id,
            email: user.email,
        });
        logger_1.default.info(`User registered successfully: ${user.email}`);
        return {
            user: user.toJSON(),
            token,
        };
    }
    /**
     * Logs in an existing user
     */
    async login(data) {
        // Find user by email (password included)
        const user = await user_repository_1.default.findByEmail(data.email);
        if (!user) {
            throw new error_middleware_1.AppError('Invalid email or password', 401);
        }
        // Compare password
        const isPasswordValid = await user.comparePassword(data.password);
        if (!isPasswordValid) {
            throw new error_middleware_1.AppError('Invalid email or password', 401);
        }
        // Generate JWT token
        const token = (0, jwt_1.generateToken)({
            userId: user._id,
            email: user.email,
        });
        logger_1.default.info(`User logged in: ${user.email}`);
        return {
            user: user.toJSON(),
            token,
        };
    }
    /**
     * Gets user profile by ID
     */
    async getProfile(userId) {
        const user = await user_repository_1.default.findById(userId);
        if (!user) {
            throw new error_middleware_1.AppError('User not found', 404);
        }
        return user.toJSON();
    }
    /**
     * Updates user profile
     */
    async updateProfile(userId, data) {
        // If email is being updated, check uniqueness
        if (data.email) {
            const existingUser = await user_repository_1.default.findByEmail(data.email);
            if (existingUser && existingUser._id !== userId) {
                throw new error_middleware_1.AppError('Email already in use', 409);
            }
        }
        const user = await user_repository_1.default.updateProfile(userId, data);
        if (!user) {
            throw new error_middleware_1.AppError('User not found', 404);
        }
        logger_1.default.info(`Profile updated for user: ${userId}`);
        return user.toJSON();
    }
    /**
     * Gets all users (for assignee dropdown)
     */
    async getAllUsers() {
        const users = await user_repository_1.default.getAllUsers();
        return users.map((user) => user.toJSON());
    }
}
exports.AuthService = AuthService;
exports.default = new AuthService();
