import { useTranslation } from 'react-i18next'

export type StatusBadgeVariant = 'idle' | 'running' | 'done' | 'locked' | 'error'

const VARIANT_CLASSES: Record<StatusBadgeVariant, string> = {
  idle: 'border-zinc-300 bg-zinc-50 text-zinc-600 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-300',
  running:
    'border-cyan-300 bg-cyan-50 text-cyan-700 dark:border-cyan-800 dark:bg-cyan-950/40 dark:text-cyan-300',
  done: 'border-emerald-300 bg-emerald-50 text-emerald-700 dark:border-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300',
  locked:
    'border-zinc-200 bg-zinc-100 text-zinc-500 dark:border-zinc-800 dark:bg-zinc-900/60 dark:text-zinc-500',
  error:
    'border-rose-300 bg-rose-50 text-rose-700 dark:border-rose-800 dark:bg-rose-950/40 dark:text-rose-300'
}

const VARIANT_DOT: Record<StatusBadgeVariant, string> = {
  idle: 'bg-zinc-400 dark:bg-zinc-600',
  running: 'bg-cyan-500 dark:bg-cyan-400',
  done: 'bg-emerald-500 dark:bg-emerald-400',
  locked: 'bg-zinc-300 dark:bg-zinc-700',
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
