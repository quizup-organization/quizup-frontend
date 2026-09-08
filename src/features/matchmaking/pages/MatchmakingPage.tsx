import { useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { useMe } from '@/features/identity/api/identity.queries'
import { useTopics } from '@/features/theme/api/theme.queries'
import { PaginationControls } from '@/shared/ui/PaginationControls'
import { useCreateLobby, useJoinLobby, useOpenLobbies } from '../api/matchmaking.queries'
import { useLobbyListSearchStore } from '../stores/lobby-list.store'

const TOPIC_ICON: Record<string, string> = {
  MOVIES: '🎬',
  SPORTS: '⚽',
  SCIENCE: '🔬',
  HISTORY: '🏛️',
  MUSIC: '🎵',
  TECHNOLOGY: '💻',
  GENERAL: '🧠',
}

export default function MatchmakingPage() {
  const { selectedTopicId, filters, page, setSelectedTopicId, setPageNumber } = useLobbyListSearchStore()
  const navigate = useNavigate()
  const me = useMe()

  const topicsQuery = useTopics(
    useMemo(
      () => ({
        filters: [{ property: 'status', operator: 'EQUALS', value: 'PUBLISHED' }],
        page: { number: 0, size: 30 },
      }),
      [],
    ),
  )

  const lobbiesQuery = useOpenLobbies({ filters, page })
  const createLobby = useCreateLobby()
  const joinLobby = useJoinLobby()

  const selectedTopic = topicsQuery.data?.content.find((topic) => topic.topicId === selectedTopicId)
  const categoryLabel = selectedTopic?.category ?? 'GENERAL'
  const categoryIcon = TOPIC_ICON[categoryLabel] ?? '🎯'

  const onCreateLobby = () => {
    if (!selectedTopicId) {
      return
    }

    createLobby.mutate(
      { topicId: selectedTopicId },
      {
        onSuccess: () => {
          toast.success('Recherche en cours...')
        },
        onError: () => toast.error('Creation de lobby impossible'),
      },
    )
  }

  const onJoinLobby = (lobbyId: string) => {
    joinLobby.mutate(lobbyId, {
      onSuccess: () => {
        toast.success('Lobby rejoint')
        navigate(`/matchmaking/lobby/${lobbyId}`)
      },
      onError: () => toast.error('Impossible de rejoindre ce lobby'),
    })
  }

  return (
    <div className="mx-auto h-[812px] w-[375px] overflow-hidden rounded-[40px] border-2 border-zinc-800 bg-black p-4 text-white shadow-2xl">
      <div className="mx-auto h-6 w-24 rounded-b-2xl bg-black" />
      <h2 className="mb-2 text-center text-xl font-black">Matchmaking</h2>

      <select
        className="h-11 rounded-xl border border-zinc-700 bg-zinc-950 px-3 text-sm text-white"
        value={selectedTopicId}
        onChange={(event) => setSelectedTopicId(event.target.value)}
      >
        <option value="">Selectionnez un topic publie</option>
        {topicsQuery.data?.content.map((topic) => (
          <option key={topic.topicId} value={topic.topicId}>
            {topic.name}
          </option>
        ))}
      </select>

      <div className="mt-2 rounded-2xl border border-zinc-800 bg-zinc-950 p-4">
        <div className="mx-auto inline-flex items-center gap-2 rounded-full bg-red-600 px-4 py-1 text-sm font-extrabold">
          <span>{categoryIcon}</span>
          <span>{categoryLabel}</span>
        </div>

        <div className="mt-4 flex items-center justify-between">
          <div className="text-center">
            <div className="mx-auto flex size-16 items-center justify-center rounded-full border-2 border-yellow-500 bg-zinc-900 text-2xl">🦊</div>
            <p className="mt-2 text-xs font-bold">{me.data?.userId ? 'Vous' : 'Joueur'}</p>
          </div>

          <div className="text-center">
            <p className="text-3xl font-black">VS</p>
            <div className="mx-auto mt-1 size-6 animate-spin rounded-full border-2 border-zinc-700 border-t-cyan-400" />
            <p className="mt-1 text-xs text-zinc-500">Recherche...</p>
          </div>

          <div className="text-center">
            <div className="mx-auto flex size-16 items-center justify-center rounded-full border-2 border-zinc-700 bg-zinc-900 text-2xl text-zinc-600">?</div>
            <p className="mt-2 text-xs font-bold text-zinc-400">Adversaire</p>
          </div>
        </div>
      </div>

      <div className="mt-3 max-h-[230px] space-y-2 overflow-y-auto pr-1">
        {lobbiesQuery.data?.content.map((lobby) => (
          <div key={lobby.lobbyId} className="rounded-xl border border-zinc-800 bg-zinc-950 p-3">
            <p className="text-sm font-semibold">Lobby {lobby.lobbyId.slice(0, 8)}</p>
            <p className="text-xs text-zinc-500">Status: {lobby.status}</p>
            <div className="mt-2 flex justify-end">
              <Button
                size="sm"
                className="bg-cyan-600 text-white hover:bg-cyan-500"
                onClick={() => onJoinLobby(lobby.lobbyId)}
                disabled={joinLobby.isPending}
              >
                Rejoindre
              </Button>
            </div>
          </div>
        ))}
        {lobbiesQuery.data && lobbiesQuery.data.content.length === 0 ? (
          <p className="rounded-xl border border-zinc-800 bg-zinc-950 p-3 text-sm text-zinc-500">Aucun lobby ouvert pour ce filtre.</p>
        ) : null}
      </div>

      <div className="mt-auto">
        <PaginationControls
          pageNumber={lobbiesQuery.data ? lobbiesQuery.data.pageNumber : page.number}
          totalPages={lobbiesQuery.data?.totalPages ?? 1}
          isFirst={!lobbiesQuery.data || lobbiesQuery.data.first}
          isLast={!lobbiesQuery.data || lobbiesQuery.data.last}
          onPrevious={() => setPageNumber(page.number - 1)}
          onNext={() => setPageNumber(page.number + 1)}
        />

        <Button
          className="mt-2 h-12 w-full rounded-2xl bg-zinc-900 text-zinc-300 hover:bg-zinc-800"
          onClick={onCreateLobby}
          disabled={!selectedTopicId || createLobby.isPending}
        >
          Creer un lobby
        </Button>

        {createLobby.isPending ? (
          <p className="mt-2 text-center text-xs text-zinc-500">Recherche d'adversaire en cours...</p>
        ) : null}

        {selectedTopic?.topicId ? (
          <p className="mt-1 text-center text-[11px] text-zinc-600">Topic: {selectedTopic.name}</p>
        ) : null}
      </div>
    </div>
  )
}

