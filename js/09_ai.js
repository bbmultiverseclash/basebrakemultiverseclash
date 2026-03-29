// ============================================================
// 09_ai.js — AI system: Minimax with Alpha-Beta Pruning
// ============================================================

const AI_SYNERGY = [
    // ── Isekai ──
    ['Hades','Cerberus'], ['Kirito','Asuna'], ['Rem','Ram'], ['Rimuru Tempest','Jura Tempest'],
    ['Rimuru Tempest','Slime'], ['Aqua','Kazuma Satou'], ['Ainz Ooal Gown','Shalltear'],
    ['Subaru','Emilia'], ['Arthur Leywin','Aether Core'], ['Reinhard','Dragon Sword Reid'],
    // ── Mythology ──
    ['Zeus','Cronos'], ['Hades','Cronos'], ['Poseidon','Cronos'], ['Poseidon','Trident'],
    ['Odin','Gungnir'], ['King Arthur','Excalibur'], ['King Arthur','Holy Grail'],
    ['Rama','The Arrow of Brahma'], ['Fairy','Nature Realm Wand'], ['Sun Wukong','Ruyi Jingu'],
    ['Thor','Mjolnir'], ['Hercules','Bloody Fang'], ['Jormungandr','Holy Grail'],
    // ── Suankularb ──
    ['Phatchee','Teak'],
    // ── Toy Trooper ──
    ['Majorette','Hot Wheel'], ['Teddy Bear','Toy Soldier'], ['Toy-Rex','Toy Box Surprise'],
    // ── Animal Kingdom ──
    ['Wolf','Fullmoon'], ['Wolf','Call of the Wild'], ['Skeleton King','Skeleton'],
    // ── Humanity ──
    ['H.P. Lovecraft','Skull Devourer'], ['Sung Jin-Woo','Shadow'], ['Julius Caesar','Heavenly Soldier'],
    ['Kim Dokja','Fran'],
    // ── Cross-deck ──
    ['Simo Häyhä','Ruined Asguard'], ['Goblin','Goblin Lord'],
];

const AI_ITEM_TARGET = {
    'Excalibur': c => getEffectiveName(c)==='King Arthur' ? 999 : -999,
    'Gungnir': c => getEffectiveName(c)==='Odin' ? 999 : -999,
    'Ruyi Jingu': c => getEffectiveName(c)==='Sun Wukong' ? 999 : -999,
    'Trident': c => getEffectiveName(c)==='Poseidon' ? 999 : -999,
    'Sword of Oni': c => getEffectiveName(c)==='Oni' ? 999 : -999,
    'Nature Realm Wand': c => getEffectiveName(c)==='Fairy' ? 999 : -999,
    'The Arrow of Brahma': c => getEffectiveName(c)==='Rama' ? 999 : -999,
    'Dragon Sword Reid': c => getEffectiveName(c)==='Reinhard' ? 999 : -999,
    'Aether Core': c => getEffectiveName(c)==='Arthur Leywin' ? 999 : -999,
    'Mjolnir': c => getEffectiveName(c)==='Thor' ? 999 : -999,
    'Bloody Fang': c => getCharStats(c).atk * 3,
    'Sword': c => getCharStats(c).atk,
    'Attack Rune': c => getCharStats(c).atk,
    'BB Gun': c => getCharStats(c).atk,
    'Nerf Gun': c => getCharStats(c).atk,
    'Balloon Sword': c => getCharStats(c).atk,
    'Bee Eye Glass': c => getCharStats(c).atk,
    'Water Balloon': c => getCharStats(c).atk,
    'Shield': c => getCharStats(c).hp,
    'Defend Rune': c => getCharStats(c).hp,
    'Escutcheon': c => getCharStats(c).hp,
    'Clay Armor': c => getCharStats(c).hp,
    'Air Balloon': c => getCharStats(c).hp,
    'Ring of Ainz Ooal Gown': c => getCharStats(c).atk + getCharStats(c).hp,
    'Shield of the Hero': c => getCharStats(c).hp,
};

function aiCardVal(c, ownerKey, st) {
    const s = getCharStats(c);
    const multiAtk = s.maxAttacks > 1 ? 1.5 : 1.0;
    const frozen = c.status && (c.status.includes('Freeze') || c.status.includes('Paralyze')) ? 0.25 : 1.0;
    const synergyBonus = AI_SYNERGY.reduce((acc, pair) => {
        const eff = getEffectiveName(c);
        if (!pair.includes(eff)) return acc;
        const partner = pair.find(p => p !== eff);
        const field = st.players[ownerKey].field;
        const hand  = st.players[ownerKey].hand;
        const hasPartner = [...field,...hand].some(x => getEffectiveName(x) === partner);
        return acc + (hasPartner ? 8 : 0);
    }, 0);
    return (s.atk * 2.5 + s.hp * 1.2) * multiAtk * frozen + synergyBonus;
}

function aiBoardScore(st) {
    st = st || state;
    const ai = st.players.ai;
    const pl = st.players.player;
    const aiFieldVal = ai.field.reduce((s,c)=>s+aiCardVal(c,'ai', st),0);
    const plFieldVal = pl.field.reduce((s,c)=>s+aiCardVal(c,'player', st),0);
    const aiAtk = ai.field.filter(c=>c.attacksLeft>0&&!c.status.includes('Freeze')&&!c.status.includes('Paralyze'))
                    .reduce((s,c)=>s+getCharStats(c).atk,0);
    const plAtk = pl.field.reduce((s,c)=>s+getCharStats(c).atk*(c.maxAttacks||1),0);

    const aiHpScore = ai.hp*4 - (ai.hp<=8?15:0) - (ai.hp<=5?35:0) - (ai.hp<=3?60:0);
    const plHpScore = pl.hp*4;

    const lethalBonus = (aiAtk>=pl.hp && pl.field.length===0) ? 10000 : 0;
    const nearLethal = pl.hp<=8 ? (8-pl.hp)*5 : 0;
    const handAdv = (ai.hand.length - pl.hand.length) * 2;
    const fieldCtrl = (ai.field.length - pl.field.length) * 4;
    const aiTaunt = ai.field.filter(c=>c.text&&c.text.toLowerCase().includes('taunt')).length;
    const tauntBonus = aiTaunt * 6;
    const dangerPenalty = plAtk >= ai.hp ? -40 : 0;

    return aiHpScore - plHpScore + aiFieldVal - plFieldVal
         + handAdv + fieldCtrl + lethalBonus + nearLethal
         + tauntBonus + dangerPenalty;
}

// Deep copy state for Minimax simulation
function cloneState(st) {
    return JSON.parse(JSON.stringify(st));
}

// Minimax with Alpha-Beta Pruning for card playing
function minimaxPlayCard(st, depth, alpha, beta, isMaximizing) {
    if (depth === 0 || st.players.ai.hp <= 0 || st.players.player.hp <= 0) {
        return { score: aiBoardScore(st), move: null };
    }

    const playerKey = isMaximizing ? 'ai' : 'player';
    const p = st.players[playerKey];
    const maxSlots = 5; // Simplified

    const playable = p.hand.filter(c => {
        const cost = c.cost - (c.costReducer || 0); // Simplified cost
        if (cost > p.cost) return false;
        if (c.type === 'Action' && st.actionPlayedThisTurn) return false;
        if (c.type === 'Character' && p.field.length >= maxSlots) return false;
        return true;
    });

    if (playable.length === 0) {
        return { score: aiBoardScore(st), move: null };
    }

    let bestMove = null;

    if (isMaximizing) {
        let maxEval = -Infinity;
        for (let card of playable) {
            const nextState = cloneState(st);
            const np = nextState.players.ai;
            const cidx = np.hand.findIndex(c => c.id === card.id);
            const c = np.hand.splice(cidx, 1)[0];
            np.cost -= Math.max(0, c.cost - (c.costReducer || 0));
            if (c.type === 'Character') {
                c.attacksLeft = c.maxAttacks || 1;
                np.field.push(c);
            }
            
            const eval = minimaxPlayCard(nextState, depth - 1, alpha, beta, false).score;
            if (eval > maxEval) {
                maxEval = eval;
                bestMove = card;
            }
            alpha = Math.max(alpha, eval);
            if (beta <= alpha) break;
        }
        return { score: maxEval, move: bestMove };
    } else {
        let minEval = Infinity;
        for (let card of playable) {
            const nextState = cloneState(st);
            const np = nextState.players.player;
            const cidx = np.hand.findIndex(c => c.id === card.id);
            const c = np.hand.splice(cidx, 1)[0];
            np.cost -= Math.max(0, c.cost - (c.costReducer || 0));
            if (c.type === 'Character') {
                c.attacksLeft = c.maxAttacks || 1;
                np.field.push(c);
            }
            
            const eval = minimaxPlayCard(nextState, depth - 1, alpha, beta, true).score;
            if (eval < minEval) {
                minEval = eval;
                bestMove = card;
            }
            beta = Math.min(beta, eval);
            if (beta <= alpha) break;
        }
        return { score: minEval, move: bestMove };
    }
}

function aiCheckLethal() {
    const ai = state.players.ai;
    const pl = state.players.player;
    const hasBlocker = pl.field.some(c => getCharStats(c).hp > 0 && !c.status.includes('Levitate'));
    if (hasBlocker) return false;
    const totalAtk = ai.field
        .filter(c=>c.attacksLeft>0 && !c.status.includes('Freeze') && !c.status.includes('Paralyze') && !c.status.includes('Levitate'))
        .reduce((s,c)=>s+getCharStats(c).atk,0);
    return totalAtk >= pl.hp;
}

function aiBestCardToPlay() {
    const ai = state.players.ai;
    const pl = state.players.player;

    if (aiCheckLethal() && pl.field.length===0) return null;

    // Use Minimax to find the best card to play (Depth 2)
    const result = minimaxPlayCard(state, 2, -Infinity, Infinity, true);
    
    if (result.move) {
        // Find the actual card in the current state
        return ai.hand.find(c => c.id === result.move.id);
    }
    return null;
}

function aiPickItemTarget(card) {
    const ai = state.players.ai;
    const pl = state.players.player;
    const eff = getEffectiveName(card);
    const scorer = AI_ITEM_TARGET[eff];
    if (!scorer) return null;
    const field = card.targetEnemy ? pl.field : ai.field;
    const alive = field.filter(c=>getCharStats(c).hp>0);
    if (!alive.length) return null;
    return alive.sort((a,b)=>scorer(b)-scorer(a))[0];
}

// Minimax for Combat Phase
function minimaxAttack(st, depth, alpha, beta, isMaximizing) {
    if (depth === 0 || st.players.ai.hp <= 0 || st.players.player.hp <= 0) {
        return { score: aiBoardScore(st), move: null };
    }

    const ai = st.players.ai;
    const pl = st.players.player;

    const attackers = ai.field.filter(c => c.attacksLeft > 0 && !c.status.includes('Freeze') && !c.status.includes('Paralyze'));
    
    if (attackers.length === 0) {
        return { score: aiBoardScore(st), move: null };
    }

    let bestMove = null;
    let maxEval = -Infinity;

    const attacker = attackers[0]; // Try the first available attacker
    
    // Possible targets: enemy characters + enemy base
    const tauntChars = pl.field.filter(c => getCharStats(c).hp > 0 && c.text && c.text.toLowerCase().includes('taunt'));
    let targets = [];
    if (tauntChars.length > 0) {
        targets = [...tauntChars];
    } else {
        targets = [...pl.field.filter(c => getCharStats(c).hp > 0), 'base'];
    }
    
    let validMovesFound = false;

    for (let target of targets) {
        const nextState = cloneState(st);
        const nAi = nextState.players.ai;
        const nPl = nextState.players.player;
        const nAttacker = nAi.field.find(c => c.id === attacker.id);
        
        if (!nAttacker) continue;
        nAttacker.attacksLeft -= 1;

        if (target === 'base') {
            const hasBlocker = nPl.field.some(c => getCharStats(c).hp > 0 && !c.status.includes('Levitate'));
            if (!hasBlocker) {
                nPl.hp -= 1;
                validMovesFound = true;
            } else {
                continue; // Invalid move
            }
        } else {
            const nTarget = nPl.field.find(c => c.id === target.id);
            if (!nTarget) continue;
            nTarget.hp -= getCharStats(nAttacker).atk;
            if (nTarget.hp <= 0) {
                nPl.field = nPl.field.filter(c => c.id !== nTarget.id);
            }
            validMovesFound = true;
        }

        const eval = minimaxAttack(nextState, depth - 1, alpha, beta, false).score;
        if (eval > maxEval) {
            maxEval = eval;
            bestMove = { attackerId: attacker.id, targetId: target === 'base' ? null : target.id, isBase: target === 'base' };
        }
        alpha = Math.max(alpha, eval);
        if (beta <= alpha) break;
    }

    if (!validMovesFound) {
        return { score: aiBoardScore(st), move: null };
    }

    return { score: maxEval, move: bestMove };
}

function playAI() {
    if (state.currentTurn !== 'ai' || (gameMode !== 'ai' && !isChaosMode)) return;

    if (state.phase === 'MAIN') {
        let maxPlays = 10;
        const playNext = () => {
            if (state.currentTurn !== 'ai' || state.phase !== 'MAIN') return;
            if (maxPlays-- <= 0) { nextPhase(); return; }

            const best = aiBestCardToPlay();

            if (best) {
                if (best.requiresTarget) {
                    const ai = state.players.ai;
                    const pl = state.players.player;
                    const validT = best.targetEnemy ? pl.field : ai.field;
                    let target = aiPickItemTarget(best);
                    if (!target || !validT.some(x=>x.id===target.id)) {
                        target = validT.sort((a,b)=>aiCardVal(b,best.targetEnemy?'player':'ai', state)-aiCardVal(a,best.targetEnemy?'player':'ai', state))[0];
                    }
                    if (target) {
                        resolveTargetedPlay('ai', best.id, target.id);
                    }
                } else {
                    playCard('ai', best.id);
                }
                setTimeout(playNext, 700);
            } else {
                setTimeout(() => nextPhase(), 800);
            }
        };
        setTimeout(playNext, 600);

    } else if (state.phase === 'BATTLE') {
        if (state.totalTurns<=1) { setTimeout(()=>nextPhase(),800); return; }

        let failedAttempts = 0;
        let lastMoveStr = "";

        const processAIAttack = () => {
            if (state.phase!=='BATTLE' || state.currentTurn!=='ai') return;
            
            // Use Minimax to find the best attack (Depth 2)
            const result = minimaxAttack(state, 2, -Infinity, Infinity, true);

            if (result && result.move) {
                const moveStr = `${result.move.attackerId}->${result.move.targetId}`;
                if (moveStr === lastMoveStr) {
                    failedAttempts++;
                } else {
                    failedAttempts = 0;
                    lastMoveStr = moveStr;
                }

                if (failedAttempts > 2) {
                    // We are stuck in an infinite loop trying the same invalid move.
                    // Force the attacker to stop.
                    const attacker = state.players.ai.field.find(c => c.id === result.move.attackerId);
                    if (attacker) attacker.attacksLeft = 0;
                    failedAttempts = 0;
                    setTimeout(processAIAttack, 50);
                    return;
                }

                initiateAttack(result.move.attackerId, result.move.targetId, result.move.isBase);
                setTimeout(processAIAttack, 750);
            } else {
                // Exhaust remaining attackers and end turn
                state.players.ai.field.forEach(c => c.attacksLeft = 0);
                setTimeout(()=>nextPhase(),700);
            }
        };
        setTimeout(processAIAttack, 500);
    }
}
