/**
 * Jest Configuration - Test environment setup for backend unit tests with JavaScript support
 * Configured for Node environment with simple test pattern matching to avoid TypeScript compilation issues
 */

module.exports = {
    testEnvironment: 'node',
    testMatch: ['**/tests/**/*.test.js'],
    clearMocks: true,
    resetMocks: true,
    verbose: true,
};
