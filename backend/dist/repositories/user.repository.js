"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserRepository = void 0;
const User_1 = __importDefault(require("../models/User"));
const logger_1 = __importDefault(require("../utils/logger"));
/**
 * User Repository - Handles all database operations for User collection
 */
class UserRepository {
    /**
     * Creates a new user in database
     * @param userData - User data (name, email, password)
     * @returns Created user document
     */
    async create(userData) {
        try {
            const user = new User_1.default(userData);
            await user.save();
            logger_1.default.info(`User created: ${user.email}`);
            return user;
        }
        catch (error) {
            logger_1.default.error('Error creating user:', error);
            throw error;
        }
    }
    /**
     * Finds user by email address
     * @param email - User email
     * @returns User document or null
     */
    async findByEmail(email) {
        try {
            const user = await User_1.default.findOne({ email }).select('+password');
            return user;
        }
        catch (error) {
            logger_1.default.error('Error finding user by email:', error);
            throw error;
        }
    }
    /**
     * Finds user by ID
     * @param userId - User ID
     * @returns User document or null
     */
    async findById(userId) {
        try {
            const user = await User_1.default.findById(userId);
            return user;
        }
        catch (error) {
            logger_1.default.error('Error finding user by ID:', error);
            throw error;
        }
    }
    /**
     * Checks if email already exists in database
     * @param email - Email to check
     * @returns True if exists, false otherwise
     */
    async emailExists(email) {
        try {
            const count = await User_1.default.countDocuments({ email });
            return count > 0;
        }
        catch (error) {
            logger_1.default.error('Error checking email existence:', error);
            throw error;
        }
    }
    /**
     * Updates user profile information
     * @param userId - User ID
     * @param updateData - Fields to update
     * @returns Updated user document or null
     */
    async updateProfile(userId, updateData) {
        try {
            const user = await User_1.default.findByIdAndUpdate(userId, { $set: updateData }, { new: true, runValidators: true });
            if (user) {
                logger_1.default.info(`User profile updated: ${userId}`);
            }
            return user;
        }
        catch (error) {
            logger_1.default.error('Error updating user profile:', error);
            throw error;
        }
    }
    /**
     * Gets all users (for assignee dropdown)
     * @returns Array of user documents
     */
    async getAllUsers() {
        try {
            const users = await User_1.default.find().select('_id name email');
            return users;
        }
        catch (error) {
            logger_1.default.error('Error fetching all users:', error);
            throw error;
        }
    }
    /**
     * Deletes a user by ID (for testing/admin purposes)
     * @param userId - User ID
     * @returns Deleted user document or null
     */
    async deleteById(userId) {
        try {
            const user = await User_1.default.findByIdAndDelete(userId);
            if (user) {
                logger_1.default.info(`User deleted: ${userId}`);
            }
            return user;
        }
        catch (error) {
            logger_1.default.error('Error deleting user:', error);
            throw error;
        }
    }
}
exports.UserRepository = UserRepository;
exports.default = new UserRepository();
