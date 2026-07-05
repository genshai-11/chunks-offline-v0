import type { SentenceResource } from '../../lib/domain/types'
import { supabase } from '../../lib/supabase/client'

export type AudioLanguage = 'en' | 'vi' | 'none'

const RESOURCE_AUDIO_BUCKET = 'resource-audio'

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
      throw new Error(`Could not play audio. Check that the file is public and browser-supported. ${getPlaybackErrorMessage(error)}`)
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

  const source = language === 'en'
    ? sentence.audio_en_url ?? getAudioVariant(sentence, 'en') ?? sentence.audio_url ?? null
    : sentence.audio_vi_url ?? getAudioVariant(sentence, 'vi') ?? getAudioVariant(sentence, 'vietnamese') ?? null

  return normalizeAudioSource(source)
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

function getAudioVariant(sentence: SentenceResource, key: string): string | null {
  const value = sentence.audio_variants?.[key]
  if (typeof value === 'string') return value
  if (value && typeof value === 'object' && 'url' in value && typeof value.url === 'string') return value.url
  return null
}

function normalizeAudioSource(source: string | null | undefined): string | null {
  const trimmed = source?.trim()
  if (!trimmed) return null
  if (/^(https?:|blob:|data:)/i.test(trimmed)) return trimmed

  const objectPath = trimmed.replace(/^\/+/, '')
  return supabase.storage.from(RESOURCE_AUDIO_BUCKET).getPublicUrl(objectPath).data.publicUrl
}

function getPlaybackErrorMessage(error: unknown): string {
  if (error && typeof error === 'object' && 'message' in error) return String(error.message)
  return 'The browser reported an unknown playback error.'
}
