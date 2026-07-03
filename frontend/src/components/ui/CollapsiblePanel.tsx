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

  const variantClassName =
    variant === 'dark'
      ? 'theme-card theme-card-dark border border-chunks-hairline bg-chunks-dark text-white shadow-soft'
      : 'theme-card border border-chunks-hairline bg-white text-chunks-ink shadow-soft'

  return (
    <section className={`rounded-3xl ${variantClassName} ${className}`}>
      <div className="flex min-h-16 flex-wrap items-center justify-between gap-3 p-4 md:p-5">
        <button
          aria-controls={contentId}
          aria-expanded={open}
          className="group flex min-h-11 min-w-0 flex-1 items-center gap-3 text-left active:scale-[0.99]"
          onClick={() => setOpen((current) => !current)}
          type="button"
        >
          <span className="flex h-8 w-8 shrink-0 items-center justify-center border border-current text-sm font-black">
            {open ? '−' : '+'}
          </span>
          <span className="min-w-0">
            <span className="block text-base font-semibold">{title}</span>
            {summary ? <span className="mt-1 block text-sm opacity-75">{summary}</span> : null}
          </span>
        </button>
        {actions ? <div className="flex flex-wrap gap-2">{actions}</div> : null}
      </div>
      {open ? <div className="border-t border-chunks-hairline p-4 md:p-5" id={contentId}>{children}</div> : null}
    </section>
  )
}
