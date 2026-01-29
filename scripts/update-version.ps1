# Version Management Script
# 用于更新项目版本号

param(
    [Parameter(Mandatory=$true)]
    [string]$NewVersion,
    
    [Parameter(Mandatory=$false)]
    [switch]$DryRun = $false
)

function Write-Success { Write-Host "✓ $args" -ForegroundColor Green }
function Write-Error { Write-Host "✗ $args" -ForegroundColor Red }
function Write-Info { Write-Host "ℹ $args" -ForegroundColor Cyan }
function Write-Warning { Write-Host "⚠ $args" -ForegroundColor Yellow }

# 验证版本号格式 (semantic versioning)
if ($NewVersion -notmatch '^\d+\.\d+\.\d+$') {
    Write-Error "版本号格式错误，应为 X.Y.Z (例如: 1.0.0)"
    exit 1
}

$ProjectRoot = $PSScriptRoot | Split-Path -Parent

Write-Info "更新版本号到: v$NewVersion"

if ($DryRun) {
    Write-Warning "DRY RUN 模式 - 不会实际修改文件"
}

# 文件列表
$files = @{
    "manifest.json" = @{
        Path = Join-Path $ProjectRoot "manifest.json"
        Key = "version"
    }
    "package.json" = @{
        Path = Join-Path $ProjectRoot "package.json"
        Key = "version"
    }
    "README.md" = @{
        Path = Join-Path $ProjectRoot "README.md"
        Pattern = 'version-\d+\.\d+\.\d+-blue'
        Replacement = "version-$NewVersion-blue"
    }
}

# 更新 JSON 文件
foreach ($fileName in @("manifest.json", "package.json")) {
    $file = $files[$fileName]
    $filePath = $file.Path
    
    if (Test-Path $filePath) {
        $content = Get-Content $filePath -Raw | ConvertFrom-Json
        $oldVersion = $content.($file.Key)
        
        Write-Info "$fileName - $oldVersion → $NewVersion"
        
        if (-not $DryRun) {
            $content.($file.Key) = $NewVersion
            $content | ConvertTo-Json -Depth 10 | Set-Content $filePath -Encoding UTF8
            Write-Success "已更新 $fileName"
        }
    } else {
        Write-Warning "$fileName 不存在，跳过"
    }
}

# 更新 README.md 中的版本徽章
$readmePath = $files["README.md"].Path
if (Test-Path $readmePath) {
    $readmeContent = Get-Content $readmePath -Raw
    $pattern = $files["README.md"].Pattern
    $replacement = $files["README.md"].Replacement
    
    $matches = [regex]::Matches($readmeContent, $pattern)
    
    if ($matches.Count -gt 0) {
        Write-Info "README.md - 找到 $($matches.Count) 处版本徽章"
        
        if (-not $DryRun) {
            $readmeContent = $readmeContent -replace $pattern, $replacement
            $readmeContent | Set-Content $readmePath -Encoding UTF8 -NoNewline
            Write-Success "已更新 README.md"
        }
    } else {
        Write-Warning "README.md 中未找到版本徽章"
    }
}

if ($DryRun) {
    Write-Warning "DRY RUN 完成 - 没有文件被修改"
} else {
    Write-Success "版本号更新完成: v$NewVersion"
    Write-Info "下一步: 运行 .\scripts\build-release.ps1 构建 Release"
}
