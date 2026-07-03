import type { ReactNode } from 'react'

type Tone = 'info' | 'warning' | 'error' | 'success'

const toneClassName: Record<Tone, string> = {
  info: 'border-chunks-hairline bg-chunks-soft text-chunks-body',
  warning: 'border-yellow-200 bg-yellow-50 text-yellow-800',
  error: 'border-red-200 bg-red-50 text-red-800',
  success: 'border-green-200 bg-green-50 text-green-800',
}

interface AlertProps {
  children: ReactNode
  className?: string
  title: string
  tone?: Tone
}

export function Alert({ children, className = '', title, tone = 'info' }: AlertProps) {
  return (
    <section className={`theme-alert rounded-2xl border p-4 ${toneClassName[tone]} ${className}`} role="status">
      <h2 className="font-semibold text-chunks-ink">{title}</h2>
      <div className="mt-1 text-sm leading-6">{children}</div>
    </section>
  )
}
