import type { GameNotification } from '../types/game.types'
import { useGameStore } from '../stores/game.store'
import { useStompSubscription } from '@/shared/websocket/use-stomp-subscription'

export function useGameWebSocket(gameId: string | null) {
  const applyNotification = useGameStore((state) => state.applyNotification)

  useStompSubscription<GameNotification>({
    destination: `/topic/games/${gameId}`,
    onMessage: (notification) => applyNotification(notification),
    enabled: Boolean(gameId),
  })
}
