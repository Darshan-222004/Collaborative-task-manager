import { RegisterInput, LoginInput, UpdateProfileInput } from '../dtos/auth.dto';
import userRepository from '../repositories/user.repository';
import { generateToken } from '../utils/jwt';
import { AppError } from '../middlewares/error.middleware';
import logger from '../utils/logger';

/**
 * Auth Service - Business logic for authentication operations
 */
export class AuthService {

    /**
     * Registers a new user
     */
    async register(data: RegisterInput): Promise<{ user: any; token: string }> {
        // Check if email already exists
        const existingUser = await userRepository.findByEmail(data.email);
        if (existingUser) {
            throw new AppError('Email already registered', 409);
        }

        // Create user
        const user = await userRepository.create(data);

        // Generate JWT token
        const token = generateToken({
            userId: user._id,
            email: user.email,
        });

        logger.info(`User registered successfully: ${user.email}`);

        return {
            user: user.toJSON(),
            token,
        };
    }

    /**
     * Logs in an existing user
     */
    async login(data: LoginInput): Promise<{ user: any; token: string }> {
        // Find user by email (password included)
        const user = await userRepository.findByEmail(data.email);
        if (!user) {
            throw new AppError('Invalid email or password', 401);
        }

        // Compare password
        const isPasswordValid = await user.comparePassword(data.password);
        if (!isPasswordValid) {
            throw new AppError('Invalid email or password', 401);
        }

        // Generate JWT token
        const token = generateToken({
            userId: user._id,
            email: user.email,
        });

        logger.info(`User logged in: ${user.email}`);

        return {
            user: user.toJSON(),
            token,
        };
    }

    /**
     * Gets user profile by ID
     */
    async getProfile(userId: string): Promise<any> {
        const user = await userRepository.findById(userId);
        if (!user) {
            throw new AppError('User not found', 404);
        }

        return user.toJSON();
    }

    /**
     * Updates user profile
     */
    async updateProfile(userId: string, data: UpdateProfileInput): Promise<any> {
        // If email is being updated, check uniqueness
        if (data.email) {
            const existingUser = await userRepository.findByEmail(data.email);
            if (existingUser && existingUser._id !== userId) {
                throw new AppError('Email already in use', 409);
            }
        }

        const user = await userRepository.updateProfile(userId, data);
        if (!user) {
            throw new AppError('User not found', 404);
        }

        logger.info(`Profile updated for user: ${userId}`);

        return user.toJSON();
    }

    /**
     * Gets all users (for assignee dropdown)
     */
    async getAllUsers(): Promise<any[]> {
        const users = await userRepository.getAllUsers();
        return users.map((user) => user.toJSON());
    }
}

export default new AuthService();
