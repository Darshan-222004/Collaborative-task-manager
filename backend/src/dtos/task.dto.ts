import { z } from 'zod';
import { TaskPriority, TaskStatus } from '../models/Task';

/**
 * Schema for creating a new task
 */
export const CreateTaskDTO = z.object({
    title: z
        .string()
        .min(1, 'Title is required')
        .max(100, 'Title cannot exceed 100 characters')
        .trim(),
    description: z
        .string()
        .min(1, 'Description is required')
        .trim(),
    dueDate: z
        .string()
        .datetime('Invalid date format')
        .refine(
            (date) => new Date(date) > new Date(),
            {
                message: 'Due date must be in the future',
            }
        ),
    priority: z.nativeEnum(TaskPriority, {
        errorMap: () => ({ message: 'Invalid priority value' }),
    }),
    assignedToId: z
        .string()
        .min(1, 'Assigned user is required')
        .regex(/^[0-9a-fA-F]{24}$/, 'Invalid user ID format'),
});

/**
 * Schema for updating an existing task
 */
export const UpdateTaskDTO = z.object({
    title: z
        .string()
        .min(1, 'Title cannot be empty')
        .max(100, 'Title cannot exceed 100 characters')
        .trim()
        .optional(),
    description: z
        .string()
        .min(1, 'Description cannot be empty')
        .trim()
        .optional(),
    dueDate: z
        .string()
        .datetime('Invalid date format')
        .refine(
            (date) => new Date(date) > new Date(),
            {
                message: 'Due date must be in the future',
            }
        )
        .optional(),
    priority: z
        .nativeEnum(TaskPriority, {
            errorMap: () => ({ message: 'Invalid priority value' }),
        })
        .optional(),
    status: z
        .nativeEnum(TaskStatus, {
            errorMap: () => ({ message: 'Invalid status value' }),
        })
        .optional(),
    assignedToId: z
        .string()
        .regex(/^[0-9a-fA-F]{24}$/, 'Invalid user ID format')
        .optional(),
}).refine(
    (data) => Object.keys(data).length > 0,
    {
        message: 'At least one field must be provided for update',
    }
);

/**
 * Schema for filtering/querying tasks
 */
export const TaskQueryDTO = z.object({
    status: z
        .string()
        .optional()
        .transform((val) => {
            if (!val || val === '') return undefined;
            return val;
        })
        .pipe(z.nativeEnum(TaskStatus).optional()),
    priority: z
        .string()
        .optional()
        .transform((val) => {
            if (!val || val === '') return undefined;
            return val;
        })
        .pipe(z.nativeEnum(TaskPriority).optional()),
    assignedToId: z
        .string()
        .optional()
        .transform((val) => {
            if (!val || val === '') return undefined;
            return val;
        })
        .pipe(z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid user ID format').optional()),
    creatorId: z
        .string()
        .optional()
        .transform((val) => {
            if (!val || val === '') return undefined;
            return val;
        })
        .pipe(z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid user ID format').optional()),
    sortBy: z
        .string()
        .optional()
        .transform((val) => {
            if (!val || val === '') return 'createdAt';
            return val;
        })
        .pipe(z.enum(['dueDate', 'createdAt', 'priority', 'status'])),
    sortOrder: z
        .string()
        .optional()
        .transform((val) => {
            if (!val || val === '') return 'desc';
            return val;
        })
        .pipe(z.enum(['asc', 'desc'])),
    page: z
        .string()
        .optional()
        .transform((val) => {
            if (!val || val === '') return 1;
            return Number(val);
        })
        .pipe(z.number().int().positive()),
    limit: z
        .string()
        .optional()
        .transform((val) => {
            if (!val || val === '') return 10;
            return Number(val);
        })
        .pipe(z.number().int().positive().max(100)),
});

/**
 * Type inference from Zod schemas
 */
export type CreateTaskInput = z.infer<typeof CreateTaskDTO>;
export type UpdateTaskInput = z.infer<typeof UpdateTaskDTO>;
export type TaskQueryInput = z.infer<typeof TaskQueryDTO>;