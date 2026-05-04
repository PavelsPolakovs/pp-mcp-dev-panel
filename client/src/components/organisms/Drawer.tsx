import { useTranslation } from 'react-i18next'
import { X } from 'lucide-react'
import { useStore } from '@store/useStore'

function PlanDrawerBody() {
  const { t } = useTranslation()
  const planContent = useStore((s) => s.planContent)
  return (
    <div className="flex flex-col gap-3 px-5 py-4 overflow-y-auto">
      {planContent.trim().length === 0 ? (
        <p className="text-xs text-zinc-500 dark:text-zinc-400">{t('workflows.addPlan.empty')}</p>
      ) : (
        <pre className="font-mono text-xs leading-6 text-zinc-800 dark:text-zinc-200 whitespace-pre-wrap break-words">
          {planContent}
        </pre>
      )}
    </div>
  )
}

function DrawerBody({ id }: { id: string }) {
  if (id === 'add-plan') return <PlanDrawerBody />
  return null
}

function DrawerTitleKey(id: string): string {
  if (id === 'add-plan') return 'workflows.addPlan.drawerTitle'
  return ''
}

export default function Drawer() {
  const { t } = useTranslation()
  const activeDrawer = useStore((s) => s.activeDrawer)
  const closeDrawer = useStore((s) => s.closeDrawer)

  if (!activeDrawer) return null

  const titleKey = DrawerTitleKey(activeDrawer)

  return (
    <div className="fixed inset-0 z-50 flex">
      <div
        className="flex-1 bg-black/40 backdrop-blur-sm"
        onClick={closeDrawer}
        aria-hidden="true"
      />
      <aside className="w-full max-w-md h-full bg-white dark:bg-zinc-950 border-l border-zinc-300 dark:border-zinc-800 shadow-xl flex flex-col">
        <div className="flex items-start justify-between gap-4 px-5 py-4 border-b border-zinc-200 dark:border-zinc-800">
          <h2 className="text-base font-semibold text-zinc-900 dark:text-zinc-100 tracking-tight">
            {titleKey ? t(titleKey) : ''}
          </h2>
          <button
            type="button"
            onClick={closeDrawer}
            aria-label={t('workflows.drawer.close')}
            className="text-zinc-400 hover:text-zinc-700 dark:text-zinc-500 dark:hover:text-zinc-200 transition-colors"
          >
            <X size={18} />
          </button>
        </div>
        <DrawerBody id={activeDrawer} />
      </aside>
    </div>
  )
}
