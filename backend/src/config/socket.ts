import { Server, Socket } from 'socket.io';
import jwt from 'jsonwebtoken';
import { env } from './env';
import logger from '../utils/logger';

/**
 * Interface for JWT payload structure
 */
interface JWTPayload {
    userId: string;
    email: string;
}

/**
 * Extended Socket interface with authenticated user data
 */
export interface AuthenticatedSocket extends Socket {
    userId?: string;
    email?: string;
}

/**
 * Middleware to authenticate socket connections using JWT
 * Verifies token from handshake auth or query parameters
 */
export const socketAuthMiddleware = (socket: AuthenticatedSocket, next: (err?: Error) => void) => {
    try {
        const token = socket.handshake.auth.token || socket.handshake.headers.authorization?.split(' ')[1];

        if (!token) {
            return next(new Error('Authentication token required'));
        }

        const decoded = jwt.verify(token, env.JWT_SECRET) as JWTPayload;

        socket.userId = decoded.userId;
        socket.email = decoded.email;

        logger.info(`Socket authenticated for user: ${decoded.userId}`);
        next();

    } catch (error) {
        logger.error('Socket authentication failed:', error);
        next(new Error('Invalid authentication token'));
    }
};

/**
 * Map to store userId -> socketId mappings for targeted events
 */
export const userSocketMap = new Map<string, string>();

/**
 * Emits an event to a specific user by their userId
 * @param io - Socket.io server instance
 * @param userId - Target user's ID
 * @param event - Event name
 * @param data - Event payload
 */
export const emitToUser = (io: Server, userId: string, event: string, data: any) => {
    const socketId = userSocketMap.get(userId);

    if (socketId) {
        io.to(socketId).emit(event, data);
        logger.info(`Emitted '${event}' to user ${userId}`);
    } else {
        logger.warn(`User ${userId} is not connected`);
    }
};

/**
 * Emits an event to all connected clients except the sender
 * @param socket - Socket instance of the sender
 * @param event - Event name
 * @param data - Event payload
 */
export const broadcastToOthers = (socket: Socket, event: string, data: any) => {
    socket.broadcast.emit(event, data);
    logger.info(`Broadcasted '${event}' to all users except sender`);
};
