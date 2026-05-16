import { create } from 'zustand'
import type {
  GameNotification,
  GameResponse,
  GameRoundType,
  RoundStartedNotification,
} from '../types/game.types'

interface GameState {
  currentGame: GameResponse | null
  currentRound: GameRoundType | null
  currentQuestion: { text: string; answers: Record<string, string>; bonus: boolean } | null
  hasAnswered: boolean
  countdown: number
  setGame: (game: GameResponse) => void
  applyNotification: (notification: GameNotification) => void
  setCountdown: (seconds: number) => void
  reset: () => void
}

export const useGameStore = create<GameState>((set) => ({
  currentGame: null,
  currentRound: null,
  currentQuestion: null,
  hasAnswered: false,
  countdown: 0,
  setGame: (game) => set({ currentGame: game }),
  applyNotification: (notification) => {
    switch (notification.type) {
      case 'ROUND_STARTED': {
        const event = notification as RoundStartedNotification
        set({
          currentRound: event.round,
          currentQuestion: {
            text: event.questionText,
            answers: event.answers,
            bonus: event.bonus,
          },
          hasAnswered: false,
          countdown: 10,
        })
        return
      }
      case 'ROUND_CLOSED':
        set({ currentQuestion: null })
        return
      case 'GAME_ENDED':
        set({ currentRound: null, currentQuestion: null })
        return
      default:
        return
    }
  },
  setCountdown: (seconds) => set({ countdown: seconds }),
  reset: () =>
    set({
      currentGame: null,
      currentRound: null,
      currentQuestion: null,
      hasAnswered: false,
      countdown: 0,
    }),
}))

