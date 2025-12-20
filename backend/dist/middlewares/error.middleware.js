"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.asyncHandler = exports.notFoundHandler = exports.errorHandler = exports.AppError = void 0;
const zod_1 = require("zod");
const mongoose_1 = require("mongoose");
const logger_1 = __importDefault(require("../utils/logger"));
const env_1 = require("../config/env");
/**
 * Custom error class with status code
 */
class AppError extends Error {
    constructor(message, statusCode = 500) {
        super(message);
        this.statusCode = statusCode;
        this.isOperational = true;
        Error.captureStackTrace(this, this.constructor);
    }
}
exports.AppError = AppError;
/**
 * Handles Zod validation errors
 */
const handleZodError = (error) => {
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
const handleMongooseValidationError = (error) => {
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
const handleDuplicateKeyError = (error) => {
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
const handleCastError = (error) => {
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
const errorHandler = (error, req, res, next) => {
    let statusCode = 500;
    let message = 'Internal server error';
    let errors = [];
    // Log error for debugging
    logger_1.default.error('Error occurred:', {
        name: error.name,
        message: error.message,
        stack: env_1.env.NODE_ENV === 'development' ? error.stack : undefined,
        url: req.originalUrl,
        method: req.method,
    });
    // Handle custom AppError
    if (error instanceof AppError) {
        statusCode = error.statusCode;
        message = error.message;
    }
    // Handle Zod validation errors
    else if (error instanceof zod_1.ZodError) {
        statusCode = 400;
        const zodError = handleZodError(error);
        message = zodError.message;
        errors = zodError.errors;
    }
    // Handle Mongoose validation errors
    else if (error instanceof mongoose_1.Error.ValidationError) {
        statusCode = 400;
        const validationError = handleMongooseValidationError(error);
        message = validationError.message;
        errors = validationError.errors;
    }
    // Handle Mongoose duplicate key errors
    else if (error.name === 'MongoServerError' && error.code === 11000) {
        statusCode = 409;
        const duplicateError = handleDuplicateKeyError(error);
        message = duplicateError.message;
        errors = duplicateError.errors;
    }
    // Handle Mongoose CastError (invalid ObjectId)
    else if (error instanceof mongoose_1.Error.CastError) {
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
        ...(env_1.env.NODE_ENV === 'development' && { stack: error.stack }),
    });
};
exports.errorHandler = errorHandler;
/**
 * Middleware to handle 404 not found errors
 */
const notFoundHandler = (req, res, next) => {
    const error = new AppError(`Route ${req.originalUrl} not found`, 404);
    next(error);
};
exports.notFoundHandler = notFoundHandler;
/**
 * Async handler wrapper to catch errors in async route handlers
 */
const asyncHandler = (fn) => {
    return (req, res, next) => {
        Promise.resolve(fn(req, res, next)).catch(next);
    };
};
exports.asyncHandler = asyncHandler;
