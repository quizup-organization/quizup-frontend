import { lazy, Suspense } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import { ProtectedRoute } from '@/features/auth/components/ProtectedRoute'
import { PageLoader } from '@/shared/ui/PageLoader'
import { MainLayout } from './layouts/MainLayout'

const TopicListPage = lazy(() => import('@/features/theme/pages/TopicListPage'))
const TopicDetailPage = lazy(() => import('@/features/theme/pages/TopicDetailPage'))
const TopicCreatePage = lazy(() => import('@/features/theme/pages/TopicCreatePage'))
const GameListPage = lazy(() => import('@/features/game/pages/GameListPage'))
const GamePage = lazy(() => import('@/features/game/pages/GamePage'))
const MatchmakingPage = lazy(() => import('@/features/matchmaking/pages/MatchmakingPage'))
const LobbyWaitingPage = lazy(() => import('@/features/matchmaking/pages/LobbyWaitingPage'))
const ChallengeListPage = lazy(() => import('@/features/challenge/pages/ChallengeListPage'))
const FriendListPage = lazy(() => import('@/features/social/pages/FriendListPage'))
const MyProfilePage = lazy(() => import('@/features/profile/pages/MyProfilePage'))
const UserProfilePage = lazy(() => import('@/features/profile/pages/UserProfilePage'))
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
          <Route path="games" element={<GameListPage />} />
          <Route path="games/:gameId" element={<GamePage />} />
          <Route path="matchmaking" element={<MatchmakingPage />} />
          <Route path="matchmaking/lobby/:lobbyId" element={<LobbyWaitingPage />} />
          <Route path="challenges" element={<ChallengeListPage />} />
          <Route path="friends" element={<FriendListPage />} />
          <Route path="profile" element={<MyProfilePage />} />
          <Route path="profile/:userId" element={<UserProfilePage />} />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Suspense>
  )
}

