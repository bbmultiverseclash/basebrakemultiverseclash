// ============================================================
// 27_rezero_premium.js — Premium Re:Zero Token, Artstyle Fix & Limited Gems
// ============================================================

// ─── รูปภาพ Token แทน Emoji ───
const RZ_TOKEN_IMG = '<img src="https://file.garden/aeeLCXSsJxTPrRbp/file_00000000be28720b9c4b780acf36a0ca.png" style="width:1.2em;height:1.2em;vertical-align:-0.2em;display:inline-block;filter:drop-shadow(0 0 2px rgba(168,85,247,0.5));">';

const REZERO_CARDS = {
    'Reid Astrea': {
        name: 'Reid Astrea', type: 'Character', cost: 9, atk: 6, hp: 6, maxHp: 6,
        text: 'Ongoing: ถ้าใส่ Item 2 ชิ้นขึ้นไป +3 ATK | On Attack: ถ้าเป้าหมาย HP > 6 มีโอกาส 50% ตี x3 DMG | On Death: ทำ 2 ดาเมจใส่ศัตรูทุกตัวบนสนาม',
        color: 'bg-red-800', maxAttacks: 1, shopOnly: true,
        art: 'https://file.garden/aeeLCXSsJxTPrRbp/f6bb6b0f302971c953cddb13399beafe.jpg', _theme: 'isekai_adventure'
    },
    'Volcanica the Protecter Dragon': {
        name: 'Volcanica the Protecter Dragon', type: 'Character', cost: 10, atk: 4, hp: 10, maxHp: 10,
        text: 'Ongoing: อมตะต่อดาเมจจาก Action/Spell และสกิล (รับดาเมจจากการโจมตีธรรมดาเท่านั้น) | ถ้าเพื่อนถูกโจมตี Volcanica จะรับดาเมจแทนเพียง 20% และเพื่อนไม่เสีย HP',
        color: 'bg-sky-800', maxAttacks: 1, shopOnly: true,
        art: 'https://file.garden/aeeLCXSsJxTPrRbp/ea38563e7b01c234704b115a6bc2daa8%20(1).jpg', _theme: 'isekai_adventure'
    },
    'Aldebaran': {
        name: 'Aldebaran', type: 'Character', cost: 8, atk: 5, hp: 5, maxHp: 5,
        text: 'Ongoing: ถ้าเพื่อนตาย ชุบชีวิตกลับมาทันที (1 ครั้ง/เทิร์น) | On Death: กลับขึ้นมือ และเปลี่ยน Cost เป็น 4',
        color: 'bg-orange-800', maxAttacks: 1, shopOnly: true,
        art: 'https://file.garden/aeeLCXSsJxTPrRbp/f4a385b7af07a98ddc4cfe30f1ece314.jpg', _theme: 'isekai_adventure'
    },
    'Roswaal L. Mathers': {
        name: 'Roswaal L. Mathers', type: 'Character', cost: 9, atk: 5, hp: 5, maxHp: 5,
        text: 'On Reveal: สุ่มนำ Action 1 ใบจากสุสานขึ้นมือ | On Attack: ถ้ามีการ์ดในสนามเรา ≥5 ใบ, Splash 5 DMG ใส่ศัตรูทุกตัว | On Death: สุ่มทิ้งการ์ดมือศัตรู 1 ใบ',
        color: 'bg-purple-800', maxAttacks: 1, shopOnly: true,
        art: 'https://file.garden/aeeLCXSsJxTPrRbp/2aae5eea36316902a6d2903ea68b9ce6.jpg', _theme: 'isekai_adventure'
    },
    'Black Serpent': {
        name: 'Black Serpent', type: 'Character', cost: 10, atk: 7, hp: 5, maxHp: 5,
        text: 'On Summon: ศัตรูทั้งหมดติด Poison 2 เทิร์น | On Attack: เป้าหมายติด Bleed, Burn, Poison 1 เทิร์นพร้อมกัน | On Death: คืนชีพ 1 ครั้งด้วย Stat 3/2',
        color: 'bg-gray-900', maxAttacks: 1, shopOnly: true,
        art: 'https://file.garden/aeeLCXSsJxTPrRbp/file_000000005020720b9d780243c993900a.png', _theme: 'isekai_adventure'
    }
};

const REZERO_ARTSTYLES = {
    'dog_siberian':    { id:'dog_siberian',    label:'Dog - Magic Shining Siberian', emoji:'🐕', targetCard:'Dog',      art:'https://file.garden/aeeLCXSsJxTPrRbp/1777282527839.jpg', shopCost:5, currency:'rezero' },
    'anaconda_cursed': { id:'anaconda_cursed', label:'Anaconda - Cursed Nightmare', emoji:'🐍', targetCard:'Anaconda', art:'https://file.garden/aeeLCXSsJxTPrRbp/1777282531186.jpg', shopCost:5, currency:'rezero' },
    'puck_beast':      { id:'puck_beast',      label:'Puck - Beast of the End',     emoji:'❄️', targetCard:'Puck',      art:'https://file.garden/aeeLCXSsJxTPrRbp/file_00000000556c720883d93bd91e12be6a.png', shopCost:5, currency:'rezero' },
    'emilia_depressed':{ id:'emilia_depressed',label:'Emilia - Depressed',          emoji:'💧', targetCard:'Emilia',    art:'https://file.garden/aeeLCXSsJxTPrRbp/deed1ccde92c2d1ef9c0d098086b88a5.jpg', shopCost:5, currency:'rezero' },
    'ram_easter':      { id:'ram_easter',      label:'Ram - Easter Special',        emoji:'🐰', targetCard:'Ram',       art:'https://file.garden/aeeLCXSsJxTPrRbp/83940040af8e288560bf9ea8c0992b54.jpg', shopCost:5, currency:'rezero' },
};

// ============================================================
// LIMITED GEMS SYSTEM
// ============================================================

function checkLimitedGemsExpiry() {
    if (playerData.limitedGems > 0 && playerData.limitedGemsExpiry && Date.now() > playerData.limitedGemsExpiry) {
        playerData.limitedGems = 0;
        playerData.limitedGemsExpiry = null;
    }
}

function getTotalGems() {
    checkLimitedGemsExpiry();
    return (playerData.gems || 0) + (playerData.limitedGems || 0);
}

function spendGems(amount) {
    checkLimitedGemsExpiry();
    let remainingCost = amount;
    
    // หักจาก Limited Gems ก่อนเสมอ
    if (playerData.limitedGems > 0) {
        if (playerData.limitedGems >= remainingCost) {
            playerData.limitedGems -= remainingCost;
            remainingCost = 0;
        } else {
            remainingCost -= playerData.limitedGems;
            playerData.limitedGems = 0;
        }
    }
    
    // ถ้ายังเหลือค่อยหักจาก Gem ปกติ
    if (remainingCost > 0) {
        playerData.gems -= remainingCost;
    }
}

// แฮ็กระบบเพื่อ Patch ฟังก์ชันเก่าที่ใช้ Gems ทั้งหมดในเกม ให้มาใช้ Limited Gems ด้วยอัตโนมัติ
function patchGlobalGemPurchases() {
    const functionsToPatch = [
        'buyFrierenPack', 'buyPremiumBP', 'buyFernBPPack', 'buyTrigonBPPack',
        'buyHxHBundle', 'buyBossKeyWithGems'
    ];
    
    functionsToPatch.forEach(fnName => {
        if (typeof window[fnName] === 'function') {
            const _orig = window[fnName];
            window[fnName] = function(...args) {
                const realGems = playerData.gems;
                const total = getTotalGems();
                
                // หลอกฟังก์ชันเก่าว่า Gem ปกติ = Gem รวมทั้งหมด
                playerData.gems = total; 
                
                _orig.apply(this, args);
                
                // เช็คว่าฟังก์ชันเก่ามีการหัก Gem ไปเท่าไหร่
                if (playerData.gems < total) {
                    const cost = total - playerData.gems;
                    playerData.gems = realGems; // คืนค่า Gem จริงกลับมาก่อน
                    spendGems(cost); // ใช้ระบบหัก Limited Gem
                    saveData();
                } else {
                    playerData.gems = realGems; // คืนค่าถ้าซื้อไม่สำเร็จ
                }
            };
        }
    });

    // Patch พิเศษสำหรับ buyTheme (เพราะมีรับ Argument)
    if (typeof window.buyTheme === 'function') {
        const _origBuyTheme = window.buyTheme;
        window.buyTheme = function(themeId) {
            const realGems = playerData.gems;
            const total = getTotalGems();
            playerData.gems = total;
            
            _origBuyTheme(themeId);
            
            if (playerData.gems < total) {
                const cost = total - playerData.gems;
                playerData.gems = realGems;
                spendGems(cost);
                saveData();
            } else {
                playerData.gems = realGems;
            }
        };
    }
    
    // อัปเดต UI ให้แสดงผลรวมของ Gem ทั้งสองประเภท
    const _origUpdateHubUI = window.updateHubUI;
    if (typeof _origUpdateHubUI === 'function') {
        window.updateHubUI = function() {
            _origUpdateHubUI();
            const gemEl = document.getElementById('hub-gems');
            if (gemEl) {
                gemEl.textContent = getTotalGems().toLocaleString();
            }
        };
    }
}

// ============================================================
// MAIN INJECTION
// ============================================================

document.addEventListener('DOMContentLoaded', () => {
    // 1. Init Data
    if (typeof playerData !== 'undefined') {
        if (playerData.rezeroTokens === undefined) playerData.rezeroTokens = 0;
        if (playerData.rezeroGemsBought === undefined) playerData.rezeroGemsBought = 0;
        if (playerData.rezeroBundleBought === undefined) playerData.rezeroBundleBought = false;
        if (playerData.limitedGems === undefined) playerData.limitedGems = 0;
    }

    // Apply Gem Patch
    patchGlobalGemPurchases();

    // 2. Inject Cards
    if (typeof CardSets !== 'undefined' && CardSets['isekai_adventure']) {
        Object.entries(REZERO_CARDS).forEach(([k, v]) => {
            CardSets['isekai_adventure'][k] = JSON.parse(JSON.stringify(v));
        });
        if (CardSets['isekai_adventure']['Puck']) CardSets['isekai_adventure']['Puck'].shopOnly = true;

        if (typeof getSetCardPool === 'function') {
            const _origGetPool = window.getSetCardPool;
            window.getSetCardPool = function(setName) {
                return _origGetPool(setName).filter(c => !c.data?.shopOnly);
            };
        }
        if (typeof openReadyPack === 'function') {
            const _origReady = window.openReadyPack;
            window.openReadyPack = function() {
                const hidden = [];
                Object.keys(CardSets).forEach(theme => {
                    Object.keys(CardSets[theme]).forEach(name => {
                        if (CardSets[theme][name].shopOnly) {
                            hidden.push({theme, name, data: CardSets[theme][name]});
                            delete CardSets[theme][name];
                        }
                    });
                });
                _origReady.apply(this, arguments);
                hidden.forEach(h => { CardSets[h.theme][h.name] = h.data; });
            };
        }
    }

    // 3. Inject Cosmetics & Artstyles
    if (typeof COSMETICS_CATALOG !== 'undefined') {
        if (!COSMETICS_CATALOG.banners.find(b => b.id === 'bn_rezero')) {
            COSMETICS_CATALOG.banners.push({ id: 'bn_rezero', label: 'Reinhard vs Volcanica & Aldebaran', art: 'https://file.garden/aeeLCXSsJxTPrRbp/c853ce6d526e2893e98c5937da0e223c.jpg' });
        }
        if (!COSMETICS_CATALOG.frames.find(f => f.id === 'fr_rbd')) {
            COSMETICS_CATALOG.frames.push({ id: 'fr_rbd', label: 'Return by Death', color: '#a855f7', effect: 'pulse', art: 'https://file.garden/aeeLCXSsJxTPrRbp/file_00000000fe287208b913d198506d509a.png' });
        }
    }
    if (typeof ARTSTYLE_CFG !== 'undefined') {
        Object.assign(ARTSTYLE_CFG, REZERO_ARTSTYLES);
    }

    // 4. Inject UI Button (แก้ไขให้รองรับการรีเฟรชตอน Login)
    function _injectRezeroBanner() {
        const homePanel = document.getElementById('hub-panel-home');
        if (!homePanel) return;
        
        // ถ้ามีปุ่มอยู่แล้วไม่ต้องสร้างซ้ำ
        if (document.getElementById('_rezero-shop-banner')) return;

        const btn = document.createElement('div');
        btn.id = '_rezero-shop-banner';
        btn.style.cssText = 'padding:0 16px;max-width:640px;margin:8px auto 0;';
        btn.innerHTML = `
          <button onclick="openRezeroShop()"
            style="width:100%;background:linear-gradient(135deg,#2e1065,#1e1b4b);
                   border:1.5px solid #a855f7;border-radius:14px;padding:12px 16px;
                   display:flex;align-items:center;gap:10px;cursor:pointer;text-align:left;box-shadow:0 0 15px rgba(168,85,247,0.3);">
            <div style="font-size:1.6rem">${RZ_TOKEN_IMG}</div>
            <div style="flex:1">
              <div style="font-weight:900;color:#c084fc;font-size:0.9rem">Re:Zero Premium Shop</div>
              <div style="font-size:0.65rem;color:#a855f7">แลกเปลี่ยน Premium Token รับการ์ดสุดแกร่ง</div>
            </div>
            <div style="background:#1f2937;border:1px solid #c084fc;border-radius:10px;padding:6px 10px;text-align:center;">
              <div style="font-size:0.55rem;color:#9ca3af">Token</div>
              <div id="_rz-token-cnt" style="font-size:1rem;font-weight:900;color:#c084fc">${playerData.rezeroTokens || 0}</div>
            </div>
          </button>`;
          
        // แทรกต่อจาก Artstyle Banner หรือ Rod Shop Banner
        const ref = document.getElementById('_artstyle-home-btn') || document.getElementById('_rod-shop-banner') || homePanel.firstChild;
        if (ref && ref.parentNode) {
            ref.parentNode.insertBefore(btn, ref.nextSibling);
        } else {
            homePanel.appendChild(btn);
        }
    }

    // ดักจับฟังก์ชัน renderHomePanel ให้วาดปุ่มเราเสมอเมื่อ UI ถูกอัปเดต (เช่น ตอนล็อกอิน)
    if (typeof window.renderHomePanel === 'function') {
        const _origRenderHomeRZ = window.renderHomePanel;
        window.renderHomePanel = function() {
            _origRenderHomeRZ.apply(this, arguments);
            setTimeout(_injectRezeroBanner, 50); // รอให้เกมวาดหน้าหลักเสร็จก่อน แล้วค่อยแทรกปุ่ม
        };
    }
    
    // เรียกใช้งานตอนโหลดเว็บครั้งแรก
    setTimeout(_injectRezeroBanner, 1000);

    // 5. Inject Redeem Codes
    if (typeof REDEEM_CODES !== 'undefined') {
        REDEEM_CODES['REZERO'] = { gems: 10, rezeroTokens: 10, label: 'Premium Tokens & Gems', oneTime: true };
        REDEEM_CODES['LIMITEDGEAR'] = { limitedGems: 100, label: '⏱️ 100 Limited Gems (หมดอายุใน 7 วัน)', oneTime: true };
    }
    
    if (typeof redeemCode === 'function') {
        const _origRZRedeem = window.redeemCode;
        window.redeemCode = function() {
            const raw = document.getElementById('redeem-input')?.value?.trim().toUpperCase().replace(/\s+/g,'');
            const reward = (typeof REDEEM_CODES !== 'undefined') ? REDEEM_CODES[raw] : null;
            
            if (reward && (reward.rezeroTokens || reward.limitedGems)) {
                const used = typeof getUsedCodes === 'function' ? getUsedCodes() : [];
                const msg = document.getElementById('redeem-msg');
                if (reward.oneTime && used.includes(raw)) {
                    if(msg) { msg.style.color='#f87171'; msg.textContent='❌ โค้ดนี้ใช้ไปแล้ว'; } return;
                }
                
                if (reward.rezeroTokens) playerData.rezeroTokens = (playerData.rezeroTokens || 0) + reward.rezeroTokens;
                if (reward.gems) playerData.gems = (playerData.gems || 0) + reward.gems;
                if (reward.limitedGems) {
                    playerData.limitedGems = (playerData.limitedGems || 0) + reward.limitedGems;
                    // หมดอายุใน 7 วัน นับจากตอนที่เติม
                    playerData.limitedGemsExpiry = Date.now() + (7 * 24 * 60 * 60 * 1000); 
                }
                
                if (typeof saveData==='function') saveData();
                if (typeof markCodeUsed==='function') markCodeUsed(raw);
                if (typeof updateHubUI==='function') updateHubUI();
                
                if(msg) { msg.style.color='#c084fc'; msg.textContent=`🎉 ได้รับ ${reward.label}!`; }
                document.getElementById('redeem-input').value = '';
                
                const cnt = document.getElementById('_rz-token-cnt');
                if (cnt) cnt.textContent = playerData.rezeroTokens;
                return;
            }
            _origRZRedeem.apply(this, arguments);
        };
    }

    _hookRezeroMechanics();
});

// ─── RE:ZERO SHOP UI ───
function openRezeroShop() {
    const ov = document.createElement('div');
    ov.id = '_rezero-shop-overlay';
    ov.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,0.92);z-index:3200;display:flex;align-items:center;justify-content:center;padding:12px;overflow-y:auto';
    ov.onclick = e => { if (e.target===ov) ov.remove(); };
    document.body.appendChild(ov);
    renderRezeroShop();
}

function renderRezeroShop() {
    const ov = document.getElementById('_rezero-shop-overlay');
    if (!ov) return;

    const tk = playerData.rezeroTokens || 0;
    const gemsBought = playerData.rezeroGemsBought || 0;
    const bundleBought = playerData.rezeroBundleBought || false;

    const shopItems = [
        { id: 'Reid Astrea', type: 'card', cost: 35 },
        { id: 'Volcanica the Protecter Dragon', type: 'card', cost: 35 },
        { id: 'Aldebaran', type: 'card', cost: 15 },
        { id: 'Roswaal L. Mathers', type: 'card', cost: 15 },
        { id: 'bn_rezero', type: 'banner', cost: 20, label: 'Banner: Reinhard vs Volcanica' }
    ];

    const itemRows = shopItems.map(item => {
        let owned = 0;
        let art = ''; let name = item.id; let desc = '';
        if (item.type === 'card') {
            owned = playerData.collection[`${item.id}|isekai_adventure`] || 0;
            art = REZERO_CARDS[item.id].art;
            desc = `Cost ${REZERO_CARDS[item.id].cost} · ATK ${REZERO_CARDS[item.id].atk}/HP ${REZERO_CARDS[item.id].hp}`;
        } else {
            owned = (playerData.unlockedCosmetics || []).includes(item.id) ? 1 : 0;
            art = COSMETICS_CATALOG.banners.find(b => b.id === item.id).art;
            desc = 'Profile Banner';
            name = item.label;
        }

        const canBuy = tk >= item.cost;

        return `<div style="background:#1e1b4b;border:1.5px solid ${canBuy?'#a855f7':'#374151'};border-radius:12px;padding:10px;display:flex;align-items:center;gap:10px">
          <img src="${art}" style="width:48px;height:58px;object-fit:cover;border-radius:6px;border:1px solid #4c1d95">
          <div style="flex:1;min-width:0">
            <div style="font-weight:900;color:white;font-size:0.8rem;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${name}</div>
            <div style="font-size:0.6rem;color:#a78bfa;">${desc}</div>
            <div style="font-size:0.55rem;color:#9ca3af;margin-top:2px">มีแล้ว: ${owned}</div>
          </div>
          <button onclick="buyRezeroItem('${item.id}', '${item.type}', ${item.cost})" ${canBuy?'':'disabled'}
            style="background:${canBuy?'linear-gradient(135deg,#7c3aed,#4f46e5)':'#374151'};color:${canBuy?'white':'#9ca3af'};border:none;padding:8px 12px;border-radius:8px;font-weight:900;font-size:0.8rem;cursor:${canBuy?'pointer':'not-allowed'};min-width:60px">
            ${RZ_TOKEN_IMG} ${item.cost}
          </button>
        </div>`;
    }).join('');

    ov.innerHTML = `
    <div style="background:linear-gradient(135deg,#0d0b2e,#1a0b2e);border:2.5px solid #a855f7;border-radius:24px;padding:20px;max-width:440px;width:100%;max-height:90vh;overflow-y:auto;box-shadow:0 0 50px rgba(168,85,247,0.3)">
      
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:16px">
        <div><div style="font-size:1.3rem;font-weight:900;color:#c084fc">${RZ_TOKEN_IMG} Re:Zero Shop</div></div>
        <div style="background:#1f2937;border:1px solid #a855f7;border-radius:10px;padding:6px 12px;text-align:center">
          <div style="font-size:0.55rem;color:#9ca3af">Premium Token</div>
          <div style="font-size:1.1rem;font-weight:900;color:#c084fc" id="modal-rz-tk">${tk}</div>
        </div>
      </div>

      <!-- Gacha Tokens -->
      <div style="background:#1e1b4b;border:1.5px dashed #8b5cf6;border-radius:12px;padding:12px;margin-bottom:16px;display:flex;align-items:center;gap:12px">
        <div style="font-size:2rem">💎</div>
        <div style="flex:1">
          <div style="font-weight:900;color:#ddd;font-size:0.8rem">สุ่มรับ 1-20 Premium Tokens!</div>
          <div style="font-size:0.65rem;color:#a78bfa">ใช้ 20 Gems (ซื้อได้ 5 ครั้ง)</div>
          <div style="font-size:0.6rem;color:#9ca3af;margin-top:2px">ซื้อไปแล้ว ${gemsBought}/5 ครั้ง</div>
        </div>
        <button onclick="buyTokensWithGems()" ${gemsBought >= 5 ? 'disabled' : ''} style="background:${gemsBought >= 5 ? '#374151' : 'linear-gradient(135deg,#0284c7,#2563eb)'};color:white;border:none;padding:8px 12px;border-radius:8px;font-weight:900;font-size:0.8rem;cursor:${gemsBought >= 5 ? 'not-allowed' : 'pointer'}">
          20 💎
        </button>
      </div>

      <!-- Bundle -->
      <div style="background:linear-gradient(135deg,#310000,#000000);border:2px solid #ef4444;border-radius:12px;padding:12px;margin-bottom:16px;display:flex;align-items:center;gap:12px;box-shadow:0 0 15px rgba(239,68,68,0.2)">
        <img src="${REZERO_CARDS['Black Serpent'].art}" style="width:48px;height:58px;border-radius:6px;border:1px solid #f87171;object-fit:cover">
        <div style="flex:1">
          <div style="font-weight:900;color:#fca5a5;font-size:0.85rem">🐍 Black Serpent Bundle</div>
          <div style="font-size:0.6rem;color:#f87171">รับการ์ด Black Serpent + กรอบ Return by Death <span style="color:#c084fc;font-weight:bold;"><br>+ ${RZ_TOKEN_IMG} 35 Premium Tokens</span></div>
          <div style="font-size:0.55rem;color:#9ca3af;margin-top:2px">ซื้อได้ครั้งเดียวเท่านั้น!</div>
        </div>
        <button onclick="buyRezeroBundle()" ${bundleBought ? 'disabled' : ''} style="background:${bundleBought ? '#374151' : 'linear-gradient(135deg,#dc2626,#991b1b)'};color:white;border:none;padding:8px 12px;border-radius:8px;font-weight:900;font-size:0.8rem;cursor:${bundleBought ? 'not-allowed' : 'pointer'}">
          ${bundleBought ? '✅ มีแล้ว' : '80 💎'}
        </button>
      </div>

      <!-- Items -->
      <div style="display:flex;flex-direction:column;gap:8px;margin-bottom:16px">${itemRows}</div>
      
      <button onclick="renderUnifiedArtstyleShop()" style="width:100%;background:linear-gradient(135deg,#1e1b4b,#2e1065);color:#c084fc;border:1px solid #a855f7;padding:10px;border-radius:10px;font-weight:bold;margin-bottom:12px;cursor:pointer">🎨 ดู Artstyle Shop ทั้งหมด</button>

      <button onclick="document.getElementById('_rezero-shop-overlay').remove()" style="width:100%;background:#374151;color:#9ca3af;border:none;padding:12px;border-radius:10px;font-weight:bold;cursor:pointer">✕ ปิด</button>
    </div>`;
}

// ─── UNIFIED ARTSTYLE SHOP ───
// แก้ระบบ Artstyle Shop ให้รองรับ 3 สกุลเงิน (Gems, Rod, Re:Zero Token) ได้อย่างสมบูรณ์
window.renderUnifiedArtstyleShop = function() {
    const allStyles = Object.assign(
        {},
        (typeof ARTSTYLE_CFG !== 'undefined' ? ARTSTYLE_CFG : {})
    );
    const unlocked = playerData.unlockedArtstyles || [];
    const equipped = playerData.equippedArtstyles || {};

    const rows = Object.values(allStyles).map(cfg => {
        const isUnlocked = unlocked.includes(cfg.id);
        const isEquipped = equipped[cfg.targetCard] === cfg.id;
        
        let canBuy = false;
        let costHtml = '';
        
        if (cfg.currency === 'rod') {
            canBuy = (playerData.rodTokens || 0) >= (cfg.shopCost || 5);
            costHtml = `🎣 ${cfg.shopCost || 5} Rod`;
        } else if (cfg.currency === 'rz_normal') {
            canBuy = (playerData.rzNormalTokens || 0) >= (cfg.shopCost || 5);
            costHtml = `${RZ_NORMAL_TOKEN_IMG} ${cfg.shopCost || 5}`;
        } else if (cfg.currency === 'rezero') {
            canBuy = (playerData.rezeroTokens || 0) >= (cfg.shopCost || 5);
            costHtml = `${RZ_TOKEN_IMG} ${cfg.shopCost || 5}`;
        } else {
            canBuy = getTotalGems() >= (cfg.shopCost || 5);
            costHtml = `💎 ${cfg.shopCost || 5}`;
        }

        const borderClr = isEquipped ? '#fbbf24' : isUnlocked ? '#34d399' : '#374151';
        return `<div style="background:#0f172a;border:1.5px solid ${borderClr};
             border-radius:12px;padding:10px;display:flex;align-items:center;gap:10px;margin-bottom:7px;">
          ${cfg.art
            ? `<img src="${cfg.art}" style="width:52px;height:62px;object-fit:cover;border-radius:8px;border:1px solid #374151">`
            : `<div style="width:52px;height:62px;background:#1f2937;border-radius:8px;display:flex;align-items:center;justify-content:center;font-size:1.4rem">${cfg.emoji||'🎨'}</div>`}
          <div style="flex:1;min-width:0">
            <div style="font-size:0.56rem;color:#6b7280;letter-spacing:0.4px">🎯 ${cfg.targetCard}</div>
            <div style="font-weight:900;color:white;font-size:0.82rem;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${cfg.emoji||''} ${cfg.label}</div>
            <div style="font-size:0.6rem;margin-top:2px;color:${isEquipped?'#fbbf24':isUnlocked?'#4ade80':'#6b7280'}">
              ${isEquipped ? '✅ ใส่อยู่' : isUnlocked ? '🔓 ปลดล็อคแล้ว' : costHtml}
            </div>
          </div>
          <div style="display:flex;flex-direction:column;gap:4px;flex-shrink:0">
            ${isUnlocked
              ? (isEquipped
                ? `<button onclick="unequipArtstyle('${cfg.id}');renderUnifiedArtstyleShop()" style="background:#374151;color:#9ca3af;border:none;padding:7px 10px;border-radius:8px;font-size:0.7rem;font-weight:700;cursor:pointer;min-width:56px">✕ ถอด</button>`
                : `<button onclick="equipArtstyle('${cfg.id}');renderUnifiedArtstyleShop()" style="background:linear-gradient(135deg,#d97706,#92400e);color:white;border:none;padding:7px 10px;border-radius:8px;font-size:0.7rem;font-weight:700;cursor:pointer;min-width:56px">🎨 ใส่</button>`)
              : `<button onclick="buyUnifiedArtstyle('${cfg.id}')" ${canBuy?'':'disabled'}
                  style="background:${canBuy?'linear-gradient(135deg,#6d28d9,#a855f7)':'#374151'};color:${canBuy?'white':'#6b7280'};border:none;padding:7px 10px;border-radius:8px;font-size:0.7rem;font-weight:700;cursor:${canBuy?'pointer':'not-allowed'};min-width:56px">
                  ซื้อ
                </button>`
            }
          </div>
        </div>`;
    }).join('');

    let ov = document.getElementById('_artstyle-overlay');
    if (!ov) {
        ov = document.createElement('div');
        ov.id = '_artstyle-overlay';
        ov.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,0.92);z-index:3500;display:flex;align-items:center;justify-content:center;padding:12px;overflow-y:auto';
        ov.onclick = e => { if (e.target===ov) ov.remove(); };
        document.body.appendChild(ov);
    }
    
    // Replaces the old renderArtstyleShopOverlay from other files globally so any click opens this updated one
    window.renderArtstyleShopOverlay = window.renderUnifiedArtstyleShop;

    ov.innerHTML = `
    <div style="background:linear-gradient(135deg,#0a0f1e,#0a180f);border:2.5px solid #fbbf24;
         border-radius:24px;padding:22px 16px;max-width:440px;width:100%;
         max-height:90vh;overflow-y:auto;box-shadow:0 0 50px rgba(251,191,36,0.2)">
      <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:14px">
        <div>
          <div style="font-size:1.2rem;font-weight:900;color:#fbbf24">🎨 Artstyle Shop</div>
          <div style="font-size:0.62rem;color:#9ca3af">ปลดล็อคถาวร ไม่หมดอายุ</div>
        </div>
        <div style="display:flex;gap:6px">
          <div style="background:#1f2937;border:1px solid #38bdf8;border-radius:10px;padding:5px 8px;text-align:center">
            <div style="font-size:0.5rem;color:#9ca3af">Normal</div>
            <div style="font-size:0.8rem;font-weight:900;color:#38bdf8">${RZ_NORMAL_TOKEN_IMG} ${playerData.rzNormalTokens || 0}</div>
          </div>
          <div style="background:#1f2937;border:1px solid #fcd34d;border-radius:10px;padding:5px 8px;text-align:center">
            <div style="font-size:0.5rem;color:#9ca3af">Rod</div>
            <div style="font-size:0.8rem;font-weight:900;color:#fcd34d">🎣 ${playerData.rodTokens || 0}</div>
          </div>
          <div style="background:#1f2937;border:1px solid #a78bfa;border-radius:10px;padding:5px 8px;text-align:center">
            <div style="font-size:0.5rem;color:#9ca3af">Gems</div>
            <div style="font-size:0.8rem;font-weight:900;color:#a78bfa">💎 ${getTotalGems()}</div>
          </div>
        </div>
      </div>
      <div>${rows}</div>
      <button onclick="document.getElementById('_artstyle-overlay').remove()"
        style="width:100%;margin-top:14px;background:#374151;color:#9ca3af;border:none;
               padding:11px;border-radius:12px;font-weight:700;font-size:0.9rem;cursor:pointer">✕ ปิด</button>
    </div>`;
}

window.buyUnifiedArtstyle = function(id) {
    const cfg = ARTSTYLE_CFG[id];
    if (!cfg) return;
    if (!playerData.unlockedArtstyles) playerData.unlockedArtstyles = [];
    if (playerData.unlockedArtstyles.includes(id)) return;

    if (cfg.currency === 'rod') {
        if ((playerData.rodTokens || 0) < cfg.shopCost) { showToast('🎣 Rod Token ไม่พอ!', '#f87171'); return; }
        playerData.rodTokens -= cfg.shopCost;
    } else if (cfg.currency === 'rz_normal') {
        if ((playerData.rzNormalTokens || 0) < cfg.shopCost) { showToast('🔮 Normal Token ไม่พอ!', '#f87171'); return; }
        playerData.rzNormalTokens -= cfg.shopCost;
    } else if (cfg.currency === 'rezero') {
        if ((playerData.rezeroTokens || 0) < cfg.shopCost) { showToast('🔮 Premium Token ไม่พอ!', '#f87171'); return; }
        playerData.rezeroTokens -= cfg.shopCost;
    } else {
        if (getTotalGems() < (cfg.shopCost || 5)) { showToast('💎 Gems ไม่พอ!', '#f87171'); return; }
        spendGems(cfg.shopCost || 5);
    }

    playerData.unlockedArtstyles.push(id);
    if (typeof _applyArtstyle === 'function' && (playerData.equippedArtstyles || {})[cfg.targetCard] === id) _applyArtstyle(id);
    saveData(); updateHubUI(); renderUnifiedArtstyleShop();
    showToast(`🎨 ปลดล็อค "${cfg.label}"!`, '#4ade80');
};

window.buyTokensWithGems = function() {
    if ((playerData.rezeroGemsBought || 0) >= 5) return;
    if (getTotalGems() < 20) { showToast('💎 Gems ไม่พอ!', '#f87171'); return; }
    
    spendGems(20);
    playerData.rezeroGemsBought = (playerData.rezeroGemsBought || 0) + 1;
    const amount = Math.floor(Math.random() * 20) + 1;
    playerData.rezeroTokens = (playerData.rezeroTokens || 0) + amount;
    
    saveData(); updateHubUI(); renderRezeroShop();
    const cnt = document.getElementById('_rz-token-cnt');
    if (cnt) cnt.textContent = playerData.rezeroTokens;
    showToast(`🔮 ได้รับ ${amount} Premium Tokens!`, '#c084fc');
};

window.buyRezeroBundle = function() {
    if (playerData.rezeroBundleBought) return;
    if (getTotalGems() < 80) { showToast('💎 Gems ไม่พอ!', '#f87171'); return; }
    
    spendGems(80);
    playerData.rezeroBundleBought = true;
    playerData.collection['Black Serpent|isekai_adventure'] = (playerData.collection['Black Serpent|isekai_adventure'] || 0) + 1;
    if (!playerData.unlockedCosmetics) playerData.unlockedCosmetics = [];
    if (!playerData.unlockedCosmetics.includes('fr_rbd')) playerData.unlockedCosmetics.push('fr_rbd');
    
    // --- เพิ่ม 35 Premium Token ---
    playerData.rezeroTokens = (playerData.rezeroTokens || 0) + 35;
    
    saveData(); updateHubUI(); renderRezeroShop();
    
    // อัปเดตตัวเลขหน้า UI (ถ้าหน้าต่างยังเปิดอยู่)
    const cnt = document.getElementById('_rz-token-cnt');
    if (cnt) cnt.textContent = playerData.rezeroTokens;

    showToast(`🐍 ได้รับ Black Serpent, กรอบรูป & 35 Tokens!`, '#4ade80');
};

window.buyRezeroItem = function(id, type, cost) {
    if ((playerData.rezeroTokens || 0) < cost) { showToast('🔮 Token ไม่พอ!', '#f87171'); return; }
    playerData.rezeroTokens -= cost;
    
    if (type === 'card') {
        playerData.collection[`${id}|isekai_adventure`] = (playerData.collection[`${id}|isekai_adventure`] || 0) + 1;
        showToast(`🃏 ได้รับการ์ด ${id}!`, '#4ade80');
    } else {
        if (!playerData.unlockedCosmetics) playerData.unlockedCosmetics = [];
        if (!playerData.unlockedCosmetics.includes(id)) playerData.unlockedCosmetics.push(id);
        showToast(`🖼️ ปลดล็อค Banner แล้ว!`, '#4ade80');
    }
    saveData(); updateHubUI(); renderRezeroShop();
    const cnt = document.getElementById('_rz-token-cnt');
    if (cnt) cnt.textContent = playerData.rezeroTokens;
};

// ─── GAME MECHANICS HOOKS ───
function _hookRezeroMechanics() {
    
    // 1. getCharStats (Reid Astrea Item Buff)
    if (typeof window.getCharStats === 'function') {
        const _origStats = window.getCharStats;
        window.getCharStats = function(char) {
            let stats = _origStats.apply(this, arguments);
            const effName = (char.name.startsWith('Shadow Token') || char.name.startsWith('Shadow army') || char.name.includes('Loki Clone')) ? char.originalName : char.name;
            
            if (effName === 'Reid Astrea' && !char.silenced && char.items && char.items.length >= 2) {
                stats.atk += 3;
            }
            return stats;
        };
    }

    // 2. Volcanica Immunity Wrapper
    function protectVolcanica(actionFn, contextArgs) {
        if (typeof state === 'undefined') return actionFn.apply(this, contextArgs);
        
        const volcanicas = [];
        ['player', 'ai'].forEach(pk => {
            state.players[pk].field.forEach(c => {
                const effName = (c.name.startsWith('Shadow Token') || c.name.startsWith('Shadow army') || c.name.includes('Loki Clone')) ? c.originalName : c.name;
                if (effName === 'Volcanica the Protecter Dragon' && !c.silenced && getCharStats(c).hp > 0) {
                    volcanicas.push({ card: c, hp: c.hp, maxHp: c.maxHp });
                }
            });
        });

        const result = actionFn.apply(this, contextArgs);

        volcanicas.forEach(v => {
            if (v.card.hp < v.hp && v.card.hp > -99) {
                v.card.hp = v.hp;
                if (typeof log === 'function') log(`🐉[Volcanica] พลังเวทไม่ระคายผิวข้า! (Immune)`, 'text-sky-300 font-bold');
            } else if (v.card.hp === -99) { 
                v.card.hp = v.hp;
                if (typeof log === 'function') log(`🐉[Volcanica] ไม่มีความตายจากเวทมนตร์สำหรับข้า! (Immune Instakill)`, 'text-sky-400 font-bold');
            }
        });

        return result;
    }

    if (typeof window.executeNonTargetAction === 'function') {
        const _origExec = window.executeNonTargetAction;
        window.executeNonTargetAction = function() { return protectVolcanica(_origExec, arguments); };
    }
    if (typeof window.triggerOnSummon === 'function') {
        const _origSummon = window.triggerOnSummon;
        window.triggerOnSummon = function() { return protectVolcanica(_origSummon, arguments); };
    }
    if (typeof window.checkDeath === 'function') {
        const _origDeathCheck = window.checkDeath;
        window.checkDeath = function(playerKey) {
            return protectVolcanica(_origDeathCheck, arguments);
        };
    }

    // 3. initiateAttack (Reid x3, Volcanica Redirect, Roswaal Splash, Black Serpent Status)
    if (typeof window.initiateAttack === 'function') {
        const _origAttack = window.initiateAttack;
        window.initiateAttack = function(attackerId, targetId, targetIsBase) {
            if (typeof state === 'undefined' || targetIsBase) return _origAttack.apply(this, arguments);

            const atkKey = state.currentTurn;
            const defKey = atkKey === 'player' ? 'ai' : 'player';
            const attacker = state.players[atkKey].field.find(c => c.id === attackerId);
            const target = state.players[defKey].field.find(c => c.id === targetId);

            if (!attacker || !target) return _origAttack.apply(this, arguments);

            const aName = (attacker.name.startsWith('Shadow Token') || attacker.name.startsWith('Shadow army') || attacker.name.includes('Loki Clone')) ? attacker.originalName : attacker.name;

            // Reid Astrea x3 Chance
            if (aName === 'Reid Astrea' && typeof getCharStats !== 'undefined' && getCharStats(target).hp > 6 && Math.random() < 0.5 && !attacker.silenced) {
                attacker.atk *= 3;
                attacker._reidBoosted = true;
                if (typeof log === 'function') log(`⚔️[Reid Astrea] วิถีดาบทะลวงสวรรค์! x3 DMG!`, 'text-red-400 font-bold');
            }

            const volcanica = state.players[defKey].field.find(c => {
                const n = (c.name.startsWith('Shadow Token') || c.name.startsWith('Shadow army') || c.name.includes('Loki Clone')) ? c.originalName : c.name;
                return n === 'Volcanica the Protecter Dragon' && c.hp > 0 && !c.silenced && c.id !== target.id;
            });

            const targetStartHp = target.hp;
            let snapshot = [];
            let totalRawDamage = 0;

            // [FIX] ถ่ายรูป Snapshot สถานะเพื่อนทุกคนไว้ และยัดเกราะชั่วคราว 10,000 เพื่อไม่ให้ตาย
            if (volcanica) {
                state.players[defKey].field.forEach(c => {
                    if (c.id !== volcanica.id) {
                        snapshot.push({ id: c.id, hp: c.hp, maxHp: c.maxHp });
                        c.hp += 10000;
                    }
                });
            }

            try {
                // โจมตีตามระบบปกติ
                _origAttack.apply(this, arguments);
            } finally {
                // คืนค่าพลังโจมตี Reid
                if (attacker._reidBoosted) {
                    attacker.atk = Math.round(attacker.atk / 3);
                    attacker._reidBoosted = false;
                }

                // [FIX] กู้คืนเลือดเพื่อนทั้งหมด และให้ Volcanica รับดาเมจแทน
                if (volcanica) {
                    snapshot.forEach(snap => {
                        let card = null;
                        // ตามหาการ์ดไม่ว่าจะถูกย้ายไปโซนไหน (สุสาน, มือ, ฯลฯ)
                        ['field', 'graveyard', 'hand', 'spaceZone'].forEach(zone => {
                            const found = state.players[defKey][zone].find(c => c.id === snap.id);
                            if (found) card = found;
                        });

                        if (card) {
                            const expectedAfterHit = snap.hp + 10000;

                            // ถ้าโดนดาเมจปกติ
                            if (card.hp < expectedAfterHit && card.hp > -99) {
                                totalRawDamage += (expectedAfterHit - card.hp);
                                card.hp = snap.hp; // คืนเลือดเดิม (ไม่ได้รับดาเมจ)
                            }
                            // ถ้าโดน Instant Kill (เช่น Mike Tyson)
                            else if (card.hp <= -99) {
                                totalRawDamage += snap.maxHp;
                                card.hp = snap.hp; // ฟื้นคืนชีพด้วยเลือดเดิม

                                // ถ้าโดนเตะลงสุสานไปแล้ว ให้ดึงกลับขึ้นมาที่ Field
                                if (!state.players[defKey].field.find(c => c.id === card.id)) {
                                    ['graveyard', 'hand', 'spaceZone'].forEach(zone => {
                                        const idx = state.players[defKey][zone].findIndex(c => c.id === card.id);
                                        if (idx !== -1) {
                                            state.players[defKey][zone].splice(idx, 1);
                                            state.players[defKey].field.push(card);
                                        }
                                    });
                                }
                            }
                            // ถ้าเลือดเพิ่ม (เช่น ฮีล)
                            else if (card.hp > expectedAfterHit) {
                                card.hp = snap.hp + (card.hp - expectedAfterHit);
                            }
                            // ถ้าไม่ได้โดนอะไรเลย
                            else {
                                card.hp = snap.hp;
                            }
                        }
                    });

                    // Volcanica รับดาเมจ 20%
                    if (totalRawDamage > 0) {
                        const redirected = Math.max(1, Math.floor(totalRawDamage * 0.2));
                        volcanica.hp -= redirected;
                        if (typeof log === 'function') log(`🐉 [Volcanica] ปีกมังกรป้องภัย! รับดาเมจ ${redirected} แทนเพื่อน`, 'text-sky-300 font-bold');
                        if (volcanica.hp <= 0 && typeof checkDeath === 'function') checkDeath(defKey);
                    }
                    if (typeof updateUI === 'function') updateUI();
                }

                // ความสามารถตัวอื่นๆ (Roswaal, Black Serpent)
                let didDamage = false;
                if (volcanica && totalRawDamage > 0) didDamage = true;
                else if (!volcanica && targetStartHp - target.hp > 0) didDamage = true;

                if (didDamage) {
                    if (aName === 'Roswaal L. Mathers' && !attacker.silenced) {
                        if (state.players[atkKey].field.length >= 5) {
                            if (typeof log === 'function') log(`🔥[Roswaal] มนตราเพลิงผลาญหมู่! Splash 5 DMG ศัตรูทุกตัว!`, 'text-purple-500 font-bold');
                            state.players[defKey].field.forEach(c => c.hp -= 5);
                            if (typeof checkDeath === 'function') checkDeath(defKey);
                        }
                    }
                    if (aName === 'Black Serpent' && !attacker.silenced) {
                        let currentTarget = null;
                        ['field', 'graveyard', 'hand', 'spaceZone'].forEach(zone => {
                            const found = state.players[defKey][zone].find(c => c.id === target.id);
                            if (found) currentTarget = found;
                        });

                        if (currentTarget && currentTarget.hp > 0) {
                            if (!currentTarget.status.includes('Bleed')) currentTarget.status.push('Bleed');
                            if (!currentTarget.status.includes('Burn')) currentTarget.status.push('Burn');
                            if (!currentTarget.status.includes('Poison')) currentTarget.status.push('Poison');
                            currentTarget.shalltearBleedTurns = 1;
                            currentTarget.burnTurns = 1;
                            if (typeof log === 'function') log(`🐍[Black Serpent] พิษร้าย 3 สาย! (Bleed/Burn/Poison) 1 เทิร์น!`, 'text-green-500 font-bold');
                        }
                    }
                }
            }
        };
    }

    // 4. checkDeath (Aldebaran, Roswaal, Black Serpent, Reid)
    if (typeof window.checkDeath === 'function') {
        const _origDeath = window.checkDeath;
        window.checkDeath = function(playerKey) {
            const p = state.players[playerKey];
            const oppKey = playerKey === 'player' ? 'ai' : 'player';

            const aldebaran = p.field.find(c => {
                const n = (c.name.startsWith('Shadow Token') || c.name.startsWith('Shadow army') || c.name.includes('Loki Clone')) ? c.originalName : c.name;
                return n === 'Aldebaran' && c.hp > 0 && !c.silenced;
            });

            for (let i = p.field.length - 1; i >= 0; i--) {
                let c = p.field[i];
                if (getCharStats(c).hp <= 0 && !c.isDyingProcessing) {
                    const effName = (c.name.startsWith('Shadow Token') || c.name.startsWith('Shadow army') || c.name.includes('Loki Clone')) ? c.originalName : c.name;
                    
                    // [FIX] Regulus Corneas อมตะที่แท้จริง
                    if (effName === 'Regulus Corneas') {
                        const hasMark = p.field.some(x => x._regulusMarked && getCharStats(x).hp > 0);
                        if (hasMark) {
                            c.hp = c.maxHp;
                            c.isDyingProcessing = false;
                            c.status = c.status.filter(s => s !== 'Poison' && s !== 'Bleed' && s !== 'Burn');
                            if (typeof log === 'function') log(`⌚ [Regulus] ข้าคือตัวตนที่สมบูรณ์แบบ... การตายไม่มีผลกับข้า!`, 'text-zinc-300 font-bold');
                            continue;
                        }
                    }

                    if (effName === 'Black Serpent' && !c._blackSerpentRevived) {
                        c.hp = 2;
                        c.maxHp = 2;
                        c.atk = 3;
                        c._blackSerpentRevived = true;
                        c.status = [];
                        if (typeof log === 'function') log(`🐍[Black Serpent] คืนชีพจากเงามืด! (3/2)`, 'text-gray-400 font-bold');
                        continue;
                    }

                    if (aldebaran && aldebaran.id !== c.id && !aldebaran._aldebaranUsedThisTurn) {
                        aldebaran._aldebaranUsedThisTurn = true;
                        c.hp = c.maxHp;
                        c.status = [];
                        c.isDyingProcessing = false; 
                        if (typeof log === 'function') log(`🌟[Aldebaran] Al-Dona! ย้อนเวลาความตายให้ ${c.name}!`, 'text-orange-400 font-bold');
                        continue; 
                    }

                    if (effName === 'Aldebaran') {
                        c.costReducer = c.cost - 4; 
                        c.hp = c.maxHp;
                        c.status = [];
                        c.attacksLeft = 0;
                        p.hand.push(c);
                        p.field.splice(i, 1);
                        if (typeof log === 'function') log(`🌟 [Aldebaran] ตายและกลับขึ้นมือ! Cost เหลือ 4`, 'text-orange-500 font-bold');
                        continue;
                    }

                    if (effName === 'Reid Astrea') {
                        if (typeof log === 'function') log(`⚔️ [Reid Astrea] "ถึงตาข้าพักบ้าง... รับนี่ไปซะ!" ดาเมจ 2 ใส่ศัตรูทั้งหมด`, 'text-red-500 font-bold');
                        state.players[oppKey].field.forEach(ec => { ec.hp -= 2; });
                    }

                    if (effName === 'Roswaal L. Mathers') {
                        if (state.players[oppKey].hand.length > 0) {
                            const idx = Math.floor(Math.random() * state.players[oppKey].hand.length);
                            const discarded = state.players[oppKey].hand.splice(idx, 1)[0];
                            state.players[oppKey].graveyard.push(discarded);
                            if (typeof log === 'function') log(`🃏[Roswaal] พังทลายคาถา... ทิ้งการ์ด ${discarded.name} ของศัตรู!`, 'text-purple-400 font-bold');
                        }
                    }
                }
            }
            _origDeath.apply(this, arguments);
        };
    }

    // 5. Reset Aldebaran uses at end of phase
    if (typeof window.resolveEndPhase === 'function') {
        const _origEnd = window.resolveEndPhase;
        window.resolveEndPhase = function(playerKey) {
            _origEnd.apply(this, arguments);
            state.players[playerKey].field.forEach(c => {
                if (c._aldebaranUsedThisTurn !== undefined) c._aldebaranUsedThisTurn = false;
            });
        };
    }

    // 6. On Summon Abilities (Roswaal, Black Serpent)
    if (typeof window.triggerOnSummon === 'function') {
        const _origSummon = window.triggerOnSummon;
        window.triggerOnSummon = function(card, playerKey) {
            _origSummon.apply(this, arguments);
            const effName = card.originalName || card.name;
            
            if (effName === 'Roswaal L. Mathers' && !card.silenced) {
                const actions = state.players[playerKey].graveyard.filter(c => c.type === 'Action');
                if (actions.length > 0) {
                    const idx = Math.floor(Math.random() * actions.length);
                    const realIdx = state.players[playerKey].graveyard.findIndex(c => c.id === actions[idx].id);
                    const pulled = state.players[playerKey].graveyard.splice(realIdx, 1)[0];
                    state.players[playerKey].hand.push(pulled);
                    if (typeof log === 'function') log(`🃏 [Roswaal] ดึง Action "${pulled.name}" จากสุสานขึ้นมือ!`, 'text-purple-300 font-bold');
                }
            }

            if (effName === 'Black Serpent' && !card.silenced) {
                const oppKey = playerKey === 'player' ? 'ai' : 'player';
                if (typeof log === 'function') log(`🐍[Black Serpent] ละอองพิษแห่งงูดำ! ศัตรูทั้งหมดติด Poison 2 เทิร์น!`, 'text-green-500 font-bold');
                state.players[oppKey].field.forEach(c => {
                    if (!c.tossakanImmune && !hasNatureImmune(oppKey)) {
                        if (!c.status.includes('Poison')) c.status.push('Poison');
                    }
                });
            }
        };
    }
}

// ============================================================
// 28_rezero_ltd_pack.js — Re:Zero Limited Pack (Witch Cult & Camps)
// จำกัดเวลา 5 วัน | เปิดได้ทีละ 1 ใบ | มีระบบ Animation Quotes
// ============================================================

const RZL_PACK_EXPIRY = new Date(Date.now() + (5 * 24 * 60 * 60 * 1000));
const RZL_PULL_COST = 1500;
const RZL_MAX_PULLS = 10; // จำกัดการดึงสูงสุด 10 ครั้ง
const RZL_THEME = 'isekai_adventure';

// ─── CARD DATA ──────────────────────────────────────────────
const _RZL_CARDS = {
    'Beatrice': {
        name: 'Beatrice', type: 'Character', cost: 6, atk: 2, hp: 6, maxHp: 6,
        text: 'On reveal / On death: สร้างเวท "Contract" 2 ใบขึ้นมือ',
        color: 'bg-pink-800', maxAttacks: 1, shopOnly: true, isRzl: true,
        art: 'https://i.pinimg.com/736x/73/c7/18/73c7188737ff429a89826bbfbb0dc637.jpg'
    },
    'Sirius': {
        name: 'Sirius', type: 'Character', cost: 7, atk: 5, hp: 6, maxHp: 6,
        text: 'Ongoing: ลดดาเมจรับ 30% | On attack: เป้าหมายติด Paralyze 2 เทิร์น (หากเป้าหมายติด Paralyze อยู่แล้ว ทำดาเมจเพิ่ม +2)',
        color: 'bg-red-900', maxAttacks: 1, shopOnly: true, isRzl: true,
        art: 'https://i.pinimg.com/736x/ae/23/b0/ae23b026a8b9231b230baf0185325448.jpg'
    },
    'Echidna': {
        name: 'Echidna', type: 'Character', cost: 8, atk: 3, hp: 5, maxHp: 5,
        text: 'Ongoing: เมื่อคุณจั่วการ์ด +2 ATK / +2 HP (ทับซ้อนได้) | End Turn: ถ้ามี Character ในสนามเรา ≥2 ตัว (นับตัวนี้ด้วย) จั่วการ์ด 2 ใบ',
        color: 'bg-slate-900', maxAttacks: 1, shopOnly: true, isRzl: true,
        art: 'https://i.pinimg.com/736x/2f/4d/94/2f4d943524fee3ba120775ef2f3c77ff.jpg'
    },
    'Garfiel Tinsel': {
        name: 'Garfiel Tinsel', type: 'Character', cost: 5, atk: 4, hp: 4, maxHp: 4,
        text: 'On Summon: ได้รับเวท "Beastification" ในมือ | On death: ทำดาเมจ 1 ใส่ Base ศัตรู',
        color: 'bg-amber-700', maxAttacks: 1, shopOnly: true, isRzl: true,
        art: 'https://file.garden/aeeLCXSsJxTPrRbp/c1b5646f55fa2bd35a7e44d71acbe254.jpg'
    },
    'Pandora': {
        name: 'Pandora', type: 'Character', cost: 10, atk: 5, hp: 8, maxHp: 8,
        text: 'On Reveal: สุ่มศัตรูติด Paralyze 2 เทิร์น | On Attack: Base เรา -1 HP แต่ถ้าฆ่าสำเร็จ Base เรา +2 HP | On Death: ชุบชีวิตเต็ม 1 ครั้ง และร่าย On Reveal อีกครั้ง',
        color: 'bg-stone-300 text-black', maxAttacks: 1, shopOnly: true, isRzl: true,
        art: 'https://file.garden/aeeLCXSsJxTPrRbp/11a28ae8bc6b2df3cbb14814a6b5cac6.jpg'
    },
    'Regulus Corneas': {
        name: 'Regulus Corneas', type: 'Character', cost: 9, atk: 4, hp: 5, maxHp: 5,
        text: 'Summon / End Turn: ซ่อน Mark ไว้บนเพื่อนสุ่ม 1 ตัว (ศัตรูไม่เห็น) | Passive: ตราบใดที่มีตัวติด Mark มีชีวิตอยู่บนสนาม Regulus จะเป็นอมตะ (ดาเมจ = 0)',
        color: 'bg-zinc-100 text-black', maxAttacks: 1, shopOnly: true, isRzl: true,
        art: 'https://file.garden/aeeLCXSsJxTPrRbp/66fb74aebbe3356c5d286f5ca157856d.jpg'
    },
    'Petelgeuse Romanée-Conti': {
        name: 'Petelgeuse Romanée-Conti', type: 'Character', cost: 8, atk: 5, hp: 3, maxHp: 3,
        text: 'Summon: ร่าย "The Unseen Hand" (เรียกมือ 1/1 Taunt x2) | มือตาย: +1/+1 ให้เขา | ตาย: ถ้ามีศัตรูที่ Stat รวมน้อยกว่า ฆ่าศัตรูนั้น ดูด Stat มาเกิดใหม่ และร่าย Summon ซ้ำ',
        color: 'bg-lime-900', maxAttacks: 1, shopOnly: true, isRzl: true,
        art: 'https://file.garden/aeeLCXSsJxTPrRbp/ad7fab8c82685a6fd74d4a500e3879d2.jpg'
    },
    'Otto Suwen': {
        name: 'Otto Suwen', type: 'Character', cost: 4, atk: 2, hp: 3, maxHp: 3,
        text: 'On Summon: อัญเชิญ Character จากธีม Animal Kingdom 1 ตัวจากสำรับลงสนาม',
        color: 'bg-emerald-800', maxAttacks: 1, shopOnly: true, isRzl: true,
        art: 'https://file.garden/aeeLCXSsJxTPrRbp/23f463ab3d5f6947eb8a7f9dd5dd2c68.jpg'
    },
    'Cecilus Segmunt': {
        name: 'Cecilus Segmunt', type: 'Character', cost: 9, atk: 4, hp: 8, maxHp: 8,
        text: 'Summon: มอบดาบ Murasame และ Masayume ขึ้นมือ | Cost ของดาบจะลดลงตาม HP Base ของคุณที่หายไป (ใส่ได้แค่ Cecilus เท่านั้น)',
        color: 'bg-blue-800', maxAttacks: 1, shopOnly: true, isRzl: true,
        art: 'https://file.garden/aeeLCXSsJxTPrRbp/b8716bb23421d77b388b401b0b8a7c7e.jpg'
    },
    'Satella': {
        name: 'Satella', type: 'Champion', cost: 12, atk: 12, hp: 12, maxHp: 12,
        text: '♛ Champion | Summon: Paralyze ศัตรูทั้งหมด 1 เทิร์น | Death: จะไม่ตายแต่ลอยตัว (Levitate) และอมตะ 1 เทิร์น จากนั้นฟื้นคืนชีพเต็มและร่าย Summon อีกครั้ง',
        color: 'bg-purple-950', maxAttacks: 1, isChampion: true, shopOnly: true, isRzl: true,
        art: 'https://file.garden/aeeLCXSsJxTPrRbp/3b90ce1ced967cafc3add6c85f8cb997.jpg'
    }
};

const _RZL_SPELLS = {
    'Contract': {
        name: 'Contract', type: 'Spell', cost: 2,
        text: 'เลือกเพื่อน 1 ตัว: +3 ATK (เฉพาะเทิร์นนี้) | หากตัวนั้นตายในเทิร์นนี้ Base เรา Heal +1 HP',
        color: 'bg-pink-600', requiresTarget: true, targetEnemy: false, _theme: RZL_THEME, shopOnly: true
    },
    'Beastification': {
        name: 'Beastification', type: 'Spell', cost: 5,
        text: 'Base เรา -1 HP จากนั้นบัฟ Garfiel Tinsel ในสนาม: +5 ATK, +5 HP และได้รับหลบหลีก 50% ถาวร',
        color: 'bg-amber-600', requiresTarget: false, _theme: RZL_THEME, shopOnly: true
    },
    'The Unseen Hand': {
        name: 'The Unseen Hand', type: 'Spell', cost: 3,
        text: 'อัญเชิญ Shadow Hand (1/1 Taunt) 2 ตัวลงสนาม',
        color: 'bg-stone-800', requiresTarget: false, _theme: RZL_THEME, shopOnly: true
    },
    'Shadow Hand': {
        name: 'Shadow Hand', type: 'Character', cost: 0, atk: 1, hp: 1, maxHp: 1,
        text: 'Taunt | เมื่อตาย: มอบ +1/+1 ให้ Petelgeuse', color: 'bg-stone-950', maxAttacks: 1, _theme: RZL_THEME
    },
    'Murasame': {
        name: 'Murasame', type: 'Item', cost: 15,
        text: 'ใส่ได้แค่ Cecilus: +5 ATK และทำให้โจมตีได้ 4 ครั้ง | Cost ลดตาม Base HP ที่หายไป',
        color: 'bg-blue-600', requiresTarget: true, _theme: RZL_THEME
    },
    'Masayume': {
        name: 'Masayume', type: 'Item', cost: 10,
        text: 'ใส่ได้แค่ Cecilus: หากโจมตีแล้วเป้าหมายไม่ตาย จะทำลายเป้าหมายทันที (จากนั้นดาบเล่มนี้พัง) | Cost ลดตาม Base HP ที่หายไป',
        color: 'bg-sky-600', requiresTarget: true, _theme: RZL_THEME
    }
};

// ─── QUOTES สำหรับ ANIMATION ────────────────────────────────────
const _RZL_QUOTES = {
    'Beatrice': "ต้องให้เบ็ตตี้จัดการให้อีกแล้วงั้นเหรอ... ช่วยไม่ได้นะ ก็นี่แหละคือหน้าที่ของฉัน คาชิระ",
    'Sirius': "อา... ความรัก ความรัก ความรัก! ทุกคนจงรับรู้ถึงความรักนี้สิคะ!",
    'Echidna': "ความอยากรู้อยากเห็นเป็นสิ่งที่ไม่สิ้นสุด... เธอเองก็อยากทำสัญญากับฉันใช่ไหมล่ะ?",
    'Garfiel Tinsel': "ข้าคือโล่แห่งดินแดนศักดิ์สิทธิ์! ใครกล้าเข้ามา ข้าจะขย้ำให้แหลก!",
    'Pandora': "ทุกสิ่งเป็นไปตามที่ควรจะเป็น... เพื่อความรักและสันติสุขของโลกนี้",
    'Regulus Corneas': "นี่มันเป็นการละเมิดสิทธิส่วนบุคคลของฉันนะ... แกกล้าดียังไงมาขัดจังหวะฉัน?",
    'Petelgeuse Romanée-Conti': "สมองสั่น... สมองมันสั่นไปหมดแล้ววว! คุณช่างเกียจคร้านจริงๆ เดสสส!",
    'Otto Suwen': "ทำไมฉันถึงซวยตลอดเลยล่ะเนี่ย... แต่ถึงอย่างนั้นก็ต้องช่วยให้ได้ล่ะนะ!",
    'Cecilus Segmunt': "ฉันคือ 'สายฟ้าสีคราม' ตัวละครหลักของเวทีนี้ยังไงล่ะ!",
    'Satella': "ฉันรักเธอ... รักเธอ... รักเธอ... ได้โปรด อย่าตายเลยนะ..."
};

const RZL_PULL_POOL = Object.keys(_RZL_CARDS);

// ─── INJECT DATA & UI ───────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
    // กำหนดค่าเริ่มต้นสำหรับกัน Bug
    if (typeof playerData !== 'undefined') {
        if (playerData.rzlPacksBought === undefined) playerData.rzlPacksBought = 0;
    }

    // 1. Inject Cards into Database
    if (typeof CardSets !== 'undefined') {
        if (!CardSets[RZL_THEME]) CardSets[RZL_THEME] = {};
        Object.entries(_RZL_CARDS).forEach(([k, v]) => {
            CardSets[RZL_THEME][k] = JSON.parse(JSON.stringify(v));
        });
        Object.entries(_RZL_SPELLS).forEach(([k, v]) => {
            CardSets[RZL_THEME][k] = JSON.parse(JSON.stringify(v));
        });
    }

    // 2. Patch UI - Append Pack
    if (typeof renderPacksPanel === 'function') {
        const _origRenderPacks = window.renderPacksPanel;
        window.renderPacksPanel = function() {
            _origRenderPacks.apply(this, arguments);
            _appendRezeroLimitedPackSection();
        };
    }

    // 3. Patch Mechanics
    _hookRezeroLtdMechanics();
});

// ─── RENDER PACK SHOP SECTION ───────────────────────────────
function _appendRezeroLimitedPackSection() {
    const panel = document.getElementById('hub-panel-packs');
    if (!panel) return;
    const old = document.getElementById('_rzl-pack-sec');
    if (old) old.remove();

    const available = new Date() < RZL_PACK_EXPIRY;
    const diff = RZL_PACK_EXPIRY - new Date();
    const d = Math.floor(diff / 86400000);
    const h = Math.floor((diff % 86400000) / 3600000);
    const countdown = diff <= 0 ? '⏰ หมดเขตแล้ว' : `⏳ เหลือ ${d} วัน ${h} ชม.`;

    const coins = typeof playerData !== 'undefined' ? (playerData.coins || 0) : 0;
    const pulled = typeof playerData !== 'undefined' ? (playerData.rzlPacksBought || 0) : 0;
    const canSingle = available && coins >= RZL_PULL_COST && pulled < RZL_MAX_PULLS;

    const sec = document.createElement('div');
    sec.id = '_rzl-pack-sec';
    sec.style.cssText = 'padding:0 0 24px';
    sec.innerHTML = `
    <!-- Divider -->
    <div style="display:flex;align-items:center;gap:10px;margin:16px 0 14px">
      <div style="flex:1;height:1px;background:linear-gradient(90deg,transparent,#8b5cf6)"></div>
      <div style="font-size:0.75rem;font-weight:900;color:#8b5cf6;letter-spacing:1px">📖 RE:ZERO LIMITED (SINGLE PULL)</div>
      <div style="flex:1;height:1px;background:linear-gradient(90deg,#8b5cf6,transparent)"></div>
    </div>

    <!-- Pack Card -->
    <div style="background:linear-gradient(135deg,#1e1b4b,#2e1065);
         border:2.5px solid ${available ? '#8b5cf6' : '#374151'};border-radius:20px;overflow:hidden;
         box-shadow:0 0 ${available ? '36px rgba(139,92,246,0.22)' : 'none'};margin-bottom:12px">

      <div style="position:relative;height:130px;overflow:hidden">
        <img src="https://i.pinimg.com/1200x/dd/88/f9/dd88f9ca170afb52e66093a6cf583b53.jpg"
             style="width:100%;height:100%;object-fit:cover;object-position:top;filter:brightness(${available ? '0.5' : '0.22'})">
        <div style="position:absolute;inset:0;background:linear-gradient(to bottom,transparent 20%,#1e1b4b)"></div>
        
        <div style="position:absolute;top:10px;left:12px;
             background:${available ? 'rgba(220,38,38,0.88)' : 'rgba(55,65,81,0.9)'};
             border:1.5px solid ${available ? '#fca5a5' : '#4b5563'};
             border-radius:20px;padding:3px 10px;font-size:0.64rem;font-weight:900;
             color:${available ? '#fca5a5' : '#9ca3af'}">
          ${available ? '⏱️ LIMITED · หมดในอีก 5 วัน' : '🔒 หมดเขตแล้ว'}
        </div>

        <!-- ป้ายแสดงจำนวนครั้งที่ดึง -->
        <div style="position:absolute;top:10px;right:12px;
             background:rgba(0,0,0,0.75);border:1.5px solid #a855f7;
             border-radius:20px;padding:3px 10px;font-size:0.64rem;font-weight:900;color:#d8b4fe">
          ${pulled}/${RZL_MAX_PULLS} ครั้ง
        </div>

        <div style="position:absolute;bottom:10px;left:14px">
          <div style="font-size:1.05rem;font-weight:900;color:white;text-shadow:0 2px 8px rgba(0,0,0,0.9)">
            📖 Re:Zero Limited Pull</div>
          <div style="font-size:0.66rem;color:${available ? '#c4b5fd' : '#6b7280'}">${countdown}</div>
        </div>
      </div>

      <div style="padding:14px">
        <div style="display:flex;gap:4px;overflow-x:auto;padding-bottom:10px;scrollbar-width:none;">
          ${RZL_PULL_POOL.map(n => {
              const t = _RZL_CARDS[n];
              return `<div style="background:#0f0f1a;border:1px solid #8b5cf644;border-radius:8px;overflow:hidden;min-width:60px;flex-shrink:0;">
                <img src="${t.art}" style="width:100%;height:45px;object-fit:cover">
                <div style="padding:2px;text-align:center;">
                  <div style="font-size:0.45rem;font-weight:800;color:#c4b5fd;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${n}</div>
                </div>
              </div>`;
          }).join('')}
        </div>
        <div style="background:rgba(139,92,246,0.1);border:1px solid #7c3aed;border-radius:10px;padding:6px 10px;margin-bottom:12px;font-size:0.63rem;color:#c4b5fd;text-align:center">
          ✨ เปิดได้ทีละใบเท่านั้น! · Equal Rate 10% ทุกใบ · ไม่มีการ์ดเหล่านี้ในแพ็คปกติ
        </div>
        <div style="display:flex;align-items:center;gap:12px">
          <div style="flex:1">
            <div style="font-size:1.05rem;font-weight:900;color:${available ? '#fbbf24' : '#6b7280'}">
              🪙 1,500 / ดึง 1 ใบ</div>
          </div>
          <button onclick="buyRezeroLtdSinglePack()"
            ${canSingle ? '' : 'disabled'}
            style="background:${canSingle ? 'linear-gradient(135deg,#7c3aed,#9333ea)' : '#374151'};
                   color:${canSingle ? 'white' : '#6b7280'};border:none;
                   padding:11px 24px;border-radius:12px;font-weight:900;font-size:0.9rem;
                   cursor:${canSingle ? 'pointer' : 'not-allowed'};white-space:nowrap;
                   box-shadow:${canSingle ? '0 0 14px rgba(139,92,246,0.4)' : 'none'}">
            ${!available ? '🔒 หมดเขต' : pulled >= RZL_MAX_PULLS ? '✅ ครบแล้ว' : coins < RZL_PULL_COST ? '🪙 ไม่พอ' : '🔮 สุ่มเลย!'}
          </button>
        </div>
      </div>
    </div>`;

    const inner = panel.querySelector('div[style*="max-width:700px"]') || panel;
    inner.appendChild(sec);
}

// ─── GACHA BUY & ANIMATION ───────────────────────────────────
window.buyRezeroLtdSinglePack = function() {
    if (new Date() >= RZL_PACK_EXPIRY) { showToast('⏰ Pack หมดเขตแล้ว!', '#f87171'); return; }
    if (playerData.coins < RZL_PULL_COST) { showToast(`🪙 เหรียญไม่พอ!`, '#f87171'); return; }

    const pulled = playerData.rzlPacksBought || 0;
    if (pulled >= RZL_MAX_PULLS) { showToast(`🔒 ซื้อครบ ${RZL_MAX_PULLS} ครั้งแล้ว!`, '#f87171'); return; }

    playerData.coins -= RZL_PULL_COST;
    playerData.rzlPacksBought = pulled + 1;

    const cardName = RZL_PULL_POOL[Math.floor(Math.random() * RZL_PULL_POOL.length)];
    const key = `${cardName}|${RZL_THEME}`;
    playerData.collection[key] = (playerData.collection[key] || 0) + 1;

    saveData();
    if (typeof updateHubUI === 'function') updateHubUI();
    
    // เริ่ม Animation
    _showRezeroGachaAnimation(cardName, _RZL_CARDS[cardName]);
};

function _showRezeroGachaAnimation(cardName, cardData) {
    const quote = _RZL_QUOTES[cardName] || "ใครกันนะ...?";
    
    const ov = document.createElement('div');
    ov.id = '_rzl-gacha-anim';
    ov.style.cssText = 'position:fixed;inset:0;background:#000;z-index:9990;display:flex;flex-direction:column;align-items:center;justify-content:center;transition:background 1.5s ease;';
    
    const quoteBox = document.createElement('div');
    quoteBox.style.cssText = 'color:#e5e7eb;font-size:1.4rem;font-weight:bold;font-style:italic;text-align:center;max-width:80%;opacity:1;transition:opacity 0.5s ease;letter-spacing:1px;line-height:1.6;';
    
    let i = 0;
    quoteBox.innerHTML = '';
    ov.appendChild(quoteBox);
    document.body.appendChild(ov);

    function typeWriter() {
        if (i < quote.length) {
            quoteBox.innerHTML += quote.charAt(i);
            i++;
            setTimeout(typeWriter, 40);
        } else {
            setTimeout(() => {
                quoteBox.style.opacity = '0';
                ov.style.background = '#fff';
                setTimeout(() => {
                    ov.remove();
                    _showRezeroCardReveal(cardName, cardData);
                }, 300);
            }, 1800);
        }
    }
    
    setTimeout(typeWriter, 500);
}

function _showRezeroCardReveal(cardName, cardData) {
    const ov = document.createElement('div');
    ov.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,0.96);z-index:9900;display:flex;align-items:center;justify-content:center;animation:fadeIn 0.3s ease;';
    ov.innerHTML = `
    <div style="background:linear-gradient(135deg,#1e1b4b,#2e1065,#1e1b4b);
         border:3px solid #a855f7;border-radius:28px;padding:32px 22px;
         max-width:360px;width:92%;text-align:center;
         box-shadow:0 0 80px rgba(168,85,247,0.55);transform:scale(0.8);animation:popIn 0.4s forwards cubic-bezier(0.175, 0.885, 0.32, 1.275);">
      <div style="font-size:2.8rem;margin-bottom:4px">📖</div>
      <div style="font-size:1.2rem;font-weight:900;color:#d8b4fe;margin-bottom:18px">Witch Cult & Camps</div>
      
      <div style="width:160px;margin:0 auto 18px;border-radius:16px;overflow:hidden;
           border:3px solid #a855f7;box-shadow:0 0 30px rgba(168,85,247,0.6)">
        <img src="${cardData.art}" style="width:100%;height:200px;object-fit:cover">
        <div style="background:rgba(0,0,0,0.88);padding:8px 6px">
          <div style="font-size:0.62rem;font-weight:900;color:${cardData.isChampion ? '#fbbf24' : '#d8b4fe'};margin-bottom:2px">${cardData.isChampion ? '♛ Champion' : 'Limited Edition'}</div>
          <div style="font-size:0.95rem;font-weight:900;color:white">${cardName}</div>
          <div style="font-size:0.55rem;color:#9ca3af">Cost ${cardData.cost} · ATK ${cardData.atk} / HP ${cardData.hp}</div>
        </div>
      </div>
      
      <div style="background:rgba(168,85,247,0.12);border:1px solid #7c3aed;
           border-radius:10px;padding:8px 12px;margin-bottom:18px;font-size:0.66rem;color:#c4b5fd;text-align:left;line-height:1.4;">
        ${cardData.text}
      </div>
      
      <button onclick="this.closest('div[style*=fixed]').remove();if(typeof renderPacksPanel==='function') renderPacksPanel();"
        style="background:linear-gradient(135deg,#7c3aed,#9333ea);color:white;border:none;
               padding:13px 38px;border-radius:16px;font-weight:900;font-size:1.05rem;cursor:pointer;
               box-shadow:0 0 22px rgba(168,85,247,0.5)">สุดยอด!</button>
    </div>
    <style>@keyframes popIn { to { transform: scale(1); } }</style>`;
    
    document.body.appendChild(ov);
    
    const snd = new Audio('https://files.catbox.moe/mu7wrw.wav');
    snd.volume = 0.6;
    snd.play().catch(()=>{});

    setTimeout(() => {
        if (typeof checkCollectionMilestones === 'function') checkCollectionMilestones();
        if (typeof checkTitleUnlocks === 'function') checkTitleUnlocks();
    }, 1000);
}

// ─── HELPER: สร้าง SPELL / ITEM ─────────────────────────────
function _mkRzlSpell(name) {
    const tpl = _RZL_SPELLS[name];
    if (!tpl) return null;
    return {
        id: 'card_' + (cardIdCounter++), name: tpl.name, originalName: tpl.name,
        type: tpl.type, cost: tpl.cost, text: tpl.text, color: tpl.color, art: tpl.art || '',
        requiresTarget: tpl.requiresTarget, targetEnemy: tpl.targetEnemy,
        _theme: RZL_THEME, isRzlSpell: true, status: [], items:[]
    };
}

function _mkRzlToken(name, atk, hp) {
    return {
        id: 'card_' + (cardIdCounter++), name: name, originalName: name,
        type: 'Character', cost: 0, atk: atk, hp: hp, maxHp: hp,
        text: 'Taunt | ตาย: +1/+1 ให้ Petelgeuse', color: 'bg-stone-950',
        maxAttacks: 1, attacksLeft: 1, status: [], items: [], tempBuffs:[]
    };
}

// ─── GAME MECHANICS HOOKS ───────────────────────────────────
function _hookRezeroLtdMechanics() {

    // 1. triggerOnSummon
    if (typeof window.triggerOnSummon === 'function') {
        const _origSummon = window.triggerOnSummon;
        window.triggerOnSummon = function(card, pk) {
            _origSummon(card, pk);
            const eff = card.originalName || card.name;
            const p = state.players[pk];
            const oppKey = pk === 'player' ? 'ai' : 'player';

            if (eff === 'Beatrice' && !card.silenced) {
                p.hand.push(_mkRzlSpell('Contract'));
                p.hand.push(_mkRzlSpell('Contract'));
                if (typeof log === 'function') log(`🦋 [Beatrice] ฉันจะทำสัญญาปกป้องเธอเอง คาชิระ! ได้รับ Contract x2`, 'text-pink-300 font-bold');
            }
            if (eff === 'Garfiel Tinsel' && !card.silenced) {
                p.hand.push(_mkRzlSpell('Beastification'));
                if (typeof log === 'function') log(`🐅 [Garfiel] เตรียมขย้ำ! ได้รับ Beastification`, 'text-amber-400 font-bold');
            }
            if (eff === 'Pandora' && !card.silenced) {
                const enemies = state.players[oppKey].field.filter(c => typeof getCharStats==='function' && getCharStats(c).hp > 0);
                if (enemies.length > 0) {
                    const target = enemies[Math.floor(Math.random() * enemies.length)];
                    if (!target.status.includes('Paralyze')) target.status.push('Paralyze');
                    target.paralyzeTurns = Math.max(target.paralyzeTurns || 0, 4);
                    if (typeof log === 'function') log(`🗝️ [Pandora] ความจริงถูกบิดเบือน... ${target.name} ติด Paralyze 2 เทิร์น!`, 'text-stone-400 font-bold');
                }
            }
            if (eff === 'Regulus Corneas' && !card.silenced) {
                const allies = p.field.filter(c => c.id !== card.id && typeof getCharStats==='function' && getCharStats(c).hp > 0);
                if (allies.length > 0) {
                    const target = allies[Math.floor(Math.random() * allies.length)];
                    target._regulusMarked = true;
                    if (typeof log === 'function') log(`⌚ [Regulus] สิงสู่หัวใจ... ฝากชีวิตไว้กับเพื่อน (ศัตรูมองไม่เห็น)`, 'text-zinc-300 font-bold');
                }
            }
            if (eff === 'Petelgeuse Romanée-Conti' && !card.silenced) {
                p.hand.push(_mkRzlSpell('The Unseen Hand'));
                if (typeof log === 'function') log(`🖐️ [Petelgeuse] นิ้วมือแห่งความเกียจคร้าน! ได้รับ The Unseen Hand`, 'text-lime-400 font-bold');
            }
            if (eff === 'Otto Suwen' && !card.silenced) {
                const animalIdx = p.deck.findIndex(c => c.theme === 'animal_kingdom' && c.type === 'Character');
                if (animalIdx !== -1 && p.field.length < (typeof getMaxFieldSlots === 'function' ? getMaxFieldSlots(pk) : 6)) {
                    const summoned = p.deck.splice(animalIdx, 1)[0];
                    summoned.attacksLeft = summoned.maxAttacks || 1;
                    p.field.push(summoned);
                    if (typeof log === 'function') log(`🗣️ [Otto] คุยกับสัตว์รู้เรื่อง! อัญเชิญ ${summoned.name} จากสำรับ!`, 'text-emerald-400 font-bold');
                    if (typeof triggerOnSummon === 'function') triggerOnSummon(summoned, pk);
                }
            }
            if (eff === 'Cecilus Segmunt' && !card.silenced) {
                p.hand.push(_mkRzlSpell('Murasame'));
                p.hand.push(_mkRzlSpell('Masayume'));
                if (typeof log === 'function') log(`⚡ [Cecilus] สายฟ้าสีครามชักดาบ! ได้รับ Murasame และ Masayume`, 'text-blue-400 font-bold');
            }
            if (eff === 'Satella' && !card.silenced) {
                state.players[oppKey].field.forEach(c => {
                    if (!c.tossakanImmune) {
                        if (!c.status.includes('Paralyze')) c.status.push('Paralyze');
                        c.paralyzeTurns = Math.max(c.paralyzeTurns || 0, 2);
                    }
                });
                if (typeof log === 'function') log(`🌑 [Satella] เงามืดปกคลุม... ศัตรูทั้งหมดถูก Paralyze 1 เทิร์น!`, 'text-purple-400 font-bold');
            }
        };
    }

    // 2. resolveEndPhase
    if (typeof window.resolveEndPhase === 'function') {
        const _origEnd = window.resolveEndPhase;
        window.resolveEndPhase = function(pk) {
            _origEnd(pk);
            const p = state.players[pk];

            p.field.forEach(c => {
                if (c.contractBuffTurn === state.totalTurns) {
                    c.atk = Math.max(0, c.atk - 3);
                    c.contractBuffTurn = 0;
                }
                
                const eff = c.originalName || c.name;
                
                if (eff === 'Echidna' && !c.silenced && getCharStats(c).hp > 0) {
                    const aliveCount = p.field.filter(x => getCharStats(x).hp > 0).length;
                    if (aliveCount >= 2) {
                        if (typeof window.drawCard === 'function') window.drawCard(pk, 2);
                        if (typeof log === 'function') log(`☕ [Echidna] เวลาน้ำชา... มีเพื่อนคุยเลยจั่วการ์ด 2 ใบ!`, 'text-slate-300 font-bold');
                    }
                }
                
                if (eff === 'Regulus Corneas' && !c.silenced && getCharStats(c).hp > 0) {
                    const allies = p.field.filter(x => x.id !== c.id && getCharStats(x).hp > 0);
                    if (allies.length > 0) {
                        const target = allies[Math.floor(Math.random() * allies.length)];
                        target._regulusMarked = true;
                        if (typeof log === 'function') log(`⌚ [Regulus] ฝากหัวใจไว้อีกดวง...`, 'text-zinc-400');
                    }
                }

                if (c.satellaReviveTimer > 0) {
                    c.satellaReviveTimer--;
                    if (c.satellaReviveTimer === 0) {
                        c.status = c.status.filter(s => s !== 'Levitate');
                        c.hp = c.maxHp;
                        if (typeof log === 'function') log(`🌑 [Satella] หญิงสาวผู้เป็นที่รักของเงา... คืนชีพและเริ่มร่ายความมืดอีกครั้ง!`, 'text-purple-400 font-bold');
                        if (typeof triggerOnSummon === 'function') triggerOnSummon(c, pk);
                    }
                }
            });
        };
    }

    // 3. getCharStats (Sirius, Regulus, Cecilus, Garfiel)
    if (typeof window.getCharStats === 'function') {
        const _origStats = window.getCharStats;
        window.getCharStats = function(char) {
            let stats = _origStats(char);
            if (char.silenced) return stats;
            const eff = char.originalName || char.name;

            if (eff === 'Sirius') {
                stats.damageMultiplier = (stats.damageMultiplier || 1) * 0.7;
            }
            if (eff === 'Regulus Corneas') {
                let hasMarkedAlive = false;
                ['player', 'ai'].forEach(k => {
                    state.players[k].field.forEach(x => {
                        if (x._regulusMarked && x.hp > 0) hasMarkedAlive = true;
                    });
                });
                if (hasMarkedAlive) {
                    stats.damageMultiplier = 0;
                }
            }
            if (char.items) {
                if (char.items.some(i => i.name === 'Murasame')) {
                    stats.atk += 5;
                    stats.maxAttacks = Math.max(stats.maxAttacks || 1, 4);
                }
            }
            if (char.hasBeastificationEvade) {
                stats.hasEvade = true;
            }

            return stats;
        };
    }

    // 4. getActualCost (Cecilus Swords)
    if (typeof window.getActualCost === 'function') {
        const _origCost = window.getActualCost;
        window.getActualCost = function(card, pk) {
            let cost = _origCost(card, pk);
            if (card.name === 'Murasame' || card.name === 'Masayume') {
                const lostHp = 20 - state.players[pk].hp;
                cost = Math.max(0, cost - lostHp);
            }
            return cost;
        };
    }

    // 5. drawCard (Echidna)
    if (typeof window.drawCard === 'function') {
        const _origDraw = window.drawCard;
        window.drawCard = function(pk, count = 2) {
            _origDraw.apply(this, arguments);
            const p = state.players[pk];
            p.field.forEach(c => {
                const eff = c.originalName || c.name;
                if (eff === 'Echidna' && !c.silenced && c.hp > 0) {
                    const buff = 2 * count;
                    c.atk += buff; c.hp += buff; c.maxHp += buff;
                    if (typeof log === 'function') log(`☕ [Echidna] ความรู้เพิ่มพูน... +${buff} ATK/HP!`, 'text-slate-300 font-bold');
                }
            });
        };
    }

    // 6. resolveTargetedPlay (Contract, Murasame, Masayume)
    if (typeof window.resolveTargetedPlay === 'function') {
        const _origTarget = window.resolveTargetedPlay;
        window.resolveTargetedPlay = function(pk, srcId, tgtId) {
            const p = state.players[pk];
            const card = p.hand.find(c => c.id === srcId);
            
            if (card && (card.name === 'Murasame' || card.name === 'Masayume')) {
                const tgt = p.field.find(c => c.id === tgtId);
                if (tgt && (tgt.originalName || tgt.name) !== 'Cecilus Segmunt') {
                    if (pk === 'player' && typeof alert === 'function') alert('ดาบนี้ใส่ได้แค่ Cecilus Segmunt เท่านั้น!');
                    if (typeof cancelTargeting === 'function') cancelTargeting();
                    return;
                }
            }

            if (card && card.name === 'Contract') {
                const tgt = p.field.find(c => c.id === tgtId);
                if (tgt) {
                    tgt.atk += 3;
                    tgt.contractBuffTurn = state.totalTurns;
                    tgt.contractCaster = pk;
                    if (typeof log === 'function') log(`🦋 [Contract] สัญญาผูกมัด! ${tgt.name} +3 ATK ในเทิร์นนี้!`, 'text-pink-400 font-bold');
                    
                    p.cost -= (typeof getActualCost === 'function' ? getActualCost(card, pk) : card.cost);
                    p.hand.splice(p.hand.indexOf(card), 1);
                    p.graveyard.push(card);
                    if (typeof cancelTargeting === 'function') cancelTargeting();
                    if (typeof updateUI === 'function') updateUI();
                    return;
                }
            }

            _origTarget.apply(this, arguments);
        };
    }

    // 7. executeNonTargetAction (Beastification, The Unseen Hand)
    if (typeof window.executeNonTargetAction === 'function') {
        const _origNonTarget = window.executeNonTargetAction;
        window.executeNonTargetAction = function(card, pk) {
            const p = state.players[pk];
            if (card.name === 'Beastification') {
                p.hp = Math.max(0, p.hp - 1);
                if (typeof checkWinCondition === 'function') checkWinCondition();
                const garf = p.field.find(c => (c.originalName || c.name) === 'Garfiel Tinsel' && c.hp > 0);
                if (garf) {
                    garf.atk += 5; garf.hp += 5; garf.maxHp += 5;
                    garf.hasBeastificationEvade = true;
                    if (typeof log === 'function') log(`🐅[Beastification] คำราม! Garfiel กลายร่าง +5/+5 และหลบหลีก 50%!`, 'text-amber-400 font-bold');
                }
                p.graveyard.push(card);
                return;
            }
            if (card.name === 'The Unseen Hand') {
                for(let i=0; i<2; i++) {
                    if (p.field.length < (typeof getMaxFieldSlots==='function'?getMaxFieldSlots(pk):6)) {
                        p.field.push(_mkRzlToken('Shadow Hand', 1, 1));
                    }
                }
                if (typeof log === 'function') log(`🖐️ [The Unseen Hand] อัญเชิญมือมืด x2!`, 'text-stone-400 font-bold');
                p.graveyard.push(card);
                return;
            }

            _origNonTarget.apply(this, arguments);
        };
    }

    // 8. initiateAttack (Sirius, Pandora, Cecilus Masayume)
    if (typeof window.initiateAttack === 'function') {
        const _origAtk = window.initiateAttack;
        window.initiateAttack = function(atkId, tgtId, isBase) {
            if (typeof state === 'undefined' || isBase) {
                let atkCard = null;
                const pk = state.currentTurn;
                if (pk) atkCard = state.players[pk].field.find(c => c.id === atkId);
                
                if (atkCard && (atkCard.originalName || atkCard.name) === 'Pandora' && !atkCard.silenced) {
                    state.players[pk].hp -= 1;
                    if (typeof log === 'function') log(`🗝️ [Pandora] บิดเบือนความเป็นจริง... Base เรา -1 HP เพื่อโจมตี!`, 'text-stone-400');
                    if (typeof checkWinCondition === 'function') checkWinCondition();
                }

                _origAtk.apply(this, arguments);
                return;
            }

            const pk = state.currentTurn;
            const oppKey = pk === 'player' ? 'ai' : 'player';
            const attacker = state.players[pk].field.find(c => c.id === atkId);
            let target = state.players[oppKey].field.find(c => c.id === tgtId);

            if (attacker && target) {
                const aN = attacker.originalName || attacker.name;

                if (aN === 'Sirius' && !attacker.silenced && target.status.includes('Paralyze')) {
                    attacker.atk += 2;
                    attacker._siriusBoost = true;
                    if (typeof log === 'function') log(`⛓️ [Sirius] ยิ่งดิ้นยิ่งเจ็บ! ทำดาเมจเพิ่ม +2 ใส่เป้าหมายที่ขยับไม่ได้!`, 'text-red-400 font-bold');
                }

                if (aN === 'Pandora' && !attacker.silenced) {
                    state.players[pk].hp -= 1;
                    if (typeof checkWinCondition === 'function') checkWinCondition();
                }

                const prevTgtHp = target.hp;

                _origAtk.apply(this, arguments);

                if (attacker._siriusBoost) {
                    attacker.atk -= 2;
                    attacker._siriusBoost = false;
                }

                // Masayume logic moved to 06_combat.js for proper Taunt and True Damage interactions

                if (aN === 'Pandora' && !attacker.silenced) {
                    const tgtAfter = state.players[oppKey].field.find(c => c.id === tgtId);
                    if (!tgtAfter || tgtAfter.hp <= 0) {
                        state.players[pk].hp = Math.min(20, state.players[pk].hp + 2);
                        if (typeof log === 'function') log(`🗝️ [Pandora] เปลี่ยนความตายเป็นพลัง! Base เรา +2 HP!`, 'text-stone-300 font-bold');
                    }
                }

                if (aN === 'Sirius' && !attacker.silenced) {
                    const tgtAfter = state.players[oppKey].field.find(c => c.id === tgtId);
                    if (tgtAfter && tgtAfter.hp > 0 && !tgtAfter.tossakanImmune) {
                        if (!tgtAfter.status.includes('Paralyze')) tgtAfter.status.push('Paralyze');
                        tgtAfter.paralyzeTurns = Math.max(tgtAfter.paralyzeTurns || 0, 4);
                        if (typeof log === 'function') log(`⛓️ [Sirius] มัดไว้ด้วยความรัก! ${tgtAfter.name} ติด Paralyze 2 เทิร์น!`, 'text-red-400');
                    }
                }
            } else {
                _origAtk.apply(this, arguments);
            }
        };
    }

    // 9. checkDeath (Beatrice, Garfiel, Pandora, Petelgeuse, Shadow Hand, Contract Heal)
    if (typeof window.checkDeath === 'function') {
        const _origDeath = window.checkDeath;
        window.checkDeath = function(pk) {
            const p = state.players[pk];
            const oppKey = pk === 'player' ? 'ai' : 'player';

            p.field.forEach(c => {
                if (typeof getCharStats === 'function' && getCharStats(c).hp <= 0 && !c.isDyingProcessing) {
                    const eff = c.originalName || c.name;

                    if (c.contractBuffTurn === state.totalTurns && c.contractCaster) {
                        state.players[c.contractCaster].hp = Math.min(20, state.players[c.contractCaster].hp + 1);
                        if (typeof log === 'function') log(`🦋 [Contract] สังเวยวิญญาณ... ผู้ร่ายเวทได้รับการฮีล +1 HP!`, 'text-pink-400 font-bold');
                    }

                    if (eff === 'Beatrice') {
                        p.hand.push(_mkRzlSpell('Contract'));
                        p.hand.push(_mkRzlSpell('Contract'));
                        if (typeof log === 'function') log(`🦋 [Beatrice] ลาก่อน... ทิ้ง Contract ไว้ให้ 2 ใบ`, 'text-pink-400 font-bold');
                    }

                    if (eff === 'Garfiel Tinsel') {
                        state.players[oppKey].hp -= 1;
                        if (typeof log === 'function') log(`🐅 [Garfiel] เฮือกสุดท้าย! Base ศัตรู -1 HP`, 'text-amber-400 font-bold');
                        if (typeof checkWinCondition === 'function') checkWinCondition();
                    }

                    if (eff === 'Shadow Hand') {
                        const petel = p.field.find(x => (x.originalName || x.name) === 'Petelgeuse Romanée-Conti' && getCharStats(x).hp > 0);
                        if (petel) {
                            petel.atk += 1; petel.maxHp += 1; petel.hp += 1;
                            if (typeof log === 'function') log(`🖐️ [Shadow Hand] พลังกลับสู่ร่างต้น! Petelgeuse +1/+1`, 'text-stone-400');
                        }
                    }

                    if (eff === 'Pandora' && !c.pandoraRevived) {
                        c.pandoraRevived = true;
                        c.hp = c.maxHp;
                        c.isDyingProcessing = false;
                        if (typeof log === 'function') log(`🗝️ [Pandora] ความตายไม่ใช่จุดจบ... เขียนความจริงใหม่และคืนชีพ!`, 'text-stone-300 font-bold');
                        if (typeof window.triggerOnSummon === 'function') window.triggerOnSummon(c, pk);
                    }

                    if (eff === 'Petelgeuse Romanée-Conti' && !c.petelgeuseRevived) {
                        const myStats = getCharStats(c);
                        const enemies = state.players[oppKey].field.filter(x => getCharStats(x).hp > 0);
                        const weaker = enemies.filter(x => {
                            const st = getCharStats(x);
                            return (st.hp + st.atk) < (myStats.hp + myStats.atk);
                        });
                        
                        if (weaker.length > 0) {
                            const target = weaker[Math.floor(Math.random() * weaker.length)];
                            const tStats = getCharStats(target);
                            target.hp = -99;
                            if (typeof log === 'function') log(`🧠 [Petelgeuse] นิ้วมือมองไม่เห็นเจาะทะลุร่าง! ยึดร่าง ${target.name} สำเร็จ!`, 'text-lime-400 font-bold');
                            
                            c.petelgeuseRevived = true;
                            c.hp = tStats.maxHp;
                            c.maxHp = tStats.maxHp;
                            c.atk = tStats.atk;
                            c.isDyingProcessing = false;
                            
                            if (typeof window.triggerOnSummon === 'function') window.triggerOnSummon(c, pk);
                            if (typeof window.checkDeath === 'function') window.checkDeath(oppKey);
                        } else {
                            if (typeof log === 'function') log(`🧠 [Petelgeuse] ไม่มีภาชนะที่อ่อนแอกว่า... สลายไปอย่างเกียจคร้าน`, 'text-lime-600');
                        }
                    }

                    if (eff === 'Satella' && !c.satellaUsed) {
                        c.satellaUsed = true;
                        c.hp = c.maxHp;
                        c.isDyingProcessing = false;
                        if (!c.status.includes('Levitate')) c.status.push('Levitate');
                        c.immortalTurns = 2;
                        c.satellaReviveTimer = 2;
                        if (typeof log === 'function') log(`🌑 [Satella] กลืนกินความตาย... เธอชักนำเงามาคลุมร่างและลอยตัวขึ้นสู่ความว่างเปล่า`, 'text-purple-400 font-bold');
                    }
                }
            });
            _origDeath.apply(this, arguments);
        };
    }
}

// ============================================================
// 29_bug_fixes.js — Fix Regulus, Volcanica, and Cecilus Bugs
// ============================================================

document.addEventListener('DOMContentLoaded', () => {
    
    // --------------------------------------------------------
    // 1. ซ่อมแซมบัคดาบของ Cecilus Segmunt (Cost ลดเบิ้ล 2 รอบ)
    // --------------------------------------------------------
    if (typeof window.getActualCost === 'function') {
        const _origActualCostFix = window.getActualCost;
        window.getActualCost = function(card, pk) {
            if (card.name === 'Murasame' || card.name === 'Masayume') {
                const baseCost = card.cost;
                const lostHp = 20 - state.players[pk].hp;
                let finalCost = Math.max(0, baseCost - lostHp);
                return Math.max(0, finalCost - (card.costReducer || 0));
            }
            return _origActualCostFix.apply(this, arguments);
        };
    }

    // --------------------------------------------------------
    // 2. ระบบต้านทานความตาย (Immunity Wrapper)
    // ป้องกัน Volcanica และ Regulus ถูกลบลงสุสานระหว่างเวทมนตร์ทำงาน
    // --------------------------------------------------------
    let _isImmunityContext = null;

    const _origCheckDeath_fix = window.checkDeath;
    window.checkDeath = function(playerKey) {
        if (_isImmunityContext) {
            const tempRestored = [];
            ['player', 'ai'].forEach(pk => {
                state.players[pk].field.forEach(c => {
                    if (c.hp <= 0) {
                        const effName = c.originalName || c.name;
                        let isImmune = false;
                        
                        if (effName === 'Regulus Corneas') {
                            const hasMarked = state.players.player.field.some(x => x._regulusMarked && x.hp > 0) ||
                                              state.players.ai.field.some(x => x._regulusMarked && x.hp > 0);
                            if (hasMarked) isImmune = true;
                        }
                        if (effName === 'Volcanica the Protecter Dragon') {
                            if (_isImmunityContext === 'spell' || _isImmunityContext === 'skill' || _isImmunityContext === 'status') {
                                isImmune = true;
                            }
                        }

                        if (isImmune) {
                            tempRestored.push({ card: c, oldHp: c.hp });
                            c.hp = 1;
                        }
                    }
                });
            });

            _origCheckDeath_fix.apply(this, arguments);

            tempRestored.forEach(item => {
                item.card.hp = item.oldHp;
            });
        } else {
            _origCheckDeath_fix.apply(this, arguments);
        }
    };

    function withImmunity(fn, context) {
        return function(...args) {
            if (typeof state === 'undefined') return fn.apply(this, args);
            
            let preHp = {};
            ['player', 'ai'].forEach(pk => {
                state.players[pk].field.forEach(c => {
                    preHp[c.id] = c.hp;
                });
            });

            _isImmunityContext = context;

            const result = fn.apply(this, args);

            _isImmunityContext = null;

            ['player', 'ai'].forEach(pk => {
                state.players[pk].field.forEach(c => {
                    const oldHp = preHp[c.id];
                    if (oldHp === undefined) return;

                    const effName = c.originalName || c.name;
                    let isImmune = false;

                    if (effName === 'Regulus Corneas') {
                        const hasMarked = state.players.player.field.some(x => x._regulusMarked && x.hp > 0) ||
                                          state.players.ai.field.some(x => x._regulusMarked && x.hp > 0);
                        if (hasMarked) isImmune = true;
                    }

                    if (effName === 'Volcanica the Protecter Dragon') {
                        if (context === 'spell' || context === 'skill' || context === 'status') {
                            isImmune = true;
                        }
                    }

                    if (isImmune && c.hp < oldHp) {
                        c.hp = oldHp;
                        
                        if (effName === 'Regulus Corneas' && typeof log === 'function') {
                            log(`⌚ [Regulus] เวลาหยุดนิ่ง... การโจมตีทั้งหมดถูกปฏิเสธ!`, 'text-zinc-300 font-bold');
                        } else if (effName === 'Volcanica the Protecter Dragon' && typeof log === 'function') {
                            log(`🐉 [Volcanica] พลังเวทไม่ระคายผิวข้า! (Immune)`, 'text-sky-300 font-bold');
                        }
                    }
                });
            });

            return result;
        };
    }

    if (typeof window.executeNonTargetAction === 'function') {
        window.executeNonTargetAction = withImmunity(window.executeNonTargetAction, 'spell');
    }
    if (typeof window.resolveTargetedPlay === 'function') {
        window.resolveTargetedPlay = withImmunity(window.resolveTargetedPlay, 'spell');
    }
    if (typeof window.triggerOnSummon === 'function') {
        window.triggerOnSummon = withImmunity(window.triggerOnSummon, 'skill');
    }
    if (typeof window.resolveEndPhase === 'function') {
        window.resolveEndPhase = withImmunity(window.resolveEndPhase, 'status');
    }
    if (typeof window.initiateAttack === 'function') {
        window.initiateAttack = withImmunity(window.initiateAttack, 'attack');
    }

});

// ============================================================
// 30_rezero_part2_and_dungeon.js — Re:Zero New Cards, Artstyles & White Whale Dungeon
// ============================================================

const NEW_REZERO_CARDS = {
    'Daphne': {
        name: 'Daphne', type: 'Character', cost: 10, atk: 4, hp: 5, maxHp: 5,
        text: 'Witch of Gluttony | Ongoing: ลด Cost ของการ์ด Great Rabbit, Black Serpent และ White Whale ในมือลง 5',
        color: 'bg-stone-800', maxAttacks: 1, shopOnly: true,
        art: 'https://file.garden/aeeLCXSsJxTPrRbp/5e7f9f4f2a56b95ae39064383f077905.jpg', _theme: 'isekai_adventure'
    },
    'Halibel': {
        name: 'Halibel', type: 'Character', cost: 9, atk: 5, hp: 7, maxHp: 7,
        text: 'Ongoing: โจมตี 2 ครั้ง | โดนโจมตี: ถ้าศัตรูมี DMG > 3 มีโอกาส 50% หลบหลีก | โจมตี: 30% แปะ "Halibel Mark" (ATK ศัตรูเหลือ 1, จบเทิร์นศัตรูโดน 2 ดาเมจ จนกว่า Halibel จะตาย)',
        color: 'bg-indigo-900', maxAttacks: 2, shopOnly: true,
        art: 'https://file.garden/aeeLCXSsJxTPrRbp/1777394220471.jpg', _theme: 'isekai_adventure'
    },
    'Julius': {
        name: 'Julius', type: 'Character', cost: 7, atk: 5, hp: 6, maxHp: 6,
        text: 'On Summon: สุ่มรับวิญญาณเวท 1 ใบขึ้นมือ (Nia, Ikua หรือ Ines) โดยเวทจะ Cost 0',
        color: 'bg-yellow-700', maxAttacks: 1, shopOnly: true,
        art: 'https://file.garden/aeeLCXSsJxTPrRbp/592dc68ed2cb5704378372802fcf3e5c.jpg', _theme: 'isekai_adventure'
    },
    'Nia': {
        name: 'Nia', type: 'Spell', cost: 0,
        text: 'ทำ 3 ดาเมจใส่ศัตรู 1 ตัว และทำให้เป้าหมายติด Burn 2 เทิร์น',
        color: 'bg-red-500', requiresTarget: true, targetEnemy: true, shopOnly: true,
        art: 'https://file.garden/aeeLCXSsJxTPrRbp/1777394489276.png', _theme: 'isekai_adventure'
    },
    'Ikua': {
        name: 'Ikua', type: 'Spell', cost: 0,
        text: 'ฟื้นฟู HP เต็มให้พันธมิตร 1 ตัว และเพิ่ม Max HP +4',
        color: 'bg-lime-500', requiresTarget: true, targetEnemy: false, shopOnly: true,
        art: 'https://file.garden/aeeLCXSsJxTPrRbp/1777394535637.png', _theme: 'isekai_adventure'
    },
    'Ines': {
        name: 'Ines', type: 'Spell', cost: 0,
        text: 'ทำลายศัตรูแบบสุ่ม 1 ตัว ที่มี Cost 8 หรือต่ำกว่า',
        color: 'bg-gray-200 text-black', requiresTarget: false, shopOnly: true,
        art: 'https://file.garden/aeeLCXSsJxTPrRbp/592dc68ed2cb5704378372802fcf3e5c.jpg', _theme: 'isekai_adventure'
    }
};

const NEW_REZERO_ARTSTYLES = {
    'petelgeuse_icecream': { id: 'petelgeuse_icecream', label: 'Petelgeuse - Ice Cream Time', emoji: '🍦', targetCard: 'Petelgeuse Romanée-Conti', art: 'https://file.garden/aeeLCXSsJxTPrRbp/00250f82436f9ddefd0ee2649b4bf0a4.jpg', shopCost: 10, currency: 'rezero' },
    'echidna_contract':    { id: 'echidna_contract',    label: 'Echidna - Contract with Devil', emoji: '📜', targetCard: 'Echidna',                  art: 'https://file.garden/aeeLCXSsJxTPrRbp/e9aae68d9988ba62746cf18e17457140.jpg', shopCost: 10, currency: 'rezero' },
    'garfiel_beast':       { id: 'garfiel_beast',       label: 'Garfiel - Beastmode',           emoji: '🐅', targetCard: 'Garfiel Tinsel',           art: 'https://file.garden/aeeLCXSsJxTPrRbp/c7245b69e3d9890f2c339795d3bbf65d.jpg', shopCost: 10, currency: 'rezero' },
    'fairy_mystic':        { id: 'fairy_mystic',        label: 'Fairy - Mysterious Magic',      emoji: '🧚', targetCard: 'Fairy',                    art: 'https://file.garden/aeeLCXSsJxTPrRbp/1777395017940.jpg', shopCost: 10, currency: 'rezero' },
    'chess_royal':         { id: 'chess_royal',         label: 'Chess Board - Royal Selection', emoji: '♟️', targetCard: 'Chess Board',              art: 'https://file.garden/aeeLCXSsJxTPrRbp/1777395012365.jpg', shopCost: 10, currency: 'rezero' },
    'pandora_white':       { id: 'pandora_white',       label: 'Pandora - Eternal White',       emoji: '🤍', targetCard: 'Pandora',                  art: 'https://file.garden/aeeLCXSsJxTPrRbp/1777395033109.jpg', shopCost: 10, currency: 'rezero' },
    'roswaal_puppet':      { id: 'roswaal_puppet',      label: 'Roswaal - Arcane Puppeteer',    emoji: '🤡', targetCard: 'Roswaal L. Mathers',       art: 'https://file.garden/aeeLCXSsJxTPrRbp/1777395037643.jpg', shopCost: 10, currency: 'rezero' },
};

document.addEventListener('DOMContentLoaded', () => {

    // 1. Inject New Cards & Artstyles
    if (typeof CardSets !== 'undefined') {
        if (!CardSets['isekai_adventure']) CardSets['isekai_adventure'] = {};
        Object.entries(NEW_REZERO_CARDS).forEach(([k, v]) => {
            CardSets['isekai_adventure'][k] = JSON.parse(JSON.stringify(v));
        });
    }
    if (typeof ARTSTYLE_CFG !== 'undefined') {
        Object.assign(ARTSTYLE_CFG, NEW_REZERO_ARTSTYLES);
    }

    // 2. New Redeem Code
    if (typeof REDEEM_CODES !== 'undefined') {
        REDEEM_CODES['SORRYFORBUGSV2'] = { bp: 10000, label: '⭐ 10,000 BP', oneTime: true };
    }

    if (typeof window.redeemCode === 'function') {
        const _origRDM = window.redeemCode;
        window.redeemCode = function() {
            const raw = document.getElementById('redeem-input')?.value?.trim().toUpperCase();
            const reward = (typeof REDEEM_CODES !== 'undefined') ? REDEEM_CODES[raw] : null;
            if (reward && reward.bp) {
                const used = typeof getUsedCodes === 'function' ? getUsedCodes() : [];
                const msg = document.getElementById('redeem-msg');
                if (reward.oneTime && used.includes(raw)) {
                    if (msg) { msg.style.color='#f87171'; msg.textContent='❌ โค้ดนี้ใช้ไปแล้ว'; } return;
                }
                if (typeof window.addBattlePoints === 'function') window.addBattlePoints(reward.bp);
                if (typeof markCodeUsed === 'function') markCodeUsed(raw);
                if (msg) { msg.style.color='#fbbf24'; msg.textContent=`🎉 ได้รับ ${reward.label} เรียบร้อยแล้ว!`; }
                if (typeof showToast === 'function') showToast(`🎁 รับ ${reward.bp} BP สำเร็จ!`, '#fbbf24');
                document.getElementById('redeem-input').value = '';
                return;
            }
            _origRDM.apply(this, arguments);
        };
    }

    // 3. ปรับปรุง Re:Zero Shop ให้รวมการ์ดใหม่ (Daphne, Halibel, Julius)
    if (typeof window.renderRezeroShop === 'function') {
        window.renderRezeroShop = function() {
            const ov = document.getElementById('_rezero-shop-overlay');
            if (!ov) return;

            const tk = playerData.rezeroTokens || 0;
            const gemsBought = playerData.rezeroGemsBought || 0;
            const bundleBought = playerData.rezeroBundleBought || false;

            const shopItems = [
                { id: 'Daphne', type: 'card', cost: 50 },
                { id: 'Reid Astrea', type: 'card', cost: 35 },
                { id: 'Volcanica the Protecter Dragon', type: 'card', cost: 35 },
                { id: 'Halibel', type: 'card', cost: 25 },
                { id: 'Julius', type: 'card', cost: 25 },
                { id: 'bn_rezero', type: 'banner', cost: 20, label: 'Banner: Reinhard vs Volcanica' },
                { id: 'Aldebaran', type: 'card', cost: 15 },
                { id: 'Roswaal L. Mathers', type: 'card', cost: 15 }
            ];

            const itemRows = shopItems.map(item => {
                let owned = 0, art = '', name = item.id, desc = '';
                if (item.type === 'card') {
                    owned = playerData.collection[`${item.id}|isekai_adventure`] || 0;
                    const cData = (CardSets['isekai_adventure'] && CardSets['isekai_adventure'][item.id]) || REZERO_CARDS[item.id];
                    art = cData.art;
                    desc = `Cost ${cData.cost} · ATK ${cData.atk}/HP ${cData.hp}`;
                } else {
                    owned = (playerData.unlockedCosmetics || []).includes(item.id) ? 1 : 0;
                    art = COSMETICS_CATALOG.banners.find(b => b.id === item.id).art;
                    desc = 'Profile Banner';
                    name = item.label;
                }

                const canBuy = tk >= item.cost;
                return `<div style="background:#1e1b4b;border:1.5px solid ${canBuy?'#a855f7':'#374151'};border-radius:12px;padding:10px;display:flex;align-items:center;gap:10px">
                  <img src="${art}" style="width:48px;height:58px;object-fit:cover;border-radius:6px;border:1px solid #4c1d95">
                  <div style="flex:1;min-width:0">
                    <div style="font-weight:900;color:white;font-size:0.8rem;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${name}</div>
                    <div style="font-size:0.6rem;color:#a78bfa;">${desc}</div>
                    <div style="font-size:0.55rem;color:#9ca3af;margin-top:2px">มีแล้ว: ${owned}</div>
                  </div>
                  <button onclick="buyRezeroItem('${item.id}', '${item.type}', ${item.cost})" ${canBuy?'':'disabled'}
                    style="background:${canBuy?'linear-gradient(135deg,#7c3aed,#4f46e5)':'#374151'};color:${canBuy?'white':'#9ca3af'};border:none;padding:8px 12px;border-radius:8px;font-weight:900;font-size:0.8rem;cursor:${canBuy?'pointer':'not-allowed'};min-width:60px">
                    ${RZ_TOKEN_IMG} ${item.cost}
                  </button>
                </div>`;
            }).join('');

            ov.innerHTML = `
            <div style="background:linear-gradient(135deg,#0d0b2e,#1a0b2e);border:2.5px solid #a855f7;border-radius:24px;padding:20px;max-width:440px;width:100%;max-height:90vh;overflow-y:auto;box-shadow:0 0 50px rgba(168,85,247,0.3)">
              <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:16px">
                <div><div style="font-size:1.3rem;font-weight:900;color:#c084fc">${RZ_TOKEN_IMG} Re:Zero Shop</div></div>
                <div style="background:#1f2937;border:1px solid #a855f7;border-radius:10px;padding:6px 12px;text-align:center">
                  <div style="font-size:0.55rem;color:#9ca3af">Premium Token</div>
                  <div style="font-size:1.1rem;font-weight:900;color:#c084fc" id="modal-rz-tk">${tk}</div>
                </div>
              </div>
              <div style="background:#1e1b4b;border:1.5px dashed #8b5cf6;border-radius:12px;padding:12px;margin-bottom:16px;display:flex;align-items:center;gap:12px">
                <div style="font-size:2rem">💎</div>
                <div style="flex:1">
                  <div style="font-weight:900;color:#ddd;font-size:0.8rem">สุ่มรับ 1-20 Premium Tokens!</div>
                  <div style="font-size:0.65rem;color:#a78bfa">ใช้ 20 Gems (ซื้อได้ 5 ครั้ง)</div>
                  <div style="font-size:0.6rem;color:#9ca3af;margin-top:2px">ซื้อไปแล้ว ${gemsBought}/5 ครั้ง</div>
                </div>
                <button onclick="buyTokensWithGems()" ${gemsBought >= 5 ? 'disabled' : ''} style="background:${gemsBought >= 5 ? '#374151' : 'linear-gradient(135deg,#0284c7,#2563eb)'};color:white;border:none;padding:8px 12px;border-radius:8px;font-weight:900;font-size:0.8rem;cursor:${gemsBought >= 5 ? 'not-allowed' : 'pointer'}">
                  20 💎
                </button>
              </div>
              <div style="background:linear-gradient(135deg,#310000,#000000);border:2px solid #ef4444;border-radius:12px;padding:12px;margin-bottom:16px;display:flex;align-items:center;gap:12px;box-shadow:0 0 15px rgba(239,68,68,0.2)">
                <img src="${(CardSets['isekai_adventure'] && CardSets['isekai_adventure']['Black Serpent']) ? CardSets['isekai_adventure']['Black Serpent'].art : REZERO_CARDS['Black Serpent'].art}" style="width:48px;height:58px;border-radius:6px;border:1px solid #f87171;object-fit:cover">
                <div style="flex:1">
                  <div style="font-weight:900;color:#fca5a5;font-size:0.85rem">🐍 Black Serpent Bundle</div>
                  <div style="font-size:0.6rem;color:#f87171">รับการ์ด Black Serpent + กรอบ Return by Death <span style="color:#c084fc;font-weight:bold;"><br>+ ${RZ_TOKEN_IMG} 35 Premium Tokens</span></div>
                  <div style="font-size:0.55rem;color:#9ca3af;margin-top:2px">ซื้อได้ครั้งเดียวเท่านั้น!</div>
                </div>
                <button onclick="buyRezeroBundle()" ${bundleBought ? 'disabled' : ''} style="background:${bundleBought ? '#374151' : 'linear-gradient(135deg,#dc2626,#991b1b)'};color:white;border:none;padding:8px 12px;border-radius:8px;font-weight:900;font-size:0.8rem;cursor:${bundleBought ? 'not-allowed' : 'pointer'}">
                  ${bundleBought ? '✅ มีแล้ว' : '80 💎'}
                </button>
              </div>
              <div style="display:flex;flex-direction:column;gap:8px;margin-bottom:16px">${itemRows}</div>
              <button onclick="renderUnifiedArtstyleShop()" style="width:100%;background:linear-gradient(135deg,#1e1b4b,#2e1065);color:#c084fc;border:1px solid #a855f7;padding:10px;border-radius:10px;font-weight:bold;margin-bottom:12px;cursor:pointer">🎨 ดู Artstyle Shop ทั้งหมด</button>
              <button onclick="document.getElementById('_rezero-shop-overlay').remove()" style="width:100%;background:#374151;color:#9ca3af;border:none;padding:12px;border-radius:10px;font-weight:bold;cursor:pointer">✕ ปิด</button>
            </div>`;
        };
    }

    // 4. แก้ไขบัค Shadow Hand Taunt & เพิ่มกลไก Halibel
    if (typeof window.initiateAttack === 'function') {
        const _origInitAtk = window.initiateAttack;
        window.initiateAttack = function(atkId, tgtId, isBase) {
            if (!isBase && typeof state !== 'undefined') {
                const atkKey = state.currentTurn;
                const defKey = atkKey === 'player' ? 'ai' : 'player';
                const attacker = state.players[atkKey].field.find(c => c.id === atkId);
                let target = state.players[defKey].field.find(c => c.id === tgtId);

                // 4.1. แก้ไข Shadow Hand Taunt
                const shadowHand = state.players[defKey].field.find(c => (c.originalName || c.name) === 'Shadow Hand' && c.hp > 0);
                if (shadowHand && target && target.id !== shadowHand.id) {
                    arguments[1] = shadowHand.id;
                    target = shadowHand;
                    if (typeof log === 'function') log(`🖐️ [Shadow Hand] มือมืดดึงดูดการโจมตี! รับดาเมจแทน!`, 'text-stone-400 font-bold');
                }

                // 4.2. Halibel Evade
                if (target && (target.originalName || target.name) === 'Halibel' && !target.silenced) {
                    const estimatedDmg = getCharStats(attacker).atk;
                    if (estimatedDmg > 3 && Math.random() < 0.5) {
                        if (typeof log === 'function') log(`🥷 [Halibel] การโจมตีแรงไป! นินจาหมาป่าพริ้วตัวหลบ 50% สำเร็จ!`, 'text-indigo-300 font-bold');
                        attacker.attacksLeft -= 1;
                        state.selectedCardId = null;
                        if (typeof updateUI === 'function') updateUI();
                        return;
                    }
                }

                // 4.3. Halibel Mark
                if (attacker && (attacker.originalName || attacker.name) === 'Halibel' && !attacker.silenced && Math.random() < 0.3) {
                    if (target) {
                        target._halibelMark = attacker.id;
                        if (typeof log === 'function') log(`🗡️ [Halibel] ฝากรอยแค้น! ${target.name} ติด Halibel Mark! (ATK เหลือ 1 และเสียเลือดทุกเทิร์น)`, 'text-indigo-400 font-bold');
                    }
                }
            }

            _origInitAtk.apply(this, arguments);
        };
    }

    // 5. กลไก Daphne (ลด Cost) และ Halibel Mark (ลด ATK)
    if (typeof window.getActualCost === 'function') {
        const _origGetActualCost = window.getActualCost;
        window.getActualCost = function(card, pk) {
            let cost = _origGetActualCost.apply(this, arguments);
            const eff = card.originalName || card.name;
            if (['Great Rabbit', 'Black Serpent', 'White Whale'].includes(eff)) {
                const hasDaphne = state.players[pk].field.some(c => (c.originalName || c.name) === 'Daphne' && c.hp > 0 && !c.silenced);
                if (hasDaphne) {
                    cost = Math.max(0, cost - 5);
                }
            }
            return cost;
        };
    }

    if (typeof window.getCharStats === 'function') {
        const _origGetCharStats = window.getCharStats;
        window.getCharStats = function(char) {
            // [FIX BUG] ดึง HP ดิบก่อนถูก clamp เพื่อป้องกันการอมตะ
            char.hp += 10000;
            let stats = _origGetCharStats.apply(this, arguments);
            stats.hp -= 10000;
            char.hp -= 10000;

            if (char._halibelMark) {
                stats.atk = 1;
            }
            if (state.sharedFieldCard && state.sharedFieldCard.name === 'Wild Kingdom' && char.isDungeonBoss2) {
                stats.atk += 2;
                stats.hp += 2;
                stats.maxHp += 2;
            }

            stats.hp = Math.max(0, stats.hp); // ตัดให้ต่ำสุดที่ 0 ในตอนจบ
            return stats;
        };
    }

    // 6. Halibel Mark Damage (End Turn)
    if (typeof window.resolveEndPhase === 'function') {
        const _origResolveEndPhase = window.resolveEndPhase;
        window.resolveEndPhase = function(pk) {
            _origResolveEndPhase.apply(this, arguments);
            const p = state.players[pk];
            p.field.forEach(c => {
                if (c._halibelMark) {
                    const haliOwner = pk === 'player' ? 'ai' : 'player';
                    const haliAlive = state.players[haliOwner].field.some(x => x.id === c._halibelMark && x.hp > 0);
                    if (haliAlive) {
                        c.hp -= 2;
                        if (typeof log === 'function') log(`🩸 [Halibel Mark] พิษบาดแผลกำเริบ! ${c.name} เสีย 2 HP`, 'text-indigo-400');
                    } else {
                        c._halibelMark = null;
                        if (typeof log === 'function') log(`💨 [Halibel Mark] คลายอาคม! Halibel ตายแล้ว`, 'text-gray-400');
                    }
                }
            });
            if (typeof checkDeath === 'function') checkDeath(pk);
        };
    }

    // 7. Julius On Summon (สุ่ม Spell)
    if (typeof window.triggerOnSummon === 'function') {
        const _origSummon = window.triggerOnSummon;
        window.triggerOnSummon = function(card, pk) {
            _origSummon.apply(this, arguments);
            const eff = card.originalName || card.name;
            if (eff === 'Julius' && !card.silenced) {
                const spells = ['Nia', 'Ikua', 'Ines'];
                const pick = spells[Math.floor(Math.random() * spells.length)];
                const sp = typeof createCardInstance === 'function' ? createCardInstance(pick, 'isekai_adventure') : null;
                if (sp) {
                    sp.cost = 0;
                    state.players[pk].hand.push(sp);
                    if (typeof log === 'function') log(`✨ [Julius] ระบำวิญญาณ! ดึงเวทมนตร์ ${pick} (Cost 0) ขึ้นมือ!`, 'text-yellow-400 font-bold');
                }
            }
        };
    }

    // 8. Spell ของ Julius (Nia, Ikua ใน resolveTargetedPlay / Ines ใน executeNonTargetAction)
    if (typeof window.resolveTargetedPlay === 'function') {
        const _origTgt = window.resolveTargetedPlay;
        window.resolveTargetedPlay = function(pk, srcId, tgtId) {
            const p = state.players[pk];
            const card = p.hand.find(c => c.id === srcId);

            if (card && (card.name === 'Nia' || card.name === 'Ikua')) {
                const oppKey = pk === 'player' ? 'ai' : 'player';
                const target = card.targetEnemy ? state.players[oppKey].field.find(c => c.id === tgtId) : p.field.find(c => c.id === tgtId);

                if (target) {
                    if (card.name === 'Nia') {
                        target.hp -= 3;
                        if (!target.status.includes('Burn') && !target.tossakanImmune) {
                            target.status.push('Burn');
                            target.burnTurns = 2;
                        }
                        if (typeof log === 'function') log(`🔥 [Nia] วิญญาณเพลิง! 3 ดาเมจ และ Burn 2 เทิร์น!`, 'text-red-400 font-bold');
                        if (typeof checkDeath === 'function') checkDeath(oppKey);
                    }
                    if (card.name === 'Ikua') {
                        target.maxHp += 4;
                        target.hp = target.maxHp;
                        if (typeof log === 'function') log(`🌿 [Ikua] วิญญาณพฤกษา! Heal เต็ม และเพิ่ม Max HP +4!`, 'text-lime-400 font-bold');
                    }

                    p.cost -= (typeof getActualCost === 'function' ? getActualCost(card, pk) : card.cost);
                    p.hand.splice(p.hand.indexOf(card), 1);
                    p.graveyard.push(card);
                    if (typeof cancelTargeting === 'function') cancelTargeting();
                    if (typeof updateUI === 'function') updateUI();
                    return;
                }
            }
            _origTgt.apply(this, arguments);
        };
    }

    if (typeof window.executeNonTargetAction === 'function') {
        const _origNonTgt = window.executeNonTargetAction;
        window.executeNonTargetAction = function(card, pk) {
            if (card.name === 'Ines') {
                const oppKey = pk === 'player' ? 'ai' : 'player';
                const enemies = state.players[oppKey].field.filter(c => getCharStats(c).hp > 0 && c.cost <= 8);
                if (enemies.length > 0) {
                    const target = enemies[Math.floor(Math.random() * enemies.length)];
                    target.hp = -99;
                    if (typeof log === 'function') log(`⚪ [Ines] วิญญาณแสง! ทำลาย ${target.name} ทันที!`, 'text-gray-300 font-bold');
                    if (typeof checkDeath === 'function') checkDeath(oppKey);
                } else {
                    if (typeof log === 'function') log(`⚪ [Ines] ไม่มีเป้าหมายที่ Cost <= 8`, 'text-gray-500');
                }
                state.players[pk].graveyard.push(card);
                return;
            }
            _origNonTgt.apply(this, arguments);
        };
    }

    // 9. เพิ่มดันเจี้ยนบอส White Whale ในหน้า UI
    if (typeof window.renderDungeonPanel === 'function') {
        const _origDungeon = window.renderDungeonPanel;
        window.renderDungeonPanel = function() {
            _origDungeon();
            const pnl = document.getElementById('hub-panel-dungeon');
            if (!pnl) return;

            const timeStr = "เหลือเวลาอีก 5 วัน";
            let deckOptions = playerData.decks.map(deck => `<option value="${deck.id}">${deck.name}</option>`).join('');
            if (!deckOptions) deckOptions = '<option value="">ไม่มีเด็คที่พร้อมเล่น</option>';

            const bannerHTML = `
            <!-- White Whale Banner -->
            <div style="background:linear-gradient(135deg, #1e293b, #0f172a); border:2px solid #cbd5e1; border-radius:20px; padding:20px; display:flex; gap:20px; box-shadow:0 0 30px rgba(203,213,225,0.2); margin-top:20px;">
                <div style="width:160px; height:220px; border-radius:12px; overflow:hidden; border:2px solid #e2e8f0; flex-shrink:0; box-shadow:0 0 20px rgba(226,232,240,0.3);">
                    <img src="https://file.garden/aeeLCXSsJxTPrRbp/file_00000000f4e071fa9791b97d3456c4f7.png" style="width:100%;height:100%;object-fit:cover;">
                </div>
                <div style="flex:1;">
                    <div style="color:#e2e8f0; font-weight:900; font-size:0.8rem; letter-spacing:1px; margin-bottom:4px;">🐋 LIMITED TIME EVENT</div>
                    <div style="font-size:2rem; font-weight:900; color:white; margin-bottom:4px; line-height:1;">White Whale & The Witches</div>
                    <div style="color:#9ca3af; font-size:0.85rem; margin-bottom:12px;">วาฬขาวแห่งหมอกและมหาบาป! สัมผัสความสิ้นหวัง 65 ใบ<br><b style="color:#4ade80;">ด่านนี้ *ไม่มีการ์ดแบน* จัดเต็มได้เลย!</b><br><b style="color:#f87171;">⏰ ${timeStr}</b></div>
                    <div style="background:rgba(0,0,0,0.5); padding:12px; border-radius:10px; border:1px solid #334155; margin-bottom:16px; font-size:0.85rem;">
                        <div style="color:#fbbf24; font-weight:900; margin-bottom:6px;">🏆 ของรางวัลการท้าทาย:</div>
                        <div style="display:grid;grid-template-columns:1fr;gap:8px;">
                            <div style="color:white;">💎 สุ่มรับ <b>1-5 Re:Zero Tokens</b> ${RZ_TOKEN_IMG}</div>
                            <div style="color:white;">✨ โอกาส 10%: รับการ์ด <b>Daphne</b> (Exclusive)</div>
                        </div>
                    </div>
                    <div style="display:flex; align-items:center; gap:10px;">
                        <select id="dungeon-deck-select-2" style="background:#1f2937; color:white; border:1px solid #4b5563; padding:12px; border-radius:10px; flex:1; font-size:0.9rem; font-weight:bold;">
                            ${deckOptions}
                        </select>
                        <button onclick="startDungeon_v2('white_whale')" style="background:linear-gradient(135deg, #475569, #334155); color:white; font-weight:900; padding:12px 24px; border-radius:10px; border:1px solid #94a3b8; cursor:pointer; font-size:1rem; box-shadow:0 0 15px rgba(148,163,184,0.4); white-space:nowrap;">
                            ⚔️ สู้บอส (ใช้ 2 🔑)
                        </button>
                    </div>
                </div>
            </div>`;

            const wrapper = pnl.querySelector('div[style*="max-width:800px"]');
            if (wrapper) {
                const warningBox = wrapper.querySelector('div[style*="rgba(239,68,68,0.1)"]');
                if (warningBox) {
                    const temp = document.createElement('div');
                    temp.innerHTML = bannerHTML;
                    wrapper.insertBefore(temp.firstElementChild, warningBox);
                } else {
                    wrapper.innerHTML += bannerHTML;
                }
            }
        };
    }

    // 10. ระบบเข้าเล่นดันเจี้ยน White Whale
    window.startDungeon_v2 = function(dungeonId) {
        if (dungeonId !== 'white_whale') return;

        const deckId = document.getElementById('dungeon-deck-select-2').value;
        const deck = playerData.decks.find(d => d.id === deckId);
        if (!deck) { showToast('❌ กรุณาสร้างและเลือกเด็คก่อน', '#f87171'); return; }

        if ((playerData.bossKeys || 0) < 2) { showToast('🔑 Boss Keys ไม่พอ! ต้องการ 2 อัน', '#f87171'); return; }

        playerData.bossKeys -= 2;
        saveData();

        const deckCards = (deck.cards || []).map(c => typeof c === 'string' ? { name: c, theme: deck.theme || 'isekai_adventure' } : c);

        _pendingCollectionDeck = deckCards;
        _collectionDeckUsed = false;
        _isRankedGame = false;
        window.gameMode = 'dungeon';
        window.currentDungeonId = dungeonId;

        document.getElementById('hub-screen').style.display = 'none';
        document.getElementById('game-screen').style.display = '';
        const ts = document.getElementById('theme-selector');
        if (ts) ts.style.display = 'none';

        const _origBuildDeck = window.buildDeck;
        window.buildDeck = function(theme) {
            if (theme === 'dungeon_boss') {
                const bossDeck = [];
                const makeBossCard = (name, t, exactCost, statDiff) => {
                    const c = typeof createCardInstance === 'function' ? createCardInstance(name, t) : null;
                    if (!c) return null;
                    if (exactCost !== null) c.cost = exactCost;
                    if (c.atk !== undefined) c.atk += statDiff;
                    if (c.hp !== undefined) c.hp += statDiff;
                    if (c.maxHp !== undefined) c.maxHp += statDiff;
                    c.isDungeonBoss2 = true;
                    return c; // เอา tossakanImmune ออกเพื่อให้ติดสถานะได้
                };

                // 20 White Whale (Cost 5, +2 stat)
                for (let i = 0; i < 20; i++) bossDeck.push(makeBossCard('White Whale', 'isekai_adventure', 5, 2));
                // 15 Great Rabbit (Cost 5, +2 stat)
                for (let i = 0; i < 15; i++) bossDeck.push(makeBossCard('Great Rabbit', 'easter', 5, 2));
                // 15 Black Serpent (Cost 5, +2 stat)
                for (let i = 0; i < 15; i++) bossDeck.push(makeBossCard('Black Serpent', 'isekai_adventure', 5, 2));
                // 5 Daphne (Cost 5, +2 stat)
                for (let i = 0; i < 5; i++) bossDeck.push(makeBossCard('Daphne', 'isekai_adventure', 5, 2));
                // 10 Wild Kingdom (Cost 5, +2 stat)
                for (let i = 0; i < 10; i++) bossDeck.push(makeBossCard('Wild Kingdom', 'animal_kingdom', 5, 2));

                return bossDeck.sort(() => Math.random() - 0.5);
            }
            return _origBuildDeck.call(this, theme);
        };

        selectedPlayerTheme = deck.theme || 'isekai_adventure';
        selectedAITheme = 'dungeon_boss';

        if (typeof resetAndInitGame !== 'undefined') resetAndInitGame();

        setTimeout(() => {
            const ai = state.players.ai;
            const boss = typeof createCardInstance === 'function' ? createCardInstance('White Whale', 'isekai_adventure') : null;
            if (boss) {
                boss.cost = 5;
                boss.atk += 2; boss.hp += 2; boss.maxHp += 2;
                boss.attacksLeft = 1;
                boss.isDungeonBoss2 = true; // เอา tossakanImmune ออก
                ai.field.push(boss);
                updateUI();
                if (typeof log === 'function') {
                    log(`🐋 หมอกขาวปกคลุม... White Whale ปรากฏตัว!`, 'text-sky-300 font-bold');
                }
            }
        }, 800);
    };

    // 10.5 Hook On Summon เพื่อให้มอนสเตอร์ที่เสกมาระหว่างเกม (เช่น Great Rabbit) ได้บัฟจาก Wild Kingdom แต่ไม่กันสถานะ
    if (typeof window.triggerOnSummon === 'function') {
        const _origSummonWW = window.triggerOnSummon;
        window.triggerOnSummon = function(card, pk) {
            if (window.gameMode === 'dungeon' && window.currentDungeonId === 'white_whale' && pk === 'ai') {
                card.isDungeonBoss2 = true; // ให้รับผลบัฟจาก Wild Kingdom อย่างเดียวพอ
            }
            _origSummonWW.apply(this, arguments);
        };
    }

    // 11. Hook End Game สำหรับดันเจี้ยน White Whale
    if (typeof window.endGame === 'function') {
        const _origEnd_ww = window.endGame;
        window.endGame = function(winner) {
            _origEnd_ww.apply(this, arguments);

            if (window.gameMode === 'dungeon' && window.currentDungeonId === 'white_whale') {
                if (winner === 'player') {
                    const tokens = Math.floor(Math.random() * 5) + 1;
                    playerData.rezeroTokens = (playerData.rezeroTokens || 0) + tokens;

                    let msg = `🎉 ชนะวาฬขาวสำเร็จ! ได้รับ ${tokens} Re:Zero Tokens`;

                    if (Math.random() < 0.10) {
                        playerData.collection['Daphne|isekai_adventure'] = (playerData.collection['Daphne|isekai_adventure'] || 0) + 1;
                        msg += " และการ์ดแม่มด 🌟 Daphne 🌟 1 ใบ!";
                    }
                    saveData();
                    if (typeof updateHubUI === 'function') updateHubUI();
                    setTimeout(() => showToast(msg, '#4ade80'), 1500);
                } else {
                    setTimeout(() => showToast("💀 ถูกวาฬขาวลบเลือนหายไป...", '#f87171'), 1500);
                }
                window.gameMode = 'ai';
            }
        };
    }

});

// ============================================================
// 31_rezero_normal_shop.js — Re:Zero Normal Shop & Separate Tokens
// วางต่อท้ายสุดของไฟล์
// ============================================================

const RZ_NORMAL_TOKEN_IMG = '<img src="https://file.garden/aeeLCXSsJxTPrRbp/1000038309-removebg-preview.png" style="width:1.2em;height:1.2em;vertical-align:-0.2em;display:inline-block;filter:drop-shadow(0 0 2px rgba(56,189,248,0.5));">';

document.addEventListener('DOMContentLoaded', () => {

    // 1. สร้างตัวแปร Normal Token สำหรับผู้เล่น
    if (typeof playerData !== 'undefined' && playerData.rzNormalTokens === undefined) {
        playerData.rzNormalTokens = 0;
    }

    // 2. ปรับ Artstyles ใหม่ให้ใช้ rz_normal currency
    if (typeof ARTSTYLE_CFG !== 'undefined') {
        const normalArts = ['petelgeuse_icecream', 'echidna_contract', 'garfiel_beast', 'fairy_mystic', 'chess_royal', 'pandora_white', 'roswaal_puppet'];
        normalArts.forEach(id => {
            if (ARTSTYLE_CFG[id]) ARTSTYLE_CFG[id].currency = 'rz_normal';
        });
    }

    // 3. ซ่อมแซมหน้า Re:Zero Premium Shop เดิม ให้มีเฉพาะของ Premium (แยก Daphne, Halibel, Julius ออก)
    if (typeof window.renderRezeroShop === 'function') {
        window.renderRezeroShop = function() {
            const ov = document.getElementById('_rezero-shop-overlay');
            if (!ov) return;

            const tk = playerData.rezeroTokens || 0;
            const gemsBought = playerData.rezeroGemsBought || 0;
            const bundleBought = playerData.rezeroBundleBought || false;

            const shopItems = [
                { id: 'Reid Astrea', type: 'card', cost: 35 },
                { id: 'Volcanica the Protecter Dragon', type: 'card', cost: 35 },
                { id: 'Aldebaran', type: 'card', cost: 15 },
                { id: 'Roswaal L. Mathers', type: 'card', cost: 15 },
                { id: 'bn_rezero', type: 'banner', cost: 20, label: 'Banner: Reinhard vs Volcanica' }
            ];

            const itemRows = shopItems.map(item => {
                let owned = 0, art = '', name = item.id, desc = '';
                if (item.type === 'card') {
                    owned = playerData.collection[`${item.id}|isekai_adventure`] || 0;
                    const cData = (CardSets['isekai_adventure'] && CardSets['isekai_adventure'][item.id]) || REZERO_CARDS[item.id];
                    art = cData.art;
                    desc = `Cost ${cData.cost} · ATK ${cData.atk}/HP ${cData.hp}`;
                } else {
                    owned = (playerData.unlockedCosmetics || []).includes(item.id) ? 1 : 0;
                    art = COSMETICS_CATALOG.banners.find(b => b.id === item.id).art;
                    desc = 'Profile Banner';
                    name = item.label;
                }

                const canBuy = tk >= item.cost;
                return `<div style="background:#1e1b4b;border:1.5px solid ${canBuy?'#a855f7':'#374151'};border-radius:12px;padding:10px;display:flex;align-items:center;gap:10px">
                  <img src="${art}" style="width:48px;height:58px;object-fit:cover;border-radius:6px;border:1px solid #4c1d95">
                  <div style="flex:1;min-width:0">
                    <div style="font-weight:900;color:white;font-size:0.8rem;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${name}</div>
                    <div style="font-size:0.6rem;color:#a78bfa;">${desc}</div>
                    <div style="font-size:0.55rem;color:#9ca3af;margin-top:2px">มีแล้ว: ${owned}</div>
                  </div>
                  <button onclick="buyRezeroItem('${item.id}', '${item.type}', ${item.cost})" ${canBuy?'':'disabled'}
                    style="background:${canBuy?'linear-gradient(135deg,#7c3aed,#4f46e5)':'#374151'};color:${canBuy?'white':'#9ca3af'};border:none;padding:8px 12px;border-radius:8px;font-weight:900;font-size:0.8rem;cursor:${canBuy?'pointer':'not-allowed'};min-width:60px">
                    ${RZ_TOKEN_IMG} ${item.cost}
                  </button>
                </div>`;
            }).join('');

            ov.innerHTML = `
            <div style="background:linear-gradient(135deg,#0d0b2e,#1a0b2e);border:2.5px solid #a855f7;border-radius:24px;padding:20px;max-width:440px;width:100%;max-height:90vh;overflow-y:auto;box-shadow:0 0 50px rgba(168,85,247,0.3)">
              <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:16px">
                <div><div style="font-size:1.3rem;font-weight:900;color:#c084fc">${RZ_TOKEN_IMG} Re:Zero Premium Shop</div></div>
                <div style="background:#1f2937;border:1px solid #a855f7;border-radius:10px;padding:6px 12px;text-align:center">
                  <div style="font-size:0.55rem;color:#9ca3af">Premium Token</div>
                  <div style="font-size:1.1rem;font-weight:900;color:#c084fc" id="modal-rz-tk">${tk}</div>
                </div>
              </div>

              <div style="background:#1e1b4b;border:1.5px dashed #8b5cf6;border-radius:12px;padding:12px;margin-bottom:16px;display:flex;align-items:center;gap:12px">
                <div style="font-size:2rem">💎</div>
                <div style="flex:1">
                  <div style="font-weight:900;color:#ddd;font-size:0.8rem">สุ่มรับ 1-20 Premium Tokens!</div>
                  <div style="font-size:0.65rem;color:#a78bfa">ใช้ 20 Gems (ซื้อได้ 5 ครั้ง)</div>
                  <div style="font-size:0.6rem;color:#9ca3af;margin-top:2px">ซื้อไปแล้ว ${gemsBought}/5 ครั้ง</div>
                </div>
                <button onclick="buyTokensWithGems()" ${gemsBought >= 5 ? 'disabled' : ''} style="background:${gemsBought >= 5 ? '#374151' : 'linear-gradient(135deg,#0284c7,#2563eb)'};color:white;border:none;padding:8px 12px;border-radius:8px;font-weight:900;font-size:0.8rem;cursor:${gemsBought >= 5 ? 'not-allowed' : 'pointer'}">
                  20 💎
                </button>
              </div>

              <div style="background:linear-gradient(135deg,#310000,#000000);border:2px solid #ef4444;border-radius:12px;padding:12px;margin-bottom:16px;display:flex;align-items:center;gap:12px;box-shadow:0 0 15px rgba(239,68,68,0.2)">
                <img src="${(CardSets['isekai_adventure'] && CardSets['isekai_adventure']['Black Serpent']) ? CardSets['isekai_adventure']['Black Serpent'].art : REZERO_CARDS['Black Serpent'].art}" style="width:48px;height:58px;border-radius:6px;border:1px solid #f87171;object-fit:cover">
                <div style="flex:1">
                  <div style="font-weight:900;color:#fca5a5;font-size:0.85rem">🐍 Black Serpent Bundle</div>
                  <div style="font-size:0.6rem;color:#f87171">รับการ์ด Black Serpent + กรอบ Return by Death <span style="color:#c084fc;font-weight:bold;"><br>+ ${RZ_TOKEN_IMG} 35 Premium Tokens</span></div>
                  <div style="font-size:0.55rem;color:#9ca3af;margin-top:2px">ซื้อได้ครั้งเดียวเท่านั้น!</div>
                </div>
                <button onclick="buyRezeroBundle()" ${bundleBought ? 'disabled' : ''} style="background:${bundleBought ? '#374151' : 'linear-gradient(135deg,#dc2626,#991b1b)'};color:white;border:none;padding:8px 12px;border-radius:8px;font-weight:900;font-size:0.8rem;cursor:${bundleBought ? 'not-allowed' : 'pointer'}">
                  ${bundleBought ? '✅ มีแล้ว' : '80 💎'}
                </button>
              </div>

              <div style="display:flex;flex-direction:column;gap:8px;margin-bottom:16px">${itemRows}</div>

              <button onclick="document.getElementById('_rezero-shop-overlay').remove()" style="width:100%;background:#374151;color:#9ca3af;border:none;padding:12px;border-radius:10px;font-weight:bold;cursor:pointer">✕ ปิด</button>
            </div>`;
        };
    }

    // 4. แก้ไข Unified Artstyle Shop ให้รองรับ rz_normal
    if (typeof window.renderUnifiedArtstyleShop === 'function') {
        const _origArtShop = window.renderUnifiedArtstyleShop;
        window.renderUnifiedArtstyleShop = function() {
            _origArtShop();
            const ov = document.getElementById('_artstyle-overlay');
            if (!ov) return;

            const tkRow = ov.querySelector('div[style*="display:flex;gap:6px"]');
            if (tkRow) {
                const nTokenDiv = document.createElement('div');
                nTokenDiv.style.cssText = 'background:#1f2937;border:1px solid #38bdf8;border-radius:10px;padding:5px 8px;text-align:center';
                nTokenDiv.innerHTML = `<div style="font-size:0.5rem;color:#9ca3af">Normal</div>
                <div style="font-size:0.8rem;font-weight:900;color:#38bdf8">${RZ_NORMAL_TOKEN_IMG} ${playerData.rzNormalTokens || 0}</div>`;
                tkRow.prepend(nTokenDiv);
            }

            const buttons = ov.querySelectorAll('button');
            buttons.forEach(btn => {
                if (btn.innerHTML.includes('undefined')) {
                    const costMatch = btn.getAttribute('onclick') && btn.getAttribute('onclick').match(/'([^']+)'/);
                    if (costMatch) {
                        const id = costMatch[1];
                        const cfg = ARTSTYLE_CFG[id];
                        if (cfg && cfg.currency === 'rz_normal') {
                            const canBuy = (playerData.rzNormalTokens || 0) >= (cfg.shopCost || 10);
                            btn.innerHTML = `${RZ_NORMAL_TOKEN_IMG} ${cfg.shopCost || 10}`;
                            if (!canBuy) {
                                btn.disabled = true;
                                btn.style.background = '#374151';
                                btn.style.color = '#6b7280';
                                btn.style.cursor = 'not-allowed';
                            }
                        }
                    }
                }
            });
        };
    }

    if (typeof window.buyUnifiedArtstyle === 'function') {
        const _origBuyArt = window.buyUnifiedArtstyle;
        window.buyUnifiedArtstyle = function(id) {
            const cfg = ARTSTYLE_CFG[id];
            if (cfg && cfg.currency === 'rz_normal') {
                if ((playerData.rzNormalTokens || 0) < cfg.shopCost) { showToast('🔮 Normal Token ไม่พอ!', '#f87171'); return; }
                playerData.rzNormalTokens -= cfg.shopCost;
                playerData.unlockedArtstyles.push(id);
                if (typeof _applyArtstyle === 'function' && (playerData.equippedArtstyles || {})[cfg.targetCard] === id) _applyArtstyle(id);
                saveData(); updateHubUI(); renderUnifiedArtstyleShop();
                showToast(`🎨 ปลดล็อค "${cfg.label}"!`, '#4ade80');
                return;
            }
            _origBuyArt.apply(this, arguments);
        };
    }

    // 5. แทรกปุ่ม Normal Shop ในหน้า Home
    function _injectRezeroNormalBanner() {
        const homePanel = document.getElementById('hub-panel-home');
        if (!homePanel) return;
        if (document.getElementById('_rz-normal-shop-banner')) return;

        const btn = document.createElement('div');
        btn.id = '_rz-normal-shop-banner';
        btn.style.cssText = 'padding:0 16px;max-width:640px;margin:8px auto 0;';
        btn.innerHTML = `
          <button onclick="openRezeroNormalShop()"
            style="width:100%;background:linear-gradient(135deg,#082f49,#0f172a);
                   border:1.5px solid #38bdf8;border-radius:14px;padding:12px 16px;
                   display:flex;align-items:center;gap:10px;cursor:pointer;text-align:left;box-shadow:0 0 15px rgba(56,189,248,0.2);">
            <div style="font-size:1.6rem">${RZ_NORMAL_TOKEN_IMG}</div>
            <div style="flex:1">
              <div style="font-weight:900;color:#7dd3fc;font-size:0.9rem">Re:Zero Normal Shop</div>
              <div style="font-size:0.65rem;color:#38bdf8">แลกรับการ์ดใหม่ด้วย Token จากบอสวาฬขาว!</div>
            </div>
            <div style="background:#1f2937;border:1px solid #38bdf8;border-radius:10px;padding:6px 10px;text-align:center;">
              <div style="font-size:0.55rem;color:#9ca3af">Normal Token</div>
              <div id="_rz-normal-token-cnt" style="font-size:1rem;font-weight:900;color:#38bdf8">${playerData.rzNormalTokens || 0}</div>
            </div>
          </button>`;

        const ref = document.getElementById('_rezero-shop-banner') || homePanel.firstChild;
        if (ref && ref.parentNode) {
            ref.parentNode.insertBefore(btn, ref.nextSibling);
        } else {
            homePanel.appendChild(btn);
        }
    }

    if (typeof window.renderHomePanel === 'function') {
        const _origRenderHomeRN = window.renderHomePanel;
        window.renderHomePanel = function() {
            _origRenderHomeRN.apply(this, arguments);
            setTimeout(_injectRezeroNormalBanner, 100);
        };
    }
    setTimeout(_injectRezeroNormalBanner, 1500);

    // 6. อัปเดตรางวัลดันเจี้ยน White Whale ให้ดรอป Normal Token แทน
    if (typeof window.endGame === 'function') {
        const _origEnd_ww_fix = window.endGame;
        window.endGame = function(winner) {
            if (window.gameMode === 'dungeon' && window.currentDungeonId === 'white_whale') {
                _origEnd_ww_fix.apply(this, arguments);
                if (winner === 'player') {
                    const tokens = Math.floor(Math.random() * 5) + 1;
                    playerData.rzNormalTokens = (playerData.rzNormalTokens || 0) + tokens;

                    let msg = `🎉 ชนะวาฬขาวสำเร็จ! ได้รับ ${tokens} Normal Tokens`;

                    if (Math.random() < 0.10) {
                        playerData.collection['Daphne|isekai_adventure'] = (playerData.collection['Daphne|isekai_adventure'] || 0) + 1;
                        msg += " และ 🌟 Daphne 🌟 1 ใบ!";
                    }
                    saveData();
                    if (typeof updateHubUI === 'function') updateHubUI();
                    setTimeout(() => showToast(msg, '#38bdf8'), 1500);
                }
                window.gameMode = 'ai';
                return;
            }
            _origEnd_ww_fix.apply(this, arguments);
        };
    }
});

// ─── RE:ZERO NORMAL SHOP UI ───
window.openRezeroNormalShop = function() {
    const ov = document.createElement('div');
    ov.id = '_rezero-normal-shop-overlay';
    ov.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,0.92);z-index:3200;display:flex;align-items:center;justify-content:center;padding:12px;overflow-y:auto';
    ov.onclick = e => { if (e.target === ov) ov.remove(); };
    document.body.appendChild(ov);
    renderRezeroNormalShop();
};

window.renderRezeroNormalShop = function() {
    const ov = document.getElementById('_rezero-normal-shop-overlay');
    if (!ov) return;

    const tk = playerData.rzNormalTokens || 0;

    const shopItems = [
        { id: 'Daphne', type: 'card', cost: 50 },
        { id: 'Halibel', type: 'card', cost: 25 },
        { id: 'Julius', type: 'card', cost: 25 }
    ];

    const itemRows = shopItems.map(item => {
        const owned = playerData.collection[`${item.id}|isekai_adventure`] || 0;
        const cData = (CardSets['isekai_adventure'] && CardSets['isekai_adventure'][item.id]) || NEW_REZERO_CARDS[item.id];
        const art = cData.art;
        const desc = `Cost ${cData.cost} · ATK ${cData.atk}/HP ${cData.hp}`;
        const canBuy = tk >= item.cost;

        return `<div style="background:#0f172a;border:1.5px solid ${canBuy?'#38bdf8':'#374151'};border-radius:12px;padding:10px;display:flex;align-items:center;gap:10px">
          <img src="${art}" style="width:48px;height:58px;object-fit:cover;border-radius:6px;border:1px solid #0369a1">
          <div style="flex:1;min-width:0">
            <div style="font-weight:900;color:white;font-size:0.8rem;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${item.id}</div>
            <div style="font-size:0.6rem;color:#7dd3fc;">${desc}</div>
            <div style="font-size:0.55rem;color:#9ca3af;margin-top:2px">มีแล้ว: ${owned}</div>
          </div>
          <button onclick="buyRezeroNormalItem('${item.id}', '${item.type}', ${item.cost})" ${canBuy?'':'disabled'}
            style="background:${canBuy?'linear-gradient(135deg,#0284c7,#2563eb)':'#374151'};color:${canBuy?'white':'#9ca3af'};border:none;padding:8px 12px;border-radius:8px;font-weight:900;font-size:0.8rem;cursor:${canBuy?'pointer':'not-allowed'};min-width:60px">
            ${RZ_NORMAL_TOKEN_IMG} ${item.cost}
          </button>
        </div>`;
    }).join('');

    ov.innerHTML = `
    <div style="background:linear-gradient(135deg,#082f49,#020617);border:2.5px solid #38bdf8;border-radius:24px;padding:20px;max-width:440px;width:100%;max-height:90vh;overflow-y:auto;box-shadow:0 0 50px rgba(56,189,248,0.3)">
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:16px">
        <div><div style="font-size:1.3rem;font-weight:900;color:#7dd3fc">${RZ_NORMAL_TOKEN_IMG} Re:Zero Normal Shop</div></div>
        <div style="background:#1f2937;border:1px solid #38bdf8;border-radius:10px;padding:6px 12px;text-align:center">
          <div style="font-size:0.55rem;color:#9ca3af">Normal Token</div>
          <div style="font-size:1.1rem;font-weight:900;color:#38bdf8" id="modal-rz-normal-tk">${tk}</div>
        </div>
      </div>

      <div style="background:rgba(56,189,248,0.1);border:1px solid #0284c7;border-radius:10px;padding:8px;margin-bottom:16px;font-size:0.65rem;color:#7dd3fc;text-align:center;">
        ⚔️ Normal Tokens หาได้จากการเอาชนะดันเจี้ยน <b>White Whale</b> เท่านั้น!
      </div>

      <div style="display:flex;flex-direction:column;gap:8px;margin-bottom:16px">${itemRows}</div>

      <button onclick="renderUnifiedArtstyleShop()" style="width:100%;background:linear-gradient(135deg,#0f172a,#1e293b);color:#38bdf8;border:1px solid #0284c7;padding:10px;border-radius:10px;font-weight:bold;margin-bottom:12px;cursor:pointer">🎨 ดู Artstyle Shop ทั้งหมด</button>

      <button onclick="document.getElementById('_rezero-normal-shop-overlay').remove()" style="width:100%;background:#374151;color:#9ca3af;border:none;padding:12px;border-radius:10px;font-weight:bold;cursor:pointer">✕ ปิด</button>
    </div>`;
};

window.buyRezeroNormalItem = function(id, type, cost) {
    if ((playerData.rzNormalTokens || 0) < cost) { showToast('🔮 Normal Token ไม่พอ!', '#f87171'); return; }
    playerData.rzNormalTokens -= cost;

    if (type === 'card') {
        playerData.collection[`${id}|isekai_adventure`] = (playerData.collection[`${id}|isekai_adventure`] || 0) + 1;
        showToast(`🃏 ได้รับการ์ด ${id}!`, '#38bdf8');
    }
    saveData(); updateHubUI(); renderRezeroNormalShop();
    const cnt = document.getElementById('_rz-normal-token-cnt');
    if (cnt) cnt.textContent = playerData.rzNormalTokens;
};

// ============================================================
// UPDATE: Re:Zero Evolve & Advanced Enhance System
// ============================================================
document.addEventListener('DOMContentLoaded', () => {
    // 1. เพิ่มการ์ดใหม่
    const REZERO_EVOLVED = {
        'Subaru v2': {
            name: 'Subaru v2', type: 'Character', cost: 4, atk: 1, hp: 1, maxHp: 1,
            text: 'On Death: ได้รับ +1 ATK / +1 HP ถาวร จากนั้นกลับขึ้นมือด้วย Cost 0',
            color: 'bg-purple-900', maxAttacks: 1,
            art: 'https://images5.alphacoders.com/949/thumb-440-949062.webp', _theme: 'isekai_adventure'
        },
        'Ram (The Awakened Oni Goddess)': {
            name: 'Ram (The Awakened Oni Goddess)', type: 'Character', cost: 9, atk: 4, hp: 5, maxHp: 5,
            text: 'On Summon: ได้รับการ์ดเวท El Fula, Bloodline Link และ Hura ขึ้นมือ',
            color: 'bg-pink-600', maxAttacks: 1,
            art: 'https://file.garden/aeeLCXSsJxTPrRbp/file_0000000043d07208a8e2a47ecc0d63b3.png', _theme: 'isekai_adventure'
        },
        'Reinhard (Full Power)': {
            name: 'Reinhard (Full Power)', type: 'Character', cost: 9, atk: 5, hp: 10, maxHp: 10,
            text: 'Ongoing: อมตะต่อดาเมจและเอฟเฟกต์จาก Spell/Action | จบเทิร์น: สุ่มรับพร +3 | ตาย: 50% คืนชีพเต็ม',
            color: 'bg-yellow-500', maxAttacks: 1,
            art: 'https://file.garden/aeeLCXSsJxTPrRbp/file_000000000c4c720baae0b7d33bd5e011.png', _theme: 'isekai_adventure'
        },
        // Spells for Ram
        'El Fula': { name: 'El Fula', type: 'Spell', cost: 3, text: 'Ram ของคุณเสีย 4 HP เพื่อทำ 10 ดาเมจใส่ศัตรูสุ่ม 1 ตัว (ใช้ไม่ได้หากไม่มี Ram)', color: 'bg-pink-400', requiresTarget: false, _theme: 'isekai_adventure', shopOnly: true },
        'Bloodline Link': { name: 'Bloodline Link', type: 'Spell', cost: 5, text: 'ทำดาเมจใส่ศัตรูทั้งหมด เท่ากับ ATK รวมของ Ram และ Rem บนสนามของคุณ', color: 'bg-rose-500', requiresTarget: false, _theme: 'isekai_adventure', shopOnly: true },
        'Hura': { name: 'Hura', type: 'Spell', cost: 3, text: 'ทำ 2 ดาเมจใส่ศัตรูสุ่ม 1 ตัว หากเป้าหมายไม่ตาย จะเด้งกลับขึ้นมือศัตรู และ Cost +5', color: 'bg-pink-300', requiresTarget: false, _theme: 'isekai_adventure', shopOnly: true }
    };
    if (typeof CardSets !== 'undefined') Object.assign(CardSets['isekai_adventure'], REZERO_EVOLVED);

    // ==========================================
    // 2. เพิ่มสูตร Enhance (เปลี่ยนไปใช้ rzNormalTokens)
    // ==========================================
    if (typeof ENHANCE_RECIPES !== 'undefined') {
        Object.assign(ENHANCE_RECIPES, {
            'Subaru v2': {
                baseCard: 'Subaru|isekai_adventure',
                materials:[{ name: 'Subaru', theme: 'isekai_adventure', count: 9 }, { name: 'Beatrice', theme: 'isekai_adventure', count: 1 }, { name: 'Emilia', theme: 'isekai_adventure', count: 1 }],
                gems: 0, coins: 0, rzNormalTokens: 25, result: 'Subaru v2|isekai_adventure'
            },
            'Ram (The Awakened Oni Goddess)': {
                baseCard: 'Ram|isekai_adventure',
                materials:[{ name: 'Ram', theme: 'isekai_adventure', count: 9 }, { name: 'Rem', theme: 'isekai_adventure', count: 10 }],
                gems: 0, coins: 2200, rzNormalTokens: 22, result: 'Ram (The Awakened Oni Goddess)|isekai_adventure'
            },
            'Reinhard (Full Power)': {
                baseCard: 'Reinhard|isekai_adventure',
                materials:[{ name: 'Reinhard', theme: 'isekai_adventure', count: 4 }],
                gems: 10, coins: 3000, rzNormalTokens: 40, result: 'Reinhard (Full Power)|isekai_adventure'
            }
        });
    }

    // ==========================================
    // 3. ทับระบบ Enhance UI ให้รองรับ Normal Tokens
    // ==========================================
    if (typeof window.openEnhanceModal === 'function') {
        window.openEnhanceModal = function(recipeKey) {
            const recipe = ENHANCE_RECIPES[recipeKey];
            const targetTheme = recipe.result.split('|')[1];
            const targetData = CardSets[targetTheme][recipeKey];
            const ownedBase = playerData.collection[recipe.baseCard] || 0;

            const hasMats = recipe.materials.every(m => (playerData.collection[`${m.name}|${m.theme}`]||0) >= m.count);
            const hasCoins = (playerData.coins||0) >= (recipe.coins||0);
            const hasGems = (playerData.gems||0) >= (recipe.gems||0);
            // เปลี่ยนมาเช็ค rzNormalTokens
            const hasNormalTk = recipe.rzNormalTokens ? ((playerData.rzNormalTokens||0) >= recipe.rzNormalTokens) : true;
            const canDo = (ownedBase >= 1 && hasCoins && hasGems && hasNormalTk && hasMats);

            const ov = document.createElement('div');
            ov.id = 'enhance-overlay';
            ov.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,0.9);z-index:100000;display:flex;align-items:center;justify-content:center;';
            ov.innerHTML = `
                <div style="background:linear-gradient(135deg,#1e1b4b,#0f172a);border:3px solid #7c3aed;border-radius:24px;padding:24px;max-width:380px;width:90%;text-align:center;">
                    <div style="font-size:1.5rem;font-weight:900;color:#a78bfa;margin-bottom:15px">✨ Card Evolution ✨</div>
                    <img src="${targetData.art}" style="width:120px;height:160px;border-radius:10px;border:2px solid #fbbf24;margin-bottom:10px;object-fit:cover">
                    <div style="color:white;font-weight:bold;margin-bottom:10px">${recipeKey}</div>
                    <div style="background:rgba(0,0,0,0.3);padding:10px;border-radius:10px;margin-bottom:10px;text-align:left;font-size:0.8rem">
                        ${recipe.materials.map(m => `<div style="color:${(playerData.collection[`${m.name}|${m.theme}`]||0) >= m.count ? '#4ade80':'#f87171'}">📦 ${m.name} : ${(playerData.collection[`${m.name}|${m.theme}`]||0)}/${m.count}</div>`).join('')}
                        ${recipe.coins > 0 ? `<div style="color:${hasCoins ? '#fbbf24':'#f87171'}">🪙 Coins: ${playerData.coins}/${recipe.coins}</div>` : ''}
                        ${recipe.gems > 0 ? `<div style="color:${hasGems ? '#93c5fd':'#f87171'}">💎 Gems: ${playerData.gems}/${recipe.gems}</div>` : ''}
                        ${recipe.rzNormalTokens > 0 ? `<div style="color:${hasNormalTk ? '#38bdf8':'#f87171'}">💠 Normal Tokens: ${(playerData.rzNormalTokens||0)}/${recipe.rzNormalTokens}</div>` : ''}
                    </div>
                    <div style="display:flex;gap:10px">
                        <button onclick="confirmEnhance('${recipeKey}')" ${canDo ? '' : 'disabled'} style="flex:1;background:${canDo?'#7c3aed':'#374151'};color:white;padding:12px;border-radius:10px;border:none;font-weight:bold;cursor:pointer">อัปเกรด</button>
                        <button onclick="document.getElementById('enhance-overlay').remove()" style="flex:1;background:#4b5563;color:white;padding:12px;border-radius:10px;border:none;cursor:pointer">ยกเลิก</button>
                    </div>
                </div>`;
            document.body.appendChild(ov);
        };

        window.confirmEnhance = function(recipeKey) {
            const recipe = ENHANCE_RECIPES[recipeKey];
            playerData.collection[recipe.baseCard]--;
            if (playerData.collection[recipe.baseCard] <= 0) delete playerData.collection[recipe.baseCard];
            recipe.materials.forEach(m => {
                const key = `${m.name}|${m.theme}`;
                playerData.collection[key] -= m.count;
                if (playerData.collection[key] <= 0) delete playerData.collection[key];
            });
            if (recipe.coins) playerData.coins -= recipe.coins;
            if (recipe.gems) playerData.gems -= recipe.gems;

            // หักเหรียญ rzNormalTokens แทน
            if (recipe.rzNormalTokens) playerData.rzNormalTokens -= recipe.rzNormalTokens;

            playerData.collection[recipe.result] = (playerData.collection[recipe.result] || 0) + 1;

            saveData(); updateHubUI(); renderCollectionPanel();
            document.getElementById('enhance-overlay').remove();
            document.getElementById('col-card-modal')?.remove();
            showToast(`🎉 อัปเกรดเป็น ${recipeKey} สำเร็จ!`, '#fbbf24');
        };
    }

    // 4. ระบบ Spells, Immunity และเวทของ Ram
    if (typeof window.executeNonTargetAction === 'function') {
        const _origNonTarget_RZ = window.executeNonTargetAction;
        window.executeNonTargetAction = function(card, pk) {
            const eff = card.originalName || card.name;
            const p = state.players[pk];
            const oppKey = pk === 'player' ? 'ai' : 'player';
            const opp = state.players[oppKey];

            if (eff === 'El Fula') {
                const ram = p.field.find(c => (c.originalName || c.name).includes('Ram') && getCharStats(c).hp > 0);
                if (!ram) {
                    if (typeof log === 'function') log(`🌪️ [El Fula] ล้มเหลว! ไม่มี Ram บนสนาม`, 'text-pink-300');
                    return;
                }
                ram.hp -= 4;
                const enemies = opp.field.filter(c => getCharStats(c).hp > 0 && !c.isSpellImmune);
                if (enemies.length > 0) {
                    const target = enemies[Math.floor(Math.random() * enemies.length)];
                    target.hp -= 10;
                    if (typeof log === 'function') log(`🌪️ [El Fula] วายุทำลายล้าง! ${target.name} โดน 10 ดาเมจ (Ram เสีย 4 HP)`, 'text-pink-500 font-bold');
                    if (typeof checkDeath === 'function') { checkDeath(oppKey); checkDeath(pk); }
                }
                p.graveyard.push(card);
                return;
            }
            if (eff === 'Bloodline Link') {
                const rams = p.field.filter(c => (c.originalName || c.name).includes('Ram') && getCharStats(c).hp > 0);
                const rems = p.field.filter(c => (c.originalName || c.name).includes('Rem') && getCharStats(c).hp > 0);
                let totalDmg = 0;
                rams.forEach(c => totalDmg += getCharStats(c).atk);
                rems.forEach(c => totalDmg += getCharStats(c).atk);

                opp.field.forEach(c => {
                    if (!c.isSpellImmune && getCharStats(c).hp > 0) c.hp -= totalDmg;
                });
                if (typeof log === 'function') log(`🔗 [Bloodline Link] พลังสายเลือดฝาแฝด! ศัตรูทั้งหมดโดน ${totalDmg} ดาเมจ`, 'text-rose-500 font-bold');
                p.graveyard.push(card);
                if (typeof checkDeath === 'function') checkDeath(oppKey);
                return;
            }
            if (eff === 'Hura') {
                const enemies = opp.field.filter(c => getCharStats(c).hp > 0 && !c.isSpellImmune);
                if (enemies.length > 0) {
                    const target = enemies[Math.floor(Math.random() * enemies.length)];
                    target.hp -= 2;
                    if (typeof log === 'function') log(`💨 [Hura] ยิง 2 ดาเมจใส่ ${target.name}`, 'text-pink-300 font-bold');

                    if (target.hp > 0) {
                        const idx = opp.field.findIndex(c => c.id === target.id);
                        if (idx !== -1) {
                            const bounced = opp.field.splice(idx, 1)[0];
                            bounced.costReducer = (bounced.costReducer || 0) - 5;
                            bounced.hp = bounced.maxHp; bounced.status = []; bounced.attacksLeft = 0;
                            opp.hand.push(bounced);
                            if (typeof log === 'function') log(`💨 [Hura] ${bounced.name} ไม่ตาย! ถูกพัดกลับขึ้นมือและ Cost +5`, 'text-pink-400 font-bold');
                        }
                    } else {
                        if (typeof checkDeath === 'function') checkDeath(oppKey);
                    }
                }
                p.graveyard.push(card);
                return;
            }

            _origNonTarget_RZ.apply(this, arguments);
        };
    }

    // 5. ระบบ On Summon (Reinhard FP Immunity + Ram รับเวท)
    if (typeof window.triggerOnSummon === 'function') {
        const _origSummon_RZ = window.triggerOnSummon;
        window.triggerOnSummon = function(card, pk) {
            const eff = card.originalName || card.name;
            if (eff === 'Reinhard (Full Power)') card.isSpellImmune = true;

            if (eff === 'Ram (The Awakened Oni Goddess)') {
                const mkSp = (n) => ({ id: 'card_' + (cardIdCounter++), name: n, originalName: n, type: 'Spell', cost: REZERO_EVOLVED[n].cost, text: REZERO_EVOLVED[n].text, color: REZERO_EVOLVED[n].color, _theme: 'isekai_adventure' });
                state.players[pk].hand.push(mkSp('El Fula'), mkSp('Bloodline Link'), mkSp('Hura'));
                if (typeof log === 'function') log(`👹 [Ram] ลืมตาตื่น! ได้รับเวท El Fula, Bloodline Link, Hura`, 'text-pink-500 font-bold');
            }
            _origSummon_RZ.apply(this, arguments);
        };
    }

    // 6. การตายของ Subaru v2 & Reinhard FP
    if (typeof window.checkDeath === 'function') {
        const _origDeath_RZ = window.checkDeath;
        window.checkDeath = function(pk) {
            const p = state.players[pk];
            for (let i = p.field.length - 1; i >= 0; i--) {
                let c = p.field[i];
                if (getCharStats(c).hp <= 0 && !c.isDyingProcessing) {
                    const effName = c.originalName || c.name;

                    if (effName === 'Subaru v2') {
                        c.isDyingProcessing = true;
                        c.atk += 1; c.maxHp += 1; c.hp = c.maxHp;
                        c.costReducer = c.cost;
                        p.field.splice(i, 1);
                        p.hand.push(c);
                        if (typeof log === 'function') log(`💜 [Subaru v2] ตายแล้วกลับมาแกร่งขึ้น! (+1/+1) กลับเข้ามือ Cost 0`, 'text-purple-400 font-bold');
                        continue;
                    }
                    if (effName === 'Reinhard (Full Power)' && !c._reinhardFpRevived) {
                        if (Math.random() < 0.5) {
                            c.hp = c.maxHp; c.status = []; c._reinhardFpRevived = true; c.isDyingProcessing = false;
                            if (typeof log === 'function') log(`⚔️ [Reinhard] ฟีนิกซ์คืนชีพ! รอดตายด้วยพลังของนักบุญดาบ!`, 'text-yellow-400 font-bold');
                            continue;
                        }
                    }
                }
            }
            _origDeath_RZ.apply(this, arguments);
        };
    }

    // ป้องกันเวทมนตร์ล็อกเป้าหมายใส่ Reinhard FP
    if (typeof window.resolveTargetedPlay === 'function') {
        const _origResolveTarget_RZ = window.resolveTargetedPlay;
        window.resolveTargetedPlay = function(playerKey, sourceCardId, targetCharId) {
            const p = state.players[playerKey];
            const card = p.hand.find(c => c.id === sourceCardId);
            const oppKey = playerKey === 'player' ? 'ai' : 'player';
            const targetChar = card?.targetEnemy ? state.players[oppKey].field.find(c => c.id === targetCharId) : p.field.find(c => c.id === targetCharId);

            if (card && card.type === 'Spell' && targetChar && targetChar.isSpellImmune) {
                if (typeof alert === 'function' && playerKey === 'player') alert('เป้าหมายมีพลังต้านทานเวทมนตร์อย่างสมบูรณ์ (Immune)!');
                if (typeof cancelTargeting === 'function') cancelTargeting();
                return;
            }
            _origResolveTarget_RZ.apply(this, arguments);
        };
    }
});

// ============================================================
// HOTFIX: ป้องกันการ์ด Evolve และสกิลเวทมนตร์ หลุดไปอยู่ในตู้สุ่ม Pack ปกติ
// ============================================================
document.addEventListener('DOMContentLoaded', () => {
    const evolvedAndSpells = [
        // JJK
        'Gojo Satoru (Shibuya Station)', 'Ryomen Sukuna (Full Power)',
        'Ao (Evolved)', 'Aka (Evolved)', 'Murasaki (Evolved)', 'Unlimited Void',
        'Cleave (Evolved)', 'Summon Mahoraga',
        // Re:Zero
        'Subaru v2', 'Ram (The Awakened Oni Goddess)', 'Reinhard (Full Power)',
        'El Fula', 'Bloodline Link', 'Hura'
    ];

    if (typeof CardSets !== 'undefined') {
        evolvedAndSpells.forEach(name => {
            if (CardSets['jjk'] && CardSets['jjk'][name]) {
                CardSets['jjk'][name].shopOnly = true;
            }
            if (CardSets['isekai_adventure'] && CardSets['isekai_adventure'][name]) {
                CardSets['isekai_adventure'][name].shopOnly = true;
            }
        });
    }
});
