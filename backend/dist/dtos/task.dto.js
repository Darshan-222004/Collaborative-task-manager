"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TaskQueryDTO = exports.UpdateTaskDTO = exports.CreateTaskDTO = void 0;
const zod_1 = require("zod");
const Task_1 = require("../models/Task");
/**
 * Schema for creating a new task
 */
exports.CreateTaskDTO = zod_1.z.object({
    title: zod_1.z
        .string()
        .min(1, 'Title is required')
        .max(100, 'Title cannot exceed 100 characters')
        .trim(),
    description: zod_1.z
        .string()
        .min(1, 'Description is required')
        .trim(),
    dueDate: zod_1.z
        .string()
        .datetime('Invalid date format')
        .refine((date) => new Date(date) > new Date(), {
        message: 'Due date must be in the future',
    }),
    priority: zod_1.z.nativeEnum(Task_1.TaskPriority, {
        errorMap: () => ({ message: 'Invalid priority value' }),
    }),
    assignedToId: zod_1.z
        .string()
        .min(1, 'Assigned user is required')
        .regex(/^[0-9a-fA-F]{24}$/, 'Invalid user ID format'),
});
/**
 * Schema for updating an existing task
 */
exports.UpdateTaskDTO = zod_1.z.object({
    title: zod_1.z
        .string()
        .min(1, 'Title cannot be empty')
        .max(100, 'Title cannot exceed 100 characters')
        .trim()
        .optional(),
    description: zod_1.z
        .string()
        .min(1, 'Description cannot be empty')
        .trim()
        .optional(),
    dueDate: zod_1.z
        .string()
        .datetime('Invalid date format')
        .refine((date) => new Date(date) > new Date(), {
        message: 'Due date must be in the future',
    })
        .optional(),
    priority: zod_1.z
        .nativeEnum(Task_1.TaskPriority, {
        errorMap: () => ({ message: 'Invalid priority value' }),
    })
        .optional(),
    status: zod_1.z
        .nativeEnum(Task_1.TaskStatus, {
        errorMap: () => ({ message: 'Invalid status value' }),
    })
        .optional(),
    assignedToId: zod_1.z
        .string()
        .regex(/^[0-9a-fA-F]{24}$/, 'Invalid user ID format')
        .optional(),
}).refine((data) => Object.keys(data).length > 0, {
    message: 'At least one field must be provided for update',
});
/**
 * Schema for filtering/querying tasks
 */
exports.TaskQueryDTO = zod_1.z.object({
    status: zod_1.z
        .string()
        .optional()
        .transform((val) => {
        if (!val || val === '')
            return undefined;
        return val;
    })
        .pipe(zod_1.z.nativeEnum(Task_1.TaskStatus).optional()),
    priority: zod_1.z
        .string()
        .optional()
        .transform((val) => {
        if (!val || val === '')
            return undefined;
        return val;
    })
        .pipe(zod_1.z.nativeEnum(Task_1.TaskPriority).optional()),
    assignedToId: zod_1.z
        .string()
        .optional()
        .transform((val) => {
        if (!val || val === '')
            return undefined;
        return val;
    })
        .pipe(zod_1.z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid user ID format').optional()),
    creatorId: zod_1.z
        .string()
        .optional()
        .transform((val) => {
        if (!val || val === '')
            return undefined;
        return val;
    })
        .pipe(zod_1.z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid user ID format').optional()),
    sortBy: zod_1.z
        .string()
        .optional()
        .transform((val) => {
        if (!val || val === '')
            return 'createdAt';
        return val;
    })
        .pipe(zod_1.z.enum(['dueDate', 'createdAt', 'priority', 'status'])),
    sortOrder: zod_1.z
        .string()
        .optional()
        .transform((val) => {
        if (!val || val === '')
            return 'desc';
        return val;
    })
        .pipe(zod_1.z.enum(['asc', 'desc'])),
    page: zod_1.z
        .string()
        .optional()
        .transform((val) => {
        if (!val || val === '')
            return 1;
        return Number(val);
    })
        .pipe(zod_1.z.number().int().positive()),
    limit: zod_1.z
        .string()
        .optional()
        .transform((val) => {
        if (!val || val === '')
            return 10;
        return Number(val);
    })
        .pipe(zod_1.z.number().int().positive().max(100)),
});
