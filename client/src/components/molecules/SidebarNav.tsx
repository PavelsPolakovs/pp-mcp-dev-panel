import React from 'react'
import { NavLink } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { NAV_CONFIG } from '@config/navigation'
import { useSessionStore } from '@store/useSessionStore'

export interface SidebarNavProps {
  collapsed: boolean
}

const SidebarNav: React.FC<SidebarNavProps> = ({ collapsed }) => {
  const { t } = useTranslation()
  const historyCount = useSessionStore((s) => s.history.length)

  const dynamicBadge = (key: string, base: number | undefined): number | undefined => {
    if (key === 'history') return historyCount > 0 ? historyCount : undefined
    return base
  }

  return (
    <nav
      className="flex-1 overflow-y-auto overflow-x-hidden py-3"
      role="navigation"
      aria-label="Primary"
    >
      {NAV_CONFIG.map((section) => (
        <div className="mb-4" key={section.key}>
          <div
            className={`text-[10px] font-semibold uppercase tracking-wider text-zinc-400 dark:text-zinc-600 px-4 py-2 whitespace-nowrap overflow-hidden transition-all duration-200 ${
              collapsed ? 'opacity-0 w-0' : 'opacity-100 w-auto'
            }`}
          >
            {t(section.labelKey)}
          </div>
          {section.items.map((item) => (
            <NavLink
              to={item.path}
              key={item.key}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-2 rounded-md mx-2 cursor-pointer whitespace-nowrap text-zinc-500 dark:text-zinc-400 relative transition-colors ${
                  isActive
                    ? 'bg-cyan-100 dark:bg-cyan-900/30 text-cyan-700 dark:text-cyan-300 font-semibold'
                    : 'hover:bg-zinc-100 dark:hover:bg-zinc-800 hover:text-zinc-900 dark:hover:text-zinc-100'
                }`
              }
            >
              <item.icon size={16} className="flex-shrink-0" />
              <span
                className={`text-sm font-medium overflow-hidden transition-all duration-200 ${
                  collapsed ? 'opacity-0 w-0' : 'opacity-100 w-auto'
                }`}
              >
                {t(item.labelKey)}
              </span>
              {(() => {
                const badge = dynamicBadge(item.key, item.badge)
                if (badge === undefined) return null
                return (
                  <span
                    className={`ml-auto bg-rose-500 text-white text-[10px] font-bold leading-none px-2 py-0.5 rounded-full flex-shrink-0 transition-all duration-200 ${
                      collapsed ? 'opacity-0 w-0 p-0' : 'opacity-100 w-auto'
                    }`}
                  >
                    {badge}
                  </span>
                )
              })()}
            </NavLink>
          ))}
        </div>
      ))}
    </nav>
  )
}

export default SidebarNav
