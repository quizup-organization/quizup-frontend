import { axiosInstance } from '@/shared/api/axios-instance'
import type { PageResponse, SearchRequest } from '@/shared/types/pagination.types'
import type {
  AnswerQuestionRequest,
  CreateBotGameRequest,
  GameNotification,
  GameResponse,
} from '../types/game.types'

const GAME_API_BASE = '/game-service/api'

export const createBotGame = (body: CreateBotGameRequest) =>
  axiosInstance.post<void>(`${GAME_API_BASE}/games`, body)

export const getGameById = (gameId: string) =>
  axiosInstance
    .get<GameResponse>(`${GAME_API_BASE}/games/${gameId}`)
    .then((response) => response.data)

export const getGameNotifications = (gameId: string) =>
  axiosInstance
    .get<GameNotification[]>(`${GAME_API_BASE}/games/${gameId}/notifications`)
    .then((response) => response.data)

export const joinGame = (gameId: string) =>
  axiosInstance.post<void>(`${GAME_API_BASE}/games/${gameId}/join`)

export const answerQuestion = (gameId: string, body: AnswerQuestionRequest) =>
  axiosInstance.post<void>(`${GAME_API_BASE}/games/${gameId}/answer`, body)

export const searchGames = (body: SearchRequest) =>
  axiosInstance
    .post<PageResponse<GameResponse>>(`${GAME_API_BASE}/games/search`, body)
    .then((response) => response.data)
