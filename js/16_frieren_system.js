// ============================================================
// 16_frieren_system.js
// Frieren: Mage of the Endless Journey — Pack + ArtStyle System
// Load this LAST (after all other scripts) in index_v2.html
// ============================================================

// ─── CARD DEFINITIONS ─────────────────────────────────────────────
const FRIEREN_CARDS = {
    'Frieren': {
        name: 'Frieren', type: 'Character', cost: 9, atk: 5, hp: 5, maxHp: 5,
        text: 'Summon: ทำให้ Character ฝั่งเราอีก 1 ตัวอมตะ 2 เทิร์น | จบเทิร์น: เพิ่ม Spell 2 ใบเข้ามือ (หมุนเวียน 1/3)',
        color: 'bg-indigo-400', maxAttacks: 1,
        art: 'https://files.catbox.moe/1qkif5.jpg',
        altArts: {
            normal: 'https://files.catbox.moe/1qkif5.jpg',
            easter: 'https://files.catbox.moe/4bszmx.jpg'
        }
    },
    'Concealment Magic': {
        name: 'Concealment Magic', type: 'Spell', cost: 5,
        text: 'Spell: ทำให้ Character ฝั่งเรา 1 ตัวอมตะ 2 เทิร์น',
        color: 'bg-indigo-700',
        requiresTarget: true, targetEnemy: false,
        art: 'https://i.pinimg.com/736x/8b/0f/3a/8b0f3a8e9c5d6f1b2e4a7c9d0e2f5a8b.jpg'
    },
    'Zoltraak': {
        name: 'Zoltraak', type: 'Spell', cost: 5,
        text: 'Spell: ทำลาย Character ศัตรู 1 ตัว',
        color: 'bg-violet-700',
        requiresTarget: true, targetEnemy: true,
        art: 'https://i.pinimg.com/736x/4c/9a/2e/4c9a2e7f1b8d5c3a6e0f9b4d7c2a1e5f.jpg'
    },
    'Analysis': {
        name: 'Analysis', type: 'Spell', cost: 1,
        text: 'Spell: ทำให้ Spell Card อื่นใน Hand 1 ใบ Cost 0',
        color: 'bg-sky-700',
        art: 'https://i.pinimg.com/736x/2d/5f/8a/2d5f8a1c3e7b9d4f0a6c2e8b5d1f7a3c.jpg'
    }
};

// Spell rotation order
const FRIEREN_SPELL_CYCLE = ['Concealment Magic', 'Zoltraak', 'Analysis'];

// Art style labels
const ART_STYLE_LABELS = {
    normal: { label: '🖼️ Normal', color: '#9ca3af' },
    easter: { label: '🐣 Easter', color: '#f472b6' }
};

// ─── HELPER: create Frieren spell instance ────────────────────────
function _createFrierenSpell(spellName) {
    const tpl = FRIEREN_CARDS[spellName];
    if (!tpl || typeof cardIdCounter === 'undefined') return null;
    return {
        id: 'card_' + (cardIdCounter++),
        name: tpl.name,
        originalName: tpl.name,
        type: 'Spell',
        cost: tpl.cost,
        atk: 0, hp: 0, maxHp: 0,
        text: tpl.text,
        color: tpl.color,
        maxAttacks: 0, attacksLeft: 0,
        requiresTarget: tpl.requiresTarget || false,
        targetEnemy: tpl.targetEnemy || false,
        art: tpl.art,
        status: [], items: [], stolenText: '',
        hasAsunaBuff: false, hasRamBuff: false, hasRemBuff: false,
        silenced: false, costReducer: 0, damageReduce: 0,
        shalltearBleedTurns: 0, paralyzeTurns: 0, freezeTurns: 0,
        bleedTurns: 0, burnTurns: 0,
        goldenBuffExpires: [], poseidonReduceTurn: 0,
        tossakanPermanentReduce: false, queenImmortalTurns: 0,
        isSun: false, herculesExtraLives: 0,
        natureWandUsed: false, escutcheonTurns: 0,
        tossakanImmortalTurns: 0, tossakanImmune: false,
        immortalTurns: 0, clayBarrierTurns: 0, tempBuffs: [],
        altairLastKilledAtk: 0,
        _theme: 'frieren_mage',
        isFrierenSpell: true
    };
}

// ─── BUY FRIEREN PACK ─────────────────────────────────────────────
function buyFrierenPack() {
    const COST_GEMS = 99;
    if ((playerData.gems || 0) < COST_GEMS) {
        showToast(`💎 Gem ไม่พอ! ต้องการ 💎 ${COST_GEMS}`, '#f87171');
        return;
    }
    playerData.gems -= COST_GEMS;

    // Add cards to collection
    ['Frieren', 'Concealment Magic', 'Zoltraak', 'Analysis'].forEach(n => {
        const key = `${n}|frieren_mage`;
        playerData.collection[key] = (playerData.collection[key] || 0) + 1;
    });

    // Easter Tokens x20
    playerData.easterTokens = (playerData.easterTokens || 0) + 20;

    saveData();
    updateHubUI();
    _showFrierenPackReveal();
    setTimeout(() => checkCollectionMilestones(), 3000);
}

function _showFrierenPackReveal() {
    const overlay = document.createElement('div');
    overlay.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,0.94);z-index:9900;display:flex;align-items:center;justify-content:center;animation:fadeIn 0.4s ease';
    overlay.innerHTML = `
    <div style="background:linear-gradient(135deg,#0d0b2e,#1a1247,#0f0c29);
         border:3px solid #818cf8;border-radius:28px;padding:32px 24px;
         max-width:480px;width:92%;text-align:center;
         box-shadow:0 0 80px rgba(129,140,248,0.5),0 0 160px rgba(129,140,248,0.2)">

      <!-- Header -->
      <div style="font-size:2.8rem;margin-bottom:4px">✨</div>
      <div style="font-size:1.5rem;font-weight:900;color:#a5b4fc;letter-spacing:0.5px;margin-bottom:2px">
        Frieren: Mage of the Endless Journey
      </div>
      <div style="font-size:0.75rem;color:#6b7280;margin-bottom:24px">Pack เปิดแล้ว — การ์ดถูกเพิ่มใน Collection ของคุณแล้ว</div>

      <!-- Cards row -->
      <div style="display:flex;gap:10px;justify-content:center;flex-wrap:wrap;margin-bottom:20px">
        ${['Frieren','Concealment Magic','Zoltraak','Analysis'].map(n => {
            const d = FRIEREN_CARDS[n];
            const isChar = d.type === 'Character';
            const color = isChar ? '#fb923c' : '#818cf8';
            return `<div style="width:88px;border-radius:14px;overflow:hidden;border:2.5px solid ${color};
                    box-shadow:0 0 18px ${color}66;background:#0f0c29;flex-shrink:0">
              <img src="${d.art}" style="width:100%;height:62px;object-fit:cover"
                   onerror="this.parentElement.querySelector('.art-fallback').style.display='flex';this.style.display='none'">
              <div class="art-fallback" style="display:none;width:100%;height:62px;background:#1f2937;align-items:center;justify-content:center;font-size:1.6rem">✨</div>
              <div style="padding:4px 3px;background:rgba(0,0,0,0.7)">
                <div style="font-size:0.55rem;font-weight:900;color:${color};text-align:center;letter-spacing:0.3px">${d.type === 'Character' ? '★ Legendary' : '✦ Spell'}</div>
                <div style="font-size:0.6rem;font-weight:800;color:white;text-align:center;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${n}</div>
              </div>
            </div>`;
        }).join('')}
      </div>

      <!-- Easter Token bonus -->
      <div style="background:linear-gradient(135deg,#1a0a1e,#2d0f3e);border:2px solid #f472b6;
           border-radius:16px;padding:14px 20px;margin-bottom:20px;
           box-shadow:0 0 24px rgba(244,114,182,0.3)">
        <div style="font-size:1.8rem;margin-bottom:4px">🐣</div>
        <div style="font-size:1rem;font-weight:900;color:#f9a8d4;margin-bottom:2px">+20 Easter Token!</div>
        <div style="font-size:0.7rem;color:#9ca3af">สะสมสำหรับร้านค้า Easter ในอนาคต</div>
      </div>

      <!-- Frieren art style note -->
      <div style="background:rgba(129,140,248,0.1);border:1px solid #4338ca;
           border-radius:12px;padding:10px 14px;margin-bottom:20px;font-size:0.72rem;color:#a5b4fc">
        🎨 Frieren มี 2 Art Style — สลับได้ใน Collection → คลิก Frieren → เปลี่ยน Art
      </div>

      <button onclick="this.closest('div[style*=fixed]').remove();renderPacksPanel()"
        style="background:linear-gradient(135deg,#4f46e5,#6366f1);color:white;border:none;
               padding:14px 40px;border-radius:16px;font-weight:900;font-size:1.1rem;cursor:pointer;
               box-shadow:0 0 24px rgba(99,102,241,0.5);letter-spacing:0.5px">
        🌸 Wunderbar!
      </button>
    </div>`;
    document.body.appendChild(overlay);
}

// ─── SWITCH CARD ART ──────────────────────────────────────────────
function switchCardArt(cardName, style) {
    if (!playerData.selectedArts) playerData.selectedArts = {};
    playerData.selectedArts[cardName] = style;
    saveData();
    updateHubUI();
    showToast(`🎨 เปลี่ยน Art ของ ${cardName} เป็น ${ART_STYLE_LABELS[style]?.label || style}`, '#a5b4fc');
    // Re-open modal to reflect change
    showCardDetailModal(cardName, 'frieren_mage');
}

// ─── DOM CONTENT LOADED: patch everything ─────────────────────────
document.addEventListener('DOMContentLoaded', function () {

    // ── 1. Extend CardSets ──────────────────────────────────────────
    if (typeof CardSets !== 'undefined') {
        CardSets['frieren_mage'] = JSON.parse(JSON.stringify(FRIEREN_CARDS));
        // Restore altArts (JSON.stringify strips no functions but keeps objects)
        CardSets['frieren_mage']['Frieren'].altArts = FRIEREN_CARDS['Frieren'].altArts;
    }

    // ── 2. Extend SETS_META ────────────────────────────────────────
    if (typeof SETS_META !== 'undefined') {
        SETS_META['frieren_mage'] = {
            label: 'Frieren: Mage',
            emoji: '✨',
            mascot: 'Frieren',
            mascotArt: 'https://files.catbox.moe/1qkif5.jpg'
        };
    }

    // ── 3. Init playerData fields ──────────────────────────────────
    if (typeof playerData !== 'undefined') {
        if (!playerData.selectedArts)   playerData.selectedArts  = {};
        if (playerData.easterTokens === undefined) playerData.easterTokens = 0;
    }

    // ── 4. Register Frieren summon sound ───────────────────────────
    if (typeof cardSounds !== 'undefined') {
        cardSounds['Frieren'] = new Audio('https://files.catbox.moe/amtd5f.mp3');
        cardSounds['Frieren'].volume = 0.75;
    }

    // ── 5. Patch triggerOnSummon → Frieren on-summon ───────────────
    if (typeof triggerOnSummon === 'function') {
        const _origTriggerOnSummon = triggerOnSummon;
        triggerOnSummon = function (card, playerKey) {
            _origTriggerOnSummon(card, playerKey);
            const eff = card.name;
            if (eff === 'Frieren' && !card.frierenSummonDone) {
                card.frierenSummonDone = true;
                const p = state.players[playerKey];
                const others = p.field.filter(c =>
                    c.id !== card.id && c.type === 'Character' &&
                    typeof getCharStats === 'function' && getCharStats(c).hp > 0
                );
                if (others.length > 0) {
                    const target = others[Math.floor(Math.random() * others.length)];
                    target.immortalTurns = Math.max(target.immortalTurns || 0, 4);
                    if (typeof log === 'function')
                        log(`✨ [Frieren] เวทย์ปกป้อง ${target.name}! อมตะ 2 เทิร์น ✨`, 'text-indigo-300 font-bold');
                } else {
                    if (typeof log === 'function')
                        log(`✨ [Frieren] ไม่มี Character อื่นบนสนาม ไม่สามารถปกป้องได้`, 'text-indigo-400');
                }
                // Initialize spell cycle on the card
                if (typeof card.frienSpellCycle !== 'number') card.frienSpellCycle = 0;
            }
        };
    }

    // ── 6. Patch resolveEndPhase → Frieren end-of-turn spells ──────
    if (typeof resolveEndPhase === 'function') {
        const _origResolveEndPhase = resolveEndPhase;
        resolveEndPhase = function (playerKey) {
            _origResolveEndPhase(playerKey);
            _frierenEndOfTurn(playerKey);
        };
    }

    // ── 7. Patch executeNonTargetAction → Analysis spell ──────────
    if (typeof executeNonTargetAction === 'function') {
        const _origExecNonTarget = executeNonTargetAction;
        executeNonTargetAction = function (card, playerKey) {
            // Handle Frieren spells FIRST before original (original would no-op them)
            if (card.isFrierenSpell || card._theme === 'frieren_mage') {
                _executeFrierenSpell(card, playerKey);
                return;
            }
            _origExecNonTarget(card, playerKey);
        };
    }

    // ── 8. Patch executeTargetedAction → Concealment Magic & Zoltraak
    if (typeof executeTargetedAction === 'function') {
        const _origExecTargeted = executeTargetedAction;
        executeTargetedAction = function (card, playerKey, targetChar) {
            if (card.isFrierenSpell || card._theme === 'frieren_mage') {
                _executeFrierenTargetedSpell(card, playerKey, targetChar);
                return;
            }
            _origExecTargeted(card, playerKey, targetChar);
        };
    }

    // ── 9. Patch renderCard → art override ────────────────────────
    if (typeof renderCard === 'function') {
        const _origRenderCard = renderCard;
        renderCard = function (card, inHand, displayCost, currentStats) {
            // Apply selectedArts override
            if (card && typeof playerData !== 'undefined' && playerData.selectedArts) {
                const artKey = card.name;
                const selectedStyle = playerData.selectedArts[artKey];
                if (selectedStyle) {
                    const tplDef = (typeof CardSets !== 'undefined' && card._theme)
                        ? (CardSets[card._theme] || {})[card.originalName || card.name]
                        : null;
                    const altArtsSrc = tplDef?.altArts || FRIEREN_CARDS[artKey]?.altArts;
                    if (altArtsSrc && altArtsSrc[selectedStyle]) {
                        // Clone card with overridden art
                        card = Object.assign({}, card, { art: altArtsSrc[selectedStyle] });
                    }
                }
            }
            return _origRenderCard(card, inHand, displayCost, currentStats);
        };
    }

    // ── 10. Patch renderPacksPanel → add Frieren Gem Pack section ─
    if (typeof renderPacksPanel === 'function') {
        const _origRenderPacksPanel = renderPacksPanel;
        renderPacksPanel = function () {
            _origRenderPacksPanel();
            _appendFrierenPackSection();
        };
    }

    // ── 11. Patch showCardDetailModal → art switcher ───────────────
    if (typeof showCardDetailModal === 'function') {
        const _origShowCardDetail = showCardDetailModal;
        showCardDetailModal = function (name, theme) {
            _origShowCardDetail(name, theme);
            // Inject art switcher for cards that have altArts
            const cardDef = (typeof CardSets !== 'undefined')
                ? ((CardSets[theme] || {})[name])
                : null;
            const hasFallback = FRIEREN_CARDS[name];
            const source = cardDef || hasFallback;
            if (source?.altArts && Object.keys(source.altArts).length > 1) {
                _injectArtSwitcher(name, theme, source.altArts);
            }
        };
    }

    // ── 12. Patch updateHubUI → show Easter Tokens + gems ─────────
    if (typeof updateHubUI === 'function') {
        const _origUpdateHubUI = updateHubUI;
        updateHubUI = function () {
            _origUpdateHubUI();
            // Inject Easter Token counter into packs panel header if visible
            _updateEasterTokenDisplay();
        };
    }

    // ── 13. Patch loadPlayerData backward-compat ──────────────────
    // (Already handled via init above, but also patch for future reloads)
    if (typeof loadPlayerData === 'function') {
        const _origLoad = loadPlayerData;
        loadPlayerData = function () {
            const d = _origLoad();
            if (!d.selectedArts)   d.selectedArts  = {};
            if (d.easterTokens === undefined) d.easterTokens = 0;
            return d;
        };
    }
});

// ─── FRIEREN END-OF-TURN SPELL GENERATION ────────────────────────
function _frierenEndOfTurn(playerKey) {
    const p = state.players[playerKey];
    p.field.forEach(c => {
        const eff = (c.name.startsWith('Shadow Token') || c.name.startsWith('Shadow army') ||
                     c.name.includes('Loki Clone')) ? (c.originalName || c.name) : c.name;
        if (eff !== 'Frieren') return;
        if (typeof getCharStats === 'function' && getCharStats(c).hp <= 0) return;
        if (c.silenced) return;

        if (typeof c.frienSpellCycle !== 'number') c.frienSpellCycle = 0;
        const spellName = FRIEREN_SPELL_CYCLE[c.frienSpellCycle % 3];
        const cycleLabel = `${(c.frienSpellCycle % 3) + 1}/3`;

        // Give 2 copies of the current spell
        for (let i = 0; i < 2; i++) {
            const spell = _createFrierenSpell(spellName);
            if (spell) p.hand.push(spell);
        }

        if (typeof log === 'function')
            log(`✨ [Frieren] จบเทิร์น: เพิ่ม ${spellName} x2 เข้ามือ [Cycle ${cycleLabel}] ✨`,
                'text-indigo-300 font-bold');

        c.frienSpellCycle = (c.frienSpellCycle + 1) % 3;
    });
}

// ─── FRIEREN NON-TARGETED SPELL: Analysis ─────────────────────────
function _executeFrierenSpell(card, playerKey) {
    const p = state.players[playerKey];
    if (card.name === 'Analysis') {
        const spellsInHand = p.hand.filter(c =>
            c.type === 'Spell' && c.id !== card.id
        );
        if (spellsInHand.length > 0) {
            const target = spellsInHand[Math.floor(Math.random() * spellsInHand.length)];
            target.costReducer = (target.costReducer || 0) + target.cost;
            if (typeof log === 'function')
                log(`🔍 [Analysis] วิเคราะห์เสร็จ! ${target.name} Cost → 0 ✨`, 'text-sky-300 font-bold');
        } else {
            if (typeof log === 'function')
                log(`🔍 [Analysis] ไม่มี Spell Card อื่นในมือ`, 'text-sky-500');
        }
        p.graveyard.push(card);
    }
}

// ─── FRIEREN TARGETED SPELLS: Concealment Magic & Zoltraak ────────
function _executeFrierenTargetedSpell(card, playerKey, targetChar) {
    const oppKey = playerKey === 'player' ? 'ai' : 'player';

    if (card.name === 'Concealment Magic') {
        // Give immortalTurns = 4 → effectively 2 opponent turns
        targetChar.immortalTurns = Math.max(targetChar.immortalTurns || 0, 4);
        if (typeof log === 'function')
            log(`🌫️ [Concealment Magic] ${targetChar.name} ซ่อนตัว — อมตะ 2 เทิร์น! ✨`,
                'text-indigo-300 font-bold');
    }
    else if (card.name === 'Zoltraak') {
        const tName = targetChar.name;
        targetChar.hp = -99;
        if (typeof log === 'function')
            log(`🔮 [Zoltraak] Standard Anti-Mage Offensive Spell — ${tName} ถูกทำลาย! 💜`,
                'text-violet-400 font-bold');
        if (typeof checkDeath === 'function') checkDeath(oppKey);
    }
}

// ─── INJECT FRIEREN PACK SECTION IN PACKS PANEL ──────────────────
function _appendFrierenPackSection() {
    const panel = document.getElementById('hub-panel-packs');
    if (!panel) return;

    // Remove old section if already injected (avoid duplication on re-render)
    const existing = panel.querySelector('#frieren-pack-section');
    if (existing) existing.remove();

    const gems = (typeof playerData !== 'undefined') ? (playerData.gems || 0) : 0;
    const easterTk = (typeof playerData !== 'undefined') ? (playerData.easterTokens || 0) : 0;
    const owned = (typeof playerData !== 'undefined')
        ? (playerData.collection['Frieren|frieren_mage'] || 0) : 0;
    const canBuy = gems >= 99;

    const sec = document.createElement('div');
    sec.id = 'frieren-pack-section';
    sec.style.cssText = 'padding:0 16px 24px;max-width:700px;margin:0 auto';
    sec.innerHTML = `
      <!-- Gem Shop Divider -->
      <div style="display:flex;align-items:center;gap:10px;margin:8px 0 16px">
        <div style="flex:1;height:1px;background:linear-gradient(90deg,transparent,#818cf8)"></div>
        <div style="font-size:0.8rem;font-weight:900;color:#818cf8;letter-spacing:1px">💎 GEM SHOP</div>
        <div style="flex:1;height:1px;background:linear-gradient(90deg,#818cf8,transparent)"></div>
      </div>

      <!-- Gem balance row -->
      <div style="display:flex;align-items:center;justify-content:space-between;
           background:#111827;border:1px solid #374151;border-radius:12px;
           padding:10px 16px;margin-bottom:14px">
        <div style="display:flex;align-items:center;gap:12px">
          <span style="font-size:1.4rem">💎</span>
          <div>
            <div style="font-size:0.85rem;font-weight:800;color:#93c5fd">Gems ของคุณ</div>
            <div style="font-size:0.7rem;color:#6b7280">ใช้ซื้อ Pack พิเศษ</div>
          </div>
        </div>
        <div style="font-size:1.4rem;font-weight:900;color:#93c5fd">${gems}</div>
      </div>

      <!-- Easter Token row -->
      <div style="display:flex;align-items:center;justify-content:space-between;
           background:#1a0a2e;border:1px solid #9d174d55;border-radius:12px;
           padding:10px 16px;margin-bottom:16px">
        <div style="display:flex;align-items:center;gap:12px">
          <span style="font-size:1.4rem">🐣</span>
          <div>
            <div style="font-size:0.85rem;font-weight:800;color:#f9a8d4">Easter Token</div>
            <div style="font-size:0.7rem;color:#6b7280">สะสมสำหรับร้านค้า Easter (เร็วๆ นี้)</div>
          </div>
        </div>
        <div style="font-size:1.4rem;font-weight:900;color:#f9a8d4">${easterTk}</div>
      </div>

      <!-- Frieren Pack card -->
      <div style="background:linear-gradient(135deg,#0d0b2e,#1a1247);
           border:2.5px solid #818cf8;border-radius:22px;overflow:hidden;
           box-shadow:0 0 40px rgba(129,140,248,0.25)">

        <!-- Art header -->
        <div style="position:relative;height:160px;overflow:hidden">
          <img src="https://files.catbox.moe/1qkif5.jpg"
               style="width:100%;height:100%;object-fit:cover;filter:brightness(0.65)"
               onerror="this.style.display='none'">
          <div style="position:absolute;inset:0;background:linear-gradient(to bottom,transparent 30%,#0d0b2e 100%)"></div>
          <div style="position:absolute;top:12px;left:14px;background:rgba(0,0,0,0.75);
               border:1.5px solid #818cf8;border-radius:20px;padding:3px 12px;
               font-size:0.7rem;font-weight:900;color:#a5b4fc">💎 GEM EXCLUSIVE</div>
          ${owned > 0 ? `<div style="position:absolute;top:12px;right:14px;background:rgba(0,80,0,0.8);
               border:1.5px solid #4ade80;border-radius:20px;padding:3px 12px;
               font-size:0.7rem;font-weight:900;color:#4ade80">✓ มีแล้ว ×${owned}</div>` : ''}
          <div style="position:absolute;bottom:14px;left:16px">
            <div style="font-size:1.2rem;font-weight:900;color:white;text-shadow:0 2px 8px rgba(0,0,0,0.9)">
              Frieren: Mage of the Endless Journey
            </div>
            <div style="font-size:0.72rem;color:#a5b4fc">✨ ชุดการ์ดพิเศษ + Easter Token</div>
          </div>
        </div>

        <!-- Pack content -->
        <div style="padding:18px 18px 0">
          <!-- Content list -->
          <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-bottom:16px">
            ${[
              ['Frieren','★ Legendary','#fb923c', FRIEREN_CARDS['Frieren'].art],
              ['Concealment Magic','✦ Spell','#818cf8', FRIEREN_CARDS['Concealment Magic'].art],
              ['Zoltraak','✦ Spell','#a78bfa', FRIEREN_CARDS['Zoltraak'].art],
              ['Analysis','✦ Spell','#60a5fa', FRIEREN_CARDS['Analysis'].art],
            ].map(([n, r, col, art]) => `
              <div style="background:#0a0916;border:1px solid ${col}44;border-radius:10px;
                   display:flex;align-items:center;gap:8px;padding:6px 8px;overflow:hidden">
                <img src="${art}" style="width:36px;height:36px;object-fit:cover;border-radius:6px;flex-shrink:0"
                     onerror="this.style.display='none'">
                <div style="min-width:0">
                  <div style="font-size:0.55rem;color:${col};font-weight:700">${r}</div>
                  <div style="font-size:0.65rem;color:white;font-weight:800;
                       white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${n}</div>
                </div>
              </div>`).join('')}
          </div>

          <!-- Easter Token bonus -->
          <div style="background:linear-gradient(135deg,#1a0a2e,#2d0f3e);
               border:1.5px solid #f472b666;border-radius:12px;
               padding:10px 14px;margin-bottom:16px;display:flex;align-items:center;gap:12px">
            <span style="font-size:2rem">🐣</span>
            <div>
              <div style="font-size:0.85rem;font-weight:900;color:#f9a8d4">+20 Easter Token</div>
              <div style="font-size:0.65rem;color:#9ca3af">สะสมสำหรับร้านค้า Easter ในอนาคต</div>
            </div>
          </div>

          <!-- Art Style badge -->
          <div style="background:rgba(129,140,248,0.1);border:1px solid #4338ca;
               border-radius:10px;padding:8px 12px;margin-bottom:16px;
               font-size:0.7rem;color:#a5b4fc;text-align:center">
            🎨 Frieren มี <strong>2 Art Style</strong> — Normal & Easter · สลับได้ใน Collection
          </div>

          <!-- Price + Buy button -->
          <div style="display:flex;align-items:center;gap:12px;padding-bottom:18px">
            <div style="flex:1">
              <div style="font-size:1.4rem;font-weight:900;color:#93c5fd">💎 99 Gems</div>
              <div style="font-size:0.65rem;color:#6b7280">ซื้อได้ทุกเมื่อ · ได้การ์ดทันที</div>
            </div>
            <button onclick="buyFrierenPack()"
              ${canBuy ? '' : 'disabled'}
              style="background:${canBuy
                ? 'linear-gradient(135deg,#4f46e5,#6366f1)'
                : '#374151'};
                     color:${canBuy ? 'white' : '#6b7280'};
                     border:none;padding:14px 24px;border-radius:14px;
                     font-weight:900;font-size:0.95rem;cursor:${canBuy ? 'pointer' : 'not-allowed'};
                     box-shadow:${canBuy ? '0 0 20px rgba(99,102,241,0.5)' : 'none'};
                     white-space:nowrap">
              ${canBuy ? '✨ ซื้อเลย!' : '💎 Gem ไม่พอ'}
            </button>
          </div>
        </div>
      </div>
    `;

    // Find the inner div to append to
    const inner = panel.querySelector('div[style*="max-width:700px"]') || panel;
    inner.appendChild(sec);
}

// ─── INJECT ART SWITCHER IN CARD DETAIL MODAL ────────────────────
function _injectArtSwitcher(cardName, theme, altArts) {
    const modal = document.getElementById('col-card-modal');
    if (!modal) return;

    const actionRow = modal.querySelector('div[style*="display:flex;gap:8px"]');
    if (!actionRow) return;

    const current = (playerData.selectedArts || {})[cardName] || 'normal';

    const switcher = document.createElement('div');
    switcher.style.cssText = 'padding:0 18px 18px';
    switcher.innerHTML = `
      <div style="background:linear-gradient(135deg,#0d0b2e,#1a1247);
           border:1.5px solid #818cf8;border-radius:14px;padding:14px">
        <div style="font-size:0.65rem;color:#818cf8;font-weight:900;text-transform:uppercase;
             letter-spacing:0.8px;margin-bottom:10px">🎨 Art Style</div>
        <div style="display:flex;gap:8px">
          ${Object.entries(altArts).map(([style, url]) => {
              const cfg = ART_STYLE_LABELS[style] || { label: style, color: '#9ca3af' };
              const isActive = current === style;
              return `
              <div onclick="switchCardArt('${cardName.replace(/'/g,"\\'")}','${style}')"
                   style="flex:1;border:2.5px solid ${isActive ? cfg.color : '#374151'};
                          border-radius:10px;overflow:hidden;cursor:pointer;
                          box-shadow:${isActive ? `0 0 14px ${cfg.color}88` : 'none'};
                          transition:all 0.2s">
                <img src="${url}" style="width:100%;height:70px;object-fit:cover;display:block"
                     onerror="this.style.display='none'">
                <div style="background:rgba(0,0,0,0.8);padding:5px 6px;text-align:center">
                  <div style="font-size:0.65rem;font-weight:900;color:${cfg.color}">${cfg.label}</div>
                  ${isActive ? `<div style="font-size:0.55rem;color:#4ade80">✓ กำลังใช้อยู่</div>` : ''}
                </div>
              </div>`;
          }).join('')}
        </div>
      </div>
    `;

    // Insert before action row
    actionRow.parentNode.insertBefore(switcher, actionRow);
}

// ─── EASTER TOKEN DISPLAY ─────────────────────────────────────────
function _updateEasterTokenDisplay() {
    const easterTk = (typeof playerData !== 'undefined') ? (playerData.easterTokens || 0) : 0;
    let el = document.getElementById('hub-easter-tokens');
    if (!el) {
        // Try to insert near gems in the rank card
        const homePanel = document.getElementById('hub-panel-home');
        if (!homePanel) return;
        const gemsEl = homePanel.querySelector('[style*="93c5fd"]');
        if (!gemsEl) return;
        el = document.createElement('div');
        el.id = 'hub-easter-tokens';
        el.style.cssText = 'font-size:0.85rem;font-weight:800;color:#f9a8d4';
        gemsEl.parentNode?.insertBefore(el, gemsEl.nextSibling);
    }
    if (el) el.textContent = `🐣 ${easterTk}`;
}

// ─── ALSO: ensure loadPlayerData compat on save load ─────────────
// Patch is applied above in DOMContentLoaded. Additionally patch the
// global playerData object directly in case it was already loaded.
(function _patchExistingPlayerData() {
    // setTimeout gives time for all scripts to init before we touch playerData
    setTimeout(() => {
        if (typeof playerData !== 'undefined') {
            if (!playerData.selectedArts)   playerData.selectedArts  = {};
            if (playerData.easterTokens === undefined) playerData.easterTokens = 0;
        }
    }, 0);
})();
