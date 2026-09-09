import type { AxiosError } from 'axios'

export type ProblemCategory =
  | 'TECHNICAL'
  | 'PERMISSION'
  | 'VALIDATION'
  | 'BUSINESS_AGGREGATE'
  | 'BUSINESS_INVALID_COMMAND'
  | 'BUSINESS_RESOURCE_MISSING'

export interface ProblemDetails {
  type: string
  category: ProblemCategory
  title: string
  detail: string
  context?: Record<string, unknown>
  timestamp: string
  status: number
  path: string
}

export function normalizeError(error: AxiosError): ProblemDetails | null {
  if (error.response?.data) {
    return error.response.data as ProblemDetails
  }
  if (error.code === 'ERR_NETWORK') {
    return {
      type: 'about:blank',
      category: 'TECHNICAL',
      title: 'Connection impossible',
      detail: 'Le serveur est injoignable. Vérifiez votre connexion puis réessayez.',
      timestamp: new Date().toISOString(),
      status: 0,
      path: error.config?.url ?? '',
    }
  }
  return null
}

export function getProblemDetails(error: unknown): ProblemDetails | null {
  if (error && typeof error === 'object') {
    const data = (error as { data?: unknown }).data
    if (data && typeof data === 'object' && 'title' in data) {
      return data as ProblemDetails
    }
  }
  return null
}
