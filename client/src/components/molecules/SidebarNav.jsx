// SidebarNav component for navigation links, using React Router NavLink
import React from 'react';
import { NavLink } from 'react-router-dom';

const navSections = [
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

const LucideIcon = ({ name }) => {
  // Replace with Lucide React icons if available, fallback to SVG or span
  // For now, use a placeholder box
  return <span style={{ width: 16, height: 16, display: 'inline-block', background: 'currentColor', opacity: 0.5, borderRadius: 2 }} />;
};

const SidebarNav = ({ collapsed }) => (
  <nav className="sidebar-nav" role="navigation" aria-label="Primary">
    {navSections.map((section, idx) => (
      <div className="nav-section" key={idx}>
        <div className="nav-section-label">{section.label}</div>
        {section.items.map((item) => (
          <NavLink
            to={item.to}
            className={({ isActive }) =>
              'nav-item' + (isActive ? ' active' : '')
            }
            key={item.to}
          >
            <LucideIcon name={item.icon} />
            <span className="nav-label">{item.label}</span>
            {item.badge && <span className="nav-badge">{item.badge}</span>}
          </NavLink>
        ))}
      </div>
    ))}
  </nav>
);

export default SidebarNav;

