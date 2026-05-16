import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import type { SearchRequest } from '@/shared/types/pagination.types'
import * as socialApi from './social.api'

export const SOCIAL_QUERY_KEYS = {
  friendRequests: (search: SearchRequest) => ['social', 'friend-requests', 'search', search] as const,
  friendships: (search: SearchRequest) => ['social', 'friendships', 'search', search] as const,
}

export function useFriendRequests(search: SearchRequest) {
  return useQuery({
    queryKey: SOCIAL_QUERY_KEYS.friendRequests(search),
    queryFn: () => socialApi.searchFriendRequests(search),
  })
}

export function useFriendships(search: SearchRequest) {
  return useQuery({
    queryKey: SOCIAL_QUERY_KEYS.friendships(search),
    queryFn: () => socialApi.searchFriendships(search),
  })
}

export function useSendFriendRequest() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (targetId: string) => socialApi.sendFriendRequest({ targetId }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['social'] }),
  })
}

export function useAcceptFriendRequest() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (requestId: string) => socialApi.acceptFriendRequest(requestId),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['social'] }),
  })
}

export function useRejectFriendRequest() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (requestId: string) => socialApi.rejectFriendRequest(requestId),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['social'] }),
  })
}

export function useCancelFriendRequest() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (requestId: string) => socialApi.cancelFriendRequest(requestId),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['social'] }),
  })
}

export function useRemoveFriendship() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (friendshipId: string) => socialApi.removeFriendship(friendshipId),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['social', 'friendships'] }),
  })
}

