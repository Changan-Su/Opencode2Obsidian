@echo off
title OpenCode2Obsidian Installer

:: ============================================
:: OpenCode2Obsidian Quick Installer for Windows
:: Double-click to run
:: Author: Changan Su (https://github.com/Changan-Su)
:: ============================================

setlocal

echo.
echo ============================================
echo   OpenCode2Obsidian Installer
echo ============================================
echo.

:: Get script directory
set "SCRIPT_DIR=%~dp0"
set "SCRIPT_DIR=%SCRIPT_DIR:~0,-1%"

:: Check if required files exist
if not exist "%SCRIPT_DIR%\main.js" (
    echo [!] main.js not found. Building project...
    
    where bun >nul 2>&1
    if errorlevel 1 (
        echo [X] Bun is not installed. Please install from: https://bun.sh
        pause
        exit /b 1
    )
    
    cd /d "%SCRIPT_DIR%"
    call bun install
    call bun run build
    
    if not exist "%SCRIPT_DIR%\main.js" (
        echo [X] Build failed!
        pause
        exit /b 1
    )
)

echo [OK] Build files ready
echo.

:: Prompt for vault path
echo Enter your Obsidian Vault path:
echo Tip: You can drag and drop the vault folder here
set /p "VAULT_PATH=Path: "

:: Remove quotes if present
set "VAULT_PATH=%VAULT_PATH:"=%"

:: Validate path (normalize using pushd)
pushd "%VAULT_PATH%" 2>nul
if errorlevel 1 (
    echo [X] Path does not exist: %VAULT_PATH%
    pause
    exit /b 1
)
set "VAULT_PATH=%CD%"
popd

:: Check if it's likely an Obsidian vault (hidden folder is still detectable)
if exist "%VAULT_PATH%\.obsidian\" (
    echo [OK] .obsidian found
) else (
    echo [!] .obsidian folder not found. This may not be an Obsidian vault.
    echo [!] Vault path: %VAULT_PATH%
    echo [!] Showing hidden entries (if any):
    dir /a "%VAULT_PATH%" | findstr /i "\.obsidian"
    echo.
    set /p "CONTINUE=Continue anyway? (Y/n): "
    if /i "%CONTINUE%"=="n" (
        echo Installation cancelled.
        pause
        exit /b 0
    )
)

:: Create plugins directory if needed
set "PLUGINS_DIR=%VAULT_PATH%\.obsidian\plugins"
if not exist "%PLUGINS_DIR%" (
    echo [*] Creating plugins directory...
    mkdir "%PLUGINS_DIR%"
)

:: Create plugin directory
set "PLUGIN_DIR=%PLUGINS_DIR%\opencode2obsidian"
if exist "%PLUGIN_DIR%" (
    echo [!] Plugin already exists. Overwrite? (y/n)
    set /p "OVERWRITE=: "
    if /i not "!OVERWRITE!"=="y" (
        echo Installation cancelled.
        pause
        exit /b 0
    )
    rmdir /s /q "%PLUGIN_DIR%" 2>nul
)

mkdir "%PLUGIN_DIR%"

:: Copy files
echo.
echo [*] Installing plugin files...

copy "%SCRIPT_DIR%\main.js" "%PLUGIN_DIR%\" >nul
if errorlevel 1 goto :copy_error

copy "%SCRIPT_DIR%\manifest.json" "%PLUGIN_DIR%\" >nul
if errorlevel 1 goto :copy_error

copy "%SCRIPT_DIR%\styles.css" "%PLUGIN_DIR%\" >nul
if errorlevel 1 goto :copy_error

echo [OK] main.js
echo [OK] manifest.json
echo [OK] styles.css

:: Success
echo.
echo ============================================
echo   Installation Complete!
echo ============================================
echo.
echo Next steps:
echo   1. Open Obsidian
echo   2. Go to Settings ^> Community plugins
echo   3. Disable "Restricted mode" if enabled
echo   4. Find and enable "OpenCode2Obsidian"
echo   5. Click the OpenCode icon in the ribbon
echo.
echo Note: Make sure OpenCode CLI is installed

echo   Install: npm install -g @anthropics/opencode
echo.

pause
exit /b 0

:copy_error
echo [X] Failed to copy files!
pause
exit /b 1
