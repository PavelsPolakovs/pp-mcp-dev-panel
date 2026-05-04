import { create } from 'zustand'
import { useStore } from './useStore'

export type SessionStatus = 'idle' | 'active' | 'ended'

export interface SessionStoreState {
  sessionId: string | null
  userId: string
  startedAt: string | null
  status: SessionStatus

  startSession: () => { sessionId: string; userId: string }
  endSession: () => void
  reset: () => void
}

export const useSessionStore = create<SessionStoreState>((set) => ({
  sessionId: null,
  userId: '',
  startedAt: null,
  status: 'idle',

  startSession: () => {
    const userId = useStore.getState().user.id
    const sessionId = crypto.randomUUID()
    const startedAt = new Date().toISOString()
    set({ sessionId, userId, startedAt, status: 'active' })
    return { sessionId, userId }
  },

  endSession: () => set({ status: 'ended' }),

  reset: () =>
    set({
      sessionId: null,
      userId: '',
      startedAt: null,
      status: 'idle'
    })
}))