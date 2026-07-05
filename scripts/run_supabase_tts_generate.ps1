<#
Invoke the deployed Supabase Edge Function `tts-generate` for CHUNKS TTS batches.

Examples:
  # Dry-run Level B using existing TTS_ADMIN_PIN
  .\scripts\run_supabase_tts_generate.ps1 -CourseTitle 'Chunks-Material-Level-B' -DryRun -AuthMode AdminPin

  # Generate Level B in repeated chunks of 10
  .\scripts\run_supabase_tts_generate.ps1 -CourseTitle 'Chunks-Material-Level-B' -RepeatUntilEmpty -Limit 10 -AuthMode AdminPin

  # Use Supabase service/secret key in apikey header instead
  .\scripts\run_supabase_tts_generate.ps1 -CourseTitle 'Chunks-Material-Level-B' -RepeatUntilEmpty -AuthMode ApiKey
#>

param(
  [ValidateSet('en','vi')]
  [string]$Language = 'vi',

  [string]$CourseTitle = 'Chunks-Material-Level-B',

  [ValidateRange(1,25)]
  [int]$Limit = 10,

  [switch]$DryRun,

  [switch]$RepeatUntilEmpty,

  [ValidateSet('AdminPin','ApiKey')]
  [string]$AuthMode = 'AdminPin',

  [string]$FunctionUrl = 'https://ftfxekdxeoxizoyxuqoz.supabase.co/functions/v1/tts-generate'
)

$ErrorActionPreference = 'Stop'

function Read-SecretString([string]$Prompt) {
  $secure = Read-Host $Prompt -AsSecureString
  $bstr = [Runtime.InteropServices.Marshal]::SecureStringToBSTR($secure)
  try {
    return [Runtime.InteropServices.Marshal]::PtrToStringBSTR($bstr)
  } finally {
    [Runtime.InteropServices.Marshal]::ZeroFreeBSTR($bstr)
  }
}

$headers = @{ 'Content-Type' = 'application/json' }
if ($AuthMode -eq 'AdminPin') {
  $token = Read-SecretString 'Enter TTS_ADMIN_PIN or TTS_ADMIN_TOKEN'
  $headers['x-tts-admin-token'] = $token
} else {
  $token = Read-SecretString 'Enter Supabase service/secret key for apikey header'
  $headers['apikey'] = $token
}

$iteration = 0
while ($true) {
  $iteration += 1
  $body = @{
    language = $Language
    courseTitle = $CourseTitle
    limit = $Limit
    dryRun = [bool]$DryRun
  } | ConvertTo-Json

  Write-Host "Invoking tts-generate iteration $iteration ($Language, $CourseTitle, limit $Limit, dryRun=$DryRun)..."
  $response = Invoke-RestMethod -Method POST -Uri $FunctionUrl -Headers $headers -Body $body
  $response | ConvertTo-Json -Depth 8

  if ($DryRun -or -not $RepeatUntilEmpty) { break }
  if (($null -ne $response.failures) -and ($response.failures.Count -gt 0)) {
    throw "Stopping because the function returned failures. Inspect the response above."
  }
  if (($null -eq $response.processed) -or ([int]$response.processed -le 0)) { break }

  Start-Sleep -Seconds 2
}
