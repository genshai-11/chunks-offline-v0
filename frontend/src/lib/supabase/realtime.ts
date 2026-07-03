import type { RealtimeChannel, SupabaseClient } from '@supabase/supabase-js'

import { supabase as defaultSupabase } from './client'

export type LiveRoomTable = 'practice_rooms' | 'room_memberships' | 'room_rounds' | 'learner_responses' | 'learner_progress'
export type RealtimeEvent = 'INSERT' | 'UPDATE' | 'DELETE' | '*'

export interface RoomSubscriptionOptions {
  roomId: string
  tables?: LiveRoomTable[]
  onChange: (event: { table: LiveRoomTable; payload: unknown }) => void
  onReconnect?: () => void | Promise<void>
  client?: SupabaseClient
}

const defaultTables: LiveRoomTable[] = [
  'practice_rooms',
  'room_memberships',
  'room_rounds',
  'learner_responses',
]

export function subscribeToRoomState({
  roomId,
  tables = defaultTables,
  onChange,
  onReconnect,
  client = defaultSupabase,
}: RoomSubscriptionOptions): RealtimeChannel {
  const channel = client.channel(`room:${roomId}`)

  for (const table of tables) {
    channel.on(
      'postgres_changes',
      {
        event: '*' satisfies RealtimeEvent,
        schema: 'public',
        table,
        filter: getRoomFilter(table, roomId),
      },
      (payload) => onChange({ table, payload }),
    )
  }

  channel.subscribe((status, error) => {
    if (error) {
      console.error('Supabase realtime subscription error', error)
      return
    }

    if (status === 'SUBSCRIBED') {
      void onReconnect?.()
    }
  })

  return channel
}

export async function unsubscribeFromRoomState(channel: RealtimeChannel, client: SupabaseClient = defaultSupabase) {
  await client.removeChannel(channel)
}

function getRoomFilter(table: LiveRoomTable, roomId: string): string | undefined {
  if (table === 'practice_rooms') return `id=eq.${roomId}`
  if (table === 'learner_progress') return undefined
  return `room_id=eq.${roomId}`
}
