import type { ReactNode } from 'react'
import { FormEvent, useEffect, useMemo, useState } from 'react'

import { ActionDock } from '../../components/layout/ActionDock'
import { AppShell } from '../../components/layout/AppShell'
import { WorkspaceLayout } from '../../components/layout/WorkspaceLayout'
import { Alert } from '../../components/ui/Alert'
import { Button } from '../../components/ui/Button'
import { CollapsiblePanel } from '../../components/ui/CollapsiblePanel'
import type { ResponseCaptureMode, ScoringMode, UUID } from '../../lib/domain/types'
import { countApprovedSentenceResources, createTeacherRoom, loadTeacherSetupData, type TeacherSetupData } from './teacherRoomService'

interface TeacherSetupPageProps {
  onRoomCreated?: (roomCode: string) => void
  themeControl?: ReactNode
}

function getErrorMessage(error: unknown): string {
  if (error && typeof error === 'object' && 'message' in error) return String(error.message)
  return 'Something went wrong. Please try again.'
}

function getSectionIdsForLesson(data: TeacherSetupData | null, lessonId: UUID): UUID[] {
  return data?.sections.filter((section) => section.lesson_id === lessonId).map((section) => section.id) ?? []
}

export function TeacherSetupPage({ onRoomCreated, themeControl }: TeacherSetupPageProps) {
  const [data, setData] = useState<TeacherSetupData | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isCreating, setIsCreating] = useState(false)
  const [isCountingResources, setIsCountingResources] = useState(false)
  const [approvedResourceCount, setApprovedResourceCount] = useState(0)

  const [title, setTitle] = useState('CHUNKS Mirror Practice')
  const [hostName, setHostName] = useState('Teacher Host')
  const [courseId, setCourseId] = useState<UUID>('')
  const [lessonId, setLessonId] = useState<UUID>('')
  const [selectedSectionIds, setSelectedSectionIds] = useState<UUID[]>([])
  const [cciStandardCardId, setCciStandardCardId] = useState<UUID>('')
  const [captureMode, setCaptureMode] = useState<ResponseCaptureMode>('assigned')
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
    setSelectedSectionIds(getSectionIdsForLesson(data, nextLessonId))
  }

  function handleLessonChange(nextLessonId: UUID) {
    setLessonId(nextLessonId)
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

  return (
    <AppShell
      description="Choose a compact resource scope, room settings, and scoring standard before sharing the room code."
      eyebrow="Teacher Host"
      headerMeta={
        <div className="theme-card border border-chunks-hairline bg-white p-4 shadow-soft">
          <p className="text-sm font-semibold text-chunks-body">Current filter</p>
          <p className="mt-2 text-xl font-semibold text-chunks-ink">{readySummary}</p>
        </div>
      }
      statusLabel="Create Room"
      themeControl={themeControl}
      title="Create a live room."
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
              <CollapsiblePanel
                panelId="teacher-setup-resource-scope"
                summary={selectedCourse && selectedLesson ? `${selectedCourse.title} · ${selectedLesson.title}` : 'Choose course and lesson'}
                title="Resource scope"
              >
                <div className="grid gap-5 md:grid-cols-2">
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
                <fieldset className="mt-5">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <legend className="text-sm font-semibold text-chunks-ink">Database sections</legend>
                    <div className="flex gap-2">
                      <Button onClick={selectAllLessonSections} type="button" variant="secondary">Select all sections</Button>
                      <Button onClick={clearLessonSections} type="button" variant="secondary">Clear</Button>
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
                  <span className="mt-2 block text-sm font-semibold text-chunks-body">
                    {readySummary} after filter
                  </span>
                </fieldset>
              </CollapsiblePanel>

              <CollapsiblePanel
                panelId="teacher-setup-room-settings"
                summary={`${captureMode} · ${scoringMode}`}
                title="Room settings"
              >
                <div className="grid gap-5 md:grid-cols-2">
                  <label className="block">
                    <span className="text-sm font-semibold text-chunks-ink">Room title</span>
                    <input
                      className="mt-2 min-h-12 w-full rounded-2xl border border-chunks-hairline bg-white px-4 text-chunks-ink"
                      onChange={(event) => setTitle(event.target.value)}
                      value={title}
                    />
                  </label>
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
              <ActionDock className="mt-5" label="Create room" meta="Room creation uses the selected database section IDs.">
                <Button disabled={!canCreate} type="submit">
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
