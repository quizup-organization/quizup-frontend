import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'sonner'
import { useParams } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { getProblemDetails } from '@/shared/types/error.types'
import { questionSchema, type QuestionFormValues } from '../schemas/question.schema'
import { useCreateQuestion } from '../api/theme.queries'

const CHOICES = ['A', 'B', 'C', 'D'] as const

export default function QuestionCreatePage() {
  const { topicId = '' } = useParams()
  const createQuestion = useCreateQuestion()

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<QuestionFormValues>({
    resolver: zodResolver(questionSchema),
    defaultValues: {
      topicId,
      text: '',
      answers: { A: '', B: '', C: '', D: '' },
      correctAnswer: 'A',
    },
  })

  const onSubmit = handleSubmit((values) => {
    createQuestion.mutate(values, {
      onSuccess: () => toast.success('Question créée'),
      onError: (error) => {
        const problem = getProblemDetails(error)
        toast.error(problem ? problem.detail : 'Création de la question impossible')
      },
    })
  })

  return (
    <form onSubmit={onSubmit} className="max-w-md space-y-4">
      <h2 className="text-xl font-semibold">Créer une question</h2>
      <div className="space-y-2">
        <Label htmlFor="q-text">Question</Label>
        <Textarea
          id="q-text"
          placeholder="Texte de la question"
          aria-invalid={Boolean(errors.text)}
          {...register('text')}
        />
        {errors.text && (
          <p className="text-sm text-destructive">{errors.text.message ?? 'Question requise'}</p>
        )}
      </div>
      <div className="grid grid-cols-2 gap-3">
        {CHOICES.map((choice) => (
          <div key={choice} className="space-y-2">
            <Label htmlFor={`q-answer-${choice}`}>Réponse {choice}</Label>
            <Input
              id={`q-answer-${choice}`}
              placeholder={`Réponse ${choice}`}
              aria-invalid={Boolean(errors.answers?.[choice])}
              {...register(`answers.${choice}`)}
            />
            {errors.answers?.[choice] && (
              <p className="text-sm text-destructive">
                {errors.answers[choice]?.message ?? `Réponse ${choice} requise`}
              </p>
            )}
          </div>
        ))}
      </div>
      <div className="space-y-2">
        <Label>Réponse correcte</Label>
        <div className="flex gap-2">
          {CHOICES.map((choice) => (
            <label
              key={choice}
              className="flex flex-1 cursor-pointer items-center justify-center rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm font-bold text-zinc-300"
            >
              <input type="radio" value={choice} className="mr-2" {...register('correctAnswer')} />
              {choice}
            </label>
          ))}
        </div>
        {errors.correctAnswer && (
          <p className="text-sm text-destructive">
            {errors.correctAnswer.message ?? 'Réponse correcte requise'}
          </p>
        )}
      </div>
      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? 'Création…' : 'Créer la question'}
      </Button>
    </form>
  )
}
