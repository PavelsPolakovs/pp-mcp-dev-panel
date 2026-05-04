import type { VariantProps } from 'tailwind-variants'
import { tv } from '@config/tv'

export const button = tv({
  base: [
    'inline-flex items-center justify-center gap-2',
    'rounded-lg font-medium text-xs transition-colors',
    'cursor-pointer disabled:cursor-not-allowed'
  ],
  variants: {
    intent: {
      primary: [
        'bg-primary hover:bg-primary-hover text-text-inverse',
        'disabled:bg-surface-dynamic disabled:text-text-faint disabled:hover:bg-surface-dynamic'
      ],
      secondary: [
        'border border-border text-text hover:bg-surface-dynamic',
        'disabled:opacity-50 disabled:hover:bg-transparent'
      ],
      subtle: [
        'border border-border bg-surface-offset text-text',
        'hover:bg-surface-dynamic',
        'disabled:opacity-50'
      ],
      ghost: [
        'text-text hover:bg-surface-dynamic',
        'disabled:opacity-50 disabled:hover:bg-transparent'
      ],
      danger: ['bg-error text-text-inverse hover:opacity-90', 'disabled:opacity-50']
    },
    size: {
      sm: 'px-3 py-1.5',
      md: 'px-3 py-2',
      lg: 'px-4 py-2'
    },
    fullWidth: {
      true: 'w-full'
    }
  },
  defaultVariants: {
    intent: 'primary',
    size: 'md'
  }
})

export type ButtonVariants = VariantProps<typeof button>
