// ============================================================
// 02_state.js — Global game state & session stat trackers
// ============================================================
 
        let state = {
            totalTurns: 1,
            currentTurn: 'player', 
            phase: 'MAIN', 
            selectedCardId: null, 
            targeting: { active: false, sourceCardId: null, validTargets: [], sourcePlayer: null, targetEnemy: false },
            actionPlayedThisTurn: false,
            cardsPlayedThisTurn: 0,
            attacksMadeThisTurn: 0,
            sharedFieldCard: null,
            sharedFieldCardOwner: null,
            players: {
                player: { hp: 20, cost: 3, deck: [], hand: [], field: [], graveyard: [], spaceZone: [], moonCycle: 0, apotheosisTurns: 0, poseidonPermanentReduce: false, poseidonReduceTurns: 0 },
                ai: { hp: 20, cost: 3, deck: [], hand: [], field: [], graveyard: [], spaceZone: [], moonCycle: 0, apotheosisTurns: 0, poseidonPermanentReduce: false, poseidonReduceTurns: 0 }
            }
        };
 
        let selectedPlayerTheme = "isekai_adventure";
        let selectedAITheme = "isekai_adventure";
        let gameMode = "ai";
        let isChaosMode = false; // Chaos Mode flag
 
        // ── Session Stats Tracker ─────────────────────────────────
        let sessionStats = {
            damageDealt: 0, damageToChars: 0, kills: 0,
            cardsPlayed: {}, cardsPlayedTotal: 0, turnsPlayed: 0,
        };
        // P2 stats tracked by P1 host
        let sessionStatsP2 = {
            damageDealt: 0, damageToChars: 0, kills: 0,
            cardsPlayed: {}, cardsPlayedTotal: 0, turnsPlayed: 0,
        };
        function resetSessionStats() {
            sessionStats   = { damageDealt:0, damageToChars:0, kills:0, cardsPlayed:{}, cardsPlayedTotal:0, turnsPlayed:0 };
            sessionStatsP2 = { damageDealt:0, damageToChars:0, kills:0, cardsPlayed:{}, cardsPlayedTotal:0, turnsPlayed:0 };
        }
        function trackCardPlayed(cardName) {
            if (!cardName) return;
            sessionStats.cardsPlayed[cardName] = (sessionStats.cardsPlayed[cardName] || 0) + 1;
            sessionStats.cardsPlayedTotal++;
        }
        function trackDamageBase(dmg, forPlayer) {
            if (dmg <= 0) return;
            const role = forPlayer || (gameMode === 'online' ? myRole : 'player');
            if (role === myRole || gameMode !== 'online') sessionStats.damageDealt += dmg;
            else if (gameMode === 'online' && myRole === 'player') sessionStatsP2.damageDealt += dmg;
        }
        function trackDamageChar(dmg, forPlayer) {
            if (dmg <= 0) return;
            const role = forPlayer || (gameMode === 'online' ? myRole : 'player');
            if (role === myRole || gameMode !== 'online') sessionStats.damageToChars += dmg;
            else if (gameMode === 'online' && myRole === 'player') sessionStatsP2.damageToChars += dmg;
        }
        function trackKill(forPlayer) {
            const role = forPlayer || (gameMode === 'online' ? myRole : 'player');
            if (role === myRole || gameMode !== 'online') sessionStats.kills++;
            else if (gameMode === 'online' && myRole === 'player') sessionStatsP2.kills++;
        }
        function getMostPlayedCard() {
            const entries = Object.entries(sessionStats.cardsPlayed);
            if (!entries.length) return null;
            return entries.sort((a,b) => b[1]-a[1])[0];
        }
 
        function getMaxFieldSlots(playerKey) {
            if (state.sharedFieldCard && state.sharedFieldCard.name === 'Colosseum') return 1;
            return (state.sharedFieldCard && state.sharedFieldCard.name === 'Chess Board' && state.sharedFieldCardOwner === playerKey) ? 6 : 5;
        }
 
        // Resolve ชื่อจริงของการ์ด — รองรับ Shadow/Loki Clone และ Rimuru stolen ability
        function getEffectiveName(c) {
            if (c.name.startsWith('Shadow Token') || c.name.startsWith('Shadow army') || c.name.includes('Loki Clone')) return c.originalName || c.name;
            if (c.name === 'Rimuru Tempest' && c.stolenOriginalName) return c.stolenOriginalName;
            if (c.name.startsWith('LEGO ') && c.originalName) return c.originalName; // LEGO copy ใช้ originalName
            return c.name;
        }
 
        let draftedP1Deck = [];
        let draftedP2Deck = [];
 
