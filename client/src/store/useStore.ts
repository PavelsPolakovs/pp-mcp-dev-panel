import { create } from 'zustand'

export type Theme = 'light' | 'dark'

/**
 * One row in the Terminal output buffer.
 *
 * Receives every WebSocket frame the server pushes that isn't handled
 * specially (i.e. anything other than `connected` / `history_update`).
 * Effectively a flattened, weakly-typed mirror of `ServerWsMessage` from
 * `server/ws.ts`:
 *
 *   - `task_start` → `{ type, tool, message }`
 *   - `output`     → `{ type, tool, data }`
 *   - `task_end`   → `{ type, tool, status, message }`
 *
 * The shape is intentionally open (`type: string`, all payload fields
 * optional) so that adding a new server-side message type doesn't require a
 * client-side migration before the Terminal can render it. The Terminal
 * organism inspects `type` to decide which fields to read.
 *
 * Order in `state.logs` matches arrival; `clearLogs` empties the buffer at
 * the start of each tool run.
 */
export interface LogEntry {
  /** Discriminator. Mirrors the `type` of `ServerWsMessage`. */
  type: string
  /** Final status of a tool run. Only present on `task_end` frames. */
  status?: string
  /** Human-readable banner. Present on `task_start` / `task_end` / `connected`. */
  message?: string
  /** Raw stdout/stderr chunk from the running tool. Present on `output` frames. */
  data?: string
}

/**
 * Locally-known user profile.
 *
 * There is no auth yet — this is a placeholder that the dashboard renders
 * (avatar/initials/role) and that the server uses to bucket per-user
 * `ActionRecord` history. Once real auth lands, the shape will be replaced
 * with whatever the auth provider returns and `id` will become a server-issued
 * subject claim instead of a client-generated UUID.
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
 * Session-scoped data (the active sessionId, action history, uploaded plan
 * file, etc.) lives in `useSessionStore` and is reset whenever the session
 * ends — keep that data out of here.
 */
export interface StoreState {
  /**
   * Append-only buffer of WebSocket frames rendered by the Terminal organism.
   * Cleared on each new tool run by `CommandButton` so the Terminal shows
   * output for the current invocation only. Order matches arrival.
   */
  logs: LogEntry[]

  /**
   * Identifier of the tool currently executing on the server (e.g. `'lint'`),
   * or `null` when nothing is running. Acts as a single-flight guard for the
   * Dashboard `CommandButton`s — disables every other button while one is
   * active. Cleared by the WS `task_end` handler in `useWebSocketConnection`.
   */
  activeTask: string | null

  /**
   * Whether the browser→server WebSocket is currently OPEN. Drives the
   * Live/Offline pill in the dashboard header. Toggled inside
   * `useWebSocketConnection` from `onopen` / `onclose` / `onerror`.
   */
  wsConnected: boolean

  /**
   * Optional absolute path the user typed into the dashboard input. When
   * non-empty, REST tool calls forward it as `projectDir` so the server runs
   * the tool against this directory instead of `PROJECT_DIR` from env.
   * Empty string means "use the server default".
   *
   * Watched in `App.tsx` — when this string changes,
   * `useSessionStore.resetPlan()` fires so a stale Task Plan doesn't leak
   * into a different project context.
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
   * sent in `session_init` over the WS so the server can key
   * `ActionRecord` history per user. `name`/`initials`/`role` are display-only
   * placeholders until real auth is wired in.
   */
  user: User

  /** Switch theme to a specific value. Persists and updates the DOM class. */
  setTheme: (theme: Theme) => void

  /** Flip light↔dark. Equivalent to `setTheme(state.theme === 'dark' ? 'light' : 'dark')`. */
  toggleTheme: () => void

  /** Push a single WS frame onto `logs`. Called by `useWebSocketConnection.onmessage`. */
  addLog: (entry: LogEntry) => void

  /** Empty `logs`. Called by `CommandButton` before each tool run. */
  clearLogs: () => void

  /**
   * Mark a tool as currently running, or release the guard with `null`.
   * `null` is set by the WS `task_end` handler and by `CommandButton`'s
   * `finally` block on REST failure.
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

  setUser: (user: Partial<User>) => set((state) => ({ user: { ...state.user, ...user } }))
}))
