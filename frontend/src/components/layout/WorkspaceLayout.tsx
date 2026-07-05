import type { ReactNode } from 'react'

interface WorkspaceLayoutProps {
  primary: ReactNode
  secondary?: ReactNode
  className?: string
}

export function WorkspaceLayout({ className = '', primary, secondary }: WorkspaceLayoutProps) {
  return (
    <div className={`grid gap-5 2xl:grid-cols-[minmax(0,1.55fr)_minmax(360px,0.72fr)] ${className}`}>
      <div className="min-w-0 space-y-5">{primary}</div>
      {secondary ? <aside className="min-w-0 space-y-5 2xl:sticky 2xl:top-28 2xl:self-start" aria-label="Workspace inspector">{secondary}</aside> : null}
    </div>
  )
}
