// Sidebar component for the dashboard layout, styled after admin-dashboard.html
import React from 'react';
import SidebarNav from '@molecules/SidebarNav';

const Sidebar = ({ collapsed }) => (
  <aside className="flex flex-col bg-zinc-50 dark:bg-zinc-900 border-r border-zinc-200 dark:border-zinc-800 h-full w-[240px] transition-all duration-200 overflow-hidden z-20">
    <div className="flex items-center gap-3 px-4 h-14 border-b border-zinc-200 dark:border-zinc-800 flex-shrink-0">
      <svg className="w-7 h-7 text-cyan-600 dark:text-cyan-400 flex-shrink-0" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg" aria-label="AdminOS Logo">
        <rect x="2" y="2" width="10" height="10" rx="2.5" fill="currentColor" opacity="0.9"/>
        <rect x="16" y="2" width="10" height="10" rx="2.5" fill="currentColor" opacity="0.5"/>
        <rect x="2" y="16" width="10" height="10" rx="2.5" fill="currentColor" opacity="0.5"/>
        <rect x="16" y="16" width="10" height="10" rx="2.5" fill="currentColor" opacity="0.2"/>
      </svg>
      <span className="text-base font-bold tracking-tight text-zinc-900 dark:text-zinc-100 whitespace-nowrap overflow-hidden transition-all duration-200">AdminOS</span>
    </div>
    <SidebarNav collapsed={collapsed} />
    <div className="px-2 py-3 border-t border-zinc-200 dark:border-zinc-800 flex-shrink-0">
      <div className="flex items-center gap-3 px-2 py-2 rounded-md cursor-pointer hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors">
        <div className="w-8 h-8 rounded-full bg-cyan-100 dark:bg-cyan-900 flex items-center justify-center font-bold text-cyan-700 dark:text-cyan-300">PP</div>
        <div className="overflow-hidden transition-all duration-200">
          <div className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 whitespace-nowrap">Pavels P.</div>
          <div className="text-xs text-zinc-500 dark:text-zinc-400 whitespace-nowrap">Admin</div>
        </div>
      </div>
    </div>
  </aside>
);

export default Sidebar;

