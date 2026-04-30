import React from 'react'
import { useTranslation } from 'react-i18next'

interface PlaceholderPageProps {
  titleKey: string
}

export default function PlaceholderPage({ titleKey }: PlaceholderPageProps) {
  const { t } = useTranslation()

  return (
    <div className="flex flex-col gap-4">
      <div>
        <h1 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">{t(titleKey)}</h1>
        <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-0.5">{t('page.comingSoon')}</p>
      </div>
      <div className="flex items-center justify-center h-40 rounded-xl border border-dashed border-zinc-300 dark:border-zinc-700 text-zinc-400 dark:text-zinc-600 text-sm">
        {t('page.comingSoonSubtitle')}
      </div>
    </div>
  )
}