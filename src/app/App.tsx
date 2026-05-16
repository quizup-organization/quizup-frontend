import {AppRouter} from '@/app/router'
import {useAuthSync} from '@/features/auth/hooks/use-auth-sync'
import {ErrorBoundary} from '@/shared/ui/ErrorBoundary'

export default function App() {
    useAuthSync()

    return (
        <ErrorBoundary>
            <AppRouter/>
        </ErrorBoundary>
    )
}

