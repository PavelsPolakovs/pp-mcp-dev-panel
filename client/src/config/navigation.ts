import {
  LayoutDashboard,
  TrendingUp,
  FileText,
  Users,
  ShoppingCart,
  Package,
  FileEdit,
  Plug2,
  Settings,
  ScrollText,
  Workflow
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

export interface NavItem {
  key: string
  labelKey: string
  path: string
  icon: LucideIcon
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
      {
        key: 'dashboard',
        labelKey: 'nav.items.dashboard',
        path: '/dashboard',
        icon: LayoutDashboard
      },
      { key: 'workflows', labelKey: 'nav.items.workflows', path: '/workflows', icon: Workflow },
      { key: 'analytics', labelKey: 'nav.items.analytics', path: '/analytics', icon: TrendingUp },
      { key: 'reports', labelKey: 'nav.items.reports', path: '/reports', icon: FileText }
    ]
  },
  {
    key: 'management',
    labelKey: 'nav.sections.management',
    items: [
      { key: 'users', labelKey: 'nav.items.users', path: '/users', icon: Users, badge: 12 },
      {
        key: 'orders',
        labelKey: 'nav.items.orders',
        path: '/orders',
        icon: ShoppingCart,
        badge: 5
      },
      { key: 'products', labelKey: 'nav.items.products', path: '/products', icon: Package },
      { key: 'content', labelKey: 'nav.items.content', path: '/content', icon: FileEdit }
    ]
  },
  {
    key: 'system',
    labelKey: 'nav.sections.system',
    items: [
      {
        key: 'integrations',
        labelKey: 'nav.items.integrations',
        path: '/integrations',
        icon: Plug2
      },
      { key: 'settings', labelKey: 'nav.items.settings', path: '/settings', icon: Settings },
      { key: 'logs', labelKey: 'nav.items.logs', path: '/logs', icon: ScrollText }
    ]
  }
]

export function findNavEntry(path: string): { section: NavSection; item: NavItem } | null {
  for (const section of NAV_CONFIG) {
    const item = section.items.find((i) => i.path === path)
    if (item) return { section, item }
  }
  return null
}
