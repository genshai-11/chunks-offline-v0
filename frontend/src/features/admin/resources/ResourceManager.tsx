import type { FormEvent } from 'react'
import { useMemo, useState } from 'react'

import { Alert } from '../../../components/ui/Alert'
import { Button } from '../../../components/ui/Button'
import { Card } from '../../../components/ui/Card'
import { StatusBadge } from '../../../components/ui/StatusBadge'
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

interface ResourceManagerProps {
  courses: Course[]
  lessons: Lesson[]
  onRefresh: () => Promise<void>
  resources: SentenceResource[]
  sections: LessonSection[]
}

type AudioFilter = 'all' | 'missing-en' | 'missing-vi'

export function ResourceManager({ courses, lessons, onRefresh, resources, sections }: ResourceManagerProps) {
  const [audioFilter, setAudioFilter] = useState<AudioFilter>('all')
  const [selectedResourceId, setSelectedResourceId] = useState<string>(resources[0]?.id ?? '')
  const [isConfirmOpen, setIsConfirmOpen] = useState(false)
  const [statusMessage, setStatusMessage] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const filteredResources = useMemo(() => filterResourcesByAudio(resources, audioFilter), [audioFilter, resources])
  const selectedResource = resources.find((resource) => resource.id === selectedResourceId) ?? filteredResources[0] ?? null
  const missingAudioJobs = useMemo(() => getMissingAudioQueueItems(filteredResources), [filteredResources])

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
    <section aria-labelledby="resource-manager-title" className="space-y-4">
      <Card>
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-chunks-body">Resource Manager</p>
            <h2 className="mt-1 text-2xl font-semibold text-chunks-ink" id="resource-manager-title">
              Sentence resources, CVR Ω, and audio readiness
            </h2>
          </div>
          <StatusBadge tone="brand">{filteredResources.length} shown</StatusBadge>
        </div>

        <div className="mt-5 flex flex-wrap gap-2">
          <Button onClick={() => setAudioFilter('all')} type="button" variant={audioFilter === 'all' ? 'primary' : 'secondary'}>
            All resources
          </Button>
          <Button onClick={() => setAudioFilter('missing-en')} type="button" variant={audioFilter === 'missing-en' ? 'primary' : 'secondary'}>
            Missing English audio
          </Button>
          <Button onClick={() => setAudioFilter('missing-vi')} type="button" variant={audioFilter === 'missing-vi' ? 'primary' : 'secondary'}>
            Missing Vietnamese audio
          </Button>
          <Button disabled={missingAudioJobs.length === 0} onClick={handleGenerateAllMissingAudio} type="button" variant="secondary">
            Generate all missing audio ({missingAudioJobs.length})
          </Button>
        </div>
        <p className="mt-4 rounded-2xl bg-chunks-soft p-4 text-sm leading-6 text-chunks-body">
          Queued audio files use <strong className="text-chunks-ink">sentence-audio/{'{courseId}'}/{'{lessonId}'}/{'{sentenceCode}'}-{'{language}'}.mp3</strong>. The browser only queues jobs; the secure worker/operator stores files and fills audio URLs.
        </p>
      </Card>

      {filteredResources.map((resource) => (
        <Card key={resource.id} className={resource.id === selectedResource?.id ? 'ring-2 ring-chunks-red' : ''}>
          <button className="w-full text-left" onClick={() => setSelectedResourceId(resource.id)} type="button">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="font-mono text-lg font-semibold text-chunks-ink">{resource.sentence_code}</p>
                <p className="mt-1 text-sm text-chunks-body">CVR Ω {resource.cvr_value} · {resource.approval_status}</p>
              </div>
              <div className="flex flex-wrap gap-2">
                {!resource.audio_en_url ? <StatusBadge tone="warning">Missing EN audio</StatusBadge> : <StatusBadge tone="success">EN ready</StatusBadge>}
                {!resource.audio_vi_url ? <StatusBadge tone="warning">Missing VI audio</StatusBadge> : <StatusBadge tone="success">VI ready</StatusBadge>}
              </div>
            </div>
          </button>
        </Card>
      ))}

      {selectedResource ? (
        <Card as="form" onSubmit={handleSave}>
          <h3 className="text-xl font-semibold text-chunks-ink">Edit selected resource</h3>
          <div className="mt-5 grid gap-4 md:grid-cols-2">
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
          </div>
          <div className="mt-5 flex flex-wrap gap-3">
            <Button type="submit">Save resource</Button>
            <Button onClick={handleGenerateMissingAudio} type="button" variant="secondary">
              Generate missing audio securely
            </Button>
            <Button onClick={() => setIsConfirmOpen(true)} type="button" variant="secondary">
              Approve selected
            </Button>
          </div>
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

function getErrorMessage(error: unknown): string {
  if (error && typeof error === 'object' && 'message' in error) return String(error.message)
  return 'Something went wrong. Please try again.'
}
