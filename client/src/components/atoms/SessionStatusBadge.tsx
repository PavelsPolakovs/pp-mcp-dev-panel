import { useTranslation } from 'react-i18next'
import { useSessionStore } from '@store/useSessionStore'

const STATUS_DOT: Record<string, string> = {
  active: 'bg-emerald-500 dark:bg-emerald-400',
  idle: 'bg-zinc-400 dark:bg-zinc-600',
  ended: 'bg-rose-500 dark:bg-rose-400'
}

export default function SessionStatusBadge() {
  const { t } = useTranslation()
  const status = useSessionStore((s) => s.status)
  const sessionId = useSessionStore((s) => s.sessionId)
  const userId = useSessionStore((s) => s.userId)
  const startedAt = useSessionStore((s) => s.startedAt)

  const shortId = sessionId ? `#${sessionId.slice(0, 8)}` : t('session.none')
  const tooltip = [
    `${t('session.tooltip.status')}: ${t(`session.status.${status}`)}`,
    sessionId ? `${t('session.tooltip.id')}: ${sessionId}` : null,
    userId ? `${t('session.tooltip.user')}: ${userId}` : null,
    startedAt ? `${t('session.tooltip.startedAt')}: ${new Date(startedAt).toLocaleString()}` : null
  ]
    .filter(Boolean)
    .join('\n')

  return (
    <div
      className="flex items-center gap-1.5 text-[11px] px-2 py-1 rounded-md border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-600 dark:text-zinc-300 cursor-default"
      title={tooltip}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${STATUS_DOT[status] ?? STATUS_DOT.idle}`} />
      <span className="font-mono">{shortId}</span>
    </div>
  )
}
