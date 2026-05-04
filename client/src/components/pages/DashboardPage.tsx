import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { LayoutDashboard, Workflow } from 'lucide-react'
import { BaseCard, Button } from '@atoms'

export default function DashboardPage() {
  const { t } = useTranslation()
  const navigate = useNavigate()

  return (
    <div className="flex flex-col gap-6">
      <div>
        <div className="flex items-center gap-2.5 mb-1">
          <LayoutDashboard size={20} className="text-primary" />
          <h1 className="text-base font-semibold text-text tracking-tight">
            {t('dashboard.title')}
          </h1>
        </div>
        <p className="text-xs text-text-muted">{t('dashboard.subtitle')}</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <BaseCard
          icon={Workflow}
          iconColorClass="text-primary"
          title={t('dashboard.workflowsCard.title')}
          description={t('dashboard.workflowsCard.description')}
          ctaSlot={
            <Button intent="primary" fullWidth onClick={() => navigate('/workflows')}>
              {t('nav.items.workflows')}
            </Button>
          }
        />
      </div>
    </div>
  )
}
