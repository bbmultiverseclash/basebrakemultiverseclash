// ============================================================
// 25_social_matchmaking.js — Friends, Trade Invites, Auto Matchmaking
// ============================================================

document.addEventListener('DOMContentLoaded', () => {
    // 1. เพิ่ม Tab Social
    const navBar = document.querySelector('.hub-nav-bar');
    if (navBar && !document.getElementById('hub-tab-social')) {
        const btn = document.createElement('button');
        btn.id = 'hub-tab-social';
        btn.className = 'hub-nav-btn';
        btn.innerHTML = '👥 Social';
        btn.onclick = () => showHubTab('social');
        navBar.appendChild(btn);
    }

    // 2. สร้าง Panel Social
    const container = document.getElementById('hub-panel-home')?.parentElement;
    if (container && !document.getElementById('hub-panel-social')) {
        const pnl = document.createElement('div');
        pnl.id = 'hub-panel-social';
        pnl.style.display = 'none';
        container.appendChild(pnl);
    }

    // 3. Override ระบบ Tab เพื่อรองรับ Tab ใหม่
    const _origTab = window.showHubTab;
    window.showHubTab = function(tab) {
        if (tab === 'social') {
            ['home','packs','collection','deckbuilder','play','profile','bp','trade'].forEach(t => {
                const b = document.getElementById('hub-tab-'+t);
                const p = document.getElementById('hub-panel-'+t);
                if(b) b.classList.remove('active-tab');
                if(p) p.style.display = 'none';
            });
            document.getElementById('hub-tab-social')?.classList.add('active-tab');
            document.getElementById('hub-panel-social').style.display = 'block';
            renderSocialHub();
        } else {
            document.getElementById('hub-tab-social')?.classList.remove('active-tab');
            const tp = document.getElementById('hub-panel-social');
            if(tp) tp.style.display = 'none';
            if(_origTab) _origTab(tab);
        }
    };

    setTimeout(initSocialListeners, 2000);
});

let myFriends = {};

// ─── ระบบเพื่อน & คำเชิญ ───
function initSocialListeners() {
    if (typeof currentUser === 'undefined' || !currentUser) return;
    const uid = currentUser.uid;
    
    // ฟังคำขอเป็นเพื่อน
    db.ref('friendRequests/' + uid).on('value', snap => {
        const reqs = snap.val();
        if (reqs && Object.keys(reqs).length > 0) {
            if (typeof showToast === 'function') showToast('🔔 คุณมีคำขอเป็นเพื่อนใหม่!', '#fbbf24');
        }
        if (typeof hubTab !== 'undefined' && hubTab === 'social') renderSocialHub();
    });
    
    // ฟังรายชื่อเพื่อน
    db.ref('friends/' + uid).on('value', snap => {
        myFriends = snap.val() || {};
        if (typeof hubTab !== 'undefined' && hubTab === 'social') renderSocialHub();
    });
    
    // ฟังคำเชิญ (Trade / Duel)
    db.ref('invites/' + uid).on('value', snap => {
        const inv = snap.val();
        if (inv && inv.type === 'trade') {
            showInviteModal(inv);
            db.ref('invites/' + uid).remove();
        }
    });
}

async function sendFriendRequest() {
    const targetUid = document.getElementById('friend-uid-input').value.trim();
    if (!targetUid || targetUid === currentUser.uid) return;
    await db.ref('friendRequests/' + targetUid + '/' + currentUser.uid).set({
        name: currentUser.displayName || 'Player',
        ts: Date.now()
    });
    if (typeof showToast === 'function') showToast('ส่งคำขอแล้ว!', '#4ade80');
    document.getElementById('friend-uid-input').value = '';
}

async function acceptFriend(fid, fname) {
    const uid = currentUser.uid;
    await db.ref('friends/' + uid + '/' + fid).set({ name: fname });
    await db.ref('friends/' + fid + '/' + uid).set({ name: currentUser.displayName || 'Player' });
    await db.ref('friendRequests/' + uid + '/' + fid).remove();
    if (typeof showToast === 'function') showToast('เพิ่มเพื่อนสำเร็จ!', '#4ade80');
}

// ─── ชวนเทรด ───
function inviteToTrade(fid) {
    const err = typeof checkTradeEligibility === 'function' ? checkTradeEligibility() : null;
    if (err) { showToast(err, '#f87171'); return; }
    
    myTradeRole = 'p1';
    tradeRoomId = Math.random().toString(36).substring(2,8).toUpperCase();
    myOffer = { cards: {}, coins: 0 };
    
    db.ref('trades/' + tradeRoomId).set({ p1: getTradeUserInfo(), p2: null, status: 'waiting' });
    db.ref('invites/' + fid).set({ type: 'trade', roomId: tradeRoomId, fromName: currentUser.displayName || 'Player', ts: Date.now() });
    
    if (typeof listenToTradeRoom === 'function') listenToTradeRoom();
    showHubTab('trade');
    if (typeof showToast === 'function') showToast('ส่งคำเชิญเทรดแล้ว กำลังรอเพื่อนเข้าห้อง...', '#60a5fa');
}

function showInviteModal(inv) {
    const ov = document.createElement('div');
    ov.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,0.9);z-index:9999;display:flex;align-items:center;justify-content:center;';
    ov.innerHTML = `
    <div style="background:#1f2937;padding:25px;border-radius:15px;text-align:center;border:2px solid #fbbf24;max-width:350px;">
        <h3 style="color:white;font-size:1.3rem;">🔔 คำเชิญเทรด</h3>
        <p style="color:#9ca3af;margin-bottom:20px;"><strong style="color:#fbbf24;">${inv.fromName}</strong> ชวนคุณเทรด!</p>
        <div style="display:flex;gap:10px;">
            <button id="btn-acc-inv" style="flex:1;background:#10b981;color:white;padding:12px;border:none;border-radius:10px;font-weight:bold;cursor:pointer;">ตกลง</button>
            <button id="btn-dec-inv" style="flex:1;background:#ef4444;color:white;padding:12px;border:none;border-radius:10px;font-weight:bold;cursor:pointer;">ปฏิเสธ</button>
        </div>
    </div>`;
    document.body.appendChild(ov);
    
    document.getElementById('btn-acc-inv').onclick = () => {
        ov.remove();
        const roomInput = document.getElementById('trade-room-input');
        if (roomInput) roomInput.value = inv.roomId;
        if (typeof joinTradeRoom === 'function') joinTradeRoom();
        showHubTab('trade');
    };
    document.getElementById('btn-dec-inv').onclick = () => ov.remove();
}

// ─── UI Social ───
async function renderSocialHub() {
    if (!currentUser) return;
    const pnl = document.getElementById('hub-panel-social');
    
    const reqSnap = await db.ref('friendRequests/' + currentUser.uid).get();
    const reqs = reqSnap.val() || {};
    
    let reqHtml = Object.entries(reqs).map(([fid, data]) => `
        <div style="background:#111827;padding:12px;margin-bottom:8px;border-radius:10px;display:flex;justify-content:space-between;align-items:center;">
            <span style="color:white;font-weight:bold;">${data.name}</span>
            <button onclick="acceptFriend('${fid}', '${data.name}')" style="background:#10b981;color:white;border:none;border-radius:8px;padding:6px 12px;cursor:pointer;">รับแอด</button>
        </div>`).join('');
        
    let frHtml = Object.entries(myFriends).map(([fid, data]) => `
        <div style="background:#111827;padding:12px;margin-bottom:8px;border-radius:10px;display:flex;justify-content:space-between;align-items:center;">
            <span style="color:white;font-weight:bold;">${data.name}</span>
            <div style="display:flex;gap:6px;">
                <button onclick="viewFriendProfile('${fid}')" style="background:#3b82f6;color:white;border:none;border-radius:8px;padding:6px 12px;cursor:pointer;">โปรไฟล์</button>
                <button onclick="inviteToTrade('${fid}')" style="background:#f59e0b;color:white;border:none;border-radius:8px;padding:6px 12px;cursor:pointer;">ชวนเทรด</button>
            </div>
        </div>`).join('');
        
    pnl.innerHTML = `
    <div style="max-width:600px;margin:0 auto;padding:20px;">
        <h2 style="color:#60a5fa;text-align:center;margin-bottom:20px;">👥 Social Center</h2>
        
        <div style="background:#1f2937;padding:15px;border-radius:12px;margin-bottom:20px;text-align:center;">
            <div style="color:#9ca3af;font-size:0.8rem;">รหัสเพื่อนของคุณ (UID ให้เพื่อนแอด)</div>
            <div style="color:#fbbf24;font-weight:bold;font-size:1.1rem;margin:5px 0;word-break:break-all;">${currentUser.uid}</div>
        </div>
        
        <div style="display:flex;gap:10px;margin-bottom:25px;">
            <input id="friend-uid-input" placeholder="วางรหัสเพื่อน (UID)..." style="flex:1;padding:12px;border-radius:10px;border:1px solid #4b5563;background:#111827;color:white;">
            <button onclick="sendFriendRequest()" style="background:#10b981;color:white;border:none;border-radius:10px;padding:0 20px;font-weight:bold;cursor:pointer;">แอดเพื่อน</button>
        </div>
        
        ${reqHtml ? `<h3 style="color:#fbbf24;margin-bottom:10px;">คำขอเป็นเพื่อน</h3>${reqHtml}` : ''}
        
        <h3 style="color:#60a5fa;margin-top:20px;margin-bottom:10px;">รายชื่อเพื่อน</h3>
        ${frHtml || '<div style="color:#9ca3af;text-align:center;padding:20px;background:#111827;border-radius:10px;">ยังไม่มีเพื่อน ลองเพิ่มเพื่อนดูสิ!</div>'}
    </div>`;
}

// ─── ระบบ Matchmaking โหมดแรงก์ ───
// ครอบทับ startRankedOnline เดิม
const _origRankedOnline = window.startRankedOnline;
window.startRankedOnline = async function(deckId) {
    if (!currentUser) { if (typeof showToast === 'function') showToast('กรุณา Login เข้าสู่ระบบก่อน', '#f87171'); return; }
    
    // เปลี่ยน UI เพื่อแสดงสถานะจับคู่
    const btn = event ? (event.target || document.activeElement) : null;
    let origText = '🌐 Ranked Online';
    if (btn) {
        origText = btn.innerHTML;
        btn.innerHTML = '🔍 กำลังหาคู่...';
        btn.disabled = true;
    }
    
    if (typeof showToast === 'function') showToast('🔍 กำลังหาคู่ต่อสู้ในแรงก์ที่ใกล้เคียง...', '#60a5fa');
    
    const myRp = playerData.rp || 0;
    const myUid = currentUser.uid;
    const qRef = db.ref('matchmaking/ranked');
    
    // 1. ดึงคิวปัจจุบัน
    const snap = await qRef.once('value');
    const queue = snap.val() || {};
    let matchedUid = null;
    
    // 2. หาคนแรงก์ใกล้เคียง (+/- 1500 RP)
    for (let uid in queue) {
        if (uid !== myUid && !queue[uid].matchedRoom && Math.abs(queue[uid].rp - myRp) <= 1500) {
            // จองตัวคู่แข่ง (Locking)
            const oppRef = db.ref('matchmaking/ranked/' + uid + '/matchedRoom');
            const res = await oppRef.transaction(curr => {
                if (curr === null) return 'LOCKING'; // ว่างอยู่ จองเลย
                return; // ไม่ว่าง ยกเลิก
            });
            if (res.committed) {
                matchedUid = uid;
                break;
            }
        }
    }
    
    if (matchedUid) {
        // เจอคู่แข่ง! เราเป็น Host สร้างห้อง
        onlineRoomId = generateRoomId();
        myRole = 'player';
        const roomInput = document.getElementById('room-id-input');
        if (roomInput) roomInput.value = onlineRoomId;
        const sessionToken = Date.now().toString();
        
        await db.ref('rooms/' + onlineRoomId).set({
            session: sessionToken,
            hostTheme: selectedPlayerTheme,
            gameMode: 'online',
            gameReady: false
        });
        
        // ส่ง Room ID ไปให้คู่แข่ง
        await db.ref('matchmaking/ranked/' + matchedUid).update({ matchedRoom: onlineRoomId });
        
        if (typeof showToast === 'function') showToast('⚔️ จับคู่สำเร็จ! กำลังเข้าเกม...', '#4ade80');
        if (btn) {
            btn.innerHTML = origText;
            btn.disabled = false;
        }
        
        if (_origRankedOnline) _origRankedOnline(deckId);
        if (typeof startOnlineGame === 'function') startOnlineGame();
    } else {
        // ไม่เจอคู่แข่ง เข้าคิวรอ
        await qRef.child(myUid).set({ rp: myRp, matchedRoom: null, ts: Date.now() });
        // ลบออกจากคิวอัตโนมัติถ้าผู้เล่นปิดเว็บหนี
        qRef.child(myUid).onDisconnect().remove();
        
        const myMatchRef = db.ref('matchmaking/ranked/' + myUid + '/matchedRoom');
        myMatchRef.on('value', mSnap => {
            const rId = mSnap.val();
            if (rId && rId !== 'LOCKING') {
                // มีคนจับคู่เราแล้วและส่งห้องมาให้
                myMatchRef.off();
                qRef.child(myUid).remove(); // ออกจากคิว
                
                const roomInput = document.getElementById('room-id-input');
                if (roomInput) roomInput.value = rId;
                if (typeof showToast === 'function') showToast('⚔️ มีคู่แข่งเจอคุณแล้ว! กำลังเข้าเกม...', '#4ade80');
                if (btn) {
                    btn.innerHTML = origText;
                    btn.disabled = false;
                }
                
                if (_origRankedOnline) _origRankedOnline(deckId);
                if (typeof startOnlineGame === 'function') startOnlineGame();
            }
        });
    }
};
