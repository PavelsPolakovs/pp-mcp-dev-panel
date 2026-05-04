import React from 'react'
import { SidebarNav } from '@molecules'
import { AppLogo } from '@atoms'
import { useStore } from '@store/useStore'

export interface SidebarProps {
  collapsed: boolean
}

const Sidebar: React.FC<SidebarProps> = ({ collapsed }) => {
  const user = useStore((s) => s.user)

  return (
    <aside className="flex flex-col bg-surface border-r border-divider h-full w-full transition-all duration-200 overflow-hidden z-20">
      <div className="flex items-center gap-3 px-4 h-14 border-b border-divider flex-shrink-0">
        <AppLogo className="w-7 h-7 flex-shrink-0" />
        <span
          className={`text-base font-bold tracking-tight text-text whitespace-nowrap overflow-hidden transition-all duration-200 ${
            collapsed ? 'opacity-0 w-0' : 'opacity-100'
          }`}
        >
          MCP Dev Panel
        </span>
      </div>
      <SidebarNav collapsed={collapsed} />
      <div className="px-2 py-3 border-t border-divider flex-shrink-0">
        <div className="flex items-center gap-3 px-2 py-2 rounded-md cursor-pointer hover:bg-surface-dynamic transition-colors">
          <div className="w-8 h-8 rounded-full bg-primary-highlight flex items-center justify-center font-bold text-primary flex-shrink-0">
            {user.initials}
          </div>
          <div
            className={`overflow-hidden transition-all duration-200 ${
              collapsed ? 'opacity-0 w-0' : 'opacity-100'
            }`}
          >
            <div className="text-sm font-semibold text-text whitespace-nowrap">{user.name}</div>
            <div className="text-xs text-text-muted whitespace-nowrap">{user.role}</div>
          </div>
        </div>
      </div>
    </aside>
  )
}

export default Sidebar
