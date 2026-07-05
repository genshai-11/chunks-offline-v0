import { ThemeIconToggle, type ThemeName } from '../components/ui/ThemeSwitcher'
import { HistoryPage } from '../features/admin/HistoryPage'
import { LibraryPage } from '../features/admin/LibraryPage'
import { LearnerJoinPage } from '../features/learner/LearnerJoinPage'
import { TeacherRoomPage } from '../features/teacher/TeacherRoomPage'
import { TeacherSetupPage } from '../features/teacher/TeacherSetupPage'
import { RoleEntryPage } from './RoleEntryPage'

export type AppRoute = 'home' | 'library' | 'history' | 'teacher-setup' | 'teacher-room' | 'learner-room'

interface AppRoutesProps {
  activeTheme: ThemeName
  onThemeChange: (theme: ThemeName) => void
}

export function getRouteFromPath(pathname: string): AppRoute {
  if (pathname === '/library' || pathname === '/admin') return 'library'
  if (pathname === '/history') return 'history'
  if (pathname === '/teacher/setup') return 'teacher-setup'
  if (pathname.startsWith('/teacher/room/')) return 'teacher-room'
  if (pathname.startsWith('/room/') || pathname.startsWith('/chunks-mirror/join/')) return 'learner-room'
  return 'home'
}

export function AppRoutes({ activeTheme, onThemeChange }: AppRoutesProps) {
  const route = getRouteFromPath(window.location.pathname)

  switch (route) {
    case 'library':
      return <LibraryPage themeControl={<ThemeIconToggle activeTheme={activeTheme} onThemeChange={onThemeChange} />} />
    case 'history':
      return <HistoryPage themeControl={<ThemeIconToggle activeTheme={activeTheme} onThemeChange={onThemeChange} />} />
    case 'teacher-setup':
      return <TeacherSetupPage themeControl={<ThemeIconToggle activeTheme={activeTheme} onThemeChange={onThemeChange} />} />
    case 'teacher-room':
      return (
        <TeacherRoomPage
          roomCode={window.location.pathname.split('/').filter(Boolean).at(-1) ?? ''}
          themeControl={<ThemeIconToggle activeTheme={activeTheme} onThemeChange={onThemeChange} />}
        />
      )
    case 'learner-room':
      return (
        <LearnerJoinPage
          roomCode={window.location.pathname.split('/').filter(Boolean).at(-1) ?? ''}
          themeControl={<ThemeIconToggle activeTheme={activeTheme} onThemeChange={onThemeChange} />}
        />
      )
    case 'home':
    default:
      return <RoleEntryPage themeControl={<ThemeIconToggle activeTheme={activeTheme} onThemeChange={onThemeChange} />} />
  }
}
