// ============================================================
// 15_draft.js — Draft Duel Mode (Online)
// ============================================================
// Flow:
//   1) P1 creates room → both players enter draft lobby
//   2) Each round: 10 cards drawn (2 per deck × 5 decks)
//      Round odd  → P1 bans first, P2 bans, P1 picks, P2 picks 2, P1 picks
//      Round even → P2 bans first, P1 bans, P2 picks, P1 picks 2, P2 picks
//   3) Repeat until each player has 60 cards → start normal game
// ============================================================

// ── Draft Decks pool (exclude 'humanity' and 'suankularb') ──
const DRAFT_DECK_POOL = ['isekai_adventure', 'animal_kingdom', 'mythology', 'toy_trooper'];
const CARDS_PER_DECK_PER_ROUND = 2;   // 2 cards × 4 decks + 2 extra = 10 total? 
                                        // Actually: 2 × 5 = 10 (spec says 5 decks, 2 each = 10)
const CARDS_PER_ROUND = 10;            // 10 cards shown per round
const TOTAL_CARDS_TARGET = 60;         // each player needs 60 cards
const PICKS_PER_ROUND = 4;             // 1 ban + 1 ban + 1 pick + 2 picks + 1 pick = 4 picks total
// Each round: P1 gets 2 cards (pick 1 + pick 3), P2 gets 2 cards (pick 2×1 + pick 1)
// Rounds needed: 60 / 2 = 30 rounds

// ── Draft State ─────────────────────────────────────────────
let draftState = null;
/* draftState shape:
{
    round: 1,                     // current round number (1-based)
    phase: 'ban1'|'ban2'|'p1pick'|'p2pick2a'|'p2pick2b'|'p1pick2'|'p2pick'|'p1pick2a'|'p1pick2b'|'p2pick2',
    pool: [ {id, name, deck, ...cardData} ],   // 10 cards this round
    banned: [id, id],             // 2 banned card IDs
    picked: { player: [ids...], ai: [ids...] },   // cards chosen so far this round
    p1Deck: [{...cardData}...],   // P1's full collected pool (accumulated)
    p2Deck: [{...cardData}...],   // P2's full collected pool
    picksThisRound: 0,
}
*/

let draftRoomId = null;       // reuse online room system
let draftMyRole = null;       // 'player' = P1, 'ai' = P2
let draftCardIdCounter = 0;

// ── Helpers ─────────────────────────────────────────────────
function draftMakeId() { return 'draft_' + (++draftCardIdCounter); }

/**
 * Draw a random sample of unique cards from a deck.
 * Returns array of card objects with injected id/deck fields.
 */
function draftSampleFromDeck(deckKey, count, excludeNames = new Set()) {
    const deckData = CardSets[deckKey];
    if (!deckData) return [];
    const allNames = Object.keys(deckData).filter(n => !excludeNames.has(n));
    const shuffled = allNames.sort(() => Math.random() - 0.5);
    return shuffled.slice(0, count).map(name => ({
        ...deckData[name],
        id: draftMakeId(),
        deck: deckKey,
    }));
}

/**
 * Generate 10-card pool for one round.
 * 2 cards per deck from DRAFT_DECK_POOL (4 decks × 2 = 8) 
 * + 2 more random cards from any of the 4 decks to reach 10.
 * Note: spec says 5 decks, but DRAFT_DECK_POOL has 4. We draw 2×4=8 + 2 extras = 10.
 */
function draftGeneratePool(usedNamesP1 = new Set(), usedNamesP2 = new Set()) {
    const exclude = new Set([...usedNamesP1, ...usedNamesP2]);
    let pool = [];
    for (const dk of DRAFT_DECK_POOL) {
        pool = pool.concat(draftSampleFromDeck(dk, CARDS_PER_DECK_PER_ROUND, exclude));
        pool.forEach(c => exclude.add(c.name));
    }
    // Fill up to 10 with 2 extras from random decks
    const extras = 2;
    for (let i = 0; i < extras; i++) {
        const dk = DRAFT_DECK_POOL[Math.floor(Math.random() * DRAFT_DECK_POOL.length)];
        const extra = draftSampleFromDeck(dk, 1, exclude);
        if (extra.length) { pool.push(extra[0]); exclude.add(extra[0].name); }
    }
    return pool.slice(0, CARDS_PER_ROUND);
}

/** Determine pick phase sequence for a given round number */
function draftGetPhaseSequence(roundNum) {
    // Round odd (1,3,5…): P1 ban → P2 ban → P1 pick → P2 pick2 → P1 pick
    // Round even (2,4,6…): P2 ban → P1 ban → P2 pick → P1 pick2 → P2 pick
    if (roundNum % 2 === 1) {
        return ['ban_p1', 'ban_p2', 'pick_p1', 'pick_p2', 'pick_p2_2', 'pick_p1_2'];
    } else {
        return ['ban_p2', 'ban_p1', 'pick_p2', 'pick_p1', 'pick_p1_2', 'pick_p2_2'];
    }
}

/** Check whose action is needed in the current phase */
function draftWhoseAction(phase) {
    if (phase.endsWith('_p1') || phase.endsWith('_p1_2')) return 'player';
    if (phase.endsWith('_p2') || phase.endsWith('_p2_2')) return 'ai';
    return null;
}

/** Is a phase a ban phase? */
function draftIsBan(phase) { return phase.startsWith('ban_'); }

// ── Firebase paths ───────────────────────────────────────────
function draftRef(sub) {
    return db.ref('rooms/' + draftRoomId + '/draft/' + sub);
}

// ── Start Draft Duel ─────────────────────────────────────────
async function startDraftDuel() {
    // Re-use online infrastructure: create/join room just like online mode
    // But after room setup, go to draft lobby instead of normal game
    gameMode = 'online';
    isDraftMode = true;

    const inputId = (document.getElementById('room-id-input') || {}).value?.trim() || '';
    if (!inputId) {
        // P1 creates room
        draftMyRole = 'player';
        myRole = 'player';
        draftRoomId = generateRoomId();
        onlineRoomId = draftRoomId;
        if (document.getElementById('room-id-input')) 
            document.getElementById('room-id-input').value = draftRoomId;

        await db.ref('rooms/' + draftRoomId).set({
            hostUid: getUserKey() || 'guest',
            created: Date.now(),
            isDraft: true,
        });

        setOnlineStatus('📋 Draft Room: ' + draftRoomId + '  (ส่ง ID ให้เพื่อน)', '#4ade80');
        showDraftLobby('Waiting for opponent…');

        // Wait for P2
        db.ref('rooms/' + draftRoomId + '/guestReady').on('value', async snap => {
            if (!snap.val()) return;
            db.ref('rooms/' + draftRoomId + '/guestReady').off();
            setOnlineStatus('✅ เพื่อนเข้าร่วม! เริ่ม Draft…', '#4ade80');
            // P1 initialises draft state and pushes to Firebase
            await draftInitRound1();
        });
    } else {
        // P2 joins room
        draftMyRole = 'ai';
        myRole = 'ai';
        draftRoomId = inputId;
        onlineRoomId = draftRoomId;

        const snap = await db.ref('rooms/' + draftRoomId).get();
        if (!snap.val()?.isDraft) {
            setOnlineStatus('❌ ไม่พบ Draft Room "' + draftRoomId + '"', '#f87171');
            return;
        }

        await db.ref('rooms/' + draftRoomId).update({ guestReady: Date.now() });
        setOnlineStatus('⏳ รอ P1 เริ่ม Draft…', '#facc15');
        showDraftLobby('Waiting for host to start…');

        // Listen for draft state
        draftListenForState();
    }
}

/** P1 initialises round 1 and pushes state */
async function draftInitRound1() {
    const pool = draftGeneratePool();
    const phases = draftGetPhaseSequence(1);
    const state = {
        round: 1,
        phaseIdx: 0,
        phase: phases[0],
        phases,
        pool: pool.map(c => ({ ...c })),
        banned: [],
        picked: { player: [], ai: [] },
        p1Deck: [],
        p2Deck: [],
        done: false,
    };
    draftState = state;
    await draftRef('state').set(sanitiseDraftState(state));
    renderDraftUI();
    draftListenForState();
}

/** Sanitise for Firebase (remove circular refs, undefined) */
function sanitiseDraftState(st) {
    return JSON.parse(JSON.stringify(st));
}

/** P2 listens for state changes */
function draftListenForState() {
    draftRef('state').on('value', snap => {
        const val = snap.val();
        if (!val) return;
        draftState = val;
        if (val.done) {
            draftRef('state').off();
            draftFinish();
            return;
        }
        renderDraftUI();
    });
}

// ── Draft Action ─────────────────────────────────────────────
/**
 * Called when the local player clicks a card (ban or pick).
 * cardId: the pool card id.
 */
async function draftSelectCard(cardId) {
    if (!draftState) return;
    const phase = draftState.phase;
    const actor = draftWhoseAction(phase);
    if (actor !== draftMyRole) return; // not my turn

    const cardInPool = draftState.pool.find(c => c.id === cardId);
    if (!cardInPool) return;
    if (draftState.banned.includes(cardId)) return;
    if ([...draftState.picked.player, ...draftState.picked.ai].includes(cardId)) return;

    if (draftIsBan(phase)) {
        draftState.banned.push(cardId);
    } else {
        // pick
        draftState.picked[draftMyRole].push(cardId);
    }

    // Advance phase
    const phases = draftState.phases;
    const nextIdx = draftState.phaseIdx + 1;

    if (nextIdx >= phases.length) {
        // Round complete — collect picks, advance round
        draftCollectPicks();
        await draftAdvanceRound();
    } else {
        draftState.phaseIdx = nextIdx;
        draftState.phase = phases[nextIdx];
        if (draftMyRole === 'player') {
            await draftRef('state').set(sanitiseDraftState(draftState));
        } else {
            // P2 sends action, P1 reconciles
            await draftRef('p2action').set({ cardId, phase, ts: Date.now() });
        }
        renderDraftUI();
    }
}

/** P1 listens for P2 actions and applies them */
function draftListenP2Action() {
    draftRef('p2action').on('value', snap => {
        const val = snap.val();
        if (!val || val.applied) return;
        if (draftWhoseAction(draftState.phase) !== 'ai') return;

        const { cardId, phase } = val;
        if (draftIsBan(phase)) {
            if (!draftState.banned.includes(cardId)) draftState.banned.push(cardId);
        } else {
            if (!draftState.picked.ai.includes(cardId)) draftState.picked.ai.push(cardId);
        }

        draftRef('p2action').update({ applied: true });

        const phases = draftState.phases;
        const nextIdx = draftState.phaseIdx + 1;
        if (nextIdx >= phases.length) {
            draftCollectPicks();
            draftAdvanceRound();
        } else {
            draftState.phaseIdx = nextIdx;
            draftState.phase = phases[nextIdx];
            draftRef('state').set(sanitiseDraftState(draftState));
            renderDraftUI();
        }
    });
}

/** Move this round's picks into p1Deck / p2Deck */
function draftCollectPicks() {
    const poolMap = {};
    draftState.pool.forEach(c => { poolMap[c.id] = c; });

    draftState.picked.player.forEach(id => {
        if (poolMap[id]) draftState.p1Deck.push({ ...poolMap[id] });
    });
    draftState.picked.ai.forEach(id => {
        if (poolMap[id]) draftState.p2Deck.push({ ...poolMap[id] });
    });
}

/** Start next round or finish draft */
async function draftAdvanceRound() {
    const p1Count = draftState.p1Deck.length;
    const p2Count = draftState.p2Deck.length;

    if (p1Count >= TOTAL_CARDS_TARGET && p2Count >= TOTAL_CARDS_TARGET) {
        draftState.done = true;
        if (draftMyRole === 'player') {
            await draftRef('state').set(sanitiseDraftState(draftState));
        }
        draftFinish();
        return;
    }

    const nextRound = draftState.round + 1;
    const usedP1 = new Set(draftState.p1Deck.map(c => c.name));
    const usedP2 = new Set(draftState.p2Deck.map(c => c.name));
    const newPool = draftGeneratePool(usedP1, usedP2);
    const newPhases = draftGetPhaseSequence(nextRound);

    draftState.round = nextRound;
    draftState.phaseIdx = 0;
    draftState.phase = newPhases[0];
    draftState.phases = newPhases;
    draftState.pool = newPool.map(c => ({ ...c }));
    draftState.banned = [];
    draftState.picked = { player: [], ai: [] };

    if (draftMyRole === 'player') {
        await draftRef('state').set(sanitiseDraftState(draftState));
    }
    renderDraftUI();
}

/** Draft complete — build decks and start game */
function draftFinish() {
    hideDraftUI();

    // Build actual game decks from draft picks
    const p1Cards = (draftState.p1Deck || []).map(c => ({
        ...c,
        id: ++cardIdCounter,
        hp: c.maxHp || c.hp,
        hasAttacked: false,
        effects: [],
        silenced: false,
    }));
    const p2Cards = (draftState.p2Deck || []).map(c => ({
        ...c,
        id: ++cardIdCounter,
        hp: c.maxHp || c.hp,
        hasAttacked: false,
        effects: [],
        silenced: false,
    }));

    const myDeck   = draftMyRole === 'player' ? p1Cards : p2Cards;
    const oppDeck  = draftMyRole === 'player' ? p2Cards : p1Cards;

    // Override normal deck init
    state.players.player.deck = (draftMyRole === 'player' ? myDeck : oppDeck).sort(() => Math.random() - 0.5);
    state.players.ai.deck     = (draftMyRole === 'player' ? oppDeck : myDeck).sort(() => Math.random() - 0.5);

    // Themes: use mixed label
    selectedPlayerTheme = 'isekai_adventure'; // fallback for BGM
    selectedAITheme     = 'isekai_adventure';

    log('🃏 Draft สำเร็จ! เริ่มเกม!', 'text-yellow-400 font-bold text-lg');
    document.getElementById('theme-selector').style.display = 'none';

    // Start game without calling buildDeck (decks already set)
    initGame(true /* skipDeckBuild */);
}

// ── UI ───────────────────────────────────────────────────────
let draftUIInjected = false;

function showDraftLobby(msg) {
    injectDraftUI();
    document.getElementById('draft-overlay').style.display = 'flex';
    document.getElementById('draft-status-msg').textContent = msg;
}

function hideDraftUI() {
    const el = document.getElementById('draft-overlay');
    if (el) el.style.display = 'none';
}

function injectDraftUI() {
    if (draftUIInjected) return;
    draftUIInjected = true;

    const overlay = document.createElement('div');
    overlay.id = 'draft-overlay';
    overlay.style.cssText = `
        display:none; position:fixed; inset:0; z-index:9999;
        background: linear-gradient(135deg,#0a0a1a 0%,#0d1b2a 60%,#1a0a0a 100%);
        flex-direction:column; align-items:center; justify-content:flex-start;
        padding:24px 16px; overflow-y:auto; font-family:'Segoe UI',sans-serif; color:#e2e8f0;
    `;

    overlay.innerHTML = `
    <div style="width:100%;max-width:1100px;">
      <!-- Header -->
      <div style="text-align:center;margin-bottom:20px;">
        <div style="font-size:2rem;font-weight:900;letter-spacing:3px;
             background:linear-gradient(90deg,#f59e0b,#ec4899,#8b5cf6);
             -webkit-background-clip:text;-webkit-text-fill-color:transparent;
             text-shadow:none;">⚔️ DRAFT DUEL</div>
        <div id="draft-round-label" style="font-size:1rem;color:#94a3b8;margin-top:4px;"></div>
        <div id="draft-status-msg" style="font-size:0.9rem;color:#facc15;margin-top:6px;min-height:20px;"></div>
      </div>

      <!-- Phase banner -->
      <div id="draft-phase-banner" style="
          text-align:center;padding:10px 20px;border-radius:12px;margin-bottom:18px;
          background:rgba(255,255,255,0.06);border:1px solid rgba(255,255,255,0.1);
          font-size:1.1rem;font-weight:700;color:#f0f0f0;min-height:42px;
      "></div>

      <!-- Progress bars -->
      <div style="display:flex;gap:12px;margin-bottom:18px;flex-wrap:wrap;">
        <div style="flex:1;min-width:160px;background:rgba(255,255,255,0.05);border-radius:10px;padding:10px;">
          <div style="font-size:0.78rem;color:#94a3b8;margin-bottom:4px;">🧑 P1 Deck</div>
          <div style="background:#1e293b;border-radius:6px;overflow:hidden;height:10px;">
            <div id="draft-p1-bar" style="height:100%;background:linear-gradient(90deg,#4ade80,#22d3ee);transition:width 0.4s;width:0%;"></div>
          </div>
          <div id="draft-p1-count" style="font-size:0.75rem;color:#64748b;margin-top:3px;">0 / 60</div>
        </div>
        <div style="flex:1;min-width:160px;background:rgba(255,255,255,0.05);border-radius:10px;padding:10px;">
          <div style="font-size:0.78rem;color:#94a3b8;margin-bottom:4px;">👾 P2 Deck</div>
          <div style="background:#1e293b;border-radius:6px;overflow:hidden;height:10px;">
            <div id="draft-p2-bar" style="height:100%;background:linear-gradient(90deg,#f87171,#fb923c);transition:width 0.4s;width:0%;"></div>
          </div>
          <div id="draft-p2-count" style="font-size:0.75rem;color:#64748b;margin-top:3px;">0 / 60</div>
        </div>
      </div>

      <!-- Card pool -->
      <div id="draft-pool-grid" style="
          display:grid;
          grid-template-columns:repeat(auto-fill,minmax(130px,1fr));
          gap:12px;margin-bottom:24px;
      "></div>

      <!-- Selected this round -->
      <div style="display:flex;gap:16px;flex-wrap:wrap;">
        <div style="flex:1;min-width:220px;">
          <div style="font-size:0.78rem;color:#4ade80;margin-bottom:6px;font-weight:600;">✅ P1 เลือกรอบนี้</div>
          <div id="draft-p1-picks" style="display:flex;flex-wrap:wrap;gap:6px;min-height:30px;"></div>
        </div>
        <div style="flex:1;min-width:220px;">
          <div style="font-size:0.78rem;color:#f87171;margin-bottom:6px;font-weight:600;">✅ P2 เลือกรอบนี้</div>
          <div id="draft-p2-picks" style="display:flex;flex-wrap:wrap;gap:6px;min-height:30px;"></div>
        </div>
      </div>
    </div>
    `;
    document.body.appendChild(overlay);
}

function draftCardTypeColor(type) {
    if (type === 'Character') return '#1e3a5f';
    if (type === 'Action')    return '#2d1b4e';
    if (type === 'Item')      return '#3b2200';
    if (type === 'Field')     return '#0f3d2e';
    return '#1e293b';
}

function renderDraftUI() {
    if (!draftState) return;
    injectDraftUI();
    document.getElementById('draft-overlay').style.display = 'flex';

    const { round, phase, pool, banned, picked, p1Deck, p2Deck } = draftState;
    const actor = draftWhoseAction(phase);
    const isBan = draftIsBan(phase);
    const isMyTurn = actor === draftMyRole;

    // Round label
    document.getElementById('draft-round-label').textContent = `รอบที่ ${round} | ${p1Deck.length + picked.player.length} / ${TOTAL_CARDS_TARGET} การ์ด`;

    // Phase banner
    const phaseNames = {
        ban_p1: '🚫 P1 แบน 1 ใบ', ban_p2: '🚫 P2 แบน 1 ใบ',
        pick_p1: '✨ P1 เลือก 1 ใบ', pick_p2: '✨ P2 เลือก 1 ใบ',
        pick_p1_2: '✨ P1 เลือก 1 ใบ (ใบที่ 2)', pick_p2_2: '✨ P2 เลือก 1 ใบ (ใบที่ 2)',
    };
    const phaseTh = phaseNames[phase] || phase;
    const turnLabel = isMyTurn ? '👆 ถึงตาคุณ!' : '⏳ รอฝั่งตรงข้าม…';
    const bannerBg  = isBan
        ? (isMyTurn ? 'linear-gradient(90deg,#7f1d1d,#991b1b)' : 'linear-gradient(90deg,#1c1c1c,#2d1b1b)')
        : (isMyTurn ? 'linear-gradient(90deg,#14532d,#166534)' : 'linear-gradient(90deg,#1c1c1c,#1a2d1b)');
    const banner = document.getElementById('draft-phase-banner');
    banner.style.background = bannerBg;
    banner.innerHTML = `<span>${phaseTh}</span> <span style="opacity:0.7;font-size:0.9rem;margin-left:12px;">${turnLabel}</span>`;

    // Status msg
    document.getElementById('draft-status-msg').textContent = 
        isMyTurn
            ? (isBan ? '🚫 คลิกการ์ดที่ต้องการแบน' : '✨ คลิกการ์ดที่ต้องการเลือก')
            : 'รอให้ฝั่งตรงข้ามเลือก…';

    // Progress bars
    const p1Total = p1Deck.length + picked.player.length;
    const p2Total = p2Deck.length + picked.ai.length;
    document.getElementById('draft-p1-bar').style.width = Math.min(100, (p1Total / TOTAL_CARDS_TARGET) * 100) + '%';
    document.getElementById('draft-p2-bar').style.width = Math.min(100, (p2Total / TOTAL_CARDS_TARGET) * 100) + '%';
    document.getElementById('draft-p1-count').textContent = `${p1Total} / ${TOTAL_CARDS_TARGET}`;
    document.getElementById('draft-p2-count').textContent = `${p2Total} / ${TOTAL_CARDS_TARGET}`;

    // Pool grid
    const grid = document.getElementById('draft-pool-grid');
    grid.innerHTML = '';
    pool.forEach(card => {
        const isBanned = banned.includes(card.id);
        const isPickedP1 = picked.player.includes(card.id);
        const isPickedP2 = picked.ai.includes(card.id);
        const isUnavail = isBanned || isPickedP1 || isPickedP2;
        const canClick = isMyTurn && !isUnavail;

        const el = document.createElement('div');
        el.style.cssText = `
            position:relative;border-radius:10px;overflow:hidden;cursor:${canClick ? 'pointer' : 'default'};
            transition:transform 0.15s,box-shadow 0.15s;
            border:2px solid ${isPickedP1 ? '#4ade80' : isPickedP2 ? '#f87171' : isBanned ? '#ef4444' : 'rgba(255,255,255,0.12)'};
            opacity:${isUnavail ? 0.4 : 1};
            background:${draftCardTypeColor(card.type)};
            box-shadow:${canClick ? '0 0 0 0 transparent' : 'none'};
        `;
        if (canClick) {
            el.onmouseenter = () => { el.style.transform='scale(1.04)'; el.style.boxShadow='0 4px 20px rgba(250,204,21,0.4)'; };
            el.onmouseleave = () => { el.style.transform=''; el.style.boxShadow=''; };
            el.onclick = () => draftSelectCard(card.id);
        }

        // Art
        if (card.art) {
            const img = document.createElement('img');
            img.src = card.art;
            img.style.cssText = 'width:100%;height:90px;object-fit:cover;display:block;';
            img.onerror = () => { img.style.display = 'none'; };
            el.appendChild(img);
        } else {
            const ph = document.createElement('div');
            ph.style.cssText = 'width:100%;height:90px;background:rgba(0,0,0,0.3);display:flex;align-items:center;justify-content:center;font-size:1.5rem;';
            ph.textContent = card.type === 'Character' ? '⚔️' : card.type === 'Action' ? '✨' : card.type === 'Item' ? '🎒' : '🌍';
            el.appendChild(ph);
        }

        // Info
        const info = document.createElement('div');
        info.style.cssText = 'padding:6px 7px;';
        const deckLabel = { isekai_adventure:'Isekai', animal_kingdom:'Animal', mythology:'Myth', toy_trooper:'Toy' };
        info.innerHTML = `
            <div style="font-size:0.7rem;color:#94a3b8;margin-bottom:2px;">${deckLabel[card.deck]||card.deck} · ${card.type}</div>
            <div style="font-size:0.8rem;font-weight:700;line-height:1.2;margin-bottom:3px;">${card.name}</div>
            ${card.type==='Character'
                ? `<div style="font-size:0.72rem;color:#fbbf24;">💎${card.cost} ⚔️${card.atk} ❤️${card.maxHp||card.hp}</div>`
                : `<div style="font-size:0.72rem;color:#fbbf24;">💎${card.cost}</div>`
            }
            ${card.text ? `<div style="font-size:0.65rem;color:#cbd5e1;margin-top:2px;line-height:1.3;">${card.text.slice(0,50)}${card.text.length>50?'…':''}</div>` : ''}
        `;
        el.appendChild(info);

        // Overlay badges
        if (isBanned) {
            const badge = document.createElement('div');
            badge.style.cssText = 'position:absolute;inset:0;display:flex;align-items:center;justify-content:center;background:rgba(0,0,0,0.55);font-size:2rem;';
            badge.textContent = '🚫';
            el.appendChild(badge);
        } else if (isPickedP1) {
            const badge = document.createElement('div');
            badge.style.cssText = 'position:absolute;top:4px;right:4px;background:#4ade80;color:#000;font-size:0.65rem;font-weight:700;padding:2px 5px;border-radius:6px;';
            badge.textContent = 'P1 ✓';
            el.appendChild(badge);
        } else if (isPickedP2) {
            const badge = document.createElement('div');
            badge.style.cssText = 'position:absolute;top:4px;right:4px;background:#f87171;color:#000;font-size:0.65rem;font-weight:700;padding:2px 5px;border-radius:6px;';
            badge.textContent = 'P2 ✓';
            el.appendChild(badge);
        }

        grid.appendChild(el);
    });

    // Side picks this round
    const poolMap = {};
    pool.forEach(c => { poolMap[c.id] = c; });

    function renderPickChips(ids, containerId) {
        const el = document.getElementById(containerId);
        el.innerHTML = '';
        ids.forEach(id => {
            const c = poolMap[id];
            if (!c) return;
            const chip = document.createElement('span');
            chip.style.cssText = 'font-size:0.72rem;background:rgba(255,255,255,0.07);border-radius:6px;padding:3px 8px;border:1px solid rgba(255,255,255,0.1);';
            chip.textContent = c.name;
            el.appendChild(chip);
        });
    }
    renderPickChips(picked.player, 'draft-p1-picks');
    renderPickChips(picked.ai,     'draft-p2-picks');
}

// ── isDraftMode flag ─────────────────────────────────────────
let isDraftMode = false;

// ── Hook into P1's listener for P2 actions ──────────────────
// This must be called after draftRef is available (P1 after room creation)
(function patchDraftListener() {
    const origDraftInitRound1 = window.draftInitRound1;
    // After draftInitRound1 runs, P1 also listens for P2's moves
    window.draftInitRound1 = async function () {
        if (origDraftInitRound1) await origDraftInitRound1();
        else {
            // inline version called directly
            const pool = draftGeneratePool();
            const phases = draftGetPhaseSequence(1);
            const st = {
                round: 1, phaseIdx: 0, phase: phases[0], phases,
                pool: pool.map(c => ({ ...c })),
                banned: [], picked: { player: [], ai: [] },
                p1Deck: [], p2Deck: [], done: false,
            };
            draftState = st;
            await draftRef('state').set(sanitiseDraftState(st));
            renderDraftUI();
            draftListenForState();
        }
        draftListenP2Action();
    };
})();

// ── Patch initGame to skip buildDeck in draft mode ───────────
const _origInitGame = window.initGame;
window.initGame = function (skipDeckBuild) {
    if (skipDeckBuild && typeof _origInitGame === 'function') {
        // Draw opening hands only, skip buildDeck
        const drawN = (p, n) => {
            for (let i = 0; i < n && p.deck.length; i++) p.hand.push(p.deck.pop());
        };
        drawN(state.players.player, 5);
        drawN(state.players.ai, 5);
        state.phase = 'MAIN';
        startBGMForGame();
        startPhase('MAIN');
        return;
    }
    if (typeof _origInitGame === 'function') _origInitGame.apply(this, arguments);
};

// ── UI button: Add to theme-selector ────────────────────────
// Inject a "Draft Duel" button into the existing mode-select UI on DOM ready
document.addEventListener('DOMContentLoaded', () => {
    // Try to inject Draft mode button near existing mode buttons
    const selectorDiv = document.getElementById('theme-selector');
    if (!selectorDiv) return;

    // Create Draft button (style matches existing buttons)
    const draftBtn = document.createElement('button');
    draftBtn.id = 'draft-duel-btn';
    draftBtn.innerHTML = '⚔️ Draft Duel (Online)';
    draftBtn.style.cssText = `
        display:inline-block;padding:10px 22px;border-radius:10px;font-weight:700;font-size:0.95rem;
        background:linear-gradient(135deg,#7c3aed,#db2777);color:#fff;border:none;cursor:pointer;
        margin:6px;transition:opacity 0.2s;
    `;
    draftBtn.onmouseenter = () => { draftBtn.style.opacity = '0.85'; };
    draftBtn.onmouseleave = () => { draftBtn.style.opacity = '1'; };
    draftBtn.onclick = () => {
        // Hide theme selector, show room-id input, then start draft
        const rid = document.getElementById('room-id-input');
        if (rid) {
            rid.style.display = 'block';
            rid.placeholder = 'ว่างเปล่า = สร้างห้อง | กรอก ID = เข้าร่วม';
        }
        selectorDiv.style.display = 'none';
        startDraftDuel();
    };

    // Append near the start-game-btn
    const startBtn = document.getElementById('start-game-btn');
    if (startBtn && startBtn.parentNode) {
        startBtn.parentNode.insertBefore(draftBtn, startBtn.nextSibling);
    } else {
        selectorDiv.appendChild(draftBtn);
    }
});
