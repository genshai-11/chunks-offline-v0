import type { ReactNode } from 'react'

interface NavItem {
  href: string
  label: string
  match: (pathname: string) => boolean
  icon: ReactNode
}

const navItems: NavItem[] = [
  { href: '/', label: 'Home', match: (pathname) => pathname === '/', icon: <HomeIcon /> },
  { href: '/teacher/setup', label: 'Teacher', match: (pathname) => pathname.startsWith('/teacher'), icon: <TeacherIcon /> },
  {
    href: '/room/demo',
    label: 'Learner',
    match: (pathname) => pathname.startsWith('/room') || pathname.startsWith('/chunks-mirror'),
    icon: <LearnerIcon />,
  },
  { href: '/admin', label: 'Admin', match: (pathname) => pathname.startsWith('/admin'), icon: <AdminIcon /> },
]

interface TopNavigationProps {
  action?: ReactNode
  pathname?: string
  statusLabel?: string
  themeControl?: ReactNode
}

export function TopNavigation({ action, pathname = window.location.pathname, statusLabel, themeControl }: TopNavigationProps) {
  return (
    <header className="sticky top-0 z-20 border-b border-chunks-hairline bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/85">
      <div className="mx-auto flex min-h-14 w-full max-w-7xl items-center justify-between gap-3 px-4 py-2 md:px-6">
        <div className="flex min-w-0 items-center gap-2">
          <a
            aria-label="CHUNKS home"
            className="theme-button inline-flex min-h-11 min-w-11 items-center justify-center border border-chunks-hairline bg-white text-chunks-ink transition hover:bg-chunks-control active:scale-[0.98]"
            href="/"
            title="CHUNKS home"
          >
            <BrandIcon />
          </a>
          {statusLabel ? (
            <span className="hidden max-w-40 truncate text-xs font-black uppercase tracking-[0.16em] text-chunks-body sm:block">
              {statusLabel}
            </span>
          ) : null}
        </div>

        <nav aria-label="Primary" className="flex min-h-11 items-center gap-1 rounded-full border border-chunks-hairline bg-white p-1 shadow-soft">
          {navItems.map((item) => {
            const active = item.match(pathname)
            return (
              <a
                aria-current={active ? 'page' : undefined}
                aria-label={item.label}
                className={`theme-button inline-flex min-h-10 min-w-10 items-center justify-center border border-transparent text-sm font-semibold transition active:scale-[0.98] ${
                  active ? 'bg-chunks-red text-white' : 'bg-transparent text-chunks-ink hover:bg-chunks-control'
                }`}
                href={item.href}
                key={item.href}
                title={item.label}
              >
                {item.icon}
              </a>
            )
          })}
        </nav>

        <div className="flex items-center gap-2">
          {action}
          {themeControl}
          <a
            aria-label="New room"
            className="theme-button inline-flex min-h-11 min-w-11 items-center justify-center border border-chunks-hairline bg-white text-chunks-ink transition hover:bg-chunks-control active:scale-[0.98]"
            href="/teacher/setup"
            title="New room"
          >
            <PlusIcon />
          </a>
        </div>
      </div>
    </header>
  )
}

function BrandIcon() {
  return (
    <svg aria-hidden="true" className="h-5 w-5" fill="none" viewBox="0 0 24 24">
      <path d="M5 5h14v14H5z" stroke="currentColor" strokeWidth="2" />
      <path d="M8 8h8v8H8z" fill="currentColor" />
    </svg>
  )
}

function HomeIcon() {
  return (
    <svg aria-hidden="true" className="h-5 w-5" fill="none" viewBox="0 0 24 24">
      <path d="M4 11.5 12 5l8 6.5V20h-5v-5H9v5H4v-8.5z" stroke="currentColor" strokeLinejoin="round" strokeWidth="2" />
    </svg>
  )
}

function TeacherIcon() {
  return (
    <svg aria-hidden="true" className="h-5 w-5" fill="none" viewBox="0 0 24 24">
      <path d="M4 5h16v10H4z" stroke="currentColor" strokeWidth="2" />
      <path d="M8 19h8M12 15v4M8 9h5" stroke="currentColor" strokeLinecap="round" strokeWidth="2" />
    </svg>
  )
}

function LearnerIcon() {
  return (
    <svg aria-hidden="true" className="h-5 w-5" fill="none" viewBox="0 0 24 24">
      <path d="M6 11a6 6 0 0 1 12 0v5" stroke="currentColor" strokeLinecap="round" strokeWidth="2" />
      <path d="M5 13h3v5H5zM16 13h3v5h-3z" stroke="currentColor" strokeLinejoin="round" strokeWidth="2" />
      <path d="M12 19h3" stroke="currentColor" strokeLinecap="round" strokeWidth="2" />
    </svg>
  )
}

function AdminIcon() {
  return (
    <svg aria-hidden="true" className="h-5 w-5" fill="none" viewBox="0 0 24 24">
      <path d="M5 5h6v6H5zM13 5h6v6h-6zM5 13h6v6H5zM13 13h6v6h-6z" stroke="currentColor" strokeWidth="2" />
    </svg>
  )
}

function PlusIcon() {
  return (
    <svg aria-hidden="true" className="h-5 w-5" fill="none" viewBox="0 0 24 24">
      <path d="M12 5v14M5 12h14" stroke="currentColor" strokeLinecap="round" strokeWidth="2" />
    </svg>
  )
}
