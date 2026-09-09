import { lazy, Suspense } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import { ProtectedRoute } from '@/features/auth/components/ProtectedRoute'
import { PageLoader } from '@/shared/ui/PageLoader'
import { MainLayout } from './layouts/MainLayout'

const TopicListPage = lazy(() => import('@/features/theme/pages/TopicListPage'))
const TopicDetailPage = lazy(() => import('@/features/theme/pages/TopicDetailPage'))
const TopicCreatePage = lazy(() => import('@/features/theme/pages/TopicCreatePage'))
const QuestionCreatePage = lazy(() => import('@/features/theme/pages/QuestionCreatePage'))
const GameListPage = lazy(() => import('@/features/game/pages/GameListPage'))
const GamePage = lazy(() => import('@/features/game/pages/GamePage'))
const MatchmakingPage = lazy(() => import('@/features/matchmaking/pages/MatchmakingPage'))
const LobbyWaitingPage = lazy(() => import('@/features/matchmaking/pages/LobbyWaitingPage'))
const SocialPage = lazy(() => import('@/features/social/pages/SocialPage'))
const AuthCallbackPage = lazy(() => import('@/features/auth/pages/AuthCallbackPage'))

export function AppRouter() {
  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>
        <Route path="/auth/callback" element={<AuthCallbackPage />} />
        <Route
          element={
            <ProtectedRoute>
              <MainLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="/topics" replace />} />
          <Route path="topics" element={<TopicListPage />} />
          <Route path="topics/create" element={<TopicCreatePage />} />
          <Route path="topics/:topicId" element={<TopicDetailPage />} />
          <Route path="topics/:topicId/questions/new" element={<QuestionCreatePage />} />
          <Route path="games" element={<GameListPage />} />
          <Route path="games/:gameId" element={<GamePage />} />
          <Route path="matchmaking" element={<MatchmakingPage />} />
          <Route path="matchmaking/lobby/:lobbyId" element={<LobbyWaitingPage />} />
          <Route path="social" element={<SocialPage />} />
          <Route path="friends" element={<Navigate to="/social" replace />} />
          <Route path="challenges" element={<Navigate to="/social" replace />} />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Suspense>
  )
}
