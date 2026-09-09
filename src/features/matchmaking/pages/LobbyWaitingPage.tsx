import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { useLobby } from '../api/matchmaking.queries'
import { useLobbyWebSocket } from '../hooks/use-lobby-websocket'

export default function LobbyWaitingPage() {
  const { lobbyId = '' } = useParams()
  const { data: lobby } = useLobby(lobbyId)
  const [countdown, setCountdown] = useState(3)

  useLobbyWebSocket(lobbyId || null)

  useEffect(() => {
    const interval = window.setInterval(() => {
      setCountdown((previous) => (previous <= 1 ? 3 : previous - 1))
    }, 1000)

    return () => window.clearInterval(interval)
  }, [])

  const hasChallenger = Boolean(lobby?.challengerId)
  const category = lobby?.topicId ? `Topic ${lobby.topicId.slice(0, 8)}` : 'Topic en cours'

  return (
    <div className="mx-auto w-full max-w-[375px] overflow-hidden rounded-[28px] border border-zinc-800 bg-black text-white shadow-2xl">
      <div className={`h-1.5 w-full ${hasChallenger ? 'bg-emerald-500' : 'bg-cyan-500'}`} />

      <div className="flex items-center gap-2 px-4 pb-2 pt-3">
        <div className="flex flex-1 items-center gap-2">
          <div className="flex size-10 items-center justify-center rounded-full border-2 border-yellow-500 bg-zinc-900 text-lg">
            🦊
          </div>
          <div>
            <p className="text-xs font-bold">Vous</p>
            <p className="text-2xl font-black leading-none text-yellow-400">0</p>
          </div>
        </div>

        <div className="min-w-16 text-center">
          <p className="text-[9px] font-extrabold uppercase tracking-[0.16em] text-cyan-400">
            Début dans
          </p>
          <p className="text-3xl font-black leading-none">{countdown}</p>
        </div>

        <div className="flex flex-1 items-center justify-end gap-2">
          <div className="text-right">
            <p className="text-xs font-bold">{hasChallenger ? 'Adversaire' : 'Recherche'}</p>
            <p className="text-2xl font-black leading-none text-emerald-400">0</p>
          </div>
          <div className="flex size-10 items-center justify-center rounded-full border-2 border-emerald-500 bg-zinc-900 text-lg">
            {hasChallenger ? '🐺' : '?'}
          </div>
        </div>
      </div>

      <div className="p-4">
        <p
          className={`text-center text-sm font-extrabold ${hasChallenger ? 'text-emerald-400' : 'text-zinc-500'}`}
        >
          {hasChallenger ? 'Adversaire trouvé !' : "Recherche d'adversaire…"}
        </p>

        <div className="mt-4 rounded-2xl border border-zinc-800 bg-zinc-950 p-4">
          <div className="flex items-center justify-between">
            <div className="text-center">
              <div className="mx-auto flex size-16 items-center justify-center rounded-full border-2 border-yellow-500 bg-zinc-900 text-2xl">
                🦊
              </div>
              <p className="mt-2 text-xs font-bold">Vous</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-black">VS</p>
              <p className="text-2xl">⚡</p>
            </div>
            <div className="text-center">
              <div className="mx-auto flex size-16 items-center justify-center rounded-full border-2 border-emerald-500 bg-zinc-900 text-2xl">
                {hasChallenger ? '🐺' : '?'}
              </div>
              <p className="mt-2 text-xs font-bold">
                {hasChallenger ? 'Adversaire' : 'En attente'}
              </p>
            </div>
          </div>

          <div className="mt-4 rounded-xl border border-zinc-800 bg-zinc-900 p-3 text-sm">
            <p className="font-bold">🎬 {category}</p>
            <p className="text-xs text-zinc-500">
              Lobby {lobbyId.slice(0, 8)} · status {lobby?.status ?? 'OPEN'}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
