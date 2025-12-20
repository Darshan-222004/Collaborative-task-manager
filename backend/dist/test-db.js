"use strict";
/**
 * Test script to check MongoDB connection and list users
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const db_1 = require("./config/db");
const User_1 = __importDefault(require("./models/User"));
const logger_1 = __importDefault(require("./utils/logger"));
const testDatabase = async () => {
    try {
        // Connect to MongoDB
        await (0, db_1.connectDB)();
        logger_1.default.info('Connected to MongoDB');
        // Count users
        const userCount = await User_1.default.countDocuments();
        logger_1.default.info(`Total users in database: ${userCount}`);
        // List all users
        const users = await User_1.default.find().select('_id name email createdAt');
        logger_1.default.info('Users:');
        users.forEach((user) => {
            logger_1.default.info(`- ${user.name} (${user.email}) - ID: ${user._id}`);
        });
        if (userCount === 0) {
            logger_1.default.warn('No users found in database. You need to register a user first.');
        }
        process.exit(0);
    }
    catch (error) {
        logger_1.default.error('Error testing database:', error);
        process.exit(1);
    }
};
testDatabase();
