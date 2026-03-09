#!/usr/bin/env pwsh

Write-Host "Running post-pull checks..."

npm install
npx playwright install

npm run lint
if ($LASTEXITCODE -ne 0) {
  Write-Host "Post-pull checks failed"
  exit 1
}

npm run typecheck
if ($LASTEXITCODE -ne 0) {
  Write-Host "Post-pull checks failed"
  exit 1
}

npx playwright test --grep '@smoke' --project=saucedemo

Write-Host "Environment verification complete"