// Sidebar component for the dashboard layout, styled after admin-dashboard.html
import React from 'react';
import SidebarNav from '../molecules/SidebarNav';

const Sidebar = ({ collapsed }) => (
  <aside className="sidebar">
    <div className="sidebar-logo">
      <svg className="logo-icon" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg" aria-label="AdminOS Logo">
        <rect x="2" y="2" width="10" height="10" rx="2.5" fill="currentColor" opacity="0.9"/>
        <rect x="16" y="2" width="10" height="10" rx="2.5" fill="currentColor" opacity="0.5"/>
        <rect x="2" y="16" width="10" height="10" rx="2.5" fill="currentColor" opacity="0.5"/>
        <rect x="16" y="16" width="10" height="10" rx="2.5" fill="currentColor" opacity="0.2"/>
      </svg>
      <span className="logo-text">AdminOS</span>
    </div>
    <SidebarNav collapsed={collapsed} />
    <div className="sidebar-footer">
      <div className="user-card">
        <div className="user-avatar">PP</div>
        <div className="user-info">
          <div className="user-name">Pavels P.</div>
          <div className="user-role">Admin</div>
        </div>
      </div>
    </div>
  </aside>
);

export default Sidebar;

