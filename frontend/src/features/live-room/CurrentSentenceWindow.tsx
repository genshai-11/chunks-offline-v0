import { Card } from '../../components/ui/Card'
import { StatusBadge } from '../../components/ui/StatusBadge'
import type { RoomRound, SentenceResource } from '../../lib/domain/types'

interface CurrentSentenceWindowProps {
  round: RoomRound | null
  sentence: SentenceResource | null
  nextSentence: SentenceResource | null
  currentIndex?: number
  totalResources?: number
}

export function CurrentSentenceWindow({ round, sentence, nextSentence, currentIndex = 0, totalResources = 0 }: CurrentSentenceWindowProps) {
  const displaySentence = sentence ?? nextSentence
  const hasSequence = totalResources > 0 && currentIndex > 0

  return (
    <Card variant="dark">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.22em] text-white/60">Sentence Window</p>
          <h2 className="mt-2 text-3xl font-semibold text-white">
            {round ? `Round ${round.round_index}` : 'Ready to open first round'}
          </h2>
          {hasSequence ? <p className="mt-2 text-sm font-semibold text-white/60">Sentence {currentIndex} / {totalResources}</p> : null}
        </div>
        <StatusBadge tone={round?.status === 'open' ? 'success' : round?.status === 'closed' ? 'neutral' : 'brand'}>
          {round?.status ?? 'lobby'}
        </StatusBadge>
      </div>

      {displaySentence ? (
        <div className="mt-8 rounded-[1.75rem] bg-white/10 p-6">
          <p className="text-sm font-semibold text-white/60">{displaySentence.sentence_code}</p>
          <p className="mt-3 text-2xl font-semibold leading-snug text-white">
            {displaySentence.text_en ?? displaySentence.text_prompt ?? 'No English prompt available.'}
          </p>
          {displaySentence.text_vi ? <p className="mt-3 text-lg leading-7 text-white/75">{displaySentence.text_vi}</p> : null}
          <div className="mt-5 flex flex-wrap gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-white/70">
            <span>CVR Ω {displaySentence.cvr_value ?? displaySentence.default_cvr_value ?? 1}</span>
            <span>•</span>
            <span>{displaySentence.audio_en_url || displaySentence.audio_url ? 'EN audio' : 'EN text only'}</span>
            <span>•</span>
            <span>{displaySentence.audio_vi_url ? 'VI audio' : 'VI text only'}</span>
          </div>
          {nextSentence && round ? (
            <div className="mt-5 rounded-2xl bg-white/10 p-4 text-sm text-white/75">
              <span className="font-semibold text-white">Next:</span> {nextSentence.sentence_code} · {nextSentence.audio_en_url || nextSentence.audio_url ? 'EN audio' : 'EN text'} · {nextSentence.audio_vi_url ? 'VI audio' : 'VI text'}
            </div>
          ) : null}
        </div>
      ) : (
        <p className="mt-8 rounded-[1.75rem] bg-white/10 p-6 text-white/75">
          No approved sentence resources are available in this room scope.
        </p>
      )}
    </Card>
  )
}
