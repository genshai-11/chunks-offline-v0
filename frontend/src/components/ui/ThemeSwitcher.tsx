export type ThemeName = 'calm' | 'bauhaus' | 'modular' | 'craft'

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
    value: 'modular',
    label: 'Theme 3',
    description: 'Modular learning',
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
    <section className="theme-card bg-white p-4 shadow-soft" aria-labelledby="theme-switcher-title">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 id="theme-switcher-title" className="text-sm font-bold uppercase tracking-wider text-chunks-ink">
            Design theme
          </h2>
          <p className="mt-1 text-xs font-medium text-chunks-body">Admin visual style control</p>
        </div>
        <div className="flex flex-wrap gap-2" role="radiogroup" aria-label="Design theme">
          {themeOptions.map((theme) => {
            const selected = theme.value === activeTheme
            return (
              <button
                aria-checked={selected}
                className={`theme-button min-h-11 border px-4 py-2 text-left text-sm transition ${
                  selected
                    ? 'border-chunks-border bg-chunks-red text-white'
                    : 'border-chunks-hairline bg-chunks-control text-chunks-ink hover:bg-chunks-soft'
                }`}
                key={theme.value}
                onClick={() => onThemeChange(theme.value)}
                role="radio"
                type="button"
              >
                <span className="block font-bold uppercase tracking-wider">{theme.label}</span>
                <span className="block text-xs opacity-80">{theme.description}</span>
              </button>
            )
          })}
        </div>
      </div>
    </section>
  )
}

export function ThemeIconToggle({ activeTheme, onThemeChange }: ThemeSwitcherProps) {
  const nextTheme = getNextTheme(activeTheme)
  const label = `Switch to ${getThemeLabel(nextTheme)}`

  return (
    <button
      aria-label={label}
      className="theme-button inline-flex min-h-11 min-w-11 items-center justify-center border border-chunks-hairline bg-white text-chunks-ink transition hover:bg-chunks-control active:scale-[0.98]"
      onClick={() => onThemeChange(nextTheme)}
      title={label}
      type="button"
    >
      {activeTheme === 'bauhaus' ? <BauhausThemeIcon /> : activeTheme === 'modular' ? <ModularThemeIcon /> : activeTheme === 'craft' ? <CraftThemeIcon /> : <CalmThemeIcon />}
    </button>
  )
}

function getNextTheme(theme: ThemeName): ThemeName {
  if (theme === 'calm') return 'bauhaus'
  if (theme === 'bauhaus') return 'modular'
  if (theme === 'modular') return 'craft'
  return 'calm'
}

function getThemeLabel(theme: ThemeName): string {
  if (theme === 'bauhaus') return 'Bauhaus theme'
  if (theme === 'modular') return 'Modular theme'
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

function ModularThemeIcon() {
  return (
    <svg aria-hidden="true" className="h-5 w-5" fill="none" viewBox="0 0 24 24">
      <path d="M12 3v5M12 16v5M3 12h5M16 12h5" stroke="currentColor" strokeLinecap="round" strokeWidth="2" />
      <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="2" />
      <circle cx="12" cy="12" fill="currentColor" r="1.5" />
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
