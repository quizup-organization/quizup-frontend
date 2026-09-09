import type { UserResponse } from '../types/identity.types'

interface UserCardProps {
  user: UserResponse
}

export function UserCard({ user }: UserCardProps) {
  return (
    <div className="rounded-lg border p-3">
      <p className="font-medium">{user.email}</p>
      <p className="text-sm text-muted-foreground">ID: {user.userId}</p>
    </div>
  )
}
