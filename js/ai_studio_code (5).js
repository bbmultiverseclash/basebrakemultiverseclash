// ============================================================
// 22_cosmetics_system.js — Ultimate Profile & Cosmetics System
// ============================================================

const COSMETICS_CATALOG = {
    avatars: [
        { id: 'av_killua', label: 'Killua', art: 'https://file.garden/aeeLCXSsJxTPrRbp/85e6e8ec8b33c609f081728d6e352960.jpg' },
        { id: 'av_ali', label: 'Muhammad Ali', art: 'https://i.ibb.co/W4hnfNnm/BCO-90a9b4c9-0e24-45b9-adf8-9ac1ce9c66e1-1.png' },
        { id: 'av_megumin', label: 'Megumin', art: 'https://file.garden/aeeLCXSsJxTPrRbp/39b0d0d6ed0807076fffd45aa5050a8d%20(1).jpg' },
        { id: 'av_frieren', label: 'Frieren', art: 'https://i.pinimg.com/1200x/1c/ce/0a/1cce0ab4a8d5e2a94d69b2ea4e3a774f.jpg' },
        { id: 'av_gon', label: 'Gon Freecss', art: 'https://mir-s3-cdn-cf.behance.net/projects/404/fa05e682971181.Y3JvcCwzMTcxLDI0ODEsMTY0LDA.jpg' }
    ],
    banners: [
        { id: 'bn_dark', label: 'Dark Continent', art: 'https://file.garden/aeeLCXSsJxTPrRbp/file_00000000b5447208805daceadd5040b3.png' },
        { id: 'bn_space', label: 'Galaxy Space', art: 'https://images.unsplash.com/photo-1614730321146-b6fa6a46bcb4?w=800&q=80' },
        { id: 'bn_fire', label: 'Hell Fire', art: 'https://files.catbox.moe/t6j7p5.png' },
        { id: 'bn_gold', label: 'Royal Gold', art: 'https://i.pinimg.com/736x/0d/dc/8d/0ddc8d739e7aa70f1bafecef8ce4a4fa.jpg' }
    ],
    frames: [
        { id: 'fr_none', label: 'No Frame', color: 'transparent', effect: 'none' },
        { id: 'fr_gold', label: 'Golden Royalty', color: '#fbbf24', effect: 'shadow' },
        { id: 'fr_electric', label: 'Electric Blue', color: '#60a5fa', effect: 'glow' },
        { id: 'fr_crimson', label: 'Crimson Flame', color: '#f87171', effect: 'pulse' }
    ]
};

document.addEventListener('DOMContentLoaded', () => {
    // 1. Initialize Player Data Fields
    if (typeof playerData !== 'undefined') {
        if (!playerData.equippedAvatar) playerData.equippedAvatar = 'av_killua';
        if (!playerData.equippedBanner) playerData.equippedBanner = 'bn_dark';
        if (!playerData.equippedFrame) playerData.equippedFrame = 'fr_none';
        if (!playerData.favoriteCards) playerData.favoriteCards = []; // Store as "CardName|Theme"
    }

    // 2. Inject Tab button into Nav Bar
    const navBar = document.querySelector('.hub-nav-bar');
    if (navBar && !document.getElementById('hub-tab-profile')) {
        const profileBtn = document.createElement('button');
        profileBtn.id = 'hub-tab-profile';
        profileBtn.className = 'hub-nav-btn';
        profileBtn.innerHTML = '👤 Profile';
        profileBtn.onclick = () => showHubTab('profile');
        navBar.appendChild(profileBtn);
    }

    // 3. Create Profile Panel Container
    const hubContainer = document.getElementById('hub-panel-home')?.parentElement;
    if (hubContainer && !document.getElementById('hub-panel-profile')) {
        const pnl = document.createElement('div');
        pnl.id = 'hub-panel-profile';
        pnl.style.display = 'none';
        hubContainer.appendChild(pnl);
    }

    // 4. Hook showHubTab to render our new Profile
    const _origShowHubTab = window.showHubTab;
    window.showHubTab = function(tab) {
        if (tab === 'profile') {
            // Hide others
            ['home', 'packs', 'collection', 'deckbuilder', 'play'].forEach(t => {
                const b = document.getElementById(`hub-tab-${t}`);
                const p = document.getElementById(`hub-panel-${t}`);
                if (b) b.classList.remove('active-tab');
                if (p) p.style.display = 'none';
            });
            document.getElementById('hub-tab-profile').classList.add('active-tab');
            document.getElementById('hub-panel-profile').style.display = 'block';
            renderProfilePanel();
        } else {
            const pb = document.getElementById('hub-tab-profile');
            const pp = document.getElementById('hub-panel-profile');
            if (pb) pb.classList.remove('active-tab');
            if (pp) pp.style.display = 'none';
            if (_origShowHubTab) _origShowHubTab(tab);
        }
    };

    // 5. CSS Styles
    const style = document.createElement('style');
    style.innerHTML = `
        .profile-card { background: #111827; border-radius: 24px; overflow: hidden; border: 1px solid #374151; box-shadow: 0 10px 30px rgba(0,0,0,0.5); }
        .frame-glow { box-shadow: 0 0 20px currentColor; border: 4px solid currentColor !important; }
        .frame-shadow { border: 4px double currentColor !important; filter: drop-shadow(0 0 8px rgba(0,0,0,0.8)); }
        .frame-pulse { border: 4px solid currentColor !important; animation: frame-pulse-anim 2s infinite; }
        @keyframes frame-pulse-anim { 0%, 100% { transform: scale(1); opacity: 1; } 50% { transform: scale(1.05); opacity: 0.8; } }
        .fav-card-slot { width: 80px; height: 110px; background: rgba(0,0,0,0.4); border: 2px dashed #4b5563; border-radius: 12px; display: flex; align-items: center; justify-content: center; cursor: pointer; transition: 0.2s; }
        .fav-card-slot:hover { border-color: #fbbf24; background: rgba(251, 191, 36, 0.1); }
        .cosmetic-box { border: 2px solid #374151; border-radius: 12px; padding: 5px; cursor: pointer; transition: 0.2s; text-align: center; }
        .cosmetic-box:hover { border-color: #fbbf24; }
        .cosmetic-box.active { border-color: #4ade80; background: rgba(74, 222, 128, 0.1); }
    `;
    document.head.appendChild(style);
});

// --- RENDER PROFILE PANEL ---
function renderProfilePanel() {
    const pnl = document.getElementById('hub-panel-profile');
    if (!pnl) return;

    const banner = COSMETICS_CATALOG.banners.find(b => b.id === playerData.equippedBanner)?.art || '';
    const avatar = COSMETICS_CATALOG.avatars.find(a => a.id === playerData.equippedAvatar)?.art || '';
    const frame = COSMETICS_CATALOG.frames.find(f => f.id === playerData.equippedFrame);
    
    const rank = typeof getRankInfo === 'function' ? getRankInfo(playerData.rp) : { name: 'Unknown', emoji: '❓' };
    const playerName = (typeof currentUser !== 'undefined' && currentUser?.displayName) ? currentUser.displayName : "Player One";

    pnl.innerHTML = `
    <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
        <!-- Profile Header (Banner) -->
        <div class="profile-card" style="margin-bottom: 20px;">
            <div style="height: 150px; background: url('${banner}') center/cover no-repeat; position: relative;">
                <div style="position: absolute; inset: 0; background: linear-gradient(to top, #111827, transparent);"></div>
            </div>
            
            <div style="padding: 0 25px 25px; margin-top: -60px; position: relative; text-align: center;">
                <!-- Avatar & Frame -->
                <div style="width: 120px; height: 120px; margin: 0 auto 15px; position: relative;">
                    <img src="${avatar}" style="width: 100%; height: 100%; border-radius: 50%; object-fit: cover; background: #000; border: 4px solid #111827;" 
                         class="${frame?.effect !== 'none' ? 'frame-' + frame?.effect : ''}" style="color: ${frame?.color}">
                </div>
                
                <h1 style="font-size: 1.8rem; font-weight: 900; color: white; margin: 0;">${playerName}</h1>
                <div style="color: #fbbf24; font-weight: bold; font-size: 1rem; margin-bottom: 15px;">
                    ${rank.emoji} ${rank.name} | Level ${playerData.level}
                </div>

                <!-- Win/Lose Stats -->
                <div style="display: flex; gap: 10px; justify-content: center; margin-bottom: 20px;">
                    <div style="background: #065f46; padding: 8px 20px; border-radius: 12px; border: 1px solid #10b981;">
                        <div style="font-size: 0.7rem; color: #a7f3d0; text-transform: uppercase;">Wins</div>
                        <div style="font-size: 1.2rem; font-weight: 900; color: white;">${playerData.wins}</div>
                    </div>
                    <div style="background: #7f1d1d; padding: 8px 20px; border-radius: 12px; border: 1px solid #f87171;">
                        <div style="font-size: 0.7rem; color: #fecdd3; text-transform: uppercase;">Losses</div>
                        <div style="font-size: 1.2rem; font-weight: 900; color: white;">${playerData.losses}</div>
                    </div>
                </div>

                <!-- Favorite Cards Section -->
                <div style="text-align: left;">
                    <div style="font-size: 0.8rem; color: #9ca3af; font-weight: bold; margin-bottom: 10px; text-transform: uppercase;">⭐ Favorite Cards (Top 3)</div>
                    <div style="display: flex; gap: 10px; justify-content: center;">
                        ${[0, 1, 2].map(i => renderFavoriteSlot(i)).join('')}
                    </div>
                    <div style="font-size: 0.65rem; color: #6b7280; text-align: center; margin-top: 8px;">คลิกที่ช่องเพื่อเลือกการ์ดจากคอลเลกชันของคุณ</div>
                </div>
            </div>
        </div>

        <!-- Customization Selectors -->
        <div style="display: flex; flex-direction: column; gap: 20px;">
            ${renderCosmeticSection('👤 เลือกรูปโปรไฟล์', 'avatars')}
            ${renderCosmeticSection('🖼️ เลือกแบนเนอร์', 'banners')}
            ${renderCosmeticSection('✨ เลือกกรอบรูป', 'frames')}
        </div>
    </div>`;
}

function renderFavoriteSlot(index) {
    const cardKey = playerData.favoriteCards[index];
    if (!cardKey) {
        return `<div class="fav-card-slot" onclick="openFavSelector(${index})"><span style="font-size: 1.5rem; color: #4b5563;">+</span></div>`;
    }
    const [name, theme] = cardKey.split('|');
    const cardData = CardSets[theme]?.[name];
    return `
        <div class="fav-card-slot" style="border-style: solid; border-color: #fbbf24; overflow: hidden; position: relative;" onclick="openFavSelector(${index})">
            <img src="${cardData?.art || ''}" style="width: 100%; height: 100%; object-fit: cover;">
            <div style="position: absolute; bottom: 0; left: 0; right: 0; background: rgba(0,0,0,0.7); font-size: 0.5rem; color: white; padding: 2px; text-align: center;">${name}</div>
        </div>`;
}

function renderCosmeticSection(title, type) {
    let items = COSMETICS_CATALOG[type];
    let html = `<div style="background: #1f2937; border-radius: 16px; padding: 15px;">
        <div style="color: white; font-weight: bold; margin-bottom: 12px; font-size: 0.9rem;">${title}</div>
        <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(80px, 1fr)); gap: 10px;">`;
    
    items.forEach(item => {
        const isEq = (type === 'avatars' && playerData.equippedAvatar === item.id) ||
                     (type === 'banners' && playerData.equippedBanner === item.id) ||
                     (type === 'frames' && playerData.equippedFrame === item.id);
        
        html += `
        <div class="cosmetic-box ${isEq ? 'active' : ''}" onclick="setCosmetic('${type}', '${item.id}')">
            <div style="width: 100%; aspect-ratio: 1; background: #111827; border-radius: 8px; overflow: hidden; display: flex; align-items: center; justify-content: center; margin-bottom: 5px;">
                ${type === 'avatars' ? `<img src="${item.art}" style="width: 100%; height: 100%; object-fit: cover;">` : ''}
                ${type === 'banners' ? `<img src="${item.art}" style="width: 100%; height: 60%; object-fit: cover;">` : ''}
                ${type === 'frames' ? `<div style="width: 35px; height: 35px; border-radius: 50%; border: 3px solid ${item.color};"></div>` : ''}
            </div>
            <div style="font-size: 0.55rem; color: ${isEq ? '#4ade80' : '#9ca3af'}; font-weight: bold;">${item.label}</div>
        </div>`;
    });

    html += `</div></div>`;
    return html;
}

// --- LOGIC FUNCTIONS ---

function setCosmetic(type, id) {
    if (type === 'avatars') playerData.equippedAvatar = id;
    if (type === 'banners') playerData.equippedBanner = id;
    if (type === 'frames') playerData.equippedFrame = id;
    saveData();
    renderProfilePanel();
    if (typeof updateHubUI === 'function') updateHubUI();
}

function openFavSelector(index) {
    const allOwned = Object.keys(playerData.collection).filter(k => playerData.collection[k] > 0);
    
    const overlay = document.createElement('div');
    overlay.id = 'fav-selector-overlay';
    overlay.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,0.9);z-index:100000;display:flex;align-items:center;justify-content:center;padding:20px;';
    
    let cardGrid = allOwned.map(key => {
        const [name, theme] = key.split('|');
        const art = CardSets[theme]?.[name]?.art || '';
        return `<div onclick="pickFavorite(${index}, '${key}')" style="width: 70px; height: 100px; border-radius: 8px; overflow: hidden; border: 1px solid #374151; cursor: pointer;">
            <img src="${art}" style="width: 100%; height: 100%; object-fit: cover;">
        </div>`;
    }).join('');

    overlay.innerHTML = `
        <div style="background: #1f2937; border-radius: 24px; padding: 25px; width: 100%; max-width: 450px; max-height: 80vh; overflow-y: auto;">
            <h3 style="color: white; margin-bottom: 15px;">เลือกการ์ดโปรดใบที่ ${index + 1}</h3>
            <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(70px, 1fr)); gap: 10px;">
                <div onclick="pickFavorite(${index}, null)" style="width: 70px; height: 100px; border: 2px dashed #f87171; border-radius: 8px; color: #f87171; display: flex; align-items: center; justify-content: center; font-size: 0.7rem; cursor: pointer;">ยกเลิก</div>
                ${cardGrid}
            </div>
            <button onclick="document.getElementById('fav-selector-overlay').remove()" style="width: 100%; margin-top: 20px; padding: 10px; background: #374151; color: white; border: none; border-radius: 12px; cursor: pointer;">ปิด</button>
        </div>`;
    document.body.appendChild(overlay);
}

function pickFavorite(index, key) {
    if (!key) {
        playerData.favoriteCards.splice(index, 1);
    } else {
        // Prevent duplicate favorites
        if (playerData.favoriteCards.includes(key)) {
            showToast('🚫 การ์ดนี้ถูกเลือกไปแล้ว!', '#f87171');
            return;
        }
        playerData.favoriteCards[index] = key;
    }
    saveData();
    document.getElementById('fav-selector-overlay').remove();
    renderProfilePanel();
}