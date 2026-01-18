@echo off
REM Quick Release Script for OpenCode2Obsidian
REM Usage: quick-release.bat [version]

setlocal enabledelayedexpansion

echo ========================================
echo OpenCode2Obsidian Quick Release
echo ========================================
echo.

REM Check if version is provided
if "%~1"=="" (
    echo Error: Version number required
    echo Usage: quick-release.bat 0.3.0
    exit /b 1
)

set VERSION=%~1

echo Version: v%VERSION%
echo.

REM Step 1: Update version
echo [1/5] Updating version numbers...
powershell -ExecutionPolicy Bypass -File "%~dp0update-version.ps1" -NewVersion %VERSION%
if errorlevel 1 (
    echo Error: Version update failed
    exit /b 1
)
echo.

REM Step 2: Commit changes
echo [2/5] Committing changes...
git add .
git commit -m "chore: bump version to %VERSION%"
if errorlevel 1 (
    echo Warning: Nothing to commit or commit failed
)
echo.

REM Step 3: Build release
echo [3/5] Building release package...
powershell -ExecutionPolicy Bypass -File "%~dp0build-release.ps1"
if errorlevel 1 (
    echo Error: Build failed
    exit /b 1
)
echo.

REM Step 4: Review
echo [4/5] Please review the Release Notes:
echo release\RELEASE_NOTES_v%VERSION%.md
echo.
pause

REM Step 5: Publish
echo [5/5] Publishing to GitHub...
powershell -ExecutionPolicy Bypass -File "%~dp0publish-release.ps1" -Version %VERSION%
if errorlevel 1 (
    echo Error: Publish failed
    exit /b 1
)
echo.

echo ========================================
echo Release v%VERSION% Complete!
echo ========================================
echo.
echo Check: https://github.com/Changan-Su/opencode2obsidian/releases
echo.

endlocal
