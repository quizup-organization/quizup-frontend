import { Clock3 } from 'lucide-react'
import { EmptyState } from '@/shared/ui/EmptyState'

export default function UserProfilePage() {
  return (
    <div className="max-w-2xl">
      <EmptyState
        icon={Clock3}
        title="Profil utilisateur bientot disponible"
        description="Les profils publics arrivent dans une prochaine iteration du frontend."
      />
    </div>
  )
}

