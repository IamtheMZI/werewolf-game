#!/bin/bash

# 🐳 Docker Build & Run Script for Werewolf Game
# This script builds and runs the Werewolf game in Docker

set -e  # Exit on error

echo "🐺 Building Werewolf Game Docker Image..."
echo ""

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo -e "${RED}❌ Docker is not installed!${NC}"
    echo ""
    echo "Please install Docker Desktop for Mac:"
    echo "https://www.docker.com/products/docker-desktop/"
    echo ""
    exit 1
fi

# Check if Docker is running
if ! docker info &> /dev/null; then
    echo -e "${RED}❌ Docker is not running!${NC}"
    echo ""
    echo "Please start Docker Desktop and try again."
    echo ""
    exit 1
fi

echo -e "${BLUE}📦 Building Docker image...${NC}"
docker build -t werewolf-game:latest .

echo ""
echo -e "${GREEN}✅ Build complete!${NC}"
echo ""

# Ask if user wants to run it
read -p "🚀 Do you want to run the container now? (y/n) " -n 1 -r
echo ""

if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo -e "${BLUE}🎮 Starting Werewolf Game...${NC}"

    # Stop and remove existing container if it exists
    docker stop werewolf-game 2>/dev/null || true
    docker rm werewolf-game 2>/dev/null || true

    # Run the container
    docker run -d \
        --name werewolf-game \
        -p 8000:80 \
        --restart unless-stopped \
        werewolf-game:latest

    echo ""
    echo -e "${GREEN}✅ Werewolf Game is running!${NC}"
    echo ""
    echo "🌐 Access your game at:"
    echo -e "${BLUE}   http://localhost:8000${NC}"
    echo ""
    echo "📊 Useful commands:"
    echo "   docker logs werewolf-game          # View logs"
    echo "   docker stop werewolf-game          # Stop the game"
    echo "   docker start werewolf-game         # Start the game"
    echo "   docker restart werewolf-game       # Restart the game"
    echo "   docker rm -f werewolf-game         # Remove container"
    echo ""

    # Try to open in browser (Mac only)
    if command -v open &> /dev/null; then
        sleep 2
        echo "🌐 Opening browser..."
        open http://localhost:8000
    fi
fi

echo -e "${GREEN}🎉 Done!${NC}"
