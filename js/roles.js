// ==================== //
// ROLE DEFINITIONS     //
// ==================== //

export const ROLES = {
    WEREWOLF: {
        id: 'werewolf',
        name: 'Werewolf',
        emoji: '🐺',
        image: 'images/cards/werewolf.png',
        team: 'werewolf',
        description: 'You are a Werewolf! Your goal is to avoid being voted out. During the night, you wake with other werewolves to see who your teammates are.',
        nightOrder: 1,
        nightAction: 'view_werewolves',
        winCondition: 'No werewolves are killed in the vote'
    },

    DREAM_WOLF: {
        id: 'dream-wolf',
        name: 'Dream Wolf',
        emoji: '🌙',
        image: 'images/cards/werewolf.png',
        team: 'werewolf',
        description: 'You are the Dream Wolf! You are on the werewolf team, but you sleep during the night and do not know who the other werewolves are.',
        nightOrder: null,
        nightAction: 'none',
        winCondition: 'No werewolves are killed in the vote'
    },

    MINION: {
        id: 'minion',
        name: 'Minion',
        emoji: '😈',
        image: null,
        team: 'werewolf',
        description: 'You are the Minion! You see who the werewolves are, but they do not see you. You win if the werewolf team wins, even if you are killed.',
        nightOrder: 2,
        nightAction: 'view_werewolves',
        winCondition: 'Werewolf team wins'
    },

    SEER: {
        id: 'seer',
        name: 'Seer',
        emoji: '🔮',
        image: 'images/cards/seer.png',
        team: 'village',
        description: 'You are the Seer! Look at one other player\'s card OR look at two cards from the center.',
        nightOrder: 3,
        nightAction: 'view_card',
        winCondition: 'At least one werewolf is killed'
    },

    ROBBER: {
        id: 'robber',
        name: 'Robber',
        emoji: '🔄',
        image: 'images/cards/robber.png',
        team: 'village',
        description: 'You are the Robber! You may swap your card with another player\'s card, then look at your new card. Your team may change!',
        nightOrder: 4,
        nightAction: 'swap_and_view',
        winCondition: 'Depends on final role'
    },

    TROUBLEMAKER: {
        id: 'troublemaker',
        name: 'Troublemaker',
        emoji: '🎭',
        image: 'images/cards/troublemaker.png',
        team: 'village',
        description: 'You are the Troublemaker! You may swap cards between two other players. They do not know their cards were swapped.',
        nightOrder: 5,
        nightAction: 'swap_others',
        winCondition: 'At least one werewolf is killed'
    },

    DRUNK: {
        id: 'drunk',
        name: 'Drunk',
        emoji: '😴',
        image: 'images/cards/drunk.png',
        team: 'village',
        description: 'You are the Drunk! You must swap your card with a card from the center, but you do not look at your new card.',
        nightOrder: 6,
        nightAction: 'swap_blind',
        winCondition: 'Depends on final role'
    },

    INSOMNIAC: {
        id: 'insomniac',
        name: 'Insomniac',
        emoji: '🧝',
        image: 'images/cards/insomniac.png',
        team: 'village',
        description: 'You are the Insomniac! At the end of the night, you wake up and check if your card was swapped.',
        nightOrder: 7,
        nightAction: 'check_self',
        winCondition: 'At least one werewolf is killed'
    },

    VILLAGER: {
        id: 'villager',
        name: 'Villager',
        emoji: '😇',
        image: 'images/cards/villager.png',
        team: 'village',
        description: 'You are a Villager! You have no special abilities, but your vote is crucial to finding the werewolves.',
        nightOrder: null,
        nightAction: 'none',
        winCondition: 'At least one werewolf is killed'
    },

    TANNER: {
        id: 'tanner',
        name: 'Tanner',
        emoji: '🃏',
        image: 'images/cards/tanner.png',
        team: 'neutral',
        description: 'You are the Tanner! You win ONLY if you are killed. You want to be voted out!',
        nightOrder: null,
        nightAction: 'none',
        winCondition: 'You are killed in the vote'
    },

    HUNTER: {
        id: 'hunter',
        name: 'Hunter',
        emoji: '🏹',
        image: 'images/cards/hunter.png',
        team: 'village',
        description: 'You are the Hunter! If you are killed, the player you voted for also dies.',
        nightOrder: null,
        nightAction: 'none',
        winCondition: 'At least one werewolf is killed'
    },

    MASON: {
        id: 'mason',
        name: 'Mason',
        emoji: '🔨',
        image: null,
        team: 'village',
        description: 'You are a Mason! You wake with the other Mason to see each other. If you are alone, there is another Mason in the center.',
        nightOrder: 0,
        nightAction: 'view_masons',
        winCondition: 'At least one werewolf is killed'
    }
};

// ==================== //
// ROLE CONFIGURATION   //
// ==================== //

export const ROLE_CONFIGS = {
    3: {
        roles: ['werewolf', 'werewolf', 'seer', 'robber', 'troublemaker', 'villager'],
        centerCards: 3
    },
    4: {
        roles: ['werewolf', 'werewolf', 'seer', 'robber', 'troublemaker', 'drunk', 'villager'],
        centerCards: 3
    },
    5: {
        roles: ['werewolf', 'werewolf', 'seer', 'robber', 'troublemaker', 'drunk', 'insomniac', 'villager'],
        centerCards: 3
    },
    6: {
        roles: ['werewolf', 'werewolf', 'minion', 'seer', 'robber', 'troublemaker', 'drunk', 'insomniac', 'villager'],
        centerCards: 3
    },
    7: {
        roles: ['werewolf', 'werewolf', 'minion', 'seer', 'robber', 'troublemaker', 'drunk', 'insomniac', 'villager', 'villager'],
        centerCards: 3
    },
    8: {
        roles: ['werewolf', 'werewolf', 'minion', 'seer', 'robber', 'troublemaker', 'drunk', 'insomniac', 'tanner', 'villager', 'villager'],
        centerCards: 3
    }
};

// ==================== //
// HELPER FUNCTIONS     //
// ==================== //

export function getRoleById(roleId) {
    return Object.values(ROLES).find(role => role.id === roleId);
}

export function getRolesByTeam(team) {
    return Object.values(ROLES).filter(role => role.team === team);
}

export function getRolesInNightOrder() {
    return Object.values(ROLES)
        .filter(role => role.nightOrder !== null)
        .sort((a, b) => a.nightOrder - b.nightOrder);
}

export function getDefaultRolesForPlayerCount(playerCount) {
    if (playerCount < 3) return null;
    if (playerCount > 8) playerCount = 8; // Cap at 8 for default configs

    const config = ROLE_CONFIGS[playerCount] || ROLE_CONFIGS[8];
    return config.roles;
}

export function generateRoleDistribution(playerCount, selectedRoles) {
    // Total cards needed = playerCount + 3 (center cards)
    const totalCards = playerCount + 3;
    const roleList = [];

    // Ensure at least one werewolf
    const werewolfCount = playerCount >= 5 ? 2 : 1;
    for (let i = 0; i < werewolfCount; i++) {
        roleList.push('werewolf');
    }

    // Add selected special roles
    selectedRoles.forEach(roleId => {
        if (roleId !== 'werewolf' && roleList.length < totalCards) {
            roleList.push(roleId);
        }
    });

    // Fill remaining slots with villagers
    while (roleList.length < totalCards) {
        roleList.push('villager');
    }

    // Shuffle the roles
    return shuffleArray(roleList);
}

export function shuffleArray(array) {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
}

export function getRoleTeamColor(team) {
    const colors = {
        'werewolf': '#ff7675',
        'village': '#55efc4',
        'neutral': '#ffeaa7'
    };
    return colors[team] || '#e0e0e0';
}

export function getRoleTeamName(team) {
    const names = {
        'werewolf': 'Werewolf Team',
        'village': 'Village Team',
        'neutral': 'Neutral'
    };
    return names[team] || 'Unknown';
}

export function canRoleSwapCards(roleId) {
    const role = getRoleById(roleId);
    return role && ['swap_and_view', 'swap_others', 'swap_blind'].includes(role.nightAction);
}

export function canRoleViewCards(roleId) {
    const role = getRoleById(roleId);
    return role && ['view_card', 'view_werewolves', 'view_masons', 'swap_and_view', 'check_self'].includes(role.nightAction);
}

export default ROLES;