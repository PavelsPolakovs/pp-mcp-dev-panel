import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { LayoutDashboard, Workflow } from 'lucide-react'
import { BaseCard } from '@atoms'

export default function DashboardPage() {
  const { t } = useTranslation()
  const navigate = useNavigate()

  return (
    <div className="flex flex-col gap-6">
      <div>
        <div className="flex items-center gap-2.5 mb-1">
          <LayoutDashboard size={20} className="text-cyan-600 dark:text-cyan-400" />
          <h1 className="text-base font-semibold text-zinc-900 dark:text-zinc-100 tracking-tight">
            {t('dashboard.title')}
          </h1>
        </div>
        <p className="text-xs text-zinc-500 dark:text-zinc-400">{t('dashboard.subtitle')}</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <BaseCard
          icon={Workflow}
          iconColorClass="text-cyan-500"
          title={t('dashboard.workflowsCard.title')}
          description={t('dashboard.workflowsCard.description')}
          ctaSlot={
            <button
              type="button"
              onClick={() => navigate('/workflows')}
              className="w-full px-3 py-2 rounded-lg text-xs font-medium bg-cyan-600 hover:bg-cyan-500 text-white cursor-pointer transition-colors"
            >
              {t('nav.items.workflows')}
            </button>
          }
        />
      </div>
    </div>
  )
}
