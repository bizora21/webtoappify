@echo off
echo ========================================
echo WebToAppify Frontend
echo ========================================
echo.

cd /d "%~dp0"

echo Checking if node_modules exists...
if not exist "node_modules\" (
    echo Installing dependencies...
    call npm install
    echo.
)

echo Starting frontend...
echo Frontend will run on http://localhost:5173
echo Press Ctrl+C to stop
echo.

call npm run dev
