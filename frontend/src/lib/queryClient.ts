import { MutationCache, QueryCache, QueryClient } from '@tanstack/react-query'
import { client } from '@/client/client.gen'
import { useAuthStore } from '@/store/useAuthStore'

client.setConfig({
  baseUrl: import.meta.env.VITE_API_URL || '',
  credentials: 'include',
  throwOnError: true,
})

client.interceptors.error.use((error, response) => {
  if (response && [401, 403].includes(response.status)) {
    useAuthStore.getState().setUser(null)
    localStorage.removeItem('logged_in')
    if (!['/login', '/signup'].includes(window.location.pathname)) {
      window.location.href = '/login'
    }
  }
  return error
})

export const handleApiError = (error: unknown) => {
  const status = (error as any)?.status || (error as any)?.response?.status
  if (status && [401, 403].includes(status)) {
    useAuthStore.getState().setUser(null)
    localStorage.removeItem('logged_in')
    if (!['/login', '/signup'].includes(window.location.pathname)) {
      window.location.href = '/login'
    }
  }
}

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: (failureCount, error) => {
        const status =
          (error as any)?.status || (error as any)?.response?.status
        if (status && [401, 403, 404].includes(status)) {
          return false
        }
        return failureCount < 3
      },
    },
  },
  queryCache: new QueryCache({
    onError: handleApiError,
  }),
  mutationCache: new MutationCache({
    onError: handleApiError,
  }),
})
