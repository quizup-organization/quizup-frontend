import { create } from 'zustand'

export type NotificationEvent =
  | { type: 'FRIEND_REQUEST_RECEIVED'; senderId: string }
  | { type: 'CHALLENGE_RECEIVED'; challengeId: string; challengerId: string }
  | { type: 'GAME_ENDED'; gameId: string; won: boolean }

interface NotificationState {
  pendingFriendRequests: number
  pendingChallenges: number
  events: NotificationEvent[]
  incrementFriendRequests: () => void
  incrementChallenges: () => void
  addEvent: (event: NotificationEvent) => void
  clearEvents: () => void
}

export const useNotificationStore = create<NotificationState>((set) => ({
  pendingFriendRequests: 0,
  pendingChallenges: 0,
  events: [],
  incrementFriendRequests: () =>
    set((state) => ({ pendingFriendRequests: state.pendingFriendRequests + 1 })),
  incrementChallenges: () => set((state) => ({ pendingChallenges: state.pendingChallenges + 1 })),
  addEvent: (event) =>
    set((state) => ({
      events: [...state.events, event],
    })),
  clearEvents: () => set({ events: [] }),
}))
