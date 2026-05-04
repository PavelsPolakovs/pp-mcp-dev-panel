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
          <Settings size={20} className="text-primary" />
          <h1 className="text-lg font-semibold text-text">{t('settings.title')}</h1>
        </div>
        <p className="text-sm text-text-muted mt-0.5">{t('settings.subtitle')}</p>
      </div>

      <section className="flex flex-col gap-3">
        <h2 className="text-xs font-semibold uppercase tracking-wider text-text-faint">
          {t('settings.appearance')}
        </h2>
        <div className="bg-surface border border-divider rounded-lg p-4 flex items-center justify-between">
          <span className="text-sm font-medium text-text">{t('settings.colorScheme')}</span>
          <div className="flex gap-2">
            <button
              onClick={() => setTheme('light')}
              className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                theme === 'light'
                  ? 'bg-text text-text-inverse'
                  : 'bg-surface-offset text-text-muted hover:bg-surface-dynamic'
              }`}
            >
              {t('settings.light')}
            </button>
            <button
              onClick={() => setTheme('dark')}
              className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                theme === 'dark'
                  ? 'bg-text text-text-inverse'
                  : 'bg-surface-offset text-text-muted hover:bg-surface-dynamic'
              }`}
            >
              {t('settings.dark')}
            </button>
          </div>
        </div>
      </section>

      <section className="flex flex-col gap-3">
        <h2 className="text-xs font-semibold uppercase tracking-wider text-text-faint">
          {t('settings.project')}
        </h2>
        <div className="bg-surface border border-divider rounded-lg p-4 flex flex-col gap-2">
          <label
            htmlFor="settings-project-dir"
            className="text-sm font-medium text-text flex items-center gap-1.5"
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
            className="w-full bg-surface-offset border border-border rounded-lg px-3 py-2 text-xs font-mono text-text placeholder:text-text-faint focus:outline-none focus:border-primary transition-colors"
          />
          <p className="text-xs text-text-faint">{t('settings.projectDirHint')}</p>
        </div>
      </section>
    </div>
  )
}
