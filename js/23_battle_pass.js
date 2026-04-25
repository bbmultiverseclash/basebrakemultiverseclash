// ============================================================
// 23_battle_pass.js — Jujutsu Kaisen Season 1 (Final with Images)
// ============================================================

const BP_CONFIG = {
    seasonName: "Jujutsu Kaisen: Cursed Clash",
    maxLevel: 20,
    pointsPerGame: 500,
    premiumPrice: 199,
    premiumFirstTimePrice: 99,
    firstTimeKey: 'bp_s1_first_buy'
};

// ─── การตั้งค่ารางวัล 1-20 ───
const BP_REWARDS = {
    free: {
        1: { type: 'card', name: 'Yuji Itadori', theme: 'jjk' },
        3: { type: 'coins', amount: 150 },
        5: { type: 'avatar', id: 'av_yuji', label: 'Yuji Itadori', art: 'https://file.garden/aeeLCXSsJxTPrRbp/7a3ffe40ffa26b52a3652d939fd8273f.jpg' },
        7: { type: 'card', name: 'Six Eye', theme: 'jjk' },
        9: { type: 'coins', amount: 300 },
        10: { type: 'gems', amount: 5 },
        13: { type: 'xp', amount: 1500 },
        15: { type: 'banner', id: 'bn_strongest_today', label: 'Strongest of Today', art: 'https://i.ibb.co/GQRYm9vw/image.png' },
        16: { type: 'coins', amount: 500 },
        18: { type: 'card', name: 'Six Eye', theme: 'jjk' },
        20: { type: 'card', name: 'Nobara Kugisaki', theme: 'jjk' }
    },
    premium: {
        1: { type: 'multi', items: [
            { type: 'avatar', id: 'av_yuta', label: 'Yuta Okkotsu', art: 'https://file.garden/aeeLCXSsJxTPrRbp/d7ae8acce56e71262672568eff870699.jpg' },
            { type: 'card', name: 'Yuta Okkotsu', theme: 'jjk' }
        ]},
        2: { type: 'coins', amount: 150 },
        3: { type: 'coins', amount: 150 },
        4: { type: 'gems', amount: 5 },
        5: { type: 'card', name: 'Six Eye', theme: 'jjk' },
        6: { type: 'coins', amount: 300 },
        7: { type: 'coins', amount: 300 },
        8: { type: 'gems', amount: 5 },
        9: { type: 'coins', amount: 300 },
        10: { type: 'card', name: 'Six Eye', theme: 'jjk' },
        11: { type: 'coins', amount: 300 },
        12: { type: 'gems', amount: 5 },
        13: { type: 'xp', amount: 2500 },
        14: { type: 'gems', amount: 5 },
        15: { type: 'banner', id: 'bn_strongest_history', label: 'Strongest of History', art: 'https://i.ibb.co/4nW1WZNS/image.png' },
        16: { type: 'coins', amount: 500 },
        17: { type: 'coins', amount: 500 },
        18: { type: 'card', name: 'Sukuna Finger', theme: 'jjk', count: 2 },
        19: { type: 'coins', amount: 500 },
        20: { type: 'card', name: 'Toji Fushiguro', theme: 'jjk' }
    }
};

// ─── ข้อมูลการ์ด JJK ───
const JJK_CARDS_DATA = {
    'Yuji Itadori': {
        name: 'Yuji Itadori', type: 'Character', cost: 6, atk: 5, hp: 5, maxHp: 5,
        text: 'Ongoing: มีโอกาส 50% Crit (x2 DMG) | หาก HP < 3 จะ Crit 100%',
        color: 'bg-red-700', art: 'https://i.ibb.co/0RnBcsm7/image.png'
    },
    'Nobara Kugisaki': {
        name: 'Nobara Kugisaki', type: 'Character', cost: 5, atk: 3, hp: 4, maxHp: 4,
        text: 'Summon: รับ Strawdoll Nail | Attack: รับ Hair Pin | End Turn: รับทั้งคู่ขึ้นมือ',
        color: 'bg-indigo-900', art: 'https://i.ibb.co/ptj5z7N/image.png'
    },
    'Yuta Okkotsu': {
        name: 'Yuta Okkotsu', type: 'Character', cost: 8, atk: 3, hp: 7, maxHp: 7,
        text: 'Summon: เรียก Rika | Bond: มี Rika บนสนาม +5 HP/+5 ATK | Guardian: Rika รับดาเมจแทน Yuta | Rika ตาย: Yuta +3/+3 ถาวร',
        color: 'bg-slate-800', art: 'https://i.ibb.co/xtY37YZf/image.png'
    },
    'Rika': {
        name: 'Rika', type: 'Character', cost: 0, atk: 1, hp: 8, maxHp: 8,
        text: 'Token: โล่ของยูตะ รับความเสียหายแทนยูตะเสมอ',
        color: 'bg-purple-950', art: 'https://i.ibb.co/xtY37YZf/image.png'
    },
    'Toji Fushiguro': {
        name: 'Toji Fushiguro', type: 'Character', cost: 7, atk: 5, hp: 6, maxHp: 6,
        text: 'Ongoing: หากศัตรูมี 3 ตัวขึ้นไป ATK 5->10 | On Attack: เป็น True Damage | หากเป้าหมาย HP > 7 มีโอกาส Crit 50%',
        color: 'bg-zinc-900', art: 'https://i.ibb.co/FbM02CSL/image.png'
    },
    'Six Eye': { name: 'Six Eye', type: 'Item', cost: 2, text: 'ดวงตาทิพย์ (ไม่มีความสามารถ)', color: 'bg-sky-400', requiresTarget: true },
    'Sukuna Finger': { name: 'Sukuna Finger', type: 'Item', cost: 3, text: 'นิ้วต้องสาปของราชาคำสาป', color: 'bg-red-950', requiresTarget: true },
    'Strawdoll Nail': { name: 'Strawdoll Nail', type: 'Spell', cost: 1, text: 'Spell: 1 ดาเมจ และ Mark เป้าหมายสุ่ม 1 ตัว', color: 'bg-blue-600', isNobaraSpell: true },
    'Hair Pin': { name: 'Hair Pin', type: 'Spell', cost: 2, text: 'Spell: 3 ดาเมจใส่ตัวที่ถูก Mark และ 1 ดาเมจหมู่ศัตรูอื่น', color: 'bg-indigo-700', isNobaraSpell: true }
};

// ─── ข้อมูล Fern Value Pack ───
const FERN_EXPIRY = new Date('2026-04-26T23:59:59+07:00').getTime();

const FERN_CARDS_DATA = {
    'Fern the Sniper': {
        name: 'Fern the Sniper', type: 'Character', cost: 7, atk: 2, hp: 6, maxHp: 6,
        text: 'จบเทิร์น: ได้รับการ์ดเวท "Fern Zoltrak" 5 ใบขึ้นมือ',
        color: 'bg-purple-800', maxAttacks: 1, rarity: 'Epic',
        art: 'https://file.garden/aeeLCXSsJxTPrRbp/7c6b158231b05d29e23842940482fe9f.jpg'
    },
    'Fern Zoltrak': {
        name: 'Fern Zoltrak', type: 'Spell', cost: 1,
        text: 'ยิงสุ่ม 2 ดาเมจ (ถ้ามี Frieren บนสนาม ดาเมจจะเป็น 5)',
        color: 'bg-violet-600', requiresTarget: false, isFernSpell: true,
        art: 'https://i.pinimg.com/736x/94/1d/ba/941dbaae1b31fc8f0f9970cb184606d3.jpg'
    }
};

document.addEventListener('DOMContentLoaded', () => {
    // 1. ฉีดการ์ด JJK + Fern
    if (typeof CardSets !== 'undefined') {
        CardSets['jjk'] = JJK_CARDS_DATA;
        if (!CardSets['frieren_mage']) CardSets['frieren_mage'] = {};
        CardSets['frieren_mage']['Fern the Sniper'] = JSON.parse(JSON.stringify(FERN_CARDS_DATA['Fern the Sniper']));
    }

    // 2. เตรียมข้อมูลผู้เล่น
    if (typeof playerData !== 'undefined') {
        if (playerData.bpPoints === undefined) playerData.bpPoints = 0;
        if (playerData.bpLevel === undefined) playerData.bpLevel = 0;
        if (playerData.hasPremiumBP === undefined) playerData.hasPremiumBP = false;
        if (!playerData.bpClaimedFree) playerData.bpClaimedFree = [];
        if (!playerData.bpClaimedPremium) playerData.bpClaimedPremium = [];
        if (playerData.fernPackBought === undefined) playerData.fernPackBought = false;
    }

    // 3. ปุ่มเมนู Battle Pass
    const navBar = document.querySelector('.hub-nav-bar');
    if (navBar && !document.getElementById('hub-tab-bp')) {
        const btn = document.createElement('button');
        btn.id = 'hub-tab-bp';
        btn.className = 'hub-nav-btn';
        btn.innerHTML = '🔥 Pass';
        btn.onclick = () => showHubTab('bp');
        navBar.appendChild(btn);
    }

    // 4. หน้าจอ Battle Pass Panel
    const container = document.getElementById('hub-panel-home')?.parentElement;
    if (container && !document.getElementById('hub-panel-bp')) {
        const pnl = document.createElement('div');
        pnl.id = 'hub-panel-bp';
        pnl.style.display = 'none';
        container.appendChild(pnl);
    }

    // 5. เชื่อมต่อระบบ Tab
    const _origTab = window.showHubTab;
    window.showHubTab = function(tab) {
        const bpBtn = document.getElementById('hub-tab-bp');
        const bpPnl = document.getElementById('hub-panel-bp');
        if (tab === 'bp') {
            ['home', 'packs', 'collection', 'deckbuilder', 'play', 'profile'].forEach(t => {
                const b = document.getElementById(`hub-tab-${t}`);
                const p = document.getElementById(`hub-panel-${t}`);
                if (b) b.classList.remove('active-tab');
                if (p) p.style.display = 'none';
            });
            if (bpBtn) bpBtn.classList.add('active-tab');
            if (bpPnl) bpPnl.style.display = 'block';
            renderBattlePass();
        } else {
            if (bpBtn) bpBtn.classList.remove('active-tab');
            if (bpPnl) bpPnl.style.display = 'none';
            if (_origTab) _origTab(tab);
        }
    };

    _patchCombatForJJK();
    _patchPointRewards();
});

// ─── ระบบคำนวณแต้มและเลเวล ───
function getPointsRequired(level) {
    return 100 * level; // เวล 1 ใช้ 100, เวล 2 ใช้ 200...
}

window.addBattlePoints = function(amount) {
    if (typeof playerData === 'undefined') return;
    if (playerData.bpPoints === undefined) playerData.bpPoints = 0;
    if (playerData.bpLevel === undefined) playerData.bpLevel = 0;
    playerData.bpPoints += amount;
    console.log(`BP Added: ${amount}. Current Total: ${playerData.bpPoints}`);
    
    while (playerData.bpLevel < BP_CONFIG.maxLevel) {
        let req = getPointsRequired(playerData.bpLevel + 1);
        if (playerData.bpPoints >= req) {
            playerData.bpPoints -= req;
            playerData.bpLevel++;
            if (typeof showToast === 'function') showToast(`⭐ Battle Pass LV UP: ${playerData.bpLevel}`, '#fbbf24');
        } else {
            break;
        }
    }
    if (typeof saveData === 'function') saveData();
    if (typeof updateHubUI === 'function') updateHubUI();
};

function buyPremiumBP() {
    const isFirst = !playerData[BP_CONFIG.firstTimeKey];
    const cost = isFirst ? BP_CONFIG.premiumFirstTimePrice : BP_CONFIG.premiumPrice;

    if (playerData.gems < cost) {
        alert("Gems ไม่พอ!"); return;
    }

    if (confirm(`ซื้อ Premium Pass ซีซั่นนี้ในราคา ${cost} Gems?`)) {
        playerData.gems -= cost;
        playerData.hasPremiumBP = true;
        playerData[BP_CONFIG.firstTimeKey] = true;
        if (typeof saveData === 'function') saveData();
        renderBattlePass();
        if (typeof showToast === 'function') showToast('👑 ปลดล็อก Premium Pass แล้ว!', '#4ade80');
    }
}

// ─── ให้ BP หลังชนะ/แพ้ ───
function _patchPointRewards() {
    if (typeof window.awardWin === 'function') {
        const _origAwardWin = window.awardWin;
        window.awardWin = function() {
            const result = _origAwardWin.apply(this, arguments);
            window.addBattlePoints(BP_CONFIG.pointsPerGame);
            return result;
        };
    }
    if (typeof window.awardLoss === 'function') {
        const _origAwardLoss = window.awardLoss;
        window.awardLoss = function() {
            const result = _origAwardLoss.apply(this, arguments);
            window.addBattlePoints(BP_CONFIG.pointsPerGame);
            return result;
        };
    }
}

// ─── การแสดงผล UI ───
function renderBattlePass() {
    const pnl = document.getElementById('hub-panel-bp');
    if (!pnl) return;

    const lv = playerData.bpLevel;
    const pts = playerData.bpPoints;
    const req = getPointsRequired(lv + 1);
    const pct = Math.min(100, (pts / req) * 100);

    const isFernAvailable = Date.now() < FERN_EXPIRY;
    const fernBought = playerData.fernPackBought || false;
    const canBuyFern = isFernAvailable && !fernBought && (playerData.gems >= 30);

    let rows = '';
    for (let i = 1; i <= 20; i++) {
        const isReached = lv >= i;
        const free = BP_REWARDS.free[i];
        const prem = BP_REWARDS.premium[i];

        rows += `
        <div style="display: flex; align-items: flex-start; gap: 10px; background: ${isReached ? 'rgba(251,191,36,0.1)' : '#111827'}; border: 1px solid ${isReached ? '#fbbf24' : '#374151'}; padding: 12px; border-radius: 12px; margin-bottom: 8px; min-height: 100px;">
            <div style="width: 30px; font-weight: 900; color: ${isReached ? '#fbbf24' : '#4b5563'}; text-align: center; padding-top: 4px;">${i}</div>
            <div style="flex: 1; font-size: 0.75rem;">${renderBPItem(free, 'free', i, isReached)}</div>
            <div style="width: 1px; align-self: stretch; background: #374151;"></div>
            <div style="flex: 1; font-size: 0.75rem; position: relative;">
                ${!playerData.hasPremiumBP ? '<div style="position:absolute;inset:0;background:rgba(0,0,0,0.6);display:flex;align-items:center;justify-content:center;z-index:2;border-radius:4px;font-size:1.2rem;">🔒</div>' : ''}
                ${renderBPItem(prem, 'premium', i, isReached)}
            </div>
        </div>`;
    }

    pnl.innerHTML = `
    <div style="max-width: 500px; margin: 0 auto; padding: 20px;">

        <!-- FERN VALUE BUNDLE -->
        <div style="background: linear-gradient(135deg, #2e1065, #172554); border: 3px solid ${isFernAvailable ? '#c084fc' : '#374151'}; border-radius: 24px; padding: 20px; margin-bottom: 20px; box-shadow: 0 10px 30px rgba(168,85,247,0.3); position: relative; overflow: hidden; display: flex; gap: 20px; align-items: center;">
            <div style="position: absolute; top: 15px; right: -30px; background: ${isFernAvailable ? '#ef4444' : '#374151'}; color: white; padding: 5px 40px; font-weight: 900; font-size: 0.7rem; transform: rotate(45deg);">
                ${isFernAvailable ? '1 DAY ONLY' : 'EXPIRED'}
            </div>
            <div style="width: 80px; height: 110px; border-radius: 10px; border: 2px solid #c084fc; overflow: hidden; flex-shrink: 0; box-shadow: 0 0 15px rgba(192,132,252,0.4);">
                <img src="${FERN_CARDS_DATA['Fern the Sniper'].art}" style="width: 100%; height: 100%; object-fit: cover;">
            </div>
            <div style="flex: 1;">
                <div style="color: #c084fc; font-weight: 900; font-size: 0.7rem; letter-spacing: 2px;">⚡ BP BOOSTER BUNDLE</div>
                <h3 style="margin: 4px 0; font-size: 1.2rem; font-weight: 900; color: white;">Fern the Sniper</h3>
                <div style="font-size: 0.75rem; color: #d8b4fe; margin-bottom: 10px; line-height: 1.4;">
                    การ์ด <strong style="color:#fbcfe8;">Fern</strong> (Epic) 1 ใบ + <strong style="color:#fbbf24;">+5,000 BP</strong> ทันที!
                </div>
                <div style="display: flex; align-items: center; gap: 12px;">
                    <div style="font-size: 1.1rem; font-weight: 900; color: ${isFernAvailable ? '#60a5fa' : '#6b7280'};">💎 30 Gems</div>
                    <button onclick="buyFernBPPack()" ${canBuyFern ? '' : 'disabled'} style="background: ${canBuyFern ? 'linear-gradient(135deg, #c084fc, #9333ea)' : '#374151'}; color: ${canBuyFern ? 'white' : '#9ca3af'}; border: none; padding: 8px 18px; border-radius: 10px; font-weight: 900; cursor: ${canBuyFern ? 'pointer' : 'not-allowed'}; font-size: 0.8rem;">
                        ${fernBought ? '✅ Purchased' : !isFernAvailable ? '🔒 Expired' : playerData.gems < 30 ? '💎 Not Enough' : 'BUY NOW'}
                    </button>
                </div>
            </div>
        </div>

        <div style="background: linear-gradient(135deg, #450a0a, #020617); padding: 20px; border-radius: 20px; border: 2px solid #fbbf24; margin-bottom: 20px; text-align: center;">
            <div style="font-weight: 900; color: #fbbf24; letter-spacing: 2px;">BATTLE PASS</div>
            <div style="font-size: 1.2rem; font-weight: 900; color: white; margin-bottom: 10px;">${BP_CONFIG.seasonName}</div>
            <div style="display: flex; justify-content: space-between; font-size: 0.7rem; color: #9ca3af; margin-bottom: 4px;">
                <span>LV. ${lv}</span>
                <span>${lv < 20 ? pts + '/' + req + ' BP' : 'MAX LEVEL'}</span>
            </div>
            <div style="height: 8px; background: #000; border-radius: 4px; overflow: hidden; margin-bottom: 15px;">
                <div style="width: ${pct}%; height: 100%; background: #fbbf24; box-shadow: 0 0 10px #fbbf24;"></div>
            </div>
            ${!playerData.hasPremiumBP ? 
                `<button onclick="buyPremiumBP()" style="background: #fbbf24; color: black; border: none; padding: 10px 20px; border-radius: 10px; font-weight: 900; cursor: pointer;">👑 UPGRADE (${!playerData[BP_CONFIG.firstTimeKey] ? '99' : '199'} Gems)</button>` : 
                `<div style="color: #4ade80; font-weight: 900; font-size: 0.8rem;">✨ PREMIUM ACTIVE ✨</div>`
            }
        </div>
        <div style="display:flex; justify-content: space-between; padding: 0 10px 10px; font-size: 0.65rem; color: #6b7280; font-weight: bold;">
            <span>LVL</span><span>FREE REWARDS</span><span>PREMIUM REWARDS</span>
        </div>
        <div>${rows}</div>
    </div>`;
}

function renderBPItem(item, pool, level, isReached) {
    if (!item) return `<div style="display:flex;align-items:center;justify-content:center;height:80px;color:#374151;">—</div>`;
    const claimedArr = pool === 'free' ? playerData.bpClaimedFree : playerData.bpClaimedPremium;
    const isClaimed = claimedArr.includes(level);
    const canClaim = isReached && !isClaimed && (pool === 'free' || playerData.hasPremiumBP);

    const claimBtn = isClaimed
        ? `<div style="color:#4ade80;font-size:0.6rem;font-weight:900;margin-top:4px;">✅ Claimed</div>`
        : canClaim
            ? `<button onclick="claimBP('${pool}', ${level})" style="background:#fbbf24;border:none;border-radius:4px;font-size:0.6rem;padding:2px 8px;font-weight:900;cursor:pointer;margin-top:4px;">CLAIM</button>`
            : `<div style="color:#4b5563;font-size:0.7rem;margin-top:4px;">🔒</div>`;

    // ─── render preview ของ reward แต่ละชนิด ───
    function renderPreview(r) {
        if (r.type === 'card') {
            const cardData = JJK_CARDS_DATA[r.name]
                || Object.values(typeof CardSets !== 'undefined' ? CardSets : {})
                         .flatMap(s => Object.values(s))
                         .find(c => c.name === r.name);
            const art = cardData?.art || '';
            const count = r.count > 1 ? `<div style="position:absolute;top:2px;right:2px;background:rgba(0,0,0,0.8);color:#fbbf24;font-size:0.55rem;font-weight:900;padding:1px 3px;border-radius:3px;">x${r.count}</div>` : '';
            return `
                <div style="text-align:center;">
                    <div style="width:52px;height:72px;border-radius:6px;overflow:hidden;border:1px solid #4b5563;margin:0 auto 3px;background:#1f2937;position:relative;">
                        ${art ? `<img src="${art}" style="width:100%;height:100%;object-fit:cover;">` : `<div style="width:100%;height:100%;display:flex;align-items:center;justify-content:center;font-size:1.5rem;">🃏</div>`}
                        ${count}
                    </div>
                    <div style="font-size:0.5rem;color:#d1d5db;font-weight:bold;line-height:1.2;max-width:58px;word-break:break-word;">${r.name}</div>
                </div>`;
        }
        if (r.type === 'banner') {
            return `
                <div style="text-align:center;">
                    <div style="width:66px;height:38px;border-radius:5px;overflow:hidden;border:1px solid #6366f1;margin:0 auto 3px;">
                        <img src="${r.art}" style="width:100%;height:100%;object-fit:cover;">
                    </div>
                    <div style="font-size:0.5rem;color:#d1d5db;font-weight:bold;max-width:70px;word-break:break-word;">🖼️ ${r.label}</div>
                </div>`;
        }
        if (r.type === 'avatar') {
            return `
                <div style="text-align:center;">
                    <div style="width:44px;height:44px;border-radius:50%;overflow:hidden;border:2px solid #fbbf24;margin:0 auto 3px;">
                        <img src="${r.art}" style="width:100%;height:100%;object-fit:cover;">
                    </div>
                    <div style="font-size:0.5rem;color:#d1d5db;font-weight:bold;max-width:58px;word-break:break-word;">👤 ${r.label}</div>
                </div>`;
        }
        if (r.type === 'coins') return `<div style="text-align:center;"><div style="font-size:1.8rem;line-height:1;">🪙</div><div style="font-size:0.55rem;color:white;font-weight:bold;margin-top:2px;">${r.amount}</div></div>`;
        if (r.type === 'gems')  return `<div style="text-align:center;"><div style="font-size:1.8rem;line-height:1;">💎</div><div style="font-size:0.55rem;color:white;font-weight:bold;margin-top:2px;">${r.amount}</div></div>`;
        if (r.type === 'xp')   return `<div style="text-align:center;"><div style="font-size:1.8rem;line-height:1;">⭐</div><div style="font-size:0.55rem;color:white;font-weight:bold;margin-top:2px;">${r.amount} XP</div></div>`;
        return `<div style="font-size:0.6rem;color:#9ca3af;">${r.type}</div>`;
    }

    let preview = '';
    if (item.type === 'multi') {
        preview = `<div style="display:flex;gap:4px;flex-wrap:wrap;justify-content:center;">${item.items.map(renderPreview).join('')}</div>`;
    } else {
        preview = renderPreview(item);
    }

    return `
        <div style="text-align:center;opacity:${isReached ? '1' : '0.45'};">
            ${preview}
            ${claimBtn}
        </div>`;
}

function claimBP(pool, level) {
    const reward = BP_REWARDS[pool][level];
    if (!reward) return;

    const give = (r) => {
        if (r.type === 'card') {
            const k = `${r.name}|${r.theme}`;
            playerData.collection[k] = (playerData.collection[k] || 0) + (r.count || 1);
        } else if (r.type === 'coins') playerData.coins += r.amount;
        else if (r.type === 'gems') playerData.gems += r.amount;
        else if (r.type === 'xp' && typeof addXp === 'function') addXp(r.amount);
        else if (r.type === 'avatar' || r.type === 'banner') {
            if (!playerData.unlockedCosmetics) playerData.unlockedCosmetics = [];
            if (!playerData.unlockedCosmetics.includes(r.id)) playerData.unlockedCosmetics.push(r.id);
            // เพิ่มเข้า Catalog ถ้ายังไม่มี (กรณีระบบ Cosmetic ดึงจาก Catalog)
            const catKey = r.type === 'avatar' ? 'avatars' : 'banners';
            if (typeof COSMETICS_CATALOG !== 'undefined' && !COSMETICS_CATALOG[catKey].find(x => x.id === r.id)) {
                COSMETICS_CATALOG[catKey].push({ id: r.id, label: r.label, art: r.art });
            }
        }
    };

    if (reward.type === 'multi') reward.items.forEach(give);
    else give(reward);

    if (pool === 'free') playerData.bpClaimedFree.push(level);
    else playerData.bpClaimedPremium.push(level);

    if (typeof saveData === 'function') saveData();
    renderBattlePass();
    if (typeof updateHubUI === 'function') updateHubUI();
}

// ─── พลังพิเศษของการ์ด JJK ───
function _patchCombatForJJK() {
    // 1. โลจิกโจมตี (Yuji, Toji, Yuta)
    if (typeof initiateAttack === 'function') {
        const _orig = window.initiateAttack;
        window.initiateAttack = function(attackerId, targetId, targetIsBase) {
            if (typeof state === 'undefined' || targetIsBase) return _orig.apply(this, arguments);

            const atkKey = state.currentTurn;
            const defKey = atkKey === 'player' ? 'ai' : 'player';
            const attacker = state.players[atkKey].field.find(c => c.id === attackerId);
            const target = state.players[defKey].field.find(c => c.id === targetId);

            if (attacker) {
                const aN = attacker.originalName || attacker.name;
                
                // Yuji Crit
                if (aN === 'Yuji Itadori') {
                    const hp = getCharStats(attacker).hp;
                    if (Math.random() < 0.5 || hp < 3) {
                        attacker.atk *= 2;
                        attacker._jjkCrit = true;
                        if (typeof log === 'function') log(`👊 [Yuji] ประกายทมิฬ! Critical x2 Damage!`, 'text-red-500 font-bold');
                    }
                }

                // Toji Logic
                if (aN === 'Toji Fushiguro' && target) {
                    if (getCharStats(target).hp > 7 && Math.random() < 0.5) {
                        attacker.atk *= 2;
                        attacker._jjkCrit = true;
                        if (typeof log === 'function') log(`🗡️ [Toji] สังหารสวรรค์! Critical x2 Damage!`, 'text-zinc-400 font-bold');
                    }
                }

                // Yuta's Rika Guardian (ถ้าตี Yuta แล้ว Rika ยังอยู่ Rika รับแทน)
                if (target && (target.originalName || target.name) === 'Yuta Okkotsu') {
                    const rika = state.players[defKey].field.find(c => (c.originalName || c.name) === 'Rika' && c.hp > 0);
                    if (rika) {
                        if (typeof log === 'function') log(`🛡️ [Rika] กางอาณาเขตปกป้องยูตะ! รับความเสียหายแทน`, 'text-purple-400 font-bold');
                        arguments[1] = rika.id; // เปลี่ยนเป้าหมายเป็นริกะ
                    }
                }
            }

            _orig.apply(this, arguments);

            if (attacker && attacker._jjkCrit) {
                attacker.atk /= 2;
                delete attacker._jjkCrit;
            }

            // Nobara's On Attack
            if (attacker && (attacker.originalName || attacker.name) === 'Nobara Kugisaki') {
                state.players[atkKey].hand.push(_mkJJKSpell('Hair Pin'));
            }
        };
    }

    // 2. โลจิกสเตตัส (Toji True Damage & Yuta Stats)
    if (typeof getCharStats === 'function') {
        const _origStats = window.getCharStats;
        window.getCharStats = function(char) {
            let stats = _origStats(char);
            if (char.silenced) return stats;
            const name = char.originalName || char.name;
            const ownerKey = state.players.player.field.some(c => c.id === char.id) ? 'player' : 'ai';
            const oppKey = ownerKey === 'player' ? 'ai' : 'player';

            if (name === 'Yuta Okkotsu') {
                if (state.players[ownerKey].field.some(c => (c.originalName || c.name) === 'Rika' && c.hp > 0)) {
                    stats.atk += 5; stats.hp += 5; stats.maxHp += 5;
                }
            }
            if (name === 'Toji Fushiguro') {
                stats.damageMultiplier = 1; // เจาะเกราะ (True Damage)
                if (state.players[oppKey].field.length >= 3) stats.atk += 5;
            }
            return stats;
        };
    }

    // 3. Nobara & Yuta On Summon
    if (typeof triggerOnSummon === 'function') {
        const _origSummon = window.triggerOnSummon;
        window.triggerOnSummon = function(card, pk) {
            _origSummon(card, pk);
            const name = card.originalName || card.name;
            if (name === 'Nobara Kugisaki') state.players[pk].hand.push(_mkJJKSpell('Strawdoll Nail'));
            if (name === 'Yuta Okkotsu' && state.players[pk].field.length < getMaxFieldSlots(pk)) {
                const rika = _mkJJKToken('Rika');
                state.players[pk].field.push(rika);
                if (typeof log === 'function') log(`💍 [Yuta] "มาเถอะ... ริกะ!!"`, 'text-purple-300 font-bold italic');
            }
        };
    }

    // 4. Nobara End Turn
    if (typeof resolveEndPhase === 'function') {
        const _origEnd = window.resolveEndPhase;
        window.resolveEndPhase = function(pk) {
            _origEnd(pk);
            state.players[pk].field.forEach(c => {
                if ((c.originalName || c.name) === 'Nobara Kugisaki' && !c.silenced) {
                    state.players[pk].hand.push(_mkJJKSpell('Strawdoll Nail'));
                    state.players[pk].hand.push(_mkJJKSpell('Hair Pin'));
                }
                // Fern End Turn: ได้รับ Fern Zoltrak 5 ใบ
                if ((c.originalName || c.name) === 'Fern the Sniper' && !c.silenced && getCharStats(c).hp > 0) {
                    for (let i = 0; i < 5; i++) state.players[pk].hand.push(_mkFernSpell());
                    if (typeof log === 'function') log(`💜 [Fern] เวทมนตร์ความเร็วสูง! ได้รับ Fern Zoltrak 5 ใบ!`, 'text-purple-300 font-bold');
                }
            });
        };
    }

    // 5. Nobara Spells Logic
    if (typeof executeNonTargetAction === 'function') {
        const _origAct = window.executeNonTargetAction;
        window.executeNonTargetAction = function(card, pk) {
            if (card.isNobaraSpell) {
                const oppKey = pk === 'player' ? 'ai' : 'player';
                const opp = state.players[oppKey];
                if (card.name === 'Strawdoll Nail') {
                    const targets = opp.field.filter(c => getCharStats(c).hp > 0);
                    if (targets.length > 0) {
                        const t = targets[Math.floor(Math.random() * targets.length)];
                        t.hp -= 1; t._jjkMarked = true;
                        if (typeof log === 'function') log(`🔨 [Nail] สร้าง 1 ดาเมจ และ Mark ${t.name}!`, 'text-blue-400');
                    }
                } else if (card.name === 'Hair Pin') {
                    opp.field.forEach(c => {
                        if (c._jjkMarked) {
                            c.hp -= 3; c._jjkMarked = false;
                            if (typeof log === 'function') log(`💥 [Hair Pin] ระเบิดไสยเวท 3 ดาเมจใส่ตัวที่ถูก Mark!`, 'text-blue-500 font-bold');
                        } else {
                            c.hp -= 1;
                        }
                    });
                }
                if (typeof checkDeath === 'function') checkDeath(oppKey);
                state.players[pk].graveyard.push(card);
                return;
            }
            // Fern Zoltrak Spell
            if (card.isFernSpell) {
                const oppKey = pk === 'player' ? 'ai' : 'player';
                const opp = state.players[oppKey];
                const hasFrieren = state.players[pk].field.some(c => (c.originalName || c.name) === 'Frieren' && getCharStats(c).hp > 0 && !c.silenced);
                const dmg = hasFrieren ? 5 : 2;
                const targets = opp.field.filter(c => getCharStats(c).hp > 0);
                if (targets.length > 0) {
                    const t = targets[Math.floor(Math.random() * targets.length)];
                    t.hp -= dmg;
                    if (typeof log === 'function') {
                        if (hasFrieren) log(`💥 [Fern Zoltrak] ยิงทะลวง! ${t.name} โดน 5 ดาเมจ! (บัฟ Frieren)`, 'text-fuchsia-400 font-bold');
                        else log(`💥 [Fern Zoltrak] ยิงรัวๆ! ${t.name} โดน 2 ดาเมจ`, 'text-violet-300');
                    }
                    if (typeof checkDeath === 'function') checkDeath(oppKey);
                }
                state.players[pk].graveyard.push(card);
                return;
            }
            _origAct(card, pk);
        };
    }

    // 6. Rika's Legacy (On Death)
    if (typeof checkDeath === 'function') {
        const _origDeath = window.checkDeath;
        window.checkDeath = function(pk) {
            const p = state.players[pk];
            p.field.forEach(c => {
                if (getCharStats(c).hp <= 0 && !c.isDyingProcessing) {
                    if ((c.originalName || c.name) === 'Rika') {
                        const yuta = p.field.find(x => (x.originalName || x.name) === 'Yuta Okkotsu' && getCharStats(x).hp > 0);
                        if (yuta) {
                            yuta.atk += 3; yuta.hp += 3; yuta.maxHp += 3;
                            if (typeof log === 'function') log(`💔 [Rika's Legacy] ยูตะได้รับพลังเฮือกสุดท้าย! +3/+3 ถาวร`, 'text-red-400 font-bold');
                        }
                    }
                }
            });
            _origDeath(pk);
        };
    }
}

function _mkJJKSpell(name) {
    const tpl = JJK_CARDS_DATA[name];
    return {
        id: 'card_' + (cardIdCounter++), name: tpl.name, originalName: tpl.name,
        type: 'Spell', cost: tpl.cost, text: tpl.text, color: tpl.color,
        isNobaraSpell: true, _theme: 'jjk', art: '', status: [], items: []
    };
}

function _mkJJKToken(name) {
    const tpl = JJK_CARDS_DATA[name];
    return {
        ...JSON.parse(JSON.stringify(tpl)),
        id: 'card_' + (cardIdCounter++), originalName: tpl.name,
        status: [], items: [], attacksLeft: 0, tempBuffs: []
    };
}

function _mkFernSpell() {
    const tpl = FERN_CARDS_DATA['Fern Zoltrak'];
    return {
        id: 'card_' + (cardIdCounter++), name: tpl.name, originalName: tpl.name,
        type: 'Spell', cost: tpl.cost, text: tpl.text, color: tpl.color, art: tpl.art,
        _theme: 'frieren_mage', requiresTarget: false, isFernSpell: true,
        status: [], items: []
    };
}

// ─── Fern BP Pack Buy Logic ───
window.buyFernBPPack = function() {
    if (Date.now() > FERN_EXPIRY) { if (typeof showToast === 'function') showToast('❌ แพ็กเกจนี้หมดเวลาแล้ว!', '#f87171'); return; }
    if (playerData.fernPackBought) { if (typeof showToast === 'function') showToast('✅ คุณเป็นเจ้าของแพ็กนี้แล้ว', '#4ade80'); return; }
    if (playerData.gems < 30) { if (typeof showToast === 'function') showToast('💎 Gems ไม่พอ!', '#f87171'); return; }

    playerData.gems -= 30;
    playerData.fernPackBought = true;
    const cardKey = 'Fern the Sniper|frieren_mage';
    playerData.collection[cardKey] = (playerData.collection[cardKey] || 0) + 1;

    window.addBattlePoints(5000);

    if (typeof saveData === 'function') saveData();
    if (typeof updateHubUI === 'function') updateHubUI();
    renderBattlePass();
    _showFernReveal();
};

function _showFernReveal() {
    const ov = document.createElement('div');
    ov.id = 'fern-reveal-ov';
    ov.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,0.95);z-index:100000;display:flex;align-items:center;justify-content:center;';
    ov.innerHTML = `
        <div style="background:linear-gradient(135deg,#2e1065,#172554);border:3px solid #c084fc;border-radius:28px;padding:30px;max-width:380px;width:92%;text-align:center;box-shadow:0 0 60px rgba(168,85,247,0.5)">
            <h2 style="font-size:1.8rem;font-weight:900;color:#c084fc;margin:0 0 5px;">🎉 ซื้อสำเร็จ!</h2>
            <div style="color:#d8b4fe;font-size:0.85rem;margin-bottom:20px;">คุณได้รับของรางวัลจาก Value Bundle แล้ว</div>
            <div style="width:110px;height:150px;border-radius:12px;border:2px solid #c084fc;overflow:hidden;margin:0 auto 20px;box-shadow:0 0 20px rgba(192,132,252,0.4);">
                <img src="${FERN_CARDS_DATA['Fern the Sniper'].art}" style="width:100%;height:100%;object-fit:cover;">
            </div>
            <div style="background:rgba(0,0,0,0.5);border:1px solid #c084fc;border-radius:12px;padding:12px;margin-bottom:20px;">
                <div style="font-weight:bold;color:white;">🃏 Fern the Sniper x1</div>
                <div style="font-weight:bold;color:#fbbf24;margin-top:5px;font-size:1.2rem;">⭐ +5,000 BP</div>
                <div style="font-size:0.7rem;color:#9ca3af;margin-top:2px;">(Level Up อัตโนมัติแล้ว)</div>
            </div>
            <button onclick="document.getElementById('fern-reveal-ov').remove()" style="width:100%;background:#c084fc;color:black;border:none;padding:12px;border-radius:12px;font-weight:900;cursor:pointer;font-size:1rem;">เยี่ยมไปเลย!</button>
        </div>
    `;
    document.body.appendChild(ov);
}