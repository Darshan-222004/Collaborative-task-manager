import { useMutation } from '@tanstack/react-query';
import { api } from '../lib/axios';
import { useAuthStore } from '../store/authStore';
import { useNavigate } from 'react-router-dom';

// Define local types if backend types aren't directly importable
interface RegisterData {
    name: string;
    email: string;
    password: string;
}

interface LoginData {
    email: string;
    password: string;
}

interface AuthResponse {
    success: boolean;
    data: {
        user: {
            _id: string;
            name: string;
            email: string;
        };
        token: string;
    };
}

/**
 * Hook for handling user registration.
 * On success, stores token and redirects to dashboard.
 */
export const useRegister = () => {
    const navigate = useNavigate();
    const setAuth = useAuthStore((state) => state.setAuth);

    return useMutation({
        mutationFn: async (data: RegisterData) => {
            const response = await api.post<AuthResponse>('/auth/register', data);
            return response.data;
        },
        onSuccess: (response) => {
            const { user, token } = response.data;
            setAuth(user, token);
            navigate('/');
        },
    });
};

/**
 * Hook for handling user login.
 * On success, stores token and redirects to dashboard.
 */
export const useLogin = () => {
    const navigate = useNavigate();
    const setAuth = useAuthStore((state) => state.setAuth);

    return useMutation({
        mutationFn: async (data: LoginData) => {
            const response = await api.post<AuthResponse>('/auth/login', data);
            return response.data;
        },
        onSuccess: (response) => {
            const { user, token } = response.data;
            setAuth(user, token);
            navigate('/');
        },
    });
};
