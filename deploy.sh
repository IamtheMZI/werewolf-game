#!/bin/bash

# Werewolf Game - Quick Deployment Script
# This script helps you deploy the game using Docker

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Functions
print_success() { echo -e "${GREEN}✅ $1${NC}"; }
print_error() { echo -e "${RED}❌ $1${NC}"; }
print_info() { echo -e "${BLUE}ℹ️  $1${NC}"; }
print_warning() { echo -e "${YELLOW}⚠️  $1${NC}"; }

# ASCII Art
echo -e "${BLUE}"
cat << "EOF"
 __      __                               _  __
 \ \    / /                              | |/ _|
  \ \  / /__ _ _ ___ ___    _ _ _  _ __ | | |_
   \ \/ / _ \ '_|_ / _ \\ \/\/| '_/ _ \| |  _|
    \  /  __/ | / /  __/>  < | | \__/|_||_|
     \/ \___|_|/___|\___|_/\_\_|

EOF
echo -e "${NC}"

echo "🐺 One Night Ultimate Werewolf - Docker Deployment"
echo "=================================================="
echo ""

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    print_error "Docker is not installed!"
    echo ""
    echo "Please install Docker first:"
    echo "  macOS:   brew install --cask docker"
    echo "  Linux:   curl -fsSL https://get.docker.com | sh"
    echo "  Windows: https://www.docker.com/products/docker-desktop"
    echo ""
    exit 1
fi

print_success "Docker is installed"

# Check if Docker Compose is available
if ! docker compose version &> /dev/null; then
    print_warning "Docker Compose V2 not found, trying V1..."
    if ! command -v docker-compose &> /dev/null; then
        print_error "Docker Compose is not available!"
        echo "Please install Docker Compose"
        exit 1
    else
        COMPOSE_CMD="docker-compose"
    fi
else
    COMPOSE_CMD="docker compose"
fi

print_success "Docker Compose is available"
echo ""

# Ask user what they want to do
echo "What would you like to do?"
echo "  1) Build and start the game"
echo "  2) Stop the game"
echo "  3) View logs"
echo "  4) Restart the game"
echo "  5) Clean up (remove containers and images)"
echo "  6) Check status"
echo ""
read -p "Enter your choice (1-6): " choice

case $choice in
    1)
        print_info "Building Docker image..."
        $COMPOSE_CMD build

        print_info "Starting container..."
        $COMPOSE_CMD up -d

        echo ""
        print_success "Deployment complete!"
        echo ""
        echo "🌐 Access the game at:"
        echo "   Local:   http://localhost:8000"
        echo "   Network: http://$(hostname -I | awk '{print $1}'):8000"
        echo ""
        echo "📋 View logs: $COMPOSE_CMD logs -f"
        echo "🛑 Stop:      $COMPOSE_CMD down"
        ;;

    2)
        print_info "Stopping container..."
        $COMPOSE_CMD down
        print_success "Container stopped"
        ;;

    3)
        print_info "Viewing logs (Ctrl+C to exit)..."
        $COMPOSE_CMD logs -f
        ;;

    4)
        print_info "Restarting container..."
        $COMPOSE_CMD restart
        print_success "Container restarted"
        ;;

    5)
        read -p "Are you sure you want to remove everything? (y/N): " confirm
        if [[ $confirm == [yY] || $confirm == [yY][eE][sS] ]]; then
            print_info "Cleaning up..."
            $COMPOSE_CMD down --rmi all --volumes
            print_success "Cleanup complete"
        else
            print_info "Cancelled"
        fi
        ;;

    6)
        print_info "Container status:"
        docker ps --filter name=werewolf-game --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"

        echo ""
        print_info "Health check:"
        if docker inspect werewolf-game &>/dev/null; then
            docker inspect werewolf-game | grep -A 10 '"Health"' || echo "Health check not available"
        else
            print_warning "Container not running"
        fi
        ;;

    *)
        print_error "Invalid choice"
        exit 1
        ;;
esac

echo ""
