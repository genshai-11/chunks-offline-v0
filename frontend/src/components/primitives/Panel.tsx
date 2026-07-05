import type { HTMLAttributes, ReactNode } from 'react'

import { cn } from './utils'
import type { CommonPrimitiveProps, SurfaceVariant } from './types'

interface PanelProps extends CommonPrimitiveProps, HTMLAttributes<HTMLElement> {
  as?: 'section' | 'article' | 'div' | 'aside'
  children: ReactNode
  variant?: SurfaceVariant
  compact?: boolean
}

const variantClassNames: Record<SurfaceVariant, string> = {
  outline: 'border border-chunks-hairline bg-white shadow-none',
  surface: 'border border-chunks-hairline bg-white shadow-soft',
  raised: 'border border-transparent bg-white shadow-hard',
}

export function Panel({ as: Component = 'section', children, className, compact = false, variant = 'surface', ...props }: PanelProps) {
  return (
    <Component className={cn('theme-panel rounded-chunks-xl', variantClassNames[variant], compact ? 'p-4 sm:p-5' : 'p-5 sm:p-6 lg:p-8', className)} {...props}>
      {children}
    </Component>
  )
}
