// ============================================================
// 19_hxh_system.js — Hunter × Hunter Limited Pack
// LIMITED TIME (5 days — หมดเขต 26 เมษายน 2026)
//
// วางใน index.html ต่อจาก 18_theme_shop.js ก่อน </body>
// ============================================================

// ─── EXPIRY (26 เม.ย. 2026 เที่ยงคืน เวลาไทย) ─────────────────
const HXH_PACK_EXPIRY = new Date('2026-04-26T23:59:59+07:00');
function _isHxHPackAvailable() { return new Date() < HXH_PACK_EXPIRY; }

// ─── COSTS & LIMITS ──────────────────────────────────────────
const HXH_SINGLE_COST  = 1500;  // 🪙 Coins per single pull
const HXH_BUNDLE_COST  = 199;   // 💎 Gems for bundle
const HXH_MAX_PULLS    = 10;    // max single pulls per account

// ─── ART URLs ────────────────────────────────────────────────
const _HXH_ARTS = {
    Hisoka:   'https://preview.redd.it/how-to-build-hisoka-morrow-in-only-6-levels-v0-ut3inqd54hz51.png?width=1280&format=png&auto=webp&s=f9baabebe5d8464a27dacc1ca76559c71335a455',
    Gon:      'https://mir-s3-cdn-cf.behance.net/projects/404/fa05e682971181.Y3JvcCwzMTcxLDI0ODEsMTY0LDA.jpg',
    Kurapika: 'https://wallpapers-clan.com/wp-content/uploads/2024/04/hunter-x-hunter-kurapika-epic-desktop-wallpaper-preview.jpg',
    Welfin:   'https://static.wikia.nocookie.net/vsbattles/images/4/4c/Welfin2011.png/revision/latest?cb=20200210202603',
    Chrollo:  'https://file.garden/aeeLCXSsJxTPrRbp/f7f6056e4c0887fa76f4a79bbaa7284a.jpg',
    Pitou:    'https://file.garden/aeeLCXSsJxTPrRbp/e6255777256d168deeba943924adb612.jpg',
    Meruem:   'https://file.garden/aeeLCXSsJxTPrRbp/07dab7b254c39316c45ac44b2e801c93.jpg',
    Netero:   'https://file.garden/aeeLCXSsJxTPrRbp/d52da81be7871a74418f329d839dbc5d.jpg',
    Killua:   'https://file.garden/aeeLCXSsJxTPrRbp/85e6e8ec8b33c609f081728d6e352960.jpg',
    Leorio:   'https://file.garden/aeeLCXSsJxTPrRbp/9aa3c3f2b8bc6e8b73cba1347b68c080.jpg',
    ChimeraAnt:      'https://file.garden/aeeLCXSsJxTPrRbp/file_00000000a35471fa88486cf84e71c2f2.png',
    DarkContMonster: 'https://file.garden/aeeLCXSsJxTPrRbp/file_00000000b5447208805daceadd5040b3.png',
    HunterLicense:   'https://copilot.microsoft.com/th/id/BCO.70b08335-d73f-4c40-902c-8f48d560ab39.png',
    FishingRodItem:  'https://file.garden/aeeLCXSsJxTPrRbp/file_00000000ec2c71fa80282bcfc12801ed.png',
    Yoyo:            'https://file.garden/aeeLCXSsJxTPrRbp/file_0000000069bc71f88099ad9cb8da63a1.png',
};

// ─── CARD TEMPLATES ──────────────────────────────────────────
const _HXH_CARDS_TPL = {
    'Hisoka': {
        name:'Hisoka', type:'Character', cost:8, atk:3, hp:5, maxHp:5,
        text:'Ongoing: ถ้ามี "Gon" ในมือ → Gon Cost = 2 | On Hit: ดาเมจ > 3 → ดาเมจ × 0.5',
        color:'bg-pink-600', maxAttacks:1, art:_HXH_ARTS.Hisoka, _theme:'hxh'
    },
    'Gon': {
        name:'Gon', type:'Character', cost:8, atk:5, hp:7, maxHp:7,
        text:'Passive: ฆ่า → ATK += Cost เป้า (ถาวร) | On Death: จั่ว 2 ใบ',
        color:'bg-emerald-600', maxAttacks:1, art:_HXH_ARTS.Gon, _theme:'hxh'
    },
    'Kurapika': {
        name:'Kurapika', type:'Character', cost:7, atk:4, hp:6, maxHp:6,
        text:'On Summon: ศัตรู HP สูงสุด → Paralyze 2T | On Death: Paralyze ศัตรู 2 ตัวสุ่ม (2T)',
        color:'bg-red-700', maxAttacks:1, art:_HXH_ARTS.Kurapika, _theme:'hxh'
    },
    'Welfin': {
        name:'Welfin', type:'Character', cost:5, atk:5, hp:4, maxHp:4,
        text:'On Summon: ดาเมจ 3 ศัตรูสุ่ม | End of Turn: ดาเมจ 2 ศัตรูสุ่ม',
        color:'bg-amber-700', maxAttacks:1, art:_HXH_ARTS.Welfin, _theme:'hxh'
    },
    'Chrollo': {
        name:'Chrollo', type:'Character', cost:9, atk:4, hp:7, maxHp:7,
        text:'On Summon: Base ศัตรู -2, Base เรา +2 | ฆ่า: ศัตรู Discard 1 สุ่ม | On Death: ดึง Item สุ่ม 2 ใบจากเด็ค',
        color:'bg-purple-900', maxAttacks:1, art:_HXH_ARTS.Chrollo, _theme:'hxh'
    },
    'Pitou': {
        name:'Pitou', type:'Character', cost:9, atk:8, hp:5, maxHp:5,
        text:'On Summon: คัดลอก Character Cost ≤5 จากเด็คเรา | On Kill: Cost ≤6 → Summon สำเนา',
        color:'bg-pink-700', maxAttacks:1, art:_HXH_ARTS.Pitou, _theme:'hxh'
    },
    'Meruem': {
        name:'Meruem', type:'Champion', cost:10, atk:5, hp:5, maxHp:5,
        text:'♛ Champion | On Summon: ขโมย HP+ATK จากศัตรู Cost สูงสุด 3 ตัว (ไม่ซ้ำกัน)',
        color:'bg-yellow-950', maxAttacks:1, art:_HXH_ARTS.Meruem,
        isChampion:true, _theme:'hxh'
    },
    'Netero': {
        name:'Netero', type:'Character', cost:10, atk:5, hp:8, maxHp:8,
        text:'โจมตีได้ 2 ครั้งต่อเทิร์น | On Death: Base ศัตรู -3 + ผู้ฆ่าติด Poison จนตาย',
        color:'bg-orange-900', maxAttacks:2, art:_HXH_ARTS.Netero, _theme:'hxh'
    },
    'Killua': {
        name:'Killua', type:'Character', cost:7, atk:4, hp:4, maxHp:4,
        text:'โจมตี Paralyzed → ดาเมจ ×2 | โดนโจมตี: 50% หลบ + ตีกลับ 4 ถ้าหลบสำเร็จ',
        color:'bg-sky-300', maxAttacks:1, art:_HXH_ARTS.Killua, _theme:'hxh'
    },
    'Leorio': {
        name:'Leorio', type:'Character', cost:4, atk:4, hp:4, maxHp:4,
        text:'สามารถโจมตี Untargetable ได้ (ยกเว้น Immortal)',
        color:'bg-teal-700', maxAttacks:1, art:_HXH_ARTS.Leorio, _theme:'hxh'
    },
    'Godspeed Killua': {
        name:'Godspeed Killua', type:'Character', cost:8, atk:6, hp:6, maxHp:6,
        text:'โจมตีเป้า Paralyzed → ดาเมจ ×2 | เมื่อถูกโจมตี: สวนกลับ 6 ดาเมจ และทำให้ผู้โจมตีติด Paralyze 2 เทิร์น',
        color:'bg-sky-500', maxAttacks:1, 
        art:'https://file.garden/aeeLCXSsJxTPrRbp/54c661831c367b7b3bd1aa75f9c235de.jpg', 
        _theme:'hxh', rarity:'Legendary'
    },
};

const HXH_PULL_POOL   = ["Gon","Kurapika","Welfin","Chrollo","Pitou","Meruem","Netero","Killua","Leorio"];
const HXH_BUNDLE_POOL = ["Gon","Kurapika","Welfin","Chrollo","Pitou","Meruem","Netero","Killua","Leorio"];

// ─── ROD SHOP CARD TEMPLATES (PERMANENT — ไม่มีวันหมดอายุ) ──
const _ROD_CARDS_TPL = {
    'Chimera Ant': {
        name:'Chimera Ant', type:'Character', cost:3, atk:3, hp:3, maxHp:3,
        text:'Ongoing: +2 ATK ต่อ "Chimera Ant" ในสนาม',
        color:'bg-lime-800', maxAttacks:1, art:_HXH_ARTS.ChimeraAnt, _theme:'hxh', _rodCard:true
    },
    'Dark Continent Monster': {
        name:'Dark Continent Monster', type:'Character', cost:10, atk:10, hp:10, maxHp:10,
        text:'ไม่มี effect พิเศษ — Stats สูงที่สุด',
        color:'bg-slate-800', maxAttacks:1, art:_HXH_ARTS.DarkContMonster, _theme:'hxh', _rodCard:true
    },
    'Hunter License': {
        name:'Hunter License', type:'Item', cost:4, atk:2, hp:0, maxHp:0,
        text:'+2 ATK | On Kill: จั่ว 1 ใบ + ATK +2 ถาวร',
        color:'bg-yellow-700', art:_HXH_ARTS.HunterLicense, _theme:'hxh', _rodCard:true
    },
    'Fishing Rod': {
        name:'Fishing Rod', type:'Item', cost:5, atk:4, hp:0, maxHp:0,
        text:'+4 ATK | On Equip: 50% Summon unit Cost≤3 | Gon: +5ATK +5HP + 100%',
        color:'bg-cyan-800', art:_HXH_ARTS.FishingRodItem, _theme:'hxh', _rodCard:true
    },
    'Bungee Gum': {
        name:'Bungee Gum', type:'Action', cost:5, atk:0, hp:0, maxHp:0,
        text:'ป้องกัน Base ของเรา 1 เทิร์นศัตรู — ศัตรูโจมตี Base ไม่ได้',
        color:'bg-pink-900', art:null, _theme:'hxh', _rodCard:true, _untradeable:true
    },
    'Yoyo': {
        name:'Yoyo', type:'Item', cost:7, atk:0, hp:0, maxHp:0,
        text:'ถ้าติด Killua: โจมตีได้ 2 ครั้ง + ทุกครั้งที่โจมตี → Paralyze 1T',
        color:'bg-sky-700', art:_HXH_ARTS.Yoyo, _theme:'hxh', _rodCard:true, _dropOnly:true
    },
};

const ROD_SHOP_ITEMS = [
    { key:'Chimera Ant',           cost:10, maxOwn:3, category:'Character' },
    { key:'Dark Continent Monster',cost:15, maxOwn:3, category:'Character' },
    { key:'Hunter License',        cost:5,  maxOwn:3, category:'Item'      },
    { key:'Fishing Rod',           cost:5,  maxOwn:3, category:'Item'      },
    { key:'Bungee Gum',            cost:15, maxOwn:1, category:'Action', untradeable:true },
];

// ─── WIN REWARD (AI mode only — PERMANENT, ไม่หมดอายุ) ────────
function _grantHxHWinReward() {
    if (typeof playerData === 'undefined') return;
    playerData.rodTokens = (playerData.rodTokens || 0) + 1;
    let msg = '+1 🎣 Rod Token';
    if (Math.random() < 0.03) {
        const key = 'Yoyo|hxh';
        playerData.collection[key] = (playerData.collection[key] || 0) + 1;
        msg += ' + 🪀 Yoyo Drop!';
        if (typeof showToast === 'function') showToast('🪀 Yoyo Dropped! ได้การ์ดหายาก!', '#38bdf8');
    }
    if (typeof saveData === 'function') saveData();
    if (typeof showToast === 'function') setTimeout(() => showToast(msg, '#fcd34d'), 400);
    if (typeof checkTitleUnlocks === 'function') checkTitleUnlocks();
}

// ─── ROD SHOP: BUY ────────────────────────────────────────────
function buyRodShopItem(key) {
    const cfg = ROD_SHOP_ITEMS.find(x => x.key === key);
    const tpl = _ROD_CARDS_TPL[key];
    if (!cfg || !tpl) return;
    const owned = playerData.collection[`${key}|hxh`] || 0;
    if (owned >= cfg.maxOwn) { showToast(`🔒 มีครบ ${cfg.maxOwn} ใบแล้ว!`, '#f87171'); return; }
    if ((playerData.rodTokens || 0) < cfg.cost) {
        showToast(`🎣 Rod Token ไม่พอ! ต้องการ ${cfg.cost}`, '#f87171'); return;
    }
    playerData.rodTokens     = (playerData.rodTokens     || 0) - cfg.cost;
    playerData.rodTokensSpent= (playerData.rodTokensSpent|| 0) + cfg.cost;
    playerData.collection[`${key}|hxh`] = owned + 1;
    saveData(); updateHubUI(); checkTitleUnlocks();
    showToast(`✅ ได้รับ "${key}"! (เหลือ ${playerData.rodTokens} 🎣)`, '#4ade80');
    // re-render shop
    document.getElementById('_rod-shop-overlay')?.remove();
    renderRodShop();
}

// ─── ROD SHOP: RENDER (PERMANENT UI) ─────────────────────────
function renderRodShop() {
    const rod = playerData.rodTokens || 0;
    const rows = ROD_SHOP_ITEMS.map(cfg => {
        const tpl   = _ROD_CARDS_TPL[cfg.key];
        const owned = playerData.collection[`${cfg.key}|hxh`] || 0;
        const canBuy= rod >= cfg.cost && owned < cfg.maxOwn;
        const catClr= cfg.category==='Character' ? '#86efac'
                    : cfg.category==='Item'       ? '#fcd34d' : '#f9a8d4';
        return `<div style="background:#0f172a;border:1.5px solid ${canBuy?'#fcd34d':'#374151'};
             border-radius:14px;padding:12px;display:flex;align-items:center;gap:10px">
          ${tpl.art
            ? `<img src="${tpl.art}" style="width:56px;height:68px;object-fit:cover;border-radius:8px;border:1px solid #374151" onerror="this.style.background='#1f2937'">`
            : `<div style="width:56px;height:68px;background:#1f2937;border-radius:8px;display:flex;align-items:center;justify-content:center;font-size:1.6rem">🩹</div>`}
          <div style="flex:1;min-width:0">
            <div style="font-size:0.58rem;font-weight:900;color:${catClr};letter-spacing:0.5px;text-transform:uppercase">${cfg.category}${cfg.untradeable?' · 🔒 Untradeable':''}</div>
            <div style="font-weight:900;color:white;font-size:0.88rem">${cfg.key}</div>
            <div style="font-size:0.6rem;color:#9ca3af;margin-top:1px">${tpl.text}</div>
            <div style="font-size:0.6rem;color:#6b7280;margin-top:2px">
              Cost ${tpl.cost}${tpl.atk?` · ATK ${tpl.atk}`:''}${tpl.hp?` · HP ${tpl.hp}`:''} &nbsp;|&nbsp; มี ${owned}/${cfg.maxOwn}
            </div>
          </div>
          <button onclick="buyRodShopItem('${cfg.key}')" ${canBuy?'':'disabled'}
            style="background:${canBuy?'linear-gradient(135deg,#d97706,#92400e)':'#374151'};
                   color:${canBuy?'white':'#6b7280'};border:none;padding:9px 13px;
                   border-radius:10px;font-weight:900;font-size:0.8rem;
                   cursor:${canBuy?'pointer':'not-allowed'};white-space:nowrap;min-width:64px;text-align:center">
            ${owned>=cfg.maxOwn ? '✅ เต็ม' : `🎣 ${cfg.cost}`}
          </button>
        </div>`;
    }).join('');

    const ov = document.createElement('div');
    ov.id = '_rod-shop-overlay';
    ov.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,0.9);z-index:3000;display:flex;align-items:center;justify-content:center;padding:12px;overflow-y:auto';
    ov.onclick = e => { if (e.target===ov) ov.remove(); };
    ov.innerHTML = `
    <div style="background:linear-gradient(135deg,#0a0f1e,#1a0a2e);border:2.5px solid #fcd34d;
         border-radius:24px;padding:24px 18px;max-width:440px;width:100%;
         max-height:90vh;overflow-y:auto;box-shadow:0 0 60px rgba(252,211,77,0.25)">
      <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:14px">
        <div>
          <div style="font-size:1.25rem;font-weight:900;color:#fcd34d">🎣 Fishing Rod Shop</div>
          <div style="font-size:0.65rem;color:#9ca3af">ใช้ Rod Token แลกการ์ด HxH พิเศษ — ไม่มีวันหมดอายุ</div>
        </div>
        <div style="background:#1f2937;border:1px solid #fcd34d;border-radius:12px;padding:8px 14px;text-align:center">
          <div style="font-size:0.58rem;color:#9ca3af">Rod Token</div>
          <div style="font-size:1.15rem;font-weight:900;color:#fcd34d">${rod} 🎣</div>
        </div>
      </div>
      <div style="background:rgba(252,211,77,0.07);border:1px solid #92400e55;border-radius:8px;
           padding:7px 10px;font-size:0.62rem;color:#d97706;text-align:center;margin-bottom:14px">
        🏆 ชนะ AI = +1 🎣 &nbsp;|&nbsp; 3% โอกาสได้ 🪀 Yoyo &nbsp;|&nbsp; ใช้ 60 🎣 รวม → 👑 Haunted Hunter
      </div>
      <div style="display:flex;flex-direction:column;gap:8px">${rows}</div>
      <button onclick="document.getElementById('_rod-shop-overlay').remove()"
        style="width:100%;margin-top:16px;background:#374151;color:#9ca3af;border:none;
               padding:11px;border-radius:12px;font-weight:700;font-size:0.9rem;cursor:pointer">✕ ปิด</button>
    </div>`;
    document.getElementById('_rod-shop-overlay')?.remove();
    document.body.appendChild(ov);
}

// ─── COUNTDOWN ───────────────────────────────────────────────
function _hxhCountdown() {
    const diff = HXH_PACK_EXPIRY - new Date();
    if (diff <= 0) return '⏰ หมดเขตแล้ว';
    const d = Math.floor(diff / 86400000);
    const h = Math.floor((diff % 86400000) / 3600000);
    const m = Math.floor((diff % 3600000) / 60000);
    if (d > 0) return `⏳ เหลือ ${d} วัน ${h} ชม.`;
    return `⏳ เหลือ ${h} ชม. ${m} นาที`;
}

// ─── BUY SINGLE PULL ─────────────────────────────────────────
function buyHxHPack() {
    if (!_isHxHPackAvailable()) { showToast('⏰ HxH Pack หมดเขตแล้ว!', '#f87171'); return; }
    if (playerData.coins < HXH_SINGLE_COST) {
        showToast(`🪙 เหรียญไม่พอ! ต้องการ ${HXH_SINGLE_COST.toLocaleString()}`, '#f87171'); return;
    }
    const pulled = playerData.hxhPacksBought || 0;
    if (pulled >= HXH_MAX_PULLS) { showToast(`🔒 ซื้อครบ ${HXH_MAX_PULLS} ครั้งแล้ว!`, '#f87171'); return; }

    playerData.coins -= HXH_SINGLE_COST;
    playerData.hxhPacksBought = pulled + 1;

    // Equal random distribution
    const cardName = HXH_PULL_POOL[Math.floor(Math.random() * HXH_PULL_POOL.length)];
    const key = `${cardName}|hxh`;
    playerData.collection[key] = (playerData.collection[key] || 0) + 1;

    saveData();
    updateHubUI();
    _showHxHSingleReveal(cardName);
    setTimeout(() => { checkCollectionMilestones(); checkTitleUnlocks(); }, 2000);
}

// ─── BUY BUNDLE ──────────────────────────────────────────────
function buyHxHBundle() {
    if (!_isHxHPackAvailable()) { showToast('⏰ HxH Pack หมดเขตแล้ว!', '#f87171'); return; }
    if ((playerData.gems || 0) < HXH_BUNDLE_COST) {
        showToast(`💎 Gem ไม่พอ! ต้องการ ${HXH_BUNDLE_COST}`, '#f87171'); return;
    }
    if (playerData.hxhBundleBought) { showToast('📦 ซื้อ Bundle ไปแล้ว!', '#f87171'); return; }

    playerData.gems -= HXH_BUNDLE_COST;
    playerData.hxhBundleBought = true;
    playerData.fishingRod = (playerData.fishingRod || 0) + 30;
    playerData.coins += 1000;

    HXH_BUNDLE_POOL.forEach(n => {
        const k = `${n}|hxh`;
        playerData.collection[k] = (playerData.collection[k] || 0) + 1;
    });

    saveData();
    updateHubUI();
    _showHxHBundleReveal();
    setTimeout(() => { checkCollectionMilestones(); checkTitleUnlocks(); }, 2500);
}

// ─── REVEAL: SINGLE ──────────────────────────────────────────
function _showHxHSingleReveal(cardName) {
    const tpl = _HXH_CARDS_TPL[cardName];
    if (!tpl) return;
    const pulled = playerData.hxhPacksBought || 0;
    const ov = document.createElement('div');
    ov.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,0.96);z-index:9900;display:flex;align-items:center;justify-content:center';
    ov.innerHTML = `
<div style="background:linear-gradient(135deg,#0d0b2e,#1a0733,#0f0c29);
     border:3px solid #a855f7;border-radius:28px;padding:32px 22px;
     max-width:360px;width:92%;text-align:center;
     box-shadow:0 0 80px rgba(168,85,247,0.55)">
  <div style="font-size:2.8rem;margin-bottom:4px">🕷️</div>
  <div style="font-size:1.2rem;font-weight:900;color:#d8b4fe;margin-bottom:2px">Hunter × Hunter Pack</div>
  <div style="font-size:0.68rem;color:#6b7280;margin-bottom:18px">ดึง ${pulled}/${HXH_MAX_PULLS} ครั้ง</div>
  <div style="width:150px;margin:0 auto 18px;border-radius:16px;overflow:hidden;
       border:3px solid #a855f7;box-shadow:0 0 30px rgba(168,85,247,0.6)">
    <img src="${tpl.art}" style="width:100%;height:190px;object-fit:cover"
         onerror="this.style.background='#1f2937'">
    <div style="background:rgba(0,0,0,0.88);padding:8px 6px">
      <div style="font-size:0.62rem;font-weight:900;color:#d8b4fe;margin-bottom:2px">Hunter × Hunter</div>
      <div style="font-size:0.9rem;font-weight:900;color:white">${cardName}</div>
      <div style="font-size:0.55rem;color:#9ca3af">Cost ${tpl.cost} · ATK ${tpl.atk} / HP ${tpl.hp}</div>
    </div>
  </div>
  <div style="background:rgba(168,85,247,0.12);border:1px solid #7c3aed;
       border-radius:10px;padding:8px 12px;margin-bottom:18px;font-size:0.66rem;color:#c4b5fd;text-align:left">
    ${tpl.text}
  </div>
  <button onclick="this.closest('div[style*=fixed]').remove();renderPacksPanel()"
    style="background:linear-gradient(135deg,#7c3aed,#a855f7);color:white;border:none;
           padding:13px 38px;border-radius:16px;font-weight:900;font-size:1.05rem;cursor:pointer;
           box-shadow:0 0 22px rgba(168,85,247,0.5)">🕷️ ยอดเยี่ยม!</button>
</div>`;
    document.body.appendChild(ov);
}

// ─── REVEAL: BUNDLE ──────────────────────────────────────────
function _showHxHBundleReveal() {
    const ov = document.createElement('div');
    ov.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,0.96);z-index:9900;display:flex;align-items:center;justify-content:center;overflow-y:auto;padding:16px;box-sizing:border-box';
    ov.innerHTML = `
<div style="background:linear-gradient(135deg,#0d0b2e,#1a0733,#0f0c29);
     border:3px solid #f59e0b;border-radius:28px;padding:28px 20px;
     max-width:520px;width:100%;text-align:center;
     box-shadow:0 0 80px rgba(245,158,11,0.5);max-height:92vh;overflow-y:auto">
  <div style="font-size:2.8rem;margin-bottom:4px">📦</div>
  <div style="font-size:1.35rem;font-weight:900;color:#fbbf24;margin-bottom:2px">HxH Bundle!</div>
  <div style="font-size:0.68rem;color:#6b7280;margin-bottom:18px">การ์ดทั้ง 9 ถูกเพิ่มใน Collection แล้ว</div>

  <!-- Card Grid -->
  <div style="display:flex;flex-wrap:wrap;gap:7px;justify-content:center;margin-bottom:16px">
    ${HXH_BUNDLE_POOL.map(n => {
        const t = _HXH_CARDS_TPL[n];
        const border = n === 'Meruem' ? '#f59e0b' : '#a855f7';
        const label  = n === 'Meruem' ? '♛ Champion' : '★ HxH';
        return `<div style="width:80px;border-radius:10px;overflow:hidden;border:2px solid ${border};
             box-shadow:0 0 12px ${border}55;background:#0f0c29;flex-shrink:0">
          <img src="${t.art}" style="width:100%;height:58px;object-fit:cover"
               onerror="this.style.background='#1f2937'">
          <div style="padding:3px 2px;background:rgba(0,0,0,0.75)">
            <div style="font-size:0.48rem;font-weight:900;color:${border};text-align:center">${label}</div>
            <div style="font-size:0.6rem;font-weight:800;color:white;text-align:center;
                 white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${n}</div>
            <div style="font-size:0.45rem;color:#6b7280;text-align:center">C${t.cost} · ${t.atk}/${t.hp}</div>
          </div>
        </div>`;
    }).join('')}
  </div>

  <!-- Bonus row -->
  <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:8px;margin-bottom:18px">
    <div style="background:rgba(251,191,36,0.1);border:1px solid #92400e;border-radius:10px;padding:10px 6px">
      <div style="font-size:1.4rem">🎣</div>
      <div style="font-size:0.85rem;font-weight:900;color:#fbbf24">+30 Rod</div>
      <div style="font-size:0.52rem;color:#9ca3af">Fishing Rod Token</div>
    </div>
    <div style="background:rgba(251,191,36,0.1);border:1px solid #92400e;border-radius:10px;padding:10px 6px">
      <div style="font-size:1.4rem">🪙</div>
      <div style="font-size:0.85rem;font-weight:900;color:#fbbf24">+1,000</div>
      <div style="font-size:0.52rem;color:#9ca3af">Gold Coins</div>
    </div>
    <div style="background:rgba(168,85,247,0.1);border:1px solid #7c3aed;border-radius:10px;padding:10px 6px">
      <div style="font-size:1.4rem">♛</div>
      <div style="font-size:0.85rem;font-weight:900;color:#d8b4fe">Meruem</div>
      <div style="font-size:0.52rem;color:#9ca3af">Champion Card!</div>
    </div>
  </div>

  <button onclick="this.closest('div[style*=fixed]').remove();renderPacksPanel()"
    style="background:linear-gradient(135deg,#d97706,#b45309);color:white;border:none;
           padding:13px 40px;border-radius:16px;font-weight:900;font-size:1.05rem;cursor:pointer;
           box-shadow:0 0 22px rgba(245,158,11,0.5)">🕷️ ยอดเยี่ยม!</button>
</div>`;
    document.body.appendChild(ov);
}

// ─── APPEND HxH SECTION IN PACKS PANEL ──────────────────────
function _appendHxHSection() {
    const panel = document.getElementById('hub-panel-packs');
    if (!panel) return;
    const old = document.getElementById('_hxh-pack-sec');
    if (old) old.remove();

    const available   = _isHxHPackAvailable();
    const countdown   = _hxhCountdown();
    const coins       = playerData.coins || 0;
    const gems        = playerData.gems  || 0;
    const rod         = playerData.fishingRod || 0;
    const pulled      = playerData.hxhPacksBought  || 0;
    const bundleBought= playerData.hxhBundleBought || false;
    const canSingle   = available && coins >= HXH_SINGLE_COST && pulled < HXH_MAX_PULLS;
    const canBundle   = available && gems  >= HXH_BUNDLE_COST && !bundleBought;

    const sec = document.createElement('div');
    sec.id = '_hxh-pack-sec';
    sec.style.cssText = 'padding:0 0 24px';
    sec.innerHTML = `
<!-- ─ HxH Divider ─ -->
<div style="display:flex;align-items:center;gap:10px;margin:16px 0 14px">
  <div style="flex:1;height:1px;background:linear-gradient(90deg,transparent,#a855f7)"></div>
  <div style="font-size:0.75rem;font-weight:900;color:#a855f7;letter-spacing:1px">🕷️ HxH LIMITED PACK</div>
  <div style="flex:1;height:1px;background:linear-gradient(90deg,#a855f7,transparent)"></div>
</div>

<!-- Balances -->
<div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:8px;margin-bottom:14px">
  <div style="background:#111827;border:1px solid #374151;border-radius:12px;padding:10px 8px;display:flex;align-items:center;gap:8px">
    <span style="font-size:1.1rem">🪙</span>
    <div><div style="font-size:0.6rem;color:#6b7280">Coins</div>
      <div style="font-size:0.92rem;font-weight:900;color:#fbbf24">${coins.toLocaleString()}</div></div>
  </div>
  <div style="background:#111827;border:1px solid #374151;border-radius:12px;padding:10px 8px;display:flex;align-items:center;gap:8px">
    <span style="font-size:1.1rem">💎</span>
    <div><div style="font-size:0.6rem;color:#6b7280">Gems</div>
      <div style="font-size:0.92rem;font-weight:900;color:#93c5fd">${gems}</div></div>
  </div>
  <div style="background:#1a0a1e;border:1px solid #92400e55;border-radius:12px;padding:10px 8px;display:flex;align-items:center;gap:8px">
    <span style="font-size:1.1rem">🎣</span>
    <div><div style="font-size:0.6rem;color:#6b7280">Rod Token</div>
      <div style="font-size:0.92rem;font-weight:900;color:#fcd34d">${rod}</div></div>
  </div>
</div>

<!-- Main Pack Card -->
<div style="background:linear-gradient(135deg,#0d0b2e,#1a0a2e);
     border:2.5px solid ${available ? '#a855f7' : '#374151'};border-radius:20px;overflow:hidden;
     box-shadow:0 0 ${available ? '36px rgba(168,85,247,0.22)' : 'none'};margin-bottom:12px">

  <!-- Header art strip -->
  <div style="position:relative;height:130px;overflow:hidden">
    <img src="${_HXH_ARTS.Gon}"
         style="width:100%;height:100%;object-fit:cover;filter:brightness(${available ? '0.5' : '0.22'})"
         onerror="this.style.display='none'">
    <div style="position:absolute;inset:0;background:linear-gradient(to bottom,transparent 20%,#0d0b2e)"></div>
    <div style="position:absolute;top:10px;left:12px;
         background:${available ? 'rgba(220,38,38,0.88)' : 'rgba(55,65,81,0.9)'};
         border:1.5px solid ${available ? '#fca5a5' : '#4b5563'};
         border-radius:20px;padding:3px 10px;font-size:0.64rem;font-weight:900;
         color:${available ? '#fca5a5' : '#9ca3af'}">
      ${available ? '⏱️ LIMITED · 5 วัน เท่านั้น' : '🔒 หมดเขตแล้ว'}</div>
    <div style="position:absolute;top:10px;right:12px;
         background:rgba(0,0,0,0.75);border:1.5px solid #a855f7;
         border-radius:20px;padding:3px 10px;font-size:0.64rem;font-weight:900;color:#d8b4fe">
      ${pulled}/${HXH_MAX_PULLS} ครั้ง</div>
    <div style="position:absolute;bottom:10px;left:14px">
      <div style="font-size:1.05rem;font-weight:900;color:white;text-shadow:0 2px 8px rgba(0,0,0,0.9)">
        🕷️ Hunter × Hunter Limited Pack</div>
      <div style="font-size:0.66rem;color:${available ? '#c4b5fd' : '#6b7280'}">${countdown}</div>
    </div>
  </div>

  <div style="padding:14px">
    <!-- Card preview grid (8 pull cards) -->
    <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:6px;margin-bottom:10px">
      ${HXH_PULL_POOL.map(n => {
          const t = _HXH_CARDS_TPL[n];
          return `<div style="background:#0a0916;border:1px solid #a855f744;border-radius:8px;overflow:hidden">
            <img src="${t.art}" style="width:100%;height:44px;object-fit:cover"
                 onerror="this.style.background='#1f2937'">
            <div style="padding:2px 3px;text-align:center">
              <div style="font-size:0.5rem;font-weight:800;color:#d8b4fe;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${n}</div>
              <div style="font-size:0.42rem;color:#6b7280">C${t.cost} ${t.atk}/${t.hp}</div>
            </div>
          </div>`;
      }).join('')}
    </div>

    <!-- Equal rate note -->
    <div style="background:rgba(168,85,247,0.1);border:1px solid #4338ca;border-radius:10px;padding:6px 10px;margin-bottom:12px;font-size:0.63rem;color:#a5b4fc;text-align:center">
      🎲 ทุกใบ Equal Rate (~11.1%) · 🔒 Exclusive — ไม่มีในแพ็คทั่วไป
    </div>

    <!-- Single pull row -->
    <div style="display:flex;align-items:center;gap:12px">
      <div style="flex:1">
        <div style="font-size:1.05rem;font-weight:900;color:${available ? '#fbbf24' : '#6b7280'}">
          🪙 ${HXH_SINGLE_COST.toLocaleString()} / ดึง 1 ใบ</div>
        <div style="font-size:0.6rem;color:#6b7280">สูงสุด ${HXH_MAX_PULLS} ครั้ง · เหลือ ${Math.max(0, HXH_MAX_PULLS - pulled)} ครั้ง</div>
      </div>
      <button onclick="buyHxHPack()"
        ${canSingle ? '' : 'disabled'}
        style="background:${canSingle ? 'linear-gradient(135deg,#7c3aed,#a855f7)' : '#374151'};
               color:${canSingle ? 'white' : '#6b7280'};border:none;
               padding:11px 18px;border-radius:12px;font-weight:900;font-size:0.9rem;
               cursor:${canSingle ? 'pointer' : 'not-allowed'};white-space:nowrap;
               box-shadow:${canSingle ? '0 0 14px rgba(168,85,247,0.4)' : 'none'}">
        ${!available ? '🔒 หมดเขต' : pulled >= HXH_MAX_PULLS ? '✅ ครบแล้ว' : coins < HXH_SINGLE_COST ? '🪙 ไม่พอ' : '🕷️ ดึงเลย!'}
      </button>
    </div>
  </div>
</div>

<!-- Bundle -->
<div style="background:linear-gradient(135deg,#1a0900,#2d1200);
     border:2.5px solid ${canBundle ? '#f59e0b' : '#374151'};border-radius:16px;padding:14px;margin-bottom:10px;
     box-shadow:0 0 ${canBundle ? '24px rgba(245,158,11,0.2)' : 'none'}">
  <div style="display:flex;align-items:flex-start;gap:12px">
    <div style="font-size:2.4rem">📦</div>
    <div style="flex:1">
      <div style="font-weight:900;color:${bundleBought ? '#6b7280' : '#fbbf24'};font-size:0.98rem">
        HxH Bundle ★ Exclusive
        ${bundleBought ? '<span style="font-size:0.68rem;color:#4ade80;margin-left:4px">✅ ซื้อแล้ว</span>' : ''}
      </div>
      <div style="font-size:0.68rem;color:#d97706;margin-top:3px">
        การ์ดทุกใบ รวม ♛ Meruem + 🎣 30 Rod + 🪙 1,000 Gold</div>
      <div style="font-size:0.6rem;color:#9ca3af;margin-top:2px">ซื้อได้ครั้งเดียว เท่านั้น</div>
      <div style="font-size:1rem;font-weight:900;color:${canBundle ? '#93c5fd' : '#6b7280'};margin-top:5px">
        💎 ${HXH_BUNDLE_COST} Gems</div>
    </div>
    <button onclick="buyHxHBundle()"
      ${canBundle ? '' : 'disabled'}
      style="background:${canBundle ? 'linear-gradient(135deg,#d97706,#b45309)' : '#374151'};
             color:${canBundle ? 'white' : '#6b7280'};border:none;
             padding:11px 16px;border-radius:12px;font-weight:900;font-size:0.85rem;
             cursor:${canBundle ? 'pointer' : 'not-allowed'};white-space:nowrap;
             box-shadow:${canBundle ? '0 0 14px rgba(245,158,11,0.4)' : 'none'}">
      ${!available ? '🔒 หมดเขต' : bundleBought ? '✅ ซื้อแล้ว' : gems < HXH_BUNDLE_COST ? '💎 ไม่พอ' : '📦 ซื้อเลย'}
    </button>
  </div>
</div>

<!-- Rod info footer -->
<div style="background:rgba(251,191,36,0.06);border:1px solid #92400e55;
     border-radius:10px;padding:8px 12px;font-size:0.63rem;color:#d97706;text-align:center">
  🎣 <strong>Fishing Rod Token</strong> — ชนะ AI ได้ +1 Rod ต่อเกม (ถาวร ไม่หมดอายุ) มี ${rod} Rod
</div>
<button onclick="renderRodShop()"
  style="width:100%;margin-top:10px;background:linear-gradient(135deg,#92400e,#d97706);
         color:white;border:none;padding:13px;border-radius:14px;font-weight:900;
         font-size:0.95rem;cursor:pointer;box-shadow:0 0 18px rgba(217,119,6,0.3)">
  🎣 Fishing Rod Shop — แลกการ์ด HxH (${rod} Rod)
</button>`;

    // Append after the main pack content
    const inner = panel.querySelector('div[style*="max-width:700px"]')
               || panel.querySelector('[style*="max-width"]')
               || panel;
    inner.appendChild(sec);
}

// ─── ROD TOKEN DISPLAY + SHOP BUTTON ON HOME ────────────────
function _patchHxHRodDisplay() {
    const rod = playerData.rodTokens || 0;
    // Update count badge
    let el = document.getElementById('_hub-hxh-rod');
    if (el) { el.textContent = `🎣 ${rod}`; }
    else {
        const homePanel = document.getElementById('hub-panel-home');
        if (!homePanel) return;
        const gemsEl = homePanel.querySelector('[style*="93c5fd"]');
        if (!gemsEl) return;
        const div = document.createElement('div');
        div.id = '_hub-hxh-rod';
        div.style.cssText = 'font-size:0.85rem;font-weight:800;color:#fcd34d;cursor:pointer';
        div.title = 'เปิด Fishing Rod Shop';
        div.onclick = () => renderRodShop();
        div.textContent = `🎣 ${rod}`;
        gemsEl.parentNode?.insertBefore(div, gemsEl.nextSibling);
    }
    // Add/update Rod Shop banner on home if not exists
    const homePanel = document.getElementById('hub-panel-home');
    if (!homePanel) return;
    let shopBanner = document.getElementById('_rod-shop-banner');
    if (!shopBanner) {
        shopBanner = document.createElement('div');
        shopBanner.id = '_rod-shop-banner';
        shopBanner.style.cssText = 'padding:0 16px;max-width:640px;margin:-8px auto 0;';
        shopBanner.innerHTML = `
          <button onclick="renderRodShop()"
            style="width:100%;background:linear-gradient(135deg,#1a0a00,#2d1500);
                   border:1.5px solid #d97706;border-radius:14px;padding:12px 16px;
                   display:flex;align-items:center;gap:10px;cursor:pointer;text-align:left">
            <span style="font-size:1.6rem">🎣</span>
            <div style="flex:1">
              <div style="font-weight:900;color:#fcd34d;font-size:0.9rem">Fishing Rod Shop</div>
              <div style="font-size:0.65rem;color:#d97706">แลกการ์ด HxH พิเศษ — ถาวร ไม่หมดอายุ</div>
            </div>
            <div style="background:#1f2937;border:1px solid #fcd34d;border-radius:10px;
                 padding:6px 10px;text-align:center;min-width:48px">
              <div style="font-size:0.55rem;color:#9ca3af">Rod</div>
              <div id="_rod-banner-count" style="font-size:1rem;font-weight:900;color:#fcd34d">${rod}</div>
            </div>
          </button>`;
        // Insert after cloud banner (first child)
        const container = homePanel.querySelector('div[style*="flex-direction:column"]') || homePanel;
        const firstChild = container.firstElementChild;
        if (firstChild) container.insertBefore(shopBanner, firstChild.nextSibling);
        else container.appendChild(shopBanner);
    } else {
        const cnt = document.getElementById('_rod-banner-count');
        if (cnt) cnt.textContent = rod;
    }
}

// ─────────────────────────────────────────────────────────────
// GAME MECHANICS
// ─────────────────────────────────────────────────────────────

// ─── ON SUMMON EFFECTS ───────────────────────────────────────
function _hxhOnSummon(card, playerKey) {
    if (!card || card.silenced) return;
    if (typeof state === 'undefined' || typeof getCharStats === 'undefined') return;
    const eff    = card.originalName || card.name;
    const p      = state.players[playerKey];
    const oppKey = playerKey === 'player' ? 'ai' : 'player';
    const opp    = state.players[oppKey];

    // ── Kurapika On Summon ───────────────────────────────────
    if (eff === 'Kurapika' && !card._kurapikaOS) {
        card._kurapikaOS = true;
        const enemies = opp.field.filter(c => getCharStats(c).hp > 0);
        if (enemies.length > 0) {
            const topHP = enemies.reduce((a, b) =>
                getCharStats(a).hp >= getCharStats(b).hp ? a : b);
            if (!topHP.status.includes('Paralyze')) topHP.status.push('Paralyze');
            topHP.paralyzeTurns = Math.max(topHP.paralyzeTurns || 0, 4);
            if (typeof log === 'function')
                log(`⛓️ [Kurapika] Judgement Chain! ${topHP.name} Paralyze 2T!`, 'text-red-400 font-bold');
        }
    }

    // ── Welfin On Summon ─────────────────────────────────────
    if (eff === 'Welfin' && !card._welfinOS) {
        card._welfinOS = true;
        const enemies = opp.field.filter(c => getCharStats(c).hp > 0);
        if (enemies.length > 0) {
            const target = enemies[Math.floor(Math.random() * enemies.length)];
            target.hp -= 3;
            if (typeof log === 'function')
                log(`🐺 [Welfin] On Summon: ยิง 3 ดาเมจใส่ ${target.name}!`, 'text-amber-400 font-bold');
            if (typeof checkDeath === 'function') checkDeath(oppKey);
        }
    }

    // ── Chrollo On Summon ────────────────────────────────────
    if (eff === 'Chrollo' && !card._chrolloOS) {
        card._chrolloOS = true;
        opp.hp  = Math.max(0, opp.hp - 2);
        p.hp    = Math.min(20, p.hp + 2);
        if (typeof log === 'function')
            log(`📚 [Chrollo] Skill Hunter! Base ศัตรู -2 (${opp.hp}) · Base เรา +2 (${p.hp})`, 'text-purple-400 font-bold');
        if (typeof checkWinCondition === 'function') checkWinCondition();
    }

    // ── Pitou On Summon ──────────────────────────────────────
    if (eff === 'Pitou' && !card._pitouOS) {
        card._pitouOS = true;
        const maxSlots = typeof getMaxFieldSlots === 'function' ? getMaxFieldSlots(playerKey) : 6;
        const candidates = p.deck.filter(c => c.type === 'Character' && c.cost <= 5);
        if (candidates.length > 0 && p.field.length < maxSlots) {
            const pick = candidates[Math.floor(Math.random() * candidates.length)];
            const idx  = p.deck.findIndex(d => d.id === pick.id);
            const summoned = p.deck.splice(idx, 1)[0];
            summoned.attacksLeft = summoned.maxAttacks || 1;
            p.field.push(summoned);
            if (typeof log === 'function')
                log(`🐱 [Pitou] Cloning Technique! คัดลอก ${summoned.name} (Cost ${summoned.cost}) จากเด็ค!`, 'text-pink-400 font-bold');
            if (typeof triggerOnSummon === 'function') triggerOnSummon(summoned, playerKey);
        } else {
            if (typeof log === 'function')
                log(`🐱 [Pitou] ไม่มี Character Cost ≤5 ในเด็ค`, 'text-pink-300');
        }
    }

    // ── Meruem On Summon (Champion) ──────────────────────────
    if (eff === 'Meruem' && !card._meruemOS) {
        card._meruemOS = true;
        const enemies  = opp.field.filter(c => getCharStats(c).hp > 0);
        if (enemies.length > 0) {
            // 3 highest cost enemies (unique by id)
            const sorted  = [...enemies].sort((a, b) => b.cost - a.cost).slice(0, 3);
            let totalHp = 0, totalAtk = 0;
            sorted.forEach(t => {
                const sH = Math.max(1, Math.floor(getCharStats(t).hp  * 0.5));
                const sA = Math.max(1, Math.floor(getCharStats(t).atk * 0.5));
                t.hp  = Math.max(1, t.hp - sH);
                if (t.atk > sA) t.atk -= sA;
                totalHp  += sH;
                totalAtk += sA;
                if (typeof log === 'function')
                    log(`👑 [Meruem] ขโมย ${sH}HP/${sA}ATK จาก ${t.name}!`, 'text-yellow-400 font-bold');
            });
            card.hp    = Math.min(card.hp    + totalHp,  99);
            card.maxHp = Math.min(card.maxHp + totalHp,  99);
            card.atk  += totalAtk;
            if (typeof log === 'function')
                log(`👑 [Meruem] Royal Extraction Complete! +${totalHp}HP +${totalAtk}ATK → ${card.atk}/${card.hp}`, 'text-yellow-300 font-bold');
            if (typeof checkDeath === 'function') checkDeath(oppKey);
        }
    }
}

// ─── PRE-DEATH EFFECTS ───────────────────────────────────────
// Called before the original checkDeath removes dead cards.
function _hxhPreDeath(playerKey) {
    if (typeof state === 'undefined' || typeof getCharStats === 'undefined') return;
    const p      = state.players[playerKey];
    const oppKey = playerKey === 'player' ? 'ai' : 'player';
    const opp    = state.players[oppKey];

    p.field.forEach(c => {
        if (getCharStats(c).hp > 0 || c._hxhDeathDone) return;
        c._hxhDeathDone = true;
        const eff = c.originalName || c.name;

        // Gon On Death: draw 2 cards
        if (eff === 'Gon') {
            for (let i = 0; i < 2 && p.deck.length > 0; i++) p.hand.push(p.deck.shift());
            if (typeof log === 'function')
                log(`💚 [Gon] On Death: Rock! จั่ว 2 ใบ!`, 'text-emerald-400 font-bold');
        }

        // Kurapika On Death: paralyze 2 random enemies 2T
        if (eff === 'Kurapika') {
            const alive = opp.field.filter(e => getCharStats(e).hp > 0);
            [...alive].sort(() => Math.random() - 0.5).slice(0, 2).forEach(t => {
                if (!t.status.includes('Paralyze')) t.status.push('Paralyze');
                t.paralyzeTurns = Math.max(t.paralyzeTurns || 0, 4);
                if (typeof log === 'function')
                    log(`⛓️ [Kurapika] On Death: Judgement Chain! ${t.name} Paralyze 2T!`, 'text-red-300 font-bold');
            });
        }

        // Chrollo On Death: draw 2 random Items from deck
        if (eff === 'Chrollo') {
            const items = p.deck.filter(d => d.type === 'Item');
            [...items].sort(() => Math.random() - 0.5).slice(0, 2).forEach(it => {
                const idx = p.deck.findIndex(d => d.id === it.id);
                if (idx !== -1) {
                    const drawn = p.deck.splice(idx, 1)[0];
                    p.hand.push(drawn);
                    if (typeof log === 'function')
                        log(`📚 [Chrollo] On Death: Bandit's Secret — ดึง ${drawn.name} เข้ามือ!`, 'text-purple-300 font-bold');
                }
            });
            if (items.length === 0 && typeof log === 'function')
                log(`📚 [Chrollo] On Death: ไม่มี Item ในเด็ค`, 'text-gray-500');
        }

        // Netero On Death: enemy base -3 + killer gets permanent poison
        if (eff === 'Netero') {
            opp.hp = Math.max(0, opp.hp - 3);
            if (typeof log === 'function')
                log(`🙏 [Netero] On Death: Zero Hand! Base ศัตรู -3 → ${opp.hp}!`, 'text-orange-400 font-bold');
            // Tag the killer with permanent poison
            if (typeof state.lastAttackContext !== 'undefined' && state.lastAttackContext) {
                const ctx     = state.lastAttackContext;
                const kSide   = state.players[ctx.attackerPlayerKey];
                const killer  = kSide ? kSide.field.find(kc => kc.id === ctx.attackerId) : null;
                if (killer && getCharStats(killer).hp > 0) {
                    killer.poisonPermanent = true;
                    if (!killer.status.includes('Poison')) killer.status.push('Poison');
                    if (typeof log === 'function')
                        log(`🙏 [Netero] Poison Bomb! ${killer.name} ติด Poison จนตาย!`, 'text-purple-400 font-bold');
                }
            }
            if (typeof checkWinCondition === 'function') checkWinCondition();
        }
    });
}

// ─── END OF TURN EFFECTS ─────────────────────────────────────
function _hxhEndOfTurn(playerKey) {
    if (typeof state === 'undefined' || typeof getCharStats === 'undefined') return;
    const p      = state.players[playerKey];
    const oppKey = playerKey === 'player' ? 'ai' : 'player';
    const opp    = state.players[oppKey];

    p.field.forEach(c => {
        if (getCharStats(c).hp <= 0 || c.silenced) return;
        const eff = c.originalName || c.name;

        // Welfin End of Turn: deal 2 to random enemy
        if (eff === 'Welfin') {
            const enemies = opp.field.filter(e => getCharStats(e).hp > 0);
            if (enemies.length > 0) {
                const t = enemies[Math.floor(Math.random() * enemies.length)];
                t.hp -= 2;
                if (typeof log === 'function')
                    log(`🐺 [Welfin] End Turn: ยิง 2 ดาเมจใส่ ${t.name}!`, 'text-amber-400 font-bold');
                if (typeof checkDeath === 'function') checkDeath(oppKey);
            }
        }

        // Hisoka Ongoing: if Gon in hand → set Gon's effective cost to 2
        if (eff === 'Hisoka') {
            p.hand.forEach(h => {
                if ((h.originalName || h.name) === 'Gon') {
                    const baseCost = h.cost;
                    h.costReducer  = Math.max(0, baseCost - 2);
                    if (typeof log === 'function')
                        log(`🃏 [Hisoka] Ongoing: Gon Cost → 2 ♠️`, 'text-pink-400');
                }
            });
        }
    });
}

// ─── POST-ATTACK KILL EFFECTS ────────────────────────────────
function _hxhPostAttack(attackerId, targetId) {
    if (typeof state === 'undefined' || typeof getCharStats === 'undefined') return;
    const atkKey    = state.currentTurn === 'player' ? 'player' : 'ai';
    const defKey    = atkKey === 'player' ? 'ai' : 'player';
    const atkPlayer = state.players[atkKey];
    const defPlayer = state.players[defKey];

    const attacker = atkPlayer.field.find(c => c.id === attackerId);
    if (!attacker) return;
    const eff = attacker.originalName || attacker.name;

    // Did the target die? (no longer in defPlayer.field)
    const targetStillAlive = defPlayer.field.some(c => c.id === targetId);
    if (targetStillAlive) return;

    const killed = defPlayer.graveyard.find(c => c.id === targetId);
    const killedCost = killed ? (killed.cost || 0) : 0;

    // Gon: ATK += killed card's cost
    if (eff === 'Gon') {
        attacker.atk += killedCost;
        if (typeof log === 'function')
            log(`💚 [Gon] Jajanken! Kill → ATK +${killedCost} → ตอนนี้ ${attacker.atk} ถาวร!`, 'text-emerald-300 font-bold');
    }

    // Chrollo: enemy discards 1 random card from hand
    if (eff === 'Chrollo') {
        if (defPlayer.hand.length > 0) {
            const idx = Math.floor(Math.random() * defPlayer.hand.length);
            const disc = defPlayer.hand.splice(idx, 1)[0];
            defPlayer.graveyard.push(disc);
            if (typeof log === 'function')
                log(`📚 [Chrollo] Steal! ศัตรู Discard ${disc.name}!`, 'text-purple-300 font-bold');
        }
    }

    // Pitou: if killed card's cost ≤ 6 → summon a copy to our field
    if (eff === 'Pitou' && killed && killed.cost <= 6) {
        const maxSlots = typeof getMaxFieldSlots === 'function' ? getMaxFieldSlots(atkKey) : 6;
        if (atkPlayer.field.length < maxSlots) {
            const copy = JSON.parse(JSON.stringify(killed));
            copy.id          = 'card_' + (typeof cardIdCounter !== 'undefined' ? cardIdCounter++ : Date.now());
            copy.hp          = copy.maxHp || copy.hp;
            copy.status      = [];
            copy.items       = [];
            copy.attacksLeft = copy.maxAttacks || 1;
            copy._hxhDeathDone = false;
            atkPlayer.field.push(copy);
            if (typeof log === 'function')
                log(`🐱 [Pitou] En Clone! Summon ${copy.name} (Cost ${copy.cost}) to our field!`, 'text-pink-400 font-bold');
        }
    }
}

// ─────────────────────────────────────────────────────────────
// HXH V2 — Artstyle Shop, Exchange, New Codes
// ─────────────────────────────────────────────────────────────

// ─── V2 ARTSTYLE CONFIGS (Rod Shop — 5 Rod Tokens each) ──────
const _HXH_ARTSTYLE_CFG = {
    'hisoka_solitaire': { id:'hisoka_solitaire', label:'Hisoka – Solitaire Master',       emoji:'🃏', targetCard:'Hisoka',         art:'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQlgkUHgZBw-y3kNWOgrL3KxXxwf7Xlp6vdxg&s', shopCost:5, currency:'rod' },
    'gon_furious':      { id:'gon_furious',      label:'Gon – Furious Mode',              emoji:'💚', targetCard:'Gon',            art:'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQlVQ0eurq1lmjM6bAcmaBukURjp9I6puSBjQ&s', shopCost:5, currency:'rod' },
    'kurapika_chain':   { id:'kurapika_chain',   label:'Kurapika – Chain of Revolution',  emoji:'⛓️', targetCard:'Kurapika',       art:'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRaL5mJIiwiPKgQuxR7ur2FD7dUyLfE4wIr1g&s', shopCost:5, currency:'rod' },
    'chrollo_magic':    { id:'chrollo_magic',    label:'Chrollo – Magic School',          emoji:'📚', targetCard:'Chrollo',        art:'https://images.wallpapersden.com/image/download/chrollo-lucilfer-x-hunter_bGZpam2UmZqaraWkpJRnZ2VlrWZobG0.jpg', shopCost:5, currency:'rod' },
    'killua_vangogh':   { id:'killua_vangogh',   label:'Killua – X Van Gogh',             emoji:'⚡', targetCard:'Killua',         art:'https://file.garden/aeeLCXSsJxTPrRbp/96ac8787b96a4746b46930736a7703e6.jpg', shopCost:5, currency:'rod' },
    'netero_vs_meruem': { id:'netero_vs_meruem', label:'Netero – VS Meruem',              emoji:'🙏', targetCard:'Netero',         art:'https://file.garden/aeeLCXSsJxTPrRbp/file_00000000e8d471fdab50e1a6897150ba.png', shopCost:5, currency:'rod' },
    'meruem_vs_netero': { id:'meruem_vs_netero', label:'Meruem – VS Netero',              emoji:'👑', targetCard:'Meruem',         art:'https://file.garden/aeeLCXSsJxTPrRbp/file_00000000775871fa81a1a53296305849.png', shopCost:5, currency:'rod' },
    'leorio_study':     { id:'leorio_study',     label:'Leorio – Study',                  emoji:'📖', targetCard:'Leorio',         art:'https://file.garden/aeeLCXSsJxTPrRbp/631c32519838d8cd3c73f57511b6342e.jpg', shopCost:5, currency:'rod' },
    'einstein_hunter':  { id:'einstein_hunter',  label:'Albert Einstein – Being a Hunter',emoji:'🔭', targetCard:'Albert Einstein', art:'https://file.garden/aeeLCXSsJxTPrRbp/file_00000000808871fab32c436aaca80c42.png', shopCost:5, currency:'rod' },
    'goblin_hunter':    { id:'goblin_hunter',    label:'Goblin – Hunter Mode',            emoji:'👺', targetCard:'Goblin',         art:'https://i.ibb.co/whyqBnjp/105e4748-2c58-4a1c-83c3-cc6b9e7ab71e.png', shopCost:5, currency:'rod' },
};

// ─── ROD EXCHANGE ─────────────────────────────────────────────
const ROD_EXCHANGE_GEM_MAX  = 10; // 5 Rod → 5 Gems,   max 10 times
const ROD_EXCHANGE_COIN_MAX = 5;  // 5 Rod → 1500 Coin, max 5 times

function _getRodExchangeCount(type) {
    if (typeof playerData === 'undefined') return 0;
    return (playerData.rodExchanges || {})[type] || 0;
}

function rodExchangeGems() {
    const done = _getRodExchangeCount('gems');
    if (done >= ROD_EXCHANGE_GEM_MAX) { showToast(`🔒 แลกครบ ${ROD_EXCHANGE_GEM_MAX} ครั้งแล้ว!`, '#f87171'); return; }
    if ((playerData.rodTokens || 0) < 5) { showToast('🎣 Rod Token ไม่พอ! ต้องการ 5', '#f87171'); return; }
    playerData.rodTokens -= 5;
    playerData.gems = (playerData.gems || 0) + 5;
    if (!playerData.rodExchanges) playerData.rodExchanges = {};
    playerData.rodExchanges.gems = done + 1;
    saveData(); updateHubUI();
    showToast(`💎 +5 Gems! (แลกแล้ว ${done+1}/${ROD_EXCHANGE_GEM_MAX} ครั้ง)`, '#93c5fd');
    document.getElementById('_rod-shop-overlay')?.remove();
    renderRodShop();
}

function rodExchangeCoins() {
    const done = _getRodExchangeCount('coins');
    if (done >= ROD_EXCHANGE_COIN_MAX) { showToast(`🔒 แลกครบ ${ROD_EXCHANGE_COIN_MAX} ครั้งแล้ว!`, '#f87171'); return; }
    if ((playerData.rodTokens || 0) < 5) { showToast('🎣 Rod Token ไม่พอ! ต้องการ 5', '#f87171'); return; }
    playerData.rodTokens -= 5;
    playerData.coins = (playerData.coins || 0) + 1500;
    if (!playerData.rodExchanges) playerData.rodExchanges = {};
    playerData.rodExchanges.coins = done + 1;
    saveData(); updateHubUI();
    showToast(`🪙 +1,500 Coins! (แลกแล้ว ${done+1}/${ROD_EXCHANGE_COIN_MAX} ครั้ง)`, '#fcd34d');
    document.getElementById('_rod-shop-overlay')?.remove();
    renderRodShop();
}

// ─── BUY HXH ARTSTYLE (Rod Token) ────────────────────────────
function buyHxHArtstyle(id) {
    const cfg = _HXH_ARTSTYLE_CFG[id];
    if (!cfg) return;
    if (!playerData.unlockedArtstyles) playerData.unlockedArtstyles = [];
    if (playerData.unlockedArtstyles.includes(id)) { showToast('🎨 ปลดล็อคแล้ว!', '#4ade80'); return; }
    if ((playerData.rodTokens || 0) < cfg.shopCost) {
        showToast(`🎣 Rod Token ไม่พอ! ต้องการ ${cfg.shopCost}`, '#f87171'); return;
    }
    playerData.rodTokens -= cfg.shopCost;
    playerData.unlockedArtstyles.push(id);
    if (typeof _applyArtstyle === 'function' && (playerData.equippedArtstyles || {})[cfg.targetCard] === id) _applyArtstyle(id);
    saveData(); updateHubUI();
    if (typeof checkTitleUnlocks === 'function') checkTitleUnlocks();
    showToast(`🎨 ปลดล็อค "${cfg.label}"! (${playerData.rodTokens} 🎣 เหลือ)`, '#fcd34d');
    document.getElementById('_rod-shop-overlay')?.remove();
    renderRodShop();
}

// ─── STANDALONE ARTSTYLE OVERLAY ─────────────────────────────
function renderArtstyleShopOverlay() {
    // Merge all artstyles: Easter + HxH V2
    const allStyles = Object.assign(
        {},
        (typeof ARTSTYLE_CFG !== 'undefined' ? ARTSTYLE_CFG : {}),
        _HXH_ARTSTYLE_CFG
    );
    const unlocked = playerData.unlockedArtstyles || [];
    const equipped  = playerData.equippedArtstyles  || {};
    const rod       = playerData.rodTokens || 0;
    const gems      = playerData.gems || 0;

    const rows = Object.values(allStyles).map(cfg => {
        const isUnlocked = unlocked.includes(cfg.id);
        const isEquipped = equipped[cfg.targetCard] === cfg.id;
        const isRodBuy   = cfg.currency === 'rod';
        const canBuy     = isRodBuy ? (rod >= (cfg.shopCost||5)) : (gems >= (cfg.shopCost||5));
        const borderClr  = isEquipped ? '#fbbf24' : isUnlocked ? '#34d399' : '#374151';
        return `<div style="background:#0f172a;border:1.5px solid ${borderClr};
             border-radius:12px;padding:10px;display:flex;align-items:center;gap:10px">
          ${cfg.art
            ? `<img src="${cfg.art}" style="width:52px;height:62px;object-fit:cover;border-radius:8px;border:1px solid #374151" onerror="this.style.background='#1f2937'">`
            : `<div style="width:52px;height:62px;background:#1f2937;border-radius:8px;display:flex;align-items:center;justify-content:center;font-size:1.4rem">${cfg.emoji||'🎨'}</div>`}
          <div style="flex:1;min-width:0">
            <div style="font-size:0.56rem;color:#6b7280;letter-spacing:0.4px">🎯 ${cfg.targetCard}</div>
            <div style="font-weight:900;color:white;font-size:0.82rem;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${cfg.emoji||''} ${cfg.label}</div>
            <div style="font-size:0.6rem;margin-top:2px;color:${isEquipped?'#fbbf24':isUnlocked?'#4ade80':'#6b7280'}">
              ${isEquipped ? '✅ ใส่อยู่' : isUnlocked ? '🔓 ปลดล็อคแล้ว' : isRodBuy ? `🎣 ${cfg.shopCost||5} Rod` : `💎 ${cfg.shopCost||5} Gems`}
            </div>
          </div>
          <div style="display:flex;flex-direction:column;gap:4px;flex-shrink:0">
            ${isUnlocked
              ? isEquipped
                ? `<button onclick="unequipArtstyle('${cfg.id}');renderArtstyleShopOverlay()"
                    style="background:#374151;color:#9ca3af;border:none;padding:7px 10px;border-radius:8px;font-size:0.7rem;font-weight:700;cursor:pointer;min-width:56px">✕ ถอด</button>`
                : `<button onclick="equipArtstyle('${cfg.id}');renderArtstyleShopOverlay()"
                    style="background:linear-gradient(135deg,#d97706,#92400e);color:white;border:none;padding:7px 10px;border-radius:8px;font-size:0.7rem;font-weight:700;cursor:pointer;min-width:56px">🎨 ใส่</button>`
              : isRodBuy
                ? `<button onclick="buyHxHArtstyle('${cfg.id}')" ${canBuy?'':'disabled'}
                    style="background:${canBuy?'linear-gradient(135deg,#0369a1,#0ea5e9)':'#374151'};color:${canBuy?'white':'#6b7280'};border:none;padding:7px 10px;border-radius:8px;font-size:0.7rem;font-weight:700;cursor:${canBuy?'pointer':'not-allowed'};min-width:56px">🎣 ซื้อ</button>`
                : `<button onclick="(typeof buyArtstyle==='function'?buyArtstyle('${cfg.id}'):(typeof buyEasterArtstyle==='function'?buyEasterArtstyle('${cfg.id}'):null));setTimeout(renderArtstyleShopOverlay,200)" ${canBuy?'':'disabled'}
                    style="background:${canBuy?'linear-gradient(135deg,#6d28d9,#a855f7)':'#374151'};color:${canBuy?'white':'#6b7280'};border:none;padding:7px 10px;border-radius:8px;font-size:0.7rem;font-weight:700;cursor:${canBuy?'pointer':'not-allowed'};min-width:56px">💎 ซื้อ</button>`
            }
          </div>
        </div>`;
    }).join('');

    const ov = document.createElement('div');
    ov.id = '_artstyle-overlay';
    ov.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,0.92);z-index:3100;display:flex;align-items:center;justify-content:center;padding:12px;overflow-y:auto';
    ov.onclick = e => { if (e.target===ov) ov.remove(); };
    ov.innerHTML = `
    <div style="background:linear-gradient(135deg,#0a0f1e,#0a180f);border:2.5px solid #fbbf24;
         border-radius:24px;padding:22px 16px;max-width:440px;width:100%;
         max-height:90vh;overflow-y:auto;box-shadow:0 0 50px rgba(251,191,36,0.2)">
      <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:14px">
        <div>
          <div style="font-size:1.2rem;font-weight:900;color:#fbbf24">🎨 Artstyle Shop</div>
          <div style="font-size:0.62rem;color:#9ca3af">เปลี่ยนภาพการ์ด — ปลดล็อคถาวร ไม่หมดอายุ</div>
        </div>
        <div style="display:flex;gap:6px">
          <div style="background:#1f2937;border:1px solid #fcd34d;border-radius:10px;padding:5px 10px;text-align:center">
            <div style="font-size:0.5rem;color:#9ca3af">Rod</div>
            <div style="font-size:0.92rem;font-weight:900;color:#fcd34d">${rod}🎣</div>
          </div>
          <div style="background:#1f2937;border:1px solid #a855f7;border-radius:10px;padding:5px 10px;text-align:center">
            <div style="font-size:0.5rem;color:#9ca3af">Gems</div>
            <div style="font-size:0.92rem;font-weight:900;color:#a855f7">${gems}💎</div>
          </div>
        </div>
      </div>
      <div style="background:rgba(251,191,36,0.07);border:1px solid #92400e55;border-radius:8px;
           padding:6px 10px;font-size:0.6rem;color:#d97706;text-align:center;margin-bottom:12px">
        🃏 HxH Artstyles ซื้อด้วย 🎣 Rod Token &nbsp;|&nbsp; Easter Artstyles ซื้อด้วย 💎 Gems
      </div>
      <div style="display:flex;flex-direction:column;gap:7px">${rows}</div>
      <button onclick="document.getElementById('_artstyle-overlay').remove()"
        style="width:100%;margin-top:14px;background:#374151;color:#9ca3af;border:none;
               padding:11px;border-radius:12px;font-weight:700;font-size:0.9rem;cursor:pointer">✕ ปิด</button>
    </div>`;
    document.getElementById('_artstyle-overlay')?.remove();
    document.body.appendChild(ov);
}

// ─────────────────────────────────────────────────────────────
// HXH RANKED CHALLENGE — Special ranked encounter (50% chance)
// ─────────────────────────────────────────────────────────────

let _isHxHRankedGame = false;

const _HXH_RANKED_BG = 'https://file.garden/aeeLCXSsJxTPrRbp/file_00000000b5447208805daceadd5040b3.png';

// ── Dark Continent field card template ───────────────────────
const _DC_FIELD_CARD_TPL = {
    name:      'Dark Continent',
    type:      'Field',
    cost:      4,
    atk:       0, hp: 0, maxHp: 0,
    text:      'Ongoing: Dark Continent Monster ทั้งหมดฝั่ง AI ได้ +5 ATK +5 HP',
    color:     'bg-slate-900',
    art:       'https://file.garden/aeeLCXSsJxTPrRbp/file_00000000b5447208805daceadd5040b3.png',
    _theme:    'hxh',
    _dcField:  true,
};

// ── Background helpers ────────────────────────────────────────
function _applyHxHRankedBG() {
    const gs = document.getElementById('game-screen');
    if (gs) {
        gs.style.backgroundImage    = `url('${_HXH_RANKED_BG}')`;
        gs.style.backgroundSize     = 'cover';
        gs.style.backgroundPosition = 'center';
        gs.style.backgroundRepeat   = 'no-repeat';
    }
    ['player-field','ai-field'].forEach(id => {
        const z = document.getElementById(id);
        if (!z) return;
        z.style.backgroundImage    = `url('${_HXH_RANKED_BG}')`;
        z.style.backgroundSize     = 'cover';
        z.style.backgroundPosition = 'center';
        z.classList.add('has-field-bg');
        z.style.borderColor = '#94a3b8';
        z.style.borderWidth = '2px';
        z.style.borderStyle = 'solid';
    });
}

function _clearHxHRankedBG() {
    const gs = document.getElementById('game-screen');
    if (gs) {
        gs.style.backgroundImage    = '';
        gs.style.backgroundSize     = '';
        gs.style.backgroundPosition = '';
        gs.style.backgroundRepeat   = '';
    }
    ['player-field','ai-field'].forEach(id => {
        const z = document.getElementById(id);
        if (!z) return;
        z.style.backgroundImage = '';
        z.classList.remove('has-field-bg');
        z.style.borderColor = '';
        z.style.borderWidth = '';
        z.style.borderStyle = '';
    });
}

// ── Win reward ────────────────────────────────────────────────
function _grantHxHRankedWin() {
    if (typeof playerData === 'undefined') return;
    // Always +5 Rod Tokens
    playerData.rodTokens = (playerData.rodTokens || 0) + 5;
    setTimeout(() => {
        if (typeof showToast === 'function') showToast('🌑 HxH Ranked Challenge Clear! +5 🎣 Rod', '#94a3b8');
    }, 800);
    // 50% chance: +1~2 Gems
    if (Math.random() < 0.50) {
        const g = Math.random() < 0.4 ? 2 : 1;
        playerData.gems = (playerData.gems || 0) + g;
        setTimeout(() => {
            if (typeof showToast === 'function') showToast(`💎 Dark Continent Bonus! +${g} Gems`, '#93c5fd');
        }, 1400);
    }
    // 6% chance: Yoyo drop
    if (Math.random() < 0.06) {
        const key = 'Yoyo|hxh';
        playerData.collection[key] = (playerData.collection[key] || 0) + 1;
        setTimeout(() => {
            if (typeof showToast === 'function') showToast('🪀 Rare Drop! Yoyo จาก Dark Continent!', '#38bdf8');
        }, 2000);
    }
    if (typeof saveData === 'function') saveData();
    if (typeof checkTitleUnlocks === 'function') checkTitleUnlocks();
}

// ── Build HxH Ranked AI Deck ──────────────────────────────────
// 30x Dark Continent Monster (cost 5, +5 ATK/HP pre-buffed by field card)
// 20x Chimera Ant (cost 6)
// 6x  Meruem (cost 6)
// 6x  Pitou  (cost 6)
// 6x  Dark Continent field card (cost 4)
function _buildHxHRankedDeck() {
    if (typeof createCardInstance === 'undefined' || typeof CardSets === 'undefined') return [];
    const deck = [];

    const makeCard = (name, theme, costOverride) => {
        const c = typeof createCardInstance === 'function'
            ? createCardInstance(name, theme) : null;
        if (!c) return null;
        if (costOverride !== undefined) c.cost = costOverride;
        // Buff all cards +5 ATK +5 HP (Dark Continent field effect)
        c.atk    = (c.atk    || 0) + 5;
        c.hp     = (c.hp     || 0) + 5;
        c.maxHp  = (c.maxHp  || 0) + 5;
        return c;
    };

    // 30x Dark Continent Monster — cost 5
    for (let i = 0; i < 30; i++) {
        const c = makeCard('Dark Continent Monster', 'hxh', 5);
        if (c) deck.push(c);
    }
    // 20x Chimera Ant — cost 6
    for (let i = 0; i < 20; i++) {
        const c = makeCard('Chimera Ant', 'hxh', 6);
        if (c) deck.push(c);
    }
    // 6x Meruem — cost 6
    for (let i = 0; i < 6; i++) {
        const c = makeCard('Meruem', 'hxh', 6);
        if (c) deck.push(c);
    }
    // 6x Pitou — cost 6
    for (let i = 0; i < 6; i++) {
        const c = makeCard('Pitou', 'hxh', 6);
        if (c) deck.push(c);
    }

    return deck.sort(() => Math.random() - 0.5);
}

// ─────────────────────────────────────────────────────────────
// DOM READY — patch everything
// ─────────────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {

    // 1. Inject cards into CardSets
    if (typeof CardSets !== 'undefined') {
        CardSets['hxh'] = {};
        Object.entries(_HXH_CARDS_TPL).forEach(([k, v]) => {
            CardSets['hxh'][k] = JSON.parse(JSON.stringify(v));
        });
        Object.entries(_ROD_CARDS_TPL).forEach(([k, v]) => {
            CardSets['hxh'][k] = JSON.parse(JSON.stringify(v));
        });
    }

    // 2. Init playerData fields
    if (typeof playerData !== 'undefined') {
        if (playerData.fishingRod      === undefined) playerData.fishingRod      = 0;
        if (playerData.rodTokens       === undefined) playerData.rodTokens       = playerData.fishingRod || 0;
        if (playerData.rodTokensSpent  === undefined) playerData.rodTokensSpent  = 0;
        if (playerData.hxhPacksBought  === undefined) playerData.hxhPacksBought  = 0;
        if (playerData.hxhBundleBought === undefined) playerData.hxhBundleBought = false;
    }

    // 3. Inject new redeem codes + patch redeemCode for custom reward types
    if (typeof REDEEM_CODES !== 'undefined') {
        // HXHMW → +10 Gems + 10 Rod
        REDEEM_CODES['HXHMW']  = { gems: 10, fishingRod: 10,    label: '🎣 HxH Starter',     oneTime: true };
        // HISOKA → receive Hisoka card (no pack)
        REDEEM_CODES['HISOKA'] = { hxhCard: 'Hisoka',           label: '🃏 Hisoka Exclusive', oneTime: true };
        // EXP → +26 XP, requires level 7
        REDEEM_CODES['EXP']    = { xp: 26, requireLevel: 7,     label: '⭐ +26 EXP',          oneTime: true };
    }

    // Patch redeemCode to handle fishingRod / hxhCard / xp / requireLevel
    if (typeof redeemCode === 'function') {
        const _origRedeem = redeemCode;
        window.redeemCode = function() {
            const raw = document.getElementById('redeem-input')?.value?.trim().toUpperCase().replace(/\s+/g,'');
            if (!raw) { _origRedeem(); return; }
            const reward = (typeof REDEEM_CODES !== 'undefined') ? REDEEM_CODES[raw] : null;
            if (!reward) { _origRedeem(); return; }

            const msg = document.getElementById('redeem-msg');

            // Level-gate check
            if (reward.requireLevel) {
                const lv = typeof playerData !== 'undefined' ? (playerData.level || 1) : 1;
                if (lv < reward.requireLevel) {
                    if (msg) { msg.style.color='#f87171'; msg.textContent=`❌ ต้องการ Level ${reward.requireLevel} ขึ้นไป! (ตอนนี้ Lv.${lv})`; }
                    return;
                }
            }

            // One-time check (duplicated here for custom types)
            const used = typeof getUsedCodes === 'function' ? getUsedCodes() : [];
            if (reward.oneTime && used.includes(raw)) {
                if (msg) { msg.style.color='#f87171'; msg.textContent='❌ โค้ดนี้ใช้ไปแล้ว'; }
                return;
            }

            // ── hxhCard reward (Hisoka) ───────────────────────────
            if (reward.hxhCard) {
                if (typeof playerData !== 'undefined') {
                    const k = `${reward.hxhCard}|hxh`;
                    playerData.collection[k] = (playerData.collection[k] || 0) + 1;
                }
                if (typeof playerData !== 'undefined' && reward.fishingRod)
                    playerData.fishingRod = (playerData.fishingRod || 0) + (reward.fishingRod || 0);
                if (typeof saveData === 'function') saveData();
                if (typeof markCodeUsed === 'function') markCodeUsed(raw);
                if (typeof updateHubUI === 'function') updateHubUI();
                if (msg) { msg.style.color='#a855f7'; msg.textContent=`🎉 ได้รับ ${reward.label}! 🃏 ${reward.hxhCard} เพิ่มใน Collection`; }
                if (document.getElementById('redeem-input')) document.getElementById('redeem-input').value = '';
                if (typeof showToast === 'function') showToast(`🃏 รับ ${reward.hxhCard} สำเร็จ!`, '#a855f7');
                return;
            }

            // ── xp reward ─────────────────────────────────────────
            if (reward.xp) {
                if (typeof addXp === 'function') addXp(reward.xp);
                if (typeof saveData === 'function') saveData();
                if (typeof markCodeUsed === 'function') markCodeUsed(raw);
                if (typeof updateHubUI === 'function') updateHubUI();
                if (msg) { msg.style.color='#fbbf24'; msg.textContent=`🎉 ได้รับ ${reward.label}! +${reward.xp} ⭐ XP`; }
                if (document.getElementById('redeem-input')) document.getElementById('redeem-input').value = '';
                if (typeof showToast === 'function') showToast(`⭐ +${reward.xp} XP!`, '#fbbf24');
                return;
            }

            // ── fishingRod in HXHMW (plus gems handled by original) ──
            if (reward.fishingRod && typeof playerData !== 'undefined') {
                playerData.fishingRod = (playerData.fishingRod || 0) + reward.fishingRod;
                // Let the original handler deal with gems / marking / toast
            }

            _origRedeem();
        };
    }

    // 4. Patch renderPacksPanel → append HxH section
    if (typeof renderPacksPanel === 'function') {
        const _origRPP = renderPacksPanel;
        window.renderPacksPanel = function() {
            _origRPP();
            _appendHxHSection();
        };
    }

    // 5. Patch updateHubUI → show Rod in home panel
    if (typeof updateHubUI === 'function') {
        const _origHUI = updateHubUI;
        window.updateHubUI = function() {
            _origHUI();
            _patchHxHRodDisplay();
        };
    }

    // 6. Patch triggerOnSummon → HxH on-summon effects
    if (typeof triggerOnSummon === 'function') {
        const _origSummon = triggerOnSummon;
        window.triggerOnSummon = function(card, playerKey) {
            _origSummon(card, playerKey);
            _hxhOnSummon(card, playerKey);
        };
    }

    // 7. Patch checkDeath → HxH on-death effects (run before card removal)
    if (typeof checkDeath === 'function') {
        const _origDeath = checkDeath;
        window.checkDeath = function(playerKey) {
            _hxhPreDeath(playerKey);
            _origDeath(playerKey);
        };
    }

    // 8. Patch resolveEndPhase → Welfin end-turn dmg + Hisoka Gon cost
    if (typeof resolveEndPhase === 'function') {
        const _origEnd = resolveEndPhase;
        window.resolveEndPhase = function(playerKey) {
            _origEnd(playerKey);
            _hxhEndOfTurn(playerKey);
        };
    }

    // 9. Patch initiateAttack → Killua (evade + ×2 vs paralyzed),
    //    Hisoka (OnHit dmg reduction), Leorio (untargetable bypass),
    //    + post-attack kill effects (Gon/Chrollo/Pitou)
    if (typeof initiateAttack === 'function') {
        const _origAttack = initiateAttack;
        window.initiateAttack = function(attackerId, targetId, targetIsBase) {
            if (typeof state === 'undefined' || targetIsBase) {
                _origAttack(attackerId, targetId, targetIsBase);
                return;
            }

            const atkKey    = state.currentTurn;
            const defKey    = atkKey === 'player' ? 'ai' : 'player';
            const atkPlayer = state.players[atkKey];
            const defPlayer = state.players[defKey];

            const attacker = atkPlayer.field.find(c => c.id === attackerId);
            const target   = defPlayer.field.find(c => c.id === targetId);

            if (attacker && target && typeof getCharStats !== 'undefined') {
                const aN = attacker.originalName || attacker.name;
                const tN = target.originalName   || target.name;

                // ── Leorio: can attack Untargetable (bypass F-35 / Sinon / Simo checks) ──
                if (aN === 'Leorio' && !attacker.silenced) {
                    target._leorioBypass = true; // read by combat guards below
                }

                // ── Killua defending: 50% evade + deal 4 back ─────────────────────
                if (tN === 'Killua' && !target.silenced && !attacker.silenced) {
                    if (Math.random() < 0.5) {
                        attacker.hp -= 4;
                        if (typeof log === 'function')
                            log(`⚡ [Killua] Godspeed! หลบการโจมตีจาก ${attacker.name} + ตีกลับ 4 ดาเมจ!`, 'text-sky-300 font-bold');
                        if (typeof checkDeath === 'function') checkDeath(atkKey);
                        attacker.attacksLeft = Math.max(0, attacker.attacksLeft); // restore wasn't consumed
                        if (typeof updateUI === 'function') updateUI();
                        return; // attack is fully evaded
                    }
                    // Failed evade — proceed normally but record for log
                }

                // ── Killua attacking: ×2 dmg vs Paralyzed ────────────────────────
                if (aN === 'Killua' && !attacker.silenced
                    && target.status && target.status.includes('Paralyze')) {
                    target._wasParalyzed = true;
                    attacker.atk *= 2;
                    attacker._killuaAtkBoosted = true;
                    if (typeof log === 'function')
                        log(`⚡ [Killua] Thunderbolt! โจมตีเป้า Paralyzed → ดาเมจ ×2!`, 'text-sky-300 font-bold');
                }

                // --- Godspeed Killua Attack logic (x2 vs Paralyzed) ---
                if (aN === 'Godspeed Killua' && target.status.includes('Paralyze') && !attacker.silenced) {
                    attacker.atk *= 2;
                    attacker._gsKilluaBuff = true;
                    log(`⚡ [Godspeed Killua] Thunderbolt! ดาเมจ x2 ใส่เป้าหมายอัมพาต!`, 'text-sky-300 font-bold');
                }

                // --- Godspeed Killua Defense logic (Counter 6 + Paralyze 2T) ---
                if (tN === 'Godspeed Killua' && !target.silenced) {
                    attacker.hp -= 6;
                    if (!attacker.status.includes('Paralyze')) {
                        attacker.status.push('Paralyze');
                        // ตั้งค่าเป็น 4 เพื่อให้ติดสถานะ 2 เทิร์น (ระบบจะลดเทิร์นทุก End Phase)
                        attacker.paralyzeTurns = 4; 
                    }
                    log(`⚡ [Godspeed Killua] Counter! ${attacker.name} รับ 6 ดาเมจ และติดอัมพาต 2 เทิร์น!`, 'text-sky-400 font-bold');
                    if (typeof checkDeath === 'function') checkDeath(atkKey);
                }

                // ── Hisoka defending: record HP before hit ───────────────────────
                if (tN === 'Hisoka' && !target.silenced) {
                    target._hxhHpBefore = getCharStats(target).hp;
                }
            }

            // ── F-35 / Sinon untargetable bypass for Leorio ──────────────────────
            // We temporarily suppress checks by marking — guards in original code use:
            // (target.items.some(i => i.name === 'F-35') && friends.length > 0)
            // and (target.name === 'Sinon' && defPlayer.field.length > 1)
            // We can't easily bypass these without patching deeper, so Leorio's
            // "hitUntargetable" is noted in card text; the bypass flag _leorioBypass
            // can be read by future combat refactors. Core evasion (Kazuma, evade items)
            // still applies since those are separate from "untargetable" semantics.

            _origAttack(attackerId, targetId, targetIsBase);

            // ── Post-attack cleanup ───────────────────────────────────────────────
            const attackerAfter = state.players[atkKey].field.find(c => c.id === attackerId);

            // Restore Killua's temporary ATK boost
            if (attackerAfter && attackerAfter._killuaAtkBoosted) {
                attackerAfter.atk = Math.round(attackerAfter.atk / 2);
                attackerAfter._killuaAtkBoosted = false;
                if (typeof log === 'function')
                    log(`⚡ [Killua] ATK กลับเป็นปกติ`, 'text-sky-200');
            }

            if (attackerAfter && attackerAfter._gsKilluaBuff) {
                attackerAfter.atk /= 2;
                delete attackerAfter._gsKilluaBuff;
            }

            // Hisoka OnHit damage reduction (if Hisoka still alive)
            if (!targetIsBase) {
                const dPlayer = state.players[defKey];
                const hisoka = dPlayer.field.find(c => (c.originalName || c.name) === 'Hisoka');
                if (hisoka && hisoka._hxhHpBefore !== undefined && !hisoka.silenced
                    && typeof getCharStats !== 'undefined') {
                    const curHp   = getCharStats(hisoka).hp;
                    const dmgTaken = hisoka._hxhHpBefore - curHp;
                    if (dmgTaken > 3 && curHp > 0) {
                        const restore = Math.floor(dmgTaken * 0.5);
                        hisoka.hp = Math.min(hisoka.hp + restore, hisoka.maxHp);
                        if (typeof log === 'function')
                            log(`🃏 [Hisoka] Bungee Gum! OnHit ดาเมจ ${dmgTaken} → ลดเหลือ ${dmgTaken - restore} (×0.5)`, 'text-pink-400 font-bold');
                    }
                    delete hisoka._hxhHpBefore;
                }
            }

            // Leorio cleanup
            if (!targetIsBase) {
                const tAfter = state.players[defKey].field.find(c => c.id === targetId);
                if (tAfter) tAfter._leorioBypass = false;
            }

            // Kill effects (Gon ATK++, Chrollo discard, Pitou copy)
            _hxhPostAttack(attackerId, targetId);
        };
    }

    // ── V2a. Merge HxH artstyles into global ARTSTYLE_CFG ──────
    if (typeof ARTSTYLE_CFG !== 'undefined') {
        Object.assign(ARTSTYLE_CFG, _HXH_ARTSTYLE_CFG);
    }

    // ── V2b. New redeem codes ───────────────────────────────────
    if (typeof REDEEM_CODES !== 'undefined') {
        REDEEM_CODES['45GEMSFORSEA'] = { gems: 45,     label: '💎 Sea of Gems',    oneTime: true };
        REDEEM_CODES['HXHV2LETSGO'] = { rodTokens: 5, label: '🎣 HxH V2 Starter', oneTime: true };
    }

    // Extend redeemCode patch to handle rodTokens reward type
    if (typeof redeemCode === 'function') {
        const _origRedeemV2 = redeemCode;
        window.redeemCode = function() {
            const raw = document.getElementById('redeem-input')?.value?.trim().toUpperCase().replace(/\s+/g,'');
            if (!raw) { _origRedeemV2(); return; }
            const reward = (typeof REDEEM_CODES !== 'undefined') ? REDEEM_CODES[raw] : null;
            if (!reward || !reward.rodTokens) { _origRedeemV2(); return; }
            const used = typeof getUsedCodes === 'function' ? getUsedCodes() : [];
            const msg  = document.getElementById('redeem-msg');
            if (reward.oneTime && used.includes(raw)) {
                if (msg) { msg.style.color='#f87171'; msg.textContent='❌ โค้ดนี้ใช้ไปแล้ว'; }
                return;
            }
            if (typeof playerData !== 'undefined') {
                playerData.rodTokens = (playerData.rodTokens || 0) + reward.rodTokens;
                if (reward.gems) playerData.gems = (playerData.gems || 0) + reward.gems;
                if (typeof saveData === 'function') saveData();
            }
            if (typeof markCodeUsed === 'function') markCodeUsed(raw);
            if (typeof updateHubUI  === 'function') updateHubUI();
            if (msg) { msg.style.color='#fcd34d'; msg.textContent=`🎉 ได้รับ ${reward.label}! +${reward.rodTokens} 🎣 Rod Token`; }
            if (document.getElementById('redeem-input')) document.getElementById('redeem-input').value = '';
            if (typeof showToast === 'function') showToast(`🎣 +${reward.rodTokens} Rod Token!`, '#fcd34d');
        };
    }

    // ── V2c. Patch renderRodShop → add Artstyle + Exchange sections ──
    {
        const _origRodShopV2 = renderRodShop;
        window.renderRodShop = function() {
            _origRodShopV2();
            const ov = document.getElementById('_rod-shop-overlay');
            if (!ov) return;
            const inner = ov.querySelector('div[style*="border-radius:24px"]')
                        || ov.querySelector('[style*="max-width:440px"]')
                        || ov.firstElementChild;
            if (!inner) return;
            const closeBtn = inner.lastElementChild;

            // ── Artstyle Section ──
            const artSec = document.createElement('div');
            artSec.style.cssText = 'margin-top:14px';
            const rod = playerData.rodTokens || 0;
            const unlocked = playerData.unlockedArtstyles || [];
            const artRows = Object.values(_HXH_ARTSTYLE_CFG).map(cfg => {
                const isOwned = unlocked.includes(cfg.id);
                const canBuy  = !isOwned && rod >= cfg.shopCost;
                return `<div style="background:#0f172a;border:1.5px solid ${isOwned?'#34d399':'#374151'};
                     border-radius:12px;padding:9px 10px;display:flex;align-items:center;gap:9px">
                  ${cfg.art
                    ? `<img src="${cfg.art}" style="width:44px;height:54px;object-fit:cover;border-radius:7px;border:1px solid #374151" onerror="this.style.background='#1f2937'">`
                    : `<div style="width:44px;height:54px;background:#1f2937;border-radius:7px;display:flex;align-items:center;justify-content:center;font-size:1.2rem">${cfg.emoji}</div>`}
                  <div style="flex:1;min-width:0">
                    <div style="font-size:0.56rem;color:#6b7280">🎯 ${cfg.targetCard}</div>
                    <div style="font-weight:900;color:white;font-size:0.79rem;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${cfg.emoji} ${cfg.label}</div>
                    <div style="font-size:0.58rem;color:${isOwned?'#4ade80':'#9ca3af'};margin-top:1px">${isOwned?'✅ ปลดล็อคแล้ว':''}</div>
                  </div>
                  <button onclick="buyHxHArtstyle('${cfg.id}')" ${(isOwned||!canBuy)?'disabled':''}
                    style="background:${isOwned?'#1f2937':canBuy?'linear-gradient(135deg,#0369a1,#0ea5e9)':'#374151'};
                           color:${isOwned?'#4ade80':canBuy?'white':'#6b7280'};border:none;
                           padding:7px 10px;border-radius:8px;font-size:0.72rem;font-weight:900;
                           cursor:${(isOwned||!canBuy)?'not-allowed':'pointer'};white-space:nowrap;min-width:58px;text-align:center">
                    ${isOwned ? '✅ มีแล้ว' : `🎣 ${cfg.shopCost}`}
                  </button>
                </div>`;
            }).join('');
            artSec.innerHTML = `
              <div style="font-size:0.78rem;font-weight:900;color:#fbbf24;margin-bottom:8px">
                🎨 Artstyle Shop <span style="font-size:0.6rem;color:#9ca3af;font-weight:400">— ซื้อด้วย Rod Token</span>
              </div>
              <div style="display:flex;flex-direction:column;gap:6px">${artRows}</div>
              <button onclick="renderArtstyleShopOverlay()"
                style="width:100%;margin-top:8px;background:linear-gradient(135deg,#1a3a00,#2d5a00);
                       border:1px solid #4ade80;border-radius:10px;padding:8px;color:#4ade80;
                       font-weight:700;font-size:0.78rem;cursor:pointer">
                🎨 ดู Artstyle ทั้งหมด (+ Equip)
              </button>`;
            inner.insertBefore(artSec, closeBtn);

            // ── Exchange Section ──
            const exchSec = document.createElement('div');
            exchSec.style.cssText = 'margin-top:12px';
            const gemDone  = _getRodExchangeCount('gems');
            const coinDone = _getRodExchangeCount('coins');
            const canGem   = rod >= 5 && gemDone  < ROD_EXCHANGE_GEM_MAX;
            const canCoin  = rod >= 5 && coinDone < ROD_EXCHANGE_COIN_MAX;
            exchSec.innerHTML = `
              <div style="font-size:0.78rem;font-weight:900;color:#fbbf24;margin-bottom:8px">
                🔄 Rod Exchange <span style="font-size:0.6rem;color:#9ca3af;font-weight:400">— แลก Rod เป็นทรัพยากรอื่น</span>
              </div>
              <div style="display:flex;flex-direction:column;gap:6px">
                <div style="background:#0f172a;border:1.5px solid ${canGem?'#93c5fd':'#374151'};border-radius:12px;padding:10px 12px;display:flex;align-items:center;gap:10px">
                  <div style="font-size:1.5rem">💎</div>
                  <div style="flex:1">
                    <div style="font-weight:900;color:white;font-size:0.84rem">🎣 5 Rod → 💎 5 Gems</div>
                    <div style="font-size:0.6rem;color:#6b7280">ทำได้ ${gemDone}/${ROD_EXCHANGE_GEM_MAX} ครั้ง</div>
                  </div>
                  <button onclick="rodExchangeGems()" ${canGem?'':'disabled'}
                    style="background:${canGem?'linear-gradient(135deg,#1e40af,#3b82f6)':'#374151'};
                           color:${canGem?'white':'#6b7280'};border:none;padding:8px 12px;
                           border-radius:8px;font-weight:900;font-size:0.78rem;
                           cursor:${canGem?'pointer':'not-allowed'};white-space:nowrap">
                    ${gemDone>=ROD_EXCHANGE_GEM_MAX?'✅ ครบ':rod<5?'🎣 ไม่พอ':'💎 แลก'}
                  </button>
                </div>
                <div style="background:#0f172a;border:1.5px solid ${canCoin?'#fcd34d':'#374151'};border-radius:12px;padding:10px 12px;display:flex;align-items:center;gap:10px">
                  <div style="font-size:1.5rem">🪙</div>
                  <div style="flex:1">
                    <div style="font-weight:900;color:white;font-size:0.84rem">🎣 5 Rod → 🪙 1,500 Coins</div>
                    <div style="font-size:0.6rem;color:#6b7280">ทำได้ ${coinDone}/${ROD_EXCHANGE_COIN_MAX} ครั้ง</div>
                  </div>
                  <button onclick="rodExchangeCoins()" ${canCoin?'':'disabled'}
                    style="background:${canCoin?'linear-gradient(135deg,#92400e,#d97706)':'#374151'};
                           color:${canCoin?'white':'#6b7280'};border:none;padding:8px 12px;
                           border-radius:8px;font-weight:900;font-size:0.78rem;
                           cursor:${canCoin?'pointer':'not-allowed'};white-space:nowrap">
                    ${coinDone>=ROD_EXCHANGE_COIN_MAX?'✅ ครบ':rod<5?'🎣 ไม่พอ':'🪙 แลก'}
                  </button>
                </div>
              </div>`;
            inner.insertBefore(exchSec, closeBtn);
        };
    }

    // ── V2d. Patch updateHubUI → add Artstyle button on home ───
    {
        const _origHUIv2 = typeof updateHubUI === 'function' ? updateHubUI : null;
        if (_origHUIv2) {
            window.updateHubUI = function() {
                _origHUIv2();
                _patchHxHRodDisplay();
                const homePanel = document.getElementById('hub-panel-home');
                if (!homePanel || document.getElementById('_artstyle-home-btn')) return;
                const artBtn = document.createElement('div');
                artBtn.id = '_artstyle-home-btn';
                artBtn.style.cssText = 'padding:0 16px;max-width:640px;margin:4px auto 0;';
                artBtn.innerHTML = `
                  <button onclick="renderArtstyleShopOverlay()"
                    style="width:100%;background:linear-gradient(135deg,#0a1a00,#1a3000);
                           border:1.5px solid #4ade80;border-radius:14px;padding:10px 16px;
                           display:flex;align-items:center;gap:10px;cursor:pointer;text-align:left">
                    <span style="font-size:1.4rem">🎨</span>
                    <div style="flex:1">
                      <div style="font-weight:900;color:#4ade80;font-size:0.88rem">Artstyle Shop</div>
                      <div style="font-size:0.62rem;color:#6b7280">เปลี่ยนภาพการ์ด — ซื้อด้วย Rod / Gems</div>
                    </div>
                  </button>`;
                const shopBanner = document.getElementById('_rod-shop-banner');
                if (shopBanner) shopBanner.parentNode?.insertBefore(artBtn, shopBanner.nextSibling);
                else homePanel.appendChild(artBtn);
            };
        }
    }

    // ── V2e. Init rodExchanges field ───────────────────────────
    if (typeof playerData !== 'undefined') {
        if (!playerData.rodExchanges) playerData.rodExchanges = {};
    }

    // ── V2f. Inject Dark Continent field card into CardSets ────
    if (typeof CardSets !== 'undefined') {
        if (!CardSets['hxh']) CardSets['hxh'] = {};
        CardSets['hxh']['Dark Continent'] = JSON.parse(JSON.stringify(_DC_FIELD_CARD_TPL));
    }

    // ── V2g. Patch buildDeck → handle 'hxh_ranked' theme ───────
    if (typeof buildDeck === 'function') {
        const _origBuildDeckHxH = buildDeck;
        window.buildDeck = function(theme) {
            if (theme === 'hxh_ranked') {
                _isHxHRankedGame = true;
                if (typeof _isRabbitRampantGame !== 'undefined') _isRabbitRampantGame = false;
                return _buildHxHRankedDeck();
            }
            // [FIX BUG#2] ลบ "if (theme !== 'easter') _isHxHRankedGame = false" ออก
            // เพราะ resetAndInitGame อาจ build player deck หลัง AI deck
            // → buildDeck(playerTheme) จะ reset _isHxHRankedGame=false ก่อน endGame ทัน
            // _isHxHRankedGame ถูก reset ที่ endGame / backToHub / startRankedGame แทน (ถูกที่แล้ว)
            return _origBuildDeckHxH.call(this, theme);
        };
    }

    // ── V2h. Patch startRankedGame → HxH Ranked Challenge (30%) ──
    if (typeof startRankedGame === 'function') {
        const _origStartRankedHxH = startRankedGame;
        window.startRankedGame = function(deckId) {
            if (Math.random() < 0.30) {
                _isHxHRankedGame = true;

                // ── [FIX] Swap SETS_META ชั่วคราว (เหมือน Easter ลบ excluded themes) ──
                const _savedMeta = {};
                if (typeof SETS_META !== 'undefined') {
                    Object.keys(SETS_META).forEach(k => {
                        _savedMeta[k] = SETS_META[k];
                        delete SETS_META[k];
                    });
                    SETS_META['hxh_ranked'] = { label: '🌑 Dark Continent', size: 68 };
                }

                // ── [FIX BUG#1] Inject CardSets['hxh_ranked'] ชั่วคราว ──────────────────
                // base startRankedGame filter aiThemes ด้วย: CardSets[s] && Object.keys(CardSets[s]).length>0
                // เพราะ CardSets['hxh_ranked'] ไม่มีอยู่ → 'hxh_ranked' ถูกกรองออก → aiThemes=[]
                // → selectedAITheme=undefined → buildDeck(undefined) → เดค AI พัง + _isHxHRankedGame reset
                // แก้: inject CardSets['hxh_ranked'] = CardSets['hxh'] ชั่วคราว ให้ filter ผ่านได้
                let _injectedCardSetsHxHRanked = false;
                if (typeof CardSets !== 'undefined' && !CardSets['hxh_ranked']) {
                    CardSets['hxh_ranked'] = CardSets['hxh'] || { '__hxh_placeholder': true };
                    _injectedCardSetsHxHRanked = true;
                }

                if (typeof selectedAITheme !== 'undefined') selectedAITheme = 'hxh_ranked';

                // ── ปิด Easter check ชั่วคราว ป้องกัน Rabbit Rampant override ──
                const _origIsEasterActive = typeof isEasterActive === 'function' ? isEasterActive : null;
                if (_origIsEasterActive) window.isEasterActive = () => false;

                _origStartRankedHxH.call(this, deckId);

                // ── คืนทุกอย่างกลับ ──
                if (_origIsEasterActive) window.isEasterActive = _origIsEasterActive;
                if (typeof SETS_META !== 'undefined') {
                    delete SETS_META['hxh_ranked'];
                    Object.assign(SETS_META, _savedMeta);
                }
                // ── [FIX BUG#1] ลบ CardSets['hxh_ranked'] ที่ inject ไว้ชั่วคราว ──
                if (_injectedCardSetsHxHRanked && typeof CardSets !== 'undefined') {
                    delete CardSets['hxh_ranked'];
                }
                if (typeof selectedAITheme !== 'undefined') selectedAITheme = 'hxh_ranked';
                if (typeof _isRabbitRampantGame !== 'undefined') _isRabbitRampantGame = false;

                setTimeout(() => {
                    if (!_isHxHRankedGame) return;
                    _applyHxHRankedBG();
                    if (typeof updateUI === 'function') updateUI();
                    if (typeof log === 'function')
                        log('🌑 Dark Continent Challenge! การ์ด AI ทั้งหมด +5 ATK/HP', 'text-slate-300 font-bold');
                }, 400);
                return;
            }
            _isHxHRankedGame = false;
            _origStartRankedHxH.call(this, deckId);
        };
    }

    // ── V2i. Patch endGame → HxH Ranked win reward only ────────
    if (typeof endGame === 'function') {
        const _origEndGameHxH = endGame;
        window.endGame = function(winner) {
            _origEndGameHxH.call(this, winner);
            if (_isHxHRankedGame) {
                _isHxHRankedGame = false;
                _clearHxHRankedBG();
                if (winner === 'player') _grantHxHRankedWin();
            }
        };
    }

    // ── V2j. Patch backToHub → clear HxH Ranked BG ─────────────
    if (typeof backToHub === 'function') {
        const _origBackHxH = backToHub;
        window.backToHub = function() {
            _origBackHxH.call(this);
            _isHxHRankedGame = false;
            _clearHxHRankedBG();
        };
    }

    // 10. Backward-compat init (for sessions already loaded)
    setTimeout(() => {
        if (typeof playerData !== 'undefined') {
            if (playerData.fishingRod      === undefined) playerData.fishingRod      = 0;
            if (playerData.hxhPacksBought  === undefined) playerData.hxhPacksBought  = 0;
            if (playerData.hxhBundleBought === undefined) playerData.hxhBundleBought = false;
        }
    }, 0);
});
