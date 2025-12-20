"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.optionalAuth = exports.authenticate = void 0;
const jwt_1 = require("../utils/jwt");
const logger_1 = __importDefault(require("../utils/logger"));
/**
 * Middleware to verify JWT token and authenticate requests
 * Attaches userId and userEmail to request object if valid
 */
const authenticate = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        const token = (0, jwt_1.extractTokenFromHeader)(authHeader);
        if (!token) {
            res.status(401).json({
                success: false,
                message: 'Authentication token is required',
            });
            return;
        }
        const decoded = (0, jwt_1.verifyToken)(token);
        req.userId = decoded.userId;
        req.userEmail = decoded.email;
        logger_1.default.debug(`User authenticated: ${decoded.userId}`);
        next();
    }
    catch (error) {
        logger_1.default.error('Authentication failed:', error.message);
        res.status(401).json({
            success: false,
            message: error.message || 'Invalid or expired token',
        });
    }
};
exports.authenticate = authenticate;
/**
 * Optional authentication middleware
 * Attaches user data if token exists but doesn't fail if missing
 */
const optionalAuth = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        const token = (0, jwt_1.extractTokenFromHeader)(authHeader);
        if (token) {
            const decoded = (0, jwt_1.verifyToken)(token);
            req.userId = decoded.userId;
            req.userEmail = decoded.email;
        }
        next();
    }
    catch (error) {
        next();
    }
};
exports.optionalAuth = optionalAuth;
