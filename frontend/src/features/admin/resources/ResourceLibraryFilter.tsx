import type { ReactNode } from 'react'

import type { ApprovalStatus, Course, Lesson, LessonSection } from '../../../lib/domain/types'

export type ResourceAudioFilter = 'all' | 'missing-en' | 'missing-vi'
export type ResourceApprovalFilter = 'all' | ApprovalStatus

export interface ResourceLibraryFilters {
  approvalStatus: ResourceApprovalFilter
  audio: ResourceAudioFilter
  courseId: string
  lessonId: string
  sectionId: string
}

interface ResourceLibraryFilterProps {
  courses: Course[]
  filters: ResourceLibraryFilters
  lessons: Lesson[]
  onChange: (filters: ResourceLibraryFilters) => void
  resultCount: number
  sections: LessonSection[]
}

export function ResourceLibraryFilter({ courses, filters, lessons, onChange, resultCount, sections }: ResourceLibraryFilterProps) {
  const lessonsForCourse = filters.courseId ? lessons.filter((lesson) => lesson.course_id === filters.courseId) : lessons
  const sectionsForLesson = filters.lessonId ? sections.filter((section) => section.lesson_id === filters.lessonId) : sections

  function update(next: Partial<ResourceLibraryFilters>) {
    const merged = { ...filters, ...next }
    onChange(merged)
  }

  function updateCourse(courseId: string) {
    const nextLessons = courseId ? lessons.filter((lesson) => lesson.course_id === courseId) : lessons
    const lessonId = nextLessons.some((lesson) => lesson.id === filters.lessonId) ? filters.lessonId : ''
    const nextSections = lessonId ? sections.filter((section) => section.lesson_id === lessonId) : sections
    const sectionId = nextSections.some((section) => section.id === filters.sectionId) ? filters.sectionId : ''
    onChange({ ...filters, courseId, lessonId, sectionId })
  }

  function updateLesson(lessonId: string) {
    const nextSections = lessonId ? sections.filter((section) => section.lesson_id === lessonId) : sections
    const sectionId = nextSections.some((section) => section.id === filters.sectionId) ? filters.sectionId : ''
    onChange({ ...filters, lessonId, sectionId })
  }

  return (
    <section aria-label="Library resource filters" className="grid gap-3 rounded-xl border border-chunks-hairline bg-white p-3 shadow-none">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.16em] text-chunks-body">Scope filter</p>
          <p className="mt-1 text-sm text-chunks-body">Course, lesson, topic, approval, and audio readiness.</p>
        </div>
        <p className="rounded-lg bg-chunks-soft px-3 py-2 text-sm font-semibold text-chunks-ink">{resultCount} shown</p>
      </div>

      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-5">
        <SelectControl label="Course" onChange={updateCourse} value={filters.courseId}>
          <option value="">All courses</option>
          {courses.map((course) => <option key={course.id} value={course.id}>{course.title}</option>)}
        </SelectControl>

        <SelectControl label="Lesson" onChange={updateLesson} value={filters.lessonId}>
          <option value="">All lessons</option>
          {lessonsForCourse.map((lesson) => <option key={lesson.id} value={lesson.id}>{lesson.title}</option>)}
        </SelectControl>

        <SelectControl label="Topic" onChange={(sectionId) => update({ sectionId })} value={filters.sectionId}>
          <option value="">All topics</option>
          {sectionsForLesson.map((section) => <option key={section.id} value={section.id}>{section.title}</option>)}
        </SelectControl>

        <SelectControl label="Approval" onChange={(approvalStatus) => update({ approvalStatus: approvalStatus as ResourceApprovalFilter })} value={filters.approvalStatus}>
          <option value="all">Any approval</option>
          <option value="draft">Draft</option>
          <option value="approved">Approved</option>
          <option value="archived">Archived</option>
        </SelectControl>

        <SelectControl label="Audio" onChange={(audio) => update({ audio: audio as ResourceAudioFilter })} value={filters.audio}>
          <option value="all">Any audio</option>
          <option value="missing-en">Missing English</option>
          <option value="missing-vi">Missing Vietnamese</option>
        </SelectControl>
      </div>
    </section>
  )
}

function SelectControl({
  children,
  label,
  onChange,
  value,
}: {
  children: ReactNode
  label: string
  onChange: (value: string) => void
  value: string
}) {
  return (
    <label className="block">
      <span className="text-xs font-black uppercase tracking-[0.14em] text-chunks-body">{label}</span>
      <select
        className="mt-2 min-h-11 w-full rounded-lg border border-chunks-hairline bg-white px-3 text-sm font-semibold text-chunks-ink outline-none focus:border-chunks-red"
        onChange={(event) => onChange(event.target.value)}
        value={value}
      >
        {children}
      </select>
    </label>
  )
}
