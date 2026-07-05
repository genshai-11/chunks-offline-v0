import type { ReactNode } from 'react'
import { useCallback, useEffect, useState } from 'react'

import { AppShell } from '../../components/layout/AppShell'
import { WorkspaceLayout } from '../../components/layout/WorkspaceLayout'
import { ButtonLink, Card } from '../../components/primitives'
import { Alert } from '../../components/ui/Alert'
import type { CvrUnit } from '../../lib/domain/types'
import { CciManager } from './cci/CciManager'
import { loadCciAdminData, type CciAdminData } from './cci/cciService'
import { CvrManager } from './cvr/CvrManager'
import { loadCvrUnits } from './cvr/cvrService'
import { ResourceManager } from './resources/ResourceManager'
import { loadResourceManagerData, type ResourceManagerData } from './resources/resourceService'

interface LibraryPageProps {
  themeControl?: ReactNode
}

interface LibraryState {
  cci: CciAdminData
  cvrUnits: CvrUnit[]
  resources: ResourceManagerData
}

const emptyState: LibraryState = {
  cci: { cards: [], categories: [] },
  cvrUnits: [],
  resources: { courses: [], lessons: [], resources: [], sections: [] },
}

const librarySections = [
  { title: 'Resources', description: 'Sentence rows, approval, and prompt edits.' },
  { title: 'Scope filter', description: 'Course, lesson, topic, approval, and audio readiness.' },
  { title: 'Standards', description: 'CCI cards and CVR values used by rooms.' },
  { title: 'Audio', description: 'English and Vietnamese gaps before launch.' },
]

export function LibraryPage({ themeControl }: LibraryPageProps) {
  const [state, setState] = useState<LibraryState>(emptyState)
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const refresh = useCallback(async () => {
    const [resources, cci, cvrUnits] = await Promise.all([
      loadResourceManagerData(),
      loadCciAdminData(),
      loadCvrUnits(),
    ])
    setState({ cci, cvrUnits, resources })
    setError(null)
  }, [])

  useEffect(() => {
    let mounted = true
    setIsLoading(true)
    refresh()
      .catch((loadError: unknown) => {
        if (mounted) setError(getErrorMessage(loadError))
      })
      .finally(() => {
        if (mounted) setIsLoading(false)
      })
    return () => {
      mounted = false
    }
  }, [refresh])

  return (
    <AppShell
      action={
        <ButtonLink href="/library#new-resource" variant="primary">
          Create New
        </ButtonLink>
      }
      description="Prepare resources, standards, and audio readiness before a teacher launches a room."
      eyebrow="Library"
      headerMeta={
        <LibraryAreaMap
          activeCciCount={state.cci.cards.filter((card) => card.active).length}
          isLoading={isLoading}
          resourceCount={state.resources.resources.length}
        />
      }
      statusLabel="Library"
      themeControl={themeControl}
      title="Library"
    >
      {isLoading ? <Alert className="mb-5" title="Loading Library data">Fetching resources, CCI cards, and CVR values.</Alert> : null}
      {error ? <Alert className="mb-5" title="Library data unavailable" tone="error">{error}</Alert> : null}

      <WorkspaceLayout
        primary={
          <ResourceManager
            courses={state.resources.courses}
            lessons={state.resources.lessons}
            onRefresh={refresh}
            resources={state.resources.resources}
            sections={state.resources.sections}
          />
        }
        secondary={
          <>
            <CciManager cards={state.cci.cards} categories={state.cci.categories} onRefresh={refresh} />
            <CvrManager onRefresh={refresh} units={state.cvrUnits} />
          </>
        }
      />
    </AppShell>
  )
}

function LibraryAreaMap({
  activeCciCount,
  isLoading,
  resourceCount,
}: {
  activeCciCount: number
  isLoading: boolean
  resourceCount: number
}) {
  return (
    <div className="grid gap-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-xs font-black uppercase tracking-[0.16em] text-chunks-body">Inside this area</p>
          <h2 className="mt-2 text-xl font-semibold text-chunks-ink">Library prepares the room before class.</h2>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-chunks-body">
            Keep this page focused on resources, standards, and audio readiness. Completed room evidence lives in History.
          </p>
        </div>
        <ButtonLink href="/history" size="sm" variant="secondary">
          Open History
        </ButtonLink>
      </div>

      <div className="grid gap-3 lg:grid-cols-4">
        {librarySections.map((section, index) => (
          <Card as="article" className="border border-chunks-hairline shadow-none" key={section.title} padding="sm" variant="outline">
            <div className="flex items-start gap-3">
              <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-chunks-soft font-mono text-xs font-black text-chunks-red">
                {`0${index + 1}`}
              </span>
              <div className="min-w-0">
                <p className="font-semibold text-chunks-ink">{section.title}</p>
                <p className="mt-1 text-sm leading-6 text-chunks-body">{section.description}</p>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <div className="grid gap-3 md:grid-cols-3">
        <SummaryTile label="System" value={isLoading ? 'Loading' : 'Ready'} />
        <SummaryTile label="Resources" value={String(resourceCount)} />
        <SummaryTile label="CCI active" value={String(activeCciCount)} />
      </div>
    </div>
  )
}

function SummaryTile({ label, value }: { label: string; value: string }) {
  return (
    <Card padding="sm" variant="outline">
      <p className="text-xs font-black uppercase tracking-[0.16em] text-chunks-body">{label}</p>
      <p className="mt-1 text-lg font-semibold text-chunks-ink">{value}</p>
    </Card>
  )
}

function getErrorMessage(error: unknown): string {
  if (error && typeof error === 'object' && 'message' in error) return String(error.message)
  return 'Something went wrong. Please try again.'
}
