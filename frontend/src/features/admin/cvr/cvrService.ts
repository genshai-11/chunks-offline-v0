import type { SupabaseClient } from '@supabase/supabase-js'

import { mapSupabaseError } from '../../../lib/domain/errors'
import type { CvrUnit, UUID } from '../../../lib/domain/types'
import { assertSupabaseConfig, supabase as defaultSupabase } from '../../../lib/supabase/client'

export interface SaveCvrUnitInput {
  active: boolean
  id?: UUID
  label: string
  unitSymbol?: string
  value: number
}

export interface CvrServiceOptions {
  client?: SupabaseClient
}

export async function loadCvrUnits({ client = defaultSupabase }: CvrServiceOptions = {}): Promise<CvrUnit[]> {
  assertSupabaseConfig()
  const result = await client.from('cvr_units').select('*').order('label')
  if (result.error) throw mapSupabaseError(result.error)
  return (result.data ?? []) as CvrUnit[]
}

export async function saveCvrUnit(
  input: SaveCvrUnitInput,
  { client = defaultSupabase }: CvrServiceOptions = {},
): Promise<CvrUnit> {
  assertSupabaseConfig()

  const payload = {
    label: input.label.trim(),
    unit_symbol: input.unitSymbol?.trim() || 'Ω',
    value: Math.max(0, input.value),
    active: input.active,
  }

  const query = input.id ? client.from('cvr_units').update(payload).eq('id', input.id) : client.from('cvr_units').insert(payload)
  const result = await query.select('*').single()
  if (result.error) throw mapSupabaseError(result.error)
  return result.data as CvrUnit
}
