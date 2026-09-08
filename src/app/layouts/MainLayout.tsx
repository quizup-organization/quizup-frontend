import {
  BookOpen,
  Gamepad2,
  Swords,
  User,
  Users,
} from 'lucide-react'
import { NavLink, Outlet } from 'react-router-dom'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { useSocialWebSocket } from '@/features/social/hooks/use-social-websocket'
import { useNotificationStore } from '@/shared/stores/notification.store'

const navItems = [
  { to: '/topics', label: 'Topics', icon: BookOpen },
  { to: '/matchmaking', label: 'Matchmaking', icon: Swords },
  { to: '/games', label: 'Parties', icon: Gamepad2 },
  { to: '/social', label: 'Social', icon: Users },
  { to: '/profile', label: 'Profil', icon: User },
]

export function MainLayout() {
  useSocialWebSocket()

  const pendingFriendRequests = useNotificationStore((state) => state.pendingFriendRequests)
  const pendingChallenges = useNotificationStore((state) => state.pendingChallenges)
  const pendingSocial = pendingFriendRequests + pendingChallenges

  return (
    <div className="grid min-h-screen grid-cols-1 md:grid-cols-[220px_1fr]">
      <aside className="border-r p-4">
        <h1 className="mb-4 text-lg font-semibold">QuizUp</h1>
        <nav className="flex flex-col gap-2">
          {navItems.map((item) => {
            const Icon = item.icon
            const count = item.to === '/social' ? pendingSocial : 0

            return (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `flex items-center justify-between rounded-md px-3 py-2 text-sm ${isActive ? 'bg-muted font-medium' : 'hover:bg-muted/50'}`
                }
              >
                <span className="flex items-center gap-2">
                  <Icon className="size-4" />
                  {item.label}
                </span>
                {count > 0 ? <Badge>{count}</Badge> : null}
              </NavLink>
            )
          })}
        </nav>
      </aside>
      <div className="flex min-h-screen flex-col">
        <header className="flex items-center justify-between border-b px-6 py-3">
          <p className="text-sm text-muted-foreground">Frontend QuizUp</p>
          <Avatar>
            <AvatarFallback>Q</AvatarFallback>
          </Avatar>
        </header>
        <main className="flex-1 p-6">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

