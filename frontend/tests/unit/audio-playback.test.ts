import { afterEach, describe, expect, it, vi } from 'vitest'

import {
  BrowserAudioPlaybackAdapter,
  clampPlaybackRate,
  getSentenceAudioUrl,
  isEditableShortcutTarget,
} from '../../src/features/live-room/audioPlayback'
import type { SentenceResource } from '../../src/lib/domain/types'

class FakeAudio {
  static instances: FakeAudio[] = []

  currentTime = 0
  ended = false
  paused = true
  playbackRate = 1
  preload = ''
  pause = vi.fn(() => {
    this.paused = true
  })
  play = vi.fn(async () => {
    this.paused = false
  })

  constructor(public src: string) {
    FakeAudio.instances.push(this)
  }
}

const sentence: SentenceResource = {
  id: 'sentence-1',
  course_id: 'course-1',
  lesson_id: 'lesson-1',
  section_id: 'section-1',
  sentence_code: 'S001',
  text_prompt: null,
  text_en: 'Teacher-only text',
  text_vi: 'Text vi',
  audio_url: 'legacy.mp3',
  audio_en_url: 'en.mp3',
  audio_vi_url: 'vi.mp3',
  audio_variants: {},
  default_cvr_unit_id: null,
  default_cvr_value: 1,
  cvr_value: 12,
  order_index: 1,
  approval_status: 'approved',
  created_at: '',
  updated_at: '',
}

describe('audioPlayback', () => {
  afterEach(() => {
    vi.unstubAllGlobals()
    FakeAudio.instances = []
  })

  it('clamps playback rate to browser-safe bounds', () => {
    expect(clampPlaybackRate(0.1)).toBe(0.25)
    expect(clampPlaybackRate(1.5)).toBe(1.5)
    expect(clampPlaybackRate(8)).toBe(4)
    expect(clampPlaybackRate(Number.NaN)).toBe(1)
  })

  it('resolves sentence audio URL by language with legacy English fallback only', () => {
    expect(getSentenceAudioUrl(sentence, 'en')).toBe('en.mp3')
    expect(getSentenceAudioUrl(sentence, 'vi')).toBe('vi.mp3')
    expect(getSentenceAudioUrl(sentence, 'none')).toBeNull()
    expect(getSentenceAudioUrl({ ...sentence, audio_en_url: null }, 'en')).toBe('legacy.mp3')
    expect(getSentenceAudioUrl({ ...sentence, audio_vi_url: null }, 'vi')).toBeNull()
  })

  it('stops existing audio before playing the next URL', async () => {
    vi.stubGlobal('Audio', FakeAudio)
    const adapter = new BrowserAudioPlaybackAdapter()

    await adapter.playUrl('one.mp3', 9)
    expect(FakeAudio.instances[0].playbackRate).toBe(4)
    expect(adapter.isPlaying()).toBe(true)

    await adapter.playUrl('two.mp3')
    expect(FakeAudio.instances[0].pause).toHaveBeenCalled()
    expect(FakeAudio.instances[0].currentTime).toBe(0)
    expect(FakeAudio.instances[1].src).toBe('two.mp3')
    expect(adapter.isPlaying()).toBe(true)

    adapter.stop()
    expect(FakeAudio.instances[1].pause).toHaveBeenCalled()
    expect(adapter.isPlaying()).toBe(false)
  })

  it('detects editable targets for keyboard shortcuts', () => {
    expect(isEditableShortcutTarget(document.createElement('input'))).toBe(true)
    expect(isEditableShortcutTarget(document.createElement('select'))).toBe(true)
    expect(isEditableShortcutTarget(document.createElement('textarea'))).toBe(true)
    const editable = document.createElement('div')
    editable.setAttribute('contenteditable', 'true')
    expect(isEditableShortcutTarget(editable)).toBe(true)
    expect(isEditableShortcutTarget(document.createElement('button'))).toBe(false)
  })
})
