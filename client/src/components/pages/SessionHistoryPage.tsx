import { useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import {
  Clock,
  PlayCircle,
  CheckCircle2,
  XCircle,
  FileUp,
  Wrench,
  Settings,
  Compass,
  ChevronDown,
  ChevronRight
} from 'lucide-react'
import { useStore } from '@store/useStore'
import { useSessionStore } from '@store/useSessionStore'
import type { ActionRecord, ActionStatus, ActionType } from '@store/types'

const TYPE_ICON: Record<ActionType, typeof Wrench> = {
  tool_run: Wrench,
  file_upload: FileUp,
  settings_change: Settings,
  navigation: Compass
}

function StatusBadge({ status }: { status: ActionStatus }) {
  const cls =
    status === 'success'
      ? 'border-green-300 bg-green-100 text-green-700 dark:border-green-800 dark:bg-green-900/20 dark:text-green-400'
      : status === 'error'
        ? 'border-red-300 bg-red-100 text-red-700 dark:border-red-800 dark:bg-red-900/20 dark:text-red-400'
        : 'border-yellow-300 bg-yellow-100 text-yellow-700 dark:border-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400'
  const Icon = status === 'success' ? CheckCircle2 : status === 'error' ? XCircle : PlayCircle
  return (
    <span
      className={`inline-flex items-center gap-1 text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full border ${cls}`}
    >
      <Icon size={11} />
      {status}
    </span>
  )
}

function relativeTime(iso: string): string {
  const ms = Date.now() - new Date(iso).getTime()
  if (ms < 0) return new Date(iso).toLocaleTimeString()
  const s = Math.round(ms / 1000)
  if (s < 60) return `${s}s ago`
  const m = Math.round(s / 60)
  if (m < 60) return `${m}m ago`
  const h = Math.round(m / 60)
  if (h < 24) return `${h}h ago`
  return new Date(iso).toLocaleString()
}

function HistoryRow({ record }: { record: ActionRecord }) {
  const [open, setOpen] = useState(false)
  const Icon = TYPE_ICON[record.type]
  return (
    <li className="relative pl-10">
      <span className="absolute left-2 top-2 w-6 h-6 rounded-full border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 flex items-center justify-center text-zinc-500 dark:text-zinc-400">
        <Icon size={13} />
      </span>
      <div className="rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 px-3 py-2.5">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2 min-w-0">
            <button
              type="button"
              onClick={() => setOpen((v) => !v)}
              className="flex items-center gap-1 text-xs font-medium text-zinc-700 dark:text-zinc-200"
            >
              {open ? <ChevronDown size={12} /> : <ChevronRight size={12} />}
              <span className="truncate">{record.type}</span>
            </button>
            <StatusBadge status={record.status} />
          </div>
          <span className="text-[11px] text-zinc-500 dark:text-zinc-400 shrink-0">
            {relativeTime(record.timestamp)}
          </span>
        </div>
        {open && (
          <pre className="mt-2 max-h-60 overflow-auto rounded bg-zinc-50 dark:bg-zinc-900 px-2 py-1.5 text-[11px] font-mono text-zinc-700 dark:text-zinc-300 whitespace-pre-wrap break-words">
            {JSON.stringify(record.payload, null, 2)}
          </pre>
        )}
      </div>
    </li>
  )
}

export default function SessionHistoryPage() {
  const { t } = useTranslation()
  const userId = useStore((s) => s.user.id)
  const history = useSessionStore((s) => s.history)
  const loading = useSessionStore((s) => s.historyLoading)
  const fetchHistory = useSessionStore((s) => s.fetchHistory)

  useEffect(() => {
    void fetchHistory(userId)
  }, [userId, fetchHistory])

  const sorted = useMemo(
    () => [...history].sort((a, b) => (a.timestamp < b.timestamp ? 1 : -1)),
    [history]
  )

  return (
    <div className="flex flex-col gap-6">
      <div>
        <div className="flex items-center gap-2.5 mb-1">
          <Clock size={20} className="text-cyan-600 dark:text-cyan-400" />
          <h1 className="text-base font-semibold text-zinc-900 dark:text-zinc-100 tracking-tight">
            {t('history.title')}
          </h1>
        </div>
        <p className="text-xs text-zinc-500 dark:text-zinc-400">{t('history.subtitle')}</p>
      </div>

      {loading && history.length === 0 && (
        <p className="text-xs text-zinc-500 dark:text-zinc-400">{t('history.loading')}</p>
      )}

      {!loading && history.length === 0 && (
        <p className="text-xs text-zinc-500 dark:text-zinc-400">{t('history.empty')}</p>
      )}

      {sorted.length > 0 && (
        <ol className="relative flex flex-col gap-2 before:absolute before:left-[19px] before:top-1 before:bottom-1 before:w-px before:bg-zinc-200 dark:before:bg-zinc-800">
          {sorted.map((record) => (
            <HistoryRow key={record.id} record={record} />
          ))}
        </ol>
      )}
    </div>
  )
}
