import { create } from 'zustand'
import type {
  GameCancelledNotification,
  GameEndedNotification,
  GameNotification,
  PlayerAnsweredNotification,
  GameResponse,
  GameRoundType,
  QuestionChoice,
  RoundClosedNotification,
  RoundStartedNotification,
} from '../types/game.types'

interface RevealedRoundState {
  round: GameRoundType
  questionText: string
  answers: Record<string, string>
  player1Choice: QuestionChoice | null
  player2Choice: QuestionChoice | null
  correctAnswer: QuestionChoice | null
}

interface GameState {
  currentUserId: string | null
  currentGame: GameResponse | null
  currentRound: GameRoundType | null
  currentQuestion: { text: string; answers: Record<string, string>; bonus: boolean } | null
  revealedRound: RevealedRoundState | null
  hasAnswered: boolean
  opponentAnswered: boolean
  isFinished: boolean
  countdown: number
  setCurrentUserId: (userId: string | null) => void
  setGame: (game: GameResponse) => void
  applyNotification: (notification: GameNotification) => void
  setHasAnswered: (hasAnswered: boolean) => void
  setCountdown: (seconds: number) => void
  reset: () => void
}

export const useGameStore = create<GameState>((set) => ({
  currentUserId: null,
  currentGame: null,
  currentRound: null,
  currentQuestion: null,
  revealedRound: null,
  hasAnswered: false,
  opponentAnswered: false,
  isFinished: false,
  countdown: 0,
  setCurrentUserId: (userId) => set({ currentUserId: userId }),
  setGame: (game) =>
    set((state) => {
      if (!state.revealedRound) {
        return { currentGame: game }
      }

      const matchingRound = game.rounds.find((round) => round.round === state.revealedRound?.round)
      if (!matchingRound) {
        return { currentGame: game }
      }

      return {
        currentGame: game,
        revealedRound: {
          ...state.revealedRound,
          player1Choice: matchingRound.player1Choice,
          player2Choice: matchingRound.player2Choice,
          correctAnswer: matchingRound.correctAnswer,
        },
      }
    }),
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
          revealedRound: null,
          hasAnswered: false,
          opponentAnswered: false,
          isFinished: false,
          countdown: 10,
        })
        return
      }
      case 'PLAYER_ANSWERED': {
        const event = notification as PlayerAnsweredNotification
        set((state) => {
          if (!state.currentGame) {
            return state
          }

          const scoreUpdate =
            event.playerId === state.currentGame.player1Id
              ? { player1Score: state.currentGame.player1Score + event.pointsEarned }
              : event.playerId === state.currentGame.player2Id
                ? { player2Score: state.currentGame.player2Score + event.pointsEarned }
                : {}

          return {
            currentGame: {
              ...state.currentGame,
              ...scoreUpdate,
            },
            hasAnswered: state.currentUserId === event.playerId ? true : state.hasAnswered,
            opponentAnswered:
              state.currentUserId !== event.playerId ? true : state.opponentAnswered,
          }
        })
        return
      }
      case 'ROUND_CLOSED': {
        const event = notification as RoundClosedNotification
        set((state) => {
          if (!state.currentQuestion) {
            return {
              currentRound: event.nextRound,
              currentQuestion: null,
              countdown: 0,
              hasAnswered: false,
              opponentAnswered: false,
            }
          }

          const matchingRound = state.currentGame?.rounds.find(
            (round) => round.round === event.closedRound,
          )

          return {
            currentRound: event.nextRound,
            currentQuestion: null,
            revealedRound: {
              round: event.closedRound,
              questionText: state.currentQuestion.text,
              answers: state.currentQuestion.answers,
              player1Choice: matchingRound?.player1Choice ?? null,
              player2Choice: matchingRound?.player2Choice ?? null,
              correctAnswer: matchingRound?.correctAnswer ?? null,
            },
            countdown: 0,
            hasAnswered: false,
            opponentAnswered: false,
          }
        })
        return
      }
      case 'GAME_ENDED': {
        const event = notification as GameEndedNotification
        set((state) => ({
          currentGame: state.currentGame
            ? {
                ...state.currentGame,
                status: 'FINISHED',
                winnerId: event.winnerId,
                player1Score: event.player1FinalScore,
                player2Score: event.player2FinalScore,
              }
            : state.currentGame,
          currentRound: null,
          currentQuestion: null,
          revealedRound: null,
          hasAnswered: false,
          opponentAnswered: false,
          isFinished: true,
          countdown: 0,
        }))
        return
      }
      case 'GAME_CANCELLED': {
        const event = notification as GameCancelledNotification
        set((state) => ({
          currentGame: state.currentGame
            ? {
                ...state.currentGame,
                status: 'CANCELED',
              }
            : state.currentGame,
          currentRound: null,
          currentQuestion: null,
          revealedRound: null,
          hasAnswered: false,
          opponentAnswered: false,
          isFinished: true,
          countdown: 0,
        }))
        console.info('[GAME] canceled:', event.reason)
        return
      }
      default:
        return
    }
  },
  setHasAnswered: (hasAnswered) => set({ hasAnswered }),
  setCountdown: (seconds) => set({ countdown: seconds }),
  reset: () =>
    set({
      currentUserId: null,
      currentGame: null,
      currentRound: null,
      currentQuestion: null,
      revealedRound: null,
      hasAnswered: false,
      opponentAnswered: false,
      isFinished: false,
      countdown: 0,
    }),
}))
