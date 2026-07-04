import type { ReactNode } from 'react'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'

import { ActionDock } from '../../components/layout/ActionDock'
import { AppShell } from '../../components/layout/AppShell'
import { WorkspaceLayout } from '../../components/layout/WorkspaceLayout'
import { Alert } from '../../components/ui/Alert'
import { Button } from '../../components/ui/Button'
import { CollapsiblePanel } from '../../components/ui/CollapsiblePanel'
import { subscribeToRoomState, unsubscribeFromRoomState } from '../../lib/supabase/realtime'
import {
  BrowserAudioPlaybackAdapter,
  getSentenceAudioUrl,
  isEditableShortcutTarget,
  type AudioLanguage,
} from '../live-room/audioPlayback'
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
  getLockedSentenceIds,
  getNextSentence,
  getUnplayedSentences,
  loadTeacherRoomState,
  openRound,
  requiresAssignedLearner,
  resolveAssignedLearnerId,
  updateRoomResourceFilter,
  type TeacherRoomState,
} from '../live-room/roundService'
import { CapturedResponsePanel } from './components/CapturedResponsePanel'
import { ShareLinkCard } from './components/ShareLinkCard'
import { TeacherAudioControls } from './components/TeacherAudioControls'
import { TeacherRoster } from './components/TeacherRoster'

interface TeacherRoomPageProps {
  roomCode: string
  themeControl?: ReactNode
}

function getErrorMessage(error: unknown): string {
  if (error && typeof error === 'object' && 'message' in error) return String(error.message)
  return 'Something went wrong. Please try again.'
}

function getCurrentSentenceIndex(state: TeacherRoomState | null): number {
  if (!state) return 0
  const currentSentenceId = state.currentRound?.sentence_resource_id ?? getNextSentence(state)?.id
  if (!currentSentenceId) return 0
  const index = state.availableSentences.findIndex((sentence) => sentence.id === currentSentenceId)
  return index >= 0 ? index + 1 : 0
}

export function TeacherRoomPage({ roomCode, themeControl }: TeacherRoomPageProps) {
  const [state, setState] = useState<TeacherRoomState | null>(null)
  const [assignedLearnerId, setAssignedLearnerId] = useState<string | null>(null)
  const [selectedCciCardId, setSelectedCciCardId] = useState<string>('')
  const [selectedUpcomingSentenceIds, setSelectedUpcomingSentenceIds] = useState<string[]>([])
  const [resourceFilterMessage, setResourceFilterMessage] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isWorking, setIsWorking] = useState(false)
  const [progressState, setProgressState] = useState<RoomProgressState | null>(null)
  const [audioLanguage, setAudioLanguage] = useState<AudioLanguage>('en')
  const [autoPlayAudio, setAutoPlayAudio] = useState(false)
  const [audioError, setAudioError] = useState<string | null>(null)
  const [isAudioPlaying, setIsAudioPlaying] = useState(false)
  const playbackRef = useRef<BrowserAudioPlaybackAdapter | null>(null)

  const refreshProgress = useCallback(async (roomId: string) => {
    const nextProgress = await loadRoomProgress(roomId)
    setProgressState(nextProgress)
    return nextProgress
  }, [])

  const refreshState = useCallback(async () => {
    const nextState = await loadTeacherRoomState(roomCode)
    setState(nextState)
    setSelectedUpcomingSentenceIds(getUnplayedSentences(nextState).map((sentence) => sentence.id))
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
  const displaySentence = state?.currentSentence ?? nextSentence ?? null
  const currentSentenceIndex = useMemo(() => getCurrentSentenceIndex(state), [state])
  const totalResources = state?.availableSentences.length ?? 0
  const lockedSentenceIds = useMemo(() => (state ? getLockedSentenceIds(state) : []), [state])
  const lockedSentenceIdSet = useMemo(() => new Set(lockedSentenceIds), [lockedSentenceIds])
  const lockedSentences = useMemo(
    () => state?.availableSentences.filter((sentence) => lockedSentenceIdSet.has(sentence.id)) ?? [],
    [lockedSentenceIdSet, state?.availableSentences],
  )
  const upcomingSentences = useMemo(() => (state ? getUnplayedSentences(state) : []), [state])
  const requiresAssignedRound = state ? requiresAssignedLearner(state.room.default_response_capture_mode) : false
  const nextAssignedLearnerId = state
    ? resolveAssignedLearnerId({
        captureMode: state.room.default_response_capture_mode,
        selectedLearnerId: assignedLearnerId,
        roster: state.roster,
        rounds: state.rounds,
      })
    : null
  const nextAssignedLearnerName = state?.roster.find((member) => member.learner_id === nextAssignedLearnerId)?.learner?.display_name
  const hasCapturedCurrentRound = Boolean(
    state?.currentRound && progressState?.responses.some((response) => response.round_id === state.currentRound?.id),
  )
  const canOpen = Boolean(
    state &&
      nextSentence &&
      selectedCciCardId &&
      state.room.status !== 'finished' &&
      state.currentRound?.status !== 'open' &&
      (!requiresAssignedRound || nextAssignedLearnerId),
  )
  const canClose = Boolean(state?.currentRound?.status === 'open')
  const canAdvance = Boolean(state && nextSentence && state.room.status !== 'finished')

  function getPlayback() {
    playbackRef.current ??= new BrowserAudioPlaybackAdapter()
    return playbackRef.current
  }

  async function playSentenceAudio(sentence = displaySentence) {
    setAudioError(null)
    const url = getSentenceAudioUrl(sentence, audioLanguage)
    if (!url) {
      setAudioError('Selected audio track is unavailable for this sentence.')
      setIsAudioPlaying(false)
      return
    }

    try {
      await getPlayback().playUrl(url)
      setIsAudioPlaying(getPlayback().isPlaying())
    } catch (playError) {
      setAudioError(getErrorMessage(playError))
      setIsAudioPlaying(false)
    }
  }

  function stopSentenceAudio() {
    getPlayback().stop()
    setIsAudioPlaying(false)
  }

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

  function resolveNextRoundLearnerId(currentState: TeacherRoomState): string | null {
    const resolvedLearnerId = resolveAssignedLearnerId({
      captureMode: currentState.room.default_response_capture_mode,
      selectedLearnerId: assignedLearnerId,
      roster: currentState.roster,
      rounds: currentState.rounds,
    })

    if (requiresAssignedLearner(currentState.room.default_response_capture_mode) && !resolvedLearnerId) {
      throw new Error('No eligible learner is available for this assigned/auto-rotate round.')
    }

    return resolvedLearnerId
  }

  function handleOpenRound() {
    if (!state || !nextSentence) return
    void runAction(async () => {
      await openRound({
        roomId: state.room.id,
        sentenceResourceId: nextSentence.id,
        assignedLearnerId: resolveNextRoundLearnerId(state),
        cciStandardCardId: selectedCciCardId,
        captureMode: state.room.default_response_capture_mode,
        scoringMode: state.room.scoring_mode,
        openedBy: state.room.host_name ?? 'Teacher Host',
      })
      if (autoPlayAudio) await playSentenceAudio(nextSentence)
    })
  }

  function handleCloseRound() {
    if (!state?.currentRound) return
    void runAction(() => closeRound(state.currentRound!.id))
  }

  function handleAdvanceRound() {
    if (!state) return
    void runAction(async () => {
      await advanceRound(state, {
        assignedLearnerId: resolveNextRoundLearnerId(state),
        cciStandardCardId: selectedCciCardId,
        captureMode: state.room.default_response_capture_mode,
        scoringMode: state.room.scoring_mode,
        openedBy: state.room.host_name ?? 'Teacher Host',
      })
      if (autoPlayAudio && nextSentence) await playSentenceAudio(nextSentence)
    })
  }

  function handleKeyboardAdvance() {
    if (!canAdvance || isWorking) return
    if (state?.currentRound?.status === 'open' && !hasCapturedCurrentRound) {
      const confirmed = window.confirm('Advance without a captured response for this round?')
      if (!confirmed) return
    }
    handleAdvanceRound()
  }

  function handleFinishRoom() {
    if (!state) return
    const confirmed = window.confirm('Finish this room? Learners will no longer be able to join or respond.')
    if (!confirmed) return
    void runAction(() => finishRoom(state.room.id))
  }

  function toggleUpcomingSentence(sentenceId: string, checked: boolean) {
    setSelectedUpcomingSentenceIds((current) => {
      if (checked) return current.includes(sentenceId) ? current : [...current, sentenceId]
      return current.filter((currentId) => currentId !== sentenceId)
    })
  }

  function handleSaveResourceFilter() {
    if (!state) return
    void runAction(async () => {
      await updateRoomResourceFilter(state, selectedUpcomingSentenceIds)
      setResourceFilterMessage(
        `Upcoming filter saved. ${lockedSentences.length} played/current resources were preserved and ${selectedUpcomingSentenceIds.length} upcoming resources remain.`,
      )
    })
  }

  useEffect(() => {
    return () => playbackRef.current?.stop()
  }, [])

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (isEditableShortcutTarget(event.target)) return
      if (event.key.toLowerCase() === 'r') {
        event.preventDefault()
        void playSentenceAudio()
      }
      if (event.key.toLowerCase() === 's' || event.key === 'Escape') {
        event.preventDefault()
        stopSentenceAudio()
      }
      if (event.key === 'ArrowRight') {
        event.preventDefault()
        handleKeyboardAdvance()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  })

  const roomStatus = state?.room.status ?? 'loading'
  const rosterSummary = `${state?.roster.length ?? 0} learners`
  const resourceFilterSummary = `${selectedUpcomingSentenceIds.length}/${upcomingSentences.length} upcoming`
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
      {resourceFilterMessage ? <Alert className="mb-5" title="Resource filter updated">{resourceFilterMessage}</Alert> : null}

      {state ? (
        <WorkspaceLayout
          primary={
            <>
              <CurrentSentenceWindow
                currentIndex={currentSentenceIndex}
                nextSentence={nextSentence}
                round={state.currentRound}
                sentence={state.currentSentence}
                totalResources={totalResources}
              />

              <TeacherAudioControls
                audioLanguage={audioLanguage}
                autoPlay={autoPlayAudio}
                error={audioError}
                isPlaying={isAudioPlaying}
                onAudioLanguageChange={setAudioLanguage}
                onAutoPlayChange={setAutoPlayAudio}
                onReplay={() => void playSentenceAudio()}
                onStop={stopSentenceAudio}
                sentence={displaySentence}
              />

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
                    <span className="block">
                      {requiresAssignedRound && !nextAssignedLearnerId
                        ? 'Choose or wait for an eligible learner before opening this assigned/auto-rotate round.'
                        : `Shortcuts: R replay, S/Esc stop, → advance after response.${nextAssignedLearnerName ? ` Next learner: ${nextAssignedLearnerName}.` : ''}`}
                    </span>
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
                    {nextAssignedLearnerName ? <span className="block">Next assigned learner: {nextAssignedLearnerName}</span> : null}
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
              <CollapsiblePanel panelId="teacher-room-resource-filter" summary={resourceFilterSummary} title="Upcoming resources">
                <div className="space-y-4 text-sm text-chunks-body">
                  <p>
                    Filter only unplayed resources for the rest of this room. Completed/current rounds stay locked in the
                    original snapshot order.
                  </p>

                  {lockedSentences.length ? (
                    <div className="rounded-2xl bg-chunks-soft p-3">
                      <p className="font-semibold text-chunks-ink">Locked history</p>
                      <p className="mt-1 text-xs uppercase tracking-[0.18em] text-chunks-muted">played/current</p>
                      <div className="mt-2 flex flex-wrap gap-2">
                        {lockedSentences.map((sentence) => (
                          <span key={sentence.id} className="rounded-full border border-chunks-hairline bg-white px-3 py-1 font-semibold text-chunks-ink">
                            {sentence.sentence_code}
                          </span>
                        ))}
                      </div>
                    </div>
                  ) : null}

                  <div className="flex flex-wrap gap-2">
                    <Button
                      disabled={upcomingSentences.length === 0 || isWorking}
                      onClick={() => setSelectedUpcomingSentenceIds(upcomingSentences.map((sentence) => sentence.id))}
                      type="button"
                      variant="secondary"
                    >
                      Select all upcoming
                    </Button>
                    <Button
                      disabled={upcomingSentences.length === 0 || isWorking}
                      onClick={() => setSelectedUpcomingSentenceIds([])}
                      type="button"
                      variant="secondary"
                    >
                      Clear upcoming
                    </Button>
                  </div>

                  {upcomingSentences.length ? (
                    <div className="max-h-72 space-y-2 overflow-y-auto pr-1">
                      {upcomingSentences.map((sentence) => (
                        <label
                          className="flex min-h-12 items-center gap-3 rounded-2xl border border-chunks-hairline bg-white px-3 py-2"
                          key={sentence.id}
                        >
                          <input
                            aria-label={`Include ${sentence.sentence_code}`}
                            checked={selectedUpcomingSentenceIds.includes(sentence.id)}
                            className="h-5 w-5 accent-[var(--chunks-accent)]"
                            onChange={(event) => toggleUpcomingSentence(sentence.id, event.target.checked)}
                            type="checkbox"
                          />
                          <span>
                            <strong className="text-chunks-ink">{sentence.sentence_code}</strong>
                            <span className="block text-xs text-chunks-muted">Upcoming · order {sentence.order_index}</span>
                          </span>
                        </label>
                      ))}
                    </div>
                  ) : (
                    <p className="rounded-2xl bg-chunks-soft p-3">No unplayed resources remain in this room snapshot.</p>
                  )}

                  <Button disabled={isWorking} onClick={handleSaveResourceFilter} type="button">
                    Save upcoming filter
                  </Button>
                </div>
              </CollapsiblePanel>
            </>
          }
        />
      ) : null}
    </AppShell>
  )
}
