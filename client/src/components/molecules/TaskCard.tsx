import { ClipboardList } from 'lucide-react'
import { useTranslation } from 'react-i18next'

export interface TaskCardProps {
  onClick: () => void
}

export default function TaskCard({ onClick }: TaskCardProps) {
  const { t } = useTranslation()

  return (
    <button
      type="button"
      onClick={onClick}
      className="group flex items-center gap-4 w-full px-4 py-3.5 rounded-xl border border-zinc-300 bg-white hover:bg-zinc-50 text-zinc-900 cursor-pointer dark:border-zinc-800 dark:bg-zinc-900 dark:hover:bg-zinc-800 dark:text-zinc-300 transition-all duration-150"
    >
      <div className="flex-shrink-0 text-purple-500">
        <ClipboardList size={18} />
      </div>
      <div className="text-left flex-1 min-w-0">
        <div className="text-sm font-bold leading-tight text-zinc-900 dark:text-zinc-100">
          {t('taskPlan.cardTitle')}
        </div>
        <div className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5 truncate">
          {t('taskPlan.cardDescription')}
        </div>
      </div>
    </button>
  )
}