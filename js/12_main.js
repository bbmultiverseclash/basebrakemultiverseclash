// ============================================================
// 12_main.js — resetAndInitGame, game initialization
// ============================================================
        function resetAndInitGame() {
            // isChaosMode ไม่ reset — rematch ใช้โหมดเดิม
            resetSessionStats(); // reset per-game tracking
            state = {
                totalTurns: 1,
                currentTurn: 'player',
                phase: 'MAIN',
                selectedCardId: null,
                targeting: { active: false, sourceCardId: null, validTargets: [], sourcePlayer: null, targetEnemy: false },
                actionPlayedThisTurn: false,
                cardsPlayedThisTurn: 0,
                attacksMadeThisTurn: 0,
                sharedFieldCard: null,
                sharedFieldCardOwner: null,
                players: {
                    player: { hp: 20, cost: 3, deck: [], hand: [], field: [], graveyard: [], spaceZone: [], moonCycle: 0, apotheosisTurns: 0, poseidonPermanentReduce: false, poseidonReduceTurns: 0 },
                    ai:     { hp: 20, cost: 3, deck: [], hand: [], field: [], graveyard: [], spaceZone: [], moonCycle: 0, apotheosisTurns: 0, poseidonPermanentReduce: false, poseidonReduceTurns: 0 }
                }
            };
            cardIdCounter = 0;
            document.getElementById('game-log').innerHTML = '';
            initGame();
        }

        document.getElementById('btn-next-phase').onclick = () => {
            if (state.targeting.active) return;
            // Online/Draft P1: กดได้เฉพาะตาตัวเอง
            if ((gameMode === 'online' || gameMode === 'draft') && myRole === 'player' && state.currentTurn !== 'player') return;
            nextPhase();
        };

        document.getElementById('ai-base-ui').onclick = () => {
            if (state.phase === 'BATTLE' && state.selectedCardId) {
                // P1 โจมตี ai base | P2 online โจมตี player base (เพราะ P2 มอง player เป็นศัตรู)
                if (gameMode === 'online') {
                    if (myRole === 'player') initiateAttack(state.selectedCardId, null, true);
                } else {
                    const opponentKey = state.currentTurn === 'player' ? 'ai' : 'player';
                    if (opponentKey === 'ai') initiateAttack(state.selectedCardId, null, true);
                }
            }
        };
        document.getElementById('player-base-ui').onclick = () => {
            if (state.phase === 'BATTLE' && state.selectedCardId) {
                if (gameMode === 'online') {
                    if (myRole === 'ai') initiateAttack(state.selectedCardId, null, true);
                } else {
                    const opponentKey = state.currentTurn === 'player' ? 'ai' : 'player';
                    if (opponentKey === 'player') initiateAttack(state.selectedCardId, null, true);
                }
            }
        };
        
            // ====================== SOUND BUTTON ======================
    let isMuted = false;

    function toggleMute() {
        isMuted = !isMuted;
        const vol = isMuted ? 0 : 0.65;
        
        Object.values(sounds).forEach(s => {
            if (s) s.volume = vol;
        });
        Object.values(cardSounds).forEach(s => {
            if (s) s.volume = isMuted ? 0 : 0.75;
        });
        if (currentBGM) currentBGM.volume = isMuted ? 0 : 0.35;
        
        const btn = document.getElementById('sound-btn');
        if (btn) btn.textContent = isMuted ? '🔇 Sound OFF' : '🔊 Sound ON';
    }
        // ====================== SOUND EFFECTS ======================
const sounds = {
    summon: new Audio('https://files.catbox.moe/kj3jmu.wav'),   // ← เปลี่ยนเป็นลิงก์จริงของคุณ
    attack: new Audio('https://files.catbox.moe/iw4odu.mp3'),
    damage: new Audio('https://files.catbox.moe/iw4odu.mp3'),
    discard: new Audio('https://files.catbox.moe/37kui5.wav'),
    win: new Audio('https://files.catbox.moe/mu7wrw.wav'),
    lose: new Audio('https://files.catbox.moe/q49ajd.wav'),
    cardPlay: new Audio('https://files.catbox.moe/kj3jmu.wav')
};

// ── Per-card custom sounds (ลงการ์ดไหนมีเสียงนั้น) ──────────────────
// key = ชื่อการ์ด, value = URL เสียง
const cardSounds = {
    'Pongneng': new Audio('https://files.catbox.moe/rvzfo5.mp3'),
    'Mozart': new Audio('https://files.catbox.moe/65okt6.mp3'),
    // 🦁 สัตว์ป่า/กินซาก
    'Tiger': new Audio('https://archive.org/download/animals-and-birds-sound-effects/09%20Tiger%20Roar.mp3'),
    'Lion King of Forest': new Audio('https://archive.org/download/animals-and-birds-sound-effects/08%20Lion%20Roar%2C%20Throaty.mp3'),
    'Cheetah': new Audio('https://archive.org/download/animals-and-birds-sound-effects/13%20Cheetah.mp3'),
    'Hyena': new Audio('https://archive.org/download/animals-and-birds-sound-effects/45%20Hyena%2C%20Spotted%20Laugh%2C%20Two%20Hyenas.mp3'),
    'Wolf': new Audio('https://archive.org/download/animals-and-birds-sound-effects/16%20Wolf%20Howl.mp3'),
    // 🐘 สัตว์บกขนาดใหญ่
    'Elephant': new Audio('https://archive.org/download/animals-and-birds-sound-effects/36%20Elephant%20Trumpeting.mp3'),
    'Giraffe': new Audio('https://archive.org/download/animals-and-birds-sound-effects/39%20Giraffe.mp3'),
    'Rhino': new Audio('https://archive.org/download/animals-and-birds-sound-effects/56%20Rhinoceros%20Snorts%2C%20Eating.mp3'),
    'Hippo': new Audio('https://archive.org/download/animals-and-birds-sound-effects/43%20Hippopotamus%20Roar.mp3'),
    'Bull': new Audio('https://archive.org/download/animals-and-birds-sound-effects/32%20Cow%20Single%20MOO%20X%206.mp3'),
    // 🐻 หมีและสัตว์กินเนื้อ
    'Polar Bear': new Audio('https://archive.org/download/animals-and-birds-sound-effects/24%20Bear%2C%20Polar%20Roars%2C%20Multiple%20Angry.mp3'),
    'Grizzly Bear': new Audio('https://archive.org/download/animals-and-birds-sound-effects/23%20Bear%2C%20Grizzly%20Roar%2C%20Single.mp3'),
    'Silverback Gorilla': new Audio('https://archive.org/download/animals-and-birds-sound-effects/41%20Gorilla%2C%20Large%20Gorilla%20Hooting.mp3'),
    // 🌊 สัตว์น้ำ/ทะเล
    'Blue Whale': new Audio('https://archive.org/download/animals-and-birds-sound-effects/63%20Whale%2C%20Grey%20Calls%2C%20Multiple%20Low.mp3'),
    'Salt water crocodile': new Audio('https://archive.org/download/animals-and-birds-sound-effects/33%20Crocodile.mp3'),
    'Komodo Dragon': new Audio('https://archive.org/download/GOLD_TAPE_12_Animals/G12-19-Alligator%20Growl%2C%20Snap.wav'),
    'Anaconda': new Audio('https://archive.org/download/GOLD_TAPE_12_Animals/G12-25-Rattlesnake%20Hiss.wav'),
    'Great White Shark': new Audio('https://archive.org/download/GOLD_TAPE_12_Animals/G12-15-Dolphins%20Underwater.wav'),
    'Octopus': new Audio('https://archive.org/download/GOLD_TAPE_12_Animals/G12-15-Dolphins%20Underwater.wav'),
    // 🐕 สัตว์เลี้ยงลูกด้วยนมขนาดกลาง-เล็ก
    'Dog': new Audio('https://archive.org/download/animals-and-birds-sound-effects/14%20Small%20Dog%20Barks.mp3'),
    'Cat': new Audio('https://archive.org/download/animals-and-birds-sound-effects/01%20Cat%2C%20Meowing%2C%20Excited%20Tom%20Cat%2C%20Animal.mp3'),
    'Kangaroo': new Audio('https://archive.org/download/SSE_Library_ANIMALS/WILD/ANMLWild_Baby%20monkey%20and%20cheetah%20wrestling%20and%20playing_CS_USC.wav'),
    // 🦅 นกและสัตว์ปีก
    'Eagle': new Audio('https://archive.org/download/animals-and-birds-sound-effects/71%20Bird%2C%20Eagle%20Bald%20Eagle_Call.mp3'),
    'Chicken': new Audio('https://archive.org/download/animals-and-birds-sound-effects/67%20Bird%2C%20Chicken%20Single%20Calls%20X%202.mp3'),
    'Savannah Sparrow': new Audio('https://archive.org/download/Red_Library_Animals_Birds/R30-38-Small%20Bird%20Calling.wav'),
    'Ostrich': new Audio('https://archive.org/download/lp_sounds-of-animals-audible-communication-of_arthur-merwin-greenhall-nicholas-collias/04%20Rhea.mp3'),
    'Falcon': new Audio('https://archive.org/download/animals-and-birds-sound-effects/71%20Bird%2C%20Eagle%20Bald%20Eagle_Call.mp3'),
    // 🦎 สัตว์เลื้อยคลานและแมลง
    'Chameleon': new Audio('https://archive.org/download/animals-and-birds-sound-effects/29%20Chameleon%20Breaths.mp3'),
    'Mosquito': new Audio('https://archive.org/download/SSE_Library_ANIMALS/INSECT/ANMLInsc_Mosquito%20buzzing%3B%20not%20real_CS_USC.wav'),
    'King Cobra': new Audio('https://archive.org/download/GOLD_TAPE_12_Animals/G12-25-Rattlesnake%20Hiss.wav'),
    // 🐗 สัตว์อื่นๆ
    'Porcupine': new Audio('https://archive.org/download/SSE_Library_ANIMALS/WILD/ANMLWild_Porcupine%20puffing%20grunting%20%26%20rattling%20quills_CS_USC.wav'),
    'Scorpion': new Audio('https://archive.org/download/SSE_Library_ANIMALS/INSECT/ANMLInsc_Bees%20swarming_CS_USC.wav'),
    'Bullet Ant': new Audio('https://archive.org/download/SSE_Library_ANIMALS/INSECT/ANMLInsc_Mosquito%20buzzing%3B%20not%20real_CS_USC.wav'),
    // 🎴 Action/Field cards — เสียง ambient เหมาะกับ effect
    'Fullmoon': new Audio('https://archive.org/download/animals-and-birds-sound-effects/16%20Wolf%20Howl.mp3'),
    'Wild Kingdom': new Audio('https://archive.org/download/animals-and-birds-sound-effects/36%20Elephant%20Trumpeting.mp3'),
    'Call of the Wild': new Audio('https://archive.org/download/animals-and-birds-sound-effects/08%20Lion%20Roar%2C%20Throaty.mp3'),
    'Mega Cage': new Audio('https://archive.org/download/animals-and-birds-sound-effects/33%20Crocodile.mp3'),
    'DNA Replication': new Audio('https://archive.org/download/SSE_Library_ANIMALS/INSECT/ANMLInsc_Bees%20swarming_CS_USC.wav'),
    'Golden Apple': new Audio('https://archive.org/download/animals-and-birds-sound-effects/67%20Bird%2C%20Chicken%20Single%20Calls%20X%202.mp3'),
    'Apple': new Audio('https://archive.org/download/animals-and-birds-sound-effects/67%20Bird%2C%20Chicken%20Single%20Calls%20X%202.mp3'),
};
Object.values(cardSounds).forEach(s => { s.volume = 0.75; s.preload = 'auto'; });
