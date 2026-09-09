import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import type { SearchRequest } from '@/shared/types/pagination.types'
import * as matchmakingApi from './matchmaking.api'

export const MATCHMAKING_QUERY_KEYS = {
  lobbies: (search: SearchRequest) => ['matchmaking', 'lobbies', 'search', search] as const,
  lobby: (lobbyId: string) => ['matchmaking', 'lobbies', lobbyId] as const,
}

export function useOpenLobbies(search: SearchRequest) {
  return useQuery({
    queryKey: MATCHMAKING_QUERY_KEYS.lobbies(search),
    queryFn: () => matchmakingApi.searchLobbies(search),
    refetchInterval: 5000,
  })
}

export function useLobby(lobbyId: string) {
  return useQuery({
    queryKey: MATCHMAKING_QUERY_KEYS.lobby(lobbyId),
    queryFn: () => matchmakingApi.getLobbyById(lobbyId),
    enabled: Boolean(lobbyId),
  })
}

export function useCreateLobby() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: matchmakingApi.createLobby,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['matchmaking'] }),
  })
}

export function useJoinLobby() {
  return useMutation({
    mutationFn: (lobbyId: string) => matchmakingApi.joinLobby(lobbyId),
  })
}

export function useCancelLobby() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (lobbyId: string) => matchmakingApi.cancelLobby(lobbyId),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['matchmaking'] }),
  })
}
