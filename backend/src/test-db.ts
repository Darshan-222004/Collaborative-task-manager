/**
 * Test script to check MongoDB connection and list users
 */

import { connectDB } from './config/db';
import User from './models/User';
import logger from './utils/logger';

const testDatabase = async () => {
    try {
        // Connect to MongoDB
        await connectDB();
        logger.info('Connected to MongoDB');

        // Count users
        const userCount = await User.countDocuments();
        logger.info(`Total users in database: ${userCount}`);

        // List all users
        const users = await User.find().select('_id name email createdAt');
        logger.info('Users:');
        users.forEach((user) => {
            logger.info(`- ${user.name} (${user.email}) - ID: ${user._id}`);
        });

        if (userCount === 0) {
            logger.warn('No users found in database. You need to register a user first.');
        }

        process.exit(0);
    } catch (error) {
        logger.error('Error testing database:', error);
        process.exit(1);
    }
};

testDatabase();
