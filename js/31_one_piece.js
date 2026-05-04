// ============================================================
// 31_one_piece.js — One Piece Mini Pack (Limited Edition)
// ============================================================
// ราคา: 1000 🪙 ต่อครั้ง | ซื้อได้สูงสุด 5 ครั้ง | หมดอายุใน 5 วัน
// การ์ดทุกใบติดสถานะ shopOnly (ไม่ออกจาก Pack ปกติ)
// ============================================================

// ─── CONSTANTS ───────────────────────────────────────────────────
const OP_PACK_COST    = 1000;
const OP_PACK_MAX_BUY = 5;
const OP_PACK_EXPIRY_MS = 5 * 24 * 60 * 60 * 1000; // 5 วัน

// ─── CARD DEFINITIONS ────────────────────────────────────────────
const ONE_PIECE_CARDS = {

    'Eustass Kid': {
        name: 'Eustass Kid', type: 'Character', cost: 8, atk: 5, hp: 5, maxHp: 5,
        text: 'On Summon: รับ 1 Metal Stack | On Attack: รับ 2 Metal Stack | On Get Attack: 50% รับ 1 Metal Stack | เมื่อมี 3 Metal Stack: ทำ 10 ดาเมจใส่ศัตรูสุ่ม 1 ตัว แล้ว Stack รีเซ็ต',
        color: 'bg-red-900', maxAttacks: 1, shopOnly: true,
        art: 'https://file.garden/aeeLCXSsJxTPrRbp/f8cc8d47475194fab1bcd214ae4b6463.jpg',
        _theme: 'one_piece'
    },

    'Ryokugyu': {
        name: 'Ryokugyu', type: 'Character', cost: 9, atk: 2, hp: 9, maxHp: 9,
        text: 'On Summon: ใส่ "Vine Trap" ให้ศัตรู 2 ตัวสุ่ม 2 เทิร์น (ใส่ Item ไม่ได้, โจมตีไม่ได้) | On Get Attack: ฮีล 2 HP | Ongoing: +3 MaxHp ทุกครั้งที่ศัตรูเล่นการ์ด Cost > 5',
        color: 'bg-green-900', maxAttacks: 1, shopOnly: true,
        art: 'https://file.garden/aeeLCXSsJxTPrRbp/aec3bf5909ceed0cd001c116ecdc7c10.jpg',
        _theme: 'one_piece'
    },

    'God Baki': {
        name: 'God Baki', type: 'Character', cost: 6, atk: 3, hp: 6, maxHp: 6,
        text: 'On Reveal: เรียก 1 Character Cost 3-5 จากเด็คขึ้นสนาม (ถ้าไม่มี: ได้ +4 Cost) | Ongoing: รับ 0 ดาเมจจาก Character ศัตรูที่สวมใส่ Item',
        color: 'bg-amber-700', maxAttacks: 1, shopOnly: true,
        art: 'https://file.garden/aeeLCXSsJxTPrRbp/70eb6ea1b3fd27ce95794e03de887805.jpg',
        _theme: 'one_piece'
    },

    'King the Wildfire': {
        name: 'King the Wildfire', type: 'Character', cost: 8, atk: 4, hp: 7, maxHp: 7,
        text: 'On Summon: สุ่มรับ Speed Mode (+7 ATK/-2 HP) หรือ Tank Mode (+3 HP/-2 ATK, ลดดาเมจ 50%) | On Attack (Tank): 50% สลับ Speed | On Get Attack (Speed): 50% สลับ Tank',
        color: 'bg-orange-800', maxAttacks: 1, shopOnly: true,
        art: 'https://file.garden/aeeLCXSsJxTPrRbp/8ff966c09040b99394c57942ea8c352c.jpg',
        _theme: 'one_piece'
    },

    'Yamato': {
        name: 'Yamato', type: 'Character', cost: 8, atk: 4, hp: 4, maxHp: 4,
        text: 'จบเทิร์น: 60% แปลงร่างเป็น Okuchi no Makami (+5 HP/+5 ATK) | เมื่อแปลงร่าง: แช่แข็ง 3 ศัตรูสุ่ม 1 เทิร์น | On Attack (แปลงร่าง): แช่แข็งเป้า 2 เทิร์น | On Get Attack (แปลงร่าง): ลดดาเมจ 2 + แช่แข็งผู้โจมตี 2 เทิร์น',
        color: 'bg-sky-800', maxAttacks: 1, shopOnly: true,
        art: 'https://file.garden/aeeLCXSsJxTPrRbp/hunter%20xhunter/3bc92f9736c73810afbb179081169437.jpg',
        _theme: 'one_piece'
    }
};

const OP_CARD_NAMES = Object.keys(ONE_PIECE_CARDS);

// ─── HELPER: apply freeze ─────────────────────────────────────────
function opApplyFreeze(card, turns) {
    if (!card || !card.status) return;
    if (!card.status.includes('Freeze')) card.status.push('Freeze');
    card.freezeTurns = Math.max(card.freezeTurns || 0, turns * 2); // x2 เพราะ turn counting ใช้ half-turns
    card.attacksLeft = 0;
}

// ─── HELPER: Metal Stack trigger ─────────────────────────────────
function opCheckMetalStack(card, playerKey) {
    if ((card.metalStack || 0) < 3) return;
    const oppKey = playerKey === 'player' ? 'ai' : 'player';
    const opp = state.players[oppKey];
    const targets = opp.field.filter(c => getCharStats(c).hp > 0);
    if (targets.length > 0) {
        const target = targets[Math.floor(Math.random() * targets.length)];
        target.hp -= 10;
        if (typeof log === 'function') log(`⚙️ [Eustass Kid] Metal Stack x3! ${target.name} โดน 10 ดาเมจ!`, 'text-red-400 font-bold');
        if (typeof checkDeath === 'function') checkDeath(oppKey);
    } else {
        if (typeof log === 'function') log(`⚙️ [Eustass Kid] Metal Stack x3! ไม่มีเป้าหมายศัตรู`, 'text-red-300');
    }
    card.metalStack = 0;
}

// ─── HELPER: apply VineTrap ──────────────────────────────────────
function opApplyVineTrap(card) {
    if (!card || !card.status) return;
    if (!card.status.includes('VineTrap')) card.status.push('VineTrap');
    card.vineTrapTurns = 4; // x2 เพราะ half-turns (2 เทิร์นเต็ม)
    card.attacksLeft = 0;
}

// ─── HELPER: King mode switch ────────────────────────────────────
function opKingSwitchToSpeed(card) {
    if (card.kingMode === 'speed') return;
    // ถอด Tank stats
    card.atk  += 7; // +7 DMG (Speed)
    card.hp   -= 2; // -2 HP  (Speed)
    card.maxHp -= 2;
    card.hp    = Math.min(card.hp, card.maxHp);
    card.damageReduce = Math.max(0, (card.damageReduce || 0) - Math.floor(card.hp * 0)); // ถอด Tank reduce
    card._kingTankReduce = false;
    card.kingMode = 'speed';
    if (typeof log === 'function') log(`🔥 [King] สลับเป็น Speed Mode! ATK +7 / HP -2`, 'text-orange-300 font-bold');
}

function opKingSwitchToTank(card) {
    if (card.kingMode === 'tank') return;
    // ถอด Speed stats
    card.atk  -= 7; // -7 DMG
    card.hp   += 2; // +2 HP
    card.maxHp += 2;
    card._kingTankReduce = true;
    card.kingMode = 'tank';
    if (typeof log === 'function') log(`🛡️ [King] สลับเป็น Tank Mode! ATK -7 / HP +2 + ลดดาเมจ 50%`, 'text-orange-400 font-bold');
}

// ─── EXPIRY CHECK ─────────────────────────────────────────────────
function opIsPackAvailable() {
    if (typeof playerData === 'undefined') return false;
    if (!playerData.opPackExpiry) {
        // ตั้งค่า Expiry ครั้งแรกที่เข้าถึง
        playerData.opPackExpiry = Date.now() + OP_PACK_EXPIRY_MS;
        if (typeof saveData === 'function') saveData();
    }
    return Date.now() < playerData.opPackExpiry;
}

function opGetExpiryText() {
    if (typeof playerData === 'undefined' || !playerData.opPackExpiry) return '';
    const msLeft = playerData.opPackExpiry - Date.now();
    if (msLeft <= 0) return '⏰ หมดอายุแล้ว';
    const daysLeft  = Math.floor(msLeft / (24 * 60 * 60 * 1000));
    const hoursLeft = Math.floor((msLeft % (24 * 60 * 60 * 1000)) / (60 * 60 * 1000));
    if (daysLeft > 0) return `⏳ เหลือ ${daysLeft} วัน ${hoursLeft} ชม.`;
    return `⏳ เหลือ ${hoursLeft} ชม.`;
}

// ─── SHOP: OPEN OVERLAY ───────────────────────────────────────────
window.openOnePieceMiniShop = function() {
    const available   = opIsPackAvailable();
    const bought      = playerData.opPackBought || 0;
    const canBuy      = available && bought < OP_PACK_MAX_BUY && playerData.coins >= OP_PACK_COST;
    const expiryText  = opGetExpiryText();

    // ─── Card Rows ──────────────────────────────────────────────
    const cardRows = OP_CARD_NAMES.map(name => {
        const cd = ONE_PIECE_CARDS[name];
        const owned = (playerData.collection[`${name}|isekai_adventure`] || 0);
        return `
        <div style="background:#0f172a;border:1.5px solid #f97316;border-radius:14px;padding:10px;display:flex;align-items:flex-start;gap:10px;margin-bottom:8px">
            <div style="width:56px;height:70px;flex-shrink:0;border-radius:8px;overflow:hidden;border:2px solid #f97316;background:#1f2937"><img src="${cd.art}" style="width:100%;height:100%;object-fit:cover" onerror="this.parentElement.innerHTML='🏴‍☠️'"></div>
            <div style="flex:1;min-width:0">
                <div style="font-weight:900;color:#fb923c;font-size:0.88rem">${name}</div>
                <div style="font-size:0.58rem;color:#9ca3af;margin:2px 0">${cd.text}</div>
                <div style="font-size:0.65rem;color:#fbbf24">Cost ${cd.cost} | HP ${cd.hp} | ATK ${cd.atk} ${owned > 0 ? `<span style="color:#4ade80;font-weight:900"> ✅ มีแล้ว ×${owned}</span>` : ''}</div>
            </div>
        </div>`;
    }).join('');

    let ov = document.getElementById('_op-shop-overlay');
    if (!ov) {
        ov = document.createElement('div');
        ov.id = '_op-shop-overlay';
        ov.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,0.92);z-index:3600;display:flex;align-items:center;justify-content:center;padding:12px;overflow-y:auto';
        ov.onclick = e => { if (e.target === ov) ov.remove(); };
        document.body.appendChild(ov);
    }

    ov.innerHTML = `
    <div style="background:linear-gradient(135deg,#0c0a00,#1a0e00);border:2.5px solid #f97316;
         border-radius:24px;padding:20px 16px;max-width:440px;width:100%;
         max-height:90vh;overflow-y:auto;box-shadow:0 0 60px rgba(249,115,22,0.4)">

        <!-- Header -->
        <div style="display:flex;align-items:center;gap:10px;margin-bottom:16px">
            <div style="font-size:2.2rem">🏴‍☠️</div>
            <div style="flex:1">
                <div style="font-size:1.1rem;font-weight:900;color:#fb923c">One Piece Mini Pack</div>
                <div style="font-size:0.62rem;color:#9ca3af">แพ็คจำกัดเวลา — การ์ดสุดแกร่งจากโลก Grand Line!</div>
            </div>
            <div style="background:#1f2937;border:1px solid #f97316;border-radius:10px;padding:5px 10px;text-align:center">
                <div style="font-size:0.5rem;color:#9ca3af">เหรียญ</div>
                <div style="font-size:0.9rem;font-weight:900;color:#fbbf24">🪙 ${(playerData.coins || 0).toLocaleString()}</div>
            </div>
        </div>

        <!-- Status Bar -->
        <div style="background:#1a0e00;border:1px solid #f97316;border-radius:12px;padding:10px 12px;margin-bottom:14px;display:flex;justify-content:space-between;align-items:center">
            <div>
                <div style="font-size:0.7rem;color:#fb923c;font-weight:700">${available ? '🟢 แพ็คพร้อมใช้' : '🔴 แพ็คหมดอายุแล้ว'}</div>
                <div style="font-size:0.62rem;color:#9ca3af;margin-top:2px">${expiryText}</div>
            </div>
            <div style="text-align:right">
                <div style="font-size:0.6rem;color:#9ca3af">ซื้อไปแล้ว</div>
                <div style="font-size:0.9rem;font-weight:900;color:${bought >= OP_PACK_MAX_BUY ? '#f87171' : '#4ade80'}">${bought} / ${OP_PACK_MAX_BUY}</div>
            </div>
        </div>

        <!-- Buy Button -->
        <div style="background:linear-gradient(135deg,#431407,#7c2d12);border:2px solid #f97316;border-radius:16px;padding:14px;margin-bottom:16px;display:flex;align-items:center;gap:12px">
            <div style="font-size:2.5rem">🎴</div>
            <div style="flex:1">
                <div style="font-weight:900;color:#fb923c;font-size:0.95rem">สุ่ม 1 การ์ด One Piece</div>
                <div style="font-size:0.65rem;color:#fed7aa;margin-top:2px">การ์ดทุกใบ shopOnly | ไม่ออกจากแพ็คปกติ</div>
                <div style="font-size:0.75rem;color:#fbbf24;font-weight:900;margin-top:4px">🪙 ${OP_PACK_COST.toLocaleString()}</div>
            </div>
            <button onclick="buyOnePieceMiniPack()"
                ${canBuy ? '' : 'disabled'}
                style="background:${canBuy ? 'linear-gradient(135deg,#ea580c,#dc2626)' : '#374151'};
                       color:${canBuy ? 'white' : '#6b7280'};
                       border:none;padding:10px 16px;border-radius:12px;
                       font-weight:900;font-size:0.85rem;
                       cursor:${canBuy ? 'pointer' : 'not-allowed'};
                       white-space:nowrap">
                ${!available ? '⏰ หมดอายุ' : bought >= OP_PACK_MAX_BUY ? '✅ ครบแล้ว' : playerData.coins < OP_PACK_COST ? '💸 ไม่พอ' : '🏴‍☠️ ซื้อ!'}
            </button>
        </div>

        <!-- Cards List -->
        <div style="margin-bottom:14px">
            <div style="font-size:0.75rem;font-weight:900;color:#f97316;margin-bottom:8px">📋 การ์ดในแพ็ค (${OP_CARD_NAMES.length} ใบ)</div>
            ${cardRows}
        </div>

        <button onclick="document.getElementById('_op-shop-overlay').remove()"
            style="width:100%;background:#374151;color:#9ca3af;border:none;padding:11px;border-radius:10px;font-weight:bold;cursor:pointer">
            ✕ ปิด
        </button>
    </div>`;
};

// ─── SHOP: BUY PACK ──────────────────────────────────────────────
window.buyOnePieceMiniPack = function() {
    if (!opIsPackAvailable()) {
        if (typeof showToast === 'function') showToast('⏰ แพ็คนี้หมดอายุแล้ว!', '#f87171');
        return;
    }
    const bought = playerData.opPackBought || 0;
    if (bought >= OP_PACK_MAX_BUY) {
        if (typeof showToast === 'function') showToast(`❌ ซื้อครบ ${OP_PACK_MAX_BUY} ครั้งแล้ว!`, '#f87171');
        return;
    }
    if (playerData.coins < OP_PACK_COST) {
        if (typeof showToast === 'function') showToast(`💸 เหรียญไม่พอ! ต้องการ 🪙 ${OP_PACK_COST.toLocaleString()}`, '#f87171');
        return;
    }

    playerData.coins -= OP_PACK_COST;
    playerData.opPackBought = (playerData.opPackBought || 0) + 1;

    // สุ่มการ์ด 1 ใบ
    const pickedName = OP_CARD_NAMES[Math.floor(Math.random() * OP_CARD_NAMES.length)];
    const collKey    = `${pickedName}|isekai_adventure`;
    playerData.collection[collKey] = (playerData.collection[collKey] || 0) + 1;

    if (typeof saveData === 'function') saveData();
    if (typeof updateHubUI === 'function') updateHubUI();

    const cd = ONE_PIECE_CARDS[pickedName];

    // ─── Reveal overlay ──────────────────────────────────────────
    const revOv = document.createElement('div');
    revOv.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,0.95);z-index:4000;display:flex;align-items:center;justify-content:center;padding:16px;animation:fadeIn 0.3s ease';
    revOv.innerHTML = `
    <div style="background:linear-gradient(135deg,#431407,#1a0e00);border:3px solid #f97316;
         border-radius:24px;padding:28px 20px;max-width:380px;width:100%;text-align:center;
         box-shadow:0 0 80px rgba(249,115,22,0.6)">
        <div style="font-size:2rem;margin-bottom:6px">🏴‍☠️</div>
        <div style="font-size:1.3rem;font-weight:900;color:#fb923c;margin-bottom:4px">ได้การ์ดใหม่!</div>
        <div style="font-size:0.7rem;color:#9ca3af;margin-bottom:18px">One Piece Mini Pack</div>

        <!-- Card Display -->
        <div style="background:#0f172a;border:3px solid #f97316;border-radius:16px;
             padding:16px;margin-bottom:16px;box-shadow:0 0 30px rgba(249,115,22,0.4)">
            <div style="width:120px;height:150px;margin:0 auto 10px;border-radius:12px;overflow:hidden;border:2px solid #f97316;background:#1f2937"><img src="${cd.art}" style="width:100%;height:100%;object-fit:cover" onerror="this.parentElement.innerHTML='🏴‍☠️'"></div>
            <div style="font-size:1.1rem;font-weight:900;color:#fb923c;margin-bottom:4px">${pickedName}</div>
            <div style="font-size:0.65rem;color:#9ca3af;margin-bottom:8px;line-height:1.5">${cd.text}</div>
            <div style="display:flex;justify-content:center;gap:16px">
                <span style="background:#1f2937;border-radius:8px;padding:4px 10px;font-size:0.75rem;color:#60a5fa">💰 Cost ${cd.cost}</span>
                <span style="background:#1f2937;border-radius:8px;padding:4px 10px;font-size:0.75rem;color:#4ade80">❤️ HP ${cd.hp}</span>
                <span style="background:#1f2937;border-radius:8px;padding:4px 10px;font-size:0.75rem;color:#f87171">⚔️ ATK ${cd.atk}</span>
            </div>
        </div>

        <div style="font-size:0.7rem;color:#9ca3af;margin-bottom:14px">
            ซื้อไปแล้ว ${playerData.opPackBought}/${OP_PACK_MAX_BUY} ครั้ง
        </div>

        <div style="display:flex;gap:8px">
            ${playerData.opPackBought < OP_PACK_MAX_BUY && playerData.coins >= OP_PACK_COST && opIsPackAvailable()
                ? `<button onclick="this.closest('div[style*=fixed]').remove();buyOnePieceMiniPack()"
                    style="flex:1;background:linear-gradient(135deg,#ea580c,#dc2626);color:white;border:none;
                           padding:11px;border-radius:12px;font-weight:900;cursor:pointer">
                    🏴‍☠️ ซื้ออีก!
                  </button>`
                : ''}
            <button onclick="this.closest('div[style*=fixed]').remove();openOnePieceMiniShop()"
                style="flex:1;background:#1f2937;color:#9ca3af;border:1px solid #374151;
                       padding:11px;border-radius:12px;font-weight:bold;cursor:pointer">
                ✕ ปิด
            </button>
        </div>
    </div>`;
    document.body.appendChild(revOv);

    if (typeof checkCollectionMilestones === 'function')
        setTimeout(checkCollectionMilestones, 500);
};

// ============================================================
// MAIN INJECTION (DOMContentLoaded)
// ============================================================
document.addEventListener('DOMContentLoaded', () => {

    // ─── 1. Init playerData fields ───────────────────────────────
    if (typeof playerData !== 'undefined') {
        if (playerData.opPackBought   === undefined) playerData.opPackBought   = 0;
        if (playerData.opPackExpiry   === undefined) playerData.opPackExpiry   = null;
    }

    // ─── 2. Inject Cards into CardSets ──────────────────────────
    if (typeof CardSets !== 'undefined') {
        if (!CardSets['isekai_adventure']) CardSets['isekai_adventure'] = {};
        Object.entries(ONE_PIECE_CARDS).forEach(([k, v]) => {
            CardSets['isekai_adventure'][k] = JSON.parse(JSON.stringify(v));
        });

        // ป้องกันการ์ด OP หลุดไปใน Pack ปกติ (shopOnly)
        if (typeof getSetCardPool === 'function') {
            const _origGetPool_OP = window.getSetCardPool;
            window.getSetCardPool = function(setName) {
                return _origGetPool_OP(setName).filter(c => !c.data?.shopOnly);
            };
        }
        if (typeof openReadyPack === 'function') {
            const _origReady_OP = window.openReadyPack;
            window.openReadyPack = function() {
                const hidden = [];
                Object.keys(CardSets).forEach(theme => {
                    Object.keys(CardSets[theme] || {}).forEach(name => {
                        if (CardSets[theme][name].shopOnly) {
                            hidden.push({ theme, name, data: CardSets[theme][name] });
                            delete CardSets[theme][name];
                        }
                    });
                });
                _origReady_OP.apply(this, arguments);
                hidden.forEach(h => { CardSets[h.theme][h.name] = h.data; });
            };
        }
    }

    // ─── 3. Inject Home Panel Button ────────────────────────────
    function _injectOPBanner() {
        const homePanel = document.getElementById('hub-panel-home');
        if (!homePanel) return;
        if (document.getElementById('_op-shop-banner')) return;

        const available = opIsPackAvailable();
        const bought    = playerData.opPackBought || 0;
        const expiryTxt = opGetExpiryText();

        const btn = document.createElement('div');
        btn.id = '_op-shop-banner';
        btn.style.cssText = 'padding:0 16px;max-width:640px;margin:8px auto 0;';
        btn.innerHTML = `
          <button onclick="openOnePieceMiniShop()"
            style="width:100%;background:linear-gradient(135deg,#431407,#1a0e00);
                   border:1.5px solid #f97316;border-radius:14px;padding:12px 16px;
                   display:flex;align-items:center;gap:10px;cursor:pointer;text-align:left;
                   box-shadow:0 0 15px rgba(249,115,22,0.3);${!available ? 'opacity:0.55;' : ''}">
            <div style="font-size:1.8rem">🏴‍☠️</div>
            <div style="flex:1">
              <div style="font-weight:900;color:#fb923c;font-size:0.9rem">One Piece Mini Pack</div>
              <div style="font-size:0.62rem;color:#f97316">
                ${available
                    ? `${expiryTxt} | ซื้อได้อีก ${OP_PACK_MAX_BUY - bought} ครั้ง | 🪙 ${OP_PACK_COST.toLocaleString()} ต่อครั้ง`
                    : '⏰ แพ็คนี้หมดอายุแล้ว'}
              </div>
            </div>
            <div style="background:#1f2937;border:1px solid #f97316;border-radius:10px;padding:6px 10px;text-align:center;">
              <div style="font-size:0.5rem;color:#9ca3af">ซื้อแล้ว</div>
              <div style="font-size:0.9rem;font-weight:900;color:#fb923c">${bought}/${OP_PACK_MAX_BUY}</div>
            </div>
          </button>`;

        // แทรกต่อจาก rezero banner หรือ banner อื่น
        const ref = document.getElementById('_rezero-shop-banner')
                 || document.getElementById('_artstyle-home-btn')
                 || document.getElementById('_rod-shop-banner')
                 || homePanel.firstChild;
        if (ref && ref.parentNode) {
            ref.parentNode.insertBefore(btn, ref.nextSibling);
        } else {
            homePanel.appendChild(btn);
        }
    }

    if (typeof window.renderHomePanel === 'function') {
        const _origRenderHome_OP = window.renderHomePanel;
        window.renderHomePanel = function() {
            _origRenderHome_OP.apply(this, arguments);
            setTimeout(_injectOPBanner, 60);
        };
    }
    setTimeout(_injectOPBanner, 1200);

    // ============================================================
    // EFFECT PATCHES
    // ============================================================

    // ─── 4. triggerOnSummon patch ────────────────────────────────
    if (typeof window.triggerOnSummon === 'function') {
        const _origSummon_OP = window.triggerOnSummon;
        window.triggerOnSummon = function(card, playerKey) {
            const eff = card.originalName || card.name;

            // ── Eustass Kid: On Summon +1 Metal Stack ──
            if (eff === 'Eustass Kid' && !card.silenced) {
                card.metalStack = (card.metalStack || 0) + 1;
                log(`⚙️ [Eustass Kid] ลงสนาม! Metal Stack: ${card.metalStack}`, 'text-red-300 font-bold');
                opCheckMetalStack(card, playerKey);
            }

            // ── Ryokugyu: On Summon — Vine Trap 2 ศัตรู ──
            if (eff === 'Ryokugyu' && !card.silenced) {
                const oppKey = playerKey === 'player' ? 'ai' : 'player';
                const opp = state.players[oppKey];
                const targets = opp.field.filter(c => getCharStats(c).hp > 0).slice(0, 2);
                if (targets.length === 0) {
                    log(`🌿 [Ryokugyu] ลงสนาม! ไม่มีศัตรูให้ใส่ Vine Trap`, 'text-green-400');
                } else {
                    // สุ่ม 2 ตัว
                    const shuffled = targets.sort(() => Math.random() - 0.5).slice(0, 2);
                    shuffled.forEach(t => {
                        opApplyVineTrap(t);
                        log(`🌿 [Ryokugyu] ${t.name} ติด Vine Trap (2 เทิร์น) — โจมตีไม่ได้ / ใส่ Item ไม่ได้!`, 'text-green-400 font-bold');
                    });
                }
            }

            // ── God Baki: On Reveal — เรียก Character Cost 3-5 จากเด็ค ──
            if (eff === 'God Baki' && !card.silenced) {
                const p = state.players[playerKey];
                const deckChars = p.deck.filter(c => c.type === 'Character' && c.cost >= 3 && c.cost <= 5);
                if (deckChars.length > 0 && p.field.length < getMaxFieldSlots(playerKey)) {
                    const idx = p.deck.findIndex(c => c.id === deckChars[Math.floor(Math.random() * deckChars.length)].id);
                    const summoned = p.deck.splice(idx, 1)[0];
                    summoned.attacksLeft = 0; // ลงใหม่ โจมตีไม่ได้ในเทิร์นนี้
                    p.field.push(summoned);
                    log(`💪 [God Baki] On Reveal! เรียก ${summoned.name} (Cost ${summoned.cost}) ลงสนาม!`, 'text-amber-300 font-bold');
                    if (typeof triggerOnSummon === 'function') window.triggerOnSummon(summoned, playerKey);
                } else {
                    p.cost += 4;
                    log(`💪 [God Baki] On Reveal! ไม่มี Character Cost 3-5 ในเด็ค → +4 Cost!`, 'text-amber-400 font-bold');
                }
            }

            // ── King the Wildfire: On Summon — random Speed/Tank mode ──
            if (eff === 'King the Wildfire' && !card.silenced) {
                if (Math.random() < 0.5) {
                    // Speed Mode: +7 ATK / -2 HP
                    card.atk  += 7;
                    card.hp   = Math.max(1, card.hp - 2);
                    card.maxHp = Math.max(1, card.maxHp - 2);
                    card._kingTankReduce = false;
                    card.kingMode = 'speed';
                    log(`🔥 [King] ลงสนาม → Speed Mode! (ATK ${card.atk} / HP ${card.hp})`, 'text-orange-300 font-bold');
                } else {
                    // Tank Mode: +3 HP / -2 ATK / 50% dmg reduce
                    card.hp   += 3;
                    card.maxHp += 3;
                    card.atk   = Math.max(0, card.atk - 2);
                    card._kingTankReduce = true;
                    card.kingMode = 'tank';
                    log(`🛡️ [King] ลงสนาม → Tank Mode! (ATK ${card.atk} / HP ${card.hp} / ลดดาเมจ 50%)`, 'text-orange-400 font-bold');
                }
            }

            _origSummon_OP.apply(this, arguments);
        };
    }

    // ─── 5. initiateAttack patch — On Attack / On Get Attack ─────
    if (typeof window.initiateAttack === 'function') {
        const _origAttack_OP = window.initiateAttack;
        window.initiateAttack = function(attackerId, targetId, targetIsBase) {
            if (!targetIsBase && typeof state !== 'undefined') {
                const atkPlayerKey = state.currentTurn;
                const defPlayerKey = atkPlayerKey === 'player' ? 'ai' : 'player';
                const attacker = state.players[atkPlayerKey].field.find(c => c.id === attackerId);
                const defender = state.players[defPlayerKey].field.find(c => c.id === targetId);

                if (attacker && defender) {
                    const atkEff = attacker.originalName || attacker.name;
                    const defEff = defender.originalName || defender.name;

                    // ── Eustass Kid: On Attack +2 Metal Stack ──
                    if (atkEff === 'Eustass Kid' && !attacker.silenced) {
                        attacker.metalStack = (attacker.metalStack || 0) + 2;
                        log(`⚙️ [Eustass Kid] โจมตี! Metal Stack: ${attacker.metalStack}`, 'text-red-300');
                        opCheckMetalStack(attacker, atkPlayerKey);
                    }

                    // ── Yamato (Transformed): On Attack — Freeze target 2 turns ──
                    if (atkEff === 'Yamato' && attacker.yamatoTransformed && !attacker.silenced) {
                        opApplyFreeze(defender, 2);
                        log(`❄️ [Yamato/Okuchi] โจมตี! ${defender.name} ถูกแช่แข็ง 2 เทิร์น!`, 'text-sky-300 font-bold');
                    }

                    // ── King (Tank Mode): On Attack — 50% switch Speed ──
                    if (atkEff === 'King the Wildfire' && attacker.kingMode === 'tank' && !attacker.silenced) {
                        if (Math.random() < 0.5) {
                            opKingSwitchToSpeed(attacker);
                        }
                    }

                    // ── Ryokugyu: On Get Attack — Heal 2 ──
                    if (defEff === 'Ryokugyu' && !defender.silenced) {
                        // Heal after attack resolves
                        setTimeout(() => {
                            if (getCharStats(defender).hp > 0) {
                                defender.hp = Math.min(defender.hp + 2, getCharStats(defender).maxHp);
                                log(`🌿 [Ryokugyu] ถูกโจมตี → ฮีล 2 HP (เหลือ ${defender.hp}/${getCharStats(defender).maxHp})`, 'text-green-400 font-bold');
                                if (typeof updateUI === 'function') updateUI();
                            }
                        }, 50);
                    }

                    // ── Eustass Kid: On Get Attack — 50% +1 Metal Stack ──
                    if (defEff === 'Eustass Kid' && !defender.silenced) {
                        if (Math.random() < 0.5) {
                            defender.metalStack = (defender.metalStack || 0) + 1;
                            log(`⚙️ [Eustass Kid] ถูกโจมตี! Metal Stack: ${defender.metalStack}`, 'text-red-300');
                            opCheckMetalStack(defender, defPlayerKey);
                        }
                    }

                    // ── Yamato (Transformed): On Get Attack — 2 dmg reduce + freeze attacker ──
                    if (defEff === 'Yamato' && defender.yamatoTransformed && !defender.silenced) {
                        // Damage reduction handled via damageReduce below
                        // Freeze attacker after attack resolves
                        setTimeout(() => {
                            if (getCharStats(attacker).hp > 0) {
                                opApplyFreeze(attacker, 2);
                                log(`❄️ [Yamato/Okuchi] ถูกโจมตี! ${attacker.name} ถูกแช่แข็ง 2 เทิร์น!`, 'text-sky-400 font-bold');
                                if (typeof updateUI === 'function') updateUI();
                            }
                        }, 80);
                    }

                    // ── King (Speed Mode): On Get Attack — 50% switch Tank ──
                    if (defEff === 'King the Wildfire' && defender.kingMode === 'speed' && !defender.silenced) {
                        if (Math.random() < 0.5) {
                            opKingSwitchToTank(defender);
                        }
                    }

                    // ── God Baki: Ongoing — รับ 0 ดาเมจจาก Character ที่มี Item ──
                    if (defEff === 'God Baki' && !defender.silenced) {
                        const attackerHasItems = attacker.items && attacker.items.length > 0;
                        if (attackerHasItems) {
                            log(`💪 [God Baki] ภูมิคุ้มกัน! ไม่รับดาเมจจาก ${attacker.name} (มี Item)`, 'text-amber-400 font-bold');
                            // We'll intercept by pushing a flag; actual zero-dmg handled in getCharStats patch below
                            defender._bakiImmuneCurrent = true;
                            setTimeout(() => { delete defender._bakiImmuneCurrent; }, 500);
                        }
                    }
                }
            }

            _origAttack_OP.apply(this, arguments);
        };
    }

    // ─── 6. God Baki: getCharStats patch for 0-dmg immunity ──────
    if (typeof window.getCharStats === 'function') {
        const _origGetCharStats_OP = window.getCharStats;
        window.getCharStats = function(card) {
            const stats = _origGetCharStats_OP(card);
            const eff = card.originalName || card.name;

            // God Baki immunity: เพิ่ม damageReduce เพิ่มขึ้นมากๆ ชั่วคราว
            if (eff === 'God Baki' && card._bakiImmuneCurrent && !card.silenced) {
                stats.damageReduce = 9999;
            }

            // King Tank Mode: 50% damage reduction
            if (eff === 'King the Wildfire' && card._kingTankReduce && !card.silenced) {
                stats.damageMultiplier = (stats.damageMultiplier || 1) * 0.5;
            }

            // Yamato Transformed: 2 damage reduction
            if (eff === 'Yamato' && card.yamatoTransformed && !card.silenced) {
                stats.damageReduce = (stats.damageReduce || 0) + 2;
            }

            return stats;
        };
    }

    // ─── 7. resolveEndPhase / switchTurn patch ────────────────────
    // Patch: VineTrap counter / Yamato transform / Ryokugyu Vine Trap decrement
    if (typeof window.resolveEndPhase === 'function') {
        const _origEndPhase_OP = window.resolveEndPhase;
        window.resolveEndPhase = function(playerKey) {
            _origEndPhase_OP.apply(this, arguments);
            if (typeof state === 'undefined') return;

            const oppKey = playerKey === 'player' ? 'ai' : 'player';

            // ── Decrement VineTrap turns for opponent (active player's turn ends) ──
            state.players[oppKey].field.forEach(c => {
                if (c.vineTrapTurns > 0) {
                    c.vineTrapTurns--;
                    if (c.vineTrapTurns <= 0) {
                        c.status = c.status.filter(s => s !== 'VineTrap');
                        c.vineTrapTurns = 0;
                        log(`🌿 [Vine Trap] ${c.name} หลุดจาก Vine Trap แล้ว!`, 'text-green-300');
                    }
                }
            });

            // ── Yamato: End of Turn — 60% transform ──
            state.players[playerKey].field.forEach(c => {
                const eff = c.originalName || c.name;
                if (eff === 'Yamato' && !c.yamatoTransformed && !c.silenced && getCharStats(c).hp > 0) {
                    if (Math.random() < 0.6) {
                        // Transform!
                        c.yamatoTransformed = true;
                        c.atk  += 5;
                        c.hp   += 5;
                        c.maxHp += 5;
                        c.name = 'Yamato (Okuchi no Makami)';
                        log(`🐺 [Yamato] แปลงร่างเป็น Okuchi no Makami! (+5 ATK / +5 HP)`, 'text-sky-300 font-bold');

                        // Freeze 3 random enemies
                        const oppEnemies = state.players[oppKey].field
                            .filter(e => getCharStats(e).hp > 0)
                            .sort(() => Math.random() - 0.5)
                            .slice(0, 3);
                        oppEnemies.forEach(e => {
                            opApplyFreeze(e, 1);
                            log(`❄️ [Yamato Transform] ${e.name} ถูกแช่แข็ง 1 เทิร์น!`, 'text-sky-200');
                        });

                        if (typeof updateUI === 'function') updateUI();
                    }
                }
            });
        };
    }

    // ─── 8. startPhase patch — VineTrap blocks attack ────────────
    if (typeof window.startPhase === 'function') {
        const _origStartPhase_OP = window.startPhase;
        window.startPhase = function(phase) {
            _origStartPhase_OP.apply(this, arguments);
            if (phase !== 'MAIN' || typeof state === 'undefined') return;
            // Block VineTrap units from attacking
            const pk = state.currentTurn;
            state.players[pk].field.forEach(c => {
                if ((c.vineTrapTurns || 0) > 0) {
                    c.attacksLeft = 0;
                }
            });
        };
    }

    // ─── 9. playCard patch — VineTrap blocks item equip + Ryokugyu Ongoing ──
    if (typeof window.playCard === 'function') {
        const _origPlayCard_OP = window.playCard;
        window.playCard = function(playerKey, cardId) {
            if (typeof state === 'undefined') { _origPlayCard_OP.apply(this, arguments); return; }
            const p = state.players[playerKey];
            const card = p.hand.find(c => c.id === cardId);

            // ── VineTrap: block Item equip onto trapped unit ──
            if (card && card.type === 'Item' && card.requiresTarget) {
                // Will be checked after target selection in resolveTargetedPlay
            }

            // Run original first
            _origPlayCard_OP.apply(this, arguments);

            // ── Ryokugyu Ongoing: opponent plays card cost > 5 → +3 maxHp ──
            if (card && typeof state !== 'undefined') {
                const oppKey = playerKey === 'player' ? 'ai' : 'player';
                const opponentKey = playerKey; // The player who just played a card
                const ourKey      = playerKey === 'player' ? 'ai' : 'player';

                const cardCost = card.cost || 0;
                if (cardCost > 5) {
                    // Check if Ryokugyu is on our field
                    state.players[ourKey].field.forEach(c => {
                        const eff = c.originalName || c.name;
                        if ((eff === 'Ryokugyu' || c.name === 'Ryokugyu') && !c.silenced && getCharStats(c).hp > 0) {
                            c.maxHp += 3;
                            c.hp    += 3;
                            log(`🌿 [Ryokugyu] ศัตรูเล่น ${card.name} (Cost ${cardCost} > 5) → +3 Max HP! (ตอนนี้ ${c.hp}/${c.maxHp})`, 'text-green-400 font-bold');
                        }
                    });
                }
            }
        };
    }

    // ─── 10. resolveTargetedPlay patch — Block Item equip on VineTrap ──
    if (typeof window.resolveTargetedPlay === 'function') {
        const _origResolveTarget_OP = window.resolveTargetedPlay;
        window.resolveTargetedPlay = function(playerKey, sourceCardId, targetCharId) {
            if (typeof state === 'undefined') { _origResolveTarget_OP.apply(this, arguments); return; }
            const p = state.players[playerKey];
            const sourceCard = p.hand.find(c => c.id === sourceCardId);

            // ── VineTrap: ห้ามใส่ Item บน trapped unit ──
            if (sourceCard && sourceCard.type === 'Item') {
                // Check own field and enemy field
                const allFields = [...state.players.player.field, ...state.players.ai.field];
                const targetCard = allFields.find(c => c.id === targetCharId);
                if (targetCard && (targetCard.vineTrapTurns || 0) > 0) {
                    if (playerKey === 'player' || typeof gameMode !== 'undefined') {
                        if (typeof showToast === 'function') showToast('🌿 Vine Trap! ใส่ Item ไม่ได้บนตัวนี้!', '#86efac');
                        if (typeof cancelTargeting === 'function') cancelTargeting();
                    }
                    return;
                }
            }

            _origResolveTarget_OP.apply(this, arguments);
        };
    }

    // ─── 11. Prevent VineTrap units from being selected to attack ──
    // Patch updateUI to show VineTrap overlay / disable click
    // (Visual only — actual attack blocking is in startPhase patch above)

    // ─── 12. checkDeath / evolvedAndSpells hotfix ────────────────
    // ป้องกันการ์ด OP ออก Pack ปกติ
    if (typeof CardSets !== 'undefined') {
        OP_CARD_NAMES.forEach(name => {
            if (CardSets['isekai_adventure'] && CardSets['isekai_adventure'][name]) {
                CardSets['isekai_adventure'][name].shopOnly = true;
            }
        });
    }

    if (typeof window.saveData === 'function' && typeof playerData !== 'undefined') {
        // ตรวจ Expiry และ init
        opIsPackAvailable();
    }

    console.log('[31_one_piece] One Piece Mini Pack loaded ✅');
});
