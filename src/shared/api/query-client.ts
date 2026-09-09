import { QueryClient } from '@tanstack/react-query'

function hasHttpStatus(error: unknown): error is { response?: { status?: number } } {
  return typeof error === 'object' && error !== null
}

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 2,
      gcTime: 1000 * 60 * 10,
      retry: (failureCount, error: unknown) => {
        if (hasHttpStatus(error) && [401, 403, 404].includes(error.response?.status ?? -1)) {
          return false
        }
        return failureCount < 2
      },
      refetchOnWindowFocus: false,
    },
    mutations: {
      retry: 0,
    },
  },
})
