import { Loader2 } from 'lucide-react'
import { useStore } from '@store/useStore'
import React from 'react'

export interface CommandButtonProps {
  tool: string
  label: string
  description: string
  icon: React.ComponentType<{ size?: number | string }>
  colorClass: string
}

export default function CommandButton({
  tool,
  label,
  description,
  icon: Icon,
  colorClass
}: CommandButtonProps) {
  const activeTask = useStore((s: { activeTask: string | null }) => s.activeTask)
  const projectDir = useStore((s: { projectDir: string }) => s.projectDir)
  const isRunning = activeTask === tool
  const isDisabled = !!activeTask && !isRunning

  const run = async () => {
    if (activeTask) return
    useStore.getState().setActiveTask(tool)
    useStore.getState().clearLogs()
    try {
      await fetch('/api/run-tool', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tool, projectDir: projectDir || undefined })
      })
    } catch (err: unknown) {
      let message = 'Unknown error'
      if (
        err &&
        typeof err === 'object' &&
        'message' in err &&
        typeof (err as { message?: unknown }).message === 'string'
      ) {
        message = (err as { message: string }).message
      }
      useStore.getState().addLog({
        type: 'task_end',
        status: 'error',
        message: `Connection error: ${message}`
      })
    } finally {
      useStore.getState().setActiveTask(null)
    }
  }

  return (
    <button
      onClick={run}
      disabled={isDisabled}
      aria-busy={isRunning}
      className={`
        group flex items-center gap-4 w-full px-4 py-3.5 rounded-xl border transition-all duration-150
        ${
          isRunning
            ? 'border-cyan-400 bg-cyan-100 text-cyan-700 dark:border-cyan-500/50 dark:bg-cyan-500/5 dark:text-cyan-300 cursor-wait'
            : isDisabled
              ? 'border-zinc-300 bg-zinc-100 text-zinc-400 cursor-not-allowed dark:border-zinc-800 dark:bg-zinc-900/40 dark:text-zinc-600'
              : 'border-zinc-300 bg-white hover:bg-zinc-50 text-zinc-900 cursor-pointer dark:border-zinc-800 dark:bg-zinc-900 dark:hover:bg-zinc-800 dark:text-zinc-300'
        }
      `}
    >
      <div
        className={`flex-shrink-0 ${isRunning ? 'text-cyan-500 dark:text-cyan-400' : isDisabled ? 'text-zinc-400 dark:text-zinc-700' : colorClass}`}
      >
        {isRunning ? <Loader2 size={18} className="animate-spin" /> : <Icon size={18} />}
      </div>
      <div className="text-left flex-1 min-w-0">
        <div className="text-sm font-medium leading-tight text-zinc-900 dark:text-zinc-100">
          {label}
        </div>
        <div className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5 font-mono truncate">
          {description}
        </div>
      </div>
      {isRunning && (
        <span className="text-xs text-cyan-700 dark:text-cyan-500 animate-pulse flex-shrink-0">
          running…
        </span>
      )}
    </button>
  )
}
