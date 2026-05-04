import React from 'react'
import { NavLink } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { NAV_CONFIG } from '@config/navigation'

export interface SidebarNavProps {
  collapsed: boolean
}

const SidebarNav: React.FC<SidebarNavProps> = ({ collapsed }) => {
  const { t } = useTranslation()

  return (
    <nav
      className="flex-1 overflow-y-auto overflow-x-hidden py-3"
      role="navigation"
      aria-label="Primary"
    >
      {NAV_CONFIG.map((section) => (
        <div className="mb-4" key={section.key}>
          <div
            className={`text-[10px] font-semibold uppercase tracking-wider text-text-faint px-4 py-2 whitespace-nowrap overflow-hidden transition-all duration-200 ${
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
                `flex items-center gap-3 px-4 py-2 rounded-md mx-2 cursor-pointer whitespace-nowrap text-text-muted relative transition-colors ${
                  isActive
                    ? 'bg-primary-highlight text-primary font-semibold'
                    : 'hover:bg-surface-dynamic hover:text-text'
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
              {item.badge !== undefined && (
                <span
                  className={`ml-auto bg-notification text-text-inverse text-[10px] font-bold leading-none px-2 py-0.5 rounded-full flex-shrink-0 transition-all duration-200 ${
                    collapsed ? 'opacity-0 w-0 p-0' : 'opacity-100 w-auto'
                  }`}
                >
                  {item.badge}
                </span>
              )}
            </NavLink>
          ))}
        </div>
      ))}
    </nav>
  )
}

export default SidebarNav
