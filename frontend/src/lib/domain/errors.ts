export type DomainErrorCode =
  | 'invalid_room_code'
  | 'room_finished'
  | 'display_name_required'
  | 'round_not_open'
  | 'learner_not_eligible'
  | 'duplicate_response'
  | 'invalid_response_color'
  | 'permission_denied'
  | 'unknown'

export interface DomainError {
  code: DomainErrorCode
  message: string
  retryable: boolean
}

const messages: Record<DomainErrorCode, string> = {
  invalid_room_code: 'Room code was not found. Check the code and try again.',
  room_finished: 'This room has already finished.',
  display_name_required: 'Enter a display name before joining.',
  round_not_open: 'The current round is not open for responses.',
  learner_not_eligible: 'You are observing this round and cannot respond yet.',
  duplicate_response: 'Your response was already captured for this round.',
  invalid_response_color: 'Choose one available response color.',
  permission_denied: 'You do not have permission to perform this action.',
  unknown: 'Something went wrong. Please try again.',
}

const retryableCodes = new Set<DomainErrorCode>(['invalid_room_code', 'display_name_required', 'unknown'])

export function createDomainError(code: DomainErrorCode, message = messages[code]): DomainError {
  return {
    code,
    message,
    retryable: retryableCodes.has(code),
  }
}

export function mapSupabaseError(error: unknown): DomainError {
  const message = error instanceof Error ? error.message : String(error ?? '')
  const normalized = message.toLowerCase()

  if (normalized.includes('permission') || normalized.includes('rls')) return createDomainError('permission_denied')
  if (normalized.includes('duplicate') || normalized.includes('unique')) return createDomainError('duplicate_response')
  if (normalized.includes('not open') || normalized.includes('closed')) return createDomainError('round_not_open')

  return createDomainError('unknown', message || messages.unknown)
}
