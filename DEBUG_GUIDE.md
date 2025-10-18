# 🔍 Debugging Guide - Auto-Advance Not Working

## I've Added Comprehensive Logging

I've added detailed console logging throughout the async flow to help us identify exactly where the game is getting stuck.

## How to Debug

### Step 1: Open Browser Console

**Mac:**
- Chrome/Edge: `Cmd + Option + J`
- Safari: `Cmd + Option + C`
- Firefox: `Cmd + Option + K`

**Windows:**
- `F12` or `Ctrl + Shift + J`

### Step 2: Hard Refresh

Clear the cache completely:
- **Mac:** `Cmd + Shift + R`
- **Windows:** `Ctrl + Shift + R`

### Step 3: Start a New Game

1. Create a game
2. Add 6+ bots
3. Start the game

### Step 4: Watch the Console

You should see logs like this:

```
🌙 Starting sequential night phase
Night roles: (6) ['Werewolf', 'Minion', 'Seer', 'Robber', 'Drunk', 'Insomniac']

--- Processing role: Werewolf ---
Players with Werewolf: 1
Is my turn (YourName)? true
⏳ Performing Werewolf action...
🎬 performNightAction called for Werewolf (action: view_werewolves)
📞 Calling handleWerewolfAction
🐺 handleWerewolfAction START
⏳ Waiting 6 seconds...
```

### Step 5: Identify Where It Stops

**Watch for which message appears LAST** - this tells us where it's stuck:

#### If it stops at "Waiting X seconds..."
- The `wait()` function is not completing
- Possible issue with setTimeout

#### If it stops at "Executing bot night actions..."
- The bot manager is hanging
- Check `executeBotNightActions()` function

#### If it stops after a handler returns but before "performNightAction complete"
- There's an issue with the async return

#### If you see an ERROR message (❌)
- An exception was thrown
- **Copy the full error message and stack trace**

## What to Look For

### Success Pattern:
```
🐺 handleWerewolfAction START
⏳ Waiting 6 seconds...
✅ 6 second wait complete
⏳ Executing bot night actions...
✅ Bot actions complete
🐺 handleWerewolfAction END
✅ handleWerewolfAction returned
🏁 performNightAction complete for Werewolf
✅ Completed Werewolf action

--- Processing role: Minion ---
```

### Failure Pattern (Example):
```
🐺 handleWerewolfAction START
⏳ Waiting 6 seconds...
[STUCK HERE - never shows "6 second wait complete"]
```

## Common Issues and Solutions

### Issue 1: "Waiting X seconds..." Never Completes

**Cause:** `wait()` function not working

**Check:** Is the `wait()` function defined?
```javascript
async function wait(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
```

### Issue 2: Stops at "Executing bot night actions..."

**Cause:** `executeBotNightActions()` is hanging

**Solution:** Check if bot manager has errors

### Issue 3: ERROR shown in console

**Cause:** Exception thrown

**Action:** Copy the full error and stack trace - this will tell us exactly what's wrong

### Issue 4: No logs appear at all

**Cause:** JavaScript file not loading or old cache

**Solution:**
1. Hard refresh again
2. Check Network tab to see if game.js loaded
3. Clear all browser cache

## Please Send Me

Once you've run through this, please send me:

1. **The LAST log message** that appeared (where it got stuck)
2. **Any ERROR messages** (the full text)
3. **Which role you were** when it got stuck
4. **A screenshot of the console** if possible

This will help me pinpoint exactly where the issue is!

## Quick Test

Try this simple test:

1. Open browser console
2. Type: `await new Promise(r => setTimeout(r, 1000))`
3. Press Enter
4. Wait 1 second

If this doesn't work, there might be a browser compatibility issue with async/await.

## Browser Compatibility

Make sure you're using a modern browser:
- ✅ Chrome 55+
- ✅ Edge 15+
- ✅ Firefox 52+
- ✅ Safari 11+

Older browsers don't support async/await properly.
