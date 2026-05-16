import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type {
  FilterRequest,
  PageRequest,
  SearchRequest,
  SortRequest,
} from '@/shared/types/pagination.types'

export interface PaginationSearchState {
  filters: FilterRequest[]
  sorts: SortRequest[]
  page: PageRequest
  setFilters: (filters: FilterRequest[]) => void
  setSorts: (sorts: SortRequest[]) => void
  setPageNumber: (pageNumber: number) => void
  setPageSize: (pageSize: number) => void
  reset: () => void
  toSearchRequest: () => SearchRequest
}

interface CreatePaginationSearchStoreOptions {
  storageKey: string
  defaultFilters?: FilterRequest[]
  defaultSorts?: SortRequest[]
  defaultPage?: PageRequest
}

export function createPaginationSearchStore({
  storageKey,
  defaultFilters = [],
  defaultSorts = [],
  defaultPage = { number: 0, size: 10 },
}: CreatePaginationSearchStoreOptions) {
  return create<PaginationSearchState>()(
    persist(
      (set, get) => ({
        filters: defaultFilters,
        sorts: defaultSorts,
        page: defaultPage,
        setFilters: (filters) => set((state) => ({ filters, page: { ...state.page, number: 0 } })),
        setSorts: (sorts) => set((state) => ({ sorts, page: { ...state.page, number: 0 } })),
        setPageNumber: (pageNumber) =>
          set((state) => ({ page: { ...state.page, number: Math.max(0, pageNumber) } })),
        setPageSize: (pageSize) => set(() => ({ page: { number: 0, size: pageSize } })),
        reset: () => set({ filters: defaultFilters, sorts: defaultSorts, page: defaultPage }),
        toSearchRequest: () => {
          const state = get()
          return {
            filters: state.filters,
            sorts: state.sorts,
            page: state.page,
          }
        },
      }),
      { name: storageKey },
    ),
  )
}

