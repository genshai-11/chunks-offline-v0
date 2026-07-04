import type { SentenceResource } from '../../lib/domain/types'

export type AudioLanguage = 'en' | 'vi' | 'none'

export interface AudioPlaybackAdapter {
  playUrl(url: string, playbackRate?: number): Promise<void>
  stop(): void
  isPlaying(): boolean
}

export class BrowserAudioPlaybackAdapter implements AudioPlaybackAdapter {
  private audio: HTMLAudioElement | null = null

  async playUrl(url: string, playbackRate = 1): Promise<void> {
    this.stop()

    this.audio = new Audio(url)
    this.audio.preload = 'auto'
    this.audio.playbackRate = clampPlaybackRate(playbackRate)

    try {
      await this.audio.play()
    } catch (error) {
      this.audio = null
      throw error
    }
  }

  stop(): void {
    if (!this.audio) return

    try {
      this.audio.pause()
      this.audio.currentTime = 0
    } catch {
      // Browser cleanup can fail if the media element is already released.
    }

    this.audio = null
  }

  isPlaying(): boolean {
    return Boolean(this.audio && !this.audio.paused && !this.audio.ended)
  }
}

export function clampPlaybackRate(playbackRate: number): number {
  if (!Number.isFinite(playbackRate)) return 1
  return Math.max(0.25, Math.min(4, playbackRate))
}

export function getSentenceAudioUrl(sentence: SentenceResource | null | undefined, language: AudioLanguage): string | null {
  if (!sentence || language === 'none') return null
  if (language === 'en') return sentence.audio_en_url ?? sentence.audio_url ?? null
  return sentence.audio_vi_url ?? null
}

export function hasSentenceAudio(sentence: SentenceResource | null | undefined, language: AudioLanguage): boolean {
  return Boolean(getSentenceAudioUrl(sentence, language))
}

export function isEditableShortcutTarget(target: EventTarget | null): boolean {
  if (!(target instanceof HTMLElement)) return false
  const tagName = target.tagName.toLowerCase()
  return (
    tagName === 'input' ||
    tagName === 'select' ||
    tagName === 'textarea' ||
    target.isContentEditable === true ||
    target.getAttribute('contenteditable') === 'true'
  )
}
