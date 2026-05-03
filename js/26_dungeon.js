// ============================================================
// 26_dungeon.js — Dungeon Mode & Limited Time Boss Events
// ============================================================

const DUNGEON_CARDS = {
    'Puck, Beast of the End': {
        name: 'Puck, Beast of the End', type: 'Character', cost: 0, atk: 5, hp: 300, maxHp: 300,
        text: 'บอส: Immune ทุกสถานะผิดปกติ | Start Turn: Freeze ศัตรู 2 ตัว (2T), Heal 10 | End Turn: 5 ดาเมจใส่ศัตรูทั้งหมด',
        color: 'bg-sky-900', maxAttacks: 1,
        art: 'https://file.garden/aeeLCXSsJxTPrRbp/file_00000000556c720883d93bd91e12be6a.png',
        _theme: 'dungeon_boss'
    },
    'Snowball': {
        name: 'Snowball', type: 'Action', cost: 0,
        text: 'ทำดาเมจ 2 ใส่ศัตรูสุ่ม 1 ตัว ถ้าเป้าหมายไม่ตาย จะติด Freeze 2 เทิร์น',
        color: 'bg-sky-300',
        art: 'https://images.unsplash.com/photo-1542314545-0d2dc0199e71?w=800&q=80',
        _theme: 'dungeon_boss'
    },
    'Puck': {
        name: 'Puck', type: 'Character', cost: 9, atk: 2, hp: 4, maxHp: 4,
        text: 'On Summon: Freeze ศัตรูทั้งหมด 1 เทิร์น | Ongoing: ถ้ามี Emilia ในสนาม ทั้งคู่หลบหลีก 60% | End Turn: สุ่ม +2/+2 ให้เพื่อน 1 ตัว (ถ้าเป็น Emilia +4/+4 แทน)',
        color: 'bg-sky-400', maxAttacks: 1,
        art: 'https://file.garden/aeeLCXSsJxTPrRbp/e9cddbfdf841368a5d3049adf2e22482.jpg',
        _theme: 'isekai_adventure',
        shopOnly: true
    }
};

// ── Stickman Boss Dungeon Cards ──────────────────────────────
const STICKMAN_DUNGEON_CARDS = {
    'Stickman Boss': {
        name: 'Stickman Boss', type: 'Character', cost: 0, atk: 5, hp: 150, maxHp: 150,
        text: 'บอส: Immune ทุก CC (Freeze/Bleed/Paralyze/Burn/Poison) | End Turn: Heal 5 HP',
        color: 'bg-gray-900', maxAttacks: 1,
        art: 'https://i.pinimg.com/736x/3e/0b/90/3e0b9036e0a2a5f6ea0ab70d2e3f0b8b.jpg',
        _theme: 'dungeon_stickman'
    },
    'Stickman Sniper': {
        name: 'Stickman Sniper', type: 'Character', cost: 7, atk: 3, hp: 8, maxHp: 8,
        text: 'Ongoing: ถ้ามี Stickman Boss ในสนาม การ์ดนี้อมตะ | End Turn: สุ่มสังหาร 1 ศัตรู',
        color: 'bg-slate-700', maxAttacks: 1,
        art: 'https://i.pinimg.com/736x/3e/0b/90/3e0b9036e0a2a5f6ea0ab70d2e3f0b8b.jpg',
        _theme: 'dungeon_stickman'
    },
    'Stickman': {
        name: 'Stickman', type: 'Character', cost: 1, atk: 2, hp: 2, maxHp: 2,
        text: 'On Death: Heal 1 HP ให้ฐาน',
        color: 'bg-gray-700', maxAttacks: 1,
        art: 'https://i.pinimg.com/736x/3e/0b/90/3e0b9036e0a2a5f6ea0ab70d2e3f0b8b.jpg',
        _theme: 'dungeon_stickman'
    },
    'Stickman Warrior': {
        name: 'Stickman Warrior', type: 'Character', cost: 2, atk: 3, hp: 3, maxHp: 3,
        text: '',
        color: 'bg-stone-700', maxAttacks: 1,
        art: 'https://i.pinimg.com/736x/3e/0b/90/3e0b9036e0a2a5f6ea0ab70d2e3f0b8b.jpg',
        _theme: 'dungeon_stickman'
    },
};

const STICKMAN_BANNED_CARDS = [
    'Random Summon', 'Teacher', 'Alexander the great', 'Gilgamesh', 'Frieren',
    'Goal of All Life is Death', 'Schrödinger', 'Mike Tyson', 'Jormungandr',
    'Palee', 'Simo Häyhä', 'Vlad', 'Gregor Johann Mendel', 'Shiva', 'Anaconda',
    'Chameleon', 'Explosion', 'Oni', 'Kim Dokja', 'Toy Takeover',
    'I Think I Can Make This in LEGO', 'Miyamoto Musashi', 'Skull Devourer', 'Megumin', 'Hiromi Higurama',
    'Meruem', 'Altair', 'Loki', 'Zoltraak',
    'Medal of Promotion'
];

const DUNGEON_BANNED_CARDS =[
    'Random Summon', 'Teacher', 'Alexander the great', 'Gilgamesh', 'Frieren', 
    'Goal of All Life is Death', 'Schrödinger', 'Mike Tyson', 'Jormungandr', 
    'Palee', 'Simo Häyhä', 'Vlad', 'Gregor Johann Mendel', 'Shiva', 'Anaconda', 
    'Chameleon', 'Explosion', 'Oni', 'Kim Dokja', 'Toy Takeover', 
    'I Think I Can Make This in LEGO', 'Miyamoto Musashi', 'Skull Devourer', 'Megumin', 'Hiromi Higurama',
    'Meruem', 'Altair', 'Loki', 'Zoltraak'
];

// วันที่หมดเขต (นับไปอีก 5 วันจาก 27 เม.ย. 2026)
const DUNGEON_EXPIRY_DATE = new Date('2026-05-02T23:59:59+07:00');

document.addEventListener('DOMContentLoaded', () => {
    // 1. Initialize Player Data
    if (typeof playerData !== 'undefined') {
        if (playerData.bossKeys === undefined) playerData.bossKeys = 10; // แจก 10 กุญแจฟรีเริ่มต้น
        if (!playerData.dungeonCleared) playerData.dungeonCleared = {};
        if (!playerData.dailyBossKeys) playerData.dailyBossKeys = { date: '', count: 0 };
    }

    // 2. Inject Cards into Database
    if (typeof CardSets !== 'undefined') {
        if (!CardSets['dungeon_boss']) CardSets['dungeon_boss'] = {};
        CardSets['dungeon_boss']['Puck, Beast of the End'] = JSON.parse(JSON.stringify(DUNGEON_CARDS['Puck, Beast of the End']));
        CardSets['dungeon_boss']['Snowball'] = JSON.parse(JSON.stringify(DUNGEON_CARDS['Snowball']));
        
        if (!CardSets['isekai_adventure']) CardSets['isekai_adventure'] = {};
        CardSets['isekai_adventure']['Puck'] = JSON.parse(JSON.stringify(DUNGEON_CARDS['Puck']));

        if (!CardSets['dungeon_stickman']) CardSets['dungeon_stickman'] = {};
        Object.values(STICKMAN_DUNGEON_CARDS).forEach(c => {
            CardSets['dungeon_stickman'][c.name] = JSON.parse(JSON.stringify(c));
        });
    }

    // 3. Inject Tab into Hub UI
    const navBar = document.querySelector('.hub-nav-bar');
    if (navBar && !document.getElementById('hub-tab-dungeon')) {
        const btn = document.createElement('button');
        btn.id = 'hub-tab-dungeon';
        btn.className = 'hub-nav-btn';
        btn.innerHTML = '🏰 Dungeon';
        btn.onclick = () => { if (typeof showHubTab === 'function') showHubTab('dungeon'); };
        navBar.appendChild(btn);
    }

    // 4. Create Dungeon Panel
    const container = document.getElementById('hub-panel-home')?.parentElement;
    if (container && !document.getElementById('hub-panel-dungeon')) {
        const pnl = document.createElement('div');
        pnl.id = 'hub-panel-dungeon';
        pnl.className = 'hub-panel';
        pnl.style.display = 'none';
        container.appendChild(pnl);
    }

    // 5. Hook Tab System
    if (typeof window.showHubTab === 'function') {
        const _ot = window.showHubTab;
        window.showHubTab = function(tab) {
            const btn = document.getElementById('hub-tab-dungeon');
            const pnl = document.getElementById('hub-panel-dungeon');
            if (tab === 'dungeon') {['home', 'packs', 'collection', 'deckbuilder', 'play', 'profile', 'themes', 'bp', 'trade', 'social', 'quests'].forEach(t => {
                    const b = document.getElementById(`hub-tab-${t}`);
                    const p = document.getElementById(`hub-panel-${t}`);
                    if (b) b.classList.remove('active-tab');
                    if (p) p.style.display = 'none';
                });
                if (btn) btn.classList.add('active-tab');
                if (pnl) { pnl.style.display = 'block'; renderDungeonPanel(); }
            } else {
                if (btn) btn.classList.remove('active-tab');
                if (pnl) pnl.style.display = 'none';
                _ot(tab);
            }
        };
    }

    // 6. Redeem Codes
    if (typeof REDEEM_CODES !== 'undefined') {
        REDEEM_CODES['BOSSKEY'] = { bossKeys: 50, label: '🔑 50 Boss Keys', oneTime: true };
    }

    if (typeof window.redeemCode === 'function') {
        const _origRedeem_dungeon = window.redeemCode;
        window.redeemCode = function() {
            const raw = document.getElementById('redeem-input')?.value?.trim().toUpperCase();
            const reward = (typeof REDEEM_CODES !== 'undefined') ? REDEEM_CODES[raw] : null;

            if (reward && reward.bossKeys) {
                const msg = document.getElementById('redeem-msg');
                const used = typeof getUsedCodes === 'function' ? getUsedCodes() :[];
                if (reward.oneTime && used.includes(raw)) {
                    if (msg) { msg.style.color='#f87171'; msg.textContent='❌ โค้ดนี้ใช้ไปแล้ว'; }
                    return;
                }
                
                playerData.bossKeys = (playerData.bossKeys || 0) + reward.bossKeys;
                if (typeof saveData === 'function') saveData();
                if (typeof updateHubUI === 'function') updateHubUI();
                if (typeof markCodeUsed === 'function') markCodeUsed(raw);
                
                if (msg) { 
                    msg.style.color='#fbbf24'; 
                    msg.textContent=`🎉 ได้รับ ${reward.label} เรียบร้อยแล้ว!`; 
                }
                if (typeof showToast === 'function') showToast(`🎁 รับ ${reward.bossKeys} Boss Keys สำเร็จ!`, '#fbbf24');
                document.getElementById('redeem-input').value = '';
                
                // รีเฟรชหน้าดันเจี้ยนถ้าเปิดอยู่
                if (document.getElementById('hub-panel-dungeon')?.style.display === 'block') {
                    renderDungeonPanel();
                }
                return;
            }
            _origRedeem_dungeon.apply(this, arguments);
        };
    }

    // 7. Game Logic Hooks
    _hookDungeonCombat();
});

// ฟังก์ชันสำหรับรีเซ็ตโควต้าการซื้อกุญแจด้วยเหรียญแบบรายวัน
function _resetDailyBossKeys() {
    const today = new Date().toLocaleDateString('en-CA', { timeZone: 'Asia/Bangkok' });
    if (!playerData.dailyBossKeys || playerData.dailyBossKeys.date !== today) {
        playerData.dailyBossKeys = { date: today, count: 0 };
    }
}

function renderDungeonPanel() {
    const pnl = document.getElementById('hub-panel-dungeon');
    if (!pnl || typeof playerData === 'undefined') return;

    _resetDailyBossKeys();

    const keys = playerData.bossKeys || 0;
    const dailyCoinBuys = playerData.dailyBossKeys.count;
    
    const now = new Date();
    const diff = DUNGEON_EXPIRY_DATE - now;
    const d = Math.floor(diff / 86400000);
    const h = Math.floor((diff % 86400000) / 3600000);
    const timeStr = diff > 0 ? `เหลือเวลา ${d} วัน ${h} ชม.` : 'หมดเขตแล้ว';

    const firstClear = playerData.dungeonCleared?.['beast_of_end'];
    let deckOptions = playerData.decks.map(deck => `<option value="${deck.id}">${deck.name}</option>`).join('');
    if (!deckOptions) deckOptions = '<option value="">ไม่มีเด็คที่พร้อมเล่น</option>';

    const firstClearStickman = playerData.dungeonCleared?.['stickman_boss'];

    pnl.innerHTML = `
    <div style="max-width:800px;margin:0 auto;padding:20px;">
        <!-- Header -->
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:20px;">
            <div style="font-size:1.6rem;font-weight:900;color:#93c5fd;text-shadow:0 0 10px rgba(147,197,253,0.5);">🏰 Dungeon Challenge</div>
            <div style="background:#1f2937;padding:8px 16px;border-radius:12px;border:1px solid #3b82f6;display:flex;align-items:center;gap:10px;">
                <span style="font-size:0.8rem;color:#9ca3af;">Boss Keys:</span>
                <span style="font-size:1.4rem;font-weight:900;color:#60a5fa;">🔑 ${keys}</span>
                <div style="display:flex;flex-direction:column;gap:4px;margin-left:10px;">
                    <button onclick="buyBossKeyWithCoins()" ${dailyCoinBuys >= 5 ? 'disabled' : ''} style="background:${dailyCoinBuys >= 5 ? '#374151' : '#ea580c'};color:${dailyCoinBuys >= 5 ? '#9ca3af' : 'white'};border:none;border-radius:6px;padding:5px 10px;font-size:0.75rem;cursor:${dailyCoinBuys >= 5 ? 'not-allowed' : 'pointer'};font-weight:bold;">
                        + 1,500 🪙[${5 - dailyCoinBuys}/5]
                    </button>
                    <button onclick="buyBossKeyWithGems()" style="background:#8b5cf6;color:white;border:none;border-radius:6px;padding:5px 10px;font-size:0.75rem;cursor:pointer;font-weight:bold;">
                        + 5 💎 [ไม่จำกัด]
                    </button>
                </div>
            </div>
        </div>

        <!-- Dungeon 1: Beast of the End -->
        <div style="background:linear-gradient(135deg, #0c4a6e, #020617); border:2px solid #38bdf8; border-radius:20px; padding:20px; display:flex; gap:20px; box-shadow:0 0 30px rgba(56,189,248,0.3); margin-bottom:20px;">
            <div style="width:160px; height:220px; border-radius:12px; overflow:hidden; border:2px solid #7dd3fc; flex-shrink:0; box-shadow:0 0 20px rgba(125,211,252,0.4);">
                <img src="${DUNGEON_CARDS['Puck, Beast of the End'].art}" style="width:100%;height:100%;object-fit:cover;">
            </div>
            <div style="flex:1;">
                <div style="color:#7dd3fc; font-weight:900; font-size:0.8rem; letter-spacing:1px; margin-bottom:4px;">❄️ LIMITED TIME EVENT</div>
                <div style="font-size:2rem; font-weight:900; color:white; margin-bottom:4px; line-height:1;">Beast of the End</div>
                <div style="color:#9ca3af; font-size:0.85rem; margin-bottom:12px;">บอสสุดแกร่ง HP 300! มาพร้อมกับพายุหิมะแห่งความตาย<br><b style="color:#f87171;">⏰ ${timeStr}</b></div>
                <div style="background:rgba(0,0,0,0.5); padding:12px; border-radius:10px; border:1px solid #334155; margin-bottom:16px; font-size:0.85rem;">
                    <div style="color:#fbbf24; font-weight:900; margin-bottom:6px;">🏆 ของรางวัลการท้าทาย:</div>
                    <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;">
                        <div style="color:white;">🥇 ชนะครั้งแรก: รับ <b>Puck</b> (Epic)</div>
                        <div style="color:white;">💎 ทุกครั้งที่ชนะ: รับ <b>5 Gems</b></div>
                    </div>
                    <div style="margin-top:8px; font-weight:bold; color:${firstClear ? '#4ade80' : '#f87171'};">
                        ${firstClear ? '✅ ผ่านแล้ว (ได้รับ Puck แล้ว)' : '❌ ยังไม่เคยผ่านบอสตัวนี้'}
                    </div>
                </div>
                <div style="display:flex; align-items:center; gap:10px;">
                    <select id="dungeon-deck-select" style="background:#1f2937; color:white; border:1px solid #4b5563; padding:12px; border-radius:10px; flex:1; font-size:0.9rem; font-weight:bold;">
                        ${deckOptions}
                    </select>
                    <button onclick="startDungeon('beast_of_end')" ${diff <= 0 ? 'disabled' : ''} style="background:${diff > 0 ? 'linear-gradient(135deg, #0284c7, #0369a1)' : '#374151'}; color:${diff > 0 ? 'white' : '#9ca3af'}; font-weight:900; padding:12px 24px; border-radius:10px; border:none; cursor:${diff > 0 ? 'pointer' : 'not-allowed'}; font-size:1rem; box-shadow:${diff > 0 ? '0 0 15px rgba(2,132,199,0.5)' : 'none'}; white-space:nowrap;">
                        ${diff > 0 ? '⚔️ สู้บอส (ใช้ 5 🔑)' : 'หมดเขตแล้ว'}
                    </button>
                </div>
            </div>
        </div>
        <div style="margin-bottom:12px; background:rgba(239,68,68,0.1); border:1px solid #ef4444; border-radius:12px; padding:10px; font-size:0.75rem; color:#fca5a5; line-height:1.5;">
            <strong style="color:#f87171;">⚠️ การ์ดแบน (Beast of the End):</strong> ${DUNGEON_BANNED_CARDS.join(', ')}
        </div>

        <!-- Dungeon 2: Stickman Boss -->
        <div style="background:linear-gradient(135deg, #1c1c1c, #111); border:2px solid #6b7280; border-radius:20px; padding:20px; display:flex; gap:20px; box-shadow:0 0 30px rgba(107,114,128,0.3); margin-bottom:20px;">
            <div style="width:160px; height:220px; border-radius:12px; overflow:hidden; border:2px solid #9ca3af; flex-shrink:0; background:#222; display:flex; align-items:center; justify-content:center;">
                <span style="font-size:5rem;">🪃</span>
            </div>
            <div style="flex:1;">
                <div style="color:#d1d5db; font-weight:900; font-size:0.8rem; letter-spacing:1px; margin-bottom:4px;">🎯 PERMANENT DUNGEON</div>
                <div style="font-size:2rem; font-weight:900; color:white; margin-bottom:4px; line-height:1;">Stickman Invasion</div>
                <div style="color:#9ca3af; font-size:0.85rem; margin-bottom:12px;">เผชิญหน้ากับ Stickman Boss HP 150 ที่มาพร้อมกองทัพ Stickman! ใช้ 2 Boss Keys ต่อครั้ง</div>
                <div style="background:rgba(0,0,0,0.5); padding:12px; border-radius:10px; border:1px solid #374151; margin-bottom:16px; font-size:0.85rem;">
                    <div style="color:#fbbf24; font-weight:900; margin-bottom:6px;">🏆 ของรางวัลการท้าทาย:</div>
                    <div style="color:#d1d5db; line-height:1.8;">
                        🎯 100% — Normal Scroll 1–3 ใบ (สุ่ม)<br>
                        🎯 10% — Normal Scroll 5 ใบ<br>
                        💎 1% — Gems 10–15 (สุ่ม)
                    </div>
                    <div style="margin-top:8px; font-weight:bold; color:${firstClearStickman ? '#4ade80' : '#f87171'};">
                        ${firstClearStickman ? '✅ เคยผ่านแล้ว' : '❌ ยังไม่เคยผ่านบอสตัวนี้'}
                    </div>
                </div>
                <div style="display:flex; align-items:center; gap:10px;">
                    <select id="dungeon-deck-select-stickman" style="background:#1f2937; color:white; border:1px solid #4b5563; padding:12px; border-radius:10px; flex:1; font-size:0.9rem; font-weight:bold;">
                        ${deckOptions}
                    </select>
                    <button onclick="startDungeon('stickman_boss')" style="background:linear-gradient(135deg, #374151, #1f2937); color:white; font-weight:900; padding:12px 24px; border-radius:10px; border:1px solid #6b7280; cursor:pointer; font-size:1rem; white-space:nowrap;">
                        ⚔️ สู้บอส (ใช้ 2 🔑)
                    </button>
                </div>
            </div>
        </div>
        <div style="margin-bottom:12px; background:rgba(239,68,68,0.1); border:1px solid #ef4444; border-radius:12px; padding:10px; font-size:0.75rem; color:#fca5a5; line-height:1.5;">
            <strong style="color:#f87171;">⚠️ การ์ดแบน (Stickman Invasion):</strong> ${STICKMAN_BANNED_CARDS.join(', ')}
        </div>
    </div>`;
}

window.buyBossKeyWithCoins = function() {
    _resetDailyBossKeys();
    if (playerData.dailyBossKeys.count >= 5) {
        showToast('❌ ซื้อด้วยเหรียญครบ 5 ครั้งแล้วสำหรับวันนี้', '#f87171');
        return;
    }
    if (playerData.coins < 1500) {
        showToast('🪙 เหรียญไม่พอ! (ต้องการ 1,500)', '#f87171');
        return;
    }
    playerData.coins -= 1500;
    playerData.dailyBossKeys.count += 1;
    playerData.bossKeys = (playerData.bossKeys || 0) + 1;
    saveData(); updateHubUI(); renderDungeonPanel();
    showToast('🔑 ซื้อ Boss Key ด้วย 1,500 🪙 สำเร็จ!', '#60a5fa');
}

window.buyBossKeyWithGems = function() {
    if ((playerData.gems || 0) < 5) {
        showToast('💎 Gems ไม่พอ! (ต้องการ 5)', '#f87171');
        return;
    }
    playerData.gems -= 5;
    playerData.bossKeys = (playerData.bossKeys || 0) + 1;
    saveData(); updateHubUI(); renderDungeonPanel();
    showToast('🔑 ซื้อ Boss Key ด้วย 5 💎 สำเร็จ!', '#60a5fa');
}

window.startDungeon = function(dungeonId) {
    // ── Stickman Boss Dungeon ────────────────────────────────
    if (dungeonId === 'stickman_boss') {
        const deckId = document.getElementById('dungeon-deck-select-stickman').value;
        const deck = playerData.decks.find(d => d.id === deckId);
        if (!deck) { showToast('❌ กรุณาสร้างและเลือกเด็คก่อน', '#f87171'); return; }
        if ((playerData.bossKeys || 0) < 2) { showToast('🔑 Boss Keys ไม่พอ! ต้องการ 2 อัน', '#f87171'); return; }

        const deckCards = (deck.cards || []).map(c => typeof c === 'string' ? { name: c, theme: deck.theme || 'isekai_adventure' } : c);
        const invalidCards = deckCards.filter(c => STICKMAN_BANNED_CARDS.includes(c.name));
        if (invalidCards.length > 0) { showToast(`❌ เด็คมีการ์ดที่แบน: ${invalidCards[0].name}`, '#f87171'); return; }

        playerData.bossKeys -= 2;
        saveData();

        _pendingCollectionDeck = deckCards;
        _collectionDeckUsed = false;
        _isRankedGame = false;
        window.gameMode = 'dungeon';
        window.currentDungeonId = 'stickman_boss';

        document.getElementById('hub-screen').style.display = 'none';
        document.getElementById('game-screen').style.display = '';
        const ts = document.getElementById('theme-selector');
        if (ts) ts.style.display = 'none';

        // Boss deck: 10 Stickman Sniper + 35 Stickman Warrior + 10 Stickman + Statue of Liberty field cards
        const _origBuildDeckSM = window.buildDeck;
        window.buildDeck = function(theme) {
            if (theme === 'dungeon_stickman') {
                const bossDeck = [];
                for (let i = 0; i < 10; i++) { const c = createCardInstance('Stickman Sniper', 'dungeon_stickman'); if (c) bossDeck.push(c); }
                for (let i = 0; i < 35; i++) { const c = createCardInstance('Stickman Warrior', 'dungeon_stickman'); if (c) bossDeck.push(c); }
                for (let i = 0; i < 10; i++) { const c = createCardInstance('Stickman', 'dungeon_stickman'); if (c) bossDeck.push(c); }
                bossDeck.sort(() => Math.random() - 0.5);
                return bossDeck;
            }
            return _origBuildDeckSM.call(this, theme);
        };

        selectedPlayerTheme = deck.theme || 'isekai_adventure';
        selectedAITheme = 'dungeon_stickman';

        if (typeof resetAndInitGame !== 'undefined') resetAndInitGame();

        // Spawn: 1 Stickman Boss + 2 Stickman Sniper + 2 Stickman
        setTimeout(() => {
            const ai = state.players.ai;
            const boss = createCardInstance('Stickman Boss', 'dungeon_stickman');
            boss.attacksLeft = 1;
            boss.tossakanImmune = true;
            boss.isDungeonBoss = true;
            ai.field.push(boss);

            for (let i = 0; i < 2; i++) {
                if (ai.field.length < 5) {
                    const sniper = createCardInstance('Stickman Sniper', 'dungeon_stickman');
                    sniper.attacksLeft = 1;
                    ai.field.push(sniper);
                }
            }
            for (let i = 0; i < 2; i++) {
                if (ai.field.length < 5) {
                    const stick = createCardInstance('Stickman', 'dungeon_stickman');
                    stick.attacksLeft = 1;
                    ai.field.push(stick);
                }
            }
            updateUI();
            if (typeof log === 'function') {
                log(`🪃 "กองทัพ Stickman บุกแล้ว!"`, 'text-gray-200 font-bold italic');
                log(`🪃 บอส [Stickman Boss] + 2 Stickman Sniper + 2 Stickman ปรากฏตัว!`, 'text-gray-300 font-bold');
            }
        }, 800);
        return;
    }

    // ── Beast of the End Dungeon ─────────────────────────────
    if (dungeonId !== 'beast_of_end') return;

    if (new Date() > DUNGEON_EXPIRY_DATE) { showToast('❌ Event หมดเวลาแล้ว!', '#f87171'); return; }

    const deckId = document.getElementById('dungeon-deck-select').value;
    const deck = playerData.decks.find(d => d.id === deckId);
    if (!deck) { showToast('❌ กรุณาสร้างและเลือกเด็คก่อน', '#f87171'); return; }

    if ((playerData.bossKeys || 0) < 5) { showToast('🔑 Boss Keys ไม่พอ! ต้องการ 5 อัน', '#f87171'); return; }

    // ── ตรวจการ์ดแบน ──
    const deckCards = (deck.cards ||[]).map(c => typeof c === 'string' ? { name: c, theme: deck.theme || 'isekai_adventure' } : c);
    const invalidCards = deckCards.filter(c => DUNGEON_BANNED_CARDS.includes(c.name));
    if (invalidCards.length > 0) {
        showToast(`❌ เด็คมีการ์ดที่แบน: ${invalidCards[0].name}`, '#f87171'); return;
    }

    // หักกุญแจ
    playerData.bossKeys -= 5;
    saveData();

    // เริ่มเกม
    _pendingCollectionDeck = deckCards;
    _collectionDeckUsed = false;
    _isRankedGame = false;
    window.gameMode = 'dungeon'; // Override โหมด
    window.currentDungeonId = dungeonId;

    document.getElementById('hub-screen').style.display = 'none';
    document.getElementById('game-screen').style.display = '';
    const ts = document.getElementById('theme-selector');
    if(ts) ts.style.display = 'none';

    // จำลอง Deck ฝั่งบอส (64 Snowball)
    const _origBuildDeck = window.buildDeck;
    window.buildDeck = function(theme) {
        if (theme === 'dungeon_boss') {
            const bossDeck =[];
            for (let i = 0; i < 64; i++) {
                const sb = createCardInstance('Snowball', 'dungeon_boss');
                if (sb) bossDeck.push(sb);
            }
            return bossDeck;
        }
        return _origBuildDeck.call(this, theme);
    };

    selectedPlayerTheme = deck.theme || 'isekai_adventure';
    selectedAITheme = 'dungeon_boss';
    
    if (typeof resetAndInitGame !== 'undefined') resetAndInitGame();

    // ดึงบอสลงสนามทันทีหลังจากเริ่มเกม
    setTimeout(() => {
        const ai = state.players.ai;
        const boss = createCardInstance('Puck, Beast of the End', 'dungeon_boss');
        boss.attacksLeft = 1;
        boss.tossakanImmune = true; // อมตะ CC ทั่วไป
        boss.isDungeonBoss = true;  // กันโดน Instakill ที่หลุดรอด
        ai.field.push(boss);
        updateUI();
        if (typeof log === 'function') {
            log(`❄️ "เจ้าทำให้ลูกสาวข้าต้องร้องไห้..."`, 'text-cyan-200 font-bold italic');
            log(`❄️ บอส [Puck, Beast of the End] ปรากฏตัว! HP 300!`, 'text-cyan-400 font-bold');
        }
    }, 800);
}

// ─── HOOKS FOR DUNGEON EFFECTS ───
function _hookDungeonCombat() {
    // 1. End Game Reward Hook
    if (typeof window.endGame === 'function') {
        const _origEndGame_dj = window.endGame;
        window.endGame = function(winner) {
            _origEndGame_dj.apply(this, arguments);
            
            if (window.gameMode === 'dungeon') {
                if (winner === 'player') {
                    if (!playerData.dungeonCleared) playerData.dungeonCleared = {};
                    const isFirstClear = !playerData.dungeonCleared[window.currentDungeonId];

                    // ── Stickman Boss rewards ──
                    if (window.currentDungeonId === 'stickman_boss') {
                        playerData.dungeonCleared['stickman_boss'] = true;
                        let msg = '🎉 ชนะ Stickman Boss! ';
                        const roll = Math.random();
                        if (roll < 0.01) {
                            // 1% — 10-15 gems
                            const gems = 10 + Math.floor(Math.random() * 6);
                            playerData.gems = (playerData.gems || 0) + gems;
                            msg += `💎 ${gems} Gems!`;
                        } else if (roll < 0.11) {
                            // 10% — 5 Normal Scroll
                            playerData.normalScrolls = (playerData.normalScrolls || 0) + 5;
                            msg += '📜 5 Normal Scroll!';
                        } else {
                            // 100% baseline — 1-3 Normal Scroll
                            const scrolls = 1 + Math.floor(Math.random() * 3);
                            playerData.normalScrolls = (playerData.normalScrolls || 0) + scrolls;
                            msg += `📜 ${scrolls} Normal Scroll!`;
                        }
                        saveData();
                        setTimeout(() => showToast(msg, '#4ade80'), 1500);
                    } else {
                        // ── Beast of the End rewards ──
                        playerData.gems = (playerData.gems || 0) + 5;
                        let msg = "🎉 ชนะบอสสำเร็จ! ได้รับ 💎 5 Gems";
                        if (isFirstClear) {
                            playerData.dungeonCleared[window.currentDungeonId] = true;
                            playerData.collection['Puck|isekai_adventure'] = (playerData.collection['Puck|isekai_adventure'] || 0) + 1;
                            msg += " และการ์ดระดับ Epic 🌟 Puck 🌟 1 ใบ!";
                        }
                        saveData();
                        setTimeout(() => showToast(msg, '#4ade80'), 1500);
                    }
                } else {
                    const loseMsg = window.currentDungeonId === 'stickman_boss'
                        ? '💀 พ่ายแพ้ต่อ Stickman Boss... ล้มแล้วลุกใหม่!'
                        : '💀 พ่ายแพ้ต่อบอส... อากาศหนาวเหน็บจับขั้วหัวใจ';
                    setTimeout(() => showToast(loseMsg, '#f87171'), 1500);
                }
                window.gameMode = 'ai'; // Reset
            }
        };
    }

    // 2. Start Phase Hook (Boss Start Turn)
    if (typeof window.startPhase === 'function') {
        const _origStartPhase_dj = window.startPhase;
        window.startPhase = function(phase) {
            _origStartPhase_dj.apply(this, arguments);
            
            if (phase === 'MAIN' && window.gameMode === 'dungeon' && state.currentTurn === 'ai' && window.currentDungeonId === 'beast_of_end') {
                const boss = state.players.ai.field.find(c => c.isDungeonBoss);
                if (boss && getCharStats(boss).hp > 0) {
                    boss.hp = Math.min(boss.maxHp, boss.hp + 10);
                    if (typeof log === 'function') log(`❄️ [Puck] ฟื้นฟู 10 HP (เหลือ ${boss.hp})`, 'text-green-300 font-bold');

                    const pField = state.players.player.field.filter(c => getCharStats(c).hp > 0);
                    const targets = [...pField].sort(() => Math.random() - 0.5).slice(0, 2);
                    targets.forEach(t => {
                        if (!t.status.includes('Freeze') && !t.tossakanImmune && !hasNatureImmune('player')) {
                            t.status.push('Freeze');
                            t.freezeTurns = 3; // 2 Turns
                            if (typeof log === 'function') log(`❄️ [Puck] แช่แข็ง ${t.name} เป็นเวลา 2 เทิร์น!`, 'text-cyan-300');
                        }
                    });
                }
            }
        };
    }

    // 3. End Phase Hook (Boss End Turn & Puck Card End Turn)
    if (typeof window.resolveEndPhase === 'function') {
        const _origResolveEndPhase_dj = window.resolveEndPhase;
        window.resolveEndPhase = function(playerKey) {
            _origResolveEndPhase_dj.apply(this, arguments);

            // Boss End Turn (Beast of the End only)
            if (window.gameMode === 'dungeon' && window.currentDungeonId === 'beast_of_end' && playerKey === 'ai') {
                const boss = state.players.ai.field.find(c => c.isDungeonBoss);
                if (boss && getCharStats(boss).hp > 0) {
                    if (typeof log === 'function') log(`❄️[Puck] "จงกลายเป็นน้ำแข็งไปซะ..." พายุหิมะ 5 ดาเมจใส่ศัตรูทั้งหมด!`, 'text-cyan-400 font-bold');
                    state.players.player.field.forEach(c => {
                        if (getCharStats(c).hp > 0) {
                            c.hp -= 5;
                        }
                    });
                    if (typeof checkDeath === 'function') checkDeath('player');
                }
            }

            // Puck (Player Card) End Turn
            const p = state.players[playerKey];
            p.field.forEach(c => {
                if ((c.originalName || c.name) === 'Puck' && getCharStats(c).hp > 0 && !c.silenced && !c.isDungeonBoss) {
                    const friends = p.field.filter(f => f.id !== c.id && getCharStats(f).hp > 0);
                    if (friends.length > 0) {
                        const target = friends[Math.floor(Math.random() * friends.length)];
                        const isEmilia = (target.originalName || target.name) === 'Emilia';
                        const buff = isEmilia ? 4 : 2;
                        target.atk += buff;
                        target.hp += buff;
                        target.maxHp += buff;
                        if (typeof log === 'function') log(`❄️[Puck] มอบพลังให้ ${target.name} +${buff} ATK/HP!`, 'text-cyan-300 font-bold');
                    }
                }
            });
        };
    }

    // 4. On Summon Hook (Puck Card Freeze)
    if (typeof window.triggerOnSummon === 'function') {
        const _origOnSummon_dj = window.triggerOnSummon;
        window.triggerOnSummon = function(card, playerKey) {
            _origOnSummon_dj.apply(this, arguments);
            const effName = card.originalName || card.name;
            
            if (effName === 'Puck' && !card.isDungeonBoss) {
                if (typeof log === 'function') {
                    log(`❄️ "ฉันคือวิญญาณผู้ยิ่งใหญ่แห่งไฟ... Puck!"`, 'text-cyan-200 font-bold italic');
                    log(`[Summon] Puck แช่แข็งศัตรูทั้งหมด 1 เทิร์น!`, 'text-cyan-400 font-bold');
                }
                const oppKey = playerKey === 'player' ? 'ai' : 'player';
                state.players[oppKey].field.forEach(t => {
                    if (!t.tossakanImmune && !hasNatureImmune(oppKey)) {
                        if (!t.status.includes('Freeze')) { 
                            t.status.push('Freeze'); 
                            t.freezeTurns = 2; // 1 Turn
                        }
                    }
                });
            }
        };
    }

    // 5. Action Hook (Snowball)
    if (typeof window.executeNonTargetAction === 'function') {
        const _origAct_dj = window.executeNonTargetAction;
        window.executeNonTargetAction = function(card, playerKey) {
            if (card.name === 'Snowball') {
                const oppKey = playerKey === 'player' ? 'ai' : 'player';
                const oppField = state.players[oppKey].field.filter(c => getCharStats(c).hp > 0);
                if (oppField.length > 0) {
                    const target = oppField[Math.floor(Math.random() * oppField.length)];
                    target.hp -= 2;
                    if (typeof log === 'function') log(`❄️[Snowball] ปาใส่ ${target.name} โดน 2 ดาเมจ!`, 'text-cyan-300');
                    if (getCharStats(target).hp > 0 && !target.tossakanImmune && !hasNatureImmune(oppKey)) {
                        if (!target.status.includes('Freeze')) target.status.push('Freeze');
                        target.freezeTurns = 3; // 2 Turns
                        if (typeof log === 'function') log(`❄️[Snowball] ${target.name} ติด Freeze 2 เทิร์น!`, 'text-cyan-400');
                    }
                    if (typeof checkDeath === 'function') checkDeath(oppKey);
                }
                state.players[playerKey].graveyard.push(card);
                return;
            }
            _origAct_dj.apply(this, arguments);
        };
    }

    // 6. Evade Hook (Puck & Emilia 60%)
    if (typeof window.initiateAttack === 'function') {
        const _origAttack_dj = window.initiateAttack;
        window.initiateAttack = function(attackerId, targetId, targetIsBase) {
            if (!targetIsBase && typeof state !== 'undefined') {
                const atkKey = state.currentTurn;
                const defKey = atkKey === 'player' ? 'ai' : 'player';
                const target = state.players[defKey].field.find(c => c.id === targetId);
                const attacker = state.players[atkKey].field.find(c => c.id === attackerId);

                if (target && attacker) {
                    const tEffName = target.originalName || target.name;
                    if ((tEffName === 'Puck' || tEffName === 'Emilia') && !target.silenced && !target.isDungeonBoss) {
                        const hasEmilia = state.players[defKey].field.some(c => (c.originalName || c.name) === 'Emilia' && getCharStats(c).hp > 0);
                        const hasPuck = state.players[defKey].field.some(c => (c.originalName || c.name) === 'Puck' && getCharStats(c).hp > 0);
                        
                        if (hasEmilia && hasPuck && Math.random() < 0.60) {
                            if (typeof log === 'function') log(`❄️ [Puck & Emilia Synergy] ประสานพลังวิญญาณ! หลบการโจมตีได้อย่างสวยงาม! (60%)`, 'text-cyan-300 font-bold');
                            attacker.attacksLeft -= 1;
                            state.selectedCardId = null;
                            if (typeof updateUI === 'function') updateUI();
                            return; // Evaded
                        }
                    }
                }
            }
            _origAttack_dj.apply(this, arguments);
        };
    }

    // ─── STICKMAN DUNGEON HOOKS ───────────────────────────────

    // 7. Stickman Boss: End Turn Heal 5 + Stickman Sniper: End Turn random kill 1 opponent
    if (typeof window.resolveEndPhase === 'function') {
        const _origEndPhaseSM = window.resolveEndPhase;
        window.resolveEndPhase = function(playerKey) {
            _origEndPhaseSM.apply(this, arguments);

            if (window.gameMode !== 'dungeon' || window.currentDungeonId !== 'stickman_boss') return;
            if (playerKey !== 'ai') return;

            const aiField = state.players.ai.field;

            // Stickman Boss: heal 5 at end of turn
            const boss = aiField.find(c => c.isDungeonBoss && (c.originalName || c.name) === 'Stickman Boss');
            if (boss && getCharStats(boss).hp > 0) {
                boss.hp = Math.min(boss.maxHp, boss.hp + 5);
                if (typeof log === 'function') log(`🪃 [Stickman Boss] ฟื้นฟู 5 HP (เหลือ ${boss.hp})`, 'text-gray-300 font-bold');
            }

            // Stickman Sniper: check if Stickman Boss alive → immortal, and end-of-turn random kill
            const bossAlive = aiField.some(c => c.isDungeonBoss && (c.originalName || c.name) === 'Stickman Boss' && getCharStats(c).hp > 0);
            const snipers = aiField.filter(c => (c.originalName || c.name) === 'Stickman Sniper' && getCharStats(c).hp > 0 && !c.silenced);
            const pField = state.players.player.field.filter(c => getCharStats(c).hp > 0);

            snipers.forEach(sniper => {
                if (pField.length > 0) {
                    const target = pField[Math.floor(Math.random() * pField.length)];
                    target.hp = 0;
                    if (typeof log === 'function') log(`🎯 [Stickman Sniper] เล็งเป้า ${target.name} — สังหาร!`, 'text-red-400 font-bold');
                }
            });

            if (pField.length > 0 && snipers.length > 0) {
                if (typeof checkDeath === 'function') checkDeath('player');
            }
        };
    }

    // 8. Stickman Sniper immortality: prevent death if Stickman Boss alive
    if (typeof window.checkDeath === 'function') {
        const _origCheckDeathSM = window.checkDeath;
        window.checkDeath = function(playerKey) {
            if (window.gameMode === 'dungeon' && window.currentDungeonId === 'stickman_boss' && playerKey === 'ai') {
                const bossAlive = state.players.ai.field.some(c =>
                    c.isDungeonBoss && (c.originalName || c.name) === 'Stickman Boss' && c.hp > 0
                );
                if (bossAlive) {
                    // Revive snipers to 1 HP before checkDeath removes them
                    state.players.ai.field.forEach(c => {
                        if ((c.originalName || c.name) === 'Stickman Sniper' && c.hp <= 0) {
                            c.hp = 1;
                            if (typeof log === 'function') log(`🛡️ [Stickman Sniper] อมตะ! ฟื้นคืนชีพ (Stickman Boss ยังอยู่)`, 'text-yellow-300');
                        }
                    });
                }
            }
            _origCheckDeathSM.apply(this, arguments);

            // Stickman: On Death heal 1 base HP for ai
            if (window.gameMode === 'dungeon' && window.currentDungeonId === 'stickman_boss' && playerKey === 'ai') {
                // This is tricky — we hook graveyard additions. Instead handle via field diff after original call.
                // Handled in separate graveyard watch below.
            }
        };
    }

    // 9. Stickman On Death: heal 1 base HP — hook via resolveEndPhase graveyard check
    // We track graveyard length and watch for new Stickman entries
    if (typeof window.checkDeath === 'function') {
        const _origCheckDeathSM2 = window.checkDeath;
        let _prevGraveStickman = 0;
        window.checkDeath = function(playerKey) {
            const graveBefore = (state.players.ai.graveyard || []).filter(c => (c.originalName || c.name) === 'Stickman').length;
            _origCheckDeathSM2.apply(this, arguments);
            if (window.gameMode === 'dungeon' && window.currentDungeonId === 'stickman_boss' && playerKey === 'ai') {
                const graveAfter = (state.players.ai.graveyard || []).filter(c => (c.originalName || c.name) === 'Stickman').length;
                const newDeaths = graveAfter - graveBefore;
                if (newDeaths > 0) {
                    state.players.ai.hp = Math.min(20, (state.players.ai.hp || 0) + newDeaths);
                    if (typeof log === 'function') log(`🪃 [Stickman] ตายแล้วฮีล ${newDeaths} HP ให้ฐาน!`, 'text-gray-400');
                }
            }
        };
    }
}
