import { create } from "zustand";

export const useStore = create((set) => ({
  logs: [],
  activeTask: null,
  wsConnected: false,
  projectDir: "",

  addLog: (entry) =>
    set((state) => ({ logs: [...state.logs, entry] })),

  clearLogs: () => set({ logs: [] }),

  setActiveTask: (tool) => set({ activeTask: tool }),

  setWsConnected: (val) => set({ wsConnected: val }),

  setProjectDir: (dir) => set({ projectDir: dir }),
}));
