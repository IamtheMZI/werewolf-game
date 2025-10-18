# Latest Updates

## Fix #1: Sequential Night Actions ✅

**Problem:** Night actions were happening simultaneously, making it confusing for players.

**Solution:**
- Implemented sequential night phase where roles act one at a time in order
- Players see a waiting screen showing which role is currently acting (e.g., "🔮 Seer is acting...")
- Each role gets their turn, then waits for the next role
- 8-second window per role while others wait

**Files Modified:**
- `js/game.js` - Rewrote night phase logic with `executeSequentialNightPhase()`
- All handler functions updated to work with Promise-based resolution

---

## Fix #2: Done Discussion Button ✅

**Problem:** Discussion timer continued even when all players were done talking.

**Solution:**
- Added "I'm Ready to Vote" button during discussion phase
- Shows real-time count of how many players are ready (e.g., "3 / 8 players ready")
- When all players click ready, timer is cancelled and voting starts immediately
- Bots automatically mark themselves as ready after 10-30 seconds

**Files Modified:**
- `game.html` - Added button and status display
- `css/game.css` - Added styling for new elements
- `js/game.js` - Added ready tracking and handlers

**Features:**
- Button disables after clicking and shows "You're Ready!"
- Real-time counter updates as each player marks ready
- Timer is cleared when everyone is ready
- Smooth transition to voting phase

---

## Fix #3: Timer Bug with Inactive Tabs ✅

**Problem:** Discussion timer would run slower or freeze when the browser tab was inactive due to browser throttling of `setInterval`.

**Solution:**
- Changed timer implementation to use timestamps instead of countdown
- Now calculates remaining time based on `Date.now()` vs stored end timestamp
- Timer displays accurate time even after returning to an inactive tab

**Files Modified:**
- `js/game.js` - Completely rewrote `startTimer()` function

**How It Works:**
```javascript
// Store end time as timestamp
timerEndTime = Date.now() + (seconds * 1000);

// Calculate remaining time based on current time
const remaining = Math.max(0, Math.floor((timerEndTime - now) / 1000));
```

This ensures the timer is always accurate regardless of browser tab state.

---

## All Features Working:
✅ Sequential night actions with visible role indicators
✅ "Done Discussion" button that ends phase when all ready
✅ Timer that works correctly even when tab is inactive
✅ Bot players automatically participate in all phases
✅ Smooth transitions between all game phases

## Next Steps:
- Test with multiple real players
- Consider adding visual indicators for which players are ready
- Potential future enhancement: Add chat functionality during discussion phase
