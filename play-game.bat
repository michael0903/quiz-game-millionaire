@echo off
title Who Wants To Be A Millionaire? - Quiz Game
echo.
echo =====================================================
echo    WHO WANTS TO BE A MILLIONAIRE? - QUIZ GAME
echo =====================================================
echo.
echo Starting the game in your default web browser...
echo.

REM Try to open index.html in the default browser
start "" "index.html"

REM Check if the file exists and provide feedback
if not exist "index.html" (
    echo ERROR: index.html not found!
    echo Please make sure all game files are in the same folder.
    echo.
    pause
    exit /b 1
)

echo Game launched successfully!
echo.
echo If the game doesn't open automatically:
echo 1. Open your web browser
echo 2. Drag and drop the 'index.html' file into the browser
echo 3. Or navigate to this folder and double-click 'index.html'
echo.
echo Press any key to close this window...
pause >nul