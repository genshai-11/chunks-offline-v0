import type { ReactNode } from 'react'
import { FormEvent, useEffect, useState } from 'react'

import { AppShell } from '../../components/layout/AppShell'
import { WorkspaceLayout } from '../../components/layout/WorkspaceLayout'
import { Alert } from '../../components/ui/Alert'
import { Button } from '../../components/ui/Button'
import { Card } from '../../components/ui/Card'
import { getStoredLearnerId, joinRoom, loadRoomForJoin, storeLearnerId } from './learnerJoinService'
import { LearnerRoomPage } from './LearnerRoomPage'

interface LearnerJoinPageProps {
  roomCode: string
  themeControl?: ReactNode
}

function getErrorMessage(error: unknown): string {
  if (error && typeof error === 'object' && 'message' in error) return String(error.message)
  return 'Something went wrong. Please try again.'
}

export function LearnerJoinPage({ roomCode, themeControl }: LearnerJoinPageProps) {
  const [displayName, setDisplayName] = useState('')
  const [learnerId, setLearnerId] = useState<string | null>(() => getStoredLearnerId(roomCode))
  const [roomTitle, setRoomTitle] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isJoining, setIsJoining] = useState(false)

  useEffect(() => {
    let mounted = true
    loadRoomForJoin(roomCode)
      .then((room) => {
        if (mounted) setRoomTitle(room.title)
      })
      .catch((loadError: unknown) => {
        if (mounted) setError(getErrorMessage(loadError))
      })
    return () => {
      mounted = false
    }
  }, [roomCode])

  async function handleJoin(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setIsJoining(true)
    setError(null)
    try {
      const result = await joinRoom({ roomCode, displayName })
      storeLearnerId(roomCode, result.learner.id)
      setLearnerId(result.learner.id)
      setRoomTitle(result.room.title)
    } catch (joinError) {
      setError(getErrorMessage(joinError))
    } finally {
      setIsJoining(false)
    }
  }

  return (
    <AppShell
      description="Join with a display name, then answer only when your state says assigned."
      eyebrow="Learner Room"
      statusLabel={roomCode}
      themeControl={themeControl}
      title={roomTitle ?? `Join room ${roomCode}`}
    >
      {learnerId ? (
        <LearnerRoomPage learnerId={learnerId} roomCode={roomCode} />
      ) : (
        <WorkspaceLayout
          primary={
            <Card>
              <form className="space-y-5" onSubmit={handleJoin}>
                <label className="block">
                  <span className="text-sm font-semibold text-chunks-ink">Display name</span>
                  <input
                    className="mt-2 min-h-12 w-full rounded-2xl border border-chunks-hairline bg-white px-4 text-chunks-ink"
                    onChange={(event) => setDisplayName(event.target.value)}
                    placeholder="Your classroom name"
                    value={displayName}
                  />
                  <span className="mt-2 block text-sm text-chunks-body">This name appears in the teacher roster.</span>
                </label>
                <Button disabled={isJoining || !displayName.trim()} type="submit">
                  {isJoining ? 'Joining…' : 'Join room'}
                </Button>
              </form>
              {error ? <Alert className="mt-5" tone="error" title="Cannot join room">{error}</Alert> : null}
            </Card>
          }
          secondary={
            <Card variant="dark">
              <p className="text-sm font-semibold uppercase tracking-[0.22em] text-white/60">Learner rules</p>
              <ul className="mt-5 space-y-3 text-sm leading-6 text-white/80">
                <li>Wait until the teacher opens a Sentence Window.</li>
                <li>Assigned learners can answer Red, Yellow, or Green.</li>
                <li>Each round stores one tracked response.</li>
              </ul>
            </Card>
          }
        />
      )}
    </AppShell>
  )
}
