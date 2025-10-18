# 🔊 iPhone Audio Fix + Home Button

## ✅ Issues Fixed

### 1. iPhone Audio Narrator Not Working ✅

**Problem:**
- Audio narrator didn't work on iPhone even when not in silent mode
- iOS requires user interaction before playing audio
- Web Speech API needs special handling on iOS

**Solution Implemented:**

#### A. Audio Initialization Function
```javascript
let audioInitialized = false;

function initializeAudio() {
    if (audioInitialized) return;

    try {
        // iOS requires this to be called from user interaction
        const utterance = new SpeechSynthesisUtterance('');
        utterance.volume = 0;  // Silent test
        speechSynthesis.speak(utterance);
        audioInitialized = true;
        console.log('🎙️ Audio initialized for iOS');
    } catch (error) {
        console.warn('Audio initialization failed:', error);
    }
}
```

#### B. Enhanced playNarration() Function
```javascript
function playNarration(text) {
    // Cancel any ongoing speech
    speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.pitch = 0.8;
    utterance.rate = 0.9;
    utterance.volume = 1.0;
    utterance.lang = 'en-US';  // Explicit language

    // iOS-specific: Resume speech synthesis
    if (speechSynthesis.paused) {
        speechSynthesis.resume();
    }

    speechSynthesis.speak(utterance);

    // For iOS: Force resume after a short delay
    setTimeout(() => {
        if (speechSynthesis.paused) {
            speechSynthesis.resume();
        }
    }, 100);
}
```

#### C. Initialize on First User Interaction
```javascript
function showYourCard() {
    // ... existing code ...

    // Initialize audio on first user interaction (iOS requirement)
    if (isAudioNode) {
        initializeAudio();
    }
}
```

**Why This Works:**
1. ✅ iOS requires audio to be triggered by user interaction
2. ✅ We initialize during role card display (user already clicked "Start Game")
3. ✅ Silent test utterance "unlocks" Web Speech API
4. ✅ Cancel previous speech prevents overlapping
5. ✅ Resume checks handle iOS paused state
6. ✅ Explicit language setting improves compatibility

---

### 2. Home Button Added ✅

**Problem:**
- No easy way to return to home page from lobby or game
- Users had to use browser back button

**Solution Implemented:**

#### A. HTML Structure (lobby.html & game.html)
```html
<!-- Home Button -->
<a href="index.html" class="home-button" title="Back to Home">
    <span class="home-icon">🏠</span>
</a>
```

#### B. CSS Styling (main.css)
```css
.home-button {
    position: fixed;
    top: 20px;
    left: 20px;
    width: 50px;
    height: 50px;
    background: linear-gradient(135deg, var(--primary-color) 0%, var(--secondary-color) 100%);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);
    transition: var(--transition);
    z-index: 1000;
    text-decoration: none;
}

.home-button:hover {
    transform: scale(1.1) translateY(-2px);
    box-shadow: 0 6px 20px rgba(102, 126, 234, 0.6);
}

.home-icon {
    font-size: 1.8em;
    filter: drop-shadow(0 2px 3px rgba(0, 0, 0, 0.2));
}
```

**Features:**
- ✅ Fixed position (top-left corner)
- ✅ Always visible (z-index: 1000)
- ✅ Circular gradient button
- ✅ Hover animation (scale + lift)
- ✅ Mobile-responsive (smaller on phones)
- ✅ Works on lobby and game pages

---

## 📱 Testing on iPhone

### iPhone Audio Testing:

**Steps to test:**
1. ✅ Open game on iPhone
2. ✅ Select yourself as audio node in lobby
3. ✅ Start game
4. ✅ Listen during night phase
5. ✅ Should hear: "Night falls. Everyone close your eyes."
6. ✅ Should hear: "Werewolf, wake up" (or your role)

**Important Notes:**
- ⚠️ **iPhone MUST NOT be in silent mode** (flip physical switch)
- ⚠️ **Volume must be up**
- ⚠️ Works best in Safari on iPhone
- ✅ First audio plays after you see your role card
- ✅ Subsequent narrations work automatically

**If still not working:**
1. Check physical silent switch (should be OFF)
2. Check volume slider (should be > 50%)
3. Try in Safari browser (not Chrome)
4. Hard refresh: Hold power button, swipe to power off, turn back on
5. Clear Safari cache: Settings → Safari → Clear History

### Home Button Testing:

**What to expect:**
- 🏠 Circular purple button in top-left corner
- ✅ Visible on lobby page
- ✅ Visible on game page
- ✅ Hover effect (scale up)
- ✅ Click returns to home page

---

## 🔧 Technical Details

### iOS Web Speech API Quirks:

**Challenges:**
1. **Silent Mode:** iPhone silent switch blocks ALL audio including TTS
2. **User Interaction:** iOS blocks audio until user interacts with page
3. **Paused State:** speechSynthesis sometimes pauses unexpectedly
4. **No Auto-play:** Can't start audio on page load

**Our Solutions:**
1. ✅ Initialize on role card display (user already clicked button)
2. ✅ Check and resume paused state before speaking
3. ✅ Cancel previous utterances to avoid queue issues
4. ✅ Explicit language setting for better iOS compatibility
5. ✅ Delayed resume check (100ms) catches iOS edge cases

### Files Modified:

**js/game.js:**
- Added `audioInitialized` flag
- Added `initializeAudio()` function
- Enhanced `playNarration()` with iOS fixes
- Call `initializeAudio()` in `showYourCard()`

**lobby.html:**
- Added home button HTML

**game.html:**
- Added home button HTML

**css/main.css:**
- Added `.home-button` styles
- Added `.home-icon` styles
- Added mobile responsive styles

---

## ✅ Verification Checklist

### iPhone Audio:
- [ ] Silent mode is OFF (physical switch)
- [ ] Volume is up (> 50%)
- [ ] Using Safari browser
- [ ] Selected as audio node in lobby
- [ ] Hard refresh after update: `Cmd + Shift + R`
- [ ] Hear "Night falls..." when game starts
- [ ] Hear role announcements during night

### Home Button:
- [ ] Visible on lobby page (top-left)
- [ ] Visible on game page (top-left)
- [ ] Circular purple gradient
- [ ] Scales up on hover
- [ ] Returns to index.html when clicked
- [ ] Works on mobile (smaller size)

---

## 🚀 Deployment

**Status:** ✅ Deployed to production

**Commit:** `86f342e`

**Version:** `1.0.0-86f342e`

**Live URL:** Check footer for current version!

---

## 📝 Usage Notes

### For iPhone Users:

**To hear audio narrator:**
1. Make sure you're the host (or selected as audio node)
2. Turn OFF silent mode (flip switch on left side of iPhone)
3. Turn up volume
4. Use Safari browser
5. Start the game
6. Listen! 🎙️

**Silent mode indicator:**
- 🔴 **RED/ORANGE visible** = Silent mode ON (no audio)
- ⚪ **NO COLOR visible** = Silent mode OFF (audio works) ✅

### For All Users:

**Home button:**
- Click 🏠 button anytime to return to home page
- Won't affect current game session
- Other players stay in game
- You can rejoin with room code

---

## 🎯 Next Steps

1. **Test on iPhone** - Try the audio narrator
2. **Try home button** - Navigate between pages
3. **Report issues** - If audio still doesn't work, check:
   - Silent mode switch
   - Browser (use Safari)
   - Volume level
   - iOS version (needs iOS 11+)

---

## 💡 Pro Tips

**Audio Narrator:**
- Only ONE device needs to play audio (the host's iPhone)
- Others can still play - they just see text instead
- Great for in-person games!

**Home Button:**
- Quick way to start a new game
- Doesn't log you out
- Can return to lobby with room code

---

**Last Updated:** Now
**Version:** 1.0.0-86f342e
**Status:** ✅ Live on production

Enjoy your game! 🐺🎙️
