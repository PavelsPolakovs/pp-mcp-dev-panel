import React, { useEffect, useState } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { TrendingUp, FileText, ShoppingCart, Package, FileEdit, Plug2 } from 'lucide-react'

import { Header, Sidebar } from '@organisms'
import { useStore, StoreState } from '@store/useStore'
import { useSessionStore } from '@store/useSessionStore'
import { setSocket } from '@ws/socket'
import {
  DashboardPage,
  SettingsPage,
  LogsPage,
  UsersPage,
  PlaceholderPage,
  SessionHistoryPage
} from '@pages'

export default function App() {
  const [collapsed, setCollapsed] = useState(false)
  const setWsConnected = useStore((s: StoreState) => s.setWsConnected)
  const addLog = useStore((s: StoreState) => s.addLog)
  const setActiveTask = useStore((s: StoreState) => s.setActiveTask)
  const projectDir = useStore((s: StoreState) => s.projectDir)

  useEffect(() => {
    const protocol = location.protocol === 'https:' ? 'wss:' : 'ws:'
    const ws = new WebSocket(`${protocol}//${location.host}`)
    setSocket(ws)

    ws.onopen = () => {
      setWsConnected(true)
      const { sessionId, userId } = useSessionStore.getState().startSession()
      ws.send(JSON.stringify({ type: 'session_init', sessionId, userId }))
    }
    ws.onclose = () => {
      setWsConnected(false)
      setSocket(null)
      useSessionStore.getState().endSession()
    }
    ws.onerror = () => setWsConnected(false)

    ws.onmessage = (e) => {
      try {
        const msg = JSON.parse(e.data)
        if (msg.type === 'connected') return
        if (msg.type === 'history_update') {
          useSessionStore.getState().addHistoryRecord(msg.record)
          return
        }
        if (msg.type === 'task_end') setActiveTask(null)
        addLog(msg)
      } catch {}
    }

    return () => {
      setSocket(null)
      ws.close()
    }
  }, [addLog, setActiveTask, setWsConnected])

  useEffect(() => {
    useSessionStore.getState().resetPlan()
  }, [projectDir])

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
              <Route
                path="/analytics"
                element={<PlaceholderPage titleKey="nav.items.analytics" icon={TrendingUp} />}
              />
              <Route
                path="/reports"
                element={<PlaceholderPage titleKey="nav.items.reports" icon={FileText} />}
              />
              <Route path="/users" element={<UsersPage />} />
              <Route
                path="/orders"
                element={<PlaceholderPage titleKey="nav.items.orders" icon={ShoppingCart} />}
              />
              <Route
                path="/products"
                element={<PlaceholderPage titleKey="nav.items.products" icon={Package} />}
              />
              <Route
                path="/content"
                element={<PlaceholderPage titleKey="nav.items.content" icon={FileEdit} />}
              />
              <Route
                path="/integrations"
                element={<PlaceholderPage titleKey="nav.items.integrations" icon={Plug2} />}
              />
              <Route path="/settings" element={<SettingsPage />} />
              <Route path="/logs" element={<LogsPage />} />
              <Route path="/history" element={<SessionHistoryPage />} />
            </Routes>
          </main>
        </div>
      </div>
    </BrowserRouter>
  )
}
