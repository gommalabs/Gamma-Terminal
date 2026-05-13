@echo off
echo Starting Gamma Terminal Backend...
cd backend

REM Check if Python is installed
where python >nul 2>&1
if %errorlevel% neq 0 (
    echo Python is not installed. Please install Python 3.9+
    pause
    exit /b 1
)

REM Install dependencies if needed
if not exist "venv" (
    echo Creating virtual environment...
    python -m venv venv
)

call venv\Scripts\activate
pip install -r requirements.txt

echo Starting FastAPI server on port 8000...
start "Gamma Backend" python main.py

echo Backend started!
echo Waiting for backend to be ready...
timeout /t 3 /nobreak >nul

echo.
echo Starting Gamma Terminal Frontend...
cd ..
start "Gamma Frontend" npm run dev

echo.
echo ==========================================
echo Gamma Terminal is running!
echo Backend: http://localhost:8000
echo Frontend: http://localhost:8080
echo ==========================================
echo.
echo Close both terminal windows to stop servers
pause
