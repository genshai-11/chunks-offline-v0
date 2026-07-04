import type { SupabaseClient } from '@supabase/supabase-js'

import { mapSupabaseError } from '../../../lib/domain/errors'
import type { CciCategory, CciStandardCard, UUID } from '../../../lib/domain/types'
import { assertSupabaseConfig, supabase as defaultSupabase } from '../../../lib/supabase/client'

export interface CciAdminData {
  cards: CciStandardCard[]
  categories: CciCategory[]
}

export interface SaveCciStandardCardInput {
  active: boolean
  categoryId: string
  id?: UUID
  label: string
  standardValue: number
}

export interface CciServiceOptions {
  client?: SupabaseClient
}

export async function loadCciAdminData({ client = defaultSupabase }: CciServiceOptions = {}): Promise<CciAdminData> {
  assertSupabaseConfig()

  const [categoriesResult, cardsResult] = await Promise.all([
    client.from('cci_categories').select('*').order('label'),
    client.from('cci_standard_cards').select('*').order('label'),
  ])

  if (categoriesResult.error) throw mapSupabaseError(categoriesResult.error)
  if (cardsResult.error) throw mapSupabaseError(cardsResult.error)

  return {
    categories: (categoriesResult.data ?? []) as CciCategory[],
    cards: (cardsResult.data ?? []) as CciStandardCard[],
  }
}

export async function saveCciStandardCard(
  input: SaveCciStandardCardInput,
  { client = defaultSupabase }: CciServiceOptions = {},
): Promise<CciStandardCard> {
  assertSupabaseConfig()

  const payload = {
    category_id: input.categoryId,
    label: input.label.trim(),
    standard_value: Math.max(0, input.standardValue),
    active: input.active,
  }

  const query = input.id
    ? client.from('cci_standard_cards').update(payload).eq('id', input.id)
    : client.from('cci_standard_cards').insert(payload)

  const result = await query.select('*').single()
  if (result.error) throw mapSupabaseError(result.error)
  return result.data as CciStandardCard
}
