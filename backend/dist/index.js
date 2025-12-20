"use strict";
/**
 * @file index.ts
 * Entry point for the Backend Application.
 * Initializes the HTTP server, connects to MongoDB, and sets up real-time communication via Socket.io.
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.io = void 0;
const http_1 = __importDefault(require("http"));
const socket_io_1 = require("socket.io");
const app_1 = __importDefault(require("./app"));
const db_1 = require("./config/db");
const task_socket_1 = require("./sockets/task.socket");
const logger_1 = __importDefault(require("./utils/logger"));
const PORT = process.env.PORT || 5000;
// Wrap Express app with HTTP server to support Socket.io
const server = http_1.default.createServer(app_1.default);
// Initialize Socket.io with CORS configuration
const io = new socket_io_1.Server(server, {
    cors: {
        origin: process.env.FRONTEND_URL || 'http://localhost:5173', // Default to Vite dev server
        methods: ['GET', 'POST'],
        credentials: true,
    },
});
exports.io = io;
/**
 * Orchestrates the application startup sequence.
 * 1. Connects to MongoDB
 * 2. Initializes Socket.io events
 * 3. Starts the HTTP server
 */
const startServer = async () => {
    try {
        await (0, db_1.connectDB)();
        logger_1.default.info('MongoDB connected successfully');
        // Initialize custom socket events
        (0, task_socket_1.initializeSocket)(io);
        logger_1.default.info('Socket.io initialized');
        server.listen(PORT, () => {
            logger_1.default.info(`Server running on port ${PORT}`);
            logger_1.default.info(`Environment: ${process.env.NODE_ENV || 'development'}`);
        });
    }
    catch (error) {
        logger_1.default.error('Failed to start server:', error);
        process.exit(1);
    }
};
startServer();
