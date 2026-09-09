import { Client } from '@stomp/stompjs'
import SockJS from 'sockjs-client'

let stompClient: Client | null = null

export function getStompClient(accessToken: string): Client {
  if (stompClient) {
    return stompClient
  }

  const gatewayBaseUrl = import.meta.env.VITE_API_GATEWAY_BASE_URL ?? '/api'

  stompClient = new Client({
    webSocketFactory: () => new SockJS(`${gatewayBaseUrl}/ws`),
    connectHeaders: {
      Authorization: `Bearer ${accessToken}`,
    },
    reconnectDelay: 5000,
    heartbeatIncoming: 4000,
    heartbeatOutgoing: 4000,
    debug: (message) => {
      if (import.meta.env.DEV) {
        console.debug('[STOMP]', message)
      }
    },
  })

  return stompClient
}

export function disconnectStompClient() {
  if (stompClient) {
    void stompClient.deactivate()
    stompClient = null
  }
}
