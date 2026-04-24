// ============================================================
// 23_battle_pass.js — Jujutsu Kaisen Season 1 (Final Fixed Version)
// ============================================================

const BP_CONFIG = {
    seasonName: "Jujutsu Kaisen: Cursed Clash",
    maxLevel: 20,
    pointsPerGame: 500,
    premiumPrice: 199,
    premiumFirstTimePrice: 99,
    firstTimeKey: 'bp_s1_first_buy'
};

// ─── การตั้งค่ารางวัล 1-20 (อัปเดตรูปโปรไฟล์ใหม่แล้ว) ───
const BP_REWARDS = {
    free: {
        1: { type: 'card', name: 'Yuji Itadori', theme: 'jjk' },
        3: { type: 'coins', amount: 150 },
        5: { type: 'avatar', id: 'av_yuji', label: 'Yuji Itadori', art: 'https://file.garden/aeeLCXSsJxTPrRbp/7a3ffe40ffa26b52a3652d939fd8273f.jpg' },
        7: { type: 'card', name: 'Six Eye', theme: 'jjk' },
        9: { type: 'coins', amount: 300 },
        10: { type: 'gems', amount: 5 },
        13: { type: 'xp', amount: 1500 },
        15: { type: 'banner', id: 'bn_today', label: 'Strongest Today', art: 'https://i.ibb.co/GQRYm9vw/image.png' },
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
        15: { type: 'banner', id: 'bn_history', label: 'Strongest History', art: 'https://i.ibb.co/4nW1WZNS/image.png' },
        16: { type: 'coins', amount: 500 },
        17: { type: 'coins', amount: 500 },
        18: { type: 'card', name: 'Sukuna Finger', theme: 'jjk', count: 2 },
        19: { type: 'coins', amount: 500 },
        20: { type: 'card', name: 'Toji Fushiguro', theme: 'jjk' }
    }
};

// ─── ฐานข้อมูลการ์ด JJK (Full Specs) ───
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
        text: 'Summon: เรียก Rika | Bond: มี Rika บนสนาม +5 HP/+5 ATK | Guardian: Rika รับดาเมจแทนยูตะ | Rika ตาย: ยูตะ +3/+3 ถาวร',
        color: 'bg-slate-800', art: 'https://file.garden/aeeLCXSsJxTPrRbp/d7ae8acce56e71262672568eff870699.jpg'
    },
    'Rika': {
        name: 'Rika', type: 'Character', cost: 0, atk: 1, hp: 8, maxHp: 8,
        text: 'Token: โล่ของยูตะ รับความเสียหายแทนยูตะจนกว่าจะตาย',
        color: 'bg-purple-950', art: 'https://i.ibb.co/xtY37YZf/image.png'
    },
    'Toji Fushiguro': {
        name: 'Toji Fushiguro', type: 'Character', cost: 7, atk: 5, hp: 6, maxHp: 6,
        text: 'Ongoing: หากศัตรูมี 3 ตัวขึ้นไป ATK 5->10 | On Attack: เป็น True Damage | หากเป้าหมาย HP > 7 มีโอกาส Crit 50%',
        color: 'bg-zinc-900', art: 'https://i.ibb.co/FbM02CSL/image.png'
    },
    'Six Eye': { name: 'Six Eye', type: 'Item', cost: 2, text: 'ไอเทมประดับ (ไม่มีความสามารถ)', color: 'bg-sky-400', requiresTarget: true },
    'Sukuna Finger': { name: 'Sukuna Finger', type: 'Item', cost: 3, text: 'นิ้วต้องสาปของสุคุนะ', color: 'bg-red-950', requiresTarget: true },
    'Strawdoll Nail': { name: 'Strawdoll Nail', type: 'Spell', cost: 1, text: '1 DMG และ Mark ศัตรูสุ่ม 1 ตัว', color: 'bg-blue-600', isNobaraSpell: true },
    'Hair Pin': { name: 'Hair Pin', type: 'Spell', cost: 2, text: '3 DMG ใส่ตัวที่มี Mark | 1 DMG กระจายตัวอื่น', color: 'bg-indigo-700', isNobaraSpell: true }
};

document.addEventListener('DOMContentLoaded', () => {
    // 1. Inject Data
    if (typeof CardSets !== 'undefined') CardSets['jjk'] = JJK_CARDS_DATA;
    if (typeof playerData !== 'undefined') {
        if (playerData.bpPoints === undefined) playerData.bpPoints = 0;
        if (playerData.bpLevel === undefined) playerData.bpLevel = 0;
        if (playerData.hasPremiumBP === undefined) playerData.hasPremiumBP = false;
        if (!playerData.bpClaimedFree) playerData.bpClaimedFree = [];
        if (!playerData.bpClaimedPremium) playerData.bpClaimedPremium = [];
    }

    // 2. UI Hook (Nav Bar)
    const navBar = document.querySelector('.hub-nav-bar');
    if (navBar && !document.getElementById('hub-tab-bp')) {
        const btn = document.createElement('button');
        btn.id = 'hub-tab-bp';
        btn.className = 'hub-nav-btn';
        btn.innerHTML = '🔥 Battle Pass';
        btn.onclick = () => showHubTab('bp');
        navBar.appendChild(btn);
    }

    // 3. UI Hook (Panel Container)
    const hubContainer = document.getElementById('hub-panel-home')?.parentElement;
    if (hubContainer && !document.getElementById('hub-panel-bp')) {
        const pnl = document.createElement('div');
        pnl.id = 'hub-panel-bp';
        pnl.style.display = 'none';
        hubContainer.appendChild(pnl);
    }

    // 4. Tab logic override
    const _origShowTab = window.showHubTab;
    window.showHubTab = function(tab) {
        if (tab === 'bp') {
            const tabs = ['home', 'packs', 'collection', 'deckbuilder', 'play', 'profile', 'bp', 'themes'];
            tabs.forEach(t => {
                const b = document.getElementById(`hub-tab-${t}`);
                const p = document.getElementById(`hub-panel-${t}`);
                if (b) b.classList.toggle('active-tab', t === 'bp');
                if (p) p.style.display = (t === 'bp' ? 'block' : 'none');
            });
            renderBattlePass();
        } else {
            if (document.getElementById('hub-tab-bp')) document.getElementById('hub-tab-bp').classList.remove('active-tab');
            if (document.getElementById('hub-panel-bp')) document.getElementById('hub-panel-bp').style.display = 'none';
            if (_origShowTab) _origShowTab(tab);
        }
    };

    // 5. AUTO-HOOK FOR BATTLE POINTS (แก้ปัญหาเล่นแล้วไม่ได้แต้ม)
    _patchPointRewards();
    _patchAllJJKMechanics();
});

// ─── Core Battle Pass Functions ───

function getPointsRequired(level) {
    return 100 * level; 
}

function addBattlePoints(amount) {
    if (typeof playerData === 'undefined') return;
    playerData.bpPoints += amount;
    
    let leveledUp = false;
    while (playerData.bpLevel < BP_CONFIG.maxLevel) {
        let nextReq = getPointsRequired(playerData.bpLevel + 1);
        if (playerData.bpPoints >= nextReq) {
            playerData.bpPoints -= nextReq;
            playerData.bpLevel++;
            leveledUp = true;
        } else break;
    }
    
    if (leveledUp && typeof showToast === 'function') {
        showToast(`⭐ Battle Pass LV. ${playerData.bpLevel} UNLOCKED!`, '#fbbf24');
    }
    
    if (typeof saveData === 'function') saveData();
    if (typeof updateHubUI === 'function') updateHubUI();
}

// ระบบดักจับการจบเกมเพื่อจ่ายแต้ม BP
function _patchPointRewards() {
    // ดักจับ awardWin (ใน 15_collection.js)
    if (typeof window.awardWin === 'function') {
        const _origAwardWin = window.awardWin;
        window.awardWin = function() {
            const result = _origAwardWin.apply(this, arguments);
            addBattlePoints(BP_CONFIG.pointsPerGame);
            console.log("BP Awarded: +500 (Win)");
            return result;
        };
    }
    // ดักจับ awardLoss (ใน 15_collection.js)
    if (typeof window.awardLoss === 'function') {
        const _origAwardLoss = window.awardLoss;
        window.awardLoss = function() {
            const result = _origAwardLoss.apply(this, arguments);
            addBattlePoints(BP_CONFIG.pointsPerGame);
            console.log("BP Awarded: +500 (Loss)");
            return result;
        };
    }
}

function buyPremiumBP() {
    const isFirst = !playerData[BP_CONFIG.firstTimeKey];
    const cost = isFirst ? BP_CONFIG.premiumFirstTimePrice : BP_CONFIG.premiumPrice;
    if (playerData.gems < cost) { showToast('💎 Gems ไม่พอ!', '#f87171'); return; }
    if (confirm(`ซื้อ Premium Pass ในราคา ${cost} Gems?`)) {
        playerData.gems -= cost;
        playerData.hasPremiumBP = true;
        playerData[BP_CONFIG.firstTimeKey] = true;
        saveData(); updateHubUI(); renderBattlePass();
        showToast('👑 ปลดล็อก Premium Pass แล้ว!', '#4ade80');
    }
}

// ─── UI Rendering (Ultimate Showcase Edition) ───

function renderBattlePass() {
    const pnl = document.getElementById('hub-panel-bp');
    if (!pnl) return;

    const lv = playerData.bpLevel;
    const pts = playerData.bpPoints;
    const req = getPointsRequired(lv + 1);
    const pct = Math.min(100, (pts / req) * 100);

    let rowsHtml = '';
    for (let i = 1; i <= 20; i++) {
        const isReached = lv >= i;
        rowsHtml += `
        <div style="display: grid; grid-template-columns: 60px 1fr 1fr; gap: 15px; margin-bottom: 20px; align-items: stretch;">
            <!-- เลเวล -->
            <div style="display:flex; align-items:center; justify-content:center; background:${isReached?'#fbbf24':'#1f2937'}; color:${isReached?'#000':'#6b7280'}; font-weight:900; border-radius:15px; border:2px solid ${isReached?'#fbbf24':'#374151'}; font-size:1.5rem; box-shadow: 0 4px 10px rgba(0,0,0,0.3);">${i}</div>
            
            <!-- รางวัลฟรี -->
            <div style="background:${isReached?'rgba(251,191,36,0.05)':'#111827'}; border:2px solid ${isReached?'#fbbf24':'#374151'}; border-radius:20px; padding:15px; display:flex; flex-direction:column; align-items:center; justify-content:space-between; min-height:180px; position:relative; transition: 0.3s;">
                ${renderShowcaseItem(BP_REWARDS.free[i], 'free', i, isReached)}
            </div>

            <!-- รางวัลพรีเมียม -->
            <div style="background:${isReached && playerData.hasPremiumBP ? 'rgba(168,85,247,0.1)':'#0f172a'}; border:2px solid ${isReached && playerData.hasPremiumBP ? '#a855f7':'#374151'}; border-radius:20px; padding:15px; display:flex; flex-direction:column; align-items:center; justify-content:space-between; min-height:180px; position:relative; overflow:hidden;">
                ${!playerData.hasPremiumBP ? `<div style="position:absolute;inset:0;background:rgba(0,0,0,0.75);z-index:5;display:flex;align-items:center;justify-content:center;color:#fbbf24;font-size:2rem;backdrop-filter:blur(2px);">🔒</div>` : ''}
                ${renderShowcaseItem(BP_REWARDS.premium[i], 'premium', i, isReached)}
            </div>
        </div>`;
    }

    pnl.innerHTML = `
    <div style="max-width: 800px; margin: 0 auto; padding: 20px; color: white;">
        <!-- Header Section -->
        <div style="background: linear-gradient(135deg, #1e1b4b, #450a0a); border-radius: 35px; padding: 40px; border: 3px solid #fbbf24; margin-bottom: 40px; text-align: center; box-shadow: 0 20px 60px rgba(0,0,0,0.7);">
            <div style="font-weight: 900; color: #fbbf24; letter-spacing: 6px; font-size: 1rem; text-transform: uppercase; margin-bottom: 10px;">SEASON 1</div>
            <h1 style="font-size: 2.5rem; font-weight: 900; margin: 0; text-shadow: 0 0 25px rgba(251,191,36,0.6);">${BP_CONFIG.seasonName}</h1>
            
            <div style="max-width: 500px; margin: 30px auto 0;">
                <div style="display: flex; justify-content: space-between; font-size: 1rem; font-weight: bold; color: #9ca3af; margin-bottom: 10px;">
                    <span>LV. ${lv}</span>
                    <span style="color: #fbbf24;">${lv < 20 ? pts + ' / ' + req + ' BP' : 'MAX LEVEL ACHIEVED'}</span>
                </div>
                <div style="height: 16px; background: #000; border-radius: 8px; overflow: hidden; border: 1px solid #374151; padding: 2px;">
                    <div style="width: ${pct}%; height: 100%; background: linear-gradient(90deg, #fbbf24, #f59e0b); border-radius: 5px; transition: 0.5s; box-shadow: 0 0 20px #fbbf24;"></div>
                </div>
            </div>

            ${!playerData.hasPremiumBP ? `
                <button onclick="buyPremiumBP()" style="margin-top: 30px; background: linear-gradient(to right, #fbbf24, #d97706); color: #000; border: none; padding: 15px 50px; border-radius: 15px; font-weight: 900; cursor: pointer; transition: 0.3s; font-size: 1.1rem; box-shadow: 0 10px 25px rgba(251,191,36,0.4);" onmouseover="this.style.transform='translateY(-3px) scale(1.05)'" onmouseout="this.style.transform='translateY(0) scale(1)'">
                    👑 UNLOCK PREMIUM (${!playerData[BP_CONFIG.firstTimeKey] ? 99 : 199} Gems)
                </button>
            ` : `<div style="margin-top: 25px; color: #4ade80; font-weight: 900; font-size: 1.2rem; text-shadow: 0 0 10px #4ade80;">✨ PREMIUM ACCESS ACTIVE ✨</div>`}
        </div>

        <!-- Labels -->
        <div style="display: grid; grid-template-columns: 60px 1fr 1fr; gap: 15px; padding: 0 10px 20px; font-size: 0.9rem; color: #6b7280; font-weight: 900; text-align: center; text-transform: uppercase; letter-spacing: 2px;">
            <div>LV</div><div>FREE REWARDS</div><div>PREMIUM REWARDS</div>
        </div>

        <div>${rowsHtml}</div>
    </div>`;
}

function renderShowcaseItem(item, pool, level, isReached) {
    if (!item) return `<div style="color: #374151; margin: auto; font-size:0.8rem; font-weight:900;">NO REWARD</div>`;
    const claimedArr = pool === 'free' ? playerData.bpClaimedFree : playerData.bpClaimedPremium;
    const isClaimed = claimedArr.includes(level);
    const canClaim = isReached && !isClaimed && (pool === 'free' || playerData.hasPremiumBP);

    let contentHtml = "";

    if (item.type === 'card') {
        const art = JJK_CARDS_DATA[item.name]?.art || "";
        contentHtml = `
            <div style="width: 110px; height: 150px; border-radius: 12px; overflow: hidden; border: 2px solid #fbbf24; background: #000; position: relative; box-shadow: 0 10px 20px rgba(0,0,0,0.5);">
                <img src="${art}" style="width: 100%; height: 100%; object-fit: cover;">
                <div style="position: absolute; bottom: 0; left: 0; right: 0; background: rgba(0,0,0,0.85); font-size: 0.65rem; padding: 4px; text-align: center; font-weight:bold; border-top: 1px solid #fbbf24;">${item.name}</div>
            </div>`;
    } else if (item.type === 'avatar') {
        contentHtml = `
            <div style="width: 85px; height: 85px; border-radius: 50%; overflow: hidden; border: 4px solid #fbbf24; background: #000; margin-top: 10px; box-shadow: 0 0 15px rgba(251,191,36,0.3);">
                <img src="${item.art}" style="width: 100%; height: 100%; object-fit: cover;">
            </div>
            <div style="font-size: 0.7rem; font-weight: 900; color: #fbbf24; margin-top: 8px;">AVATAR</div>`;
    } else if (item.type === 'banner') {
        contentHtml = `
            <div style="width: 90%; height: 75px; border-radius: 12px; overflow: hidden; border: 2px solid #60a5fa; background: #000; margin-top: 10px; box-shadow: 0 5px 15px rgba(96,165,250,0.3);">
                <img src="${item.art}" style="width: 100%; height: 100%; object-fit: cover;">
            </div>
            <div style="font-size: 0.7rem; font-weight: 900; color: #60a5fa; margin-top: 8px;">BANNER</div>`;
    } else if (item.type === 'multi') {
        const cardRef = item.items.find(x=>x.type==='card');
        const avRef = item.items.find(x=>x.type==='avatar');
        contentHtml = `
            <div style="position: relative; width: 110px; height: 150px;">
                <img src="${JJK_CARDS_DATA[cardRef.name].art}" style="width: 100%; height: 100%; border-radius: 12px; border: 2px solid #fbbf24; object-fit: cover; box-shadow: 0 10px 20px rgba(0,0,0,0.5);">
                <img src="${avRef.art}" style="position: absolute; bottom: -10px; right: -10px; width: 55px; height: 55px; border-radius: 50%; border: 3px solid #fff; box-shadow: 0 5px 15px #000; z-index: 2;">
            </div>
            <div style="font-size: 0.65rem; font-weight: 900; margin-top: 15px; color: #fbbf24; text-shadow: 0 0 5px #000;">COLLECTOR BUNDLE</div>`;
    } else {
        const icon = item.type === 'coins' ? '🪙' : item.type === 'gems' ? '💎' : '⭐';
        const color = item.type === 'coins' ? '#fbbf24' : item.type === 'gems' ? '#60a5fa' : '#4ade80';
        contentHtml = `<div style="font-size: 3.5rem; filter: drop-shadow(0 0 15px ${color});">${icon}</div>
                       <div style="font-size: 1.3rem; font-weight: 900; color: ${color}; text-shadow: 0 0 10px rgba(0,0,0,0.5);">${item.amount}</div>`;
    }

    return `
        <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; width: 100%;">
            ${contentHtml}
            <div style="margin-top: 15px;">
                ${isClaimed ? `
                    <div style="color: #4ade80; font-weight: 900; font-size: 0.85rem; background: rgba(74,222,128,0.1); padding: 4px 15px; border-radius: 10px;">CLAIMED ✅</div>
                ` : canClaim ? `
                    <button onclick="claimBattlePassReward('${pool}', ${level})" style="background: linear-gradient(135deg, #fbbf24, #d97706); color: #000; border: none; padding: 8px 25px; border-radius: 10px; font-size: 0.85rem; font-weight: 900; cursor: pointer; box-shadow: 0 5px 15px rgba(251,191,36,0.3); transition: 0.2s;" onmouseover="this.style.transform='scale(1.1)'" onmouseout="this.style.transform='scale(1)'">CLAIM</button>
                ` : `
                    <div style="color: #4b5563; font-weight: 900; font-size: 0.75rem; border: 1px solid #374151; padding: 4px 12px; border-radius: 8px;">${isReached ? 'LOCKED' : 'LV.' + level}</div>
                `}
            </div>
        </div>`;
}

function claimBattlePassReward(pool, level) {
    const reward = BP_REWARDS[pool][level];
    if (!reward) return;

    const grant = (r) => {
        if (r.type === 'card') {
            const key = `${r.name}|${r.theme}`;
            playerData.collection[key] = (playerData.collection[key] || 0) + (r.count || 1);
        } else if (r.type === 'coins') {
            playerData.coins += r.amount;
        } else if (r.type === 'gems') {
            playerData.gems += r.amount;
        } else if (r.type === 'xp' && typeof addXp === 'function') {
            addXp(r.amount);
        } else if (r.type === 'avatar' || r.type === 'banner') {
            const cat = r.type === 'avatar' ? 'avatars' : 'banners';
            // เพิ่มเข้า Catalog เพื่อให้โชว์ในหน้าตกแต่ง
            if (typeof COSMETICS_CATALOG !== 'undefined' && !COSMETICS_CATALOG[cat].find(x => x.id === r.id)) {
                COSMETICS_CATALOG[cat].push({ id: r.id, label: r.label, art: r.art });
            }
        }
    };

    if (reward.type === 'multi') reward.items.forEach(grant);
    else grant(reward);

    if (pool === 'free') playerData.bpClaimedFree.push(level);
    else playerData.bpClaimedPremium.push(level);

    if (typeof saveData === 'function') saveData();
    if (typeof updateHubUI === 'function') updateHubUI();
    renderBattlePass();
    if (typeof showToast === 'function') showToast('🎁 ได้รับรางวัลเรียบร้อย!', '#4ade80');
}

// ─── Logic & Mechanics (JJK Passive Abilities) ───

function _patchAllJJKMechanics() {
    if (typeof initiateAttack === 'function') {
        const _origAtk = window.initiateAttack;
        window.initiateAttack = function(attackerId, targetId, targetIsBase) {
            if (typeof state === 'undefined' || targetIsBase) return _origAtk.apply(this, arguments);
            const atkKey = state.currentTurn;
            const defKey = atkKey === 'player' ? 'ai' : 'player';
            const attacker = state.players[atkKey].field.find(c => c.id === attackerId);
            const target = state.players[defKey].field.find(c => c.id === targetId);

            if (attacker) {
                const name = attacker.originalName || attacker.name;
                if (name === 'Yuji Itadori') {
                    const stats = getCharStats(attacker);
                    if (Math.random() < 0.5 || stats.hp < 3) {
                        attacker.atk *= 2; attacker._jjkCrit = true;
                        if (typeof log === 'function') log(`👊 [Yuji] Black Flash! Critical Damage!`, 'text-red-500 font-bold');
                    }
                }
                if (name === 'Toji Fushiguro' && target) {
                    if (getCharStats(target).hp > 7 && Math.random() < 0.5) {
                        attacker.atk *= 2; attacker._jjkCrit = true;
                        if (typeof log === 'function') log(`🗡️ [Toji] Critical Strike!`, 'text-zinc-400 font-bold');
                    }
                }
                if (target && (target.originalName || target.name) === 'Yuta Okkotsu') {
                    const rika = state.players[defKey].field.find(c => (c.originalName || c.name) === 'Rika' && c.hp > 0);
                    if (rika) {
                        if (typeof log === 'function') log(`🛡️ [Rika] Manifestation! รับความเสียหายแทนยูตะ!`, 'text-purple-400 font-bold');
                        arguments[1] = rika.id; 
                    }
                }
            }
            _origAtk.apply(this, arguments);
            if (attacker && attacker._jjkCrit) { attacker.atk /= 2; delete attacker._jjkCrit; }
            if (attacker && (attacker.originalName || attacker.name) === 'Nobara Kugisaki') {
                state.players[atkKey].hand.push(_mkJJKSpell('Hair Pin'));
            }
        };
    }

    if (typeof getCharStats === 'function') {
        const _origStats = window.getCharStats;
        window.getCharStats = function(char) {
            let stats = _origStats(char);
            if (char.silenced) return stats;
            const name = char.originalName || char.name;
            const ownerKey = state.players.player.field.some(c => c.id === char.id) ? 'player' : 'ai';
            const oppKey = ownerKey === 'player' ? 'ai' : 'player';

            if (name === 'Yuta Okkotsu') {
                const hasRika = state.players[ownerKey].field.some(c => (c.originalName || c.name) === 'Rika' && c.hp > 0);
                if (hasRika) { stats.atk += 5; stats.hp += 5; stats.maxHp += 5; }
            }
            if (name === 'Toji Fushiguro') {
                stats.damageMultiplier = 1; 
                if (state.players[oppKey].field.length >= 3) stats.atk += 5;
            }
            return stats;
        };
    }

    if (typeof triggerOnSummon === 'function') {
        const