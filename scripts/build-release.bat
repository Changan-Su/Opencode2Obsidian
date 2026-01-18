@echo off
REM Simple Release Package Builder
REM Creates a ZIP file for GitHub Release

setlocal enabledelayedexpansion

echo ========================================
echo OpenCode2Obsidian Release Builder
echo ========================================
echo.

REM Check if files exist
if not exist "main.js" (
    echo ERROR: main.js not found
    echo Please run 'bun run build' first
    exit /b 1
)

if not exist "manifest.json" (
    echo ERROR: manifest.json not found
    exit /b 1
)

if not exist "styles.css" (
    echo ERROR: styles.css not found
    exit /b 1
)

REM Read version from manifest.json
for /f "tokens=2 delims=:, " %%a in ('findstr /C:"version" manifest.json') do (
    set VERSION=%%a
    set VERSION=!VERSION:"=!
)

echo Version: v%VERSION%
echo.

REM Create release directory
if not exist "release" mkdir "release"
if exist "release\v%VERSION%" rmdir /s /q "release\v%VERSION%"
mkdir "release\v%VERSION%"

REM Copy files
copy /y "main.js" "release\v%VERSION%\" > nul
copy /y "manifest.json" "release\v%VERSION%\" > nul
copy /y "styles.css" "release\v%VERSION%\" > nul

echo [OK] Copied files to release\v%VERSION%\
echo.

REM Create ZIP using PowerShell
echo Creating ZIP package...
powershell -NoProfile -Command "Compress-Archive -Path 'release\v%VERSION%\*' -DestinationPath 'release\opencode2obsidian-v%VERSION%.zip' -Force"

if exist "release\opencode2obsidian-v%VERSION%.zip" (
    echo [OK] Created: release\opencode2obsidian-v%VERSION%.zip
    for %%A in ("release\opencode2obsidian-v%VERSION%.zip") do (
        set /a SIZE=%%~zA/1024
        echo [OK] Size: !SIZE! KB
    )
) else (
    echo [ERROR] Failed to create ZIP
    exit /b 1
)

echo.
echo ========================================
echo Release Package Ready!
echo ========================================
echo.
echo File: release\opencode2obsidian-v%VERSION%.zip
echo.
echo Next steps:
echo   1. git tag v%VERSION%
echo   2. git push origin v%VERSION%
echo   3. Upload ZIP to GitHub Release
echo.

endlocal
