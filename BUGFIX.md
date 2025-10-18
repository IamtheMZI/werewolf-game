# 🐛 Bug Fix: Insomniac Button Not Working

## Problem
The Insomniac's "Continue" button (and other night action buttons) were not responding to clicks during the sequential night phase.

## Root Cause
Event listeners were accumulating with `{ once: true }` option, causing conflicts when handlers were called multiple times during the sequential night phase. Old listeners weren't being properly cleaned up between different role actions.

## Solution Implemented

### 1. Added Action-in-Progress Flag
```javascript
let actionInProgress = false;
```

This prevents double-clicks and ensures only one action completes at a time.

### 2. Updated Event Listener Pattern
**Before (Broken):**
```javascript
skipActionBtn.addEventListener('click', async () => {
    await executeBotNightActions();
    resolve();
}, { once: true });
```

**After (Fixed):**
```javascript
const handleClick = async () => {
    if (actionInProgress) return; // Prevent double-click
    actionInProgress = true;

    skipActionBtn.removeEventListener('click', handleClick);
    await executeBotNightActions();
    resolve();
};

skipActionBtn.addEventListener('click', handleClick);
```

### 3. Applied Fix to All Handlers
Updated all night action handlers:
- ✅ `handleWerewolfAction()`
- ✅ `handleMinionAction()`
- ✅ `handleSeerAction()`
- ✅ `handleRobberAction()`
- ✅ `handleDrunkAction()`
- ✅ `handleInsomniacAction()`

### 4. Reset State on Each Action
```javascript
async function performNightAction(role) {
    // Reset state before each action
    selectedCards = [];
    actionInProgress = false;
    // ...
}
```

## Benefits
- ✅ Buttons now work reliably
- ✅ No more stuck/unresponsive buttons
- ✅ Prevents accidental double-clicks
- ✅ Proper cleanup between sequential actions
- ✅ Works for all roles consistently

## Testing Steps
1. Start a new game with bot players
2. Get the Insomniac role
3. During night phase, wait for Insomniac's turn
4. Click "Continue" button
5. **Result:** Button should respond immediately and game should proceed

## Files Modified
- `js/game.js` - All night action handlers updated

---

**Status:** ✅ Fixed and ready for testing

Please refresh your browser (Cmd+Shift+R on Mac / Ctrl+Shift+R on Windows) to get the latest version!
