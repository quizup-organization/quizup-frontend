export type GameMode = 'SYNC' | 'ASYNC'
export type GamePlayerType = 'BOT' | 'HUMAN'
export type GameStatus = 'CREATED' | 'READY' | 'IN_PROGRESS' | 'FINISHED' | 'CANCELED'
export type GameRoundType =
  'ROUND_1' | 'ROUND_2' | 'ROUND_3' | 'ROUND_4' | 'ROUND_5' | 'ROUND_6' | 'ROUND_7'
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

export interface PlayerJoinedNotification extends GameNotification {
  type: 'PLAYER_JOINED'
  playerId: string
}

export interface GameStartedNotification extends GameNotification {
  type: 'GAME_STARTED'
  mode: GameMode
}

export interface PlayerAnsweredNotification extends GameNotification {
  type: 'PLAYER_ANSWERED'
  round: GameRoundType
  playerId: string
  choice: QuestionChoice
  correct: boolean
  pointsEarned: number
  answeredAt: string
}

export interface RoundClosedNotification extends GameNotification {
  type: 'ROUND_CLOSED'
  closedRound: GameRoundType
  nextRound: GameRoundType | null
}

export interface GameEndedNotification extends GameNotification {
  type: 'GAME_ENDED'
  winnerId: string | null
  player1FinalScore: number
  player2FinalScore: number
}

export interface GameCancelledNotification extends GameNotification {
  type: 'GAME_CANCELLED'
  reason: string
}

export type GameNotificationPayload =
  | RoundStartedNotification
  | PlayerJoinedNotification
  | GameStartedNotification
  | PlayerAnsweredNotification
  | RoundClosedNotification
  | GameEndedNotification
  | GameCancelledNotification
  | GameNotification
