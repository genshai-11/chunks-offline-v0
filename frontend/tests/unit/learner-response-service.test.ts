import { describe, expect, it } from 'vitest'

import { resolveEffectiveResponseCaptureMode } from '../../src/features/learner/responseService'

describe('learner response service capture mode', () => {
  it('falls back to the room default when a round snapshot is missing or stale', () => {
    expect(resolveEffectiveResponseCaptureMode(null, 'first_responder')).toBe('first_responder')
    expect(resolveEffectiveResponseCaptureMode(undefined, 'first_responder')).toBe('first_responder')
    expect(resolveEffectiveResponseCaptureMode('first_response', 'first_responder')).toBe('first_responder')
  })

  it('keeps a valid round snapshot authoritative over the room default', () => {
    expect(resolveEffectiveResponseCaptureMode('assigned', 'first_responder')).toBe('assigned')
    expect(resolveEffectiveResponseCaptureMode('first_responder', 'assigned')).toBe('first_responder')
  })
})
