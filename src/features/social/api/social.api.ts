import { axiosInstance } from '@/shared/api/axios-instance'
import type { PageResponse, SearchRequest } from '@/shared/types/pagination.types'
import type {
  ChallengeResponse,
  CreateChallengeRequest,
  FriendRequestResponse,
  FriendshipResponse,
  SendFriendRequest,
} from '../types/social.types'

const SOCIAL_API_BASE = '/social-service/api'

export const sendFriendRequest = (body: SendFriendRequest) =>
  axiosInstance.post<void>(`${SOCIAL_API_BASE}/friend-requests`, body)

export const searchFriendRequests = (body: SearchRequest) =>
  axiosInstance
    .post<PageResponse<FriendRequestResponse>>(`${SOCIAL_API_BASE}/friend-requests/search`, body)
    .then((response) => response.data)

export const acceptFriendRequest = (requestId: string) =>
  axiosInstance.post<void>(`${SOCIAL_API_BASE}/friend-requests/${requestId}/accept`)

export const rejectFriendRequest = (requestId: string) =>
  axiosInstance.post<void>(`${SOCIAL_API_BASE}/friend-requests/${requestId}/reject`)

export const cancelFriendRequest = (requestId: string) =>
  axiosInstance.post<void>(`${SOCIAL_API_BASE}/friend-requests/${requestId}/cancel`)

export const searchFriendships = (body: SearchRequest) =>
  axiosInstance
    .post<PageResponse<FriendshipResponse>>(`${SOCIAL_API_BASE}/friendships/search`, body)
    .then((response) => response.data)

export const removeFriendship = (friendshipId: string) =>
  axiosInstance.delete<void>(`${SOCIAL_API_BASE}/friendships/${friendshipId}`)

export const createChallenge = (body: CreateChallengeRequest) =>
  axiosInstance
    .post<ChallengeResponse>(`${SOCIAL_API_BASE}/challenges`, body)
    .then((response) => response.data)

export const getChallengeById = (challengeId: string) =>
  axiosInstance
    .get<ChallengeResponse>(`${SOCIAL_API_BASE}/challenges/${challengeId}`)
    .then((response) => response.data)

export const searchChallenges = (body: SearchRequest) =>
  axiosInstance
    .post<PageResponse<ChallengeResponse>>(`${SOCIAL_API_BASE}/challenges/search`, body)
    .then((response) => response.data)

export const acceptChallenge = (challengeId: string) =>
  axiosInstance.post<void>(`${SOCIAL_API_BASE}/challenges/${challengeId}/accept`)

export const declineChallenge = (challengeId: string) =>
  axiosInstance.post<void>(`${SOCIAL_API_BASE}/challenges/${challengeId}/decline`)
