export type TopicCategory =
  | 'ARTS'
  | 'BUSINESS'
  | 'EDUCATION'
  | 'ENTERTAINMENT'
  | 'FOOD_AND_DRINK'
  | 'GAMES'
  | 'GENERAL'
  | 'HISTORY'
  | 'LITERATURE'
  | 'MOVIES'
  | 'MUSIC'
  | 'NATURE'
  | 'SCIENCE'
  | 'SPORTS'
  | 'TELEVISION'
  | 'TECHNOLOGY'
  | 'WORLD'

export type TopicStatus = 'DRAFT' | 'PUBLISHED' | 'ARCHIVED'
export type QuestionStatus = 'PENDING' | 'APPROVED' | 'REJECTED'
export type QuestionChoice = 'A' | 'B' | 'C' | 'D'

export interface TopicResponse {
  topicId: string
  name: string
  description: string
  category: TopicCategory
  status: TopicStatus
  creatorId: string
  updatedBy: string
  followersCounter: number
  questionsCounter: Record<QuestionStatus, number>
  createdAt: string
  updatedAt: string
}

export interface QuestionResponse {
  questionId: string
  topicId: string
  text: string
  answers: Record<QuestionChoice, string>
  correctAnswer: QuestionChoice
  status: QuestionStatus
  creatorId: string
  updatedBy: string
  createdAt: string
  updatedAt: string
}

export interface CreateTopicRequest {
  name: string
  description?: string
  category: TopicCategory
}

export interface CreateQuestionRequest {
  topicId: string
  text: string
  answers: Record<QuestionChoice, string>
  correctAnswer: QuestionChoice
}

export interface RejectQuestionRequest {
  reason: string
}

