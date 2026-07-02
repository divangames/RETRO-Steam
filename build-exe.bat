@echo off
setlocal enabledelayedexpansion

cd /d "%~dp0"

echo ==========================================
echo RETRO SMD Emulator - Windows EXE Builder
echo ==========================================
echo.

if not exist "package.json" (
  echo [ERROR] package.json not found in current folder.
  pause
  exit /b 1
)

if not exist "node_modules" (
  echo [INFO] Installing dependencies...
  call npm install
  if errorlevel 1 (
    echo [ERROR] npm install failed.
    pause
    exit /b 1
  )
)

if not exist "games" (
  echo [WARN] Folder "games" not found. Build continues, but game files will be missing.
)

if not exist "source" (
  echo [WARN] Folder "source" not found. Build continues, but linked source assets may be missing.
)

echo.
echo [INFO] Building installer EXE (NSIS)...
call npm run build:win
if errorlevel 1 (
  echo [ERROR] Installer build failed.
  pause
  exit /b 1
)

echo.
echo [INFO] Building portable EXE...
call npm run build:portable
if errorlevel 1 (
  echo [ERROR] Portable build failed.
  pause
  exit /b 1
)

echo.
echo [OK] Build completed successfully.
echo [OK] Output folder: dist
echo.
pause
