import { useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { useGame } from '../api/game.queries'
import { useGameWebSocket } from '../hooks/use-game-websocket'
import { useGameStore } from '../stores/game.store'

export default function GamePage() {
  const { gameId = '' } = useParams()
  const { data } = useGame(gameId)
  const setGame = useGameStore((state) => state.setGame)

  useGameWebSocket(gameId || null)

  useEffect(() => {
    if (data) {
      setGame(data)
    }
  }, [data, setGame])

  return (
    <div className="flex flex-col gap-2">
      <h2 className="text-xl font-semibold">Partie en cours</h2>
      <p>Game ID: {gameId}</p>
      <p>Status: {data?.status}</p>
    </div>
  )
}

