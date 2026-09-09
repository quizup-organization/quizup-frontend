import { useParams } from 'react-router-dom'
import { useUser } from '../api/identity.queries'

export default function UserProfilePage() {
  const { userId = '' } = useParams()
  const { data } = useUser(userId)

  return (
    <div className="flex flex-col gap-2">
      <h2 className="text-xl font-semibold">Profil utilisateur (Identity)</h2>
      <p>ID: {data?.userId}</p>
      <p>Email: {data?.email}</p>
    </div>
  )
}
