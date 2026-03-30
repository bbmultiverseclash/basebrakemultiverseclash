// ============================================================
// 14_online.js — Firebase config, online mode, P1/P2 sync, chat
// ============================================================
const firebaseConfig = {
    apiKey:            "AIzaSyBzIrjK_CB9_8Xed1I0QbHn6e2WfsvwyU8",
    authDomain:        "basebreakmultiverseclash.firebaseapp.com",
    databaseURL:       "https://basebreakmultiverseclash-default-rtdb.firebaseio.com",
    projectId:         "basebreakmultiverseclash",
    storageBucket:     "basebreakmultiverseclash.firebasestorage.app",
    messagingSenderId: "189031171797",
    appId:             "1:189031171797:web:0039544a9b1fcd178f445c"
};
// Firebase init - ทำงานเฉพาะ online เท่านั้น
let db = null;
let firebaseReady = false;
try {
    if (typeof firebase !== 'undefined') {
        try { firebase.initializeApp(firebaseConfig); } catch(e) {}
        db = firebase.database();
        firebaseReady = true;
        setTimeout(() => initAuth(), 100);
    }
} catch(e) {
    console.warn('Firebase not available (offline mode):', e.message);
}

// ── ตัวแปร online ──────────────────────────────────────────────
let onlineRoomId = null;
let myRole       = null;   // 'player' = P1 | 'ai' = P2
let isMyTurn     = false;
let sessionToken = null;   // token ป้องกัน state เก่า
let p2ReadyToReceive = false;
let p2HasJoined  = false;  // P1: ห้าม push state จนกว่า P2 จะรับ gameReady token แล้ว

// ── Mode selector ──────────────────────────────────────────────
function selectMode(mode) {
    gameMode = mode;
    const overlay = document.getElementById('login-overlay');
    if (mode === 'online' || mode === 'draft') {
        if (!firebaseReady) {
            alert('Online / Draft mode ต้องเปิดจาก GitHub Pages ครับ\nhttps://bbmultiverseclash.github.io/basebrakemultiverseclash/');
            gameMode = 'ai'; mode = 'ai';
        } else if (!currentUser) {
            if (overlay) overlay.style.display = 'flex';
        }
    } else {
        if (overlay) overlay.style.display = 'none';
    }
    isChaosMode = (mode === 'chaos');
    if (mode === 'chaos') mode = 'ai';
    gameMode = mode;
    
    const map = { ai: ['#4ade80','btn-mode-ai'], local:['#fbbf24','btn-mode-local'], online:['#60a5fa','btn-mode-online'], draft: ['#818cf8','btn-mode-draft'] };
    ['ai','local','online','chaos','draft'].forEach(m => {
        const btn = document.getElementById('btn-mode-' + m);
        if (!btn) return;
        const active = isChaosMode ? (m === 'chaos') : (m === mode);
        btn.style.borderColor = active ? (m === 'chaos' ? '#f87171' : (map[m] ? map[m][0] : 'white')) : 'transparent';
    });
    
    { const _el = document.getElementById('online-panel'); if (_el) _el.style.display = (mode === 'online' || mode === 'draft') ? 'flex' : 'none'; }
    
    if (mode === 'draft') {
        { const _pe = document.getElementById('player-theme'); if (_pe && _pe.parentElement) _pe.parentElement.style.display = 'none'; }
        { const _el = document.getElementById('p2-theme-div'); if (_el) _el.style.display = 'none'; }
        { const _el = document.getElementById('p2-theme-online'); if (_el) _el.style.display = 'none'; }
    } else {
        { const _pe = document.getElementById('player-theme'); if (_pe && _pe.parentElement) _pe.parentElement.style.display = 'block'; }
        { const _el = document.getElementById('p2-theme-div'); if (_el) _el.style.display = (mode === 'online') ? 'none' : 'block'; }
        { const _el = document.getElementById('p2-theme-online'); if (_el) _el.style.display = (mode === 'online' && document.getElementById('room-id-input').value.trim()) ? 'block' : 'none'; }
    }
}
selectMode('ai');

function toggleP2ThemeOnline(val) {
    const el = document.getElementById('p2-theme-online');
    if (el) el.style.display = val.trim() ? 'block' : 'none';
}

function copyRoomId() {
    const val = document.getElementById('room-id-input').value || onlineRoomId || '';
    if (!val) { alert('ยังไม่มี Room ID'); return; }
    navigator.clipboard.writeText(val).catch(()=>{});
    alert('คัดลอก Room ID: ' + val);
}

// ── เริ่มเกม Online ────────────────────────────────────────────
async function startOnlineGame() {
    const inputId = document.getElementById('room-id-input').value.trim().toUpperCase();
    setOnlineStatus('⏳ กำลังเชื่อมต่อ...', '#fcd34d');
    sessionToken = Date.now().toString();

    if (!inputId) {
        // ═══ P1 HOST ═══
        myRole = 'player';
        onlineRoomId = generateRoomId();
        document.getElementById('room-id-input').value = onlineRoomId;

        await db.ref('rooms/' + onlineRoomId).set({
            session:     sessionToken,
            hostTheme:   selectedPlayerTheme,
            gameMode:    gameMode,
            guestTheme:  null,
            guestReady:  false,
            gameReady:   false,
            state:       null,
            p2action:    null,
        });

        setOnlineStatus('📋 Room: ' + onlineRoomId + '  (ส่ง ID ให้เพื่อน)', '#4ade80');

        db.ref('rooms/' + onlineRoomId + '/guestReady').on('value', snap => {
            if (!snap.val()) return;
            db.ref('rooms/' + onlineRoomId + '/guestReady').off();

            db.ref('rooms/' + onlineRoomId + '/guestTheme').get().then(ts => {
                selectedAITheme = ts.val() || 'isekai_adventure';
                setOnlineStatus('🎮 เพื่อนเข้าแล้ว! กำลังเริ่ม...', '#4ade80');

                if (gameMode === 'draft') {
                    { const _el = document.getElementById('theme-selector'); if (_el) _el.style.display = 'none'; }
                    { const _el = document.getElementById('chat-box'); if (_el) _el.style.display = 'block'; }
                    db.ref('rooms/' + onlineRoomId + '/chat').remove();
                    startDraftPhase();
                    listenForP2Actions();
                    listenForChat();
                } else {
                    db.ref('rooms/' + onlineRoomId + '/gameReady').set(sessionToken).then(() => {
                        { const _el = document.getElementById('theme-selector'); if (_el) _el.style.display = 'none'; }
                        { const _el = document.getElementById('chat-box'); if (_el) _el.style.display = 'block'; }
                        db.ref('rooms/' + onlineRoomId + '/logs').remove();
                        db.ref('rooms/' + onlineRoomId + '/chat').remove();
                        db.ref('rooms/' + onlineRoomId + '/p2mulligan').remove();
                        setTimeout(() => {
                            resetAndInitGame();
                            p2HasJoined = true;
                            pushStateToFirebase();
                            listenForP2Actions();
                            listenForChat();
                        }, 1200);
                    });
                }
            });
        });

    } else {
        // ═══ P2 GUEST ═══
        myRole = 'ai';
        onlineRoomId = inputId;
        p2ReadyToReceive = false;

        const snap = await db.ref('rooms/' + onlineRoomId).get();
        if (!snap.exists()) {
            setOnlineStatus('❌ ไม่พบ Room "' + onlineRoomId + '"', '#f87171');
            return;
        }

        const roomData = snap.val();
        selectedPlayerTheme = roomData.hostTheme || 'isekai_adventure';
        gameMode = roomData.gameMode || 'online';
        // P2 ต้องได้ sessionToken ตั้งแต่ตอน join ไม่ต้องรอ gameReady
        sessionToken = roomData.session || Date.now().toString();

        const p2ThemeEl = document.getElementById('p2-online-theme');
        selectedAITheme = p2ThemeEl ? p2ThemeEl.value : 'isekai_adventure';

        await db.ref('rooms/' + onlineRoomId).update({
            guestTheme: selectedAITheme,
            guestReady: true
        });

        if (gameMode === 'draft') {
            { const _el = document.getElementById('theme-selector'); if (_el) _el.style.display = 'none'; }
            { const _el = document.getElementById('chat-box'); if (_el) _el.style.display = 'block'; }
            setOnlineStatus('🃏 Draft กำลังเริ่ม...', '#818cf8');
            listenForDraftState();
            listenForChat();
        } else {
            setOnlineStatus('✅ รอ Host เริ่มเกม...', '#fcd34d');
        }

        db.ref('rooms/' + onlineRoomId + '/gameReady').on('value', snap => {
            const token = snap.val();
            if (!token) return;
            db.ref('rooms/' + onlineRoomId + '/gameReady').off();

            sessionToken = token;
            p2ReadyToReceive = true;

            // ถ้าเป็น draft mode P2 ต้องปิด overlay แล้วเริ่มเกมด้วย
            if (gameMode === 'draft') {
                db.ref('rooms/' + onlineRoomId + '/draftState').off();
                { const _el = document.getElementById('draft-overlay'); if (_el) _el.style.display = 'none'; }
                { const _el = document.getElementById('chat-box'); if (_el) _el.style.display = 'block'; }
                setOnlineStatus('🎮 Draft จบ! กำลังเริ่มเกม...', '#4ade80');
                // P2 ดึง deck ที่ดราฟต์ไว้จาก Firebase
                db.ref('rooms/' + onlineRoomId + '/draftResult').get().then(drSnap => {
                    const dr = drSnap.val() || {};
                    draftedP1Deck = dr.p1Deck || [];
                    draftedP2Deck = dr.p2Deck || [];
                    listenForStateFromHost();
                    listenForLogs();
                    listenForChat();
                    listenForP2MulliganOffer();
                    listenForP2Stats();
                    listenForSoundEvents();
                    startBGMForGame();
                });
                return;
            }

            setOnlineStatus('🎮 เกมเริ่มแล้ว!', '#4ade80');
            { const _el = document.getElementById('theme-selector'); if (_el) _el.style.display = 'none'; }
            { const _el = document.getElementById('chat-box'); if (_el) _el.style.display = 'block'; }

            listenForStateFromHost();
            listenForLogs();
            listenForChat();
            listenForP2MulliganOffer();
            listenForP2Stats();
            listenForSoundEvents();
            startBGMForGame();
        });
    }
}

// ── P1: push state ทุกครั้ง updateUI ──────────────────────────
function pushStateToFirebase() {
    if (!firebaseReady || !db) return;
    // [FIX] รองรับทั้ง online และ draft mode
    if ((gameMode !== 'online' && gameMode !== 'draft') || myRole !== 'player' || !onlineRoomId || !sessionToken) return;
    if (!p2HasJoined) return;
    const payload = JSON.parse(JSON.stringify(state));
    ['player','ai'].forEach(pk => {
        const p = payload.players[pk];
        if (!p.field     || !p.field.length)     p.field     = [];
        if (!p.hand      || !p.hand.length)      p.hand      = [];
        if (!p.deck      || !p.deck.length)      p.deck      = [];
        if (!p.graveyard || !p.graveyard.length) p.graveyard = [];
        if (!p.spaceZone || !p.spaceZone.length) p.spaceZone = [];
        (p.field || []).forEach(c => {
            c.items     = c.items     || [];
            c.status    = c.status    || [];
            c.tempBuffs = c.tempBuffs || [];
        });
    });
    payload._session = sessionToken;
    db.ref('rooms/' + onlineRoomId + '/state').set(payload).catch(() => {});
}

// ── ส่ง Sound Event ไปให้ P2 ────────────────────────────────
function pushSoundEvent(type, cardName) {
    if (!firebaseReady || !db || (gameMode !== 'online' && gameMode !== 'draft') || !onlineRoomId) return;
    // แต่ละฝั่ง push ไป path ของตัวเอง อีกฝั่งจะ listen path นี้
    const path = 'rooms/' + onlineRoomId + '/soundEvent_' + myRole;
    const ev = { type: type || 'summon', cardName: cardName || null, ts: Date.now() };
    db.ref(path).set(ev).catch(() => {});
}

// ── ทั้งสองฝั่ง: ฟัง Sound Events จากอีกฝั่ง ──────────────────
function listenForSoundEvents() {
    if (!firebaseReady || !db || !onlineRoomId) return;
    // ฟัง path ของอีกฝั่ง (ถ้าเราเป็น player ฟัง soundEvent_ai และกลับกัน)
    const oppRole = myRole === 'player' ? 'ai' : 'player';
    const path = 'rooms/' + onlineRoomId + '/soundEvent_' + oppRole;
    db.ref(path).on('value', snap => {
        if (!snap.val()) return;
        const ev = snap.val();
        // ป้องกัน event เก่า (> 3 วินาที) ไม่เล่นซ้ำตอน reconnect
        if (Date.now() - (ev.ts || 0) > 3000) return;
        if (ev.cardName) {
            playCardSound(ev.cardName);
        } else {
            playSound(ev.type);
        }
    });
}


// ── P2: ฟัง state จาก host ────────────────────────────────────
function listenForP2MulliganOffer() {
    db.ref('rooms/' + onlineRoomId + '/p2mulligan').on('value', snap => {
        const val = snap.val();
        if (!val || !val.offer || val.done) return;
        db.ref('rooms/' + onlineRoomId + '/p2mulligan').off();
        currentMulliganPlayer = 'ai';
        selectedMulliganCards = [];
        const modal = document.getElementById('mulligan-modal');
        const title = document.getElementById('mulligan-title');
        const handDiv = document.getElementById('mulligan-hand');
        title.innerHTML = 'P2 MULLIGAN (Turn 1)';
        title.className = 'text-blue-400 text-2xl font-bold text-center';
        handDiv.innerHTML = '';
        (state.players.ai.hand || []).forEach(c => {
            const el = renderCard(c, true, getActualCost(c, 'ai'));
            el.style.width = '105px';
            el.style.height = '145px';
            el.style.cursor = 'pointer';
            el.onclick = () => toggleMulliganSelect(c.id, el);
            handDiv.appendChild(el);
        });
        modal.style.display = 'flex';
    });
}

function listenForStateFromHost() {
    db.ref('rooms/' + onlineRoomId + '/state').on('value', snap => {
        if (!snap.val() || !p2ReadyToReceive) return;

        const incoming = snap.val();

        // ตรวจ session token — ถ้าไม่ตรงคือ state เก่า ไม่รับ
        if (incoming._session !== sessionToken) return;

        delete incoming._session;
        state = incoming;
        // Firebase drops empty arrays — restore them
        ['player','ai'].forEach(pk => {
            const p = state.players[pk];
            p.field     = p.field     || [];
            p.hand      = p.hand      || [];
            p.deck      = p.deck      || [];
            p.graveyard = p.graveyard || [];
            p.spaceZone = p.spaceZone || [];
            // p.fieldCard legacy — use state.sharedFieldCard
            p.field.forEach(c => {
                c.items     = c.items     || [];
                c.status    = c.status    || [];
                c.tempBuffs = c.tempBuffs || [];
            });
        });
        state.sharedFieldCard = state.sharedFieldCard || null;
        cardIdCounter = getMaxCardId(state) + 1;
        isMyTurn = (state.currentTurn === 'ai');

        // ตรวจ game over ก่อน render — ถ้าใครแพ้ให้เปิด end screen ฝั่ง P2 ด้วย
        if (state.players.player.hp <= 0 || state.players.ai.hp <= 0) {
            const winner = state.players.ai.hp <= 0 ? 'player' : 'ai';
            if (!document.getElementById('rematch-modal').classList.contains('active')) {
                // P2: อย่าบันทึก stats ทันที — รอรับ sessionStatsP2 จาก P1 ผ่าน listenForP2Stats
                // แค่แสดง end screen UI ก่อน แล้ว listenForP2Stats จะ recordGameResult เอง
                endGameUIOnly(winner);
            }
            return;
        }

        // Update UI สำหรับ P2
        renderForP2();
    });
}

// ── P2: render UI ในมุมมองของตัวเอง ──────────────────────────
function renderForP2() {
    checkOngoingAuras();

    // P2 อยู่ล่าง (ai key), P1 อยู่บน (player key)
    document.querySelector('#ai-base-ui .text-xs').innerText   = 'P1 BASE';
    document.querySelector('#player-base-ui .text-xs').innerText = 'P2 BASE (คุณ)';
    document.getElementById('ai-hand-label').innerText = 'P1 HAND';

    document.getElementById('player-hp').innerText    = state.players.ai.hp;
    document.getElementById('ai-hp').innerText        = state.players.player.hp;
    document.getElementById('player-cost').innerText  = state.players.ai.cost;
    document.getElementById('ai-cost').innerText      = state.players.player.cost;
    document.getElementById('player-deck-count').innerText = state.players.ai.deck.length;
    document.getElementById('ai-deck-count').innerText     = state.players.player.deck.length;
    document.getElementById('ai-hand-count').innerText     = state.players.player.hand.length + ' Cards';
    document.getElementById('player-gy-count').innerText   = state.players.ai.graveyard.length;
    document.getElementById('ai-gy-count').innerText       = state.players.player.graveyard.length;
    document.getElementById('player-sz-count').innerText   = state.players.ai.spaceZone.length;
    document.getElementById('ai-sz-count').innerText       = state.players.player.spaceZone.length;

    const turnLabel = isMyTurn ? 'P2 — ตาคุณ!' : 'P1 — รอเพื่อน...';
    document.getElementById('turn-indicator').innerText = `TURN ${state.totalTurns} (${turnLabel})`;

    // มือ P2 (ai) อยู่ล่าง
    renderHand();

    // สนาม: P2(ai) ล่าง, P1(player) บน
    renderField('ai-field',     state.players.player.field, 'player');
    renderField('player-field', state.players.ai.field,     'ai');
    renderFieldCard('player-field-zone', state.sharedFieldCard);
    renderFieldCard('ai-field-zone',     state.sharedFieldCard);

    // ปุ่มจบเฟส
    const btn = document.getElementById('btn-next-phase');
    btn.style.display = (isMyTurn && !state.targeting.active) ? 'block' : 'none';
    if (btn.style.display !== 'none') btn.innerText = state.phase === 'MAIN' ? 'เข้าสู่ BATTLE PHASE' : 'จบเทิร์น';

    // status bar
    setOnlineStatus(isMyTurn ? '🟢 ตาของคุณ!' : '⏳ รอ P1...', isMyTurn ? '#4ade80' : '#9ca3af');

    // Base click สำหรับ P2
    document.getElementById('ai-base-ui').onclick = () => {
        if (state.phase === 'BATTLE' && state.selectedCardId && isMyTurn) {
            initiateAttack(state.selectedCardId, null, true);
        }
    };
    document.getElementById('player-base-ui').onclick = () => {
        // P2 โจมตี base ตัวเอง = ไม่ได้
    };
}

// ── P2: รับ stats จาก P1 แล้วบันทึก ──────────────────────────
function listenForP2Stats() {
    if (!onlineRoomId) return;
    db.ref('rooms/' + onlineRoomId + '/p2stats').on('value', async snap => {
        const data = snap.val();
        if (!data || !data.ts) return;
        const uid = getUserKey();
        if (!uid || myRole !== 'ai') return;
        db.ref('rooms/' + onlineRoomId + '/p2stats').off();
        // ใส่ stats ที่ได้รับจาก P1 แล้วบันทึก
        sessionStats.damageDealt      = data.damageDealt      || 0;
        sessionStats.damageToChars    = data.damageToChars    || 0;
        sessionStats.kills            = data.kills            || 0;
        sessionStats.cardsPlayed      = data.cardsPlayed      || {};
        sessionStats.cardsPlayedTotal = data.cardsPlayedTotal || 0;
        sessionStats.turnsPlayed      = data.turnsPlayed      || 0;
        const didWin = (data.winner === 'ai');
        await recordGameResult(didWin);
        refreshRematchStats();
        // Update rematch modal title/winner label now that we know result
        document.getElementById('rematch-title').innerText = didWin ? '🏆 ชนะ!' : '💀 แพ้...';
        document.getElementById('rematch-winner').innerText = didWin ? 'P2 ชนะ! 🎉' : 'P1 ชนะ! 🎉';
    });
}

// ── P1: ฟัง action จาก P2 ─────────────────────────────────────
function listenForP2Actions() {
    db.ref('rooms/' + onlineRoomId + '/p2action').on('value', snap => {
        if (!snap.val()) return;
        const action = snap.val();
        if (action.done || action.session !== sessionToken) return;

        // mark done ก่อน execute
        db.ref('rooms/' + onlineRoomId + '/p2action/done').set(true);
        executeRemoteAction(action);
    });
}

function executeRemoteAction(action) {
    if (action.type === 'playCard')      playCard('ai', action.cardId);
    if (action.type === 'attack')        initiateAttack(action.attackerId, action.targetId, action.targetIsBase);
    if (action.type === 'nextPhase')     nextPhase();
    if (action.type === 'cancelTarget')  cancelTargeting();
    if (action.type === 'resolveTarget') resolveTargetedPlay('ai', action.sourceCardId, action.targetCharId);
    // [FIX] P2's draftAct is processed here on P1's side only
    if (action.type === 'draftAct')      processDraftAct('ai', action.cardIndex);

    if (action.type === 'doMulligan') {
        const p = state.players.ai;
        const returnedIds = action.returnedIds || [];
        const count = returnedIds.length;

        if (count > 0) {
            const returnedIdSet = new Set(returnedIds);
            returnedIds.forEach(id => {
                const idx = p.hand.findIndex(c => c.id === id);
                if (idx !== -1) {
                    const card = p.hand.splice(idx, 1)[0];
                    p.deck.push(card);
                }
            });

            for (let s = 0; s < 5; s++) p.deck.sort(() => Math.random() - 0.5);

            let drawn = 0;
            let attempts = 0;
            while (drawn < count && p.deck.length > 0 && attempts < p.deck.length * 2) {
                const candidate = p.deck[p.deck.length - 1];
                if (returnedIdSet.has(candidate.id) && p.deck.length > count) {
                    const moved = p.deck.pop();
                    const insertIdx = Math.floor(Math.random() * Math.max(1, p.deck.length - count));
                    p.deck.splice(insertIdx, 0, moved);
                    attempts++;
                } else {
                    p.hand.push(p.deck.pop());
                    drawn++;
                }
            }
            while (drawn < count && p.deck.length > 0) {
                p.hand.push(p.deck.pop());
                drawn++;
            }
            log(`P2 Mulligan สำเร็จ! เปลี่ยนการ์ด ${count} ใบ`, 'text-blue-300 font-bold');
        } else {
            log(`P2 ข้าม Mulligan`, 'text-gray-400');
        }

        // เซ็ตสถานะว่าทำเสร็จแล้ว และผลัก State ทับกลับไปให้ P2
        db.ref('rooms/' + onlineRoomId + '/p2mulligan/done').set(true);
        pushStateToFirebase();
    }
}

// ── P2: ส่ง action ─────────────────────────────────────────────
function sendOnlineAction(action) {
    if (!onlineRoomId || !sessionToken) return;
    db.ref('rooms/' + onlineRoomId + '/p2action').set({
        ...action,
        done:    false,
        session: sessionToken,
        ts:      Date.now()
    });
}

// ── Chat ────────────────────────────────────────────────────
function sendChat() {
    const input = document.getElementById('chat-input');
    const msg = (input.value || '').trim();
    if (!msg || !onlineRoomId) return;
    const sender = myRole === 'player' ? 'P1' : 'P2';
    db.ref('rooms/' + onlineRoomId + '/chat').push({
        sender, msg, ts: Date.now()
    });
    input.value = '';
}

function listenForChat() {
    db.ref('rooms/' + onlineRoomId + '/chat').on('child_added', snap => {
        if (!snap.val()) return;
        const { sender, msg } = snap.val();
        const box = document.getElementById('chat-messages');
        const el = document.createElement('div');
        const isMe = (myRole === 'player' && sender === 'P1') || (myRole === 'ai' && sender === 'P2');
        el.style.cssText = `text-align:${isMe ? 'right' : 'left'}; color:${isMe ? '#86efac' : '#93c5fd'}; word-break:break-word;`;
        el.innerText = `${sender}: ${msg}`;
        box.appendChild(el);
        box.scrollTop = box.scrollHeight;
    });
}

// ── helpers ────────────────────────────────────────────────────
function setOnlineStatus(msg, color) {
    const el = document.getElementById('online-status');
    if (el) { el.textContent = msg; el.style.color = color || '#fcd34d'; }
}

function updateOnlineTurnIndicator() {
    // [FIX] รองรับทั้ง online และ draft mode
    if ((gameMode !== 'online' && gameMode !== 'draft') || myRole !== 'player') return;
    isMyTurn = (state.currentTurn === 'player');
    setOnlineStatus(isMyTurn ? '🟢 ตาของคุณ!' : '⏳ รอ P2...', isMyTurn ? '#4ade80' : '#9ca3af');
}

function generateRoomId() {
    return Math.random().toString(36).substring(2, 8).toUpperCase();
}

function getMaxCardId(s) {
    let max = 0;
    try {
        ['player','ai'].forEach(pk => {
            ['hand','field','graveyard','deck'].forEach(zone => {
                (s.players[pk][zone] || []).forEach(c => {
                    const n = parseInt((c.id || '').replace('card_', ''));
                    if (!isNaN(n) && n > max) max = n;
                });
            });
        });
    } catch(e) {}
    return max;
}

// ================================================================
// DRAFT DUEL SYSTEM
// ================================================================
let draftState = null;

function createDraftOverlay() {
    if (document.getElementById('draft-overlay')) return;
    const overlay = document.createElement('div');
    overlay.id = 'draft-overlay';
    overlay.style.cssText = [
        'position:fixed','inset:0','z-index:9999',
        'background:rgba(0,0,0,0.92)',
        'display:flex','flex-direction:column',
        'align-items:center','justify-content:flex-start',
        'padding:24px 16px','gap:12px','overflow-y:auto'
    ].join(';');
    overlay.innerHTML = `
        <div style="width:100%;max-width:900px;display:flex;flex-direction:column;align-items:center;gap:12px;">
            <div style="font-size:1.6rem;font-weight:900;color:#a78bfa;letter-spacing:2px;text-transform:uppercase;text-shadow:0 0 20px #7c3aed;">
                ⚔️ DRAFT DUEL ⚔️
            </div>
            <div id="draft-status" style="font-size:1rem;font-weight:700;padding:8px 24px;border-radius:9999px;border:2px solid #4ade80;background:rgba(20,83,45,0.5);color:#4ade80;text-align:center;"></div>
            <div style="display:flex;gap:24px;justify-content:center;">
                <div id="draft-p1-count" style="display:flex;flex-direction:column;align-items:center;gap:2px;background:rgba(74,222,128,0.1);border:1px solid #4ade80;border-radius:12px;padding:8px 20px;color:#4ade80;"></div>
                <div id="draft-p2-count" style="display:flex;flex-direction:column;align-items:center;gap:2px;background:rgba(248,113,113,0.1);border:1px solid #f87171;border-radius:12px;padding:8px 20px;color:#f87171;"></div>
            </div>
            <div style="font-size:0.75rem;color:#6b7280;text-align:center;">
                🟥 = แบน &nbsp;|&nbsp; 🟩 P1 เลือก &nbsp;|&nbsp; 🟥 P2 เลือก &nbsp;|&nbsp; คลิกการ์ดเมื่อถึงตาคุณ
            </div>
            <div id="draft-pool" style="display:flex;flex-wrap:wrap;gap:10px;justify-content:center;width:100%;"></div>
        </div>
    `;
    document.body.appendChild(overlay);
}

function startDraftPhase() {
    createDraftOverlay();
    draftState = {
        round: 1,
        step: 0,
        pool: [],
        p1Deck: [],
        p2Deck: []
    };
    generateDraftPool();
    db.ref('rooms/' + onlineRoomId + '/draftState').set(draftState);
    listenForDraftState();
}

// [FIX] สุ่มการ์ดไม่ซ้ำกันภายใน pool เดียวกัน
function generateDraftPool() {
    const themes = ['isekai_adventure', 'animal_kingdom', 'mythology', 'toy_trooper', 'humanity'];
    const pool = [];
    const usedNames = new Set(); // ป้องกันการ์ดซ้ำใน pool เดียวกัน

    themes.forEach(theme => {
        if (!CardSets[theme]) return; // null-check ป้องกัน crash ถ้า theme ไม่มี
        const cardsInTheme = Object.keys(CardSets[theme]);
        let picked = 0;
        let attempts = 0;
        // พยายามสุ่ม 2 ใบที่ไม่ซ้ำกันใน pool
        while (picked < 2 && attempts < 50) {
            attempts++;
            const randName = cardsInTheme[Math.floor(Math.random() * cardsInTheme.length)];
            if (!usedNames.has(randName)) {
                usedNames.add(randName);
                pool.push({ name: randName, theme: theme, status: null });
                picked++;
            }
        }
    });

    pool.sort(() => Math.random() - 0.5);
    draftState.pool = pool;
}

function listenForDraftState() {
    createDraftOverlay();
    db.ref('rooms/' + onlineRoomId + '/draftState').on('value', snap => {
        const ds = snap.val();
        if (!ds) {
            { const _el = document.getElementById('draft-overlay'); if (_el) _el.style.display = 'none'; }
            return;
        }
        draftState = ds;
        draftState.p1Deck = draftState.p1Deck || [];
        draftState.p2Deck = draftState.p2Deck || [];
        draftState.pool   = draftState.pool   || [];
        renderDraftUI();
    });
}

function renderDraftUI() {
    // [FIX] null-check ทุก element ก่อนใช้ — ป้องกัน crash ถ้า DOM ยังไม่พร้อม
    const overlay   = document.getElementById('draft-overlay');
    const statusEl  = document.getElementById('draft-status');
    const p1CountEl = document.getElementById('draft-p1-count');
    const p2CountEl = document.getElementById('draft-p2-count');
    const poolEl    = document.getElementById('draft-pool');
    if (!overlay || !statusEl || !p1CountEl || !p2CountEl || !poolEl) return;

    overlay.style.display = 'flex';

    // รอบคี่: P1 แบนก่อน | รอบคู่: P2 แบนก่อน
    const firstPlayer  = draftState.round % 2 !== 0 ? 'player' : 'ai';
    const secondPlayer = firstPlayer === 'player' ? 'ai' : 'player';

    // Step sequence: ban1, ban2, pick1, pick2a, pick2b, pick3
    // รอบคี่: P1 ban → P2 ban → P1 pick → P2 pick2 → P2 pick2 → P1 pick
    // รอบคู่: P2 ban → P1 ban → P2 pick → P1 pick2 → P1 pick2 → P2 pick
    let expected = null, actStr = '';
    if      (draftState.step === 0) { expected = firstPlayer;  actStr = 'แบน 1 ใบ 🚫'; }
    else if (draftState.step === 1) { expected = secondPlayer; actStr = 'แบน 1 ใบ 🚫'; }
    else if (draftState.step === 2) { expected = firstPlayer;  actStr = 'เลือก 1 ใบ ✅'; }
    else if (draftState.step === 3) { expected = secondPlayer; actStr = 'เลือกใบที่ 1/2 ✅'; }
    else if (draftState.step === 4) { expected = secondPlayer; actStr = 'เลือกใบที่ 2/2 ✅'; }
    else if (draftState.step === 5) { expected = firstPlayer;  actStr = 'เลือก 1 ใบสุดท้าย ✅'; }

    const isMine = (expected === myRole);

    // แสดงว่าตาใคร และรอบที่เท่าไหร่ (จาก 30)
    const totalRounds = 30;
    statusEl.innerText = `รอบที่ ${draftState.round}/${totalRounds}  |  ${isMine ? '👉 ตาของคุณ: ' + actStr : '⏳ รอคู่ต่อสู้: ' + actStr}`;
    statusEl.style.cssText = isMine
        ? 'font-size:1.1rem;font-weight:700;margin-bottom:16px;padding:8px 24px;border-radius:9999px;border:2px solid #4ade80;background:rgba(20,83,45,0.5);color:#4ade80;box-shadow:0 0 15px rgba(74,222,128,0.3);'
        : 'font-size:1.1rem;font-weight:700;margin-bottom:16px;padding:8px 24px;border-radius:9999px;border:2px solid #f59e0b;background:#111827;color:#fbbf24;box-shadow:0 0 15px rgba(245,158,11,0.2);';

    p1CountEl.innerHTML = `<span style="font-size:0.7rem;color:#6b7280;">P1 DECK</span><span style="font-size:1.5rem;">${(draftState.p1Deck||[]).length}/60</span>`;
    p2CountEl.innerHTML = `<span style="font-size:0.7rem;color:#6b7280;">P2 DECK</span><span style="font-size:1.5rem;">${(draftState.p2Deck||[]).length}/60</span>`;

    poolEl.innerHTML = '';

    draftState.pool.forEach((cData, i) => {
        const cardInst = createCardInstance(cData.name, cData.theme);
        if (!cardInst) return; // null-check ป้องกัน crash
        const el = renderCard(cardInst, true, cardInst.cost);
        if (!el) return; // [FIX] null-check ป้องกัน renderCard คืน null แล้ว crash
        el.style.position = 'relative';
        el.style.transform = 'scale(0.95)';
        el.style.flexShrink = '0';

        if (cData.status === 'banned') {
            el.style.filter = 'grayscale(100%) brightness(0.5)';
            el.innerHTML += '<div style="position:absolute;inset:0;display:flex;align-items:center;justify-content:center;font-size:3rem;z-index:10;text-shadow:0 0 10px #000;">🚫</div>';
        } else if (cData.status === 'picked') {
            el.style.filter = 'grayscale(70%) brightness(0.6)';
            const color = cData.pickedBy === 'player' ? '#4ade80' : '#f87171';
            const text  = cData.pickedBy === 'player' ? 'P1' : 'P2';
            el.innerHTML += `<div style="position:absolute;inset:0;display:flex;align-items:center;justify-content:center;font-size:1.8rem;color:${color};font-weight:900;text-shadow:2px 2px 4px #000;z-index:10;flex-direction:column;">✅<span style="font-size:1.3rem">${text}</span></div>`;
        } else if (isMine) {
            el.style.cursor = 'pointer';
            el.style.outline = '3px solid transparent';
            el.style.transition = 'outline 0.15s';
            el.onmouseenter = () => el.style.outline = `3px solid ${draftState.step <= 1 ? '#ef4444' : '#4ade80'}`;
            el.onmouseleave = () => el.style.outline = '3px solid transparent';
            el.onclick = () => handleDraftClick(i);
        }
        poolEl.appendChild(el);
    });
}

// [FIX] processDraftAct รันที่ P1 เท่านั้น — P2 ส่ง action มาแล้ว P1 จะรัน
function processDraftAct(playerRole, cardIndex) {
    if (!draftState) return;

    // [FIX] ป้องกัน P2 รัน logic นี้โดยตรง — ต้องผ่าน sendOnlineAction เท่านั้น
    if (myRole !== 'player') return;

    const card = draftState.pool[cardIndex];
    if (!card || card.status) return;

    // รอบคี่: P1 แบนก่อน | รอบคู่: P2 แบนก่อน
    const firstPlayer  = draftState.round % 2 !== 0 ? 'player' : 'ai';
    const secondPlayer = firstPlayer === 'player' ? 'ai' : 'player';

    let expectedPlayer = null, actType = '';
    if      (draftState.step === 0) { expectedPlayer = firstPlayer;  actType = 'ban'; }
    else if (draftState.step === 1) { expectedPlayer = secondPlayer; actType = 'ban'; }
    else if (draftState.step === 2) { expectedPlayer = firstPlayer;  actType = 'pick'; }
    else if (draftState.step === 3) { expectedPlayer = secondPlayer; actType = 'pick'; }
    else if (draftState.step === 4) { expectedPlayer = secondPlayer; actType = 'pick'; }
    else if (draftState.step === 5) { expectedPlayer = firstPlayer;  actType = 'pick'; }

    if (playerRole !== expectedPlayer) return;

    if (actType === 'ban') {
        card.status = 'banned';
    } else {
        card.status   = 'picked';
        card.pickedBy = playerRole;
        if (playerRole === 'player') draftState.p1Deck.push(card);
        else draftState.p2Deck.push(card);
    }

    draftState.step++;

    if (draftState.step > 5) {
        draftState.round++;
        draftState.step = 0;
        if (draftState.round > 30) {
            // [FIX] set draftState ไป Firebase ก่อน แล้วค่อย finalize
            db.ref('rooms/' + onlineRoomId + '/draftState').set(draftState).then(() => {
                finalizeDraftAndStartGame();
            });
            return;
        } else {
            generateDraftPool();
        }
    }

    db.ref('rooms/' + onlineRoomId + '/draftState').set(draftState);
}

// [FIX] handleDraftClick — P1 รันเอง, P2 ส่ง action ให้ P1 รัน
function handleDraftClick(index) {
    if (myRole === 'player') {
        processDraftAct('player', index);
    } else {
        // P2 ส่ง action ให้ P1 เป็นคนประมวลผลแทน ไม่รัน processDraftAct เอง
        sendOnlineAction({ type: 'draftAct', cardIndex: index });
    }
}

function finalizeDraftAndStartGame() {
    // P1 (player role) ใช้ p1Deck, P2 (ai role) ใช้ p2Deck
    draftedP1Deck = draftState.p1Deck || [];
    draftedP2Deck = draftState.p2Deck || [];

    db.ref('rooms/' + onlineRoomId + '/draftState').off();
    { const _el = document.getElementById('draft-overlay'); if (_el) _el.style.display = 'none'; }

    // เก็บ deck ลง Firebase ให้ P2 ดึงไปใช้ด้วย
    db.ref('rooms/' + onlineRoomId + '/draftResult').set({
        p1Deck: draftedP1Deck,
        p2Deck: draftedP2Deck
    }).then(() => {
        db.ref('rooms/' + onlineRoomId + '/gameReady').set(sessionToken).then(() => {
            { const _el = document.getElementById('chat-box'); if (_el) _el.style.display = 'block'; }
            db.ref('rooms/' + onlineRoomId + '/logs').remove();
            db.ref('rooms/' + onlineRoomId + '/chat').remove();
            db.ref('rooms/' + onlineRoomId + '/p2mulligan').remove();
            setTimeout(() => {
                resetAndInitGame();
                p2HasJoined = true;
                pushStateToFirebase();
                listenForP2Actions();
                listenForChat();
            }, 800);
        });
    });
}
    
