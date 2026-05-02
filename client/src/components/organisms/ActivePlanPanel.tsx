import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { ClipboardList, ChevronDown, ChevronRight, X } from 'lucide-react'
import { useSessionStore } from '@store/useSessionStore'

function relativeTime(iso: string | null): string {
  if (!iso) return ''
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

export default function ActivePlanPanel() {
  const { t } = useTranslation()
  const planFetched = useSessionStore((s) => s.planFetched)
  const planFileName = useSessionStore((s) => s.planFileName)
  const planContent = useSessionStore((s) => s.planContent)
  const startedAt = useSessionStore((s) => s.startedAt)
  const resetPlan = useSessionStore((s) => s.resetPlan)
  const [open, setOpen] = useState(false)

  if (!planFetched || !planFileName) return null

  return (
    <section className="rounded-xl border border-cyan-200 bg-cyan-50/50 dark:border-cyan-900/50 dark:bg-cyan-950/20">
      <header className="flex items-center gap-3 px-4 py-3">
        <div className="flex-shrink-0 text-cyan-600 dark:text-cyan-400">
          <ClipboardList size={16} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-[10px] uppercase tracking-wider text-cyan-700 dark:text-cyan-400 font-semibold">
              {t('taskPlan.activePlan.title')}
            </span>
            <span className="text-sm font-mono text-zinc-900 dark:text-zinc-100 truncate">
              {planFileName}
            </span>
          </div>
          <div className="text-[11px] text-zinc-500 dark:text-zinc-400 mt-0.5">
            {t('taskPlan.activePlan.loaded')} · {relativeTime(startedAt)}
          </div>
        </div>
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="flex items-center gap-1 text-xs px-2 py-1 rounded text-cyan-700 hover:bg-cyan-100 dark:text-cyan-400 dark:hover:bg-cyan-900/40 transition-colors cursor-pointer"
        >
          {open ? <ChevronDown size={12} /> : <ChevronRight size={12} />}
          {open ? t('taskPlan.activePlan.hide') : t('taskPlan.activePlan.show')}
        </button>
        <button
          type="button"
          onClick={resetPlan}
          aria-label={t('taskPlan.activePlan.clear')}
          title={t('taskPlan.activePlan.clear')}
          className="text-zinc-400 hover:text-rose-500 dark:text-zinc-500 dark:hover:text-rose-400 transition-colors cursor-pointer"
        >
          <X size={14} />
        </button>
      </header>
      {open && planContent && (
        <pre className="mx-4 mb-4 max-h-80 overflow-auto rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 p-3 font-mono text-xs leading-6 text-zinc-800 dark:text-zinc-200 whitespace-pre-wrap break-words">
          {planContent}
        </pre>
      )}
    </section>
  )
}
