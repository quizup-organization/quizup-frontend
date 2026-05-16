export type LobbyStatus = 'OPEN' | 'COMPLETED' | 'CANCELLED'

export interface LobbyResponse {
  lobbyId: string
  topicId: string
  initiatorId: string
  challengerId: string | null
  gameId: string | null
  vsBot: boolean
  status: LobbyStatus
  createdAt: string
  updatedAt: string
}

export interface OpenLobbyRequest {
  topicId: string
}

export type LobbyNotificationType = 'OPENED' | 'JOINED' | 'COMPLETED' | 'CANCELLED' | 'EXPIRED'

export interface LobbyNotification {
  type: LobbyNotificationType
  lobbyId: string
}

export interface LobbyCompletedNotification extends LobbyNotification {
  type: 'COMPLETED'
  gameId: string
  vsBot: boolean
}

