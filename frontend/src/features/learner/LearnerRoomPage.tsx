import { useCallback, useEffect, useState } from 'react'

import { ActionDock } from '../../components/layout/ActionDock'
import { WorkspaceLayout } from '../../components/layout/WorkspaceLayout'
import { Alert } from '../../components/ui/Alert'
import { Card } from '../../components/ui/Card'
import { StatusBadge } from '../../components/ui/StatusBadge'
import type { ResponseColor, UUID } from '../../lib/domain/types'
import { subscribeToRoomState, unsubscribeFromRoomState } from '../../lib/supabase/realtime'
import {
  loadRoomProgress,
  subscribeToProgressUpdates,
  unsubscribeFromProgressUpdates,
  type RoomProgressState,
} from '../live-room/progressService'
import { LastCapturedResponse } from './components/LastCapturedResponse'
import { ProgressCards } from './components/ProgressCards'
import { ResponseButtons } from './components/ResponseButtons'
import { LearnerStateBanner } from './components/LearnerStateBanner'
import { loadLearnerRoomState, submitLearnerResponse, type LearnerRoomStateResult } from './responseService'

interface LearnerRoomPageProps {
  learnerId: UUID
  roomCode: string
}

function getErrorMessage(error: unknown): string {
  if (error && typeof error === 'object' && 'message' in error) return String(error.message)
  return 'Something went wrong. Please try again.'
}

export function LearnerRoomPage({ learnerId, roomCode }: LearnerRoomPageProps) {
  const [state, setState] = useState<LearnerRoomStateResult | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [progressState, setProgressState] = useState<RoomProgressState | null>(null)
  const [submittingColor, setSubmittingColor] = useState<ResponseColor | null>(null)

  const refreshProgress = useCallback(async (roomId: UUID) => {
    const nextProgress = await loadRoomProgress(roomId)
    setProgressState(nextProgress)
    return nextProgress
  }, [])

  const refreshState = useCallback(async () => {
    const nextState = await loadLearnerRoomState(roomCode, learnerId)
    setState(nextState)
    setError(null)
    await refreshProgress(nextState.room.id)
    return nextState
  }, [learnerId, refreshProgress, roomCode])

  useEffect(() => {
    let isMounted = true
    setIsLoading(true)
    refreshState()
      .catch((loadError: unknown) => {
        if (isMounted) setError(getErrorMessage(loadError))
      })
      .finally(() => {
        if (isMounted) setIsLoading(false)
      })
    return () => {
      isMounted = false
    }
  }, [refreshState])

  useEffect(() => {
    if (!state?.room.id) return undefined
    const channel = subscribeToRoomState({
      roomId: state.room.id,
      onChange: () => {
        void refreshState().catch((subscriptionError: unknown) => setError(getErrorMessage(subscriptionError)))
      },
      onReconnect: async () => {
        await refreshState()
      },
    })
    return () => {
      void unsubscribeFromRoomState(channel)
    }
  }, [refreshState, state?.room.id])

  useEffect(() => {
    if (!state?.room.id) return undefined
    const channel = subscribeToProgressUpdates({
      roomId: state.room.id,
      onChange: () => {
        void refreshProgress(state.room.id).catch((subscriptionError: unknown) => setError(getErrorMessage(subscriptionError)))
      },
      onReconnect: async () => {
        await refreshProgress(state.room.id)
      },
    })
    return () => {
      void unsubscribeFromProgressUpdates(channel)
    }
  }, [refreshProgress, state?.room.id])

  async function handleRespond(responseColor: ResponseColor) {
    if (!state?.currentRound) return
    setSubmittingColor(responseColor)
    setError(null)
    try {
      await submitLearnerResponse({
        learnerId,
        responseColor,
        roundId: state.currentRound.id,
        openedAt: state.currentRound.opened_at,
      })
      await refreshState()
    } catch (submitError) {
      setError(getErrorMessage(submitError))
    } finally {
      setSubmittingColor(null)
    }
  }

  if (isLoading) {
    return <Alert title="Loading room">Fetching current sentence, round status, and eligibility.</Alert>
  }

  if (!state) {
    return <Alert tone="error" title="Room unavailable">{error ?? 'Unable to load this room.'}</Alert>
  }

  const sentence = state.currentSentence
  const learnerProgress = progressState?.summaries.find((row) => row.summary.learner_id === learnerId) ?? null

  return (
    <WorkspaceLayout
      primary={
        <>
          <Card variant="dark">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.22em] text-white/60">Current sentence code</p>
                <h2 className="mt-3 font-mono text-4xl font-semibold leading-tight text-white">
                  {sentence?.sentence_code ?? 'Waiting for teacher'}
                </h2>
                <p className="mt-4 max-w-xl text-base leading-7 text-white/75">
                  Listen to the classroom audio from your teacher, then answer with Red, Yellow, or Green when you are eligible.
                </p>
              </div>
              <StatusBadge tone={state.currentRound?.status === 'open' ? 'success' : 'neutral'}>
                {state.currentRound?.status ?? state.room.status}
              </StatusBadge>
            </div>
          </Card>

          <LearnerStateBanner disabledReason={state.disabledReason} learnerState={state.learnerState} />

          <ActionDock label="Respond" meta="One tracked response is allowed for each open Sentence Window.">
            <ResponseButtons
              disabledReason={state.disabledReason}
              learnerState={state.learnerState}
              onRespond={handleRespond}
              submittingColor={submittingColor}
            />
          </ActionDock>

          {error ? <Alert tone="error" title="Response failed">{error}</Alert> : null}
        </>
      }
      secondary={
        <>
          <Card>
            <h2 className="text-lg font-semibold text-chunks-ink">Room status</h2>
            <dl className="mt-5 space-y-3 text-sm text-chunks-body">
              <div className="flex justify-between gap-4"><dt>Room</dt><dd className="font-mono font-semibold text-chunks-ink">{state.room.room_code}</dd></div>
              <div className="flex justify-between gap-4"><dt>Round</dt><dd className="font-mono font-semibold text-chunks-ink">{state.currentRound?.round_index ?? 'Waiting'}</dd></div>
              <div className="flex justify-between gap-4"><dt>Eligibility</dt><dd className="font-semibold text-chunks-ink">{state.learnerState}</dd></div>
            </dl>
            {state.existingResponse ? (
              <Alert className="mt-5" tone="success" title="Captured">
                {state.existingResponse.response_color.toUpperCase()} response stored with reflection time {state.existingResponse.reflection_seconds}s.
              </Alert>
            ) : null}
          </Card>
          <ProgressCards summary={learnerProgress?.summary ?? null} />
          <LastCapturedResponse response={learnerProgress?.lastResponse ?? null} />
        </>
      }
    />
  )
}
