import User, { IUser } from '../models/User';
/**
 * UserRepository - Data access layer for User collection in MongoDB via Mongoose ODM
 * Handles user creation, lookup by ID/email, and password validation for authentication flows
 */

import { UpdateProfileInput } from '../dtos/auth.dto';
import logger from '../utils/logger';

/**
 * User Repository - Handles all database operations for User collection
 */
export class UserRepository {

    /**
     * Creates a new user in database
     * @param userData - User data (name, email, password)
     * @returns Created user document
     */
    async create(userData: {
        name: string;
        email: string;
        password: string;
    }): Promise<IUser> {
        try {
            const user = new User(userData);
            await user.save();
            logger.info(`User created: ${user.email}`);
            return user;
        } catch (error) {
            logger.error('Error creating user:', error);
            throw error;
        }
    }

    /**
     * Finds user by email address
     * @param email - User email
     * @returns User document or null
     */
    async findByEmail(email: string): Promise<IUser | null> {
        try {
            const user = await User.findOne({ email }).select('+password');
            return user;
        } catch (error) {
            logger.error('Error finding user by email:', error);
            throw error;
        }
    }

    /**
     * Finds user by ID
     * @param userId - User ID
     * @returns User document or null
     */
    async findById(userId: string): Promise<IUser | null> {
        try {
            const user = await User.findById(userId);
            return user;
        } catch (error) {
            logger.error('Error finding user by ID:', error);
            throw error;
        }
    }

    /**
     * Checks if email already exists in database
     * @param email - Email to check
     * @returns True if exists, false otherwise
     */
    async emailExists(email: string): Promise<boolean> {
        try {
            const count = await User.countDocuments({ email });
            return count > 0;
        } catch (error) {
            logger.error('Error checking email existence:', error);
            throw error;
        }
    }

    /**
     * Updates user profile information
     * @param userId - User ID
     * @param updateData - Fields to update
     * @returns Updated user document or null
     */
    async updateProfile(
        userId: string,
        updateData: UpdateProfileInput
    ): Promise<IUser | null> {
        try {
            const user = await User.findByIdAndUpdate(
                userId,
                { $set: updateData },
                { new: true, runValidators: true }
            );

            if (user) {
                logger.info(`User profile updated: ${userId}`);
            }

            return user;
        } catch (error) {
            logger.error('Error updating user profile:', error);
            throw error;
        }
    }

    /**
     * Gets all users (for assignee dropdown)
     * @returns Array of user documents
     */
    async getAllUsers(): Promise<IUser[]> {
        try {
            const users = await User.find().select('_id name email');
            return users;
        } catch (error) {
            logger.error('Error fetching all users:', error);
            throw error;
        }
    }

    /**
     * Deletes a user by ID (for testing/admin purposes)
     * @param userId - User ID
     * @returns Deleted user document or null
     */
    async deleteById(userId: string): Promise<IUser | null> {
        try {
            const user = await User.findByIdAndDelete(userId);
            if (user) {
                logger.info(`User deleted: ${userId}`);
            }
            return user;
        } catch (error) {
            logger.error('Error deleting user:', error);
            throw error;
        }
    }
}

export default new UserRepository();