// ============================================================
// 13_sound.js — BGM system, card sounds, SFX
// ============================================================

// ================================================================
// BGM SYSTEM — เพลงพื้นหลังตาม deck ที่เลือก
// ================================================================
const deckBGM = {
    'isekai_adventure': 'https://files.catbox.moe/gmyfpq.mp3',
    'mythology':        'https://files.catbox.moe/v8j4ov.mp3',
    'suankularb':       'https://files.catbox.moe/h658j7.m4a',
    'toy_trooper':      'https://files.catbox.moe/uzhmmb.mp3',
    'animal_kingdom':   'https://files.catbox.moe/wh8gd3.mp3',
    'humanity':         'https://files.catbox.moe/iqov5s.mp3',
};

let currentBGM = null;

function playBGM(theme) {
    stopBGM();
    if (isMuted) return;
    const url = deckBGM[theme];
    if (!url) return;
    currentBGM = new Audio(url);
    currentBGM.loop = true;
    currentBGM.volume = 0.35;
    currentBGM.play().catch(() => {});
}

function stopBGM() {
    if (currentBGM) {
        currentBGM.pause();
        currentBGM.currentTime = 0;
        currentBGM = null;
    }
}

function startBGMForGame() {
    // Online → เล่นเพลง deck ของตัวเอง | Hotseat/AI → P1
    let theme;
    if (gameMode === 'online') {
        theme = (myRole === 'player') ? selectedPlayerTheme : selectedAITheme;
    } else {
        theme = selectedPlayerTheme;
    }
    playBGM(theme);
}

let currentCardSound = null; // ติดตามเสียงที่กำลังเล่น

function playCardSound(cardName) {
    if (isMuted) return;
    const snd = cardSounds[cardName];
    if (snd) {
        // หยุดเสียงเดิมก่อน
        if (currentCardSound && currentCardSound !== snd) {
            currentCardSound.pause();
            currentCardSound.currentTime = 0;
        }
        // เล่นเสียงใหม่
        currentCardSound = snd;
        snd.currentTime = 0;
        snd.play().catch(() => {});
        return;
    }
    // fallback → เสียง summon ปกติ
    playSound('summon');
}

// ตั้งค่าเสียง
Object.values(sounds).forEach(s => {
    s.volume = 0.65;
    s.preload = 'auto';
});

function playSound(type) {
    if (!sounds[type]) return;
    sounds[type].currentTime = 0;
    sounds[type].play().catch(() => {});
}

// ================================================================
// FIREBASE + ONLINE MULTIPLAYER SYSTEM (rewrite)
// ================================================================

