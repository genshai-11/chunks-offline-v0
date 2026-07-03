import { Card } from '../../../components/ui/Card'
import { StatusBadge } from '../../../components/ui/StatusBadge'
import type { TeacherRosterMember } from '../../live-room/roundService'

interface TeacherRosterProps {
  members: TeacherRosterMember[]
  assignedLearnerId: string | null
  onAssignedLearnerChange: (learnerId: string | null) => void
}

export function TeacherRoster({ members, assignedLearnerId, onAssignedLearnerChange }: TeacherRosterProps) {
  return (
    <Card>
      <div className="flex items-center justify-between gap-4">
        <h2 className="text-xl font-semibold text-chunks-ink">Roster</h2>
        <StatusBadge tone={members.length > 0 ? 'success' : 'neutral'}>{members.length} learners</StatusBadge>
      </div>

      {members.length === 0 ? (
        <p className="mt-5 rounded-2xl bg-chunks-soft p-4 text-sm leading-6 text-chunks-body">
          Waiting for learners. Assigned mode requires one active learner before opening a round.
        </p>
      ) : (
        <fieldset className="mt-5 space-y-3">
          <legend className="sr-only">Choose assigned learner</legend>
          {members.map((member) => {
            const learnerName = member.learner?.display_name ?? 'Unnamed learner'
            return (
              <label
                className="flex cursor-pointer items-center justify-between gap-4 rounded-2xl border border-chunks-hairline bg-chunks-soft p-4"
                key={member.id}
              >
                <span>
                  <span className="block font-semibold text-chunks-ink">{learnerName}</span>
                  <span className="text-sm text-chunks-body">{member.presence_status}</span>
                </span>
                <input
                  checked={assignedLearnerId === member.learner_id}
                  className="h-5 w-5 accent-chunks-red"
                  name="assignedLearnerId"
                  onChange={() => onAssignedLearnerChange(member.learner_id)}
                  type="radio"
                  value={member.learner_id}
                />
              </label>
            )
          })}
        </fieldset>
      )}
    </Card>
  )
}
