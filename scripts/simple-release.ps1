# Simple Release Build Script
# 打包 Obsidian 插件用于 GitHub Release

param(
    [string]$Version = ""
)

# 简单的颜色输出
function Success($msg) { Write-Host "OK: $msg" -ForegroundColor Green }
function Info($msg) { Write-Host ">> $msg" -ForegroundColor Cyan }
function Error($msg) { Write-Host "ERROR: $msg" -ForegroundColor Red }

Info "OpenCode2Obsidian Release Builder"

# 确保在项目根目录
$root = Get-Location
Info "Working directory: $root"

# 检查必需文件
$files = @("main.js", "manifest.json", "styles.css")
foreach ($f in $files) {
    if (-not (Test-Path $f)) {
        Error "Missing file: $f"
        Error "Please run 'bun run build' first"
        exit 1
    }
}

# 读取版本号
if (-not $Version) {
    $manifest = Get-Content "manifest.json" | ConvertFrom-Json
    $Version = $manifest.version
}

Info "Version: v$Version"

# 创建 release 目录
$releaseDir = "release"
if (-not (Test-Path $releaseDir)) {
    New-Item -ItemType Directory $releaseDir | Out-Null
}

# 创建版本特定目录
$versionDir = Join-Path $releaseDir "v$Version"
if (Test-Path $versionDir) {
    Remove-Item $versionDir -Recurse -Force
}
New-Item -ItemType Directory $versionDir | Out-Null

# 复制文件
foreach ($f in $files) {
    Copy-Item $f $versionDir
    Success "Copied: $f"
}

# 创建 ZIP
$zipName = "opencode2obsidian-v$Version.zip"
$zipPath = Join-Path $releaseDir $zipName

if (Test-Path $zipPath) {
    Remove-Item $zipPath -Force
}

Add-Type -AssemblyName System.IO.Compression.FileSystem
[System.IO.Compression.ZipFile]::CreateFromDirectory($versionDir, $zipPath)

$zipSize = (Get-Item $zipPath).Length / 1KB
Success ("Created: $zipName (" + [math]::Round($zipSize, 2) + " KB)")

# SHA256
$hash = (Get-FileHash $zipPath).Hash
$hashFile = "$zipPath.sha256"
"SHA256: $hash" | Set-Content $hashFile
Success "SHA256: $hash"

# 完成
Info ""
Info "Release package ready!"
Info "  ZIP: release/$zipName"
Info "  SHA256: release/$zipName.sha256"
Info ""
Info "Next steps:"
Info "  1. Create git tag: git tag v$Version"
Info "  2. Push tag: git push origin v$Version"
Info "  3. Upload $zipName to GitHub Release"
