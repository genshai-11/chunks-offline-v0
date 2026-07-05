import { Badge, Button, Panel } from '../primitives'

export type ThemeName = 'calm' | 'bauhaus' | 'craft'

const themeOptions: Array<{ value: ThemeName; label: string; description: string }> = [
  {
    value: 'calm',
    label: 'Theme 1',
    description: 'Calm console',
  },
  {
    value: 'bauhaus',
    label: 'Theme 2',
    description: 'Bauhaus poster',
  },
  {
    value: 'craft',
    label: 'Theme 4',
    description: 'Craft minimal',
  },
]

interface ThemeSwitcherProps {
  activeTheme: ThemeName
  onThemeChange: (theme: ThemeName) => void
}

export function ThemeSwitcher({ activeTheme, onThemeChange }: ThemeSwitcherProps) {
  return (
    <Panel aria-labelledby="theme-switcher-title" as="section" compact variant="surface">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <Badge tone="brand">Design theme</Badge>
          <h2 id="theme-switcher-title" className="mt-2 text-sm font-bold uppercase tracking-wider text-chunks-ink">
            Visual language control
          </h2>
          <p className="mt-1 text-xs font-medium text-chunks-body">Admin visual style control</p>
        </div>
        <div className="flex flex-wrap gap-2" role="radiogroup" aria-label="Design theme">
          {themeOptions.map((theme) => {
            const selected = theme.value === activeTheme
            return (
              <Button
                aria-checked={selected}
                className="justify-start text-left"
                key={theme.value}
                onClick={() => onThemeChange(theme.value)}
                role="radio"
                size="sm"
                type="button"
                variant={selected ? 'primary' : 'secondary'}
              >
                <span className="block">
                  <span className="block font-bold uppercase tracking-wider">{theme.label}</span>
                  <span className="block text-xs opacity-80">{theme.description}</span>
                </span>
              </Button>
            )
          })}
        </div>
      </div>
    </Panel>
  )
}

export function ThemeIconToggle({ activeTheme, onThemeChange }: ThemeSwitcherProps) {
  const nextTheme = getNextTheme(activeTheme)
  const label = `Switch to ${getThemeLabel(nextTheme)}`

  return (
    <Button
      aria-label={label}
      className="min-w-11 px-0"
      onClick={() => onThemeChange(nextTheme)}
      size="md"
      title={label}
      type="button"
      variant="secondary"
    >
      {activeTheme === 'bauhaus' ? <BauhausThemeIcon /> : activeTheme === 'craft' ? <CraftThemeIcon /> : <CalmThemeIcon />}
    </Button>
  )
}

function getNextTheme(theme: ThemeName): ThemeName {
  if (theme === 'calm') return 'bauhaus'
  if (theme === 'bauhaus') return 'craft'
  return 'calm'
}

function getThemeLabel(theme: ThemeName): string {
  if (theme === 'bauhaus') return 'Bauhaus theme'
  if (theme === 'craft') return 'Craft theme'
  return 'Calm theme'
}

function BauhausThemeIcon() {
  return (
    <svg aria-hidden="true" className="h-5 w-5" fill="none" viewBox="0 0 24 24">
      <circle cx="8" cy="8" fill="currentColor" r="4" />
      <path d="M14 5h6v6h-6z" stroke="currentColor" strokeWidth="2" />
      <path d="M7 16l4 4H3l4-4z" fill="currentColor" />
      <path d="M15 16h6" stroke="currentColor" strokeLinecap="round" strokeWidth="2" />
    </svg>
  )
}

function CalmThemeIcon() {
  return (
    <svg aria-hidden="true" className="h-5 w-5" fill="none" viewBox="0 0 24 24">
      <path d="M4 7h16M4 12h16M4 17h10" stroke="currentColor" strokeLinecap="round" strokeWidth="2" />
      <circle cx="18" cy="17" fill="currentColor" r="2" />
    </svg>
  )
}

function CraftThemeIcon() {
  return (
    <svg aria-hidden="true" className="h-5 w-5" fill="none" viewBox="0 0 24 24">
      <path d="M5 7h14M5 12h10M5 17h14" stroke="currentColor" strokeLinecap="round" strokeWidth="2" />
      <path d="M17 10l2 2-2 2" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
    </svg>
  )
}
