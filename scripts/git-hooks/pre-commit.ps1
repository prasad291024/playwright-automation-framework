#!/usr/bin/env pwsh

Write-Host "Running pre-commit checks..."

npm run lint
if ($LASTEXITCODE -ne 0) {
  Write-Host "Pre-commit checks failed"
  exit 1
}

npm run typecheck
if ($LASTEXITCODE -ne 0) {
  Write-Host "Pre-commit checks failed"
  exit 1
}

npm run format:check
if ($LASTEXITCODE -ne 0) {
  Write-Host "Pre-commit checks failed"
  exit 1
}

Write-Host "Pre-commit checks passed"