import type { ReactNode } from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'

import { Badge } from './Badge'
import { Button } from './Button'
import { Card, CardContent, CardFooter, CardHeader } from './Card'
import { Panel } from './Panel'
import { Progress } from './Progress'

const meta = {
  title: 'Component Library/Selected Role Layouts',
  parameters: {
    layout: 'fullscreen',
  },
} satisfies Meta

export default meta

type Story = StoryObj<typeof meta>

function StoryCanvas({ children }: { children: ReactNode }) {
  return <div className="min-h-screen bg-chunks-canvas p-6 text-chunks-ink md:p-10">{children}</div>
}

export const TeacherCommandConsole: Story = {
  render: () => (
    <StoryCanvas>
      <div className="grid gap-6 lg:grid-cols-[1.4fr_0.8fr]">
        <Panel className="space-y-5" variant="surface">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <Badge tone="brand">Teacher Host</Badge>
            <Badge tone="success">Room live</Badge>
          </div>
          <h2 className="theme-hero-title text-4xl font-normal tracking-tight">Command console</h2>
          <p className="max-w-2xl text-sm leading-6 text-chunks-body">
            Selected Stitch direction: calm control-room hierarchy with a clear current prompt, roster status, and explicit disabled reasons.
          </p>
          <Card>
            <CardHeader>
              <Badge tone="info">Current sentence</Badge>
              <h3 className="text-2xl font-semibold">I can describe my weekend plans.</h3>
            </CardHeader>
            <CardContent className="text-sm leading-6 text-chunks-body">
              Round controls remain grouped and keyboard reachable while preserving live-room contracts.
            </CardContent>
            <CardFooter className="flex flex-wrap gap-3">
              <Button>Start round</Button>
              <Button disabled disabledReason="Round is already open" variant="secondary">Advance</Button>
            </CardFooter>
          </Card>
        </Panel>
        <div className="grid gap-4">
          <Card>
            <CardHeader>
              <h3 className="text-lg font-semibold">Learner roster</h3>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-chunks-body">
              <div className="flex justify-between"><span>Mai</span><Badge tone="success">Captured</Badge></div>
              <div className="flex justify-between"><span>An</span><Badge tone="warning">Waiting</Badge></div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <h3 className="text-lg font-semibold">Responses</h3>
            </CardHeader>
            <CardContent>
              <Progress label="Captured" showValue value={64} />
            </CardContent>
          </Card>
        </div>
      </div>
    </StoryCanvas>
  ),
}

export const LearnerSafeResponse: Story = {
  render: () => (
    <StoryCanvas>
      <div className="mx-auto grid max-w-4xl gap-6">
        <Panel className="space-y-5 text-center" variant="surface">
          <Badge tone="brand">Learner</Badge>
          <h2 className="theme-hero-title text-4xl font-normal tracking-tight">Choose your response</h2>
          <p className="text-sm leading-6 text-chunks-body">
            Selected Stitch direction: large, low-stress response targets with non-color-only state copy.
          </p>
          <div className="grid gap-3 sm:grid-cols-3">
            <Button className="min-h-24" variant="destructive">Red<br /><span className="text-xs">Need help</span></Button>
            <Button className="min-h-24 bg-yellow-400 text-black hover:bg-yellow-500">Yellow<br /><span className="text-xs">Almost there</span></Button>
            <Button className="min-h-24 bg-green-600 text-white hover:bg-green-700">Green<br /><span className="text-xs">Ready</span></Button>
          </div>
        </Panel>
        <div className="grid gap-4 md:grid-cols-3">
          <Card><CardContent><Badge tone="info">Assigned</Badge><p className="mt-3 text-sm text-chunks-body">Your turn is active.</p></CardContent></Card>
          <Card><CardContent><Badge tone="success">Captured</Badge><p className="mt-3 text-sm text-chunks-body">Response saved.</p></CardContent></Card>
          <Card><CardContent><Badge tone="neutral">Waiting</Badge><p className="mt-3 text-sm text-chunks-body">Teacher controls the next round.</p></CardContent></Card>
        </div>
      </div>
    </StoryCanvas>
  ),
}

export const AdminResourceConsole: Story = {
  render: () => (
    <StoryCanvas>
      <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <Panel className="space-y-5" variant="surface">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <Badge tone="brand">Admin</Badge>
            <Badge tone="warning">Missing EN audio</Badge>
          </div>
          <h2 className="theme-hero-title text-4xl font-normal tracking-tight">Resource manager</h2>
          <p className="text-sm leading-6 text-chunks-body">
            Selected Stitch direction: resource status chips, clear pagination/action hierarchy, and explicit confirmation for batch changes.
          </p>
          <div className="grid gap-3">
            {['A-001', 'A-002', 'A-003'].map((code, index) => (
              <Card key={code}>
                <CardContent className="flex flex-wrap items-center justify-between gap-3">
                  <span className="font-mono text-lg font-semibold">{code}</span>
                  <div className="flex flex-wrap gap-2">
                    <Badge tone={index === 0 ? 'warning' : 'success'}>{index === 0 ? 'Missing EN audio' : 'EN ready'}</Badge>
                    <Badge tone="success">VI ready</Badge>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </Panel>
        <Card>
          <CardHeader>
            <h3 className="text-xl font-semibold">Batch confirmation</h3>
          </CardHeader>
          <CardContent className="text-sm leading-6 text-chunks-body">
            Destructive and publishing actions keep confirmation text and completion/failure feedback.
          </CardContent>
          <CardFooter className="flex flex-wrap justify-end gap-3">
            <Button variant="secondary">Cancel</Button>
            <Button variant="destructive">Confirm action</Button>
          </CardFooter>
        </Card>
      </div>
    </StoryCanvas>
  ),
}
