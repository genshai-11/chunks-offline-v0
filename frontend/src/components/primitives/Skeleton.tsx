import type { HTMLAttributes } from 'react'

import { cn } from './utils'
import type { CommonPrimitiveProps } from './types'

interface SkeletonProps extends CommonPrimitiveProps, HTMLAttributes<HTMLDivElement> {
  rounded?: 'sm' | 'md' | 'lg' | 'full'
}

const roundedClassNames = {
  sm: 'rounded-md',
  md: 'rounded-xl',
  lg: 'rounded-2xl',
  full: 'rounded-full',
} as const

export function Skeleton({ className, rounded = 'md', style, ...props }: SkeletonProps) {
  return (
    <div
      aria-hidden="true"
      className={cn('chunks-skeleton bg-chunks-control', roundedClassNames[rounded], className)}
      style={{
        animation: 'chunks-skeleton-shimmer 1.5s ease-in-out infinite',
        backgroundImage: 'linear-gradient(90deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.24) 50%, rgba(255,255,255,0.08) 100%)',
        backgroundRepeat: 'no-repeat',
        backgroundSize: '200% 100%',
        ...style,
      }}
      {...props}
    />
  )
}
