module.exports = {
  darkMode: 'class',
  content: ['./client/index.html', './client/src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        bg: 'var(--color-bg)',
        surface: {
          DEFAULT: 'var(--color-surface)',
          2: 'var(--color-surface-2)',
          offset: 'var(--color-surface-offset)',
          dynamic: 'var(--color-surface-dynamic)'
        },
        border: 'var(--color-border)',
        divider: 'var(--color-divider)',
        text: {
          DEFAULT: 'var(--color-text)',
          muted: 'var(--color-text-muted)',
          faint: 'var(--color-text-faint)',
          inverse: 'var(--color-text-inverse)'
        },
        primary: {
          DEFAULT: 'var(--color-primary)',
          hover: 'var(--color-primary-hover)',
          active: 'var(--color-primary-active)',
          highlight: 'var(--color-primary-highlight)'
        },
        success: {
          DEFAULT: 'var(--color-success)',
          highlight: 'var(--color-success-highlight)'
        },
        warning: {
          DEFAULT: 'var(--color-warning)',
          highlight: 'var(--color-warning-highlight)'
        },
        error: 'var(--color-error)',
        notification: 'var(--color-notification)'
      },
      borderRadius: {
        sm: 'var(--radius-sm)',
        md: 'var(--radius-md)',
        lg: 'var(--radius-lg)',
        xl: 'var(--radius-xl)'
      },
      boxShadow: {
        sm: 'var(--shadow-sm)',
        md: 'var(--shadow-md)',
        lg: 'var(--shadow-lg)'
      }
    }
  },
  plugins: []
}
