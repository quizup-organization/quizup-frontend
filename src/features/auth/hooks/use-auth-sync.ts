import {useEffect} from 'react'
import {useAuth} from 'react-oidc-context'
import {setAuthToken} from '@/shared/api/axios-instance'
import {disconnectStompClient} from '@/shared/websocket/stomp-client'

export function useAuthSync() {
  const { user, isLoading } = useAuth();

  useEffect(() => {
    if (!isLoading) {
      setAuthToken(user?.access_token ?? null)
    }
  }, [isLoading, user?.access_token])

  useEffect(() => {
    if (!user) {
      disconnectStompClient()
    }
  }, [user])
}

