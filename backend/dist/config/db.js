"use strict";
/**
 * Database Configuration - MongoDB connection setup and lifecycle management using Mongoose ODM
 * Establishes database connection with proper error handling, logging, and event listeners for disconnect/error scenarios
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.disconnectDB = exports.connectDB = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const env_1 = require("./env");
const logger_1 = __importDefault(require("../utils/logger"));
/**
 * Connects to MongoDB database using Mongoose ODM
 * @returns Promise that resolves when connection is established
 */
const connectDB = async () => {
    try {
        const conn = await mongoose_1.default.connect(env_1.env.MONGODB_URI);
        logger_1.default.info(`MongoDB Connected: ${conn.connection.host}`);
        // Handle connection events
        mongoose_1.default.connection.on('disconnected', () => {
            logger_1.default.warn('MongoDB disconnected. Attempting to reconnect...');
        });
        mongoose_1.default.connection.on('error', (err) => {
            logger_1.default.error('MongoDB connection error:', err);
        });
    }
    catch (error) {
        logger_1.default.error('Failed to connect to MongoDB:', error);
        process.exit(1);
    }
};
exports.connectDB = connectDB;
/**
 * Closes the MongoDB connection gracefully
 * Used during application shutdown
 */
const disconnectDB = async () => {
    try {
        await mongoose_1.default.connection.close();
        logger_1.default.info('MongoDB connection closed');
    }
    catch (error) {
        logger_1.default.error('Error closing MongoDB connection:', error);
    }
};
exports.disconnectDB = disconnectDB;
