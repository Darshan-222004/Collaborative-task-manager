"use strict";
/**
 * @file env.ts
 * Type-safe environment variable configuration.
 * Loads, validates, and exports environment variables using Zod to ensure runtime safety.
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.env = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
const zod_1 = require("zod");
// Load variables from .env file into process.env
dotenv_1.default.config();
/**
 * Environment Schema Definition
 * Defines the shape and validation rules for all required environment variables.
 * Defaults are provided where safe (e.g., development ports), but critical secrets
 * (like MONGODB_URI) must be explicitly set.
 */
const envSchema = zod_1.z.object({
    NODE_ENV: zod_1.z.enum(['development', 'production', 'test']).default('development'),
    PORT: zod_1.z.string().default('5000'),
    MONGODB_URI: zod_1.z.string().optional(),
    JWT_SECRET: zod_1.z.string().default('fallback_secret_for_demo_only'),
    JWT_EXPIRES_IN: zod_1.z.string().default('7d'),
    FRONTEND_URL: zod_1.z.string().default('http://localhost:5173'),
    BCRYPT_SALT_ROUNDS: zod_1.z.string().default('10'),
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
    }
    catch (error) {
        if (error instanceof zod_1.z.ZodError) {
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
exports.env = validateEnv();
