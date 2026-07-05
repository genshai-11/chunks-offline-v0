import type { FormEvent } from 'react'
import { useState } from 'react'

import { Alert } from '../../../components/ui/Alert'
import { Badge, Button, Card, CardContent, CardFooter, CardHeader } from '../../../components/primitives'
import type { CvrUnit } from '../../../lib/domain/types'
import { saveCvrUnit } from './cvrService'

interface CvrManagerProps {
  onRefresh: () => Promise<void>
  units: CvrUnit[]
}

export function CvrManager({ onRefresh, units }: CvrManagerProps) {
  const [selectedUnitId, setSelectedUnitId] = useState(units[0]?.id ?? '')
  const [statusMessage, setStatusMessage] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const selectedUnit = units.find((unit) => unit.id === selectedUnitId) ?? units[0] ?? null

  async function handleSave(event: FormEvent<HTMLElement>) {
    event.preventDefault()
    const form = new FormData(event.currentTarget as HTMLFormElement)
    setError(null)
    try {
      await saveCvrUnit({
        active: form.get('active') === 'on',
        id: selectedUnit?.id,
        label: String(form.get('label')),
        unitSymbol: String(form.get('unitSymbol')),
        value: Number(form.get('value')),
      })
      setStatusMessage('CVR value saved for Admin resource assignment.')
      await onRefresh()
    } catch (saveError) {
      setError(getErrorMessage(saveError))
    }
  }

  return (
    <section aria-labelledby="cvr-manager-title" className="grid gap-4">
      <Card padding="sm">
        <CardHeader className="flex flex-row items-start justify-between gap-3 space-y-0">
          <div>
            <Badge tone="brand">CVR Manager</Badge>
            <h2 className="mt-3 text-lg font-semibold text-chunks-ink" id="cvr-manager-title">CVR Ω values</h2>
          </div>
          <Badge tone="neutral">{units.filter((unit) => unit.active).length} active</Badge>
        </CardHeader>
        <CardContent className="mt-4 grid gap-2">
          {units.map((unit) => {
            const selected = unit.id === selectedUnit?.id
            return (
              <button
                className={`grid gap-1 rounded-2xl border px-3 py-3 text-left transition active:translate-y-px ${selected ? 'border-chunks-red bg-chunks-soft' : 'border-chunks-hairline bg-white hover:bg-chunks-soft/60'}`}
                key={unit.id}
                onClick={() => setSelectedUnitId(unit.id)}
                type="button"
              >
                <span className="flex items-center justify-between gap-2">
                  <span className="font-semibold text-chunks-ink">{unit.label}</span>
                  <Badge size="sm" tone={unit.active ? 'success' : 'neutral'}>{unit.active ? 'active' : 'inactive'}</Badge>
                </span>
                <span className="font-mono text-xs text-chunks-body">{unit.value} {unit.unit_symbol}</span>
              </button>
            )
          })}
          {units.length === 0 ? <p className="rounded-2xl bg-chunks-soft p-3 text-sm text-chunks-body">No CVR values yet. Save the inspector to create one.</p> : null}
        </CardContent>
      </Card>

      <Card as="form" onSubmit={handleSave} padding="sm">
        <CardHeader>
          <Badge tone="info">Inspector</Badge>
          <h3 className="mt-3 text-lg font-semibold text-chunks-ink">Edit CVR value</h3>
        </CardHeader>
        <CardContent className="mt-4 grid gap-3">
          <label className="block">
            <span className="text-sm font-semibold text-chunks-ink">Label</span>
            <input className="mt-2 min-h-11 w-full rounded-2xl border border-chunks-hairline px-3" defaultValue={selectedUnit?.label ?? ''} name="label" />
          </label>
          <label className="block">
            <span className="text-sm font-semibold text-chunks-ink">Unit symbol</span>
            <input className="mt-2 min-h-11 w-full rounded-2xl border border-chunks-hairline px-3" defaultValue={selectedUnit?.unit_symbol ?? 'Ω'} name="unitSymbol" />
          </label>
          <label className="block">
            <span className="text-sm font-semibold text-chunks-ink">CVR unit value</span>
            <input className="mt-2 min-h-11 w-full rounded-2xl border border-chunks-hairline px-3" defaultValue={selectedUnit?.value ?? 1} min="0" name="value" step="0.01" type="number" />
          </label>
          <label className="flex min-h-11 items-center gap-3 rounded-2xl border border-chunks-hairline px-3">
            <input defaultChecked={selectedUnit?.active ?? true} name="active" type="checkbox" />
            <span className="text-sm font-semibold text-chunks-ink">Active CVR value</span>
          </label>
        </CardContent>
        <CardFooter><Button size="sm" type="submit">Save CVR value</Button></CardFooter>
        {statusMessage ? <Alert className="mt-4" title="CVR status" tone="success">{statusMessage}</Alert> : null}
        {error ? <Alert className="mt-4" title="CVR action failed" tone="error">{error}</Alert> : null}
      </Card>
    </section>
  )
}

function getErrorMessage(error: unknown): string {
  if (error && typeof error === 'object' && 'message' in error) return String(error.message)
  return 'Something went wrong. Please try again.'
}
