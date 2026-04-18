// ============================================================
// 15_pack_system.js
// Pack Opener · Collection · Deck Builder · Coins · Rank
// Rank อ่านจาก statsV2/{uid}/wins (ออนไลน์)
// Coins จากชนะบอท → เปิด Pack → สร้าง Custom Deck (60-65 ใบ)
// ============================================================

// ── Constants ──────────────────────────────────────────────
const RARITIES = {
    common:    { key:'common',    label:'Common',    color:'#9ca3af', border:'#6b7280', glow:'rgba(156,163,175,0.4)', icon:'⚪' },
    uncommon:  { key:'uncommon',  label:'Uncommon',  color:'#4ade80', border:'#22c55e', glow:'rgba(74,222,128,0.5)',  icon:'🟢' },
    rare:      { key:'rare',      label:'Rare',      color:'#60a5fa', border:'#3b82f6', glow:'rgba(96,165,250,0.6)',  icon:'🔵' },
    epic:      { key:'epic',      label:'Epic',      color:'#c084fc', border:'#a855f7', glow:'rgba(192,132,252,0.7)', icon:'🟣' },
    legendary: { key:'legendary', label:'Legendary', color:'#fbbf24', border:'#f59e0b', glow:'rgba(251,191,36,0.8)', icon:'✨' },
};

const RANK_CONFIG = [
    { key:'bronze',     label:'Bronze',     icon:'🥉', color:'#cd7f32', bg:'rgba(120,60,20,0.4)',  min:0  },
    { key:'silver',     label:'Silver',     icon:'🥈', color:'#c0c0c0', bg:'rgba(80,80,80,0.4)',   min:5  },
    { key:'gold',       label:'Gold',       icon:'🥇', color:'#ffd700', bg:'rgba(120,100,0,0.4)',  min:15 },
    { key:'diamond',    label:'Diamond',    icon:'💎', color:'#7dd3fc', bg:'rgba(0,80,140,0.4)',   min:30 },
    { key:'adamantium', label:'Adamantium', icon:'⚡', color:'#e879f9', bg:'rgba(100,0,130,0.4)', min:60 },
];

const PACK_TYPES = {
    set_pack: {
        key:'set_pack', name:'Set Pack', desc:'10 การ์ดจาก 1 Set',
        cost:80, icon:'📦', size:10,
        guaranteed:{ common:4, uncommon:2, rare:1 },
        bonus:3,
        bonusW:{ common:30, uncommon:25, rare:25, epic:15, legendary:5 },
    },
    multiverse: {
        key:'multiverse', name:'Multiverse Pack', desc:'10 การ์ดจากทุก Set',
        cost:150, icon:'🌌', size:10,
        guaranteed:{ common:3, uncommon:2, rare:2 },
        bonus:3,
        bonusW:{ common:10, uncommon:15, rare:30, epic:30, legendary:15 },
    },
    legendary_pack: {
        key:'legendary_pack', name:'Legendary Pack', desc:'6 ใบ รับประกัน Epic+',
        cost:350, icon:'👑', size:6,
        guaranteed:{ epic:2, legendary:1 },
        bonus:3,
        bonusW:{ common:0, uncommon:0, rare:40, epic:40, legendary:20 },
    },
};

const SET_LABELS = {
    isekai_adventure:'⚔️ Isekai',  animal_kingdom:'🐾 Animal',
    mythology:'⚡ Mythology',       suankularb:'🌹 Suankularb',
    toy_trooper:'🧸 Toy Trooper',   humanity:'👤 Humanity',
    mage:'🔮 Mage',                 space:'🚀 Space',
};

const BOT_WIN_COINS = 25;
const LS_KEY = 'bb_pack_v1';

// ── Data State ────────────────────────────────────────────
let _coll   = {};   // { "theme::name": count }
let _coins  = 200;
let _myDeck = [];   // [{ name, theme }] saved custom deck

function _save() {
    try { localStorage.setItem(LS_KEY, JSON.stringify({ coll:_coll, coins:_coins, deck:_myDeck })); } catch(e){}
}
function _load() {
    try {
        const d = JSON.parse(localStorage.getItem(LS_KEY) || 'null');
        if (d) { _coll = d.coll||{}; _coins = d.coins??200; _myDeck = d.deck||[]; }
    } catch(e){}
}
async function _firebasePush() {
    if (typeof db === 'undefined' || typeof currentUser === 'undefined' || !currentUser?.uid) return;
    try { await db.ref(`pack_data/${currentUser.uid}`).set({ coll:_coll, coins:_coins, deck:_myDeck }); } catch(e){}
}
async function _firebasePull() {
    if (typeof db === 'undefined' || typeof currentUser === 'undefined' || !currentUser?.uid) return;
    try {
        const snap = await db.ref(`pack_data/${currentUser.uid}`).once('value');
        const d = snap.val();
        if (d) { _coll = d.coll||_coll; _coins = d.coins??_coins; _myDeck = d.deck||_myDeck; _save(); }
    } catch(e){}
}

function _persist() { _save(); _firebasePush(); }

// ── Rarity Helpers ────────────────────────────────────────
function cardRarity(name, theme) {
    const c = (typeof CardSets !== 'undefined') && CardSets[theme]?.[name];
    if (!c) return 'common';
    if (c.isHolyGrail || c.cost >= 10) return 'legendary';
    if (c.cost >= 8) return 'epic';
    if (c.cost >= 5) return 'rare';
    if (c.cost >= 3) return 'uncommon';
    return 'common';
}

function weightedPick(weights) {
    const entries = Object.entries(weights).filter(([,w]) => w > 0);
    const total   = entries.reduce((s,[,w]) => s+w, 0);
    let rand = Math.random() * total;
    for (const [k,w] of entries) { rand -= w; if (rand <= 0) return k; }
    return entries.at(-1)[0];
}

function poolByRarity(theme, rarity) {
    if (typeof CardSets === 'undefined') return [];
    if (theme === '__any__') {
        const r = [];
        Object.keys(CardSets).forEach(t => poolByRarity(t, rarity).forEach(n => r.push({name:n,theme:t})));
        return r;
    }
    return Object.keys(CardSets[theme]||{})
        .filter(n => cardRarity(n, theme) === rarity)
        .map(n => ({name:n, theme}));
}

function pickRandom(pool) { return pool[Math.floor(Math.random()*pool.length)] || null; }

// ── Pack Generation ────────────────────────────────────────
function generatePack(packKey, setKey) {
    const cfg = PACK_TYPES[packKey]; if (!cfg) return [];
    const theme = packKey === 'set_pack' ? (setKey||'isekai_adventure') : '__any__';
    const cards = [];

    const FALLBACK_ORDER = ['legendary','epic','rare','uncommon','common'];
    function safePickRarity(t, rar) {
        let pool = poolByRarity(t, rar);
        if (!pool.length) {
            for (const fb of FALLBACK_ORDER) {
                if (fb === rar) continue;
                pool = poolByRarity(t, fb);
                if (pool.length) { rar = fb; break; }
            }
        }
        const c = pickRandom(pool);
        return c ? {...c, rarity: rar} : null;
    }

    // Guaranteed cards
    for (const [rar, cnt] of Object.entries(cfg.guaranteed)) {
        for (let i = 0; i < cnt; i++) {
            const c = safePickRarity(theme, rar);
            if (c) cards.push(c);
        }
    }
    // Bonus rolls
    for (let i = 0; i < cfg.bonus; i++) {
        const rar = weightedPick(cfg.bonusW);
        const c = safePickRarity(theme, rar);
        if (c) cards.push(c);
    }
    return cards.sort(() => Math.random() - 0.5);
}

// ── Coin & Pack API ───────────────────────────────────────
function addCoins(n) { _coins += n; _persist(); refreshHubCoins(); }

function doOpenPack(packKey, setKey) {
    const cfg = PACK_TYPES[packKey];
    if (!cfg) return;
    if (_coins < cfg.cost) { toast(`❌ Coin ไม่พอ (ต้องการ ${cfg.cost} 🪙)`, '#ef4444'); return; }
    _coins -= cfg.cost;
    const cards = generatePack(packKey, setKey);
    cards.forEach(c => { const k=`${c.theme}::${c.name}`; _coll[k]=(_coll[k]||0)+1; });
    _persist();
    refreshHubCoins();
    showPackOpener(cfg.name, cards);
}

// ── Rank from online wins ──────────────────────────────────
function rankFromWins(w) {
    let r = RANK_CONFIG[0];
    for (const x of RANK_CONFIG) { if (w >= x.min) r = x; }
    return r;
}
function nextRank(w) { return RANK_CONFIG.find(x => x.min > w) || null; }

async function fetchOnlineWins() {
    if (typeof db === 'undefined' || !currentUser?.uid) return 0;
    try {
        const snap = await db.ref(`statsV2/${currentUser.uid}/wins`).once('value');
        return snap.val() || 0;
    } catch(e) { return 0; }
}

// ── Custom Deck Helper ────────────────────────────────────
function buildCustomFromList(list) {
    const deck = [];
    list.forEach(e => {
        if (typeof createCardInstance !== 'function') return;
        const inst = createCardInstance(e.name, e.theme);
        if (inst) deck.push(inst);
    });
    return deck.sort(() => Math.random() - 0.5);
}

// ── Toast ─────────────────────────────────────────────────
function toast(msg, color='#4ade80') {
    let el = document.getElementById('ps-toast');
    if (!el) {
        el = document.createElement('div');
        el.id = 'ps-toast';
        el.style.cssText = `position:fixed;top:24px;left:50%;transform:translateX(-50%);
            padding:10px 22px;border-radius:12px;font-weight:700;font-size:13px;
            z-index:9999;pointer-events:none;opacity:0;transition:opacity 0.3s;
            white-space:nowrap;box-shadow:0 4px 20px rgba(0,0,0,0.5);`;
        document.body.appendChild(el);
    }
    el.style.background = '#111827'; el.style.color = color;
    el.style.border = `1.5px solid ${color}`; el.textContent = msg;
    el.style.opacity = '1';
    clearTimeout(el._t);
    el._t = setTimeout(() => { el.style.opacity = '0'; }, 3000);
}

// ════════════════════════════════════════════════════════════
// HUB UI
// ════════════════════════════════════════════════════════════
function buildHubDOM() {
    if (document.getElementById('pack-hub')) return;
    document.head.insertAdjacentHTML('beforeend', `<style>
        #pack-hub { font-family:'Segoe UI',sans-serif; }
        #pack-hub *{ box-sizing:border-box; }
        .ph-pack { background:linear-gradient(145deg,#1a1a2e,#16213e);
            border:2px solid #2d3748;border-radius:16px;padding:18px;
            cursor:pointer;transition:all .3s;position:relative;overflow:hidden;text-align:center; }
        .ph-pack:hover{ border-color:#fbbf24;transform:translateY(-4px);
            box-shadow:0 10px 30px rgba(251,191,36,.25); }
        .ph-btn{ padding:11px 20px;border-radius:10px;border:none;cursor:pointer;
            font-weight:700;font-size:13px;transition:all .2s; }
        .ph-btn:hover{ transform:scale(1.03); }
        .ph-set-btn{ padding:6px 12px;border-radius:8px;border:2px solid #374151;
            background:#1f2937;color:#9ca3af;cursor:pointer;font-size:11px;font-weight:700;transition:all .2s; }
        .ph-set-btn.on{ border-color:#fbbf24;color:#fbbf24;background:#1c1500; }
        .ph-modal{ display:none;position:fixed;inset:0;z-index:850;align-items:center;justify-content:center; }
        .ph-modal-box{ background:#111827;border-radius:20px;border:2px solid #374151;padding:20px;
            max-width:96%;width:640px;max-height:90vh;display:flex;flex-direction:column;gap:12px; }
        @keyframes phFade{ from{opacity:0;transform:translateY(16px)} to{opacity:1;transform:none} }
        .ph-anim{ animation:phFade .35s ease forwards; }
        .col-card{ border-radius:10px;overflow:hidden;height:128px;position:relative;cursor:default;transition:transform .2s; }
        .col-card:hover{ transform:scale(1.04); }
        .db-row{ display:flex;align-items:center;gap:8px;padding:7px 10px;border-radius:8px;border:1px solid #2d3748; }
        /* Pack card flip */
        .pk-wrap{ width:90px;height:126px;perspective:700px;cursor:pointer;flex-shrink:0; }
        .pk-inner{ width:100%;height:100%;position:relative;transform-style:preserve-3d;transition:transform .55s cubic-bezier(.4,0,.2,1); }
        .pk-inner.flipped{ transform:rotateY(180deg); }
        .pk-face,.pk-back{ position:absolute;inset:0;border-radius:10px;backface-visibility:hidden; }
        .pk-back{ background:linear-gradient(135deg,#1a1a3e,#0d0d2a);border:2px solid #4c1d95;
            display:flex;align-items:center;justify-content:center;font-size:30px; }
        .pk-face{ transform:rotateY(180deg);background-size:cover;background-position:center;
            display:flex;flex-direction:column;justify-content:flex-end;overflow:hidden; }
    </style>`);

    const hub = document.createElement('div');
    hub.id = 'pack-hub';
    hub.style.cssText = `display:none;position:fixed;inset:0;background:#070710;
        z-index:800;overflow-y:auto;`;
    hub.innerHTML = `
    <div style="max-width:580px;margin:0 auto;padding:16px 14px 32px;">

        <!-- TOP BAR -->
        <div style="display:flex;align-items:center;gap:12px;margin-bottom:20px;
            background:linear-gradient(135deg,#111827,#1a2035);border-radius:16px;
            padding:14px 16px;border:1px solid #2d3748;">
            <div id="ph-rank-icon" style="font-size:30px;line-height:1;">🥉</div>
            <div style="flex:1;">
                <div id="ph-rank-label" style="font-weight:800;font-size:16px;color:#cd7f32;">Bronze</div>
                <div id="ph-rank-prog"  style="font-size:11px;color:#6b7280;margin-top:2px;">0 / 5 wins for Silver</div>
            </div>
            <div style="text-align:right;">
                <div id="ph-coins" style="font-size:22px;font-weight:800;color:#fbbf24;letter-spacing:-0.5px;">🪙 200</div>
                <div style="font-size:10px;color:#6b7280;">จากชนะ AI = +${BOT_WIN_COINS}🪙</div>
            </div>
            <button onclick="closeHub()" style="background:#374151;color:#9ca3af;border:none;
                border-radius:8px;padding:8px 13px;cursor:pointer;font-size:13px;font-weight:700;">✕</button>
        </div>

        <!-- PACK GRID -->
        <div style="font-size:11px;color:#6b7280;font-weight:700;letter-spacing:1px;margin-bottom:10px;">📦 OPEN PACKS</div>
        <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:10px;margin-bottom:14px;">
            <div class="ph-pack" onclick="toggleSetSelector()">
                <div style="font-size:30px;margin-bottom:8px;">📦</div>
                <div style="font-weight:800;font-size:12px;color:white;margin-bottom:4px;">Set Pack</div>
                <div style="font-size:10px;color:#9ca3af;margin-bottom:8px;">10 ใบจาก 1 Set</div>
                <div style="color:#fbbf24;font-weight:800;font-size:13px;">80 🪙</div>
            </div>
            <div class="ph-pack" onclick="doOpenPack('multiverse',null)"
                style="background:linear-gradient(145deg,#120f30,#0c0a22);">
                <div style="font-size:30px;margin-bottom:8px;">🌌</div>
                <div style="font-weight:800;font-size:12px;color:white;margin-bottom:4px;">Multiverse</div>
                <div style="font-size:10px;color:#9ca3af;margin-bottom:8px;">10 ใบจากทุก Set</div>
                <div style="color:#fbbf24;font-weight:800;font-size:13px;">150 🪙</div>
            </div>
            <div class="ph-pack" onclick="doOpenPack('legendary_pack',null)"
                style="background:linear-gradient(145deg,#1c1400,#2a1e00);">
                <div style="font-size:30px;margin-bottom:8px;">👑</div>
                <div style="font-weight:800;font-size:12px;color:white;margin-bottom:4px;">Legendary</div>
                <div style="font-size:10px;color:#9ca3af;margin-bottom:8px;">รับประกัน Epic+</div>
                <div style="color:#fbbf24;font-weight:800;font-size:13px;">350 🪙</div>
            </div>
        </div>

        <!-- SET SELECTOR -->
        <div id="ph-set-selector" style="display:none;background:#0f1629;border-radius:12px;
            padding:14px;border:1px solid #2d3748;margin-bottom:14px;">
            <div style="font-size:11px;color:#9ca3af;margin-bottom:10px;font-weight:700;">เลือก Set สำหรับ Set Pack:</div>
            <div style="display:flex;flex-wrap:wrap;gap:6px;margin-bottom:12px;">
                ${Object.entries(SET_LABELS).map(([k,v])=>
                    `<button class="ph-set-btn" id="psb-${k}" onclick="pickSet('${k}')">${v}</button>`
                ).join('')}
            </div>
            <button onclick="confirmSetPack()" style="width:100%;padding:10px;background:#fbbf24;
                color:#000;border:none;border-radius:10px;font-weight:800;font-size:13px;cursor:pointer;">
                📦 เปิด Set Pack (80 🪙)
            </button>
        </div>

        <!-- ACTIONS -->
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-bottom:12px;">
            <button class="ph-btn" onclick="openCollectionModal()"
                style="background:linear-gradient(135deg,#1e3a5f,#1e4d8f);color:white;">
                🃏 Collection
            </button>
            <button class="ph-btn" onclick="openDeckBuilder()"
                style="background:linear-gradient(135deg,#14532d,#15803d);color:white;">
                🔨 Build Deck
            </button>
        </div>

        <!-- PLAY BUTTON -->
        <button class="ph-btn" onclick="closeHub()" style="width:100%;
            background:linear-gradient(135deg,#7c3aed,#6d28d9);color:white;
            font-size:16px;padding:15px;border-radius:14px;border:2px solid #a78bfa;
            box-shadow:0 0 20px rgba(124,58,237,.35);">
            ▶ เล่นเกม
        </button>
        <div style="text-align:center;font-size:11px;color:#374151;margin-top:14px;">
            Rank = Online Wins · Custom Deck ต้องมี 60–65 ใบ
        </div>
    </div>

    <!-- ══ COLLECTION MODAL ══ -->
    <div class="ph-modal" id="ph-col-modal" onclick="if(event.target===this)closeCollModal()">
        <div class="ph-modal-box ph-anim">
            <div style="display:flex;justify-content:space-between;align-items:center;flex-shrink:0;">
                <div style="font-size:17px;font-weight:800;color:white;">🃏 Collection</div>
                <div style="display:flex;gap:8px;">
                    <select id="cf-set" onchange="renderColGrid()"
                        style="background:#1f2937;color:white;border:1px solid #374151;border-radius:8px;padding:5px 8px;font-size:11px;">
                        <option value="">ทุก Set</option>
                        ${Object.entries(SET_LABELS).map(([k,v])=>`<option value="${k}">${v}</option>`).join('')}
                    </select>
                    <select id="cf-rar" onchange="renderColGrid()"
                        style="background:#1f2937;color:white;border:1px solid #374151;border-radius:8px;padding:5px 8px;font-size:11px;">
                        <option value="">ทุก Rarity</option>
                        ${Object.values(RARITIES).map(r=>`<option value="${r.key}">${r.icon} ${r.label}</option>`).join('')}
                    </select>
                    <button onclick="closeCollModal()" style="background:#374151;color:white;border:none;
                        border-radius:8px;padding:5px 12px;cursor:pointer;font-weight:700;">✕</button>
                </div>
            </div>
            <div id="ph-col-grid" style="overflow-y:auto;flex:1;display:grid;
                grid-template-columns:repeat(auto-fill,minmax(98px,1fr));gap:10px;padding-right:4px;"></div>
        </div>
    </div>

    <!-- ══ DECK BUILDER MODAL ══ -->
    <div class="ph-modal" id="ph-db-modal" onclick="if(event.target===this)closeDeckBuilder()">
        <div class="ph-modal-box ph-anim" style="width:700px;">
            <!-- Header -->
            <div style="display:flex;justify-content:space-between;align-items:center;flex-shrink:0;">
                <div>
                    <div style="font-size:17px;font-weight:800;color:white;">🔨 Deck Builder</div>
                    <div style="font-size:11px;color:#6b7280;">60–65 ใบ · Max 4 copies ต่อการ์ด</div>
                </div>
                <button onclick="closeDeckBuilder()" style="background:#374151;color:white;border:none;
                    border-radius:8px;padding:6px 13px;cursor:pointer;font-weight:700;">✕</button>
            </div>
            <!-- Deck status bar -->
            <div style="display:flex;align-items:center;gap:12px;background:#1f2937;border-radius:12px;
                padding:11px 14px;flex-shrink:0;border:1px solid #2d3748;">
                <div id="db-count" style="font-size:22px;font-weight:800;color:#fbbf24;min-width:60px;">0 / 65</div>
                <div id="db-status" style="flex:1;font-size:12px;color:#6b7280;">เพิ่มการ์ดเพื่อสร้าง Deck</div>
                <button onclick="dbClear()" style="background:#7f1d1d;color:#fca5a5;border:none;
                    border-radius:8px;padding:6px 12px;cursor:pointer;font-size:12px;font-weight:700;">🗑</button>
                <button onclick="dbSave()" style="background:#166534;color:#86efac;border:none;
                    border-radius:8px;padding:8px 16px;cursor:pointer;font-weight:700;font-size:13px;">💾 บันทึก</button>
            </div>
            <!-- Two-column layout -->
            <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;overflow:hidden;flex:1;min-height:0;">
                <!-- Left: Collection -->
                <div style="display:flex;flex-direction:column;gap:8px;min-height:0;">
                    <div style="display:flex;align-items:center;gap:6px;flex-shrink:0;">
                        <span style="font-size:11px;color:#9ca3af;font-weight:700;flex:1;">📚 Collection</span>
                        <select id="dbf-set" onchange="renderDbColl()"
                            style="background:#1f2937;color:white;border:1px solid #374151;border-radius:6px;padding:4px 6px;font-size:11px;">
                            <option value="">ทุก Set</option>
                            ${Object.entries(SET_LABELS).map(([k,v])=>`<option value="${k}">${v}</option>`).join('')}
                        </select>
                    </div>
                    <div id="db-coll-list" style="overflow-y:auto;flex:1;display:flex;flex-direction:column;gap:4px;"></div>
                </div>
                <!-- Right: Deck -->
                <div style="display:flex;flex-direction:column;gap:8px;min-height:0;">
                    <span style="font-size:11px;color:#9ca3af;font-weight:700;flex-shrink:0;">🃏 Deck ของคุณ</span>
                    <div id="db-deck-list" style="overflow-y:auto;flex:1;display:flex;flex-direction:column;gap:4px;"></div>
                </div>
            </div>
        </div>
    </div>

    <!-- ══ PACK OPENER MODAL ══ -->
    <div id="ph-opener" style="display:none;position:fixed;inset:0;background:rgba(0,0,0,.97);
        z-index:900;align-items:center;justify-content:center;flex-direction:column;">
        <div id="ph-opener-title" style="color:white;font-size:19px;font-weight:800;margin-bottom:20px;text-align:center;"></div>
        <div id="ph-opener-cards" style="display:flex;flex-wrap:wrap;gap:12px;justify-content:center;
            max-width:600px;margin-bottom:20px;"></div>
        <div id="ph-opener-actions" style="display:none;flex-direction:column;align-items:center;gap:10px;">
            <button onclick="closeOpener()" style="background:#4ade80;color:#000;border:none;border-radius:12px;
                padding:12px 36px;font-weight:800;font-size:15px;cursor:pointer;">✓ เก็บการ์ดทั้งหมด</button>
        </div>
        <button onclick="revealAllCards()" style="background:#374151;color:#9ca3af;border:none;
            border-radius:10px;padding:8px 20px;cursor:pointer;font-size:12px;margin-top:8px;">
            🔍 เปิดทั้งหมด
        </button>
    </div>`;

    document.body.appendChild(hub);
}

// ── Hub state ─────────────────────────────────────────────
let _selectedSet = null;
let _packCardFlipFns = [];

function showHub() {
    buildHubDOM();
    document.getElementById('pack-hub').style.display = 'block';
    _load();
    refreshHubCoins();
    // Pull Firebase & update rank
    _firebasePull().then(() => { refreshHubCoins(); });
    fetchOnlineWins().then(w => updateHubRank(w));
}

function closeHub() {
    const h = document.getElementById('pack-hub');
    if (h) h.style.display = 'none';
}

window.openHub   = showHub;
window.closeHub  = closeHub;

function refreshHubCoins() {
    const el = document.getElementById('ph-coins');
    if (el) el.textContent = `🪙 ${_coins.toLocaleString()}`;
}

function updateHubRank(wins) {
    const r  = rankFromWins(wins);
    const nx = nextRank(wins);
    const badge = document.getElementById('ph-rank-icon');
    const label = document.getElementById('ph-rank-label');
    const prog  = document.getElementById('ph-rank-prog');
    if (badge) badge.textContent = r.icon;
    if (label) { label.textContent = r.label; label.style.color = r.color; }
    if (prog)  prog.textContent = nx ? `${wins} / ${nx.min} wins for ${nx.label}` : '⚡ MAX RANK';
}

// Set selector
window.toggleSetSelector = function() {
    const s = document.getElementById('ph-set-selector');
    if (!s) return;
    s.style.display = s.style.display === 'none' ? 'block' : 'none';
};
window.pickSet = function(key) {
    _selectedSet = key;
    document.querySelectorAll('.ph-set-btn').forEach(b => b.classList.remove('on'));
    const btn = document.getElementById(`psb-${key}`);
    if (btn) btn.classList.add('on');
};
window.confirmSetPack = function() {
    if (!_selectedSet) { toast('⚠️ เลือก Set ก่อนนะ', '#fbbf24'); return; }
    document.getElementById('ph-set-selector').style.display = 'none';
    doOpenPack('set_pack', _selectedSet);
};

// ── Pack Opener Animation ──────────────────────────────────
function showPackOpener(packName, cards) {
    buildHubDOM();
    const modal   = document.getElementById('ph-opener');
    const title   = document.getElementById('ph-opener-title');
    const area    = document.getElementById('ph-opener-cards');
    const actions = document.getElementById('ph-opener-actions');
    if (!modal) return;
    area.innerHTML = '';
    actions.style.display = 'none';
    modal.style.display = 'flex';
    if (title) title.textContent = `✨ ${packName} — ${cards.length} การ์ด`;

    _packCardFlipFns = [];
    let flippedCount = 0;

    cards.forEach((card) => {
        const r  = RARITIES[card.rarity] || RARITIES.common;
        const tpl = (typeof CardSets !== 'undefined') && CardSets[card.theme]?.[card.name];
        const art = tpl?.art || '';

        const wrap = document.createElement('div');
        wrap.className = 'pk-wrap';

        const inner = document.createElement('div');
        inner.className = 'pk-inner';

        // Back face
        const back = document.createElement('div');
        back.className = 'pk-back';
        back.textContent = '🎴';

        // Front face
        const face = document.createElement('div');
        face.className = 'pk-face';
        if (art) face.style.backgroundImage = `url(${art})`;
        else face.style.background = '#1f2937';
        face.style.border = `2px solid ${r.border}`;
        face.style.boxShadow = `0 0 18px ${r.glow}`;
        face.innerHTML = `
            <div style="background:linear-gradient(transparent,rgba(0,0,0,.92));padding:7px 6px;">
                <div style="font-size:9px;color:${r.color};font-weight:800;margin-bottom:2px;">${r.icon} ${r.label}</div>
                <div style="font-size:10px;color:white;font-weight:700;line-height:1.25;margin-bottom:1px;">${card.name}</div>
                <div style="font-size:8px;color:#9ca3af;">${SET_LABELS[card.theme]||card.theme}</div>
            </div>`;

        inner.appendChild(back);
        inner.appendChild(face);
        wrap.appendChild(inner);

        const flip = () => {
            if (inner.classList.contains('flipped')) return;
            inner.classList.add('flipped');
            // Add shine on legendary/epic
            if (card.rarity === 'legendary' || card.rarity === 'epic') {
                inner.style.filter = `drop-shadow(0 0 12px ${r.glow})`;
            }
            flippedCount++;
            if (flippedCount >= cards.length && actions) {
                actions.style.display = 'flex';
            }
        };

        wrap.onclick = flip;
        _packCardFlipFns.push(flip);
        area.appendChild(wrap);
    });

    // Auto-reveal one card after short delay
    setTimeout(() => _packCardFlipFns[0] && _packCardFlipFns[0](), 400);
}

window.revealAllCards = function() {
    _packCardFlipFns.forEach(fn => fn());
};
window.closeOpener = function() {
    const m = document.getElementById('ph-opener');
    if (m) m.style.display = 'none';
};

// ── Collection Viewer ─────────────────────────────────────
window.openCollectionModal = function() {
    buildHubDOM();
    const m = document.getElementById('ph-col-modal');
    if (m) { m.style.display = 'flex'; renderColGrid(); }
};
window.closeCollModal = function() {
    const m = document.getElementById('ph-col-modal');
    if (m) m.style.display = 'none';
};

window.renderColGrid = function() {
    const grid = document.getElementById('ph-col-grid');
    if (!grid) return;
    const fSet = document.getElementById('cf-set')?.value || '';
    const fRar = document.getElementById('cf-rar')?.value || '';
    const owned = Object.entries(_coll).filter(([,c]) => c > 0);
    grid.innerHTML = '';

    if (!owned.length) {
        grid.innerHTML = `<div style="grid-column:1/-1;text-align:center;color:#6b7280;padding:40px 16px;font-size:13px;">
            ยังไม่มีการ์ด 😢<br>เปิด Pack เพื่อเริ่มสะสม!
        </div>`; return;
    }

    owned.forEach(([key, cnt]) => {
        const [theme, ...np] = key.split('::');
        const name = np.join('::');
        if (fSet && theme !== fSet) return;
        const rar = cardRarity(name, theme);
        if (fRar && rar !== fRar) return;
        const r  = RARITIES[rar];
        const tpl = (typeof CardSets !== 'undefined') && CardSets[theme]?.[name];
        const art = tpl?.art || '';

        const el = document.createElement('div');
        el.className = 'col-card';
        el.style.border = `2px solid ${r.border}`;
        el.style.boxShadow = `0 0 8px ${r.glow}`;
        if (art) { el.style.background = `url(${art}) center/cover`; }
        else el.style.background = '#1f2937';
        el.innerHTML = `
            <div style="position:absolute;inset:0;background:linear-gradient(transparent 38%,rgba(0,0,0,.92));"></div>
            <div style="position:absolute;top:4px;right:4px;background:rgba(0,0,0,.75);border-radius:6px;
                padding:2px 6px;font-size:9px;color:${r.color};font-weight:800;">${r.icon}</div>
            <div style="position:absolute;top:4px;left:4px;background:#fbbf24;color:#000;border-radius:6px;
                padding:2px 6px;font-size:11px;font-weight:800;">×${cnt}</div>
            <div style="position:absolute;bottom:0;left:0;right:0;padding:6px;">
                <div style="font-size:9px;color:white;font-weight:700;line-height:1.25;
                    white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">${name}</div>
                <div style="font-size:8px;color:#9ca3af;">${SET_LABELS[theme]||theme}</div>
            </div>`;
        grid.appendChild(el);
    });
};

// ── Deck Builder ──────────────────────────────────────────
let _wip = []; // working deck [{name,theme}]

window.openDeckBuilder = function() {
    buildHubDOM();
    _wip = [..._myDeck];
    const m = document.getElementById('ph-db-modal');
    if (m) { m.style.display = 'flex'; renderDbColl(); renderDbDeck(); }
};
window.closeDeckBuilder = function() {
    const m = document.getElementById('ph-db-modal');
    if (m) m.style.display = 'none';
};

function updateDbCounter() {
    const n = _wip.length;
    const cnt = document.getElementById('db-count');
    const sts = document.getElementById('db-status');
    if (cnt) { cnt.textContent = `${n} / 65`; cnt.style.color = n>=60&&n<=65?'#4ade80':n>65?'#ef4444':'#fbbf24'; }
    if (sts) {
        if (n < 60)       { sts.textContent = `ต้องการ ${60-n} ใบเพิ่ม`; sts.style.color='#fbbf24'; }
        else if (n > 65)  { sts.textContent = `เกิน! ลด ${n-65} ใบ`;       sts.style.color='#ef4444'; }
        else              { sts.textContent = '✓ Deck พร้อมแล้ว!';          sts.style.color='#4ade80'; }
    }
}

window.renderDbColl = function() {
    const list = document.getElementById('db-coll-list');
    if (!list) return;
    const fSet = document.getElementById('dbf-set')?.value || '';
    list.innerHTML = '';
    const owned = Object.entries(_coll).filter(([,c]) => c > 0);
    if (!owned.length) {
        list.innerHTML = `<div style="color:#6b7280;font-size:12px;text-align:center;padding:24px 8px;">
            ไม่มีการ์ด<br>เปิด Pack ก่อนนะ!</div>`; return;
    }
    owned.forEach(([key, ownCnt]) => {
        const [theme, ...np] = key.split('::');
        const name = np.join('::');
        if (fSet && theme !== fSet) return;
        const rar = cardRarity(name, theme);
        const r = RARITIES[rar];
        const inDeck = _wip.filter(c => c.name===name && c.theme===theme).length;
        const avail  = ownCnt - inDeck;
        const tpl = (typeof CardSets !== 'undefined') && CardSets[theme]?.[name];
        const art = tpl?.art || '';

        const row = document.createElement('div');
        row.className = 'db-row';
        row.style.background = avail > 0 ? '#1f2937' : '#111827';
        row.style.opacity    = avail > 0 ? '1' : '0.4';
        row.style.borderColor= avail > 0 ? '#2d3748' : '#111';

        const thumb = document.createElement('div');
        thumb.style.cssText = `width:36px;height:50px;border-radius:6px;flex-shrink:0;
            border:1px solid ${r.border};background:${art?`url(${art}) center/cover`:'#374151'};`;

        const info = document.createElement('div');
        info.style.cssText = 'flex:1;min-width:0;';
        info.innerHTML = `
            <div style="font-size:11px;color:${r.color};font-weight:700;
                white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">${name}</div>
            <div style="font-size:9px;color:#6b7280;">${SET_LABELS[theme]||theme}</div>
            <div style="font-size:9px;color:#9ca3af;">มี: ${ownCnt} | ใน deck: ${inDeck}</div>`;

        const btn = document.createElement('button');
        btn.textContent = '+';
        btn.style.cssText = `background:${avail>0?'#166534':'#374151'};
            color:${avail>0?'#86efac':'#6b7280'};border:none;border-radius:6px;
            padding:5px 10px;cursor:${avail>0?'pointer':'not-allowed'};font-size:18px;font-weight:800;`;
        btn.disabled = avail <= 0;
        btn.onclick = () => {
            if (_wip.filter(c=>c.name===name&&c.theme===theme).length >= 4)
                { toast('⚠️ Max 4 copies', '#fbbf24'); return; }
            if (_wip.length >= 65) { toast('❌ Deck เต็มแล้ว (max 65)', '#ef4444'); return; }
            if (_wip.filter(c=>c.name===name&&c.theme===theme).length >= ownCnt)
                { toast('❌ ไม่มีการ์ดเพิ่ม', '#ef4444'); return; }
            _wip.push({name, theme});
            renderDbColl(); renderDbDeck();
        };

        row.appendChild(thumb); row.appendChild(info); row.appendChild(btn);
        list.appendChild(row);
    });
};

function renderDbDeck() {
    const list = document.getElementById('db-deck-list');
    if (!list) return;
    list.innerHTML = '';
    const groups = {};
    _wip.forEach(c => { const k=`${c.theme}::${c.name}`; groups[k]=(groups[k]||0)+1; });
    Object.entries(groups).forEach(([key, cnt]) => {
        const [theme, ...np] = key.split('::');
        const name = np.join('::');
        const r = RARITIES[cardRarity(name, theme)];

        const row = document.createElement('div');
        row.className = 'db-row';
        row.style.background = '#1a1f2e';
        row.innerHTML = `
            <div style="color:${r.color};font-size:11px;font-weight:800;min-width:20px;">×${cnt}</div>
            <div style="flex:1;font-size:11px;color:white;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">${name}</div>`;
        const rm = document.createElement('button');
        rm.textContent = '−';
        rm.style.cssText = `background:#7f1d1d;color:#fca5a5;border:none;border-radius:6px;
            padding:3px 9px;cursor:pointer;font-size:16px;font-weight:800;`;
        rm.onclick = () => {
            let found = false;
            for (let i = _wip.length-1; i >= 0; i--) {
                if (_wip[i].name===name && _wip[i].theme===theme) { _wip.splice(i,1); found=true; break; }
            }
            if (found) { renderDbColl(); renderDbDeck(); }
        };
        row.appendChild(rm);
        list.appendChild(row);
    });
    updateDbCounter();
}

window.dbClear = function() {
    if (!confirm('ล้าง Deck ทั้งหมด?')) return;
    _wip = []; renderDbColl(); renderDbDeck();
};

window.dbSave = function() {
    const n = _wip.length;
    if (n < 60 || n > 65) { toast(`❌ Deck ต้องมี 60–65 ใบ (ตอนนี้ ${n})`, '#ef4444'); return; }
    _myDeck = [..._wip];
    window._customDeckList = _myDeck; // exposed for buildDeck hook
    _persist();
    toast('✓ บันทึก Deck เรียบร้อย!', '#4ade80');
    closeDeckBuilder();
};

// ════════════════════════════════════════════════════════════
// MONKEY-PATCH HOOKS (run after window load)
// ════════════════════════════════════════════════════════════
function applyHooks() {
    // 1) endGame → add coins on bot win
    if (typeof endGame === 'function') {
        const _orig = endGame;
        window.endGame = function(winner) {
            _orig(winner);
            if ((typeof gameMode !== 'undefined') && gameMode === 'ai' && winner === 'player') {
                addCoins(BOT_WIN_COINS);
                toast(`🪙 +${BOT_WIN_COINS} Coin จากชนะ AI!`, '#fbbf24');
            }
        };
    }

    // 2) buildDeck → support '__custom_player__' theme
    if (typeof buildDeck === 'function') {
        const _origBD = buildDeck;
        window.buildDeck = function(theme) {
            if (theme === '__custom_player__') {
                const list = window._customDeckList || _myDeck;
                if (list.length >= 60) return buildCustomFromList(list);
                toast('❌ Custom Deck ยังไม่พร้อม! (ต้องการ 60 ใบ)', '#ef4444');
                return _origBD('isekai_adventure'); // fallback
            }
            return _origBD(theme);
        };
    }

    // 3) Firebase auth state → sync collection
    if (typeof firebase !== 'undefined') {
        try {
            firebase.auth().onAuthStateChanged(user => {
                if (user) {
                    _firebasePull().then(() => {
                        refreshHubCoins();
                        fetchOnlineWins().then(w => updateHubRank(w));
                    });
                }
            });
        } catch(e) {}
    }

    // 4) Inject "🎴 Collection" button into auth bar
    injectHubButton();
}

function injectHubButton() {
    // Wait for auth-bar to exist
    const tryInject = () => {
        const bar = document.getElementById('auth-bar');
        if (!bar) { setTimeout(tryInject, 200); return; }
        if (document.getElementById('ps-hub-btn')) return;
        const btn = document.createElement('button');
        btn.id = 'ps-hub-btn';
        btn.textContent = '🎴 Collection';
        btn.style.cssText = `background:#7c3aed;color:white;border:none;border-radius:8px;
            padding:6px 13px;font-size:12px;font-weight:700;cursor:pointer;white-space:nowrap;flex-shrink:0;`;
        btn.onclick = showHub;
        bar.appendChild(btn);
    };
    tryInject();
}

// ── Boot ──────────────────────────────────────────────────
_load(); // load from localStorage immediately
window.addEventListener('load', () => {
    applyHooks();
    window._customDeckList = _myDeck; // expose saved deck
});
