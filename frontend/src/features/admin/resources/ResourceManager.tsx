import type { FormEvent } from 'react'
import { useEffect, useMemo, useState } from 'react'

import { Alert } from '../../../components/ui/Alert'
import { Badge, Button, Card, CardContent, CardFooter, CardHeader, Panel } from '../../../components/primitives'
import type { ApprovalStatus, Course, Lesson, LessonSection, SentenceResource } from '../../../lib/domain/types'
import { ConfirmBatchActionDialog } from '../components/ConfirmBatchActionDialog'
import {
  batchUpdateApprovalStatus,
  buildAudioStoragePath,
  filterResourcesByAudio,
  getMissingAudioQueueItems,
  requestAudioGeneration,
  requestAudioGenerationBatch,
  saveSentenceResource,
} from './resourceService'
import { ResourceLibraryFilter, type ResourceLibraryFilters } from './ResourceLibraryFilter'

interface ResourceManagerProps {
  courses: Course[]
  lessons: Lesson[]
  onRefresh: () => Promise<void>
  resources: SentenceResource[]
  sections: LessonSection[]
}

const defaultFilters: ResourceLibraryFilters = {
  approvalStatus: 'all',
  audio: 'all',
  courseId: '',
  lessonId: '',
  sectionId: '',
}

export function ResourceManager({ courses, lessons, onRefresh, resources, sections }: ResourceManagerProps) {
  const [filters, setFilters] = useState<ResourceLibraryFilters>(defaultFilters)
  const [pageSize, setPageSize] = useState(50)
  const [currentPage, setCurrentPage] = useState(1)
  const [selectedResourceId, setSelectedResourceId] = useState<string>(resources[0]?.id ?? '')
  const [isConfirmOpen, setIsConfirmOpen] = useState(false)
  const [statusMessage, setStatusMessage] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const scopedResources = useMemo(() => filterResourcesByScope(resources, filters), [filters, resources])
  const filteredResources = useMemo(() => filterResourcesByAudio(scopedResources, filters.audio), [filters.audio, scopedResources])
  const totalPages = Math.max(1, Math.ceil(filteredResources.length / pageSize))
  const safeCurrentPage = Math.min(currentPage, totalPages)
  const pageStartIndex = (safeCurrentPage - 1) * pageSize
  const pagedResources = filteredResources.slice(pageStartIndex, pageStartIndex + pageSize)
  const selectedResource = resources.find((resource) => resource.id === selectedResourceId) ?? pagedResources[0] ?? filteredResources[0] ?? null
  const missingAudioJobs = useMemo(() => getMissingAudioQueueItems(filteredResources), [filteredResources])
  const metadata = useMemo(() => buildMetadataMaps(courses, lessons, sections), [courses, lessons, sections])

  useEffect(() => {
    setCurrentPage(1)
  }, [filters, pageSize, resources])

  const pageRangeLabel = filteredResources.length === 0
    ? '0 resources'
    : `${pageStartIndex + 1}-${Math.min(pageStartIndex + pageSize, filteredResources.length)} of ${filteredResources.length}`

  const readyEnCount = filteredResources.filter((resource) => Boolean(resource.audio_en_url)).length
  const readyViCount = filteredResources.filter((resource) => Boolean(resource.audio_vi_url)).length

  async function handleSave(event: FormEvent<HTMLElement>) {
    event.preventDefault()
    if (!selectedResource) return
    const form = new FormData(event.currentTarget as HTMLFormElement)
    setError(null)
    try {
      await saveSentenceResource({
        id: selectedResource.id,
        courseId: String(form.get('courseId')),
        lessonId: String(form.get('lessonId')),
        sectionId: String(form.get('sectionId')) || null,
        sentenceCode: String(form.get('sentenceCode')),
        textEn: String(form.get('textEn')),
        textVi: String(form.get('textVi')),
        audioEnUrl: String(form.get('audioEnUrl')) || null,
        audioViUrl: String(form.get('audioViUrl')) || null,
        cvrValue: Number(form.get('cvrValue')),
        approvalStatus: String(form.get('approvalStatus')) as ApprovalStatus,
        orderIndex: selectedResource.order_index,
      })
      setStatusMessage('Resource saved. Teacher setup can use approved rows immediately after refresh.')
      await onRefresh()
    } catch (saveError) {
      setError(getErrorMessage(saveError))
    }
  }

  async function handleGenerateMissingAudio() {
    if (!selectedResource) return
    setError(null)
    try {
      const language = selectedResource.audio_en_url ? 'vi' : 'en'
      const result = await requestAudioGeneration({
        language,
        resourceId: selectedResource.id,
        storagePath: buildAudioStoragePath(selectedResource, language),
      })
      setStatusMessage(result.message)
    } catch (generationError) {
      setError(getErrorMessage(generationError))
    }
  }

  async function handleGenerateAllMissingAudio() {
    setError(null)
    try {
      const result = await requestAudioGenerationBatch(missingAudioJobs)
      setStatusMessage(`${result.message} Storage path pattern: sentence-audio/{courseId}/{lessonId}/{sentenceCode}-{language}.mp3`)
    } catch (generationError) {
      setError(getErrorMessage(generationError))
    }
  }

  async function handleConfirmBatchApprove() {
    if (!selectedResource) return
    setIsConfirmOpen(false)
    setError(null)
    try {
      const result = await batchUpdateApprovalStatus({ approvalStatus: 'approved', resourceIds: [selectedResource.id] })
      setStatusMessage(`${result.updatedCount} resource approved.`)
      await onRefresh()
    } catch (batchError) {
      setError(getErrorMessage(batchError))
    }
  }

  return (
    <section aria-labelledby="resource-manager-title" className="grid gap-4">
      <Panel className="grid gap-4" compact variant="surface">
        <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_auto] xl:items-start">
          <div>
            <Badge tone="brand">Resource Manager</Badge>
            <h2 className="mt-3 text-2xl font-semibold text-chunks-ink" id="resource-manager-title">
              Library resources
            </h2>
            <p className="mt-2 max-w-3xl text-sm leading-6 text-chunks-body">
              Compact rows prioritize sentence text, lesson context, approval, and audio readiness so the library is manageable at a glance.
            </p>
          </div>
          <div className="grid grid-cols-3 gap-2 text-center sm:min-w-[26rem]">
            <MetricPill label="Showing" value={pageRangeLabel} />
            <MetricPill label="EN ready" value={`${readyEnCount}/${filteredResources.length}`} />
            <MetricPill label="VI ready" value={`${readyViCount}/${filteredResources.length}`} />
          </div>
        </div>

        <ResourceLibraryFilter
          courses={courses}
          filters={filters}
          lessons={lessons}
          onChange={setFilters}
          resultCount={filteredResources.length}
          sections={sections}
        />

        <div className="flex flex-wrap items-center justify-between gap-3">
          <Button disabled={missingAudioJobs.length === 0} disabledReason="No missing audio jobs match the current filter" onClick={handleGenerateAllMissingAudio} type="button" variant="secondary">
            Generate all missing audio ({missingAudioJobs.length})
          </Button>

          <label className="flex min-h-11 items-center gap-2 rounded-lg border border-chunks-hairline bg-white px-3 text-sm font-semibold text-chunks-ink shadow-none">
            Per page
            <select
              aria-label="Resources per page"
              className="bg-transparent font-semibold text-chunks-red outline-none"
              onChange={(event) => setPageSize(Number(event.target.value))}
              value={pageSize}
            >
              <option value={50}>50</option>
              <option value={100}>100</option>
              <option value={200}>200</option>
            </select>
          </label>
        </div>
      </Panel>

      <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-chunks-hairline bg-white p-3 text-sm text-chunks-body">
        <span>
          Showing <strong className="text-chunks-ink">{pageRangeLabel}</strong> resources for <strong className="text-chunks-ink">{getFilterLabel(filters)}</strong>.
        </span>
        <div className="flex flex-wrap gap-2">
          <Button disabled={safeCurrentPage <= 1} disabledReason="Already on the first page" onClick={() => setCurrentPage((page) => Math.max(1, page - 1))} type="button" variant="secondary">
            Previous
          </Button>
          <span className="flex min-h-11 items-center rounded-full bg-chunks-soft px-4 font-semibold text-chunks-ink">
            Page {safeCurrentPage}/{totalPages}
          </span>
          <Button disabled={safeCurrentPage >= totalPages} disabledReason="Already on the last page" onClick={() => setCurrentPage((page) => Math.min(totalPages, page + 1))} type="button" variant="secondary">
            Next
          </Button>
        </div>
      </div>

      <div className="grid gap-3 xl:grid-cols-2">
        {pagedResources.map((resource) => (
          <ResourceCard
            isSelected={resource.id === selectedResource?.id}
            key={resource.id}
            metadata={metadata}
            onSelect={() => setSelectedResourceId(resource.id)}
            resource={resource}
          />
        ))}
      </div>

      {selectedResource ? (
        <Card as="form" id="new-resource" onSubmit={handleSave}>
          <CardHeader>
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <Badge tone="info">Inspector</Badge>
                <h3 className="mt-3 text-xl font-semibold text-chunks-ink">Edit selected resource</h3>
              </div>
              <Badge tone={selectedResource.approval_status === 'approved' ? 'success' : 'warning'}>{selectedResource.approval_status}</Badge>
            </div>
          </CardHeader>
          <CardContent className="mt-5 grid gap-4 md:grid-cols-2">
            <SelectField label="Course" name="courseId" defaultValue={selectedResource.course_id} options={courses.map((course) => ({ label: course.title, value: course.id }))} />
            <SelectField label="Lesson" name="lessonId" defaultValue={selectedResource.lesson_id} options={lessons.map((lesson) => ({ label: lesson.title, value: lesson.id }))} />
            <SelectField label="Topic" name="sectionId" defaultValue={selectedResource.section_id ?? ''} options={sections.map((section) => ({ label: section.title, value: section.id }))} />
            <label className="block">
              <span className="text-sm font-semibold text-chunks-ink">Sentence code</span>
              <input className="mt-2 min-h-12 w-full rounded-2xl border border-chunks-hairline px-4" defaultValue={selectedResource.sentence_code} name="sentenceCode" />
            </label>
            <label className="block md:col-span-2">
              <span className="text-sm font-semibold text-chunks-ink">English prompt</span>
              <textarea className="mt-2 min-h-24 w-full rounded-2xl border border-chunks-hairline px-4 py-3" defaultValue={selectedResource.text_en ?? ''} name="textEn" />
            </label>
            <label className="block md:col-span-2">
              <span className="text-sm font-semibold text-chunks-ink">Vietnamese prompt</span>
              <textarea className="mt-2 min-h-24 w-full rounded-2xl border border-chunks-hairline px-4 py-3" defaultValue={selectedResource.text_vi ?? ''} name="textVi" />
            </label>
            <label className="block">
              <span className="text-sm font-semibold text-chunks-ink">Audio EN URL</span>
              <input className="mt-2 min-h-12 w-full rounded-2xl border border-chunks-hairline px-4" defaultValue={selectedResource.audio_en_url ?? ''} name="audioEnUrl" />
            </label>
            <label className="block">
              <span className="text-sm font-semibold text-chunks-ink">Audio VI URL</span>
              <input className="mt-2 min-h-12 w-full rounded-2xl border border-chunks-hairline px-4" defaultValue={selectedResource.audio_vi_url ?? ''} name="audioViUrl" />
            </label>
            <label className="block">
              <span className="text-sm font-semibold text-chunks-ink">CVR Ω</span>
              <input className="mt-2 min-h-12 w-full rounded-2xl border border-chunks-hairline px-4" defaultValue={selectedResource.cvr_value} min="0" name="cvrValue" step="0.01" type="number" />
            </label>
            <SelectField
              label="Approval status"
              name="approvalStatus"
              defaultValue={selectedResource.approval_status}
              options={[
                { label: 'Draft', value: 'draft' },
                { label: 'Approved', value: 'approved' },
                { label: 'Archived', value: 'archived' },
              ]}
            />
          </CardContent>
          <CardFooter className="flex flex-wrap gap-3">
            <Button type="submit">Save resource</Button>
            <Button onClick={handleGenerateMissingAudio} type="button" variant="secondary">
              Generate missing audio securely
            </Button>
            <Button onClick={() => setIsConfirmOpen(true)} type="button" variant="secondary">
              Approve selected
            </Button>
          </CardFooter>
          {statusMessage ? <Alert className="mt-5" title="Resource status" tone="success">{statusMessage}</Alert> : null}
          {error ? <Alert className="mt-5" title="Resource action failed" tone="error">{error}</Alert> : null}
        </Card>
      ) : (
        <Alert title="No resources">No editable resources match the current filters.</Alert>
      )}

      <ConfirmBatchActionDialog
        actionLabel="Approve selected resource"
        details="This changes the selected sentence resource to approved, making it available to Teacher setup."
        isOpen={isConfirmOpen}
        onCancel={() => setIsConfirmOpen(false)}
        onConfirm={handleConfirmBatchApprove}
      />
    </section>
  )
}

interface ResourceCardProps {
  isSelected: boolean
  metadata: ResourceMetadataMaps
  onSelect: () => void
  resource: SentenceResource
}

function ResourceCard({ isSelected, metadata, onSelect, resource }: ResourceCardProps) {
  const lessonTitle = metadata.lessonById.get(resource.lesson_id) ?? 'Unassigned lesson'
  const sectionTitle = resource.section_id ? metadata.sectionById.get(resource.section_id) ?? 'Unassigned topic' : 'No topic'

  return (
    <Card className={isSelected ? 'border-chunks-red ring-1 ring-chunks-red' : ''} padding="none">
      <button className="w-full p-3 text-left transition hover:bg-chunks-soft/60 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-chunks-red" onClick={onSelect} type="button">
        <div className="grid gap-3 md:grid-cols-[minmax(0,1fr)_auto] md:items-start">
          <div className="min-w-0">
            <p className="text-sm font-semibold leading-6 text-chunks-ink">{resource.text_en || resource.text_prompt || 'No English prompt yet.'}</p>
            {resource.text_vi ? <p className="mt-1 truncate text-sm text-chunks-body">{resource.text_vi}</p> : null}
            <p className="mt-2 text-xs text-chunks-muted">{lessonTitle} · {sectionTitle} · Code {resource.sentence_code}</p>
          </div>
          <div className="flex flex-wrap gap-2 md:justify-end">
            {isSelected ? <Badge tone="brand">Selected</Badge> : <Badge tone={resource.approval_status === 'approved' ? 'success' : 'warning'}>{resource.approval_status}</Badge>}
            {!resource.audio_en_url ? <Badge tone="warning">EN missing</Badge> : <Badge tone="success">EN ready</Badge>}
            {!resource.audio_vi_url ? <Badge tone="warning">VI missing</Badge> : <Badge tone="success">VI ready</Badge>}
          </div>
        </div>

        <div className="mt-3 grid gap-2 sm:grid-cols-3">
          <StatusTile label="CVR Ω" value={String(resource.cvr_value)} />
          <StatusTile label="Order" value={String(resource.order_index)} />
          <StatusTile label="Course" value={metadata.courseById.get(resource.course_id) ?? 'Course'} />
        </div>
      </button>
    </Card>
  )
}

function MetricPill({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-chunks-hairline bg-white p-3 shadow-soft">
      <p className="text-[0.65rem] font-black uppercase tracking-[0.16em] text-chunks-body">{label}</p>
      <p className="mt-1 truncate text-sm font-semibold text-chunks-ink">{value}</p>
    </div>
  )
}

function StatusTile({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-chunks-hairline bg-white p-3">
      <p className="text-[0.65rem] font-black uppercase tracking-[0.16em] text-chunks-body">{label}</p>
      <p className="mt-1 truncate text-sm font-semibold text-chunks-ink">{value}</p>
    </div>
  )
}

function SelectField({
  defaultValue,
  label,
  name,
  options,
}: {
  defaultValue: string
  label: string
  name: string
  options: Array<{ label: string; value: string }>
}) {
  return (
    <label className="block">
      <span className="text-sm font-semibold text-chunks-ink">{label}</span>
      <select className="mt-2 min-h-12 w-full rounded-2xl border border-chunks-hairline bg-white px-4" defaultValue={defaultValue} name={name}>
        {options.map((option) => (
          <option key={option.value} value={option.value}>{option.label}</option>
        ))}
      </select>
    </label>
  )
}

interface ResourceMetadataMaps {
  courseById: Map<string, string>
  lessonById: Map<string, string>
  sectionById: Map<string, string>
}

function buildMetadataMaps(courses: Course[], lessons: Lesson[], sections: LessonSection[]): ResourceMetadataMaps {
  return {
    courseById: new Map(courses.map((course) => [course.id, course.title])),
    lessonById: new Map(lessons.map((lesson) => [lesson.id, lesson.title])),
    sectionById: new Map(sections.map((section) => [section.id, section.title])),
  }
}

function filterResourcesByScope(resources: SentenceResource[], filters: ResourceLibraryFilters): SentenceResource[] {
  return resources.filter((resource) => {
    if (filters.courseId && resource.course_id !== filters.courseId) return false
    if (filters.lessonId && resource.lesson_id !== filters.lessonId) return false
    if (filters.sectionId && resource.section_id !== filters.sectionId) return false
    if (filters.approvalStatus !== 'all' && resource.approval_status !== filters.approvalStatus) return false
    return true
  })
}

function getFilterLabel(filters: ResourceLibraryFilters): string {
  const parts: string[] = []
  if (filters.courseId) parts.push('selected course')
  if (filters.lessonId) parts.push('selected lesson')
  if (filters.sectionId) parts.push('selected topic')
  if (filters.approvalStatus !== 'all') parts.push(filters.approvalStatus)
  if (filters.audio === 'missing-en') parts.push('missing English audio')
  if (filters.audio === 'missing-vi') parts.push('missing Vietnamese audio')
  return parts.length ? parts.join(' · ') : 'all resources'
}

function getErrorMessage(error: unknown): string {
  if (error && typeof error === 'object' && 'message' in error) return String(error.message)
  return 'Something went wrong. Please try again.'
}
