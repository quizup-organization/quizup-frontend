import { useEffect, useState } from 'react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { useMe } from '@/features/identity/api/identity.queries'
import type { FilterRequest } from '@/shared/types/pagination.types'
import { PaginationControls } from '@/shared/ui/PaginationControls'
import { SearchInput } from '@/shared/ui/SearchInput'
import { getProblemDetails } from '@/shared/types/error.types'
import {
  useAcceptChallenge,
  useChallenges,
  useDeclineChallenge,
  useFriendships,
  useRemoveFriendship,
} from '../api/social.queries'
import { useFriendshipListSearchStore } from '../stores/friendship-list.store'
import { useSocialChallengeListSearchStore } from '../stores/social-challenge-list.store'

export default function SocialPage() {
  const [friendTerm, setFriendTerm] = useState('')
  const [challengeTerm, setChallengeTerm] = useState('')
  const me = useMe()
  const currentUserId = me.data?.userId ?? ''

  const friendFilters = useFriendshipListSearchStore((state) => state.filters)
  const friendSorts = useFriendshipListSearchStore((state) => state.sorts)
  const friendPage = useFriendshipListSearchStore((state) => state.page)
  const setFriendFilters = useFriendshipListSearchStore((state) => state.setFilters)
  const setFriendPageNumber = useFriendshipListSearchStore((state) => state.setPageNumber)

  const challengeFilters = useSocialChallengeListSearchStore((state) => state.filters)
  const challengeSorts = useSocialChallengeListSearchStore((state) => state.sorts)
  const challengePage = useSocialChallengeListSearchStore((state) => state.page)
  const setChallengeFilters = useSocialChallengeListSearchStore((state) => state.setFilters)
  const setChallengePageNumber = useSocialChallengeListSearchStore((state) => state.setPageNumber)

  useEffect(() => {
    let nextFilters: FilterRequest[] = []
    if (friendTerm) {
      nextFilters = [{ property: 'userId1', operator: 'CONTAINS', value: friendTerm }]
    }
    setFriendFilters(nextFilters)
  }, [friendTerm, setFriendFilters])

  useEffect(() => {
    let nextFilters: FilterRequest[] = []
    if (challengeTerm) {
      nextFilters = [{ property: 'challengerId', operator: 'CONTAINS', value: challengeTerm }]
    }
    setChallengeFilters(nextFilters)
  }, [challengeTerm, setChallengeFilters])

  const friendships = useFriendships({
    filters: friendFilters,
    sorts: friendSorts,
    page: friendPage,
  })

  const challenges = useChallenges({
    filters: challengeFilters,
    sorts: challengeSorts,
    page: challengePage,
  })

  const removeFriendship = useRemoveFriendship()
  const acceptChallenge = useAcceptChallenge()
  const declineChallenge = useDeclineChallenge()

  const onRemoveFriendship = (friendshipId: string) => {
    removeFriendship.mutate(friendshipId, {
      onSuccess: () => toast.success('Amitié supprimée'),
      onError: (error) => {
        const problem = getProblemDetails(error)
        toast.error(problem ? problem.detail : 'Suppression impossible')
      },
    })
  }

  const onAcceptChallenge = (challengeId: string) => {
    acceptChallenge.mutate(challengeId, {
      onSuccess: () => toast.success('Défi accepté'),
      onError: (error) => {
        const problem = getProblemDetails(error)
        toast.error(problem ? problem.detail : "Impossible d'accepter le défi")
      },
    })
  }

  const onDeclineChallenge = (challengeId: string) => {
    declineChallenge.mutate(challengeId, {
      onSuccess: () => toast.success('Défi refusé'),
      onError: (error) => {
        const problem = getProblemDetails(error)
        toast.error(problem ? problem.detail : 'Impossible de refuser le défi')
      },
    })
  }

  return (
    <div className="grid gap-6 xl:grid-cols-2">
      <section className="flex flex-col gap-3 rounded-lg border p-4">
        <h2 className="text-xl font-semibold">Réseau</h2>
        <SearchInput onDebouncedChange={setFriendTerm} placeholder="Filtrer par userId" />

        {friendships.data?.content.map((friendship) => (
          <div key={friendship.friendshipId} className="rounded-lg border p-3">
            <p className="font-medium">Amitié {friendship.friendshipId}</p>
            <p className="text-sm text-muted-foreground">
              {friendship.userId1} vs {friendship.userId2}
            </p>
            <div className="mt-3 flex justify-end">
              <Button
                variant="outline"
                size="sm"
                onClick={() => onRemoveFriendship(friendship.friendshipId)}
                disabled={removeFriendship.isPending}
              >
                Supprimer
              </Button>
            </div>
          </div>
        ))}

        <PaginationControls
          pageNumber={friendships.data ? friendships.data.pageNumber : friendPage.number}
          totalPages={friendships.data?.totalPages ?? 1}
          isFirst={!friendships.data || friendships.data.first}
          isLast={!friendships.data || friendships.data.last}
          onPrevious={() => setFriendPageNumber(friendPage.number - 1)}
          onNext={() => setFriendPageNumber(friendPage.number + 1)}
        />
      </section>

      <section className="flex flex-col gap-3 rounded-lg border p-4">
        <h2 className="text-xl font-semibold">Invitations de duel</h2>
        <SearchInput onDebouncedChange={setChallengeTerm} placeholder="Filtrer par challengerId" />

        {challenges.data?.content.map((challenge) => (
          <div key={challenge.challengeId} className="rounded-lg border p-3">
            <p className="font-medium">Défi {challenge.challengeId}</p>
            <p className="text-sm text-muted-foreground">État : {challenge.status}</p>
            <p className="text-sm text-muted-foreground">Topic : {challenge.topicId}</p>
            <p className="text-sm text-muted-foreground">
              {challenge.challengerId} {'->'} {challenge.challengedId}
            </p>
            {challenge.status === 'PENDING' && challenge.challengedId === currentUserId ? (
              <div className="mt-3 flex gap-2">
                <Button
                  size="sm"
                  onClick={() => onAcceptChallenge(challenge.challengeId)}
                  disabled={acceptChallenge.isPending || declineChallenge.isPending}
                >
                  Accepter
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onDeclineChallenge(challenge.challengeId)}
                  disabled={acceptChallenge.isPending || declineChallenge.isPending}
                >
                  Refuser
                </Button>
              </div>
            ) : null}
          </div>
        ))}

        <PaginationControls
          pageNumber={challenges.data ? challenges.data.pageNumber : challengePage.number}
          totalPages={challenges.data?.totalPages ?? 1}
          isFirst={!challenges.data || challenges.data.first}
          isLast={!challenges.data || challenges.data.last}
          onPrevious={() => setChallengePageNumber(challengePage.number - 1)}
          onNext={() => setChallengePageNumber(challengePage.number + 1)}
        />
      </section>
    </div>
  )
}
