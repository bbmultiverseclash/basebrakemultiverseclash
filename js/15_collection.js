// ============================================================
// 15_collection.js — Pack System, Collection, Ranks, Deck Builder
// ============================================================

// ─── CONSTANTS ──────────────────────────────────────────────────
const RARITY_CFG = {
    Common:    { label:'Common',    color:'#9ca3af', glow:'rgba(156,163,175,0.4)', border:'#6b7280', weight:60, emoji:'○' },
    Uncommon:  { label:'Uncommon',  color:'#4ade80', glow:'rgba(74,222,128,0.5)',  border:'#22c55e', weight:25, emoji:'◈' },
    Rare:      { label:'Rare',      color:'#60a5fa', glow:'rgba(96,165,250,0.7)',  border:'#3b82f6', weight:10, emoji:'◆' },
    Epic:      { label:'Epic',      color:'#c084fc', glow:'rgba(192,132,252,0.8)', border:'#a855f7', weight:4,  emoji:'✦' },
    Legendary: { label:'Legendary', color:'#fb923c', glow:'rgba(251,146,60,0.9)',  border:'#f97316', weight:1,  emoji:'★' },
};
const RARITY_ORDER = ['Common','Uncommon','Rare','Epic','Legendary'];

const RANKS_CFG = [
    { name:'Bronze',  emoji:'🥉', colorHex:'#cd7f32', rpMin:0,     rpMax:999,      coinWin:60,  rpGain:25, rpLoss:15 },
    { name:'Silver',  emoji:'🥈', colorHex:'#c0c0c0', rpMin:1000,  rpMax:2999,     coinWin:80,  rpGain:25, rpLoss:15 },
    { name:'Gold',    emoji:'🥇', colorHex:'#ffd700', rpMin:3000,  rpMax:5999,     coinWin:100, rpGain:25, rpLoss:15 },
    { name:'Diamond', emoji:'💎', colorHex:'#67e8f9', rpMin:6000,  rpMax:9999,     coinWin:150, rpGain:30, rpLoss:20 },
    { name:'Adam',    emoji:'⚡', colorHex:'#e879f9', rpMin:10000, rpMax:Infinity, coinWin:200, rpGain:35, rpLoss:20 },
];

const PACK_CFG = {
    standard: { name:'Standard Pack', cost:150, count:5, art:'🎴',
        desc:'5 การ์ดสุ่ม ทุกความหายาก',
        weights:{Common:60,Uncommon:25,Rare:10,Epic:4,Legendary:1}, guaranteed:null },
    premium:  { name:'Premium Pack',  cost:350, count:5, art:'⭐',
        desc:'มีการ์ด Rare ขึ้นไป 1 ใบ',
        weights:{Common:30,Uncommon:30,Rare:25,Epic:12,Legendary:3}, guaranteed:'Rare' },
    elite:    { name:'Elite Pack',    cost:900, count:5, art:'👑',
        desc:'มีการ์ด Epic ขึ้นไป 1 ใบ',
        weights:{Common:10,Uncommon:20,Rare:32,Epic:28,Legendary:10}, guaranteed:'Epic' },
};

const SETS_META = {
    isekai_adventure: { label:'Isekai Adventure', emoji:'⚔️',  mascot:'Ainz Ooal Gown',   mascotArt:'https://files.catbox.moe/t06vc0.jpg' },
    animal_kingdom:   { label:'Animal Kingdom',   emoji:'🦁',  mascot:'Lion King of Forest',mascotArt:'https://upload.wikimedia.org/wikipedia/commons/thumb/7/73/Lion_waiting_in_Namibia.jpg/800px-Lion_waiting_in_Namibia.jpg' },
    humanity:         { label:'Humanity',         emoji:'🌍',  mascot:'Genghis Khan',       mascotArt:'https://upload.wikimedia.org/wikipedia/commons/thumb/e/ea/YuanEmperorAlbumGenghisPortrait.jpg/800px-YuanEmperorAlbumGenghisPortrait.jpg' },
    suankularb:       { label:'Suan Kularb',      emoji:'🏫',  mascot:'Pongneng',            mascotArt:'https://files.catbox.moe/rvzfo5.mp3' },
    space:            { label:'Space',            emoji:'🚀',  mascot:'Galax Dragon',        mascotArt:'https://images.unsplash.com/photo-1614730321146-b6fa6a46bcb4?w=800&q=80' },
};

const SAVE_KEY = 'basebreak_v2_save';

// ─── PLAYER DATA ─────────────────────────────────────────────────
let playerData;

function defaultPlayerData() {
    return { coins:800, rp:0, collection:{}, decks:[], wins:0, losses:0, totalGames:0,
             firstWinDate:null, activeDecks:{} };
}
function loadPlayerData() {
    try { const r = localStorage.getItem(SAVE_KEY); if(r) return JSON.parse(r); } catch(e){}
    return defaultPlayerData();
}
function saveData() { try { localStorage.setItem(SAVE_KEY, JSON.stringify(playerData)); } catch(e){} }

playerData = loadPlayerData();

// ─── RARITY HELPERS ──────────────────────────────────────────────
const LEGENDARY_SET = new Set([
    'Rimuru Tempest','Ainz Ooal Gown','Goal of All Life is Death','Reinhard',
    'Goblin Lord','Kim Dokja','Sung Jin-Woo','Emilia','Maple','Explosion',
    'Miyamoto Musashi','Genghis Khan','Alexander the great','Julius Caesar',
    'Hiroshima Atomic Bombing','Theory of Relativity','Blue Whale',
    'Lion King of Forest','Galax Dragon','Skeleton King',
]);
const EPIC_SET = new Set([
    'Aqua','Shadow','Death Knight','Shalltear','Arthur Leywin','Kumoko',
    'Kazuma Satou','Celestia Yupitalia','Skull Devourer','Oppenheimer',
    'Nikola Tesla','Albert Einstein','Vlad','Leonidas I','Bayinnaung',
    'Simo Häyhä','Silverback Gorilla','Komodo Dragon','Grizzly Bear',
    'Polar Bear','Anaconda','Tiger','B-2 Spirit',"Genie's Lamp",'F-35',
    'Kirito','Asuna','Seyya','Subaru',
]);

function getCardRarity(name, data) {
    if (LEGENDARY_SET.has(name)) return 'Legendary';
    if (EPIC_SET.has(name)) return 'Epic';
    const cost = data?.cost ?? 0;
    if (cost >= 9) return 'Epic';
    if (cost >= 7) return 'Rare';
    if (cost >= 4) return 'Uncommon';
    return 'Common';
}

function getRankInfo(rp) {
    for (let i = RANKS_CFG.length-1; i >= 0; i--)
        if (rp >= RANKS_CFG[i].rpMin) return RANKS_CFG[i];
    return RANKS_CFG[0];
}
function getRankProgress(rp) {
    const rank = getRankInfo(rp);
    if (rank.rpMax === Infinity) return 100;
    return Math.min(100, Math.round((rp - rank.rpMin) / (rank.rpMax - rank.rpMin+1) * 100));
}

// ─── PACK OPENING ────────────────────────────────────────────────
function rollRarity(weights, guaranteedMin) {
    if (guaranteedMin) {
        const minIdx = RARITY_ORDER.indexOf(guaranteedMin);
        const eligible = {};
        let tot = 0;
        RARITY_ORDER.forEach((r,i) => { if(i>=minIdx){ eligible[r]=weights[r]||1; tot+=eligible[r]; } });
        let roll = Math.random()*tot;
        for(const [r,w] of Object.entries(eligible)){ roll-=w; if(roll<=0) return r; }
        return RARITY_ORDER[RARITY_ORDER.length-1];
    }
    let tot = Object.values(weights).reduce((a,b)=>a+b,0);
    let roll = Math.random()*tot;
    for(const [r,w] of Object.entries(weights)){ roll-=w; if(roll<=0) return r; }
    return 'Common';
}

function getSetCardPool(setName) {
    const cards = (typeof CardSets !== 'undefined') ? CardSets[setName] : {};
    if (!cards) return [];
    return Object.entries(cards).map(([name, data]) => ({
        name, data, rarity: getCardRarity(name, data), theme: setName
    }));
}

function openPack(packType, setName) {
    const cfg = PACK_CFG[packType];
    if (!cfg) return { error:'Unknown pack type' };
    if (playerData.coins < cfg.cost) return { error:'เหรียญไม่พอ!' };

    playerData.coins -= cfg.cost;
    const pool = getSetCardPool(setName);
    if (pool.length === 0) return { error:'ไม่มีการ์ดในเซต' };

    const result = [];
    for (let i = 0; i < cfg.count; i++) {
        const useGuaranteed = cfg.guaranteed && i === 0;
        const targetRarity = rollRarity(cfg.weights, useGuaranteed ? cfg.guaranteed : null);
        let candidates = pool.filter(c => c.rarity === targetRarity);
        if (!candidates.length) {
            // Fallback to any rarity
            for (const r of [...RARITY_ORDER].reverse()) {
                candidates = pool.filter(c => c.rarity === r);
                if (candidates.length) break;
            }
        }
        const card = candidates[Math.floor(Math.random() * candidates.length)];
        result.push(card);
        const key = `${card.name}|${setName}`;
        playerData.collection[key] = (playerData.collection[key] || 0) + 1;
    }
    saveData();
    return { cards: result };
}

// ─── AWARD SYSTEM ────────────────────────────────────────────────
function awardWin() {
    const rank = getRankInfo(playerData.rp);
    const coins = rank.coinWin;
    const rp = rank.rpGain;
    playerData.coins += coins;
    playerData.rp += rp;
    playerData.wins++;
    playerData.totalGames++;
    saveData();
    return { coins, rp };
}
function awardLoss() {
    const rank = getRankInfo(playerData.rp);
    playerData.rp = Math.max(0, playerData.rp - rank.rpLoss);
    playerData.losses++;
    playerData.totalGames++;
    saveData();
    return { rpLoss: rank.rpLoss };
}

// ─── DECK MANAGEMENT ─────────────────────────────────────────────
const DECK_MIN = 60, DECK_MAX = 65, MAX_COPIES = 3;

function getCollectionCards() {
    // Returns all cards in collection as {name, theme, count, data, rarity}
    return Object.entries(playerData.collection)
        .filter(([,count]) => count > 0)
        .map(([key, count]) => {
            const [name, theme] = key.split('|');
            const data = (typeof CardSets!=='undefined') ? (CardSets[theme]||{})[name] : null;
            return { name, theme, count, data, rarity: getCardRarity(name, data), key };
        });
}

function saveDeck(name, theme, cards) {
    if (cards.length < DECK_MIN || cards.length > DECK_MAX)
        return { error:`เด็คต้องมีการ์ด ${DECK_MIN}-${DECK_MAX} ใบ` };
    const id = 'deck_' + Date.now();
    const deck = { id, name, theme, cards, isActive: false };
    playerData.decks.push(deck);
    saveData();
    return { ok: true, deck };
}

function setActiveDeck(deckId) {
    playerData.decks.forEach(d => d.isActive = (d.id === deckId));
    saveData();
}

function deleteDeck(deckId) {
    playerData.decks = playerData.decks.filter(d => d.id !== deckId);
    saveData();
}

function getActiveDeck() {
    return playerData.decks.find(d => d.isActive) || null;
}

// ─── GAME INTEGRATION ────────────────────────────────────────────
let _pendingCollectionDeck = null;
let _isRankedGame = false;
let _collectionDeckUsed = false;

// Patch buildDeck to intercept player deck building
document.addEventListener('DOMContentLoaded', function() {
    if (typeof buildDeck === 'undefined') return;
    const _origBuildDeck = buildDeck;
    buildDeck = function(theme) {
        if (_pendingCollectionDeck && !_collectionDeckUsed) {
            _collectionDeckUsed = true;
            // Build from collection
            const deck = [];
            _pendingCollectionDeck.forEach(({name, theme: t}) => {
                if (typeof createCardInstance !== 'undefined') {
                    const inst = createCardInstance(name, t);
                    if (inst) deck.push(inst);
                }
            });
            return deck.sort(() => Math.random() - 0.5);
        }
        if (_collectionDeckUsed) {
            _pendingCollectionDeck = null;
            _collectionDeckUsed = false;
        }
        return _origBuildDeck.call(this, theme);
    };
    
    // Hook endGame for rewards
    if (typeof endGame !== 'undefined') {
        const _origEndGame = endGame;
        endGame = function(winner) {
            _origEndGame(winner);
            if (_isRankedGame) {
                const isPlayerWin = (winner === 'player');
                const reward = isPlayerWin ? awardWin() : awardLoss();
                // Show reward toast
                showRewardToast(isPlayerWin, reward);
                _isRankedGame = false;
            }
        };
    }
});

function startRankedGame(deckId) {
    const deck = playerData.decks.find(d => d.id === deckId);
    if (!deck) { alert('ไม่พบเด็ค'); return; }

    // Build collection deck entries
    _pendingCollectionDeck = deck.cards.map(name => ({ name, theme: deck.theme }));
    _collectionDeckUsed = false;
    _isRankedGame = true;

    // Set AI theme randomly
    const aiThemes = Object.keys(SETS_META).filter(s => s !== 'suankularb');
    if (typeof selectedAITheme !== 'undefined')
        selectedAITheme = aiThemes[Math.floor(Math.random() * aiThemes.length)];
    if (typeof selectedPlayerTheme !== 'undefined')
        selectedPlayerTheme = deck.theme;
    if (typeof gameMode !== 'undefined') gameMode = 'ai';

    // Switch screens
    document.getElementById('hub-screen').style.display = 'none';
    document.getElementById('game-screen').style.display = '';
    document.getElementById('theme-selector').style.display = 'none';
    
    if (typeof resetAndInitGame !== 'undefined') resetAndInitGame();
}

function backToHub() {
    document.getElementById('game-screen').style.display = 'none';
    document.getElementById('hub-screen').style.display = '';
    _isRankedGame = false;
    _pendingCollectionDeck = null;
    updateHubUI();
}

// ─── REWARD TOAST ────────────────────────────────────────────────
function showRewardToast(isWin, reward) {
    const toast = document.createElement('div');
    toast.style.cssText = `position:fixed;top:30%;left:50%;transform:translateX(-50%);
        background:${isWin?'linear-gradient(135deg,#1a4731,#065f46)':'linear-gradient(135deg,#3b1515,#7f1d1d)'};
        border:3px solid ${isWin?'#4ade80':'#f87171'};border-radius:20px;padding:24px 40px;
        z-index:9999;text-align:center;box-shadow:0 0 60px ${isWin?'rgba(74,222,128,0.5)':'rgba(248,113,113,0.5)'};
        animation:toastIn 0.4s ease;min-width:260px;`;
    toast.innerHTML = `
        <div style="font-size:2.5rem;margin-bottom:8px">${isWin?'🏆':'💀'}</div>
        <div style="font-size:1.3rem;font-weight:900;color:${isWin?'#4ade80':'#f87171'}">${isWin?'ชนะ!':'แพ้...'}</div>
        ${isWin ? `
        <div style="color:#fbbf24;font-size:1rem;margin-top:8px">+${reward.coins} 🪙 Coins</div>
        <div style="color:#818cf8;font-size:0.9rem">+${reward.rp} RP</div>
        ` : `
        <div style="color:#f87171;font-size:1rem;margin-top:8px">-${reward.rpLoss} RP</div>
        `}`;
    document.body.appendChild(toast);
    setTimeout(() => { toast.style.animation='toastOut 0.4s ease forwards'; setTimeout(()=>toast.remove(),400); }, 3500);
}

// ─── HUB UI ──────────────────────────────────────────────────────
let hubTab = 'home';
let packOpenerState = { packType:'standard', setName:'isekai_adventure', revealedCards:[], revealIndex:0 };
let deckBuilderState = { theme:'isekai_adventure', cards:[], searchText:'', editingDeckId:null };

function showHubTab(tab) {
    hubTab = tab;
    ['home','packs','collection','deckbuilder','play'].forEach(t => {
        const btn = document.getElementById(`hub-tab-${t}`);
        const pnl = document.getElementById(`hub-panel-${t}`);
        if (btn) btn.classList.toggle('active-tab', t===tab);
        if (pnl) pnl.style.display = t===tab ? '' : 'none';
    });
    if (tab==='home') renderHomePanel();
    else if (tab==='packs') renderPacksPanel();
    else if (tab==='collection') renderCollectionPanel();
    else if (tab==='deckbuilder') renderDeckBuilderPanel();
    else if (tab==='play') renderPlayPanel();
}

function updateHubUI() {
    const rank = getRankInfo(playerData.rp);
    const prog = getRankProgress(playerData.rp);
    const el = id => document.getElementById(id);
    if (el('hub-coins'))   el('hub-coins').textContent   = playerData.coins.toLocaleString();
    if (el('hub-rank-name')) el('hub-rank-name').textContent = `${rank.emoji} ${rank.name}`;
    if (el('hub-rp'))      el('hub-rp').textContent      = `${playerData.rp} RP`;
    if (el('hub-rp-bar'))  el('hub-rp-bar').style.width  = prog + '%';
    if (el('hub-rp-bar'))  el('hub-rp-bar').style.background = rank.colorHex;
    if (el('hub-wins'))    el('hub-wins').textContent    = playerData.wins;
    if (el('hub-losses'))  el('hub-losses').textContent  = playerData.losses;
    showHubTab(hubTab);
}

// ─── HOME PANEL ──────────────────────────────────────────────────
function renderHomePanel() {
    const rank = getRankInfo(playerData.rp);
    const prog = getRankProgress(playerData.rp);
    const total = Object.values(playerData.collection).reduce((a,b)=>a+b,0);
    const activeDeck = getActiveDeck();
    document.getElementById('hub-panel-home').innerHTML = `
    <div style="display:flex;flex-direction:column;gap:16px;max-width:640px;margin:0 auto;padding:16px;">
      <div class="hub-card" style="background:linear-gradient(135deg,#1a1a2e,#16213e);border:2px solid ${rank.colorHex};padding:24px;border-radius:20px;box-shadow:0 0 30px ${rank.colorHex}44">
        <div style="display:flex;align-items:center;gap:16px">
          <div style="font-size:3.5rem">${rank.emoji}</div>
          <div>
            <div style="font-size:1.5rem;font-weight:900;color:${rank.colorHex}">${rank.name}</div>
            <div style="color:#9ca3af;font-size:0.85rem">${playerData.rp} / ${rank.rpMax===Infinity?'∞':rank.rpMax} RP</div>
            <div style="margin-top:6px;height:8px;width:200px;background:#374151;border-radius:8px;overflow:hidden">
              <div style="height:100%;width:${prog}%;background:${rank.colorHex};border-radius:8px;transition:width 0.5s"></div>
            </div>
          </div>
          <div style="margin-left:auto;text-align:right">
            <div style="font-size:1.3rem;font-weight:800;color:#fbbf24">🪙 ${playerData.coins.toLocaleString()}</div>
            <div style="color:#9ca3af;font-size:0.75rem">${playerData.wins}W / ${playerData.losses}L</div>
          </div>
        </div>
      </div>

      <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px">
        <div class="hub-stat-card" onclick="showHubTab('packs')">
          <div style="font-size:2rem">🎴</div>
          <div style="font-size:1.1rem;font-weight:700;color:#f0abfc">เปิดแพ็ค</div>
          <div style="font-size:0.75rem;color:#9ca3af">ใช้ ${playerData.coins} เหรียญ</div>
        </div>
        <div class="hub-stat-card" onclick="showHubTab('collection')">
          <div style="font-size:2rem">📚</div>
          <div style="font-size:1.1rem;font-weight:700;color:#4ade80">Collection</div>
          <div style="font-size:0.75rem;color:#9ca3af">${total} การ์ดที่มี</div>
        </div>
        <div class="hub-stat-card" onclick="showHubTab('deckbuilder')">
          <div style="font-size:2rem">🔨</div>
          <div style="font-size:1.1rem;font-weight:700;color:#60a5fa">Deck Builder</div>
          <div style="font-size:0.75rem;color:#9ca3af">${playerData.decks.length} เด็คที่บันทึก</div>
        </div>
        <div class="hub-stat-card" onclick="showHubTab('play')">
          <div style="font-size:2rem">⚔️</div>
          <div style="font-size:1.1rem;font-weight:700;color:#fb923c">เล่นเกม</div>
          <div style="font-size:0.75rem;color:#9ca3af">${activeDeck ? activeDeck.name : 'ยังไม่มีเด็ค Active'}</div>
        </div>
      </div>

      ${RANKS_CFG.map(r => `
      <div style="display:flex;align-items:center;gap:12px;background:#111827;padding:10px 16px;border-radius:12px;border:1px solid ${r.rpMin<=playerData.rp?r.colorHex:'#374151'}">
        <span style="font-size:1.5rem">${r.emoji}</span>
        <div style="flex:1">
          <div style="font-weight:700;color:${r.rpMin<=playerData.rp?r.colorHex:'#6b7280'}">${r.name}</div>
          <div style="font-size:0.7rem;color:#6b7280">${r.rpMin===0?'0':r.rpMin.toLocaleString()} – ${r.rpMax===Infinity?'∞':r.rpMax.toLocaleString()} RP</div>
        </div>
        <div style="text-align:right;font-size:0.75rem;color:#fbbf24">+${r.coinWin}🪙/ชนะ</div>
        ${playerData.rp>=r.rpMin&&playerData.rp<=r.rpMax?`<span style="background:${r.colorHex};color:#000;padding:2px 8px;border-radius:10px;font-size:0.7rem;font-weight:900">◄ NOW</span>`:''}
      </div>`).join('')}
    </div>`;
}

// ─── PACKS PANEL ─────────────────────────────────────────────────
function renderPacksPanel() {
    const meta = SETS_META[packOpenerState.setName] || SETS_META.isekai_adventure;
    document.getElementById('hub-panel-packs').innerHTML = `
    <div style="max-width:700px;margin:0 auto;padding:16px">
      <div style="display:flex;align-items:center;gap:12px;margin-bottom:16px">
        <div style="font-size:3rem">${meta.emoji}</div>
        <div>
          <div style="font-size:1.3rem;font-weight:900;color:#f0abfc">Pack Shop</div>
          <div style="font-size:0.8rem;color:#9ca3af">เหรียญคุณ: <span style="color:#fbbf24;font-weight:700">🪙 ${playerData.coins.toLocaleString()}</span></div>
        </div>
      </div>

      <div style="margin-bottom:16px">
        <label style="color:#9ca3af;font-size:0.8rem;display:block;margin-bottom:6px">เลือก Set การ์ด:</label>
        <select onchange="packOpenerState.setName=this.value;renderPacksPanel()" style="background:#1f2937;color:white;border:1px solid #4b5563;padding:8px 16px;border-radius:10px;width:100%">
          ${Object.entries(SETS_META).filter(([k])=>typeof CardSets!=='undefined'&&CardSets[k]&&Object.keys(CardSets[k]).length>0).map(([k,v])=>`<option value="${k}" ${k===packOpenerState.setName?'selected':''}>${v.emoji} ${v.label}</option>`).join('')}
        </select>
      </div>

      <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:12px;margin-bottom:24px">
        ${Object.entries(PACK_CFG).map(([type,cfg])=>`
        <div class="pack-card-shop ${packOpenerState.packType===type?'pack-selected':''}"
             onclick="packOpenerState.packType='${type}';renderPacksPanel()"
             style="background:#111827;border:2px solid ${packOpenerState.packType===type?'#f97316':'#374151'};border-radius:16px;padding:16px;text-align:center;cursor:pointer;transition:all 0.2s">
          <div style="font-size:2.5rem;margin-bottom:8px">${cfg.art}</div>
          <div style="font-weight:800;color:white;font-size:0.9rem">${cfg.name}</div>
          <div style="color:#9ca3af;font-size:0.7rem;margin:4px 0">${cfg.desc}</div>
          <div style="color:#fbbf24;font-weight:900;font-size:1.1rem">🪙 ${cfg.cost}</div>
        </div>`).join('')}
      </div>

      <div style="display:flex;align-items:center;gap:16px;background:#1f2937;border-radius:16px;padding:16px;border:1px solid #374151">
        <img src="${meta.mascotArt}" onerror="this.style.display='none'"
          style="width:80px;height:80px;object-fit:cover;border-radius:12px;border:2px solid #f97316">
        <div style="flex:1">
          <div style="font-size:0.8rem;color:#fbbf24;font-weight:700">${meta.label} — ${PACK_CFG[packOpenerState.packType].name}</div>
          <div style="font-size:0.9rem;color:white;font-weight:900;margin:4px 0">ราคา: 🪙 ${PACK_CFG[packOpenerState.packType].cost} เหรียญ</div>
          <div style="font-size:0.75rem;color:#9ca3af">${PACK_CFG[packOpenerState.packType].desc}</div>
        </div>
        <button onclick="buyAndOpenPack()" 
          style="background:linear-gradient(135deg,#ea580c,#dc2626);color:white;font-weight:900;padding:12px 24px;border-radius:14px;border:none;cursor:pointer;font-size:1rem;white-space:nowrap;box-shadow:0 0 20px rgba(234,88,12,0.5)">
          🎴 เปิดแพ็ค
        </button>
      </div>
    </div>`;
}

function buyAndOpenPack() {
    const result = openPack(packOpenerState.packType, packOpenerState.setName);
    if (result.error) { showToast(result.error, '#f87171'); return; }
    packOpenerState.revealedCards = result.cards;
    packOpenerState.revealIndex = 0;
    showPackRevealModal(result.cards);
    updateHubUI();
}

// ─── PACK REVEAL MODAL ───────────────────────────────────────────
function showPackRevealModal(cards) {
    const overlay = document.getElementById('pack-reveal-overlay');
    overlay.style.display = 'flex';
    
    const revealEl = document.getElementById('pack-reveal-cards');
    revealEl.innerHTML = cards.map((c,i) => {
        const r = RARITY_CFG[c.rarity];
        return `
        <div class="reveal-card" id="rcard-${i}" 
             style="width:110px;height:155px;perspective:600px;cursor:pointer;flex-shrink:0"
             onclick="flipRevealCard(${i})">
          <div class="reveal-inner" id="rinner-${i}" style="position:relative;width:100%;height:100%;transform-style:preserve-3d;transition:transform 0.6s;border-radius:12px">
            <div class="reveal-front" style="position:absolute;inset:0;backface-visibility:hidden;background:linear-gradient(135deg,#1e1b4b,#312e81);border-radius:12px;border:3px solid #6366f1;display:flex;align-items:center;justify-content:center;font-size:3rem">🃏</div>
            <div class="reveal-back" style="position:absolute;inset:0;backface-visibility:hidden;transform:rotateY(180deg);border-radius:12px;overflow:hidden;border:3px solid ${r.border};box-shadow:0 0 20px ${r.glow}">
              ${c.data?.art ? `<img src="${c.data.art}" style="width:100%;height:70%;object-fit:cover">` : `<div style="width:100%;height:70%;background:#374151;display:flex;align-items:center;justify-content:center;font-size:2rem">🃏</div>`}
              <div style="padding:4px 6px;background:rgba(0,0,0,0.85)">
                <div style="font-size:0.65rem;font-weight:900;color:${r.color};text-align:center">${r.emoji} ${r.label.toUpperCase()}</div>
                <div style="font-size:0.7rem;font-weight:800;color:white;text-align:center;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${c.name}</div>
                ${c.data?.type==='Character'?`<div style="font-size:0.6rem;color:#9ca3af;text-align:center">ATK:${c.data.atk} HP:${c.data.hp}</div>`:`<div style="font-size:0.6rem;color:#a78bfa;text-align:center">${c.data?.type||''}</div>`}
              </div>
            </div>
          </div>
        </div>`;
    }).join('');

    document.getElementById('pack-reveal-title').textContent = 
        `🎴 ${PACK_CFG[packOpenerState.packType].name} — ${SETS_META[packOpenerState.setName]?.label || packOpenerState.setName}`;
    
    // Auto-flip all after 3s if not clicked
    setTimeout(() => flipAllRevealCards(), 2800);
}

function flipRevealCard(i) {
    const inner = document.getElementById(`rinner-${i}`);
    if (inner) inner.style.transform = 'rotateY(180deg)';
    // Add glow to parent
    const card = document.getElementById(`rcard-${i}`);
    if (card && packOpenerState.revealedCards[i]) {
        const r = RARITY_CFG[packOpenerState.revealedCards[i].rarity];
        if (r) card.style.filter = `drop-shadow(0 0 12px ${r.border})`;
    }
}
function flipAllRevealCards() {
    packOpenerState.revealedCards.forEach((_,i) => flipRevealCard(i));
}
function closePackReveal() {
    document.getElementById('pack-reveal-overlay').style.display = 'none';
    renderPacksPanel();
}

// ─── COLLECTION PANEL ────────────────────────────────────────────
let collFilter = { rarity:'All', type:'All', search:'' };

function renderCollectionPanel() {
    const all = getCollectionCards();
    const rarityOpts = ['All',...RARITY_ORDER];
    const typeOpts = ['All','Character','Action','Item','Field'];
    
    const filtered = all.filter(c => {
        if (collFilter.rarity !== 'All' && c.rarity !== collFilter.rarity) return false;
        if (collFilter.type !== 'All' && c.data?.type !== collFilter.type) return false;
        if (collFilter.search && !c.name.toLowerCase().includes(collFilter.search.toLowerCase())) return false;
        return true;
    }).sort((a,b) => RARITY_ORDER.indexOf(b.rarity) - RARITY_ORDER.indexOf(a.rarity) || a.name.localeCompare(b.name));

    document.getElementById('hub-panel-collection').innerHTML = `
    <div style="padding:16px;max-width:900px;margin:0 auto">
      <div style="display:flex;flex-wrap:wrap;gap:8px;margin-bottom:12px;align-items:center">
        <input placeholder="🔍 ค้นหาการ์ด..." value="${collFilter.search}"
          oninput="collFilter.search=this.value;renderCollectionPanel()"
          style="flex:1;min-width:150px;background:#1f2937;color:white;border:1px solid #4b5563;padding:8px 12px;border-radius:10px">
        <select onchange="collFilter.rarity=this.value;renderCollectionPanel()" style="background:#1f2937;color:white;border:1px solid #4b5563;padding:8px;border-radius:10px">
          ${rarityOpts.map(r=>`<option value="${r}" ${r===collFilter.rarity?'selected':''}>${r==='All'?'ทุก Rarity':RARITY_CFG[r]?.emoji+' '+r}</option>`).join('')}
        </select>
        <select onchange="collFilter.type=this.value;renderCollectionPanel()" style="background:#1f2937;color:white;border:1px solid #4b5563;padding:8px;border-radius:10px">
          ${typeOpts.map(t=>`<option value="${t}" ${t===collFilter.type?'selected':''}>${t==='All'?'ทุกประเภท':t}</option>`).join('')}
        </select>
      </div>
      <div style="color:#9ca3af;font-size:0.75rem;margin-bottom:8px">${filtered.length} การ์ด (ทั้งหมด ${all.length} ชนิด)</div>
      <div style="display:flex;flex-wrap:wrap;gap:10px;justify-content:flex-start">
        ${filtered.map(c => {
            const r = RARITY_CFG[c.rarity];
            return `
            <div style="width:100px;border-radius:12px;overflow:hidden;border:2px solid ${r.border};box-shadow:0 0 10px ${r.glow};background:#111827;cursor:pointer;position:relative" title="${c.name}">
              ${c.data?.art ? `<img src="${c.data.art}" style="width:100%;height:70px;object-fit:cover">` : `<div style="width:100%;height:70px;background:#374151;display:flex;align-items:center;justify-content:center">🃏</div>`}
              <div style="padding:4px">
                <div style="font-size:0.58rem;color:${r.color};font-weight:700">${r.emoji} ${r.label}</div>
                <div style="font-size:0.62rem;font-weight:800;color:white;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${c.name}</div>
                <div style="font-size:0.58rem;color:#6b7280">${c.data?.type||''}</div>
              </div>
              <div style="position:absolute;top:2px;right:2px;background:rgba(0,0,0,0.8);color:#fbbf24;font-size:0.6rem;font-weight:900;padding:1px 5px;border-radius:6px">x${c.count}</div>
            </div>`;
        }).join('')}
        ${filtered.length===0 ? `<div style="color:#6b7280;width:100%;text-align:center;padding:40px">ยังไม่มีการ์ด — ไปซื้อแพ็คกันเถอะ! 🎴</div>` : ''}
      </div>
    </div>`;
}

// ─── DECK BUILDER PANEL ──────────────────────────────────────────
function renderDeckBuilderPanel() {
    const all = getCollectionCards().filter(c => c.theme === deckBuilderState.theme);
    const filtered = deckBuilderState.searchText 
        ? all.filter(c => c.name.toLowerCase().includes(deckBuilderState.searchText.toLowerCase()))
        : all;
    filtered.sort((a,b) => RARITY_ORDER.indexOf(b.rarity) - RARITY_ORDER.indexOf(a.rarity));
    
    const deckCards = deckBuilderState.cards;
    const deckCount = deckCards.length;
    const countMap = {};
    deckCards.forEach(name => { countMap[name] = (countMap[name]||0)+1; });
    const isValid = deckCount >= DECK_MIN && deckCount <= DECK_MAX;
    
    document.getElementById('hub-panel-deckbuilder').innerHTML = `
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;padding:12px;max-width:1000px;margin:0 auto;height:calc(100vh - 180px)">
      <!-- Left: Collection -->
      <div style="display:flex;flex-direction:column;background:#111827;border-radius:16px;overflow:hidden;border:1px solid #374151">
        <div style="padding:12px;background:#1f2937;border-bottom:1px solid #374151">
          <div style="font-weight:800;color:white;margin-bottom:8px">📚 Collection</div>
          <div style="display:flex;gap:6px;flex-wrap:wrap">
            <select onchange="deckBuilderState.theme=this.value;deckBuilderState.cards=[];renderDeckBuilderPanel()" style="background:#374151;color:white;border:none;padding:4px 8px;border-radius:8px;font-size:0.75rem">
              ${Object.entries(SETS_META).filter(([k])=>typeof CardSets!=='undefined'&&CardSets[k]&&Object.keys(CardSets[k]).length>0).map(([k,v])=>`<option value="${k}" ${k===deckBuilderState.theme?'selected':''}>${v.emoji} ${v.label}</option>`).join('')}
            </select>
            <input placeholder="ค้นหา..." value="${deckBuilderState.searchText}"
              oninput="deckBuilderState.searchText=this.value;renderDeckBuilderPanel()"
              style="flex:1;background:#374151;color:white;border:none;padding:4px 8px;border-radius:8px;font-size:0.75rem">
          </div>
        </div>
        <div style="flex:1;overflow-y:auto;padding:8px;display:flex;flex-wrap:wrap;gap:6px;align-content:flex-start">
          ${filtered.length===0 ? `<div style="color:#6b7280;width:100%;text-align:center;padding:20px;font-size:0.8rem">ไม่มีการ์ดในเซตนี้ — ซื้อแพ็คก่อน!</div>` : ''}
          ${filtered.map(c => {
            const r = RARITY_CFG[c.rarity];
            const inDeck = countMap[c.name] || 0;
            const canAdd = inDeck < Math.min(MAX_COPIES, c.count) && deckCount < DECK_MAX;
            return `
            <div onclick="${canAdd?`addToDeck('${c.name.replace(/'/g,"\\'")}')`:''}" 
                 style="width:72px;border-radius:8px;overflow:hidden;border:2px solid ${r.border};background:#1a1a2e;cursor:${canAdd?'pointer':'not-allowed'};opacity:${canAdd?1:0.5};position:relative" title="${c.name}">
              ${c.data?.art ? `<img src="${c.data.art}" style="width:100%;height:52px;object-fit:cover">` : `<div style="width:100%;height:52px;background:#374151;display:flex;align-items:center;justify-content:center;font-size:1.2rem">🃏</div>`}
              <div style="padding:3px">
                <div style="font-size:0.52rem;font-weight:800;color:white;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${c.name}</div>
                <div style="font-size:0.5rem;color:${r.color}">${r.emoji} Cost:${c.data?.cost??'?'}</div>
              </div>
              ${inDeck>0?`<div style="position:absolute;top:1px;right:1px;background:#f97316;color:white;font-size:0.55rem;font-weight:900;padding:0 4px;border-radius:4px">${inDeck}/${Math.min(MAX_COPIES,c.count)}</div>`:''}
            </div>`;
          }).join('')}
        </div>
      </div>
      
      <!-- Right: Deck -->
      <div style="display:flex;flex-direction:column;background:#111827;border-radius:16px;overflow:hidden;border:1px solid ${isValid?'#22c55e':'#374151'}">
        <div style="padding:12px;background:#1f2937;border-bottom:1px solid #374151">
          <div style="display:flex;justify-content:space-between;align-items:center">
            <div style="font-weight:800;color:white">🃏 เด็คของฉัน</div>
            <div style="font-size:0.8rem;font-weight:900;color:${isValid?'#4ade80':deckCount>DECK_MAX?'#f87171':'#fbbf24'}">${deckCount}/${DECK_MAX} ${isValid?'✓':''}</div>
          </div>
          <div style="font-size:0.65rem;color:#9ca3af;margin-top:2px">ขั้นต่ำ ${DECK_MIN} ใบ สูงสุด ${DECK_MAX} ใบ | Max ${MAX_COPIES} ใบ/การ์ด</div>
          <div style="margin-top:6px;height:4px;background:#374151;border-radius:4px"><div style="height:100%;width:${Math.min(100,deckCount/DECK_MAX*100)}%;background:${isValid?'#22c55e':deckCount>DECK_MAX?'#ef4444':'#f97316'};border-radius:4px;transition:width 0.3s"></div></div>
        </div>
        <div style="flex:1;overflow-y:auto;padding:8px">
          ${Object.entries(countMap).length===0 ? `<div style="color:#6b7280;text-align:center;padding:20px;font-size:0.8rem">คลิกการ์ดทางซ้ายเพื่อเพิ่ม</div>` : ''}
          ${Object.entries(countMap).map(([name, cnt]) => {
            const theme = deckBuilderState.theme;
            const data = (typeof CardSets!=='undefined') ? (CardSets[theme]||{})[name] : null;
            const r = RARITY_CFG[getCardRarity(name,data)];
            return `
            <div style="display:flex;align-items:center;gap:8px;padding:5px 8px;margin-bottom:4px;background:#1f2937;border-radius:8px;border-left:3px solid ${r.border}">
              ${data?.art?`<img src="${data.art}" style="width:28px;height:28px;object-fit:cover;border-radius:4px">`:'<div style="width:28px;height:28px;background:#374151;border-radius:4px;display:flex;align-items:center;justify-content:center;font-size:0.8rem">🃏</div>'}
              <div style="flex:1;min-width:0">
                <div style="font-size:0.7rem;font-weight:700;color:white;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${name}</div>
                <div style="font-size:0.58rem;color:${r.color}">${r.emoji} Cost:${data?.cost??'?'}</div>
              </div>
              <div style="font-size:0.8rem;font-weight:900;color:#fbbf24">×${cnt}</div>
              <button onclick="removeFromDeck('${name.replace(/'/g,"\\'")}','${theme}')" style="background:#374151;color:#f87171;border:none;border-radius:6px;width:20px;height:20px;cursor:pointer;font-size:0.75rem;line-height:1">−</button>
            </div>`;
          }).join('')}
        </div>
        <div style="padding:12px;background:#1f2937;border-top:1px solid #374151;display:flex;gap:8px">
          <button onclick="saveDeckFromBuilder()" ${isValid?'':'disabled'}
            style="flex:1;background:${isValid?'linear-gradient(135deg,#059669,#065f46)':'#374151'};color:${isValid?'white':'#6b7280'};border:none;padding:10px;border-radius:10px;font-weight:800;cursor:${isValid?'pointer':'not-allowed'};font-size:0.85rem">
            💾 บันทึกเด็ค
          </button>
          <button onclick="clearDeck()" style="background:#374151;color:#f87171;border:none;padding:10px 14px;border-radius:10px;cursor:pointer;font-size:0.85rem">🗑</button>
        </div>
      </div>
    </div>
    
    <!-- Saved Decks -->
    ${playerData.decks.length>0?`
    <div style="padding:12px;max-width:1000px;margin:0 auto">
      <div style="font-weight:800;color:white;margin-bottom:8px">📋 เด็คที่บันทึกแล้ว</div>
      <div style="display:flex;flex-wrap:wrap;gap:10px">
        ${playerData.decks.map(d => `
        <div style="background:#1f2937;border:2px solid ${d.isActive?'#f97316':'#374151'};border-radius:12px;padding:12px;min-width:180px;max-width:220px">
          <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:4px">
            <div style="font-weight:800;color:white;font-size:0.9rem">${d.name}</div>
            ${d.isActive?`<span style="background:#f97316;color:white;font-size:0.6rem;padding:1px 6px;border-radius:6px;font-weight:900">ACTIVE</span>`:''}
          </div>
          <div style="font-size:0.7rem;color:#9ca3af">${SETS_META[d.theme]?.emoji||''} ${SETS_META[d.theme]?.label||d.theme} | ${d.cards.length} ใบ</div>
          <div style="display:flex;gap:6px;margin-top:8px">
            <button onclick="setActiveDeck('${d.id}');renderDeckBuilderPanel()" style="flex:1;background:${d.isActive?'#374151':'#065f46'};color:${d.isActive?'#6b7280':'#4ade80'};border:none;padding:6px;border-radius:8px;cursor:pointer;font-size:0.7rem;font-weight:700">${d.isActive?'Active ✓':'Set Active'}</button>
            <button onclick="deleteDeck('${d.id}');renderDeckBuilderPanel()" style="background:#3b1515;color:#f87171;border:none;padding:6px 8px;border-radius:8px;cursor:pointer;font-size:0.7rem">🗑</button>
          </div>
        </div>`).join('')}
      </div>
    </div>` : ''}`;
}

function addToDeck(name) {
    const countMap = {};
    deckBuilderState.cards.forEach(n => { countMap[n] = (countMap[n]||0)+1; });
    const inCollection = playerData.collection[`${name}|${deckBuilderState.theme}`] || 0;
    if ((countMap[name]||0) >= Math.min(MAX_COPIES, inCollection)) { showToast('ถึง limit แล้ว!','#f87171'); return; }
    if (deckBuilderState.cards.length >= DECK_MAX) { showToast(`สูงสุด ${DECK_MAX} ใบ!`,'#f87171'); return; }
    deckBuilderState.cards.push(name);
    renderDeckBuilderPanel();
}

function removeFromDeck(name) {
    const idx = deckBuilderState.cards.lastIndexOf(name);
    if (idx !== -1) { deckBuilderState.cards.splice(idx,1); renderDeckBuilderPanel(); }
}

function clearDeck() {
    if (confirm('เคลียร์การ์ดทั้งหมดในเด็ค?')) { deckBuilderState.cards = []; renderDeckBuilderPanel(); }
}

function saveDeckFromBuilder() {
    const name = prompt('ชื่อเด็ค:', 'My Deck') || 'My Deck';
    const result = saveDeck(name, deckBuilderState.theme, [...deckBuilderState.cards]);
    if (result.error) { showToast(result.error,'#f87171'); return; }
    showToast('บันทึกเด็คสำเร็จ! 🎉','#4ade80');
    deckBuilderState.cards = [];
    renderDeckBuilderPanel();
}

// ─── PLAY PANEL ──────────────────────────────────────────────────
function renderPlayPanel() {
    const activeDeck = getActiveDeck();
    const rank = getRankInfo(playerData.rp);
    document.getElementById('hub-panel-play').innerHTML = `
    <div style="max-width:600px;margin:0 auto;padding:16px;display:flex;flex-direction:column;gap:16px">
      <div style="background:#1f2937;border-radius:16px;padding:20px;border:1px solid #374151">
        <div style="font-weight:900;color:white;font-size:1.1rem;margin-bottom:12px">🏆 Ranked Mode</div>
        ${activeDeck ? `
        <div style="background:#111827;border-radius:12px;padding:12px;margin-bottom:12px;border:2px solid #f97316">
          <div style="display:flex;align-items:center;gap:10px">
            <div style="font-size:2rem">${SETS_META[activeDeck.theme]?.emoji||'🃏'}</div>
            <div>
              <div style="font-weight:800;color:white">${activeDeck.name}</div>
              <div style="font-size:0.75rem;color:#9ca3af">${SETS_META[activeDeck.theme]?.label||activeDeck.theme} | ${activeDeck.cards.length} ใบ</div>
            </div>
            <div style="margin-left:auto;font-size:0.75rem;background:#f97316;color:white;padding:2px 10px;border-radius:8px;font-weight:700">ACTIVE</div>
          </div>
        </div>
        <div style="background:#111827;border-radius:10px;padding:10px;margin-bottom:12px;font-size:0.8rem;color:#9ca3af">
          ชนะ: +${rank.coinWin}🪙 +${rank.rpGain} RP | แพ้: -${rank.rpLoss} RP
        </div>
        <button onclick="startRankedGame('${activeDeck.id}')" 
          style="width:100%;background:linear-gradient(135deg,#ea580c,#dc2626);color:white;font-weight:900;padding:14px;border-radius:14px;border:none;cursor:pointer;font-size:1.1rem;box-shadow:0 0 30px rgba(234,88,12,0.4)">
          ⚔️ เริ่มเกม Ranked!
        </button>` : `
        <div style="text-align:center;color:#9ca3af;padding:20px">
          <div style="font-size:2rem;margin-bottom:8px">🃏</div>
          <div>ยังไม่มีเด็ค Active</div>
          <button onclick="showHubTab('deckbuilder')" style="margin-top:12px;background:#3730a3;color:white;border:none;padding:8px 20px;border-radius:10px;cursor:pointer">สร้างเด็คก่อน →</button>
        </div>`}
      </div>
      
      <div style="background:#1f2937;border-radius:16px;padding:20px;border:1px solid #374151">
        <div style="font-weight:900;color:white;font-size:1.1rem;margin-bottom:12px">⚡ Quick Play (เลือกธีม)</div>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-bottom:12px">
          <div>
            <label style="color:#9ca3af;font-size:0.75rem;display:block;margin-bottom:4px">ธีมของคุณ:</label>
            <select id="qp-player-theme" style="width:100%;background:#111827;color:white;border:1px solid #4b5563;padding:8px;border-radius:10px">
              ${Object.entries(SETS_META).filter(([k])=>typeof CardSets!=='undefined'&&CardSets[k]&&Object.keys(CardSets[k]).length>0).map(([k,v])=>`<option value="${k}">${v.emoji} ${v.label}</option>`).join('')}
            </select>
          </div>
          <div>
            <label style="color:#9ca3af;font-size:0.75rem;display:block;margin-bottom:4px">ธีม AI:</label>
            <select id="qp-ai-theme" style="width:100%;background:#111827;color:white;border:1px solid #4b5563;padding:8px;border-radius:10px">
              ${Object.entries(SETS_META).filter(([k])=>typeof CardSets!=='undefined'&&CardSets[k]&&Object.keys(CardSets[k]).length>0).map(([k,v])=>`<option value="${k}">${v.emoji} ${v.label}</option>`).join('')}
            </select>
          </div>
        </div>
        <button onclick="startQuickPlay()" style="width:100%;background:linear-gradient(135deg,#1d4ed8,#1e40af);color:white;font-weight:900;padding:12px;border-radius:14px;border:none;cursor:pointer;font-size:1rem">
          🎲 Quick Play (ไม่มี RP)
        </button>
      </div>
    </div>`;
}

function startQuickPlay() {
    const pTheme = document.getElementById('qp-player-theme')?.value || 'isekai_adventure';
    const aTheme = document.getElementById('qp-ai-theme')?.value || 'isekai_adventure';
    if (typeof selectedPlayerTheme !== 'undefined') selectedPlayerTheme = pTheme;
    if (typeof selectedAITheme !== 'undefined') selectedAITheme = aTheme;
    if (typeof gameMode !== 'undefined') gameMode = 'ai';
    _isRankedGame = false;
    _pendingCollectionDeck = null;
    document.getElementById('hub-screen').style.display = 'none';
    document.getElementById('game-screen').style.display = '';
    document.getElementById('theme-selector').style.display = 'none';
    if (typeof resetAndInitGame !== 'undefined') resetAndInitGame();
}

// ─── TOAST ───────────────────────────────────────────────────────
function showToast(msg, color='#4ade80') {
    const t = document.createElement('div');
    t.style.cssText = `position:fixed;bottom:100px;left:50%;transform:translateX(-50%);
        background:#1f2937;color:${color};border:2px solid ${color};
        padding:10px 24px;border-radius:12px;font-weight:800;z-index:9999;
        animation:toastIn 0.3s ease;font-size:0.9rem;white-space:nowrap`;
    t.textContent = msg;
    document.body.appendChild(t);
    setTimeout(() => t.remove(), 2200);
}

// ─── INIT ────────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
    updateHubUI();
    showHubTab('home');
});
