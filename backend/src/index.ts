/**
 * @file index.ts
 * Entry point for the Backend Application.
 * Initializes the HTTP server, connects to MongoDB, and sets up real-time communication via Socket.io.
 */

import http from 'http';
import { Server } from 'socket.io';
import app from './app';
import { connectDB } from './config/db';
import { initializeSocket } from './sockets/task.socket';
import logger from './utils/logger';

const PORT = process.env.PORT || 5000;

// Wrap Express app with HTTP server to support Socket.io
const server = http.createServer(app);

// Initialize Socket.io with CORS configuration
const io = new Server(server, {
    cors: {
        origin: process.env.FRONTEND_URL || 'http://localhost:5173', // Default to Vite dev server
        methods: ['GET', 'POST'],
        credentials: true,
    },
});

/**
 * Orchestrates the application startup sequence.
 * 1. Connects to MongoDB
 * 2. Initializes Socket.io events
 * 3. Starts the HTTP server
 */
const startServer = async () => {
    try {
        await connectDB();
        logger.info('MongoDB connected successfully');

        // Initialize custom socket events
        initializeSocket(io);
        logger.info('Socket.io initialized');

        server.listen(Number(PORT), '0.0.0.0', () => {
            logger.info(`Server running on port ${PORT}`);
            logger.info(`Environment: ${process.env.NODE_ENV || 'development'}`);
        });
    } catch (error) {
        logger.error('Failed to start server:', error);
        process.exit(1);
    }
};

startServer();

export { io };
