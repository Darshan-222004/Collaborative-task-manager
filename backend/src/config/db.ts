/**
 * Database Configuration - MongoDB connection setup and lifecycle management using Mongoose ODM
 * Establishes database connection with proper error handling, logging, and event listeners for disconnect/error scenarios
 */

import mongoose from 'mongoose';
import { env } from './env';
import logger from '../utils/logger';

/**
 * Connects to MongoDB database using Mongoose ODM
 * @returns Promise that resolves when connection is established
 */
export const connectDB = async (): Promise<void> => {
    try {
        const conn = await mongoose.connect(env.MONGODB_URI);

        logger.info(`MongoDB Connected: ${conn.connection.host}`);

        // Handle connection events
        mongoose.connection.on('disconnected', () => {
            logger.warn('MongoDB disconnected. Attempting to reconnect...');
        });

        mongoose.connection.on('error', (err) => {
            logger.error('MongoDB connection error:', err);
        });

    } catch (error) {
        logger.error('Failed to connect to MongoDB:', error);
        process.exit(1);
    }
};

/**
 * Closes the MongoDB connection gracefully
 * Used during application shutdown
 */
export const disconnectDB = async (): Promise<void> => {
    try {
        await mongoose.connection.close();
        logger.info('MongoDB connection closed');
    } catch (error) {
        logger.error('Error closing MongoDB connection:', error);
    }
};
