/**
 * JWT Utilities - Token generation, verification, and extraction helpers for secure authentication
 * Provides functions to create signed tokens, verify existing tokens, and extract tokens from Authorization headers
 */

import jwt from 'jsonwebtoken';
import { env } from '../config/env';

/**
 * JWT payload interface defining token structure
 */
export interface JWTPayload {
  userId: string;
  email: string;
}

/**
 * Generates a JWT token for authenticated user
 * @param payload - User data to encode in token
 * @returns Signed JWT token string
 */
export const generateToken = (payload: JWTPayload): string => {
  return jwt.sign(
    payload,
    env.JWT_SECRET,
    {
      expiresIn: env.JWT_EXPIRES_IN,
      issuer: 'task-manager-api',
    }
  );
};

/**
 * Verifies and decodes a JWT token
 * @param token - JWT token string to verify
 * @returns Decoded token payload
 * @throws Error if token is invalid or expired
 */
export const verifyToken = (token: string): JWTPayload => {
  try {
    const decoded = jwt.verify(token, env.JWT_SECRET) as JWTPayload;
    return decoded;
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      throw new Error('Token has expired');
    }
    if (error instanceof jwt.JsonWebTokenError) {
      throw new Error('Invalid token');
    }
    throw new Error('Token verification failed');
  }
};

/**
 * Extracts token from Authorization header
 * @param authHeader - Authorization header value
 * @returns Extracted token or null
 */
export const extractTokenFromHeader = (authHeader?: string): string | null => {
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }
  return authHeader.split(' ')[1];
};