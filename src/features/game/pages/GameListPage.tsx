import { useEffect, useState } from 'react'
import { SearchInput } from '@/shared/ui/SearchInput'
import { PaginationControls } from '@/shared/ui/PaginationControls'
import type { FilterRequest } from '@/shared/types/pagination.types'
import { useGames } from '../api/game.queries'
import { useGameListSearchStore } from '../stores/game-list.store'

export default function GameListPage() {
  const [term, setTerm] = useState('')
  const { filters, sorts, page, setFilters, setPageNumber } = useGameListSearchStore()

  useEffect(() => {
    let nextFilters: FilterRequest[] = []
    if (term) {
      const topicFilter: FilterRequest = {
        property: 'topicId',
        operator: 'CONTAINS' as FilterRequest['operator'],
        value: term,
      }
      nextFilters = [topicFilter]
    }
    setFilters(nextFilters)
  }, [setFilters, term])

  const { data } = useGames({ filters, sorts, page })

  return (
    <div className="flex flex-col gap-3">
      <h2 className="text-xl font-semibold">Mes parties</h2>
      <SearchInput onDebouncedChange={setTerm} placeholder="Filtrer par topicId" />

      {data?.content.map((game) => (
        <div key={game.gameId} className="rounded-lg border p-4">
          <p className="font-medium">Game {game.gameId}</p>
          <p className="text-sm text-muted-foreground">Status: {game.status}</p>
        </div>
      ))}

      <PaginationControls
        pageNumber={data ? data.pageNumber : page.number}
        totalPages={data?.totalPages ?? 1}
        isFirst={!data || data.first}
        isLast={!data || data.last}
        onPrevious={() => setPageNumber(page.number - 1)}
        onNext={() => setPageNumber(page.number + 1)}
      />
    </div>
  )
}

