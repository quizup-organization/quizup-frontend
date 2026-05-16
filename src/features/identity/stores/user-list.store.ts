import { createPaginationSearchStore } from '@/shared/stores/create-pagination-search-store'

export const useUserListSearchStore = createPaginationSearchStore({
  storageKey: 'quizup:identity:users-search',
  defaultSorts: [{ property: 'createdAt', direction: 'DESC' }],
  defaultPage: { number: 0, size: 20 },
})

