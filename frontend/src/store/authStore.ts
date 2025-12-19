/**
 * authStore - Zustand store managing authentication state, user data, and login/logout actions
 * Provides global access to authentication status, token management, and user profile information across the app
 */

import { create } from 'zustand';

interface User {
    _id: string;
    name: string;
    email: string;
}

interface AuthState {
    user: User | null;
    token: string | null;
    isAuthenticated: boolean;
    setAuth: (user: User, token: string) => void;
    logout: () => void;
}

/**
 * Helper function to get stored user from localStorage
 */
const getStoredUser = (): User | null => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
        try {
            return JSON.parse(storedUser);
        } catch {
            return null;
        }
    }
    return null;
};

/**
 * Global Zustand store for managing authentication state.
 * Persists token and user data to localStorage for session persistence.
 */
export const useAuthStore = create<AuthState>((set) => ({
    user: getStoredUser(),
    token: localStorage.getItem('token'),
    isAuthenticated: !!localStorage.getItem('token'),

    /**
     * Sets the authenticated user and token.
     * Saves both token and user data to localStorage.
     */
    setAuth: (user, token) => {
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(user));
        set({ user, token, isAuthenticated: true });
    },

    /**
     * Logs out the user.
     * Clears token and user data from localStorage and resets state.
     */
    logout: () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        set({ user: null, token: null, isAuthenticated: false });
    },
}));

