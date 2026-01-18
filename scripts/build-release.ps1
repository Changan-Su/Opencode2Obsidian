# OpenCode2Obsidian Release Build Script
# 用于构建和打包 GitHub Release 版本

param(
    [Parameter(Mandatory=$false)]
    [string]$Version = "",
    
    [Parameter(Mandatory=$false)]
    [switch]$SkipBuild = $false,
    
    [Parameter(Mandatory=$false)]
    [switch]$SkipZip = $false
)

# 颜色输出函数
function Write-Success { Write-Host "✓ $args" -ForegroundColor Green }
function Write-Error { Write-Host "✗ $args" -ForegroundColor Red }
function Write-Info { Write-Host "ℹ $args" -ForegroundColor Cyan }
function Write-Warning { Write-Host "⚠ $args" -ForegroundColor Yellow }
function Write-Step { Write-Host "`n▶ $args" -ForegroundColor Magenta }

# 项目根目录 - 脚本在 scripts/ 子目录中
$ScriptDir = $PSScriptRoot
if ($ScriptDir) {
    $ProjectRoot = Split-Path $ScriptDir -Parent
} else {
    # 如果直接运行，假设在项目根目录
    $ProjectRoot = Get-Location
}

Set-Location $ProjectRoot

Write-Info ("OpenCode2Obsidian Release Builder")
Write-Info ("Project directory: " + $ProjectRoot)

# 读取当前版本号
$manifestPath = Join-Path $ProjectRoot "manifest.json"
$packagePath = Join-Path $ProjectRoot "package.json"

if (-not (Test-Path $manifestPath)) {
    Write-Error "manifest.json 不存在"
    exit 1
}

$manifest = Get-Content $manifestPath | ConvertFrom-Json
$currentVersion = $manifest.version

Write-Info "当前版本: v$currentVersion"

# 如果指定了版本号，更新文件
if ($Version) {
    Write-Step "更新版本号到 v$Version"
    
    # 更新 manifest.json
    $manifest.version = $Version
    $manifest | ConvertTo-Json -Depth 10 | Set-Content $manifestPath -Encoding UTF8
    Write-Success "已更新 manifest.json"
    
    # 更新 package.json
    if (Test-Path $packagePath) {
        $package = Get-Content $packagePath | ConvertFrom-Json
        $package.version = $Version
        $package | ConvertTo-Json -Depth 10 | Set-Content $packagePath -Encoding UTF8
        Write-Success "已更新 package.json"
    }
    
    $currentVersion = $Version
}

# 构建项目
if (-not $SkipBuild) {
    Write-Step "构建项目..."
    
    # 检查依赖
    if (-not (Test-Path "node_modules")) {
        Write-Info "安装依赖..."
        bun install
        if ($LASTEXITCODE -ne 0) {
            Write-Error "依赖安装失败"
            exit 1
        }
    }
    
    # 运行构建
    Write-Info "执行构建命令..."
    bun run build
    
    if ($LASTEXITCODE -ne 0) {
        Write-Error "构建失败"
        exit 1
    }
    
    Write-Success "构建完成"
} else {
    Write-Warning "跳过构建步骤"
}

# 验证构建产物
Write-Step "验证构建产物..."

$requiredFiles = @("main.js", "manifest.json", "styles.css")
$missingFiles = @()

foreach ($file in $requiredFiles) {
    $filePath = Join-Path $ProjectRoot $file
    if (Test-Path $filePath) {
        $fileSize = (Get-Item $filePath).Length
        $fileSizeFormatted = [string]::Format("{0:N0} bytes", $fileSize)
        Write-Success ($file + " (" + $fileSizeFormatted + ")")
    } else {
        $missingFiles += $file
        Write-Error ($file + " not found")
    }
}

if ($missingFiles.Count -gt 0) {
    Write-Error "缺少必需文件，无法继续"
    exit 1
}

# 创建 Release 目录
$releaseDir = Join-Path $ProjectRoot "release"
$versionDir = Join-Path $releaseDir "v$currentVersion"

if (-not $SkipZip) {
    Write-Step "准备 Release 文件..."
    
    # 创建版本目录
    if (Test-Path $versionDir) {
        Remove-Item $versionDir -Recurse -Force
    }
    New-Item -ItemType Directory -Path $versionDir -Force | Out-Null
    
    # 复制必需文件
    Copy-Item (Join-Path $ProjectRoot "main.js") $versionDir
    Copy-Item (Join-Path $ProjectRoot "manifest.json") $versionDir
    Copy-Item (Join-Path $ProjectRoot "styles.css") $versionDir
    
    Write-Success "已复制必需文件到 $versionDir"
    
    # 创建 ZIP 压缩包
    Write-Step "创建 ZIP 压缩包..."
    
    $zipPath = Join-Path $releaseDir "opencode2obsidian-v$currentVersion.zip"
    
    if (Test-Path $zipPath) {
        Remove-Item $zipPath -Force
    }
    
    # 使用 .NET 压缩
    Add-Type -AssemblyName System.IO.Compression.FileSystem
    [System.IO.Compression.ZipFile]::CreateFromDirectory($versionDir, $zipPath)
    
    $zipSize = (Get-Item $zipPath).Length
    $zipSizeKB = [string]::Format("{0:N2} KB", ($zipSize/1KB))
    $zipName = "opencode2obsidian-v" + $currentVersion + ".zip"
    Write-Success ("ZIP archive created: " + $zipName + " (" + $zipSizeKB + ")")
    
    # 计算 SHA256 校验和
    Write-Step "生成校验和..."
    $sha256 = (Get-FileHash $zipPath -Algorithm SHA256).Hash
    $sha256Path = "$zipPath.sha256"
    "SHA256: $sha256" | Set-Content $sha256Path -Encoding UTF8
    Write-Success "SHA256: $sha256"
} else {
    Write-Warning "跳过 ZIP 打包步骤"
}

# 生成 Release Notes 模板
Write-Step "生成 Release Notes 模板..."

$releaseNotesPath = Join-Path $releaseDir "RELEASE_NOTES_v$currentVersion.md"

$releaseNotes = @"
# Release v$currentVersion

## 📦 下载 / Download

- **插件包 / Plugin Package**: ``opencode2obsidian-v$currentVersion.zip``
- **SHA256**: 见下方 / See below

## ✨ 新功能 / New Features

- [ ] 功能 1 描述
- [ ] 功能 2 描述

## 🐛 修复 / Bug Fixes

- [ ] 修复 1 描述
- [ ] 修复 2 描述

## 🔧 改进 / Improvements

- [ ] 改进 1 描述
- [ ] 改进 2 描述

## 📝 变更 / Changes

查看完整变更日志: [CHANGELOG.md](../CHANGELOG.md)

## 🚀 安装方法 / Installation

### 方式 1: 自动下载 (Obsidian v1.5.0+)
1. 打开 Obsidian Settings
2. 进入 Community Plugins → Browse
3. 搜索 "OpenCode2Obsidian"
4. 点击 Install

### 方式 2: 手动安装
1. 下载 ``opencode2obsidian-v$currentVersion.zip``
2. 解压到 ``<vault>/.obsidian/plugins/opencode2obsidian/``
3. 在 Obsidian 中启用插件

## 📋 系统要求 / Requirements

- Obsidian Desktop v1.4.0+
- OpenCode CLI v1.1.0+
- Windows 10/11 或 macOS 10.15+

## 🔐 校验和 / Checksums

``````
SHA256: $sha256
``````

## 📸 截图 / Screenshots

[添加截图]

## 🙏 致谢 / Credits

感谢所有贡献者和使用者！

---

**完整文档**: https://github.com/Changan-Su/opencode2obsidian
**问题反馈**: https://github.com/Changan-Su/opencode2obsidian/issues
"@

$releaseNotes | Set-Content $releaseNotesPath -Encoding UTF8
Write-Success "Release Notes 模板已生成: RELEASE_NOTES_v$currentVersion.md"

# 汇总信息
Write-Step "Release 构建完成！"
Write-Host ""
Write-Info "版本: v$currentVersion"
Write-Info "ZIP 文件: release/opencode2obsidian-v$currentVersion.zip"
Write-Info "SHA256 文件: release/opencode2obsidian-v$currentVersion.zip.sha256"
Write-Info "Release Notes: release/RELEASE_NOTES_v$currentVersion.md"
Write-Host ""
Write-Success "下一步操作:"
Write-Host "  1. 编辑 Release Notes: release/RELEASE_NOTES_v$currentVersion.md" -ForegroundColor White
Write-Host "  2. 创建 Git Tag: git tag v$currentVersion" -ForegroundColor White
Write-Host "  3. 推送 Tag: git push origin v$currentVersion" -ForegroundColor White
Write-Host "  4. 在 GitHub 创建 Release，上传 ZIP 文件" -ForegroundColor White
Write-Host ""
Write-Info "或使用自动化脚本: .\scripts\publish-release.ps1 -Version $currentVersion"
