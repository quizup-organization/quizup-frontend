import { useState } from 'react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useCreateTopic } from '../api/theme.queries'

export default function TopicCreatePage() {
  const [name, setName] = useState('')
  const createTopic = useCreateTopic()

  return (
    <div className="max-w-md space-y-4">
      <h2 className="text-xl font-semibold">Creer un topic</h2>
      <Input value={name} onChange={(event) => setName(event.target.value)} placeholder="Nom du topic" />
      <Button
        onClick={() =>
          createTopic.mutate(
            { name, category: 'GENERAL' },
            {
              onSuccess: () => toast.success('Topic cree'),
              onError: () => toast.error('Creation impossible'),
            },
          )
        }
        disabled={createTopic.isPending || !name.trim()}
      >
        Creer
      </Button>
    </div>
  )
}

