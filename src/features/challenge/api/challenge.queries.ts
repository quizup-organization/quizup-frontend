import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import type { SearchRequest } from '@/shared/types/pagination.types'
import type { CreateChallengeRequest } from '../types/challenge.types'
import * as challengeApi from './challenge.api'

export const CHALLENGE_QUERY_KEYS = {
  challenges: (search: SearchRequest) => ['challenges', 'search', search] as const,
  challenge: (challengeId: string) => ['challenges', challengeId] as const,
}

export function useChallenges(search: SearchRequest) {
  return useQuery({
    queryKey: CHALLENGE_QUERY_KEYS.challenges(search),
    queryFn: () => challengeApi.searchChallenges(search),
  })
}

export function useChallenge(challengeId: string) {
  return useQuery({
    queryKey: CHALLENGE_QUERY_KEYS.challenge(challengeId),
    queryFn: () => challengeApi.getChallengeById(challengeId),
    enabled: Boolean(challengeId),
  })
}

export function useCreateChallenge() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (body: CreateChallengeRequest) => challengeApi.createChallenge(body),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['challenges'] }),
  })
}

export function useAcceptChallenge() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (challengeId: string) => challengeApi.acceptChallenge(challengeId),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['challenges'] }),
  })
}

export function useDeclineChallenge() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (challengeId: string) => challengeApi.declineChallenge(challengeId),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['challenges'] }),
  })
}

