import type { ElementType, HTMLAttributes, ReactNode } from 'react'

import { cn } from './utils'
import type { CommonPrimitiveProps, SurfaceVariant } from './types'

const variantClassNames: Record<SurfaceVariant, string> = {
  outline: 'border border-chunks-hairline bg-white shadow-none',
  surface: 'border border-chunks-hairline bg-white shadow-soft',
  raised: 'border border-transparent bg-white shadow-hard',
}

interface CardProps extends CommonPrimitiveProps, HTMLAttributes<HTMLElement> {
  as?: ElementType
  children: ReactNode
  variant?: SurfaceVariant | 'light' | 'dark'
  padding?: 'none' | 'sm' | 'md' | 'lg'
}

const paddingClassNames = {
  none: '',
  sm: 'p-3',
  md: 'p-4',
  lg: 'p-6',
} as const

export function Card({ as: Component = 'section', children, className, padding = 'md', variant = 'surface', ...props }: CardProps) {
  const resolvedVariant: SurfaceVariant = variant === 'dark' ? 'raised' : variant === 'light' ? 'surface' : variant

  return (
    <Component className={cn('theme-card rounded-chunks-xl', variantClassNames[resolvedVariant], paddingClassNames[padding], className)} {...props}>
      {children}
    </Component>
  )
}

interface CardSlotProps extends HTMLAttributes<HTMLElement> {
  children: ReactNode
}

export function CardHeader({ children, className, ...props }: CardSlotProps) {
  return (
    <header className={cn('space-y-2', className)} {...props}>
      {children}
    </header>
  )
}

export function CardContent({ children, className, ...props }: CardSlotProps) {
  return (
    <div className={cn('min-w-0', className)} {...props}>
      {children}
    </div>
  )
}

export function CardFooter({ children, className, ...props }: CardSlotProps) {
  return (
    <footer className={cn('pt-4', className)} {...props}>
      {children}
    </footer>
  )
}
