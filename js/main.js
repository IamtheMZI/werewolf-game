// ==================== //
// MAIN PAGE LOGIC      //
// ==================== //

// DOM Elements
const createGameBtn = document.getElementById('createGameBtn');
const joinGameBtn = document.getElementById('joinGameBtn');
const roomCodeInput = document.getElementById('roomCodeInput');
const playerNameInput = document.getElementById('playerNameInput');
const messageToast = document.getElementById('messageToast');

// ==================== //
// UTILITY FUNCTIONS    //
// ==================== //

function generateRoomCode() {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // Avoid confusing characters
    let code = '';
    for (let i = 0; i < 6; i++) {
        code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return code;
}

function showMessage(message, type = 'info') {
    messageToast.textContent = message;
    messageToast.className = `toast ${type}`;
    messageToast.classList.remove('hidden');

    setTimeout(() => {
        messageToast.classList.add('hidden');
    }, 3000);
}

function saveToLocalStorage(key, value) {
    try {
        localStorage.setItem(key, JSON.stringify(value));
    } catch (e) {
        console.error('Failed to save to localStorage:', e);
    }
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

function generatePlayerId() {
    return 'player_' + Math.random().toString(36).substr(2, 9) + Date.now();
}

function validateRoomCode(code) {
    return code && code.length === 6 && /^[A-Z0-9]+$/.test(code);
}

function validatePlayerName(name) {
    return name && name.trim().length >= 2 && name.trim().length <= 20;
}

// ==================== //
// SESSION MANAGEMENT   //
// ==================== //

function createGameSession() {
    // For now, we'll create a local session
    // This will be replaced with WebSocket communication
    const roomCode = generateRoomCode();
    const playerId = generatePlayerId();
    const playerName = 'Host'; // Can be customized later

    const session = {
        roomCode: roomCode,
        hostId: playerId,
        players: [
            {
                id: playerId,
                name: playerName,
                isHost: true,
                isReady: false
            }
        ],
        settings: {
            discussionTime: 5,
            selectedRoles: ['werewolf', 'seer', 'robber', 'drunk', 'insomniac', 'villager']
        },
        gameStarted: false,
        createdAt: Date.now()
    };

    // Save session data (both in currentSession and session_ROOMCODE)
    saveToLocalStorage('currentSession', session);
    saveToLocalStorage(`session_${roomCode}`, session);
    saveToLocalStorage('playerId', playerId);
    saveToLocalStorage('playerName', playerName);

    return { roomCode, playerId, session };
}

function joinGameSession(roomCode, playerName) {
    // Validate inputs
    if (!validateRoomCode(roomCode)) {
        throw new Error('Invalid room code. Must be 6 characters (A-Z, 0-9)');
    }

    if (!validatePlayerName(playerName)) {
        throw new Error('Player name must be 2-20 characters');
    }

    const playerId = generatePlayerId();

    // For now, save locally
    // This will be replaced with WebSocket communication
    saveToLocalStorage('pendingJoin', {
        roomCode: roomCode.toUpperCase(),
        playerName: playerName.trim(),
        playerId: playerId,
        timestamp: Date.now()
    });

    saveToLocalStorage('playerId', playerId);
    saveToLocalStorage('playerName', playerName.trim());

    return { roomCode: roomCode.toUpperCase(), playerId };
}

// ==================== //
// EVENT HANDLERS       //
// ==================== //

function handleCreateGame() {
    try {
        showMessage('Creating game room...', 'info');

        // Create the game session
        const { roomCode, playerId, session } = createGameSession();

        // Show success message
        showMessage(`Game created! Room code: ${roomCode}`, 'success');

        // Redirect to lobby after a short delay
        setTimeout(() => {
            window.location.href = `lobby.html?room=${roomCode}`;
        }, 1500);

    } catch (error) {
        console.error('Error creating game:', error);
        showMessage(error.message || 'Failed to create game', 'error');
    }
}

function handleJoinGame() {
    const roomCode = roomCodeInput.value.trim().toUpperCase();
    const playerName = playerNameInput.value.trim();

    try {
        // Validate inputs
        if (!validateRoomCode(roomCode)) {
            showMessage('Please enter a valid 6-character room code', 'error');
            roomCodeInput.focus();
            return;
        }

        if (!validatePlayerName(playerName)) {
            showMessage('Please enter your name (2-20 characters)', 'error');
            playerNameInput.focus();
            return;
        }

        showMessage('Joining game...', 'info');

        // Join the game session
        const { roomCode: validatedCode, playerId } = joinGameSession(roomCode, playerName);

        // Show success message
        showMessage(`Joining room ${validatedCode}...`, 'success');

        // Redirect to lobby
        setTimeout(() => {
            window.location.href = `lobby.html?room=${validatedCode}`;
        }, 1000);

    } catch (error) {
        console.error('Error joining game:', error);
        showMessage(error.message || 'Failed to join game', 'error');
    }
}

// ==================== //
// INPUT FORMATTING     //
// ==================== //

function formatRoomCodeInput(event) {
    let value = event.target.value.toUpperCase();
    // Remove invalid characters
    value = value.replace(/[^A-Z0-9]/g, '');
    // Limit to 6 characters
    value = value.substr(0, 6);
    event.target.value = value;
}

function handleEnterKey(event) {
    if (event.key === 'Enter') {
        event.preventDefault();
        if (event.target === roomCodeInput) {
            playerNameInput.focus();
        } else if (event.target === playerNameInput) {
            handleJoinGame();
        }
    }
}

// ==================== //
// INITIALIZATION       //
// ==================== //

function init() {
    // Check if user was previously in a game
    const currentSession = getFromLocalStorage('currentSession');
    if (currentSession && currentSession.roomCode) {
        // Could show a "rejoin" option here
        console.log('Previous session found:', currentSession.roomCode);
    }

    // Attach event listeners
    createGameBtn.addEventListener('click', handleCreateGame);
    joinGameBtn.addEventListener('click', handleJoinGame);

    // Input formatting
    roomCodeInput.addEventListener('input', formatRoomCodeInput);

    // Enter key handling
    roomCodeInput.addEventListener('keypress', handleEnterKey);
    playerNameInput.addEventListener('keypress', handleEnterKey);

    // Auto-focus on room code input
    roomCodeInput.focus();

    console.log('Main page initialized');
}

// ==================== //
// START APPLICATION    //
// ==================== //

// Wait for DOM to be ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}

// Export functions for use in other modules
export {
    generateRoomCode,
    showMessage,
    saveToLocalStorage,
    getFromLocalStorage,
    generatePlayerId,
    validateRoomCode,
    validatePlayerName
};