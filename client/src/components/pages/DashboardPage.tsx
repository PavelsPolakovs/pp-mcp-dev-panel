import React, { useState } from 'react'
import { FlaskConical, Hammer, ScanSearch, Wifi, WifiOff, FolderOpen, LayoutDashboard } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { CommandButton, TaskCard } from '@molecules'
import { Terminal, TaskPlanPanel } from '@organisms'
import { useStore } from '@store/useStore'

const TOOLS = [
  {
    tool: 'run-tests',
    label: 'Run Tests',
    description: 'npm test --watchAll=false',
    icon: FlaskConical,
    colorClass: 'text-green-500',
  },
  {
    tool: 'build',
    label: 'Build Project',
    description: 'npm run build',
    icon: Hammer,
    colorClass: 'text-blue-500',
  },
  {
    tool: 'lint',
    label: 'Lint Code',
    description: 'eslint . --ext .js,.jsx,.ts,.tsx',
    icon: ScanSearch,
    colorClass: 'text-yellow-500',
  },
]

export default function DashboardPage() {
  const { t } = useTranslation()
  const wsConnected = useStore((s) => s.wsConnected)
  const projectDir = useStore((s) => s.projectDir)
  const setProjectDir = useStore((s) => s.setProjectDir)
  const [showTaskPanel, setShowTaskPanel] = useState(false)

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5 mb-1">
            <LayoutDashboard size={20} className="text-cyan-600 dark:text-cyan-400" />
            <h1 className="text-base font-semibold text-zinc-900 dark:text-zinc-100 tracking-tight">
              {t('dashboard.title')}
            </h1>
          </div>
          <p className="text-xs text-zinc-500 dark:text-zinc-400">{t('dashboard.subtitle')}</p>
        </div>
        <div className="flex items-center gap-2">
          <div
            className={`flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full border mt-0.5 ${
              wsConnected
                ? 'border-green-300 bg-green-100 text-green-700 dark:border-green-800 dark:bg-green-900/20 dark:text-green-400'
                : 'border-zinc-300 bg-zinc-100 text-zinc-500 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-600'
            }`}
          >
            {wsConnected ? <Wifi size={11} /> : <WifiOff size={11} />}
            {wsConnected ? t('dashboard.statusLive') : t('dashboard.statusOffline')}
          </div>
        </div>
      </div>

      <div>
        <label
          htmlFor="project-dir-input"
          className="text-xs text-zinc-500 dark:text-zinc-400 uppercase tracking-wider font-medium block mb-1.5"
        >
          <FolderOpen size={11} className="inline mr-1.5" />
          {t('dashboard.projectDir')}
        </label>
        <input
          id="project-dir-input"
          type="text"
          value={projectDir}
          onChange={(e) => setProjectDir(e.target.value)}
          placeholder={t('dashboard.projectDirPlaceholder')}
          className="w-full bg-zinc-100 border border-zinc-300 dark:bg-zinc-900 dark:border-zinc-800 rounded-lg px-3 py-2 text-xs font-mono text-zinc-900 dark:text-zinc-300 placeholder-zinc-400 dark:placeholder-zinc-600 focus:outline-none focus:border-zinc-400 dark:focus:border-zinc-600 transition-colors"
        />
      </div>

      <div>
        <h2 className="text-xs text-zinc-500 dark:text-zinc-400 uppercase tracking-wider font-medium mb-2">
          {t('dashboard.commands')}
        </h2>
        <div className="space-y-2">
          {TOOLS.map((tool) => (
            <CommandButton key={tool.tool} {...tool} />
          ))}
          <TaskCard onClick={() => setShowTaskPanel(true)} />
        </div>
      </div>

      <div>
        <h2 className="text-xs text-zinc-500 dark:text-zinc-400 uppercase tracking-wider font-medium mb-2">
          {t('dashboard.output')}
        </h2>
        <Terminal />
      </div>

      <p className="text-center text-xs text-zinc-400 dark:text-zinc-700 pb-2">
        {t('dashboard.mcpTools')}:{' '}
        <code className="text-zinc-500 dark:text-zinc-600">open-dashboard</code> ·{' '}
        <code className="text-zinc-500 dark:text-zinc-600">run-tests</code> ·{' '}
        <code className="text-zinc-500 dark:text-zinc-600">build-project</code> ·{' '}
        <code className="text-zinc-500 dark:text-zinc-600">lint-project</code>
      </p>

      {showTaskPanel && <TaskPlanPanel onClose={() => setShowTaskPanel(false)} />}
    </div>
  )
}