import type { ReactNode } from 'react'

interface WorkspaceLayoutProps {
  primary: ReactNode
  secondary?: ReactNode
  className?: string
}

export function WorkspaceLayout({ className = '', primary, secondary }: WorkspaceLayoutProps) {
  return (
    <div className={`grid gap-5 xl:grid-cols-[minmax(0,1.45fr)_minmax(320px,0.72fr)] ${className}`}>
      <div className="min-w-0 space-y-5">{primary}</div>
      {secondary ? <aside className="min-w-0 space-y-5 xl:sticky xl:top-28 xl:self-start">{secondary}</aside> : null}
    </div>
  )
}
