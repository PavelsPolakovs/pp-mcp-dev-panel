import { create } from 'zustand'
import { useStore } from './useStore'
import type { ActionRecord } from './types'

export type SessionStatus = 'idle' | 'active' | 'ended'

export interface SessionStoreState {
  sessionId: string | null
  userId: string
  startedAt: string | null
  status: SessionStatus
  history: ActionRecord[]
  historyLoading: boolean

  planContent: string | null
  planFileName: string | null
  planFetched: boolean

  startSession: () => { sessionId: string; userId: string }
  endSession: () => void
  reset: () => void

  addHistoryRecord: (record: ActionRecord) => void
  fetchHistory: (userId: string) => Promise<void>

  setPlan: (content: string, fileName: string) => void
  resetPlan: () => void
}

export const useSessionStore = create<SessionStoreState>((set, get) => ({
  sessionId: null,
  userId: '',
  startedAt: null,
  status: 'idle',
  history: [],
  historyLoading: false,

  planContent: null,
  planFileName: null,
  planFetched: false,

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
      status: 'idle',
      history: [],
      planContent: null,
      planFileName: null,
      planFetched: false
    }),

  addHistoryRecord: (record) => {
    const list = get().history
    const idx = list.findIndex((r) => r.id === record.id)
    if (idx === -1) {
      set({ history: [...list, record] })
    } else {
      const next = list.slice()
      next[idx] = record
      set({ history: next })
    }
  },

  fetchHistory: async (userId) => {
    if (!userId) return
    set({ historyLoading: true })
    try {
      const res = await fetch(`/api/history/user/${encodeURIComponent(userId)}`, {
        headers: { Accept: 'application/json' }
      })
      if (!res.ok) {
        throw new Error(`History request failed: ${res.status} ${res.statusText}`)
      }
      const ct = res.headers.get('content-type') ?? ''
      if (!ct.includes('application/json')) {
        throw new Error(
          `History endpoint returned non-JSON (content-type: ${ct || 'unset'}). ` +
            `Likely the API server is not running or a proxy is intercepting the request.`
        )
      }
      const data: ActionRecord[] = await res.json()
      set({ history: data })
    } finally {
      set({ historyLoading: false })
    }
  },

  setPlan: (content, fileName) =>
    set({ planContent: content, planFileName: fileName, planFetched: true }),

  resetPlan: () => set({ planContent: null, planFileName: null, planFetched: false })
}))
