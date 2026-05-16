import { useParams } from 'react-router-dom'
import { useLobbyWebSocket } from '../hooks/use-lobby-websocket'

export default function LobbyWaitingPage() {
  const { lobbyId = '' } = useParams()

  useLobbyWebSocket(lobbyId || null)

  return (
    <div className="flex flex-col gap-2">
      <h2 className="text-xl font-semibold">Salle d'attente</h2>
      <p>Lobby: {lobbyId}</p>
      <p className="text-sm text-muted-foreground">En attente d'un adversaire...</p>
    </div>
  )
}

