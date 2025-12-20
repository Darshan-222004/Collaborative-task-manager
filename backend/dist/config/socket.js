"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.broadcastToOthers = exports.emitToUser = exports.userSocketMap = exports.socketAuthMiddleware = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const env_1 = require("./env");
const logger_1 = __importDefault(require("../utils/logger"));
/**
 * Middleware to authenticate socket connections using JWT
 * Verifies token from handshake auth or query parameters
 */
const socketAuthMiddleware = (socket, next) => {
    try {
        const token = socket.handshake.auth.token || socket.handshake.headers.authorization?.split(' ')[1];
        if (!token) {
            return next(new Error('Authentication token required'));
        }
        const decoded = jsonwebtoken_1.default.verify(token, env_1.env.JWT_SECRET);
        socket.userId = decoded.userId;
        socket.email = decoded.email;
        logger_1.default.info(`Socket authenticated for user: ${decoded.userId}`);
        next();
    }
    catch (error) {
        logger_1.default.error('Socket authentication failed:', error);
        next(new Error('Invalid authentication token'));
    }
};
exports.socketAuthMiddleware = socketAuthMiddleware;
/**
 * Map to store userId -> socketId mappings for targeted events
 */
exports.userSocketMap = new Map();
/**
 * Emits an event to a specific user by their userId
 * @param io - Socket.io server instance
 * @param userId - Target user's ID
 * @param event - Event name
 * @param data - Event payload
 */
const emitToUser = (io, userId, event, data) => {
    const socketId = exports.userSocketMap.get(userId);
    if (socketId) {
        io.to(socketId).emit(event, data);
        logger_1.default.info(`Emitted '${event}' to user ${userId}`);
    }
    else {
        logger_1.default.warn(`User ${userId} is not connected`);
    }
};
exports.emitToUser = emitToUser;
/**
 * Emits an event to all connected clients except the sender
 * @param socket - Socket instance of the sender
 * @param event - Event name
 * @param data - Event payload
 */
const broadcastToOthers = (socket, event, data) => {
    socket.broadcast.emit(event, data);
    logger_1.default.info(`Broadcasted '${event}' to all users except sender`);
};
exports.broadcastToOthers = broadcastToOthers;
