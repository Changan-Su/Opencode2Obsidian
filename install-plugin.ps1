# Opencode2Obsidian 安装脚本
# 用于快速安装插件到 Obsidian vault

param(
    [Parameter(Mandatory=$true)]
    [string]$VaultPath,
    
    [Parameter(Mandatory=$false)]
    [switch]$UseSymlink = $false,
    
    [Parameter(Mandatory=$false)]
    [switch]$Force = $false
)

# 颜色输出函数
function Write-Success { Write-Host "✓ $args" -ForegroundColor Green }
function Write-Error { Write-Host "✗ $args" -ForegroundColor Red }
function Write-Info { Write-Host "ℹ $args" -ForegroundColor Cyan }
function Write-Warning { Write-Host "⚠ $args" -ForegroundColor Yellow }

# 检查 vault 路径是否存在
if (-not (Test-Path $VaultPath)) {
    Write-Error "Vault 路径不存在: $VaultPath"
    exit 1
}

Write-Info "目标 Vault: $VaultPath"

# 确保 .obsidian 目录存在
$obsidianDir = Join-Path $VaultPath ".obsidian"
if (-not (Test-Path $obsidianDir)) {
    Write-Warning ".obsidian 目录不存在，正在创建..."
    New-Item -ItemType Directory -Path $obsidianDir -Force | Out-Null
    Write-Success "已创建 .obsidian 目录"
}

# 确保 plugins 目录存在
$pluginsDir = Join-Path $obsidianDir "plugins"
if (-not (Test-Path $pluginsDir)) {
    Write-Info "正在创建 plugins 目录..."
    New-Item -ItemType Directory -Path $pluginsDir -Force | Out-Null
    Write-Success "已创建 plugins 目录"
}

# 插件目录
$pluginDir = Join-Path $pluginsDir "opencode2obsidian"

# 检查插件目录是否已存在
if (Test-Path $pluginDir) {
    if ($Force) {
        Write-Warning "插件目录已存在，正在删除..."
        Remove-Item -Path $pluginDir -Recurse -Force
        Write-Success "已删除旧插件目录"
    } else {
        Write-Error "插件目录已存在: $pluginDir"
        Write-Info "使用 -Force 参数覆盖安装"
        exit 1
    }
}

# 源文件路径
$sourceDir = "F:\MyFiles\Projects\Opencode2Obsidian"
$mainJs = Join-Path $sourceDir "main.js"
$manifestJson = Join-Path $sourceDir "manifest.json"
$stylesCss = Join-Path $sourceDir "styles.css"

# 检查构建产物是否存在
$missingFiles = @()
if (-not (Test-Path $mainJs)) { $missingFiles += "main.js" }
if (-not (Test-Path $manifestJson)) { $missingFiles += "manifest.json" }
if (-not (Test-Path $stylesCss)) { $missingFiles += "styles.css" }

if ($missingFiles.Count -gt 0) {
    Write-Error "缺少构建产物: $($missingFiles -join ', ')"
    Write-Info "请先运行: bun run build"
    exit 1
}

# 安装插件
if ($UseSymlink) {
    # 使用符号链接 (推荐开发时使用)
    Write-Info "正在创建符号链接..."
    try {
        New-Item -ItemType SymbolicLink -Path $pluginDir -Target $sourceDir -Force | Out-Null
        Write-Success "已创建符号链接: $pluginDir -> $sourceDir"
        Write-Warning "注意: 符号链接需要管理员权限"
    } catch {
        Write-Error "创建符号链接失败: $_"
        Write-Info "尝试使用管理员权限运行，或使用不带 -UseSymlink 参数的普通复制模式"
        exit 1
    }
} else {
    # 复制文件
    Write-Info "正在复制文件到插件目录..."
    New-Item -ItemType Directory -Path $pluginDir -Force | Out-Null
    
    Copy-Item $mainJs $pluginDir
    Copy-Item $manifestJson $pluginDir
    Copy-Item $stylesCss $pluginDir
    
    Write-Success "已复制 main.js"
    Write-Success "已复制 manifest.json"
    Write-Success "已复制 styles.css"
}

# 验证安装
Write-Info "正在验证安装..."
$installedFiles = @(
    (Join-Path $pluginDir "main.js"),
    (Join-Path $pluginDir "manifest.json"),
    (Join-Path $pluginDir "styles.css")
)

$allExist = $true
foreach ($file in $installedFiles) {
    if (Test-Path $file) {
        Write-Success "✓ $(Split-Path $file -Leaf)"
    } else {
        Write-Error "✗ $(Split-Path $file -Leaf) 不存在"
        $allExist = $false
    }
}

if ($allExist) {
    Write-Success "`n插件安装成功!"
    Write-Info "`n下一步:"
    Write-Host "  1. 打开 Obsidian" -ForegroundColor White
    Write-Host "  2. 进入 Settings → Community Plugins" -ForegroundColor White
    Write-Host "  3. 关闭 Safe mode (如果已开启)" -ForegroundColor White
    Write-Host "  4. 在 Installed plugins 中启用 'OpenCode Integration'" -ForegroundColor White
    Write-Host "  5. 查看左侧 ribbon 是否出现终端图标" -ForegroundColor White
    
    if ($UseSymlink) {
        Write-Info "`n使用符号链接模式，修改源代码后运行 'bun run build' 即可更新插件"
    } else {
        Write-Info "`n使用复制模式，修改代码后需重新运行此脚本安装"
    }
} else {
    Write-Error "`n安装失败，请检查错误信息"
    exit 1
}

# 显示插件信息
Write-Info "`n插件信息:"
$manifest = Get-Content (Join-Path $pluginDir "manifest.json") | ConvertFrom-Json
Write-Host "  名称: $($manifest.name)" -ForegroundColor White
Write-Host "  版本: $($manifest.version)" -ForegroundColor White
Write-Host "  作者: $($manifest.author)" -ForegroundColor White
Write-Host "  安装路径: $pluginDir" -ForegroundColor White
