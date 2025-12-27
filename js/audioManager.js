// Audio Manager - plays pre-recorded audio files instead of TTS

const AUDIO_FILES = {
    // Night phase
    'night_falls': 'audio/night_falls.mp3',

    // Role wake/sleep/task
    'mason_wake': 'audio/mason_wake.mp3',
    'mason_task': 'audio/mason_task.mp3',
    'mason_sleep': 'audio/mason_sleep.mp3',

    'werewolf_wake': 'audio/werewolf_wake.mp3',
    'werewolf_task': 'audio/werewolf_task.mp3',
    'werewolf_sleep': 'audio/werewolf_sleep.mp3',

    'minion_wake': 'audio/minion_wake.mp3',
    'minion_task': 'audio/minion_task.mp3',
    'minion_sleep': 'audio/minion_sleep.mp3',

    'seer_wake': 'audio/seer_wake.mp3',
    'seer_task': 'audio/seer_task.mp3',
    'seer_sleep': 'audio/seer_sleep.mp3',

    'robber_wake': 'audio/robber_wake.mp3',
    'robber_task': 'audio/robber_task.mp3',
    'robber_sleep': 'audio/robber_sleep.mp3',

    'troublemaker_wake': 'audio/troublemaker_wake.mp3',
    'troublemaker_task': 'audio/troublemaker_task.mp3',
    'troublemaker_sleep': 'audio/troublemaker_sleep.mp3',

    'drunk_wake': 'audio/drunk_wake.mp3',
    'drunk_task': 'audio/drunk_task.mp3',
    'drunk_sleep': 'audio/drunk_sleep.mp3',

    'insomniac_wake': 'audio/insomniac_wake.mp3',
    'insomniac_task': 'audio/insomniac_task.mp3',
    'insomniac_sleep': 'audio/insomniac_sleep.mp3',

    // Day/Vote phase
    'everyone_wake': 'audio/everyone_wake.mp3',
    'time_to_vote': 'audio/time_to_vote.mp3'
};

// Text for each audio file (for generating or TTS fallback)
export const AUDIO_TEXT = {
    'night_falls': 'Night falls. Everyone close your eyes.',

    'mason_wake': 'Mason, wake up.',
    'mason_task': 'Look for other Masons. If you are alone, there is a Mason card in the center.',
    'mason_sleep': 'Mason, close your eyes.',

    'werewolf_wake': 'Werewolf, wake up.',
    'werewolf_task': 'Look for other Werewolves. If you are the only Werewolf, you may look at one center card.',
    'werewolf_sleep': 'Werewolf, close your eyes.',

    'minion_wake': 'Minion, wake up.',
    'minion_task': 'Look at who the Werewolves are. They do not know who you are. You win if they survive.',
    'minion_sleep': 'Minion, close your eyes.',

    'seer_wake': 'Seer, wake up.',
    'seer_task': 'You may look at one other player\'s card, or look at two cards from the center.',
    'seer_sleep': 'Seer, close your eyes.',

    'robber_wake': 'Robber, wake up.',
    'robber_task': 'You may swap your card with another player\'s card. Then look at your new card.',
    'robber_sleep': 'Robber, close your eyes.',

    'troublemaker_wake': 'Troublemaker, wake up.',
    'troublemaker_task': 'You may swap the cards of two other players. They will not know their cards were swapped.',
    'troublemaker_sleep': 'Troublemaker, close your eyes.',

    'drunk_wake': 'Drunk, wake up.',
    'drunk_task': 'You must swap your card with one card from the center. You may not look at your new card.',
    'drunk_sleep': 'Drunk, close your eyes.',

    'insomniac_wake': 'Insomniac, wake up.',
    'insomniac_task': 'Look at your card to see if it has changed during the night.',
    'insomniac_sleep': 'Insomniac, close your eyes.',

    'everyone_wake': 'Everyone, wake up! The sun has risen. It is time to discuss.',
    'time_to_vote': 'Time to vote. Everyone, point to who you think is a werewolf.'
};

let currentAudio = null;
let audioEnabled = true;

// Preload audio files
const audioCache = {};

export function preloadAudio() {
    Object.entries(AUDIO_FILES).forEach(([key, path]) => {
        const audio = new Audio(path);
        audio.preload = 'auto';
        audioCache[key] = audio;
    });
    console.log('🎵 Audio files preloaded');
}

// Play audio by key and return a Promise that resolves when done
export function playAudio(key) {
    return new Promise((resolve) => {
        if (!audioEnabled) {
            resolve();
            return;
        }

        // Stop any currently playing audio
        if (currentAudio) {
            currentAudio.pause();
            currentAudio.currentTime = 0;
        }

        const audioPath = AUDIO_FILES[key];
        if (!audioPath) {
            console.warn(`Audio not found for key: ${key}`);
            resolve();
            return;
        }

        console.log(`🎵 Playing audio: ${key}`);

        // Use cached audio or create new
        const audio = audioCache[key] || new Audio(audioPath);
        currentAudio = audio;
        audio.currentTime = 0;

        audio.onended = () => {
            console.log(`🎵 Audio ended: ${key}`);
            currentAudio = null;
            resolve();
        };

        audio.onerror = (e) => {
            console.error(`🎵 Audio error for ${key}:`, e);
            currentAudio = null;
            resolve();
        };

        audio.play().catch(err => {
            console.error('Audio play failed:', err);
            resolve();
        });
    });
}

// Get audio key for role actions
export function getRoleAudioKey(roleId, action) {
    // action is 'wake', 'task', or 'sleep'
    return `${roleId}_${action}`;
}

export function setAudioEnabled(enabled) {
    audioEnabled = enabled;
}

export function isAudioEnabled() {
    return audioEnabled;
}
