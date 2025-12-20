"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateProfileDTO = exports.LoginDTO = exports.RegisterDTO = void 0;
const zod_1 = require("zod");
/**
 * Schema for user registration validation
 */
exports.RegisterDTO = zod_1.z.object({
    name: zod_1.z
        .string()
        .min(2, 'Name must be at least 2 characters')
        .max(50, 'Name cannot exceed 50 characters')
        .trim(),
    email: zod_1.z
        .string()
        .email('Invalid email format')
        .toLowerCase()
        .trim(),
    password: zod_1.z
        .string()
        .min(6, 'Password must be at least 6 characters')
        .max(100, 'Password cannot exceed 100 characters'),
});
/**
 * Schema for user login validation
 */
exports.LoginDTO = zod_1.z.object({
    email: zod_1.z
        .string()
        .email('Invalid email format')
        .toLowerCase()
        .trim(),
    password: zod_1.z
        .string()
        .min(1, 'Password is required'),
});
/**
 * Schema for updating user profile
 */
exports.UpdateProfileDTO = zod_1.z.object({
    name: zod_1.z
        .string()
        .min(2, 'Name must be at least 2 characters')
        .max(50, 'Name cannot exceed 50 characters')
        .trim()
        .optional(),
    email: zod_1.z
        .string()
        .email('Invalid email format')
        .toLowerCase()
        .trim()
        .optional(),
}).refine((data) => data.name || data.email, {
    message: 'At least one field (name or email) must be provided',
});
