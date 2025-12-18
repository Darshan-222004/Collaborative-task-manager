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
 * Global Zustand store for managing authentication state.
 * Persists token to localStorage for session persistence.
 */
export const useAuthStore = create<AuthState>((set) => ({
    user: null,
    token: localStorage.getItem('token'),
    isAuthenticated: !!localStorage.getItem('token'),

    /**
     * Sets the authenticated user and token.
     * Saves token to localStorage.
     */
    setAuth: (user, token) => {
        localStorage.setItem('token', token);
        set({ user, token, isAuthenticated: true });
    },

    /**
     * Logs out the user.
     * Clears token from localStorage and resets state.
     */
    logout: () => {
        localStorage.removeItem('token');
        set({ user: null, token: null, isAuthenticated: false });
    },
}));
