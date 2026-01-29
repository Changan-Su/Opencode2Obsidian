# Publish Release to GitHub
# 需要 GitHub CLI (gh) 工具

param(
    [Parameter(Mandatory=$true)]
    [string]$Version,
    
    [Parameter(Mandatory=$false)]
    [switch]$Draft = $false,
    
    [Parameter(Mandatory=$false)]
    [switch]$Prerelease = $false
)

function Write-Success { Write-Host "✓ $args" -ForegroundColor Green }
function Write-Error { Write-Host "✗ $args" -ForegroundColor Red }
function Write-Info { Write-Host "ℹ $args" -ForegroundColor Cyan }
function Write-Warning { Write-Host "⚠ $args" -ForegroundColor Yellow }
function Write-Step { Write-Host "`n▶ $args" -ForegroundColor Magenta }

# 检查 gh CLI
$ghVersion = gh --version 2>&1
if ($LASTEXITCODE -ne 0) {
    Write-Error "未找到 GitHub CLI (gh)"
    Write-Info "请先安装: https://cli.github.com/"
    Write-Info "或使用: winget install GitHub.cli"
    exit 1
}

Write-Success "GitHub CLI 已安装"

$ProjectRoot = $PSScriptRoot | Split-Path -Parent
Set-Location $ProjectRoot

# 验证版本号
if ($Version -notmatch '^v?\d+\.\d+\.\d+$') {
    Write-Error "版本号格式错误"
    exit 1
}

# 确保以 v 开头
$Version = $Version -replace '^v?', 'v'

Write-Step "准备发布 $Version"

# 检查 Release 文件是否存在
$releaseDir = Join-Path $ProjectRoot "release"
$zipFile = Join-Path $releaseDir "opencode2obsidian-$Version.zip"
$releaseNotes = Join-Path $releaseDir "RELEASE_NOTES_$Version.md"

if (-not (Test-Path $zipFile)) {
    Write-Error "Release ZIP 文件不存在: $zipFile"
    Write-Info "请先运行: .\scripts\build-release.ps1 -Version $($Version -replace '^v', '')"
    exit 1
}

if (-not (Test-Path $releaseNotes)) {
    Write-Warning "Release Notes 不存在，将使用默认内容"
    $releaseBody = "Release $Version"
} else {
    $releaseBody = Get-Content $releaseNotes -Raw
}

# 检查 Git 状态
Write-Step "检查 Git 状态..."

$gitStatus = git status --porcelain
if ($gitStatus) {
    Write-Warning "工作目录有未提交的更改:"
    Write-Host $gitStatus
    
    $response = Read-Host "是否继续? (y/N)"
    if ($response -ne 'y') {
        Write-Info "已取消"
        exit 0
    }
}

# 检查标签是否已存在
$existingTag = git tag -l $Version
if ($existingTag) {
    Write-Warning "标签 $Version 已存在"
    $response = Read-Host "是否删除并重新创建? (y/N)"
    if ($response -eq 'y') {
        git tag -d $Version
        git push origin :refs/tags/$Version 2>&1 | Out-Null
        Write-Success "已删除旧标签"
    } else {
        Write-Info "已取消"
        exit 0
    }
}

# 创建 Git 标签
Write-Step "创建 Git 标签 $Version..."
git tag -a $Version -m "Release $Version"

if ($LASTEXITCODE -ne 0) {
    Write-Error "创建标签失败"
    exit 1
}

Write-Success "标签已创建"

# 推送标签
Write-Step "推送标签到远程..."
git push origin $Version

if ($LASTEXITCODE -ne 0) {
    Write-Error "推送标签失败"
    git tag -d $Version
    exit 1
}

Write-Success "标签已推送"

# 创建 GitHub Release
Write-Step "创建 GitHub Release..."

$ghArgs = @(
    "release", "create", $Version,
    $zipFile,
    "--title", "OpenCode2Obsidian $Version",
    "--notes-file", $releaseNotes
)

if ($Draft) {
    $ghArgs += "--draft"
    Write-Info "创建草稿 Release"
}

if ($Prerelease) {
    $ghArgs += "--prerelease"
    Write-Info "标记为预发布版本"
}

& gh @ghArgs

if ($LASTEXITCODE -ne 0) {
    Write-Error "创建 GitHub Release 失败"
    exit 1
}

Write-Success "GitHub Release 已创建！"

# 显示 Release URL
$repoUrl = git remote get-url origin
$repoUrl = $repoUrl -replace '\.git$', ''
$repoUrl = $repoUrl -replace 'git@github\.com:', 'https://github.com/'

$releaseUrl = "$repoUrl/releases/tag/$Version"

Write-Step "发布完成！"
Write-Host ""
Write-Info "Release URL: $releaseUrl"
Write-Host ""

if ($Draft) {
    Write-Warning "这是一个草稿 Release，需要手动发布"
    Write-Info "访问上面的 URL 并点击 'Publish release'"
}
