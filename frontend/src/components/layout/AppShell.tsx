import type { ReactNode } from 'react'

import { StatusBadge } from '../ui/StatusBadge'
import { TopNavigation } from './TopNavigation'

interface AppShellProps {
  action?: ReactNode
  children: ReactNode
  description?: ReactNode
  eyebrow?: string
  headerMeta?: ReactNode
  statusLabel?: string
  themeControl?: ReactNode
  title: ReactNode
}

export function AppShell({
  action,
  children,
  description,
  eyebrow,
  headerMeta,
  statusLabel,
  themeControl,
  title,
}: AppShellProps) {
  return (
    <main className="theme-shell min-h-[100dvh] bg-chunks-canvas text-chunks-ink">
      <TopNavigation action={action} statusLabel={statusLabel} themeControl={themeControl} />
      <section className="mx-auto w-full max-w-7xl px-4 py-6 md:px-6 md:py-8">
        <div className="grid gap-5 border-b border-chunks-hairline pb-6 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end">
          <div>
            {eyebrow ? <StatusBadge tone="brand">{eyebrow}</StatusBadge> : null}
            <h1 className="theme-hero-title mt-4 max-w-4xl text-4xl font-normal tracking-tight md:text-6xl">
              {title}
            </h1>
            {description ? <p className="mt-4 max-w-[65ch] text-base leading-relaxed text-chunks-body">{description}</p> : null}
          </div>
          {headerMeta ? <div className="lg:min-w-80">{headerMeta}</div> : null}
        </div>
        <div className="py-6">{children}</div>
      </section>
    </main>
  )
}
