import type { ReactNode } from 'react'
import { useEffect, useId, useState } from 'react'

interface CollapsiblePanelProps {
  actions?: ReactNode
  children: ReactNode
  className?: string
  defaultOpen?: boolean
  panelId: string
  summary?: ReactNode
  title: ReactNode
  variant?: 'light' | 'dark'
}

function getStoredOpenState(panelId: string, fallback: boolean): boolean {
  try {
    const stored = window.localStorage.getItem(`chunks-panel:${panelId}`)
    if (stored === 'open') return true
    if (stored === 'closed') return false
  } catch {
    return fallback
  }
  return fallback
}

export function CollapsiblePanel({
  actions,
  children,
  className = '',
  defaultOpen = true,
  panelId,
  summary,
  title,
  variant = 'light',
}: CollapsiblePanelProps) {
  const contentId = useId()
  const [open, setOpen] = useState(() => getStoredOpenState(panelId, defaultOpen))

  useEffect(() => {
    try {
      window.localStorage.setItem(`chunks-panel:${panelId}`, open ? 'open' : 'closed')
    } catch {
      // Ignore storage failures; panel remains interactive for this session.
    }
  }, [open, panelId])

  const isDark = variant === 'dark'
  const shellClassName = isDark
    ? 'border border-chunks-hairline bg-chunks-dark text-white'
    : 'border border-chunks-hairline bg-white text-chunks-ink'
  const contentClassName = isDark
    ? 'border-t border-white/10 bg-white/5'
    : 'border-t border-chunks-hairline bg-chunks-soft/60'

  return (
    <section className={`overflow-hidden rounded-2xl ${shellClassName} ${className}`}>
      <div className="grid grid-cols-[4px_minmax(0,1fr)]">
        <span className={open ? 'bg-chunks-red' : 'bg-chunks-hairline'} aria-hidden="true" />
        <div>
          <div className="flex min-h-14 flex-wrap items-center justify-between gap-3 px-4 py-3">
            <button
              aria-controls={contentId}
              aria-expanded={open}
              className="group flex min-h-10 min-w-0 flex-1 items-center gap-3 rounded-xl text-left transition active:translate-y-px focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-chunks-red"
              onClick={() => setOpen((current) => !current)}
              type="button"
            >
              <span className={`grid h-8 w-8 shrink-0 place-items-center rounded-xl border text-sm font-black ${isDark ? 'border-white/20 bg-white/10 text-white' : 'border-chunks-hairline bg-white text-chunks-red'}`}>
                {open ? '−' : '+'}
              </span>
              <span className="min-w-0">
                <span className="block text-sm font-semibold tracking-tight">{title}</span>
                {summary ? <span className={`mt-1 block truncate text-xs ${isDark ? 'text-white/65' : 'text-chunks-body'}`}>{summary}</span> : null}
              </span>
            </button>
            {actions ? <div className="flex flex-wrap gap-2">{actions}</div> : null}
          </div>
          {open ? <div className={`${contentClassName} p-4`} id={contentId}>{children}</div> : null}
        </div>
      </div>
    </section>
  )
}
