import { toast } from 'sonner'
import { useAuth } from 'react-oidc-context'
import { queryClient } from '@/shared/api/query-client'
import { useNotificationStore } from '@/shared/stores/notification.store'
import { useStompSubscription } from '@/shared/websocket/use-stomp-subscription'
import type { SocialNotification } from '../types/social.types'

export function useSocialWebSocket() {
  const { user } = useAuth()
  const userId = user?.profile?.sub
  const incrementFriendRequests = useNotificationStore((state) => state.incrementFriendRequests)
  const incrementChallenges = useNotificationStore((state) => state.incrementChallenges)

  useStompSubscription<SocialNotification>({
    serviceName: 'social-service',
    destination: `/topic/social/${userId}`,
    onMessage: (notification) => {
      switch (notification.type) {
        case 'FRIEND_REQUEST_RECEIVED':
          incrementFriendRequests()
          toast.success('Nouvelle demande d\'ami recue')
          void queryClient.invalidateQueries({ queryKey: ['social', 'friend-requests'] })
          return
        case 'FRIEND_REQUEST_ACCEPTED':
          toast.success('Demande d\'ami acceptee')
          void queryClient.invalidateQueries({ queryKey: ['social', 'friendships'] })
          return
        case 'FRIEND_REQUEST_REJECTED':
          toast.info('Demande d\'ami rejetee')
          void queryClient.invalidateQueries({ queryKey: ['social', 'friend-requests'] })
          return
        case 'CHALLENGE_RECEIVED':
          incrementChallenges()
          toast.success('Nouveau defi recu')
          void queryClient.invalidateQueries({ queryKey: ['social', 'challenges'] })
          return
        case 'CHALLENGE_ACCEPTED':
          toast.success('Defi accepte')
          void queryClient.invalidateQueries({ queryKey: ['social', 'challenges'] })
          return
        case 'CHALLENGE_DECLINED':
          toast.info('Defi refuse')
          void queryClient.invalidateQueries({ queryKey: ['social', 'challenges'] })
          return
        case 'CHALLENGE_EXPIRED':
          toast.info('Defi expire')
          void queryClient.invalidateQueries({ queryKey: ['social', 'challenges'] })
      }
    },
    enabled: Boolean(userId),
  })
}

