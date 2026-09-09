import { useNavigate } from 'react-router-dom'
import type { LobbyCompletedNotification, LobbyNotification } from '../types/matchmaking.types'
import { useStompSubscription } from '@/shared/websocket/use-stomp-subscription'

export function useLobbyWebSocket(lobbyId: string | null) {
  const navigate = useNavigate()

  useStompSubscription<LobbyNotification>({
    destination: `/topic/lobbies/${lobbyId}`,
    onMessage: (notification) => {
      if (notification.type === 'COMPLETED') {
        const completed = notification as LobbyCompletedNotification
        navigate(`/games/${completed.gameId}`)
      }
    },
    enabled: Boolean(lobbyId),
  })
}
