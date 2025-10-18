# 🤖 Bot Player Feature

## ✨ New Feature: Add Bot Players!

You can now add AI bot players to your game! No more need to open multiple browser windows.

## 🎮 How to Use

### In the Lobby (Host Only):

1. **Create your game** as usual
2. You'll see a new green button: **"🤖 Add Bot Player"**
3. Click it to add bot players one at a time
4. Add up to 9 bots (max 10 players total)
5. Bot players appear in the lobby with a 🤖 icon
6. When you have 3+ players (including bots), click **"Start Game"**

### During the Game:

**Bots automatically:**
- ✅ Perform night actions based on their role
- ✅ Make strategic decisions (Seer views cards, Robber swaps, etc.)
- ✅ Vote during the voting phase
- ✅ Follow game rules correctly

## 🧠 Bot AI Features

### Smart Decision Making:

**🔮 Seer Bot:**
- 60% chance to view another player's card
- 40% chance to view two center cards

**🔄 Robber Bot:**
- Randomly swaps with another player
- Sees their new role

**😴 Drunk Bot:**
- Randomly swaps with a center card
- Doesn't see new role (blind swap)

**🐺 Werewolf Bot:**
- Tries to vote out non-werewolves
- Protects werewolf teammates

**😈 Minion Bot:**
- Protects werewolves
- Votes strategically for village team

**Village Bots:**
- Vote randomly but strategically
- Try to eliminate suspicious players

## 💡 Tips

1. **Quick Testing:** Add 7 bots instantly for an 8-player game
2. **Mixed Games:** Add some bots + invite real friends
3. **Solo Practice:** Play against 7 bots to learn strategies
4. **Bot Names:** Randomly chosen from: Alice, Bob, Charlie, Diana, Eve, Frank, Grace, etc.

## 🎯 Example Usage

**Solo Testing (8 Players):**
```
1. Open http://localhost:8000
2. Click "Create New Game"
3. Click "🤖 Add Bot Player" 7 times
4. Click "Start Game"
5. Play against the bots!
```

**Mixed Game (You + 4 Friends + 3 Bots):**
```
1. You + 4 friends join the lobby (5 players)
2. Host clicks "🤖 Add Bot Player" 3 times
3. Now you have 8 players total
4. Start and play!
```

## ⚙️ Technical Details

- Bots use localStorage like human players
- Bot decisions have random thinking time (1-3 seconds)
- Bots make role-appropriate strategic choices
- Bot voting considers their role and team
- Bots are saved in session state

## 🚀 Benefits

✅ **No more multiple windows** - Test with one browser tab
✅ **Instant lobbies** - Don't wait for friends
✅ **Learn strategies** - Practice against AI
✅ **Fill gaps** - Need 1-2 more players? Add bots!
✅ **Always available** - Play anytime, even solo

## 🎉 Ready to Use!

The bot feature is fully integrated and ready to use. Just refresh your lobby page and you'll see the new "🤖 Add Bot Player" button (host only).

**Your current game:** Room Y8BQMH
Just refresh the page to see the new bot button! 🎮

---

## 🆕 Latest Game Improvements

### Sequential Night Actions
- Night actions now happen **one role at a time** in proper order
- Other players see which role is currently acting (e.g., "🔮 Seer is acting...")
- No more confusion about when to act!

### "Done Discussion" Button
- Click **"✅ I'm Ready to Vote"** when you're done discussing
- See real-time count: "5 / 8 players ready"
- When everyone is ready, voting starts immediately
- No need to wait for the full timer!
- Bots automatically mark themselves as ready after 10-30 seconds

### Timer Fix
- Timer now works correctly **even when you switch tabs**
- No more timer freezing or running slow
- Uses timestamps instead of countdown for accuracy

---

**Note:** Bots are designed for testing and practice. They make simple strategic decisions but are not as unpredictable as human players!