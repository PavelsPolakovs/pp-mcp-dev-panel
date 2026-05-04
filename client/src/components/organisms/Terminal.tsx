import { useEffect, useRef } from 'react'
import { useStore, LogEntry } from '@store/useStore'

export default function Terminal() {
  const logs = useStore((s: { logs: LogEntry[] }) => s.logs)
  const clearLogs = useStore((s: { clearLogs: () => void }) => s.clearLogs)
  const bottomRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [logs])

  const getClass = (log: LogEntry) => {
    if (log.type === 'task_start') return 'text-cyan-700 dark:text-cyan-400 font-medium'
    if (log.type === 'task_end' && log.status === 'success')
      return 'text-emerald-700 dark:text-emerald-400 font-semibold'
    if (log.type === 'task_end' && log.status === 'error')
      return 'text-rose-700 dark:text-rose-400 font-semibold'
    if (log.type === 'task_end' && log.status === 'warning')
      return 'text-amber-700 dark:text-amber-400 font-semibold'
    return 'text-zinc-700 dark:text-zinc-300'
  }

  return (
    <div className="flex flex-col rounded-xl border border-zinc-300 dark:border-zinc-800 overflow-hidden">
      <div className="flex items-center justify-between px-4 py-2.5 bg-zinc-100 dark:bg-zinc-900 border-b border-zinc-300 dark:border-zinc-800">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-zinc-300 dark:bg-zinc-700" />
          <div className="w-3 h-3 rounded-full bg-zinc-300 dark:bg-zinc-700" />
          <div className="w-3 h-3 rounded-full bg-zinc-300 dark:bg-zinc-700" />
          <span className="ml-2 text-xs text-zinc-500 dark:text-zinc-400 font-mono uppercase tracking-wider">
            Output
          </span>
        </div>
        <button
          onClick={clearLogs}
          className="text-xs text-zinc-400 hover:text-zinc-700 dark:text-zinc-600 dark:hover:text-zinc-300 transition-colors"
        >
          Clear
        </button>
      </div>
      <div className="flex-1 overflow-y-auto bg-zinc-50 dark:bg-zinc-950 p-4 font-mono text-xs leading-6 min-h-72 max-h-96 text-zinc-900 dark:text-zinc-200">
        {logs.length === 0 ? (
          <span className="text-zinc-400 dark:text-zinc-600">
            No output yet. Run a command to see results here.
          </span>
        ) : (
          logs.map((log: LogEntry, i: number) => (
            <div key={i} className={`${getClass(log)} whitespace-pre-wrap`}>
              {log.message || log.data}
            </div>
          ))
        )}
        <div ref={bottomRef} />
      </div>
    </div>
  )
}
