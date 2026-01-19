# Script para configurar variáveis de ambiente na Vercel
# Execute este script no PowerShell

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Configuração do Asaas na Vercel" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Verificar se está logado na Vercel
Write-Host "Verificando login na Vercel..." -ForegroundColor Yellow
$whoami = vercel whoami 2>&1
if ($LASTEXITCODE -ne 0) {
    Write-Host "Você não está logado. Fazendo login..." -ForegroundColor Red
    vercel login
}

Write-Host ""
Write-Host "Linkando projeto..." -ForegroundColor Yellow

# Linkar ao projeto existente
vercel link --project workflow-digital-masterpiece --yes

Write-Host ""
Write-Host "========================================" -ForegroundColor Green
Write-Host "  Configurando Variáveis de Ambiente" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host ""

# Solicitar a API Key
Write-Host "Cole sua API Key do Asaas (será ocultada):" -ForegroundColor Yellow
$apiKey = Read-Host -AsSecureString
$apiKeyPlain = [Runtime.InteropServices.Marshal]::PtrToStringAuto([Runtime.InteropServices.Marshal]::SecureStringToBSTR($apiKey))

# Configurar variáveis de ambiente
Write-Host ""
Write-Host "Configurando ASAAS_API_KEY..." -ForegroundColor Yellow
echo $apiKeyPlain | vercel env add ASAAS_API_KEY production

Write-Host "Configurando ASAAS_ENV..." -ForegroundColor Yellow
echo "production" | vercel env add ASAAS_ENV production

Write-Host "Configurando APP_URL..." -ForegroundColor Yellow
echo "https://leonardolopes.online" | vercel env add APP_URL production

Write-Host ""
Write-Host "========================================" -ForegroundColor Green
Write-Host "  Fazendo Deploy" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host ""

vercel --prod

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  CONCLUÍDO!" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Seu checkout está disponível em:" -ForegroundColor Green
Write-Host "https://leonardolopes.online/checkout/lauren" -ForegroundColor White
Write-Host ""
