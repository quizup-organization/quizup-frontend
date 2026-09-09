import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { getProblemDetails } from '@/shared/types/error.types'
import { topicSchema, type TopicFormValues } from '../schemas/topic.schema'
import { useCreateTopic } from '../api/theme.queries'

export default function TopicCreatePage() {
  const createTopic = useCreateTopic()
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<TopicFormValues>({
    resolver: zodResolver(topicSchema),
    defaultValues: { name: '', description: '', category: 'GENERAL' },
  })

  const onSubmit = handleSubmit((values) => {
    createTopic.mutate(
      {
        name: values.name,
        description: values.description || undefined,
        category: values.category,
      },
      {
        onSuccess: () => toast.success('Topic créé'),
        onError: (error) => {
          const problem = getProblemDetails(error)
          toast.error(problem ? problem.detail : 'Création impossible')
        },
      },
    )
  })

  return (
    <form onSubmit={onSubmit} className="max-w-md space-y-4">
      <h2 className="text-xl font-semibold">Créer un topic</h2>
      <div className="space-y-2">
        <Label htmlFor="topic-name">Nom du topic</Label>
        <Input
          id="topic-name"
          placeholder="Nom du topic"
          aria-invalid={Boolean(errors.name)}
          {...register('name')}
        />
        {errors.name && (
          <p className="text-sm text-destructive">{errors.name.message ?? 'Nom requis'}</p>
        )}
      </div>
      <div className="space-y-2">
        <Label htmlFor="topic-description">Description (optionnelle)</Label>
        <Textarea
          id="topic-description"
          placeholder="Description du topic"
          aria-invalid={Boolean(errors.description)}
          {...register('description')}
        />
        {errors.description && (
          <p className="text-sm text-destructive">
            {errors.description.message ?? 'Description invalide'}
          </p>
        )}
      </div>
      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? 'Création…' : 'Créer'}
      </Button>
    </form>
  )
}
