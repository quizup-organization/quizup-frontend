import type { ReactNode } from 'react'
import { useEffect, useRef } from 'react'
import { useAuth } from 'react-oidc-context'
import { PageLoader } from '@/shared/ui/PageLoader'

export function ProtectedRoute({ children }: { children: ReactNode }) {
  const { isLoading, isAuthenticated, signinRedirect } = useAuth()
  const redirectStartedRef = useRef(false)

  useEffect(() => {
    if (isLoading || isAuthenticated || redirectStartedRef.current) {
      return
    }

    redirectStartedRef.current = true
    void signinRedirect().catch(() => {
      redirectStartedRef.current = false
    })
  }, [isAuthenticated, isLoading, signinRedirect])

  if (isLoading) {
    return <PageLoader />
  }

  if (!isAuthenticated) {
    return <PageLoader />
  }

  return <>{children}</>
}

