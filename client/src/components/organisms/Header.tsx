import React from 'react'
import { useLocation } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { ThemeToggle } from '@atoms'
import { useStore } from '@store/useStore'
import { findNavEntry } from '@config/navigation'

export interface HeaderProps {
  onToggleSidebar: () => void
}

const Header: React.FC<HeaderProps> = ({ onToggleSidebar }) => {
  const { t } = useTranslation()
  const location = useLocation()
  const user = useStore((s) => s.user)

  const entry = findNavEntry(location.pathname)
  const sectionLabel = entry ? t(entry.section.labelKey) : t('header.admin')
  const pageLabel = entry ? t(entry.item.labelKey) : ''

  return (
    <header className="flex items-center gap-8 px-8 py-0 h-14 bg-zinc-50 dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-800 sticky top-0 z-10 shadow-sm">
      <button
        className="w-8 h-8 flex items-center justify-center rounded-md text-zinc-400 hover:bg-zinc-200 hover:text-zinc-700 dark:text-zinc-500 dark:hover:bg-zinc-800 dark:hover:text-zinc-200 transition-colors"
        onClick={onToggleSidebar}
        aria-label={t('header.toggleSidebar')}
      >
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <rect x="3" y="3" width="18" height="18" rx="2" />
          <path d="M9 3v18" />
        </svg>
      </button>
      <nav className="flex items-center gap-2 text-sm text-zinc-400 dark:text-zinc-500" aria-label="Breadcrumb">
        <span>{sectionLabel}</span>
        {pageLabel && (
          <>
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <polyline points="9 18 15 12 9 6" />
            </svg>
            <span className="text-zinc-900 dark:text-zinc-100 font-semibold">{pageLabel}</span>
          </>
        )}
      </nav>
      <div className="flex-1" />
      <div
        className="flex items-center gap-2 bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-md px-3 py-2 min-w-[220px]"
        role="search"
      >
        <svg
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          className="text-zinc-400 dark:text-zinc-500"
        >
          <circle cx="11" cy="11" r="8" />
          <line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>
        <input
          type="text"
          placeholder={t('header.searchPlaceholder')}
          aria-label="Global search"
          className="bg-transparent border-none outline-none font-inherit text-zinc-900 dark:text-zinc-100 text-sm w-full placeholder-zinc-400 dark:placeholder-zinc-600"
        />
      </div>
      <div className="flex items-center gap-2">
        <button
          className="relative w-9 h-9 flex items-center justify-center rounded-md text-zinc-400 hover:bg-zinc-200 hover:text-zinc-700 dark:text-zinc-500 dark:hover:bg-zinc-800 dark:hover:text-zinc-200 transition-colors"
          aria-label={t('header.notifications')}
        >
          <svg
            width="17"
            height="17"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M18 8a6 6 0 0 0-12 0c0 7-3 9-3 9h18s-3-2-3-9" />
            <path d="M13.73 21a2 2 0 0 1-3.46 0" />
          </svg>
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-rose-500 border-2 border-zinc-50 dark:border-zinc-900"></span>
        </button>
        <button
          className="w-9 h-9 flex items-center justify-center rounded-md text-zinc-400 hover:bg-zinc-200 hover:text-zinc-700 dark:text-zinc-500 dark:hover:bg-zinc-800 dark:hover:text-zinc-200 transition-colors"
          aria-label={t('header.messages')}
        >
          <svg
            width="17"
            height="17"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
          </svg>
        </button>
        <ThemeToggle />
        <div
          className="w-9 h-9 flex items-center justify-center rounded-full bg-cyan-100 dark:bg-cyan-900 font-bold text-cyan-700 dark:text-cyan-300 border-2 border-zinc-200 dark:border-zinc-700 cursor-pointer transition-colors"
          title={user.name}
        >
          {user.initials}
        </div>
      </div>
    </header>
  )
}

export default Header