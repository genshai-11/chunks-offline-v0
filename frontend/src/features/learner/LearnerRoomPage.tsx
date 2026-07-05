import { useCallback, useEffect, useState } from 'react'

import { ActionDock } from '../../components/layout/ActionDock'
import { WorkspaceLayout } from '../../components/layout/WorkspaceLayout'
import { Alert } from '../../components/ui/Alert'
import { Badge, Card } from '../../components/primitives'
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
  const [realtimeStatus, setRealtimeStatus] = useState<'connecting' | 'live' | 'error' | 'reconnecting'>('connecting')

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
    setRealtimeStatus('connecting')
    const channel = subscribeToRoomState({
      roomId: state.room.id,
      onChange: () => {
        void refreshState().catch((subscriptionError: unknown) => setError(getErrorMessage(subscriptionError)))
      },
      onReconnect: async () => {
        setRealtimeStatus('live')
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

  // T110: visible realtime status for learner (phone friendly)
  const realtimeBadge = (
    <div className="mb-2 text-xs uppercase tracking-[0.16em] text-chunks-body">
      Realtime: <span className={realtimeStatus === 'live' ? 'font-semibold text-emerald-600' : 'text-amber-600'}>{realtimeStatus}</span>
    </div>
  )

  const sentence = state.currentSentence
  const sentenceIdentifier = sentence?.sentence_code ?? 'Waiting for teacher'
  const learnerProgress = progressState?.summaries.find((row) => row.summary.learner_id === learnerId) ?? null
  const showResponseControls = state.learnerState === 'assigned' && !state.roundHasCapturedResponse

  return (
    <WorkspaceLayout
      primary={
        <>
          {realtimeBadge}
          <Card className="border-l-4 border-l-chunks-red" padding="sm">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="text-xs font-black uppercase tracking-[0.18em] text-chunks-body">Current sentence</p>
                <h2 className="mt-2 font-mono text-5xl font-black leading-none tracking-tight text-chunks-ink sm:text-6xl">
                  {sentenceIdentifier}
                </h2>
                <p className="mt-3 max-w-xl text-sm leading-6 text-chunks-body">
                  Listen to the teacher. When the response window is open, choose one color icon.
                </p>
              </div>
              <Badge tone={state.currentRound?.status === 'open' ? 'success' : 'neutral'}>
                {state.currentRound?.status ?? state.room.status}
              </Badge>
            </div>
          </Card>

          <LearnerStateBanner disabledReason={state.disabledReason} learnerState={state.learnerState} />

          {showResponseControls ? (
            <ActionDock label="Respond" meta="One tracked response is allowed for each open Sentence Window.">
              <ResponseButtons
                disabledReason={state.disabledReason}
                learnerState={state.learnerState}
                onRespond={handleRespond}
                submittingColor={submittingColor}
              />
            </ActionDock>
          ) : null}

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
              {state.currentRound?.opened_at && (
                <div className="flex justify-between gap-4 text-xs text-chunks-body"><dt>Opened</dt><dd>{new Date(state.currentRound.opened_at).toLocaleTimeString()}</dd></div>
              )}
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
