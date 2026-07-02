# start-hermes.ps1
# Starts the Shipyard Telegram coordination bot with one command.
# Requires TELEGRAM_BOT_TOKEN to be set as an environment variable first.

param(
    [string]$Token = $env:TELEGRAM_BOT_TOKEN
)

if (-not $Token) {
    Write-Host "Missing TELEGRAM_BOT_TOKEN. Set it first:" -ForegroundColor Yellow
    Write-Host " `$env:TELEGRAM_BOT_TOKEN = 'your_token'"
    Write-Host "Or pass it directly:"
    Write-Host " .\start-hermes.ps1 -Token 'your_token'"
    exit 1
}

$env:TELEGRAM_BOT_TOKEN = $Token
$scriptPath = Join-Path $PSScriptRoot "telegram\bot.js"

Write-Host "Starting Shipyard Telegram bot..."
node $scriptPath
