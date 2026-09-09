import { useQuery } from '@tanstack/react-query'
import type { SearchRequest } from '@/shared/types/pagination.types'
import { getMe, getUserById, searchUsers } from './identity.api'

export const IDENTITY_QUERY_KEYS = {
  me: () => ['identity', 'me'] as const,
  user: (userId: string) => ['identity', 'users', userId] as const,
  users: (search: SearchRequest) => ['identity', 'users', 'search', search] as const,
}

export function useMe() {
  return useQuery({
    queryKey: IDENTITY_QUERY_KEYS.me(),
    queryFn: getMe,
  })
}

export function useUser(userId: string) {
  return useQuery({
    queryKey: IDENTITY_QUERY_KEYS.user(userId),
    queryFn: () => getUserById(userId),
    enabled: Boolean(userId),
  })
}

export function useUsers(search: SearchRequest) {
  return useQuery({
    queryKey: IDENTITY_QUERY_KEYS.users(search),
    queryFn: () => searchUsers(search),
  })
}
