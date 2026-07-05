import type { ReactNode } from 'react'
import { FormEvent, useEffect, useMemo, useState } from 'react'

import { ActionDock } from '../../components/layout/ActionDock'
import { AppShell } from '../../components/layout/AppShell'
import { WorkspaceLayout } from '../../components/layout/WorkspaceLayout'
import { Alert } from '../../components/ui/Alert'
import { CollapsiblePanel } from '../../components/ui/CollapsiblePanel'
import { Badge, Button, Card } from '../../components/primitives'
import type { ResponseCaptureMode, ScoringMode, UUID } from '../../lib/domain/types'
import { countApprovedSentenceResources, createTeacherRoom, loadTeacherSetupData, type TeacherSetupData } from './teacherRoomService'

interface TeacherSetupPageProps {
  onRoomCreated?: (roomCode: string) => void
  themeControl?: ReactNode
}

const createRoomAreas = [
  ['Room Idea', 'Name the live room around the class goal.'],
  ['Scope', 'Choose course, lesson, and included topics.'],
  ['Readiness', 'Confirm approved resources before launch.'],
  ['Advanced Options', 'Tune host, CCI, capture, and scoring.'],
]

interface CreateRoomAreaMapProps {
  approvedResourceCount: number
  canCreate: boolean
  readySummary: string
  selectedSectionCount: number
  totalSectionCount: number
}

function CreateRoomAreaMap({ approvedResourceCount, canCreate, readySummary, selectedSectionCount, totalSectionCount }: CreateRoomAreaMapProps) {
  return (
    <section aria-label="Inside this area" className="grid gap-3 md:grid-cols-4">
      {createRoomAreas.map(([label, description], index) => {
        const isReadiness = label === 'Readiness'
        const status = isReadiness
          ? canCreate
            ? 'Ready'
            : approvedResourceCount > 0
              ? readySummary
              : 'Needs resources'
          : label === 'Scope'
            ? `${selectedSectionCount}/${totalSectionCount} topics`
            : index === 0
              ? 'Start here'
              : 'Optional'

        return (
          <div className="rounded-2xl border border-chunks-hairline bg-white p-3 shadow-[var(--chunks-shadow-soft)]" key={label}>
            <div className="mb-3 flex items-center justify-between gap-2">
              <span className="inline-flex h-8 w-8 items-center justify-center rounded-xl bg-chunks-soft text-xs font-black text-chunks-ink">
                {index + 1}
              </span>
              <Badge tone={isReadiness && canCreate ? 'success' : isReadiness ? 'warning' : 'neutral'}>{status}</Badge>
            </div>
            <h2 className="text-sm font-black uppercase tracking-[0.14em] text-chunks-ink">{label}</h2>
            <p className="mt-1 text-xs leading-5 text-chunks-body">{description}</p>
          </div>
        )
      })}
    </section>
  )
}

function getErrorMessage(error: unknown): string {
  if (error && typeof error === 'object' && 'message' in error) return String(error.message)
  return 'Something went wrong. Please try again.'
}

function getSectionIdsForLesson(data: TeacherSetupData | null, lessonId: UUID): UUID[] {
  return data?.sections.filter((section) => section.lesson_id === lessonId).map((section) => section.id) ?? []
}

function getDefaultRoomTitleFromLesson(lessonTitle: string | undefined): string {
  const trimmedTitle = lessonTitle?.trim()
  if (!trimmedTitle) return 'CHUNKS Mirror Practice'

  const parts = trimmedTitle
    .split(/\s+[-–—]\s+|\s+[-–—]|[-–—]\s+/)
    .map((part) => part.trim())
    .filter(Boolean)

  return parts.at(-1) ?? trimmedTitle
}

export function TeacherSetupPage({ onRoomCreated, themeControl }: TeacherSetupPageProps) {
  const [data, setData] = useState<TeacherSetupData | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isCreating, setIsCreating] = useState(false)
  const [isCountingResources, setIsCountingResources] = useState(false)
  const [approvedResourceCount, setApprovedResourceCount] = useState(0)

  const [title, setTitle] = useState('CHUNKS Mirror Practice')
  const [isTitleCustomized, setIsTitleCustomized] = useState(false)
  const [hostName, setHostName] = useState('Chunker')
  const [courseId, setCourseId] = useState<UUID>('')
  const [lessonId, setLessonId] = useState<UUID>('')
  const [selectedSectionIds, setSelectedSectionIds] = useState<UUID[]>([])
  const [cciStandardCardId, setCciStandardCardId] = useState<UUID>('')
  const [captureMode, setCaptureMode] = useState<ResponseCaptureMode>('first_responder')
  const [scoringMode, setScoringMode] = useState<ScoringMode>('simple')

  useEffect(() => {
    let isMounted = true
    setIsLoading(true)
    loadTeacherSetupData()
      .then((setupData) => {
        if (!isMounted) return
        setData(setupData)
        const firstCourseId = setupData.courses[0]?.id ?? ''
        const firstLessonId = setupData.lessons.find((lesson) => lesson.course_id === firstCourseId)?.id ?? ''
        setCourseId(firstCourseId)
        setLessonId(firstLessonId)
        setTitle(getDefaultRoomTitleFromLesson(setupData.lessons.find((lesson) => lesson.id === firstLessonId)?.title))
        setSelectedSectionIds(getSectionIdsForLesson(setupData, firstLessonId))
        setCciStandardCardId(setupData.cciCards[0]?.id ?? '')
        setError(null)
      })
      .catch((loadError: unknown) => {
        if (!isMounted) return
        setError(getErrorMessage(loadError))
      })
      .finally(() => {
        if (isMounted) setIsLoading(false)
      })

    return () => {
      isMounted = false
    }
  }, [])

  const lessonsForCourse = useMemo(
    () => data?.lessons.filter((lesson) => !courseId || lesson.course_id === courseId) ?? [],
    [courseId, data?.lessons],
  )

  const sectionsForLesson = useMemo(
    () => data?.sections.filter((section) => !lessonId || section.lesson_id === lessonId) ?? [],
    [data?.sections, lessonId],
  )

  const selectedCourse = data?.courses.find((course) => course.id === courseId)
  const selectedLesson = data?.lessons.find((lesson) => lesson.id === lessonId)
  const defaultRoomTitle = getDefaultRoomTitleFromLesson(selectedLesson?.title)

  useEffect(() => {
    if (!isTitleCustomized) setTitle(defaultRoomTitle)
  }, [defaultRoomTitle, isTitleCustomized])

  useEffect(() => {
    if (!lessonsForCourse.some((lesson) => lesson.id === lessonId)) {
      const nextLessonId = lessonsForCourse[0]?.id ?? ''
      setLessonId(nextLessonId)
      setSelectedSectionIds(getSectionIdsForLesson(data, nextLessonId))
    }
  }, [data, lessonId, lessonsForCourse])

  useEffect(() => {
    const validSectionIds = new Set(sectionsForLesson.map((section) => section.id))
    setSelectedSectionIds((current) => {
      const filtered = current.filter((sectionId) => validSectionIds.has(sectionId))
      if (current.length > 0 && filtered.length === 0 && sectionsForLesson.length > 0) {
        return sectionsForLesson.map((section) => section.id)
      }
      return filtered
    })
  }, [sectionsForLesson])

  useEffect(() => {
    let isCurrent = true

    if (!courseId || !lessonId || selectedSectionIds.length === 0) {
      setApprovedResourceCount(0)
      setIsCountingResources(false)
      return () => {
        isCurrent = false
      }
    }

    setIsCountingResources(true)
    countApprovedSentenceResources({ courseId, lessonId, sectionIds: selectedSectionIds })
      .then((count) => {
        if (!isCurrent) return
        setApprovedResourceCount(count)
      })
      .catch((countError: unknown) => {
        if (!isCurrent) return
        setApprovedResourceCount(0)
        setError(getErrorMessage(countError))
      })
      .finally(() => {
        if (isCurrent) setIsCountingResources(false)
      })

    return () => {
      isCurrent = false
    }
  }, [courseId, lessonId, selectedSectionIds])

  function handleCourseChange(nextCourseId: UUID) {
    const nextLessonId = data?.lessons.find((lesson) => lesson.course_id === nextCourseId)?.id ?? ''
    setCourseId(nextCourseId)
    setLessonId(nextLessonId)
    if (!isTitleCustomized) {
      setTitle(getDefaultRoomTitleFromLesson(data?.lessons.find((lesson) => lesson.id === nextLessonId)?.title))
    }
    setSelectedSectionIds(getSectionIdsForLesson(data, nextLessonId))
  }

  function handleLessonChange(nextLessonId: UUID) {
    setLessonId(nextLessonId)
    if (!isTitleCustomized) {
      setTitle(getDefaultRoomTitleFromLesson(data?.lessons.find((lesson) => lesson.id === nextLessonId)?.title))
    }
    setSelectedSectionIds(getSectionIdsForLesson(data, nextLessonId))
  }

  function toggleSection(sectionId: UUID) {
    setSelectedSectionIds((current) =>
      current.includes(sectionId)
        ? current.filter((currentSectionId) => currentSectionId !== sectionId)
        : [...current, sectionId],
    )
  }

  function selectAllLessonSections() {
    setSelectedSectionIds(sectionsForLesson.map((section) => section.id))
  }

  function clearLessonSections() {
    setSelectedSectionIds([])
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setIsCreating(true)
    setError(null)

    try {
      const result = await createTeacherRoom({
        title,
        hostName,
        courseId,
        lessonId,
        sectionIds: selectedSectionIds,
        cciStandardCardId,
        captureMode,
        scoringMode,
      })
      if (onRoomCreated) {
        onRoomCreated(result.room.room_code)
      } else {
        window.location.assign(`/teacher/room/${result.room.room_code}`)
      }
    } catch (createError) {
      setError(getErrorMessage(createError))
      setIsCreating(false)
    }
  }

  const canCreate = Boolean(
    courseId && lessonId && cciStandardCardId && selectedSectionIds.length > 0 && approvedResourceCount > 0 && !isCountingResources && !isCreating,
  )

  const resourceCountLabel = isCountingResources ? 'checking…' : String(approvedResourceCount)
  const readySummary = `${selectedSectionIds.length}/${sectionsForLesson.length} sections · ${resourceCountLabel} resources`
  const createDisabledReason = isCountingResources
    ? 'Checking approved resources'
    : approvedResourceCount === 0
      ? 'Select topics with approved resources before creating a room'
      : selectedSectionIds.length === 0
        ? 'Select at least one topic in Advanced Options'
        : !courseId || !lessonId
          ? 'Choose a course and lesson'
          : undefined

  return (
    <AppShell
      description="Start with the room idea, course, lesson, and approved-resource readiness. Advanced database/scoring settings stay secondary."
      eyebrow="Teacher Host"
      headerMeta={
        <CreateRoomAreaMap
          approvedResourceCount={approvedResourceCount}
          canCreate={canCreate}
          readySummary={readySummary}
          selectedSectionCount={selectedSectionIds.length}
          totalSectionCount={sectionsForLesson.length}
        />
      }
      statusLabel="Create Room"
      themeControl={themeControl}
      title="Create Room recipe"
    >
      {isLoading ? (
        <Alert className="mb-5" title="Loading setup data">
          Fetching active courses, lesson topics, approved sentence resources, and CCI cards.
        </Alert>
      ) : null}

      {error ? (
        <Alert className="mb-5" tone="error" title="Teacher setup unavailable">
          {error}
        </Alert>
      ) : null}

      <form onSubmit={handleSubmit}>
        <WorkspaceLayout
          primary={
            <>
              <Card className="space-y-5 border-2 border-chunks-ink" padding="lg" variant="surface">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="min-w-0">
                    <Badge tone="brand">Create Room recipe</Badge>
                    <h2 className="mt-3 text-2xl font-semibold text-chunks-ink">Launch the room from the main idea.</h2>
                    <p className="mt-2 text-sm leading-6 text-chunks-body">
                      Pick the class idea, course, and lesson first. Advanced Options keeps database topics and scoring controls available without dominating setup.
                    </p>
                  </div>
                  <Badge tone={approvedResourceCount > 0 ? 'success' : 'warning'}>{resourceCountLabel} approved resources</Badge>
                </div>

                <label className="block">
                  <span className="text-sm font-semibold text-chunks-ink">Room title / class idea</span>
                  <input
                    className="mt-2 min-h-12 w-full rounded-2xl border border-chunks-hairline bg-white px-4 text-chunks-ink"
                    onChange={(event) => {
                      setIsTitleCustomized(true)
                      setTitle(event.target.value)
                    }}
                    value={title}
                  />
                </label>

                <div className="grid gap-4 md:grid-cols-2">
                  <label className="block">
                    <span className="text-sm font-semibold text-chunks-ink">Course</span>
                    <select
                      className="mt-2 min-h-12 w-full rounded-2xl border border-chunks-hairline bg-white px-4 text-chunks-ink"
                      onChange={(event) => handleCourseChange(event.target.value)}
                      value={courseId}
                    >
                      {data?.courses.map((course) => <option key={course.id} value={course.id}>{course.title}</option>)}
                    </select>
                  </label>
                  <label className="block">
                    <span className="text-sm font-semibold text-chunks-ink">Lesson</span>
                    <select
                      className="mt-2 min-h-12 w-full rounded-2xl border border-chunks-hairline bg-white px-4 text-chunks-ink"
                      onChange={(event) => handleLessonChange(event.target.value)}
                      value={lessonId}
                    >
                      {lessonsForCourse.map((lesson) => <option key={lesson.id} value={lesson.id}>{lesson.title}</option>)}
                    </select>
                  </label>
                </div>

                <div className="grid gap-3 rounded-2xl bg-chunks-soft p-3 text-sm text-chunks-body sm:grid-cols-3">
                  <div><strong className="block text-chunks-ink">Topics</strong>{selectedSectionIds.length}/{sectionsForLesson.length} selected</div>
                  <div><strong className="block text-chunks-ink">Mode</strong>{captureMode}</div>
                  <div><strong className="block text-chunks-ink">Readiness</strong>{readySummary}</div>
                </div>

                <Button disabled={!canCreate} disabledReason={createDisabledReason} fullWidth size="lg" type="submit">
                  {isCreating ? 'Creating room…' : 'Create room'}
                </Button>
              </Card>

              <CollapsiblePanel
                panelId="teacher-setup-advanced-options"
                summary={`${selectedSectionIds.length} topics · ${captureMode} · ${scoringMode}`}
                title="Advanced Options"
              >
                <fieldset>
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <legend className="text-sm font-semibold text-chunks-ink">Topic filters from the selected lesson</legend>
                    <div className="flex gap-2">
                      <Button onClick={selectAllLessonSections} type="button" variant="secondary">Select all topics</Button>
                      <Button onClick={clearLessonSections} type="button" variant="secondary">Clear topics</Button>
                    </div>
                  </div>
                  <div className="mt-3 grid max-h-72 gap-3 overflow-auto rounded-2xl border border-chunks-hairline bg-white p-3 md:grid-cols-2">
                    {sectionsForLesson.map((section) => (
                      <label className="flex min-h-12 items-center gap-3 rounded-xl bg-chunks-soft px-3 py-2" key={section.id}>
                        <input
                          checked={selectedSectionIds.includes(section.id)}
                          className="h-5 w-5 accent-chunks-red"
                          onChange={() => toggleSection(section.id)}
                          type="checkbox"
                        />
                        <span className="text-sm font-semibold text-chunks-ink">{section.title}</span>
                      </label>
                    ))}
                  </div>
                  <span className="mt-2 block text-sm font-semibold text-chunks-body">{readySummary} after topic filter</span>
                </fieldset>

                <div className="mt-5 grid gap-5 md:grid-cols-2">
                  <label className="block">
                    <span className="text-sm font-semibold text-chunks-ink">Host name</span>
                    <input
                      className="mt-2 min-h-12 w-full rounded-2xl border border-chunks-hairline bg-white px-4 text-chunks-ink"
                      onChange={(event) => setHostName(event.target.value)}
                      value={hostName}
                    />
                  </label>
                  <label className="block">
                    <span className="text-sm font-semibold text-chunks-ink">CCI standard</span>
                    <select
                      className="mt-2 min-h-12 w-full rounded-2xl border border-chunks-hairline bg-white px-4 text-chunks-ink"
                      onChange={(event) => setCciStandardCardId(event.target.value)}
                      value={cciStandardCardId}
                    >
                      {data?.cciCards.map((card) => <option key={card.id} value={card.id}>{card.label} · X {card.standard_value}</option>)}
                    </select>
                  </label>
                  <label className="block">
                    <span className="text-sm font-semibold text-chunks-ink">Capture mode</span>
                    <select
                      className="mt-2 min-h-12 w-full rounded-2xl border border-chunks-hairline bg-white px-4 text-chunks-ink"
                      onChange={(event) => setCaptureMode(event.target.value as ResponseCaptureMode)}
                      value={captureMode}
                    >
                      <option value="assigned">Assigned learner</option>
                      <option value="first_responder">First responder</option>
                      <option value="auto_rotate">Auto rotate</option>
                    </select>
                  </label>
                  <div className="rounded-2xl bg-chunks-soft p-4 text-sm leading-6 text-chunks-body">
                    <strong className="text-chunks-ink">Scoring:</strong> {scoringMode}. Advanced settings remain visible here, but room launch stays driven by the recipe above.
                  </div>
                </div>
                <input name="scoringMode" type="hidden" value={scoringMode} />
              </CollapsiblePanel>
            </>
          }
          secondary={
            <CollapsiblePanel panelId="teacher-setup-ready-check" summary={readySummary} title="Ready check" defaultOpen>
              <dl className="space-y-4 text-sm text-chunks-body">
                <div className="flex justify-between gap-4"><dt>Filtered resources</dt><dd className="font-semibold text-chunks-ink">{resourceCountLabel}</dd></div>
                <div className="flex justify-between gap-4"><dt>Selected sections</dt><dd className="font-semibold text-chunks-ink">{selectedSectionIds.length}/{sectionsForLesson.length}</dd></div>
                <div className="flex justify-between gap-4"><dt>Capture</dt><dd className="font-semibold text-chunks-ink">{captureMode}</dd></div>
                <div className="flex justify-between gap-4"><dt>Scoring</dt><dd className="font-semibold text-chunks-ink">{scoringMode}</dd></div>
              </dl>
              {!isCountingResources && approvedResourceCount === 0 ? (
                <Alert className="mt-5" tone="warning" title="No approved resources">
                  Select database sections with approved sentence resources before creating a room.
                </Alert>
              ) : null}
              <ActionDock className="mt-5" label="Create room" meta="Same launch action as the recipe card; use Advanced Options only when you need to change defaults.">
                <Button disabled={!canCreate} disabledReason={createDisabledReason} type="submit">
                  {isCreating ? 'Creating room…' : 'Create room'}
                </Button>
              </ActionDock>
            </CollapsiblePanel>
          }
        />
      </form>
    </AppShell>
  )
}
