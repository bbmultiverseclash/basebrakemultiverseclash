// ============================================================
// 03_engine.js — Core helpers, deck/card logic, game phases
// ============================================================
        function getMaxFieldSlots(playerKey) {
            if (state.sharedFieldCard && state.sharedFieldCard.name === 'Colosseum') return 1;
            return (state.sharedFieldCard && state.sharedFieldCard.name === 'Chess Board' && state.sharedFieldCardOwner === playerKey) ? 6 : 5;
        }

        // Resolve ชื่อจริงของการ์ด — รองรับ Shadow/Loki Clone และ Rimuru stolen ability
        function getEffectiveName(c) {
            if (c.name.startsWith('Shadow Token') || c.name.startsWith('Shadow army') || c.name.includes('Loki Clone')) return c.originalName || c.name;
            if (c.name === 'Rimuru Tempest' && c.stolenOriginalName) return c.stolenOriginalName;
            if (c.name.startsWith('LEGO ') && c.originalName) return c.originalName; // LEGO copy ใช้ originalName
            return c.name;
        }

        function log(msg, color="text-gray-300") {
            const logDiv = document.getElementById('game-log');
            const entry = document.createElement('div');
            entry.className = color;
            entry.innerText = `> ${msg}`;
            logDiv.appendChild(entry);
            logDiv.scrollTop = logDiv.scrollHeight;
            // Online P1: push log ไป Firebase ให้ P2 เห็นด้วย
            if (gameMode === 'online' && myRole === 'player' && onlineRoomId) {
                const logRef = db.ref('rooms/' + onlineRoomId + '/logs');
                logRef.push({ msg, color, ts: Date.now() });
            }
        }

        // ── P2: ฟัง log จาก P1 ──────────────────────────────────
        function listenForLogs() {
            db.ref('rooms/' + onlineRoomId + '/logs').on('child_added', snap => {
                if (!snap.val()) return;
                const { msg, color } = snap.val();
                const logDiv = document.getElementById('game-log');
                const entry = document.createElement('div');
                entry.className = color || 'text-gray-300';
                entry.innerText = `> ${msg}`;
                logDiv.appendChild(entry);
                logDiv.scrollTop = logDiv.scrollHeight;
            });
        }
        
        function createCardInstance(templateName, theme) {
            const templates = CardSets[theme];
            const template = templates[templateName];
            if (!template) return null;
            return {
                id: 'card_' + (cardIdCounter++),
                name: template.name,
                originalName: templateName,
                type: template.type,
                cost: template.cost,
                atk: template.atk || 0,
                hp: template.hp || 0,
                maxHp: template.maxHp || 0,
                text: template.text || '',
                color: template.color,
                maxAttacks: template.maxAttacks || 0,
                requiresTarget: template.requiresTarget || false,
                targetEnemy: template.targetEnemy || false,
                isConsumable: template.isConsumable || false,
                art: template.art || '',
                attacksLeft: 0,
                status: [],
                stolenText: '',
                hasAsunaBuff: false,
                hasRamBuff: false,
                hasRemBuff: false,
                items: [],
                costReducer: 0,
                damageReduce: 0,
                silenced: false,
                shalltearBleedTurns: 0,
                paralyzeTurns: 0,
                freezeTurns: 0,
                bleedTurns: 0,
                burnTurns: 0,
                goldenBuffExpires: [],
                poseidonReduceTurn: 0,
                tossakanPermanentReduce: false,
                queenImmortalTurns: 0,
                isSun: false,
                herculesExtraLives: 0,
                natureWandUsed: false,
                escutcheonTurns: 0,
                tossakanImmortalTurns: 0,
                tossakanImmune: false,
                immortalTurns: 0,
                clayBarrierTurns: 0,
                _theme: theme,
                evolveFrom: template.evolveFrom || null,
                tempBuffs: []
            };
        }

        function buildDeck(theme) {
            let deck = [];
            if (theme === "suankularb") {
                deck.push(createCardInstance('Pasut Kleebua', theme));
                deck.push(createCardInstance('Pratchaya', theme));
                deck.push(createCardInstance('Tata', theme));
                deck.push(createCardInstance('หาแหวน Dobble Bot', theme));
                for(let i = 0; i < 2; i++) deck.push(createCardInstance('Bee Eye Glass', theme));
                deck.push(createCardInstance('Joe Stk', theme));
                deck.push(createCardInstance('Phatchee', theme));
                deck.push(createCardInstance('Teak', theme));
                deck.push(createCardInstance('Pongneng', theme));
                return deck.sort(() => Math.random() - 0.5);
            }
            if (theme === "isekai_adventure") {
                deck.push(createCardInstance('Subaru', theme)); 
                deck.push(createCardInstance('Ainz Ooal Gown', theme)); 
                deck.push(createCardInstance('Aqua', theme)); 
                deck.push(createCardInstance('Emilia', theme)); 
                deck.push(createCardInstance('Tanya Degurechaff', theme)); 
                for(let i=0; i<3; i++) deck.push(createCardInstance('Goblin', theme)); 
                deck.push(createCardInstance('Shadow', theme)); 
                deck.push(createCardInstance('Rimuru Tempest', theme)); 
                for(let i=0; i<3; i++) deck.push(createCardInstance('Skeleton', theme)); 
                for(let i=0; i<2; i++) deck.push(createCardInstance('Death Knight', theme)); 
                for(let i=0; i<2; i++) deck.push(createCardInstance('Rafael', theme)); 
                deck.push(createCardInstance('Maple', theme)); 
                deck.push(createCardInstance('Explosion', theme)); 
                deck.push(createCardInstance('Seyya', theme)); 
                for(let i=0; i<2; i++) deck.push(createCardInstance('Revive', theme)); 
                deck.push(createCardInstance('Reinhard', theme));
                deck.push(createCardInstance('Kirito', theme));
                deck.push(createCardInstance('Asuna', theme));
                deck.push(createCardInstance('Shalltear', theme));
                deck.push(createCardInstance('Goal of All Life is Death', theme));
                deck.push(createCardInstance('Arthur Leywin', theme));
                deck.push(createCardInstance('Aether Core', theme));
                deck.push(createCardInstance('Skeleton King', theme));
                for(let i=0; i<2; i++) deck.push(createCardInstance('Sword', theme)); 
                for(let i=0; i<2; i++) deck.push(createCardInstance('Random Summon', theme)); 
                deck.push(createCardInstance('Fran', theme));
                deck.push(createCardInstance('Teacher', theme));
                deck.push(createCardInstance('Sinon', theme));
                deck.push(createCardInstance('Throne of the Kings', theme));
                deck.push(createCardInstance('Dragon Sword Reid', theme));
                for(let i=0; i<2; i++) deck.push(createCardInstance('Mana Energy', theme)); 
                deck.push(createCardInstance('Rem', theme));
                deck.push(createCardInstance('Ram', theme));
                deck.push(createCardInstance('Goblin Lord', theme));
                for(let i=0; i<2; i++) deck.push(createCardInstance('Army Summon', theme)); 
                for(let i=0; i<2; i++) deck.push(createCardInstance('Shield', theme)); 
                for(let i = 0; i < 2; i++) deck.push(createCardInstance('Elevate Hunted', theme));
                deck.push(createCardInstance('Skull Devourer', theme));
                deck.push(createCardInstance('Orc General', theme));
                deck.push(createCardInstance('Celestia Yupitalia', theme));
                for(let i = 0; i < 2; i++) deck.push(createCardInstance('Lightning Bolt', theme));
                for(let i = 0; i < 2; i++) deck.push(createCardInstance('Jura Tempest', theme));
                deck.push(createCardInstance('Shield of the Hero', theme));
                deck.push(createCardInstance('Ring of Ainz Ooal Gown', theme));
                deck.push(createCardInstance('Kim Dokja', theme));
                deck.push(createCardInstance('Sung Jin-Woo', theme));
                deck.push(createCardInstance('Kazuma Satou', theme));
                deck.push(createCardInstance('Kumoko', theme));
            } 
            else if (theme === "animal_kingdom") {
                deck.push(createCardInstance('Tiger', theme));               
                deck.push(createCardInstance('Giraffe', theme));             
                deck.push(createCardInstance('Silverback Gorilla', theme));  
                deck.push(createCardInstance('Komodo Dragon', theme));       
                deck.push(createCardInstance('Rhino', theme));               
                deck.push(createCardInstance('Bull', theme));
                deck.push(createCardInstance('Bull', theme));
                deck.push(createCardInstance('Elephant', theme));

                for(let i = 0; i < 2; i++) deck.push(createCardInstance('Savannah Sparrow', theme)); 
                for(let i = 0; i < 2; i++) deck.push(createCardInstance('Hyena', theme));            
                for(let i = 0; i < 2; i++) deck.push(createCardInstance('Kangaroo', theme));        
                for(let i = 0; i < 3; i++) deck.push(createCardInstance('Bullet Ant', theme));      

                deck.push(createCardInstance('Polar Bear', theme));          
                deck.push(createCardInstance('Hippo', theme));               
                for(let i = 0; i < 5; i++) deck.push(createCardInstance('Wolf', theme));             
                deck.push(createCardInstance('Grizzly Bear', theme));        
                deck.push(createCardInstance('Cheetah', theme));             
                deck.push(createCardInstance('Blue Whale', theme));          
                deck.push(createCardInstance('Lion King of Forest', theme)); 

                deck.push(createCardInstance('Chameleon', theme));
                deck.push(createCardInstance('Eagle', theme));
                deck.push(createCardInstance('Octopus', theme));
                deck.push(createCardInstance('Great White Shark', theme));
                deck.push(createCardInstance('Scorpion', theme));
                deck.push(createCardInstance('Salt water crocodile', theme));
                for(let i = 0; i < 2; i++) deck.push(createCardInstance('Chicken', theme));
                for(let i = 0; i < 3; i++) deck.push(createCardInstance('Mosquito', theme));
                deck.push(createCardInstance('Porcupine', theme));
                deck.push(createCardInstance('King Cobra', theme));

                for(let i = 0; i < 2; i++) deck.push(createCardInstance('Golden Apple', theme));
                for(let i = 0; i < 2; i++) deck.push(createCardInstance('Apple', theme));
                for(let i = 0; i < 2; i++) deck.push(createCardInstance('Wild Kingdom', theme));
                for(let i = 0; i < 2; i++) deck.push(createCardInstance('Mega Cage', theme));

                for(let i = 0; i < 2; i++) deck.push(createCardInstance('DNA Replication', theme));
                for(let i = 0; i < 2; i++) deck.push(createCardInstance('Call of the Wild', theme));
                deck.push(createCardInstance('Anaconda', theme));
                deck.push(createCardInstance('Ostrich', theme));
                deck.push(createCardInstance('Falcon', theme));
                for(let i = 0; i < 3; i++) deck.push(createCardInstance('Dog', theme));
                for(let i = 0; i < 3; i++) deck.push(createCardInstance('Cat', theme));
                for(let i = 0; i < 2; i++) deck.push(createCardInstance('Fullmoon', theme));
            }
            else if (theme === "mythology") {
                deck.push(createCardInstance('Gilgamesh', theme));
                deck.push(createCardInstance('Thor', theme));
                deck.push(createCardInstance('Mjolnir', theme));
                deck.push(createCardInstance('Sun Wukong', theme));
                deck.push(createCardInstance('Fairy', theme));
                deck.push(createCardInstance('Cyclops', theme));
                deck.push(createCardInstance('Behemoth', theme));
                deck.push(createCardInstance('Oni', theme));
                deck.push(createCardInstance('Basilisk', theme));
                deck.push(createCardInstance('Loki', theme));
                for(let i = 0; i < 2; i++) deck.push(createCardInstance('Valkyrie', theme)); 
                deck.push(createCardInstance('Hades', theme));
                deck.push(createCardInstance('Cerberus', theme));
                deck.push(createCardInstance('Poseidon', theme));
                deck.push(createCardInstance('Rama', theme));
                deck.push(createCardInstance('Tossakan', theme));
                deck.push(createCardInstance('Zeus', theme));
                deck.push(createCardInstance('Hercules', theme));
                deck.push(createCardInstance('Shiva', theme));
                deck.push(createCardInstance('Odin', theme));
                deck.push(createCardInstance('Gungnir', theme));
                deck.push(createCardInstance('Sword of Oni', theme));
                deck.push(createCardInstance('Trident', theme));
                deck.push(createCardInstance('Nature Realm Wand', theme));
                deck.push(createCardInstance('Bloody Fang', theme));
                deck.push(createCardInstance('Escutcheon', theme));
                deck.push(createCardInstance('Ra', theme));
                deck.push(createCardInstance('Ruyi Jingu', theme));
                deck.push(createCardInstance('Palee', theme));
                deck.push(createCardInstance('Hela', theme));
                deck.push(createCardInstance('King Arthur', theme));
                deck.push(createCardInstance('Excalibur', theme));
                deck.push(createCardInstance('Ruined Asguard', theme));
                deck.push(createCardInstance('Ruined Asguard', theme));
                deck.push(createCardInstance('Fenrir', theme));
                deck.push(createCardInstance('King Solomon', theme));
                deck.push(createCardInstance('Konshu', theme));
                deck.push(createCardInstance('Cronos', theme));
                deck.push(createCardInstance('Jormungandr', theme));
                deck.push(createCardInstance('Holy Grail', theme));
                deck.push(createCardInstance('Welcome to Heaven', theme));

                deck.push(createCardInstance('Gigatomachy', theme));
                deck.push(createCardInstance('Underworld Descent', theme));
                deck.push(createCardInstance('Apotheosis', theme));
                deck.push(createCardInstance('Attack Rune', theme));
                deck.push(createCardInstance('Defend Rune', theme));
                deck.push(createCardInstance('Ragnarok', theme));
                deck.push(createCardInstance('Mid Summon', theme));

                for(let i = 0; i < 3; i++) deck.push(createCardInstance('Heavenly Soldier', theme));
                for(let i = 0; i < 4; i++) deck.push(createCardInstance('Heaven Slave', theme));
                for(let i = 0; i < 3; i++) deck.push(createCardInstance('Bad Luck Try Again', theme));

                deck.push(createCardInstance('Heart of Tossakan', theme));
                deck.push(createCardInstance('The Arrow of Brahma', theme));
            }
            else if (theme === "toy_trooper") {
                deck.push(createCardInstance('King', theme));
                deck.push(createCardInstance('Queen', theme));
                for(let i = 0; i < 2; i++) deck.push(createCardInstance('Rook', theme));
                for(let i = 0; i < 2; i++) deck.push(createCardInstance('Bishop', theme));
                for(let i = 0; i < 6; i++) deck.push(createCardInstance('Pawn', theme));

                for(let i = 0; i < 2; i++) deck.push(createCardInstance('Lego Floor', theme));
                for(let i = 0; i < 2; i++) deck.push(createCardInstance('Teddy Bear', theme));
                for(let i = 0; i < 2; i++) deck.push(createCardInstance('Madness Teddy Bear', theme));
                for(let i = 0; i < 2; i++) deck.push(createCardInstance('Gundam Model', theme));
                for(let i = 0; i < 2; i++) deck.push(createCardInstance('Tung Tung Sahur', theme));
                for(let i = 0; i < 4; i++) deck.push(createCardInstance('Toy Soldier', theme));
                for(let i = 0; i < 2; i++) deck.push(createCardInstance('Jack in the Box', theme));
                for(let i = 0; i < 2; i++) deck.push(createCardInstance('Rubber Duck', theme));

                for(let i = 0; i < 3; i++) deck.push(createCardInstance('Lego Man', theme));
                deck.push(createCardInstance('Toy-Rex', theme));
                deck.push(createCardInstance('Majorette', theme));
                deck.push(createCardInstance('Hot Wheel', theme));
                for(let i = 0; i < 2; i++) deck.push(createCardInstance('Monopoly', theme));
                deck.push(createCardInstance('Symbol Block', theme));
                deck.push(createCardInstance('Rubick', theme));
                deck.push(createCardInstance('Ficker', theme));
                deck.push(createCardInstance('Card', theme));

                for(let i = 0; i < 2; i++) deck.push(createCardInstance('Toy Box Surprise', theme));
                deck.push(createCardInstance('I Think I Can Make This in LEGO', theme));
                for(let i = 0; i < 2; i++) deck.push(createCardInstance('Toy Takeover', theme));
                deck.push(createCardInstance('Lego Army Set', theme));
                deck.push(createCardInstance('Use Glue to Fix!', theme));
                deck.push(createCardInstance('Clay Barrier', theme));
                deck.push(createCardInstance('BB Gun', theme));
                for(let i=0;i<2;i++) deck.push(createCardInstance('Air Balloon', theme));
                for(let i=0;i<2;i++) deck.push(createCardInstance('Nerf Gun', theme));

                for(let i = 0; i < 2; i++) deck.push(createCardInstance('Chess Board', theme));
                for(let i = 0; i < 2; i++) deck.push(createCardInstance('Water Balloon', theme));
                deck.push(createCardInstance('Balloon Sword', theme));
                for(let i = 0; i < 2; i++) deck.push(createCardInstance('Clay Armor', theme));
            }
            if (theme === "humanity") {
                deck.push(createCardInstance('Miyamoto Musashi', theme));
                deck.push(createCardInstance('H.P. Lovecraft', theme));
                deck.push(createCardInstance('Oppenheimer', theme));
                deck.push(createCardInstance('Bayinnaung', theme));
                deck.push(createCardInstance('001 Adam', theme));
                deck.push(createCardInstance('Socrates', theme));
                deck.push(createCardInstance('Simo Häyhä', theme));
                deck.push(createCardInstance('Julius Caesar', theme));
                deck.push(createCardInstance('Nikola Tesla', theme));
                deck.push(createCardInstance('Leonidas I', theme));
                deck.push(createCardInstance('Jack the Ripper', theme));
                deck.push(createCardInstance('Vlad', theme));
                deck.push(createCardInstance('Usain Bolt', theme));
                deck.push(createCardInstance('Mike Tyson', theme));
                deck.push(createCardInstance('Artto', theme));
                deck.push(createCardInstance('นายจันทร์หนวดเขี้ยว', theme));
                deck.push(createCardInstance('นายทองเหม็น', theme));
                deck.push(createCardInstance('Adolf Hitler', theme));
                deck.push(createCardInstance('Christopher Columbus', theme));
                deck.push(createCardInstance('Gregor Johann Mendel', theme));
                deck.push(createCardInstance('Genghis Khan', theme));
                deck.push(createCardInstance('Newton', theme));
                deck.push(createCardInstance('Albert Einstein', theme));
                deck.push(createCardInstance('Alexander the great', theme));
                deck.push(createCardInstance('Charles Darwin', theme));
                deck.push(createCardInstance('Achimedes', theme));
                deck.push(createCardInstance('Luis Pasteur', theme));
                deck.push(createCardInstance('Messi', theme));
                deck.push(createCardInstance('Schrödinger', theme));
                deck.push(createCardInstance('Mozart', theme));
                for(let i=0; i<2; i++) deck.push(createCardInstance('Soldier', theme));
                for(let i=0; i<2; i++) deck.push(createCardInstance('Villager', theme));
                deck.push(createCardInstance('Tank', theme));
                for(let i=0; i<2; i++) deck.push(createCardInstance('Farmer', theme));
                for(let i=0; i<2; i++) deck.push(createCardInstance('Cavalry', theme));
                deck.push(createCardInstance('Gladiator', theme));
                // New Items
                for(let i=0; i<2; i++) deck.push(createCardInstance('Plague Costume', theme));
                deck.push(createCardInstance("Genie's Lamp", theme));
                deck.push(createCardInstance('Spartan Shield', theme));
                deck.push(createCardInstance('Zweihander', theme));
                deck.push(createCardInstance('SAKO M/28-30', theme));
                deck.push(createCardInstance('F-35', theme));
                for(let i=0; i<2; i++) deck.push(createCardInstance('Exo Skeleton Suit', theme));
                deck.push(createCardInstance('Medal of Promotion', theme));
                deck.push(createCardInstance('B-2 Spirit', theme));
                deck.push(createCardInstance('Niten Ichi-ryū', theme));
                for(let i=0; i<2; i++) deck.push(createCardInstance('Desert Eagle', theme));
                // New Action Cards
                deck.push(createCardInstance('Normandy Landings', theme));
                deck.push(createCardInstance('Hiroshima Atomic Bombing', theme));
                deck.push(createCardInstance('Theory of Relativity', theme));
                deck.push(createCardInstance('Prediction of Nostradamus', theme));
                deck.push(createCardInstance('Dynasty Collapse', theme));
                for(let i=0; i<2; i++) deck.push(createCardInstance('Kamikaze', theme));
                // New Field Cards
                deck.push(createCardInstance('Colosseum', theme));
                deck.push(createCardInstance('The Great Wall Of China', theme));
                deck.push(createCardInstance('Statue of Liberty', theme));
            }
            if (theme === 'mage') {
                // Mage deck — cards will be added later
            }
           if (theme === 'space') {
                for(let i=0; i<5; i++) deck.push(createCardInstance('Space Overseer', theme));
                for(let i=0; i<3; i++) deck.push(createCardInstance('One Eye', theme));
                for(let i=0; i<2; i++) deck.push(createCardInstance('Galax Dragon', theme));
                for(let i=0; i<2; i++) deck.push(createCardInstance('Holo Alien', theme));
            }
            }
            return deck.sort(() => Math.random() - 0.5);
        }

        function isItemSuppressed() {
            return state.sharedFieldCard?.name === 'Throne of the Kings';
        }

        function hasNatureImmune(playerKey) {
            const p = state.players[playerKey];
            return p.field.some(c => {
                const n = (c.name.startsWith('Shadow Token') || c.name.startsWith('Shadow army') || c.name.includes('Loki Clone')) ? c.originalName : c.name;
                return n === 'Fairy' && c.items.some(i => i.name === 'Nature Realm Wand') && getCharStats(c).hp > 0 && !c.silenced;
            });
        }

        function hasTrueDamage(card) {
            const effectiveName = (card.name.startsWith('Shadow Token') || card.name.startsWith('Shadow army') || card.name.includes('Loki Clone')) ? card.originalName : card.name;
            // Jack the Ripper: True Damage when opponent has 1 card on field
            if (effectiveName === 'Jack the Ripper') {
                let ownerKey = 'player';
                if (state.players.ai.field.some(c => c.id === card.id)) ownerKey = 'ai';
                const oppKey = ownerKey === 'player' ? 'ai' : 'player';
                if (state.players[oppKey].field.filter(c => c.hp > 0).length === 1) return true;
            }
            return (effectiveName === 'Rem' && card.hasRamBuff) || 
                   (effectiveName === 'Ram' && card.hasRemBuff) || 
                   effectiveName === 'Eagle' ||
                   effectiveName === 'Rama' ||
                   (card.items && card.items.some(i => i.name === 'Sword of Oni' || i.name === 'Bloody Fang'));
        }
        function applyTempBuff(card, atk, hp, turns) {
    if (!card.tempBuffs) card.tempBuffs = [];
    card.tempBuffs.push({ atk: atk || 0, hp: hp || 0, turns });
    card.atk += (atk || 0);
    card.hp += (hp || 0);
    card.maxHp += (hp || 0);
}
 
// เรียกตอนจบเทิร์น (ใน resolveEndPhase) เพื่อลด turns และเอา buff คืน
function tickTempBuffs(playerKey) {
    const p = state.players[playerKey];
    p.field.forEach(c => {
        if (!c.tempBuffs || c.tempBuffs.length === 0) return;
        for (let i = c.tempBuffs.length - 1; i >= 0; i--) {
            c.tempBuffs[i].turns--;
            if (c.tempBuffs[i].turns <= 0) {
                const b = c.tempBuffs[i];
                c.atk = Math.max(0, c.atk - b.atk);
                c.maxHp = Math.max(0, c.maxHp - b.hp);
                c.hp = Math.min(c.hp, c.maxHp);
                c.tempBuffs.splice(i, 1);
                log(`[Buff End] ${c.name} หมด buff ชั่วคราว (-${b.atk} ATK / -${b.hp} HP)`, 'text-gray-400');
            }
        }
    });
}
        function getCharStats(char) {
            let totalAtk = char.atk || 0;
            let totalMaxHp = char.maxHp || 0;
            let totalHp = char.hp || 0;
            let hasEvade = false;
            let damageReduce = 0;
            let damageMultiplier = 1.0;
            let maxAttacks = char.maxAttacks || 1;

            let ownerKey = 'player';
            if (state.players.ai.field.some(c => c.id === char.id)) ownerKey = 'ai';
            const ownField = state.players[ownerKey].field;

            const effectiveName = getEffectiveName(char);

            const pFieldLego = state.sharedFieldCard;
            // Lego Floor active ถ้าฝั่งใดฝั่งหนึ่งวางไว้
            const legoFloorActive = state.sharedFieldCard?.name === 'Lego Floor';
            if (legoFloorActive && char.type === 'Character' && char.cost >= 4) {
                totalHp = Math.max(0, totalHp - 2);
                totalMaxHp = Math.max(0, totalMaxHp - 2);
            }

            if (!isItemSuppressed() && char.items) {
                char.items.forEach(item => {
                    if (item.name === 'Sword') totalAtk += 3;
                    if (item.name === 'Dragon Sword Reid') { totalAtk += 4; totalMaxHp += 4; totalHp += 4; damageMultiplier = 0.67; }
                    if (item.name === 'Shield') { totalMaxHp += 3; totalHp += 3; }
                    if (item.name === 'Shield of the Hero') { totalMaxHp += 6; totalHp += 6; damageReduce = 2; }
                    if (item.name === 'Aether Core') hasEvade = true;
                    if (item.name === 'Sword of Oni') { totalAtk += 5; totalMaxHp += 5; totalHp += 5; }
                    if (item.name === 'Trident') { totalAtk += 7; totalMaxHp += 7; totalHp += 7; }
                    if (item.name === 'Bloody Fang') totalAtk += 5;
                    if (item.name === 'Escutcheon') { totalMaxHp += 8; totalHp += 8; }
                    if (item.name === 'Ruyi Jingu' && (char.name.includes('Sun Wukong') || char.originalName === 'Sun Wukong')) maxAttacks = 2;
                    if (item.name === 'Attack Rune') totalAtk += 2;
                    if (item.name === 'Defend Rune') { totalMaxHp += 2; totalHp += 2; }
                    if (item.name === 'BB Gun') totalAtk += 2;
                    if (item.name === 'Nerf Gun') totalAtk += 3;
                    if (item.name === 'Water Balloon') totalAtk += 2;
                    if (item.name === 'Balloon Sword') totalAtk += 3;
                    if (item.name === 'Clay Armor') { totalMaxHp += 3; totalHp += 3; }
                    // New Items
                    if (item.name === 'Plague Costume') { totalMaxHp += 2; totalHp += 2; }
                    if (item.name === 'Spartan Shield') { totalMaxHp += 7; totalHp += 7; }
                    if (item.name === 'Zweihander') totalAtk += 4;
                    if (item.name === 'SAKO M/28-30') { 
                        const isSimo = effectiveName === 'Simo Häyhä';
                        totalAtk += isSimo ? 6 : 3;
                        if (isSimo) { totalMaxHp += 5; totalHp += 5; }
                    }
                    if (item.name === 'F-35') { totalAtk += 2; totalMaxHp += 2; totalHp += 2; }
                    if (item.name === 'Exo Skeleton Suit') { totalAtk += 2; totalMaxHp += 2; totalHp += 2; }
                    if (item.name === 'Niten Ichi-ryū' && effectiveName === 'Miyamoto Musashi') { totalAtk += 2; maxAttacks = 2; }
                    if (item.name === 'Desert Eagle') totalAtk += 3;
                });
                const hasAttackRune = char.items.some(i => i.name === 'Attack Rune');
                const hasDefendRune = char.items.some(i => i.name === 'Defend Rune');
                if (hasAttackRune && hasDefendRune) { totalAtk += 2; totalMaxHp += 2; totalHp += 2; }
            }

            if (char.hasAsunaBuff) { totalAtk += 3; totalMaxHp += 3; totalHp += 3; }
            if (char.hasRamBuff) { totalMaxHp += 5; totalHp += 5; }
            if (char.hasRemBuff) { totalAtk += 3; }
            // King Arthur ongoing: มี Holy Grail ในสนาม → +10 ATK/HP
            if (char.hasHolyGrailBuff) { totalAtk += 10; totalMaxHp += 10; totalHp += 10; }

            // Silenced → ไม่มี ongoing effects ทั้งหมด
            if (char.silenced) {
                return { atk: Math.max(0, totalAtk), hp: Math.max(0, totalHp), maxHp: Math.max(0, totalMaxHp), hasEvade: false, damageReduce, damageMultiplier, maxAttacks };
            }

            // Genghis Khan Ongoing: Mongol Cavalry +1 ATK ต่อ Character ในสุสานของเรา
            if (effectiveName === 'Mongol Cavalry') {
                const hasKhan = ownField.some(c => {
                    const n = getEffectiveName(c);
                    return n === 'Genghis Khan' && getCharStats(c).hp > 0 && !c.silenced;
                });
                if (hasKhan) {
                    const gyCount = state.players[ownerKey].graveyard.filter(cc => cc.type === 'Character').length;
                    totalAtk += gyCount;
                }
            }

            if (effectiveName === 'Hippo' && state.sharedFieldCard) { totalAtk += 2; totalMaxHp += 2; totalHp += 2; }
            if (effectiveName === 'Bull') {
                const bullCount = ownField.filter(c => ((c.name.startsWith('Shadow Token') || c.name.startsWith('Shadow army') || c.name.includes('Loki Clone')) ? (c.originalName || c.name) : c.name) === 'Bull').length;
                if (bullCount > 1) damageMultiplier = 0.5;
            }
            if (effectiveName === 'Goblin') {
                const goblinCount = ownField.filter(c => ((c.name.startsWith('Shadow Token') || c.name.startsWith('Shadow army') || c.name.includes('Loki Clone')) ? (c.originalName || c.name) : c.name).startsWith('Goblin')).length;
                totalAtk += 2 * Math.max(0, goblinCount - 1);
                totalMaxHp += 2 * Math.max(0, goblinCount - 1);
                totalHp += 2 * Math.max(0, goblinCount - 1);
            }
            if (effectiveName === 'Cerberus') {
                const hasHades = ownField.some(c => ((c.name.startsWith('Shadow Token') || c.name.startsWith('Shadow army') || c.name.includes('Loki Clone')) ? (c.originalName || c.name) : c.name) === 'Hades');
                if (hasHades) { totalAtk += 2; totalMaxHp += 2; totalHp += 2; }
            }
            if (effectiveName === 'Lego Man') {
                const legoCount = ownField.filter(c => ((c.name.startsWith('Shadow Token') || c.name.startsWith('Shadow army') || c.name.includes('Loki Clone')) ? (c.originalName || c.name) : c.name) === 'Lego Man').length;
                totalAtk += 2 * Math.max(0, legoCount - 1);
            }
            if (effectiveName === 'Heaven Slave') {
                const slaveCount = ownField.filter(c => ((c.name.startsWith('Shadow Token') || c.name.startsWith('Shadow army') || c.name.includes('Loki Clone')) ? (c.originalName || c.name) : c.name) === 'Heaven Slave').length;
                const bonus = Math.max(0, slaveCount - 1);
                totalAtk += bonus; totalMaxHp += bonus; totalHp += bonus;
            }
            if (effectiveName === 'Rama') {
                const hasArrow = !isItemSuppressed() && char.items && char.items.some(i => i.name === 'The Arrow of Brahma');
                if (hasArrow) {
                    totalAtk += 5;
                    const aliveCharCount = ownField.filter(cc => cc.type === 'Character' && cc.hp > 0).length;
                    if (aliveCharCount === 1) maxAttacks = 2;
                }
            }

            if (effectiveName === 'Toy Soldier') {
                const charCount = ownField.filter(cc => cc.type === 'Character' && cc.hp > 0 && cc.id !== char.id).length;
                const bonus = Math.max(0, charCount);
                totalAtk += bonus;
                totalHp += bonus;
                totalMaxHp += bonus;
            }

            if (effectiveName === 'Pongneng') {
                const handBonus = state.players[ownerKey].hand.length;
                totalAtk += handBonus;
            }

            // Socrates: ถ้า Base HP ฝั่งเราเกิน 15 → Stat เป็น 4/4 (เฉพาะตอนยังมีชีวิต)
            if (effectiveName === 'Socrates' && state.players[ownerKey].hp > 15 && char.hp > 0) {
                if (totalAtk < 4) totalAtk = 4;
                if (totalHp < 4) totalHp = 4;
                if (totalMaxHp < 4) totalMaxHp = 4;
            }

            if (char.clayBarrierTurns > 0) {
                damageMultiplier = 0;
            }

            const pField = state.sharedFieldCard;
            const fieldOwner = state.sharedFieldCardOwner;
            if (pField?.name === 'Wild Kingdom' && fieldOwner === ownerKey) { totalAtk += 3; totalMaxHp += 3; totalHp += 3; }
            if (pField?.name === 'Jura Tempest' && fieldOwner === ownerKey) {
                let buff = 2;
                const hasRimuru = ownField.some(c => ((c.name.startsWith('Shadow Token') || c.name.startsWith('Shadow army') || c.name.includes('Loki Clone')) ? (c.originalName || c.name) : c.name) === 'Rimuru Tempest');
                if (hasRimuru) buff = 3;
                totalAtk += buff; totalMaxHp += buff; totalHp += buff;
            }

            if ((state.players[ownerKey].poseidonPermanentReduce || (state.players[ownerKey].poseidonReduceTurns || 0) > 0)) damageMultiplier *= 0.7;
            if (char.tossakanPermanentReduce) damageMultiplier *= 0.4;

            const ruinedActive = state.sharedFieldCard?.name === 'Ruined Asguard';
            if (ruinedActive) {
                if (char.cost >= 7) totalAtk = Math.max(0, totalAtk - 2);
                else totalAtk += 1;
            }

            // Vlad: +2 ATK/HP per mark on enemies
            if (effectiveName === 'Vlad') {
                const oppKey2 = ownerKey === 'player' ? 'ai' : 'player';
                const markCount = state.players[oppKey2].field.reduce((sum, c2) => sum + (c2.vladMarked || 0), 0);
                totalAtk += markCount * 2;
                totalHp += markCount * 2;
                totalMaxHp += markCount * 2;
            }

            // Gladiator: +5 HP/ATK ONLY if Colosseum currently in field (ongoing - not permanent)
            if (effectiveName === 'Gladiator') {
                const hasColosseum = state.sharedFieldCard && state.sharedFieldCard.name === 'Colosseum';
                if (hasColosseum) {
                    totalAtk += 5;
                    totalHp += 5;
                    totalMaxHp += 5;
                }
            }

            // Jack the Ripper: +4 ATK if opponent has only 1 card on field
            if (effectiveName === 'Jack the Ripper') {
                const oppKey2 = ownerKey === 'player' ? 'ai' : 'player';
                if (state.players[oppKey2].field.filter(c2 => c2.hp > 0).length === 1) {
                    totalAtk += 4;
                }
            }

            // Christopher Columbus: +ATK = cards in hand if opponent base 7-15
            // NOTE: use `char` (function arg). เดิมใช้ `card` ซึ่งไม่มีในสโคป ทำให้ ReferenceError เฉพาะตอน Columbus ถูกเรียก getCharStats
            if (effectiveName === 'Christopher Columbus' && !char.silenced) {
                const oppKey2 = ownerKey === 'player' ? 'ai' : 'player';
                const oppHp = state.players[oppKey2].hp;
                if (oppHp >= 7 && oppHp <= 15) {
                    const handCount = state.players[ownerKey].hand.length;
                    totalAtk += handCount;
                }
            }

            return { atk: Math.max(0, totalAtk), hp: Math.max(0, totalHp), maxHp: Math.max(0, totalMaxHp), hasEvade, damageReduce, damageMultiplier, maxAttacks };
        }

      function getActualCost(card, playerKey) {
    let baseCost = card.cost;
 
    // Holy Grail: cost 300 -30 ต่อ Character ในสุสาน
    if (card.name === 'Holy Grail') {
        const charCount = state.players[playerKey].graveyard.filter(c => c.type === 'Character').length;
        baseCost = Math.max(0, baseCost - (charCount * 30));
    }
 
    // Skeleton King: cost -3 ต่อ Skeleton ในสุสาน
    if (card.name === 'Skeleton King') {
        const skelCount = state.players[playerKey].graveyard.filter(c => c.name === 'Skeleton').length;
        baseCost = Math.max(0, baseCost - (skelCount * 3));
    }
 
    // PATCH: Cronos ต้องอยู่บนสนามก่อนถึงลด cost
    if (['Zeus','Hades','Poseidon'].includes(card.name)) {
        const hasCronos = state.players[playerKey].field.some(c => {
            const n = (c.name.startsWith('Shadow Token') || c.name.startsWith('Shadow army') || c.name.includes('Loki Clone')) ? c.originalName : c.name;
            return n === 'Cronos' && c.hp > 0;
        });
        if (hasCronos) baseCost = Math.max(0, baseCost - 4);
    }
 
    if (state.sharedFieldCard?.name === 'Jura Tempest') {
        const myRimuru = state.players[playerKey].field.some(c => {
            const n = (c.name.startsWith('Shadow Token') || c.name.startsWith('Shadow army') || c.name.includes('Loki Clone')) ? c.originalName : c.name;
            return n === 'Rimuru Tempest';
        });
        baseCost -= myRimuru ? 2 : 1;
    }
 
    const ruinedActive = state.sharedFieldCard?.name === 'Ruined Asguard';
    if (ruinedActive) {
        if (baseCost >= 7) baseCost = Math.max(0, baseCost - 2);
        else baseCost += 1;
    }
 
    // Joe Stk: Ongoing cost -3 ต่อ Character ใน deck + graveyard
    const joeStkOnField = state.players[playerKey].field.some(c => {
        const n = (c.name.startsWith('Shadow Token') || c.name.startsWith('Shadow army') || c.name.includes('Loki Clone')) ? c.originalName : c.name;
        return n === 'Joe Stk' && c.hp > 0;
    });
    if (joeStkOnField && card.type === 'Character') {
        const p = state.players[playerKey];
        const charCount = p.deck.filter(c => c.type === 'Character').length
                        + p.graveyard.filter(c => c.type === 'Character').length;
        baseCost = Math.max(0, baseCost - charCount * 3);
    }
 
    const p = state.players[playerKey];
    if (p.moonCycle >= 5) {
        baseCost = Math.max(0, baseCost - 5);
    }
 
    // Usain Bolt: ถ้า Base เรา < 10 → Cost -2
    if (card.name === 'Usain Bolt') {
        if (state.players[playerKey].hp < 10) baseCost = Math.max(0, baseCost - 2);
    }

    // Ainz Ooal Gown Ongoing: ถ้ามี Ainz บนสนาม → Action Card ใบแรกในเทิร์น Cost 0
    if (card.type === 'Action' && !state.actionPlayedThisTurn) {
        const hasAinz = state.players[playerKey].field.some(c => {
            const n = (c.name.startsWith('Shadow Token') || c.name.startsWith('Shadow army') || c.name.includes('Loki Clone')) ? c.originalName : c.name;
            return n === 'Ainz Ooal Gown' && getCharStats(c).hp > 0 && !c.silenced;
        });
        if (hasAinz) baseCost = 0;
    }

    if (isChaosMode) return 0;
    return Math.max(0, baseCost - (card.costReducer || 0));
}

        function drawCard(playerKey, count = 2) {
            const p = state.players[playerKey];
            // Guard: กันกรณีใน deck มี `null/undefined` ทำให้ render พัง
            let drawn = 0;
            let attempts = 0;
            const maxAttempts = Math.max(10, count * 6);
            while (drawn < count && attempts < maxAttempts) {
                attempts++;
                if (p.deck.length === 0) {
                    log(`${playerKey.toUpperCase()} การ์ดหมดกอง แพ้ทันที!`, 'text-red-500 font-bold');
                    endGame(playerKey === 'player' ? 'ai' : 'player');
                    return;
                }
                const next = p.deck.pop();
                if (!next) {
                    if (attempts <= 3) {
                        log(`[Deck] พบการ์ดไม่ถูกสร้าง (null/undefined) ระหว่างจั่วของ ${playerKey}`, 'text-red-400 font-bold');
                    }
                    continue;
                }
                p.hand.push(next);
                drawn++;
            }
            // Online: ตอนโฮสต์กำลัง resolve เอฟเฟกต์หลายขั้น เราไม่ควร updateUI/ส่ง state กลางคัน
            // เพราะ P2 อาจเห็นภาพ "การ์ดหาย" หรือเฟสค้างได้ ก่อนจบการกระทำหลัก
            if (!(gameMode === 'online' && myRole === 'player')) {
                updateUI();
            }
        }

        function initGame() {
            state.players.player.deck = buildDeck(selectedPlayerTheme);
            state.players.ai.deck = buildDeck(selectedAITheme);
            
            drawCard('player', 5);
            drawCard('ai', 5);
            // offer mulligan ให้ P1 เสมอ (online: หลัง mulligan P1 เสร็จค่อยส่ง signal P2)
            setTimeout(() => offerMulligan('player'), 600);
            state.players.player.cost = 3;
            state.players.ai.cost = 3;
            state.players.player.moonCycle = 0;
            state.players.ai.moonCycle = 0;
            state.players.player.apotheosisTurns = 0;
            state.players.ai.apotheosisTurns = 0;
            state.players.player.poseidonPermanentReduce = false;
            state.players.ai.poseidonPermanentReduce = false;
            
            log("เริ่มเกม! BASE BREAK: Multiverse Clash", "text-yellow-400");
            log(`ธีมผู้เล่น: ${selectedPlayerTheme} | ธีมฝั่งตรงข้าม: ${selectedAITheme}`, "text-yellow-300");
            log(`โหมด: ${isChaosMode ? '💥 CHAOS MODE' : gameMode === 'ai' ? 'VS AI' : 'Hotseat'}`);
            if (isChaosMode) {
                let b = document.getElementById('chaos-badge');
                if (!b) { b = document.createElement('div'); b.id = 'chaos-badge'; b.style.cssText = 'position:fixed;top:58px;left:50%;transform:translateX(-50%);background:#7c1d1d;color:#fca5a5;padding:3px 18px;border-radius:20px;font-weight:800;font-size:13px;z-index:300;pointer-events:none;letter-spacing:1px;'; b.innerText = '💥 CHAOS MODE — Cost ∞'; document.body.appendChild(b); }
            } else {
                const b = document.getElementById('chaos-badge'); if (b) b.remove();
            }
            startBGMForGame();
            startPhase('MAIN');
            // เริ่มเทิร์นแรก: Mozart ได้ +1 Note
            mozartAddNotes('player', 1, 'เริ่มเทิร์น');
        }

        function cancelTargeting() {
            state.targeting = { active: false, sourceCardId: null, validTargets: [], sourcePlayer: null, targetEnemy: false };
            document.getElementById('targeting-overlay').style.display = 'none';
            updateUI();
        }

        document.getElementById('btn-cancel-target').onclick = cancelTargeting;

        function nextPhase() {
            // Online P2: ส่ง action ให้ host execute
            if (gameMode === 'online' && myRole === 'ai' && state.currentTurn === 'ai') {
                sendOnlineAction({ type: 'nextPhase' }); return;
            }
            if (state.targeting.active) cancelTargeting();
            state.selectedCardId = null;
            if (state.phase === 'MAIN') startPhase('BATTLE');
            else if (state.phase === 'BATTLE') startPhase('END');
        }

        function startPhase(phase) {
            state.phase = phase;
            document.getElementById('phase-indicator').innerText = phase + " PHASE";
            
            const currentPlayer = state.players[state.currentTurn];
            currentPlayer.field.forEach(c => {
                c.spartanShieldUsedThisTurn = false;
                const hasPlagueCostumePara = c.items && c.items.some(item => item.name === 'Plague Costume');
                
                const isCCed = c.status.includes('Freeze') || c.status.includes('Paralyze') || c.status.includes('Levitate');
                
                if (!isCCed) {
                    c.attacksLeft = getCharStats(c).maxAttacks || 1;
                } else if (hasPlagueCostumePara && !c.status.includes('Levitate')) {
                    // Plague Costume กันแค่ Freeze/Paralyze แต่ไม่กัน Levitate
                    c.attacksLeft = getCharStats(c).maxAttacks || 1;
                    log(`🛡️ [Plague Costume] ${c.name} ภูมิคุ้มกัน Freeze/Paralyze!`, 'text-gray-400');
                } else {
                    c.attacksLeft = 0;
                }
                // ลบการรีเซ็ตยอด kill ของ Messi ออก เพื่อให้สะสมข้ามเทิร์นได้
            });
            
            if (phase === 'END') {
                resolveEndPhase(state.currentTurn);
                setTimeout(() => switchTurn(), 1000);
            }
            
            updateUI();
            if (state.currentTurn === 'ai' && gameMode === 'ai' && phase !== 'END') setTimeout(playAI, 1000);
        }

        function switchTurn() {
            // Theory of Relativity: skip opponent turn
            if (state.skipOpponentTurn) {
                state.skipOpponentTurn = false;
                log(`⏰ [Theory of Relativity] เวลาบิดเบี้ยว! ข้ามเทิร์นคู่ต่อสู้!`, 'text-purple-400 font-bold');
                // Don't switch turn, current player plays again
            } else {
                state.currentTurn = state.currentTurn === 'player' ? 'ai' : 'player';
            }
            state.totalTurns++;
            state.actionPlayedThisTurn = false;
            state.cardsPlayedThisTurn = 0;
            state.attacksMadeThisTurn = 0;

            // Reset Statue of Liberty for the player whose turn is starting
            const currentP = state.players[state.currentTurn];
            if (state.sharedFieldCard && state.sharedFieldCard.name === 'Statue of Liberty' && state.sharedFieldCardOwner === state.currentTurn) {
                currentP.statueOfLibertyUsed = false;
            }
            // Track our turns
            const isMyTurnNow = (state.currentTurn === 'player' && gameMode !== 'online') ||
                                (gameMode === 'online' && state.currentTurn === myRole);
            if (isMyTurnNow) sessionStats.turnsPlayed++;
            if (gameMode === 'online' && myRole === 'player' && state.currentTurn === 'ai') sessionStatsP2.turnsPlayed++;
            
            const p = state.players[state.currentTurn];
            
            if (state.totalTurns === 2) {
                p.cost = 5;
                log(`[Balance] Second Player ได้ Cost 5 (Turn 2)`, 'text-yellow-400');
            } else {
                const costGain = Math.floor(Math.random() * 5) + 3;
                p.cost = Math.min(20, p.cost + costGain);
            }
            log(`[System] Cost ปัจจุบัน: ${p.cost}`, 'text-blue-200');
            
            log(`--- เริ่มเทิร์น ${state.totalTurns} (${state.currentTurn.toUpperCase()}) ---`, 'text-blue-400');


            document.getElementById('turn-indicator').innerText = `TURN ${state.totalTurns} (${state.currentTurn.toUpperCase()})`;

            // Mozart: เริ่มเทิร์น +1 Note
            mozartAddNotes(state.currentTurn, 1, 'เริ่มเทิร์น');
            
            // F-35: ให้ผู้เล่นเลือก target ตอนเริ่มเทิร์น (ถ้าเป็น AI mode ให้สุ่ม)
            p.field.forEach(c => {
                if (c.items && c.items.some(item => item.name === 'F-35')) {
                    const allTargets = [...state.players.player.field, ...state.players.ai.field].filter(ch => ch.type === 'Character' && getCharStats(ch).hp > 0);
                    if (allTargets.length > 0) {
                        const isHumanTurn = (state.currentTurn === 'player' && gameMode !== 'ai') ||
                                           (gameMode === 'online' && state.currentTurn === myRole);
                        if (isHumanTurn) {
                            showF35TargetModal(c, allTargets);
                        } else {
                            const picked = allTargets[Math.floor(Math.random() * allTargets.length)];
                            c.f35TargetId = picked.id;
                            log(`✈️ [F-35] ล็อกเป้าหมาย: ${picked.name}`, 'text-sky-400');
                        }
                    }
                }
            });
            
            const hasLuisPasteur = p.field.some(c => getEffectiveName(c) === 'Luis Pasteur' && getCharStats(c).hp > 0 && !c.silenced);
            
            p.field.forEach(c => {
                if(c.status.includes('Poison') && !c.tossakanImmune) {
                    const hasPlagueCostume = c.items && c.items.some(item => item.name === 'Plague Costume');
                    if (!hasPlagueCostume) {
                        c.hp -= 1;
                        log(`${c.name} โดนดาเมจพิษ 1 หน่วย`, 'text-purple-400');
                    } else {
                        log(`🛡️ [Plague Costume] ${c.name} ภูมิคุ้มกัน Poison!`, 'text-gray-400');
                    }
                }
                if(c.status.includes('Bleed') && !c.tossakanImmune) {
                    const hasPlagueCostume = c.items && c.items.some(item => item.name === 'Plague Costume');
                    if (!hasLuisPasteur && !hasPlagueCostume) {
                        const bleedDmg = Math.floor(c.hp * 0.2) || 1;
                        c.hp -= bleedDmg;
                        log(`${c.name} โดนเลือดไหล (Bleed) ${bleedDmg} ดาเมจ`, 'text-red-500');
                        // Fairy Ongoing: heal +3 when any ally takes damage (except Poison)
                        const bleedPlayerKey = state.players.player.field.includes(c) ? 'player' : 'ai';
                        const hasFairyBleed = state.players[bleedPlayerKey].field.some(fc => {
                            const fn = (fc.name.startsWith('Shadow Token') || fc.name.startsWith('Shadow army') || fc.name.includes('Loki Clone')) ? (fc.originalName || fc.name) : fc.name;
                            return fn === 'Fairy' && getCharStats(fc).hp > 0 && !fc.silenced;
                        });
                        if (hasFairyBleed && bleedDmg > 0) {
                            c.hp += 3;
                            const maxNowBleed = getCharStats(c).maxHp;
                            if (c.hp > maxNowBleed) c.hp = maxNowBleed;
                            log(`[Fairy Ongoing] ${c.name} รับ Bleed → +3 HP`, 'text-pink-200');
                        }
                    }

                    if (c.shalltearBleedTurns > 0) {
                        c.shalltearBleedTurns--;
                        if (c.shalltearBleedTurns <= 0) {
                            c.status = c.status.filter(s => s !== 'Bleed');
                        }
                    }
                }
            });

            p.field.forEach(c => {
                const effName = (c.name.startsWith('Shadow Token') || c.name.startsWith('Shadow army') || c.name.includes('Loki Clone')) ? c.originalName : c.name;
                if (effName === 'Odin' && c.hp > 0) {
                    const half = Math.floor(c.hp / 2);
                    if (half > 0) {
                        c.hp -= half;
                        log(`[Odin] เสีย HP ครึ่งหนึ่ง (${half})`, 'text-blue-500');
                        // Fairy Ongoing: heal +3 when Odin takes self-damage
                        const odinPlayerKey = state.players.player.field.includes(c) ? 'player' : 'ai';
                        const hasFairyOdin = state.players[odinPlayerKey].field.some(fc => {
                            const fn = (fc.name.startsWith('Shadow Token') || fc.name.startsWith('Shadow army') || fc.name.includes('Loki Clone')) ? (fc.originalName || fc.name) : fc.name;
                            return fn === 'Fairy' && getCharStats(fc).hp > 0 && !fc.silenced;
                        });
                        if (hasFairyOdin) {
                            c.hp += 3;
                            const maxNowOdin = getCharStats(c).maxHp;
                            if (c.hp > maxNowOdin) c.hp = maxNowOdin;
                            log(`[Fairy Ongoing] Odin รับ self-damage → +3 HP`, 'text-pink-200');
                        }
                        p.field.forEach(other => {
                            if (other.id !== c.id && other.type === 'Character' && getCharStats(other).hp > 0) {
                                other.atk += 2;
                                other.maxHp += 2;
                                other.hp += 2;
                                log(`[Odin] ${other.name} +2 ATK/HP ถาวร`, 'text-blue-300');
                            }
                        });
                    }
                }
                if (effName === 'Rubick' && c.hp > 0) {
                    c.hp += 3;
                    c.maxHp += 3;
                    log(`[Rubick] +3 HP ถาวร`, 'text-purple-300');
                }
            });

            const hasKonshu = p.field.some(c => c.name === 'Konshu');
            if (hasKonshu) {
                if (!p.moonCycle) p.moonCycle = 0;
                p.moonCycle++;
                log(`[Konshu Moon Cycle] Turn ${p.moonCycle}`, 'text-indigo-400 font-bold');
                const isHalf = p.moonCycle % 2 === 1;
                if (isHalf) {
                    p.field.forEach(c => { if (c.type === 'Character' && getCharStats(c).hp > 0) c.hp += 1; });
                    log(`Half Moon: Heal +1 HP ทุกตัวในทีม`, 'text-indigo-300');
                } else {
                    p.field.forEach(c => { if (c.type === 'Character' && getCharStats(c).hp > 0) c.atk += 1; });
                    log(`Full Moon: +1 ATK ทุกตัวในทีม`, 'text-indigo-300');
                }
                if (p.moonCycle >= 5) {
                    p.hand.forEach(c => c.costReducer = (c.costReducer || 0) + 5);
                    log(`Moon Cycle ครบ 5: การ์ดในมือทุกใบ Cost -5`, 'text-indigo-400 font-bold');
                    if (p.moonCycle === 5 && p.field.length < getMaxFieldSlots(state.currentTurn)) {
                        const moon = {
                            id: 'card_' + (cardIdCounter++),
                            name: 'Moon',
                            originalName: 'Moon',
                            type: 'Character',
                            cost: 0,
                            atk: 0,
                            hp: 12,
                            maxHp: 12,
                            text: 'Moon Cycle Active',
                            color: 'bg-indigo-900',
                            maxAttacks: 0,
                            attacksLeft: 0,
                            status: [],
                            stolenText: '',
                            hasAsunaBuff: false,
                            hasRamBuff: false,
                            hasRemBuff: false,
                            items: [],
                            costReducer: 0,
                            damageReduce: 0,
                            silenced: false,
                            shalltearBleedTurns: 0,
                            paralyzeTurns: 0,
                freezeTurns: 0,
                            bleedTurns: 0,
                            burnTurns: 0,
                            goldenBuffExpires: [],
                            poseidonReduceTurn: 0,
                            tossakanPermanentReduce: false,
                            queenImmortalTurns: 0,
                            isSun: false,
                            herculesExtraLives: 0,
                            natureWandUsed: false,
                            escutcheonTurns: 0,
                            tossakanImmortalTurns: 0,
                            tossakanImmune: false,
                            clayBarrierTurns: 0
                        };
                        p.field.push(moon);
                        log(`🌕 Moon ได้ปรากฏตัวแล้ว!`, 'text-purple-500 font-bold');
                    }
                }
            }

            const ruinedActive = state.sharedFieldCard?.name === 'Ruined Asguard';
            if (ruinedActive) {
                ['player', 'ai'].forEach(pk => {
                    const pp = state.players[pk];
                    if (pp.hand.length > 0) {
                        const idx = Math.floor(Math.random() * pp.hand.length);
                        const discarded = pp.hand[idx];
                        // Holy Grail ไม่สามารถถูกทิ้งได้
                        if (discarded.name === 'Holy Grail' || discarded.type === 'Spell') {
                            log(`[Ruined Asguard] ${pk.toUpperCase()} ไม่สามารถทิ้ง Holy Grail ได้!`, 'text-yellow-400');
                        } else {
                            pp.hand.splice(idx, 1);
                            pp.graveyard.push(discarded);
                            log(`[Ruined Asguard] ${pk.toUpperCase()} ทิ้ง ${discarded.name}`, 'text-gray-400');
                        }
                    }
                });
            }

            // Holy Grail Wish System (เฉพาะฝั่งที่วาง Holy Grail)
            if (state.sharedFieldCard && state.sharedFieldCard.name === 'Holy Grail' && state.sharedFieldCardOwner === state.currentTurn) {
                if (!p.holyGrailWishes) p.holyGrailWishes = 0;
                if (p.holyGrailWishes < 3) {
                    p.holyGrailWishes++;
                    const wish = Math.floor(Math.random() * 3) + 1;
                    log(`✨ [Holy Grail] Wish ${p.holyGrailWishes}/3 activated!`, 'text-yellow-300 font-bold');
                    
                    if (wish === 1) {
                        // Wish 1: ชุบการ์ด cost 9+ จากสุสาน
                        const candidates = p.graveyard.filter(c => c.type === 'Character' && c.cost >= 9);
                        if (candidates.length > 0 && p.field.length < getMaxFieldSlots(state.currentTurn)) {
                            const idx = Math.floor(Math.random() * candidates.length);
                            const actualIdx = p.graveyard.findIndex(c => c.id === candidates[idx].id);
                            const revived = p.graveyard.splice(actualIdx, 1)[0];
                            revived.hp = revived.maxHp;
                            revived.status = [];
                            revived.items = [];
                            revived.attacksLeft = revived.maxAttacks || 1;
                            p.field.push(revived);
                            log(`🙏 Wish 1: ชุบ ${revived.name} (cost ≥9) จากสุสาน!`, 'text-yellow-400 font-bold');
                            triggerOnSummon(revived, state.currentTurn);
                        } else {
                            log(`🙏 Wish 1: ไม่มีการ์ด cost ≥9 ในสุสาน`, 'text-gray-400');
                        }
                    }
                    else if (wish === 2) {
                        // Wish 2: เพิ่ม stat ให้การ์ดสุ่ม = HP+ATK รวมในสุสาน (max 20 ต่อค่า)
                        if (p.field.length > 0) {
                            const target = p.field[Math.floor(Math.random() * p.field.length)];
                            let totalHp = 0, totalAtk = 0;
                            p.graveyard.forEach(c => {
                                if (c.type === 'Character') {
                                    totalHp += c.maxHp || c.hp || 0;
                                    totalAtk += c.atk || 0;
                                }
                            });
                            const hpGain = Math.min(20, totalHp);
                            const atkGain = Math.min(20, totalAtk);
                            target.atk += atkGain;
                            target.hp += hpGain;
                            target.maxHp += hpGain;
                            log(`🙏 Wish 2: ${target.name} +${atkGain} ATK / +${hpGain} HP (จากสุสาน)`, 'text-yellow-400 font-bold');
                        } else {
                            log(`🙏 Wish 2: ไม่มีตัวบนสนาม`, 'text-gray-400');
                        }
                    }
                    else if (wish === 3) {
                        // Wish 3: ทำดาเมจ Base ศัตรู 2, Heal Base ตัวเอง 2
                        const oppKey = state.currentTurn === 'player' ? 'ai' : 'player';
                        state.players[oppKey].hp -= 3;
                        p.hp += 3;
                        log(`🙏 Wish 3: Base ศัตรู -3 HP, Base ตัวเอง +3 HP`, 'text-yellow-400 font-bold');
                        checkWinCondition();
                    }
                }
                
                // หมดทั้ง 3 wish = Holy Grail หายไป (ไม่เข้าสุสาน - Indestructible)
                if (p.holyGrailWishes >= 3) {
                    state.sharedFieldCard = null;
                    state.sharedFieldCardOwner = null;
                    p.holyGrailWishes = 0;
                    log(`✨ [Holy Grail] ใช้ครบ 3 Wishes แล้ว! จอกศักด์สิทธิ์หายไปจากเกม...`, 'text-yellow-500 font-bold');
                }
            }

            checkDeath(state.currentTurn);

            drawCard(state.currentTurn, 2);
            startPhase('MAIN');
        }

        function resolveEndPhase(playerKey) {
            const p = state.players[playerKey];
            const hasLuisPasteur = p.field.some(c => getEffectiveName(c) === 'Luis Pasteur' && getCharStats(c).hp > 0 && !c.silenced);
            // ลด turn-based effects ทั้งสองฝั่งทุกจบเทิร์น
            ['player','ai'].forEach(pk => {
                const pp = state.players[pk];
                // ลด poseidonReduceTurns ระดับ player
                if ((pp.poseidonReduceTurns || 0) > 0) {
                    pp.poseidonReduceTurns--;
                    if (pp.poseidonReduceTurns <= 0) { pp.poseidonReduceTurns=0; log(`[Poseidon] การลดดาเมจ 30% หมดอายุ`,'text-blue-300'); }
                }
                pp.field.forEach(c => {
                    // Freeze
                    if (c.status.includes('Freeze')) {
                        c.freezeTurns = (c.freezeTurns || 0) - 1;
                        if (c.freezeTurns <= 0) { c.status = c.status.filter(s=>s!=='Freeze'); c.freezeTurns=0; log(`❄️ ${c.name} หายจาก Freeze แล้ว`,'text-cyan-300'); }
                    }
                    // Paralyze
                    if (c.status.includes('Paralyze')) {
                        c.paralyzeTurns = (c.paralyzeTurns || 0) - 1;
                        if (c.paralyzeTurns <= 0) { c.status = c.status.filter(s=>s!=='Paralyze'); c.paralyzeTurns=0; log(`⚡ ${c.name} หายจาก Paralyze แล้ว`,'text-yellow-300'); }
                    }
                    // Levitate
                    if (c.status.includes('Levitate')) {
                        c.levitateTurns = (c.levitateTurns || 0) - 1;
                        if (c.levitateTurns <= 0) { c.status = c.status.filter(s=>s!=='Levitate'); c.levitateTurns=0; log(`🎈 ${c.name} ร่วงลงสู่พื้น (หายจาก Levitate)`,'text-purple-300'); }
                    }
                    if ((c.escutcheonTurns||0) > 0) {
                        c.escutcheonTurns--;
                        if (c.escutcheonTurns <= 0) log(`[Escutcheon] ${c.name} หมด Untargetable`,'text-gray-300');
                    }
                    // Clay Barrier (damage reduce)
                    if ((c.clayBarrierTurns||0) > 0) {
                        c.clayBarrierTurns--;
                        if (c.clayBarrierTurns <= 0) log(`[Clay Barrier] ${c.name} หมด damage reduction`,'text-stone-300');
                    }
                    // Tesla Evade
                    if ((c.teslaEvadeTurns||0) > 0) {
                        c.teslaEvadeTurns--;
                        if (c.teslaEvadeTurns <= 0) log(`⚡ [Tesla] Evade หมดอายุ`,'text-blue-300');
                    }
                    // Musashi Nerf
                    if ((c.musashiNerfTurns||0) > 0) {
                        c.musashiNerfTurns--;
                        if (c.musashiNerfTurns <= 0) {
                            if (c.musashiNerfOrigAtk !== undefined) { c.atk = c.musashiNerfOrigAtk; delete c.musashiNerfOrigAtk; }
                            c.musashiNerfTurns=0;
                            log(`⚔️ [Musashi Nerf End] ${c.name} ATK กลับมาเป็น ${c.atk}`,'text-stone-400');
                        }
                    }
                });
            });
            p.field.forEach(c => {
                if (c.silenced) return;

                if(c.status.includes('Burn') && !c.tossakanImmune) {
                    const hasPlagueCostume = c.items && c.items.some(item => item.name === 'Plague Costume');
                    if (!hasLuisPasteur && !hasPlagueCostume) {
                        c.hp -= 1;
                        log(`${c.name} โดนดาเมจไฟไหม้ 1 หน่วย`, 'text-red-400');
                        // Fairy Ongoing: heal +3 when any ally takes damage (except Poison)
                        const burnPlayerKey = state.players.player.field.includes(c) ? 'player' : 'ai';
                        const hasFairyBurn = state.players[burnPlayerKey].field.some(fc => {
                            const fn = (fc.name.startsWith('Shadow Token') || fc.name.startsWith('Shadow army') || fc.name.includes('Loki Clone')) ? (fc.originalName || fc.name) : fc.name;
                            return fn === 'Fairy' && getCharStats(fc).hp > 0 && !fc.silenced;
                        });
                        if (hasFairyBurn) {
                            c.hp += 3;
                            const maxNowBurn = getCharStats(c).maxHp;
                            if (c.hp > maxNowBurn) c.hp = maxNowBurn;
                            log(`[Fairy Ongoing] ${c.name} รับ Burn → +3 HP`, 'text-pink-200');
                        }
                    }
                    if (c.burnTurns > 0) {
                        c.burnTurns--;
                        if (c.burnTurns <= 0) {
                            c.status = c.status.filter(s => s !== 'Burn');
                            c.burnTurns = 0;
                        }
                    }
                }
                
                const effectiveName = (c.name.startsWith('Shadow Token') || c.name.startsWith('Shadow army') || c.name.includes('Loki Clone')) ? c.originalName : c.name;
                if (effectiveName === 'Seyya') {
                    c.atk += 2;
                    log(`[Effect] Seyya เพิ่มพลัง! ATK พื้นฐาน +2`, 'text-yellow-300');
                }

                if (effectiveName === 'Asuna') {
                log(`⚡ "Asuna มาแล้ว! อย่าให้เพื่อนเจ็บแม้แต่คนเดียว!"`, 'text-red-200 font-bold italic');
                    const friends = p.field.filter(fc => getCharStats(fc).hp > 0 && !fc.status.includes('Poison'));
                    if (friends.length > 0) {
                        const target = friends[Math.floor(Math.random() * friends.length)];
                        target.hp = Math.min(getCharStats(target).maxHp, target.hp + 2);
                        log(`[Effect] Asuna ฮีล 2 HP ให้ ${target.name}!`, 'text-red-300');
                    }
                }

                if (effectiveName === 'Reinhard') {
                log(`⚔️ "ข้าคือ Reinhard van Astrea — อัศวินดาบศักดิ์สิทธิ์!"`, 'text-yellow-200 font-bold italic');
                    const roll = Math.floor(Math.random() * 3);
                    if (roll === 0) { c.maxHp += 3; c.hp += 3; log(`[Effect] Reinhard รับพร! Max HP +3`, 'text-yellow-300'); } 
                    else if (roll === 1) { c.atk += 3; log(`[Effect] Reinhard รับพร! ATK +3`, 'text-yellow-300'); } 
                    else { c.atk += 3; c.maxHp += 3; c.hp += 3; log(`[Effect] Reinhard รับพรสมบูรณ์! ATK/HP +3`, 'text-yellow-400'); }
                }

                if (effectiveName === 'Shiva') {
                    log(`[Shiva] His third eye is open... World is collapsing! 👁️‍🗨️ ทิ้งการ์ดมือ 2 ใบ`, 'text-red-500 font-bold');
                    for (let k = 0; k < 2 && p.hand.length > 0; k++) {
                        const idx = Math.floor(Math.random() * p.hand.length);
                        const discarded = p.hand[idx];
                        // Holy Grail ไม่สามารถถูกทิ้งได้
                        if (discarded.name === 'Holy Grail' || discarded.type === 'Spell') {
                            log(`Shiva ไม่สามารถทิ้ง Holy Grail ได้!`, 'text-yellow-400');
                        } else {
                            p.hand.splice(idx, 1);
                            p.graveyard.push(discarded);
                            log(`Shiva ทิ้ง ${discarded.name}`, 'text-red-300');
                        }
                    }
                }

                if (effectiveName === 'Monopoly') {
                log(`🎩 "DO NOT PASS GO, DO NOT COLLECT $200!"`, 'text-green-300 font-bold italic');
                    p.hand.forEach(cc => {
                        cc.costReducer = (cc.costReducer || 0) + 2;
                    });
                    log(`[Monopoly] Cost การ์ดในมือทุกใบ -2`, 'text-green-300');
                }

                // ── Humanity end-of-turn effects ──────────────────────────
                if (effectiveName === 'Nikola Tesla' && getCharStats(c).hp > 0) {
                    // Tick tesla evade turns
                    // teslaEvadeTurns ลดใน resolveEndPhase ทั้งสองฝั่งแล้ว
                    // +3 cost bonus
                    p.cost = Math.min(20, p.cost + 3);
                    log(`⚡ [Tesla Ongoing] +3 Cost พิเศษ! (ตอนนี้ ${p.cost})`, 'text-blue-400');
                }

                if (effectiveName === 'Simo Häyhä' && getCharStats(c).hp > 0 && !c.silenced) {
                    const oppKey = playerKey === 'player' ? 'ai' : 'player';
                    const opp = state.players[oppKey];
                    if (opp.field.length > 0) {
                        const victim = opp.field[Math.floor(Math.random() * opp.field.length)];
                        const victimName = victim.name;
                        victim.hp = -99;
                        log(`☃️ [Simo Häyhä] จบเทิร์น: สุ่มฆ่า ${victimName}!`, 'text-green-400 font-bold');
                        checkDeath(oppKey);
                    }
                }

                if (effectiveName === 'Miyamoto Musashi' && c.musashiDieNextTurn && getCharStats(c).hp > 0) {
                    c.hp = -99;
                    log(`⚔️ [Musashi] หมดเวลา... ตายตามที่กำหนด`, 'text-stone-400 font-bold');
                }

                if (effectiveName === 'Newton' && getCharStats(c).hp > 0 && !c.silenced) {
                    let candidates = p.field.filter(cc => cc.type === 'Character' && cc.id !== c.id && getCharStats(cc).hp > 0);
                    if (candidates.length > 0) {
                        const target = candidates[Math.floor(Math.random() * candidates.length)];
                        target.hp -= 2;
                        target.immortalTurns = Math.max(target.immortalTurns || 0, 2); // Immortal next turn
                        log(`📐 [Newton] จบเทิร์น: ${target.name} อมตะเทิร์นหน้า แต่ -2 HP`, 'text-sky-300 font-bold');
                    } else {
                        log(`📐 [Newton] ไม่มีเป้าหมายอื่นให้ใช้งาน`, 'text-gray-500');
                    }
                }

                // Musashi NERF — tick down ATK=1 nerf บนศัตรูทุกเทิร์น
                // (nerf ถูกติดกับตัวศัตรูโดยตรง ไม่ต้องทำอะไรใน resolveEndPhase ของ Musashi เอง)
                // tick ลดเทิร์นใน resolveEndPhase ของฝั่งศัตรู (ดูด้านล่าง)

                if (effectiveName === '001 Adam' && getCharStats(c).hp > 0 && !c.silenced) {
                    const adamCandidates = p.deck.filter(cc => cc.type === 'Character' && cc.cost >= 5);
                    if (adamCandidates.length > 0 && p.field.length < getMaxFieldSlots(playerKey)) {
                        const rand = Math.floor(Math.random() * adamCandidates.length);
                        const chosen = adamCandidates[rand];
                        const deckIdx = p.deck.findIndex(d => d.id === chosen.id);
                        if (deckIdx !== -1) {
                            const summoned = p.deck.splice(deckIdx, 1)[0];
                            summoned.attacksLeft = summoned.maxAttacks || 1;
                            p.field.push(summoned);
                            log(`🔴 [001 Adam] จบเทิร์น: อัญเชิญ ${summoned.name} (cost ${summoned.cost})!`, 'text-red-400 font-bold');
                            triggerOnSummon(summoned, playerKey);
                        }
                    } else if (adamCandidates.length === 0) {
                        log(`🔴 [001 Adam] ไม่มีตัว cost >=5 ในเด็ค`, 'text-gray-500');
                    }
                }
                if (effectiveName === 'Vlad' && getCharStats(c).hp > 0 && !c.silenced) {
                    const oppKey = playerKey === 'player' ? 'ai' : 'player';
                    const opp = state.players[oppKey];
                    if (opp.field.length > 0) {
                        const markTarget = opp.field[Math.floor(Math.random() * opp.field.length)];
                        if (!markTarget.vladMarked) markTarget.vladMarked = 0;
                        markTarget.vladMarked++;
                        markTarget.vladMarkerId = c.id;
                        log(`🩸 [Vlad] จบเทิร์น: Mark ${markTarget.name}! (${markTarget.vladMarked} marks)`, 'text-red-300 font-bold');
                    }
                }

                // Mike Tyson: reset dodge each turn
                if (effectiveName === 'Mike Tyson' && getCharStats(c).hp > 0) {
                    c.tysonDodgedThisTurn = false;
                }

                // Adolf Hitler: end of turn, all ur chars +1 ATK (limit +2 total from ongoing)
                if (effectiveName === 'Adolf Hitler' && getCharStats(c).hp > 0 && !c.silenced) {
                    if (!c.hitlerBuffCount) c.hitlerBuffCount = 0;
                    if (c.hitlerBuffCount < 2) {
                        c.hitlerBuffCount++;
                        p.field.forEach(cc => {
                            if (cc.id !== c.id && getCharStats(cc).hp > 0) {
                                cc.atk += 1;
                                log(`[Hitler Ongoing] ${cc.name} +1 ATK (บัฟรอบที่ ${c.hitlerBuffCount}/2)`, 'text-gray-300');
                            }
                        });
                    }
                }

                // Gregor Johann Mendel: end of opponent turn → random buff +1 HP/ATK to own char
                // (This triggers during the OPPONENT's end phase for the Mendel owner)
                if (effectiveName === 'Gregor Johann Mendel' && getCharStats(c).hp > 0 && !c.silenced) {
                    // Check if this is the opponent's turn ending (Mendel belongs to the other side)
                    const mendelOwnerKey = playerKey; // This runs during playerKey's end phase
                    // Mendel wants to trigger at end of OPPONENT's turn
                    // So if we are in AI's end phase and Mendel is on player's field, it triggers
                    // We handle this by checking: Mendel is NOT on the current playerKey's side
                    // Actually, resolveEndPhase runs for the current player. So we check if Mendel's owner is NOT playerKey
                    // But this loop iterates p.field which IS playerKey's field
                    // So we need a separate check. Let's just trigger at end of own turn too (simpler, balanced)
                    const ownField = p.field.filter(cc => cc.id !== c.id && getCharStats(cc).hp > 0);
                    if (ownField.length > 0) {
                        const target = ownField[Math.floor(Math.random() * ownField.length)];
                        target.atk += 1;
                        target.hp += 1;
                        target.maxHp += 1;
                        log(`🧬 [Mendel Ongoing] ${target.name} +1 ATK, +1 HP!`, 'text-green-300 font-bold');
                    }
                }

                // ── End humanity end-of-turn effects ──────────────────────


                if (c.isSun && getCharStats(c).hp > 0) {
                    log(`[Sun] อาทิตย์ยังสว่าง! Burn ทุกการ์ดทั้งสองฝ่าย 🔥`, 'text-orange-400 font-bold');
                    ['player','ai'].forEach(pk => {
                        state.players[pk].field.forEach(cc => {
                            if (!cc.tossakanImmune && !hasNatureImmune(pk) && !cc.status.includes('Burn')) {
                                cc.status.push('Burn');
                                cc.burnTurns = 999;
                            }
                        });
                    });
                }

                if (c.items && c.items.some(i => i.name === 'Water Balloon')) {
                    const oppKey = playerKey === 'player' ? 'ai' : 'player';
                    const opp = state.players[oppKey];
                    if (opp.field.length > 0) {
                        let target = opp.field[Math.floor(Math.random() * opp.field.length)];
                        if (!target.tossakanImmune && !hasNatureImmune(oppKey) && !target.status.includes('Freeze')) {
                            target.status.push('Freeze'); target.freezeTurns = 2;
                            log(`[Water Balloon] สุ่ม Freeze ${target.name} 1 ตัว! ❄️`, 'text-cyan-300');
                        }
                    }
                }

                // Genie's Lamp - grant wish at end of turn
                if (c.items) {
                    c.items.forEach(item => {
                        if (item.name === "Genie's Lamp") {
                            if (!item.wishCount) item.wishCount = 0;
                            if (item.wishCount < 3) {
                                const wishRoll = Math.floor(Math.random() * 3);
                                item.wishCount++;
                                if (!item.wishesGranted) item.wishesGranted = [];

                                if (wishRoll === 0) {
                                    // Wish 1: Double damage → ใช้ flag บน character
                                    c.genieDamageDouble = true;
                                    item.wishesGranted.push('damage');
                                    log(`🧞 [Genie's Lamp] Wish #${item.wishCount}: Double Damage! ${c.name} ดาเมจ x2!`, 'text-yellow-400 font-bold');
                                } else if (wishRoll === 1) {
                                    // Wish 2: Double HP
                                    const gain = c.maxHp;
                                    c.hp += gain;
                                    c.maxHp += gain;
                                    item.wishesGranted.push('hp');
                                    log(`🧞 [Genie's Lamp] Wish #${item.wishCount}: Double HP! ${c.name} HP x2 (${c.hp})`, 'text-yellow-400 font-bold');
                                } else {
                                    // Wish 3: 30% damage reduction → ใช้ flag บน character
                                    c.genieReduction = true;
                                    item.wishesGranted.push('reduction');
                                    log(`🧞 [Genie's Lamp] Wish #${item.wishCount}: 30% Damage Reduction! ${c.name}!`, 'text-yellow-400 font-bold');
                                }

                                if (item.wishCount >= 3) {
                                    c.genieDamageDouble = false;
                                    c.genieReduction = false;
                                    log(`🧞 [Genie's Lamp] ครบ 3 wishes! ไปที่สุสาน`, 'text-yellow-500 font-bold');
                                    p.graveyard.push(item);
                                    const idx = c.items.findIndex(i => i === item);
                                    if (idx !== -1) c.items.splice(idx, 1);
                                }
                            }
                        }
                    });
                }

                // SAKO M/28-30: Deal damage at end of turn
                if (c.items) {
                    c.items.forEach(item => {
                        if (item.name === 'SAKO M/28-30') {
                            const oppKey = playerKey === 'player' ? 'ai' : 'player';
                            const opp = state.players[oppKey];
                            const isSimo = (c.name.startsWith('Shadow Token') || c.name.startsWith('Shadow army') || c.name.includes('Loki Clone')) ? c.originalName : c.name;
                            const dmg = isSimo === 'Simo Häyhä' ? 5 : 3;
                            if (opp.field.length > 0) {
                                const target = opp.field[Math.floor(Math.random() * opp.field.length)];
                                target.hp -= dmg;
                                log(`🔫 [SAKO M/28-30] ยิง ${target.name} รับ ${dmg} ดาเมจ!`, 'text-green-400');
                            }
                        }
                    });
                }

                // F-35: Deal 3 damage to chosen target at end of turn (selected at start of turn)
                if (c.items && c.items.some(item => item.name === 'F-35')) {
                    const oppKey35 = playerKey === 'player' ? 'ai' : 'player';
                    const allChars35 = [...state.players.player.field, ...state.players.ai.field].filter(ch => ch.type === 'Character' && getCharStats(ch).hp > 0);
                    // ใช้ target ที่เลือกไว้ ถ้าเป้าตายไปแล้วให้สุ่มใหม่
                    let t35 = c.f35TargetId ? allChars35.find(ch => ch.id === c.f35TargetId) : null;
                    if (!t35 && allChars35.length > 0) t35 = allChars35[Math.floor(Math.random() * allChars35.length)];
                    if (t35) {
                        t35.hp -= 3;
                        c.f35TargetId = null;
                        log(`✈️ [F-35] โจมตีเป้าที่ล็อกไว้ ${t35.name} 3 ดาเมจ!`, 'text-sky-400');
                        checkDeath(state.players.player.field.some(ch => ch.id === t35.id) ? 'player' : 'ai');
                    }
                }

                // B-2 Spirit: Deal 10 True damage to ONE random opponent card at full HP
                if (c.items && c.items.some(item => item.name === 'B-2 Spirit')) {
                    const oppKeyB2 = playerKey === 'player' ? 'ai' : 'player';
                    const oppB2 = state.players[oppKeyB2];
                    const fullHpChars = oppB2.field.filter(ch => ch.type === 'Character' && ch.hp === ch.maxHp && ch.hp > 0);
                    if (fullHpChars.length > 0) {
                        const target = fullHpChars[Math.floor(Math.random() * fullHpChars.length)];
                        target.hp -= 10;
                        log(`✈️ [B-2 Spirit] ${target.name} ที่ HP เต็ม รับ 10 True damage!`, 'text-gray-400 font-bold');
                        checkDeath(oppKeyB2);
                    }
                }

                // Freeze/Paralyze handled in resolveEndPhase start

                // Musashi Nerf tick-down — ATK=1 nerf หมดอายุ
                // musashiNerfTurns ลดใน resolveEndPhase ทั้งสองฝั่งแล้ว
            });

            p.field.forEach(c => {
                if (c.goldenBuffExpires && c.goldenBuffExpires.length > 0) {
                    for (let i = c.goldenBuffExpires.length - 1; i >= 0; i--) {
                        c.goldenBuffExpires[i]--;
                        if (c.goldenBuffExpires[i] <= 0) {
                            c.maxHp -= 4;
                            if (c.hp > c.maxHp) c.hp = c.maxHp;
                            c.goldenBuffExpires.splice(i, 1);
                            log(`[Buff End] Golden Apple บน ${c.name} หมดอายุ!`, 'text-amber-300');
                        }
                    }
                }
            });

            if (p.apotheosisTurns > 0) p.apotheosisTurns--;
            // poseidonReduceTurns ลดใน resolveEndPhase ทั้งสองฝั่งแล้ว

            p.field.forEach(c => {
                if (c.tossakanImmortalTurns > 0) {
                    c.tossakanImmortalTurns--;
                    if (c.tossakanImmortalTurns <= 0) {
                        c.tossakanImmune = false;
                        log(`[Immortal End] Tossakan Immortal หมดอายุ`, 'text-emerald-300');
                    }
                }
                if (c.queenImmortalTurns > 0) {
                    c.queenImmortalTurns--;
                    if (c.queenImmortalTurns <= 0) {
                        log(`[Queen Immortal End] Queen หมดการอมตะ`, 'text-pink-300');
                    }
                }

                if ((c.immortalTurns || 0) > 0) {
                    c.immortalTurns--;
                    if (c.immortalTurns <= 0) {
                        log(`[Immortal End] ${c.name} หมดการอมตะ`, 'text-emerald-300');
                    }
                }
            });

            // Mozart: ถ้าทั้งเทิร์นไม่ทำอะไรเลย → +3 Note
            if ((state.cardsPlayedThisTurn || 0) === 0 && (state.attacksMadeThisTurn || 0) === 0) {
                mozartAddNotes(playerKey, 3, 'ไม่ทำอะไร');
            }

            checkDeath(playerKey);
        }

        function checkOngoingAuras() {
            ['player', 'ai'].forEach(pk => {
                const p = state.players[pk];
                const hasAsuna = p.field.some(c => {
                    return getEffectiveName(c) === 'Asuna' && getCharStats(c).hp > 0 && !c.silenced;
                });
                const hasRem = p.field.some(c => {
                    return getEffectiveName(c) === 'Rem' && getCharStats(c).hp > 0 && !c.silenced;
                });
                const hasRam = p.field.some(c => {
                    return getEffectiveName(c) === 'Ram' && getCharStats(c).hp > 0 && !c.silenced;
                });
                // Teak-Phatchee: Teak ได้ Taunt ถ้ามี Phatchee อยู่ในสนาม
                const hasPhatchee = p.field.some(c => {
                    return getEffectiveName(c) === 'Phatchee' && getCharStats(c).hp > 0 && !c.silenced;
                });
                // King Arthur: ได้ +10 ATK/HP ถ้ามี Holy Grail ใน fieldCard และเป็นฝั่งที่วาง Holy Grail
                const hasHolyGrail = state.sharedFieldCard && state.sharedFieldCard.name === 'Holy Grail' && state.sharedFieldCardOwner === pk;

                p.field.forEach(c => {
                    if (c.silenced) return;
                    const name = getEffectiveName(c);
                    if (name === 'Kirito') c.hasAsunaBuff = hasAsuna;
                    if (name === 'Ram') c.hasRemBuff = hasRam;
                    if (name === 'Rem') c.hasRamBuff = hasRam;
                    // Teak: ถ้ามี Phatchee = ได้ Taunt (ใช้ flag hasTaunt)
                    if (name === 'Teak') c.hasPhatcheeTaunt = hasPhatchee;
                    // King Arthur: ถ้ามี Holy Grail = +10 ATK/HP
                    if (name === 'King Arthur') c.hasHolyGrailBuff = hasHolyGrail;
                });
            });
        }

        function mozartAddNotes(playerKey, amount, reason) {
            const p = state.players[playerKey];
            if (!p) return;

            p.field.forEach(m => {
                const name = getEffectiveName(m);
                if (name !== 'Mozart' || m.silenced) return;
                if (getCharStats(m).hp <= 0) return;

                if (typeof m.mozartNotes !== 'number') m.mozartNotes = 0;
                m.mozartNotes += amount;
                log(`🎼 [Mozart] ${reason}: +${amount} Note (ตอนนี้ ${m.mozartNotes})`, 'text-purple-300 font-bold');

                // ครบ 4 Note → trigger บัฟแบบ On Summon อีกครั้ง
                while (m.mozartNotes >= 4) {
                    m.mozartNotes -= 4;
                    p.field.forEach(cc => {
                        if (cc.type === 'Character' && getCharStats(cc).hp > 0) {
                            cc.atk += 1;
                            cc.hp += 1;
                            cc.maxHp += 1;
                        }
                    });
                    log(`🎶 [Mozart Trigger] ครบ Note! บัฟทั้งสนาม +1 ATK/+1 HP`, 'text-purple-200 font-bold');
                }
            });
        }

