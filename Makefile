.PHONY: help build up down restart logs shell clean prune health stats

# Default target
help:
	@echo "🐺 Werewolf Game - Docker Commands"
	@echo ""
	@echo "Usage: make [target]"
	@echo ""
	@echo "Targets:"
	@echo "  build     - Build the Docker image"
	@echo "  up        - Start the container"
	@echo "  down      - Stop and remove the container"
	@echo "  restart   - Restart the container"
	@echo "  logs      - View container logs"
	@echo "  shell     - Access container shell"
	@echo "  health    - Check container health"
	@echo "  stats     - View resource usage"
	@echo "  clean     - Stop and remove container + image"
	@echo "  prune     - Remove all unused Docker resources"
	@echo ""

# Build the Docker image
build:
	@echo "🔨 Building Docker image..."
	docker-compose build

# Start the container
up:
	@echo "🚀 Starting container..."
	docker-compose up -d
	@echo "✅ Container started!"
	@echo "🌐 Access at: http://localhost:8000"

# Stop and remove the container
down:
	@echo "🛑 Stopping container..."
	docker-compose down

# Restart the container
restart:
	@echo "🔄 Restarting container..."
	docker-compose restart

# View logs
logs:
	@echo "📋 Viewing logs (Ctrl+C to exit)..."
	docker-compose logs -f

# Access container shell
shell:
	@echo "💻 Accessing container shell..."
	docker-compose exec werewolf-game sh

# Check health
health:
	@echo "🏥 Checking container health..."
	docker ps --filter name=werewolf-game --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"

# View resource usage
stats:
	@echo "📊 Resource usage (Ctrl+C to exit)..."
	docker stats werewolf-game

# Clean up everything
clean:
	@echo "🧹 Cleaning up..."
	docker-compose down --rmi all --volumes

# Prune unused resources
prune:
	@echo "🗑️  Removing unused Docker resources..."
	docker system prune -af

# Quick deploy (build + up)
deploy: build up
	@echo "🎉 Deployment complete!"
	@echo "🌐 Access at: http://localhost:8000"

# Update (rebuild and restart)
update:
	@echo "🔄 Updating application..."
	docker-compose up -d --build
	@echo "✅ Update complete!"
