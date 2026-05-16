import { useMemo } from 'react'
import { useTopics } from '@/features/theme/api/theme.queries'
import { PaginationControls } from '@/shared/ui/PaginationControls'
import { useCreateLobby, useOpenLobbies } from '../api/matchmaking.queries'
import { useLobbyListSearchStore } from '../stores/lobby-list.store'

export default function MatchmakingPage() {
  const { selectedTopicId, filters, page, setSelectedTopicId, setPageNumber } = useLobbyListSearchStore()

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

  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-xl font-semibold">Matchmaking</h2>
      <select
        className="h-10 rounded-md border bg-background px-3"
        value={selectedTopicId}
        onChange={(event) => setSelectedTopicId(event.target.value)}
      >
        <option value="">Selectionnez un topic</option>
        {topicsQuery.data?.content.map((topic) => (
          <option key={topic.topicId} value={topic.topicId}>
            {topic.name}
          </option>
        ))}
      </select>

      {lobbiesQuery.data?.content.map((lobby) => (
        <div key={lobby.lobbyId} className="rounded-lg border p-3">
          <p className="font-medium">Lobby {lobby.lobbyId}</p>
          <p className="text-sm text-muted-foreground">{lobby.status}</p>
        </div>
      ))}

      <PaginationControls
        pageNumber={lobbiesQuery.data ? lobbiesQuery.data.pageNumber : page.number}
        totalPages={lobbiesQuery.data?.totalPages ?? 1}
        isFirst={!lobbiesQuery.data || lobbiesQuery.data.first}
        isLast={!lobbiesQuery.data || lobbiesQuery.data.last}
        onPrevious={() => setPageNumber(page.number - 1)}
        onNext={() => setPageNumber(page.number + 1)}
      />

      <button
        type="button"
        className="h-10 rounded-md border px-4"
        onClick={() => createLobby.mutate({ topicId: selectedTopicId })}
        disabled={!selectedTopicId}
      >
        Creer un lobby
      </button>
    </div>
  )
}

