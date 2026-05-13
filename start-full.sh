#!/bin/bash

echo "Starting Gamma Terminal Backend..."
cd backend

# Check if Python is installed
if ! command -v python3 &> /dev/null; then
    echo "Python 3 is not installed. Please install Python 3.9+"
    exit 1
fi

# Install dependencies if needed
if [ ! -d "venv" ]; then
    echo "Creating virtual environment..."
    python3 -m venv venv
fi

source venv/bin/activate
pip install -r requirements.txt

echo "Starting FastAPI server on port 8000..."
python main.py &
BACKEND_PID=$!

echo "Backend started (PID: $BACKEND_PID)"
echo "Waiting for backend to be ready..."
sleep 3

echo ""
echo "Starting Gamma Terminal Frontend..."
cd ..
npm run dev &
FRONTEND_PID=$!

echo "Frontend started (PID: $FRONTEND_PID)"
echo ""
echo "=========================================="
echo "Gamma Terminal is running!"
echo "Backend: http://localhost:8000"
echo "Frontend: http://localhost:8080"
echo "=========================================="
echo ""
echo "Press Ctrl+C to stop both servers"

# Wait for either process to exit
wait -n $BACKEND_PID $FRONTEND_PID

# Kill both processes
kill $BACKEND_PID $FRONTEND_PID 2>/dev/null
echo "Servers stopped."
