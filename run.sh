#!/bin/bash

echo "Billboard Booking System - Setup and Run Script"
echo "================================================"

# Function to check if command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Check prerequisites
echo "Checking prerequisites..."

if ! command_exists java; then
    echo "❌ Java is not installed. Please install Java 8 or higher."
    exit 1
fi

if ! command_exists mvn; then
    echo "❌ Maven is not installed. Please install Maven 3.6+."
    exit 1
fi

if ! command_exists node; then
    echo "❌ Node.js is not installed. Please install Node.js 16+."
    exit 1
fi

if ! command_exists npm; then
    echo "❌ npm is not installed. Please install npm."
    exit 1
fi

echo "✅ All prerequisites are installed."

# Check if MySQL is running
if ! command_exists mysql; then
    echo "⚠️  MySQL client not found. Make sure MySQL server is running."
else
    echo "✅ MySQL client found."
fi

echo ""
echo "Choose an option:"
echo "1. Setup and run backend only"
echo "2. Setup and run frontend only"
echo "3. Setup and run both (recommended)"
echo "4. Build for production"
echo ""
read -p "Enter your choice (1-4): " choice

case $choice in
    1)
        echo "Setting up and running backend..."
        mvn clean install
        if [ $? -eq 0 ]; then
            echo "✅ Backend dependencies installed successfully."
            echo "🚀 Starting backend server..."
            mvn spring-boot:run
        else
            echo "❌ Failed to install backend dependencies."
            exit 1
        fi
        ;;
    2)
        echo "Setting up and running frontend..."
        cd frontend
        npm install
        if [ $? -eq 0 ]; then
            echo "✅ Frontend dependencies installed successfully."
            echo "🚀 Starting frontend development server..."
            npm start
        else
            echo "❌ Failed to install frontend dependencies."
            exit 1
        fi
        ;;
    3)
        echo "Setting up and running both backend and frontend..."
        
        # Setup backend
        echo "📦 Installing backend dependencies..."
        mvn clean install
        if [ $? -ne 0 ]; then
            echo "❌ Failed to install backend dependencies."
            exit 1
        fi
        
        # Setup frontend
        echo "📦 Installing frontend dependencies..."
        cd frontend
        npm install
        if [ $? -ne 0 ]; then
            echo "❌ Failed to install frontend dependencies."
            exit 1
        fi
        cd ..
        
        echo "✅ All dependencies installed successfully."
        echo ""
        echo "🚀 Starting applications..."
        echo "Backend will start at: http://localhost:8080"
        echo "Frontend will start at: http://localhost:3000"
        echo ""
        echo "Press Ctrl+C to stop both servers."
        echo ""
        
        # Start backend in background
        mvn spring-boot:run &
        BACKEND_PID=$!
        
        # Wait a bit for backend to start
        sleep 5
        
        # Start frontend
        cd frontend
        npm start &
        FRONTEND_PID=$!
        
        # Function to cleanup on exit
        cleanup() {
            echo ""
            echo "🛑 Stopping servers..."
            kill $BACKEND_PID 2>/dev/null
            kill $FRONTEND_PID 2>/dev/null
            exit 0
        }
        
        # Trap Ctrl+C
        trap cleanup INT
        
        # Wait for both processes
        wait
        ;;
    4)
        echo "Building for production..."
        
        # Build backend
        echo "📦 Building backend..."
        mvn clean package -DskipTests
        if [ $? -ne 0 ]; then
            echo "❌ Failed to build backend."
            exit 1
        fi
        
        # Build frontend
        echo "📦 Building frontend..."
        cd frontend
        npm install
        npm run build
        if [ $? -ne 0 ]; then
            echo "❌ Failed to build frontend."
            exit 1
        fi
        cd ..
        
        echo "✅ Production build completed successfully!"
        echo ""
        echo "Backend JAR: target/billboard-booking-0.0.1-SNAPSHOT.jar"
        echo "Frontend build: frontend/build/"
        echo ""
        echo "To run in production:"
        echo "java -jar target/billboard-booking-0.0.1-SNAPSHOT.jar"
        ;;
    *)
        echo "Invalid choice. Please run the script again and choose 1-4."
        exit 1
        ;;
esac