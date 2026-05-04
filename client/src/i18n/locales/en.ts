const en = {
  nav: {
    sections: {
      overview: 'Overview',
      management: 'Management',
      system: 'System'
    },
    items: {
      dashboard: 'Dashboard',
      workflows: 'Workflows',
      analytics: 'Analytics',
      reports: 'Reports',
      users: 'Users',
      orders: 'Orders',
      products: 'Products',
      content: 'Content',
      integrations: 'Integrations',
      settings: 'Settings',
      logs: 'Logs'
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
    subtitle: 'Pick a workflow to get started',
    workflowsCard: {
      title: 'Workflows',
      description: 'Open the workflows page to add a plan or create a branch'
    }
  },
  workflows: {
    title: 'Workflows',
    subtitle: 'Run a workflow — every action is logged on the server',
    badge: {
      idle: 'Idle',
      running: 'Running',
      done: 'Done',
      locked: 'Locked',
      error: 'Error'
    },
    locked: {
      tooltip: 'Complete step {{step}} first'
    },
    modal: {
      confirm: 'Confirm',
      cancel: 'Cancel',
      close: 'Close'
    },
    drawer: {
      close: 'Close'
    },
    addPlan: {
      title: 'Add Plan',
      description: 'Browse a markdown plan file or paste it as text',
      modalTitle: 'Add plan',
      modalDescription: 'Browse a markdown (.md) file, or paste the plan as text.',
      inputLabel: 'Plan',
      inputPlaceholder: 'Outline the plan…',
      browseButton: 'Browse file',
      browseHint: 'Pick a markdown (.md) file to load its contents into the editor below.',
      noFileSelected: 'No file selected.',
      drawerTitle: 'Plan',
      empty: 'No plan content saved yet.',
      cta: {
        add: 'Add Plan',
        show: 'Show Plan'
      }
    },
    createBranch: {
      title: 'Create Branch',
      description: 'Create a new git branch in the project directory',
      comingSoon: 'Coming soon',
      cta: {
        create: 'Create Branch'
      }
    }
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
