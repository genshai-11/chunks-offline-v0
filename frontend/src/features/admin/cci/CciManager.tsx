import type { FormEvent } from 'react'
import { useState } from 'react'

import { Alert } from '../../../components/ui/Alert'
import { Badge, Button, Card, CardContent, CardFooter, CardHeader } from '../../../components/primitives'
import type { CciCategory, CciStandardCard } from '../../../lib/domain/types'
import { saveCciStandardCard } from './cciService'

interface CciManagerProps {
  cards: CciStandardCard[]
  categories: CciCategory[]
  onRefresh: () => Promise<void>
}

export function CciManager({ cards, categories, onRefresh }: CciManagerProps) {
  const [selectedCardId, setSelectedCardId] = useState(cards[0]?.id ?? '')
  const [statusMessage, setStatusMessage] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const selectedCard = cards.find((card) => card.id === selectedCardId) ?? cards[0] ?? null
  const defaultCategoryId = categories[0]?.id ?? selectedCard?.category_id ?? ''

  async function handleSave(event: FormEvent<HTMLElement>) {
    event.preventDefault()
    const form = new FormData(event.currentTarget as HTMLFormElement)
    setError(null)
    try {
      await saveCciStandardCard({
        active: form.get('active') === 'on',
        categoryId: String(form.get('categoryId')),
        id: selectedCard?.id,
        label: String(form.get('label')),
        standardValue: Number(form.get('standardValue')),
      })
      setStatusMessage('CCI card saved. Teacher setup can select active cards after refresh.')
      await onRefresh()
    } catch (saveError) {
      setError(getErrorMessage(saveError))
    }
  }

  return (
    <section aria-labelledby="cci-manager-title" className="grid gap-4">
      <Card padding="sm">
        <CardHeader className="flex flex-row items-start justify-between gap-3 space-y-0">
          <div>
            <Badge tone="brand">CCI Manager</Badge>
            <h2 className="mt-3 text-lg font-semibold text-chunks-ink" id="cci-manager-title">CCI standard cards</h2>
          </div>
          <Badge tone="neutral">{cards.filter((card) => card.active).length} active</Badge>
        </CardHeader>
        <CardContent className="mt-4 grid gap-2">
          {cards.map((card) => {
            const selected = card.id === selectedCard?.id
            return (
              <button
                className={`grid gap-1 rounded-2xl border px-3 py-3 text-left transition active:translate-y-px ${selected ? 'border-chunks-red bg-chunks-soft' : 'border-chunks-hairline bg-white hover:bg-chunks-soft/60'}`}
                key={card.id}
                onClick={() => setSelectedCardId(card.id)}
                type="button"
              >
                <span className="flex items-center justify-between gap-2">
                  <span className="font-semibold text-chunks-ink">{card.label}</span>
                  <Badge size="sm" tone={card.active ? 'success' : 'neutral'}>{card.active ? 'active' : 'inactive'}</Badge>
                </span>
                <span className="font-mono text-xs text-chunks-body">X {card.standard_value}</span>
              </button>
            )
          })}
          {cards.length === 0 ? <p className="rounded-2xl bg-chunks-soft p-3 text-sm text-chunks-body">No CCI cards yet. Save the inspector to create one.</p> : null}
        </CardContent>
      </Card>

      <Card as="form" onSubmit={handleSave} padding="sm">
        <CardHeader>
          <Badge tone="info">Inspector</Badge>
          <h3 className="mt-3 text-lg font-semibold text-chunks-ink">Edit CCI card</h3>
        </CardHeader>
        <CardContent className="mt-4 grid gap-3">
          <label className="block">
            <span className="text-sm font-semibold text-chunks-ink">Category</span>
            <select className="mt-2 min-h-11 w-full rounded-2xl border border-chunks-hairline bg-white px-3" defaultValue={selectedCard?.category_id ?? defaultCategoryId} name="categoryId">
              {categories.map((category) => <option key={category.id} value={category.id}>{category.label}</option>)}
              {categories.length === 0 ? <option value={defaultCategoryId}>Default</option> : null}
            </select>
          </label>
          <label className="block">
            <span className="text-sm font-semibold text-chunks-ink">Label</span>
            <input className="mt-2 min-h-11 w-full rounded-2xl border border-chunks-hairline px-3" defaultValue={selectedCard?.label ?? ''} name="label" />
          </label>
          <label className="block">
            <span className="text-sm font-semibold text-chunks-ink">CCI Standard X</span>
            <input className="mt-2 min-h-11 w-full rounded-2xl border border-chunks-hairline px-3" defaultValue={selectedCard?.standard_value ?? 0} min="0" name="standardValue" step="0.01" type="number" />
          </label>
          <label className="flex min-h-11 items-center gap-3 rounded-2xl border border-chunks-hairline px-3">
            <input defaultChecked={selectedCard?.active ?? true} name="active" type="checkbox" />
            <span className="text-sm font-semibold text-chunks-ink">Active for Teacher setup</span>
          </label>
        </CardContent>
        <CardFooter><Button size="sm" type="submit">Save CCI card</Button></CardFooter>
        {statusMessage ? <Alert className="mt-4" title="CCI status" tone="success">{statusMessage}</Alert> : null}
        {error ? <Alert className="mt-4" title="CCI action failed" tone="error">{error}</Alert> : null}
      </Card>
    </section>
  )
}

function getErrorMessage(error: unknown): string {
  if (error && typeof error === 'object' && 'message' in error) return String(error.message)
  return 'Something went wrong. Please try again.'
}
