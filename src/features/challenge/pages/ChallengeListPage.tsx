import { useEffect, useState } from 'react'
import { SearchInput } from '@/shared/ui/SearchInput'
import { PaginationControls } from '@/shared/ui/PaginationControls'
import type { FilterRequest } from '@/shared/types/pagination.types'
import { useChallenges } from '../api/challenge.queries'
import { useChallengeListSearchStore } from '../stores/challenge-list.store'

export default function ChallengeListPage() {
  const [term, setTerm] = useState('')
  const { filters, sorts, page, setFilters, setPageNumber } = useChallengeListSearchStore()

  useEffect(() => {
    let nextFilters: FilterRequest[] = []
    if (term) {
      const challengerFilter: FilterRequest = {
        property: 'challengerId',
        operator: 'CONTAINS' as FilterRequest['operator'],
        value: term,
      }
      nextFilters = [challengerFilter]
    }
    setFilters(nextFilters)
  }, [setFilters, term])

  const { data } = useChallenges({ filters, sorts, page })

  return (
    <div className="flex flex-col gap-3">
      <h2 className="text-xl font-semibold">Defis</h2>
      <SearchInput onDebouncedChange={setTerm} placeholder="Filtrer par challenger" />

      {data?.content.map((challenge) => (
        <div key={challenge.challengeId} className="rounded-lg border p-3">
          <p className="font-medium">Challenge {challenge.challengeId}</p>
          <p className="text-sm text-muted-foreground">{challenge.status}</p>
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

