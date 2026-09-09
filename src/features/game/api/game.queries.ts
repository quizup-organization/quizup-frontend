import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import type { SearchRequest } from '@/shared/types/pagination.types'
import type { AnswerQuestionRequest, CreateBotGameRequest } from '../types/game.types'
import * as gameApi from './game.api'

export const GAME_QUERY_KEYS = {
  games: (search: SearchRequest) => ['games', 'search', search] as const,
  game: (gameId: string) => ['games', gameId] as const,
  notifications: (gameId: string) => ['games', gameId, 'notifications'] as const,
}

export function useGames(search: SearchRequest) {
  return useQuery({
    queryKey: GAME_QUERY_KEYS.games(search),
    queryFn: () => gameApi.searchGames(search),
  })
}

export function useGame(gameId: string) {
  return useQuery({
    queryKey: GAME_QUERY_KEYS.game(gameId),
    queryFn: () => gameApi.getGameById(gameId),
    enabled: Boolean(gameId),
  })
}

export function useGameNotifications(gameId: string) {
  return useQuery({
    queryKey: GAME_QUERY_KEYS.notifications(gameId),
    queryFn: () => gameApi.getGameNotifications(gameId),
    enabled: Boolean(gameId),
  })
}

export function useCreateBotGame() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (body: CreateBotGameRequest) => gameApi.createBotGame(body),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['games'] }),
  })
}

export function useJoinGame() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (gameId: string) => gameApi.joinGame(gameId),
    onSuccess: (_, gameId) => {
      void queryClient.invalidateQueries({ queryKey: GAME_QUERY_KEYS.game(gameId) })
      void queryClient.invalidateQueries({ queryKey: GAME_QUERY_KEYS.notifications(gameId) })
    },
  })
}

export function useAnswerQuestion(gameId: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (body: AnswerQuestionRequest) => gameApi.answerQuestion(gameId, body),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: GAME_QUERY_KEYS.game(gameId) })
      void queryClient.invalidateQueries({ queryKey: GAME_QUERY_KEYS.notifications(gameId) })
    },
  })
}

