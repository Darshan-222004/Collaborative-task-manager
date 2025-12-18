/**
 * @file app.ts
 * Express application configuration.
 * Sets up middleware, routes, and error handlers.
 */

import express, { Application } from 'express';
import cors from 'cors';
import { env } from './config/env';
import routes from './routes';
import { errorHandler, notFoundHandler } from './middlewares/error.middleware';
import logger from './utils/logger';

const app: Application = express();

// Middleware
app.use(cors({
    origin: env.FRONTEND_URL,
    credentials: true,
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging
app.use((req, res, next) => {
    logger.info(`${req.method} ${req.path}`);
    next();
});

// API Routes
app.use('/api/v1', routes);

// Health check
app.get('/health', (req, res) => {
    res.status(200).json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Error Handlers
app.use(notFoundHandler);
app.use(errorHandler);

export default app;
