import { Sun, Moon } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { useStore, Theme } from '@store/useStore'

export default function ThemeToggle() {
  const { t } = useTranslation()
  const theme = useStore((s: { theme: Theme }) => s.theme)
  const toggleTheme = useStore((s: { toggleTheme: () => void }) => s.toggleTheme)

  const isDark = theme === 'dark'

  return (
    <button
      aria-label="Toggle theme"
      onClick={toggleTheme}
      title={isDark ? t('theme.switchToLight') : t('theme.switchToDark')}
      className="inline-flex items-center justify-center rounded-full p-2 leading-none border border-zinc-300 bg-white text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:bg-zinc-800 dark:hover:text-zinc-100 transition-colors"
    >
      {isDark ? (
        <Sun size={16} className="text-amber-500 dark:text-amber-400" />
      ) : (
        <Moon size={16} className="text-indigo-500 dark:text-indigo-400" />
      )}
    </button>
  )
}
