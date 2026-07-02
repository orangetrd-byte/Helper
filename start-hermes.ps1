# start-hermes.ps1
# Starts the Shipyard Telegram coordination bot with one command.
# Requires HERMES_TELEGRAM_TOKEN to be set as an environment variable first.

param(
    [string]$Token = $env:HERMES_TELEGRAM_TOKEN
)

if (-not $Token) {
    Write-Host "Missing HERMES_TELEGRAM_TOKEN. Set it first:" -ForegroundColor Yellow
    Write-Host " `$env:HERMES_TELEGRAM_TOKEN = 'your_token'"
    Write-Host "Or pass it directly:"
    Write-Host " .\start-hermes.ps1 -Token 'your_token'"
    exit 1
}

$env:HERMES_TELEGRAM_TOKEN = $Token
$scriptPath = Join-Path $PSScriptRoot "telegram\bot.js"

Write-Host "Starting Shipyard Telegram bot..."
node $scriptPath
