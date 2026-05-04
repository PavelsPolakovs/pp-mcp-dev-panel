import { useState } from 'react'
import { LayoutDashboard } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { TaskPlanCard } from '@molecules'
import { Terminal, TaskPlanPanel } from '@organisms'

export default function DashboardPage() {
  const { t } = useTranslation()
  const [showTaskPanel, setShowTaskPanel] = useState(false)

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

      <div className="space-y-2">
        <TaskPlanCard onClick={() => setShowTaskPanel(true)} />
      </div>

      <div>
        <h2 className="text-xs text-zinc-500 dark:text-zinc-400 uppercase tracking-wider font-medium mb-2">
          {t('dashboard.output')}
        </h2>
        <Terminal />
      </div>

      {showTaskPanel && <TaskPlanPanel onClose={() => setShowTaskPanel(false)} />}
    </div>
  )
}