# run-local.ps1 - Start local Postgres via Docker Compose and run the backend dev server
# Usage: Open PowerShell in the repo root and run: .\run-local.ps1

Set-StrictMode -Version Latest
# run-local.ps1 - Start local Postgres via Docker Compose and run the backend dev server
# Usage: Open PowerShell in the repo root and run: .\run-local.ps1

Set-StrictMode -Version Latest

$backendDir = "./web-dev-server"

Write-Output "1) Starting local Postgres with docker-compose (web-dev-server/docker-compose.yml)"
Push-Location $backendDir
Write-Output "Docker helper removed. Use sqlite fallback: cd web-dev-server; npm start"
Write-Output "Docker helper script removed. Start server with: cd web-dev-server; npm start"

# Start DB service
Write-Output "Docker support was removed; keep this file only for reference."

# Provide a few seconds for DB to initialize
Write-Output "Waiting 4s for Postgres to initialize..."
Start-Sleep -Seconds 4

# Export environment variables for this PowerShell session (used by app.js/db config)
Write-Output "2) Setting environment variables for this session"
$env:DATABASE_URL = 'postgres://postgres:steven@localhost:5432/starter-server'
# Optional: uncomment to force sync and seed
# $env:FORCE_SYNC = 'true'
# $env:SEED_DB = 'true'

# Install dependencies if needed
Write-Output "3) Installing backend dependencies (if needed)"
if (Test-Path "node_modules") { Write-Output "node_modules exist, skipping npm install" } else { npm install }

Write-Output "4) Starting backend dev server (nodemon will restart on changes)"
npm run dev

Pop-Location
