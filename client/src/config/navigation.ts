export interface NavItem {
  key: string
  labelKey: string
  path: string
  badge?: number
}

export interface NavSection {
  key: string
  labelKey: string
  items: NavItem[]
}

export const NAV_CONFIG: NavSection[] = [
  {
    key: 'overview',
    labelKey: 'nav.sections.overview',
    items: [
      { key: 'dashboard', labelKey: 'nav.items.dashboard', path: '/dashboard' },
      { key: 'analytics', labelKey: 'nav.items.analytics', path: '/analytics' },
      { key: 'reports', labelKey: 'nav.items.reports', path: '/reports' },
    ],
  },
  {
    key: 'management',
    labelKey: 'nav.sections.management',
    items: [
      { key: 'users', labelKey: 'nav.items.users', path: '/users', badge: 12 },
      { key: 'orders', labelKey: 'nav.items.orders', path: '/orders', badge: 5 },
      { key: 'products', labelKey: 'nav.items.products', path: '/products' },
      { key: 'content', labelKey: 'nav.items.content', path: '/content' },
    ],
  },
  {
    key: 'system',
    labelKey: 'nav.sections.system',
    items: [
      { key: 'integrations', labelKey: 'nav.items.integrations', path: '/integrations' },
      { key: 'settings', labelKey: 'nav.items.settings', path: '/settings' },
      { key: 'logs', labelKey: 'nav.items.logs', path: '/logs' },
    ],
  },
]

export function findNavEntry(path: string): { section: NavSection; item: NavItem } | null {
  for (const section of NAV_CONFIG) {
    const item = section.items.find((i) => i.path === path)
    if (item) return { section, item }
  }
  return null
}