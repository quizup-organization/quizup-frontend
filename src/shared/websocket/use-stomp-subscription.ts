import type {IMessage} from '@stomp/stompjs'
import {useEffect, useRef} from 'react'
import {useAuth} from 'react-oidc-context'
import {getStompClient} from './stomp-client'

interface UseStompSubscriptionOptions<T> {
    serviceName: string
    destination: string
    onMessage: (data: T) => void
    enabled?: boolean
}

export function useStompSubscription<T>({
                                            serviceName,
                                            destination,
                                            onMessage,
                                            enabled = true,
                                        }: UseStompSubscriptionOptions<T>) {
    const {user} = useAuth()
    const subscriptionRef = useRef<{ unsubscribe: () => void } | null>(null)
    const onMessageRef = useRef(onMessage)

    useEffect(() => {
        onMessageRef.current = onMessage
    }, [onMessage])

    useEffect(() => {
        if (!enabled || !user?.access_token) {
            return
        }

        const client = getStompClient(serviceName, user.access_token)
        const connect = () => {
            subscriptionRef.current = client.subscribe(destination, (message: IMessage) => {
                try {
                    const payload = JSON.parse(message.body) as T
                    onMessageRef.current(payload)
                } catch (error) {
                    console.error('[STOMP] Parse error', error)
                }
            })
        }

        if (client.connected) {
            connect()
        } else {
            client.onConnect = connect
            client.activate()
        }

        return () => {
            subscriptionRef.current?.unsubscribe()
            subscriptionRef.current = null
        }
    }, [destination, enabled, serviceName, user?.access_token])
}

