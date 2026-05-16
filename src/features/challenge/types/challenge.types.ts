export type ChallengeStatus = 'PENDING' | 'ACCEPTED' | 'DECLINED' | 'EXPIRED'
export type ChallengeDirection = 'SENT' | 'RECEIVED'

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

export type ChallengeNotificationType =
  | 'CHALLENGE_RECEIVED'
  | 'CHALLENGE_ACCEPTED'
  | 'CHALLENGE_DECLINED'
  | 'CHALLENGE_EXPIRED'

export interface ChallengeNotification {
  type: ChallengeNotificationType
  challengeId: string
}

