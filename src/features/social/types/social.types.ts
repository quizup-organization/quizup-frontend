export type FriendRequestStatus = 'PENDING' | 'ACCEPTED'
export type FriendRequestDirection = 'RECEIVED' | 'SENT'

export interface FriendRequestResponse {
  requestId: string
  senderId: string
  targetId: string
  sentAt: string
}

export interface FriendshipResponse {
  friendshipId: string
  userId1: string
  userId2: string
  friendsSince: string
}

export interface SendFriendRequest {
  targetId: string
}

