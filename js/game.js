// ==================== //
// GAME PAGE LOGIC      //
// ==================== //

import { ROLES, getRoleById, getRolesInNightOrder } from './roles.js';
import { BotManager } from './botPlayer.js';

// DOM Elements
const phaseIcon = document.getElementById('phaseIcon');
const phaseTitle = document.getElementById('phaseTitle');
const gameTimer = document.getElementById('gameTimer');
const timerDisplay = document.getElementById('timerDisplay');

// Sections
const yourCardSection = document.getElementById('yourCardSection');
const actionPromptSection = document.getElementById('actionPromptSection');
const interactionSection = document.getElementById('interactionSection');
const discussionSection = document.getElementById('discussionSection');
const votingSection = document.getElementById('votingSection');
const resultsSection = document.getElementById('resultsSection');
const waitingSection = document.getElementById('waitingSection');

// Your card elements
const yourCard = document.getElementById('yourCard');
const cardDescription = document.getElementById('cardDescription');

// Prompt elements
const promptTitle = document.getElementById('promptTitle');
const promptText = document.getElementById('promptText');
const promptTimer = document.getElementById('promptTimer');
const promptTimerValue = document.getElementById('promptTimerValue');

// Interaction elements
const playerCardsGrid = document.getElementById('playerCardsGrid');
const centerCardsSection = document.getElementById('centerCardsSection');
const playerCards = document.getElementById('playerCards');
const centerCards = document.getElementById('centerCards');
const actionButtons = document.getElementById('actionButtons');
const confirmActionBtn = document.getElementById('confirmActionBtn');
const skipActionBtn = document.getElementById('skipActionBtn');

// Discussion elements
const playersAliveGrid = document.getElementById('playersAliveGrid');
const doneDiscussionBtn = document.getElementById('doneDiscussionBtn');
const readyStatus = document.getElementById('readyStatus');
const readyCount = document.getElementById('readyCount');
const totalPlayers = document.getElementById('totalPlayers');

// Voting elements
const votingGrid = document.getElementById('votingGrid');
const votingStatus = document.getElementById('votingStatus');
const votesReceived = document.getElementById('votesReceived');
const totalVotes = document.getElementById('totalVotes');

// Results elements
const eliminatedPlayer = document.getElementById('eliminatedPlayer');
const finalRolesGrid = document.getElementById('finalRolesGrid');
const winnerAnnouncement = document.getElementById('winnerAnnouncement');

// Footer elements
const roomCodeDisplay = document.getElementById('roomCodeDisplay');
const playerCountDisplay = document.getElementById('playerCountDisplay');

// Toast
const messageToast = document.getElementById('messageToast');

// State
let currentSession = null;
let currentPlayerId = null;
let currentPlayer = null;
let gamePhase = 'setup';
let selectedCards = [];
let hasActed = false;
let timerInterval = null;
let updateInterval = null;
let botManager = new BotManager();
let playersReady = new Set();
let timerEndTime = null;
let actionInProgress = false;
let isAudioNode = false;

// ==================== //
// AUDIO NARRATOR       //
// ==================== //

function playNarration(text) {
    // Only play if this player is the audio node
    if (!isAudioNode) return;

    // Check if audio is enabled
    const audioNodeId = currentSession.settings?.audioNodeId;
    if (!audioNodeId) return;

    console.log('🎙️ Narrating:', text);

    // Use Web Speech API
    try {
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.pitch = 0.8;  // Lower pitch for authority
        utterance.rate = 0.9;   // Slower for dramatic effect
        utterance.volume = 1.0;
        speechSynthesis.speak(utterance);
    } catch (error) {
        console.error('Audio playback failed:', error);
    }
}

async function wait(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

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

function saveSessionToStorage() {
    const roomCode = currentSession.roomCode;
    saveToLocalStorage(`session_${roomCode}`, currentSession);
    saveToLocalStorage('currentSession', currentSession);
}

// ==================== //
// SESSION LOADING      //
// ==================== //

function loadSession() {
    const roomCode = getRoomCodeFromURL();

    if (!roomCode) {
        showMessage('No room code provided', 'error');
        setTimeout(() => {
            window.location.href = 'index.html';
        }, 2000);
        return false;
    }

    currentSession = getFromLocalStorage(`session_${roomCode}`);
    currentPlayerId = getFromLocalStorage('playerId');

    if (!currentSession || !currentPlayerId) {
        showMessage('Session not found', 'error');
        setTimeout(() => {
            window.location.href = 'index.html';
        }, 2000);
        return false;
    }

    currentPlayer = currentSession.players.find(p => p.id === currentPlayerId);

    if (!currentPlayer) {
        showMessage('Player not found in session', 'error');
        setTimeout(() => {
            window.location.href = 'index.html';
        }, 2000);
        return false;
    }

    // Display footer info
    roomCodeDisplay.textContent = `Room: ${currentSession.roomCode}`;
    playerCountDisplay.textContent = `Players: ${currentSession.players.length}`;

    // Check if this player is the audio node
    const audioNodeId = currentSession.settings?.audioNodeId;
    isAudioNode = audioNodeId === currentPlayerId;

    if (isAudioNode) {
        console.log('🎙️ You are the audio node - you will hear narration');
    }

    return true;
}

// ==================== //
// GAME PHASES          //
// ==================== //

function startGame() {
    // Show your card first
    gamePhase = 'setup';
    showYourCard();

    // After 5 seconds, start night phase
    setTimeout(() => {
        startNightPhase();
    }, 5000);
}

function showYourCard() {
    hideAllSections();

    phaseIcon.textContent = '🎴';
    phaseTitle.textContent = 'Your Role';

    const role = getRoleById(currentPlayer.originalRole);

    // Display card
    const cardFront = yourCard.querySelector('.card-front');
    cardFront.querySelector('.card-emoji').textContent = role.emoji;
    cardFront.querySelector('.card-name').textContent = role.name;
    cardFront.querySelector('.card-team').textContent = getRoleTeamName(role.team);

    // Set card color based on team
    cardFront.style.background = getTeamGradient(role.team);

    // Display description
    cardDescription.innerHTML = `
        <p><strong>${role.name}</strong></p>
        <p>${role.description}</p>
        <p><strong>Win Condition:</strong> ${role.winCondition}</p>
    `;

    yourCardSection.classList.remove('hidden');

    showMessage('Memorize your role!', 'info');
}

async function startNightPhase() {
    gamePhase = 'night';
    hideAllSections();

    phaseIcon.textContent = '🌙';
    phaseTitle.textContent = 'Night Phase';

    // Initialize night notes for tracking what player learned
    currentPlayer.nightNotes = [];

    // Narrate night beginning
    playNarration('Night falls. Everyone close your eyes.');
    await wait(2000);

    // Start sequential night actions
    executeSequentialNightPhase();
}

async function executeSequentialNightPhase() {
    console.log('🌙 Starting sequential night phase');

    // Get all roles in night order
    const nightRoles = getRolesInNightOrder();
    console.log('Night roles:', nightRoles.map(r => r.name));

    // For each role in order, let those players act
    for (const role of nightRoles) {
        console.log(`\n--- Processing role: ${role.name} ---`);

        // Check if any player has this role
        const playersWithRole = currentSession.players.filter(p => p.originalRole === role.id);
        console.log(`Players with ${role.name}:`, playersWithRole.length);

        if (playersWithRole.length === 0) {
            console.log(`No players have ${role.name}, skipping`);
            continue;
        }

        // Narrate role waking up
        playNarration(`${role.name}, wake up.`);
        await wait(1500);

        // Check if current player has this role
        const isMyTurn = playersWithRole.some(p => p.id === currentPlayerId);
        console.log(`Is my turn (${currentPlayer.name})?`, isMyTurn);

        if (isMyTurn) {
            // It's this player's turn
            console.log(`⏳ Performing ${role.name} action...`);
            await performNightAction(role);
            console.log(`✅ Completed ${role.name} action`);
        } else {
            // Show waiting screen for other players
            showWaitingScreen(
                `${role.name} ${role.emoji} is acting...`,
                'Please wait while other players complete their actions.'
            );

            // Wait for the action to complete (simulate with timeout)
            await new Promise(resolve => setTimeout(resolve, 8000)); // 8 seconds per role
        }

        // Narrate role going back to sleep
        playNarration(`${role.name}, close your eyes.`);
        await wait(1500);
    }

    console.log('✅ All night actions complete, moving to day phase');
    // All night actions complete, move to day phase
    startDayPhase();
}

async function performNightAction(role) {
    console.log(`🎬 performNightAction called for ${role.name} (action: ${role.nightAction})`);

    try {
        hideAllSections();

        // Reset state
        selectedCards = [];
        actionInProgress = false;

        // Clear all button event listeners by cloning and replacing
        clearButtonListeners();

        actionPromptSection.classList.remove('hidden');
        interactionSection.classList.remove('hidden');

        // Call the appropriate handler and await it
        switch (role.nightAction) {
            case 'view_werewolves':
                if (role.id === 'werewolf') {
                    console.log('📞 Calling handleWerewolfAction');
                    await handleWerewolfAction();
                    console.log('✅ handleWerewolfAction returned');
                } else if (role.id === 'minion') {
                    console.log('📞 Calling handleMinionAction');
                    await handleMinionAction();
                    console.log('✅ handleMinionAction returned');
                }
                break;

            case 'view_card':
                console.log('📞 Calling handleSeerAction');
                await handleSeerAction();
                console.log('✅ handleSeerAction returned');
                break;

            case 'swap_and_view':
                console.log('📞 Calling handleRobberAction');
                await handleRobberAction();
                console.log('✅ handleRobberAction returned');
                break;

            case 'swap_blind':
                console.log('📞 Calling handleDrunkAction');
                await handleDrunkAction();
                console.log('✅ handleDrunkAction returned');
                break;

            case 'check_self':
                console.log('📞 Calling handleInsomniacAction');
                await handleInsomniacAction();
                console.log('✅ handleInsomniacAction returned');
                break;

            default:
                console.log('⚠️ No matching night action case');
        }

        console.log(`🏁 performNightAction complete for ${role.name}`);
    } catch (error) {
        console.error('❌ ERROR in performNightAction:', error);
        console.error('Stack trace:', error.stack);
        throw error; // Re-throw to see it in console
    }
}

function clearButtonListeners() {
    // Get fresh button references
    const confirmBtn = document.getElementById('confirmActionBtn');
    const skipBtn = document.getElementById('skipActionBtn');

    // Clone and replace confirm button to remove all event listeners
    const newConfirmBtn = confirmBtn.cloneNode(true);
    confirmBtn.parentNode.replaceChild(newConfirmBtn, confirmBtn);

    // Clone and replace skip button to remove all event listeners
    const newSkipBtn = skipBtn.cloneNode(true);
    skipBtn.parentNode.replaceChild(newSkipBtn, skipBtn);
}


// ==================== //
// NIGHT ACTIONS        //
// ==================== //

async function handleWerewolfAction() {
    console.log('🐺 handleWerewolfAction START');

    promptTitle.textContent = '🐺 Werewolf Action';
    promptText.textContent = 'Look for other werewolves. Tap to reveal their identities.';

    // Ensure nightNotes exists
    if (!currentPlayer.nightNotes) {
        currentPlayer.nightNotes = [];
    }

    // Find other werewolves
    const werewolves = currentSession.players.filter(p =>
        p.id !== currentPlayerId &&
        (p.originalRole === 'werewolf' || p.originalRole === 'dream-wolf')
    );

    if (werewolves.length === 0) {
        promptText.textContent = 'You are the only werewolf! No teammates to see.';
        currentPlayer.nightNotes.push('🐺 You are the only Werewolf.');
    } else {
        displaySelectablePlayers(werewolves, false, (player) => {
            showMessage(`${player.name} is a Werewolf!`, 'info');
        });
        const werewolfNames = werewolves.map(w => w.name).join(', ');
        currentPlayer.nightNotes.push(`🐺 Other Werewolves: ${werewolfNames}`);
    }

    // Auto-continue after 6 seconds
    console.log('⏳ Waiting 6 seconds...');
    await wait(6000);
    console.log('✅ 6 second wait complete');

    console.log('⏳ Executing bot night actions...');
    await executeBotNightActions();
    console.log('✅ Bot actions complete');

    console.log('🐺 handleWerewolfAction END');
}

async function handleMinionAction() {
    promptTitle.textContent = '😈 Minion Action';
    promptText.textContent = 'See who the werewolves are. They do not see you.';

    const werewolves = currentSession.players.filter(p =>
        (p.originalRole === 'werewolf' || p.originalRole === 'dream-wolf')
    );

    if (werewolves.length === 0) {
        promptText.textContent = 'There are no werewolves! All werewolf cards must be in the center.';
        currentPlayer.nightNotes.push('😈 No Werewolves found (all in center).');
    } else {
        displaySelectablePlayers(werewolves, false, (player) => {
            showMessage(`${player.name} is a Werewolf!`, 'info');
        });
        const werewolfNames = werewolves.map(w => w.name).join(', ');
        currentPlayer.nightNotes.push(`😈 Werewolves are: ${werewolfNames}`);
    }

    // Auto-continue after 6 seconds
    await wait(6000);
    await executeBotNightActions();
}

async function handleSeerAction() {
    console.log('🔮 handleSeerAction START');

    promptTitle.textContent = '🔮 Seer Action';
    promptText.textContent = 'Choose: View ONE player card OR TWO center cards. You have 8 seconds.';

    // Show both options
    playerCardsGrid.classList.remove('hidden');
    centerCardsSection.classList.remove('hidden');

    // Display selectable players (excluding self)
    const otherPlayers = currentSession.players.filter(p => p.id !== currentPlayerId);
    displaySelectablePlayers(otherPlayers, true, null);

    // Display center cards
    displayCenterCards(true);

    // Wait 8 seconds for user to select
    console.log('⏳ Waiting 8 seconds for selection...');
    await wait(8000);
    console.log('✅ 8 second wait complete');

    // Check what was selected
    console.log('Selected cards:', selectedCards);
    if (selectedCards.length === 1 && selectedCards[0].type === 'player') {
        // View player card
        const player = currentSession.players.find(p => p.id === selectedCards[0].id);
        const role = getRoleById(player.originalRole);
        showMessage(`${player.name} is the ${role.name} ${role.emoji}`, 'success');
        currentPlayer.nightNotes.push(`🔮 Viewed ${player.name}: ${role.name} ${role.emoji}`);
    } else if (selectedCards.length === 2 && selectedCards[0].type === 'center') {
        // View center cards
        const notes = [];
        selectedCards.forEach(card => {
            const centerCard = currentSession.centerCards[card.position];
            const role = getRoleById(centerCard.originalRole);
            showMessage(`Center ${card.position + 1} is ${role.name} ${role.emoji}`, 'success');
            notes.push(`Center ${card.position + 1}: ${role.name} ${role.emoji}`);
        });
        currentPlayer.nightNotes.push(`🔮 Viewed ${notes.join(', ')}`);
    } else {
        currentPlayer.nightNotes.push('🔮 Did not view any cards.');
    }

    console.log('⏳ Waiting 2 seconds to show result...');
    await wait(2000);
    console.log('✅ 2 second wait complete');

    console.log('⏳ Executing bot night actions...');
    await executeBotNightActions();
    console.log('✅ Bot actions complete');

    console.log('🔮 handleSeerAction END');
}

async function handleRobberAction() {
    promptTitle.textContent = '🔄 Robber Action';
    promptText.textContent = 'Choose a player to swap cards with. You have 8 seconds.';

    playerCardsGrid.classList.remove('hidden');

    const otherPlayers = currentSession.players.filter(p => p.id !== currentPlayerId);
    displaySelectablePlayers(otherPlayers, true, null);

    // Wait 8 seconds for user to select
    await wait(8000);

    // Check if a player was selected
    if (selectedCards.length === 1 && selectedCards[0].type === 'player') {
        const targetPlayer = currentSession.players.find(p => p.id === selectedCards[0].id);

        // Swap roles
        const tempRole = currentPlayer.currentRole;
        currentPlayer.currentRole = targetPlayer.currentRole;
        targetPlayer.currentRole = tempRole;

        saveSessionToStorage();

        const newRole = getRoleById(currentPlayer.currentRole);
        showMessage(`You swapped with ${targetPlayer.name}. You are now the ${newRole.name} ${newRole.emoji}!`, 'success');
        currentPlayer.nightNotes.push(`🔄 Swapped with ${targetPlayer.name}. Now: ${newRole.name} ${newRole.emoji}`);

        await wait(3000);
    } else {
        currentPlayer.nightNotes.push('🔄 Did not swap with anyone.');
    }

    await executeBotNightActions();
}

async function handleDrunkAction() {
    promptTitle.textContent = '😴 Drunk Action';
    promptText.textContent = 'Choose a center card to swap with. You have 8 seconds.';

    centerCardsSection.classList.remove('hidden');

    displayCenterCards(true);

    // Wait 8 seconds for user to select
    await wait(8000);

    // Check if a center card was selected
    if (selectedCards.length === 1 && selectedCards[0].type === 'center') {
        const centerCard = currentSession.centerCards[selectedCards[0].position];

        // Swap roles (blind)
        const tempRole = currentPlayer.currentRole;
        currentPlayer.currentRole = centerCard.currentRole;
        centerCard.currentRole = tempRole;

        saveSessionToStorage();

        showMessage('You swapped your card with a center card. You do not know your new role!', 'info');
        currentPlayer.nightNotes.push(`😴 Swapped with Center ${selectedCards[0].position + 1} (don't know new role).`);

        await wait(2000);
    } else {
        currentPlayer.nightNotes.push('😴 Did not swap with any center card.');
    }

    await executeBotNightActions();
}

async function handleInsomniacAction() {
    promptTitle.textContent = '🧝 Insomniac Action';

    const originalRole = getRoleById(currentPlayer.originalRole);
    const currentRole = getRoleById(currentPlayer.currentRole);

    if (currentPlayer.originalRole === currentPlayer.currentRole) {
        promptText.textContent = `You are still the ${currentRole.name} ${currentRole.emoji}. Your card was not swapped.`;
        currentPlayer.nightNotes.push(`🧝 Still ${currentRole.name} ${currentRole.emoji} (not swapped).`);
    } else {
        promptText.textContent = `Your card was swapped! You are now the ${currentRole.name} ${currentRole.emoji} (you were the ${originalRole.name}).`;
        currentPlayer.nightNotes.push(`🧝 Card was swapped! Now: ${currentRole.name} ${currentRole.emoji}`);
    }

    // Auto-continue after 5 seconds
    await wait(5000);
    await executeBotNightActions();
}

async function executeBotNightActions() {
    console.log('🤖 executeBotNightActions START');

    // BotManager will create bot instances if they don't exist
    await botManager.executeBotNightActions(currentSession);

    // Save updated session
    saveSessionToStorage();

    console.log('🤖 executeBotNightActions END');
}

// ==================== //
// DISPLAY HELPERS      //
// ==================== //

function displaySelectablePlayers(players, singleSelect, onClickCallback) {
    // Clear and reset
    playerCards.innerHTML = '';
    selectedCards = selectedCards.filter(c => c.type !== 'player'); // Keep only non-player selections

    players.forEach(player => {
        const card = document.createElement('div');
        card.className = 'player-card-interactive';
        card.dataset.playerId = player.id;

        card.innerHTML = `
            <div class="player-icon">👤</div>
            <div class="player-name">${escapeHtml(player.name)}</div>
        `;

        card.addEventListener('click', () => {
            if (onClickCallback) {
                onClickCallback(player);
                return;
            }

            // Selection mode
            if (singleSelect) {
                // Deselect all others
                document.querySelectorAll('.player-card-interactive').forEach(c => c.classList.remove('selected'));
                selectedCards = selectedCards.filter(c => c.type !== 'player'); // Remove all player selections
            }

            card.classList.toggle('selected');

            if (card.classList.contains('selected')) {
                selectedCards.push({ type: 'player', id: player.id });
            } else {
                selectedCards = selectedCards.filter(c => !(c.type === 'player' && c.id === player.id));
            }

            updateConfirmButton();
        });

        playerCards.appendChild(card);
    });

    // Reset confirm button state
    updateConfirmButton();
}

function displayCenterCards(selectable) {
    const centerCardElements = document.querySelectorAll('.center-card');

    // Clear center card selections
    selectedCards = selectedCards.filter(c => c.type !== 'center');

    centerCardElements.forEach((cardEl, index) => {
        if (!selectable) return;

        // Remove old class to reset state
        cardEl.classList.remove('selected');

        // Clone and replace to remove all old event listeners
        const newCardEl = cardEl.cloneNode(true);
        cardEl.parentNode.replaceChild(newCardEl, cardEl);

        newCardEl.addEventListener('click', () => {
            // Check selection limits
            const centerSelected = selectedCards.filter(c => c.type === 'center').length;

            if (newCardEl.classList.contains('selected')) {
                newCardEl.classList.remove('selected');
                selectedCards = selectedCards.filter(c => !(c.type === 'center' && c.position === index));
            } else {
                // Seer can select max 2 center cards
                if (centerSelected < 2) {
                    // If selecting center, deselect player cards
                    document.querySelectorAll('.player-card-interactive').forEach(c => c.classList.remove('selected'));
                    // Deselect other center cards if this is for Drunk (only 1 allowed)
                    document.querySelectorAll('.center-card').forEach(c => c.classList.remove('selected'));

                    // Clear all selections and start fresh
                    selectedCards = [];

                    newCardEl.classList.add('selected');
                    selectedCards.push({ type: 'center', position: index });
                }
            }

            updateConfirmButton();
        });
    });

    // Reset confirm button state
    updateConfirmButton();
}

function updateConfirmButton() {
    const confirmBtn = document.getElementById('confirmActionBtn');
    if (confirmBtn) {
        if (selectedCards.length > 0) {
            confirmBtn.disabled = false;
        } else {
            confirmBtn.disabled = true;
        }
    }
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

function getRoleTeamName(team) {
    const names = {
        'werewolf': 'Werewolf Team',
        'village': 'Village Team',
        'neutral': 'Neutral'
    };
    return names[team] || 'Unknown';
}

function getTeamGradient(team) {
    const gradients = {
        'werewolf': 'linear-gradient(135deg, #d63031 0%, #e17055 100%)',
        'village': 'linear-gradient(135deg, #00b894 0%, #00cec9 100%)',
        'neutral': 'linear-gradient(135deg, #fdcb6e 0%, #ffeaa7 100%)'
    };
    return gradients[team] || 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
}

// ==================== //
// DAY PHASE            //
// ==================== //

async function startDayPhase() {
    gamePhase = 'day';
    hideAllSections();

    phaseIcon.textContent = '☀️';
    phaseTitle.textContent = 'Day Phase - Discussion';

    // Narrate day beginning
    playNarration('Everyone, wake up! The sun has risen. It is time to discuss.');
    await wait(2000);

    discussionSection.classList.remove('hidden');

    // Initialize ready tracking
    playersReady.clear();

    // Display night notes
    displayNightNotes();

    // Display all players
    displayPlayersForDiscussion();

    // Setup ready button and status
    totalPlayers.textContent = currentSession.players.length;
    readyCount.textContent = '0';
    doneDiscussionBtn.disabled = false;
    doneDiscussionBtn.textContent = '✅ I\'m Ready to Vote';

    // Add click handler for done button
    doneDiscussionBtn.addEventListener('click', handleDoneDiscussion, { once: true });

    // Show timer
    const discussionTime = currentSession.gameState.discussionTime || 300; // 5 minutes default
    startTimer(discussionTime, () => {
        startVoting();
    });

    // Make bots automatically ready after random delay
    executeBotReadyActions();

    showMessage('Discuss and figure out who the werewolves are!', 'info');
}

function displayNightNotes() {
    const nightNotesContent = document.getElementById('nightNotesContent');

    if (!currentPlayer.nightNotes || currentPlayer.nightNotes.length === 0) {
        nightNotesContent.innerHTML = '<p style="text-align: center; color: #95a5a6; font-style: italic;">No night actions were performed.</p>';
        return;
    }

    nightNotesContent.innerHTML = currentPlayer.nightNotes.map(note => {
        return `<div class="night-note-item">${note}</div>`;
    }).join('');
}

function displayPlayersForDiscussion() {
    playersAliveGrid.innerHTML = '';

    currentSession.players.forEach(player => {
        const card = document.createElement('div');
        card.className = 'player-card';

        if (player.id === currentPlayerId) {
            card.classList.add('is-you');
        }

        card.innerHTML = `
            <div class="player-icon">👤</div>
            <div class="player-name">${escapeHtml(player.name)}</div>
            ${player.id === currentPlayerId ? '<span class="player-label you-label">You</span>' : ''}
        `;

        playersAliveGrid.appendChild(card);
    });
}

function handleDoneDiscussion() {
    // Mark current player as ready
    playersReady.add(currentPlayerId);

    // Disable button
    doneDiscussionBtn.disabled = true;
    doneDiscussionBtn.textContent = '✅ You\'re Ready!';

    // Update display
    updateReadyStatus();

    showMessage('You\'re ready! Waiting for other players...', 'info');

    // Check if all players are ready
    checkAllPlayersReady();
}

async function executeBotReadyActions() {
    // Get all bot players
    const botPlayers = currentSession.players.filter(p => p.isBot);

    // Make each bot ready after a random delay (10-30 seconds)
    botPlayers.forEach(botPlayer => {
        const delay = Math.random() * 20000 + 10000; // 10-30 seconds
        setTimeout(() => {
            playersReady.add(botPlayer.id);
            updateReadyStatus();
            checkAllPlayersReady();
        }, delay);
    });
}

function updateReadyStatus() {
    readyCount.textContent = playersReady.size;
}

function checkAllPlayersReady() {
    if (playersReady.size === currentSession.players.length) {
        // All players are ready, proceed to voting
        showMessage('Everyone is ready! Starting voting now...', 'success');

        // Clear the timer
        if (timerInterval) {
            clearInterval(timerInterval);
            timerInterval = null;
        }

        // Wait a moment then proceed to voting
        setTimeout(() => {
            startVoting();
        }, 2000);
    }
}

function startTimer(seconds, onComplete) {
    gameTimer.classList.remove('hidden');

    // Store end time as timestamp
    timerEndTime = Date.now() + (seconds * 1000);

    const updateTimerDisplay = () => {
        const now = Date.now();
        const remaining = Math.max(0, Math.floor((timerEndTime - now) / 1000));

        const minutes = Math.floor(remaining / 60);
        const secs = remaining % 60;
        timerDisplay.textContent = `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;

        if (remaining <= 0) {
            clearInterval(timerInterval);
            timerInterval = null;
            if (onComplete) onComplete();
        }
    };

    // Update immediately
    updateTimerDisplay();

    // Then update every second
    timerInterval = setInterval(updateTimerDisplay, 1000);
}

// ==================== //
// VOTING PHASE         //
// ==================== //

async function startVoting() {
    gamePhase = 'voting';
    hideAllSections();

    phaseIcon.textContent = '🗳️';
    phaseTitle.textContent = 'Voting Time';

    // Narrate voting phase
    playNarration('Time to vote. Everyone, point to who you think is a werewolf.');
    await wait(2000);

    votingSection.classList.remove('hidden');

    totalVotes.textContent = currentSession.players.length;
    votesReceived.textContent = '0';

    displayVotingOptions();

    showMessage('Vote for who you think is a werewolf!', 'info');
}

function displayVotingOptions() {
    votingGrid.innerHTML = '';

    currentSession.players.forEach(player => {
        const voteCard = document.createElement('div');
        voteCard.className = 'vote-option';
        voteCard.dataset.playerId = player.id;

        voteCard.innerHTML = `
            <div class="player-icon">👤</div>
            <div class="player-name">${escapeHtml(player.name)}</div>
        `;

        voteCard.addEventListener('click', () => {
            if (hasActed) return; // Already voted

            if (confirm(`Vote to eliminate ${player.name}?`)) {
                castVote(player.id);
                voteCard.classList.add('voted');
                document.querySelectorAll('.vote-option').forEach(c => c.classList.add('disabled'));
                hasActed = true;
            }
        });

        votingGrid.appendChild(voteCard);
    });
}

async function castVote(playerId) {
    // Save vote
    currentPlayer.vote = playerId;
    saveSessionToStorage();

    showMessage('Vote cast!', 'success');

    // Execute bot votes
    await executeBotVotes();

    // Simulate waiting for others
    setTimeout(() => {
        finishVoting();
    }, 3000);
}

async function executeBotVotes() {
    console.log('🗳️ executeBotVotes START');

    // Get all bot players
    const botPlayers = currentSession.players.filter(p => p.isBot);
    console.log(`Found ${botPlayers.length} bot players`);

    // NO NEED to create new bots here - they should already exist from lobby
    // Just use the BotManager to execute votes
    await botManager.executeBotVotes(currentSession);

    // Save updated session
    saveSessionToStorage();

    console.log('🗳️ executeBotVotes END');
}

function finishVoting() {
    // Tally votes
    const votes = {};
    currentSession.players.forEach(player => {
        if (player.vote) {
            votes[player.vote] = (votes[player.vote] || 0) + 1;
        }
    });

    // Find player(s) with most votes
    const maxVotes = Math.max(...Object.values(votes));
    const eliminated = Object.keys(votes).filter(id => votes[id] === maxVotes);

    currentSession.eliminatedPlayers = eliminated;
    saveSessionToStorage();

    showResults();
}

// ==================== //
// RESULTS PHASE        //
// ==================== //

function showResults() {
    gamePhase = 'results';
    hideAllSections();

    phaseIcon.textContent = '🎊';
    phaseTitle.textContent = 'Game Over';

    resultsSection.classList.remove('hidden');

    displayEliminatedPlayers();
    displayFinalRoles();
    determineWinners();
}

function displayEliminatedPlayers() {
    eliminatedPlayer.innerHTML = '';

    if (currentSession.eliminatedPlayers.length === 0) {
        eliminatedPlayer.innerHTML = '<h3>No one was eliminated!</h3>';
    } else {
        const players = currentSession.eliminatedPlayers.map(id =>
            currentSession.players.find(p => p.id === id)
        );

        eliminatedPlayer.innerHTML = `
            <h3>Eliminated:</h3>
            ${players.map(p => `
                <div class="player-icon">💀</div>
                <div class="player-name">${escapeHtml(p.name)}</div>
            `).join('')}
        `;
    }
}

function displayFinalRoles() {
    finalRolesGrid.innerHTML = '';

    currentSession.players.forEach(player => {
        const role = getRoleById(player.currentRole);
        const card = document.createElement('div');
        card.className = 'final-role-card';

        card.innerHTML = `
            <div class="player-icon">${role.emoji}</div>
            <div class="player-name">${escapeHtml(player.name)}</div>
            <div class="role-name" style="background: ${getRoleTeamColor(role.team)}">${role.name}</div>
        `;

        finalRolesGrid.appendChild(card);
    });
}

function getRoleTeamColor(team) {
    const colors = {
        'werewolf': '#ff7675',
        'village': '#55efc4',
        'neutral': '#ffeaa7'
    };
    return colors[team] || '#e0e0e0';
}

function determineWinners() {
    // Check if any werewolves were eliminated
    const eliminatedWerewolf = currentSession.eliminatedPlayers.some(id => {
        const player = currentSession.players.find(p => p.id === id);
        const role = getRoleById(player.currentRole);
        return role.team === 'werewolf';
    });

    // Check if tanner was eliminated
    const eliminatedTanner = currentSession.eliminatedPlayers.some(id => {
        const player = currentSession.players.find(p => p.id === id);
        return player.currentRole === 'tanner';
    });

    let winnerText = '';

    if (eliminatedTanner) {
        winnerText = '🃏 Tanner Wins! Everyone else loses.';
    } else if (eliminatedWerewolf) {
        winnerText = '😇 Village Team Wins! At least one werewolf was eliminated.';
    } else {
        winnerText = '🐺 Werewolf Team Wins! No werewolves were eliminated.';
    }

    winnerAnnouncement.innerHTML = `<h3>${winnerText}</h3>`;
}

// ==================== //
// HELPER FUNCTIONS     //
// ==================== //

function hideAllSections() {
    yourCardSection.classList.add('hidden');
    actionPromptSection.classList.add('hidden');
    interactionSection.classList.add('hidden');
    discussionSection.classList.add('hidden');
    votingSection.classList.add('hidden');
    resultsSection.classList.add('hidden');
    waitingSection.classList.add('hidden');

    playerCardsGrid.classList.add('hidden');
    centerCardsSection.classList.add('hidden');
    actionButtons.classList.add('hidden'); // Always hide action buttons now
}

function showWaitingScreen(title, text) {
    hideAllSections();
    waitingSection.classList.remove('hidden');
    document.getElementById('waitingTitle').textContent = title;
    document.getElementById('waitingText').textContent = text;
}

// ==================== //
// INITIALIZATION       //
// ==================== //

function init() {
    console.log('Game initialized');

    if (!loadSession()) {
        return;
    }

    // Start the game
    startGame();
}

// ==================== //
// RESULTS BUTTONS      //
// ==================== //

// Add event listeners for results buttons
document.addEventListener('DOMContentLoaded', () => {
    const playAgainBtn = document.getElementById('playAgainBtn');
    const leaveLobbyBtn = document.getElementById('leaveLobbyBtn');

    if (playAgainBtn) {
        playAgainBtn.addEventListener('click', () => {
            console.log('Play Again clicked');
            // Reset game state before going back to lobby
            if (currentSession && currentSession.roomCode) {
                // Reset game-specific data
                currentSession.gameStarted = false;
                currentSession.players.forEach(player => {
                    delete player.originalRole;
                    delete player.currentRole;
                    delete player.vote;
                    delete player.nightNotes;
                });
                delete currentSession.centerCards;
                delete currentSession.gameState;
                delete currentSession.eliminatedPlayers;

                // Save the reset session
                saveSessionToStorage();

                // Go back to lobby
                window.location.href = `lobby.html?room=${currentSession.roomCode}`;
            } else {
                window.location.href = 'index.html';
            }
        });
    }

    if (leaveLobbyBtn) {
        leaveLobbyBtn.addEventListener('click', () => {
            console.log('Leave Game clicked');
            // Clear session and go back to home
            if (currentSession && currentSession.roomCode) {
                localStorage.removeItem(`session_${currentSession.roomCode}`);
            }
            localStorage.removeItem('currentSession');
            localStorage.removeItem('playerId');
            window.location.href = 'index.html';
        });
    }
});

// Wait for DOM to be ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}