import type { ReactNode } from 'react'

import { AppShell } from '../components/layout/AppShell'
import { WorkspaceLayout } from '../components/layout/WorkspaceLayout'
import { Alert } from '../components/ui/Alert'
import { ButtonLink } from '../components/ui/Button'
import { Card } from '../components/ui/Card'

const roles = [
  {
    title: 'Teacher Host',
    href: '/teacher/setup',
    description: 'Create rooms, open sentence windows, and monitor live responses.',
  },
  {
    title: 'Learner',
    href: '/room/demo',
    description: 'Join by link or room code, listen, and respond Red / Yellow / Green.',
  },
  {
    title: 'Admin',
    href: '/admin',
    description: 'Prepare sentence resources, CVR Ω, audio, and CCI standards.',
  },
]

interface RoleEntryPageProps {
  eyebrow?: string
  title?: string
  themeControl?: ReactNode
}

export function RoleEntryPage({
  eyebrow = 'CHUNKS Mirror / Offline Live Room',
  title = 'Live sentence practice with classroom control.',
  themeControl,
}: RoleEntryPageProps) {
  return (
    <AppShell
      description="Teacher opens each Sentence Window, learner responds Red / Yellow / Green, and CHUNKS stores durable CCI / CPD progress through Supabase."
      eyebrow={eyebrow}
      statusLabel="Offline Live Room"
      themeControl={themeControl}
      title={title}
    >
      <WorkspaceLayout
        primary={
          <div className="space-y-5">
            <Card variant="dark">
              <p className="text-sm font-semibold text-chunks-muted-soft">Current loop</p>
              <ol className="mt-6 grid gap-4 sm:grid-cols-2">
                {['Admin prepares Resource + CCI', 'Teacher opens Sentence Window', 'Learner responds Red / Yellow / Green', 'System calculates CCI / CPD'].map((item, index) => (
                  <li className="flex items-center gap-4" key={item}>
                    <span className="theme-step-index flex h-9 w-9 items-center justify-center rounded-full bg-chunks-red font-semibold text-white">
                      {index + 1}
                    </span>
                    <span className="text-sm text-white/90">{item}</span>
                  </li>
                ))}
              </ol>
            </Card>
            <Alert tone="info" title="Supabase connected">
              Using the linked project as durable state. Realtime events are treated as hints and reconciled with persisted rows.
            </Alert>
          </div>
        }
        secondary={
          <div className="grid gap-4">
            {roles.map((role, index) => (
              <Card as="article" className={index === 0 ? 'md:min-h-56' : ''} key={role.title}>
                <h2 className="text-lg font-semibold">{role.title}</h2>
                <p className="mt-3 text-sm leading-6 text-chunks-body">{role.description}</p>
                <ButtonLink className="mt-5" href={role.href} variant={index === 0 ? 'primary' : 'secondary'}>Open</ButtonLink>
              </Card>
            ))}
          </div>
        }
      />
    </AppShell>
  )
}
