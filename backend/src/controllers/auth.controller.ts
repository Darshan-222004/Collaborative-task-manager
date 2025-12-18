import { Request, Response, NextFunction } from 'express';
import authService from '../services/auth.service';
import { RegisterDTO, LoginDTO, UpdateProfileDTO } from '../dtos/auth.dto';
import { asyncHandler } from '../middlewares/error.middleware';
import { AuthRequest } from '../middlewares/auth.middleware';

/**
 * Auth Controller - HTTP handlers for authentication endpoints
 */
export class AuthController {

    /**
     * Register a new user
     * POST /api/v1/auth/register
     */
    register = asyncHandler(async (req: Request, res: Response): Promise<void> => {
        const validatedData = RegisterDTO.parse(req.body);
        const result = await authService.register(validatedData);

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
    login = asyncHandler(async (req: Request, res: Response): Promise<void> => {
        const validatedData = LoginDTO.parse(req.body);
        const result = await authService.login(validatedData);

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
    getProfile = asyncHandler(async (req: AuthRequest, res: Response): Promise<void> => {
        const user = await authService.getProfile(req.userId!);

        res.status(200).json({
            success: true,
            data: user,
        });
    });

    /**
     * Update current user profile
     * PATCH /api/v1/auth/profile
     */
    updateProfile = asyncHandler(async (req: AuthRequest, res: Response): Promise<void> => {
        const validatedData = UpdateProfileDTO.parse(req.body);
        const user = await authService.updateProfile(req.userId!, validatedData);

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
    getAllUsers = asyncHandler(async (req: Request, res: Response): Promise<void> => {
        const users = await authService.getAllUsers();

        res.status(200).json({
            success: true,
            data: users,
        });
    });
}

export default new AuthController();
