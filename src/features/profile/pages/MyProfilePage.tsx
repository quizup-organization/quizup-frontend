import { useMe } from '@/features/identity/api/identity.queries'
import { useUserMedals, useUserProgress } from '../api/profile.queries'

export default function MyProfilePage() {
  const me = useMe()
  const userId = me.data?.userId ?? ''

  const progress = useUserProgress(userId)
  const medals = useUserMedals(userId)

  return (
    <div className="flex flex-col gap-3">
      <h2 className="text-xl font-semibold">Mon profil</h2>
      <p>User ID: {userId}</p>
      <p>Progressions: {progress.data?.length ?? 0}</p>
      <p>Medailles: {medals.data?.length ?? 0}</p>
    </div>
  )
}

