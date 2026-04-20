// ============================================================
// 16_frieren_system.js — Frieren: Mage of the Endless Journey
// LIMITED TIME PACK (หมดเขต 26 เมษายน 2026 เท่านั้น!)
// วางไว้ท้ายสุดใน index_v2.html ก่อน </body>
// ============================================================

// ─── ART URLs ─────────────────────────────────────────────────────
const FRIEREN_ART_NORMAL  = 'https://i.pinimg.com/1200x/1c/ce/0a/1cce0ab4a8d5e2a94d69b2ea4e3a774f.jpg';
const FRIEREN_ART_EASTER  = 'https://i.pinimg.com/736x/34/c6/9d/34c69d44a3e36bc3df897bf822ce056b.jpg';
const ZOLTRAAK_ART        = 'https://i.pinimg.com/736x/94/1d/ba/941dbaae1b31fc8f0f9970cb184606d3.jpg';

// ─── PACK EXPIRY (26 เมษา 2026 เที่ยงคืน เวลาไทย) ────────────────
const FRIEREN_PACK_EXPIRY = new Date('2026-04-26T23:59:59+07:00');

function _isFrierenPackAvailable() {
    return new Date() < FRIEREN_PACK_EXPIRY;
}

// ─── CARD TEMPLATES ──────────────────────────────────────────────
// หมายเหตุ: requiresTarget = false ทุกใบ → ทำงานแบบสุ่มทั้งหมด
const _FRIEREN_CARDS_TPL = {
    'Frieren': {
        name: 'Frieren', type: 'Character', cost: 9, atk: 5, hp: 5, maxHp: 5,
        text: 'Summon: ให้ Character ฝั่งเราสุ่ม 1 ตัวอมตะ 2 เทิร์น | จบเทิร์น: เพิ่ม Spell สุ่ม 2 ใบเข้ามือ',
        color: 'bg-indigo-400', maxAttacks: 1,
        art: FRIEREN_ART_NORMAL,
        altArts: { normal: FRIEREN_ART_NORMAL, easter: FRIEREN_ART_EASTER },
        _theme: 'frieren_mage'
    },
    'Concealment Magic': {
        name: 'Concealment Magic', type: 'Spell', cost: 5,
        text: 'Spell: ให้ Character ฝั่งเราสุ่ม 1 ตัวอมตะ 2 เทิร์น',
        color: 'bg-indigo-700',
        requiresTarget: false,
        art: FRIEREN_ART_NORMAL,
        _theme: 'frieren_mage'
    },
    'Zoltraak': {
        name: 'Zoltraak', type: 'Spell', cost: 5,
        text: 'Spell: ทำลาย Character ศัตรูสุ่ม 1 ตัวทันที',
        color: 'bg-violet-700',
        requiresTarget: false,
        art: ZOLTRAAK_ART,
        _theme: 'frieren_mage'
    },
    'Analysis': {
        name: 'Analysis', type: 'Spell', cost: 1,
        text: 'Spell: ทำให้ Spell Card อื่นสุ่ม 1 ใบในมือ Cost 0',
        color: 'bg-sky-700',
        requiresTarget: false,
        art: FRIEREN_ART_NORMAL,
        _theme: 'frieren_mage'
    }
};

const FRIEREN_SPELL_NAMES = ['Concealment Magic', 'Zoltraak', 'Analysis'];

const ART_STYLE_LABELS = {
    normal: { label: '🖼️ Normal', color: '#9ca3af' },
    easter: { label: '🐣 Easter', color: '#f472b6' }
};

// ─── HELPER: สร้าง spell instance ────────────────────────────────
function _mkFrierenSpell(spellName) {
    const tpl = _FRIEREN_CARDS_TPL[spellName];
    if (!tpl || typeof cardIdCounter === 'undefined') return null;
    return {
        id: 'card_' + (cardIdCounter++),
        name: tpl.name, originalName: tpl.name,
        type: 'Spell', cost: tpl.cost,
        atk: 0, hp: 0, maxHp: 0,
        text: tpl.text, color: tpl.color,
        maxAttacks: 0, attacksLeft: 0,
        art: tpl.art, _theme: 'frieren_mage',
        isFrierenSpell: true,
        requiresTarget: false, targetEnemy: false,
        status: [], items: [], stolenText: '',
        hasAsunaBuff: false, hasRamBuff: false, hasRemBuff: false,
        silenced: false, costReducer: 0, damageReduce: 0,
        shalltearBleedTurns: 0, paralyzeTurns: 0, freezeTurns: 0,
        bleedTurns: 0, burnTurns: 0, immortalTurns: 0,
        goldenBuffExpires: [], poseidonReduceTurn: 0,
        queenImmortalTurns: 0, escutcheonTurns: 0,
        tossakanImmortalTurns: 0, tossakanImmune: false,
        tossakanPermanentReduce: false, isSun: false,
        herculesExtraLives: 0, natureWandUsed: false,
        clayBarrierTurns: 0, tempBuffs: [], altairLastKilledAtk: 0
    };
}

// ─── BUY PACK ────────────────────────────────────────────────────
function buyFrierenPack() {
    if (!_isFrierenPackAvailable()) {
        showToast('⏰ Frieren Pack หมดเขตแล้ว!', '#f87171'); return;
    }
    const COST = 99;
    if ((playerData.gems || 0) < COST) {
        showToast(`💎 Gem ไม่พอ! ต้องการ ${COST} gems`, '#f87171'); return;
    }
    playerData.gems -= COST;

    // เพิ่มลง collection ด้วย key "CardName|frieren_mage"
    ['Frieren', 'Concealment Magic', 'Zoltraak', 'Analysis'].forEach(n => {
        const key = `${n}|frieren_mage`;
        playerData.collection[key] = (playerData.collection[key] || 0) + 1;
    });
    playerData.easterTokens = (playerData.easterTokens || 0) + 20;

    saveData();
    updateHubUI();
    _showFrierenRevealScreen();
}

// ─── REVEAL SCREEN ───────────────────────────────────────────────
function _showFrierenRevealScreen() {
    const ov = document.createElement('div');
    ov.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,0.95);z-index:9900;display:flex;align-items:center;justify-content:center';
    ov.innerHTML = `
<div style="background:linear-gradient(135deg,#0d0b2e,#1a1247,#0f0c29);
     border:3px solid #818cf8;border-radius:28px;padding:32px 22px;
     max-width:460px;width:92%;text-align:center;
     box-shadow:0 0 80px rgba(129,140,248,0.5)">

  <div style="font-size:2.8rem;margin-bottom:4px">✨</div>
  <div style="font-size:1.35rem;font-weight:900;color:#a5b4fc;margin-bottom:2px">
    Frieren: Mage of the Endless Journey
  </div>
  <div style="font-size:0.68rem;color:#6b7280;margin-bottom:22px">การ์ดถูกเพิ่มใน Collection แล้ว</div>

  <div style="display:flex;gap:8px;justify-content:center;flex-wrap:wrap;margin-bottom:18px">
    ${[
      ['Frieren','★ Legendary','#fb923c', FRIEREN_ART_NORMAL],
      ['Concealment Magic','✦ Spell','#818cf8', FRIEREN_ART_NORMAL],
      ['Zoltraak','✦ Spell','#a78bfa', ZOLTRAAK_ART],
      ['Analysis','✦ Spell','#60a5fa', FRIEREN_ART_NORMAL],
    ].map(([n,r,col,art])=>`
      <div style="width:84px;border-radius:12px;overflow:hidden;border:2.5px solid ${col};
           box-shadow:0 0 16px ${col}55;background:#0f0c29;flex-shrink:0">
        <img src="${art}" style="width:100%;height:58px;object-fit:cover"
             onerror="this.style.background='#1f2937'">
        <div style="padding:4px 3px;background:rgba(0,0,0,0.7)">
          <div style="font-size:0.5rem;font-weight:900;color:${col};text-align:center">${r}</div>
          <div style="font-size:0.58rem;font-weight:800;color:white;text-align:center;
               white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${n}</div>
        </div>
      </div>`).join('')}
  </div>

  <div style="background:linear-gradient(135deg,#1a0a1e,#2d0f3e);
       border:2px solid #f472b6;border-radius:14px;
       padding:12px 18px;margin-bottom:18px;display:flex;align-items:center;gap:12px">
    <span style="font-size:1.8rem">🐣</span>
    <div style="text-align:left">
      <div style="font-size:0.95rem;font-weight:900;color:#f9a8d4">+20 Easter Token!</div>
      <div style="font-size:0.65rem;color:#9ca3af">สะสมสำหรับร้านค้า Easter ในอนาคต</div>
    </div>
  </div>

  <div style="background:rgba(129,140,248,0.1);border:1px solid #4338ca;
       border-radius:10px;padding:8px 12px;margin-bottom:18px;font-size:0.68rem;color:#a5b4fc">
    🎨 Frieren มี 2 Art Style (Normal / Easter) — สลับได้ใน Collection
  </div>

  <button onclick="this.closest('div[style*=fixed]').remove();renderPacksPanel()"
    style="background:linear-gradient(135deg,#4f46e5,#6366f1);color:white;border:none;
           padding:13px 38px;border-radius:16px;font-weight:900;font-size:1.1rem;cursor:pointer;
           box-shadow:0 0 22px rgba(99,102,241,0.5)">
    ✨ Wunderbar!
  </button>
</div>`;
    document.body.appendChild(ov);
}

// ─── ART SWITCHER ─────────────────────────────────────────────────
function switchCardArt(cardName, style) {
    if (!playerData.selectedArts) playerData.selectedArts = {};
    playerData.selectedArts[cardName] = style;
    saveData();
    showToast(`🎨 เปลี่ยน Art ของ ${cardName} → ${ART_STYLE_LABELS[style]?.label || style}`, '#a5b4fc');
    showCardDetailModal(cardName, 'frieren_mage');
}

// ─── COUNTDOWN LABEL ─────────────────────────────────────────────
function _frierenCountdown() {
    const diff = FRIEREN_PACK_EXPIRY - new Date();
    if (diff <= 0) return '⏰ หมดเขตแล้ว';
    const d = Math.floor(diff / 86400000);
    const h = Math.floor((diff % 86400000) / 3600000);
    const m = Math.floor((diff % 3600000) / 60000);
    if (d > 0) return `⏳ เหลือ ${d} วัน ${h} ชม.`;
    return `⏳ เหลือ ${h} ชม. ${m} นาที`;
}

// ─────────────────────────────────────────────────────────────────
// DOM READY — patch everything
// ─────────────────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {

    // 1. ใส่การ์ดใน CardSets แต่ไม่ใส่ SETS_META → ไม่โผล่ใน pack dropdown
    if (typeof CardSets !== 'undefined') {
        CardSets['frieren_mage'] = {};
        Object.entries(_FRIEREN_CARDS_TPL).forEach(([k, v]) => {
            CardSets['frieren_mage'][k] = JSON.parse(JSON.stringify(v));
        });
        // altArts ต้องใส่หลัง JSON.parse (object deep copy ไม่ลบ)
        if (!CardSets['frieren_mage']['Frieren'].altArts) {
            CardSets['frieren_mage']['Frieren'].altArts = _FRIEREN_CARDS_TPL['Frieren'].altArts;
        }
    }

    // 2. Init playerData
    if (typeof playerData !== 'undefined') {
        if (!playerData.selectedArts)              playerData.selectedArts = {};
        if (playerData.easterTokens === undefined) playerData.easterTokens = 0;
    }

    // 3. เสียง summon Frieren
    if (typeof cardSounds !== 'undefined') {
        cardSounds['Frieren'] = new Audio('https://files.catbox.moe/amtd5f.mp3');
        cardSounds['Frieren'].volume = 0.75;
    }

    // 4. triggerOnSummon → Frieren summon effect (สุ่ม ally)
    if (typeof triggerOnSummon === 'function') {
        const _orig = triggerOnSummon;
        window.triggerOnSummon = function(card, playerKey) {
            _orig(card, playerKey);
            const eff = card.originalName || card.name;
            if (eff === 'Frieren' && !card._frierenSummonDone) {
                card._frierenSummonDone = true;
                const p = state.players[playerKey];
                const others = p.field.filter(c =>
                    c.id !== card.id && c.type === 'Character' &&
                    typeof getCharStats === 'function' && getCharStats(c).hp > 0
                );
                if (others.length > 0) {
                    const pick = others[Math.floor(Math.random() * others.length)];
                    pick.immortalTurns = Math.max(pick.immortalTurns || 0, 4);
                    if (typeof log === 'function')
                        log(`✨ [Frieren] ${pick.name} ได้รับ Immortal 2 เทิร์น!`, 'text-indigo-300 font-bold');
                } else {
                    if (typeof log === 'function')
                        log(`✨ [Frieren] ไม่มี Character อื่นบนสนาม`, 'text-indigo-400');
                }
            }
        };
    }

    // 5. resolveEndPhase → Frieren end-of-turn (สุ่ม spell)
    if (typeof resolveEndPhase === 'function') {
        const _orig = resolveEndPhase;
        window.resolveEndPhase = function(playerKey) {
            _orig(playerKey);
            _frierenEndOfTurn(playerKey);
        };
    }

    // 6. executeNonTargetAction → Frieren spells ทำงานแบบ non-target
    if (typeof executeNonTargetAction === 'function') {
        const _orig = executeNonTargetAction;
        window.executeNonTargetAction = function(card, playerKey) {
            if (card.isFrierenSpell || card._theme === 'frieren_mage') {
                _execFrierenSpell(card, playerKey);
                return;
            }
            _orig(card, playerKey);
        };
    }

    // 7. renderCard → ใส่ art override จาก selectedArts
    if (typeof renderCard === 'function') {
        const _orig = renderCard;
        window.renderCard = function(card, inHand, displayCost, currentStats) {
            if (card && typeof playerData !== 'undefined' && playerData.selectedArts) {
                const style = playerData.selectedArts[card.originalName || card.name];
                if (style) {
                    const altArts = card.altArts ||
                        _FRIEREN_CARDS_TPL[card.originalName || card.name]?.altArts;
                    if (altArts?.[style]) {
                        card = Object.assign({}, card, { art: altArts[style] });
                    }
                }
            }
            return _orig(card, inHand, displayCost, currentStats);
        };
    }

    // 8. renderPacksPanel → เพิ่ม Frieren section ท้าย
    if (typeof renderPacksPanel === 'function') {
        const _orig = renderPacksPanel;
        window.renderPacksPanel = function() {
            _orig();
            _appendFrierenSection();
        };
    }

    // 9. showCardDetailModal → inject Art Switcher
    if (typeof showCardDetailModal === 'function') {
        const _orig = showCardDetailModal;
        window.showCardDetailModal = function(name, theme) {
            _orig(name, theme);
            const src = _FRIEREN_CARDS_TPL[name];
            if (src?.altArts && Object.keys(src.altArts).length > 1) {
                _injectArtSwitcher(name, src.altArts);
            }
        };
    }

    // 10. updateHubUI → Easter Token display
    if (typeof updateHubUI === 'function') {
        const _orig = updateHubUI;
        window.updateHubUI = function() {
            _orig();
            _patchEasterDisplay();
        };
    }

    // 11. backward-compat: patch playerData สำหรับ session ที่โหลดมาก่อน
    setTimeout(() => {
        if (typeof playerData !== 'undefined') {
            if (!playerData.selectedArts)              playerData.selectedArts = {};
            if (playerData.easterTokens === undefined) playerData.easterTokens = 0;
        }
    }, 0);
});

// ─── FRIEREN END-OF-TURN: สุ่ม Spell 2 ใบ ─────────────────────────
function _frierenEndOfTurn(playerKey) {
    const p = state.players[playerKey];
    p.field.forEach(c => {
        const eff = (c.name.startsWith('Shadow Token') || c.name.startsWith('Shadow army') ||
                     c.name.includes('Loki Clone'))
            ? (c.originalName || c.name) : c.name;
        if (eff !== 'Frieren') return;
        if (typeof getCharStats === 'function' && getCharStats(c).hp <= 0) return;
        if (c.silenced) return;

        // สุ่ม — ไม่ได้เรียงตามลำดับ
        const spellName = FRIEREN_SPELL_NAMES[Math.floor(Math.random() * FRIEREN_SPELL_NAMES.length)];
        for (let i = 0; i < 2; i++) {
            const sp = _mkFrierenSpell(spellName);
            if (sp) p.hand.push(sp);
        }
        if (typeof log === 'function')
            log(`✨ [Frieren] จบเทิร์น: เพิ่ม ${spellName} ×2 เข้ามือ!`, 'text-indigo-300 font-bold');
    });
}

// ─── FRIEREN SPELLS: ทั้งหมดเป็น non-target (สุ่ม) ─────────────────
function _execFrierenSpell(card, playerKey) {
    const p      = state.players[playerKey];
    const oppKey = playerKey === 'player' ? 'ai' : 'player';
    const opp    = state.players[oppKey];

    if (card.name === 'Concealment Magic') {
        // สุ่ม Character ฝั่งเรา → Immortal 2 เทิร์น
        const allies = p.field.filter(c =>
            c.type === 'Character' &&
            typeof getCharStats === 'function' && getCharStats(c).hp > 0);
        if (allies.length > 0) {
            const pick = allies[Math.floor(Math.random() * allies.length)];
            pick.immortalTurns = Math.max(pick.immortalTurns || 0, 4);
            if (typeof log === 'function')
                log(`🌫️ [Concealment Magic] ${pick.name} ซ่อนตัว — อมตะ 2 เทิร์น! ✨`, 'text-indigo-300 font-bold');
        } else {
            if (typeof log === 'function')
                log(`🌫️ [Concealment Magic] ไม่มี Character บนสนาม`, 'text-indigo-400');
        }
    }
    else if (card.name === 'Zoltraak') {
        // สุ่ม Character ศัตรู → ทำลายทันที
        const enemies = opp.field.filter(c =>
            c.type === 'Character' &&
            typeof getCharStats === 'function' && getCharStats(c).hp > 0);
        if (enemies.length > 0) {
            const pick = enemies[Math.floor(Math.random() * enemies.length)];
            const n = pick.name;
            pick.hp = -99;
            if (typeof log === 'function')
                log(`🔮 [Zoltraak] Standard Anti-Mage Offensive Spell — ${n} ถูกทำลาย! 💜`, 'text-violet-400 font-bold');
            if (typeof checkDeath === 'function') checkDeath(oppKey);
        } else {
            if (typeof log === 'function')
                log(`🔮 [Zoltraak] ไม่มี Character ศัตรูให้โจมตี`, 'text-violet-400');
        }
    }
    else if (card.name === 'Analysis') {
        // สุ่ม Spell อื่นในมือ → Cost 0
        const spells = p.hand.filter(c => c.type === 'Spell' && c.id !== card.id);
        if (spells.length > 0) {
            const pick = spells[Math.floor(Math.random() * spells.length)];
            pick.costReducer = (pick.costReducer || 0) + pick.cost;
            if (typeof log === 'function')
                log(`🔍 [Analysis] ${pick.name} Cost → 0 ✨`, 'text-sky-300 font-bold');
        } else {
            if (typeof log === 'function')
                log(`🔍 [Analysis] ไม่มี Spell อื่นในมือ`, 'text-sky-500');
        }
    }

    p.graveyard.push(card);
}

// ─── APPEND FRIEREN SECTION ในหน้า Packs ─────────────────────────
function _appendFrierenSection() {
    const panel = document.getElementById('hub-panel-packs');
    if (!panel) return;
    const old = document.getElementById('_frieren-gem-sec');
    if (old) old.remove();

    const available = _isFrierenPackAvailable();
    const countdown = _frierenCountdown();
    const gems      = (typeof playerData !== 'undefined') ? (playerData.gems || 0) : 0;
    const easterTk  = (typeof playerData !== 'undefined') ? (playerData.easterTokens || 0) : 0;
    const owned     = (typeof playerData !== 'undefined')
                      ? (playerData.collection['Frieren|frieren_mage'] || 0) : 0;
    const canBuy    = available && gems >= 99;

    const sec = document.createElement('div');
    sec.id    = '_frieren-gem-sec';
    sec.style.cssText = 'padding:0 0 24px';
    sec.innerHTML = `
<!-- Divider -->
<div style="display:flex;align-items:center;gap:10px;margin:10px 0 14px">
  <div style="flex:1;height:1px;background:linear-gradient(90deg,transparent,#818cf8)"></div>
  <div style="font-size:0.75rem;font-weight:900;color:#818cf8;letter-spacing:1px">💎 GEM SHOP</div>
  <div style="flex:1;height:1px;background:linear-gradient(90deg,#818cf8,transparent)"></div>
</div>

<!-- Balances row -->
<div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-bottom:14px">
  <div style="background:#111827;border:1px solid #374151;border-radius:12px;
       padding:10px 14px;display:flex;align-items:center;gap:10px">
    <span style="font-size:1.3rem">💎</span>
    <div>
      <div style="font-size:0.68rem;color:#6b7280">Gems ของคุณ</div>
      <div style="font-size:1.1rem;font-weight:900;color:#93c5fd">${gems}</div>
    </div>
  </div>
  <div style="background:#1a0a2e;border:1px solid #9d174d55;border-radius:12px;
       padding:10px 14px;display:flex;align-items:center;gap:10px">
    <span style="font-size:1.3rem">🐣</span>
    <div>
      <div style="font-size:0.68rem;color:#6b7280">Easter Token</div>
      <div style="font-size:1.1rem;font-weight:900;color:#f9a8d4">${easterTk}</div>
    </div>
  </div>
</div>

<!-- Pack card -->
<div style="background:linear-gradient(135deg,#0d0b2e,#1a1247);
     border:2.5px solid ${available ? '#818cf8' : '#374151'};border-radius:20px;overflow:hidden;
     box-shadow:0 0 ${available ? '36px rgba(129,140,248,0.22)' : 'none'}">

  <!-- Header art -->
  <div style="position:relative;height:148px;overflow:hidden">
    <img src="${FRIEREN_ART_NORMAL}"
         style="width:100%;height:100%;object-fit:cover;filter:brightness(${available ? '0.6' : '0.28'})"
         onerror="this.style.display='none'">
    <div style="position:absolute;inset:0;background:linear-gradient(to bottom,transparent 25%,#0d0b2e)"></div>
    <!-- Badges -->
    <div style="position:absolute;top:10px;left:12px;
         background:${available ? 'rgba(220,38,38,0.88)' : 'rgba(55,65,81,0.9)'};
         border:1.5px solid ${available ? '#fca5a5' : '#4b5563'};
         border-radius:20px;padding:3px 10px;font-size:0.64rem;font-weight:900;
         color:${available ? '#fca5a5' : '#9ca3af'}">
      ${available ? '⏱️ LIMITED TIME' : '🔒 หมดเขตแล้ว'}
    </div>
    ${owned > 0 ? `<div style="position:absolute;top:10px;right:12px;
         background:rgba(0,80,0,0.85);border:1.5px solid #4ade80;
         border-radius:20px;padding:3px 10px;font-size:0.64rem;font-weight:900;color:#4ade80">
         ✓ มีแล้ว ×${owned}</div>` : ''}
    <div style="position:absolute;bottom:12px;left:14px">
      <div style="font-size:1.08rem;font-weight:900;color:white;text-shadow:0 2px 8px rgba(0,0,0,0.9)">
        Frieren: Mage of the Endless Journey
      </div>
      <div style="font-size:0.66rem;color:${available ? '#a5b4fc' : '#6b7280'}">${countdown}</div>
    </div>
  </div>

  <!-- Body -->
  <div style="padding:16px">
    <!-- Card previews -->
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:7px;margin-bottom:13px">
      ${[
        ['Frieren','★ Legendary','#fb923c', FRIEREN_ART_NORMAL,'Cost 9 · ATK 5 / HP 5'],
        ['Concealment Magic','✦ Spell','#818cf8', FRIEREN_ART_NORMAL,'Cost 5 · สุ่ม Immortal'],
        ['Zoltraak','✦ Spell','#a78bfa', ZOLTRAAK_ART,'Cost 5 · สุ่มทำลายศัตรู'],
        ['Analysis','✦ Spell','#60a5fa', FRIEREN_ART_NORMAL,'Cost 1 · Spell อื่น Cost 0'],
      ].map(([n,r,col,art,sub])=>`
        <div style="background:#0a0916;border:1px solid ${col}44;border-radius:10px;
             display:flex;align-items:center;gap:8px;padding:7px 8px;overflow:hidden">
          <img src="${art}" style="width:38px;height:38px;object-fit:cover;border-radius:7px;
               flex-shrink:0;border:1.5px solid ${col}55" onerror="this.style.display='none'">
          <div style="min-width:0">
            <div style="font-size:0.5rem;color:${col};font-weight:700">${r}</div>
            <div style="font-size:0.6rem;color:white;font-weight:800;
                 white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${n}</div>
            <div style="font-size:0.48rem;color:#6b7280">${sub}</div>
          </div>
        </div>`).join('')}
    </div>

    <!-- Easter token bonus -->
    <div style="background:linear-gradient(135deg,#1a0a2e,#2d0f3e);
         border:1.5px solid #f472b655;border-radius:12px;
         padding:10px 14px;margin-bottom:11px;display:flex;align-items:center;gap:12px">
      <span style="font-size:1.7rem">🐣</span>
      <div>
        <div style="font-size:0.82rem;font-weight:900;color:#f9a8d4">+20 Easter Token</div>
        <div style="font-size:0.6rem;color:#9ca3af">สะสมสำหรับร้านค้า Easter ในอนาคต</div>
      </div>
    </div>

    <!-- Art note -->
    <div style="background:rgba(129,140,248,0.1);border:1px solid #4338ca;
         border-radius:10px;padding:7px 11px;margin-bottom:14px;
         font-size:0.66rem;color:#a5b4fc;text-align:center">
      🎨 Frieren มี 2 Art Style — Normal &amp; Easter · สลับได้ใน Collection
    </div>

    <!-- Price + Buy -->
    <div style="display:flex;align-items:center;gap:12px">
      <div style="flex:1">
        <div style="font-size:1.25rem;font-weight:900;color:${available ? '#93c5fd' : '#6b7280'}">
          💎 99 Gems
        </div>
        <div style="font-size:0.6rem;color:#6b7280">หมดเขต 26 เม.ย. 2026</div>
      </div>
      <button onclick="buyFrierenPack()"
        ${canBuy ? '' : 'disabled'}
        style="background:${canBuy ? 'linear-gradient(135deg,#4f46e5,#6366f1)' : '#374151'};
               color:${canBuy ? 'white' : '#6b7280'};border:none;
               padding:13px 22px;border-radius:14px;font-weight:900;font-size:0.9rem;
               cursor:${canBuy ? 'pointer' : 'not-allowed'};white-space:nowrap;
               box-shadow:${canBuy ? '0 0 18px rgba(99,102,241,0.5)' : 'none'}">
        ${!available ? '🔒 หมดเขต' : gems < 99 ? '💎 ไม่พอ' : '✨ ซื้อเลย!'}
      </button>
    </div>
  </div>
</div>`;

    const inner = panel.querySelector('div[style*="max-width:700px"]') || panel;
    inner.appendChild(sec);
}

// ─── ART SWITCHER in Card Detail Modal ───────────────────────────
function _injectArtSwitcher(cardName, altArts) {
    const modal = document.getElementById('col-card-modal');
    if (!modal) return;
    const old = modal.querySelector('#_frieren-art-sw');
    if (old) old.remove();

    const current = (playerData.selectedArts || {})[cardName] || 'normal';
    const row = modal.querySelector('div[style*="display:flex;gap:8px"]');
    if (!row) return;

    const wrap = document.createElement('div');
    wrap.id = '_frieren-art-sw';
    wrap.style.cssText = 'padding:0 18px 14px';
    wrap.innerHTML = `
<div style="background:linear-gradient(135deg,#0d0b2e,#1a1247);
     border:1.5px solid #818cf8;border-radius:14px;padding:14px">
  <div style="font-size:0.6rem;color:#818cf8;font-weight:900;text-transform:uppercase;
       letter-spacing:0.8px;margin-bottom:10px">🎨 เลือก Art Style</div>
  <div style="display:flex;gap:8px">
    ${Object.entries(altArts).map(([style, url]) => {
      const cfg = ART_STYLE_LABELS[style] || { label: style, color: '#9ca3af' };
      const active = current === style;
      return `
      <div onclick="switchCardArt(${JSON.stringify(cardName)},${JSON.stringify(style)})"
           style="flex:1;border:2.5px solid ${active ? cfg.color : '#374151'};
                  border-radius:10px;overflow:hidden;cursor:pointer;
                  box-shadow:${active ? `0 0 14px ${cfg.color}88` : 'none'};
                  transition:all 0.2s">
        <img src="${url}" style="width:100%;height:68px;object-fit:cover;display:block"
             onerror="this.style.display='none'">
        <div style="background:rgba(0,0,0,0.82);padding:5px 4px;text-align:center">
          <div style="font-size:0.62rem;font-weight:900;color:${cfg.color}">${cfg.label}</div>
          ${active ? `<div style="font-size:0.52rem;color:#4ade80">✓ กำลังใช้</div>` : ''}
        </div>
      </div>`;
    }).join('')}
  </div>
</div>`;
    row.parentNode.insertBefore(wrap, row);
}

// ─── EASTER TOKEN DISPLAY (ต่อท้าย gem ใน Home panel) ───────────
function _patchEasterDisplay() {
    const tk = (typeof playerData !== 'undefined') ? (playerData.easterTokens || 0) : 0;
    let el = document.getElementById('_hub-easter-tk');
    if (el) { el.textContent = `🐣 ${tk}`; return; }
    const homePanel = document.getElementById('hub-panel-home');
    if (!homePanel) return;
    const gemsLine = homePanel.querySelector('[style*="93c5fd"]');
    if (!gemsLine) return;
    const div = document.createElement('div');
    div.id = '_hub-easter-tk';
    div.style.cssText = 'font-size:0.85rem;font-weight:800;color:#f9a8d4';
    div.textContent = `🐣 ${tk}`;
    gemsLine.parentNode?.insertBefore(div, gemsLine.nextSibling);
}
