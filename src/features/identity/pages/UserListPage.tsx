import { useEffect, useState } from 'react'
import { PaginationControls } from '@/shared/ui/PaginationControls'
import { SearchInput } from '@/shared/ui/SearchInput'
import type { FilterRequest } from '@/shared/types/pagination.types'
import { useUsers } from '../api/identity.queries'
import { UserCard } from '../components/UserCard'
import { useUserListSearchStore } from '../stores/user-list.store'

export default function UserListPage() {
  const [term, setTerm] = useState('')
  const { filters, sorts, page, setFilters, setPageNumber } = useUserListSearchStore()

  useEffect(() => {
    let nextFilters: FilterRequest[] = []
    if (term) {
      const emailFilter: FilterRequest = {
        property: 'email',
        operator: 'CONTAINS' as FilterRequest['operator'],
        value: term,
      }
      nextFilters = [emailFilter]
    }
    setFilters(nextFilters)
  }, [setFilters, term])

  const { data } = useUsers({ filters, sorts, page })

  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-xl font-semibold">Utilisateurs</h2>
      <SearchInput onDebouncedChange={setTerm} placeholder="Rechercher par email" />
      <div className="grid gap-3">
        {data?.content.map((user) => (
          <UserCard key={user.userId} user={user} />
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
