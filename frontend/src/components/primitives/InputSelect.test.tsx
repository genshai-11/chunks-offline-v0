import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'

import { Input } from './Input'
import { Select } from './Select'

describe('Field primitives', () => {
  it('shows helper and disabled explanation text on inputs', () => {
    render(<Input disabled disabledExplanation="Unavailable until the room opens" helperText="Enter a room name" label="Room" placeholder="Room A" />)

    expect(screen.getByRole('textbox', { name: /Room/ })).toBeDisabled()
    expect(screen.getByText('Enter a room name')).toBeInTheDocument()
    expect(screen.getByText('Unavailable until the room opens')).toBeInTheDocument()
  })

  it('supports keyboard selection on selects', async () => {
    const user = userEvent.setup()
    render(
      <Select label="Theme" defaultValue="bauhaus">
        <option value="calm">Calm</option>
        <option value="bauhaus">Bauhaus</option>
      </Select>,
    )

    const select = screen.getByLabelText('Theme')
    await user.selectOptions(select, 'calm')
    expect((select as HTMLSelectElement).value).toBe('calm')
  })
})
