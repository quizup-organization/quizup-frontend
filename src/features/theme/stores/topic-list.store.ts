import { createPaginationSearchStore } from '@/shared/stores/create-pagination-search-store'

export const useTopicListSearchStore = createPaginationSearchStore({
  storageKey: 'quizup:theme:topics-search',
  defaultSorts: [{ property: 'createdAt', direction: 'DESC' }],
  defaultPage: { number: 0, size: 20 },
})

