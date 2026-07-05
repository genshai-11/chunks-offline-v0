import { Badge, Button, Card } from '../../../components/primitives'
import type { SentenceResource } from '../../../lib/domain/types'
import { getSentenceAudioUrl, type AudioLanguage } from '../../live-room/audioPlayback'

interface TeacherAudioControlsProps {
  sentence: SentenceResource | null
  audioLanguage: AudioLanguage
  autoPlay: boolean
  isPlaying: boolean
  error: string | null
  onAudioLanguageChange: (language: AudioLanguage) => void
  onAutoPlayChange: (enabled: boolean) => void
  onReplay: () => void
  onStop: () => void
}

const languageLabels: Record<AudioLanguage, string> = {
  en: 'English audio',
  vi: 'Vietnamese audio',
  none: 'No auto audio',
}

export function TeacherAudioControls({
  sentence,
  audioLanguage,
  autoPlay,
  isPlaying,
  error,
  onAudioLanguageChange,
  onAutoPlayChange,
  onReplay,
  onStop,
}: TeacherAudioControlsProps) {
  const selectedUrl = getSentenceAudioUrl(sentence, audioLanguage)
  const hasSelectedAudio = Boolean(selectedUrl)

  return (
    <Card>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-chunks-body">Classroom audio</p>
          <h2 className="mt-1 text-xl font-semibold text-chunks-ink">Teacher playback</h2>
        </div>
        <Badge tone={isPlaying ? 'success' : hasSelectedAudio ? 'brand' : 'neutral'}>
          {isPlaying ? 'Playing' : hasSelectedAudio ? 'Audio ready' : 'Text only'}
        </Badge>
      </div>

      <fieldset className="mt-5 grid gap-3 sm:grid-cols-3">
        <legend className="sr-only">Choose audio language</legend>
        {(['en', 'vi', 'none'] as AudioLanguage[]).map((language) => {
          const available = language === 'none' || Boolean(getSentenceAudioUrl(sentence, language))
          return (
            <label
              className={`flex min-h-12 cursor-pointer items-center justify-between gap-3 rounded-2xl border px-4 py-3 text-sm font-semibold ${
                audioLanguage === language
                  ? 'border-chunks-red bg-chunks-control text-chunks-red'
                  : 'border-chunks-hairline bg-chunks-soft text-chunks-ink'
              } ${available ? '' : 'border-dashed opacity-80'}`}
              key={language}
            >
              <span>
                {languageLabels[language]}
                {!available ? <span className="block text-xs font-medium text-chunks-muted">missing file</span> : null}
              </span>
              <input
                checked={audioLanguage === language}
                className="h-5 w-5 accent-chunks-red"
                name="audioLanguage"
                onChange={() => onAudioLanguageChange(language)}
                type="radio"
                value={language}
              />
            </label>
          )
        })}
      </fieldset>

      <label className="mt-4 flex min-h-12 items-center gap-3 rounded-2xl bg-chunks-soft px-4 py-3 text-sm font-semibold text-chunks-ink">
        <input
          checked={autoPlay}
          className="h-5 w-5 accent-chunks-red"
          disabled={audioLanguage === 'none' || !hasSelectedAudio}
          onChange={(event) => onAutoPlayChange(event.target.checked)}
          type="checkbox"
        />
        Auto-play selected audio when opening or advancing a round
      </label>

      <div className="mt-5 flex flex-wrap gap-3">
        <Button aria-label="Replay selected audio" disabled={!hasSelectedAudio} disabledReason="Selected audio track is unavailable" onClick={onReplay} type="button" variant="secondary">
          <SpeakerIcon />
          Replay audio
        </Button>
        <Button disabled={!isPlaying} disabledReason="Audio is not playing" onClick={onStop} type="button" variant="secondary">
          Stop audio
        </Button>
      </div>

      <div className="mt-4 rounded-2xl bg-chunks-soft p-3 text-sm leading-6 text-chunks-body">
        {sentence ? (
          <>
            <p className="font-semibold text-chunks-ink">{sentence.text_en ?? sentence.text_prompt ?? sentence.text_vi ?? 'No sentence text available.'}</p>
            <p className="mt-1 text-xs text-chunks-muted">
              Code {sentence.sentence_code} · {hasSelectedAudio ? 'Selected track is available.' : 'Selected track is unavailable; continue text-only or queue missing audio in Admin.'}
            </p>
          </>
        ) : (
          'Open a sentence to enable audio playback.'
        )}
      </div>
      {error ? <p className="mt-3 rounded-2xl bg-red-50 p-3 text-sm font-semibold text-red-700">{error}</p> : null}
    </Card>
  )
}

function SpeakerIcon() {
  return (
    <svg aria-hidden="true" className="mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24">
      <path d="M4 9v6h4l5 4V5L8 9H4z" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
      <path d="M16 9.5a4 4 0 0 1 0 5M18.5 7a7 7 0 0 1 0 10" stroke="currentColor" strokeLinecap="round" strokeWidth="2" />
    </svg>
  )
}
