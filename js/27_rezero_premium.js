// ============================================================
// 27_rezero_premium.js — Premium Re:Zero Token Shop & Mechanics
// ============================================================

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

document.addEventListener('DOMContentLoaded', () => {
    // 1. Initialize Player Data
    if (typeof playerData !== 'undefined') {
        if (playerData.rezeroTokens === undefined) playerData.rezeroTokens = 0;
        if (playerData.rezeroGemsBought === undefined) playerData.rezeroGemsBought = 0;
        if (playerData.rezeroBundleBought === undefined) playerData.rezeroBundleBought = false;
    }

    // 2. Inject Cards into Database & Filter out of packs
    if (typeof CardSets !== 'undefined' && CardSets['isekai_adventure']) {
        // Add new cards
        Object.entries(REZERO_CARDS).forEach(([k, v]) => {
            CardSets['isekai_adventure'][k] = JSON.parse(JSON.stringify(v));
        });

        // Mark Puck as shopOnly to prevent standard pack drops
        if (CardSets['isekai_adventure']['Puck']) {
            CardSets['isekai_adventure']['Puck'].shopOnly = true;
        }

        // Patch getSetCardPool to exclude shopOnly cards
        if (typeof getSetCardPool === 'function') {
            const _origGetPool = window.getSetCardPool;
            window.getSetCardPool = function(setName) {
                return _origGetPool(setName).filter(c => !c.data?.shopOnly);
            };
        }
        // Patch openReadyPack to exclude shopOnly
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

    // 3. Inject Cosmetics
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

    // 4. Inject UI Button
    setTimeout(() => {
        const homePanel = document.getElementById('hub-panel-home');
        if (!homePanel) return;
        const btn = document.createElement('div');
        btn.id = '_rezero-shop-banner';
        btn.style.cssText = 'padding:0 16px;max-width:640px;margin:8px auto 0;';
        btn.innerHTML = `
          <button onclick="openRezeroShop()"
            style="width:100%;background:linear-gradient(135deg,#2e1065,#1e1b4b);
                   border:1.5px solid #a855f7;border-radius:14px;padding:12px 16px;
                   display:flex;align-items:center;gap:10px;cursor:pointer;text-align:left;box-shadow:0 0 15px rgba(168,85,247,0.3);">
            <span style="font-size:1.6rem">🔮</span>
            <div style="flex:1">
              <div style="font-weight:900;color:#c084fc;font-size:0.9rem">Re:Zero Premium Shop</div>
              <div style="font-size:0.65rem;color:#a855f7">แลกเปลี่ยน Premium Token รับการ์ดสุดแกร่ง</div>
            </div>
            <div style="background:#1f2937;border:1px solid #c084fc;border-radius:10px;padding:6px 10px;text-align:center;">
              <div style="font-size:0.55rem;color:#9ca3af">Token</div>
              <div id="_rz-token-cnt" style="font-size:1rem;font-weight:900;color:#c084fc">${playerData.rezeroTokens || 0}</div>
            </div>
          </button>`;
        const ref = document.getElementById('_rod-shop-banner') || homePanel.firstChild;
        if (ref && ref.parentNode) ref.parentNode.insertBefore(btn, ref.nextSibling);
    }, 1000);

    // 5. Inject Redeem Code
    if (typeof REDEEM_CODES !== 'undefined') {
        REDEEM_CODES['REZERO'] = { gems: 10, rezeroTokens: 10, label: '🔮 Re:Zero Premium Tokens', oneTime: true };
    }
    if (typeof redeemCode === 'function') {
        const _origRZRedeem = window.redeemCode;
        window.redeemCode = function() {
            const raw = document.getElementById('redeem-input')?.value?.trim().toUpperCase().replace(/\s+/g,'');
            const reward = (typeof REDEEM_CODES !== 'undefined') ? REDEEM_CODES[raw] : null;
            if (reward && reward.rezeroTokens) {
                const used = typeof getUsedCodes === 'function' ? getUsedCodes() : [];
                const msg = document.getElementById('redeem-msg');
                if (reward.oneTime && used.includes(raw)) {
                    if (msg) { msg.style.color='#f87171'; msg.textContent='❌ โค้ดนี้ใช้ไปแล้ว'; } return;
                }
                playerData.rezeroTokens = (playerData.rezeroTokens || 0) + reward.rezeroTokens;
                if (reward.gems) playerData.gems = (playerData.gems || 0) + reward.gems;
                if (typeof saveData === 'function') saveData();
                if (typeof markCodeUsed === 'function') markCodeUsed(raw);
                if (typeof updateHubUI === 'function') updateHubUI();
                if (msg) { msg.style.color='#c084fc'; msg.textContent=`🎉 ได้รับ ${reward.label}!`; }
                document.getElementById('redeem-input').value = '';
                const cnt = document.getElementById('_rz-token-cnt');
                if (cnt) cnt.textContent = playerData.rezeroTokens;
                return;
            }
            _origRZRedeem.apply(this, arguments);
        };
    }

    // 6. Game Mechanics Hooks
    _hookRezeroMechanics();
});

// ─── RE:ZERO SHOP UI ───
function openRezeroShop() {
    const ov = document.createElement('div');
    ov.id = '_rezero-shop-overlay';
    ov.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,0.92);z-index:3200;display:flex;align-items:center;justify-content:center;padding:12px;overflow-y:auto';
    ov.onclick = e => { if (e.target === ov) ov.remove(); };
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
            🔮 ${item.cost}
          </button>
        </div>`;
    }).join('');

    ov.innerHTML = `
    <div style="background:linear-gradient(135deg,#0d0b2e,#1a0b2e);border:2.5px solid #a855f7;border-radius:24px;padding:20px;max-width:440px;width:100%;max-height:90vh;overflow-y:auto;box-shadow:0 0 50px rgba(168,85,247,0.3)">
      
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:16px">
        <div><div style="font-size:1.3rem;font-weight:900;color:#c084fc">🔮 Re:Zero Shop</div></div>
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
          <div style="font-size:0.6rem;color:#f87171">รับการ์ด Black Serpent + กรอบ Return by Death</div>
          <div style="font-size:0.55rem;color:#9ca3af;margin-top:2px">ซื้อได้ครั้งเดียวเท่านั้น!</div>
        </div>
        <button onclick="buyRezeroBundle()" ${bundleBought ? 'disabled' : ''} style="background:${bundleBought ? '#374151' : 'linear-gradient(135deg,#dc2626,#991b1b)'};color:white;border:none;padding:8px 12px;border-radius:8px;font-weight:900;font-size:0.8rem;cursor:${bundleBought ? 'not-allowed' : 'pointer'}">
          ${bundleBought ? '✅ มีแล้ว' : '80 💎'}
        </button>
      </div>

      <!-- Items -->
      <div style="display:flex;flex-direction:column;gap:8px;margin-bottom:16px">${itemRows}</div>
      
      <button onclick="renderArtstyleShopOverlay()" style="width:100%;background:linear-gradient(135deg,#1e1b4b,#2e1065);color:#c084fc;border:1px solid #a855f7;padding:10px;border-radius:10px;font-weight:bold;margin-bottom:12px;cursor:pointer">🎨 สกิน Re:Zero ใน Artstyle Shop (5 🔮)</button>

      <button onclick="document.getElementById('_rezero-shop-overlay').remove()" style="width:100%;background:#374151;color:#9ca3af;border:none;padding:12px;border-radius:10px;font-weight:bold;cursor:pointer">✕ ปิด</button>
    </div>`;
}

window.buyTokensWithGems = function() {
    if ((playerData.rezeroGemsBought || 0) >= 5) return;
    if (playerData.gems < 20) { showToast('💎 Gems ไม่พอ!', '#f87171'); return; }
    playerData.gems -= 20;
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
    if (playerData.gems < 80) { showToast('💎 Gems ไม่พอ!', '#f87171'); return; }
    playerData.gems -= 80;
    playerData.rezeroBundleBought = true;
    playerData.collection['Black Serpent|isekai_adventure'] = (playerData.collection['Black Serpent|isekai_adventure'] || 0) + 1;
    if (!playerData.unlockedCosmetics) playerData.unlockedCosmetics = [];
    if (!playerData.unlockedCosmetics.includes('fr_rbd')) playerData.unlockedCosmetics.push('fr_rbd');
    saveData(); updateHubUI(); renderRezeroShop();
    showToast(`🐍 ได้รับ Black Serpent & กรอบ Return by Death!`, '#4ade80');
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

    // 2. Volcanica Immunity Wrapper (Protect Volcanica from Non-Target / Summons)
    function protectVolcanica(actionFn, contextArgs) {
        if (typeof state === 'undefined') return actionFn.apply(this, contextArgs);

        // Find all Volcanicas
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

        // Restore if HP dropped
        volcanicas.forEach(v => {
            if (v.card.hp < v.hp && v.card.hp > -99) {
                v.card.hp = v.hp;
                if (typeof log === 'function') log(`🐉 [Volcanica] พลังเวทไม่ระคายผิวข้า! (Immune)`, 'text-sky-300 font-bold');
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

            if (attacker && target && typeof getCharStats !== 'undefined') {
                const aName = (attacker.name.startsWith('Shadow Token') || attacker.name.startsWith('Shadow army') || attacker.name.includes('Loki Clone')) ? attacker.originalName : attacker.name;

                // Reid Astrea x3 Chance
                if (aName === 'Reid Astrea' && getCharStats(target).hp > 6 && Math.random() < 0.5 && !attacker.silenced) {
                    attacker.atk *= 3;
                    attacker._reidBoosted = true;
                    if (typeof log === 'function') log(`⚔️ [Reid Astrea] วิถีดาบทะลวงสวรรค์! x3 DMG!`, 'text-red-400 font-bold');
                }

                // Volcanica Find
                const volcanica = state.players[defKey].field.find(c => {
                    const n = (c.name.startsWith('Shadow Token') || c.name.startsWith('Shadow army') || c.name.includes('Loki Clone')) ? c.originalName : c.name;
                    return n === 'Volcanica the Protecter Dragon' && c.hp > 0 && !c.silenced && c.id !== target.id;
                });

                if (volcanica) {
                    target._volcanicaProtecting = volcanica;
                }

                _origAttack.apply(this, arguments);

                // Clean up Reid Boost
                if (attacker._reidBoosted) {
                    attacker.atk = Math.round(attacker.atk / 3);
                    attacker._reidBoosted = false;
                }
            } else {
                _origAttack.apply(this, arguments);
            }
        };
    }

    // 4. checkDeath (Aldebaran Revive, Roswaal Discard, Black Serpent Revive, Reid Death)
    if (typeof window.checkDeath === 'function') {
        const _origDeath = window.checkDeath;
        window.checkDeath = function(playerKey) {
            const p = state.players[playerKey];
            const oppKey = playerKey === 'player' ? 'ai' : 'player';

            // Find Aldebaran
            const aldebaran = p.field.find(c => {
                const n = (c.name.startsWith('Shadow Token') || c.name.startsWith('Shadow army') || c.name.includes('Loki Clone')) ? c.originalName : c.name;
                return n === 'Aldebaran' && c.hp > 0 && !c.silenced;
            });

            for (let i = p.field.length - 1; i >= 0; i--) {
                let c = p.field[i];
                if (getCharStats(c).hp <= 0 && !c.isDyingProcessing) {
                    const effName = (c.name.startsWith('Shadow Token') || c.name.startsWith('Shadow army') || c.name.includes('Loki Clone')) ? c.originalName : c.name;

                    // Black Serpent Revive
                    if (effName === 'Black Serpent' && !c._blackSerpentRevived) {
                        c.hp = 2;
                        c.maxHp = 2;
                        c.atk = 3;
                        c._blackSerpentRevived = true;
                        c.status = [];
                        if (typeof log === 'function') log(`🐍[Black Serpent] คืนชีพจากเงามืด! (3/2)`, 'text-gray-400 font-bold');
                        continue;
                    }

                    // Aldebaran Revive Ally
                    if (aldebaran && aldebaran.id !== c.id && !aldebaran._aldebaranUsedThisTurn) {
                        aldebaran._aldebaranUsedThisTurn = true;
                        c.hp = c.maxHp;
                        c.status = [];
                        c.isDyingProcessing = false;
                        if (typeof log === 'function') log(`🌟 [Aldebaran] Al-Dona! ย้อนเวลาความตายให้ ${c.name}!`, 'text-orange-400 font-bold');
                        continue;
                    }

                    // Aldebaran Death -> Hand Cost 4
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

                    // Reid Death -> 2 DMG all enemies
                    if (effName === 'Reid Astrea') {
                        if (typeof log === 'function') log(`⚔️ [Reid Astrea] "ถึงตาข้าพักบ้าง... รับนี่ไปซะ!" ดาเมจ 2 ใส่ศัตรูทั้งหมด`, 'text-red-500 font-bold');
                        state.players[oppKey].field.forEach(ec => { ec.hp -= 2; });
                    }

                    // Roswaal Death -> Discard 1 enemy hand
                    if (effName === 'Roswaal L. Mathers') {
                        if (state.players[oppKey].hand.length > 0) {
                            const idx = Math.floor(Math.random() * state.players[oppKey].hand.length);
                            const discarded = state.players[oppKey].hand.splice(idx, 1)[0];
                            state.players[oppKey].graveyard.push(discarded);
                            if (typeof log === 'function') log(`🃏 [Roswaal] พังทลายคาถา... ทิ้งการ์ด ${discarded.name} ของศัตรู!`, 'text-purple-400 font-bold');
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

    // 6. Volcanica Redirect & Post-Attack effects (Roswaal, Black Serpent)
    if (typeof window.initiateAttack === 'function') {
        const _origAttack2 = window.initiateAttack;
        window.initiateAttack = function(attackerId, targetId, targetIsBase) {
            if (targetIsBase) return _origAttack2.apply(this, arguments);

            const atkKey = state.currentTurn;
            const defKey = atkKey === 'player' ? 'ai' : 'player';
            const attacker = state.players[atkKey].field.find(c => c.id === attackerId);
            const target = state.players[defKey].field.find(c => c.id === targetId);

            if (!attacker || !target) return _origAttack2.apply(this, arguments);

            const startHp = target.hp;

            // Volcanica Find
            const volcanica = state.players[defKey].field.find(c => {
                const n = (c.name.startsWith('Shadow Token') || c.name.startsWith('Shadow army') || c.name.includes('Loki Clone')) ? c.originalName : c.name;
                return n === 'Volcanica the Protecter Dragon' && c.hp > 0 && !c.silenced && c.id !== target.id;
            });

            _origAttack2.apply(this, arguments);

            // Calculate exact damage dealt
            const dmgDealt = startHp - target.hp;

            if (dmgDealt > 0 && volcanica) {
                // Redirect!
                target.hp = startHp;
                const redirected = Math.max(1, Math.floor(dmgDealt * 0.2));
                volcanica.hp -= redirected;
                if (typeof log === 'function') log(`🐉 [Volcanica] ปีกมังกรป้องภัย! รับดาเมจ ${redirected} แทน ${target.name}`, 'text-sky-300 font-bold');
                if (volcanica.hp <= 0) checkDeath(defKey);
            }

            // Post Attack Abilities
            const aName = (attacker.name.startsWith('Shadow Token') || attacker.name.startsWith('Shadow army') || attacker.name.includes('Loki Clone')) ? attacker.originalName : attacker.name;

            if (aName === 'Roswaal L. Mathers' && !attacker.silenced && dmgDealt > 0) {
                if (state.players[atkKey].field.length >= 5) {
                    if (typeof log === 'function') log(`🔥 [Roswaal] มนตราเพลิงผลาญหมู่! Splash 5 DMG ศัตรูทุกตัว!`, 'text-purple-500 font-bold');
                    state.players[defKey].field.forEach(c => c.hp -= 5);
                    checkDeath(defKey);
                }
            }

            if (aName === 'Black Serpent' && !attacker.silenced && dmgDealt > 0 && target.hp > 0) {
                if (!target.status.includes('Bleed')) target.status.push('Bleed');
                if (!target.status.includes('Burn')) target.status.push('Burn');
                if (!target.status.includes('Poison')) target.status.push('Poison');
                target.shalltearBleedTurns = 1;
                target.burnTurns = 1;
                if (typeof log === 'function') log(`🐍 [Black Serpent] พิษร้าย 3 สาย! (Bleed/Burn/Poison) 1 เทิร์น!`, 'text-green-500 font-bold');
            }
        };
    }

    // 7. On Summon Abilities (Roswaal, Black Serpent)
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
                if (typeof log === 'function') log(`🐍 [Black Serpent] ละอองพิษแห่งงูดำ! ศัตรูทั้งหมดติด Poison 2 เทิร์น!`, 'text-green-500 font-bold');
                state.players[oppKey].field.forEach(c => {
                    if (!c.tossakanImmune && !hasNatureImmune(oppKey)) {
                        if (!c.status.includes('Poison')) c.status.push('Poison');
                    }
                });
            }
        };
    }
}
