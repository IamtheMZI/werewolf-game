# 🐺 Werewolf - Online Card Game

A Jackbox-style multiplayer **One Night Ultimate Werewolf** game for the web. Play with 3-10 friends using any device with a browser!

## 📋 Features

- **🎮 Session-Based Gameplay** - Create or join game rooms with unique codes
- **👥 Multiplayer Support** - 3-10 players per game
- **🤖 Bot Players** - Add AI players to fill lobbies (up to 9 bots)
- **🎭 Multiple Roles** - Werewolf, Seer, Robber, Drunk, Minion, Tanner, and more
- **🌙 Sequential Night Phase** - Roles act one at a time with clear indicators
- **☀️ Discussion & Voting** - Timed discussion with "Done" button to skip ahead
- **⏱️ Tab-Independent Timer** - Timer works correctly even when tab is inactive
- **📱 Mobile-Friendly** - Responsive design works on phones, tablets, and desktops
- **🎨 Beautiful UI** - Modern gradient design with smooth animations
- **🐳 Docker Ready** - One-command deployment with Docker/Docker Compose

## 🚀 Quick Start

### Option 1: 🐳 Docker (Easiest - Recommended for Production)

Perfect for production deployment with one command:

```bash
# Quick start (if Docker is installed)
docker-compose up -d

# Or use the build script
./build-docker.sh

# Or use Make commands
make deploy
```

Access at `http://localhost:8000`

📖 **Full deployment guide:** See [DOCKER_DEPLOYMENT_GUIDE.md](./DOCKER_DEPLOYMENT_GUIDE.md) for:
- Installing Docker Desktop
- Building and running locally
- **FREE hosting options** (Render, Railway, Fly.io, Koyeb)
- Complete step-by-step deployment instructions

### Option 2: Local Development (No Server)

For single-device testing and development:

1. **Clone/Download** this repository
2. **Open** `index.html` in your web browser
3. **Play** - Create a game or join with a room code

This mode uses localStorage and is perfect for UI testing and single-player development.

### Option 3: With Local Server

For testing with multiple devices on the same network:

1. **Start a simple HTTP server:**
   ```bash
   # Using Python 3
   python3 -m http.server 8000

   # Using Node.js
   npx http-server -p 8000
   ```

2. **Access the game:**
   - Local: `http://localhost:8000`
   - Network: `http://YOUR_LOCAL_IP:8000`

3. **Find your local IP:**
   - **Mac/Linux:** `ifconfig | grep inet`
   - **Windows:** `ipconfig`

## 📁 Project Structure

```
Werewolf/
├── index.html              # Landing page (create/join game)
├── lobby.html              # Game lobby/waiting room
├── game.html               # Main game interface
├── PROJECT_PLAN.html       # Detailed project plan & progress
├── IMAGE_SOURCES.md        # Card image resources
├── README.md               # This file
│
├── css/
│   ├── main.css           # Global styles
│   ├── lobby.css          # Lobby-specific styles
│   └── game.css           # Game interface styles
│
├── js/
│   ├── main.js            # Landing page logic
│   ├── lobby.js           # Lobby functionality (planned)
│   ├── game.js            # Game state management (planned)
│   ├── roles.js           # Role definitions & logic
│   └── websocket.js       # Real-time communication (planned)
│
├── images/
│   └── cards/             # Role card images (download separately)
│
└── server/                # Backend server (planned)
    ├── server.js          # Node.js server
    ├── gameManager.js     # Game logic
    └── socketHandler.js   # WebSocket events
```

## 🎮 How to Play

### Game Setup

1. **Host creates a game** - Generate a unique 6-character room code
2. **Players join** - Enter the room code and their name
3. **Host configures** - Select roles and settings
4. **Start game** - Host begins when all players are ready

### Game Phases

#### 1️⃣ **Role Assignment**
- Each player receives a secret role
- 3 cards remain in the center (unused)
- View your role card privately

#### 2️⃣ **Night Phase**
Roles act in sequence based on prompts:
- **Werewolves** - Wake to see each other
- **Minion** - Sees werewolves (they don't see minion)
- **Seer** - View 1 player card OR 2 center cards
- **Robber** - Swap card with a player and view new role
- **Drunk** - Swap card with center (blind swap)
- **Insomniac** - Check if your card was swapped

#### 3️⃣ **Day Phase**
- All players wake up
- Discussion time (configurable, default 5 minutes)
- Share information, bluff, and deduce roles
- Figure out who the werewolves are

#### 4️⃣ **Voting**
- Each player votes for one person to eliminate
- Player(s) with most votes are eliminated
- No ties - multiple eliminations possible

#### 5️⃣ **Results**
- All roles are revealed
- Winners determined by team objectives:
  - **Village wins** if at least one werewolf is eliminated
  - **Werewolves win** if no werewolves are eliminated
  - **Tanner wins** if Tanner is eliminated (everyone else loses)

## 🎭 Roles Explained

| Role | Team | Night Action | Goal |
|------|------|--------------|------|
| 🐺 **Werewolf** | Werewolf | See other werewolves | Don't get voted out |
| 🌙 **Dream Wolf** | Werewolf | None (sleeps) | Don't get voted out |
| 😈 **Minion** | Werewolf | See werewolves | Help werewolves win |
| 🔮 **Seer** | Village | View 1 player OR 2 center | Find werewolves |
| 🔄 **Robber** | Village → ? | Swap with player, view new role | Win with new team |
| 😴 **Drunk** | Village → ? | Swap with center (blind) | Unknown |
| 🧝 **Insomniac** | Village | Check if swapped | Find werewolves |
| 😇 **Villager** | Village | None | Find werewolves |
| 🃏 **Tanner** | Neutral | None | Get voted out |

## 🛠️ Development Status

### ✅ Completed
- [x] Project structure and file organization
- [x] HTML templates for all pages
- [x] CSS styling with responsive design
- [x] Role definitions and logic system
- [x] Landing page with create/join functionality
- [x] Card image resource research

### 🚧 In Progress
- [ ] Lobby system with real-time player list
- [ ] Session management (localStorage → WebSocket)
- [ ] Night phase interactive mechanics
- [ ] Day phase discussion and voting
- [ ] Win condition logic and results screen

### 📅 Planned
- [ ] WebSocket server for true multiplayer
- [ ] Sound effects and animations
- [ ] Additional roles (Mason, Hunter, Troublemaker)
- [ ] Game history and statistics
- [ ] Custom role configurations
- [ ] Accessibility improvements

## 🖼️ Adding Card Images

Card images are not included in this repository. To add them:

1. **Download images** from resources listed in `IMAGE_SOURCES.md`
2. **Place images** in the `images/cards/` directory
3. **Name files** using the format: `role-name.png` (e.g., `werewolf.png`, `seer.png`)
4. **Recommended specs:**
   - Format: PNG with transparency
   - Size: 400x600px (2:3 aspect ratio)
   - File size: < 200KB each

See `IMAGE_SOURCES.md` for download links and resources.

## 🤝 Contributing

This is a personal project, but suggestions and improvements are welcome!

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📜 License & Credits

**Game Design:** Based on "One Night Ultimate Werewolf" by Bezier Games
**Implementation:** Original web implementation
**License:** For personal/educational use only

All "One Night Ultimate Werewolf" artwork and branding © Bezier Games. This is a fan-made implementation for educational purposes.

## 🆕 Latest Updates

### Version 1.0.0 - Major Release
- ✅ **Bot Players** - AI players with role-appropriate strategies ([BOT_FEATURE.md](./BOT_FEATURE.md))
- ✅ **Sequential Night Actions** - Clear turn indicators showing which role is acting
- ✅ **Done Discussion Button** - Skip to voting when all players are ready
- ✅ **Fixed Timer Bug** - Timer now works correctly when switching tabs
- ✅ **Button Fix** - Resolved Insomniac and other night action button issues ([BUGFIX.md](./BUGFIX.md))
- ✅ **Docker Support** - Full containerization for easy deployment ([DEPLOYMENT.md](./DEPLOYMENT.md))

See [UPDATES.md](./UPDATES.md) for detailed technical changes.

## 🐛 Known Issues

- WebSocket multiplayer not yet implemented (using localStorage for state management)
- No persistent game state across page refreshes (by design - fresh game each time)

## 📞 Support

For issues, questions, or feedback:
- Check `PROJECT_PLAN.html` for detailed development roadmap
- Review documentation in code comments
- Open an issue on GitHub

## 🎯 Roadmap

**v1.0** - Core Gameplay (Current)
- Basic roles and mechanics
- Local multiplayer support
- Complete game flow

**v2.0** - Enhanced Multiplayer
- WebSocket server
- Cross-network play
- Room persistence

**v3.0** - Extended Features
- All official roles
- Custom game modes
- Player statistics
- Tournament mode

---

**Enjoy the game! 🐺🌙**