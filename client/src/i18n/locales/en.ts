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
    addPlan: {
      title: 'Add Plan',
      description: 'Upload a markdown or JSON plan file',
      modalTitle: 'Add plan file',
      modalDescription: 'Pick a plan file to send to the server.',
      browseHint: 'Add a .md or .json file to inspect its contents below.',
      browseButton: 'Browse file',
      noFileSelected: 'No file selected yet.',
      confirm: 'Confirm',
      cancel: 'Cancel',
      close: 'Close'
    },
    createBranch: {
      title: 'Create Branch',
      description: 'Create a new git branch in the project directory',
      comingSoon: 'Coming soon'
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