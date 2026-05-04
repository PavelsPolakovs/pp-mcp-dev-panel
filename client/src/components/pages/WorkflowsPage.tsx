import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { ClipboardList, GitBranch, Workflow } from 'lucide-react'
import { WorkflowCard, PlanFileModal } from '@molecules'
import { postEvent } from '@ws/events'

export default function WorkflowsPage() {
  const { t } = useTranslation()
  const [planOpen, setPlanOpen] = useState(false)

  const onAddPlanClick = () => {
    void postEvent('plan_modal_open')
    setPlanOpen(true)
  }

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

      <div className="space-y-2">
        <WorkflowCard
          icon={ClipboardList}
          iconColorClass="text-purple-500"
          title={t('workflows.addPlan.title')}
          description={t('workflows.addPlan.description')}
          onClick={onAddPlanClick}
        />
        <WorkflowCard
          icon={GitBranch}
          iconColorClass="text-emerald-500"
          title={t('workflows.createBranch.title')}
          description={t('workflows.createBranch.description')}
          hint={t('workflows.createBranch.comingSoon')}
          disabled
        />
      </div>

      {planOpen && <PlanFileModal onClose={() => setPlanOpen(false)} />}
    </div>
  )
}