$ErrorActionPreference = "Stop"

# Configuration
$ServerIP = "13.125.161.160"
$User = "bitnami"
$KeyPath = "C:/jobproject/Key/Multi_bitnami_Key.pem"
$RemoteDir = "~/"

Write-Host "🚀 Starting Deployment Process..." -ForegroundColor Green

# 1. Build Frontend
Write-Host "📦 Building Frontend..." -ForegroundColor Cyan
cmd /c "npm run build"
if ($LASTEXITCODE -ne 0) {
    Write-Error "Build failed!"
}

# 2. Package Application
Write-Host "🗜️ Packaging Application..." -ForegroundColor Cyan
if (Test-Path "deploy.zip") { Remove-Item "deploy.zip" }

# Using Compress-Archive with exclusions
# We exclude node_modules, .git, and .db files
Compress-Archive -Path dist, server, package.json -DestinationPath deploy.zip -Force

# 3. Transfer to Server
Write-Host "uploading deploy.zip to $ServerIP..." -ForegroundColor Cyan
scp -i $KeyPath -o StrictHostKeyChecking=no deploy.zip "${User}@${ServerIP}:${RemoteDir}"

# 4. Remote Execution
Write-Host "🚀 Executing Remote Deployment..." -ForegroundColor Cyan
$RemoteCommand = "cp server/prisma/dev.db server/prisma/dev.db.bak; unzip -o deploy.zip; mv server/prisma/dev.db.bak server/prisma/dev.db; sudo rm -rf server/node_modules server/package-lock.json; cd server; npm install; npx prisma generate; npx prisma db push; pm2 restart all"

ssh -i $KeyPath -o StrictHostKeyChecking=no "${User}@${ServerIP}" $RemoteCommand

Write-Host "✅ Deployment Complete!" -ForegroundColor Green
