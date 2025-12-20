/**
 * @file env.ts
 * Type-safe environment variable configuration.
 * Loads, validates, and exports environment variables using Zod to ensure runtime safety.
 */

import dotenv from 'dotenv';
import { z } from 'zod';

// Load variables from .env file into process.env
dotenv.config();

/**
 * Environment Schema Definition
 * Defines the shape and validation rules for all required environment variables.
 * Defaults are provided where safe (e.g., development ports), but critical secrets
 * (like MONGODB_URI) must be explicitly set.
 */
const envSchema = z.object({
    NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
    PORT: z.string().default('5000'),
    MONGODB_URI: z.string().optional(),
    JWT_SECRET: z.string().default('fallback_secret_for_demo_only'),
    JWT_EXPIRES_IN: z.string().default('7d'),
    FRONTEND_URL: z.string().default('http://localhost:5173'),
    BCRYPT_SALT_ROUNDS: z.string().default('10'),
});

/**
 * Validates the current process.env against the schema.
 * If validation fails, it logs specific error messages and terminates the process
 * to prevent the application from running with invalid configuration.
 */
const validateEnv = () => {
    try {
        const validated = envSchema.parse(process.env);
        return validated;
    } catch (error) {
        if (error instanceof z.ZodError) {
            console.error('❌ Environment variable validation failed:');
            error.errors.forEach((err) => {
                console.error(`  - ${err.path.join('.')}: ${err.message}`);
            });
        }
        // Exit immediately if configuration is invalid
        process.exit(1);
    }
};

// Export the validated environment object for use throughout the app
export const env = validateEnv();
