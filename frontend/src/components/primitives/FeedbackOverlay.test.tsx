import { act } from 'react'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'

import { Button } from './Button'
import { Dialog } from './Dialog'
import { Progress } from './Progress'
import { Skeleton } from './Skeleton'
import { Toast } from './Toast'
import { Tooltip } from './Tooltip'

describe('overlay and feedback primitives', () => {
  it('shows tooltip content on hover', async () => {
    const user = userEvent.setup()

    render(
      <Tooltip content="Round is closed">
        <Button>Response unavailable</Button>
      </Tooltip>,
    )

    await user.hover(screen.getByRole('button', { name: 'Response unavailable' }))
    expect(screen.getByRole('tooltip')).toHaveTextContent('Round is closed')
  })

  it('renders dialog with accessible title and closes on Escape', async () => {
    const user = userEvent.setup()
    const onOpenChange = vi.fn()

    render(
      <Dialog onOpenChange={onOpenChange} open title="Confirm action" variant="confirmation">
        <Button>Confirm</Button>
      </Dialog>,
    )

    expect(screen.getByRole('alertdialog', { name: 'Confirm action' })).toBeInTheDocument()
    await user.keyboard('{Escape}')
    expect(onOpenChange).toHaveBeenCalledWith(false)
  })

  it('auto-dismisses toast notifications', () => {
    vi.useFakeTimers()
    const onOpenChange = vi.fn()

    render(<Toast duration={1000} onOpenChange={onOpenChange} title="Saved" tone="success" />)
    act(() => {
      vi.advanceTimersByTime(1000)
    })

    expect(onOpenChange).toHaveBeenCalledWith(false)
    vi.useRealTimers()
  })

  it('reports progress values and renders skeleton placeholders', () => {
    render(
      <div>
        <Progress label="Captured" showValue value={40} />
        <Skeleton className="h-8 w-20" data-testid="skeleton" />
      </div>,
    )

    expect(screen.getByRole('progressbar')).toHaveAttribute('aria-valuenow', '40')
    expect(screen.getByText('40%')).toBeInTheDocument()
    expect(screen.getByTestId('skeleton')).toHaveAttribute('aria-hidden', 'true')
  })
})
