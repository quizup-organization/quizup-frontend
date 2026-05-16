import { z } from 'zod'

export const topicSchema = z.object({
  name: z.string().trim().min(1).max(25),
  description: z.string().max(500).optional(),
  category: z.string().min(1),
})

export type TopicFormValues = z.infer<typeof topicSchema>

