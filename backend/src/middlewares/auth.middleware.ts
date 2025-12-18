import { Request, Response, NextFunction } from 'express';
import { verifyToken, extractTokenFromHeader } from '../utils/jwt';
import logger from '../utils/logger';

/**
 * Extended Express Request interface with authenticated user data
 */
export interface AuthRequest extends Request {
    userId?: string;
    userEmail?: string;
}

/**
 * Middleware to verify JWT token and authenticate requests
 * Attaches userId and userEmail to request object if valid
 */
export const authenticate = async (
    req: AuthRequest,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const authHeader = req.headers.authorization;
        const token = extractTokenFromHeader(authHeader);

        if (!token) {
            res.status(401).json({
                success: false,
                message: 'Authentication token is required',
            });
            return;
        }

        const decoded = verifyToken(token);

        req.userId = decoded.userId;
        req.userEmail = decoded.email;

        logger.debug(`User authenticated: ${decoded.userId}`);

        next();

    } catch (error: any) {
        logger.error('Authentication failed:', error.message);

        res.status(401).json({
            success: false,
            message: error.message || 'Invalid or expired token',
        });
    }
};

/**
 * Optional authentication middleware
 * Attaches user data if token exists but doesn't fail if missing
 */
export const optionalAuth = async (
    req: AuthRequest,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const authHeader = req.headers.authorization;
        const token = extractTokenFromHeader(authHeader);

        if (token) {
            const decoded = verifyToken(token);
            req.userId = decoded.userId;
            req.userEmail = decoded.email;
        }

        next();

    } catch (error) {
        next();
    }
};