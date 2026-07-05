import type { ReactNode } from 'react'

export type PrimitiveSize = 'sm' | 'md' | 'lg'
export type PrimitiveTone = 'neutral' | 'brand' | 'success' | 'warning' | 'error' | 'info'
export type PrimitiveVariant = 'primary' | 'secondary' | 'ghost' | 'destructive'
export type SurfaceVariant = 'outline' | 'surface' | 'raised'

export interface DisabledExplanationProps {
  disabled?: boolean
  disabledReason?: ReactNode
}

export interface FieldMessageProps {
  helperText?: ReactNode
  errorText?: ReactNode
  disabledExplanation?: ReactNode
}

export interface CommonPrimitiveProps {
  className?: string
}
