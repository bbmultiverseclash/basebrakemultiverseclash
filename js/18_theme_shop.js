// ============================================================
// 18_theme_shop.js — Theme Shop (BGM + Board BG) + Deck Builder Edit
// ============================================================

// ── THEME CATALOG ─────────────────────────────────────────────────
var CUSTOM_THEMES = {
    frieren_theme: {
        id:       'frieren_theme',
        label:    'Frieren: Mage of the Endless Journey',
        emoji:    '✨',
        bgm:      'https://files.catbox.moe/kwmzul.mp3',
        boardBg:  'https://files.catbox.moe/90enrr.jpg',
        baseCost: 20,
    },
};

function _getThemeCost(cfg) {
    if (!cfg) return 0;
    if (cfg.id === 'frieren_theme') {
        var owns = typeof playerData !== 'undefined' &&
            playerData.collection &&
            (playerData.collection['Frieren|frieren_mage'] || 0) > 0;
        return owns ? 1 : cfg.baseCost;
    }
    return cfg.baseCost;
}

// ── BGM PREVIEW ───────────────────────────────────────────────────
var _themePreviewAudio  = null;
var _themePreviewActive = null;

function _stopThemePreview() {
    if (_themePreviewAudio) {
        _themePreviewAudio.pause();
        _themePreviewAudio.currentTime = 0;
        _themePreviewAudio = null;
    }
    _themePreviewActive = null;
    Object.keys(CUSTOM_THEMES).forEach(function(id) {
        var btn = document.getElementById('ts-bgm-btn-' + id);
        if (btn) { btn.textContent = '▶ ฟังเพลง'; btn.style.background = '#1e1b4b'; }
    });
}

function toggleThemeBGMPreview(themeId) {
    var cfg = CUSTOM_THEMES[themeId];
    if (!cfg || !cfg.bgm) return;
    if (_themePreviewActive === themeId) { _stopThemePreview(); return; }
    _stopThemePreview();
    _themePreviewActive = themeId;
    _themePreviewAudio  = new Audio(cfg.bgm);
    _themePreviewAudio.volume = 0.5;
    _themePreviewAudio.loop   = true;
    _themePreviewAudio.play().catch(function(){});
    var btn = document.getElementById('ts-bgm-btn-' + themeId);
    if (btn) { btn.textContent = '⏹ หยุด'; btn.style.background = '#1e3a5f'; }
}

function openBGPreview(themeId) {
    var cfg = CUSTOM_THEMES[themeId];
    if (!cfg || !cfg.boardBg) return;
    var ov = document.getElementById('ts-bg-fullscreen');
    if (!ov) {
        ov = document.createElement('div');
        ov.id = 'ts-bg-fullscreen';
        ov.style.cssText = 'position:fixed;inset:0;z-index:6000;background:rgba(0,0,0,0.95);display:flex;align-items:center;justify-content:center;cursor:pointer;';
        ov.onclick = function() { ov.style.display = 'none'; };
        document.body.appendChild(ov);
    }
    ov.innerHTML = '<img src="' + cfg.boardBg + '" style="max-width:95vw;max-height:90vh;object-fit:contain;border-radius:14px;border:2px solid #a855f7;">' +
        '<div style="position:absolute;top:16px;right:20px;background:rgba(0,0,0,0.7);border:1px solid #6b7280;border-radius:8px;padding:6px 14px;color:#9ca3af;font-size:0.8rem;">✕ ปิด</div>';
    ov.style.display = 'flex';
}

// ── BUY / EQUIP / UNEQUIP ─────────────────────────────────────────
function buyTheme(themeId) {
    var cfg = CUSTOM_THEMES[themeId];
    if (!cfg) return;
    var unlocked = playerData.unlockedThemes || [];
    if (unlocked.indexOf(themeId) !== -1) { showToast('ปลดล็อคธีมนี้แล้ว', '#4ade80'); return; }
    var cost = _getThemeCost(cfg);
    if ((playerData.gems || 0) < cost) { showToast('Gem ไม่พอ! ต้องการ ' + cost + ' 💎', '#f87171'); return; }
    playerData.gems -= cost;
    if (!playerData.unlockedThemes) playerData.unlockedThemes = [];
    playerData.unlockedThemes.push(themeId);
    saveData(); updateHubUI();
    showToast('ปลดล็อคธีม "' + cfg.label + '" แล้ว!', '#a5b4fc');
    renderThemeShopPanel();
}

function equipTheme(themeId) {
    var unlocked = playerData.unlockedThemes || [];
    if (unlocked.indexOf(themeId) === -1) { showToast('ยังไม่ได้ปลดล็อคธีมนี้', '#f87171'); return; }
    playerData.equippedTheme = themeId;
    saveData();
    showToast('ใส่ธีม "' + (CUSTOM_THEMES[themeId] ? CUSTOM_THEMES[themeId].label : themeId) + '" แล้ว!', '#fbbf24');
    renderThemeShopPanel();
}

function unequipTheme() {
    playerData.equippedTheme = null;
    saveData();
    showToast('ถอดธีมแล้ว', '#9ca3af');
    renderThemeShopPanel();
}

// ── RENDER ────────────────────────────────────────────────────────
function renderThemeShopPanel() {
    var panel = document.getElementById('hub-panel-themes');
    if (!panel) return;
    _stopThemePreview();

    var unlocked = playerData.unlockedThemes || [];
    var equipped  = playerData.equippedTheme  || null;
    var gems      = playerData.gems || 0;

    var rows = '';
    Object.values(CUSTOM_THEMES).forEach(function(cfg) {
        var isUn = unlocked.indexOf(cfg.id) !== -1;
        var isEq = equipped === cfg.id;
        var cost = _getThemeCost(cfg);
        var ok   = gems >= cost;
        var disc = cfg.id === 'frieren_theme' &&
            playerData.collection && (playerData.collection['Frieren|frieren_mage'] || 0) > 0;
        var border = isEq ? '#a855f7' : isUn ? '#4b5563' : '#1f2937';

        var priceHtml = disc
            ? '<div style="font-size:0.75rem;font-weight:900;color:#4ade80;">🎁 มี Frieren Pack → 1 💎</div><div style="font-size:0.6rem;color:#6b7280;text-decoration:line-through;">ปกติ ' + cfg.baseCost + ' 💎</div>'
            : '<div style="font-size:0.88rem;font-weight:900;color:#a5b4fc;">💎 ' + cost + '</div>';

        var actionHtml;
        if (isUn) {
            actionHtml = isEq
                ? '<div style="flex:1;font-size:0.78rem;color:#a855f7;font-weight:800;">✅ ใช้งานอยู่</div><button onclick="unequipTheme()" style="background:#374151;color:#9ca3af;border:none;padding:8px 16px;border-radius:10px;cursor:pointer;font-size:0.8rem;font-weight:700;">ถอด</button>'
                : '<div style="flex:1;font-size:0.72rem;color:#4ade80;font-weight:700;">✅ ปลดล็อคแล้ว</div><button onclick="equipTheme(\'' + cfg.id + '\')" style="background:linear-gradient(135deg,#7c3aed,#6d28d9);color:white;border:none;padding:8px 22px;border-radius:10px;cursor:pointer;font-size:0.82rem;font-weight:800;">ใส่ธีม</button>';
        } else {
            actionHtml = '<div style="flex:1;">' + priceHtml + '</div>' +
                '<button onclick="buyTheme(\'' + cfg.id + '\')" ' + (ok ? '' : 'disabled') +
                ' style="background:' + (ok ? 'linear-gradient(135deg,#4f46e5,#6366f1)' : '#374151') + ';color:' + (ok ? 'white' : '#6b7280') + ';border:none;padding:8px 22px;border-radius:10px;cursor:' + (ok ? 'pointer' : 'not-allowed') + ';font-size:0.82rem;font-weight:800;opacity:' + (ok ? 1 : 0.5) + ';">' +
                (ok ? '💎 ซื้อธีม' : 'Gem ไม่พอ') + '</button>';
        }

        rows += '<div style="background:#111827;border:2px solid ' + border + ';border-radius:20px;overflow:hidden;margin-bottom:16px;">' +
            '<div style="position:relative;height:140px;overflow:hidden;cursor:pointer;" onclick="openBGPreview(\'' + cfg.id + '\')">' +
            '<img src="' + cfg.boardBg + '" style="width:100%;height:100%;object-fit:cover;opacity:' + (isUn ? 0.85 : 0.4) + ';">' +
            '<div style="position:absolute;inset:0;background:linear-gradient(to bottom,transparent 35%,rgba(0,0,0,0.85));"></div>' +
            '<div style="position:absolute;bottom:10px;left:14px;font-size:1rem;font-weight:900;color:white;">' + cfg.emoji + ' ' + cfg.label + '</div>' +
            '<div style="position:absolute;top:8px;right:10px;background:rgba(0,0,0,0.6);border:1px solid rgba(255,255,255,0.2);border-radius:6px;padding:3px 8px;font-size:0.6rem;color:#d1d5db;">🖼 ดูพื้นหลัง</div>' +
            (isEq ? '<div style="position:absolute;top:8px;left:10px;background:#a855f7;border-radius:6px;padding:3px 8px;font-size:0.6rem;color:white;font-weight:800;">✨ ใช้อยู่</div>' : '') +
            '</div>' +
            '<div style="padding:14px 16px;display:flex;flex-direction:column;gap:10px;">' +
            '<div style="display:flex;align-items:center;gap:10px;">' +
            '<button id="ts-bgm-btn-' + cfg.id + '" onclick="toggleThemeBGMPreview(\'' + cfg.id + '\')" style="background:#1e1b4b;border:1px solid #4338ca;color:#818cf8;padding:7px 16px;border-radius:8px;cursor:pointer;font-size:0.78rem;font-weight:700;">▶ ฟังเพลง</button>' +
            '<div style="font-size:0.68rem;color:#9ca3af;flex:1;">BGM: ' + cfg.label + '</div></div>' +
            '<div style="display:flex;align-items:center;gap:10px;">' + actionHtml + '</div>' +
            '</div></div>';
    });

    var equippedBadge = (equipped && CUSTOM_THEMES[equipped])
        ? '<div style="background:#1a1430;border:2px solid #a855f7;border-radius:14px;padding:12px 16px;margin-bottom:16px;display:flex;align-items:center;gap:12px;"><div style="font-size:1.5rem;">✨</div><div style="flex:1;"><div style="font-size:0.85rem;font-weight:800;color:#c4b5fd;">ธีมที่ใช้: ' + CUSTOM_THEMES[equipped].label + '</div><div style="font-size:0.65rem;color:#7c3aed;">BGM+พื้นหลังจากธีมนี้</div></div><button onclick="unequipTheme()" style="background:#374151;color:#9ca3af;border:none;padding:7px 14px;border-radius:8px;cursor:pointer;font-size:0.78rem;font-weight:700;">ถอด</button></div>'
        : '<div style="background:#111827;border:1px solid #374151;border-radius:12px;padding:10px 14px;margin-bottom:16px;font-size:0.72rem;color:#6b7280;">💡 ยังไม่ใส่ธีม — ใช้ BGM/พื้นหลังตาม Deck</div>';

    panel.innerHTML = '<div style="max-width:680px;margin:0 auto;padding:16px;">' +
        '<div style="display:flex;align-items:center;gap:12px;margin-bottom:18px;"><div style="font-size:2.5rem;">🎨</div><div><div style="font-size:1.3rem;font-weight:900;color:#a5b4fc;">Theme Shop</div><div style="font-size:0.75rem;color:#9ca3af;">💎 ' + gems + ' gems</div></div></div>' +
        equippedBadge + rows + '</div>';
}

// ── BOARD BG ──────────────────────────────────────────────────────
function _applyCustomThemeBG() {
    var themeId = typeof playerData !== 'undefined' ? playerData.equippedTheme : null;
    var cfg     = themeId ? CUSTOM_THEMES[themeId] : null;
    var gs      = document.getElementById('game-screen');
    if (!gs) return;
    if (cfg && cfg.boardBg) {
        gs.style.backgroundImage    = 'url(\'' + cfg.boardBg + '\')';
        gs.style.backgroundSize     = 'cover';
        gs.style.backgroundPosition = 'center';
    } else {
        gs.style.backgroundImage = '';
    }
}

// ── DECK BUILDER EDIT ─────────────────────────────────────────────
function editDeck(deckId) {
    var deck = null;
    for (var i = 0; i < playerData.decks.length; i++) {
        if (playerData.decks[i].id === deckId) { deck = playerData.decks[i]; break; }
    }
    if (!deck) { showToast('ไม่พบเดค', '#f87171'); return; }
    var norm = (deck.cards || []).map(function(c) {
        return typeof c === 'string' ? { name: c, theme: deck.theme || 'isekai_adventure' } : c;
    });
    deckBuilderState.cards           = norm.slice();
    deckBuilderState.editingDeckId   = deckId;
    deckBuilderState.editingDeckName = deck.name;
    renderDeckBuilderPanel();
    showToast('โหลดเดค "' + deck.name + '" เพื่อแก้ไขแล้ว', '#fbbf24');
}

// ── BOOT ──────────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', function() {

    // Init fields
    if (typeof playerData !== 'undefined') {
        if (!playerData.unlockedThemes)           playerData.unlockedThemes  = [];
        if (playerData.equippedTheme === undefined) playerData.equippedTheme = null;
    }

    // Backward compat
    var _origLoad = window.loadPlayerData;
    if (typeof _origLoad === 'function') {
        window.loadPlayerData = function() {
            var d = _origLoad.call(this);
            if (!d.unlockedThemes)            d.unlockedThemes  = [];
            if (d.equippedTheme === undefined) d.equippedTheme  = null;
            return d;
        };
    }

    // Inject Themes tab button + panel
    if (!document.getElementById('hub-tab-themes')) {
        var navBar = document.querySelector('.hub-nav-bar');
        var homePanel = document.getElementById('hub-panel-home');
        if (navBar && homePanel && homePanel.parentElement) {
            // Panel
            var newPanel = document.createElement('div');
            newPanel.id            = 'hub-panel-themes';
            newPanel.style.display = 'none';
            homePanel.parentElement.appendChild(newPanel);

            // Button — fully self-contained, no dependency on showHubTab
            var tabBtn = document.createElement('button');
            tabBtn.id        = 'hub-tab-themes';
            tabBtn.className = 'hub-nav-btn';
            tabBtn.textContent = '🎨 Themes';
            tabBtn.onclick = function() {
                ['home','packs','collection','deckbuilder','play'].forEach(function(t) {
                    var b = document.getElementById('hub-tab-' + t);
                    var p = document.getElementById('hub-panel-' + t);
                    if (b) b.classList.remove('active-tab');
                    if (p) p.style.display = 'none';
                });
                tabBtn.classList.add('active-tab');
                newPanel.style.display = '';
                _stopThemePreview();
                renderThemeShopPanel();
            };
            navBar.appendChild(tabBtn);
        }
    }

    // Patch showHubTab to hide themes panel when switching away
    var _origTab = window.showHubTab;
    if (typeof _origTab === 'function') {
        window.showHubTab = function(tab) {
            var tp = document.getElementById('hub-panel-themes');
            var tb = document.getElementById('hub-tab-themes');
            if (tp) tp.style.display = 'none';
            if (tb) tb.classList.remove('active-tab');
            _stopThemePreview();
            _origTab.apply(this, arguments);
        };
    }

    // Patch startBGMForGame
    var _origBGM = window.startBGMForGame;
    if (typeof _origBGM === 'function') {
        window.startBGMForGame = function() {
            var tid = typeof playerData !== 'undefined' ? playerData.equippedTheme : null;
            var cfg = tid ? CUSTOM_THEMES[tid] : null;
            if (cfg && cfg.bgm) {
                if (typeof stopBGM === 'function') stopBGM();
                if (!(typeof isMuted !== 'undefined' && isMuted)) {
                    window.currentBGM = new Audio(cfg.bgm);
                    window.currentBGM.loop = true;
                    window.currentBGM.volume = 0.35;
                    window.currentBGM.play().catch(function(){});
                }
            } else {
                _origBGM.call(this);
            }
        };
    }

    // Patch initGame → apply board BG
    var _origInit = window.initGame;
    if (typeof _origInit === 'function') {
        window.initGame = function() {
            _origInit.call(this);
            setTimeout(_applyCustomThemeBG, 50);
        };
    }

    // Patch backToHub → clear BG
    var _origBack = window.backToHub;
    if (typeof _origBack === 'function') {
        window.backToHub = function() {
            _origBack.call(this);
            var gs = document.getElementById('game-screen');
            if (gs) gs.style.backgroundImage = '';
            _stopThemePreview();
        };
    }

    // Patch saveDeckFromBuilder → update deck if editing
    var _origSave = window.saveDeckFromBuilder;
    if (typeof _origSave === 'function') {
        window.saveDeckFromBuilder = function() {
            var editId = deckBuilderState.editingDeckId;
            if (editId) {
                var deck = null;
                for (var i = 0; i < playerData.decks.length; i++) {
                    if (playerData.decks[i].id === editId) { deck = playerData.decks[i]; break; }
                }
                if (deck) {
                    var dmin = typeof DECK_MIN !== 'undefined' ? DECK_MIN : 60;
                    var dmax = typeof DECK_MAX !== 'undefined' ? DECK_MAX : 65;
                    if (deckBuilderState.cards.length < dmin || deckBuilderState.cards.length > dmax) {
                        showToast('เดคต้องมี ' + dmin + '-' + dmax + ' ใบ', '#f87171'); return;
                    }
                    var nm = prompt('ชื่อเดค:', deck.name) || deck.name;
                    deck.name = nm;
                    deck.cards = deckBuilderState.cards.slice();
                    saveData();
                    showToast('อัปเดตเดค "' + nm + '" แล้ว!', '#4ade80');
                    deckBuilderState.cards = [];
                    deckBuilderState.editingDeckId = null;
                    deckBuilderState.editingDeckName = null;
                    renderDeckBuilderPanel();
                    return;
                }
            }
            _origSave.call(this);
            deckBuilderState.editingDeckId = null;
            deckBuilderState.editingDeckName = null;
        };
    }

    // Patch renderDeckBuilderPanel → inject edit buttons + banner
    var _origDB = window.renderDeckBuilderPanel;
    if (typeof _origDB === 'function') {
        window.renderDeckBuilderPanel = function() {
            _origDB.call(this);
            var panel = document.getElementById('hub-panel-deckbuilder');
            if (!panel) return;

            // Editing banner
            if (deckBuilderState.editingDeckId && !panel.querySelector('#db-edit-banner')) {
                var banner = document.createElement('div');
                banner.id = 'db-edit-banner';
                banner.style.cssText = 'background:#1a2e1a;border:2px solid #4ade80;border-radius:12px;padding:10px 16px;margin:8px 12px 0;display:flex;align-items:center;gap:10px;';
                banner.innerHTML = '<span style="font-size:1.2rem;">✏️</span>' +
                    '<span style="flex:1;color:#4ade80;font-weight:800;font-size:0.8rem;">แก้ไขเดค: "' + (deckBuilderState.editingDeckName || '') + '"</span>' +
                    '<button onclick="deckBuilderState.editingDeckId=null;deckBuilderState.editingDeckName=null;deckBuilderState.cards=[];renderDeckBuilderPanel()" style="background:#374151;color:#9ca3af;border:none;padding:5px 12px;border-radius:8px;cursor:pointer;font-size:0.75rem;">ยกเลิก</button>';
                panel.insertBefore(banner, panel.firstChild);
                var sb = panel.querySelector('button[onclick*="saveDeckFromBuilder"]');
                if (sb) sb.innerHTML = '💾 บันทึกการแก้ไข';
            }

            // Edit buttons on saved decks
            panel.querySelectorAll('button[onclick*="deleteDeck"]').forEach(function(delBtn) {
                var m = (delBtn.getAttribute('onclick') || '').match(/deleteDeck\('([^']+)'\)/);
                if (!m) return;
                var dId = m[1];
                var row = delBtn.parentElement;
                if (!row || row.querySelector('.db-edit-btn')) return;
                var eb = document.createElement('button');
                eb.className = 'db-edit-btn';
                eb.textContent = '✏️';
                eb.title = 'แก้ไขเดค';
                eb.style.cssText = 'background:linear-gradient(135deg,#1d4ed8,#2563eb);color:white;border:none;padding:6px 8px;border-radius:8px;cursor:pointer;font-size:0.7rem;';
                eb.onclick = (function(id) { return function(e) { e.stopPropagation(); editDeck(id); }; })(dId);
                row.insertBefore(eb, row.firstChild);
            });
        };
    }
});
