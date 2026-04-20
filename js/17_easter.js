// ============================================================
// 17_easter.js — Easter Update 2569 / 2026
// Expires: April 27, 2026 (BE 2569)
// ============================================================

const EASTER_EXPIRY = new Date('2026-04-28T00:00:00+07:00').getTime();

function isEasterActive() {
    return Date.now() <= EASTER_EXPIRY;
}

// ── ARTSTYLE CONFIG ────────────────────────────────────────────────
const ARTSTYLE_CFG = {
    'messi_cute_hat':    { id:'messi_cute_hat',    label:'Messi - Cute Hat',                 emoji:'🎩', targetCard:'Messi',             art:'https://files.catbox.moe/46kzb4.jpg', shopCost:20 },
    'rem_easter':        { id:'rem_easter',         label:'Rem - Easter Special',             emoji:'🐰', targetCard:'Rem',               art:'https://files.catbox.moe/ub6jf0.jpg', shopCost:5  },
    'toy_box_bunny':     { id:'toy_box_bunny',      label:'Toy Box Surprise - Bunny and Egg', emoji:'🥚', targetCard:'Toy Box Surprise',  art:'https://files.catbox.moe/997vj7.jpg', shopCost:5  },
    'gilgamesh_pixel':   { id:'gilgamesh_pixel',    label:'Gilgamesh - Pixel Sword',          emoji:'⚔️', targetCard:'Gilgamesh',         art:'https://files.catbox.moe/qfltxb.jpg', shopCost:5  },
    'rubber_duck_bloom': { id:'rubber_duck_bloom',  label:'Rubber Duck - Bloom Festival',     emoji:'🌸', targetCard:'Rubber Duck',       art:'https://files.catbox.moe/l62gqg.jpg', shopCost:5  },
};

const _easterOriginalArts = {};

function _applyArtstyle(id) {
    const cfg = ARTSTYLE_CFG[id];
    if (!cfg || typeof CardSets === 'undefined') return;
    for (const cards of Object.values(CardSets)) {
        if (cards && cards[cfg.targetCard]) {
            if (_easterOriginalArts[cfg.targetCard] === undefined)
                _easterOriginalArts[cfg.targetCard] = cards[cfg.targetCard].art;
            cards[cfg.targetCard].art = cfg.art;
        }
    }
}

function _unapplyArtstyle(id) {
    const cfg = ARTSTYLE_CFG[id];
    if (!cfg || typeof CardSets === 'undefined') return;
    const orig = _easterOriginalArts[cfg.targetCard];
    if (orig === undefined) return;
    for (const cards of Object.values(CardSets)) {
        if (cards && cards[cfg.targetCard]) cards[cfg.targetCard].art = orig;
    }
    delete _easterOriginalArts[cfg.targetCard];
}

function equipArtstyle(id) {
    if (!playerData.unlockedArtstyles?.includes(id)) {
        showToast('❌ ยังไม่ได้ปลดล็อค Artstyle นี้','#f87171'); return;
    }
    const cfg = ARTSTYLE_CFG[id]; if (!cfg) return;
    if (!playerData.equippedArtstyles) playerData.equippedArtstyles = {};
    const old = playerData.equippedArtstyles[cfg.targetCard];
    if (old && old !== id) _unapplyArtstyle(old);
    playerData.equippedArtstyles[cfg.targetCard] = id;
    _applyArtstyle(id);
    saveData();
    showToast(`🎨 Equipped: "${cfg.label}"`, '#fbbf24');
    renderArtstylePanel();
}

function unequipArtstyle(id) {
    const cfg = ARTSTYLE_CFG[id]; if (!cfg) return;
    if (!playerData.equippedArtstyles) playerData.equippedArtstyles = {};
    _unapplyArtstyle(id);
    delete playerData.equippedArtstyles[cfg.targetCard];
    saveData();
    showToast('🎨 Unequipped', '#9ca3af');
    renderArtstylePanel();
}

function _initArtstyles() {
    if (!playerData.equippedArtstyles) return;
    for (const id of Object.values(playerData.equippedArtstyles)) _applyArtstyle(id);
}

// ── EASTER SHOP ────────────────────────────────────────────────────
const EASTER_SHOP_ITEMS = [
    { id:'card_dora',     type:'card',     label:'Dora the Explorer',                cardName:'Dora the Explorer', cardTheme:'easter', cost:15, maxBuy:3, emoji:'🗺️' },
    { id:'card_rabbit',   type:'card',     label:'Great Rabbit',                     cardName:'Great Rabbit',      cardTheme:'easter', cost:15, maxBuy:3, emoji:'🐇' },
    { id:'card_egg',      type:'card',     label:'Easter Egg',                       cardName:'Easter Egg',        cardTheme:'easter', cost:10, maxBuy:3, emoji:'🥚' },
    { id:'art_messi',     type:'artstyle', label:'Messi - Cute Hat',                 artstyleId:'messi_cute_hat',    cost:20, maxBuy:1, emoji:'🎩' },
    { id:'art_rem',       type:'artstyle', label:'Rem - Easter Special',             artstyleId:'rem_easter',        cost:5,  maxBuy:1, emoji:'🐰' },
    { id:'art_toy',       type:'artstyle', label:'Toy Box Surprise - Bunny and Egg', artstyleId:'toy_box_bunny',     cost:5,  maxBuy:1, emoji:'🥚' },
    { id:'art_gilgamesh', type:'artstyle', label:'Gilgamesh - Pixel Sword',          artstyleId:'gilgamesh_pixel',   cost:5,  maxBuy:1, emoji:'⚔️' },
    { id:'art_duck',      type:'artstyle', label:'Rubber Duck - Bloom Festival',     artstyleId:'rubber_duck_bloom', cost:5,  maxBuy:1, emoji:'🌸' },
];

const EASTER_SHOP_KEY    = 'easter_shop_v1';
const EASTER_EXCH_KEY    = 'easter_exch_v1';
const MAX_EXCH           = 10;

function _getEPurchases() { try { return JSON.parse(localStorage.getItem(EASTER_SHOP_KEY)||'{}'); } catch { return {}; } }
function _saveEPurchase(id)  { const p=_getEPurchases(); p[id]=(p[id]||0)+1; localStorage.setItem(EASTER_SHOP_KEY,JSON.stringify(p)); }
function _getExchCount()     { return parseInt(localStorage.getItem(EASTER_EXCH_KEY)||'0'); }

function _spendToken(n) {
    playerData.easterTokens  -= n;
    playerData.easterTokensSpent = (playerData.easterTokensSpent||0) + n;
    if (playerData.easterTokensSpent >= 30 && typeof unlockTitle==='function') unlockTitle('Easter Eater');
}

function buyEasterShopItem(id) {
    if (!isEasterActive()) { showToast('❌ Easter Event สิ้นสุดแล้ว!','#f87171'); return; }
    const item = EASTER_SHOP_ITEMS.find(i=>i.id===id); if (!item) return;
    const bought = _getEPurchases()[id]||0;
    if (bought >= item.maxBuy) { showToast(`❌ ซื้อครบแล้ว (${item.maxBuy}/${item.maxBuy})`,'#f87171'); return; }
    if ((playerData.easterTokens||0) < item.cost) { showToast(`❌ Token ไม่พอ! (ต้องการ ${item.cost} 🐣)`,'#f87171'); return; }

    _spendToken(item.cost);

    if (item.type==='card') {
        const key=`${item.cardName}|${item.cardTheme}`;
        playerData.collection[key] = (playerData.collection[key]||0)+1;
        showToast(`🐣 ได้รับ "${item.label}" +1!`,'#fbbf24');
    } else {
        if (!playerData.unlockedArtstyles) playerData.unlockedArtstyles=[];
        if (!playerData.unlockedArtstyles.includes(item.artstyleId)) playerData.unlockedArtstyles.push(item.artstyleId);
        showToast(`🎨 ปลดล็อค "${item.label}"!`,'#fbbf24');
    }

    _saveEPurchase(id); saveData();
    renderEasterShopContent();
    if (typeof updateHubUI==='function') updateHubUI();
}

function exchangeTokensForGems() {
    if (!isEasterActive()) { showToast('❌ Easter Event สิ้นสุดแล้ว!','#f87171'); return; }
    const done=_getExchCount();
    if (done>=MAX_EXCH) { showToast(`❌ แลกครบ ${MAX_EXCH} รอบแล้ว!`,'#f87171'); return; }
    if ((playerData.easterTokens||0)<5) { showToast('❌ ต้องการ 5 🐣 Token','#f87171'); return; }
    _spendToken(5);
    playerData.gems = (playerData.gems||0)+5;
    localStorage.setItem(EASTER_EXCH_KEY, String(done+1));
    saveData();
    showToast(`💎 แลก 5 🐣 → +5 💎 สำเร็จ! (${done+1}/${MAX_EXCH})`,'#93c5fd');
    renderEasterShopContent();
    if (typeof updateHubUI==='function') updateHubUI();
}

// ── SHOP UI ────────────────────────────────────────────────────────
function openEasterShop() {
    let m = document.getElementById('easter-shop-modal');
    if (!m) {
        m = document.createElement('div');
        m.id = 'easter-shop-modal';
        m.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,0.92);z-index:3000;display:flex;align-items:center;justify-content:center;padding:16px;';
        m.onclick = e => { if(e.target===m) m.remove(); };
        document.body.appendChild(m);
    }
    m.style.display='flex';
    renderEasterShopContent();
}

function renderEasterShopContent() {
    const m = document.getElementById('easter-shop-modal'); if (!m) return;
    if (!isEasterActive()) {
        m.innerHTML=`<div style="background:#111827;border:2px solid #f97316;border-radius:20px;padding:32px;text-align:center;max-width:380px;width:90%">
            <div style="font-size:3rem">⏰</div>
            <div style="color:#f87171;font-weight:900;font-size:1.2rem;margin:8px 0">Easter Event สิ้นสุดแล้ว</div>
            <div style="color:#6b7280;font-size:0.85rem">หมดเขต 27 เมษายน 2569</div>
            <button onclick="document.getElementById('easter-shop-modal').remove()" style="margin-top:16px;background:#374151;color:white;border:none;padding:10px 24px;border-radius:10px;cursor:pointer;font-weight:700">ปิด</button>
        </div>`;
        return;
    }
    const tok=playerData.easterTokens||0, pur=_getEPurchases(), exDone=_getExchCount();
    m.innerHTML=`
    <div style="background:linear-gradient(135deg,#071407,#0c2e0c,#071407);border:3px solid #86efac;border-radius:24px;padding:22px;max-width:580px;width:100%;max-height:90vh;overflow-y:auto;box-shadow:0 0 60px rgba(134,239,172,0.35)">
      <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:18px">
        <div><div style="font-size:1.4rem;font-weight:900;color:#86efac">🐣 Easter Shop</div><div style="font-size:0.7rem;color:#6b7280;margin-top:2px">หมดเขต 27 เม.ย. 2569</div></div>
        <div style="text-align:right"><div style="font-size:1.2rem;font-weight:900;color:#fbbf24">🐣 ${tok}</div><div style="font-size:0.68rem;color:#9ca3af">Easter Tokens</div></div>
      </div>

      <div style="background:linear-gradient(135deg,#1e3a5f,#1e40af);border:2px solid #60a5fa;border-radius:14px;padding:12px 14px;margin-bottom:16px;display:flex;align-items:center;gap:12px">
        <div style="font-size:1.8rem">💱</div>
        <div style="flex:1">
          <div style="font-weight:900;color:#93c5fd;font-size:0.85rem">Token → Gems Exchange</div>
          <div style="font-size:0.7rem;color:#60a5fa;margin-top:2px">5 🐣 → 5 💎 | ทำได้ ${MAX_EXCH} รอบ | เหลือ <b style="color:#fbbf24">${MAX_EXCH-exDone}</b> รอบ</div>
        </div>
        <button onclick="exchangeTokensForGems()" ${(exDone>=MAX_EXCH||tok<5)?'disabled':''} style="background:${(exDone>=MAX_EXCH||tok<5)?'#374151':'linear-gradient(135deg,#1d4ed8,#2563eb)'};color:white;border:none;padding:8px 14px;border-radius:10px;font-weight:800;font-size:0.8rem;cursor:${(exDone>=MAX_EXCH||tok<5)?'not-allowed':'pointer'};opacity:${(exDone>=MAX_EXCH||tok<5)?0.45:1};white-space:nowrap">💱 แลก</button>
      </div>

      <div style="font-size:0.72rem;font-weight:900;color:#86efac;text-transform:uppercase;letter-spacing:1px;margin-bottom:10px">🃏 การ์ด Easter</div>
      <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:10px;margin-bottom:18px">
      ${EASTER_SHOP_ITEMS.filter(i=>i.type==='card').map(item=>{
        const b=pur[item.id]||0,full=b>=item.maxBuy,ok=!full&&tok>=item.cost;
        return`<div style="background:#0c180c;border:2px solid ${full?'#4ade80':'#374151'};border-radius:14px;padding:12px;text-align:center">
          <div style="font-size:2rem;margin-bottom:6px">${item.emoji}</div>
          <div style="font-size:0.68rem;font-weight:800;color:white;margin-bottom:6px;line-height:1.3">${item.label}</div>
          <div style="font-size:0.82rem;color:#86efac;font-weight:900;margin-bottom:6px">🐣 ${item.cost}</div>
          <div style="font-size:0.6rem;color:#6b7280;margin-bottom:8px">${b}/${item.maxBuy}</div>
          ${full?`<div style="color:#4ade80;font-size:0.72rem;font-weight:800">✅ ครบ</div>`:`<button onclick="buyEasterShopItem('${item.id}')" ${ok?'':'disabled'} style="background:${ok?'linear-gradient(135deg,#166534,#15803d)':'#374151'};color:white;border:none;padding:5px 0;border-radius:8px;font-weight:800;font-size:0.75rem;width:100%;cursor:${ok?'pointer':'not-allowed'};opacity:${ok?1:0.45}">ซื้อ</button>`}
        </div>`;
      }).join('')}
      </div>

      <div style="font-size:0.72rem;font-weight:900;color:#fbbf24;text-transform:uppercase;letter-spacing:1px;margin-bottom:10px">🎨 Artstyle</div>
      <div style="display:flex;flex-direction:column;gap:8px;margin-bottom:18px">
      ${EASTER_SHOP_ITEMS.filter(i=>i.type==='artstyle').map(item=>{
        const cfg=ARTSTYLE_CFG[item.artstyleId];
        const un=(playerData.unlockedArtstyles||[]).includes(item.artstyleId);
        const ok=!un&&tok>=item.cost;
        return`<div style="background:#1a1400;border:2px solid ${un?'#fbbf24':'#374151'};border-radius:12px;padding:10px;display:flex;align-items:center;gap:10px">
          <div style="font-size:1.4rem">${item.emoji}</div>
          <div style="flex:1">
            <div style="font-size:0.8rem;font-weight:800;color:${un?'#fbbf24':'#9ca3af'}">${item.label}</div>
            <div style="font-size:0.62rem;color:#6b7280">เปลี่ยนรูป: ${cfg.targetCard}</div>
          </div>
          <div style="text-align:right">
            ${un?`<div style="color:#4ade80;font-size:0.72rem;font-weight:800">✅ ปลดล็อคแล้ว</div><button onclick="renderArtstylePanel()" style="font-size:0.62rem;background:#374151;color:#9ca3af;border:none;padding:3px 8px;border-radius:6px;cursor:pointer;margin-top:4px">จัดการ 🎨</button>`
            :`<div style="color:#fbbf24;font-weight:900;font-size:0.82rem;margin-bottom:4px">🐣 ${item.cost}</div><button onclick="buyEasterShopItem('${item.id}')" ${ok?'':'disabled'} style="background:${ok?'linear-gradient(135deg,#92400e,#b45309)':'#374151'};color:white;border:none;padding:5px 12px;border-radius:8px;font-weight:800;font-size:0.72rem;cursor:${ok?'pointer':'not-allowed'};opacity:${ok?1:0.45}">ซื้อ</button>`}
          </div>
        </div>`;
      }).join('')}
      </div>

      <button onclick="document.getElementById('easter-shop-modal').remove()" style="width:100%;background:#374151;color:#9ca3af;border:none;padding:12px;border-radius:12px;font-weight:700;cursor:pointer;font-size:0.9rem">✕ ปิด</button>
    </div>`;
}

// ── ARTSTYLE PANEL ─────────────────────────────────────────────────
function renderArtstylePanel() {
    let m = document.getElementById('artstyle-modal');
    if (!m) {
        m=document.createElement('div');
        m.id='artstyle-modal';
        m.style.cssText='position:fixed;inset:0;background:rgba(0,0,0,0.92);z-index:3000;display:flex;align-items:center;justify-content:center;padding:16px;';
        m.onclick=e=>{if(e.target===m)m.remove();};
        document.body.appendChild(m);
    }
    m.style.display='flex';
    const un=playerData.unlockedArtstyles||[], eq=playerData.equippedArtstyles||{};
    m.innerHTML=`
    <div style="background:linear-gradient(135deg,#0f0a1a,#1a0f2e);border:3px solid #fbbf24;border-radius:24px;padding:24px;max-width:520px;width:100%;max-height:90vh;overflow-y:auto;box-shadow:0 0 60px rgba(251,191,36,0.4)">
      <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:14px">
        <div style="font-size:1.3rem;font-weight:900;color:#fbbf24">🎨 Artstyle Collection</div>
        <button onclick="document.getElementById('artstyle-modal').remove()" style="background:rgba(255,255,255,0.1);border:none;color:#9ca3af;width:28px;height:28px;border-radius:50%;cursor:pointer;font-size:1rem">✕</button>
      </div>
      <div style="font-size:0.73rem;color:#9ca3af;margin-bottom:14px">เลือกใส่ Artstyle เพื่อเปลี่ยนรูปการ์ดในเกม ถ้ายังไม่ได้ซื้อ → ไปที่ 🐣 Easter Shop</div>
      <div style="display:flex;flex-direction:column;gap:10px">
      ${Object.values(ARTSTYLE_CFG).map(cfg=>{
        const isUn=un.includes(cfg.id), isEq=eq[cfg.targetCard]===cfg.id;
        return`<div style="background:${isUn?'#1a1a2e':'#0f0f0f'};border:2px solid ${isEq?'#fbbf24':isUn?'#4b5563':'#1f2937'};border-radius:14px;padding:12px;display:flex;align-items:center;gap:12px">
          <div style="width:64px;height:64px;border-radius:10px;overflow:hidden;border:2px solid ${isEq?'#fbbf24':'#374151'};flex-shrink:0">
            ${isUn?`<img src="${cfg.art}" style="width:100%;height:100%;object-fit:cover" onerror="this.style.background='#374151'">`
                  :`<div style="width:100%;height:100%;background:#111827;display:flex;align-items:center;justify-content:center;font-size:1.8rem">🔒</div>`}
          </div>
          <div style="flex:1">
            <div style="font-weight:800;color:${isUn?'white':'#6b7280'};font-size:0.85rem">${cfg.label}</div>
            <div style="font-size:0.62rem;color:#6b7280;margin-top:2px">การ์ด: ${cfg.targetCard}</div>
            ${isEq?`<div style="font-size:0.62rem;color:#fbbf24;margin-top:3px">✨ ใช้งานอยู่</div>`:''}
          </div>
          <div>
            ${isUn
              ? isEq
                ? `<button onclick="unequipArtstyle('${cfg.id}')" style="background:#374151;color:#9ca3af;border:none;padding:7px 13px;border-radius:8px;cursor:pointer;font-size:0.75rem;font-weight:700">ถอด</button>`
                : `<button onclick="equipArtstyle('${cfg.id}')" style="background:linear-gradient(135deg,#d97706,#b45309);color:white;border:none;padding:7px 13px;border-radius:8px;cursor:pointer;font-size:0.75rem;font-weight:700">ใส่</button>`
              : `<button onclick="openEasterShop()" style="background:#1e3a5f;color:#60a5fa;border:1px solid #3b82f6;padding:7px 13px;border-radius:8px;cursor:pointer;font-size:0.7rem;font-weight:700">🐣 Shop</button>`}
          </div>
        </div>`;
      }).join('')}
      </div>
    </div>`;
}

// ── EASTER BANNER IN HOME PANEL ────────────────────────────────────
function _injectEasterBanner() {
    if (!isEasterActive()) return;
    const homePanel = document.getElementById('hub-panel-home');
    if (!homePanel || homePanel.querySelector('#easter-hub-banner')) return;
    const tokens = playerData.easterTokens||0;
    const banner = document.createElement('div');
    banner.id = 'easter-hub-banner';
    banner.style.cssText = 'padding:0 16px 0;max-width:640px;margin:0 auto;';
    banner.innerHTML = `
    <div style="background:linear-gradient(135deg,#0a1f0a,#122e1a);border:2px solid #86efac;border-radius:16px;padding:14px 16px;display:flex;align-items:center;gap:12px;margin-bottom:12px">
      <div style="font-size:2.4rem;line-height:1">🐣</div>
      <div style="flex:1">
        <div style="font-weight:900;color:#86efac;font-size:0.95rem">Easter Event 2569</div>
        <div style="font-size:0.7rem;color:#6b7280;margin-top:2px">Token: <span style="color:#fbbf24;font-weight:900">${tokens} 🐣</span> &nbsp;|&nbsp; หมดเขต 27 เม.ย.</div>
      </div>
      <div style="display:flex;flex-direction:column;gap:6px">
        <button onclick="openEasterShop()" style="background:linear-gradient(135deg,#166534,#15803d);color:white;border:none;padding:7px 14px;border-radius:9px;font-weight:800;cursor:pointer;font-size:0.78rem;white-space:nowrap;box-shadow:0 0 10px rgba(22,101,52,0.5)">🛒 Shop</button>
        <button onclick="renderArtstylePanel()" style="background:linear-gradient(135deg,#92400e,#b45309);color:white;border:none;padding:7px 12px;border-radius:9px;font-weight:800;cursor:pointer;font-size:0.78rem;white-space:nowrap;box-shadow:0 0 10px rgba(146,64,14,0.5)">🎨 Artstyle</button>
      </div>
    </div>`;
    const first = homePanel.firstChild;
    if (first) homePanel.insertBefore(banner, first); else homePanel.appendChild(banner);
}

// ── BOOT ALL HOOKS AFTER DOM READY ────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {

    // 1. Init playerData fields
    if (typeof playerData !== 'undefined') {
        if (playerData.easterTokens      === undefined) playerData.easterTokens      = 0;
        if (playerData.easterTokensSpent === undefined) playerData.easterTokensSpent = 0;
        if (!playerData.unlockedArtstyles) playerData.unlockedArtstyles = [];
        if (!playerData.equippedArtstyles) playerData.equippedArtstyles = {};
    }

    // 2. Patch loadPlayerData backward-compat
    const _origLoad = window.loadPlayerData;
    if (typeof _origLoad === 'function') {
        window.loadPlayerData = function() {
            const d = _origLoad.call(this);
            if (d.easterTokens      === undefined) d.easterTokens      = 0;
            if (d.easterTokensSpent === undefined) d.easterTokensSpent = 0;
            if (!d.unlockedArtstyles) d.unlockedArtstyles = [];
            if (!d.equippedArtstyles) d.equippedArtstyles = {};
            return d;
        };
    }

    // 3. Inject Easter set into CardSets
    if (typeof CardSets !== 'undefined' && !CardSets['easter']) {
        CardSets['easter'] = {
            'Dora the Explorer': {
                name:'Dora the Explorer', type:'Character', cost:7, atk:1, hp:5, maxHp:5,
                text:'Summon: เรียก Boots (3/4) ลงสนาม | Ongoing: จบเทิร์น สุ่ม Equip Item จาก Deck ให้ Boots 1 ใบ | ตาย: สุ่มรับการ์ด Cost>5 1 ใบ',
                color:'bg-orange-500', maxAttacks:1,
                art:'https://i.pinimg.com/736x/d5/9a/c4/d59ac4fcfaee7d0d6ffb82ac1cad9f81.jpg'
            },
            'Great Rabbit': {
                name:'Great Rabbit', type:'Character', cost:6, atk:3, hp:6, maxHp:6,
                text:'จบเทิร์น: อัญเชิญ Great Rabbit 2 ตัวลงสนาม (1 ครั้ง/เทิร์น ต่อฝั่ง)',
                color:'bg-pink-500', maxAttacks:1,
                art:'https://i.pinimg.com/1200x/53/ff/6f/53ff6f638ab4ced427ac23a8256bb21d.jpg'
            },
            'Easter Egg': {
                name:'Easter Egg', type:'Action', cost:3,
                text:'Action: เทิร์นนี้ไม่มีผล แต่เทิร์นหน้าสุ่มอัญเชิญ Character Cost 5-7 จาก Deck',
                color:'bg-yellow-500',
                art:'https://i.pinimg.com/1200x/86/aa/5d/86aa5d7229317d68daeff3cc8fd15ae0.jpg'
            },
        };
    }

    // 4. Inject Easter into SETS_META
    if (typeof SETS_META !== 'undefined' && !SETS_META['easter']) {
        SETS_META['easter'] = { label:'Easter Event', emoji:'🐣', mascot:'Great Rabbit', mascotArt:'https://i.pinimg.com/736x/9e/32/38/9e3238f0ae9b6cd3c8e7e9d47c4cb3e1.jpg' };
    }

    // 5. Inject new redeem codes
    if (typeof REDEEM_CODES !== 'undefined') {
        if (!REDEEM_CODES['EASTERISHERE']) REDEEM_CODES['EASTERISHERE'] = { gems:20, xp:500, label:'🐣 Easter is Here!',     oneTime:true, expires:EASTER_EXPIRY };
        if (!REDEEM_CODES['BUNNY999'])     REDEEM_CODES['BUNNY999']     = { coins:999,         label:'🐇 Bunny 999',            oneTime:true };
    }

    // 6. Patch redeemCode → expiry + XP
    const _origRedeem = window.redeemCode;
    if (typeof _origRedeem === 'function') {
        window.redeemCode = function() {
            const raw = document.getElementById('redeem-input')?.value?.trim().toUpperCase().replace(/\s+/g,'');
            if (!raw) { _origRedeem(); return; }
            const reward = typeof REDEEM_CODES!=='undefined' ? REDEEM_CODES[raw] : null;
            if (reward?.expires && Date.now() > reward.expires) {
                const msg = document.getElementById('redeem-msg');
                if (msg) { msg.style.color='#f87171'; msg.textContent='❌ โค้ดนี้หมดอายุแล้ว'; }
                return;
            }
            _origRedeem();
            if (reward?.xp && typeof addXp==='function') {
                addXp(reward.xp);
                const msg = document.getElementById('redeem-msg');
                if (msg && msg.textContent.includes('สำเร็จ')) msg.textContent += ` +${reward.xp} ⭐ XP`;
            }
        };
    }

    // 7. Add Easter Eater title
    if (typeof ALL_TITLES !== 'undefined' && !ALL_TITLES.some(t=>t.id==='Easter Eater')) {
        ALL_TITLES.push({ id:'Easter Eater', how:'ใช้ Easter Token ครบ 30 อัน' });
    }

    // 8. Patch checkTitleUnlocks → Easter Eater check
    const _origCheckTitles = window.checkTitleUnlocks;
    if (typeof _origCheckTitles === 'function') {
        window.checkTitleUnlocks = function() {
            _origCheckTitles.call(this);
            if ((playerData.easterTokensSpent||0)>=30 && typeof unlockTitle==='function') unlockTitle('Easter Eater');
        };
    }

    // 9. Patch endGame → award Easter Token on win (AI mode, ranked, or online win)
    const _origEndGame = window.endGame;
    if (typeof _origEndGame === 'function') {
        window.endGame = function(winner) {
            _origEndGame.call(this, winner);
            if (!isEasterActive() || winner !== 'player') return;
            const isAI      = typeof gameMode!=='undefined' && gameMode==='ai';
            const isRanked  = typeof _isRankedGame!=='undefined' && _isRankedGame;
            const isOnline  = typeof gameMode!=='undefined' && gameMode==='online' && typeof myRole!=='undefined' && myRole==='player';
            if (isAI || isRanked || isOnline) {
                if (!playerData.easterTokens) playerData.easterTokens=0;
                playerData.easterTokens++;
                saveData();
                setTimeout(()=>showToast('🐣 ชนะ! +1 Easter Token','#86efac'), 1200);
            }
        };
    }

    // 10. Patch renderHomePanel → inject Easter banner
    const _origRenderHome = window.renderHomePanel;
    if (typeof _origRenderHome === 'function') {
        window.renderHomePanel = function() {
            _origRenderHome.call(this);
            setTimeout(_injectEasterBanner, 10);
        };
    }

    // 11. Apply any equipped artstyles from save data
    _initArtstyles();

    // 12. Initial banner injection (in case renderHomePanel already ran)
    setTimeout(_injectEasterBanner, 600);
});
