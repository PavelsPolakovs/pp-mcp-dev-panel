import React from 'react'
import { useTranslation } from 'react-i18next'
import { Terminal } from '@organisms'

export default function LogsPage() {
  const { t } = useTranslation()

  return (
    <div className="flex flex-col gap-4">
      <div>
        <h1 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">{t('logs.title')}</h1>
        <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-0.5">{t('logs.subtitle')}</p>
      </div>
      <Terminal />
    </div>
  )
}