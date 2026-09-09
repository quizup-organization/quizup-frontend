import { createPaginationSearchStore } from '@/shared/stores/create-pagination-search-store'

export const useFriendshipListSearchStore = createPaginationSearchStore({
  storageKey: 'quizup:social:friendships-search',
  defaultSorts: [{ property: 'friendsSince', direction: 'DESC' }],
  defaultPage: { number: 0, size: 10 },
})
