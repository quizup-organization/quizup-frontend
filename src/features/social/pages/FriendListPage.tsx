import { useEffect, useState } from 'react'
import { SearchInput } from '@/shared/ui/SearchInput'
import { PaginationControls } from '@/shared/ui/PaginationControls'
import type { FilterRequest } from '@/shared/types/pagination.types'
import { useFriendships } from '../api/social.queries'
import { useFriendshipListSearchStore } from '../stores/friendship-list.store'

export default function FriendListPage() {
  const [term, setTerm] = useState('')
  const { filters, sorts, page, setFilters, setPageNumber } = useFriendshipListSearchStore()

  useEffect(() => {
    let nextFilters: FilterRequest[] = []
    if (term) {
      const userFilter: FilterRequest = {
        property: 'userId1',
        operator: 'CONTAINS' as FilterRequest['operator'],
        value: term,
      }
      nextFilters = [userFilter]
    }
    setFilters(nextFilters)
  }, [setFilters, term])

  const { data } = useFriendships({ filters, sorts, page })

  return (
    <div className="flex flex-col gap-3">
      <h2 className="text-xl font-semibold">Amis</h2>
      <SearchInput onDebouncedChange={setTerm} placeholder="Filtrer par userId1" />

      {data?.content.map((friendship) => (
        <div key={friendship.friendshipId} className="rounded-lg border p-3">
          <p>ID: {friendship.friendshipId}</p>
          <p className="text-sm text-muted-foreground">
            {friendship.userId1} vs {friendship.userId2}
          </p>
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

