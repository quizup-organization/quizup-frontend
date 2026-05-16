import { createPaginationSearchStore } from '@/shared/stores/create-pagination-search-store'

export const useChallengeListSearchStore = createPaginationSearchStore({
  storageKey: 'quizup:challenge:list-search',
  defaultSorts: [{ property: 'createdAt', direction: 'DESC' }],
  defaultPage: { number: 0, size: 10 },
})

