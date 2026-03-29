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
            alert('Online/Draft mode ต้องเปิดจาก GitHub Pages ครับ\nhttps://bbmultiverseclash.github.io/basebrakemultiverseclash/');
            gameMode = 'ai';
            mode = 'ai';
        } else if (!currentUser) {
            if (overlay) overlay.style.display = 'flex';
        }
    } else {
        if (overlay) overlay.style.display = 'none';
    }
    isChaosMode = (mode === 'chaos');
    if (mode === 'chaos') mode = 'ai';
    gameMode = mode;
    const map = { ai: ['#4ade80','btn-mode-ai'], local: ['#fbbf24','btn-mode-local'], online: ['#60a5fa','btn-mode-online'], draft: ['#a855f7','btn-mode-draft'] };
    ['ai','local','online','chaos','draft'].forEach(m => {
        const btn = document.getElementById('btn-mode-' + m);
        if (!btn) return;
        const active = isChaosMode ? (m === 'chaos') : (m === mode);
        btn.style.borderColor = active ? (m === 'chaos' ? '#f87171' : (map[m] ? map[m][0] : 'white')) : 'transparent';
    });
    // draft และ online ใช้ Room ID panel เหมือนกัน
    document.getElementById('online-panel').style.display = (mode === 'online' || mode === 'draft') ? 'flex' : 'none';
    // draft ไม่ต้องเลือก deck เลย ซ่อน theme selectors ทั้งหมด
    document.getElementById('p2-theme-div').style.display = (mode === 'online' || mode === 'draft') ? 'none' : 'block';
    const themeRow = document.getElementById('theme-row');
    if (themeRow) themeRow.style.display = (mode === 'draft') ? 'none' : '';
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

    // สร้าง session token ใหม่ทุกครั้ง
    sessionToken = Date.now().toString();

    if (!inputId) {
        // ═══ P1 HOST ═══
        myRole = 'player';
        onlineRoomId = generateRoomId();
        document.getElementById('room-id-input').value = onlineRoomId;

        // เขียน room ใหม่ลง Firebase ล้างข้อมูลเก่าออกด้วย
        await db.ref('rooms/' + onlineRoomId).set({
            session:     sessionToken,
            hostTheme:   selectedPlayerTheme,
            guestTheme:  null,
            guestReady:  false,
            gameReady:   false,
            state:       null,
            p2action:    null,

        });

        setOnlineStatus('📋 Room: ' + onlineRoomId + '  (ส่ง ID ให้เพื่อน)', '#4ade80');

        // รอ guest join
        db.ref('rooms/' + onlineRoomId + '/guestReady').on('value', snap => {
            if (!snap.val()) return;
            db.ref('rooms/' + onlineRoomId + '/guestReady').off();

            db.ref('rooms/' + onlineRoomId + '/guestTheme').get().then(ts => {
                selectedAITheme = ts.val() || 'isekai_adventure';
                setOnlineStatus('🎮 เพื่อนเข้าแล้ว! กำลังเริ่ม...', '#4ade80');

                // บอก P2 ว่าเกมพร้อมแล้ว พร้อมส่ง session token **ก่อน** เริ่มเกม
                db.ref('rooms/' + onlineRoomId + '/gameReady').set(sessionToken).then(() => {
                    document.getElementById('theme-selector').style.display = 'none';
                    document.getElementById('chat-box').style.display = 'block';
                    // ล้าง log/chat เก่าใน Firebase
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
            });
        });

    } else {
        // ═══ P2 GUEST ═══
        myRole = 'ai';
        onlineRoomId = inputId;
        p2ReadyToReceive = false;

        const snap = await db.ref('rooms/' + onlineRoomId).get();
        if (!snap.exists() || !snap.val().hostTheme) {
            setOnlineStatus('❌ ไม่พบ Room "' + onlineRoomId + '"', '#f87171');
            return;
        }

        const roomData = snap.val();
        selectedPlayerTheme = roomData.hostTheme;

        // P2 เลือกธีมตัวเอง
        const p2ThemeEl = document.getElementById('p2-online-theme');
        selectedAITheme = p2ThemeEl ? p2ThemeEl.value : 'isekai_adventure';

        // แจ้ง host ว่า guest เข้าแล้ว
        await db.ref('rooms/' + onlineRoomId).update({
            guestTheme: selectedAITheme,
            guestReady: true
        });

        setOnlineStatus('✅ รอ Host เริ่มเกม...', '#fcd34d');

        // รอ gameReady (จะได้ session token จาก host)
        db.ref('rooms/' + onlineRoomId + '/gameReady').on('value', snap => {
            const token = snap.val();
            if (!token) return;
            db.ref('rooms/' + onlineRoomId + '/gameReady').off();

            // เก็บ token ไว้ตรวจ state
            sessionToken = token;
            p2ReadyToReceive = true;
            setOnlineStatus('🎮 เกมเริ่มแล้ว!', '#4ade80');
            document.getElementById('theme-selector').style.display = 'none';
            document.getElementById('chat-box').style.display = 'block';

            // เริ่มฟัง state, log, chat และ mulligan จาก host
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
    if (gameMode !== 'online' || myRole !== 'player' || !onlineRoomId || !sessionToken) return;
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
    if (!firebaseReady || !db || gameMode !== 'online' || !onlineRoomId) return;
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
    if (gameMode !== 'online' || myRole !== 'player') return;
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

    </script>
