import { useTranslation } from 'react-i18next'
import { Workflow } from 'lucide-react'
import { Drawer, Modal, WorkflowBoard } from '@organisms'

export default function WorkflowsPage() {
  const { t } = useTranslation()

  return (
    <div className="flex flex-col gap-6">
      <div>
        <div className="flex items-center gap-2.5 mb-1">
          <Workflow size={20} className="text-cyan-600 dark:text-cyan-400" />
          <h1 className="text-base font-semibold text-zinc-900 dark:text-zinc-100 tracking-tight">
            {t('workflows.title')}
          </h1>
        </div>
        <p className="text-xs text-zinc-500 dark:text-zinc-400">{t('workflows.subtitle')}</p>
      </div>

      <WorkflowBoard />

      <Drawer />
      <Modal />
    </div>
  )
}
