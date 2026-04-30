import React from 'react'
import { useTranslation } from 'react-i18next'

const MOCK_USERS = [
  { id: 1, name: 'Pavels P.', role: 'Admin', email: 'p.polakovs@company.com', active: true },
  { id: 2, name: 'Anna K.', role: 'Manager', email: 'a.k@company.com', active: true },
  { id: 3, name: 'Ivan M.', role: 'Developer', email: 'i.m@company.com', active: false },
]

export default function UsersPage() {
  const { t } = useTranslation()

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">{t('users.title')}</h1>
        <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-0.5">{t('users.subtitle')}</p>
      </div>

      <div className="bg-white dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-700 rounded-lg overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800/80">
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                {t('users.name')}
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                {t('users.role')}
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                {t('users.email')}
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                {t('users.status')}
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
            {MOCK_USERS.map((user) => (
              <tr
                key={user.id}
                className="hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors"
              >
                <td className="px-4 py-3 font-medium text-zinc-900 dark:text-zinc-100">
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-full bg-cyan-100 dark:bg-cyan-900/50 flex items-center justify-center text-xs font-bold text-cyan-700 dark:text-cyan-300">
                      {user.name
                        .split(' ')
                        .map((n) => n[0])
                        .join('')}
                    </div>
                    {user.name}
                  </div>
                </td>
                <td className="px-4 py-3 text-zinc-600 dark:text-zinc-400">{user.role}</td>
                <td className="px-4 py-3 font-mono text-xs text-zinc-500 dark:text-zinc-500">
                  {user.email}
                </td>
                <td className="px-4 py-3">
                  <span
                    className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                      user.active
                        ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                        : 'bg-zinc-100 text-zinc-500 dark:bg-zinc-800 dark:text-zinc-500'
                    }`}
                  >
                    {user.active ? t('users.active') : t('users.inactive')}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}