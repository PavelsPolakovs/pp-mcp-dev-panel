import React, { useEffect, useState } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { TrendingUp, FileText, ShoppingCart, Package, FileEdit, Plug2 } from 'lucide-react'

import { Header, Sidebar } from '@organisms'
import { useStore, StoreState } from '@store/useStore'
import {
  DashboardPage,
  SettingsPage,
  LogsPage,
  UsersPage,
  PlaceholderPage,
} from '@pages'

export default function App() {
  const [collapsed, setCollapsed] = useState(false)
  const setWsConnected = useStore((s: StoreState) => s.setWsConnected)
  const addLog = useStore((s: StoreState) => s.addLog)
  const setActiveTask = useStore((s: StoreState) => s.setActiveTask)

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

  return (
    <BrowserRouter>
      <div
        className={`grid h-screen transition-all duration-200 ${
          collapsed ? 'grid-cols-[60px_1fr]' : 'grid-cols-[240px_1fr]'
        }`}
      >
        <Sidebar collapsed={collapsed} />
        <div className="grid grid-rows-[56px_1fr] min-w-0 overflow-hidden">
          <Header onToggleSidebar={() => setCollapsed((c) => !c)} />
          <main className="overflow-y-auto bg-zinc-50 dark:bg-zinc-900 p-8">
            <Routes>
              <Route path="/" element={<Navigate to="/dashboard" replace />} />
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/analytics" element={<PlaceholderPage titleKey="nav.items.analytics" icon={TrendingUp} />} />
              <Route path="/reports" element={<PlaceholderPage titleKey="nav.items.reports" icon={FileText} />} />
              <Route path="/users" element={<UsersPage />} />
              <Route path="/orders" element={<PlaceholderPage titleKey="nav.items.orders" icon={ShoppingCart} />} />
              <Route path="/products" element={<PlaceholderPage titleKey="nav.items.products" icon={Package} />} />
              <Route path="/content" element={<PlaceholderPage titleKey="nav.items.content" icon={FileEdit} />} />
              <Route path="/integrations" element={<PlaceholderPage titleKey="nav.items.integrations" icon={Plug2} />} />
              <Route path="/settings" element={<SettingsPage />} />
              <Route path="/logs" element={<LogsPage />} />
            </Routes>
          </main>
        </div>
      </div>
    </BrowserRouter>
  )
}