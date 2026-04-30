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
    "Pandora's Actor": {
        name: "Pandora's Actor", type: 'Character', cost: 8, atk: 8, hp: 8, maxHp: 8,
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
            COSMETICS_CATALOG.avatars.push({ id: 'av_nobita', label: "Nobita's Bright Smile", art: 'https://copilot.microsoft.com/th/id/BCO.c5616167-ad5a-4d1f-93b5-a7839328131e.png' });
        }
        if (!COSMETICS_CATALOG.banners.find(b => b.id === 'bn_nobita')) {
            COSMETICS_CATALOG.banners.push({ id: 'bn_nobita', label: "Nobita's Dream Odyssey", art: 'https://copilot.microsoft.com/th/id/BCO.73f22404-bc70-4e59-b121-13f1a1313ccc.png' });
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
                const totalNormal = 25 + randomExtra;
                playerData.rzNormalTokens = (playerData.rzNormalTokens || 0) + totalNormal; // ได้ Normal Token 25 + โบนัสสุ่ม
                
                if (typeof markCodeUsed === 'function') markCodeUsed(raw);
                if (typeof saveData === 'function') saveData();
                if (typeof updateHubUI === 'function') updateHubUI();
                
                if (msg) { msg.style.color='#c084fc'; msg.textContent=`🎉 ได้รับ 25 Premium & ${randomExtra} Normal Tokens!`; }
                if (typeof showToast === 'function') showToast(`🎁 รับ 25 Premium & ${randomExtra} Normal Tokens สำเร็จ!`, '#c084fc');
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
    // แก้ไข: ใช้เครื่องหมาย Double Quote ครอบข้อความที่มี ' อยู่ข้างใน
    { id: 'ava_nobita',   prob: 3,  type: 'avatar',val: 'av_nobita', label: "Nobita's Bright Smile", icon: '👤', color: '#a78bfa' },
    { id: 'ban_nobita',   prob: 2,  type: 'banner',val: 'bn_nobita', label: "Nobita's Dream Odyssey", icon: '🖼️', color: '#a78bfa' },
    { id: 'gem_10',       prob: 2,  type: 'gems',  val: 10,    label: '10 Gems', icon: '💎', color: '#d8b4fe' },
    { id: 'art_nobita',   prob: 1,  type: 'artstyle',val: 'nobita_cyber', label: 'Nobita Cyber Realm', icon: '🎨', color: '#f472b6' },
    { id: 'art_farmer',   prob: 1,  type: 'artstyle',val: 'farmer_steampunk', label: 'Farmer Steampunk', icon: '🎨', color: '#f472b6' },
    // แก้ไข: หลีกเลี่ยงบัค Single quote เช่นกัน
    { id: 'char_pandora', prob: 1,  type: 'card',  val: "Pandora's Actor", theme: 'isekai_adventure', label: "Pandora's Actor", icon: '🎭', color: '#fbbf24' },
    { id: 'coin_10000',   prob: 1,  type: 'coins', val: 10000, label: '10,000 Coins', icon: '💰', color: '#f59e0b' },
    { id: 'gem_30',       prob: 1,  type: 'gems',  val: 30,    label: '30 Gems', icon: '💎', color: '#c084fc' },
    { id: 'spin_7',       prob: 1,  type: 'spins', val: 7,     label: '7 Free Spins!', icon: '🎰', color: '#34d399' },
    { id: 'xp_15000',     prob: 1,  type: 'xp',    val: 15000, label: '15,000 XP', icon: '🌟', color: '#4ade80' }
];

let _wheelTimerInterval = null;
let _isSpinning = false; // ตัวแปรเช็คว่าวงล้อกำลังหมุนอยู่หรือไม่

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
    const canSpin = (canFreeSpin || extraSpins > 0) && !_isSpinning;

    let timeText = '';
    if (!canFreeSpin) {
        const rem = cooldown - (now - lastSpin);
        const h = Math.floor(rem / 3600000);
        const m = Math.floor((rem % 3600000) / 60000);
        timeText = `รอบฟรีถัดไปใน: ${h} ชม. ${m} นาที`;
    } else {
        timeText = '✅ วงล้อฟรีพร้อมใช้งานแล้ว!';
    }

    // สร้างพื้นหลังวงล้อด้วย CSS Conic Gradient
    const numSlices = WHEEL_REWARDS.length;
    const sliceDeg = 360 / numSlices;
    let gradientParts =[];
    let iconsHtml = '';

    WHEEL_REWARDS.forEach((r, i) => {
        gradientParts.push(`${r.color} ${i * sliceDeg}deg ${(i + 1) * sliceDeg}deg`);
        
        // คำนวณตำแหน่ง Emoji ให้อยู่ตรงกลางของแต่ละช่อง
        const rot = (i * sliceDeg) + (sliceDeg / 2);
        iconsHtml += `
            <div style="position:absolute; top:50%; left:50%; width:30px; height:30px; margin-top:-15px; margin-left:-15px;
                        transform: rotate(${rot}deg) translateY(-110px) rotate(90deg);
                        display:flex; align-items:center; justify-content:center;
                        font-size:1.5rem; text-shadow: 0 0 5px rgba(0,0,0,0.8); z-index: 2;">
                ${r.icon}
            </div>
        `;
    });

    const wheelBackground = `conic-gradient(${gradientParts.join(', ')})`;

    pnl.innerHTML = `
    <div style="max-width:600px;margin:0 auto;padding:20px;text-align:center;overflow-x:hidden;">
        <div style="font-size:1.8rem;font-weight:900;color:#fbbf24;text-shadow:0 0 15px rgba(251,191,36,0.5);margin-bottom:5px;">🎡 Daily Wheel</div>
        <div style="font-size:0.85rem;color:#9ca3af;margin-bottom:15px;">หมุนวงล้อฟรีทุก 24 ชั่วโมง ลุ้นรับตัวละครลับ Nobita และสกินพิเศษ!</div>

        <div style="background:#111827;border:2px solid #374151;border-radius:24px;padding:25px 15px;box-shadow:0 0 40px rgba(0,0,0,0.5);margin-bottom:20px;position:relative;overflow:hidden;">
            
            <!-- WHEEL ANIMATION CONTAINER -->
            <div style="position:relative; width:280px; height:280px; margin:0 auto 20px;">
                <!-- Pointer (เข็มชี้) -->
                <div style="position:absolute; top:-15px; left:50%; transform:translateX(-50%); z-index:10; font-size:2.5rem; filter:drop-shadow(0 4px 4px rgba(0,0,0,0.8));">
                    🔽
                </div>
                
                <!-- The Wheel -->
                <div id="the-roulette-wheel" style="width:100%; height:100%; border-radius:50%; background:${wheelBackground}; border:6px solid #fbbf24; box-shadow:0 0 20px rgba(251,191,36,0.4), inset 0 0 20px rgba(0,0,0,0.5); position:relative; box-sizing:border-box;">
                    ${iconsHtml}
                    <!-- หมุดตรงกลาง -->
                    <div style="position:absolute; top:50%; left:50%; transform:translate(-50%, -50%); width:40px; height:40px; background:#1f2937; border:4px solid #fbbf24; border-radius:50%; z-index:5; box-shadow:0 0 10px rgba(0,0,0,0.8);"></div>
                </div>
            </div>

            <div style="font-size:1.1rem;font-weight:900;color:${canFreeSpin ? '#4ade80' : '#f87171'};margin-bottom:10px;">
                ${timeText}
            </div>
            ${extraSpins > 0 ? `<div style="font-size:0.9rem;color:#60a5fa;font-weight:bold;margin-bottom:15px;">🎟️ คุณมีสิทธิ์หมุนพิเศษ: ${extraSpins} ครั้ง</div>` : ''}

            <button id="btn-spin-wheel" onclick="executeWheelSpin()" ${canSpin ? '' : 'disabled'}
                style="background:${canSpin ? 'linear-gradient(135deg, #d97706, #b45309)' : '#374151'};
                       color:${canSpin ? 'white' : '#6b7280'};border:none;padding:12px 40px;border-radius:15px;
                       font-weight:900;font-size:1.2rem;cursor:${canSpin ? 'pointer' : 'not-allowed'};
                       box-shadow:${canSpin ? '0 0 20px rgba(217,119,6,0.5)' : 'none'};transition:0.2s;width:200px;">
                ${_isSpinning ? '🎡 กำลังหมุน...' : canSpin ? '🎰 หมุนวงล้อ!' : '⏳ รอเวลา...'}
            </button>
        </div>

        <div style="display:flex;gap:10px;justify-content:center;margin-bottom:20px;">
            <div style="background:rgba(251,191,36,0.1);border:1px solid #fbbf24;padding:10px;border-radius:12px;flex:1;">
                <div style="font-size:0.65rem;color:#fbbf24;">การันตี Nobita ในอีก</div>
                <div style="font-size:1.3rem;font-weight:900;color:white;">${spinsToNobita} <span style="font-size:0.7rem;">หมุน</span></div>
            </div>
            <div style="background:rgba(192,132,252,0.1);border:1px solid #c084fc;padding:10px;border-radius:12px;flex:1;">
                <div style="font-size:0.65rem;color:#c084fc;">การันตี Cosmetic ในอีก</div>
                <div style="font-size:1.3rem;font-weight:900;color:white;">${spinsToCosmetic} <span style="font-size:0.7rem;">หมุน</span></div>
            </div>
        </div>

        <div style="text-align:left;background:#1f2937;padding:15px;border-radius:12px;font-size:0.7rem;color:#9ca3af;line-height:1.6;">
            <strong style="color:white;">ℹ️ กฎของวงล้อ:</strong><br>
            • ได้การ์ดซ้ำได้ปกติ แต่ถ้าได้ Cosmetic (Banner, Artstyle, รูปโปรไฟล์) ที่มีอยู่แล้ว จะได้รับ <b style="color:#93c5fd;">15 Gems ชดเชยแทน</b><br>
            • ทุกๆ 15 ครั้ง การันตีได้ <b style="color:#fcd34d;">Nobita</b><br>
            • ทุกๆ 30 ครั้ง การันตีได้ Cosmetic แรร์ 1 อย่าง<br>
            • หมุน 1 ครั้ง = นับ 1 ครั้ง (หมุนฟรีหรือใช้ตั๋วพิเศษก็นับ)
        </div>
    </div>`;

    if (!canFreeSpin && extraSpins <= 0 && !_isSpinning) {
        _wheelTimerInterval = setInterval(() => {
            const r = cooldown - (Date.now() - playerData.wheelLastSpin);
            if (r <= 0) {
                renderWheelPanel();
            } else {
                const h = Math.floor(r / 3600000);
                const m = Math.floor((r % 3600000) / 60000);
                const timeEl = pnl.querySelector('div[style*="font-size:1.1rem"]');
                if (timeEl) timeEl.innerText = `รอบฟรีถัดไปใน: ${h} ชม. ${m} นาที`;
            }
        }, 60000); // อัปเดตทุกนาที
    }
}

window.executeWheelSpin = function() {
    if (_isSpinning) return; // ป้องกันการกดเบิ้ล

    const now = Date.now();
    const cooldown = 24 * 60 * 60 * 1000;
    
    let usedFreeSpin = false;
    if (now - (playerData.wheelLastSpin || 0) >= cooldown) {
        usedFreeSpin = true;
    } else if ((playerData.wheelExtraSpins || 0) > 0) {
        usedFreeSpin = false;
    } else {
        return; // หมุนไม่ได้
    }

    // 1. ตัดสิทธิ์การหมุนและบันทึกลง Database ทันทีเพื่อกันคนกด Refresh หนี
    if (usedFreeSpin) {
        playerData.wheelLastSpin = now;
    } else {
        playerData.wheelExtraSpins--;
    }
    playerData.wheelSpinCount = (playerData.wheelSpinCount || 0) + 1;
    saveData();

    _isSpinning = true;
    renderWheelPanel(); // รีเฟรช UI ให้ปุ่มเทาลง

    // 2. คำนวณของรางวัล
    const spins = playerData.wheelSpinCount;
    let reward = null;

    if (spins % 30 === 0) {
        const cosPool =['art_nobita', 'art_farmer', 'ava_nobita', 'ban_nobita'];
        const pick = cosPool[Math.floor(Math.random() * cosPool.length)];
        reward = WHEEL_REWARDS.find(r => r.id === pick);
    } else if (spins % 15 === 0) {
        reward = WHEEL_REWARDS.find(r => r.id === 'char_nobita');
    } else {
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

    // 3. เริ่ม Animation วงล้อ
    const rIndex = WHEEL_REWARDS.findIndex(r => r.id === reward.id);
    const wheel = document.getElementById('the-roulette-wheel');
    const sliceDeg = 360 / WHEEL_REWARDS.length;
    
    // คำนวณองศาให้เข็มชี้ตรงกลางของรางวัลพอดี (บวก/ลบ แรนดอมนิดหน่อยให้ดูสมจริง)
    const variance = (Math.random() * (sliceDeg * 0.6)) - (sliceDeg * 0.3);
    const targetDeg = -(rIndex * sliceDeg + (sliceDeg / 2)) + variance + (360 * 8); // หมุน 8 รอบ

    // ใส่เสียง Effect ตอนหมุน (ถ้ามี)
    const spinSound = new Audio('https://files.catbox.moe/kj3jmu.wav'); // เสียงตอนการ์ดลง
    spinSound.volume = 0.5;
    spinSound.play().catch(()=>{});

    wheel.style.transition = 'transform 4.5s cubic-bezier(0.15, 0.85, 0.15, 1)';
    wheel.style.transform = `rotate(${targetDeg}deg)`;

    // 4. รอให้หมุนเสร็จแล้วแจกของรางวัล
    setTimeout(() => {
        _isSpinning = false;
        giveWheelReward(reward);
    }, 4700);
};

function giveWheelReward(reward) {
    let title = '🎉 ยินดีด้วย!';
    let msg = `คุณได้รับ ${reward.label}`;
    let isDupe = false;

    // มอบของรางวัล
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
    renderWheelPanel(); // รีเซ็ตหน้าจอวงล้อ

    // เสียงจบ
    const winSound = new Audio('https://files.catbox.moe/mu7wrw.wav');
    winSound.volume = 0.6;
    winSound.play().catch(()=>{});

    // Show Popup
    const ov = document.createElement('div');
    ov.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,0.95);z-index:9999;display:flex;align-items:center;justify-content:center;animation:fadeIn 0.3s ease;';
    ov.innerHTML = `
    <div style="background:linear-gradient(135deg,#1e1b4b,#2e1065);border:3px solid ${reward.color};border-radius:24px;padding:30px;max-width:350px;width:90%;text-align:center;box-shadow:0 0 60px ${reward.color}66; transform:scale(0.8); animation:popIn 0.5s forwards cubic-bezier(0.175, 0.885, 0.32, 1.275);">
        <div style="font-size:4.5rem;margin-bottom:10px;filter:drop-shadow(0 4px 10px rgba(0,0,0,0.5));">${reward.icon}</div>
        <div style="font-size:1.5rem;font-weight:900;color:${reward.color};margin-bottom:10px;">${title}</div>
        <div style="font-size:1.1rem;color:white;margin-bottom:25px;line-height:1.5;">${msg}</div>
        <button onclick="this.parentElement.parentElement.remove()" style="background:${reward.color};color:black;border:none;padding:12px 30px;border-radius:12px;font-weight:900;font-size:1.1rem;cursor:pointer;box-shadow:0 4px 15px rgba(0,0,0,0.5);">ยอดเยี่ยม!</button>
    </div>
    <style>@keyframes popIn { to { transform: scale(1); } }</style>`;
    document.body.appendChild(ov);
}

// ─── HOOK MECHANICS (Nobita & Pandora) ───
function _hookWheelMechanics() {
    
    // 1. Pandora Visual Illusion & Render
    if (typeof window.renderCard === 'function') {
        const _origRender = window.renderCard;
        window.renderCard = function(card, inHand, displayCost, currentStats) {
            if (card && card._isPandoraActor && !inHand) {
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
            if (char._isPandoraActor && !char.silenced) {
                stats.atk = 8;
                stats.maxHp = 8;
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
                    
                    card.name = mimic.name;
                    card.originalName = mimic.originalName || mimic.name;
                    card.art = mimic.art;
                    card.text = mimic.text;
                    
                    card._fakeDisplayAtk = mimic.atk;
                    card._fakeDisplayHp = mimic.hp;
                    
                    card.hp = 8;
                    card.atk = 8;
                    card.maxHp = 8;

                    if (typeof log === 'function') log(`🎭 [Pandora's Actor] มหาเวทแปลงกาย! คัดลอกรูปแบบของ ${mimic.name}!`, 'text-yellow-400 font-bold');
                } else {
                    if (typeof log === 'function') log(`🎭[Pandora's Actor] ไม่มี Character ในเด็คให้แปลงร่าง!`, 'text-gray-400');
                }
            }
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

                if (tName === 'Nobita' && !target.silenced) {
                    if (Math.random() < 0.3) {
                        if (typeof log === 'function') log(`👓 [Nobita] วิ่งหนีสุดชีวิต! หลบการโจมตีได้สำเร็จ!`, 'text-yellow-300 font-bold');
                        attacker.attacksLeft -= 1;
                        state.selectedCardId = null;
                        if (typeof updateUI === 'function') updateUI();
                        return;
                    }
                }

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

            if (attacker && attacker._nobitaBoost) {
                attacker.atk -= 3;
                attacker._nobitaBoost = false;
            }
        };
    }
            }
                                        
                    
