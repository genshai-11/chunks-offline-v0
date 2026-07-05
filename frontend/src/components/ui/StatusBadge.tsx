import type { ReactNode } from 'react'

import { Badge } from '../primitives'
import type { PrimitiveTone } from '../primitives'

type Tone = 'brand' | 'success' | 'warning' | 'error' | 'neutral'

const toneMap: Record<Tone, PrimitiveTone> = {
  brand: 'brand',
  success: 'success',
  warning: 'warning',
  error: 'error',
  neutral: 'neutral',
}

interface StatusBadgeProps {
  children: ReactNode
  tone?: Tone
}

export function StatusBadge({ children, tone = 'neutral' }: StatusBadgeProps) {
  return <Badge tone={toneMap[tone]}>{children}</Badge>
}
