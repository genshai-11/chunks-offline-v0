import type { ElementType, HTMLAttributes, ReactNode } from 'react'

import { Card as PrimitiveCard } from '../primitives'

interface CardProps extends HTMLAttributes<HTMLElement> {
  as?: ElementType
  children: ReactNode
  className?: string
  variant?: 'light' | 'dark'
}

export function Card({ as: Component = 'div', children, className = '', variant = 'light', ...props }: CardProps) {
  const primitiveVariant = variant === 'dark' ? 'raised' : 'surface'
  return (
    <PrimitiveCard as={Component} className={className} variant={primitiveVariant} {...props}>
      {children}
    </PrimitiveCard>
  )
}
