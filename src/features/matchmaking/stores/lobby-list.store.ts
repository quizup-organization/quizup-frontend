import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { FilterRequest, PageRequest, SearchRequest, SortRequest } from '@/shared/types/pagination.types'

interface LobbyListSearchState {
  selectedTopicId: string
  filters: FilterRequest[]
  sorts: SortRequest[]
  page: PageRequest
  setSelectedTopicId: (topicId: string) => void
  setPageNumber: (pageNumber: number) => void
  setPageSize: (pageSize: number) => void
  toSearchRequest: () => SearchRequest
}

const defaultPage: PageRequest = { number: 0, size: 10 }

export const useLobbyListSearchStore = create<LobbyListSearchState>()(
  persist(
    (set, get) => ({
      selectedTopicId: '',
      filters: [{ property: 'status', operator: 'EQUALS', value: 'OPEN' }],
      sorts: [{ property: 'createdAt', direction: 'ASC' }],
      page: defaultPage,
      setSelectedTopicId: (topicId) => {
        const baseFilters: FilterRequest[] = [{ property: 'status', operator: 'EQUALS', value: 'OPEN' }]
        const topicFilter: FilterRequest[] = topicId
          ? [{ property: 'topicId', operator: 'EQUALS', value: topicId }]
          : []
        set(() => ({
          selectedTopicId: topicId,
          filters: [...baseFilters, ...topicFilter],
          page: { ...get().page, number: 0 },
        }))
      },
      setPageNumber: (pageNumber) => set((state) => ({ page: { ...state.page, number: Math.max(0, pageNumber) } })),
      setPageSize: (pageSize) => set((state) => ({ page: { number: 0, size: pageSize }, filters: state.filters })),
      toSearchRequest: () => {
        const state = get()
        return { filters: state.filters, sorts: state.sorts, page: state.page }
      },
    }),
    { name: 'quizup:matchmaking:lobbies-search' },
  ),
)

