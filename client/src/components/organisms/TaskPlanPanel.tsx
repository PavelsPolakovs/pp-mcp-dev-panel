import { useRef, useState } from 'react'
import { Upload, X } from 'lucide-react'
import { useTranslation } from 'react-i18next'

export interface TaskPlanPanelProps {
  onClose: () => void
}

export default function TaskPlanPanel({ onClose }: TaskPlanPanelProps) {
  const { t } = useTranslation()
  const inputRef = useRef<HTMLInputElement | null>(null)
  const [fileName, setFileName] = useState<string | null>(null)
  const [content, setContent] = useState<string>('')

  const onBrowse = () => {
    inputRef.current?.click()
  }

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setFileName(file.name)
    const reader = new FileReader()
    reader.onload = () => {
      setContent(typeof reader.result === 'string' ? reader.result : '')
    }
    reader.readAsText(file)
  }

  const onConfirm = () => {
    if (!fileName) return
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div className="w-full max-w-2xl rounded-2xl border border-zinc-300 bg-white dark:border-zinc-800 dark:bg-zinc-950 shadow-xl flex flex-col max-h-[80vh]">
        <div className="flex items-start justify-between gap-4 px-5 py-4 border-b border-zinc-200 dark:border-zinc-800">
          <div>
            <h2 className="text-base font-semibold text-zinc-900 dark:text-zinc-100 tracking-tight">
              {t('taskPlan.panelTitle')}
            </h2>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
              {t('taskPlan.panelDescription')}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label={t('taskPlan.closeButton')}
            className="text-zinc-400 hover:text-zinc-700 dark:text-zinc-500 dark:hover:text-zinc-200 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        <div className="flex flex-col gap-3 px-5 py-4 overflow-hidden">
          <p className="text-xs text-zinc-500 dark:text-zinc-400">
            {t('taskPlan.browseHint')}
          </p>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onBrowse}
              className="inline-flex items-center gap-2 px-3 py-2 rounded-lg border border-zinc-300 bg-zinc-50 hover:bg-zinc-100 text-zinc-900 dark:border-zinc-700 dark:bg-zinc-900 dark:hover:bg-zinc-800 dark:text-zinc-200 text-xs font-medium transition-colors"
            >
              <Upload size={14} />
              {t('taskPlan.browseButton')}
            </button>
            <span className="text-xs font-mono text-zinc-500 dark:text-zinc-400 truncate">
              {fileName ?? t('taskPlan.noFileSelected')}
            </span>
            <input
              ref={inputRef}
              type="file"
              accept=".md,.json"
              onChange={onFileChange}
              className="hidden"
            />
          </div>

          <div className="flex-1 min-h-40 max-h-80 overflow-y-auto rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 p-3 font-mono text-xs leading-6 text-zinc-800 dark:text-zinc-200 whitespace-pre-wrap">
            {content}
          </div>
        </div>

        <div className="flex items-center justify-end gap-2 px-5 py-3 border-t border-zinc-200 dark:border-zinc-800">
          <button
            type="button"
            onClick={onConfirm}
            disabled={!fileName}
            className={`px-4 py-2 rounded-lg text-xs font-medium transition-colors ${
              fileName
                ? 'bg-cyan-600 hover:bg-cyan-500 text-white cursor-pointer'
                : 'bg-zinc-200 text-zinc-400 cursor-not-allowed dark:bg-zinc-800 dark:text-zinc-600'
            }`}
          >
            {t('taskPlan.confirmButton')}
          </button>
        </div>
      </div>
    </div>
  )
}