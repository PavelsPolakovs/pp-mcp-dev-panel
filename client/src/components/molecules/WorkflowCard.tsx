import type { ComponentType } from 'react'

export interface WorkflowCardProps {
  icon: ComponentType<{ size?: number | string }>
  iconColorClass: string
  title: string
  description: string
  hint?: string
  disabled?: boolean
  onClick?: () => void
}

export default function WorkflowCard({
  icon: Icon,
  iconColorClass,
  title,
  description,
  hint,
  disabled = false,
  onClick
}: WorkflowCardProps) {
  return (
    <button
      type="button"
      onClick={disabled ? undefined : onClick}
      disabled={disabled}
      className={`group flex items-start gap-4 w-full text-left px-4 py-3.5 rounded-xl border transition-all duration-150 ${
        disabled
          ? 'border-zinc-200 bg-zinc-50 cursor-not-allowed dark:border-zinc-800 dark:bg-zinc-900/40'
          : 'border-zinc-300 bg-white hover:bg-zinc-50 cursor-pointer dark:border-zinc-800 dark:bg-zinc-900 dark:hover:bg-zinc-800'
      }`}
    >
      <div className={`flex-shrink-0 mt-0.5 ${disabled ? 'text-zinc-400 dark:text-zinc-700' : iconColorClass}`}>
        <Icon size={18} />
      </div>
      <div className="flex-1 min-w-0">
        <div
          className={`text-sm font-bold leading-tight ${
            disabled ? 'text-zinc-400 dark:text-zinc-600' : 'text-zinc-900 dark:text-zinc-100'
          }`}
        >
          {title}
        </div>
        <div
          className={`text-xs mt-0.5 ${
            disabled ? 'text-zinc-400 dark:text-zinc-700' : 'text-zinc-500 dark:text-zinc-400'
          }`}
        >
          {description}
        </div>
        {hint && (
          <div className="text-[11px] mt-1.5 inline-block px-2 py-0.5 rounded-full border border-amber-300 bg-amber-50 text-amber-700 dark:border-amber-800 dark:bg-amber-950/40 dark:text-amber-400">
            {hint}
          </div>
        )}
      </div>
    </button>
  )
}