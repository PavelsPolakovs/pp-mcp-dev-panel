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
    <aside className="flex flex-col bg-zinc-50 dark:bg-zinc-900 border-r border-zinc-200 dark:border-zinc-800 h-full w-full transition-all duration-200 overflow-hidden z-20">
      <div className="flex items-center gap-3 px-4 h-14 border-b border-zinc-200 dark:border-zinc-800 flex-shrink-0">
        <AppLogo className="w-7 h-7 flex-shrink-0" />
        <span
          className={`text-base font-bold tracking-tight text-zinc-900 dark:text-zinc-100 whitespace-nowrap overflow-hidden transition-all duration-200 ${
            collapsed ? 'opacity-0 w-0' : 'opacity-100'
          }`}
        >
          MCP Dev Panel
        </span>
      </div>
      <SidebarNav collapsed={collapsed} />
      <div className="px-2 py-3 border-t border-zinc-200 dark:border-zinc-800 flex-shrink-0">
        <div className="flex items-center gap-3 px-2 py-2 rounded-md cursor-pointer hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors">
          <div className="w-8 h-8 rounded-full bg-cyan-100 dark:bg-cyan-900 flex items-center justify-center font-bold text-cyan-700 dark:text-cyan-300 flex-shrink-0">
            {user.initials}
          </div>
          <div
            className={`overflow-hidden transition-all duration-200 ${
              collapsed ? 'opacity-0 w-0' : 'opacity-100'
            }`}
          >
            <div className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 whitespace-nowrap">
              {user.name}
            </div>
            <div className="text-xs text-zinc-500 dark:text-zinc-400 whitespace-nowrap">{user.role}</div>
          </div>
        </div>
      </div>
    </aside>
  )
}

export default Sidebar