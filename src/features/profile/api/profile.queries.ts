import { useQuery } from '@tanstack/react-query'
import { axiosInstance } from '@/shared/api/axios-instance'
import type { UserMedal, UserTopicProgress } from '../types/profile.types'

const PROFILE_API_BASE = '/user-service/api/profile/users'

export const PROFILE_QUERY_KEYS = {
  progress: (userId: string) => ['profile', 'progress', userId] as const,
  medals: (userId: string) => ['profile', 'medals', userId] as const,
}

export function useUserProgress(userId: string) {
  return useQuery({
    queryKey: PROFILE_QUERY_KEYS.progress(userId),
    queryFn: () =>
      axiosInstance.get<UserTopicProgress[]>(`${PROFILE_API_BASE}/${userId}/progress`).then((response) => response.data),
    enabled: Boolean(userId),
  })
}

export function useUserMedals(userId: string) {
  return useQuery({
    queryKey: PROFILE_QUERY_KEYS.medals(userId),
    queryFn: () =>
      axiosInstance.get<UserMedal[]>(`${PROFILE_API_BASE}/${userId}/medals`).then((response) => response.data),
    enabled: Boolean(userId),
  })
}

