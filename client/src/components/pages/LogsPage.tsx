import React from 'react'
import { ScrollText } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Terminal } from '@organisms'

export default function LogsPage() {
  const { t } = useTranslation()

  return (
    <div className="flex flex-col gap-4">
      <div>
        <div className="flex items-center gap-2.5 mb-1">
          <ScrollText size={20} className="text-cyan-600 dark:text-cyan-400" />
          <h1 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">{t('logs.title')}</h1>
        </div>
        <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-0.5">{t('logs.subtitle')}</p>
      </div>
      <Terminal />
    </div>
  )
}