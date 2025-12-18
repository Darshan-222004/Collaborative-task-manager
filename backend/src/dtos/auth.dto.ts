import { z } from 'zod';

/**
 * Schema for user registration validation
 */
export const RegisterDTO = z.object({
    name: z
        .string()
        .min(2, 'Name must be at least 2 characters')
        .max(50, 'Name cannot exceed 50 characters')
        .trim(),
    email: z
        .string()
        .email('Invalid email format')
        .toLowerCase()
        .trim(),
    password: z
        .string()
        .min(6, 'Password must be at least 6 characters')
        .max(100, 'Password cannot exceed 100 characters'),
});

/**
 * Schema for user login validation
 */
export const LoginDTO = z.object({
    email: z
        .string()
        .email('Invalid email format')
        .toLowerCase()
        .trim(),
    password: z
        .string()
        .min(1, 'Password is required'),
});

/**
 * Schema for updating user profile
 */
export const UpdateProfileDTO = z.object({
    name: z
        .string()
        .min(2, 'Name must be at least 2 characters')
        .max(50, 'Name cannot exceed 50 characters')
        .trim()
        .optional(),
    email: z
        .string()
        .email('Invalid email format')
        .toLowerCase()
        .trim()
        .optional(),
}).refine(
    (data) => data.name || data.email,
    {
        message: 'At least one field (name or email) must be provided',
    }
);

/**
 * Type inference from Zod schemas for TypeScript
 */
export type RegisterInput = z.infer<typeof RegisterDTO>;
export type LoginInput = z.infer<typeof LoginDTO>;
export type UpdateProfileInput = z.infer<typeof UpdateProfileDTO>;