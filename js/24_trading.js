// ============================================================
// 24_trading.js — Trade System (Cards & Coins, 1/Day, Silver+)
// ============================================================

document.addEventListener('DOMContentLoaded', () => {
    // 1. เพิ่มปุ่ม Trade ในเมนู
    const navBar = document.querySelector('.hub-nav-bar');
    if (navBar && !document.getElementById('hub-tab-trade')) {
        const btn = document.createElement('button');
        btn.id = 'hub-tab-trade';
        btn.className = 'hub-nav-btn';
        btn.innerHTML = '🔄 Trade';
        btn.onclick = () => showHubTab('trade');
        navBar.appendChild(btn);
    }

    // 2. สร้างหน้า Panel
    const container = document.getElementById('hub-panel-home')?.parentElement;
    if (container && !document.getElementById('hub-panel-trade')) {
        const pnl = document.createElement('div');
        pnl.id = 'hub-panel-trade';
        pnl.style.display = 'none';
        container.appendChild(pnl);
    }

    // 3. แทรกการสลับ Tab
    const _origTab = window.showHubTab;
    window.showHubTab = function(tab) {
        if (tab === 'trade') {
            ['home', 'packs', 'collection', 'deckbuilder', 'play', 'profile', 'bp'].forEach(t => {
                const b = document.getElementById(`hub-tab-${t}`);
                const p = document.getElementById(`hub-panel-${t}`);
                if (b) b.classList.remove('active-tab');
                if (p) p.style.display = 'none';
            });
            document.getElementById('hub-tab-trade')?.classList.add('active-tab');
            document.getElementById('hub-panel-trade').style.display = 'block';
            renderTradeHub();
        } else {
            document.getElementById('hub-tab-trade')?.classList.remove('active-tab');
            const tp = document.getElementById('hub-panel-trade');
            if (tp) tp.style.display = 'none';
            if (_origTab) _origTab(tab);
        }
    };
});

let tradeRoomId = null;
let myTradeRole = null; // 'p1' หรือ 'p2'
let tradeState = null;
let myOffer = { cards: {}, coins: 0 }; // cards format: { "CardName|Theme": count }

function checkTradeEligibility() {
    if (playerData.rp < 1000) {
        return '❌ ต้องอยู่แรงก์ Silver ขึ้นไป (1,000 RP) ถึงจะเทรดได้!';
    }
    const today = new Date().toLocaleDateString('en-CA', { timeZone: 'Asia/Bangkok' });
    if (playerData.lastTradeDate === today) {
        return '⏳ คุณเทรดไปแล้ววันนี้ (เทรดได้วันละ 1 ครั้ง)';
    }
    return null;
}

function renderTradeHub() {
    const pnl = document.getElementById('hub-panel-trade');
    const error = checkTradeEligibility();

    if (error) {
        pnl.innerHTML = `
        <div style="max-width:500px;margin:50px auto;text-align:center;background:#1f2937;padding:30px;border-radius:20px;border:2px solid #f87171;">
            <div style="font-size:4rem;margin-bottom:10px;">🛑</div>
            <div style="font-size:1.2rem;font-weight:900;color:#f87171;">${error}</div>
        </div>`;
        return;
    }

    if (tradeRoomId) {
        renderTradeRoom();
        return;
    }

    pnl.innerHTML = `
    <div style="max-width:500px;margin:0 auto;padding:20px;text-align:center;">
        <div style="font-size:3rem;margin-bottom:10px;">🔄</div>
        <div style="font-size:1.5rem;font-weight:900;color:#60a5fa;margin-bottom:5px;">Trade Center</div>
        <div style="font-size:0.8rem;color:#9ca3af;margin-bottom:20px;">
            เทรดได้วันละ 1 ครั้ง / ส่งการ์ดได้สูงสุด 5 ใบ + Coins<br>
            *การเทรดไม่สามารถย้อนกลับได้*
        </div>

        <div style="background:#111827;border:2px solid #374151;border-radius:16px;padding:20px;margin-bottom:20px;">
            <button onclick="createTradeRoom()" style="width:100%;background:linear-gradient(135deg,#2563eb,#1d4ed8);color:white;font-weight:900;padding:12px;border-radius:12px;border:none;cursor:pointer;font-size:1.1rem;margin-bottom:15px;">
                ➕ สร้างห้องเทรด
            </button>
            <div style="color:#6b7280;margin-bottom:10px;">หรือเข้าร่วมห้องเพื่อน</div>
            <input id="trade-room-input" placeholder="ใส่ Trade ID..." style="width:100%;background:#1f2937;color:white;border:1px solid #4b5563;padding:10px;border-radius:10px;text-align:center;margin-bottom:10px;font-size:1.1rem;">
            <button onclick="joinTradeRoom()" style="width:100%;background:#059669;color:white;font-weight:900;padding:12px;border-radius:12px;border:none;cursor:pointer;font-size:1.1rem;">
                🤝 เข้าร่วมห้องเทรด
            </button>
        </div>
    </div>`;
}

// ─── Firebase Logic ───
function getTradeUserInfo() {
    return {
        uid: currentUser ? currentUser.uid : 'guest',
        name: currentUser ? (currentUser.displayName || 'Player') : 'Guest',
        avatar: playerData.equippedAvatar || 'av_killua',
        offer: { cards: {}, coins: 0 },
        ready: false
    };
}

async function createTradeRoom() {
    if (!firebaseReady || !currentUser) { showToast('กรุณา Login เพื่อเทรด', '#f87171'); return; }
    myTradeRole = 'p1';
    tradeRoomId = Math.random().toString(36).substring(2, 8).toUpperCase();
    myOffer = { cards: {}, coins: 0 };
    
    await db.ref('trades/' + tradeRoomId).set({
        p1: getTradeUserInfo(),
        p2: null,
        status: 'waiting'
    });
    listenToTradeRoom();
    renderTradeHub();
}

async function joinTradeRoom() {
    if (!firebaseReady || !currentUser) { showToast('กรุณา Login', '#f87171'); return; }
    const input = document.getElementById('trade-room-input')?.value?.trim().toUpperCase();
    if (!input) return;

    const snap = await db.ref('trades/' + input).get();
    if (!snap.exists()) { showToast('❌ ไม่พบห้องเทรด', '#f87171'); return; }
    if (snap.val().p2) { showToast('❌ ห้องเทรดเต็มแล้ว', '#f87171'); return; }
    if (snap.val().status !== 'waiting') { showToast('❌ ห้องนี้ปิดไปแล้ว', '#f87171'); return; }

    myTradeRole = 'p2';
    tradeRoomId = input;
    myOffer = { cards: {}, coins: 0 };

    await db.ref('trades/' + tradeRoomId).update({
        p2: getTradeUserInfo(),
        status: 'trading'
    });
    listenToTradeRoom();
    renderTradeHub();
}

function listenToTradeRoom() {
    db.ref('trades/' + tradeRoomId).on('value', snap => {
        if (!snap.exists()) return;
        tradeState = snap.val();
        
        if (tradeState.status === 'completed') {
            db.ref('trades/' + tradeRoomId).off();
            completeTradeLocally();
            return;
        }
        if (tradeState.status === 'cancelled') {
            db.ref('trades/' + tradeRoomId).off();
            tradeRoomId = null;
            showToast('❌ การเทรดถูกยกเลิก', '#f87171');
            renderTradeHub();
            return;
        }
        renderTradeRoom();
    });
}

// ─── Trade UI ───
function renderTradeRoom() {
    const pnl = document.getElementById('hub-panel-trade');
    if (!tradeState) return;

    const me = tradeState[myTradeRole];
    const oppRole = myTradeRole === 'p1' ? 'p2' : 'p1';
    const opp = tradeState[oppRole];

    const renderOffer = (player) => {
        if (!player) return `<div style="color:#6b7280;text-align:center;margin-top:50px;">กำลังรอ...</div>`;
        
        const totalCards = Object.values(player.offer.cards || {}).reduce((a, b) => a + b, 0);
        let cardsHtml = Object.entries(player.offer.cards || {}).map(([k, v]) => {
            const[name, theme] = k.split('|');
            return `<div style="font-size:0.75rem;background:#1f2937;padding:4px;border-radius:4px;margin-bottom:4px;display:flex;justify-content:space-between;">
                <span style="color:#fff;">${name}</span> <span style="color:#fbbf24;">x${v}</span>
            </div>`;
        }).join('');
        if (!cardsHtml) cardsHtml = `<div style="color:#6b7280;font-size:0.8rem;">ยังไม่ได้ใส่การ์ด</div>`;

        return `
            <div style="display:flex;align-items:center;gap:10px;margin-bottom:10px;cursor:pointer;" onclick="viewFriendProfile('${player.uid}')">
                <img src="${COSMETICS_CATALOG.avatars.find(a=>a.id===player.avatar)?.art || ''}" style="width:40px;height:40px;border-radius:50%;border:2px solid #fbbf24;">
                <div>
                    <div style="font-weight:900;color:white;">${player.name}</div>
                    <div style="font-size:0.65rem;color:#60a5fa;">🔍 กดเพื่อดูโปรไฟล์</div>
                </div>
            </div>
            <div style="background:#111827;border:1px solid ${player.ready ? '#4ade80' : '#374151'};border-radius:10px;padding:10px;min-height:150px;">
                <div style="color:#fbbf24;font-weight:900;margin-bottom:10px;">🪙 Coins: ${player.offer.coins.toLocaleString()}</div>
                <div style="color:#9ca3af;font-size:0.7rem;margin-bottom:5px;">Cards (${totalCards}/5)</div>
                ${cardsHtml}
            </div>
            <div style="text-align:center;margin-top:10px;font-weight:900;color:${player.ready ? '#4ade80' : '#f87171'}">
                ${player.ready ? '✅ READY' : '⏳ NOT READY'}
            </div>
        `;
    };

    const canEdit = !me.ready;

    pnl.innerHTML = `
    <div style="max-width:800px;margin:0 auto;padding:20px;">
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:20px;">
            <div style="font-weight:900;color:#60a5fa;font-size:1.2rem;">Trade Room: ${tradeRoomId}</div>
            <button onclick="cancelTrade()" style="background:#7f1d1d;color:white;border:none;padding:5px 15px;border-radius:8px;cursor:pointer;font-weight:bold;">ยกเลิก</button>
        </div>

        <div style="display:grid;grid-template-columns:1fr 1fr;gap:20px;margin-bottom:20px;">
            <!-- Me -->
            <div style="background:#1f2937;padding:15px;border-radius:16px;border:2px solid #60a5fa;">
                <div style="font-size:0.8rem;color:#93c5fd;font-weight:bold;margin-bottom:5px;">คุณ</div>
                ${renderOffer(me)}
                ${canEdit ? `
                <button onclick="openTradeInventory()" style="margin-top:10px;width:100%;background:#374151;color:white;border:1px solid #4b5563;padding:8px;border-radius:8px;cursor:pointer;">
                    + เพิ่มการ์ด / เงิน
                </button>` : ''}
            </div>

            <!-- Opponent -->
            <div style="background:#1f2937;padding:15px;border-radius:16px;border:2px solid #f87171;">
                <div style="font-size:0.8rem;color:#fca5a5;font-weight:bold;margin-bottom:5px;">คู่เทรด</div>
                ${renderOffer(opp)}
            </div>
        </div>

        <button onclick="toggleTradeReady()" ${!opp ? 'disabled' : ''} style="width:100%;background:${me.ready ? '#f59e0b' : '#10b981'};color:white;font-weight:900;padding:15px;border-radius:12px;border:none;cursor:${opp ? 'pointer' : 'not-allowed'};font-size:1.2rem;">
            ${me.ready ? 'ยกเลิกสถานะ Ready' : 'กดยืนยัน (Ready)'}
        </button>
    </div>`;

    // ถ้า ready ทั้งคู่ -> ประมวลผลเทรด
    if (me?.ready && opp?.ready && myTradeRole === 'p1' && tradeState.status === 'trading') {
        db.ref('trades/' + tradeRoomId).update({ status: 'completed' });
    }
}

// ─── Logic จัดการของ ───
function toggleTradeReady() {
    myOffer.ready = !tradeState[myTradeRole].ready;
    db.ref(`trades/${tradeRoomId}/${myTradeRole}`).update({ ready: myOffer.ready });
}

function cancelTrade() {
    if (tradeRoomId) db.ref('trades/' + tradeRoomId).update({ status: 'cancelled' });
}

function completeTradeLocally() {
    const me = tradeState[myTradeRole];
    const opp = tradeState[myTradeRole === 'p1' ? 'p2' : 'p1'];

    // 1. หักของตัวเอง
    playerData.coins -= me.offer.coins;
    Object.entries(me.offer.cards || {}).forEach(([k, v]) => {
        playerData.collection[k] -= v;
        if (playerData.collection[k] <= 0) delete playerData.collection[k];
    });

    // 2. รับของเพื่อน
    playerData.coins += opp.offer.coins;
    Object.entries(opp.offer.cards || {}).forEach(([k, v]) => {
        playerData.collection[k] = (playerData.collection[k] || 0) + v;
    });

    // 3. หักโควตารายวัน
    playerData.lastTradeDate = new Date().toLocaleDateString('en-CA', { timeZone: 'Asia/Bangkok' });
    
    saveData();
    tradeRoomId = null;
    tradeState = null;
    updateHubUI();
    showToast('🎉 เทรดสำเร็จเรียบร้อย!', '#4ade80');
    renderTradeHub();
}

// ─── Popup เลือกของ ───
function openTradeInventory() {
    const totalSelectedCards = Object.values(myOffer.cards).reduce((a,b)=>a+b, 0);
    const ov = document.createElement('div');
    ov.id = 'trade-inv-overlay';
    ov.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,0.9);z-index:9000;display:flex;align-items:center;justify-content:center;padding:20px;';
    
    const collectionHTML = Object.entries(playerData.collection).filter(([k,v]) => v > 0).map(([k, v]) => {
        const [name, theme] = k.split('|');
        const selected = myOffer.cards[k] || 0;
        const available = v - selected;
        return `<div style="background:#111827;border:1px solid #374151;padding:10px;border-radius:8px;display:flex;justify-content:space-between;align-items:center;margin-bottom:5px;">
            <div>
                <div style="color:white;font-weight:bold;font-size:0.8rem;">${name}</div>
                <div style="color:#6b7280;font-size:0.6rem;">มี: ${v} | ว่าง: ${available}</div>
            </div>
            <button onclick="addCardToTrade('${k}')" ${available<=0 || totalSelectedCards>=5 ? 'disabled' : ''} style="background:#2563eb;color:white;border:none;padding:5px 10px;border-radius:5px;cursor:pointer;">+</button>
        </div>`;
    }).join('');

    ov.innerHTML = `
    <div style="background:#1f2937;border-radius:16px;padding:20px;width:100%;max-width:400px;max-height:80vh;overflow-y:auto;">
        <h3 style="color:white;margin-bottom:15px;">เลือกของเทรด</h3>
        
        <div style="margin-bottom:15px;">
            <label style="color:#9ca3af;font-size:0.8rem;">เหรียญ (คุณมี ${playerData.coins})</label>
            <input type="number" id="trade-coin-input" value="${myOffer.coins}" max="${playerData.coins}" min="0" style="width:100%;background:#111827;color:#fbbf24;padding:8px;border-radius:8px;border:1px solid #374151;">
        </div>

        <div style="color:#9ca3af;font-size:0.8rem;margin-bottom:5px;">การ์ด (เลือกแล้ว ${totalSelectedCards}/5)</div>
        <button onclick="myOffer.cards={};syncTradeOffer();document.getElementById('trade-inv-overlay').remove();openTradeInventory();" style="background:#7f1d1d;color:white;padding:5px;border:none;border-radius:5px;margin-bottom:10px;width:100%;">รีเซ็ตการ์ดที่เลือก</button>
        
        <div style="max-height:300px;overflow-y:auto;">
            ${collectionHTML}
        </div>

        <button onclick="saveTradeInv()" style="width:100%;margin-top:15px;background:#10b981;color:white;padding:10px;border-radius:8px;border:none;font-weight:bold;cursor:pointer;">ตกลง</button>
    </div>`;
    document.body.appendChild(ov);
}

window.addCardToTrade = function(key) {
    myOffer.cards[key] = (myOffer.cards[key] || 0) + 1;
    syncTradeOffer();
    document.getElementById('trade-inv-overlay').remove();
    openTradeInventory();
};

window.saveTradeInv = function() {
    const coinsInput = parseInt(document.getElementById('trade-coin-input').value) || 0;
    myOffer.coins = Math.min(coinsInput, playerData.coins);
    syncTradeOffer();
    document.getElementById('trade-inv-overlay').remove();
};

function syncTradeOffer() {
    db.ref(`trades/${tradeRoomId}/${myTradeRole}/offer`).set(myOffer);
}

// ─── ระบบดูโปรไฟล์เพื่อน ───
window.viewFriendProfile = async function(uid) {
    if (!uid || uid === 'guest') return;
    showToast('กำลังโหลดข้อมูล...', '#60a5fa');
    try {
        const snap = await db.ref('statsV2/' + uid).get();
        if (!snap.exists()) { showToast('ไม่พบข้อมูลผู้เล่น', '#f87171'); return; }
        const data = snap.val();
        
        const ov = document.createElement('div');
        ov.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,0.9);z-index:9999;display:flex;align-items:center;justify-content:center;padding:20px;';
        ov.onclick = e => { if (e.target === ov) ov.remove(); };
        
        ov.innerHTML = `
        <div style="background:#111827;border:2px solid #60a5fa;border-radius:20px;padding:20px;width:100%;max-width:400px;text-align:center;">
            <img src="${data.photoURL || 'https://www.gstatic.com/images/branding/product/2x/avatar_anonymous_96x96dp.png'}" style="width:80px;height:80px;border-radius:50%;margin:0 auto 10px;">
            <h2 style="color:white;margin:0;">${data.displayName || 'Player'}</h2>
            <div style="color:#fbbf24;font-weight:bold;margin-bottom:15px;">Level ${data.level || '?'}</div>
            
            <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-bottom:20px;">
                <div style="background:#1f2937;padding:10px;border-radius:10px;">
                    <div style="color:#4ade80;font-weight:900;font-size:1.2rem;">${data.wins || 0}</div>
                    <div style="color:#9ca3af;font-size:0.7rem;">Wins</div>
                </div>
                <div style="background:#1f2937;padding:10px;border-radius:10px;">
                    <div style="color:#f87171;font-weight:900;font-size:1.2rem;">${data.losses || 0}</div>
                    <div style="color:#9ca3af;font-size:0.7rem;">Losses</div>
                </div>
            </div>
            
            <div style="background:#1f2937;padding:10px;border-radius:10px;text-align:left;">
                <div style="color:#9ca3af;font-size:0.8rem;margin-bottom:5px;">การ์ดที่เล่นบ่อยสุด:</div>
                <div style="color:#60a5fa;font-weight:bold;">${data.mostPlayedCard || 'N/A'}</div>
            </div>
            
            <button onclick="this.parentElement.parentElement.remove()" style="margin-top:15px;background:#374151;color:white;border:none;padding:10px 20px;border-radius:10px;cursor:pointer;width:100%;">ปิด</button>
        </div>`;
        document.body.appendChild(ov);
    } catch (e) {
        showToast('โหลดข้อมูลผิดพลาด', '#f87171');
    }
};
