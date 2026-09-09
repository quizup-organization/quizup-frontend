import { useEffect, useMemo, useRef, useState } from 'react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { useMe } from '@/features/identity/api/identity.queries'
import { useParams } from 'react-router-dom'
import { useAnswerQuestion, useGame, useGameNotifications, useJoinGame } from '../api/game.queries'
import { useGameWebSocket } from '../hooks/use-game-websocket'
import { useGameStore } from '../stores/game.store'
import type { GameNotificationPayload, QuestionChoice } from '../types/game.types'

export default function GamePage() {
  const { gameId = '' } = useParams()
  const { data } = useGame(gameId)
  const notifications = useGameNotifications(gameId)
  const me = useMe()

  const joinGame = useJoinGame()
  const answerQuestion = useAnswerQuestion(gameId)

  const processedNotificationsRef = useRef(0)

  const currentGame = useGameStore((state) => state.currentGame)
  const currentRound = useGameStore((state) => state.currentRound)
  const currentQuestion = useGameStore((state) => state.currentQuestion)
  const revealedRound = useGameStore((state) => state.revealedRound)
  const hasAnswered = useGameStore((state) => state.hasAnswered)
  const opponentAnswered = useGameStore((state) => state.opponentAnswered)
  const countdown = useGameStore((state) => state.countdown)
  const isFinished = useGameStore((state) => state.isFinished)
  const [selectedChoice, setSelectedChoice] = useState<QuestionChoice | null>(null)

  const setCurrentUserId = useGameStore((state) => state.setCurrentUserId)
  const setGame = useGameStore((state) => state.setGame)
  const applyNotification = useGameStore((state) => state.applyNotification)
  const setHasAnswered = useGameStore((state) => state.setHasAnswered)
  const setCountdown = useGameStore((state) => state.setCountdown)
  const reset = useGameStore((state) => state.reset)

  useGameWebSocket(gameId || null)

  useEffect(() => {
    reset()
    processedNotificationsRef.current = 0
  }, [gameId, reset])

  useEffect(() => {
    if (me.data?.userId) {
      setCurrentUserId(me.data.userId)
    }
  }, [me.data?.userId, setCurrentUserId])

  useEffect(() => {
    if (data) {
      setGame(data)
    }
  }, [data, setGame])

  useEffect(() => {
    if (!notifications.data) {
      return
    }

    const events = notifications.data as GameNotificationPayload[]
    for (let index = processedNotificationsRef.current; index < events.length; index += 1) {
      applyNotification(events[index])
    }
    processedNotificationsRef.current = events.length
  }, [applyNotification, notifications.data])

  useEffect(() => {
    if (!currentQuestion || countdown <= 0) {
      return
    }

    const timer = window.setTimeout(() => {
      setCountdown(countdown - 1)
    }, 1000)

    return () => window.clearTimeout(timer)
  }, [countdown, currentQuestion, setCountdown])

  const answerOptions = useMemo(() => {
    if (!currentQuestion) {
      return []
    }

    const orderedChoices: QuestionChoice[] = ['A', 'B', 'C', 'D']
    return orderedChoices
      .filter((choice) => typeof currentQuestion.answers[choice] === 'string')
      .map((choice) => ({ choice, label: currentQuestion.answers[choice] }))
  }, [currentQuestion])

  const onJoin = () => {
    joinGame.mutate(gameId, {
      onSuccess: () => toast.success('Partie rejointe'),
      onError: () => toast.error('Impossible de rejoindre la partie'),
    })
  }

  const onAnswer = (choice: QuestionChoice) => {
    setSelectedChoice(choice)
    answerQuestion.mutate(
      { choice },
      {
        onSuccess: () => {
          setHasAnswered(true)
          toast.success('Reponse envoyee')
        },
        onError: () => toast.error('Echec de l\'envoi de la reponse'),
      },
    )
  }

  const status = currentGame?.status ?? data?.status
  const canJoin = status === 'CREATED' || status === 'READY'
  const canAnswer = Boolean(currentQuestion) && !hasAnswered && status === 'IN_PROGRESS'
  const selectedChoiceForDisplay = currentQuestion ? selectedChoice : null
  const timerPercent = Math.max(0, Math.min(100, (countdown / 10) * 100))

  const meId = me.data?.userId ?? null
  const player1Id = currentGame?.player1Id ?? data?.player1Id ?? '-'
  const player2Id = currentGame?.player2Id ?? data?.player2Id ?? '-'
  const isMePlayer1 = meId === player1Id

  const leftName = isMePlayer1 ? 'Vous' : player1Id
  const rightName = isMePlayer1 ? player2Id : 'Vous'

  const leftScore = isMePlayer1
    ? (currentGame?.player1Score ?? data?.player1Score ?? 0)
    : (currentGame?.player2Score ?? data?.player2Score ?? 0)
  const rightScore = isMePlayer1
    ? (currentGame?.player2Score ?? data?.player2Score ?? 0)
    : (currentGame?.player1Score ?? data?.player1Score ?? 0)

  const winnerId = currentGame?.winnerId ?? data?.winnerId
  const isWinner = Boolean(meId && winnerId && meId === winnerId)

  const myFinalScore = isMePlayer1
    ? (currentGame?.player1Score ?? data?.player1Score ?? 0)
    : (currentGame?.player2Score ?? data?.player2Score ?? 0)
  const bonusEnd = 40
  const bonusWin = isWinner ? 50 : 0
  const bonusBoost = 1
  const totalXp = myFinalScore + bonusEnd + bonusWin + bonusBoost
  const donutProgress = Math.min(100, Math.round((totalXp / 260) * 100))
  const donutCircumference = 2 * Math.PI * 40
  const donutOffset = donutCircumference - (donutProgress / 100) * donutCircumference

  const revealRoundChoices = useMemo(() => {
    if (!revealedRound) {
      return null
    }

    const myChoice = isMePlayer1 ? revealedRound.player1Choice : revealedRound.player2Choice
    const opponentChoice = isMePlayer1 ? revealedRound.player2Choice : revealedRound.player1Choice

    return { myChoice, opponentChoice }
  }, [isMePlayer1, revealedRound])

  return (
    <div className="mx-auto h-[812px] w-[375px] overflow-hidden rounded-[40px] border-2 border-zinc-800 bg-black text-white shadow-2xl">
      <div className="mx-auto h-6 w-24 rounded-b-2xl bg-black" />
      <div className="h-1.5 w-full bg-zinc-900">
        <div
          className={`h-full transition-all ${countdown <= 3 ? 'bg-red-500' : 'bg-cyan-500'}`}
          style={{ width: `${timerPercent}%` }}
        />
      </div>

      <div className="flex items-center gap-2 px-3 pb-2 pt-3">
        <div className="flex flex-1 items-center gap-2">
          <div className="flex size-10 items-center justify-center rounded-full border-2 border-yellow-500 bg-zinc-900 text-lg">🦊</div>
          <div>
            <p className="text-xs font-bold">{leftName}</p>
            <p className="text-2xl font-black leading-none text-yellow-400">{leftScore}</p>
          </div>
        </div>

        <div className="min-w-14 text-center">
          <p className="text-[9px] font-extrabold uppercase tracking-[0.16em] text-cyan-400">Time Left</p>
          <p className={`text-3xl font-black leading-none ${countdown <= 3 ? 'text-red-500' : 'text-white'}`}>{countdown}</p>
        </div>

        <div className="flex flex-1 items-center justify-end gap-2">
          <div className="text-right">
            <p className="text-xs font-bold">{rightName}</p>
            <p className="text-2xl font-black leading-none text-emerald-400">{rightScore}</p>
          </div>
          <div className="flex size-10 items-center justify-center rounded-full border-2 border-emerald-500 bg-zinc-900 text-lg">🐺</div>
        </div>
      </div>

      {status === 'CANCELED' ? (
        <div className="flex h-[calc(100%-92px)] flex-col px-4 pb-5 pt-3">
          <div className="rounded-xl border border-red-800 bg-red-950/30 p-4 text-center">
            <p className="text-4xl">🚪</p>
            <p className="mt-2 text-lg font-black">Forfait</p>
            <p className="text-sm text-zinc-400">L'adversaire a quitte la partie.</p>
            <div className="mt-4 flex gap-2">
              <Button className="flex-1 bg-red-600 text-white hover:bg-red-500" disabled>
                Partie annulee
              </Button>
            </div>
          </div>
        </div>
      ) : status === 'FINISHED' || isFinished ? (
        <div className="flex h-[calc(100%-92px)] flex-col px-4 pb-5 pt-2">
          <p className={`text-center text-4xl font-black ${isWinner ? 'text-emerald-400' : 'text-red-500'}`}>
            {isWinner ? 'GAGNE !' : 'PERDU !'}
          </p>

          <div className="mt-4 rounded-xl border border-zinc-800 bg-zinc-950 p-4">
            <p className="text-center text-sm text-zinc-400">Resultat du duel</p>
            <p className="mt-1 text-center text-2xl font-black">
              {leftScore} <span className="text-zinc-600">VS</span> {rightScore}
            </p>
          </div>

          <div className="mt-3 grid grid-cols-5 gap-1.5 text-center text-[9px] font-bold uppercase tracking-wide">
            <div className="rounded-lg bg-amber-500/20 p-2 text-amber-400">
              <p className="text-zinc-500">Match</p>
              <p className="text-base font-black normal-case">{myFinalScore}</p>
            </div>
            <div className="rounded-lg bg-emerald-500/20 p-2 text-emerald-400">
              <p className="text-zinc-500">Fin</p>
              <p className="text-base font-black normal-case">{bonusEnd}</p>
            </div>
            <div className="rounded-lg bg-cyan-500/20 p-2 text-cyan-400">
              <p className="text-zinc-500">Victoire</p>
              <p className="text-base font-black normal-case">{bonusWin}</p>
            </div>
            <div className="rounded-lg bg-violet-500/20 p-2 text-violet-400">
              <p className="text-zinc-500">Boost</p>
              <p className="text-base font-black normal-case">{bonusBoost}</p>
            </div>
            <div className="rounded-lg bg-red-500/20 p-2 text-red-400">
              <p className="text-zinc-500">XP</p>
              <p className="text-base font-black normal-case">{totalXp}</p>
            </div>
          </div>

          <div className="mt-3 flex items-center gap-3 rounded-xl border border-zinc-800 bg-zinc-950 p-3">
            <div className="relative size-[92px] shrink-0">
              <svg className="size-[92px] -rotate-90" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="40" fill="none" stroke="#1f1f1f" strokeWidth="10" />
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  fill="none"
                  stroke="#e53935"
                  strokeWidth="10"
                  strokeLinecap="round"
                  strokeDasharray={donutCircumference}
                  strokeDashoffset={donutOffset}
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-[9px] uppercase tracking-[0.14em] text-zinc-500">Niveau</span>
                <span className="text-xl font-black">1</span>
              </div>
            </div>
            <div className="flex-1">
              <p className="text-xs text-zinc-500">XP pour niveau 2</p>
              <p className="text-2xl font-black text-red-500">{totalXp} XP</p>
              <p className="text-[11px] text-zinc-500">XP gagnee</p>
            </div>
          </div>

          <div className="mt-auto grid grid-cols-3 gap-2">
            <Button className="bg-red-600 text-white hover:bg-red-500">Jouer</Button>
            <Button className="bg-cyan-600 text-white hover:bg-cyan-500">Chat</Button>
            <Button className="bg-amber-500 text-black hover:bg-amber-400">Partager</Button>
          </div>
        </div>
      ) : (
        <>
          <div className="relative min-h-[230px] px-6 pb-2 pt-6 text-center">
            <div className="pointer-events-none absolute inset-y-0 left-0 w-1 bg-yellow-500" />
            <div className="pointer-events-none absolute inset-y-0 right-0 w-1 bg-emerald-500" />
            <p className="text-[28px] font-extrabold leading-tight">{currentQuestion?.text ?? 'En attente de la prochaine question...'}</p>
          </div>

          {countdown === 0 && !hasAnswered && currentQuestion ? (
            <div className="mx-3 mb-2 rounded-xl border border-red-800 bg-red-950/30 p-3">
              <p className="text-base font-bold text-red-400">Temps ecoule</p>
              <p className="text-xs text-zinc-400">Aucun point attribue pour cette question.</p>
            </div>
          ) : null}

          <div className="flex flex-col gap-2 px-3 pb-4">
            {answerOptions.map((option) => {
              const isSelected = selectedChoiceForDisplay === option.choice
              return (
                <button
                  key={option.choice}
                  type="button"
                  className={`relative min-h-[72px] rounded-2xl px-4 py-3 text-center text-[20px] font-bold leading-tight transition ${
                    isSelected ? 'bg-emerald-600 text-white' : 'bg-white text-zinc-900'
                  } ${hasAnswered && !isSelected ? 'opacity-40' : ''}`}
                  onClick={() => onAnswer(option.choice)}
                  disabled={!canAnswer || answerQuestion.isPending}
                >
                  {option.label}
                  {isSelected ? <span className="absolute inset-y-0 left-0 w-1 rounded-l-2xl bg-yellow-400" /> : null}
                </button>
              )
            })}
          </div>

          {hasAnswered && !opponentAnswered ? (
            <div className="mx-3 mb-3 flex items-center gap-2 rounded-xl border border-zinc-800 bg-zinc-950 px-3 py-2 text-sm text-zinc-400">
              <span className="text-base">🐺</span>
              <span>En attente de l'adversaire...</span>
            </div>
          ) : null}

          {!currentQuestion && revealedRound ? (
            <div className="px-3 pb-3">
              <div className="rounded-xl border border-zinc-800 bg-zinc-950 p-3">
                <p className="mb-2 text-sm font-bold">Revelation de la reponse</p>
                <p className="mb-3 text-sm text-zinc-400">{revealedRound.questionText}</p>
                <div className="flex flex-col gap-2">
                  {(['A', 'B', 'C', 'D'] as QuestionChoice[])
                    .filter((choice) => typeof revealedRound.answers[choice] === 'string')
                    .map((choice) => {
                      const text = revealedRound.answers[choice]
                      const isCorrect = revealedRound.correctAnswer === choice
                      const isMyChoice = revealRoundChoices?.myChoice === choice
                      const isOpponentChoice = revealRoundChoices?.opponentChoice === choice

                      return (
                        <div
                          key={choice}
                          className={`relative rounded-2xl px-4 py-3 text-center text-[20px] font-bold leading-tight ${
                            isCorrect
                              ? 'bg-emerald-600 text-white'
                              : isMyChoice || isOpponentChoice
                                ? 'bg-red-950 text-white'
                                : 'bg-white text-zinc-900 opacity-40'
                          }`}
                        >
                          {text}
                          {isMyChoice ? <span className="absolute inset-y-0 left-0 w-1 rounded-l-2xl bg-yellow-400" /> : null}
                          {isOpponentChoice ? <span className="absolute inset-y-0 right-0 w-1 rounded-r-2xl bg-emerald-400" /> : null}
                        </div>
                      )
                    })}
                </div>
              </div>
            </div>
          ) : null}

          <div className="mt-auto flex gap-2 px-3 pb-4">
            <Button className="flex-1 bg-zinc-800 text-zinc-100 hover:bg-zinc-700" onClick={onJoin} disabled={!canJoin || joinGame.isPending}>
              Rejoindre
            </Button>
          </div>
        </>
      )}

      <div className="border-t border-zinc-900 px-3 py-2 text-[11px] text-zinc-500">
        Game {gameId} · Round {currentRound ?? '-'} · Status {status}
      </div>
    </div>
  )
}

