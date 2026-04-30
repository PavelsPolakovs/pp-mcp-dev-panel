import { create } from 'zustand'

export type Theme = 'light' | 'dark'

export interface LogEntry {
  type: string
  status?: string
  message?: string
  data?: string
}

export interface User {
  name: string
  initials: string
  role: string
}

export interface StoreState {
  logs: LogEntry[]
  activeTask: string | null
  wsConnected: boolean
  projectDir: string
  theme: Theme
  user: User
  setTheme: (theme: Theme) => void
  toggleTheme: () => void
  addLog: (entry: LogEntry) => void
  clearLogs: () => void
  setActiveTask: (tool: string | null) => void
  setWsConnected: (val: boolean) => void
  setProjectDir: (dir: string) => void
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

export const useStore = create<StoreState>((set) => ({
  logs: [],
  activeTask: null,
  wsConnected: false,
  projectDir: '',
  user: { name: 'Pavels P.', initials: 'PP', role: 'Admin' },

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
}))
