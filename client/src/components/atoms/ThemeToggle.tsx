import { Sun, Moon } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { useStore, Theme } from '@store/useStore'

export default function ThemeToggle() {
  const { t } = useTranslation()
  const theme = useStore((s: { theme: Theme }) => s.theme)
  const toggleTheme = useStore((s: { toggleTheme: () => void }) => s.toggleTheme)

  return (
    <button
      aria-label="Toggle theme"
      className="rounded-full p-2 border border-zinc-700 bg-zinc-900 hover:bg-zinc-800 transition-colors"
      onClick={toggleTheme}
      title={theme === 'dark' ? t('theme.switchToLight') : t('theme.switchToDark')}
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