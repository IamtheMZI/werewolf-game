# 🎙️ Audio Narrator Feature - Implementation Plan

## Overview
Add a celebrity voice narrator (e.g., Trump) to read game actions during night phase.

## ⚠️ Important Discovery
The TTSCeleb library you suggested has broken dependencies and cannot be installed. However, I've found **better alternatives** that actually work!

---

## 🎯 Recommended Solution: ElevenLabs API

### Why ElevenLabs?
- ✅ **FREE Tier:** 10,000 characters/month (≈200 game narrations)
- ✅ **High Quality:** Best celebrity voice quality available
- ✅ **Easy to Use:** Simple API
- ✅ **Celebrity Voices:** Including Trump-style voices
- ✅ **Fast:** Quick generation times

### Setup Steps

1. **Sign up (FREE):**
   - Go to https://elevenlabs.io
   - Create free account
   - Get 10,000 free characters/month

2. **Get API Key:**
   - Profile → API Keys
   - Copy your API key

3. **Find Trump Voice:**
   - Browse Voice Library
   - Search for "Trump" or similar authoritative voices
   - Copy the `voice_id`

---

## 🏗️ Architecture

```
┌─────────────┐         ┌──────────────┐         ┌─────────────┐
│   Browser   │────────▶│  Flask API   │────────▶│ ElevenLabs  │
│   (Game)    │◀────────│   (Python)   │◀────────│     API     │
└─────────────┘         └──────────────┘         └─────────────┘
     │                         │
     │                         ▼
     ▼                   Generate Audio
 Play Audio              Cache locally
```

### Flow:
1. **Host assigns Audio Node** (any player)
2. **Game triggers narration** (e.g., "Night phase begins")
3. **Frontend sends request** to Backend API
4. **Backend generates audio** via ElevenLabs
5. **Audio Node's browser** plays the audio
6. **Other players** see "🔊 Audio playing..." indicator

---

## 📝 Implementation Steps

### Step 1: Backend API (Flask Server)

Create `/server/audio_narrator.py`:

```python
from flask import Flask, request, jsonify, send_file
from elevenlabs.client import ElevenLabs
from elevenlabs import save
import os

app = Flask(__name__)
client = ElevenLabs(api_key="your_api_key_here")

# Trump voice ID (get from ElevenLabs Voice Library)
TRUMP_VOICE_ID = "your_voice_id_here"

# Cache directory
AUDIO_CACHE = "/tmp/werewolf_audio"
os.makedirs(AUDIO_CACHE, exist_ok=True)

@app.route('/narrate', methods=['POST'])
def narrate():
    data = request.json
    text = data.get('text', '')

    # Generate cache key
    cache_key = hashlib.md5(text.encode()).hexdigest()
    cache_file = f"{AUDIO_CACHE}/{cache_key}.mp3"

    # Check cache
    if not os.path.exists(cache_file):
        # Generate audio
        audio = client.generate(
            text=text,
            voice=TRUMP_VOICE_ID,
            model="eleven_monolingual_v1"
        )
        save(audio, cache_file)

    return send_file(cache_file, mimetype='audio/mpeg')

if __name__ == '__main__':
    app.run(port=5000)
```

### Step 2: Frontend Integration

Add to `js/game.js`:

```javascript
// Audio Narrator System
let audioNodeId = null;  // Set by host
let isAudioNode = false;

async function playNarration(text) {
    // Only audio node plays
    if (!isAudioNode) {
        // Show indicator for other players
        showAudioIndicator(text);
        return;
    }

    try {
        // Call backend API
        const response = await fetch('http://localhost:5000/narrate', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ text })
        });

        const blob = await response.blob();
        const audio = new Audio(URL.createObjectURL(blob));

        // Play audio
        await audio.play();

    } catch (error) {
        console.error('Audio playback failed:', error);
        // Fallback to Web Speech API
        fallbackTTS(text);
    }
}

function fallbackTTS(text) {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.pitch = 0.8;  // Lower pitch for authority
    utterance.rate = 0.9;   // Slower for dramatic effect
    speechSynthesis.speak(utterance);
}
```

### Step 3: Lobby UI for Audio Node Selection

Add to `lobby.html`:

```html
<div class="audio-node-section" id="audioNodeSection">
    <h3>🎙️ Audio Narrator</h3>
    <p>Select a player to narrate the game with voice:</p>

    <select id="audioNodeSelect" class="form-control">
        <option value="">No audio (silent mode)</option>
        <!-- Populated dynamically with player names -->
    </select>

    <p class="help-text">
        💡 The selected player's device will play audio narration.
        Everyone else sees text prompts.
    </p>
</div>
```

### Step 4: Game Narration Points

```javascript
// In game.js

function startNightPhase() {
    playNarration("Night falls. Everyone close your eyes.");
    // ... existing code
}

async function executeSequentialNightPhase() {
    for (const role of nightRoles) {
        if (playersWithRole.length > 0) {
            // Narrate role waking up
            await playNarration(`${role.name}, wake up.`);
            await wait(2000);

            // Role action...

            await playNarration(`${role.name}, go back to sleep.`);
        }
    }
}

function startDayPhase() {
    playNarration("Everyone, wake up! Discussion time begins.");
    // ... existing code
}
```

---

## 💰 Cost Analysis

### ElevenLabs Free Tier
- **Monthly Limit:** 10,000 characters
- **Average Narration:** ~50 characters
- **Games Per Month:** ~200 games
- **Perfect for:** Testing, demos, small groups

### If You Need More:
- **Starter Plan:** $5/month = 30,000 characters
- **Creator Plan:** $11/month = 100,000 characters

---

## 🔄 Alternative: Free Solution (FakeYou)

If you want 100% free:

```python
# Using FakeYou API (no key needed)
import requests

def generate_fakeyou(text, voice_model):
    # FakeYou has Trump models
    url = "https://api.fakeyou.com/tts/inference"
    data = {
        "uuid_idempotency_token": str(uuid.uuid4()),
        "tts_model_token": voice_model,  # Trump model ID
        "inference_text": text
    }
    # ... implementation
```

**Cons:** Slower (queue-based), lower quality

---

## 🎮 User Experience

### For Host:
1. In lobby, select audio node from dropdown
2. Choose voice style (if multiple available)
3. Start game

### For Audio Node:
- Hears narration through speakers
- Can adjust volume in browser
- Can mute if needed

### For Other Players:
- See "🔊 Narrator speaking..." indicator
- Can toggle to hear own browser TTS as backup
- Game continues normally

---

## 📋 Testing Script

Run this to test ElevenLabs:

```bash
python3 /tmp/test_elevenlabs.py
```

This will:
1. Install ElevenLabs
2. Ask for your API key
3. Test voice generation
4. Play sample audio

---

## 🚀 Quick Start

1. **Get ElevenLabs API key** (5 minutes)
   ```
   https://elevenlabs.io → Sign up → Get API key
   ```

2. **Run test script**
   ```bash
   cd /tmp
   python3 test_elevenlabs.py
   ```

3. **If test works:** I'll implement the full feature!

---

## ❓ Questions?

**Q: Do ALL players need the API key?**
A: No! Only the backend server needs it.

**Q: Can I use it offline?**
A: No, but audio is cached after first generation.

**Q: What if API is down?**
A: Automatic fallback to browser's built-in TTS.

**Q: Can I change voices?**
A: Yes! Browse ElevenLabs Voice Library and use different voice_id.

---

## ✅ Next Step

**Try the test script:**
```bash
python3 /tmp/test_elevenlabs.py
```

If it works, I'll implement the full feature in your game!

**Want me to proceed with the implementation?** 🚀
