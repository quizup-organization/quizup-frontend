import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import type { SearchRequest } from '@/shared/types/pagination.types'
import type {
  CreateQuestionRequest,
  CreateTopicRequest,
  RejectQuestionRequest,
} from '../types/theme.types'
import * as themeApi from './theme.api'

export const THEME_QUERY_KEYS = {
  topics: (search: SearchRequest) => ['theme', 'topics', search] as const,
  topic: (topicId: string) => ['theme', 'topics', topicId] as const,
  questions: (search: SearchRequest) => ['theme', 'questions', search] as const,
  question: (questionId: string) => ['theme', 'questions', questionId] as const,
}

export function useTopics(search: SearchRequest) {
  return useQuery({
    queryKey: THEME_QUERY_KEYS.topics(search),
    queryFn: () => themeApi.searchTopics(search),
  })
}

export function useTopic(topicId: string) {
  return useQuery({
    queryKey: THEME_QUERY_KEYS.topic(topicId),
    queryFn: () => themeApi.getTopicById(topicId),
    enabled: Boolean(topicId),
  })
}

export function useCreateTopic() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (body: CreateTopicRequest) => themeApi.createTopic(body),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['theme', 'topics'] }),
  })
}

export function usePublishTopic() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (topicId: string) => themeApi.publishTopic(topicId),
    onSuccess: (_, topicId) => {
      void queryClient.invalidateQueries({ queryKey: THEME_QUERY_KEYS.topic(topicId) })
      void queryClient.invalidateQueries({ queryKey: ['theme', 'topics'] })
    },
  })
}

export function useQuestions(search: SearchRequest) {
  return useQuery({
    queryKey: THEME_QUERY_KEYS.questions(search),
    queryFn: () => themeApi.searchQuestions(search),
  })
}

export function useCreateQuestion() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (body: CreateQuestionRequest) => themeApi.createQuestion(body),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['theme', 'questions'] }),
  })
}

export function useApproveQuestion() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (questionId: string) => themeApi.approveQuestion(questionId),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['theme', 'questions'] }),
  })
}

export function useRejectQuestion() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ questionId, body }: { questionId: string; body: RejectQuestionRequest }) =>
      themeApi.rejectQuestion(questionId, body),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['theme', 'questions'] }),
  })
}

