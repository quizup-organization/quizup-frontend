import { axiosInstance } from '@/shared/api/axios-instance'
import type { PageResponse, SearchRequest } from '@/shared/types/pagination.types'
import type {
  ChallengeResponse,
  CreateChallengeRequest,
} from '../types/challenge.types'

const CHALLENGE_API_BASE = '/challenge-service/api'

export const createChallenge = (body: CreateChallengeRequest) =>
  axiosInstance.post<ChallengeResponse>(`${CHALLENGE_API_BASE}/challenges`, body).then((response) => response.data)

export const getChallengeById = (challengeId: string) =>
  axiosInstance.get<ChallengeResponse>(`${CHALLENGE_API_BASE}/challenges/${challengeId}`).then((response) => response.data)

export const searchChallenges = (body: SearchRequest) =>
  axiosInstance.post<PageResponse<ChallengeResponse>>(`${CHALLENGE_API_BASE}/challenges/search`, body).then((response) => response.data)

export const acceptChallenge = (challengeId: string) => axiosInstance.post<void>(`${CHALLENGE_API_BASE}/challenges/${challengeId}/accept`)

export const declineChallenge = (challengeId: string) => axiosInstance.post<void>(`${CHALLENGE_API_BASE}/challenges/${challengeId}/decline`)

