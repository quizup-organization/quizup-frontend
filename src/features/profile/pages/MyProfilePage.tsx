import { Clock3 } from 'lucide-react'
import { EmptyState } from '@/shared/ui/EmptyState'

export default function MyProfilePage() {
  return (
    <div className="max-w-2xl">
      <EmptyState
        icon={Clock3}
        title="Profil bientot disponible"
        description="La partie profil est en cours d'implementation et sera active prochainement."
      />
    </div>
  )
}

