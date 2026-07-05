import type { ReactNode } from 'react'

import { AppShell } from '../components/layout/AppShell'
import { Badge, ButtonLink, Card, Panel, Progress } from '../components/primitives'

const insideAreas = [
  ['Product Map', 'Choose the right product area without scanning records.'],
  ['Classroom Loop', 'See how Library, rooms, learners, and History connect.'],
  ['Readiness Snapshot', 'Check whether the next class action is ready.'],
]

const productAreas = [
  {
    title: 'Library',
    href: '/library',
    description: 'Prepare resources, standards, and audio readiness before class.',
    status: 'Prepare',
    actionLabel: 'Open library',
    features: ['Resources', 'CCI / CVR standards', 'Audio readiness'],
  },
  {
    title: 'Create Room',
    href: '/teacher/setup',
    description: 'Set scope, confirm readiness, and launch a classroom room.',
    status: 'Launch',
    actionLabel: 'Create room',
    features: ['Room idea', 'Course scope', 'Launch readiness'],
    featured: true,
  },
  {
    title: 'Live Room',
    href: '/teacher/setup',
    description: 'Run the teacher console after a room is created.',
    status: 'Run',
    actionLabel: 'Prepare live room',
    features: ['Current round', 'Queue and roster', 'Audio and progress'],
    featured: true,
  },
  {
    title: 'Learner',
    href: '/room/demo',
    description: 'Join, wait, respond, and confirm captured response state.',
    status: 'Respond',
    actionLabel: 'Open learner flow',
    features: ['Join room', 'Respond once', 'Captured state'],
  },
  {
    title: 'History',
    href: '/history',
    description: 'Review completed sessions and learner response distribution.',
    status: 'Review',
    actionLabel: 'View history',
    features: ['Completed rooms', 'Response distribution', 'Audit signals'],
  },
]

const loopSteps = [
  ['01', 'Library', 'Prepare resources'],
  ['02', 'Create Room', 'Set scope'],
  ['03', 'Live Room', 'Run the round'],
  ['04', 'Learner', 'Respond once'],
  ['05', 'History', 'Review outcomes'],
]

interface RoleEntryPageProps {
  eyebrow?: string
  title?: string
  themeControl?: ReactNode
}

export function RoleEntryPage({
  eyebrow = 'CHUNKS Mirror',
  title = 'Dashboard',
  themeControl,
}: RoleEntryPageProps) {
  return (
    <AppShell
      description="Choose the next product area in the classroom loop without opening dense records first."
      eyebrow={eyebrow}
      statusLabel="Offline Live Room"
      themeControl={themeControl}
      title={title}
    >
      <div className="grid gap-4">
        <Panel className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(280px,0.42fr)]" compact variant="surface">
          <div className="min-w-0">
            <Badge tone="brand">Command map</Badge>
            <h2 className="mt-3 max-w-3xl text-2xl font-semibold tracking-tight text-chunks-ink md:text-3xl">
              Choose where the classroom loop starts.
            </h2>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-chunks-body">
              Dashboard is the map. Detailed resources, analytics, room controls, and learner responses stay inside their product areas.
            </p>
          </div>

          <Card className="space-y-4 bg-white/80" padding="sm">
            <div className="flex items-center justify-between gap-3">
              <Badge tone="success">Readiness snapshot</Badge>
              <span className="text-xs font-semibold text-chunks-body">Summary only</span>
            </div>
            <Progress label="Foundation readiness" showValue value={72} />
            <div className="grid grid-cols-3 gap-2">
              <MiniMetric label="CCI" value="10" />
              <MiniMetric label="CPD" value="47.2" />
              <MiniMetric label="CVR" value="1" />
            </div>
          </Card>
        </Panel>

        <section aria-label="Inside this area" className="grid gap-3 md:grid-cols-3">
          {insideAreas.map(([areaTitle, description], index) => (
            <Card as="article" className="flex items-start gap-3" key={areaTitle} padding="sm">
              <span className="grid h-9 w-9 shrink-0 place-items-center rounded-chunks-xl bg-chunks-soft font-mono text-xs font-black text-chunks-red">
                {`0${index + 1}`}
              </span>
              <div className="min-w-0">
                <p className="font-semibold text-chunks-ink">{areaTitle}</p>
                <p className="mt-1 text-sm leading-6 text-chunks-body">{description}</p>
              </div>
            </Card>
          ))}
        </section>

        <section aria-label="Product areas" className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_minmax(300px,0.36fr)]">
          <div className="grid gap-3 md:grid-cols-2">
            {productAreas.map((area, index) => (
              <Card as="article" className={`space-y-3 ${area.featured ? 'border-chunks-red/45 bg-white' : ''}`} key={area.title} padding="sm">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <Badge tone={area.featured ? 'brand' : 'neutral'}>{area.status}</Badge>
                    <h2 className="mt-3 text-lg font-semibold text-chunks-ink">{area.title}</h2>
                  </div>
                  <ProductAreaIcon index={index} />
                </div>
                <p className="text-sm leading-6 text-chunks-body">{area.description}</p>
                <ul className="grid gap-1 text-sm text-chunks-body">
                  {area.features.map((feature) => (
                    <li className="flex items-center gap-2" key={feature}>
                      <span className="h-1.5 w-1.5 rounded-full bg-chunks-red" aria-hidden="true" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
                <ButtonLink className="h-10 min-h-10 rounded-chunks-xl" href={area.href} size="sm" variant={area.featured ? 'primary' : 'secondary'}>
                  {area.actionLabel}
                </ButtonLink>
              </Card>
            ))}
          </div>

          <Panel className="grid content-start gap-3" compact variant="surface">
            <div>
              <Badge tone="info">Classroom loop</Badge>
              <h2 className="mt-3 text-lg font-semibold text-chunks-ink">From prep to review</h2>
            </div>
            <div className="grid gap-2">
              {loopSteps.map(([number, owner, label]) => (
                <div className="theme-card rounded-chunks-xl border border-chunks-hairline bg-white p-3" key={number}>
                  <div className="flex items-start gap-3">
                    <span className="grid h-8 w-8 shrink-0 place-items-center rounded-chunks-md bg-chunks-red font-mono text-xs font-semibold text-white">
                      {number}
                    </span>
                    <div className="min-w-0">
                      <p className="text-xs font-black uppercase tracking-[0.16em] text-chunks-body">{owner}</p>
                      <p className="mt-1 text-sm font-semibold text-chunks-ink">{label}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Panel>
        </section>
      </div>
    </AppShell>
  )
}

function MiniMetric({ label, value }: { label: string; value: string }) {
  return (
    <div className="theme-card rounded-chunks-xl border border-chunks-hairline bg-white p-3">
      <p className="text-[0.62rem] font-black uppercase tracking-[0.16em] text-chunks-body">{label}</p>
      <p className="mt-1 font-mono text-sm font-semibold text-chunks-ink">{value}</p>
    </div>
  )
}

function ProductAreaIcon({ index }: { index: number }) {
  const paths = [
    'M6 4h12v16H6z M9 8h6 M9 12h6 M9 16h4',
    'M4 5h16v10H4z M8 19h8 M12 15v4 M8 9h5',
    'M5 6h14v9H5z M8 18h8 M12 15v3 M8 10h3 M14 10h2',
    'M6 11a6 6 0 0 1 12 0v5 M5 13h3v5H5z M16 13h3v5h-3z M12 19h3',
    'M5 5h14v14H5z M8 9h8 M8 13h5 M8 17h7',
  ]

  return (
    <span className="grid h-10 w-10 shrink-0 place-items-center rounded-chunks-xl bg-chunks-control text-chunks-ink">
      <svg aria-hidden="true" className="h-5 w-5" fill="none" viewBox="0 0 24 24">
        {paths[index].split(' M').map((path, pathIndex) => (
          <path d={pathIndex === 0 ? path : `M${path}`} key={path} stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
        ))}
      </svg>
    </span>
  )
}
