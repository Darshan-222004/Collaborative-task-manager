import { QueryClient } from '@tanstack/react-query';

/**
 * Global QueryClient instance for React Query.
 * Configured with default options for caching and refetching.
 * - staleTime: 5 minutes (data remains fresh for 5 mins)
 * - retry: 1 (retry failed requests once)
 * - refetchOnWindowFocus: false (prevent refetching when switching tabs)
 */
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});
