import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'

import { Button } from './Button'

describe('Button primitive', () => {
  it('renders loading and disabled states accessibly', () => {
    render(
      <Button disabledReason="No active round" loading variant="destructive">
        Submit
      </Button>,
    )

    const button = screen.getByRole('button', { name: 'Submit' })
    expect(button).toBeDisabled()
    expect(button).toHaveAttribute('aria-busy', 'true')
    expect(button).toHaveAttribute('title', 'No active round')
  })

  it('invokes clicks when enabled', async () => {
    const user = userEvent.setup()
    const onClick = vi.fn()

    render(<Button onClick={onClick}>Save</Button>)

    await user.click(screen.getByRole('button', { name: 'Save' }))
    expect(onClick).toHaveBeenCalledTimes(1)
  })
})
