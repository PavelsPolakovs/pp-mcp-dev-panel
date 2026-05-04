import type { ComponentType, ReactNode } from 'react'

export interface BaseCardProps {
  icon: ComponentType<{ size?: number | string }>
  iconColorClass: string
  title: string
  description: string
  statusBadge?: ReactNode
  ctaSlot?: ReactNode
  dimmed?: boolean
  tooltip?: string
}

export default function BaseCard({
  icon: Icon,
  iconColorClass,
  title,
  description,
  statusBadge,
  ctaSlot,
  dimmed = false,
  tooltip
}: BaseCardProps) {
  return (
    <div
      title={tooltip}
      className={`flex flex-col gap-3 p-4 rounded-xl border bg-white dark:bg-zinc-900 shadow-sm transition-opacity ${
        dimmed
          ? 'opacity-60 border-zinc-200 dark:border-zinc-800'
          : 'border-zinc-300 dark:border-zinc-800'
      }`}
    >
      <div className="flex items-start justify-between gap-2">
        <div
          className={`flex-shrink-0 ${dimmed ? 'text-zinc-400 dark:text-zinc-700' : iconColorClass}`}
        >
          <Icon size={20} />
        </div>
        {statusBadge}
      </div>
      <div className="flex flex-col gap-1 min-w-0">
        <div
          className={`text-sm font-bold leading-tight ${
            dimmed ? 'text-zinc-500 dark:text-zinc-500' : 'text-zinc-900 dark:text-zinc-100'
          }`}
        >
          {title}
        </div>
        <div
          className={`text-xs ${
            dimmed ? 'text-zinc-400 dark:text-zinc-600' : 'text-zinc-500 dark:text-zinc-400'
          }`}
        >
          {description}
        </div>
      </div>
      {ctaSlot && <div className="mt-1">{ctaSlot}</div>}
    </div>
  )
}
