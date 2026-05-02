import { useEffect, useState } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { TrendingUp, FileText, ShoppingCart, Package, FileEdit, Plug2 } from 'lucide-react'

import { Header, Sidebar } from '@organisms'
import { useStore, StoreState } from '@store/useStore'
import { useSessionStore } from '@store/useSessionStore'
import { useWebSocketConnection } from '@ws/useWebSocketConnection'
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
  const projectDir = useStore((s: StoreState) => s.projectDir)

  useWebSocketConnection()

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
