import { useParams } from 'react-router-dom'
import { useUser } from '@/features/identity/api/identity.queries'

export default function UserProfilePage() {
  const { userId = '' } = useParams()
  const { data } = useUser(userId)

  return (
    <div className="flex flex-col gap-2">
      <h2 className="text-xl font-semibold">Profil utilisateur</h2>
      <p>User ID: {data?.userId}</p>
      <p>Email: {data?.email}</p>
    </div>
  )
}

