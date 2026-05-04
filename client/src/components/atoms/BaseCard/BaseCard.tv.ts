import { tv } from '@config/tv'

export const card = tv({
  slots: {
    root: 'flex flex-col gap-3 p-4 rounded-xl border bg-surface shadow-sm transition-opacity',
    iconWrap: 'flex-shrink-0',
    title: 'text-sm font-bold leading-tight',
    description: 'text-xs'
  },
  variants: {
    dimmed: {
      true: {
        root: 'opacity-60 border-divider',
        iconWrap: 'text-text-faint',
        title: 'text-text-muted',
        description: 'text-text-faint'
      },
      false: {
        root: 'border-border',
        title: 'text-text',
        description: 'text-text-muted'
      }
    }
  },
  defaultVariants: {
    dimmed: false
  }
})
