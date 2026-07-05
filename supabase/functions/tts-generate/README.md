# tts-generate Edge Function

Secure operator-only TTS generator for CHUNKS sentence resources.

## What it does

For a small batch of missing audio rows, it:

1. Loads missing `sentence_resources` for `audio_vi_url` or `audio_en_url`.
2. Calls the configured 9Router OpenAI-compatible `/audio/speech` endpoint.
3. Uploads MP3 bytes to Supabase Storage bucket `resource-audio`.
4. Updates `sentence_resources.audio_vi_url` or `audio_en_url` with the Storage object path.

The function is intentionally chunked because hosted Edge Functions have short execution limits. Call it repeatedly until `jobs` / `processed` becomes `0`.

## Security

- Deployed with `verify_jwt = false` because the function implements custom service-to-service auth.
- Caller must provide one of:
  - Supabase secret/service key in `apikey`, or
  - Supabase service role key in `Authorization: Bearer ...`, or
  - `x-tts-admin-token` matching Edge secret `TTS_ADMIN_TOKEN`, or
  - existing `TTS_ADMIN_PIN` via `x-tts-admin-token` or request body `adminPin`.
- 9Router provider key must be configured as an Edge Function secret: `NINEROUTER_KEY`.
- Provider key is never returned in responses.
- Do not call this from browser/client UI directly.

## Required secrets

```powershell
# Use a rotated provider key. Do not put leaked/chat-pasted keys here.
supabase secrets set NINEROUTER_KEY="<rotated-provider-key>" --project-ref ftfxekdxeoxizoyxuqoz

# Optional; function has this URL as a non-secret fallback.
supabase secrets set NINEROUTER_URL="https://rbkqhml.abc-tunnel.us/v1" --project-ref ftfxekdxeoxizoyxuqoz

# Optional alternate operator token if you do not want to use Supabase service key to invoke.
# Existing TTS_ADMIN_PIN is also supported for compatibility.
supabase secrets set TTS_ADMIN_TOKEN="<long-random-operator-token>" --project-ref ftfxekdxeoxizoyxuqoz
```

## Dry-run Level B first

```powershell
$body = @{
  language = 'vi'
  courseTitle = 'Chunks-Material-Level-B'
  limit = 10
  dryRun = $true
  # Optional if using existing TTS_ADMIN_PIN instead of Supabase service key header:
  # adminPin = '<TTS_ADMIN_PIN>'
} | ConvertTo-Json

Invoke-RestMethod `
  -Method POST `
  -Uri 'https://ftfxekdxeoxizoyxuqoz.supabase.co/functions/v1/tts-generate' `
  -Headers @{ apikey = '<SUPABASE_SECRET_OR_SERVICE_KEY>'; 'Content-Type' = 'application/json' } `
  -Body $body
```

## Generate Level B in chunks

```powershell
$body = @{
  language = 'vi'
  courseTitle = 'Chunks-Material-Level-B'
  limit = 10
  dryRun = $false
  # Optional if using existing TTS_ADMIN_PIN instead of Supabase service key header:
  # adminPin = '<TTS_ADMIN_PIN>'
} | ConvertTo-Json

Invoke-RestMethod `
  -Method POST `
  -Uri 'https://ftfxekdxeoxizoyxuqoz.supabase.co/functions/v1/tts-generate' `
  -Headers @{ apikey = '<SUPABASE_SECRET_OR_SERVICE_KEY>'; 'Content-Type' = 'application/json' } `
  -Body $body
```

Repeat until response shows `processed: 0`.

## Request body

```json
{
  "language": "vi",
  "courseTitle": "Chunks-Material-Level-B",
  "limit": 10,
  "dryRun": false,
  "overwrite": false,
  "fallbackToTextEn": true,
  "adminPin": "optional existing TTS_ADMIN_PIN"
```

- `language`: `vi` or `en`; defaults to `vi`.
- `courseTitle`: exact course title filter; use `Chunks-Material-Level-B` first.
- `limit`: max rows per invocation, capped at `25`.
- `dryRun`: returns jobs/targets without TTS/upload/update.
- `overwrite`: default `false`; only fills missing audio columns.
- `fallbackToTextEn`: default `true`; for Vietnamese audio rows missing `text_vi`, use `text_en` so `audio_vi_url` can be fully populated.
