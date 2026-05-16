export type GameMode = 'SYNC' | 'ASYNC'
export type GamePlayerType = 'BOT' | 'HUMAN'
export type GameStatus = 'CREATED' | 'READY' | 'IN_PROGRESS' | 'FINISHED' | 'CANCELED'
export type GameRoundType =
  | 'ROUND_1'
  | 'ROUND_2'
  | 'ROUND_3'
  | 'ROUND_4'
  | 'ROUND_5'
  | 'ROUND_6'
  | 'ROUND_7'
export type GameRoundStatus = 'CREATED' | 'STARTED' | 'CLOSED'
export type QuestionChoice = 'A' | 'B' | 'C' | 'D'

export interface GameRoundResponse {
  round: GameRoundType
  questionText: string
  status: GameRoundStatus
  player1Choice: QuestionChoice | null
  player1Points: number
  player2Choice: QuestionChoice | null
  player2Points: number
  correctAnswer: QuestionChoice | null
}

export interface GameResponse {
  gameId: string
  topicId: string
  player1Id: string
  player2Id: string
  mode: GameMode
  opponent: GamePlayerType
  status: GameStatus
  player1Score: number
  player2Score: number
  winnerId: string | null
  createdAt: string
  rounds: GameRoundResponse[]
}

export interface CreateBotGameRequest {
  topicId: string
}

export interface AnswerQuestionRequest {
  choice: QuestionChoice
}

export type GameNotificationType =
  | 'GAME_CREATED'
  | 'PLAYER_JOINED'
  | 'GAME_STARTED'
  | 'ROUND_STARTED'
  | 'PLAYER_ANSWERED'
  | 'ROUND_CLOSED'
  | 'GAME_ENDED'
  | 'GAME_CANCELLED'

export interface GameNotification {
  type: GameNotificationType
  gameId: string
}

export interface RoundStartedNotification extends GameNotification {
  type: 'ROUND_STARTED'
  round: GameRoundType
  questionText: string
  answers: Record<string, string>
  bonus: boolean
}

