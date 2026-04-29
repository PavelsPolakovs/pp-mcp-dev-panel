import React, { useEffect, useState } from 'react'
import { BrowserRouter } from 'react-router-dom'
import { FlaskConical, Hammer, ScanSearch, Wifi, WifiOff, FolderOpen } from 'lucide-react'

import { CommandButton } from '@molecules'
import { Terminal, Header, Sidebar } from '@organisms'
import { useStore, StoreState } from '@store/useStore'

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

export default function App() {
  const [collapsed, setCollapsed] = useState(false)
  const wsConnected = useStore((s: StoreState) => s.wsConnected)
  const setWsConnected = useStore((s: StoreState) => s.setWsConnected)
  const addLog = useStore((s: StoreState) => s.addLog)
  const setActiveTask = useStore((s: StoreState) => s.setActiveTask)
  const projectDir = useStore((s: StoreState) => s.projectDir)
  const setProjectDir = useStore((s: StoreState) => s.setProjectDir)
  const theme = useStore((s: StoreState) => s.theme)

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [theme])

  useEffect(() => {
    const protocol = location.protocol === 'https:' ? 'wss:' : 'ws:'
    const ws = new WebSocket(`${protocol}//${location.host}`)

    ws.onopen = () => setWsConnected(true)
    ws.onclose = () => setWsConnected(false)
    ws.onerror = () => setWsConnected(false)

    ws.onmessage = (e) => {
      try {
        const msg = JSON.parse(e.data)
        if (msg.type === 'connected') return
        if (msg.type === 'task_end') setActiveTask(null)
        addLog(msg)
      } catch {}
    }

    return () => ws.close()
  }, [addLog, setActiveTask, setWsConnected])

  const handleToggleSidebar = () => setCollapsed((c) => !c)

  return (
    <BrowserRouter>
      <div
        className={`grid grid-cols-[240px_1fr] h-screen transition-all duration-200 ${collapsed ? 'grid-cols-[60px_1fr]' : ''}`}
      >
        <Sidebar collapsed={collapsed} />
        <div className="grid grid-rows-[56px_1fr] min-w-0 overflow-hidden">
          <Header onToggleSidebar={handleToggleSidebar} />
          <main className="overflow-y-auto bg-zinc-50 dark:bg-zinc-900 p-8">
            {/* Header */}
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="flex items-center gap-2.5 mb-1">
                  {/* Logo */}
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    aria-label="MCP Dev Panel"
                  >
                    <rect x="2" y="2" width="9" height="9" rx="2" fill="#4f98a3" />
                    <rect x="13" y="2" width="9" height="9" rx="2" fill="#3f3f46" />
                    <rect x="2" y="13" width="9" height="9" rx="2" fill="#3f3f46" />
                    <rect x="13" y="13" width="9" height="9" rx="2" fill="#4f98a3" opacity="0.5" />
                  </svg>
                  <h1 className="text-base font-semibold text-zinc-900 dark:text-zinc-100 tracking-tight">
                    MCP Dev Panel!
                  </h1>
                </div>
                <p className="text-xs text-zinc-500 dark:text-zinc-400">
                  Run project commands from Claude or the browser
                </p>
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
                  {wsConnected ? 'Live' : 'Offline'}
                </div>
              </div>
            </div>

            {/* Project dir override */}
            <div>
              <label htmlFor="project-dir-input" className="text-xs text-zinc-500 dark:text-zinc-400 uppercase tracking-wider font-medium block mb-1.5">
                <FolderOpen size={11} className="inline mr-1.5" />
                Project directory (optional override)
              </label>
              <input
                id="project-dir-input"
                type="text"
                value={projectDir}
                onChange={(e) => setProjectDir(e.target.value)}
                placeholder="/absolute/path/to/your/project"
                className="w-full bg-zinc-100 border border-zinc-300 dark:bg-zinc-900 dark:border-zinc-800 rounded-lg px-3 py-2 text-xs font-mono text-zinc-900 dark:text-zinc-300 placeholder-zinc-400 dark:placeholder-zinc-600 focus:outline-none focus:border-zinc-400 dark:focus:border-zinc-600 transition-colors"
              />
            </div>

            {/* Commands */}
            <div>
              <h2 className="text-xs text-zinc-500 dark:text-zinc-400 uppercase tracking-wider font-medium mb-2">
                Commands
              </h2>
              <div className="space-y-2">
                {TOOLS.map((t) => (
                  <CommandButton key={t.tool} {...t} />
                ))}
              </div>
            </div>

            {/* Terminal */}
            <div>
              <h2 className="text-xs text-zinc-500 dark:text-zinc-400 uppercase tracking-wider font-medium mb-2">
                Output
              </h2>
              <Terminal />
            </div>

            <p className="text-center text-xs text-zinc-400 dark:text-zinc-700 pb-2">
              MCP tools: <code className="text-zinc-500 dark:text-zinc-600">open-dashboard</code> ·{' '}
              <code className="text-zinc-500 dark:text-zinc-600">run-tests</code> ·{' '}
              <code className="text-zinc-500 dark:text-zinc-600">build-project</code> ·{' '}
              <code className="text-zinc-500 dark:text-zinc-600">lint-project</code>
            </p>
          </main>
        </div>
      </div>
    </BrowserRouter>
  )
}
