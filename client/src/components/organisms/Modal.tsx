import { useEffect, useState } from 'react'
import type { ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import { X } from 'lucide-react'
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

  useEffect(() => {
    void postEvent('plan_modal_open')
  }, [])

  const trimmed = draft.trim()

  return (
    <ModalChrome
      titleKey="workflows.addPlan.modalTitle"
      descriptionKey="workflows.addPlan.modalDescription"
      canConfirm={trimmed.length > 0}
      body={
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
            onChange={(e) => setDraft(e.target.value)}
            placeholder={t('workflows.addPlan.inputPlaceholder')}
            rows={10}
            className="w-full rounded-lg border border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-900 px-3 py-2 text-xs font-mono leading-6 text-zinc-800 dark:text-zinc-200 focus:outline-none focus:ring-2 focus:ring-cyan-500"
          />
        </div>
      }
      onConfirm={async () => {
        setPlanContent(draft)
        setStepStatus('add-plan', 'done')
        await postEvent('plan_confirmed', { fileName: 'plan.md', content: draft })
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
