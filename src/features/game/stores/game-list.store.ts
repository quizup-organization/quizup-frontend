import { createPaginationSearchStore } from '@/shared/stores/create-pagination-search-store'

export const useGameListSearchStore = createPaginationSearchStore({
  storageKey: 'quizup:game:list-search',
  defaultSorts: [{ property: 'createdAt', direction: 'DESC' }],
  defaultPage: { number: 0, size: 10 },
})
