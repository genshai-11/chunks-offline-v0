import type { ReactNode } from 'react'

import { Badge, Panel } from '../primitives'
import type { PrimitiveTone } from '../primitives'

type Tone = 'info' | 'warning' | 'error' | 'success'

const toneClassName: Record<Tone, PrimitiveTone> = {
  info: 'info',
  warning: 'warning',
  error: 'error',
  success: 'success',
}

interface AlertProps {
  children: ReactNode
  className?: string
  title: string
  tone?: Tone
}

export function Alert({ children, className = '', title, tone = 'info' }: AlertProps) {
  return (
    <Panel as="section" className={`theme-alert ${className}`.trim()} variant="surface" aria-live="polite">
      <div className="space-y-1">
        <Badge tone={toneClassName[tone]}>{title}</Badge>
        <div className="text-sm leading-6 text-chunks-body">{children}</div>
      </div>
    </Panel>
  )
}
