import { useEffect, useState } from 'react'
import { useTopics } from '../api/theme.queries'
import { SearchInput } from '@/shared/ui/SearchInput'
import { PaginationControls } from '@/shared/ui/PaginationControls'
import type { FilterRequest } from '@/shared/types/pagination.types'
import { useTopicListSearchStore } from '../stores/topic-list.store'

export default function TopicListPage() {
  const [term, setTerm] = useState('')
  const { filters, sorts, page, setFilters, setPageNumber } = useTopicListSearchStore()

  useEffect(() => {
    let nextFilters: FilterRequest[] = []
    if (term) {
      const nameFilter: FilterRequest = {
        property: 'name',
        operator: 'CONTAINS' as FilterRequest['operator'],
        value: term,
      }
      nextFilters = [nameFilter]
    }
    setFilters(nextFilters)
  }, [setFilters, term])

  const { data } = useTopics({ filters, sorts, page })

  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-xl font-semibold">Topics</h2>
      <SearchInput onDebouncedChange={setTerm} placeholder="Rechercher un topic" />
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {data?.content.map((topic) => (
          <div key={topic.topicId} className="rounded-lg border bg-card p-4">
            <p className="font-medium">{topic.name}</p>
            <p className="text-sm text-muted-foreground">{topic.category}</p>
          </div>
        ))}
      </div>
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

