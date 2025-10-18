# 🚀 Quick Start Guide

Get your Werewolf game running in 60 seconds!

## ⚡ Fastest Way to Test (Single Device)

```bash
# 1. Start a local server
python3 -m http.server 8000

# 2. Open browser
open http://localhost:8000

# 3. Play!
# - Create a game
# - Open 2 more incognito windows
# - Join with the room code
# - Start playing!
```

## 📱 Multi-Device Testing (Same Network)

```bash
# 1. Start server
python3 -m http.server 8000

# 2. Find your IP
ifconfig | grep inet   # Mac/Linux
ipconfig               # Windows

# 3. On other devices
# Visit: http://YOUR_IP:8000
# Example: http://192.168.1.100:8000

# 4. Join the same room code!
```

## 🎮 Basic Gameplay Flow

1. **Host Creates Game**
   - Click "Create New Game"
   - Share the 6-character room code

2. **Players Join**
   - Enter room code
   - Enter your name
   - Wait in lobby

3. **Host Configures & Starts**
   - Select roles (min 3 players)
   - Set discussion time
   - Click "Start Game"

4. **Night Phase**
   - Everyone sees their role privately
   - Follow prompts for your role's action
   - Werewolves see each other
   - Seer views cards
   - Robber swaps cards
   - Etc.

5. **Day Phase**
   - Discuss who you think is a werewolf
   - Use voice/video chat externally
   - Timer counts down

6. **Vote**
   - Vote to eliminate a player
   - Most votes = eliminated

7. **Results**
   - See all final roles
   - Winner announced!

## 🎭 Role Quick Reference

| Role | Action | Team |
|------|--------|------|
| 🐺 Werewolf | See other werewolves | Werewolf |
| 😈 Minion | See werewolves | Werewolf |
| 🔮 Seer | View 1 player OR 2 center cards | Village |
| 🔄 Robber | Swap with player & see new role | Village |
| 😴 Drunk | Blind swap with center | Village |
| 🧝 Insomniac | Check if you were swapped | Village |
| 😇 Villager | No action | Village |
| 🃏 Tanner | No action (wants to die) | Neutral |

## 🏆 Win Conditions

- **Village Wins** = Eliminate at least 1 werewolf
- **Werewolf Wins** = No werewolves eliminated
- **Tanner Wins** = Tanner gets eliminated (everyone else loses)

## 💡 Pro Tips

1. **Werewolves**: Claim you're a villager or another role
2. **Seer**: Share what you saw (or lie!)
3. **Robber**: You might be a werewolf now!
4. **Minion**: Protect your werewolves
5. **Tanner**: Act suspicious to get voted out
6. **Everyone**: Bluffing is key!

## 🐛 Troubleshooting

**Can't join game?**
- Check room code (case-sensitive)
- Make sure game hasn't started
- Try: `localStorage.clear()` in console

**Not seeing updates?**
- Refresh the page
- This version uses localStorage (no real-time sync)
- Use multiple browser windows on same device

**Game stuck?**
- Check browser console (F12)
- Complete your night action
- Click "Skip" if available

## 📚 More Info

- **Full Testing Guide**: See `TESTING_GUIDE.md`
- **Project Details**: Open `PROJECT_PLAN.html`
- **Setup Instructions**: See `README.md`

## 🎉 That's It!

You're ready to play Werewolf! Gather your friends and start lying! 🐺

---

**Need Help?** Check the full documentation or open `PROJECT_PLAN.html` in your browser.