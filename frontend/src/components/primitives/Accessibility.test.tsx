import { render } from '@testing-library/react'
import { axe, toHaveNoViolations } from 'jest-axe'
import { describe, expect, it } from 'vitest'

import { ThemeSwitcher } from '../ui/ThemeSwitcher'
import { RoleEntryPage } from '../../routes/RoleEntryPage'
import { Badge } from './Badge'
import { Button } from './Button'
import { Card } from './Card'
import { Input } from './Input'
import { Progress } from './Progress'
import { Select } from './Select'
import { Toast } from './Toast'

expect.extend(toHaveNoViolations)

describe('component foundation accessibility', () => {
  it('has no axe violations for the refactored role entry flow', async () => {
    const { container } = render(<RoleEntryPage />)

    expect(await axe(container)).toHaveNoViolations()
  })

  it('has no axe violations for primitives and theme switcher', async () => {
    const { container } = render(
      <div>
        <ThemeSwitcher activeTheme="bauhaus" onThemeChange={() => undefined} />
        <Card className="mt-4">
          <Badge tone="success">Ready</Badge>
          <div className="mt-4 grid gap-4">
            <Button disabled disabledReason="Round is closed">Respond</Button>
            <Input disabled disabledExplanation="Teacher has not opened the room yet." label="Room code" />
            <Select label="Theme" defaultValue="bauhaus">
              <option value="calm">Calm</option>
              <option value="bauhaus">Bauhaus</option>
            </Select>
            <Progress label="Captured responses" showValue value={50} />
            <Toast duration={0} title="Saved" tone="success" />
          </div>
        </Card>
      </div>,
    )

    expect(await axe(container)).toHaveNoViolations()
  })
})
