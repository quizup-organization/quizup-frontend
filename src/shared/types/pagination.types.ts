export interface SortResponse {
  property: string
  direction: 'ASC' | 'DESC'
}

export interface PageResponse<T> {
  content: T[]
  pageNumber: number
  pageSize: number
  totalElements: number
  totalPages: number
  sorts: SortResponse[]
  first: boolean
  last: boolean
  empty: boolean
}

export type FilterOperator =
  | 'LESS_THAN'
  | 'GREATER_THAN'
  | 'EQUALS'
  | 'NOT_EQUALS'
  | 'CONTAINS'
  | 'NOT_CONTAINS'
  | 'IN'
  | 'NOT_IN'
  | 'BETWEEN'
  | 'STARTS_WITH'
  | 'ENDS_WITH'
  | 'BLANK'
  | 'NOT_BLANK'

export interface FilterRequest {
  property: string
  operator: FilterOperator
  value?: unknown
  valueTo?: unknown
  values?: unknown[]
}

export interface SortRequest {
  property: string
  direction: 'ASC' | 'DESC'
}

export interface PageRequest {
  number: number
  size: number
}

export interface SearchRequest {
  filters?: FilterRequest[]
  sorts?: SortRequest[]
  page?: PageRequest
}
