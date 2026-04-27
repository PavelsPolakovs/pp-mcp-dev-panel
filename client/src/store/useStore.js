import { create } from "zustand";

function getInitialTheme() {
  if (typeof window !== 'undefined') {
    const stored = localStorage.getItem('theme');
    if (stored === 'dark' || stored === 'light') return stored;
    if (window.matchMedia('(prefers-color-scheme: dark)').matches) return 'dark';
  }
  return 'light';
}

export const useStore = create((set) => ({
  logs: [],
  activeTask: null,
  wsConnected: false,
  projectDir: "",

  theme: getInitialTheme(),
  setTheme: (theme) => {
    set({ theme });
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  },
  toggleTheme: () => {
    set((state) => {
      const newTheme = state.theme === 'dark' ? 'light' : 'dark';
      if (newTheme === 'dark') {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
      localStorage.setItem('theme', newTheme);
      return { theme: newTheme };
    });
  },

  addLog: (entry) =>
    set((state) => ({ logs: [...state.logs, entry] })),

  clearLogs: () => set({ logs: [] }),

  setActiveTask: (tool) => set({ activeTask: tool }),

  setWsConnected: (val) => set({ wsConnected: val }),

  setProjectDir: (dir) => set({ projectDir: dir }),
}));
