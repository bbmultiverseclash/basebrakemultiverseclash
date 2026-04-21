// ============================================================
// 18_theme_shop.js — Theme Shop (BGM + Board BG) + Deck Builder Edit
// ============================================================

// ── THEME CATALOG ─────────────────────────────────────────────────
const CUSTOM_THEMES = {
    frieren_theme: {
        id:        'frieren_theme',
        label:     'Frieren: Mage of the Endless Journey',
        emoji:     '✨',
        bgm:       'https://files.catbox.moe/kwmzul.mp3',
        boardBg:   'https://files.catbox.moe/90enrr.jpg',
        baseCost:  20,
        // ราคาจริง: ถ้ามีการ์ด Frieren pack อยู่ใน collection → 1 gem
        getCost() {
            const owns = typeof playerData !== 'undefined'
                && (playerData.collection?.['Frieren|frieren_mage'] || 0) > 0;
            return owns ? 1 : this.baseCost;
        },
        frierenDiscount: true,
    },
};

// ── PREVIEW STATE ─────────────────────────────────────────────────
let _themePreviewAudio  = null;
let _themePreviewActive = null; // themeId ที่กำลัง preview อยู่

function _stopThemePreview() {
    if (_themePreviewAudio) {
        _themePreviewAudio.pause();
        _themePreviewAudio.currentTime = 0;
        _themePreviewAudio = null;
    }
    _themePreviewActive = null;
    // reset all preview buttons
    Object.keys(CUSTOM_THEMES).forEach(id => {
        const btn = document.getElementById(`ts-bgm-btn-${id}`);
        if (btn) { btn.textContent = '▶ ฟังเพลง'; btn.style.background = '#1e1b4b'; }
    });
}

function toggleThemeBGMPreview(themeId) {
    const cfg = CUSTOM_THEMES[themeId];
    if (!cfg?.bgm) return;

    if (_themePreviewActive === themeId) {
        _stopThemePreview(); return;
    }
    _stopThemePreview();

    _themePreviewActive = themeId;
    _themePreviewAudio  = new Audio(cfg.bgm);
    _themePreviewAudio.volume = 0.5;
    _themePreviewAudio.loop   = true;
    _themePreviewAudio.play().catch(() => {});

    const btn = document.getElementById(`ts-bgm-btn-${themeId}`);
    if (btn) { btn.textContent = '⏹ หยุด'; btn.style.background = '#1e3a5f'; }
}

function openBGPreview(themeId) {
    const cfg = CUSTOM_THEMES[themeId];
    if (!cfg?.boardBg) return;
    let ov = document.getElementById('ts-bg-fullscreen');
    if (!ov) {
        ov = document.createElement('div');
        ov.id = 'ts-bg-fullscreen';
        ov.style.cssText = 'position:fixed;inset:0;z-index:6000;background:rgba(0,0,0,0.95);display:flex;align-items:center;justify-content:center;cursor:pointer';
        ov.onclick = () => ov.remove();
        document.body.appendChild(ov);
    }
    ov.innerHTML = `
    <img src="${cfg.boardBg}" style="max-width:95vw;max-height:90vh;object-fit:contain;border-radius:14px;border:2px solid #a855f7;box-shadow:0 0 60px rgba(168,85,247,0.5)">
    <div style="position:absolute;top:16px;right:20px;background:rgba(0,0,0,0.7);border:1px solid #6b7280;border-radius:8px;padding:6px 14px;color:#9ca3af;font-size:0.8rem">✕ ปิด</div>`;
}

// ── BUY / EQUIP / UNEQUIP ─────────────────────────────────────────
function buyTheme(themeId) {
    const cfg = CUSTOM_THEMES[themeId];
    if (!cfg) return;
    if ((playerData.unlockedThemes || []).includes(themeId)) {
        showToast('✅ ปลดล็อคธีมนี้แล้ว', '#4ade80'); return;
    }
    const cost = cfg.getCost();
    if ((playerData.gems || 0) < cost) {
        showToast(`💎 Gem ไม่พอ! ต้องการ ${cost} 💎`, '#f87171'); return;
    }
    playerData.gems -= cost;
    if (!playerData.unlockedThemes) playerData.unlockedThemes = [];
    playerData.unlockedThemes.push(themeId);
    saveData();
    updateHubUI();
    showToast(`✨ ปลดล็อคธีม "${cfg.label}" แล้ว!`, '#a5b4fc');
    renderThemeShopPanel();
}

function equipTheme(themeId) {
    if (!(playerData.unlockedThemes || []).includes(themeId)) {
        showToast('❌ ยังไม่ได้ปลดล็อคธีมนี้', '#f87171'); return;
    }
    playerData.equippedTheme = themeId;
    saveData();
    showToast(`🎨 ใส่ธีม "${CUSTOM_THEMES[themeId]?.label}" แล้ว!`, '#fbbf24');
    renderThemeShopPanel();
}

function unequipTheme() {
    playerData.equippedTheme = null;
    saveData();
    showToast('🎨 ถอดธีมแล้ว — เพลง/พื้นหลังใช้ตาม Deck', '#9ca3af');
    renderThemeShopPanel();
}

// ── RENDER THEME SHOP PANEL ───────────────────────────────────────
function renderThemeShopPanel() {
    const panel = document.getElementById('hub-panel-themes');
    if (!panel) return;
    _stopThemePreview();

    const unlocked = playerData.unlockedThemes || [];
    const equipped  = playerData.equippedTheme  || null;

    panel.innerHTML = `
    <div style="max-width:680px;margin:0 auto;padding:16px">

      <!-- Header -->
      <div style="display:flex;align-items:center;gap:12px;margin-bottom:18px">
        <div style="font-size:2.5rem">🎨</div>
        <div>
          <div style="font-size:1.3rem;font-weight:900;color:#a5b4fc">Theme Shop</div>
          <div style="font-size:0.75rem;color:#9ca3af">ซื้อธีมเพื่อเปลี่ยนเพลง BGM และพื้นหลังกระดาน | 💎 ${playerData.gems || 0}</div>
        </div>
      </div>

      <!-- Equipped badge -->
      ${equipped
        ? `<div style="background:#1a1430;border:2px solid #a855f7;border-radius:14px;padding:12px 16px;margin-bottom:16px;display:flex;align-items:center;gap:12px">
             <div style="font-size:1.6rem">✨</div>
             <div style="flex:1">
               <div style="font-size:0.85rem;font-weight:800;color:#c4b5fd">ธีมที่ใช้อยู่: ${CUSTOM_THEMES[equipped]?.label || equipped}</div>
               <div style="font-size:0.65rem;color:#7c3aed;margin-top:2px">BGM และพื้นหลังจะใช้จากธีมนี้แทน Deck</div>
             </div>
             <button onclick="unequipTheme()" style="background:#374151;color:#9ca3af;border:none;padding:7px 14px;border-radius:8px;cursor:pointer;font-size:0.78rem;font-weight:700">ถอด</button>
           </div>`
        : `<div style="background:#111827;border:1px solid #374151;border-radius:12px;padding:10px 14px;margin-bottom:16px;font-size:0.72rem;color:#6b7280">
             💡 ยังไม่ได้ใส่ธีม — BGM และพื้นหลังจะใช้ตาม Deck ที่เลือก
           </div>`}

      <!-- Theme cards -->
      <div style="display:flex;flex-direction:column;gap:16px">
      ${Object.values(CUSTOM_THEMES).map(cfg => {
        const isUnlocked = unlocked.includes(cfg.id);
        const isEquipped = equipped === cfg.id;
        const cost       = cfg.getCost();
        const canAfford  = (playerData.gems || 0) >= cost;
        const hasFDisc   = cfg.frierenDiscount && (playerData.collection?.['Frieren|frieren_mage'] || 0) > 0;

        return `
        <div style="background:#111827;border:2px solid ${isEquipped ? '#a855f7' : isUnlocked ? '#4b5563' : '#1f2937'};border-radius:20px;overflow:hidden;box-shadow:${isEquipped ? '0 0 24px rgba(168,85,247,0.3)' : 'none'}">

          <!-- Board BG preview strip -->
          <div style="position:relative;height:140px;overflow:hidden;cursor:pointer" onclick="openBGPreview('${cfg.id}')" title="คลิกเพื่อดูพื้นหลังเต็มจอ">
            <img src="${cfg.boardBg}" style="width:100%;height:100%;object-fit:cover;opacity:${isUnlocked ? 0.85 : 0.45};transition:opacity 0.3s" onmouseover="this.style.opacity=1" onmouseout="this.style.opacity=${isUnlocked ? 0.85 : 0.45}">
            <div style="position:absolute;inset:0;background:linear-gradient(to bottom,transparent 35%,rgba(0,0,0,0.85));pointer-events:none"></div>
            <div style="position:absolute;bottom:10px;left:14px">
              <div style="font-size:1rem;font-weight:900;color:white;text-shadow:0 2px 8px rgba(0,0,0,0.8)">${cfg.emoji} ${cfg.label}</div>
            </div>
            <div style="position:absolute;top:8px;right:10px;background:rgba(0,0,0,0.65);border:1px solid rgba(255,255,255,0.2);border-radius:6px;padding:3px 8px;font-size:0.6rem;color:#d1d5db">
              🖼 ดูพื้นหลังเต็มจอ
            </div>
            ${isEquipped ? `<div style="position:absolute;top:8px;left:10px;background:#a855f7;border-radius:6px;padding:3px 8px;font-size:0.6rem;color:white;font-weight:800">✨ ใช้งานอยู่</div>` : ''}
          </div>

          <!-- Controls row -->
          <div style="padding:14px 16px;display:flex;flex-direction:column;gap:10px">

            <!-- BGM preview -->
            <div style="display:flex;align-items:center;gap:10px">
              <button id="ts-bgm-btn-${cfg.id}" onclick="toggleThemeBGMPreview('${cfg.id}')"
                style="background:#1e1b4b;border:1px solid #4338ca;color:#818cf8;padding:7px 16px;border-radius:8px;cursor:pointer;font-size:0.78rem;font-weight:700;white-space:nowrap;transition:background 0.2s">
                ▶ ฟังเพลง
              </button>
              <div style="font-size:0.68rem;color:#9ca3af;flex:1;line-height:1.4">BGM: <span style="color:#818cf8">${cfg.label}</span></div>
            </div>

            <!-- Buy / Equip row -->
            <div style="display:flex;align-items:center;gap:10px">
              ${isUnlocked
                ? isEquipped
                  ? `<div style="flex:1;font-size:0.78rem;color:#a855f7;font-weight:800">✅ ธีมที่ใช้งานอยู่</div>
                     <button onclick="unequipTheme()" style="background:#374151;color:#9ca3af;border:none;padding:8px 18px;border-radius:10px;cursor:pointer;font-size:0.8rem;font-weight:700">ถอด</button>`
                  : `<div style="flex:1;font-size:0.72rem;color:#4ade80;font-weight:700">✅ ปลดล็อคแล้ว</div>
                     <button onclick="equipTheme('${cfg.id}')" style="background:linear-gradient(135deg,#7c3aed,#6d28d9);color:white;border:none;padding:8px 22px;border-radius:10px;cursor:pointer;font-size:0.82rem;font-weight:800;box-shadow:0 0 14px rgba(124,58,237,0.4)">ใส่ธีม</button>`
                : `<div style="flex:1">
                     ${hasFDisc
                       ? `<div style="font-size:0.75rem;font-weight:900;color:#4ade80">🎁 มี Frieren Pack → เหลือ <b>1 💎</b></div>
                          <div style="font-size:0.6rem;color:#6b7280;text-decoration:line-through">ปกติ ${cfg.baseCost} 💎</div>`
                       : `<div style="font-size:0.88rem;font-weight:900;color:#a5b4fc">💎 ${cost}</div>`}
                   </div>
                   <button onclick="buyTheme('${cfg.id}')" ${canAfford ? '' : 'disabled'}
                     style="background:${canAfford ? 'linear-gradient(135deg,#4f46e5,#6366f1)' : '#374151'};color:${canAfford ? 'white' : '#6b7280'};border:none;padding:8px 22px;border-radius:10px;cursor:${canAfford ? 'pointer' : 'not-allowed'};font-size:0.82rem;font-weight:800;opacity:${canAfford ? 1 : 0.55};box-shadow:${canAfford ? '0 0 14px rgba(99,102,241,0.4)' : 'none'}">
                     ${canAfford ? '💎 ซื้อธีม' : 'Gem ไม่พอ'}
                   </button>`}
            </div>
          </div>
        </div>`;
      }).join('')}
      </div>
    </div>`;
}

// ── HUB TAB INJECTION ─────────────────────────────────────────────
function _injectThemeTab() {
    // Add nav button if not already there
    if (document.getElementById('hub-tab-themes')) return;

    const navBar = document.querySelector('.hub-nav-bar');
    if (!navBar) return;
    const btn = document.createElement('button');
    btn.id        = 'hub-tab-themes';
    btn.className = 'hub-nav-btn';
    btn.textContent = '🎨 Themes';
    btn.onclick   = () => showHubTab('themes');
    navBar.appendChild(btn);

    // Add panel
    const panelArea = document.querySelector('#hub-panel-home')?.parentElement;
    if (panelArea && !document.getElementById('hub-panel-themes')) {
        const panel = document.createElement('div');
        panel.id            = 'hub-panel-themes';
        panel.style.display = 'none';
        panelArea.appendChild(panel);
    }
}

// ── PATCH showHubTab to handle 'themes' ───────────────────────────
function _patchShowHubTab() {
    const _orig = window.showHubTab;
    if (typeof _orig !== 'function') return;
    window.showHubTab = function(tab) {
        // handle themes tab manually, pass everything else to original
        if (tab === 'themes') {
            // hide all panels, deactivate all tabs
            ['home','packs','collection','deckbuilder','play'].forEach(t => {
                const btn = document.getElementById(`hub-tab-${t}`);
                const pnl = document.getElementById(`hub-panel-${t}`);
                if (btn) btn.classList.remove('active-tab');
                if (pnl) pnl.style.display = 'none';
            });
            const tBtn = document.getElementById('hub-tab-themes');
            const tPnl = document.getElementById('hub-panel-themes');
            if (tBtn) tBtn.classList.add('active-tab');
            if (tPnl) tPnl.style.display = '';
            _stopThemePreview();
            renderThemeShopPanel();
        } else {
            // deactivate themes tab too
            const tBtn = document.getElementById('hub-tab-themes');
            const tPnl = document.getElementById('hub-panel-themes');
            if (tBtn) tBtn.classList.remove('active-tab');
            if (tPnl) tPnl.style.display = 'none';
            _stopThemePreview();
            _orig.call(this, tab);
        }
    };
}

// ── BOARD BACKGROUND HELPERS ──────────────────────────────────────
function _applyCustomThemeBG() {
    const themeId = typeof playerData !== 'undefined' ? playerData.equippedTheme : null;
    const cfg     = themeId ? CUSTOM_THEMES[themeId] : null;
    const gs      = document.getElementById('game-screen');
    if (!gs) return;

    if (cfg?.boardBg) {
        gs.style.backgroundImage    = `url('${cfg.boardBg}')`;
        gs.style.backgroundSize     = 'cover';
        gs.style.backgroundPosition = 'center';
        gs.style.backgroundRepeat   = 'no-repeat';
    } else {
        gs.style.backgroundImage    = '';
        gs.style.backgroundSize     = '';
        gs.style.backgroundPosition = '';
        gs.style.backgroundRepeat   = '';
    }
}

function _clearCustomThemeBG() {
    const gs = document.getElementById('game-screen');
    if (!gs) return;
    gs.style.backgroundImage    = '';
    gs.style.backgroundSize     = '';
    gs.style.backgroundPosition = '';
    gs.style.backgroundRepeat   = '';
}

// ── DECK BUILDER EDIT ─────────────────────────────────────────────
function editDeck(deckId) {
    const deck = playerData.decks.find(d => d.id === deckId);
    if (!deck) { showToast('ไม่พบเดค', '#f87171'); return; }
    const norm = (deck.cards || []).map(c =>
        typeof c === 'string' ? { name: c, theme: deck.theme || 'isekai_adventure' } : c
    );
    deckBuilderState.cards        = [...norm];
    deckBuilderState.editingDeckId = deckId;
    deckBuilderState.editingDeckName = deck.name;
    renderDeckBuilderPanel();
    showToast(`✏️ โหลดเดค "${deck.name}" เพื่อแก้ไขแล้ว`, '#fbbf24');
}

// ── PATCHES ───────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {

    // 0. Init playerData fields
    if (typeof playerData !== 'undefined') {
        if (!playerData.unlockedThemes) playerData.unlockedThemes = [];
        if (playerData.equippedTheme === undefined) playerData.equippedTheme = null;
    }

    // 1. Inject Theme tab + panel
    _injectThemeTab();

    // 2. Patch showHubTab
    _patchShowHubTab();

    // 3. Patch loadPlayerData for backward compat
    const _origLoad = window.loadPlayerData;
    if (typeof _origLoad === 'function') {
        window.loadPlayerData = function() {
            const d = _origLoad.call(this);
            if (!d.unlockedThemes)          d.unlockedThemes  = [];
            if (d.equippedTheme === undefined) d.equippedTheme = null;
            return d;
        };
    }

    // 4. Patch startBGMForGame → use equipped theme BGM if set
    const _origBGM = window.startBGMForGame;
    if (typeof _origBGM === 'function') {
        window.startBGMForGame = function() {
            const themeId = typeof playerData !== 'undefined' ? playerData.equippedTheme : null;
            const cfg     = themeId ? CUSTOM_THEMES[themeId] : null;
            if (cfg?.bgm) {
                if (typeof stopBGM === 'function') stopBGM();
                const muted = typeof isMuted !== 'undefined' ? isMuted : false;
                if (!muted) {
                    if (typeof currentBGM !== 'undefined') {
                        window.currentBGM = new Audio(cfg.bgm);
                        window.currentBGM.loop   = true;
                        window.currentBGM.volume = 0.35;
                        window.currentBGM.play().catch(() => {});
                    }
                }
            } else {
                _origBGM.call(this);
            }
        };
    }

    // 5. Patch initGame → apply board background after game starts
    const _origInitGame = window.initGame;
    if (typeof _origInitGame === 'function') {
        window.initGame = function() {
            _origInitGame.call(this);
            // Apply after a short tick so DOM is settled
            setTimeout(_applyCustomThemeBG, 50);
        };
    }

    // 6. Patch backToHub → clear custom BG when leaving game
    const _origBackToHub = window.backToHub;
    if (typeof _origBackToHub === 'function') {
        window.backToHub = function() {
            _origBackToHub.call(this);
            _clearCustomThemeBG();
            _stopThemePreview();
        };
    }

    // 7. Patch renderDeckBuilderPanel → add Edit buttons + editing header
    const _origRenderDB = window.renderDeckBuilderPanel;
    if (typeof _origRenderDB === 'function') {
        window.renderDeckBuilderPanel = function() {
            _origRenderDB.call(this);
            _patchDeckBuilderUI();
        };
    }

    // 8. Patch saveDeckFromBuilder → update existing deck if editing
    const _origSave = window.saveDeckFromBuilder;
    if (typeof _origSave === 'function') {
        window.saveDeckFromBuilder = function() {
            const editId = deckBuilderState.editingDeckId;
            if (editId) {
                const deck = playerData.decks.find(d => d.id === editId);
                if (deck) {
                    const count = deckBuilderState.cards.length;
                    if (count < (typeof DECK_MIN !== 'undefined' ? DECK_MIN : 60)
                     || count > (typeof DECK_MAX !== 'undefined' ? DECK_MAX : 65)) {
                        showToast(`เดคต้องมี ${DECK_MIN || 60}–${DECK_MAX || 65} ใบ`, '#f87171');
                        return;
                    }
                    const newName = prompt('ชื่อเดค:', deck.name) || deck.name;
                    deck.name  = newName;
                    deck.cards = [...deckBuilderState.cards];
                    saveData();
                    showToast(`✅ อัปเดตเดค "${newName}" แล้ว!`, '#4ade80');
                    deckBuilderState.cards         = [];
                    deckBuilderState.editingDeckId  = null;
                    deckBuilderState.editingDeckName = null;
                    renderDeckBuilderPanel();
                    return;
                }
            }
            // Not editing → normal save
            _origSave.call(this);
            deckBuilderState.editingDeckId  = null;
            deckBuilderState.editingDeckName = null;
        };
    }
});

// ── Inject editing header + edit buttons into already-rendered Deck Builder ──
function _patchDeckBuilderUI() {
    const panel = document.getElementById('hub-panel-deckbuilder');
    if (!panel) return;

    // ── Editing banner at top ──────────────────────────────────────
    const editId = deckBuilderState.editingDeckId;
    if (editId) {
        if (!panel.querySelector('#db-edit-banner')) {
            const banner = document.createElement('div');
            banner.id = 'db-edit-banner';
            banner.style.cssText = 'background:#1a2e1a;border:2px solid #4ade80;border-radius:12px;padding:10px 16px;margin:8px 12px 0;display:flex;align-items:center;gap:10px;font-size:0.8rem;';
            banner.innerHTML = `
              <div style="font-size:1.2rem">✏️</div>
              <div style="flex:1;color:#4ade80;font-weight:800">กำลังแก้ไขเดค: "${deckBuilderState.editingDeckName || ''}"</div>
              <button onclick="deckBuilderState.editingDeckId=null;deckBuilderState.editingDeckName=null;deckBuilderState.cards=[];renderDeckBuilderPanel()"
                style="background:#374151;color:#9ca3af;border:none;padding:5px 12px;border-radius:8px;cursor:pointer;font-size:0.75rem;font-weight:700">
                ยกเลิก
              </button>`;
            panel.insertBefore(banner, panel.firstChild);
        }
        // Update save button text
        const saveBtn = panel.querySelector('button[onclick*="saveDeckFromBuilder"]');
        if (saveBtn) saveBtn.innerHTML = '💾 บันทึกการแก้ไข';
    }

    // ── Add Edit buttons to each saved deck card ───────────────────
    panel.querySelectorAll('[data-deck-id]').forEach(el => {
        if (el.querySelector('.db-edit-btn')) return; // already added
        const dId = el.dataset.deckId;
        const editBtn = document.createElement('button');
        editBtn.className = 'db-edit-btn';
        editBtn.onclick = (e) => { e.stopPropagation(); editDeck(dId); };
        editBtn.style.cssText = 'background:linear-gradient(135deg,#1d4ed8,#2563eb);color:white;border:none;padding:6px 8px;border-radius:8px;cursor:pointer;font-size:0.7rem;font-weight:700;white-space:nowrap';
        editBtn.textContent = '✏️';
        editBtn.title = 'แก้ไขเดค';
        const btnRow = el.querySelector('[style*="display:flex"][style*="gap:6px"]');
        if (btnRow) btnRow.insertBefore(editBtn, btnRow.firstChild);
    });
}

// The saved deck cards rendered in renderDeckBuilderPanel don't have data-deck-id.
// We patch the render output to inject data-deck-id via a MutationObserver approach.
// But simpler: override renderDeckBuilderPanel to inject the attribute into HTML before setting innerHTML.
// We do this by replacing the saved deck section rendering.
document.addEventListener('DOMContentLoaded', () => {
    // Second pass: patch renderDeckBuilderPanel again to inject data-deck-id
    const _withAttr = window.renderDeckBuilderPanel;
    if (typeof _withAttr !== 'function') return;
    window.renderDeckBuilderPanel = function() {
        _withAttr.call(this);
        // After render, find saved-deck divs and add data-deck-id
        const panel = document.getElementById('hub-panel-deckbuilder');
        if (!panel) return;
        // Target the saved deck containers (they have onclick containing setActiveDeck or deleteDeck)
        panel.querySelectorAll('button[onclick*="deleteDeck"]').forEach(delBtn => {
            // Extract deck id from onclick attr: deleteDeck('deck_xxx')
            const m = delBtn.getAttribute('onclick').match(/deleteDeck\('([^']+)'\)/);
            if (!m) return;
            const dId = m[1];
            const container = delBtn.closest('div[style*="background:#1f2937"]');
            if (container && !container.dataset.deckId) {
                container.dataset.deckId = dId;
                // Inject edit button if not present
                if (!container.querySelector('.db-edit-btn')) {
                    const editBtn = document.createElement('button');
                    editBtn.className = 'db-edit-btn';
                    editBtn.onclick = (e) => { e.stopPropagation(); editDeck(dId); };
                    editBtn.style.cssText = 'background:linear-gradient(135deg,#1d4ed8,#2563eb);color:white;border:none;padding:6px 8px;border-radius:8px;cursor:pointer;font-size:0.7rem;font-weight:700';
                    editBtn.textContent = '✏️';
                    editBtn.title = 'แก้ไขเดค';
                    delBtn.parentElement.insertBefore(editBtn, delBtn.parentElement.firstChild);
                }
            }
        });
        // Editing banner
        _patchDeckBuilderUI();
    };
});
