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
          {Icon && <Icon size={20} className="text-primary" />}
          <h1 className="text-lg font-semibold text-text">{t(titleKey)}</h1>
        </div>
        <p className="text-sm text-text-muted mt-0.5">{t('page.comingSoon')}</p>
      </div>
      <div className="flex items-center justify-center h-40 rounded-xl border border-dashed border-border text-text-faint text-sm">
        {t('page.comingSoonSubtitle')}
      </div>
    </div>
  )
}
