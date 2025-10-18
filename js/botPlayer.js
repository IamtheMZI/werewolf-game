// ==================== //
// BOT PLAYER LOGIC     //
// ==================== //

// Bot names pool
const BOT_NAMES = [
    'Alice', 'Bob', 'Charlie', 'Diana', 'Eve', 'Frank', 'Grace',
    'Henry', 'Iris', 'Jack', 'Kate', 'Leo', 'Mia', 'Noah',
    'Olivia', 'Peter', 'Quinn', 'Ruby', 'Sam', 'Tina'
];

const BOT_ICONS = ['🤖', '👾', '🎮', '🎯', '🎲', '🎪', '🎨', '🎭', '🎬', '🎸'];

// Bot decision-making logic
class BotPlayer {
    constructor(id, name, session) {
        this.id = id;
        this.name = name;
        this.session = session;
        this.isBot = true;
        this.thinkingTime = 1000 + Math.random() * 2000; // 1-3 seconds
    }

    // Get this bot's player object from session
    getPlayer() {
        return this.session.players.find(p => p.id === this.id);
    }

    // Perform night action based on role
    async performNightAction() {
        const player = this.getPlayer();
        if (!player) return;

        const role = player.originalRole;

        // Wait random time to simulate thinking
        await this.delay(this.thinkingTime);

        switch(role) {
            case 'werewolf':
                // Werewolves just see each other, no action needed
                break;

            case 'minion':
                // Minion just sees werewolves, no action needed
                break;

            case 'seer':
                return await this.seerAction();

            case 'robber':
                return await this.robberAction();

            case 'drunk':
                return await this.drunkAction();

            case 'insomniac':
                // Insomniac just checks self, no action needed
                break;

            default:
                // No action roles: villager, tanner, dream-wolf
                break;
        }
    }

    // Seer bot logic: randomly choose to view player or center cards
    async seerAction() {
        const player = this.getPlayer();
        const otherPlayers = this.session.players.filter(p => p.id !== this.id);

        const choice = Math.random();

        if (choice < 0.6 && otherPlayers.length > 0) {
            // 60% chance: View a random player's card
            const target = otherPlayers[Math.floor(Math.random() * otherPlayers.length)];
            return {
                action: 'view_player',
                target: target.id,
                result: target.originalRole
            };
        } else {
            // 40% chance: View two center cards
            return {
                action: 'view_center',
                cards: [0, 1] // View first two center cards
            };
        }
    }

    // Robber bot logic: randomly swap with a player (prefer non-werewolves if possible)
    async robberAction() {
        const player = this.getPlayer();
        const otherPlayers = this.session.players.filter(p => p.id !== this.id);

        if (otherPlayers.length === 0) return null;

        // Randomly pick a player to rob
        const target = otherPlayers[Math.floor(Math.random() * otherPlayers.length)];

        // Perform swap
        const tempRole = player.currentRole;
        player.currentRole = target.currentRole;
        target.currentRole = tempRole;

        return {
            action: 'swap',
            target: target.id,
            newRole: player.currentRole
        };
    }

    // Drunk bot logic: randomly swap with a center card
    async drunkAction() {
        const player = this.getPlayer();
        const centerIndex = Math.floor(Math.random() * 3); // Random center card (0-2)
        const centerCard = this.session.centerCards[centerIndex];

        // Perform blind swap
        const tempRole = player.currentRole;
        player.currentRole = centerCard.currentRole;
        centerCard.currentRole = tempRole;

        return {
            action: 'swap_blind',
            centerIndex: centerIndex
        };
    }

    // Bot voting logic
    async makeVote() {
        await this.delay(this.thinkingTime);

        const player = this.getPlayer();
        const currentRole = player.currentRole;
        const otherPlayers = this.session.players.filter(p => p.id !== this.id);

        if (otherPlayers.length === 0) return null;

        // Basic voting strategy based on role
        let votableTargets = [...otherPlayers];

        // Werewolves try to vote for non-werewolves
        if (currentRole === 'werewolf' || currentRole === 'dream-wolf') {
            const nonWerewolves = otherPlayers.filter(p =>
                p.currentRole !== 'werewolf' && p.currentRole !== 'dream-wolf'
            );
            if (nonWerewolves.length > 0) {
                votableTargets = nonWerewolves;
            }
        }

        // Minion tries to protect werewolves
        if (currentRole === 'minion') {
            const nonWerewolves = otherPlayers.filter(p =>
                p.currentRole !== 'werewolf' && p.currentRole !== 'dream-wolf'
            );
            if (nonWerewolves.length > 0) {
                votableTargets = nonWerewolves;
            }
        }

        // Tanner votes randomly (wants to die)
        if (currentRole === 'tanner') {
            // 30% chance to vote for self (but not implemented in current game)
            votableTargets = [...otherPlayers];
        }

        // Village team tries to vote out suspicious players
        // For now, just random from votable targets
        const target = votableTargets[Math.floor(Math.random() * votableTargets.length)];

        return {
            votedFor: target.id
        };
    }

    // Helper delay function
    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}

// Bot Manager
class BotManager {
    constructor() {
        this.bots = new Map();
    }

    createBot(session) {
        const usedNames = session.players.map(p => p.name);
        const availableNames = BOT_NAMES.filter(name => !usedNames.includes(name));

        if (availableNames.length === 0) {
            // Fallback to Bot1, Bot2, etc.
            const botNumber = session.players.filter(p => p.isBot).length + 1;
            availableNames.push(`Bot${botNumber}`);
        }

        const botName = availableNames[Math.floor(Math.random() * availableNames.length)];
        const botId = 'bot_' + Math.random().toString(36).substr(2, 9) + Date.now();

        const botPlayer = {
            id: botId,
            name: botName + ' 🤖',
            isHost: false,
            isReady: true,
            isBot: true
        };

        const bot = new BotPlayer(botId, botName, session);
        this.bots.set(botId, bot);

        return botPlayer;
    }

    getBot(botId) {
        return this.bots.get(botId);
    }

    async executeBotNightActions(session) {
        const botPlayers = session.players.filter(p => p.isBot);

        for (const player of botPlayers) {
            let bot = this.getBot(player.id);

            // Create bot instance if it doesn't exist
            if (!bot) {
                console.log(`Creating bot instance for ${player.name}`);
                bot = new BotPlayer(player.id, player.name, session);
                this.bots.set(player.id, bot);
            }

            await bot.performNightAction();
        }
    }

    async executeBotVotes(session) {
        const botPlayers = session.players.filter(p => p.isBot);

        for (const player of botPlayers) {
            let bot = this.getBot(player.id);

            // Create bot instance if it doesn't exist
            if (!bot) {
                console.log(`Creating bot instance for ${player.name}`);
                bot = new BotPlayer(player.id, player.name, session);
                this.bots.set(player.id, bot);
            }

            const vote = await bot.makeVote();
            if (vote) {
                player.vote = vote.votedFor;
            }
        }
    }

    removeBots() {
        this.bots.clear();
    }
}

// Export for use in other modules
export { BotPlayer, BotManager, BOT_NAMES };