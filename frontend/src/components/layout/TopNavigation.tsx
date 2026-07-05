import type { ReactNode } from 'react'
import { SideNav, SideNavHeading, SideNavItem, SideNavSection } from '@astryxdesign/core/SideNav'

interface NavItem {
  href: string
  label: string
  match: (locationKey: string) => boolean
  icon: ReactNode
}

const navItems: NavItem[] = [
  { href: '/', label: 'Dashboard', match: (locationKey) => locationKey === '/', icon: <DashboardIcon /> },
  { href: '/library', label: 'Library', match: (locationKey) => locationKey === '/library' || locationKey === '/admin', icon: <LibraryIcon /> },
  { href: '/history', label: 'History', match: (locationKey) => locationKey === '/history', icon: <HistoryIcon /> },
  { href: '/teacher/setup', label: 'Create Room', match: (locationKey) => locationKey === '/teacher/setup', icon: <CreateRoomIcon /> },
  { href: '/teacher/setup', label: 'Live Room', match: (locationKey) => locationKey.startsWith('/teacher/room/'), icon: <LiveRoomIcon /> },
  {
    href: '/room/demo',
    label: 'Learner',
    match: (locationKey) => locationKey.startsWith('/room') || locationKey.startsWith('/chunks-mirror'),
    icon: <LearnerIcon />,
  },
]

function getFilteredNavItems(locationKey: string) {
  if (isLearnerRoute(locationKey)) return navItems.filter((item) => item.label === 'Dashboard' || item.label === 'Learner')
  return navItems
}

function isLearnerRoute(locationKey: string): boolean {
  return locationKey.startsWith('/room') || locationKey.startsWith('/chunks-mirror')
}

interface TopNavigationProps {
  action?: ReactNode
  pathname?: string
  statusLabel?: string
  themeControl?: ReactNode
}

export function TopNavigation({ pathname = `${window.location.pathname}${window.location.hash}` }: TopNavigationProps) {
  const locationKey = pathname

  const visibleItems = getFilteredNavItems(locationKey)

  return (
    <aside className="overflow-hidden border-b border-chunks-hairline bg-white text-chunks-ink lg:sticky lg:top-0 lg:h-[100dvh] lg:border-b-0 lg:border-r">
      <div className="chunks-side-nav-rail hidden h-full min-w-0 overflow-hidden lg:block">
        <SideNav
          header={
            <SideNavHeading
              heading="CHUNKS"
              headingHref="/"
              icon={<BrandIcon />}
            />
          }
        >
          <SideNavSection title="Product areas" isHeaderHidden>
            {visibleItems.map((item) => {
              const active = item.match(locationKey)
              return (
                <SideNavItem
                  href={item.href}
                  icon={item.icon}
                  isSelected={active}
                  key={`${item.href}-${item.label}`}
                  label={item.label}
                  selectedIcon={item.icon}
                />
              )
            })}
          </SideNavSection>
        </SideNav>
      </div>

      <div className="flex min-h-14 items-center gap-2 overflow-x-auto px-3 lg:hidden">
        <a
          aria-label="CHUNKS dashboard home"
          className="flex h-10 shrink-0 items-center gap-2 rounded-xl px-2 text-sm font-black tracking-tight text-chunks-red transition hover:bg-chunks-soft focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-chunks-red"
          href="/"
        >
          <BrandIcon />
          <span>CHUNKS</span>
        </a>
        <nav aria-label="Primary" className="flex min-w-0 flex-1 items-center gap-1 overflow-x-auto">
          {visibleItems.map((item) => {
            const active = item.match(locationKey)
            return (
              <a
                aria-current={active ? 'page' : undefined}
                aria-label={item.label}
                className={`relative flex h-10 min-h-10 shrink-0 items-center gap-2 rounded-xl px-2 text-sm transition active:translate-y-px focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-chunks-red ${
                  active ? 'bg-chunks-soft text-chunks-red' : 'text-chunks-body hover:bg-chunks-soft hover:text-chunks-ink'
                }`}
                href={item.href}
                key={`${item.href}-${item.label}`}
                title={item.label}
              >
                <span className={`grid h-7 w-7 place-items-center rounded-lg ${active ? 'bg-white text-chunks-red' : 'bg-white text-chunks-body'}`}>{item.icon}</span>
                <span className="hidden min-w-0 font-semibold sm:block">{item.label}</span>
              </a>
            )
          })}
        </nav>
      </div>
    </aside>
  )
}

function BrandIcon() {
  return (
    <svg aria-hidden="true" className="h-4 w-4" fill="none" viewBox="0 0 24 24">
      <path d="M5 5h14v14H5z" stroke="currentColor" strokeWidth="2" />
      <path d="M8 8h8v8H8z" fill="currentColor" />
    </svg>
  )
}

function DashboardIcon() {
  return (
    <svg aria-hidden="true" className="h-4 w-4" fill="none" viewBox="0 0 24 24">
      <path d="M4 11.5 12 5l8 6.5V20h-5v-5H9v5H4v-8.5z" stroke="currentColor" strokeLinejoin="round" strokeWidth="2" />
    </svg>
  )
}

function LibraryIcon() {
  return (
    <svg aria-hidden="true" className="h-4 w-4" fill="none" viewBox="0 0 24 24">
      <path d="M6 4h12v16H6zM9 8h6M9 12h6M9 16h4" stroke="currentColor" strokeLinecap="round" strokeWidth="2" />
    </svg>
  )
}

function CreateRoomIcon() {
  return (
    <svg aria-hidden="true" className="h-4 w-4" fill="none" viewBox="0 0 24 24">
      <path d="M4 5h16v10H4z" stroke="currentColor" strokeWidth="2" />
      <path d="M8 19h8M12 15v4M8 9h5" stroke="currentColor" strokeLinecap="round" strokeWidth="2" />
    </svg>
  )
}

function LiveRoomIcon() {
  return (
    <svg aria-hidden="true" className="h-4 w-4" fill="none" viewBox="0 0 24 24">
      <path d="M5 6h14v9H5z" stroke="currentColor" strokeLinejoin="round" strokeWidth="2" />
      <path d="M8 18h8M12 15v3M8 10h3M14 10h2" stroke="currentColor" strokeLinecap="round" strokeWidth="2" />
      <path d="M18 18l2 2M6 18l-2 2" stroke="currentColor" strokeLinecap="round" strokeWidth="1.7" />
    </svg>
  )
}

function LearnerIcon() {
  return (
    <svg aria-hidden="true" className="h-4 w-4" fill="none" viewBox="0 0 24 24">
      <path d="M6 11a6 6 0 0 1 12 0v5" stroke="currentColor" strokeLinecap="round" strokeWidth="2" />
      <path d="M5 13h3v5H5zM16 13h3v5h-3z" stroke="currentColor" strokeLinejoin="round" strokeWidth="2" />
      <path d="M12 19h3" stroke="currentColor" strokeLinecap="round" strokeWidth="2" />
    </svg>
  )
}

function HistoryIcon() {
  return (
    <svg aria-hidden="true" className="h-4 w-4" fill="none" viewBox="0 0 24 24">
      <path d="M5 5h14v14H5z" stroke="currentColor" strokeWidth="2" />
      <path d="M8 9h8M8 13h5M8 17h7" stroke="currentColor" strokeLinecap="round" strokeWidth="2" />
      <path d="M17 5v14" stroke="currentColor" strokeLinecap="round" strokeWidth="1.5" />
    </svg>
  )
}
