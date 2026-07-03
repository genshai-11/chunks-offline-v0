import type { ReactNode } from 'react'
import { useCallback, useEffect, useMemo, useState } from 'react'

import { ActionDock } from '../../components/layout/ActionDock'
import { AppShell } from '../../components/layout/AppShell'
import { WorkspaceLayout } from '../../components/layout/WorkspaceLayout'
import { Alert } from '../../components/ui/Alert'
import { Button } from '../../components/ui/Button'
import { CollapsiblePanel } from '../../components/ui/CollapsiblePanel'
import { subscribeToRoomState, unsubscribeFromRoomState } from '../../lib/supabase/realtime'
import { CurrentSentenceWindow } from '../live-room/CurrentSentenceWindow'
import {
  loadRoomProgress,
  subscribeToProgressUpdates,
  unsubscribeFromProgressUpdates,
  type RoomProgressState,
} from '../live-room/progressService'
import {
  advanceRound,
  closeRound,
  finishRoom,
  getNextSentence,
  loadTeacherRoomState,
  openRound,
  type TeacherRoomState,
} from '../live-room/roundService'
import { CapturedResponsePanel } from './components/CapturedResponsePanel'
import { ShareLinkCard } from './components/ShareLinkCard'
import { TeacherRoster } from './components/TeacherRoster'

interface TeacherRoomPageProps {
  roomCode: string
  themeControl?: ReactNode
}

function getErrorMessage(error: unknown): string {
  if (error && typeof error === 'object' && 'message' in error) return String(error.message)
  return 'Something went wrong. Please try again.'
}

export function TeacherRoomPage({ roomCode, themeControl }: TeacherRoomPageProps) {
  const [state, setState] = useState<TeacherRoomState | null>(null)
  const [assignedLearnerId, setAssignedLearnerId] = useState<string | null>(null)
  const [selectedCciCardId, setSelectedCciCardId] = useState<string>('')
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isWorking, setIsWorking] = useState(false)
  const [progressState, setProgressState] = useState<RoomProgressState | null>(null)

  const refreshProgress = useCallback(async (roomId: string) => {
    const nextProgress = await loadRoomProgress(roomId)
    setProgressState(nextProgress)
    return nextProgress
  }, [])

  const refreshState = useCallback(async () => {
    const nextState = await loadTeacherRoomState(roomCode)
    setState(nextState)
    setAssignedLearnerId((current) => current ?? nextState.roster[0]?.learner_id ?? null)
    setSelectedCciCardId((current) => {
      if (current) return current
      const resourceScope = nextState.room.resource_scope_filter as { cci_standard_card_id?: string }
      return resourceScope.cci_standard_card_id ?? nextState.cciCards[0]?.id ?? ''
    })
    setError(null)
    await refreshProgress(nextState.room.id)
    return nextState
  }, [refreshProgress, roomCode])

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

  const nextSentence = useMemo(() => (state ? getNextSentence(state) : null), [state])
  const selectedCci = state?.cciCards.find((card) => card.id === selectedCciCardId) ?? null
  const assignedMode = state?.room.default_response_capture_mode === 'assigned'
  const canOpen = Boolean(
    state &&
      nextSentence &&
      selectedCciCardId &&
      state.room.status !== 'finished' &&
      state.currentRound?.status !== 'open' &&
      (!assignedMode || assignedLearnerId),
  )
  const canClose = Boolean(state?.currentRound?.status === 'open')
  const canAdvance = Boolean(state && nextSentence && state.room.status !== 'finished')

  async function runAction(action: () => Promise<unknown>) {
    setIsWorking(true)
    setError(null)
    try {
      await action()
      await refreshState()
    } catch (actionError) {
      setError(getErrorMessage(actionError))
    } finally {
      setIsWorking(false)
    }
  }

  function handleOpenRound() {
    if (!state || !nextSentence) return
    void runAction(() =>
      openRound({
        roomId: state.room.id,
        sentenceResourceId: nextSentence.id,
        assignedLearnerId,
        cciStandardCardId: selectedCciCardId,
        captureMode: state.room.default_response_capture_mode,
        scoringMode: state.room.scoring_mode,
        openedBy: state.room.host_name ?? 'Teacher Host',
      }),
    )
  }

  function handleCloseRound() {
    if (!state?.currentRound) return
    void runAction(() => closeRound(state.currentRound!.id))
  }

  function handleAdvanceRound() {
    if (!state) return
    void runAction(() =>
      advanceRound(state, {
        assignedLearnerId,
        cciStandardCardId: selectedCciCardId,
        captureMode: state.room.default_response_capture_mode,
        scoringMode: state.room.scoring_mode,
        openedBy: state.room.host_name ?? 'Teacher Host',
      }),
    )
  }

  function handleFinishRoom() {
    if (!state) return
    const confirmed = window.confirm('Finish this room? Learners will no longer be able to join or respond.')
    if (!confirmed) return
    void runAction(() => finishRoom(state.room.id))
  }

  const roomStatus = state?.room.status ?? 'loading'
  const rosterSummary = `${state?.roster.length ?? 0} learners`
  const roundSummary = state?.currentRound ? `Round ${state.currentRound.round_index} · ${state.currentRound.status}` : 'No round open'

  return (
    <AppShell
      description="Keep the sentence window in focus while roster, share link, and round settings can collapse when the classroom gets busy."
      eyebrow="Live Room Control"
      headerMeta={
        <div className="theme-card border border-chunks-hairline bg-white p-4 shadow-soft">
          <p className="text-sm font-semibold text-chunks-body">Room status</p>
          <p className="mt-2 text-xl font-semibold text-chunks-ink">{roomStatus}</p>
        </div>
      }
      statusLabel={roomCode}
      themeControl={themeControl}
      title={state?.room.title ?? `Room ${roomCode}`}
    >
      {isLoading ? <Alert className="mb-5" title="Loading live room">Fetching room, roster, and current round.</Alert> : null}
      {error ? <Alert className="mb-5" tone="error" title="Live room action failed">{error}</Alert> : null}

      {state ? (
        <WorkspaceLayout
          primary={
            <>
              <CurrentSentenceWindow round={state.currentRound} sentence={state.currentSentence} nextSentence={nextSentence} />

              <CapturedResponsePanel
                lastResponse={progressState?.lastCapturedResponse ?? null}
                summaries={progressState?.summaries ?? []}
              />

              <ActionDock
                className="xl:sticky xl:top-28"
                label="Round controls"
                meta={
                  <span>
                    <strong className="text-chunks-ink">{roundSummary}</strong>
                    <span className="block">{assignedMode && !assignedLearnerId ? 'Choose an active learner before opening an assigned round.' : 'Controls follow the current durable room state.'}</span>
                  </span>
                }
              >
                <Button disabled={!canOpen || isWorking} onClick={handleOpenRound} type="button">
                  Open round
                </Button>
                <Button disabled={!canClose || isWorking} onClick={handleCloseRound} type="button" variant="secondary">
                  Close round
                </Button>
                <Button disabled={!canAdvance || isWorking} onClick={handleAdvanceRound} type="button" variant="secondary">
                  Advance
                </Button>
                <Button disabled={isWorking || state.room.status === 'finished'} onClick={handleFinishRoom} type="button" variant="secondary">
                  Finish room
                </Button>
              </ActionDock>

              <CollapsiblePanel panelId="teacher-room-round-settings" summary={selectedCci?.label ?? 'Choose CCI'} title="Round settings">
                <div className="grid gap-4 md:grid-cols-2">
                  <label className="block">
                    <span className="text-sm font-semibold text-chunks-ink">CCI standard for next round</span>
                    <select
                      className="mt-2 min-h-12 w-full rounded-2xl border border-chunks-hairline bg-white px-4"
                      onChange={(event) => setSelectedCciCardId(event.target.value)}
                      value={selectedCciCardId}
                    >
                      {state.cciCards.map((card) => (
                        <option key={card.id} value={card.id}>{card.label} · X {card.standard_value}</option>
                      ))}
                    </select>
                  </label>
                  <div className="rounded-2xl bg-chunks-soft p-4 text-sm leading-6 text-chunks-body">
                    <strong className="text-chunks-ink">Mode:</strong> {state.room.default_response_capture_mode} · {state.room.scoring_mode}
                    {selectedCci ? <span> · {selectedCci.label}</span> : null}
                  </div>
                </div>
              </CollapsiblePanel>
            </>
          }
          secondary={
            <>
              <CollapsiblePanel panelId="teacher-room-share-link" summary={state.room.room_code} title="Share link">
                <ShareLinkCard room={state.room} />
              </CollapsiblePanel>
              <CollapsiblePanel panelId="teacher-room-roster" summary={rosterSummary} title="Roster">
                <TeacherRoster
                  assignedLearnerId={assignedLearnerId}
                  members={state.roster}
                  onAssignedLearnerChange={setAssignedLearnerId}
                />
              </CollapsiblePanel>
            </>
          }
        />
      ) : null}
    </AppShell>
  )
}
