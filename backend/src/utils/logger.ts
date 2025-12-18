import { env } from '../config/env';

/**
 * ANSI color codes for terminal output
 */
const colors = {
    reset: '\x1b[0m',
    red: '\x1b[31m',
    green: '\x1b[32m',
    yellow: '\x1b[33m',
    blue: '\x1b[34m',
    magenta: '\x1b[35m',
    cyan: '\x1b[36m',
};

/**
 * Logger utility class for consistent application logging
 */
class Logger {

    /**
     * Formats timestamp for log entries
     */
    private getTimestamp(): string {
        return new Date().toISOString();
    }

    /**
     * Logs informational messages (normal operation)
     */
    info(message: string, ...args: any[]): void {
        console.log(
            `${colors.cyan}[INFO]${colors.reset} ${colors.blue}${this.getTimestamp()}${colors.reset} - ${message}`,
            ...args
        );
    }

    /**
     * Logs warning messages (potential issues)
     */
    warn(message: string, ...args: any[]): void {
        console.warn(
            `${colors.yellow}[WARN]${colors.reset} ${colors.blue}${this.getTimestamp()}${colors.reset} - ${message}`,
            ...args
        );
    }

    /**
     * Logs error messages (failures and exceptions)
     */
    error(message: string, ...args: any[]): void {
        console.error(
            `${colors.red}[ERROR]${colors.reset} ${colors.blue}${this.getTimestamp()}${colors.reset} - ${message}`,
            ...args
        );
    }

    /**
     * Logs success messages (successful operations)
     */
    success(message: string, ...args: any[]): void {
        console.log(
            `${colors.green}[SUCCESS]${colors.reset} ${colors.blue}${this.getTimestamp()}${colors.reset} - ${message}`,
            ...args
        );
    }

    /**
     * Logs debug messages (only in development)
     */
    debug(message: string, ...args: any[]): void {
        if (env.NODE_ENV === 'development') {
            console.log(
                `${colors.magenta}[DEBUG]${colors.reset} ${colors.blue}${this.getTimestamp()}${colors.reset} - ${message}`,
                ...args
            );
        }
    }
}

export default new Logger();