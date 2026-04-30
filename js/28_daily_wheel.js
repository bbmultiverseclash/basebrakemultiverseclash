// ============================================================
// 28_daily_wheel.js — Daily Wheel Update, Nobita, Pandora's Actor
// ============================================================

const WHEEL_NEW_CARDS = {
    'Nobita': {
        name: 'Nobita', type: 'Character', cost: 3, atk: 2, hp: 4, maxHp: 4,
        text: 'On attack: 30% ทำดาเมจ +3 (แต่ถ้าใส่ Desert Eagle โอกาสจะเป็น 100%) | โดนโจมตี: 30% หลบหลีก',
        color: 'bg-yellow-600', maxAttacks: 1, shopOnly: true, // ไม่ให้อยู่ในแพ็คปกติ
        art: 'https://tse4.mm.bing.net/th/id/OIP.7WMUjbumqX2ihQ2rj-6u-QHaHa?rs=1&pid=ImgDetMain&o=7&rm=3', _theme: 'humanity'
    },
    'Pandora\'s Actor': {
        name: 'Pandora\'s Actor', type: 'Character', cost: 8, atk: 8, hp: 8, maxHp: 8,
        text: 'On Summon: สุ่มลอกเลียนแบบ Character 1 ตัวจากใน Deck (ศัตรูจะเห็นภาพและสเตตัสปลอม แต่พลังจริงคือ 8/8) และได้รับ Ability ทั้งหมดรวมถึงร่าย On Summon ของตัวนั้นทันที',
        color: 'bg-yellow-800', maxAttacks: 1, shopOnly: true, // ไม่ให้อยู่ในแพ็คปกติ
        art: 'https://file.garden/aeeLCXSsJxTPrRbp/31da9540e52dede1621af216636f7d26.jpg', _theme: 'isekai_adventure'
    }
};

const WHEEL_NEW_ARTSTYLES = {
    'nobita_cyber': { id: 'nobita_cyber', label: 'Nobita - 2D Cyber Realm', emoji: '👓', targetCard: 'Nobita', art: 'https://copilot.microsoft.com/th/id/BCO.c3dd7109-fe38-4ad1-b2e9-6b58a8b19e93.png', shopCost: 0, currency: 'wheel' },
    'farmer_steampunk': { id: 'farmer_steampunk', label: 'Farmer - Necrotic Steampunk', emoji: '🌾', targetCard: 'Farmer', art: 'https://copilot.microsoft.com/th/id/BCO.c9a73795-5e6d-48f0-9fe1-54492a68259d.png', shopCost: 0, currency: 'wheel' }
};

document.addEventListener('DOMContentLoaded', () => {

    // 1. ตรวจสอบ Player Data
    if (typeof playerData !== 'undefined') {
        if (playerData.wheelLastSpin === undefined) playerData.wheelLastSpin = 0;
        if (playerData.wheelSpinCount === undefined) playerData.wheelSpinCount = 0;
        if (playerData.wheelExtraSpins === undefined) playerData.wheelExtraSpins = 0;
    }

    // 2. แทรกการ์ดเข้า CardSets
    if (typeof CardSets !== 'undefined') {
        if (!CardSets['humanity']) CardSets['humanity'] = {};
        if (!CardSets['isekai_adventure']) CardSets['isekai_adventure'] = {};
        CardSets['humanity']['Nobita'] = JSON.parse(JSON.stringify(WHEEL_NEW_CARDS['Nobita']));
        CardSets['isekai_adventure']["Pandora's Actor"] = JSON.parse(JSON.stringify(WHEEL_NEW_CARDS["Pandora's Actor"]));
    }

    // 3. แทรก Artstyle, Avatar, Banner
    if (typeof ARTSTYLE_CFG !== 'undefined') {
        Object.assign(ARTSTYLE_CFG, WHEEL_NEW_ARTSTYLES);
    }
    if (typeof COSMETICS_CATALOG !== 'undefined') {
        if (!COSMETICS_CATALOG.avatars.find(a => a.id === 'av_nobita')) {
            COSMETICS_CATALOG.avatars.push({ id: 'av_nobita', label: 'Nobita's Bright Smile', art: 'https://copilot.microsoft.com/th/id/BCO.c5616167-ad5a-4d1f-93b5-a7839328131e.png' });
        }
        if (!COSMETICS_CATALOG.banners.find(b => b.id === 'bn_nobita')) {
            COSMETICS_CATALOG.banners.push({ id: 'bn_nobita', label: 'Nobita's Dream Odyssey', art: 'https://copilot.microsoft.com/th/id/BCO.73f22404-bc70-4e59-b121-13f1a1313ccc.png' });
        }
    }

    // 4. โค้ดใหม่
    if (typeof REDEEM_CODES !== 'undefined') {
        REDEEM_CODES['DAILYWHEELMYBOY'] = { coins: 1000, bossKeys: 15, label: '🎡 Wheel Starter Kit', oneTime: true };
        REDEEM_CODES['REZEROSOHARD'] = { specialRzTokens: true, label: '🔮 Re:Zero Extra Tokens', oneTime: true };
    }

    if (typeof window.redeemCode === 'function') {
        const _origRDM2 = window.redeemCode;
        window.redeemCode = function() {
            const raw = document.getElementById('redeem-input')?.value?.trim().toUpperCase();
            const reward = (typeof REDEEM_CODES !== 'undefined') ? REDEEM_CODES[raw] : null;
            if (reward && reward.specialRzTokens) {
                const used = typeof getUsedCodes === 'function' ? getUsedCodes() :[];
                const msg = document.getElementById('redeem-msg');
                if (reward.oneTime && used.includes(raw)) {
                    if (msg) { msg.style.color='#f87171'; msg.textContent='❌ โค้ดนี้ใช้ไปแล้ว'; } return;
                }
                const randomExtra = Math.floor(Math.random() * 25) + 1; // 1-25
                const totalTokens = 25 + randomExtra;
                playerData.rzNormalTokens = (playerData.rzNormalTokens || 0) + totalTokens;
                
                if (typeof markCodeUsed === 'function') markCodeUsed(raw);
                if (typeof saveData === 'function') saveData();
                if (typeof updateHubUI === 'function') updateHubUI();
                
                if (msg) { msg.style.color='#38bdf8'; msg.textContent=`🎉 ได้รับ ${totalTokens} Normal Tokens!`; }
                if (typeof showToast === 'function') showToast(`🎁 รับ ${totalTokens} Tokens สำเร็จ!`, '#38bdf8');
                document.getElementById('redeem-input').value = '';
                return;
            }
            _origRDM2.apply(this, arguments);
        };
    }

    // 5. แทรก UI ปุ่ม Daily Wheel
    const navBar = document.querySelector('.hub-nav-bar');
    if (navBar && !document.getElementById('hub-tab-wheel')) {
        const btn = document.createElement('button');
        btn.id = 'hub-tab-wheel';
        btn.className = 'hub-nav-btn';
        btn.innerHTML = '🎡 Wheel';
        btn.onclick = () => { if (typeof showHubTab === 'function') showHubTab('wheel'); };
        navBar.appendChild(btn);
    }
    const container = document.getElementById('hub-panel-home')?.parentElement;
    if (container && !document.getElementById('hub-panel-wheel')) {
        const pnl = document.createElement('div');
        pnl.id = 'hub-panel-wheel';
        pnl.className = 'hub-panel';
        pnl.style.display = 'none';
        container.appendChild(pnl);
    }

    if (typeof window.showHubTab === 'function') {
        const _ot = window.showHubTab;
        window.showHubTab = function(tab) {
            const btn = document.getElementById('hub-tab-wheel');
            const pnl = document.getElementById('hub-panel-wheel');
            if (tab === 'wheel') {['home','packs','collection','deckbuilder','play','profile','themes','bp','trade','social','quests','dungeon'].forEach(t => {
                    const b = document.getElementById(`hub-tab-${t}`);
                    const p = document.getElementById(`hub-panel-${t}`);
                    if (b) b.classList.remove('active-tab');
                    if (p) p.style.display = 'none';
                });
                if (btn) btn.classList.add('active-tab');
                if (pnl) { pnl.style.display = 'block'; renderWheelPanel(); }
            } else {
                if (btn) btn.classList.remove('active-tab');
                if (pnl) pnl.style.display = 'none';
                _ot(tab);
            }
        };
    }

    // 6. Mechanics Hooks (Nobita & Pandora)
    _hookWheelMechanics();
});

// ─── WHEEL REWARDS & LOGIC ───
const WHEEL_REWARDS =[
    { id: 'coin_300',     prob: 35, type: 'coins', val: 300,   label: '300 Coins', icon: '🪙', color: '#fbbf24' },
    { id: 'coin_500',     prob: 15, type: 'coins', val: 500,   label: '500 Coins', icon: '🪙', color: '#fcd34d' },
    { id: 'key_1',        prob: 10, type: 'keys',  val: 1,     label: '1 Boss Key', icon: '🔑', color: '#93c5fd' },
    { id: 'xp_1500',      prob: 9,  type: 'xp',    val: 1500,  label: '1,500 XP', icon: '⭐', color: '#4ade80' },
    { id: 'key_5',        prob: 5,  type: 'keys',  val: 5,     label: '5 Boss Keys', icon: '🔑', color: '#60a5fa' },
    { id: 'gem_5',        prob: 5,  type: 'gems',  val: 5,     label: '5 Gems', icon: '💎', color: '#c084fc' },
    { id: 'coin_4000',    prob: 4,  type: 'coins', val: 4000,  label: '4,000 Coins', icon: '🪙', color: '#f59e0b' },
    { id: 'char_nobita',  prob: 3,  type: 'card',  val: 'Nobita', theme: 'humanity', label: 'Nobita (Card)', icon: '👓', color: '#fcd34d' },
    { id: 'ava_nobita',   prob: 3,  type: 'avatar',val: 'av_nobita', label: 'Nobita's Bright Smile', icon: '👤', color: '#a78bfa' },
    { id: 'ban_nobita',   prob: 2,  type: 'banner',val: 'bn_nobita', label: 'Nobita's Dream Odyssey', icon: '🖼️', color: '#a78bfa' },
    { id: 'gem_10',       prob: 2,  type: 'gems',  val: 10,    label: '10 Gems', icon: '💎', color: '#d8b4fe' },
    { id: 'art_nobita',   prob: 1,  type: 'artstyle',val: 'nobita_cyber', label: 'Nobita Cyber Realm', icon: '🎨', color: '#f472b6' },
    { id: 'art_farmer',   prob: 1,  type: 'artstyle',val: 'farmer_steampunk', label: 'Farmer Steampunk', icon: '🎨', color: '#f472b6' },
    { id: 'char_pandora', prob: 1,  type: 'card',  val: "Pandora's Actor", theme: 'isekai_adventure', label: 'Pandora\'s Actor', icon: '🎭', color: '#fbbf24' },
    { id: 'coin_10000',   prob: 1,  type: 'coins', val: 10000, label: '10,000 Coins', icon: '💰', color: '#f59e0b' },
    { id: 'gem_30',       prob: 1,  type: 'gems',  val: 30,    label: '30 Gems', icon: '💎', color: '#c084fc' },
    { id: 'spin_7',       prob: 1,  type: 'spins', val: 7,     label: '7 Free Spins!', icon: '🎰', color: '#34d399' },
    { id: 'xp_15000',     prob: 1,  type: 'xp',    val: 15000, label: '15,000 XP', icon: '🌟', color: '#4ade80' }
];

let _wheelTimerInterval = null;

function renderWheelPanel() {
    const pnl = document.getElementById('hub-panel-quests')?.parentElement?.querySelector('#hub-panel-wheel');
    if (!pnl) return;

    if (_wheelTimerInterval) clearInterval(_wheelTimerInterval);

    const now = Date.now();
    const lastSpin = playerData.wheelLastSpin || 0;
    const cooldown = 24 * 60 * 60 * 1000;
    const extraSpins = playerData.wheelExtraSpins || 0;
    const spinCount = playerData.wheelSpinCount || 0;
    
    // คำนวณ Pity
    const spinsToNobita = 15 - (spinCount % 15);
    const spinsToCosmetic = 30 - (spinCount % 30);

    const canFreeSpin = (now - lastSpin >= cooldown);
    const canSpin = canFreeSpin || extraSpins > 0;

    let timeText = '';
    if (!canFreeSpin) {
        const rem = cooldown - (now - lastSpin);
        const h = Math.floor(rem / 3600000);
        const m = Math.floor((rem % 3600000) / 60000);
        timeText = `รอบฟรีถัดไปใน: ${h} ชม. ${m} นาที`;
    } else {
        timeText = '✅ วงล้อฟรีพร้อมใช้งานแล้ว!';
    }

    pnl.innerHTML = `
    <div style="max-width:600px;margin:0 auto;padding:20px;text-align:center;">
        <div style="font-size:3.5rem;margin-bottom:10px;">🎡</div>
        <div style="font-size:1.8rem;font-weight:900;color:#fbbf24;text-shadow:0 0 15px rgba(251,191,36,0.5);">Daily Wheel</div>
        <div style="font-size:0.85rem;color:#9ca3af;margin-bottom:20px;">หมุนวงล้อฟรีทุก 24 ชั่วโมง ลุ้นรับตัวละครลับ Nobita และสกินพิเศษ!</div>

        <div style="background:#111827;border:2px solid #374151;border-radius:20px;padding:25px;box-shadow:0 0 40px rgba(0,0,0,0.5);margin-bottom:20px;">
            <div style="font-size:1.2rem;font-weight:900;color:${canFreeSpin ? '#4ade80' : '#f87171'};margin-bottom:10px;">
                ${timeText}
            </div>
            ${extraSpins > 0 ? `<div style="font-size:1rem;color:#60a5fa;font-weight:bold;margin-bottom:15px;">🎟️ คุณมีสิทธิ์หมุนพิเศษ: ${extraSpins} ครั้ง</div>` : ''}

            <button id="btn-spin-wheel" onclick="executeWheelSpin()" ${canSpin ? '' : 'disabled'}
                style="background:${canSpin ? 'linear-gradient(135deg, #d97706, #b45309)' : '#374151'};
                       color:${canSpin ? 'white' : '#6b7280'};border:none;padding:15px 40px;border-radius:15px;
                       font-weight:900;font-size:1.2rem;cursor:${canSpin ? 'pointer' : 'not-allowed'};
                       box-shadow:${canSpin ? '0 0 20px rgba(217,119,6,0.5)' : 'none'};transition:0.2s;">
                ${canSpin ? '🎰 หมุนวงล้อเลย!' : '⏳ รอเวลา...'}
            </button>
        </div>

        <div style="display:flex;gap:15px;justify-content:center;margin-bottom:20px;">
            <div style="background:rgba(251,191,36,0.1);border:1px solid #fbbf24;padding:12px;border-radius:12px;flex:1;">
                <div style="font-size:0.7rem;color:#fbbf24;">การันตี Nobita ในอีก</div>
                <div style="font-size:1.5rem;font-weight:900;color:white;">${spinsToNobita} <span style="font-size:0.8rem;">หมุน</span></div>
            </div>
            <div style="background:rgba(192,132,252,0.1);border:1px solid #c084fc;padding:12px;border-radius:12px;flex:1;">
                <div style="font-size:0.7rem;color:#c084fc;">การันตี Cosmetic ในอีก</div>
                <div style="font-size:1.5rem;font-weight:900;color:white;">${spinsToCosmetic} <span style="font-size:0.8rem;">หมุน</span></div>
            </div>
        </div>

        <div style="text-align:left;background:#1f2937;padding:15px;border-radius:12px;font-size:0.75rem;color:#9ca3af;line-height:1.6;">
            <strong style="color:white;">ℹ️ กฎของวงล้อ:</strong><br>
            • ได้การ์ดซ้ำได้ปกติ แต่ถ้าได้ Cosmetic (Banner, Artstyle, รูปโปรไฟล์) ที่มีอยู่แล้ว จะได้รับ <b style="color:#93c5fd;">15 Gems ชดเชยแทน</b><br>
            • ทุกๆ 15 ครั้ง การันตีได้ <b style="color:#fcd34d;">Nobita</b><br>
            • ทุกๆ 30 ครั้ง การันตีได้ Cosmetic แรร์ 1 อย่าง (Nobita Artstyle, Farmer Artstyle, Avatar หรือ Banner)<br>
            • หมุน 1 ครั้ง = นับ 1 ครั้ง (หมุนฟรีหรือใช้ตั๋วพิเศษก็นับ)
        </div>
    </div>`;

    if (!canFreeSpin && extraSpins <= 0) {
        _wheelTimerInterval = setInterval(() => {
            const r = cooldown - (Date.now() - playerData.wheelLastSpin);
            if (r <= 0) {
                renderWheelPanel();
            } else {
                const h = Math.floor(r / 3600000);
                const m = Math.floor((r % 3600000) / 60000);
                const timeEl = pnl.querySelector('div[style*="font-size:1.2rem"]');
                if (timeEl) timeEl.innerText = `รอบฟรีถัดไปใน: ${h} ชม. ${m} นาที`;
            }
        }, 60000); // อัปเดตทุกนาที
    }
}

window.executeWheelSpin = function() {
    const now = Date.now();
    const cooldown = 24 * 60 * 60 * 1000;
    
    if (now - (playerData.wheelLastSpin || 0) >= cooldown) {
        playerData.wheelLastSpin = now; // ใช้โควต้ารายวัน
    } else if ((playerData.wheelExtraSpins || 0) > 0) {
        playerData.wheelExtraSpins--; // ใช้ตั๋ว
    } else {
        return; // หมุนไม่ได้
    }

    playerData.wheelSpinCount = (playerData.wheelSpinCount || 0) + 1;
    const spins = playerData.wheelSpinCount;
    
    let reward = null;

    // เช็ค Pity
    if (spins % 30 === 0) {
        // Guarantee Cosmetic (25% each)
        const cosPool =['art_nobita', 'art_farmer', 'ava_nobita', 'ban_nobita'];
        const pick = cosPool[Math.floor(Math.random() * cosPool.length)];
        reward = WHEEL_REWARDS.find(r => r.id === pick);
    } else if (spins % 15 === 0) {
        // Guarantee Nobita
        reward = WHEEL_REWARDS.find(r => r.id === 'char_nobita');
    } else {
        // Normal Roll
        let roll = Math.random() * 100;
        for (let r of WHEEL_REWARDS) {
            roll -= r.prob;
            if (roll <= 0) {
                reward = r;
                break;
            }
        }
    }

    if (!reward) reward = WHEEL_REWARDS[0]; // Fallback

    giveWheelReward(reward);
};

function giveWheelReward(reward) {
    let title = '🎉 ยินดีด้วย!';
    let msg = `คุณได้รับ ${reward.label}`;
    let isDupe = false;

    if (reward.type === 'coins') {
        playerData.coins = (playerData.coins || 0) + reward.val;
    } else if (reward.type === 'gems') {
        playerData.gems = (playerData.gems || 0) + reward.val;
    } else if (reward.type === 'keys') {
        playerData.bossKeys = (playerData.bossKeys || 0) + reward.val;
    } else if (reward.type === 'xp') {
        if (typeof addXp === 'function') addXp(reward.val);
    } else if (reward.type === 'spins') {
        playerData.wheelExtraSpins = (playerData.wheelExtraSpins || 0) + reward.val;
    } else if (reward.type === 'card') {
        const key = `${reward.val}|${reward.theme}`;
        playerData.collection[key] = (playerData.collection[key] || 0) + 1;
    } else if (reward.type === 'artstyle') {
        if (!playerData.unlockedArtstyles) playerData.unlockedArtstyles =[];
        if (playerData.unlockedArtstyles.includes(reward.val)) {
            isDupe = true;
        } else {
            playerData.unlockedArtstyles.push(reward.val);
        }
    } else if (reward.type === 'avatar' || reward.type === 'banner') {
        if (!playerData.unlockedCosmetics) playerData.unlockedCosmetics =[];
        if (playerData.unlockedCosmetics.includes(reward.val)) {
            isDupe = true;
        } else {
            playerData.unlockedCosmetics.push(reward.val);
        }
    }

    if (isDupe) {
        playerData.gems = (playerData.gems || 0) + 15;
        title = '🔁 ของซ้ำ!';
        msg = `คุณมี ${reward.label} อยู่แล้ว<br><b style="color:#93c5fd;">ได้รับ 15 Gems ชดเชย!</b>`;
    }

    saveData();
    if (typeof updateHubUI === 'function') updateHubUI();
    renderWheelPanel();

    // Show Popup
    const ov = document.createElement('div');
    ov.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,0.95);z-index:9999;display:flex;align-items:center;justify-content:center;animation:fadeIn 0.3s ease;';
    ov.innerHTML = `
    <div style="background:linear-gradient(135deg,#1e1b4b,#2e1065);border:3px solid ${reward.color};border-radius:24px;padding:30px;max-width:350px;width:90%;text-align:center;box-shadow:0 0 60px ${reward.color}66;">
        <div style="font-size:4rem;margin-bottom:10px;">${reward.icon}</div>
        <div style="font-size:1.5rem;font-weight:900;color:${reward.color};margin-bottom:10px;">${title}</div>
        <div style="font-size:1rem;color:white;margin-bottom:20px;line-height:1.5;">${msg}</div>
        <button onclick="this.parentElement.parentElement.remove()" style="background:${reward.color};color:black;border:none;padding:12px 30px;border-radius:12px;font-weight:900;font-size:1.1rem;cursor:pointer;">รับรางวัล</button>
    </div>`;
    document.body.appendChild(ov);
}

// ─── HOOK MECHANICS (Nobita & Pandora) ───
function _hookWheelMechanics() {
    
    // 1. Pandora Visual Illusion & Render
    if (typeof window.renderCard === 'function') {
        const _origRender = window.renderCard;
        window.renderCard = function(card, inHand, displayCost, currentStats) {
            // ถ้าเป็นการ์ดที่ Pandora ก๊อปปี้มา และไม่ได้อยู่ในมือ (คู่ต่อสู้เห็น)
            if (card && card._isPandoraActor && !inHand) {
                // หลอกตาคู่ต่อสู้ให้เห็น Stat ปลอมที่ก๊อปมา
                const fakeStats = currentStats ? {...currentStats} : getCharStats(card);
                fakeStats.atk = card._fakeDisplayAtk !== undefined ? card._fakeDisplayAtk : fakeStats.atk;
                fakeStats.hp = card._fakeDisplayHp !== undefined ? card._fakeDisplayHp : fakeStats.hp;
                return _origRender(card, inHand, displayCost, fakeStats);
            }
            return _origRender.apply(this, arguments);
        };
    }

    if (typeof window.getCharStats === 'function') {
        const _origStatsW = window.getCharStats;
        window.getCharStats = function(char) {
            let stats = _origStatsW.apply(this, arguments);
            // ค่าพลังคำนวณจริงของ Pandora คือ 8/8 เสมอ
            if (char._isPandoraActor && !char.silenced) {
                stats.atk = 8;
                stats.maxHp = 8;
                // ป้องกันเลือดเกิน 8 ถ้าโดนตีไปแล้ว
                stats.hp = Math.min(8, char.hp); 
            }
            return stats;
        };
    }

    if (typeof window.triggerOnSummon === 'function') {
        const _origSummonW = window.triggerOnSummon;
        window.triggerOnSummon = function(card, pk) {
            const eff = card.originalName || card.name;
            
            if (eff === "Pandora's Actor" && !card.silenced && !card._isPandoraActor) {
                const p = state.players[pk];
                const deckChars = p.deck.filter(c => c.type === 'Character' || c.type === 'Champion');
                
                if (deckChars.length > 0) {
                    const mimic = deckChars[Math.floor(Math.random() * deckChars.length)];
                    card._isPandoraActor = true;
                    
                    // เปลี่ยนรูปลักษณ์ให้เหมือนตัวจริง
                    card.name = mimic.name;
                    card.originalName = mimic.originalName || mimic.name;
                    card.art = mimic.art;
                    card.text = mimic.text;
                    
                    // บันทึก Stat ปลอมไว้โชว์
                    card._fakeDisplayAtk = mimic.atk;
                    card._fakeDisplayHp = mimic.hp;
                    
                    // เซ็ต Stat จริง
                    card.hp = 8;
                    card.atk = 8;
                    card.maxHp = 8;

                    if (typeof log === 'function') log(`🎭 [Pandora's Actor] มหาเวทแปลงกาย! คัดลอกรูปแบบของ ${mimic.name}!`, 'text-yellow-400 font-bold');
                    
                    // ให้ระบบรัน On Summon ของตัวที่ก๊อปปี้มาต่อ
                } else {
                    if (typeof log === 'function') log(`🎭 [Pandora's Actor] ไม่มี Character ในเด็คให้แปลงร่าง!`, 'text-gray-400');
                }
            }

            // รันระบบเดิม (ถ้าก๊อปปี้มา ระบบจะเข้าใจว่าเป็นตัวนั้นและร่าย On Summon เอง)
            _origSummon.apply(this, arguments);
        };
    }

    // 2. Nobita Evasion & Attack
    if (typeof window.initiateAttack === 'function') {
        const _origInitW = window.initiateAttack;
        window.initiateAttack = function(atkId, tgtId, isBase) {
            if (typeof state === 'undefined' || isBase) {
                return _origInitW.apply(this, arguments);
            }

            const pk = state.currentTurn;
            const oppKey = pk === 'player' ? 'ai' : 'player';
            const attacker = state.players[pk].field.find(c => c.id === atkId);
            const target = state.players[oppKey].field.find(c => c.id === tgtId);

            if (attacker && target) {
                const tName = target.originalName || target.name;
                const aName = attacker.originalName || attacker.name;

                // Nobita Defend (30% Evade)
                if (tName === 'Nobita' && !target.silenced) {
                    if (Math.random() < 0.3) {
                        if (typeof log === 'function') log(`👓 [Nobita] วิ่งหนีสุดชีวิต! หลบการโจมตีได้สำเร็จ!`, 'text-yellow-300 font-bold');
                        attacker.attacksLeft -= 1;
                        state.selectedCardId = null;
                        if (typeof updateUI === 'function') updateUI();
                        return; // หลบได้
                    }
                }

                // Nobita Attack (30% +3 DMG หรือ 100% ถ้าใส่ Desert Eagle)
                if (aName === 'Nobita' && !attacker.silenced) {
                    const hasEagle = attacker.items && attacker.items.some(i => i.name === 'Desert Eagle');
                    if (hasEagle || Math.random() < 0.3) {
                        attacker.atk += 3;
                        attacker._nobitaBoost = true;
                        if (typeof log === 'function') log(`🔫 [Nobita] จับปืนแล้วแม่นสุดๆ! ดาเมจ +3!`, 'text-red-400 font-bold');
                    }
                }
            }

            _origInitW.apply(this, arguments);

            // Revert Nobita ATK
            if (attacker && attacker._nobitaBoost) {
                attacker.atk -= 3;
                attacker._nobitaBoost = false;
            }
        };
    }
}
