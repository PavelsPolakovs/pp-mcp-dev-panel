import React from 'react'
import type { LucideIcon } from 'lucide-react'
import { useTranslation } from 'react-i18next'

interface PlaceholderPageProps {
  titleKey: string
  icon?: LucideIcon
}

export default function PlaceholderPage({ titleKey, icon: Icon }: PlaceholderPageProps) {
  const { t } = useTranslation()

  return (
    <div className="flex flex-col gap-4">
      <div>
        <div className="flex items-center gap-2.5 mb-1">
          {Icon && <Icon size={20} className="text-cyan-600 dark:text-cyan-400" />}
          <h1 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">{t(titleKey)}</h1>
        </div>
        <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-0.5">{t('page.comingSoon')}</p>
      </div>
      <div className="flex items-center justify-center h-40 rounded-xl border border-dashed border-zinc-300 dark:border-zinc-700 text-zinc-400 dark:text-zinc-600 text-sm">
        {t('page.comingSoonSubtitle')}
      </div>
    </div>
  )
}