import { useEffect, useState } from 'react'
import { AppRoutes } from '../routes/AppRoutes'
import type { ThemeName } from '../components/ui/ThemeSwitcher'

const themeStorageKey = 'chunks-active-theme'

function getInitialTheme(): ThemeName {
  const storedTheme = window.localStorage.getItem(themeStorageKey)
  return storedTheme === 'calm' || storedTheme === 'bauhaus' || storedTheme === 'modular' || storedTheme === 'craft' ? storedTheme : 'bauhaus'
}

export function App() {
  const [activeTheme, setActiveTheme] = useState<ThemeName>(getInitialTheme)

  useEffect(() => {
    window.localStorage.setItem(themeStorageKey, activeTheme)
  }, [activeTheme])

  return (
    <div data-theme={activeTheme}>
      <AppRoutes activeTheme={activeTheme} onThemeChange={setActiveTheme} />
    </div>
  )
}
