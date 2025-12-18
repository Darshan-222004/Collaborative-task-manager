import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';
import { Error as MongooseError } from 'mongoose';
import logger from '../utils/logger';
import { env } from '../config/env';

/**
 * Custom error class with status code
 */
export class AppError extends Error {
    statusCode: number;
    isOperational: boolean;

    constructor(message: string, statusCode: number = 500) {
        super(message);
        this.statusCode = statusCode;
        this.isOperational = true;
        Error.captureStackTrace(this, this.constructor);
    }
}

/**
 * Handles Zod validation errors
 */
const handleZodError = (error: ZodError): { message: string; errors: any[] } => {
    const errors = error.errors.map((err) => ({
        field: err.path.join('.'),
        message: err.message,
    }));

    return {
        message: 'Validation failed',
        errors,
    };
};

/**
 * Handles Mongoose validation errors
 */
const handleMongooseValidationError = (error: MongooseError.ValidationError) => {
    const errors = Object.values(error.errors).map((err) => ({
        field: err.path,
        message: err.message,
    }));

    return {
        message: 'Validation failed',
        errors,
    };
};

/**
 * Handles Mongoose duplicate key errors
 */
const handleDuplicateKeyError = (error: any) => {
    const field = Object.keys(error.keyPattern)[0];
    return {
        message: `${field} already exists`,
        errors: [
            {
                field,
                message: `This ${field} is already registered`,
            },
        ],
    };
};

/**
 * Handles Mongoose CastError (invalid ObjectId)
 */
const handleCastError = (error: MongooseError.CastError) => {
    return {
        message: `Invalid ${error.path}: ${error.value}`,
        errors: [
            {
                field: error.path,
                message: 'Invalid ID format',
            },
        ],
    };
};

/**
 * Global error handling middleware
 * Catches all errors and sends formatted response
 */
export const errorHandler = (
    error: Error | AppError | ZodError | MongooseError,
    req: Request,
    res: Response,
    next: NextFunction
): void => {
    let statusCode = 500;
    let message = 'Internal server error';
    let errors: any[] = [];

    // Log error for debugging
    logger.error('Error occurred:', {
        name: error.name,
        message: error.message,
        stack: env.NODE_ENV === 'development' ? error.stack : undefined,
        url: req.originalUrl,
        method: req.method,
    });

    // Handle custom AppError
    if (error instanceof AppError) {
        statusCode = error.statusCode;
        message = error.message;
    }
    // Handle Zod validation errors
    else if (error instanceof ZodError) {
        statusCode = 400;
        const zodError = handleZodError(error);
        message = zodError.message;
        errors = zodError.errors;
    }
    // Handle Mongoose validation errors
    else if (error instanceof MongooseError.ValidationError) {
        statusCode = 400;
        const validationError = handleMongooseValidationError(error);
        message = validationError.message;
        errors = validationError.errors;
    }
    // Handle Mongoose duplicate key errors
    else if (error.name === 'MongoServerError' && (error as any).code === 11000) {
        statusCode = 409;
        const duplicateError = handleDuplicateKeyError(error);
        message = duplicateError.message;
        errors = duplicateError.errors;
    }
    // Handle Mongoose CastError (invalid ObjectId)
    else if (error instanceof MongooseError.CastError) {
        statusCode = 400;
        const castError = handleCastError(error);
        message = castError.message;
        errors = castError.errors;
    }
    // Handle JWT errors
    else if (error.name === 'JsonWebTokenError') {
        statusCode = 401;
        message = 'Invalid authentication token';
    }
    else if (error.name === 'TokenExpiredError') {
        statusCode = 401;
        message = 'Authentication token has expired';
    }

    // Send error response
    res.status(statusCode).json({
        success: false,
        message,
        ...(errors.length > 0 && { errors }),
        ...(env.NODE_ENV === 'development' && { stack: error.stack }),
    });
};

/**
 * Middleware to handle 404 not found errors
 */
export const notFoundHandler = (
    req: Request,
    res: Response,
    next: NextFunction
): void => {
    const error = new AppError(
        `Route ${req.originalUrl} not found`,
        404
    );
    next(error);
};

/**
 * Async handler wrapper to catch errors in async route handlers
 */
export const asyncHandler = (
    fn: (req: Request, res: Response, next: NextFunction) => Promise<any>
) => {
    return (req: Request, res: Response, next: NextFunction) => {
        Promise.resolve(fn(req, res, next)).catch(next);
    };
};