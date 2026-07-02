@echo off
setlocal enabledelayedexpansion
cd /d "%~dp0"
chcp 65001 > nul

:MENU
cls
echo.
echo  ====================================
echo    RETRO SMD Emulator
echo  ====================================
echo.
echo   [1]  Запустить приложение
echo   [2]  Загрузить / обновить игры из \games на сервер
echo   [3]  Выход
echo.
set /p CHOICE=  Выберите действие (1-3): 

if "%CHOICE%"=="1" goto RUN
if "%CHOICE%"=="2" goto UPLOAD
if "%CHOICE%"=="3" exit /b 0
goto MENU

:RUN
echo.
if not exist node_modules (
  echo Установка зависимостей...
  call npm install
  if errorlevel 1 (
    echo Ошибка установки зависимостей.
    pause
    exit /b 1
  )
)
echo Запуск RETRO SMD Emulator...
call npm start
goto :EOF

:UPLOAD
echo.
where python >nul 2>&1
if errorlevel 1 (
  echo [ОШИБКА] Python не найден. Установите Python 3 и повторите.
  pause
  goto MENU
)

python -c "import paramiko" >nul 2>&1
if errorlevel 1 (
  echo Установка зависимости paramiko...
  python -m pip install paramiko --quiet
  if errorlevel 1 (
    echo [ОШИБКА] Не удалось установить paramiko.
    pause
    goto MENU
  )
)

python upload-games.py
goto MENU
