// ==================== //
// LOBBY PAGE LOGIC     //
// ==================== //

import { getRoleById, getDefaultRolesForPlayerCount, generateRoleDistribution } from './roles.js';
import { BotManager } from './botPlayer.js';

// DOM Elements
const roomCodeDisplay = document.getElementById('roomCode');
const copyCodeBtn = document.getElementById('copyCodeBtn');
const playersList = document.getElementById('playersList');
const playerCount = document.getElementById('playerCount');
const hostBadge = document.getElementById('hostBadge');
const gameSettings = document.getElementById('gameSettings');
const discussionTimeSlider = document.getElementById('discussionTime');
const discussionTimeValue = document.getElementById('discussionTimeValue');
const roleCheckboxes = document.querySelectorAll('input[name="role"]');
const roleCountDisplay = document.getElementById('roleCount');
const startGameBtn = document.getElementById('startGameBtn');
const addBotBtn = document.getElementById('addBotBtn');
const leaveGameBtn = document.getElementById('leaveGameBtn');
const messageToast = document.getElementById('messageToast');
const audioNodeSelect = document.getElementById('audioNodeSelect');
const randomAudioNodeBtn = document.getElementById('randomAudioNodeBtn');

// State
let currentSession = null;
let currentPlayerId = null;
let isHost = false;
let updateInterval = null;
let botManager = new BotManager();

// ==================== //
// UTILITY FUNCTIONS    //
// ==================== //

function showMessage(message, type = 'info') {
    messageToast.textContent = message;
    messageToast.className = `toast ${type}`;
    messageToast.classList.remove('hidden');

    setTimeout(() => {
        messageToast.classList.add('hidden');
    }, 3000);
}

function getFromLocalStorage(key) {
    try {
        const value = localStorage.getItem(key);
        return value ? JSON.parse(value) : null;
    } catch (e) {
        console.error('Failed to read from localStorage:', e);
        return null;
    }
}

function saveToLocalStorage(key, value) {
    try {
        localStorage.setItem(key, JSON.stringify(value));
    } catch (e) {
        console.error('Failed to save to localStorage:', e);
    }
}

function getRoomCodeFromURL() {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('room');
}

// ==================== //
// SESSION MANAGEMENT   //
// ==================== //

function loadSession() {
    const roomCode = getRoomCodeFromURL();

    if (!roomCode) {
        showMessage('No room code provided', 'error');
        setTimeout(() => {
            window.location.href = 'index.html';
        }, 2000);
        return;
    }

    // Get session from localStorage
    currentSession = getFromLocalStorage('currentSession');
    currentPlayerId = getFromLocalStorage('playerId');
    const playerName = getFromLocalStorage('playerName');

    // Check if this is a new join
    const pendingJoin = getFromLocalStorage('pendingJoin');

    if (!currentSession || currentSession.roomCode !== roomCode) {
        // This might be a join attempt
        if (pendingJoin && pendingJoin.roomCode === roomCode) {
            // Initialize session for joining player
            currentSession = getFromLocalStorage(`session_${roomCode}`) || null;

            if (!currentSession) {
                // Session doesn't exist, create error
                showMessage('Room not found. Please check the room code.', 'error');
                setTimeout(() => {
                    window.location.href = 'index.html';
                }, 2000);
                return;
            }

            // Add player to session
            const newPlayer = {
                id: pendingJoin.playerId,
                name: pendingJoin.playerName,
                isHost: false,
                isReady: false
            };

            currentSession.players.push(newPlayer);
            saveToLocalStorage(`session_${roomCode}`, currentSession);
            saveToLocalStorage('currentSession', currentSession);
            localStorage.removeItem('pendingJoin');
        } else {
            showMessage('Session not found', 'error');
            setTimeout(() => {
                window.location.href = 'index.html';
            }, 2000);
            return;
        }
    }

    // Check if current player is host
    const currentPlayer = currentSession.players.find(p => p.id === currentPlayerId);
    isHost = currentPlayer && currentPlayer.isHost;

    // Display session info
    displaySession();

    // Show host controls if host
    if (isHost) {
        gameSettings.classList.remove('hidden');
        hostBadge.classList.remove('hidden');
        startGameBtn.classList.remove('hidden');
        addBotBtn.classList.remove('hidden');
    }

    // Start polling for updates (simulate real-time)
    startSessionPolling();
}

function startSessionPolling() {
    // In a real implementation, this would use WebSocket
    // For now, we'll poll localStorage every second
    updateInterval = setInterval(() => {
        const roomCode = currentSession.roomCode;
        const latestSession = getFromLocalStorage(`session_${roomCode}`);

        if (latestSession) {
            currentSession = latestSession;
            saveToLocalStorage('currentSession', currentSession);
            displaySession();

            // Check if game has started
            if (currentSession.gameStarted) {
                clearInterval(updateInterval);
                window.location.href = `game.html?room=${roomCode}`;
            }
        }
    }, 1000);
}

// ==================== //
// DISPLAY FUNCTIONS    //
// ==================== //

function displaySession() {
    // Display room code
    roomCodeDisplay.textContent = currentSession.roomCode;

    // Display player count
    playerCount.textContent = currentSession.players.length;

    // Display players
    displayPlayers();

    // Update audio node dropdown
    updateAudioNodeDropdown();

    // Update start button state
    updateStartButtonState();
}

function displayPlayers() {
    playersList.innerHTML = '';

    currentSession.players.forEach(player => {
        const playerCard = document.createElement('div');
        playerCard.className = 'player-card';

        if (player.isHost) {
            playerCard.classList.add('is-host');
        }

        if (player.id === currentPlayerId) {
            playerCard.classList.add('is-you');
        }

        const icons = ['👤', '🎮', '🎲', '🎯', '🎪', '🎨', '🎭', '🎬', '🎸', '🎹'];
        const randomIcon = player.isBot ? '🤖' : icons[Math.floor(Math.random() * icons.length)];

        playerCard.innerHTML = `
            <div class="player-icon">${randomIcon}</div>
            <div class="player-name">${escapeHtml(player.name)}</div>
            ${player.isHost ? '<span class="player-label host-label">👑 Host</span>' : ''}
            ${player.id === currentPlayerId ? '<span class="player-label you-label">You</span>' : ''}
        `;

        playersList.appendChild(playerCard);
    });

    // Show status message if needed
    const statusMessage = document.querySelector('.player-status-message');
    if (currentSession.players.length < 3) {
        statusMessage.style.display = 'block';
    } else {
        statusMessage.style.display = 'none';
    }
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

function updateStartButtonState() {
    if (!isHost) return;

    const canStart = currentSession.players.length >= 3;
    startGameBtn.disabled = !canStart;

    if (canStart) {
        startGameBtn.textContent = `Start Game (${currentSession.players.length} Players)`;
    } else {
        startGameBtn.textContent = `Need ${3 - currentSession.players.length} More Players`;
    }
}

// ==================== //
// AUDIO NARRATOR       //
// ==================== //

function updateAudioNodeDropdown() {
    if (!isHost || !audioNodeSelect) return;
    if (!currentSession || !currentSession.players) return;

    // Get current selection
    const currentSelection = currentSession.settings?.audioNodeId || '';

    // Clear and rebuild dropdown
    audioNodeSelect.innerHTML = '<option value="">No Audio (Silent Mode)</option>';

    // Add all players as options
    currentSession.players.forEach(player => {
        const option = document.createElement('option');
        option.value = player.id;
        option.textContent = `${player.name}${player.isBot ? ' 🤖' : ''}`;

        if (player.id === currentSelection) {
            option.selected = true;
        }

        audioNodeSelect.appendChild(option);
    });

    // Auto-default to host if all other players are bots
    autoDefaultAudioNodeIfNeeded();
}

function updateAudioNode() {
    if (!isHost) return;

    const selectedAudioNodeId = audioNodeSelect.value;

    currentSession.settings = currentSession.settings || {};
    currentSession.settings.audioNodeId = selectedAudioNodeId;

    saveSessionToStorage();

    if (selectedAudioNodeId) {
        const selectedPlayer = currentSession.players.find(p => p.id === selectedAudioNodeId);
        if (selectedPlayer) {
            showMessage(`Audio node set to ${selectedPlayer.name}`, 'success');
        }
    } else {
        showMessage('Audio narration disabled', 'info');
    }
}

function chooseRandomAudioNode() {
    if (!isHost) {
        showMessage('Only the host can select audio node', 'error');
        return;
    }

    if (!currentSession || !currentSession.players || currentSession.players.length === 0) {
        showMessage('No players available to select', 'error');
        return;
    }

    // Choose random player
    const randomIndex = Math.floor(Math.random() * currentSession.players.length);
    const randomPlayer = currentSession.players[randomIndex];

    // Update dropdown
    audioNodeSelect.value = randomPlayer.id;

    // Save selection
    currentSession.settings = currentSession.settings || {};
    currentSession.settings.audioNodeId = randomPlayer.id;

    saveSessionToStorage();

    showMessage(`Randomly selected ${randomPlayer.name} as audio node`, 'success');
}

function autoDefaultAudioNodeIfNeeded() {
    if (!isHost || !currentSession || !currentSession.players) return;

    // Skip if already selected
    if (currentSession.settings?.audioNodeId) return;

    // Check if all non-host players are bots
    const humanPlayers = currentSession.players.filter(p => !p.isBot);
    const hostPlayer = currentSession.players.find(p => p.isHost);

    // If only human player is the host, default to host
    if (humanPlayers.length === 1 && hostPlayer && !hostPlayer.isBot) {
        currentSession.settings = currentSession.settings || {};
        currentSession.settings.audioNodeId = hostPlayer.id;

        // Update dropdown
        if (audioNodeSelect) {
            audioNodeSelect.value = hostPlayer.id;
        }

        saveSessionToStorage();

        console.log('Auto-defaulted audio node to host (all other players are bots)');
    }
}

// ==================== //
// GAME SETTINGS        //
// ==================== //

function updateDiscussionTime() {
    discussionTimeValue.textContent = discussionTimeSlider.value;

    if (currentSession && isHost) {
        currentSession.settings = currentSession.settings || {};
        currentSession.settings.discussionTime = parseInt(discussionTimeSlider.value);
        saveSessionToStorage();
    }
}

function updateSelectedRoles() {
    const selectedRoles = Array.from(roleCheckboxes)
        .filter(cb => cb.checked)
        .map(cb => cb.value);

    roleCountDisplay.textContent = selectedRoles.length;

    if (currentSession && isHost) {
        currentSession.settings = currentSession.settings || {};
        currentSession.settings.selectedRoles = selectedRoles;
        saveSessionToStorage();
    }
}

function saveSessionToStorage() {
    const roomCode = currentSession.roomCode;
    saveToLocalStorage(`session_${roomCode}`, currentSession);
    saveToLocalStorage('currentSession', currentSession);
}

// ==================== //
// GAME ACTIONS         //
// ==================== //

function startGame() {
    if (!isHost) {
        showMessage('Only the host can start the game', 'error');
        return;
    }

    if (currentSession.players.length < 3) {
        showMessage('Need at least 3 players to start', 'error');
        return;
    }

    // Get settings
    const settings = currentSession.settings || {};
    const selectedRoles = settings.selectedRoles || getDefaultRolesForPlayerCount(currentSession.players.length);
    const discussionTime = settings.discussionTime || 5;

    // Generate role distribution
    const playerCount = currentSession.players.length;
    const roleDistribution = generateRoleDistribution(playerCount, selectedRoles);

    // Assign roles to players
    const playerRoles = roleDistribution.slice(0, playerCount);
    const centerCards = roleDistribution.slice(playerCount);

    currentSession.players.forEach((player, index) => {
        player.originalRole = playerRoles[index];
        player.currentRole = playerRoles[index];
    });

    currentSession.centerCards = centerCards.map((role, index) => ({
        position: index,
        originalRole: role,
        currentRole: role
    }));

    currentSession.gameState = {
        phase: 'setup',
        discussionTime: discussionTime * 60, // Convert to seconds
        nightActionsComplete: []
    };

    currentSession.gameStarted = true;

    // Save and redirect
    saveSessionToStorage();
    showMessage('Starting game...', 'success');

    setTimeout(() => {
        window.location.href = `game.html?room=${currentSession.roomCode}`;
    }, 1000);
}

function leaveGame() {
    if (confirm('Are you sure you want to leave the game?')) {
        // Remove player from session
        if (currentSession) {
            currentSession.players = currentSession.players.filter(p => p.id !== currentPlayerId);

            // If host left and there are players remaining, assign new host
            if (isHost && currentSession.players.length > 0) {
                currentSession.players[0].isHost = true;
                showMessage('Host has left. New host assigned.', 'info');
            }

            saveSessionToStorage();
        }

        // Clear interval
        if (updateInterval) {
            clearInterval(updateInterval);
        }

        // Clear local storage
        localStorage.removeItem('currentSession');
        localStorage.removeItem('playerId');
        localStorage.removeItem('playerName');

        // Redirect to home
        window.location.href = 'index.html';
    }
}

function copyRoomCode() {
    const code = currentSession.roomCode;

    // Try to copy to clipboard
    if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(code).then(() => {
            showMessage('Room code copied to clipboard!', 'success');
        }).catch(err => {
            // Fallback
            fallbackCopyToClipboard(code);
        });
    } else {
        // Fallback for older browsers
        fallbackCopyToClipboard(code);
    }
}

function fallbackCopyToClipboard(text) {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.left = '-999999px';
    document.body.appendChild(textArea);
    textArea.select();

    try {
        document.execCommand('copy');
        showMessage('Room code copied!', 'success');
    } catch (err) {
        showMessage('Failed to copy. Code: ' + text, 'error');
    }

    document.body.removeChild(textArea);
}

// ==================== //
// BOT FUNCTIONS        //
// ==================== //

function addBot() {
    if (!isHost) {
        showMessage('Only the host can add bots', 'error');
        return;
    }

    if (currentSession.players.length >= 10) {
        showMessage('Maximum 10 players reached', 'error');
        return;
    }

    // Create bot player
    const botPlayer = botManager.createBot(currentSession);
    currentSession.players.push(botPlayer);

    // Save session
    saveSessionToStorage();

    // Update display (this will also update audio node dropdown)
    displaySession();

    showMessage(`Added bot: ${botPlayer.name}`, 'success');

    // Disable button if max players reached
    if (currentSession.players.length >= 10) {
        addBotBtn.disabled = true;
        addBotBtn.textContent = '🤖 Max Players Reached';
    }
}

// ==================== //
// EVENT LISTENERS      //
// ==================== //

function attachEventListeners() {
    // Copy room code
    copyCodeBtn.addEventListener('click', copyRoomCode);

    // Discussion time slider
    discussionTimeSlider.addEventListener('input', updateDiscussionTime);

    // Role checkboxes
    roleCheckboxes.forEach(checkbox => {
        checkbox.addEventListener('change', updateSelectedRoles);
    });

    // Audio narrator controls
    audioNodeSelect.addEventListener('change', updateAudioNode);
    randomAudioNodeBtn.addEventListener('click', chooseRandomAudioNode);

    // Game buttons
    addBotBtn.addEventListener('click', addBot);
    startGameBtn.addEventListener('click', startGame);
    leaveGameBtn.addEventListener('click', leaveGame);

    // Handle page unload
    window.addEventListener('beforeunload', () => {
        if (updateInterval) {
            clearInterval(updateInterval);
        }
    });
}

// ==================== //
// INITIALIZATION       //
// ==================== //

function init() {
    console.log('Lobby initialized');

    // Load session
    loadSession();

    // Attach event listeners
    attachEventListeners();

    // Initialize settings displays
    if (isHost) {
        updateDiscussionTime();
        updateSelectedRoles();
    }
}

// Wait for DOM to be ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}

export { currentSession, currentPlayerId, isHost };