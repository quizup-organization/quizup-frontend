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

