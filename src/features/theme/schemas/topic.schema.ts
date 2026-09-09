import { z } from 'zod'

export const TOPIC_CATEGORIES = [
  'ARTS',
  'BUSINESS',
  'EDUCATION',
  'ENTERTAINMENT',
  'FOOD_AND_DRINK',
  'GAMES',
  'GENERAL',
  'HISTORY',
  'LITERATURE',
  'MOVIES',
  'MUSIC',
  'NATURE',
  'SCIENCE',
  'SPORTS',
  'TELEVISION',
  'TECHNOLOGY',
  'WORLD',
] as const

export const topicSchema = z.object({
  name: z.string().trim().min(1).max(25),
  description: z.string().max(500).optional(),
  category: z.enum(TOPIC_CATEGORIES),
})

export type TopicFormValues = z.infer<typeof topicSchema>
