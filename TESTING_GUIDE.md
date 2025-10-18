# 🧪 Testing Guide - Werewolf Game

This guide will help you test the Werewolf game on your local machine.

## 🚀 Quick Start

### Option 1: Direct Browser Testing (Single Player/UI Testing)

1. **Open the game:**
   ```bash
   open index.html
   # Or double-click index.html in your file browser
   ```

2. **Create a game:**
   - Click "Create New Game"
   - Note the room code (e.g., "ABC123")
   - You'll be redirected to the lobby

3. **Test the flow:**
   - The lobby will show you as "Host"
   - You can adjust game settings (discussion time, roles)
   - Since you need 3+ players, you'll need to simulate more players (see below)

### Option 2: Local Server Testing (Recommended for Multi-Device)

1. **Start a local server:**
   ```bash
   # Using Python 3 (recommended)
   python3 -m http.server 8000

   # Or using Node.js
   npx http-server -p 8000

   # Or using PHP
   php -S localhost:8000
   ```

2. **Access the game:**
   - Open `http://localhost:8000` in your browser
   - Create a game and note the room code

3. **Test with multiple devices:**
   - Find your local IP address:
     - Mac/Linux: `ifconfig | grep inet`
     - Windows: `ipconfig`
   - On other devices on the same network, visit: `http://YOUR_IP:8000`
   - Join the game using the room code

## 🎮 Testing Game Flow

### Test 1: Creating and Joining a Game

1. **Create a game (Browser 1 / Incognito Window 1):**
   - Go to `index.html`
   - Click "Create New Game"
   - You'll be assigned as Host
   - Copy the room code (e.g., "XYZ789")

2. **Join the game (Browser 2 / Incognito Window 2):**
   - Open a new incognito/private window
   - Go to `index.html`
   - Enter the room code
   - Enter your name (e.g., "Player 2")
   - Click "Join Game"

3. **Add a third player (Browser 3 / Incognito Window 3):**
   - Repeat step 2 with a different name

### Test 2: Lobby Features

**In the host's browser:**
- ✅ Host badge should be visible
- ✅ Player count should update (showing 1, 2, 3, etc.)
- ✅ Game settings should be visible
- ✅ Discussion time slider should work
- ✅ Role checkboxes should toggle
- ✅ Start button should be disabled until 3+ players
- ✅ Copy room code button should work

**In player browsers:**
- ✅ Should see all players in the lobby
- ✅ Should see "You" label on their own card
- ✅ Should NOT see game settings (host only)
- ✅ Should NOT see start button

### Test 3: Role Assignment & Game Start

**As host:**
1. Configure roles in the lobby:
   - Select/deselect roles
   - Adjust discussion time
2. Click "Start Game" when 3+ players are ready
3. Verify redirection to game.html

**All players:**
- ✅ Should be redirected to game page
- ✅ Should see their assigned role card
- ✅ Role card should show emoji, name, team, and description
- ✅ After 5 seconds, night phase should begin

### Test 4: Night Phase Actions

Test each role's night action:

#### Werewolf 🐺
- ✅ Should see prompt "Look for other werewolves"
- ✅ Can tap other werewolf players to reveal them
- ✅ Shows message if no other werewolves exist
- ✅ Click "Done" to proceed

#### Minion 😈
- ✅ Should see prompt "See who the werewolves are"
- ✅ Can tap werewolf players to reveal them
- ✅ Werewolves don't see the minion
- ✅ Click "Done" to proceed

#### Seer 🔮
- ✅ Should see prompt "Choose: View ONE player card OR TWO center cards"
- ✅ Can select one player card
- ✅ OR can select two center cards
- ✅ Click "Confirm" to view selected cards
- ✅ Reveals role after confirmation

#### Robber 🔄
- ✅ Should see prompt "Choose a player to swap cards with"
- ✅ Can select one player
- ✅ Click "Confirm" to swap
- ✅ New role is revealed after swap
- ✅ Can skip action

#### Drunk 😴
- ✅ Should see prompt "Choose a center card to swap with"
- ✅ Can select one center card
- ✅ Click "Confirm" to swap
- ✅ Does NOT see new role (blind swap)
- ✅ Can skip action

#### Insomniac 🧝
- ✅ Should see prompt at end of night
- ✅ Shows current role
- ✅ Indicates if card was swapped or not
- ✅ Click "Continue" to proceed

#### Villager 😇
- ✅ Should see "You have no night action"
- ✅ Waits while others perform actions
- ✅ Automatically proceeds to day phase

### Test 5: Day Phase - Discussion

**All players:**
- ✅ Phase changes to "Day Phase - Discussion"
- ✅ Sun icon (☀️) displays
- ✅ Timer counts down from configured time
- ✅ All players are visible in the grid
- ✅ "You" label on your own card
- ✅ Message: "Discuss and figure out who the werewolves are!"

**During discussion:**
- Players should discuss (this is manual/voice chat in v1.0)
- Share information about what they saw during night
- Try to deduce who the werewolves are

### Test 6: Voting Phase

**When timer reaches 0:**
- ✅ Automatic transition to voting
- ✅ Phase changes to "Voting Time"
- ✅ Vote icon (🗳️) displays
- ✅ All players shown as vote options
- ✅ Click a player to vote
- ✅ Confirmation dialog appears
- ✅ After confirming, vote is cast
- ✅ All options become disabled
- ✅ "Vote cast!" message appears

### Test 7: Results Phase

**After all votes are cast:**
- ✅ Phase changes to "Game Over"
- ✅ Party icon (🎊) displays
- ✅ Shows eliminated player(s) with most votes
- ✅ Reveals all final roles for all players
- ✅ Shows role emoji, name, and team color
- ✅ Winner announcement displays:
  - "Village Team Wins!" if werewolf eliminated
  - "Werewolf Team Wins!" if no werewolf eliminated
  - "Tanner Wins!" if tanner was eliminated

### Test 8: Win Conditions

**Scenario 1: Village Wins**
- Werewolf is voted out
- ✅ Shows "😇 Village Team Wins!"

**Scenario 2: Werewolf Wins**
- No werewolf is voted out
- ✅ Shows "🐺 Werewolf Team Wins!"

**Scenario 3: Tanner Wins**
- Tanner is voted out
- ✅ Shows "🃏 Tanner Wins! Everyone else loses."

## 🐛 Known Limitations (v1.0)

### Current Implementation
- **Local Storage Only**: Uses localStorage instead of WebSocket
- **No Cross-Device Sync**: Players on different devices won't see real-time updates
- **Simulated Multiplayer**: Best tested with multiple browser windows/incognito tabs
- **No Voice Chat**: Players must use external communication (Discord, phone, etc.)
- **Manual Refresh**: Changes don't sync automatically without page refresh

### Workarounds for Testing

#### Testing Solo (Single Device)
1. Open multiple incognito/private windows
2. Each window = one player
3. Create game in Window 1
4. Join with same room code in Windows 2-3
5. Use Window 1 (host) to start the game

#### Testing Multi-Device (Same Network)
1. Start local server: `python3 -m http.server 8000`
2. Find your IP: `ifconfig | grep inet`
3. On other devices: visit `http://YOUR_IP:8000`
4. Create game on Device 1, join on Devices 2-3
5. **Note**: Won't see real-time updates; may need manual refresh

## ✅ Testing Checklist

- [ ] Landing page loads correctly
- [ ] Can create a game and get room code
- [ ] Can join a game with valid room code
- [ ] Invalid room codes show error
- [ ] Lobby shows all players
- [ ] Host can configure settings
- [ ] Start button disabled until 3+ players
- [ ] Game starts and assigns roles
- [ ] Each player sees their own role privately
- [ ] Night phase actions work for each role
- [ ] Werewolves can see each other
- [ ] Minion sees werewolves
- [ ] Seer can view cards
- [ ] Robber can swap and see new role
- [ ] Drunk swaps blindly
- [ ] Insomniac checks if swapped
- [ ] Day phase discussion timer works
- [ ] Voting interface appears after timer
- [ ] Can vote for a player
- [ ] Results show eliminated player(s)
- [ ] Final roles reveal for all players
- [ ] Winner is determined correctly
- [ ] Responsive design works on mobile
- [ ] All buttons and interactions work
- [ ] No console errors

## 🔧 Troubleshooting

### Issue: "Room not found"
- **Solution**: Make sure you're using the exact room code
- **Solution**: Create the game first, then join from other windows
- **Solution**: Check that localStorage is enabled in your browser

### Issue: Can't join game
- **Solution**: Room codes are case-sensitive (use uppercase)
- **Solution**: Make sure the game hasn't already started
- **Solution**: Clear localStorage and try again: `localStorage.clear()`

### Issue: Game doesn't start
- **Solution**: Need at least 3 players minimum
- **Solution**: Make sure you're the host (only host can start)
- **Solution**: Check that all players are in the lobby

### Issue: Not seeing other players' updates
- **Solution**: This is expected in v1.0 (localStorage only)
- **Solution**: Refresh the page to see updates
- **Solution**: Use multiple browser windows on same device for testing

### Issue: Night phase stuck
- **Solution**: Each player must complete their action
- **Solution**: Click "Skip" or "Done" to proceed
- **Solution**: Check browser console for errors (F12)

## 📝 Test Report Template

```
# Werewolf Game Test Report

**Date:** [Date]
**Tester:** [Your Name]
**Environment:** [Browser/Device]

## Test Results

### ✅ Passed Tests
- [ ] Landing page
- [ ] Game creation
- [ ] Joining game
- [ ] Lobby functionality
- [ ] Role assignment
- [ ] Night phase actions
- [ ] Day phase discussion
- [ ] Voting
- [ ] Results

### ❌ Failed Tests
- Issue 1: [Description]
- Issue 2: [Description]

### 🐛 Bugs Found
1. [Bug description]
2. [Bug description]

### 💡 Suggestions
- [Improvement idea]
- [Feature request]
```

## 🎯 Next Steps for Full Multiplayer

To enable true cross-device multiplayer, the next version will need:
1. WebSocket server implementation
2. Real-time state synchronization
3. Server-side game logic validation
4. Persistent sessions
5. Reconnection handling

See README.md and PROJECT_PLAN.html for roadmap details.

---

**Happy Testing! 🐺🌙**