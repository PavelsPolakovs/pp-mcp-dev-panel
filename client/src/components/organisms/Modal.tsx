import { useEffect, useRef, useState } from 'react'
import type { ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import { Upload, X } from 'lucide-react'
import { Button } from '@atoms'
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
      <div className="flex items-start justify-between gap-4 px-5 py-4 border-b border-divider">
        <div>
          <h2 className="text-base font-semibold text-text tracking-tight">{t(titleKey)}</h2>
          {descriptionKey && <p className="text-xs text-text-muted mt-0.5">{t(descriptionKey)}</p>}
        </div>
        <button
          type="button"
          onClick={() => void onCancel()}
          aria-label={t('workflows.modal.close')}
          className="text-text-faint hover:text-text transition-colors"
        >
          <X size={18} />
        </button>
      </div>
      <div className="px-5 py-4 overflow-y-auto">{body}</div>
      <div className="flex items-center justify-end gap-2 px-5 py-3 border-t border-divider">
        <Button intent="secondary" size="lg" onClick={() => void onCancel()}>
          {t('workflows.modal.cancel')}
        </Button>
        <Button intent="primary" size="lg" onClick={() => void onConfirm()} disabled={!canConfirm}>
          {t('workflows.modal.confirm')}
        </Button>
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
          <p className="text-xs text-text-muted">{t('workflows.addPlan.browseHint')}</p>

          <div className="flex items-center gap-3">
            <Button intent="subtle" size="md" onClick={onBrowse}>
              <Upload size={14} />
              {t('workflows.addPlan.browseButton')}
            </Button>
            <span className="text-xs font-mono text-text-muted truncate">
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
            <label htmlFor="add-plan-textarea" className="text-xs font-medium text-text">
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
              className="w-full rounded-lg border border-border bg-surface-offset px-3 py-2 text-xs font-mono leading-6 text-text focus:outline-none focus:ring-2 focus:ring-primary"
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

function CreateBranchModal() {
  const { t } = useTranslation()
  const branchName = useStore((s) => s.branchName)
  const setBranchName = useStore((s) => s.setBranchName)
  const setStepStatus = useStore((s) => s.setStepStatus)
  const closeModal = useStore((s) => s.closeModal)
  const [draft, setDraft] = useState(branchName)

  const trimmed = draft.trim()

  return (
    <ModalChrome
      titleKey="workflows.createBranch.modalTitle"
      descriptionKey="workflows.createBranch.modalDescription"
      canConfirm={trimmed.length > 0}
      body={
        <div className="flex flex-col gap-2">
          <label htmlFor="create-branch-input" className="text-xs font-medium text-text">
            {t('workflows.createBranch.inputLabel')}
          </label>
          <input
            id="create-branch-input"
            type="text"
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            placeholder={t('workflows.createBranch.inputPlaceholder')}
            className="w-full rounded-lg border border-border bg-surface-offset px-3 py-2 text-xs font-mono leading-6 text-text focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
      }
      onConfirm={() => {
        setBranchName(trimmed)
        setStepStatus('create-branch', 'done')
        closeModal()
      }}
      onCancel={() => {
        closeModal()
      }}
    />
  )
}

function ModalBody({ id }: { id: string }) {
  if (id === 'add-plan') return <AddPlanModal />
  if (id === 'create-branch') return <CreateBranchModal />
  return null
}

export default function Modal() {
  const activeModal = useStore((s) => s.activeModal)
  if (!activeModal) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div className="w-full max-w-2xl rounded-2xl border border-border bg-surface shadow-xl flex flex-col max-h-[80vh]">
        <ModalBody id={activeModal} />
      </div>
    </div>
  )
}
