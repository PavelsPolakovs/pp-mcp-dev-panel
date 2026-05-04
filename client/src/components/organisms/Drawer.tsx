import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { X } from 'lucide-react'
import { PlanContent } from '@atoms'
import { useStore } from '@store/useStore'

function PlanDrawerBody() {
  const { t } = useTranslation()
  const planContent = useStore((s) => s.planContent)
  return (
    <div className="flex flex-col gap-3 px-5 py-4 overflow-y-auto">
      {planContent.trim().length === 0 ? (
        <p className="text-xs text-text-muted">{t('workflows.addPlan.empty')}</p>
      ) : (
        <PlanContent content={planContent} />
      )}
    </div>
  )
}

function BranchDrawerBody() {
  const { t } = useTranslation()
  const branchName = useStore((s) => s.branchName)
  return (
    <div className="flex flex-col gap-3 px-5 py-4 overflow-y-auto">
      {branchName.trim().length === 0 ? (
        <p className="text-xs text-text-muted">{t('workflows.createBranch.empty')}</p>
      ) : (
        <p className="text-xs font-mono text-text break-all">{branchName}</p>
      )}
    </div>
  )
}

function DrawerBody({ id }: { id: string }) {
  if (id === 'add-plan') return <PlanDrawerBody />
  if (id === 'create-branch') return <BranchDrawerBody />
  return null
}

function DrawerTitleKey(id: string): string {
  if (id === 'add-plan') return 'workflows.addPlan.drawerTitle'
  if (id === 'create-branch') return 'workflows.createBranch.drawerTitle'
  return ''
}

export default function Drawer() {
  const { t } = useTranslation()
  const activeDrawer = useStore((s) => s.activeDrawer)
  const closeDrawer = useStore((s) => s.closeDrawer)
  const [lastId, setLastId] = useState<string | null>(null)

  if (activeDrawer && activeDrawer !== lastId) {
    setLastId(activeDrawer)
  }

  const isOpen = !!activeDrawer
  const titleKey = lastId ? DrawerTitleKey(lastId) : ''

  return (
    <>
      <div
        onClick={closeDrawer}
        aria-hidden="true"
        className={`fixed inset-0 z-40 bg-black/40 backdrop-blur-sm transition-opacity duration-300 ease-out ${
          isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
      />
      <aside
        aria-hidden={!isOpen}
        className={`fixed top-0 right-0 z-50 h-full w-full max-w-md bg-surface border-l border-border shadow-2xl flex flex-col will-change-transform transform transition-transform duration-300 ${
          isOpen
            ? 'translate-x-0 ease-out pointer-events-auto'
            : 'translate-x-full ease-in pointer-events-none'
        }`}
      >
        <div className="flex items-start justify-between gap-4 px-5 py-4 border-b border-divider">
          <h2 className="text-base font-semibold text-text tracking-tight">
            {titleKey ? t(titleKey) : ''}
          </h2>
          <button
            type="button"
            onClick={closeDrawer}
            aria-label={t('workflows.drawer.close')}
            className="text-text-faint hover:text-text transition-colors"
          >
            <X size={18} />
          </button>
        </div>
        {lastId && <DrawerBody id={lastId} />}
      </aside>
    </>
  )
}
