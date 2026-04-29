import { Sun, Moon } from 'lucide-react'
import { useStore, Theme } from '@store/useStore'

export default function ThemeToggle() {
  const theme = useStore((s: { theme: Theme }) => s.theme)
  const toggleTheme = useStore((s: { toggleTheme: () => void }) => s.toggleTheme)

  return (
    <button
      aria-label="Toggle theme"
      className="rounded-full p-2 border border-zinc-700 bg-zinc-900 hover:bg-zinc-800 transition-colors"
      onClick={toggleTheme}
      title={theme === 'dark' ? 'Светлая тема' : 'Тёмная тема'}
      style={{ lineHeight: 0 }}
    >
      {theme === 'dark' ? (
        <Sun size={16} className="text-yellow-400" />
      ) : (
        <Moon size={16} className="text-zinc-600" />
      )}
    </button>
  )
}
