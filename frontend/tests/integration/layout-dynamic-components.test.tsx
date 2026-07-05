import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { TopNavigation } from '../../src/components/layout/TopNavigation'
import { CollapsiblePanel } from '../../src/components/ui/CollapsiblePanel'
import { ThemeIconToggle } from '../../src/components/ui/ThemeSwitcher'

describe('layout dynamic components', () => {
  beforeEach(() => {
    window.localStorage.clear()
  })

  it('renders truthful route navigation without fake Users, Settings, or Help destinations', () => {
    render(<TopNavigation pathname="/teacher/setup" statusLabel="Create Room" />)

    const primaryNav = within(screen.getByRole('navigation', { name: /primary/i }))

    expect(primaryNav.getByRole('link', { name: 'Create Room' })).toHaveAttribute('aria-current', 'page')
    expect(primaryNav.getByRole('link', { name: 'Live Room' })).toHaveAttribute('href', '/teacher/setup')
    expect(primaryNav.getByRole('link', { name: 'Dashboard' })).toHaveAttribute('href', '/')
    expect(primaryNav.getByRole('link', { name: 'Library' })).toHaveAttribute('href', '/library')
    expect(primaryNav.getByRole('link', { name: 'History' })).toHaveAttribute('href', '/history')
    expect(primaryNav.queryByRole('link', { name: 'Teacher' })).not.toBeInTheDocument()
    expect(screen.queryByRole('link', { name: 'Users' })).not.toBeInTheDocument()
    expect(screen.queryByRole('link', { name: 'Settings' })).not.toBeInTheDocument()
    expect(screen.queryByRole('link', { name: 'Help' })).not.toBeInTheDocument()
    expect(screen.getAllByText('Create Room').length).toBeGreaterThanOrEqual(1)
  })

  it('cycles through themes with icon-only toggle', async () => {
    const user = userEvent.setup()
    const onThemeChange = vi.fn()

    const { rerender } = render(<ThemeIconToggle activeTheme="bauhaus" onThemeChange={onThemeChange} />)

    await user.click(screen.getByRole('button', { name: /switch to craft theme/i }))
    expect(onThemeChange).toHaveBeenCalledWith('craft')

    rerender(<ThemeIconToggle activeTheme="craft" onThemeChange={onThemeChange} />)
    await user.click(screen.getByRole('button', { name: /switch to calm theme/i }))
    expect(onThemeChange).toHaveBeenCalledWith('calm')
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
