import { axiosInstance } from '@/shared/api/axios-instance'
import type { PageResponse, SearchRequest } from '@/shared/types/pagination.types'
import type {
  CreateQuestionRequest,
  CreateTopicRequest,
  QuestionResponse,
  RejectQuestionRequest,
  TopicResponse,
} from '../types/theme.types'

const THEME_API_BASE = '/theme-service/api'

export const searchTopics = (body: SearchRequest) =>
  axiosInstance
    .post<PageResponse<TopicResponse>>(`${THEME_API_BASE}/topics/search`, body)
    .then((response) => response.data)

export const getTopicById = (topicId: string) =>
  axiosInstance
    .get<TopicResponse>(`${THEME_API_BASE}/topics/${topicId}`)
    .then((response) => response.data)

export const createTopic = (body: CreateTopicRequest) =>
  axiosInstance.post<void>(`${THEME_API_BASE}/topics`, body)

export const publishTopic = (topicId: string) =>
  axiosInstance.post<void>(`${THEME_API_BASE}/topics/${topicId}/publish`)

export const searchQuestions = (body: SearchRequest) =>
  axiosInstance
    .post<PageResponse<QuestionResponse>>(`${THEME_API_BASE}/questions/search`, body)
    .then((response) => response.data)

export const getQuestionById = (questionId: string) =>
  axiosInstance
    .get<QuestionResponse>(`${THEME_API_BASE}/questions/${questionId}`)
    .then((response) => response.data)

export const createQuestion = (body: CreateQuestionRequest) =>
  axiosInstance.post<void>(`${THEME_API_BASE}/questions`, body)

export const approveQuestion = (questionId: string) =>
  axiosInstance
    .post<QuestionResponse>(`${THEME_API_BASE}/questions/${questionId}/approve`)
    .then((response) => response.data)

export const rejectQuestion = (questionId: string, body: RejectQuestionRequest) =>
  axiosInstance
    .post<QuestionResponse>(`${THEME_API_BASE}/questions/${questionId}/reject`, body)
    .then((response) => response.data)
