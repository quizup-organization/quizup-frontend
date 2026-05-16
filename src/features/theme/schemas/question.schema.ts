import { z } from 'zod'

export const questionSchema = z.object({
  topicId: z.string().min(1),
  text: z.string().trim().min(1).max(135),
  answers: z.object({
    A: z.string().trim().min(1).max(30),
    B: z.string().trim().min(1).max(30),
    C: z.string().trim().min(1).max(30),
    D: z.string().trim().min(1).max(30),
  }),
  correctAnswer: z.enum(['A', 'B', 'C', 'D']),
})

export type QuestionFormValues = z.infer<typeof questionSchema>

