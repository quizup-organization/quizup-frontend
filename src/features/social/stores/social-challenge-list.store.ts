import { createPaginationSearchStore } from '@/shared/stores/create-pagination-search-store'

export const useSocialChallengeListSearchStore = createPaginationSearchStore({
  storageKey: 'quizup:social:challenges-search',
  defaultSorts: [{ property: 'createdAt', direction: 'DESC' }],
  defaultPage: { number: 0, size: 10 },
})
