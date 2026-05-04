import React from 'react'
import { FolderOpen, Settings } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { useStore } from '@store/useStore'

export default function SettingsPage() {
  const { t } = useTranslation()
  const theme = useStore((s) => s.theme)
  const setTheme = useStore((s) => s.setTheme)
  const projectDir = useStore((s) => s.projectDir)
  const setProjectDir = useStore((s) => s.setProjectDir)

  return (
    <div className="flex flex-col gap-8 max-w-2xl">
      <div>
        <div className="flex items-center gap-2.5 mb-1">
          <Settings size={20} className="text-cyan-600 dark:text-cyan-400" />
          <h1 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
            {t('settings.title')}
          </h1>
        </div>
        <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-0.5">{t('settings.subtitle')}</p>
      </div>

      <section className="flex flex-col gap-3">
        <h2 className="text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-500">
          {t('settings.appearance')}
        </h2>
        <div className="bg-white dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-700 rounded-lg p-4 flex items-center justify-between">
          <span className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
            {t('settings.colorScheme')}
          </span>
          <div className="flex gap-2">
            <button
              onClick={() => setTheme('light')}
              className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                theme === 'light'
                  ? 'bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900'
                  : 'bg-zinc-100 text-zinc-600 dark:bg-zinc-700 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-600'
              }`}
            >
              {t('settings.light')}
            </button>
            <button
              onClick={() => setTheme('dark')}
              className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                theme === 'dark'
                  ? 'bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900'
                  : 'bg-zinc-100 text-zinc-600 dark:bg-zinc-700 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-600'
              }`}
            >
              {t('settings.dark')}
            </button>
          </div>
        </div>
      </section>

      <section className="flex flex-col gap-3">
        <h2 className="text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-500">
          {t('settings.project')}
        </h2>
        <div className="bg-white dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-700 rounded-lg p-4 flex flex-col gap-2">
          <label
            htmlFor="settings-project-dir"
            className="text-sm font-medium text-zinc-900 dark:text-zinc-100 flex items-center gap-1.5"
          >
            <FolderOpen size={14} />
            {t('settings.projectDirLabel')}
          </label>
          <input
            id="settings-project-dir"
            type="text"
            value={projectDir}
            onChange={(e) => setProjectDir(e.target.value)}
            placeholder={t('settings.projectDirPlaceholder')}
            className="w-full bg-zinc-100 border border-zinc-300 dark:bg-zinc-900 dark:border-zinc-800 rounded-lg px-3 py-2 text-xs font-mono text-zinc-900 dark:text-zinc-300 placeholder-zinc-400 dark:placeholder-zinc-600 focus:outline-none focus:border-zinc-400 dark:focus:border-zinc-600 transition-colors"
          />
          <p className="text-xs text-zinc-500 dark:text-zinc-500">{t('settings.projectDirHint')}</p>
        </div>
      </section>
    </div>
  )
}
