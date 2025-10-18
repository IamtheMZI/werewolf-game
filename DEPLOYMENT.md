# 🐳 Werewolf Game - Docker Deployment Guide

This guide explains how to deploy the One Night Ultimate Werewolf game using Docker.

## 📋 Prerequisites

- Docker installed (version 20.10 or later)
- Docker Compose installed (version 2.0 or later)

### Install Docker

**macOS:**
```bash
brew install --cask docker
```

**Ubuntu/Debian:**
```bash
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh
```

**Windows:**
Download from [Docker Desktop](https://www.docker.com/products/docker-desktop)

---

## 🚀 Quick Start

### Option 1: Using Docker Compose (Recommended)

```bash
# Build and start the container
docker-compose up -d

# View logs
docker-compose logs -f

# Stop the container
docker-compose down
```

The game will be available at:
- **Local:** http://localhost:8000
- **Network:** http://YOUR_IP:8000

### Option 2: Using Docker CLI

```bash
# Build the image
docker build -t werewolf-game:latest .

# Run the container
docker run -d \
  --name werewolf-game \
  -p 8000:80 \
  --restart unless-stopped \
  werewolf-game:latest

# View logs
docker logs -f werewolf-game

# Stop the container
docker stop werewolf-game
docker rm werewolf-game
```

---

## 🔧 Configuration

### Change Port

Edit `docker-compose.yml`:
```yaml
ports:
  - "3000:80"  # Change 3000 to your desired port
```

Or with Docker CLI:
```bash
docker run -d -p 3000:80 werewolf-game:latest
```

### Environment Variables

You can add environment variables in `docker-compose.yml`:
```yaml
environment:
  - TZ=America/New_York  # Set timezone
  - NODE_ENV=production
```

---

## 📊 Management Commands

### View Logs
```bash
# Docker Compose
docker-compose logs -f werewolf-game

# Docker CLI
docker logs -f werewolf-game
```

### Restart Container
```bash
# Docker Compose
docker-compose restart

# Docker CLI
docker restart werewolf-game
```

### Update Application
```bash
# Rebuild and restart
docker-compose up -d --build

# Or with Docker CLI
docker build -t werewolf-game:latest .
docker stop werewolf-game
docker rm werewolf-game
docker run -d -p 8000:80 --name werewolf-game werewolf-game:latest
```

### Check Container Health
```bash
docker ps
docker inspect werewolf-game | grep -A 10 Health
```

### Access Container Shell
```bash
docker exec -it werewolf-game sh
```

---

## 🌐 Production Deployment

### Deploy to Cloud Provider

#### **DigitalOcean / Linode / Vultr**

1. Create a Droplet/VPS with Docker installed
2. SSH into your server:
   ```bash
   ssh root@YOUR_SERVER_IP
   ```

3. Clone or upload your files:
   ```bash
   git clone YOUR_REPO_URL
   cd Werewolf
   ```

4. Run with Docker Compose:
   ```bash
   docker-compose up -d
   ```

5. Access at: `http://YOUR_SERVER_IP:8000`

#### **AWS ECS / Google Cloud Run / Azure Container Instances**

Push image to registry:
```bash
# Tag image
docker tag werewolf-game:latest YOUR_REGISTRY/werewolf-game:latest

# Push to registry
docker push YOUR_REGISTRY/werewolf-game:latest
```

Then deploy using your cloud provider's container service.

#### **Heroku**

```bash
# Install Heroku CLI
brew install heroku/brew/heroku

# Login
heroku login

# Create app
heroku create werewolf-game-app

# Set stack to container
heroku stack:set container

# Create heroku.yml
echo "build:
  docker:
    web: Dockerfile
run:
  web: nginx -g 'daemon off;'" > heroku.yml

# Deploy
git add .
git commit -m "Add Docker support"
git push heroku main
```

---

## 🔒 Security Best Practices

### 1. Use HTTPS (Recommended for Production)

Add a reverse proxy like Nginx or Traefik with Let's Encrypt:

**docker-compose.yml with Traefik:**
```yaml
version: '3.8'

services:
  traefik:
    image: traefik:v2.10
    command:
      - "--providers.docker=true"
      - "--entrypoints.web.address=:80"
      - "--entrypoints.websecure.address=:443"
      - "--certificatesresolvers.myresolver.acme.tlschallenge=true"
      - "--certificatesresolvers.myresolver.acme.email=your-email@example.com"
      - "--certificatesresolvers.myresolver.acme.storage=/letsencrypt/acme.json"
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - "/var/run/docker.sock:/var/run/docker.sock:ro"
      - "./letsencrypt:/letsencrypt"

  werewolf-game:
    build: .
    labels:
      - "traefik.enable=true"
      - "traefik.http.routers.werewolf.rule=Host(`yourdomain.com`)"
      - "traefik.http.routers.werewolf.entrypoints=websecure"
      - "traefik.http.routers.werewolf.tls.certresolver=myresolver"
```

### 2. Limit Resources

```yaml
services:
  werewolf-game:
    deploy:
      resources:
        limits:
          cpus: '0.5'
          memory: 512M
        reservations:
          cpus: '0.25'
          memory: 256M
```

### 3. Run as Non-Root User

Already configured in the Nginx Alpine image.

---

## 📈 Monitoring

### View Resource Usage
```bash
docker stats werewolf-game
```

### Setup Health Monitoring

The container includes a built-in health check that runs every 30 seconds.

---

## 🐛 Troubleshooting

### Container Won't Start
```bash
# Check logs
docker logs werewolf-game

# Check if port is already in use
lsof -ti:8000
```

### Port Already in Use
```bash
# Kill process on port 8000
lsof -ti:8000 | xargs kill -9

# Or change port in docker-compose.yml
ports:
  - "9000:80"
```

### Permission Denied
```bash
# Run with sudo (Linux)
sudo docker-compose up -d

# Or add user to docker group
sudo usermod -aG docker $USER
newgrp docker
```

### Container Keeps Restarting
```bash
# Check health status
docker inspect werewolf-game | grep -A 10 Health

# View last 100 lines of logs
docker logs --tail 100 werewolf-game
```

---

## 🔄 CI/CD Integration

### GitHub Actions Example

Create `.github/workflows/deploy.yml`:
```yaml
name: Deploy to Docker

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3

      - name: Build Docker image
        run: docker build -t werewolf-game .

      - name: Deploy to server
        run: |
          # Add your deployment script here
          # e.g., push to registry, deploy to cloud
```

---

## 📦 Image Size Optimization

Current image size: ~25MB (Alpine-based)

To further optimize:
```bash
# Check image size
docker images werewolf-game

# Remove unused layers
docker image prune
```

---

## 🎮 Testing the Deployment

After deployment:

1. **Health Check:** Visit `http://YOUR_IP:8000`
2. **Create Game:** Test game creation
3. **Join Game:** Open multiple tabs to test multiplayer
4. **Add Bots:** Test bot player feature
5. **Play Game:** Complete a full game cycle

---

## 📞 Support

If you encounter issues:
1. Check the logs: `docker-compose logs -f`
2. Verify health: `docker ps`
3. Test locally first before deploying to production

---

## 🎉 Success!

Your Werewolf game is now containerized and ready for deployment anywhere Docker runs!

**Access the game:**
- Local: http://localhost:8000
- Network: http://YOUR_IP:8000
- Production: http://yourdomain.com (with proper DNS setup)
