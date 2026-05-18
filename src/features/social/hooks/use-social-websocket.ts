import {toast} from 'sonner'
import {useAuth} from 'react-oidc-context'
import {queryClient} from '@/shared/api/query-client'
import {useStompSubscription} from '@/shared/websocket/use-stomp-subscription'

export function useSocialWebSocket() {
    const {user} = useAuth()
    const userId = user?.profile?.sub

    useStompSubscription({
        serviceName: "social-service",
        destination: `/topic/friend-requests/${userId}`,
        onMessage: () => {
            toast.success('Nouvelle demande d\'ami recue !')
            queryClient.invalidateQueries({queryKey: ['social', 'friend-requests']})
        },
        enabled: Boolean(userId),
    })

    useStompSubscription({
        serviceName: "social-service",
        destination: `/topic/friend-accepted/${userId}`,
        onMessage: () => {
            toast.success('Demande d\'ami acceptee !')
            queryClient.invalidateQueries({queryKey: ['social', 'friendships']})
        },
        enabled: Boolean(userId),
    })
}

