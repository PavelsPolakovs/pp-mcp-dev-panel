// SidebarNav component for navigation links, using React Router NavLink
import React from 'react';
import { NavLink } from 'react-router-dom';

interface NavSection {
  label: string;
  items: Array<{
    to: string;
    icon: string;
    label: string;
    badge?: number;
  }>;
}

const navSections: NavSection[] = [
  {
    label: 'Обзор',
    items: [
      { to: '/dashboard', icon: 'layout-dashboard', label: 'Dashboard' },
      { to: '/analytics', icon: 'trending-up', label: 'Analytics' },
      { to: '/reports', icon: 'bar-chart-2', label: 'Reports' },
    ],
  },
  {
    label: 'Управление',
    items: [
      { to: '/users', icon: 'users', label: 'Users', badge: 12 },
      { to: '/orders', icon: 'shopping-cart', label: 'Orders', badge: 5 },
      { to: '/products', icon: 'package', label: 'Products' },
      { to: '/content', icon: 'file-text', label: 'Content' },
    ],
  },
  {
    label: 'Система',
    items: [
      { to: '/integrations', icon: 'plug', label: 'Integrations' },
      { to: '/settings', icon: 'settings', label: 'Settings' },
      { to: '/logs', icon: 'terminal', label: 'Logs' },
    ],
  },
];

const LucideIcon: React.FC<{ name: string }> = ({ name }) => {
  // Replace with Lucide React icons if available, fallback to SVG or span
  // For now, use a placeholder box
  return (
    <span
      style={{
        width: 16,
        height: 16,
        display: 'inline-block',
        background: 'currentColor',
        opacity: 0.5,
        borderRadius: 2,
      }}
    />
  );
};

export interface SidebarNavProps {
  collapsed: boolean;
}

const SidebarNav: React.FC<SidebarNavProps> = ({ collapsed }) => (
  <nav
    className="flex-1 overflow-y-auto overflow-x-hidden py-3"
    role="navigation"
    aria-label="Primary"
  >
    {navSections.map((section, idx) => (
      <div className="mb-4" key={idx}>
        <div
          className={`text-[10px] font-semibold uppercase tracking-wider text-zinc-400 dark:text-zinc-600 px-4 py-2 whitespace-nowrap overflow-hidden transition-all duration-200 ${collapsed ? 'opacity-0 w-0' : 'opacity-100 w-auto'}`}
        >
          {section.label}
        </div>
        {section.items.map((item) => (
          <NavLink
            to={item.to}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-2 rounded-md mx-2 cursor-pointer whitespace-nowrap text-zinc-500 dark:text-zinc-400 relative transition-colors ${isActive ? 'bg-cyan-100 dark:bg-cyan-900/30 text-cyan-700 dark:text-cyan-300 font-semibold' : 'hover:bg-zinc-100 dark:hover:bg-zinc-800 hover:text-zinc-900 dark:hover:text-zinc-100'}`
            }
            key={item.to}
          >
            <LucideIcon name={item.icon} />
            <span
              className={`text-sm font-medium overflow-hidden transition-all duration-200 ${collapsed ? 'opacity-0 w-0' : 'opacity-100 w-auto'}`}
            >
              {item.label}
            </span>
            {item.badge && (
              <span
                className={`ml-auto bg-rose-500 text-white text-[10px] font-bold leading-none px-2 py-0.5 rounded-full flex-shrink-0 transition-all duration-200 ${collapsed ? 'opacity-0 w-0 p-0' : 'opacity-100 w-auto'}`}
              >
                {item.badge}
              </span>
            )}
          </NavLink>
        ))}
      </div>
    ))}
  </nav>
);

export default SidebarNav;
