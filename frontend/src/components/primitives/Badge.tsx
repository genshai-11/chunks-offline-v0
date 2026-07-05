import type { HTMLAttributes, ReactNode } from 'react'

import { cn } from './utils'
import type { CommonPrimitiveProps, PrimitiveSize, PrimitiveTone } from './types'

const toneClassNames: Record<PrimitiveTone, string> = {
  neutral: 'bg-chunks-control text-chunks-ink border border-chunks-hairline',
  brand: 'bg-chunks-red text-white border border-transparent',
  success: 'bg-green-50 text-green-800 border border-green-200',
  warning: 'bg-yellow-50 text-yellow-800 border border-yellow-200',
  error: 'bg-red-50 text-red-800 border border-red-200',
  info: 'bg-blue-50 text-blue-800 border border-blue-200',
}

const sizeClassNames: Record<PrimitiveSize, string> = {
  sm: 'px-2.5 py-1 text-[0.72rem]',
  md: 'px-3 py-1.5 text-xs',
  lg: 'px-4 py-2 text-sm',
}

export interface BadgeProps extends CommonPrimitiveProps, HTMLAttributes<HTMLSpanElement> {
  children: ReactNode
  tone?: PrimitiveTone
  size?: PrimitiveSize
}

export function Badge({ children, className, size = 'md', tone = 'neutral', ...props }: BadgeProps) {
  return (
    <span className={cn('theme-badge inline-flex w-fit items-center gap-2 rounded-full font-semibold leading-none', toneClassNames[tone], sizeClassNames[size], className)} {...props}>
      {children}
    </span>
  )
}
