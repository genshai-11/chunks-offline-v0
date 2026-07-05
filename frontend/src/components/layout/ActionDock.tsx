import type { ReactNode } from 'react'

import { Badge } from '../primitives'

interface ActionDockProps {
  children: ReactNode
  className?: string
  label?: string
  meta?: ReactNode
  tone?: 'neutral' | 'brand' | 'success' | 'warning' | 'error' | 'info'
}

export function ActionDock({ children, className = '', label = 'Actions', meta, tone = 'brand' }: ActionDockProps) {
  return (
    <section className={`theme-card rounded-chunks-xl border border-chunks-hairline bg-white ${className}`} aria-label={label}>
      <div className="grid gap-3 border-l-4 border-chunks-red px-4 py-3 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-center">
        <div className="min-w-0">
          <Badge className="rounded-xl px-2.5 py-1 text-[0.68rem]" tone={tone}>{label}</Badge>
          {meta ? <div className="mt-2 text-xs leading-5 text-chunks-body">{meta}</div> : null}
        </div>
        <div className="flex flex-wrap gap-2 lg:justify-end">{children}</div>
      </div>
    </section>
  )
}
