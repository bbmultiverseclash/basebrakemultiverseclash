// ============================================================
// 17_easter_update.js — NEW HUGE EASTER UPDATE 🐣
// วางไว้ท้ายสุดใน index_v2.html ก่อน </body> (หลัง 16_frieren_system.js)
// ============================================================

// ─── EVENT EXPIRY ─────────────────────────────────────────────────
const EASTER_EVENT_EXPIRY = new Date('2026-04-27T23:59:59+07:00');
function _isEasterEventActive() { return new Date() < EASTER_EVENT_EXPIRY; }
function _easterCountdown() {
    const diff = EASTER_EVENT_EXPIRY - new Date();
    if (diff <= 0) return '⏰ Event สิ้นสุดแล้ว';
    const d=Math.floor(diff/86400000), h=Math.floor((diff%86400000)/3600000), m=Math.floor((diff%3600000)/60000);
    return d>0?`⏳ เหลือ ${d} วัน ${h} ชม.`:`⏳ เหลือ ${h} ชม. ${m} นาที`;
}

// ─── ART STYLE CATALOG ────────────────────────────────────────────
// key = artstyle ID, cardName = ชื่อการ์ดที่เปลี่ยน art
const EASTER_ARTSTYLES = {
    'messi_cute_hat':       { label:'Messi — Cute Hat',                  cardName:'Messi',             url:'https://files.catbox.moe/46kzb4.jpg',  icon:'⚽', color:'#4ade80' },
    'rem_easter_special':   { label:'Rem — Easter Special',              cardName:'Rem',               url:'https://files.catbox.moe/ub6jf0.jpg',  icon:'🐣', color:'#f9a8d4' },
    'toybox_bunny_egg':     { label:'Toy Box Surprise — Bunny and Egg',  cardName:'Toy Box Surprise',  url:'https://files.catbox.moe/997vj7.jpg',  icon:'🎁', color:'#fbbf24' },
    'gilgamesh_pixel_sword':{ label:'Gilgamesh — Pixel Sword',           cardName:'Gilgamesh',         url:'https://files.catbox.moe/qfltxb.jpg',  icon:'⚔️', color:'#fb923c' },
    'rubberduck_bloom':     { label:'Rubber Duck — Bloom Festival',      cardName:'Rubber Duck',       url:'https://files.catbox.moe/l62gqg.jpg',  icon:'🦆', color:'#60a5fa' },
};

// Map: cardName → artURL (สำหรับ renderCard patch)
window._EASTER_ARTSTYLE_MAP = {};
Object.values(EASTER_ARTSTYLES).forEach(a => {
    if (!window._EASTER_ARTSTYLE_MAP[a.cardName]) window._EASTER_ARTSTYLE_MAP[a.cardName] = {};
    // key ใช้ artstyle ID
    Object.entries(EASTER_ARTSTYLES).filter(([,v])=>v.cardName===a.cardName).forEach(([id,v])=>{
        window._EASTER_ARTSTYLE_MAP[a.cardName][id] = v.url;
    });
});

// ─── EASTER CARD TEMPLATES ────────────────────────────────────────
const EASTER_CARDS_TPL = {
    'Dora the Explorer': {
        name:'Dora the Explorer', type:'Character', cost:7, atk:1, hp:5, maxHp:5,
        text:'Summon: เรียก Boots (4/3) | Ongoing: จบเทิร์น: สุ่ม Equip Item จากทุก Set 2 ใบให้ Boots | ตาย: สุ่มการ์ด Cost >5 1 ใบจาก Deck เข้ามือ',
        color:'bg-orange-500', maxAttacks:1,
        art:'https://i.pinimg.com/1200x/a0/9c/26/a09c2644e9db26dfa01636a0bd48ae06.jpg',
        _theme:'easter'
    },
    'Boots': {
        name:'Boots', type:'Character', cost:0, atk:3, hp:4, maxHp:4,
        text:'Token: เพื่อนของ Dora | รับ Item จาก Dora ทุกจบเทิร์น',
        color:'bg-amber-600', maxAttacks:1,
        art:'https://i.pinimg.com/736x/f5/14/99/f5149902a6196f6e4ce27e0b1c3e0ef5.jpg',
        isToken:true, _theme:'easter'
    },
    'Great Rabbit': {
        name:'Great Rabbit', type:'Character', cost:6, atk:6, hp:3, maxHp:3,
        text:'จบเทิร์น: อัญเชิญ Great Rabbit อีก 2 ตัวลงสนาม (ครั้งเดียวต่อเทิร์น)',
        color:'bg-pink-500', maxAttacks:1,
        art:'https://i.pinimg.com/736x/6a/da/a2/6adaa28e1a1bad35d56be406c7a8b0d6.jpg',
        _theme:'easter'
    },
    'Easter Egg': {
        name:'Easter Egg', type:'Action', cost:3,
        text:'Action: ไม่มีผลในเทิร์นนี้ | เทิร์นถัดไปของคุณ: สุ่มอัญเชิญ Character จาก Deck ที่ Cost 5-7 ลงสนาม',
        color:'bg-yellow-500',
        art:'https://i.pinimg.com/1200x/ea/d7/39/ead739f3abf2a56a78dae85e0e3aecdc.jpg',
        _theme:'easter'
    },
};

// ─── EASTER SHOP CATALOG ──────────────────────────────────────────
const EASTER_SHOP_ITEMS = [
    { id:'shop_dora',          label:'Dora the Explorer',                    icon:'🌺',  type:'card',  cardName:'Dora the Explorer', theme:'easter', cost:15,  maxBuy:3 },
    { id:'shop_greatrabbit',   label:'Great Rabbit',                         icon:'🐰',  type:'card',  cardName:'Great Rabbit',       theme:'easter', cost:15,  maxBuy:3 },
    { id:'shop_easteregg',     label:'Easter Egg',                           icon:'🥚',  type:'card',  cardName:'Easter Egg',         theme:'easter', cost:10,  maxBuy:3 },
    { id:'shop_art_messi',     label:'Messi — Cute Hat',                     icon:'⚽',  type:'art',   artId:'messi_cute_hat',        cost:20,  maxBuy:1 },
    { id:'shop_art_rem',       label:'Rem — Easter Special',                 icon:'🐣',  type:'art',   artId:'rem_easter_special',    cost:5,   maxBuy:1 },
    { id:'shop_art_toybox',    label:'Toy Box Surprise — Bunny and Egg',     icon:'🎁',  type:'art',   artId:'toybox_bunny_egg',      cost:5,   maxBuy:1 },
    { id:'shop_art_gilgamesh', label:'Gilgamesh — Pixel Sword',              icon:'⚔️',  type:'art',   artId:'gilgamesh_pixel_sword', cost:5,   maxBuy:1 },
    { id:'shop_art_rubberduck',label:'Rubber Duck — Bloom Festival',         icon:'🦆',  type:'art',   artId:'rubberduck_bloom',      cost:5,   maxBuy:1 },
];

const EASTER_TOKEN_GEM_RATE = { tokens:5, gems:5, maxRounds:10 }; // 5tokens → 5gems

// ─── INIT PLAYER DATA ─────────────────────────────────────────────
function _initEasterPlayerData() {
    if (!playerData) return;
    if (playerData.easterTokens     === undefined) playerData.easterTokens     = 0;
    if (playerData.easterTokensSpent=== undefined) playerData.easterTokensSpent= 0;
    if (!playerData.unlockedArts)                  playerData.unlockedArts     = {};
    if (!playerData.equippedArts)                  playerData.equippedArts     = {};
    if (!playerData.easterShopBought)              playerData.easterShopBought = {};
    if (playerData.easterGemExchanges=== undefined)playerData.easterGemExchanges=0;
}

// ─── CARD INSTANCE FACTORY ────────────────────────────────────────
function _mkEasterCard(cardName) {
    const tpl = EASTER_CARDS_TPL[cardName];
    if (!tpl || typeof cardIdCounter==='undefined') return null;
    const base = {
        id:'card_'+(cardIdCounter++), name:tpl.name, originalName:tpl.name,
        type:tpl.type, cost:tpl.cost, atk:tpl.atk||0, hp:tpl.hp||0, maxHp:tpl.maxHp||0,
        text:tpl.text, color:tpl.color, maxAttacks:tpl.maxAttacks||0, attacksLeft:tpl.maxAttacks||0,
        art:tpl.art, _theme:'easter', isEasterCard:true, isToken:!!tpl.isToken,
        requiresTarget:false, targetEnemy:false,
        status:[], items:[], stolenText:'',
        hasAsunaBuff:false, hasRamBuff:false, hasRemBuff:false,
        silenced:false, costReducer:0, damageReduce:0,
        shalltearBleedTurns:0, paralyzeTurns:0, freezeTurns:0,
        bleedTurns:0, burnTurns:0, immortalTurns:0,
        goldenBuffExpires:[], poseidonReduceTurn:0, queenImmortalTurns:0,
        escutcheonTurns:0, tossakanImmortalTurns:0, tossakanImmune:false,
        tossakanPermanentReduce:false, isSun:false, herculesExtraLives:0,
        natureWandUsed:false, clayBarrierTurns:0, tempBuffs:[], altairLastKilledAtk:0
    };
    return base;
}

// ─── ADD EASTER TOKEN (call after win) ────────────────────────────
function _grantEasterToken(count=1) {
    if (!_isEasterEventActive()) return; // event ended — no more tokens
    _initEasterPlayerData();
    playerData.easterTokens = (playerData.easterTokens||0) + count;
    saveData();
    showToast(`🐣 +${count} Easter Token!`,'#f9a8d4');
    _checkEasterEaterTitle();
}

function _checkEasterEaterTitle() {
    if ((playerData.easterTokensSpent||0) >= 30) {
        if (typeof unlockTitle==='function') unlockTitle('Easter Eater');
    }
}

// ─── REDEEM CODES (new codes) ─────────────────────────────────────
function _injectEasterRedeemCodes() {
    if (typeof REDEEM_CODES==='undefined') return;
    REDEEM_CODES['EASTERISHERE'] = { gems:20, xp:500,  label:'🐣 Easter is Here!',  oneTime:true };
    REDEEM_CODES['BUNNY999']     = { coins:999,         label:'🐰 Bunny 999 Coins!', oneTime:true };
}

// ─── TITLE: Easter Eater ──────────────────────────────────────────
function _injectEasterTitle() {
    if (typeof ALL_TITLES==='undefined') return;
    if (!ALL_TITLES.find(t=>t.id==='Easter Eater')) {
        ALL_TITLES.push({ id:'Easter Eater', how:'ใช้ Easter Token ครบ 30 ใบ' });
    }
}

// ─── EASTER SHOP ─────────────────────────────────────────────────
function openEasterShop() {
    if (!_isEasterEventActive()) {
        showToast('🐣 Easter Event สิ้นสุดแล้ว! (27 เม.ย. 2026)','#f87171'); return;
    }
    _initEasterPlayerData();
    const ov = document.createElement('div');
    ov.id = '_easter-shop-overlay';
    ov.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,0.92);z-index:3000;display:flex;align-items:center;justify-content:center;padding:12px';
    ov.onclick = e => { if(e.target===ov) ov.remove(); };
    ov.innerHTML = _buildEasterShopHTML();
    document.body.appendChild(ov);
}

function _buildEasterShopHTML() {
    _initEasterPlayerData();
    const tk = playerData.easterTokens||0;
    const spent = playerData.easterTokensSpent||0;
    const exchanges = playerData.easterGemExchanges||0;
    const gems = playerData.gems||0;
    const canExchange = exchanges < EASTER_TOKEN_GEM_RATE.maxRounds && tk >= EASTER_TOKEN_GEM_RATE.tokens;

    const itemsHTML = EASTER_SHOP_ITEMS.map(item => {
        const bought = playerData.easterShopBought[item.id] || 0;
        const maxed  = bought >= item.maxBuy;
        const canBuy = !maxed && tk >= item.cost;
        const preview = item.type==='art' ? EASTER_ARTSTYLES[item.artId]?.url : null;

        return `
<div style="background:#111827;border:1.5px solid ${maxed?'#4ade8066':canBuy?'#f9a8d466':'#374151'};
     border-radius:14px;overflow:hidden;display:flex;flex-direction:column">
  ${preview ? `<img src="${preview}" style="width:100%;height:80px;object-fit:cover;opacity:${maxed?0.5:1}">` :
              `<div style="height:56px;display:flex;align-items:center;justify-content:center;font-size:2.5rem;background:#0f172a">${item.icon}</div>`}
  <div style="padding:10px 10px 8px;flex:1;display:flex;flex-direction:column;gap:4px">
    <div style="font-size:0.68rem;font-weight:900;color:${maxed?'#4ade80':'#e5e7eb'};line-height:1.2">${item.label}</div>
    ${item.type==='art'?`<div style="font-size:0.55rem;color:#818cf8">🎨 Art Style</div>`:`<div style="font-size:0.55rem;color:#f9a8d4">📦 สูงสุด ${item.maxBuy} ใบ · มีแล้ว ${bought}</div>`}
    <div style="margin-top:auto;display:flex;align-items:center;justify-content:space-between">
      <div style="font-size:0.82rem;font-weight:900;color:${canBuy?'#f9a8d4':'#6b7280'}">🐣 ${item.cost}</div>
      <button onclick="easterShopBuy('${item.id}')"
        ${canBuy?'':'disabled'}
        style="background:${maxed?'#14532d':canBuy?'linear-gradient(135deg,#be185d,#9d174d)':'#374151'};
               color:${maxed?'#4ade80':canBuy?'white':'#6b7280'};
               border:none;padding:5px 10px;border-radius:8px;
               font-size:0.65rem;font-weight:900;cursor:${canBuy?'pointer':'not-allowed'}">
        ${maxed?'✓ แล้ว':canBuy?'ซื้อ':'ไม่พอ'}
      </button>
    </div>
  </div>
</div>`;
    }).join('');

    return `
<div style="background:linear-gradient(135deg,#0a0015,#1a0030,#0d0020);
     border:3px solid #f472b6;border-radius:24px;padding:0;
     max-width:520px;width:100%;max-height:90vh;overflow:hidden;
     box-shadow:0 0 80px rgba(244,114,182,0.4);display:flex;flex-direction:column">

  <!-- Header -->
  <div style="background:linear-gradient(135deg,#1a0030,#2d0050);padding:20px 20px 16px;flex-shrink:0">
    <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:14px">
      <div>
        <div style="font-size:1.3rem;font-weight:900;color:#f9a8d4">🐣 Easter Shop</div>
        <div style="font-size:0.65rem;color:${_isEasterEventActive()?'#f9a8d4':'#f87171'}">${_isEasterEventActive()?'Limited Time · ใช้ Easter Token เท่านั้น':'⏰ Event สิ้นสุดแล้ว!'}</div>
        <div style="font-size:0.6rem;color:#9ca3af;margin-top:2px">${_easterCountdown()} · สิ้นสุด 27 เม.ย. 2026</div>
      </div>
      <button onclick="document.getElementById('_easter-shop-overlay').remove()"
        style="background:rgba(255,255,255,0.1);border:none;color:#9ca3af;
               width:30px;height:30px;border-radius:50%;cursor:pointer;font-size:1rem">✕</button>
    </div>
    <!-- Balances -->
    <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:8px">
      <div style="background:rgba(0,0,0,0.4);border:1px solid #f472b655;border-radius:10px;padding:8px 10px;text-align:center">
        <div style="font-size:1.1rem;font-weight:900;color:#f9a8d4">${tk}</div>
        <div style="font-size:0.6rem;color:#9ca3af">🐣 Token</div>
      </div>
      <div style="background:rgba(0,0,0,0.4);border:1px solid #374151;border-radius:10px;padding:8px 10px;text-align:center">
        <div style="font-size:1.1rem;font-weight:900;color:#93c5fd">${gems}</div>
        <div style="font-size:0.6rem;color:#9ca3af">💎 Gems</div>
      </div>
      <div style="background:rgba(0,0,0,0.4);border:1px solid #f9a8d444;border-radius:10px;padding:8px 10px;text-align:center">
        <div style="font-size:1rem;font-weight:900;color:#fbbf24">${spent}</div>
        <div style="font-size:0.6rem;color:#9ca3af">Token ใช้ไปแล้ว</div>
      </div>
    </div>
  </div>

  <!-- Gem Exchange -->
  <div style="background:#0a0015;padding:10px 20px;flex-shrink:0;border-bottom:1px solid #374151">
    <div style="display:flex;align-items:center;gap:10px">
      <div style="font-size:0.75rem;flex:1">
        <div style="font-weight:800;color:#93c5fd">🐣 แลก Token → Gem</div>
        <div style="font-size:0.62rem;color:#6b7280">5 Token = 5 Gem · ทำได้ ${exchanges}/${EASTER_TOKEN_GEM_RATE.maxRounds} ครั้ง</div>
      </div>
      <button onclick="easterExchangeGems()"
        ${canExchange?'':'disabled'}
        style="background:${canExchange?'linear-gradient(135deg,#1d4ed8,#1e40af)':'#374151'};
               color:${canExchange?'white':'#6b7280'};border:none;
               padding:8px 16px;border-radius:10px;font-weight:900;
               font-size:0.8rem;cursor:${canExchange?'pointer':'not-allowed'}">
        ${exchanges>=EASTER_TOKEN_GEM_RATE.maxRounds?'✓ ครบแล้ว':tk<5?'🐣 ไม่พอ':'แลก!'}
      </button>
    </div>
  </div>

  <!-- Easter Eater Progress -->
  <div style="background:#0a0015;padding:8px 20px;flex-shrink:0;border-bottom:1px solid #1f2937">
    <div style="display:flex;align-items:center;gap:10px">
      <span style="font-size:1rem">👑</span>
      <div style="flex:1">
        <div style="font-size:0.7rem;font-weight:800;color:#fbbf24">Easter Eater Title</div>
        <div style="height:5px;background:#1f2937;border-radius:4px;margin-top:3px;overflow:hidden">
          <div style="height:100%;width:${Math.min(100,Math.round(spent/30*100))}%;background:linear-gradient(90deg,#f472b6,#ec4899);border-radius:4px"></div>
        </div>
      </div>
      <div style="font-size:0.7rem;color:#f9a8d4">${spent}/30</div>
    </div>
  </div>

  <!-- Items Grid -->
  <div style="overflow-y:auto;padding:14px 14px;flex:1">
    <div style="font-size:0.68rem;color:#f9a8d4;font-weight:900;text-transform:uppercase;letter-spacing:0.8px;margin-bottom:10px">🛒 สินค้า</div>
    <div style="display:grid;grid-template-columns:repeat(2,1fr);gap:8px">
      ${itemsHTML}
    </div>
  </div>
</div>`;
}

function easterShopBuy(itemId) {
    if (!_isEasterEventActive()) { showToast('🐣 Event สิ้นสุดแล้ว!','#f87171'); return; }
    _initEasterPlayerData();
    const item = EASTER_SHOP_ITEMS.find(i=>i.id===itemId);
    if (!item) return;
    const bought = playerData.easterShopBought[item.id]||0;
    if (bought >= item.maxBuy) { showToast('ซื้อครบแล้ว!','#f87171'); return; }
    if ((playerData.easterTokens||0) < item.cost) { showToast('🐣 Token ไม่พอ!','#f87171'); return; }

    playerData.easterTokens -= item.cost;
    playerData.easterTokensSpent = (playerData.easterTokensSpent||0) + item.cost;
    playerData.easterShopBought[item.id] = bought + 1;

    if (item.type === 'card') {
        const key = `${item.cardName}|easter`;
        playerData.collection[key] = (playerData.collection[key]||0) + 1;
        showToast(`🐣 ได้ ${item.label}! เพิ่มใน Collection แล้ว`,'#f9a8d4');
    } else if (item.type === 'art') {
        if (!playerData.unlockedArts) playerData.unlockedArts = {};
        playerData.unlockedArts[item.artId] = true;
        showToast(`🎨 ปลดล็อค Art Style: ${item.label}!`,'#f9a8d4');
    }

    _checkEasterEaterTitle();
    saveData();
    updateHubUI();
    // Refresh shop
    const ov = document.getElementById('_easter-shop-overlay');
    if (ov) ov.innerHTML = _buildEasterShopHTML();
}

function easterExchangeGems() {
    if (!_isEasterEventActive()) { showToast('🐣 Event สิ้นสุดแล้ว!','#f87171'); return; }
    _initEasterPlayerData();
    const { tokens: tokenCost, gems: gemReward, maxRounds } = EASTER_TOKEN_GEM_RATE;
    if ((playerData.easterGemExchanges||0) >= maxRounds) { showToast('ครบ 10 รอบแล้ว!','#f87171'); return; }
    if ((playerData.easterTokens||0) < tokenCost) { showToast('🐣 Token ไม่พอ!','#f87171'); return; }
    playerData.easterTokens -= tokenCost;
    playerData.easterTokensSpent = (playerData.easterTokensSpent||0) + tokenCost;
    playerData.gems = (playerData.gems||0) + gemReward;
    playerData.easterGemExchanges = (playerData.easterGemExchanges||0) + 1;
    _checkEasterEaterTitle();
    saveData();
    showToast(`🐣 ${tokenCost} Token → 💎 ${gemReward} Gem`,'#93c5fd');
    const ov = document.getElementById('_easter-shop-overlay');
    if (ov) ov.innerHTML = _buildEasterShopHTML();
    updateHubUI();
}

// ─── ARTSTYLE PANEL ───────────────────────────────────────────────
function openArtStylePanel() {
    _initEasterPlayerData();
    const ov = document.createElement('div');
    ov.id = '_artstyle-panel-overlay';
    ov.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,0.92);z-index:3100;display:flex;align-items:center;justify-content:center;padding:12px';
    ov.onclick = e => { if(e.target===ov) ov.remove(); };
    ov.innerHTML = _buildArtStylePanelHTML();
    document.body.appendChild(ov);
}

function _buildArtStylePanelHTML() {
    _initEasterPlayerData();
    const unlocked = playerData.unlockedArts || {};
    const equipped = playerData.equippedArts || {};

    // Also include Frieren altArts
    const frierenSection = `
<div style="margin-bottom:16px">
  <div style="font-size:0.65rem;color:#818cf8;font-weight:900;text-transform:uppercase;letter-spacing:0.8px;margin-bottom:8px">✨ Frieren Collection</div>
  <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px">
    ${[['normal','🖼️ Normal',window.FRIEREN_ART_NORMAL||''],['easter','🐣 Easter',window.FRIEREN_ART_EASTER||'']].map(([style,label,url])=>{
        const isEquipped = (playerData.selectedArts||{})['Frieren'] === style || (style==='normal'&&!(playerData.selectedArts||{})['Frieren']);
        const hasFreiren = (playerData.collection['Frieren|frieren_mage']||0)>0;
        return `<div style="border:2px solid ${isEquipped?'#818cf8':'#374151'};border-radius:12px;overflow:hidden;${!hasFreiren?'opacity:0.45':''}">
          <img src="${url}" style="width:100%;height:70px;object-fit:cover;display:block">
          <div style="background:#0a0a0f;padding:8px">
            <div style="font-size:0.62rem;font-weight:900;color:${isEquipped?'#a5b4fc':'#9ca3af'}">${label}</div>
            <div style="font-size:0.55rem;color:#6b7280;margin-bottom:5px">สำหรับ Frieren</div>
            ${hasFreiren
              ? (isEquipped
                  ? `<div style="font-size:0.55rem;color:#4ade80">✓ กำลังใช้อยู่</div>`
                  : `<button onclick="switchCardArt('Frieren','${style}');document.getElementById('_artstyle-panel-overlay').remove();openArtStylePanel()" style="width:100%;background:#4338ca;color:white;border:none;padding:4px;border-radius:6px;font-size:0.6rem;cursor:pointer">Equip</button>`)
              : `<div style="font-size:0.55rem;color:#ef4444">🔒 ต้องมี Frieren ก่อน</div>`}
          </div>
        </div>`;
    }).join('')}
  </div>
</div>`;

    const easterSection = Object.entries(EASTER_ARTSTYLES).map(([id, art]) => {
        const isUnlocked = !!unlocked[id];
        const isEquipped = equipped[art.cardName] === id;
        return `
<div style="border:2px solid ${isEquipped?art.color:isUnlocked?'#374151':'#1f2937'};
     border-radius:12px;overflow:hidden;${!isUnlocked?'opacity:0.5':''}">
  <div style="position:relative">
    <img src="${art.url}" style="width:100%;height:80px;object-fit:cover;display:block;filter:${isUnlocked?'none':'grayscale(70%)'}">
    ${!isUnlocked?`<div style="position:absolute;inset:0;display:flex;align-items:center;justify-content:center;background:rgba(0,0,0,0.5);font-size:1.5rem">🔒</div>`:''}
    ${isEquipped?`<div style="position:absolute;top:6px;right:6px;background:${art.color};color:#000;border-radius:20px;padding:2px 8px;font-size:0.55rem;font-weight:900">✓ EQUIPPED</div>`:''}
  </div>
  <div style="background:#0a0a0f;padding:8px">
    <div style="font-size:0.62rem;font-weight:900;color:${isUnlocked?art.color:'#6b7280'};line-height:1.3">${art.label}</div>
    <div style="font-size:0.55rem;color:#6b7280;margin-bottom:6px">สำหรับ ${art.cardName}</div>
    ${isUnlocked
      ? (isEquipped
          ? `<button onclick="easterUnequipArt('${id}','${art.cardName.replace(/'/g,"\\'")}');document.getElementById('_artstyle-panel-overlay').remove();openArtStylePanel()" style="width:100%;background:#374151;color:#9ca3af;border:none;padding:4px;border-radius:6px;font-size:0.6rem;cursor:pointer">Unequip</button>`
          : `<button onclick="easterEquipArt('${id}','${art.cardName.replace(/'/g,"\\'")}');document.getElementById('_artstyle-panel-overlay').remove();openArtStylePanel()" style="width:100%;background:linear-gradient(135deg,#be185d,#9d174d);color:white;border:none;padding:4px;border-radius:6px;font-size:0.6rem;cursor:pointer">Equip</button>`)
      : `<button onclick="openEasterShop()" style="width:100%;background:#7c2d12;color:#fed7aa;border:none;padding:4px;border-radius:6px;font-size:0.6rem;cursor:pointer">🐣 ซื้อใน Shop</button>`}
  </div>
</div>`;
    }).join('');

    const total = Object.keys(EASTER_ARTSTYLES).length;
    const owned  = Object.keys(EASTER_ARTSTYLES).filter(id=>unlocked[id]).length;

    return `
<div style="background:linear-gradient(135deg,#0a001a,#1a0030);
     border:3px solid #a855f7;border-radius:24px;
     max-width:500px;width:100%;max-height:90vh;overflow:hidden;
     display:flex;flex-direction:column;box-shadow:0 0 60px rgba(168,85,247,0.4)">

  <div style="padding:20px 20px 14px;flex-shrink:0;background:linear-gradient(135deg,#1a0030,#2d0050)">
    <div style="display:flex;align-items:center;justify-content:space-between">
      <div>
        <div style="font-size:1.3rem;font-weight:900;color:#d8b4fe">🎨 Art Styles</div>
        <div style="font-size:0.65rem;color:#9ca3af">ปลดล็อค ${owned}/${total} · เปลี่ยนรูปการ์ดในเกม</div>
      </div>
      <button onclick="document.getElementById('_artstyle-panel-overlay').remove()"
        style="background:rgba(255,255,255,0.1);border:none;color:#9ca3af;width:30px;height:30px;border-radius:50%;cursor:pointer;font-size:1rem">✕</button>
    </div>
  </div>

  <div style="overflow-y:auto;padding:14px;flex:1">
    ${frierenSection}
    <div style="font-size:0.65rem;color:#f9a8d4;font-weight:900;text-transform:uppercase;letter-spacing:0.8px;margin-bottom:8px">🐣 Easter Collection</div>
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px">${easterSection}</div>
  </div>
</div>`;
}

function easterEquipArt(artId, cardName) {
    _initEasterPlayerData();
    if (!(playerData.unlockedArts||{})[artId]) { showToast('ยังไม่ได้ปลดล็อค!','#f87171'); return; }
    playerData.equippedArts[cardName] = artId;
    saveData();
    showToast(`🎨 Equipped: ${EASTER_ARTSTYLES[artId]?.label}`,'#d8b4fe');
}

function easterUnequipArt(artId, cardName) {
    _initEasterPlayerData();
    delete playerData.equippedArts[cardName];
    saveData();
    showToast(`🎨 Unequipped: ${EASTER_ARTSTYLES[artId]?.label}`,'#9ca3af');
}

// ─── DORA ON-SUMMON: เรียก Boots ──────────────────────────────────
function _doraSummonBoots(doraCard, playerKey) {
    const p = state.players[playerKey];
    if (p.field.length >= (typeof MAX_FIELD !== 'undefined' ? MAX_FIELD : 5)) return;
    const boots = _mkEasterCard('Boots');
    if (!boots) return;
    boots._linkedDoraId = doraCard.id;
    p.field.push(boots);
    if (typeof log==='function') log(`🌺 [Dora] เรียก Boots (4/3) ลงสนาม!`,'text-orange-400 font-bold');
    if (typeof renderGame==='function') renderGame();
}

// ─── DORA END-OF-TURN: ให้ Item แก่ Boots ─────────────────────────
function _doraGiveItemToBoots(playerKey) {
    const p = state.players[playerKey];
    const doras = p.field.filter(c=>(c.originalName||c.name)==='Dora the Explorer'&&typeof getCharStats==='function'&&getCharStats(c).hp>0&&!c.silenced);
    doras.forEach(dora => {
        const boots = p.field.find(c=>(c.originalName||c.name)==='Boots'&&c._linkedDoraId===dora.id);
        if (!boots) return;
        // รวบรวม item จากทุก set
        const allItems = [];
        if (typeof CardSets!=='undefined') {
            Object.entries(CardSets).forEach(([set,cards]) => {
                Object.entries(cards||{}).forEach(([name,data]) => {
                    if (data.type==='Item') allItems.push({name, set, data});
                });
            });
        }
        if (allItems.length === 0) return;
        // สุ่ม 2 ชิ้น
        for (let i=0; i<2; i++) {
            const pick = allItems[Math.floor(Math.random()*allItems.length)];
            if (!boots.items) boots.items=[];
            if (boots.items.length < 3) {
                boots.items.push({ name: pick.name, data: pick.data });
                // Apply basic stat effect
                if (pick.data?.text?.includes('+3 ATK')) boots.atk=(boots.atk||0)+3;
                if (pick.data?.text?.includes('+3 HP'))  { boots.hp=(boots.hp||0)+3; boots.maxHp=(boots.maxHp||0)+3; }
                if (typeof log==='function') log(`🌺 [Dora] ให้ ${pick.name} แก่ Boots!`,'text-orange-300');
            }
        }
    });
}

// ─── DORA ON-DEATH: สุ่ม card cost >5 จาก deck ────────────────────
function _doraOnDeath(playerKey) {
    const p = state.players[playerKey];
    const highCost = p.deck.filter(c=>c.cost>5);
    if (highCost.length===0) return;
    const pick = highCost[Math.floor(Math.random()*highCost.length)];
    // Remove from deck and add to hand
    const idx = p.deck.indexOf(pick);
    if (idx>=0) p.deck.splice(idx,1);
    p.hand.push(pick);
    if (typeof log==='function') log(`🌺 [Dora on Death] ดึง ${pick.name} (Cost ${pick.cost}) เข้ามือ!`,'text-orange-400 font-bold');
}

// ─── GREAT RABBIT END-OF-TURN ─────────────────────────────────────
function _greatRabbitEndOfTurn(playerKey) {
    const p = state.players[playerKey];
    p.field.forEach(c => {
        if ((c.originalName||c.name)!=='Great Rabbit') return;
        if (typeof getCharStats==='function'&&getCharStats(c).hp<=0) return;
        if (c.silenced) return;
        if (c._greatRabbitTriggeredThisTurn) return;
        c._greatRabbitTriggeredThisTurn = true;
        let summoned = 0;
        for (let i=0; i<2; i++) {
            if (p.field.length >= (typeof MAX_FIELD!=='undefined'?MAX_FIELD:5)) break;
            const rabbit = _mkEasterCard('Great Rabbit');
            if (!rabbit) break;
            p.field.push(rabbit);
            summoned++;
        }
        if (summoned>0 && typeof log==='function')
            log(`🐰 [Great Rabbit] อัญเชิญ Great Rabbit ×${summoned} ลงสนาม!`,'text-pink-400 font-bold');
    });
}

function _resetGreatRabbitTrigger(playerKey) {
    state.players[playerKey].field.forEach(c => {
        if ((c.originalName||c.name)==='Great Rabbit') c._greatRabbitTriggeredThisTurn=false;
    });
}

// ─── EASTER EGG ACTION ────────────────────────────────────────────
function _executeEasterEgg(card, playerKey) {
    const p = state.players[playerKey];
    // Mark: เทิร์นถัดไปให้ summon
    p._easterEggPending = (p._easterEggPending||0) + 1;
    if (typeof log==='function') log(`🥚 [Easter Egg] จะฟักในเทิร์นถัดไป...`,'text-yellow-400 font-bold');
    p.graveyard.push(card);
}

function _triggerEasterEggStart(playerKey) {
    const p = state.players[playerKey];
    if (!p._easterEggPending || p._easterEggPending <= 0) return;
    p._easterEggPending--;
    // สุ่ม Character ใน deck ที่ cost 5-7
    const eligible = p.deck.filter(c=>c.type==='Character'&&c.cost>=5&&c.cost<=7);
    if (eligible.length===0) { if(typeof log==='function') log(`🥚 [Easter Egg] ไม่มี Character Cost 5-7 ใน Deck!`,'text-yellow-500'); return; }
    const pick = eligible[Math.floor(Math.random()*eligible.length)];
    const idx  = p.deck.indexOf(pick);
    if (idx>=0) p.deck.splice(idx,1);
    if (p.field.length < (typeof MAX_FIELD!=='undefined'?MAX_FIELD:5)) {
        p.field.push(pick);
        if (typeof log==='function') log(`🥚 [Easter Egg] ฟักออกมา! ${pick.name} ลงสนาม!`,'text-yellow-300 font-bold');
        if (typeof triggerOnSummon==='function') triggerOnSummon(pick, playerKey);
    }
}

// ─── DOM CONTENT LOADED ───────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {

    // 1. Init playerData
    if (typeof playerData!=='undefined') _initEasterPlayerData();

    // 2. Inject redeem codes
    setTimeout(_injectEasterRedeemCodes, 0);

    // 3. Inject Easter Eater title
    setTimeout(_injectEasterTitle, 0);

    // 4. Register easter cards
    setTimeout(() => {
        if (typeof CardSets==='undefined') return;
        CardSets['easter'] = {};
        Object.entries(EASTER_CARDS_TPL).forEach(([k,v]) => {
            CardSets['easter'][k] = JSON.parse(JSON.stringify(v));
        });
    }, 0);

    // 5. Patch redeemCode — support xp field
    setTimeout(() => {
        if (typeof redeemCode==='function') {
            const _orig = redeemCode;
            window.redeemCode = function() {
                const raw = document.getElementById('redeem-input')?.value?.trim().toUpperCase().replace(/\s+/g,'');
                const reward = (typeof REDEEM_CODES!=='undefined') ? REDEEM_CODES[raw] : null;
                _orig();
                // Apply XP if reward has it (applied after original runs)
                if (reward?.xp && typeof addXp==='function') {
                    const used = (typeof getUsedCodes==='function') ? getUsedCodes() : [];
                    // If it was just marked used (meaning redeem succeeded), add xp
                    if (used.includes(raw)) {
                        addXp(reward.xp);
                        showToast(`+${reward.xp} ⭐ XP`,'#4ade80');
                    }
                }
            };
        }
    }, 100);

    // 6. Patch awardWin → give Easter Token
    setTimeout(() => {
        if (typeof awardWin==='function') {
            const _orig = awardWin;
            window.awardWin = function() {
                const r = _orig();
                _grantEasterToken(1);
                return r;
            };
        }
        // Also patch Quick Play vs AI win
        if (typeof endGame==='function') {
            const _orig = endGame;
            window.endGame = function(winner) {
                const wasAI = (typeof gameMode!=='undefined' && gameMode==='ai');
                _orig(winner);
                if (winner==='player' && wasAI && !(typeof _isRankedGame!=='undefined'&&_isRankedGame)) {
                    _grantEasterToken(1);
                }
            };
        }
    }, 200);

    // 7. Patch triggerOnSummon → Dora
    setTimeout(() => {
        if (typeof triggerOnSummon==='function') {
            const _orig = triggerOnSummon;
            window.triggerOnSummon = function(card, pk) {
                _orig(card, pk);
                const eff = card.originalName||card.name;
                if (eff==='Dora the Explorer'&&!card._doraSummonDone) {
                    card._doraSummonDone = true;
                    _doraSummonBoots(card, pk);
                }
            };
        }
    }, 300);

    // 8. Patch resolveEndPhase → Great Rabbit + Dora → Boots items + Easter Egg
    setTimeout(() => {
        if (typeof resolveEndPhase==='function') {
            const _orig = resolveEndPhase;
            window.resolveEndPhase = function(pk) {
                _orig(pk);
                _greatRabbitEndOfTurn(pk);
                _doraGiveItemToBoots(pk);
            };
        }
    }, 350);

    // 9. Patch startOfTurn-like hook for Easter Egg & reset Great Rabbit
    // We hook into resolveDrawPhase or the turn start sequence
    setTimeout(() => {
        if (typeof resolveDrawPhase==='function') {
            const _orig = resolveDrawPhase;
            window.resolveDrawPhase = function(pk) {
                _triggerEasterEggStart(pk);
                _resetGreatRabbitTrigger(pk);
                _orig(pk);
            };
        }
    }, 350);

    // 10. Patch executeNonTargetAction → Easter Egg
    setTimeout(() => {
        if (typeof executeNonTargetAction==='function') {
            const _orig = executeNonTargetAction;
            window.executeNonTargetAction = function(card, pk) {
                if ((card.originalName||card.name)==='Easter Egg'||card._theme==='easter'&&card.type==='Action') {
                    _executeEasterEgg(card, pk); return;
                }
                _orig(card, pk);
            };
        }
    }, 400);

    // 11. Patch onDeath → Dora death effect
    setTimeout(() => {
        if (typeof resolveDeathEffects==='function') {
            const _orig = resolveDeathEffects;
            window.resolveDeathEffects = function(card, pk) {
                _orig(card, pk);
                const eff = card.originalName||card.name;
                if (eff==='Dora the Explorer') _doraOnDeath(pk);
            };
        }
    }, 400);

    // 12. Patch renderCard → Easter artstyle override
    setTimeout(() => {
        if (typeof renderCard==='function') {
            const _prev = renderCard;
            window.renderCard = function(card, inHand, displayCost, cs) {
                if (card && typeof playerData!=='undefined' && playerData.equippedArts) {
                    const artId = playerData.equippedArts[card.originalName||card.name];
                    if (artId && EASTER_ARTSTYLES[artId]) {
                        card = Object.assign({}, card, { art: EASTER_ARTSTYLES[artId].url });
                    }
                }
                return _prev(card, inHand, displayCost, cs);
            };
        }
    }, 500);

    // 13. Patch renderHomePanel → add Easter Shop + ArtStyle buttons
    setTimeout(() => {
        if (typeof renderHomePanel==='function') {
            const _orig = renderHomePanel;
            window.renderHomePanel = function() {
                _orig();
                _injectEasterHomeButtons();
            };
        }
    }, 150);

    // 14. Patch updateHubUI → refresh easter token display
    setTimeout(() => {
        if (typeof updateHubUI==='function') {
            const _orig = updateHubUI;
            window.updateHubUI = function() {
                _orig();
                _refreshEasterTokenBar();
            };
        }
    }, 150);

    // 15. Add palette button to hub nav bar
    setTimeout(_addPaletteNavButton, 300);

    // 16. backward-compat patch playerData
    setTimeout(() => {
        if (typeof playerData!=='undefined') _initEasterPlayerData();
    }, 0);
});

// ─── HOME PANEL: inject Easter buttons ────────────────────────────
function _injectEasterHomeButtons() {
    const panel = document.getElementById('hub-panel-home');
    if (!panel) return;
    const old = panel.querySelector('#_easter-home-btns');
    if (old) old.remove();

    const tk = (typeof playerData!=='undefined') ? (playerData.easterTokens||0) : 0;
    const div = document.createElement('div');
    div.id = '_easter-home-btns';
    div.style.cssText = 'padding:0 16px 16px;max-width:640px;margin:0 auto';
    div.innerHTML = `
<div style="display:flex;align-items:center;gap:8px;margin-bottom:10px">
  <div style="flex:1;height:1px;background:linear-gradient(90deg,transparent,#f472b6)"></div>
  <div style="font-size:0.7rem;font-weight:900;color:#f472b6;letter-spacing:1px">🐣 EASTER EVENT</div>
  <div style="flex:1;height:1px;background:linear-gradient(90deg,#f472b6,transparent)"></div>
</div>
<div style="display:grid;grid-template-columns:1fr 1fr;gap:10px">
  <div onclick="openEasterShop()" class="hub-stat-card" style="border:2px solid #f472b6;cursor:pointer;background:linear-gradient(135deg,#1a0030,#2d0050)">
    <div style="font-size:2rem">🐣</div>
    <div style="font-size:0.95rem;font-weight:700;color:#f9a8d4">Easter Shop</div>
    <div style="font-size:0.7rem;color:#9ca3af">${tk} Token พร้อมใช้</div>
  </div>
  <div onclick="openArtStylePanel()" class="hub-stat-card" style="border:2px solid #a855f7;cursor:pointer;background:linear-gradient(135deg,#0a001a,#1a0030)">
    <div style="font-size:2rem">🎨</div>
    <div style="font-size:0.95rem;font-weight:700;color:#d8b4fe">Art Styles</div>
    <div style="font-size:0.7rem;color:#9ca3af">เปลี่ยนรูปการ์ด</div>
  </div>
</div>`;
    const inner = panel.querySelector('div[style*="display:flex;flex-direction:column;gap:16px"]') || panel;
    inner.appendChild(div);
}

// ─── EASTER TOKEN BAR in top bar ─────────────────────────────────
function _refreshEasterTokenBar() {
    const tk = (typeof playerData!=='undefined') ? (playerData.easterTokens||0) : 0;
    let el = document.getElementById('_hub-easter-token-bar');
    if (!el) {
        // insert near gem display
        const gemsEl = document.getElementById('hub-gems');
        if (!gemsEl) return;
        el = document.createElement('span');
        el.id = '_hub-easter-token-bar';
        el.style.cssText = 'font-size:0.85rem;font-weight:800;color:#f9a8d4;margin-left:8px';
        gemsEl.parentNode?.insertBefore(el, gemsEl.nextSibling);
    }
    el.textContent = `🐣 ${tk}`;
}

// ─── PALETTE BUTTON in nav bar ────────────────────────────────────
function _addPaletteNavButton() {
    const nav = document.querySelector('#hub-screen nav, #hub-screen [id*="tab"], .hub-nav');
    if (!nav) {
        // fallback: inject floating button
        if (document.getElementById('_artstyle-float-btn')) return;
        const btn = document.createElement('button');
        btn.id = '_artstyle-float-btn';
        btn.onclick = openArtStylePanel;
        btn.title = 'Art Styles';
        btn.style.cssText = `position:fixed;bottom:80px;right:16px;
            background:linear-gradient(135deg,#7c3aed,#a855f7);
            color:white;border:none;width:46px;height:46px;border-radius:50%;
            font-size:1.3rem;cursor:pointer;z-index:1500;
            box-shadow:0 0 20px rgba(168,85,247,0.6)`;
        btn.textContent = '🎨';
        document.body.appendChild(btn);
    }
}
