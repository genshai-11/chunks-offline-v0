import type { ReactNode } from 'react'

import { Badge, Card } from '../primitives'
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
    <main className="theme-shell min-h-[100dvh] bg-chunks-canvas text-chunks-ink lg:grid lg:grid-cols-[11.75rem_minmax(0,1fr)]">
      <TopNavigation statusLabel={statusLabel} />

      <div className="min-w-0">
        <header className="sticky top-0 z-10 border-b border-chunks-hairline bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/90">
          <div className="mx-auto flex w-full max-w-[88rem] items-center justify-between gap-3 px-4 py-3 md:px-5">
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                {eyebrow ? <Badge className="rounded-xl px-2.5 py-1 text-[0.68rem]" tone="brand">{eyebrow}</Badge> : null}
                {statusLabel ? <span className="hidden text-[0.68rem] font-black uppercase tracking-[0.18em] text-chunks-body sm:inline">{statusLabel}</span> : null}
              </div>
              <div className="mt-1 flex flex-wrap items-baseline gap-x-3 gap-y-1">
                <h1 className="theme-hero-title truncate text-2xl font-semibold tracking-tight md:text-3xl">{title}</h1>
                {description ? <p className="max-w-[54ch] truncate text-sm leading-6 text-chunks-body">{description}</p> : null}
              </div>
            </div>

            <div className="flex shrink-0 items-center gap-2">
              {action}
              {themeControl}
            </div>
          </div>
        </header>

        <section className="mx-auto w-full max-w-[88rem] px-4 py-4 md:px-5 md:py-5">
          {headerMeta ? <Card className="mb-4" padding="sm">{headerMeta}</Card> : null}
          {children}
        </section>
      </div>
    </main>
  )
}

