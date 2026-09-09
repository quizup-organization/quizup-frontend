import { axiosInstance } from '@/shared/api/axios-instance'
import type { PageResponse, SearchRequest } from '@/shared/types/pagination.types'
import type { LobbyNotification, LobbyResponse, OpenLobbyRequest } from '../types/matchmaking.types'

const MATCHMAKING_API_BASE = '/matchmaking-service/api'

export const searchLobbies = (body: SearchRequest) =>
  axiosInstance
    .post<PageResponse<LobbyResponse>>(`${MATCHMAKING_API_BASE}/lobbies/search`, body)
    .then((response) => response.data)

export const createLobby = (body: OpenLobbyRequest) =>
  axiosInstance.post<void>(`${MATCHMAKING_API_BASE}/lobbies`, body)

export const getLobbyById = (lobbyId: string) =>
  axiosInstance
    .get<LobbyResponse>(`${MATCHMAKING_API_BASE}/lobbies/${lobbyId}`)
    .then((response) => response.data)

export const getLobbyNotifications = (lobbyId: string) =>
  axiosInstance
    .get<LobbyNotification[]>(`${MATCHMAKING_API_BASE}/lobbies/${lobbyId}/notifications`)
    .then((response) => response.data)

export const joinLobby = (lobbyId: string) =>
  axiosInstance.post<void>(`${MATCHMAKING_API_BASE}/lobbies/${lobbyId}/join`)

export const cancelLobby = (lobbyId: string) =>
  axiosInstance.delete<void>(`${MATCHMAKING_API_BASE}/lobbies/${lobbyId}`)
