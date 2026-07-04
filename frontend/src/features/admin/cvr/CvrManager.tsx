import type { FormEvent } from 'react'
import { useState } from 'react'

import { Alert } from '../../../components/ui/Alert'
import { Button } from '../../../components/ui/Button'
import { Card } from '../../../components/ui/Card'
import { StatusBadge } from '../../../components/ui/StatusBadge'
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
    <section aria-labelledby="cvr-manager-title" className="space-y-4">
      <Card>
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-chunks-body">CVR Manager</p>
            <h2 className="mt-1 text-2xl font-semibold text-chunks-ink" id="cvr-manager-title">CVR Ω values</h2>
          </div>
          <StatusBadge tone="brand">{units.filter((unit) => unit.active).length} active</StatusBadge>
        </div>
        <div className="mt-5 grid gap-3 md:grid-cols-2">
          {units.map((unit) => (
            <button className="rounded-2xl border border-chunks-hairline p-4 text-left" key={unit.id} onClick={() => setSelectedUnitId(unit.id)} type="button">
              <span className="font-semibold text-chunks-ink">{unit.label}</span>
              <span className="mt-1 block text-sm text-chunks-body">{unit.value} {unit.unit_symbol} · {unit.active ? 'active' : 'inactive'}</span>
            </button>
          ))}
          {units.length === 0 ? <p className="text-sm text-chunks-body">No CVR values yet. Save the form below to create one.</p> : null}
        </div>
      </Card>

      <Card as="form" onSubmit={handleSave}>
        <h3 className="text-xl font-semibold text-chunks-ink">Edit CVR value</h3>
        <div className="mt-5 grid gap-4 md:grid-cols-2">
          <label className="block">
            <span className="text-sm font-semibold text-chunks-ink">Label</span>
            <input className="mt-2 min-h-12 w-full rounded-2xl border border-chunks-hairline px-4" defaultValue={selectedUnit?.label ?? ''} name="label" />
          </label>
          <label className="block">
            <span className="text-sm font-semibold text-chunks-ink">Unit symbol</span>
            <input className="mt-2 min-h-12 w-full rounded-2xl border border-chunks-hairline px-4" defaultValue={selectedUnit?.unit_symbol ?? 'Ω'} name="unitSymbol" />
          </label>
          <label className="block">
            <span className="text-sm font-semibold text-chunks-ink">CVR unit value</span>
            <input className="mt-2 min-h-12 w-full rounded-2xl border border-chunks-hairline px-4" defaultValue={selectedUnit?.value ?? 1} min="0" name="value" step="0.01" type="number" />
          </label>
          <label className="flex min-h-12 items-center gap-3 rounded-2xl border border-chunks-hairline px-4">
            <input defaultChecked={selectedUnit?.active ?? true} name="active" type="checkbox" />
            <span className="text-sm font-semibold text-chunks-ink">Active CVR value</span>
          </label>
        </div>
        <div className="mt-5"><Button type="submit">Save CVR value</Button></div>
        {statusMessage ? <Alert className="mt-5" title="CVR status" tone="success">{statusMessage}</Alert> : null}
        {error ? <Alert className="mt-5" title="CVR action failed" tone="error">{error}</Alert> : null}
      </Card>
    </section>
  )
}

function getErrorMessage(error: unknown): string {
  if (error && typeof error === 'object' && 'message' in error) return String(error.message)
  return 'Something went wrong. Please try again.'
}
