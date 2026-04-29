// Header component for the dashboard layout, styled after admin-dashboard.html
import React from 'react';
import ThemeButton from '../atoms/ThemeButton';

const Header = ({ onToggleSidebar, onToggleTheme }) => (
  <header className="header">
    <button className="header-toggle" onClick={onToggleSidebar} aria-label="Toggle sidebar">
      {/* Lucide icon replacement: Panel Left */}
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M9 3v18"/></svg>
    </button>
    <nav className="header-breadcrumb" aria-label="Breadcrumb">
      <span>Admin</span>
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="9 18 15 12 9 6"/></svg>
      <span className="current" id="breadcrumb-current">Dashboard</span>
    </nav>
    <div className="header-spacer"></div>
    <div className="header-search" role="search">
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
      <input type="text" placeholder="Search..." aria-label="Global search" />
    </div>
    <div className="header-actions">
      <button className="icon-btn" aria-label="Notifications">
        <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 8a6 6 0 0 0-12 0c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>
        <span className="dot"></span>
      </button>
      <button className="icon-btn" aria-label="Messages">
        <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
      </button>
      <ThemeButton onClick={onToggleTheme} />
      <div className="header-avatar" title="Pavels Polakovs">PP</div>
    </div>
  </header>
);

export default Header;
