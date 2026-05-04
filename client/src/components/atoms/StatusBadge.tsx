import { useTranslation } from 'react-i18next'

export type StatusBadgeVariant = 'idle' | 'running' | 'done' | 'locked' | 'error'

const VARIANT_CLASSES: Record<StatusBadgeVariant, string> = {
  idle: 'border-divider bg-surface-offset text-text-muted',
  running: 'border-primary bg-primary-highlight text-primary',
  done: 'border-emerald-300 bg-emerald-50 text-emerald-700 dark:border-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300',
  locked: 'border-divider bg-surface-dynamic text-text-faint',
  error:
    'border-rose-300 bg-rose-50 text-rose-700 dark:border-rose-800 dark:bg-rose-950/40 dark:text-rose-300'
}

const VARIANT_DOT: Record<StatusBadgeVariant, string> = {
  idle: 'bg-text-faint',
  running: 'bg-primary',
  done: 'bg-emerald-500 dark:bg-emerald-400',
  locked: 'bg-text-faint',
  error: 'bg-rose-500 dark:bg-rose-400'
}

export interface StatusBadgeProps {
  variant: StatusBadgeVariant
}

export default function StatusBadge({ variant }: StatusBadgeProps) {
  const { t } = useTranslation()
  return (
    <span
      className={`inline-flex items-center gap-1.5 text-[10px] font-medium px-2 py-0.5 rounded-full border ${VARIANT_CLASSES[variant]}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${VARIANT_DOT[variant]}`} />
      {t(`workflows.badge.${variant}`)}
    </span>
  )
}
