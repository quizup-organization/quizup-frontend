import { queryClient } from '@/shared/api/query-client'
import { useStompSubscription } from '@/shared/websocket/use-stomp-subscription'

export function useChallengeWebSocket(challengeId: string | null) {
  useStompSubscription({
    destination: `/topic/challenges/${challengeId}`,
    onMessage: () => queryClient.invalidateQueries({ queryKey: ['challenges'] }),
    enabled: Boolean(challengeId),
  })
}

