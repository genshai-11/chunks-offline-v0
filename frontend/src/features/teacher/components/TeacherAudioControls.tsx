import { Button } from '../../../components/ui/Button'
import { Card } from '../../../components/ui/Card'
import { StatusBadge } from '../../../components/ui/StatusBadge'
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
        <StatusBadge tone={isPlaying ? 'success' : hasSelectedAudio ? 'brand' : 'neutral'}>
          {isPlaying ? 'Playing' : hasSelectedAudio ? 'Audio ready' : 'Text only'}
        </StatusBadge>
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
              } ${available ? '' : 'opacity-60'}`}
              key={language}
            >
              <span>{languageLabels[language]}</span>
              <input
                checked={audioLanguage === language}
                className="h-5 w-5 accent-chunks-red"
                disabled={!available}
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
          disabled={audioLanguage === 'none'}
          onChange={(event) => onAutoPlayChange(event.target.checked)}
          type="checkbox"
        />
        Auto-play selected audio when opening or advancing a round
      </label>

      <div className="mt-5 flex flex-wrap gap-3">
        <Button disabled={!hasSelectedAudio} onClick={onReplay} type="button" variant="secondary">
          Replay audio
        </Button>
        <Button disabled={!isPlaying} onClick={onStop} type="button" variant="secondary">
          Stop audio
        </Button>
      </div>

      <p className="mt-4 text-sm leading-6 text-chunks-body">
        {sentence ? `${sentence.sentence_code} · ${hasSelectedAudio ? 'Selected track is available.' : 'Selected track is unavailable; continue text-only.'}` : 'Open a sentence to enable audio playback.'}
      </p>
      {error ? <p className="mt-3 rounded-2xl bg-red-50 p-3 text-sm font-semibold text-red-700">{error}</p> : null}
    </Card>
  )
}
