import { axiosInstance } from '@/shared/api/axios-instance'
import type { PageResponse, SearchRequest } from '@/shared/types/pagination.types'
import type { UserResponse } from '../types/identity.types'

const IDENTITY_API_BASE = '/identity-service/api'

export const getUserById = (userId: string) =>
  axiosInstance
    .get<UserResponse>(`${IDENTITY_API_BASE}/users/${userId}`)
    .then((response) => response.data)

export const searchUsers = (body: SearchRequest) =>
  axiosInstance
    .post<PageResponse<UserResponse>>(`${IDENTITY_API_BASE}/users/search`, body)
    .then((response) => response.data)

export const getMe = () =>
  axiosInstance
    .get<{ userId: string; email: string }>(`${IDENTITY_API_BASE}/authentication/me`)
    .then((response) => response.data)
