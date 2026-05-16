export interface UserTopicProgress {
  progressId: string
  userId: string
  topicId: string
  totalXp: number
  level: number
  gamesPlayed: number
  wins: number
  bestScore: number
  currentWinStreak: number
  bestWinStreak: number
  lastPlayedAt: string | null
}

export interface UserMedal {
  medalId: string
  userId: string
  medalType: string
  topicId: string | null
  gameId: string | null
  awardedAt: string
}

