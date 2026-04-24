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
        5: { type: 'avatar', id: 'av_yuji', label: 'Yuji Itadori', art: 'https://i.ibb.co/Txxqz82k/94554.jpg' },
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
            { type: 'avatar', id: 'av_yuta', label: 'Yuta Okkotsu', art: 'https://i.ibb.co/GQ5Wn0yd/94569.jpg' },
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

document.addEventListener('DOMContentLoaded', () => {
    // 1. ฉีดการ์ด JJK
    if (typeof CardSets !== 'undefined') CardSets['jjk'] = JJK_CARDS_DATA;

    // 2. เตรียมข้อมูลผู้เล่น
    if (typeof playerData !== 'undefined') {
        if (playerData.bpPoints === undefined) playerData.bpPoints = 0;
        if (playerData.bpLevel === undefined) playerData.bpLevel = 0;
        if (playerData.hasPremiumBP === undefined) playerData.hasPremiumBP = false;
        if (!playerData.bpClaimedFree) playerData.bpClaimedFree = [];
        if (!playerData.bpClaimedPremium) playerData.bpClaimedPremium = [];
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
});

// ─── ระบบคำนวณแต้มและเลเวล ───
function getPointsRequired(level) {
    return 100 * level; // เวล 1 ใช้ 100, เวล 2 ใช้ 200...
}

function addBattlePoints(amount) {
    if (typeof playerData === 'undefined') return;
    playerData.bpPoints += amount;
    
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
}

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

// ─── การแสดงผล UI ───
function renderBattlePass() {
    const pnl = document.getElementById('hub-panel-bp');
    if (!pnl) return;

    const lv = playerData.bpLevel;
    const pts = playerData.bpPoints;
    const req = getPointsRequired(lv + 1);
    const pct = Math.min(100, (pts / req) * 100);

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
            const listKey = r.type === 'avatar' ? 'unlockedAvatars' : 'unlockedBanners';
            const catKey = r.type === 'avatar' ? 'avatars' : 'banners';
            if (!playerData[listKey]) playerData[listKey] = [];
            playerData[listKey].push(r.id);
            // เพิ่มเข้า Catalog ถ้ายังไม่มี (กรณีระบบ Cosmetic ดึงจาก Catalog)
            if (!COSMETICS_CATALOG[catKey].find(x => x.id === r.id)) {
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