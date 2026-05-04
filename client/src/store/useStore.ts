import { create } from 'zustand'
import type { StepStatus } from '@config/workflow'
import { WORKFLOW_CONFIG } from '@config/workflow'

export type Theme = 'light' | 'dark'

/**
 * One row in the Terminal output buffer.
 *
 * Receives every WebSocket frame the server pushes that isn't handled
 * specially (i.e. anything other than `connected` / `history_update`).
 * Mirrors `task_start` / `output` / `task_end` from `shared/contracts.ts`.
 *
 * The shape is intentionally open so adding a new server-side message type
 * doesn't require a client-side migration before the Terminal can render it.
 * The Terminal organism inspects `type` to decide which fields to read.
 */
export interface LogEntry {
  type: string
  tool?: string
  correlationId?: string
  status?: string
  message?: string
  data?: string
}

/**
 * Locally-known user profile.
 *
 * There is no auth yet — this is a placeholder that the dashboard renders
 * (avatar/initials/role) and that the server uses as the `userId` of the
 * `Initiator` on every workflow event. Once real auth lands, `id` will become
 * a server-issued subject claim instead of a client-generated UUID.
 */
export interface User {
  /**
   * Stable identity token. Generated once via `crypto.randomUUID()` on the
   * first visit and persisted to `localStorage['userId']`; survives reloads
   * and tab restarts so history accumulates under the same user across
   * sessions. Sent in the `session_init` WS frame so the server can register
   * `sessionId → userId` and key `ActionRecord` history.
   */
  id: string
  /** Display name shown in the header avatar tooltip. Placeholder until auth. */
  name: string
  /** Two-letter avatar text (e.g. `'PP'`). Placeholder until auth. */
  initials: string
  /** Display role label (e.g. `'Admin'`). Not enforced anywhere — placeholder. */
  role: string
}

/**
 * Global, app-wide UI state.
 *
 * Lives for the lifetime of the page and is shared across every route. Used
 * for cross-cutting concerns that don't belong to a specific feature:
 *   - Terminal output buffer driven by WebSocket frames (`logs`)
 *   - "Which command is running right now?" guard for the Dashboard buttons
 *     (`activeTask`)
 *   - Connection indicator in the header (`wsConnected`)
 *   - Project directory override that REST tool calls forward to the server
 *     (`projectDir`)
 *   - Theme + user identity (persisted to `localStorage`)
 *
 * Session-scoped data (sessionId, status) lives in `useSessionStore` and is
 * reset whenever the session ends — keep that data out of here.
 */
export interface StoreState {
  /**
   * Append-only buffer of WebSocket frames rendered by the Terminal organism.
   * Cleared via `clearLogs` so the Terminal shows output for the current
   * invocation only. Order matches arrival.
   */
  logs: LogEntry[]

  /**
   * Identifier of the tool currently executing on the server, or `null` when
   * nothing is running. Cleared by the WS `task_end` handler in
   * `useWebSocketConnection`.
   */
  activeTask: string | null

  /**
   * Whether the browser→server WebSocket is currently OPEN. Toggled inside
   * `useWebSocketConnection` from `onopen` / `onclose` / `onerror`.
   */
  wsConnected: boolean

  /**
   * Optional absolute path the user typed into the Settings input. When
   * non-empty, REST tool calls forward it as `projectDir` so the server runs
   * the tool against this directory instead of `PROJECT_DIR` from env.
   * Empty string means "use the server default".
   */
  projectDir: string

  /**
   * Active visual theme. Initialised from `localStorage['theme']` if present,
   * otherwise from `prefers-color-scheme`. The setters persist back to
   * `localStorage` and toggle the `dark` class on `documentElement` so
   * Tailwind's `dark:` variants take effect.
   */
  theme: Theme

  /**
   * Locally-known user profile. `id` is a stable identity token persisted in
   * `localStorage['userId']` (generated once via `crypto.randomUUID()`); it's
   * sent in `session_init` over the WS and used as the `Initiator.userId` on
   * every workflow event. `name`/`initials`/`role` are display-only
   * placeholders until real auth is wired in.
   */
  user: User

  /**
   * Per-step status for every entry in `WORKFLOW_CONFIG`. Initialised with
   * every configured step set to `idle`; the WorkflowCard derives `locked`
   * from `dependsOn` rather than storing it here.
   */
  workflowSteps: Record<string, StepStatus>

  /** Free-text plan saved by the "Add Plan" modal; rendered by the Drawer. */
  planContent: string

  /** Step id of the currently-open Drawer, or `null` when closed. */
  activeDrawer: string | null

  /** Step id of the currently-open Modal, or `null` when closed. */
  activeModal: string | null

  /** Switch theme to a specific value. Persists and updates the DOM class. */
  setTheme: (theme: Theme) => void

  /** Flip light↔dark. Equivalent to `setTheme(state.theme === 'dark' ? 'light' : 'dark')`. */
  toggleTheme: () => void

  /** Push a single WS frame onto `logs`. Called by `useWebSocketConnection.onmessage`. */
  addLog: (entry: LogEntry) => void

  /** Empty `logs`. Wired to the Terminal Clear button. */
  clearLogs: () => void

  /**
   * Mark a tool as currently running, or release the guard with `null`.
   * `null` is set by the WS `task_end` handler in `useWebSocketConnection`.
   */
  setActiveTask: (tool: string | null) => void

  /** Update the WebSocket connection indicator. Owned by `useWebSocketConnection`. */
  setWsConnected: (val: boolean) => void

  /** Update the project directory override. Triggers the `resetPlan` watcher in `App.tsx`. */
  setProjectDir: (dir: string) => void

  /**
   * Shallow-merge a partial user update into `state.user`. Primarily used by
   * the Settings page; does not persist to `localStorage` (only `id` and
   * `theme` are persisted).
   */
  setUser: (user: Partial<User>) => void

  /** Update one workflow step's status. */
  setStepStatus: (id: string, status: StepStatus) => void

  /** Replace the saved plan content shown in the Drawer. */
  setPlanContent: (content: string) => void

  /** Open the Drawer for a given step id. */
  openDrawer: (id: string) => void

  /** Close the Drawer. */
  closeDrawer: () => void

  /** Open the Modal for a given step id. */
  openModal: (id: string) => void

  /** Close the Modal. */
  closeModal: () => void
}

function initialWorkflowSteps(): Record<string, StepStatus> {
  return WORKFLOW_CONFIG.reduce<Record<string, StepStatus>>((acc, step) => {
    acc[step.id] = 'idle'
    return acc
  }, {})
}

function getInitialTheme(): Theme {
  if (typeof window !== 'undefined') {
    const stored = localStorage.getItem('theme')
    if (stored === 'dark' || stored === 'light') return stored
    if (window.matchMedia('(prefers-color-scheme: dark)').matches) return 'dark'
  }
  return 'light'
}

function getInitialUserId(): string {
  if (typeof window === 'undefined') return ''
  const stored = localStorage.getItem('userId')
  if (stored) return stored
  const id = crypto.randomUUID()
  localStorage.setItem('userId', id)
  return id
}

export const useStore = create<StoreState>((set) => ({
  logs: [],
  activeTask: null,
  wsConnected: false,
  projectDir: '',
  user: { id: getInitialUserId(), name: 'Pavels P.', initials: 'PP', role: 'Admin' },
  workflowSteps: initialWorkflowSteps(),
  planContent: '',
  activeDrawer: null,
  activeModal: null,

  theme: getInitialTheme(),
  setTheme: (theme: Theme) => {
    set({ theme })
    if (theme === 'dark') {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
    localStorage.setItem('theme', theme)
  },
  toggleTheme: () => {
    set((state) => {
      const newTheme: Theme = state.theme === 'dark' ? 'light' : 'dark'
      if (newTheme === 'dark') {
        document.documentElement.classList.add('dark')
      } else {
        document.documentElement.classList.remove('dark')
      }
      localStorage.setItem('theme', newTheme)
      return { theme: newTheme }
    })
  },

  addLog: (entry: LogEntry) => set((state) => ({ logs: [...state.logs, entry] })),

  clearLogs: () => set({ logs: [] }),

  setActiveTask: (tool: string | null) => set({ activeTask: tool }),

  setWsConnected: (val: boolean) => set({ wsConnected: val }),

  setProjectDir: (dir: string) => set({ projectDir: dir }),

  setUser: (user: Partial<User>) => set((state) => ({ user: { ...state.user, ...user } })),

  setStepStatus: (id: string, status: StepStatus) =>
    set((state) => ({ workflowSteps: { ...state.workflowSteps, [id]: status } })),

  setPlanContent: (content: string) => set({ planContent: content }),

  openDrawer: (id: string) => set({ activeDrawer: id }),
  closeDrawer: () => set({ activeDrawer: null }),
  openModal: (id: string) => set({ activeModal: id }),
  closeModal: () => set({ activeModal: null })
}))
