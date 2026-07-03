import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { TopNavigation } from '../../src/components/layout/TopNavigation'
import { CollapsiblePanel } from '../../src/components/ui/CollapsiblePanel'
import { ThemeIconToggle } from '../../src/components/ui/ThemeSwitcher'

describe('layout dynamic components', () => {
  beforeEach(() => {
    window.localStorage.clear()
  })

  it('renders route navigation with active Teacher state', () => {
    render(<TopNavigation pathname="/teacher/setup" statusLabel="Create Room" />)

    expect(screen.getByRole('navigation', { name: /primary/i })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Teacher' })).toHaveAttribute('aria-current', 'page')
    expect(screen.getByRole('link', { name: 'Home' })).toHaveAttribute('href', '/')
    expect(screen.getByText('Create Room')).toBeInTheDocument()
  })

  it('cycles through Modular and Craft themes with icon-only toggle', async () => {
    const user = userEvent.setup()
    const onThemeChange = vi.fn()

    const { rerender } = render(<ThemeIconToggle activeTheme="bauhaus" onThemeChange={onThemeChange} />)

    await user.click(screen.getByRole('button', { name: /switch to modular theme/i }))
    expect(onThemeChange).toHaveBeenCalledWith('modular')

    rerender(<ThemeIconToggle activeTheme="modular" onThemeChange={onThemeChange} />)
    await user.click(screen.getByRole('button', { name: /switch to craft theme/i }))
    expect(onThemeChange).toHaveBeenCalledWith('craft')
  })

  it('collapses, expands, and persists panel state', async () => {
    const user = userEvent.setup()
    const { rerender } = render(
      <CollapsiblePanel panelId="test-panel" title="Resource scope" summary="2 sections">
        <p>Panel content</p>
      </CollapsiblePanel>,
    )

    expect(screen.getByText('Panel content')).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: /resource scope/i }))
    expect(screen.queryByText('Panel content')).not.toBeInTheDocument()
    expect(window.localStorage.getItem('chunks-panel:test-panel')).toBe('closed')

    rerender(
      <CollapsiblePanel panelId="test-panel" title="Resource scope" summary="2 sections">
        <p>Panel content</p>
      </CollapsiblePanel>,
    )
    expect(screen.queryByText('Panel content')).not.toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: /resource scope/i }))
    expect(screen.getByText('Panel content')).toBeInTheDocument()
    expect(window.localStorage.getItem('chunks-panel:test-panel')).toBe('open')
  })
})
