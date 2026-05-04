import React from 'react'
import { Users } from 'lucide-react'
import { useTranslation } from 'react-i18next'

const MOCK_USERS = [
  { id: 1, name: 'Pavels P.', role: 'Admin', email: 'p.polakovs@company.com', active: true },
  { id: 2, name: 'Anna K.', role: 'Manager', email: 'a.k@company.com', active: true },
  { id: 3, name: 'Ivan M.', role: 'Developer', email: 'i.m@company.com', active: false }
]

export default function UsersPage() {
  const { t } = useTranslation()

  return (
    <div className="flex flex-col gap-6">
      <div>
        <div className="flex items-center gap-2.5 mb-1">
          <Users size={20} className="text-primary" />
          <h1 className="text-lg font-semibold text-text">{t('users.title')}</h1>
        </div>
        <p className="text-sm text-text-muted mt-0.5">{t('users.subtitle')}</p>
      </div>

      <div className="bg-surface border border-divider rounded-lg overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-divider bg-surface-offset">
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-text-muted">
                {t('users.name')}
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-text-muted">
                {t('users.role')}
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-text-muted">
                {t('users.email')}
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-text-muted">
                {t('users.status')}
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-divider">
            {MOCK_USERS.map((user) => (
              <tr key={user.id} className="hover:bg-surface-offset transition-colors">
                <td className="px-4 py-3 font-medium text-text">
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-full bg-primary-highlight flex items-center justify-center text-xs font-bold text-primary">
                      {user.name
                        .split(' ')
                        .map((n) => n[0])
                        .join('')}
                    </div>
                    {user.name}
                  </div>
                </td>
                <td className="px-4 py-3 text-text-muted">{user.role}</td>
                <td className="px-4 py-3 font-mono text-xs text-text-faint">{user.email}</td>
                <td className="px-4 py-3">
                  <span
                    className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                      user.active
                        ? 'bg-success-highlight text-success'
                        : 'bg-surface-dynamic text-text-faint'
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
