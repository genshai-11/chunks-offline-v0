import type { ReactNode } from 'react'

type Tone = 'brand' | 'success' | 'warning' | 'error' | 'neutral'

const toneClassName: Record<Tone, string> = {
  brand: 'bg-chunks-control text-chunks-red',
  success: 'bg-green-50 text-chunks-green',
  warning: 'bg-yellow-50 text-yellow-700',
  error: 'bg-red-50 text-red-700',
  neutral: 'bg-chunks-control text-chunks-ink',
}

interface StatusBadgeProps {
  children: ReactNode
  tone?: Tone
}

export function StatusBadge({ children, tone = 'neutral' }: StatusBadgeProps) {
  return <span className={`theme-badge inline-flex w-fit rounded-full px-4 py-2 text-sm font-semibold ${toneClassName[tone]}`}>{children}</span>
}
