import type { ReactNode } from 'react'

interface ActionDockProps {
  children: ReactNode
  className?: string
  label?: string
  meta?: ReactNode
}

export function ActionDock({ children, className = '', label = 'Actions', meta }: ActionDockProps) {
  return (
    <section className={`theme-card rounded-3xl border border-chunks-hairline bg-white p-4 shadow-soft ${className}`} aria-label={label}>
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        {meta ? <div className="min-w-0 text-sm leading-6 text-chunks-body">{meta}</div> : <span className="text-sm font-semibold text-chunks-body">{label}</span>}
        <div className="flex flex-wrap gap-3">{children}</div>
      </div>
    </section>
  )
}
