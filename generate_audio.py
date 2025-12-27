#!/usr/bin/env python3
"""
Generate audio files for Werewolf game narration using ElevenLabs TTS.
"""

import requests
import os

AUDIO_DIR = 'audio'
API_KEY = 'YOUR_ELEVENLABS_API_KEY'  # Replace with your API key

# All narration lines
NARRATIONS = {
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
    'seer_task': 'You may look at one other players card, or look at two cards from the center.',
    'seer_sleep': 'Seer, close your eyes.',

    'robber_wake': 'Robber, wake up.',
    'robber_task': 'You may swap your card with another players card. Then look at your new card.',
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
}

def get_voices():
    """Get available voices from ElevenLabs"""
    url = "https://api.elevenlabs.io/v1/voices"
    headers = {"xi-api-key": API_KEY}
    response = requests.get(url, headers=headers)
    if response.status_code == 200:
        return response.json()['voices']
    return []

def generate_audio(text, voice_id, output_path):
    """Generate audio using ElevenLabs API"""
    url = f"https://api.elevenlabs.io/v1/text-to-speech/{voice_id}"

    headers = {
        "xi-api-key": API_KEY,
        "Content-Type": "application/json"
    }

    data = {
        "text": text,
        "model_id": "eleven_turbo_v2",
        "voice_settings": {
            "stability": 0.3,
            "similarity_boost": 0.8
        }
    }

    response = requests.post(url, json=data, headers=headers)

    if response.status_code == 200:
        with open(output_path, 'wb') as f:
            f.write(response.content)
        return True
    else:
        print(f"Error: {response.status_code} - {response.text}")
        return False

def main():
    os.makedirs(AUDIO_DIR, exist_ok=True)

    # Use a deep male voice from ElevenLabs default voices
    # "Adam" - pNInz6obpgDQGcFmaJgB - deep authoritative voice
    # "Arnold" - VR6AewLTigWG4xSOukaG - strong voice
    # "Josh" - TxGEqnHWrfWFTfGW9XjX - casual male
    voice_id = "VR6AewLTigWG4xSOukaG"  # Arnold - strong authoritative voice
    print(f"Using voice: Arnold (authoritative)")

    # Generate all audio files
    for key, text in NARRATIONS.items():
        output_path = os.path.join(AUDIO_DIR, f'{key}.mp3')
        print(f'Generating: {key}.mp3 - "{text[:40]}..."')

        if generate_audio(text, voice_id, output_path):
            print(f'  ✅ Saved: {output_path}')
        else:
            print(f'  ❌ Failed: {key}')

    print(f'\n✅ Done! Audio files saved in {AUDIO_DIR}/')

if __name__ == '__main__':
    main()
