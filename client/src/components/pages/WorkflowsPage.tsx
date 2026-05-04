import { useTranslation } from 'react-i18next'
import { Workflow } from 'lucide-react'
import { Drawer, Modal, WorkflowBoard } from '@organisms'

export default function WorkflowsPage() {
  const { t } = useTranslation()

  return (
    <div className="flex flex-col gap-6">
      <div>
        <div className="flex items-center gap-2.5 mb-1">
          <Workflow size={20} className="text-primary" />
          <h1 className="text-base font-semibold text-text tracking-tight">
            {t('workflows.title')}
          </h1>
        </div>
        <p className="text-xs text-text-muted">{t('workflows.subtitle')}</p>
      </div>

      <WorkflowBoard />

      <Drawer />
      <Modal />
    </div>
  )
}
