import { useEffect, useRef, useState } from 'react'
import type { ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import { Upload, X } from 'lucide-react'
import { useStore } from '@store/useStore'
import { postEvent } from '@ws/events'

interface ModalChromeProps {
  titleKey: string
  descriptionKey?: string
  body: ReactNode
  canConfirm: boolean
  onConfirm: () => Promise<void> | void
  onCancel: () => Promise<void> | void
}

function ModalChrome({
  titleKey,
  descriptionKey,
  body,
  canConfirm,
  onConfirm,
  onCancel
}: ModalChromeProps) {
  const { t } = useTranslation()
  return (
    <>
      <div className="flex items-start justify-between gap-4 px-5 py-4 border-b border-zinc-200 dark:border-zinc-800">
        <div>
          <h2 className="text-base font-semibold text-zinc-900 dark:text-zinc-100 tracking-tight">
            {t(titleKey)}
          </h2>
          {descriptionKey && (
            <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">{t(descriptionKey)}</p>
          )}
        </div>
        <button
          type="button"
          onClick={() => void onCancel()}
          aria-label={t('workflows.modal.close')}
          className="text-zinc-400 hover:text-zinc-700 dark:text-zinc-500 dark:hover:text-zinc-200 transition-colors"
        >
          <X size={18} />
        </button>
      </div>
      <div className="px-5 py-4 overflow-y-auto">{body}</div>
      <div className="flex items-center justify-end gap-2 px-5 py-3 border-t border-zinc-200 dark:border-zinc-800">
        <button
          type="button"
          onClick={() => void onCancel()}
          className="px-4 py-2 rounded-lg text-xs font-medium border border-zinc-300 text-zinc-700 hover:bg-zinc-100 dark:border-zinc-700 dark:text-zinc-200 dark:hover:bg-zinc-800 transition-colors"
        >
          {t('workflows.modal.cancel')}
        </button>
        <button
          type="button"
          onClick={() => void onConfirm()}
          disabled={!canConfirm}
          className={`px-4 py-2 rounded-lg text-xs font-medium transition-colors ${
            canConfirm
              ? 'bg-cyan-600 hover:bg-cyan-500 text-white cursor-pointer'
              : 'bg-zinc-200 text-zinc-400 cursor-not-allowed dark:bg-zinc-800 dark:text-zinc-600'
          }`}
        >
          {t('workflows.modal.confirm')}
        </button>
      </div>
    </>
  )
}

function AddPlanModal() {
  const { t } = useTranslation()
  const planContent = useStore((s) => s.planContent)
  const setPlanContent = useStore((s) => s.setPlanContent)
  const setStepStatus = useStore((s) => s.setStepStatus)
  const closeModal = useStore((s) => s.closeModal)
  const [draft, setDraft] = useState(planContent)
  const [fileName, setFileName] = useState<string | null>(null)
  const inputRef = useRef<HTMLInputElement | null>(null)

  useEffect(() => {
    void postEvent('plan_modal_open')
  }, [])

  const onBrowse = () => inputRef.current?.click()

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    if (!/\.md$/i.test(file.name)) {
      e.target.value = ''
      return
    }
    const reader = new FileReader()
    reader.onload = () => {
      const text = typeof reader.result === 'string' ? reader.result : ''
      setFileName(file.name)
      setDraft(text)
      void postEvent('plan_file_selected', { fileName: file.name, size: text.length })
    }
    reader.readAsText(file)
    e.target.value = ''
  }

  const trimmed = draft.trim()
  const confirmFileName = fileName ?? 'plan.md'

  return (
    <ModalChrome
      titleKey="workflows.addPlan.modalTitle"
      descriptionKey="workflows.addPlan.modalDescription"
      canConfirm={trimmed.length > 0}
      body={
        <div className="flex flex-col gap-3">
          <p className="text-xs text-zinc-500 dark:text-zinc-400">
            {t('workflows.addPlan.browseHint')}
          </p>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onBrowse}
              className="inline-flex items-center gap-2 px-3 py-2 rounded-lg border border-zinc-300 bg-zinc-50 hover:bg-zinc-100 text-zinc-900 dark:border-zinc-700 dark:bg-zinc-900 dark:hover:bg-zinc-800 dark:text-zinc-200 text-xs font-medium transition-colors"
            >
              <Upload size={14} />
              {t('workflows.addPlan.browseButton')}
            </button>
            <span className="text-xs font-mono text-zinc-500 dark:text-zinc-400 truncate">
              {fileName ?? t('workflows.addPlan.noFileSelected')}
            </span>
            <input
              ref={inputRef}
              type="file"
              accept=".md,text/markdown"
              onChange={onFileChange}
              className="hidden"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label
              htmlFor="add-plan-textarea"
              className="text-xs font-medium text-zinc-700 dark:text-zinc-300"
            >
              {t('workflows.addPlan.inputLabel')}
            </label>
            <textarea
              id="add-plan-textarea"
              value={draft}
              onChange={(e) => {
                setDraft(e.target.value)
                if (fileName) setFileName(null)
              }}
              placeholder={t('workflows.addPlan.inputPlaceholder')}
              rows={10}
              className="w-full rounded-lg border border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-900 px-3 py-2 text-xs font-mono leading-6 text-zinc-800 dark:text-zinc-200 focus:outline-none focus:ring-2 focus:ring-cyan-500"
            />
          </div>
        </div>
      }
      onConfirm={async () => {
        setPlanContent(draft)
        setStepStatus('add-plan', 'done')
        await postEvent('plan_confirmed', { fileName: confirmFileName, content: draft })
        closeModal()
      }}
      onCancel={async () => {
        await postEvent('plan_cancelled')
        closeModal()
      }}
    />
  )
}

function ModalBody({ id }: { id: string }) {
  if (id === 'add-plan') return <AddPlanModal />
  return null
}

export default function Modal() {
  const activeModal = useStore((s) => s.activeModal)
  if (!activeModal) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div className="w-full max-w-2xl rounded-2xl border border-zinc-300 bg-white dark:border-zinc-800 dark:bg-zinc-950 shadow-xl flex flex-col max-h-[80vh]">
        <ModalBody id={activeModal} />
      </div>
    </div>
  )
}
