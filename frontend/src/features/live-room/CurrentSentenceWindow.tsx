import { Badge, Card } from '../../components/primitives'
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
  const statusLabel = round?.status ?? 'lobby'

  return (
    <Card className="border-l-4 border-l-chunks-red" padding="sm">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-xs font-black uppercase tracking-[0.18em] text-chunks-body">Sentence window</p>
          <h2 className="mt-2 text-lg font-semibold text-chunks-ink">
            {round ? `Round ${round.round_index}` : 'Ready to open first sentence'}
          </h2>
          {hasSequence ? <p className="mt-1 text-xs font-semibold text-chunks-body">Sentence {currentIndex} / {totalResources}</p> : null}
        </div>
        <Badge tone={round?.status === 'open' ? 'success' : round?.status === 'closed' ? 'neutral' : 'brand'}>
          {statusLabel}
        </Badge>
      </div>

      {displaySentence ? (
        <div className="mt-4 grid gap-3">
          <div className="rounded-2xl border border-chunks-hairline bg-chunks-soft p-4">
            <p className="text-[0.68rem] font-black uppercase tracking-[0.16em] text-chunks-body">Now showing</p>
            <p className="mt-2 text-xl font-semibold leading-snug text-chunks-ink">
              {getSentenceText(displaySentence)}
            </p>
            {displaySentence.text_vi ? <p className="mt-2 text-sm leading-6 text-chunks-body">{displaySentence.text_vi}</p> : null}
            <div className="mt-3 flex flex-wrap gap-2 text-xs font-semibold text-chunks-body">
              <span className="rounded-full bg-white px-2.5 py-1">Code {displaySentence.sentence_code}</span>
              <span className="rounded-full bg-white px-2.5 py-1">CVR Ω {displaySentence.cvr_value ?? displaySentence.default_cvr_value ?? 1}</span>
              <span className="rounded-full bg-white px-2.5 py-1">{displaySentence.audio_en_url || displaySentence.audio_url ? 'EN audio ready' : 'EN text only'}</span>
              <span className="rounded-full bg-white px-2.5 py-1">{displaySentence.audio_vi_url ? 'VI audio ready' : 'VI text only'}</span>
            </div>
          </div>

          {nextSentence && round ? (
            <div className="rounded-2xl border border-chunks-hairline bg-white p-3 text-sm text-chunks-body">
              <span className="font-semibold text-chunks-ink">Next:</span> {getSentenceText(nextSentence)}
              <span className="ml-2 text-xs text-chunks-muted">({nextSentence.sentence_code})</span>
            </div>
          ) : null}
        </div>
      ) : (
        <p className="mt-4 rounded-2xl bg-chunks-soft p-4 text-sm text-chunks-body">
          No approved sentence resources are available in this room scope.
        </p>
      )}
    </Card>
  )
}

function getSentenceText(sentence: SentenceResource): string {
  return sentence.text_en ?? sentence.text_prompt ?? sentence.text_vi ?? 'No sentence text available.'
}
