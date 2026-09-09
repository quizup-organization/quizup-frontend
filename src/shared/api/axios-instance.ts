import axios, { type AxiosError } from 'axios'
import { normalizeError, type ProblemDetails } from '@/shared/types/error.types'

export const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_GATEWAY_BASE_URL ?? '/api',
  headers: { 'Content-Type': 'application/json' },
})

axiosInstance.interceptors.response.use(
  (response) => response,
  (error: unknown) => {
    if (axios.isAxiosError(error)) {
      ;(error as AxiosError & { data?: ProblemDetails | null }).data = normalizeError(error)
    }
    return Promise.reject(error)
  },
)

export function setAuthToken(token: string | null) {
  if (token) {
    axiosInstance.defaults.headers.common.Authorization = `Bearer ${token}`
    return
  }
  delete axiosInstance.defaults.headers.common.Authorization
}
