<#
Secure runner for scripts/seed_resource_audio_tts.py.
Prompts for NINEROUTER_KEY without saving it to disk.

Examples:
  # Dry-run Vietnamese discovery
  .\scripts\run_seed_resource_audio_tts.ps1 -Language vi -Limit 10 -DryRun

  # Generate/upload first 5 Vietnamese files
  .\scripts\run_seed_resource_audio_tts.ps1 -Language vi -Limit 5

  # Full resumable Vietnamese run
  .\scripts\run_seed_resource_audio_tts.ps1 -Language vi -BatchSize 25

  # Vietnamese Level B first, reading key from Supabase Vault if NINEROUTER_KEY env is unset
  .\scripts\run_seed_resource_audio_tts.ps1 -Language vi -CourseTitle 'Chunks-Material-Level-B' -BatchSize 25 -ConfigSource auto
#>

param(
  [ValidateSet('en','vi')]
  [string]$Language = 'vi',

  [int]$Limit = 0,

  [int]$BatchSize = 25,

  [string]$CourseTitle = '',

  [ValidateSet('env','vault','auto')]
  [string]$ConfigSource = 'auto',

  [switch]$DryRun,

  [string]$NinerouterUrl = ''
)

$ErrorActionPreference = 'Stop'

if ($NinerouterUrl.Trim().Length -gt 0) {
  $env:NINEROUTER_URL = $NinerouterUrl
}

if (-not $DryRun -and $ConfigSource -eq 'env') {
  if (-not $env:NINEROUTER_KEY) {
    $secure = Read-Host 'Enter NINEROUTER_KEY' -AsSecureString
    $bstr = [Runtime.InteropServices.Marshal]::SecureStringToBSTR($secure)
    try {
      $env:NINEROUTER_KEY = [Runtime.InteropServices.Marshal]::PtrToStringBSTR($bstr)
    } finally {
      [Runtime.InteropServices.Marshal]::ZeroFreeBSTR($bstr)
    }
  }
}

$argsList = @('scripts/seed_resource_audio_tts.py', '--language', $Language, '--batch-size', [string]$BatchSize, '--config-source', $ConfigSource)
if ($Limit -gt 0) { $argsList += @('--limit', [string]$Limit) }
if ($CourseTitle.Trim().Length -gt 0) { $argsList += @('--course-title', $CourseTitle) }
if ($NinerouterUrl.Trim().Length -gt 0) { $argsList += @('--ninerouter-url', $NinerouterUrl) }
if ($DryRun) { $argsList += '--dry-run' }

python @argsList
