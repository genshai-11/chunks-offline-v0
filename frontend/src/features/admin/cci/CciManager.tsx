import type { FormEvent } from 'react'
import { useState } from 'react'

import { Alert } from '../../../components/ui/Alert'
import { Button } from '../../../components/ui/Button'
import { Card } from '../../../components/ui/Card'
import { StatusBadge } from '../../../components/ui/StatusBadge'
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
    <section aria-labelledby="cci-manager-title" className="space-y-4">
      <Card>
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-chunks-body">CCI Manager</p>
            <h2 className="mt-1 text-2xl font-semibold text-chunks-ink" id="cci-manager-title">CCI standard cards</h2>
          </div>
          <StatusBadge tone="brand">{cards.filter((card) => card.active).length} active</StatusBadge>
        </div>
        <div className="mt-5 grid gap-3 md:grid-cols-2">
          {cards.map((card) => (
            <button className="rounded-2xl border border-chunks-hairline p-4 text-left" key={card.id} onClick={() => setSelectedCardId(card.id)} type="button">
              <span className="font-semibold text-chunks-ink">{card.label}</span>
              <span className="mt-1 block text-sm text-chunks-body">X {card.standard_value} · {card.active ? 'active' : 'inactive'}</span>
            </button>
          ))}
        </div>
      </Card>

      <Card as="form" onSubmit={handleSave}>
        <h3 className="text-xl font-semibold text-chunks-ink">Edit CCI card</h3>
        <div className="mt-5 grid gap-4 md:grid-cols-2">
          <label className="block">
            <span className="text-sm font-semibold text-chunks-ink">Category</span>
            <select className="mt-2 min-h-12 w-full rounded-2xl border border-chunks-hairline bg-white px-4" defaultValue={selectedCard?.category_id ?? defaultCategoryId} name="categoryId">
              {categories.map((category) => <option key={category.id} value={category.id}>{category.label}</option>)}
              {categories.length === 0 ? <option value={defaultCategoryId}>Default</option> : null}
            </select>
          </label>
          <label className="block">
            <span className="text-sm font-semibold text-chunks-ink">Label</span>
            <input className="mt-2 min-h-12 w-full rounded-2xl border border-chunks-hairline px-4" defaultValue={selectedCard?.label ?? ''} name="label" />
          </label>
          <label className="block">
            <span className="text-sm font-semibold text-chunks-ink">CCI Standard X</span>
            <input className="mt-2 min-h-12 w-full rounded-2xl border border-chunks-hairline px-4" defaultValue={selectedCard?.standard_value ?? 0} min="0" name="standardValue" step="0.01" type="number" />
          </label>
          <label className="flex min-h-12 items-center gap-3 rounded-2xl border border-chunks-hairline px-4">
            <input defaultChecked={selectedCard?.active ?? true} name="active" type="checkbox" />
            <span className="text-sm font-semibold text-chunks-ink">Active for Teacher setup</span>
          </label>
        </div>
        <div className="mt-5"><Button type="submit">Save CCI card</Button></div>
        {statusMessage ? <Alert className="mt-5" title="CCI status" tone="success">{statusMessage}</Alert> : null}
        {error ? <Alert className="mt-5" title="CCI action failed" tone="error">{error}</Alert> : null}
      </Card>
    </section>
  )
}

function getErrorMessage(error: unknown): string {
  if (error && typeof error === 'object' && 'message' in error) return String(error.message)
  return 'Something went wrong. Please try again.'
}
