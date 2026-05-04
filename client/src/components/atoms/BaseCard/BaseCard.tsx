import type { ComponentType, ReactNode } from 'react'
import { card } from './BaseCard.tv'

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
  const styles = card({ dimmed })
  return (
    <div title={tooltip} className={styles.root()}>
      <div className="flex items-start justify-between gap-2">
        <div className={styles.iconWrap({ className: dimmed ? '' : iconColorClass })}>
          <Icon size={20} />
        </div>
        {statusBadge}
      </div>
      <div className="flex flex-col gap-1 min-w-0">
        <div className={styles.title()}>{title}</div>
        <div className={styles.description()}>{description}</div>
      </div>
      {ctaSlot && <div className="mt-1">{ctaSlot}</div>}
    </div>
  )
}
