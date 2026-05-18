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

export type ChallengeStatus = 'PENDING' | 'ACCEPTED' | 'DECLINED' | 'EXPIRED'

export interface ChallengeResponse {
  challengeId: string
  challengerId: string
  challengedId: string
  topicId: string
  status: ChallengeStatus
  createdAt: string
  acceptedAt: string | null
  declinedAt: string | null
  expiresAt: string
}

export interface CreateChallengeRequest {
  challengedId: string
  topicId: string
}

export type SocialNotificationType =
  | 'FRIEND_REQUEST_RECEIVED'
  | 'FRIEND_REQUEST_ACCEPTED'
  | 'FRIEND_REQUEST_REJECTED'
  | 'CHALLENGE_RECEIVED'
  | 'CHALLENGE_ACCEPTED'
  | 'CHALLENGE_DECLINED'
  | 'CHALLENGE_EXPIRED'

export interface SocialNotificationBase {
  type: SocialNotificationType
  userId: string
}

export interface FriendRequestReceivedNotification extends SocialNotificationBase {
  type: 'FRIEND_REQUEST_RECEIVED'
  requestId: string
  senderId: string
  timestamp: string
}

export interface FriendRequestAcceptedNotification extends SocialNotificationBase {
  type: 'FRIEND_REQUEST_ACCEPTED'
  requestId: string
  acceptedBy: string
  timestamp: string
}

export interface FriendRequestRejectedNotification extends SocialNotificationBase {
  type: 'FRIEND_REQUEST_REJECTED'
  requestId: string
  rejectedBy: string
  timestamp: string
}

export interface ChallengeReceivedNotification extends SocialNotificationBase {
  type: 'CHALLENGE_RECEIVED'
  challengeId: string
  challengerId: string
  topicId: string
  expiresAt: string
}

export interface ChallengeAcceptedNotification extends SocialNotificationBase {
  type: 'CHALLENGE_ACCEPTED'
  challengeId: string
  gameId: string
  acceptedBy: string
  timestamp: string
}

export interface ChallengeDeclinedNotification extends SocialNotificationBase {
  type: 'CHALLENGE_DECLINED'
  challengeId: string
  declinedBy: string
  timestamp: string
}

export interface ChallengeExpiredNotification extends SocialNotificationBase {
  type: 'CHALLENGE_EXPIRED'
  challengeId: string
  timestamp: string
}

export type SocialNotification =
  | FriendRequestReceivedNotification
  | FriendRequestAcceptedNotification
  | FriendRequestRejectedNotification
  | ChallengeReceivedNotification
  | ChallengeAcceptedNotification
  | ChallengeDeclinedNotification
  | ChallengeExpiredNotification

