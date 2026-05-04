const en = {
  nav: {
    sections: {
      overview: 'Overview',
      management: 'Management',
      system: 'System'
    },
    items: {
      dashboard: 'Dashboard',
      analytics: 'Analytics',
      reports: 'Reports',
      users: 'Users',
      orders: 'Orders',
      products: 'Products',
      content: 'Content',
      integrations: 'Integrations',
      settings: 'Settings',
      logs: 'Logs',
      history: 'Session History'
    }
  },
  theme: {
    switchToLight: 'Switch to light theme',
    switchToDark: 'Switch to dark theme'
  },
  header: {
    searchPlaceholder: 'Search...',
    toggleSidebar: 'Toggle sidebar',
    notifications: 'Notifications',
    messages: 'Messages',
    admin: 'Admin'
  },
  dashboard: {
    title: 'Dashboard',
    subtitle: 'Run project commands from Claude or the browser',
    output: 'Output'
  },
  history: {
    title: 'Session History',
    subtitle: 'Actions taken in the current and previous sessions',
    empty: 'No actions recorded yet',
    loading: 'Loading history...'
  },
  settings: {
    title: 'Settings',
    subtitle: 'Manage preferences and configuration',
    appearance: 'Appearance',
    colorScheme: 'Color scheme',
    light: 'Light',
    dark: 'Dark',
    project: 'Project',
    projectDirLabel: 'Default project directory',
    projectDirPlaceholder: '/absolute/path/to/your/project',
    projectDirHint: 'Used as the default target for all run commands.'
  },
  users: {
    title: 'Users',
    subtitle: 'Manage team members and access',
    name: 'Name',
    role: 'Role',
    email: 'Email',
    status: 'Status',
    active: 'Active',
    inactive: 'Inactive'
  },
  logs: {
    title: 'Logs',
    subtitle: 'Task and WebSocket output'
  },
  page: {
    comingSoon: 'Coming soon',
    comingSoonSubtitle: 'This section is under construction.'
  },
  taskPlan: {
    cardTitle: 'Test Task',
    cardDescription: 'Browse and preview a task plan file',
    panelTitle: 'Task plan',
    panelDescription: 'Pick a task plan file to preview its contents.',
    browseHint: 'Add a .md or .json file to inspect its contents below.',
    browseButton: 'Browse file',
    confirmButton: 'Confirm',
    closeButton: 'Close',
    noFileSelected: 'No file selected yet.',
    activePlan: {
      title: 'Active Plan',
      loaded: 'Loaded',
      show: 'Show preview',
      hide: 'Hide preview',
      clear: 'Clear plan'
    }
  },
  session: {
    none: 'no session',
    status: {
      idle: 'Idle',
      active: 'Active',
      ended: 'Ended'
    },
    tooltip: {
      status: 'Status',
      id: 'Session',
      user: 'User',
      startedAt: 'Started'
    }
  }
}

export default en
