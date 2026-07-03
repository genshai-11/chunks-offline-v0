import { useState } from 'react'

import { Alert } from '../../../components/ui/Alert'
import { Button } from '../../../components/ui/Button'
import { Card } from '../../../components/ui/Card'
import type { PracticeRoom } from '../../../lib/domain/types'

interface ShareLinkCardProps {
  room: PracticeRoom
}

export function ShareLinkCard({ room }: ShareLinkCardProps) {
  const [copied, setCopied] = useState(false)
  const shareLink = `${window.location.origin}/room/${room.room_code}`

  async function copyShareLink() {
    await navigator.clipboard?.writeText(shareLink)
    setCopied(true)
    window.setTimeout(() => setCopied(false), 1800)
  }

  return (
    <Card>
      <p className="text-sm font-semibold uppercase tracking-[0.2em] text-chunks-red">Room code</p>
      <div className="mt-3 flex flex-wrap items-center gap-3">
        <strong className="theme-hero-title rounded-2xl bg-chunks-soft px-5 py-3 text-4xl tracking-[0.18em] text-chunks-ink">
          {room.room_code}
        </strong>
        <Button onClick={copyShareLink} type="button" variant="secondary">
          Copy share link
        </Button>
      </div>
      <p className="mt-4 break-all text-sm text-chunks-body">{shareLink}</p>
      {copied ? (
        <Alert className="mt-4" tone="success" title="Link copied">
          Learners can open this link and join with a display name.
        </Alert>
      ) : null}
    </Card>
  )
}
