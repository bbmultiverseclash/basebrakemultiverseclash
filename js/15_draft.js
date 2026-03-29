// ============================================================
// 15_draft.js — Draft Duel Mode (Online)
// ============================================================
// Flow:
//   1) P1 creates room → both players enter draft lobby
//   2) Each round: 10 cards drawn (2 per deck × 4 decks + 2 extra = 10)
//      Round odd  → P1 bans, P2 bans, P1 picks, P2 picks×2, P1 picks
//      Round even → P2 bans, P1 bans, P2 picks, P1 picks×2, P2 picks
//   3) Repeat until each player has 60 cards → start normal game
// ============================================================

// ── Constants ────────────────────────────────────────────────
const DRAFT_DECK_POOL    = ['isekai_adventure', 'animal_kingdom', 'mythology', 'toy_trooper'];
const CARDS_PER_ROUND    = 10;
const TOTAL_CARDS_TARGET = 60;

// ── Draft State ──────────────────────────────────────────────
let draftState    = null;
let draftRoomId   = null;
let draftMyRole   = null;   // 'player' (P1) | 'ai' (P2)
let draftCardIdCounter = 0;
let draftUIInjected = false;

// ── Helpers ──────────────────────────────────────────────────
function draftMakeId() { return 'dr_' + (++draftCardIdCounter) + '_' + Math.random().toString(36).slice(2,6); }

function draftSampleFromDeck(deckKey, count, excludeNames) {
    const deckData = CardSets[deckKey];
    if (!deckData) return [];
    const allNames = Object.keys(deckData).filter(n => !excludeNames.has(n));
    const shuffled = allNames.sort(() => Math.random() - 0.5);
    return shuffled.slice(0, count).map(name => ({
        ...deckData[name],
        id:   draftMakeId(),
        deck: deckKey,
    }));
}

function draftGeneratePool(usedP1 = new Set(), usedP2 = new Set()) {
    const exclude = new Set([...usedP1, ...usedP2]);
    let pool = [];
    // 2 cards from each of 4 decks = 8 cards
    for (const dk of DRAFT_DECK_POOL) {
        const cards = draftSampleFromDeck(dk, 2, exclude);
        cards.forEach(c => exclude.add(c.name));
        pool = pool.concat(cards);
    }
    // 2 extra random cards to reach 10
    for (let i = 0; i < 2 && pool.length < CARDS_PER_ROUND; i++) {
        const dk = DRAFT_DECK_POOL[Math.floor(Math.random() * DRAFT_DECK_POOL.length)];
        const extra = draftSampleFromDeck(dk, 1, exclude);
        if (extra.length) { exclude.add(extra[0].name); pool.push(extra[0]); }
    }
    return pool.slice(0, CARDS_PER_ROUND);
}

// Phase sequence per round:
// odd:  P1ban → P2ban → P1pick → P2pick → P2pick2 → P1pick2
// even: P2ban → P1ban → P2pick → P1pick → P1pick2 → P2pick2
function draftGetPhases(round) {
    return round % 2 === 1
        ? ['ban_p1','ban_p2','pick_p1','pick_p2','pick_p2_b','pick_p1_b']
        : ['ban_p2','ban_p1','pick_p2','pick_p1','pick_p1_b','pick_p2_b'];
}

function draftActorOf(phase) {
    if (phase.includes('_p1')) return 'player';
    if (phase.includes('_p2')) return 'ai';
    return null;
}

function draftIsBanPhase(phase) { return phase.startsWith('ban_'); }

// ── Firebase helpers ─────────────────────────────────────────
function draftRef(sub) { return db.ref('rooms/' + draftRoomId + '/draft/' + sub); }
function draftSerialise(st) { return JSON.parse(JSON.stringify(st)); }

// ── Start Draft Duel ─────────────────────────────────────────
async function startDraftDuel() {
    isDraftMode = true;
    gameMode    = 'online';   // reuse online infrastructure

    const inputId = (document.getElementById('room-id-input') || {}).value?.trim() || '';

    if (!inputId) {
        // ── P1 creates room ──
        draftMyRole  = 'player';
        myRole       = 'player';
        draftRoomId  = generateRoomId();
        onlineRoomId = draftRoomId;
        if (document.getElementById('room-id-input'))
            document.getElementById('room-id-input').value = draftRoomId;

        await db.ref('rooms/' + draftRoomId).set({
            hostUid: getUserKey() || 'guest',
            created: Date.now(),
            isDraft: true,
        });

        setOnlineStatus('📋 Draft Room: ' + draftRoomId + ' — ส่ง ID ให้เพื่อน', '#4ade80');
        showDraftUI();
        renderDraftWaiting('⏳ รอ P2 เข้าร่วม…');

        db.ref('rooms/' + draftRoomId + '/guestReady').on('value', async snap => {
            if (!snap.val()) return;
            db.ref('rooms/' + draftRoomId + '/guestReady').off();
            setOnlineStatus('✅ P2 เข้าร่วมแล้ว! เริ่ม Draft…', '#4ade80');
            await draftP1InitRound();
        });

    } else {
        // ── P2 joins room ──
        draftMyRole  = 'ai';
        myRole       = 'ai';
        draftRoomId  = inputId;
        onlineRoomId = draftRoomId;

        const snap = await db.ref('rooms/' + draftRoomId).get();
        if (!snap.val()?.isDraft) {
            setOnlineStatus('❌ ไม่พบ Draft Room "' + draftRoomId + '"', '#f87171');
            document.getElementById('theme-selector').style.display = 'flex';
            return;
        }

        await db.ref('rooms/' + draftRoomId).update({ guestReady: Date.now() });
        setOnlineStatus('⏳ รอ P1 เริ่ม Draft…', '#facc15');
        showDraftUI();
        renderDraftWaiting('⏳ รอ P1 เริ่ม Draft…');
        draftListenState();
    }
}

// ── P1: initialise and push round state ──────────────────────
async function draftP1InitRound(existingState) {
    let st = existingState;
    if (!st) {
        const pool   = draftGeneratePool();
        const phases = draftGetPhases(1);
        st = {
            round:    1,
            phaseIdx: 0,
            phase:    phases[0],
            phases,
            pool:     pool,
            banned:   [],
            picked:   { player: [], ai: [] },
            p1Deck:   [],
            p2Deck:   [],
            done:     false,
        };
    }
    draftState = st;
    await draftRef('state').set(draftSerialise(st));
    renderDraftUI();
    draftListenState();
    draftListenP2Action();
}

// ── Both: listen for state from Firebase ─────────────────────
function draftListenState() {
    draftRef('state').on('value', snap => {
        const val = snap.val();
        if (!val) return;
        draftState = val;
        if (val.done) {
            draftRef('state').off();
            draftRef('p2action').off();
            draftFinish();
            return;
        }
        renderDraftUI();
    });
}

// ── P1: listen for P2 actions ─────────────────────────────────
function draftListenP2Action() {
    draftRef('p2action').on('value', async snap => {
        const val = snap.val();
        if (!val || val.applied) return;
        if (draftActorOf(draftState.phase) !== 'ai') return;

        // Apply P2's action
        await draftApplyAction(val.cardId, 'ai');
        await draftRef('p2action').update({ applied: true });
    });
}

// ── Core: apply a card selection (ban or pick) ───────────────
async function draftApplyAction(cardId, actorRole) {
    if (!draftState) return;
    const phase  = draftState.phase;
    const isBan  = draftIsBanPhase(phase);
    const actor  = draftActorOf(phase);

    if (actor !== actorRole) return;

    // Validate card available
    const inPool    = draftState.pool.some(c => c.id === cardId);
    const alrBanned = draftState.banned.includes(cardId);
    const alrPicked = [...draftState.picked.player, ...draftState.picked.ai].includes(cardId);
    if (!inPool || alrBanned || alrPicked) return;

    if (isBan) {
        draftState.banned.push(cardId);
    } else {
        draftState.picked[actorRole].push(cardId);
    }

    // Advance phase
    const nextIdx = draftState.phaseIdx + 1;
    if (nextIdx >= draftState.phases.length) {
        // Round complete
        draftCollectPicks();
        await draftNextRound();
    } else {
        draftState.phaseIdx = nextIdx;
        draftState.phase    = draftState.phases[nextIdx];
        if (draftMyRole === 'player') {
            await draftRef('state').set(draftSerialise(draftState));
        }
        renderDraftUI();
    }
}

// ── Called when local player clicks a card ───────────────────
async function draftOnCardClick(cardId) {
    if (!draftState) return;
    const actor = draftActorOf(draftState.phase);
    if (actor !== draftMyRole) return;

    if (draftMyRole === 'player') {
        // P1 applies directly
        await draftApplyAction(cardId, 'player');
    } else {
        // P2 sends action to P1
        await draftRef('p2action').set({ cardId, phase: draftState.phase, applied: false, ts: Date.now() });
        // Optimistic UI: grey out the card
        renderDraftUI(cardId);
    }
}

// ── Move picks into p1Deck / p2Deck ─────────────────────────
function draftCollectPicks() {
    const poolMap = {};
    draftState.pool.forEach(c => { poolMap[c.id] = c; });
    draftState.picked.player.forEach(id => { if (poolMap[id]) draftState.p1Deck.push({ ...poolMap[id] }); });
    draftState.picked.ai.forEach(id => {     if (poolMap[id]) draftState.p2Deck.push({ ...poolMap[id] }); });
}

// ── Advance to next round or finish ─────────────────────────
async function draftNextRound() {
    if (draftState.p1Deck.length >= TOTAL_CARDS_TARGET && draftState.p2Deck.length >= TOTAL_CARDS_TARGET) {
        draftState.done = true;
        if (draftMyRole === 'player') await draftRef('state').set(draftSerialise(draftState));
        draftFinish();
        return;
    }

    const nextRound = draftState.round + 1;
    const usedP1    = new Set(draftState.p1Deck.map(c => c.name));
    const usedP2    = new Set(draftState.p2Deck.map(c => c.name));
    const newPool   = draftGeneratePool(usedP1, usedP2);
    const newPhases = draftGetPhases(nextRound);

    draftState.round    = nextRound;
    draftState.phaseIdx = 0;
    draftState.phase    = newPhases[0];
    draftState.phases   = newPhases;
    draftState.pool     = newPool;
    draftState.banned   = [];
    draftState.picked   = { player: [], ai: [] };

    if (draftMyRole === 'player') await draftRef('state').set(draftSerialise(draftState));
    renderDraftUI();
}

// ── Finish draft → start game ────────────────────────────────
let isDraftMode = false;

function draftFinish() {
    hideDraftUI();

    // Build real game cards from draft picks
    function buildCards(picks) {
        return picks.map(c => ({
            ...c,
            id:         ++cardIdCounter,
            hp:         c.maxHp || c.hp,
            hasAttacked: false,
            effects:    [],
            silenced:   false,
            items:      [],
        }));
    }

    const p1Cards = buildCards(draftState.p1Deck);
    const p2Cards = buildCards(draftState.p2Deck);

    // Assign decks relative to myRole
    const myCards  = draftMyRole === 'player' ? p1Cards : p2Cards;
    const oppCards = draftMyRole === 'player' ? p2Cards : p1Cards;

    // Shuffle
    myCards.sort(() => Math.random() - 0.5);
    oppCards.sort(() => Math.random() - 0.5);

    state.players.player.deck = draftMyRole === 'player' ? myCards  : oppCards;
    state.players.ai.deck     = draftMyRole === 'player' ? oppCards : myCards;

    selectedPlayerTheme = 'isekai_adventure'; // BGM fallback
    selectedAITheme     = 'isekai_adventure';

    log('🃏 Draft เสร็จสิ้น! แต่ละฝ่ายได้ ' + draftState.p1Deck.length + ' การ์ด — เริ่มเกม!', 'text-yellow-400 font-bold text-lg');

    // Draw opening hands + start
    const drawN = (p, n) => { for (let i = 0; i < n && p.deck.length; i++) p.hand.push(p.deck.pop()); };
    drawN(state.players.player, 5);
    drawN(state.players.ai, 5);

    startBGMForGame();

    if (gameMode === 'online' && myRole === 'player') {
        // P1 pushes initial state and triggers mulligan flow
        p2HasJoined = true;
        pushStateToFirebase();
        setTimeout(() => offerMulligan('player'), 500);
    } else if (gameMode === 'online' && myRole === 'ai') {
        // P2 waits for P1 to push state (handled by existing online listener)
    }
}

// ════════════════════════════════════════════════════════════
// UI
// ════════════════════════════════════════════════════════════

function showDraftUI() {
    injectDraftOverlay();
    document.getElementById('draft-overlay').style.display = 'flex';
}

function hideDraftUI() {
    const el = document.getElementById('draft-overlay');
    if (el) el.style.display = 'none';
}

function renderDraftWaiting(msg) {
    injectDraftOverlay();
    document.getElementById('draft-overlay').style.display = 'flex';
    const banner = document.getElementById('draft-phase-banner');
    if (banner) banner.innerHTML = `<span style="color:#facc15;font-size:1.1rem;">${msg}</span>`;
    const grid = document.getElementById('draft-pool-grid');
    if (grid) grid.innerHTML = '';
}

function injectDraftOverlay() {
    if (draftUIInjected) return;
    draftUIInjected = true;

    const overlay = document.createElement('div');
    overlay.id = 'draft-overlay';
    overlay.style.cssText = [
        'display:none', 'position:fixed', 'inset:0', 'z-index:9999',
        'background:linear-gradient(135deg,#07071a 0%,#0d1b2a 60%,#150722 100%)',
        'flex-direction:column', 'align-items:center', 'justify-content:flex-start',
        'padding:20px 12px', 'overflow-y:auto',
        "font-family:'Segoe UI',sans-serif", 'color:#e2e8f0',
    ].join(';');

    overlay.innerHTML = `
    <div style="width:100%;max-width:1080px;">

      <!-- Title -->
      <div style="text-align:center;margin-bottom:16px;">
        <div style="font-size:1.9rem;font-weight:900;letter-spacing:4px;
             background:linear-gradient(90deg,#f59e0b,#ec4899,#8b5cf6);
             -webkit-background-clip:text;-webkit-text-fill-color:transparent;">⚔️ DRAFT DUEL</div>
        <div id="draft-round-label" style="font-size:0.9rem;color:#94a3b8;margin-top:3px;"></div>
      </div>

      <!-- Phase banner -->
      <div id="draft-phase-banner" style="
          text-align:center;padding:10px 20px;border-radius:12px;margin-bottom:14px;
          background:rgba(255,255,255,0.06);border:1px solid rgba(255,255,255,0.1);
          font-size:1rem;font-weight:700;color:#f0f0f0;min-height:40px;
          display:flex;align-items:center;justify-content:center;gap:12px;
      "></div>

      <!-- Progress -->
      <div style="display:flex;gap:10px;margin-bottom:14px;flex-wrap:wrap;">
        <div style="flex:1;min-width:150px;background:rgba(255,255,255,0.04);border-radius:10px;padding:8px 10px;">
          <div style="font-size:0.72rem;color:#94a3b8;margin-bottom:3px;">🧑 P1 Deck</div>
          <div style="background:#1e293b;border-radius:5px;overflow:hidden;height:8px;">
            <div id="draft-p1-bar" style="height:100%;background:linear-gradient(90deg,#4ade80,#22d3ee);transition:width 0.4s;width:0%;"></div>
          </div>
          <div id="draft-p1-count" style="font-size:0.72rem;color:#64748b;margin-top:2px;">0 / 60</div>
        </div>
        <div style="flex:1;min-width:150px;background:rgba(255,255,255,0.04);border-radius:10px;padding:8px 10px;">
          <div style="font-size:0.72rem;color:#94a3b8;margin-bottom:3px;">👾 P2 Deck</div>
          <div style="background:#1e293b;border-radius:5px;overflow:hidden;height:8px;">
            <div id="draft-p2-bar" style="height:100%;background:linear-gradient(90deg,#f87171,#fb923c);transition:width 0.4s;width:0%;"></div>
          </div>
          <div id="draft-p2-count" style="font-size:0.72rem;color:#64748b;margin-top:2px;">0 / 60</div>
        </div>
      </div>

      <!-- Card Pool Grid -->
      <div id="draft-pool-grid" style="
          display:grid;
          grid-template-columns:repeat(auto-fill,minmax(120px,1fr));
          gap:10px;margin-bottom:18px;
      "></div>

      <!-- Picks this round -->
      <div style="display:flex;gap:12px;flex-wrap:wrap;">
        <div style="flex:1;min-width:200px;">
          <div style="font-size:0.72rem;color:#4ade80;margin-bottom:5px;font-weight:600;">✅ P1 เลือกรอบนี้</div>
          <div id="draft-p1-picks" style="display:flex;flex-wrap:wrap;gap:5px;min-height:24px;"></div>
        </div>
        <div style="flex:1;min-width:200px;">
          <div style="font-size:0.72rem;color:#f87171;margin-bottom:5px;font-weight:600;">✅ P2 เลือกรอบนี้</div>
          <div id="draft-p2-picks" style="display:flex;flex-wrap:wrap;gap:5px;min-height:24px;"></div>
        </div>
      </div>
    </div>`;

    document.body.appendChild(overlay);
}

function draftTypeColor(type) {
    if (type === 'Character') return '#1e3a5f';
    if (type === 'Action')    return '#2d1b4e';
    if (type === 'Item')      return '#3b2200';
    if (type === 'Field')     return '#0f3d2e';
    return '#1e293b';
}

function renderDraftUI(pendingCardId) {
    if (!draftState) return;
    injectDraftOverlay();
    document.getElementById('draft-overlay').style.display = 'flex';

    const { round, phase, pool, banned, picked, p1Deck, p2Deck } = draftState;
    const actor    = draftActorOf(phase);
    const isBan    = draftIsBanPhase(phase);
    const isMyTurn = actor === draftMyRole;

    // Round label
    const p1total = p1Deck.length + picked.player.length;
    const p2total = p2Deck.length + picked.ai.length;
    document.getElementById('draft-round-label').textContent =
        `รอบที่ ${round}  |  P1: ${p1total}  P2: ${p2total}  จากเป้า ${TOTAL_CARDS_TARGET} ใบ`;

    // Phase banner
    const phaseLabel = {
        ban_p1:   '🚫 P1 แบน 1 ใบ',   ban_p2:   '🚫 P2 แบน 1 ใบ',
        pick_p1:  '✨ P1 เลือก 1 ใบ',  pick_p2:  '✨ P2 เลือก 1 ใบ',
        pick_p1_b:'✨ P1 เลือก 1 ใบ (2)', pick_p2_b:'✨ P2 เลือก 1 ใบ (2)',
    }[phase] || phase;
    const turnLabel = isMyTurn ? '👆 ถึงตาคุณ!' : '⏳ รอฝั่งตรงข้าม…';
    const bannerBg  = isBan
        ? (isMyTurn ? 'linear-gradient(90deg,#7f1d1d,#991b1b)' : 'linear-gradient(90deg,#1c1c1c,#2d1b1b)')
        : (isMyTurn ? 'linear-gradient(90deg,#14532d,#166534)' : 'linear-gradient(90deg,#1a2d1b,#1c1c1c)');
    const banner = document.getElementById('draft-phase-banner');
    banner.style.background = bannerBg;
    banner.innerHTML = `<span>${phaseLabel}</span><span style="opacity:0.7;font-size:0.85rem;">${turnLabel}</span>`;

    // Progress bars
    document.getElementById('draft-p1-bar').style.width  = Math.min(100,(p1total/TOTAL_CARDS_TARGET)*100)+'%';
    document.getElementById('draft-p2-bar').style.width  = Math.min(100,(p2total/TOTAL_CARDS_TARGET)*100)+'%';
    document.getElementById('draft-p1-count').textContent = p1total + ' / ' + TOTAL_CARDS_TARGET;
    document.getElementById('draft-p2-count').textContent = p2total + ' / ' + TOTAL_CARDS_TARGET;

    // Pool grid
    const grid = document.getElementById('draft-pool-grid');
    grid.innerHTML = '';
    const deckShort = { isekai_adventure:'Isekai', animal_kingdom:'Animal', mythology:'Myth', toy_trooper:'Toy' };

    pool.forEach(card => {
        const isBanned   = banned.includes(card.id);
        const pickedP1   = picked.player.includes(card.id);
        const pickedP2   = picked.ai.includes(card.id);
        const isPending  = card.id === pendingCardId;
        const isUnavail  = isBanned || pickedP1 || pickedP2 || isPending;
        const canClick   = isMyTurn && !isUnavail;

        const el = document.createElement('div');
        el.style.cssText = [
            'position:relative','border-radius:9px','overflow:hidden',
            'cursor:'+(canClick?'pointer':'default'),
            'transition:transform 0.15s,box-shadow 0.15s',
            'border:2px solid '+(pickedP1?'#4ade80':pickedP2?'#f87171':isBanned?'#ef4444':'rgba(255,255,255,0.10)'),
            'opacity:'+(isUnavail?'0.38':'1'),
            'background:'+draftTypeColor(card.type),
        ].join(';');

        if (canClick) {
            el.onmouseenter = () => { el.style.transform='scale(1.05)'; el.style.boxShadow='0 4px 18px rgba(250,204,21,0.35)'; };
            el.onmouseleave = () => { el.style.transform=''; el.style.boxShadow=''; };
            el.onclick      = () => draftOnCardClick(card.id);
        }

        // Art
        if (card.art) {
            const img = document.createElement('img');
            img.src = card.art;
            img.style.cssText = 'width:100%;height:82px;object-fit:cover;display:block;';
            img.onerror = () => { img.style.display='none'; };
            el.appendChild(img);
        } else {
            const ph = document.createElement('div');
            ph.style.cssText = 'width:100%;height:82px;background:rgba(0,0,0,0.25);display:flex;align-items:center;justify-content:center;font-size:1.4rem;';
            ph.textContent = ({Character:'⚔️',Action:'✨',Item:'🎒',Field:'🌍'}[card.type])||'🃏';
            el.appendChild(ph);
        }

        // Info
        const info = document.createElement('div');
        info.style.cssText = 'padding:5px 6px;';
        info.innerHTML = `
            <div style="font-size:0.62rem;color:#94a3b8;margin-bottom:1px;">${deckShort[card.deck]||card.deck} · ${card.type}</div>
            <div style="font-size:0.75rem;font-weight:700;line-height:1.2;margin-bottom:2px;">${card.name}</div>
            ${card.type==='Character'
                ? `<div style="font-size:0.65rem;color:#fbbf24;">💎${card.cost} ⚔️${card.atk} ❤️${card.maxHp||card.hp}</div>`
                : `<div style="font-size:0.65rem;color:#fbbf24;">💎${card.cost}</div>`}
            ${card.text?`<div style="font-size:0.6rem;color:#cbd5e1;margin-top:2px;line-height:1.25;">${card.text.slice(0,48)}${card.text.length>48?'…':''}</div>`:''}`;
        el.appendChild(info);

        // Overlay badges
        if (isBanned) {
            const ov = document.createElement('div');
            ov.style.cssText='position:absolute;inset:0;display:flex;align-items:center;justify-content:center;background:rgba(0,0,0,0.5);font-size:1.8rem;';
            ov.textContent='🚫'; el.appendChild(ov);
        } else if (pickedP1||pickedP2) {
            const badge = document.createElement('div');
            badge.style.cssText=`position:absolute;top:3px;right:3px;background:${pickedP1?'#4ade80':'#f87171'};color:#000;font-size:0.6rem;font-weight:700;padding:2px 5px;border-radius:5px;`;
            badge.textContent=pickedP1?'P1 ✓':'P2 ✓'; el.appendChild(badge);
        }

        grid.appendChild(el);
    });

    // Side picks chips
    const poolMap = {};
    pool.forEach(c => { poolMap[c.id] = c; });

    function renderChips(ids, elId) {
        const el = document.getElementById(elId);
        el.innerHTML = '';
        ids.forEach(id => {
            const c = poolMap[id]; if (!c) return;
            const chip = document.createElement('span');
            chip.style.cssText='font-size:0.68rem;background:rgba(255,255,255,0.07);border-radius:5px;padding:2px 7px;border:1px solid rgba(255,255,255,0.1);';
            chip.textContent = c.name;
            el.appendChild(chip);
        });
    }
    renderChips(picked.player, 'draft-p1-picks');
    renderChips(picked.ai,     'draft-p2-picks');
}
