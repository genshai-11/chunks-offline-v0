import { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'

import { Badge } from './Badge'
import { Button, ButtonLink } from './Button'
import { Card, CardContent, CardFooter, CardHeader } from './Card'
import { Dialog } from './Dialog'
import { Input } from './Input'
import { Panel } from './Panel'
import { Progress } from './Progress'
import { Select } from './Select'
import { Skeleton } from './Skeleton'
import { Toast } from './Toast'
import { Tooltip } from './Tooltip'

const meta = {
  title: 'Component Library/Primitives',
  parameters: {
    layout: 'fullscreen',
  },
} satisfies Meta

export default meta

type Story = StoryObj<typeof meta>

export const Buttons: Story = {
  render: () => (
    <div className="grid max-w-3xl gap-4">
      <div className="flex flex-wrap gap-3">
        <Button variant="primary">Primary</Button>
        <Button variant="secondary">Secondary</Button>
        <Button variant="ghost">Ghost</Button>
        <Button variant="destructive">Destructive</Button>
      </div>
      <div className="flex flex-wrap gap-3">
        <Button loading>Loading</Button>
        <Button disabled disabledReason="Round is closed">Disabled with reason</Button>
        <ButtonLink href="#" variant="secondary">Button link</ButtonLink>
      </div>
    </div>
  ),
}

export const SurfacesAndBadges: Story = {
  render: () => (
    <div className="grid max-w-4xl gap-5 md:grid-cols-2">
      <Card>
        <CardHeader>
          <Badge tone="brand">Teacher Host</Badge>
          <h2 className="text-xl font-semibold">Reusable card</h2>
        </CardHeader>
        <CardContent className="mt-4 text-sm leading-6 text-chunks-body">
          Cards expose slots for headers, content, and footers while preserving the selected CHUNKS theme.
        </CardContent>
        <CardFooter>
          <Button size="sm">Open teacher card</Button>
        </CardFooter>
      </Card>
      <Panel className="space-y-4" variant="surface">
        <h2 className="text-xl font-semibold">Semantic badges</h2>
        <div className="flex flex-wrap gap-2">
          <Badge tone="neutral">Neutral</Badge>
          <Badge tone="info">Info</Badge>
          <Badge tone="success">Success</Badge>
          <Badge tone="warning">Warning</Badge>
          <Badge tone="error">Error</Badge>
        </div>
      </Panel>
    </div>
  ),
}

export const FormControls: Story = {
  render: () => (
    <div className="grid max-w-2xl gap-5">
      <Input helperText="Visible helper copy for classroom operators." label="Room name" placeholder="Morning practice" />
      <Input disabled disabledExplanation="Enable after a room is selected." label="Locked field" placeholder="Unavailable" />
      <Select helperText="Native select keeps keyboard behavior." label="Theme" defaultValue="bauhaus">
        <option value="calm">Theme 1 — Calm classroom</option>
        <option value="bauhaus">Theme 2 — Bauhaus poster</option>
        <option value="craft">Theme 4 — Craft minimal</option>
      </Select>
    </div>
  ),
}

export const TooltipAndDialog: Story = {
  render: () => {
    const [open, setOpen] = useState(false)

    return (
      <div className="grid max-w-2xl gap-5">
        <Tooltip content="Disabled learners need a clear explanation before they can respond.">
          <Button variant="secondary">Focus or hover for tooltip</Button>
        </Tooltip>
        <Button onClick={() => setOpen(true)}>Open dialog</Button>
        <Dialog description="Confirmation dialogs preserve focus and close with Escape." onOpenChange={setOpen} open={open} title="Confirm batch action" variant="confirmation">
          <div className="flex flex-wrap justify-end gap-3">
            <Button onClick={() => setOpen(false)} variant="secondary">Cancel</Button>
            <Button onClick={() => setOpen(false)} variant="destructive">Confirm</Button>
          </div>
        </Dialog>
      </div>
    )
  },
}

export const FeedbackAndLoading: Story = {
  render: () => (
    <div className="grid max-w-3xl gap-6">
      <Toast description="This toast uses aria-live and can include an action." duration={0} title="Resource saved" tone="success" action={<Button size="sm" variant="secondary">Undo</Button>} />
      <Progress label="Learner responses captured" showValue value={72} />
      <Progress label="Completion" showValue value={45} variant="circular" />
      <div className="grid gap-3 rounded-3xl border border-chunks-hairline bg-white p-5 shadow-soft">
        <Skeleton className="h-5 w-2/3" />
        <Skeleton className="h-24 w-full" rounded="lg" />
        <Skeleton className="h-10 w-32" rounded="full" />
      </div>
    </div>
  ),
}
