// ============================================================
// 04_effects.js — Card effects: triggerOnSummon, playAction
// ============================================================
        function triggerOnSummon(card, playerKey) {
            playCardSound(card.name);
            if (gameMode === 'online') pushSoundEvent(null, card.name);
            if (card.silenced) return;
            const opponentKey = playerKey === 'player' ? 'ai' : 'player';
            const p = state.players[playerKey];
            const opp = state.players[opponentKey];

            const effectiveName = (card.name.startsWith('Shadow Token') || card.name.startsWith('Shadow army') || card.name.includes('Loki Clone')) ? card.originalName : card.name;

            // Lego Floor: penalty คำนวณใน getCharStats แล้ว (ongoing) — ไม่ต้องลด card.hp ซ้ำที่นี่
            if (state.sharedFieldCard?.name === 'Lego Floor' && card.type === 'Character' && card.cost >= 4) {
                log(`[Lego Floor] ${card.name} โดน Lego ลด HP -2!`, 'text-yellow-400 font-bold');
            }

            // ── Humanity deck on-summon effects ──────────────────────────
            if (effectiveName === 'Miyamoto Musashi') {
                log(`⚔️ 「我、天下無双。剣は語らず、屍のみが証明する。」`, 'text-yellow-200 font-bold italic');
                log(`[Musashi] ลงสนาม! สุ่มศัตรู 1 ตัว → ATK กลายเป็น 1 เป็นเวลา 3 เทิร์น`, 'text-stone-400 font-bold');
                const musEnemies0 = opp.field.filter(c => c.type === 'Character' && getCharStats(c).hp > 0);
                if (musEnemies0.length > 0) {
                    const musT0 = musEnemies0[Math.floor(Math.random() * musEnemies0.length)];
                    // save original atk and set nerf
                    musT0.musashiNerfOrigAtk = musT0.atk;
                    musT0.atk = 1;
                    musT0.musashiNerfTurns = 6;
                    log(`⚔️ [Musashi] ปิดทาง ${musT0.name}! ATK → 1 เป็นเวลา 3 เทิร์น`, 'text-stone-300 font-bold');
                } else {
                    log(`[Musashi] ไม่มีเป้าหมายศัตรู`, 'text-gray-500');
                }
            }
            if (effectiveName === 'H.P. Lovecraft') {
                log(`🐙 "That is not dead which can eternal lie, And with strange aeons even death may die."`, 'text-indigo-200 font-bold italic');
                log(`[Lovecraft] สร้าง Cthulhu Token 12/4 — Ph'nglui mglw'nafh Cthulhu R'lyeh wgah'nagl fhtagn!`, 'text-indigo-400 font-bold');
                if (p.field.length < getMaxFieldSlots(playerKey)) {
                    const cthulhu = {
                        id: 'card_' + (cardIdCounter++), name: 'Cthulhu', originalName: 'Cthulhu',
                        type: 'Character', cost: 0, atk: 12, hp: 4, maxHp: 4,
                        text: 'ตาย: Lovecraft +7 ATK ถาวร | Lovecraft ตาย: ATK x2',
                        color: 'bg-green-950', maxAttacks: 1, attacksLeft: 1,
                        status: [], items: [], silenced: false,
                        shalltearBleedTurns: 0, paralyzeTurns: 0, bleedTurns: 0, burnTurns: 0,
                        goldenBuffExpires: [], poseidonReduceTurn: 0, tossakanPermanentReduce: false,
                        queenImmortalTurns: 0, isSun: false, herculesExtraLives: 0,
                        natureWandUsed: false, escutcheonTurns: 0, tossakanImmortalTurns: 0,
                        tossakanImmune: false, clayBarrierTurns: 0, tempBuffs: [],
                        hasAsunaBuff: false, hasRamBuff: false, hasRemBuff: false,
                        costReducer: 0, damageReduce: 0, stolenText: '', isCthulhu: true,
                        lovecraftId: card.id
                    };
                    p.field.push(cthulhu);
                    log(`🐙 Cthulhu 12/4 ลงสนามแล้ว!`, 'text-green-400 font-bold');
                }
            }

            if (effectiveName === 'Anutin') {
                const hasTerrain = !!state.sharedFieldCard;
                let immortalRoll;
                if (!hasTerrain) {
                    immortalRoll = 1;
                } else {
                    const terrainCost = state.sharedFieldCard.cost || 0;
                    immortalRoll = terrainCost >= 7 ? 3 : terrainCost >= 4 ? 2 : 1;
                    // สุ่มเพิ่ม 0-1 บนเทเรน
                    immortalRoll = Math.min(3, immortalRoll + (Math.random() < 0.5 ? 0 : 1));
                }
                card.immortalTurns = immortalRoll;
                log(`🌿 [Anutin] ลงสนาม! อมตะ ${immortalRoll} เทิร์น${hasTerrain ? ` (เทเรน ${state.sharedFieldCard.name} เสริมพลัง!)` : ' (ไม่มีเทเรน)'}`, 'text-green-400 font-bold');
            }
             // ── EASTER CARDS: Dora the Explorer on-summon ────────────────
            if (effectiveName === 'Dora the Explorer') {
                log(`🗺️ [Dora] "Hola! I'm Dora the Explorer!" — เรียก Boots ลงสนาม!`, 'text-orange-300 font-bold');
                if (p.field.length < getMaxFieldSlots(playerKey)) {
                    const bootsCard = {
                        id: 'card_' + (cardIdCounter++),
                        name: 'Boots', originalName: 'Boots',
                        type: 'Character', cost: 0, atk: 3, hp: 4, maxHp: 4,
                        text: 'ลิงสาวขี้อยากรู้ เพื่อนรักของ Dora | Ongoing: ได้รับ Item จาก Dora',
                        color: 'bg-purple-600', maxAttacks: 1, attacksLeft: 1,
                        art: 'https://i.pinimg.com/736x/b8/a5/46/b8a546e6e4d5b6c2f1a9e8c3d7f2e4b1.jpg',
                        status: [], items: [], silenced: false,
                        shalltearBleedTurns: 0, paralyzeTurns: 0, freezeTurns: 0,
                        bleedTurns: 0, burnTurns: 0, goldenBuffExpires: [],
                        poseidonReduceTurn: 0, tossakanPermanentReduce: false,
                        queenImmortalTurns: 0, isSun: false, herculesExtraLives: 0,
                        natureWandUsed: false, escutcheonTurns: 0,
                        tossakanImmortalTurns: 0, tossakanImmune: false,
                        clayBarrierTurns: 0, tempBuffs: [],
                        hasAsunaBuff: false, hasRamBuff: false, hasRemBuff: false,
                        costReducer: 0, damageReduce: 0, stolenText: '',
                        isDoraBoot: true, doraOwnerId: card.id,
                        immortalTurns: 0,
                    };
                    p.field.push(bootsCard);
                    log(`🐒 [Dora] Boots (3/4) ลงสนามแล้ว!`, 'text-orange-200 font-bold');
                } else {
                    log(`🗺️ [Dora] สนามเต็ม — ไม่สามารถเรียก Boots!`, 'text-red-400');
                }
            }
 
            if (effectiveName === 'Oppenheimer') {
                log(`💥 "Now I am become Death, the destroyer of worlds." — J. Robert Oppenheimer`, 'text-orange-200 font-bold italic');
                log(`[Oppenheimer] Trinity Test complete. ทุกการ์ดบนสนาม -3 HP`, 'text-gray-400 font-bold');
                [...p.field, ...opp.field].forEach(c => {
                    if (c.id !== card.id && c.type === 'Character') {
                        c.hp -= 3;
                        log(`[Oppenheimer] ${c.name} -3 HP`, 'text-gray-500');
                    }
                });
                checkDeath(playerKey);
                checkDeath(opponentKey);
            }

            if (effectiveName === 'Socrates') {
                log(`🏛️ "I know that I know nothing." — Socrates`, 'text-sky-200 font-bold italic');
                log(`[Socrates] ลงสนาม! ปัญญาที่แท้จริงคือการตั้งคำถาม — ศัตรู 1 ตัวโจมตีไม่ได้เทิร์นหน้า`, 'text-sky-400 font-bold');
                // Only apply random effect if not already applied through targeting system
                if (!card.socratesTargetApplied) {
                    const socTargets = opp.field.filter(c => getCharStats(c).hp > 0);
                    if (socTargets.length > 0) {
                        const chosen = socTargets[Math.floor(Math.random() * socTargets.length)];
                        if (!chosen.status.includes('Paralyze')) chosen.status.push('Paralyze');
                        chosen.paralyzeTurns = 2;
                        log(`[Socrates] ${chosen.name} ถูกห้ามโจมตีเทิร์นหน้า!`, 'text-sky-300');
                    }
                }
            }

            if (effectiveName === 'Julius Caesar') {
                log(`🗡️ "Veni, Vidi, Vici — ข้ามา ข้าเห็น ข้าพิชิต!"`, 'text-yellow-100 font-bold italic');
                log(`[Caesar] กองทัพโรมันมาแล้ว! ทุกตัวในสนาม +2/+2 ถาวร`, 'text-amber-400 font-bold');
                p.field.forEach(c => {
                    if (c.id !== card.id && c.type === 'Character') {
                        c.atk += 2; c.hp += 2; c.maxHp += 2;
                        log(`[Caesar] ${c.name} +2/+2 ถาวร`, 'text-amber-300');
                    }
                });
            }

            if (effectiveName === 'Nikola Tesla') {
                log(`⚡ "If you want to find the secrets of the universe, think in terms of energy, frequency and vibration." — Tesla`, 'text-blue-100 font-bold italic');
                log(`[Tesla] AC Current! 99% Evade 2 เทิร์น + จบเทิร์น +3 Cost`, 'text-blue-400 font-bold');
                card.teslaEvadeTurns = 4;
            }

            if (effectiveName === 'Leonidas I') {
                log(`🛡️ "MOLON LABE — จงมาเอาเองถ้ากล้า!" — Leonidas I, King of Sparta`, 'text-red-100 font-bold italic');
                log(`[Leonidas] THIS IS SPARTA! 300 Spartans charge! อัญเชิญ 3 ตัว cost ≤5 จากเด็ค`, 'text-red-400 font-bold');
                const leoCandidates = p.deck.filter(c => c.type === 'Character' && c.cost <= 5);
                let leoSummoned = 0;
                while (leoSummoned < 3 && leoCandidates.length > 0 && p.field.length < getMaxFieldSlots(playerKey)) {
                    const rand = Math.floor(Math.random() * leoCandidates.length);
                    const chosen = leoCandidates.splice(rand, 1)[0];
                    const deckIdx = p.deck.findIndex(d => d.id === chosen.id);
                    if (deckIdx !== -1) {
                        const s = p.deck.splice(deckIdx, 1)[0];
                        s.attacksLeft = s.maxAttacks || 1;
                        p.field.push(s);
                        log(`[Leonidas] อัญเชิญ ${s.name}!`, 'text-red-300');
                        triggerOnSummon(s, playerKey);
                        leoSummoned++;
                    }
                }
                if (leoSummoned === 0) log(`[Leonidas] ไม่มีตัว cost <=5 ในเด็ค`, 'text-gray-500');
            }

            if (effectiveName === 'Simo Häyhä') {
                log(`☃️ "ฉันทำแค่งานของฉัน" — Simo Häyhä, White Death`, 'text-green-100 font-bold italic');
                log(`[Simo Häyhä] ลงสนาม! Untargetable ขณะมีทหารอื่น | จบเทิร์น: สุ่มฆ่า 1 ศัตรู`, 'text-green-400 font-bold');
            }

            if (effectiveName === 'Bayinnaung') {
                log(`👑 "ราชาแห่งกษัตริย์ทั้งปวง — พระเจ้าบุเรงนอง ผู้พิชิตพม่า อยุธยา และล้านนา!"`, 'text-yellow-100 font-bold italic');
                log(`[Bayinnaung] ลงสนาม! ทุกครั้งที่โจมตี Base → ATK/HP ×2 ถาวร!`, 'text-yellow-400 font-bold');
            }

            if (effectiveName === '001 Adam') {
                log(`🔴 "Project: Humanity — Designation 001: Adam. Mission: Reclaim the future."`, 'text-red-100 font-bold italic');
                log(`[001 Adam] ลงสนาม! จบทุกเทิร์น: อัญเชิญ Character cost ≥5 จากเด็ค`, 'text-red-400 font-bold');
            }

            if (effectiveName === 'Pasut Kleebua' || effectiveName === 'Tata') {
                log(`มึงเรียกกูดีๆดิ !!!`, 'text-red-500 font-bold');
            }

            if (effectiveName === 'Phatchee') {
                log(`🌊 "หายตัวได้! แต่ก็มาแล้ว ❄️"`, 'text-teal-300 font-bold italic');
                log(`[Summon] Phatchee โผล่มา! ❄️ Freeze ศัตรู 1 ตัว`, 'text-teal-400 font-bold');
                const targets = opp.field.filter(c => getCharStats(c).hp > 0 && !c.tossakanImmune && !hasNatureImmune(opponentKey));
                if (targets.length > 0) {
                    const t = targets[Math.floor(Math.random() * targets.length)];
                    if (!t.status.includes('Freeze')) { t.status.push('Freeze'); t.freezeTurns = 2; }
                    log(`Phatchee Freeze ${t.name} 1 เทิร์น! 🧊`, 'text-cyan-400');
                }
            }

            if (effectiveName === 'Teak') {
                log(`💪 "ข้าแข็งแกร่งขึ้นแล้ว! +2/+2 ทันที!"`, 'text-indigo-300 font-bold italic');
                log(`[Summon] Teak มาแล้ว! 💪 +2 ATK / +2 HP ให้ตัวเอง`, 'text-indigo-400 font-bold');
                card.atk += 2;
                card.hp += 2;
                card.maxHp += 2;
                log(`Teak บัฟตัวเองเป็น ${card.atk}/${card.hp}!`, 'text-indigo-300');
            }

            if (effectiveName === 'Pongneng') {
                const handCount = p.hand.length;
                log(`[Summon] Pongneng โผล่มา! 🃏 การ์ดในมือ ${handCount} ใบ → ATK +${handCount}`, 'text-rose-400 font-bold');
            }

            if (effectiveName === 'Cronos') {
                log(`⏳ "เวลาอยู่ในอำนาจข้า... และมันใกล้จะหมดแล้ว"`, 'text-purple-300 font-bold italic');
                log(`[Cronos] เวลาถูกบิดเบือน! Zeus, Hades, Poseidon Cost -4`, 'text-purple-400 font-bold');
                p.hand.forEach(c => {
                    if (['Zeus','Hades','Poseidon'].includes(c.name)) {
                        c.costReducer = (c.costReducer || 0) + 4;
                    }
                });
            }

            if (effectiveName === 'Loki') {
                log(`😈 "เชื่อใจข้าได้เสมอ... แต่ไม่ควร!"`, 'text-violet-300 font-bold italic');
                log(`[Loki] On summon: Freeze one unit then create clone of that unit (same abilities)`, 'text-violet-400 font-bold');
                const allUnits = [...p.field, ...opp.field].filter(c => getCharStats(c).hp > 0);
                if (allUnits.length > 0) {
                    const target = allUnits[Math.floor(Math.random() * allUnits.length)];
                    const targetOwnerKey = state.players.player.field.some(cc => cc.id === target.id) ? 'player' : 'ai';
                    if (!target.tossakanImmune && !hasNatureImmune(targetOwnerKey) && !target.status.includes('Freeze')) {
                        target.status.push('Freeze'); target.freezeTurns = 2;
                        log(`Loki แช่แข็ง ${target.name} 1 เทิร์น!`, 'text-cyan-300');
                    }
                    if (p.field.length < getMaxFieldSlots(playerKey)) {
                        const clone = JSON.parse(JSON.stringify(target));
                        clone.id = 'card_' + (cardIdCounter++);
                        clone.name = `${target.name} (Loki Clone)`;
                        clone.originalName = target.originalName || target.name;
                        clone.attacksLeft = clone.maxAttacks || 1;
                        clone.status = [];
                        clone.stolenText = target.text || '';
                        clone.items = [...(target.items || [])];
                        clone.costReducer = 0;
                        clone.poseidonReduceTurn = 0;
                        clone.tossakanPermanentReduce = false;
                        clone.tossakanImmortalTurns = 0;
                        clone.immortalTurns = 0;
                        clone.escutcheonTurns = 0;
                        clone.queenImmortalTurns = 0;
                        p.field.push(clone);
                        log(`Loki สร้าง Clone ของ ${target.name} (ความสามารถเดียวกัน ใช้ได้จริง!)`, 'text-violet-300 font-bold');
                        triggerOnSummon(clone, playerKey);
                    }
                }
            }
            else if (effectiveName === 'Valkyrie') {
                log(`🛡️ "วิญญาณนักรบผู้กล้า จงขึ้นสู่ Valhalla!"`, 'text-sky-300 font-bold italic');
                log(`[Valkyrie] Valhalla Calling! จั่วการ์ด 4 ใบ`, 'text-sky-400 font-bold');
                drawCard(playerKey, 4);
            }
            else if (effectiveName === 'Hades') {
                log(`🔥 "Welcome to the Underworld... เจ้าจะไม่มีวันออกไปได้"`, 'text-red-300 font-bold italic');
                log(`Welcome to Hell... Hades is coming! 🔥`, 'text-red-500 font-bold');
                let summoned = false;
                for (let i = p.hand.length - 1; i >= 0 && !summoned; i--) {
                    if (p.hand[i].name === 'Cerberus') {
                        const cerb = p.hand.splice(i, 1)[0];
                        cerb.attacksLeft = 1;
                        p.field.push(cerb);
                        log(`Hades อัญเชิญ Cerberus จากมือ!`, 'text-red-300');
                        triggerOnSummon(cerb, playerKey);
                        summoned = true;
                    }
                }
                if (!summoned) {
                    for (let i = p.deck.length - 1; i >= 0 && !summoned; i--) {
                        if (p.deck[i].name === 'Cerberus' && p.field.length < getMaxFieldSlots(playerKey)) {
                            const cerb = p.deck.splice(i, 1)[0];
                            cerb.attacksLeft = 1;
                            p.field.push(cerb);
                            log(`Hades อัญเชิญ Cerberus จากเด็ค!`, 'text-red-300');
                            triggerOnSummon(cerb, playerKey);
                            summoned = true;
                        }
                    }
                }
            }
            else if (effectiveName === 'Cerberus') {
                log(`🐕 "BARK BARK BARK!! ไม่มีใครออกจาก Underworld!"`, 'text-orange-400 font-bold italic');
                log(`[Cerberus] Guard of the Underworld!`, 'text-orange-400');
            }
            else if (effectiveName === 'Poseidon') {
                log(`🌊 "ข้าคือเจ้าแห่งมหาสมุทร! คลื่นจงสยบทุกสิ่ง!"`, 'text-blue-300 font-bold italic');
                log(`ท้องทะเลคำราม! โพไซดอนผงาดจากห้วงทะเลลึก 🌊`, 'text-blue-500 font-bold');
                state.players[playerKey].poseidonReduceTurns = 4;
                log(`ทุกตัวในสนามฝั่งเรา ลดดาเมจ 30% เป็นเวลา 2 เทิร์น (เทิร์นศัตรู + เทิร์นเรา)!`, 'text-blue-300 font-bold');
            }
            else if (effectiveName === 'Rama') {
                log(`🏹 "ข้าคือ Rama แห่ง Ayodhya — ลูกธนูข้าไม่พลาด!"`, 'text-green-300 font-bold italic');
                log(`[Rama] Rama อัญเชิญ! ทำดาเมจ Base 2`, 'text-green-400 font-bold');
                state.players[opponentKey].hp -= 2;
                checkWinCondition();
            }
            else if (effectiveName === 'Tossakan') {
                log(`🐉 "ปากแปดว่าเราเลี้ยงท่าน ก็ประมาณหมายใจให้เป็นผล..."`, 'text-emerald-300 font-bold italic');
                log(`สิบหน้ากรยี่สิบสุริย์วงศ์... กายเขียววิจิตรบรรจง... น่าเกรงขามยามศึก...`, 'text-emerald-500 font-bold');
                card.tossakanPermanentReduce = true;
                card.tossakanImmune = true;
                log(`Tossakan ลดดาเมจ 60% ถาวร + Immune ทุกสถานะ (เฉพาะตัวเอง)`, 'text-emerald-300');
            }
            else if (effectiveName === 'Rimuru Tempest') {
                log(`🌀 "ข้าคือ Rimuru Tempest — ผู้ยิ่งใหญ่แห่ง Jura Tempest Federation!"`, 'text-blue-300 font-bold italic');
                log(`[Summon] Rimuru กลืนกินพลังจากมิติ Isekai!`, 'text-blue-300');
                const isekaiKeys = Object.keys(CardSets.isekai_adventure).filter(k => 
                    CardSets.isekai_adventure[k].type === 'Character' && 
                    k !== 'Rimuru Tempest' && 
                    k !== 'Slime'
                );
                if (isekaiKeys.length > 0) {
                    const randKey = isekaiKeys[Math.floor(Math.random() * isekaiKeys.length)];
                    const randText = CardSets.isekai_adventure[randKey].text || '';
                    card.stolenText = randText;
                    card.stolenOriginalName = randKey;  // เก็บไว้ให้ ongoing/checkDeath ใช้
                    card.text = randText + ` (กลืนกินสุ่มจาก ${randKey})`;
                    log(`Rimuru คัดลอกความสามารถ: ${randKey} (ใช้งานได้จริง!)`, 'text-blue-400 font-bold');
                    // Execute stolen summon effect โดย swap card.name ชั่วคราว
                    // (effectiveName ใน triggerOnSummon ใช้ card.name สำหรับการ์ดที่ไม่ใช่ Shadow/Loki)
                    const oldName = card.name;
                    const oldOriginal = card.originalName;
                    card.name = randKey;
                    card.originalName = randKey;
                    triggerOnSummon(card, playerKey);
                    card.name = oldName;               // คืนชื่อจริง
                    card.originalName = oldOriginal;   // คืนค่าเดิม
                }
            }
            else if (effectiveName === 'Aqua') {
                log(`💧 "ฉัน Aqua เทพธิดาแห่งน้ำ! ฉันเก่งมาก... จริงๆ นะ!"`, 'text-blue-200 font-bold italic');
                log(`[Effect] Aqua Heal เต็ม 3 ตัวสุ่ม (ทีมเรา)!`, 'text-blue-300');
                let allUnits = [];
                p.field.forEach(c => {
                    if (!c.status.includes('Poison')) allUnits.push({player: playerKey, card: c});
                });
                if (allUnits.length > 0) {
                    const shuffled = [...allUnits].sort(() => Math.random() - 0.5);
                    const targets = shuffled.slice(0, Math.min(3, shuffled.length));
                    targets.forEach(t => {
                        t.card.hp = getCharStats(t.card).maxHp;
                        log(`Aqua Heal เต็มให้ ${t.card.name}`, 'text-blue-400');
                    });
                }

                const gy = p.graveyard;
                const deadChars = gy.filter(c => c.type === 'Character' && c.name !== 'Subaru');
                if (deadChars.length > 0 && p.field.length < getMaxFieldSlots(playerKey)) {
                    const rIndex = Math.floor(Math.random() * deadChars.length);
                    const actualIndex = gy.findIndex(c => c.id === deadChars[rIndex].id);
                    const revived = gy.splice(actualIndex, 1)[0];
                    revived.hp = revived.maxHp;
                    revived.status = [];
                    revived.items = [];
                    p.field.push(revived);
                    log(`Aqua ชุบ ${revived.name} จากสุสาน!`, 'text-blue-400');
                    triggerOnSummon(revived, playerKey);
                }
            }
            else if (effectiveName === 'Emilia') {
                log(`❄️ "ฉันชื่อ Emilia ฉันจะพิสูจน์ว่าตัวเองสมควรได้รับมัน!"`, 'text-cyan-200 font-bold italic');
                log(`[Summon] Emilia แช่แข็งศัตรูทุกตัว! ❄️`, 'text-cyan-400 font-bold');
                opp.field.forEach(t => {
                    if (!t.tossakanImmune && !hasNatureImmune(opponentKey)) {
                        if (!t.status.includes('Freeze')) { t.status.push('Freeze'); t.freezeTurns = 2; }
                    }
                });
            }
            else if (effectiveName === 'Tanya Degurechaff') {
                log(`🎖️ "ขอบคุณ Being X... แต่ฉันจะทำด้วยตัวเองได้!"`, 'text-yellow-300 font-bold italic');
                log(`[Summon] Tanya Splash Damage พร้อม!`, 'text-yellow-300');
            }
            else if (effectiveName === 'Goblin Lord') {
                log(`👹 "ข้าคือราชาแห่ง Goblin! ตามข้ามา พวกเจ้า!"`, 'text-green-300 font-bold italic');
                log(`[Summon] Goblin Lord เรียก Goblin x2!`, 'text-lime-300');
                let summoned = 0;
                for (let i = p.deck.length - 1; i >= 0 && summoned < 2 && p.field.length < getMaxFieldSlots(playerKey); i--) {
                    if (p.deck[i].name === 'Goblin') {
                        const gob = p.deck.splice(i, 1)[0];
                        gob.attacksLeft = 1;
                        p.field.push(gob);
                        log(`Goblin ถูกเรียกออกมา!`, 'text-lime-400');
                        summoned++;
                    }
                }
                for (let i = p.hand.length - 1; i >= 0 && summoned < 2 && p.field.length < getMaxFieldSlots(playerKey); i--) {
                    if (p.hand[i].name === 'Goblin') {
                        const gob = p.hand.splice(i, 1)[0];
                        gob.attacksLeft = 1;
                        p.field.push(gob);
                        log(`Goblin จากมือถูกเรียก!`, 'text-lime-400');
                        summoned++;
                    }
                }
            }
            else if (effectiveName === 'Shadow') {
                log(`🌑 "ข้าคือ Shadow ผู้อยู่เบื้องหลังความมืด... ฉากนี้เท่มากแน่ๆ!"`, 'text-gray-300 font-bold italic');
                log(`[Summon] Shadow ระเบิดดาเมจหมู่ 3!`, 'text-gray-300');
                opp.field.forEach(t => t.hp -= 3);
                checkDeath(opponentKey);
            }
  else if (effectiveName === 'Shalltear') {
                log(`🩸 "นี่คือรสชาติของความตาย... สดชื่นจริงๆ ค่ะ Ainz-sama~"`, 'text-pink-300 font-bold italic');
    log(`[Summon] Shalltear Blood Frenzy! ขโมย 2 HP ต่อตัวบนกระดาน + Bleed ศัตรูทุกตัว 3 เทิร์น!`, 'text-pink-500 font-bold');
    
    const oppKey = playerKey === 'player' ? 'ai' : 'player';
    const opp = state.players[oppKey];
    
    let stolenHP = 0;

    // 1. ขโมย 2 HP ต่อตัวใน Field เท่านั้น (ตามที่คุณต้องการ)
    opp.field.forEach(c => {
        if (getCharStats(c).hp > 0) {
            const dmg = Math.min(2, c.hp);
            c.hp -= dmg;
            stolenHP += dmg;
        }
    });

    // 2. Shalltear ได้ HP ทุกตัวที่ขโมยมา (2 ต่อตัว)
    card.hp += stolenHP;
    card.maxHp += stolenHP;

    // Log แสดงผลชัดเจน
    if (stolenHP > 0) {
        log(`🩸 Shalltear ขโมย HP ได้ทั้งหมด ${stolenHP} (${stolenHP/2} ตัว)`, 'text-red-400');
    }

    // 3. Bleed ศัตรูทุกตัว 3 เทิร์น (เหมือนเดิม)
    opp.field.forEach(c => {
        if (!c.tossakanImmune && !hasNatureImmune(oppKey) && !c.status.includes('Bleed')) {
            c.status.push('Bleed');
            c.shalltearBleedTurns = 3;
            log(`🩸 Shalltear ทำให้ ${c.name} ติด Bleed 3 เทิร์น`, 'text-red-400');
        }
    });

    checkDeath(oppKey);
    checkDeath(playerKey);
}
            else if (effectiveName === 'Orc General') {
                log(`[Orc General] GRAAAH! ลด ATK ศัตรูทุกตัว -1 ถาวร!`, 'text-amber-700 font-bold');
                opp.field.forEach(c => {
                    if (c.type === 'Character' && getCharStats(c).hp > 0) {
                        c.atk = Math.max(0, c.atk - 1);
                        log(`[Orc General] ${c.name} ATK -1 (เหลือ ${c.atk})`, 'text-amber-600');
                    }
                });
            }
            else if (effectiveName === 'Kazuma Satou') {
                log(`🍀 "โชคดีนะที่มีข้า Kazuma ในทีม... บางที"`, 'text-amber-200 font-bold italic');
                log(`[Summon] Kazuma จั่ว 3 ใบ!`, 'text-amber-300');
                drawCard(playerKey, 3);
            }
            else if (effectiveName === 'Kumoko') {
                log(`🕷️ "เอาๆ! ปัญหานี้ฉันก็ผ่านมาแล้ว... คิดว่า!"`, 'text-violet-300 font-bold italic');
                log(`[Summon] Kumoko Poison ศัตรู 2 ตัว! ☠️`, 'text-violet-400');
                let targets = opp.field.filter(c => getCharStats(c).hp > 0);
                for (let i = 0; i < 2 && targets.length > 0; i++) {
                    const idx = Math.floor(Math.random() * targets.length);
                    const t = targets[idx];
                    if (!t.tossakanImmune && !hasNatureImmune(opponentKey)) {
                        if (!t.status.includes('Poison')) t.status.push('Poison');
                    }
                    targets.splice(idx, 1);
                }
            }
            else if (effectiveName === 'Slime') {
                log(`[Summon] Slime Taunt เปิดใช้งาน!`, 'text-lime-300');
            }
            else if (effectiveName === 'Altair') {
                // ── Altair Champion: Dramatic Summon Log ──────────────────────
                log(``, 'text-yellow-200');
                log(`✦━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━✦`, 'text-yellow-500 font-bold');
                log(`  ♛  A L T A I R  —  แชมเปี้ยนข้ามมิติแห่งอิเซไค  ♛`, 'text-yellow-300 font-bold');
                log(`✦━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━✦`, 'text-yellow-500 font-bold');
                log(`"ข้าได้สัมผัสทุกเรื่องราวที่เคยเขียนขึ้น..."`, 'text-yellow-100 font-bold italic');
                log(`"ตั้งแต่นักเรียนธรรมดาที่ถูกรถชน ไปจนถึงกษัตริย์ที่ครองโลกอีกใบ"`, 'text-amber-200 italic');
                log(`"ข้าได้ตายมาแล้วนับครั้งไม่ถ้วน — แต่ทุกครั้งที่กลับมา ข้าแข็งแกร่งขึ้นกว่าเดิม"`, 'text-orange-300 italic');
                log(`"บาดแผลของผู้ที่เคยฆ่าข้า... ได้กลายเป็นเกราะที่แน่นหนาที่สุดของข้า"`, 'text-red-300 italic');
                log(`"ข้าจำทุกหน้าตาของพวกเจ้า — Goblin ชั้นต่ำ, เทพเจ้าผู้หยิ่งทะนง, มาเดมาเกิดมาใหม่แล้วค้นหาข้าดู"`, 'text-rose-400 italic');
                log(`"ความตายสำหรับข้าไม่ใช่การจบสิ้น... มันคือบทเรียน"`, 'text-pink-300 italic');
                log(`"และบทเรียนนั้น... ข้าจะไม่มีวันลืม."`, 'text-purple-200 font-bold italic');
                log(`✦━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━✦`, 'text-yellow-500 font-bold');
                log(`♛ [Altair] Champion ลงสนาม! ATK 12 / HP 10 | On Attack: ชุบเพื่อน | On Death: กลับมือ + จดจำผู้ฆ่า`, 'text-yellow-400 font-bold');
                // ── Cost Reduction (เฉพาะในเกมนี้) ──
                const p = state.players[playerKey];
                if (!p.altairCostBonus) p.altairCostBonus = 0;
                p.altairCostBonus += 1;
                card.costReducer = p.altairCostBonus;
                
                const currentCost = Math.max(0, 12 - p.altairCostBonus);
                log(`♛ [Altair] Cost ลดลง! ตอนนี้ Cost ${currentCost} (ลดสะสมในเกมนี้ไปแล้ว ${p.altairCostBonus} ครั้ง)`, 'text-yellow-300 font-bold');
            }
            else if (effectiveName === 'Anaconda') {
                log(`🐍 "..."  *เสียงเลื้อย*`, 'text-emerald-300 font-bold italic');
                log(`[Summon] Anaconda ได้ Item/Action สุ่ม 2 ใบจากเด็ค!`, 'text-emerald-400');
                let count = 0;
                for (let i = p.deck.length - 1; i >= 0 && count < 2; i--) {
                    if (p.deck[i].type === 'Item' || p.deck[i].type === 'Action') {
                        const act = p.deck.splice(i, 1)[0];
                        p.hand.push(act);
                        count++;
                    }
                }
            }
            else if (effectiveName === 'Gilgamesh') {
                log(`👑 "Open the Gate of Babylon! เจ้าสมบัติของข้า!"`, 'text-amber-200 font-bold italic');
                log("Gate of Babylon is opening!", "text-yellow-400 font-bold");
                let allItems = [];
                Object.keys(CardSets).forEach(th => {
                    Object.keys(CardSets[th]).forEach(k => {
                        if (CardSets[th][k].type === 'Item') {
                            allItems.push({key: k, theme: th});
                        }
                    });
                });
                if (allItems.length > 0) {
                    for (let i = 0; i < 5; i++) {
                        const randIdx = Math.floor(Math.random() * allItems.length);
                        const randItem = allItems[randIdx];
                        const itemCard = createCardInstance(randItem.key, randItem.theme);
                        card.items.push(itemCard);
                        log(`[Gate of Babylon] Equipped ${itemCard.name} to Gilgamesh!`, "text-amber-300");
                    }
                }
            }
            else if (effectiveName === 'Sun Wukong') {
                log(`🐒 "ข้าคือ Great Sage Equal to Heaven! ใครกล้ามาสู้!"`, 'text-orange-300 font-bold italic');
                log(`[Summon] Sun Wukong สร้าง Fake Wukong 3 ตัว! 🐒`, 'text-orange-500 font-bold');
                let created = 0;
                for (let i = 0; i < 3 && p.field.length < getMaxFieldSlots(playerKey); i++) {
                    const fake = {
                        id: 'card_' + (cardIdCounter++),
                        name: 'Fake Sun Wukong',
                        originalName: 'Fake Sun Wukong',
                        type: 'Character',
                        cost: 0, atk: 6, hp: 6, maxHp: 6,
                        text: 'เมื่อตาย: Base ฝั่งเรา -1 HP',
                        color: 'bg-orange-500',
                        maxAttacks: 1, attacksLeft: 1,
                        status: [], items: [], tempBuffs: [],
                        silenced: false, shalltearBleedTurns: 0, paralyzeTurns: 0,
                        bleedTurns: 0, burnTurns: 0, queenImmortalTurns: 0,
                        isSun: false, herculesExtraLives: 0, natureWandUsed: false,
                        escutcheonTurns: 0, tossakanPermanentReduce: false,
                        tossakanImmune: false, tossakanImmortalTurns: 0,
                        clayBarrierTurns: 0, goldenBuffExpires: [],
                        poseidonReduceTurn: 0, hasAsunaBuff: false,
                        hasRamBuff: false, hasRemBuff: false,
                        costReducer: 0, damageReduce: 0,
                        stolenText: '', stolenOriginalName: null,
                        musashiNerfTurns: 0, musashiDieNextTurn: false,
                        hasHolyGrailBuff: false, teslaEvadeTurns: 0,
                    };
                    p.field.push(fake);
                    created++;
                    log(`สร้าง Fake Wukong (${created}/3)`, 'text-orange-300');
                }
            }
            else if (effectiveName === 'Fairy') {
                log(`✨ "ขอให้โลกนี้เต็มไปด้วยแสง! Heal ทั้งหมด!"`, 'text-pink-300 font-bold italic');
                log(`[Summon] Fairy เริ่มต้น! Heal ทุกตัวเต็ม! ✨`, 'text-pink-400 font-bold');
                // Heal ทุกตัวฝั่งเราเต็ม
                p.field.forEach(c => {
                    if (c.id !== card.id) { // ไม่นับตัวเอง เพราะเพิ่งเข้ามา
                        const stats = getCharStats(c);
                        c.hp = stats.maxHp;
                        log(`Fairy Heal ${c.name} เต็ม!`, 'text-pink-300');
                    }
                });
            }
            else if (effectiveName === 'Cyclops') {
                log(`👁️ "...ข้าเห็นเจ้า... คนเดียว แต่ชัดมาก!"`, 'text-stone-300 font-bold italic');
                log(`[Summon] Cyclops! Base ศัตรู -1 👁️`, 'text-stone-500 font-bold');
                state.players[opponentKey].hp -= 1;
                checkWinCondition();
            }
            else if (effectiveName === 'Oni') {
                log(`👹 "ORAORAORA!! เจ้าเล็กเกินไปสำหรับข้า!"`, 'text-purple-400 font-bold italic');
                log(`[Summon] Oni ฆ่า Character ศัตรู cost ≤8 สุ่ม! 👹`, 'text-purple-500 font-bold');
                const candidates = opp.field.filter(c => c.cost <= 8 && getCharStats(c).hp > 0);
                if (candidates.length > 0) {
                    const target = candidates[Math.floor(Math.random() * candidates.length)];
                    target.hp = 0;
                    log(`Oni ฆ่า ${target.name} ทันที!`, 'text-purple-400 font-bold');
                    checkDeath(opponentKey);
                }
            }
            else if (effectiveName === 'Basilisk') {
                log(`🐍 "มองเข้ามาในดวงตาข้า... ถ้ากล้า"`, 'text-emerald-300 font-bold italic');
                log(`[Summon] Basilisk ทิ้งมือศัตรู 2 ใบ! 🐍`, 'text-emerald-500 font-bold');
                for (let i = 0; i < 2 && opp.hand.length > 0; i++) {
                    const idx = Math.floor(Math.random() * opp.hand.length);
                    const discarded = opp.hand[idx];
                    // Holy Grail ไม่สามารถถูกทิ้งได้
                    if (discarded.name === 'Holy Grail' || discarded.type === 'Spell') {
                        log(`Basilisk ไม่สามารถทิ้ง Holy Grail ได้!`, 'text-yellow-400');
                    } else {
                        opp.hand.splice(idx, 1);
                        opp.graveyard.push(discarded);
                        log(`Basilisk ทิ้ง ${discarded.name} จากมือศัตรู`, 'text-emerald-400');
                    }
                }
            }
            else if (effectiveName === 'Ra') {
                log(`☀️ "ข้าคือเทพแห่งดวงอาทิตย์ แสงสว่างจงปกคลุมทั้งโลก!"`, 'text-orange-200 font-bold italic');
                log(`The sun is coming to you! ☀️`, 'text-orange-500 font-bold');
                if (p.field.length < getMaxFieldSlots(playerKey)) {
                    const sun = {
                        id: 'card_' + (cardIdCounter++),
                        name: 'Sun',
                        originalName: 'Sun',
                        type: 'Character',
                        cost: 0,
                        atk: 0,
                        hp: 10,
                        maxHp: 10,
                        text: 'Burn ทุกตัวจนกว่าจะตาย',
                        color: 'bg-yellow-400',
                        maxAttacks: 0,
                        attacksLeft: 0,
                        status: [],
                        stolenText: '',
                        items: [],
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
                        isSun: true,
                        herculesExtraLives: 0,
                        natureWandUsed: false,
                        escutcheonTurns: 0,
                        tossakanImmortalTurns: 0,
                        tossakanImmune: false,
                        tempBuffs: [], 
                        clayBarrierTurns: 0
                    };
                    p.field.push(sun);
                    log(`Ra สร้าง Sun 10/0!`, 'text-yellow-400');
                }
            }
            else if (effectiveName === 'Palee') {
                log(`🌑 "อำนาจของเจ้า... กลายเป็นของข้าแล้ว"`, 'text-purple-300 font-bold italic');
                log(`[Palee] ดูดพลังศัตรู!`, 'text-purple-400');
                if (opp.field.length > 0) {
                    const target = opp.field[Math.floor(Math.random()*opp.field.length)];
                    const halfAtk = Math.floor(target.atk / 2);
                    const halfHp = Math.floor(target.hp / 2);
                    card.atk += halfAtk;
                    card.hp += halfHp;
                    card.maxHp += halfHp;
                    target.atk = halfAtk;
                    target.hp = halfHp;
                    target.maxHp = halfHp;
                    log(`Palee ขโมย ${halfAtk} ATK และ ${halfHp} HP จาก ${target.name}!`, 'text-purple-300');
                }
            }
            else if (effectiveName === 'Hela') {
                log(`💀 "Asgard จะล่มสลาย... โดยมือข้า"`, 'text-red-400 font-bold italic');
                log(`ขอเชิญวิญญาณผู้วายชนม์...`, 'text-red-500 font-bold');
                const gy = p.graveyard.filter(c => c.type === 'Character' && (c.hp < 5 || c.atk < 5));
                if (gy.length > 0 && p.field.length < getMaxFieldSlots(playerKey)) {
                    const r = gy[Math.floor(Math.random()*gy.length)];
                    const idx = p.graveyard.findIndex(x => x.id === r.id);
                    const revived = p.graveyard.splice(idx,1)[0];
                    revived.hp = revived.maxHp;
                    revived.status = [];
                    p.field.push(revived);
                    log(`Hela ชุบ ${revived.name} กลับมา!`, 'text-red-300');
                    triggerOnSummon(revived, playerKey);
                }
            }
            else if (effectiveName === 'King Arthur') {
                log(`⚔️ "Once and Future King — Excalibur จงปรากฏ!"`, 'text-yellow-200 font-bold italic');
                let count = p.field.filter(c => c.cost >= 8).length;
                card.atk += count * 2;
                log(`[King Arthur] +${count*2} ATK จากการ์ด cost ≥8 บนสนาม!`, 'text-yellow-400');
                // Holy Grail cost -60 เมื่อ King Arthur ลงสนาม
                const grailInHand = p.hand.find(c => c.name === 'Holy Grail');
                if (grailInHand) {
                    grailInHand.costReducer = (grailInHand.costReducer || 0) + 60;
                    log(`[King Arthur] Holy Grail ในมือ Cost -60!`, 'text-yellow-300 font-bold');
                }
                if (state.sharedFieldCard && state.sharedFieldCard.name === 'Holy Grail') {
                    log(`[King Arthur] Holy Grail อยู่ในสนามแล้ว! Ongoing +10 ATK/HP เปิดใช้งาน`, 'text-yellow-300 font-bold');
                }
            }
            else if (effectiveName === 'Zeus') {
                log(`⚡ "ข้าคือบิดาแห่งเทพ! สายฟ้าของข้าจะพิพากษาเจ้า!"`, 'text-yellow-200 font-bold italic');
                log(`The stars align! Father of Cosmos awaken! 🌟`, 'text-yellow-400 font-bold');
            }
            else if (effectiveName === 'Hercules') {
                log(`💪 "TWELVE LABORS ไม่พอ! ข้ายังต้องการศึกอีก!"`, 'text-orange-300 font-bold italic');
                card.herculesExtraLives = 8;
                log(`ชายผู้ผ่านภารกิจทั้ง 12 Hercules! ชีวิตสำรอง 8 ชีวิต`, 'text-orange-400 font-bold');
            }
            else if (effectiveName === 'Shiva') {
                log(`💀 "ข้าคือ Shiva — ผู้ทำลายล้าง จักรวาลนี้จะสิ้นสุด!"`, 'text-red-300 font-bold italic');
                log(`His third eye is open... World is collapsing! 👁️‍🗨️`, 'text-red-500 font-bold');
            }
            else if (effectiveName === 'Odin') {
                log(`🌑 "ข้าแลกตาหนึ่งข้างเพื่อความรู้แห่งจักรวาล..."`, 'text-blue-200 font-bold italic');
                log(`Welcome to battle field! The All Father ⚔️`, 'text-blue-500 font-bold');
            }
            else if (effectiveName === 'Fenrir') {
                log(`🐺 "GRRRRR... วันหนึ่งข้าจะกลืน Odin ทั้งเป็น"`, 'text-gray-200 font-bold italic');
                log(`[Fenrir] Fenrir ถูกปลุก!`, 'text-gray-400');
            }
            else if (effectiveName === 'Konshu') {
                log(`🌕 "ดวงจันทร์พยาน ข้าเป็น Khonshu เทพแห่งกลางคืน!"`, 'text-indigo-300 font-bold italic');
                log(`Konshu สร้าง Moon Cycle!`, 'text-indigo-400 font-bold');
                p.moonCycle = 0;
            }
            else if (effectiveName === 'Jormungandr') {
                log(`🐍 "ข้าล้อมโลกไว้ด้วยร่างข้า... Ragnarok มาถึงแล้ว!"`, 'text-green-300 font-bold italic');
                const fieldCard = state.sharedFieldCard;
                if (fieldCard) {
                    p.graveyard.push(fieldCard);
                    state.sharedFieldCard = null;
                    state.sharedFieldCardOwner = null;
                    log(`[Jormungandr] กลืนกิน Field Card ของตัวเอง!`, 'text-green-400 font-bold');
                    const gain = fieldCard.cost || 0;
                    card.atk += gain;
                    card.maxHp += gain;
                    card.hp += gain;
                    log(`Jormungandr ได้ +${gain} ATK/HP`, 'text-green-300');
                }
            }
            else if (effectiveName === 'King Solomon') {
                log(`📜 "ปัญญาของข้าเหนือกว่าทุกสิ่ง — จงยอมรับ!"`, 'text-yellow-300 font-bold italic');
                log(`[King Solomon] Solomon ถูกอัญเชิญ!`, 'text-yellow-400');
            }
            else if (effectiveName === 'King') {
                log(`♚ "CHECK! กษัตริย์ไม่แพ้ง่ายๆ!"`, 'text-amber-200 font-bold italic');
                log(`[Summon] King! +2 ATK/HP ให้ทุกตัวในทีมเรา`, 'text-amber-300 font-bold');
                p.field.forEach(c => {
                    if (c.type === 'Character') {
                        c.atk += 2;
                        c.maxHp += 2;
                        c.hp += 2;
                    }
                });
            }
            else if (effectiveName === 'Queen') {
                log(`♛ "ราชินีที่แท้จริงไม่ตายง่ายๆ — Immortal!"`, 'text-pink-300 font-bold italic');
                log(`[Summon] Queen! Immortal 1 เทิร์น`, 'text-pink-400 font-bold');
                card.queenImmortalTurns = 2; // ต้องอยู่ได้ทั้งเทิร์นเราและเทิร์นศัตรู
            }
            else if (effectiveName === 'Bishop') {
                log(`[Summon] Bishop! Random 4 dmg to 1 unit ฝั่งตรงข้าม`, 'text-violet-400');
                if (opp.field.length > 0) {
                    const target = opp.field[Math.floor(Math.random() * opp.field.length)];
                    target.hp -= 4;
                    log(`Bishop ทำดาเมจ 4 ให้ ${target.name}`, 'text-violet-300');
                }
            }
            else if (effectiveName === 'Pawn') {
                log(`[Summon] Pawn! Deal 1 dmg to 1 unit ฝั่งตรงข้าม`, 'text-yellow-400');
                if (opp.field.length > 0) {
                    const target = opp.field[Math.floor(Math.random() * opp.field.length)];
                    target.hp -= 1;
                    log(`Pawn ทำดาเมจ 1 ให้ ${target.name}`, 'text-yellow-300');
                }
            }
            else if (effectiveName === 'Teddy Bear') {
                p.hp = Math.min(20, p.hp + 1);
                log(`[Teddy Bear] Base เรา +1 HP!`, 'text-amber-300');
                checkWinCondition();
            }
            else if (effectiveName === 'Madness Teddy Bear') {
                const oppKey = playerKey === 'player' ? 'ai' : 'player';
                state.players[oppKey].hp = Math.max(1, state.players[oppKey].hp - 1);
                log(`[Madness Teddy Bear] Base ศัตรู -1 HP!`, 'text-red-400');
                checkWinCondition();
            }
            else if (effectiveName === 'Gundam Model') {
                log(`[Gundam Model] ดึง Item 2 ใบจาก DECK ตัวเอง!`, 'text-gray-300');
                let deckItems = p.deck.filter(cc => cc.type === 'Item');
                for (let i = 0; i < 2 && deckItems.length > 0; i++) {
                    const r = Math.floor(Math.random() * deckItems.length);
                    const selected = deckItems[r];
                    const deckIdx = p.deck.findIndex(d => d.id === selected.id);
                    if (deckIdx !== -1) {
                        const pulledItem = p.deck.splice(deckIdx, 1)[0];
                        card.items.push(pulledItem);
                        log(`[Gundam] ดึง ${pulledItem.name} จากเด็คมาใส่!`, 'text-gray-400');
                    }
                }
            }
            else if (effectiveName === 'Tung Tung Sahur') {
                log(`🥁 "TUK TUK TUK! SAHUR! SAHUR!"`, 'text-orange-300 font-bold italic');
                log(`[Tung Tung Sahur] โจมตีได้ 2 ครั้ง!`, 'text-orange-300');
            }
            else if (effectiveName === 'Toy Soldier') {
                log(`[Toy Soldier] Summon Toy Soldier เพิ่ม 1 ตัวจากเด็ค!`, 'text-green-300');
                let summoned = false;
                for (let i = p.deck.length - 1; i >= 0 && !summoned; i--) {
                    if (p.deck[i].name === 'Toy Soldier' && p.field.length < getMaxFieldSlots(playerKey)) {
                        const extra = p.deck.splice(i, 1)[0];
                        extra.attacksLeft = extra.maxAttacks;
                        p.field.push(extra);
                        summoned = true;
                    }
                }
                checkOngoingAuras();
            }
            else if (effectiveName === 'Jack in the Box') {
                log(`🎭 "SURPRISE!! ไม่รู้จะออกมาตอนไหน~"`, 'text-purple-400 font-bold italic');
                log(`[Jack in the Box] จั่ว 3 ใบ!`, 'text-purple-300');
                drawCard(playerKey, 3);
            }
            else if (effectiveName === 'Rubber Duck') {
                log(`[Rubber Duck] ตายแล้วจะ Summon Character สุ่ม!`, 'text-yellow-300');
            }
            else if (effectiveName === 'Toy-Rex') {
                log(`🦖 "ROARRR!! ของเล่นก็ดุได้นะ! BURN!"`, 'text-red-300 font-bold italic');
                log(`[Summon] Toy-Rex ทำให้ศัตรูทุกตัวติด Burn 3 เทิร์น! 🔥`, 'text-red-500 font-bold');
                opp.field.forEach(t => {
                    if (!t.tossakanImmune && !hasNatureImmune(opponentKey)) {
                        if (!t.status.includes('Burn')) t.status.push('Burn');
                        t.burnTurns = 3;
                    }
                });
            }
            else if (effectiveName === 'Majorette') {
                log(`[Summon] Majorette เรียก Hot Wheel จากเด็ค!`, 'text-pink-300');
                let found = false;
                for (let i = p.deck.length - 1; i >= 0 && !found; i--) {
                    if (p.deck[i].name === 'Hot Wheel') {
                        const hw = p.deck.splice(i, 1)[0];
                        p.hand.push(hw);
                        log(`Hot Wheel ถูกจั่วขึ้นมือ!`, 'text-orange-300');
                        found = true;
                    }
                }
            }
            else if (effectiveName === 'Hot Wheel') {
                log(`[Summon] Hot Wheel เรียก Majorette จากเด็ค!`, 'text-orange-300');
                let found = false;
                for (let i = p.deck.length - 1; i >= 0 && !found; i--) {
                    if (p.deck[i].name === 'Majorette') {
                        const mj = p.deck.splice(i, 1)[0];
                        p.hand.push(mj);
                        log(`Majorette ถูกจั่วขึ้นมือ!`, 'text-pink-300');
                        found = true;
                    }
                }
            }
            // ── Kim Dokja ──────────────────────────────────────
            else if (effectiveName === 'Kim Dokja') {
                log(`📖 "ฉันรู้ทุกอย่างเพราะฉันอ่านมันมาแล้ว!"`, 'text-indigo-300 font-bold italic');
                log(`[Summon] Kim Dokja... ลืมความทรงจำ!`, 'text-gray-300 font-bold');
                if (opp.field.length > 0) {
                    const target = opp.field[Math.floor(Math.random() * opp.field.length)];
                    target.silenced = true;
                    target.text = 'ผู้สูญเสียความทรงจำ (ไร้ความสามารถทั้งหมด)';
                    target.stolenText = '';
                    log(`Kim Dokja ทำให้ ${target.name} ไร้ความสามารถถาวร!`, 'text-gray-400');
                }
            }
 
            // ── Tiger ───────────────────────────────────────────
            else if (effectiveName === 'Tiger') {
                log(`🐯 "ROARRR!! ราชาแห่งป่า ไม่มีใครยืนขวางข้าได้!"`, 'text-orange-300 font-bold italic');
                log(`[Summon] Tiger Instinct Claw! ลด HP ศัตรูทุกตัว -2`, 'text-orange-500 font-bold');
                opp.field.forEach(t => { t.hp -= 2; });
                checkDeath(opponentKey);
            }
 
            // ── Hyena ───────────────────────────────────────────
            else if (effectiveName === 'Hyena') {
                log(`😈 "hehehehe... เป้าหมายอ่อนแอไป ฆ่าเลยดีกว่า"`, 'text-yellow-600 font-bold italic');
                log(`[Summon] Hyena ล่าสัตว์อ่อนแอ!`, 'text-yellow-600');
                opp.field.forEach(t => {
                    if (getCharStats(t).hp <= 3) {
                        t.hp = -99;
                        log(`Hyena ฆ่า ${t.name} ทันที! (HP ≤3)`, 'text-yellow-500');
                    }
                });
                checkDeath(opponentKey);
            }
 
            // ── Savannah Sparrow ────────────────────────────────
            else if (effectiveName === 'Savannah Sparrow') {
                log(`[Summon] Savannah Sparrow Plumage! จั่ว 2 ใบ`, 'text-sky-400');
                drawCard(playerKey, 2);
            }
 
            // ── Komodo Dragon summon ─────────────────────────────
            else if (effectiveName === 'Komodo Dragon') {
                log(`🦎 "...ฉันรอ..."  *ยิ้มแย้ม*`, 'text-green-400 font-bold italic');
                log(`[Summon] Komodo Dragon พ่น Bleed สุ่ม 2 ตัว! 🩸`, 'text-red-600 font-bold');
                let targets = [...opp.field].filter(c => getCharStats(c).hp > 0);
                let hit = 0;
                while (hit < 2 && targets.length > 0) {
                    const idx = Math.floor(Math.random() * targets.length);
                    const t = targets.splice(idx, 1)[0];
                    if (!t.tossakanImmune && !hasNatureImmune(opponentKey) && !t.status.includes('Bleed')) {
                        t.status.push('Bleed');
                        t.shalltearBleedTurns = 2;
                        log(`Komodo Dragon ทำให้ ${t.name} ติด Bleed 2 เทิร์น`, 'text-red-500');
                    }
                    hit++;
                }
            }
 
            // ── Silverback Gorilla ──────────────────────────────
            else if (effectiveName === 'Silverback Gorilla') {
                log(`🦍 "GROARRR!! ข้าเป็นราชาที่แท้จริงของป่านี้!"`, 'text-stone-300 font-bold italic');
                log(`[Summon] Silverback Gorilla ทำให้ศัตรู 2 ตัวติด Paralyze!`, 'text-amber-700 font-bold');
                let targets = [...opp.field].filter(c => getCharStats(c).hp > 0);
                let hit = 0;
                while (hit < 2 && targets.length > 0) {
                    const idx = Math.floor(Math.random() * targets.length);
                    const t = targets.splice(idx, 1)[0];
                    if (!t.tossakanImmune && !hasNatureImmune(opponentKey) && !t.status.includes('Paralyze')) {
                        t.status.push('Paralyze');
                        t.paralyzeTurns = 4;
                        log(`${t.name} ติด Paralyze 2 เทิร์น`, 'text-amber-500');
                    }
                    hit++;
                }
            }
 
            // ── Kangaroo ─────────────────────────────────────────
            else if (effectiveName === 'Kangaroo') {
                log(`🦘 "แม่ JOEY พร้อม! ลูกอยู่ที่ไหน?"`, 'text-orange-400 font-bold italic');
                log(`[Summon] Kangaroo เรียกเพื่อน!`, 'text-amber-500');
                let found = false;
                for (let i = p.deck.length - 1; i >= 0 && !found; i--) {
                    if (p.deck[i].name === 'Kangaroo' && p.field.length < getMaxFieldSlots(playerKey)) {
                        const k = p.deck.splice(i, 1)[0];
                        k.attacksLeft = k.maxAttacks || 1;
                        p.field.push(k);
                        log(`Kangaroo เรียก Kangaroo จากเด็ค!`, 'text-amber-400');
                        triggerOnSummon(k, playerKey);
                        found = true;
                    }
                }
            }
 
            // ── Polar Bear ───────────────────────────────────────
            else if (effectiveName === 'Polar Bear') {
                log(`🐻‍❄️ "ยินดีต้อนรับสู่อาร์กติก... บ้านของข้า"`, 'text-white font-bold italic');
                log(`[Summon] Polar Bear Freeze ศัตรูสุ่ม 2 ตัว! ❄️`, 'text-cyan-400 font-bold');
                let targets = [...opp.field].filter(c => getCharStats(c).hp > 0);
                let hit = 0;
                while (hit < 2 && targets.length > 0) {
                    const idx = Math.floor(Math.random() * targets.length);
                    const t = targets.splice(idx, 1)[0];
                    if (!t.tossakanImmune && !hasNatureImmune(opponentKey) && !t.status.includes('Freeze')) {
                        t.status.push('Freeze'); t.freezeTurns = 4;
                        log(`${t.name} ติด Freeze 2 เทิร์น (Polar Bear)`, 'text-cyan-300');
                    }
                    hit++;
                }
            }
 
            // ── Wolf ─────────────────────────────────────────────
            else if (effectiveName === 'Wolf') {
                log(`🐺 "AWOOOO!! ฝูงสัตว์พร้อมโจมตี!"`, 'text-gray-400 font-bold italic');
                log(`[Summon] Wolf เรียกฝูง!`, 'text-gray-400');
                let found = false;
                for (let i = p.deck.length - 1; i >= 0 && !found; i--) {
                    if (p.deck[i].name === 'Wolf' && p.field.length < getMaxFieldSlots(playerKey)) {
                        const w = p.deck.splice(i, 1)[0];
                        w.attacksLeft = w.maxAttacks || 1;
                        p.field.push(w);
                        log(`Wolf เรียก Wolf จากเด็ค!`, 'text-gray-500');
                        found = true;
                    }
                }
            }
 
            // ── Grizzly Bear ─────────────────────────────────────
            else if (effectiveName === 'Grizzly Bear') {
                log(`🐻 "GRRRRR!! ใครมายุ่งกับที่หากินข้า!"`, 'text-amber-700 font-bold italic');
                log(`[Summon] Grizzly Bear จั่ว 5 ใบ!`, 'text-amber-700');
                drawCard(playerKey, 5);
            }
 
            // ── Elephant summon draw ─────────────────────────────
            else if (effectiveName === 'Elephant') {
                log(`🐘 "TRUMPHH!! ฉันจำทุกอย่าง... และฉันจะไม่ลืมสิ่งนี้"`, 'text-gray-300 font-bold italic');
                log(`[Summon] Elephant จั่ว 1 ใบ`, 'text-gray-500');
                drawCard(playerKey, 1);
            }
 
            // ── Lion King of Forest ──────────────────────────────
            else if (effectiveName === 'Lion King of Forest') {
                log(`🦁 "กษัตริย์แห่งป่าพร้อมแล้ว! SIMBA!!"`, 'text-yellow-300 font-bold italic');
                log(`[Summon] Lion King เรียกสัตว์ผู้แข็งแกร่ง!`, 'text-amber-600 font-bold');
                const candidates = p.deck.filter(c => c.type === 'Character' && c.cost >= 5);
                if (candidates.length > 0 && p.field.length < getMaxFieldSlots(playerKey)) {
                    const rand = candidates[Math.floor(Math.random() * candidates.length)];
                    const idx = p.deck.findIndex(d => d.id === rand.id);
                    const summoned = p.deck.splice(idx, 1)[0];
                    summoned.attacksLeft = summoned.maxAttacks || 1;
                    p.field.push(summoned);
                    log(`Lion King เรียก ${summoned.name} (cost ≥5)!`, 'text-amber-500');
                    triggerOnSummon(summoned, playerKey);
                }
            }
 
            // ── Chameleon ────────────────────────────────────────
            else if (effectiveName === 'Chameleon') {
                log(`🦎 "...ข้าอยู่ที่นี่ตลอด คุณแค่มองไม่เห็น"`, 'text-lime-400 font-bold italic');
                log(`[Summon] Chameleon คัดลอก stat ศัตรูที่แกร่งที่สุด!`, 'text-lime-500');
                if (opp.field.length > 0) {
                    const strongest = opp.field.reduce((best, c) => {
                        const s = getCharStats(c);
                        const b = getCharStats(best);
                        return (s.hp + s.atk > b.hp + b.atk) ? c : best;
                    }, opp.field[0]);
                    const s = getCharStats(strongest);
                    card.atk = s.atk;
                    card.hp = s.hp;
                    card.maxHp = s.hp;
                    log(`Chameleon กลายเป็น ${strongest.name} (${s.atk}/${s.hp}) ถาวร!`, 'text-lime-400');
                }
            }
 
            // ── Eagle summon ─────────────────────────────────────
            else if (effectiveName === 'Eagle') {
                log(`🦅 "SCREEEECH!! ข้ามองเห็นทุกอย่างจากข้างบน!"`, 'text-sky-300 font-bold italic');
                log(`[Summon] Eagle ร่อนลงโจมตี! ลด HP ศัตรูทุกตัว -3`, 'text-sky-600 font-bold');
                opp.field.forEach(t => { t.hp -= 3; });
                checkDeath(opponentKey);
            }
 
            // ── Octopus ──────────────────────────────────────────
            else if (effectiveName === 'Octopus') {
                log(`[Summon] Octopus ดึง Action 2 ใบจากเด็ค!`, 'text-blue-500');
                let count = 0;
                for (let i = p.deck.length - 1; i >= 0 && count < 2; i--) {
                    if (p.deck[i].type === 'Action') {
                        const a = p.deck.splice(i, 1)[0];
                        p.hand.push(a);
                        log(`Octopus ดึง ${a.name} เข้ามือ`, 'text-blue-400');
                        count++;
                    }
                }
            }
 
            // ── Great White Shark ────────────────────────────────
            else if (effectiveName === 'Great White Shark') {
                log(`🦈 "DUN DUN... DUN DUN... DUN DUN DUN DUN!"`, 'text-gray-300 font-bold italic');
                log(`[Summon] Great White Shark ลด ATK ศัตรูทุกตัว -2!`, 'text-cyan-700 font-bold');
                opp.field.forEach(t => {
                    if (t.type === 'Character') {
                        t.atk = Math.max(0, t.atk - 2);
                        log(`${t.name} ATK -2`, 'text-cyan-600');
                    }
                });
            }
 
            // ── Chicken ──────────────────────────────────────────
            else if (effectiveName === 'Chicken') {
                log(`[Summon] Chicken ลด Cost ทุกใบในมือ -1!`, 'text-yellow-500');
                p.hand.forEach(c => { c.costReducer = (c.costReducer || 0) + 1; });
            }
 
            // ── Falcon ───────────────────────────────────────────
            else if (effectiveName === 'Ainz Ooal Gown') {
                log(`💀 "Ich bin untot — ข้าคือ Ainz Ooal Gown ผู้ยิ่งใหญ่แห่ง Nazarick!"`, 'text-indigo-200 font-bold italic');
                log(`[Ainz] Ongoing: Action Card ใบแรกในเทิร์น Cost 0!`, 'text-indigo-400 font-bold');
            }
            else if (effectiveName === 'Jack the Ripper') {
                log(`🔪 "From Hell... ข้ามาจากนรก"`, 'text-gray-200 font-bold italic');
                log(`[Jack the Ripper] ลงสนาม! ฆ่าตัวที่มี On Death → ปิด On Death | ถ้าศัตรูเหลือ 1 ตัว → +4 ATK + True Damage`, 'text-gray-400 font-bold');
            }
            else if (effectiveName === 'Vlad') {
                log(`🩸 "ข้าคือ Vlad III — ผู้เสียบเสา! ศัตรูทั้งหลายจง Mark ไว้!"`, 'text-red-200 font-bold italic');
                log(`[Vlad] ลงสนาม! (+2 ATK/HP ต่อ Mark) | ตาย: ตัวที่โดน Mark ตายด้วย`, 'text-red-400 font-bold');
            }
            else if (effectiveName === 'Soldier') {
                log(`⚔️ "Soldier reporting for duty!"`, 'text-slate-200 font-bold italic');
                log(`[Soldier] ลงสนาม! สุ่ม Equip Item จากสุสานที่มี Cost ≤4`, 'text-slate-400 font-bold');
                const gyItems = p.graveyard.filter(c => c.type === 'Item' && c.cost <= 4);
                if (gyItems.length > 0) {
                    const randItem = gyItems[Math.floor(Math.random() * gyItems.length)];
                    const idx = p.graveyard.findIndex(c => c.id === randItem.id);
                    if (idx !== -1) {
                        const item = p.graveyard.splice(idx, 1)[0];
                        card.items.push(item);
                        log(`[Soldier] ได้รับ ${item.name} จากสุสาน!`, 'text-slate-300');
                    }
                } else {
                    log(`[Soldier] ไม่มี Item ที่ตรงเงื่อนไขในสุสาน`, 'text-gray-500');
                }
            }
            else if (effectiveName === 'Tank') {
                log(`🚂 "Tank rolling in! Crush them all!"`, 'text-zinc-200 font-bold italic');
                log(`[Tank] ลงสนาม! ถ้ามี Field Card → ทำลาย Field`, 'text-zinc-400 font-bold');
                if (state.sharedFieldCard) {
                    p.graveyard.push(state.sharedFieldCard);
                    log(`[Tank] ทำลาย Field Card: ${state.sharedFieldCard.name}`, 'text-zinc-300');
                    state.sharedFieldCard = null;
                    state.sharedFieldCardOwner = null;
                    updateFieldBackground();
                }
            }
            else if (effectiveName === 'Villager') {
                log(`👨‍🌾 "Just a simple villager..."`, 'text-stone-200 font-bold italic');
            }
            else if (effectiveName === 'Farmer') {
                log(`🌾 "Hard work pays off!"`, 'text-emerald-200 font-bold italic');
            }
            else if (effectiveName === 'Cavalry') {
                log(`🐎 "Charge! For glory!"`, 'text-amber-200 font-bold italic');
            }
            else if (effectiveName === 'Gladiator') {
                log(`🏛️ "Ave Caesar! Morituri te salutant!"`, 'text-orange-200 font-bold italic');
                if (state.sharedFieldCard && state.sharedFieldCard.name === 'Colosseum') {
                    log(`[Gladiator] Colosseum active! +5 ATK / +5 HP (Ongoing)`, 'text-orange-400 font-bold');
                } else {
                    log(`[Gladiator] ลงสนาม! ถ้ามี Colosseum → +5 HP +5 ATK`, 'text-orange-400 font-bold');
                }
            }

            // SAKO M/28-30: Deal damage on summon
            if (card.items) {
                card.items.forEach(item => {
                    if (item.name === 'SAKO M/28-30') {
                        const isSimo = effectiveName === 'Simo Häyhä';
                        const dmg = isSimo ? 5 : 4;
                        if (opp.field.length > 0) {
                            const target = opp.field[Math.floor(Math.random() * opp.field.length)];
                            target.hp -= dmg;
                            log(`🔫 [SAKO M/28-30] ยิง ${target.name} รับ ${dmg} ดาเมจ!`, 'text-green-400 font-bold');
                        }
                    }
                });
            }


            if (effectiveName === 'Usain Bolt') {
                log(`⚡ "I am the greatest! Lightning Bolt! ⚡"`, 'text-yellow-200 font-bold italic');
                log(`[Usain Bolt] ลงสนาม! โจมตีได้ 2 ครั้ง | Base < 10 → Cost -2`, 'text-yellow-400 font-bold');
            }
            if (effectiveName === 'Mike Tyson') {
                log(`🥊 "Everyone has a plan until they get punched in the mouth."`, 'text-red-200 font-bold italic');
                log(`[Mike Tyson] ลงสนาม! โจมตี: 50% ฆ่าทันที | หลบการโจมตีแรกในแต่ละเทิร์น`, 'text-red-400 font-bold');
                card.tysonDodgedThisTurn = false;
            }
            if (effectiveName === 'Artto') {
                log(`🎨 "ข้าสละเลือดเนื้อเพื่อพลังอันยิ่งใหญ่..."`, 'text-emerald-200 font-bold italic');
                log(`[Artto] Summon: Base เรา -5 HP!`, 'text-emerald-400 font-bold');
                p.hp -= 5;
                log(`[Artto] Base HP -5! (เหลือ ${p.hp})`, 'text-red-400 font-bold');
                checkWinCondition();
            }
            if (effectiveName === 'นายจันทร์หนวดเขี้ยว') {
                log(`🥋 "ข้าคือนายจันทร์หนวดเขี้ยว! เรียกพี่น้องมาช่วย!"`, 'text-amber-200 font-bold italic');
                // Summon นายทองเหม็น from deck
                const partnerIdx = p.deck.findIndex(cc => (cc.originalName || cc.name) === 'นายทองเหม็น');
                if (partnerIdx !== -1 && p.field.length < getMaxFieldSlots(playerKey)) {
                    const partner = p.deck.splice(partnerIdx, 1)[0];
                    partner.attacksLeft = partner.maxAttacks || 1;
                    p.field.push(partner);
                    log(`🥋 [นายจันทร์หนวดเขี้ยว] เรียก นายทองเหม็น จากเด็คมาลงสนาม!`, 'text-amber-400 font-bold');
                    triggerOnSummon(partner, playerKey);
                } else {
                    log(`🥋 [นายจันทร์หนวดเขี้ยว] ไม่พบ นายทองเหม็น ในเด็ค`, 'text-gray-500');
                }
            }
            if (effectiveName === 'นายทองเหม็น') {
                log(`🥋 "ข้าคือนายทองเหม็น! พี่น้องมาแล้ว!"`, 'text-amber-200 font-bold italic');
                // Summon นายจันทร์หนวดเขี้ยว from deck
                const partnerIdx2 = p.deck.findIndex(cc => (cc.originalName || cc.name) === 'นายจันทร์หนวดเขี้ยว');
                if (partnerIdx2 !== -1 && p.field.length < getMaxFieldSlots(playerKey)) {
                    const partner2 = p.deck.splice(partnerIdx2, 1)[0];
                    partner2.attacksLeft = partner2.maxAttacks || 1;
                    p.field.push(partner2);
                    log(`🥋 [นายทองเหม็น] เรียก นายจันทร์หนวดเขี้ยว จากเด็คมาลงสนาม!`, 'text-amber-400 font-bold');
                    triggerOnSummon(partner2, playerKey);
                } else {
                    log(`🥋 [นายทองเหม็น] ไม่พบ นายจันทร์หนวดเขี้ยว ในเด็ค`, 'text-gray-500');
                }
            }
            if (effectiveName === 'Adolf Hitler') {
                log(`⚔️ "Für das Vaterland! ทุกคนจงรบเพื่อชัยชนะ!"`, 'text-gray-200 font-bold italic');
                log(`[Adolf Hitler] Summon: ตัวเราทุกตัว +3 ATK, -2 HP!`, 'text-gray-400 font-bold');
                card.hitlerBuffCount = 0; // track ongoing buff limit
                p.field.forEach(cc => {
                    if (cc.id !== card.id && getCharStats(cc).hp > 0) {
                        cc.atk += 3;
                        cc.hp -= 2;
                        cc.maxHp -= 2;
                        log(`[Hitler Buff] ${cc.name} +3 ATK, -2 HP`, 'text-gray-300');
                    }
                });
            }
            if (effectiveName === 'Christopher Columbus') {
                log(`🚢 "ข้าค้นพบโลกใหม่! จั่วการ์ดมา 3 ใบ!"`, 'text-blue-200 font-bold italic');
                log(`[Columbus] Summon: จั่ว 3 ใบ!`, 'text-blue-400 font-bold');
                drawCard(playerKey, 3);
            }
            if (effectiveName === 'Gregor Johann Mendel') {
                log(`🧬 "พันธุศาสตร์คืออำนาจ! สร้าง Clone จากศัตรู!"`, 'text-green-200 font-bold italic');
                // Find opponent's highest stat character
                const oppKey = playerKey === 'player' ? 'ai' : 'player';
                const oppField = state.players[oppKey].field.filter(cc => getCharStats(cc).hp > 0);
                if (oppField.length > 0 && p.field.length < getMaxFieldSlots(playerKey)) {
                    // Find highest total stats
                    let bestCard = oppField[0];
                    let bestTotal = 0;
                    oppField.forEach(cc => {
                        const s = getCharStats(cc);
                        const total = s.atk + s.hp;
                        if (total > bestTotal) { bestTotal = total; bestCard = cc; }
                    });
                    const bStats = getCharStats(bestCard);
                    const clone = createCardInstance('Gregor Johann Mendel', p.deck[0]?.theme || 'humanity');
                    clone.name = 'Genetic Clone';
                    clone.originalName = 'Genetic Clone';
                    clone.atk = bStats.atk;
                    clone.hp = bStats.hp;
                    clone.maxHp = bStats.maxHp;
                    clone.cost = 0;
                    clone.text = `Clone ของ ${bestCard.name} (ATK ${bStats.atk} / HP ${bStats.hp}) — ไม่มี ability`;
                    clone.attacksLeft = 1;
                    clone.silenced = true; // no abilities
                    p.field.push(clone);
                    log(`🧬 [Mendel] สร้าง Genetic Clone ของ ${bestCard.name}! (ATK ${bStats.atk} / HP ${bStats.hp})`, 'text-green-400 font-bold');
                } else {
                    log(`🧬 [Mendel] ไม่มีศัตรูในสนามให้ Clone`, 'text-gray-500');
                }
            }
            if (effectiveName === 'Genghis Khan') {
                log(`🐎 [Genghis Khan] ลงสนาม! อัญเชิญ Mongol Cavalry x2 (2/2)`, 'text-red-200 font-bold');
                for (let i = 0; i < 2 && p.field.length < getMaxFieldSlots(playerKey); i++) {
                    const cav = createCardInstance('Mongol Cavalry', 'humanity');
                    if (!cav) break;
                    cav.attacksLeft = cav.maxAttacks || 1;
                    p.field.push(cav);
                    log(`🐎 Mongol Cavalry ลงสนาม (${cav.atk}/${cav.hp})`, 'text-amber-200 font-bold');
                    triggerOnSummon(cav, playerKey);
                }
            }
            if (effectiveName === 'Mongol Cavalry') {
                log(`🐎 [Mongol Cavalry] จงเตรียมอานม้า!`, 'text-amber-200 font-bold');
            }
            if (effectiveName === 'Newton') {
                log(`📐 [Newton] ออกแรงเท่ากับปฏิกิริยา!`, 'text-sky-300 font-bold');
            }
            if (effectiveName === 'Messi') {
                log(`⚽ [Messi] ถึงตาตีแล้ว! ยิงให้สุด!`, 'text-green-200 font-bold');
            }
            if (effectiveName === 'Schrödinger') {
                const roll = Math.floor(Math.random() * 10) + 1; // 1-10
                card.hp = roll;
                card.maxHp = roll;
                card.text = card.text || '';
                log(`⚛️ [Schrödinger] ฉันยังไม่ฟันธง... แต่ตอนนี้ HP คือ ${roll} (ศัตรูเห็นตัวเลข)`, 'text-indigo-200 font-bold');
            }
            if (effectiveName === 'Mozart') {
                log(`🎻 [Mozart] ลงสนาม! บัฟทั้งสนาม +1 ATK / +1 HP | ฉันว่าเพลงนี้ดีกว่านะ`, 'text-purple-200 font-bold');
                card.mozartNotes = 0;
                p.field.forEach(cc => {
                    if (cc.type === 'Character' && getCharStats(cc).hp > 0) {
                        cc.atk += 1;
                        cc.hp += 1;
                        cc.maxHp += 1;
                    }
                });
            }
            if (effectiveName === 'Albert Einstein') {
                log(`🧠 "Imagination is more important than knowledge." — Albert Einstein`, 'text-sky-200 font-bold italic');
                log(`[Einstein] On Summon: ลด cost การ์ดในมือสุ่ม 3 ใบ -3 (ถ้ามี)`, 'text-sky-300 font-bold');
                for (let k = 0; k < 3 && p.hand.length > 0; k++) {
                    const idx = Math.floor(Math.random() * p.hand.length);
                    const hc = p.hand[idx];
                    hc.costReducer = (hc.costReducer || 0) + 3;
                    log(`[Einstein] ลด cost ${hc.name} -3`, 'text-sky-400 font-bold');
                }
            }
            if (effectiveName === 'Alexander the great') {
                log(`⚔️ "There is nothing impossible to him who will try." — Alexander the great`, 'text-red-200 font-bold italic');
                let stolen = 0;
                opp.field.forEach(ec => {
                    if (getCharStats(ec).hp > 0) {
                        const steal = Math.min(2, ec.hp);
                        if (steal > 0) {
                            ec.hp -= steal;
                            stolen += steal;
                            log(`[Alexander] ขโมย ${steal} HP จาก ${ec.name}`, 'text-red-300 font-bold');
                        }
                    }
                });
                if (stolen > 0) {
                    card.hp += stolen;
                    card.maxHp += stolen;
                    log(`[Alexander] ขโมยรวม ${stolen} → บวกให้ ${card.name} (ถาวร)`, 'text-red-200 font-bold');
                } else {
                    log(`[Alexander] ไม่มีศัตรูที่มี HP ให้ขโมย`, 'text-gray-500');
                }
            }
            if (effectiveName === 'Charles Darwin') {
                log(`🧬 "It is not the strongest of the species that survive..." — Charles Darwin`, 'text-green-200 font-bold italic');
                const allies = p.field.filter(cc => cc.type === 'Character' && getCharStats(cc).hp > 0);
                if (allies.length > 0) {
                    const target = allies[Math.floor(Math.random() * allies.length)];
                    target.atk += 3;
                    target.hp += 3;
                    target.maxHp += 3;
                    log(`[Darwin] ${target.name} +3 ATK / +3 HP (ถาวร)`, 'text-green-300 font-bold');
                } else {
                    log(`[Darwin] ไม่มีเพื่อนให้บัฟ`, 'text-gray-500');
                }
            }
            if (effectiveName === 'Achimedes') {
                log(`📐 "Give me a place to stand and I shall move the Earth." — Achimedes`, 'text-teal-200 font-bold italic');
                log(`[Achimedes] On Summon: Freeze/Burn/Bleed/Paralyzed อย่างละ 1 เทิร์น`, 'text-teal-300 font-bold');
                const natImm = hasNatureImmune(opponentKey);
                const enemyAlive = opp.field.filter(c => c.type === 'Character' && getCharStats(c).hp > 0);
                const used = new Set();

                const pickTarget = () => {
                    const candidates = enemyAlive.filter(c => !used.has(c.id));
                    if (candidates.length === 0) return null;
                    return candidates[Math.floor(Math.random() * candidates.length)];
                };

                const tryApply = (statusName) => {
                    const t = pickTarget();
                    if (!t) return;
                    used.add(t.id);

                    if (t.tossakanImmune || natImm) return;

                    if (statusName === 'Freeze') {
                        if (!t.status.includes('Freeze')) t.status.push('Freeze');
                        t.freezeTurns = 2;
                        log(`[Achimedes] Freeze → ${t.name} (1 เทิร์น)`, 'text-cyan-300 font-bold');
                    } else if (statusName === 'Burn') {
                        if (!t.status.includes('Burn')) t.status.push('Burn');
                        t.burnTurns = 1;
                        log(`[Achimedes] Burn → ${t.name} (1 เทิร์น)`, 'text-red-300 font-bold');
                    } else if (statusName === 'Bleed') {
                        if (!t.status.includes('Bleed')) t.status.push('Bleed');
                        t.shalltearBleedTurns = 1;
                        log(`[Achimedes] Bleed → ${t.name} (1 เทิร์น)`, 'text-red-400 font-bold');
                    } else if (statusName === 'Paralyze') {
                        if (!t.status.includes('Paralyze')) t.status.push('Paralyze');
                        t.paralyzeTurns = 2;
                        log(`[Achimedes] Paralyze → ${t.name} (1 เทิร์น)`, 'text-yellow-300 font-bold');
                    }
                };

                // Apply 4 different debuffs (ถ้ามีตัวพอ)
                tryApply('Freeze');
                tryApply('Burn');
                tryApply('Bleed');
                tryApply('Paralyze');
            }
            if (effectiveName === 'Luis Pasteur') {
                log(`🧪 "Chance favors the prepared mind." — Louis Pasteur`, 'text-indigo-200 font-bold italic');
                // Buff: Only heal allies with MISSING HP
                const allies = p.field.filter(cc => cc.type === 'Character' && cc.id !== card.id && getCharStats(cc).hp > 0 && getCharStats(cc).hp < getCharStats(cc).maxHp);
                if (allies.length > 0) {
                    const target = allies[Math.floor(Math.random() * allies.length)];
                    target.hp = getCharStats(target).maxHp;
                    log(`[Pasteur] ฮีลเต็ม HP ให้ ${target.name} (HP กลับเต็ม!)`, 'text-indigo-300 font-bold');
                } else {
                    log(`[Pasteur] ไม่มีเพื่อนที่ HP ไม่เต็มให้ฮีล`, 'text-gray-500');
                }
            }
            if (effectiveName === 'Kirito') {
                log(`⚔️ "ฉัน Kirito — ถ้ามี Asuna อยู่ ข้าสู้ได้สองมือ!"`, 'text-gray-200 font-bold italic');
            }
            if (effectiveName === 'Maple') {
                log(`🛡️ "ฉันรับทุกอย่างได้เอง! ไม่เจ็บเลยสักนิด~"`, 'text-pink-200 font-bold italic');
            }
            if (effectiveName === 'Fran') {
                log(`🗡️ "ข้าจะแข็งแกร่งขึ้นเพื่อปลดปล่อย Black Cat Tribe!"`, 'text-purple-200 font-bold italic');
            }
            if (effectiveName === 'Sung Jin-Woo') {
                log(`⬛ "Arise."`, 'text-slate-200 font-bold italic');
            }
            if (effectiveName === 'Blue Whale') {
                log(`🐋 "ข้าคือสิ่งมีชีวิตที่ใหญ่ที่สุดที่เคยมีบนโลก"`, 'text-blue-300 font-bold italic');
            }
            if (effectiveName === 'Cheetah') {
                log(`🐆 "ช้าๆก็แพ้แล้ว — ข้าเร็วที่สุดในโลก!"`, 'text-yellow-400 font-bold italic');
            }
            if (effectiveName === 'Porcupine') {
                log(`🦔 "ลองมาตีข้าดิ... ลองดู"`, 'text-lime-300 font-bold italic');
            }
            if (effectiveName === 'Scorpion') {
                log(`🦂 "หางข้านี่แหละที่น่ากลัว ไม่ใช่ก้าม"`, 'text-red-400 font-bold italic');
            }
            if (effectiveName === 'Hippo') {
                log(`🦛 "ฉันดูไม่น่ากลัว... แต่อันตรายที่สุดในแอฟริกา"`, 'text-stone-400 font-bold italic');
            }
            if (effectiveName === 'Ostrich') {
                log(`🦤 "ข้าไม่ซ่อนหัวในทราย... แค่หลบเก่งมาก"`, 'text-amber-400 font-bold italic');
            }
            if (effectiveName === 'Thor') {
                log(`⚡ "MJOLNIR! สายฟ้าจงฟาด! I am worthy!"`, 'text-sky-200 font-bold italic');
            }
            if (effectiveName === 'Rubick') {
                log(`🟩 "ข้า Rubick แม้ไม่โจมตี แต่แข็งแกร่งขึ้นทุกเทิร์น!"`, 'text-purple-300 font-bold italic');
            }
            if (effectiveName === 'Joe Stk') {
                log(`🎯 "ยิ่งมีเพื่อนในสุสานมาก Cost ก็ยิ่งถูก!"`, 'text-teal-300 font-bold italic');
            }
            if (effectiveName === 'Falcon') {
                log(`🦅 "SWOOSH! มองดูตาข้าแล้วหยิบไพ่คืนไม่ทัน!"`, 'text-sky-200 font-bold italic');
                log(`[Summon] Falcon ทิ้งการ์ดมือศัตรู 2 ใบสุ่ม!`, 'text-sky-500 font-bold');
                for (let k = 0; k < 2 && opp.hand.length > 0; k++) {
                    const idx = Math.floor(Math.random() * opp.hand.length);
                    const discarded = opp.hand[idx];
                    // Holy Grail ไม่สามารถถูกทิ้งได้
                    if (discarded.name === 'Holy Grail' || discarded.type === 'Spell') {
                        log(`Falcon ไม่สามารถทิ้ง Holy Grail ได้!`, 'text-yellow-400');
                    } else {
                        opp.hand.splice(idx, 1);
                        opp.graveyard.push(discarded);
                        log(`Falcon ทิ้ง ${discarded.name} ของศัตรู`, 'text-sky-400');
                    }
                }
            }

            // ── Space Deck On Summon ────────────────────────────────────────
            if (effectiveName === 'Space Overseer') {
                log(`🌌 "มองดูดวงดาวสิ... มีความลับซ่อนอยู่"`, 'text-indigo-300 font-bold italic');
                log(`[Summon] Space Overseer จั่ว 2 ใบ (1 ขึ้นมือ, 1 ไป Space Zone)`, 'text-indigo-400 font-bold');
                if (p.deck.length >= 2) {
                    const card1 = p.deck.pop();
                    const card2 = p.deck.pop();
                    const isHumanTurn = (playerKey === 'player' && gameMode !== 'ai') || (gameMode === 'online' && playerKey === myRole);
                    if (isHumanTurn) {
                        const keepFirst = confirm(`[Space Overseer] คุณจั่วได้:\n1. ${card1.name}\n2. ${card2.name}\n\nกด OK → เก็บ "${card1.name}" ขึ้นมือ (ส่ง "${card2.name}" ไป Space Zone)\nกด Cancel → เก็บ "${card2.name}" ขึ้นมือ (ส่ง "${card1.name}" ไป Space Zone)`);
                        if (keepFirst) {
                            p.hand.push(card1);
                            p.spaceZone.push(card2);
                            log(`เก็บ \${card1.name} ขึ้นมือ, ส่ง \${card2.name} ไป Space Zone`, 'text-indigo-300');
                        } else {
                            p.hand.push(card2);
                            p.spaceZone.push(card1);
                            log(`เก็บ \${card2.name} ขึ้นมือ, ส่ง \${card1.name} ไป Space Zone`, 'text-indigo-300');
                        }
                    } else {
                        if (Math.random() < 0.5) {
                            p.hand.push(card1);
                            p.spaceZone.push(card2);
                            log(`AI เก็บ \${card1.name} ขึ้นมือ, ส่ง \${card2.name} ไป Space Zone`, 'text-indigo-300');
                        } else {
                            p.hand.push(card2);
                            p.spaceZone.push(card1);
                            log(`AI เก็บ \${card2.name} ขึ้นมือ, ส่ง \${card1.name} ไป Space Zone`, 'text-indigo-300');
                        }
                    }
                } else if (p.deck.length === 1) {
                    p.hand.push(p.deck.pop());
                    log(`เด็คเหลือใบเดียว เก็บขึ้นมือ`, 'text-indigo-300');
                } else {
                    log(`เด็คหมดแล้ว!`, 'text-red-400');
                }
            }

            checkDeath(opponentKey);
            checkOngoingAuras();
        }

        // ── Targeted Spell / Action dispatcher ───────────────────────────────
        // Card effects that need a targetChar (called from resolveTargetedPlay for Spell type)
        // Add targeted spell effects here as spells are created.
        function executeTargetedAction(card, playerKey, targetChar) {
            const oppKey = playerKey === 'player' ? 'ai' : 'player';
            const p = state.players[playerKey];
            const opp = state.players[oppKey];
            // Future targeted spell effects go here, keyed by card.name
            // e.g.: if (card.name === 'Fireball') { targetChar.hp -= 5; checkDeath(targetChar belongs to oppKey?); }
            log(`✨ [Spell] ${card.name} ไม่มีเอฟเฟกต์เพิ่มเติม`, 'text-indigo-500');
        }

        function executeNonTargetAction(card, playerKey) {
            const opponentKey = playerKey === 'player' ? 'ai' : 'player';
            const p = state.players[playerKey];
            
            if (card.name === 'Rafael') {
                log(`[Action] Rafael วิเคราะห์ระบบ: จั่วการ์ด 3 ใบ!`, 'text-teal-300');
                drawCard(playerKey, 3);
            }
            else if (card.name === 'Explosion') {
                const oppField = state.players[opponentKey].field;
                if (oppField.length > 0) {
                    let count = Math.min(2, oppField.length);
                    const shuffled = [...oppField].sort(() => 0.5 - Math.random());
                    for(let i=0; i<count; i++){
                        shuffled[i].hp = -99;
                        log(`[Action] EXPLOSION!! ทำลาย ${shuffled[i].name} ทิ้ง!`, 'text-red-500 font-bold');
                    }
                    checkDeath(opponentKey);
                }
            }
            else if (card.name === 'Revive') {
                log(`[Action] Revive! ชุบชีวิต Character สุ่ม 2 ตัวจากสุสาน!`, 'text-emerald-400 font-bold');
                let revivedCount = 0;
                const gy = p.graveyard;
                while (revivedCount < 2 && p.field.length < getMaxFieldSlots(playerKey)) {
                    const deadChars = gy.filter(c => c.type === 'Character' && c.name !== 'Subaru');
                    if (deadChars.length === 0) break;
                    const rIndex = Math.floor(Math.random() * deadChars.length);
                    const revivedTemplate = deadChars[rIndex];
                    const actualIndex = gy.findIndex(c => c.id === revivedTemplate.id);
                    if (actualIndex === -1) break;
                    const revived = gy.splice(actualIndex, 1)[0];
                    revived.hp = revived.maxHp;
                    revived.status = [];
                    revived.items = []; 
                    revived.attacksLeft = revived.maxAttacks || 1; 
                    p.field.push(revived);
                    log(`[Action] Revive! อัญเชิญ ${revived.name} จากสุสานกลับสู่สนาม!`, 'text-emerald-400');
                    triggerOnSummon(revived, playerKey);
                    revivedCount++;
                }
            }
            else if (card.name === 'Goal of All Life is Death') {
                log(`[Action] ⌛ "The Goal of All Life is Death"... ทุกสรรพสิ่งล้วนสูญสลาย!`, 'text-gray-400 font-bold');
                // ทิ้งมือทั้งหมด แต่ Holy Grail และ Spell ไม่สามารถถูกทิ้งได้
                ['player', 'ai'].forEach(pk => {
                    const p = state.players[pk];
                    const protectedCards = [];
                    for (let i = p.hand.length - 1; i >= 0; i--) {
                        if (p.hand[i].name === 'Holy Grail' || p.hand[i].type === 'Spell') {
                            protectedCards.push(p.hand.splice(i, 1)[0]);
                        }
                    }
                    p.graveyard.push(...p.hand);
                    p.hand = protectedCards; // เก็บ Holy Grail และ Spell ไว้ในมือ
                    if (protectedCards.length > 0) {
                        log(`${pk.toUpperCase()}: Holy Grail / Spell ไม่สามารถถูกทิ้งได้!`, 'text-yellow-400');
                    }
                });
                
                ['player', 'ai'].forEach(pk => {
                    state.players[pk].field.forEach(c => c.hp = -99); 
                });
                checkDeath('player');
                checkDeath('ai');
                state.players[opponentKey].hp -= 3;
                log(`[Effect] Goal of All Life is Death ทำลายฐานศัตรู 3 HP!`, 'text-black font-bold');
                checkWinCondition();
            }
            // ── BLOCK C: EASTER EGG playAction handler ───────────────────
            if (name === 'Easter Egg') {
                const ownerPlayer = state.players[playerKey];
                ownerPlayer.pendingEasterEgg = true;
                log(`🥚 [Easter Egg] วางแล้ว! เทิร์นหน้าสุ่มอัญเชิญ Character Cost 5-7 จาก Deck`, 'text-yellow-400 font-bold');
                return;
            }
// ── END BLOCK C ────────────────────────────────────────────────
 
            else if (card.name === 'Random Summon') {
                if (p.field.length < getMaxFieldSlots(playerKey)) {
                    const allCharNames = Object.keys(CardSets[selectedPlayerTheme]).filter(k => CardSets[selectedPlayerTheme][k].type === 'Character');
                    const randomName = allCharNames[Math.floor(Math.random() * allCharNames.length)];
                    const newChar = createCardInstance(randomName, selectedPlayerTheme);
                    newChar.attacksLeft = newChar.maxAttacks;
                    p.field.push(newChar);
                    log(`[Action] Random Summon! อัญเชิญ ${newChar.name} ลงสู่สนาม!`, 'text-indigo-300');
                    triggerOnSummon(newChar, playerKey);
                }
            }
            else if (card.name === 'Mana Energy') {
                log(`[Action] Mana Energy! การ์ดบนมือทั้งหมด Cost -2`, 'text-blue-300 font-bold');
                p.hand.forEach(c => c.costReducer = (c.costReducer || 0) + 2);
            }
            else if (card.name === 'Army Summon') {
                log(`[Action] Army Summon! กองทัพบุก! อัญเชิญ Character 3 ตัวจากกองลงสนาม!`, 'text-orange-400 font-bold');
                let summoned = 0;
                for (let i = p.deck.length - 1; i >= 0 && summoned < 3 && p.field.length < getMaxFieldSlots(playerKey); i--) {
                    if (p.deck[i].type === 'Character') {
                        const c = p.deck.splice(i, 1)[0];
                        c.attacksLeft = c.maxAttacks;
                        p.field.push(c);
                        log(`[Action] อัญเชิญ ${c.name}!`, 'text-yellow-300');
                        triggerOnSummon(c, playerKey);
                        summoned++;
                    }
                }
                checkOngoingAuras();
            }
            else if (card.name === 'Elevate Hunted') {
                log(`[Action] Elevate Hunted! Character ทุกตัวในสนามเรา +2 HP / +2 ATK ถาวร!`, 'text-violet-400 font-bold');
                p.field.forEach(c => {
                    if (c.type === 'Character') {
                        c.atk += 2;
                        c.maxHp += 2;
                        c.hp += 2;
                    }
                });
            }
            else if (card.name === 'Skull Devourer') {
                if (p.hand.length >= 2) {
                    const idx1 = Math.floor(Math.random() * p.hand.length);
                    const discard1 = p.hand.splice(idx1, 1)[0];
                    const idx2 = Math.floor(Math.random() * p.hand.length);
                    const discard2 = p.hand.splice(idx2, 1)[0];
                    p.graveyard.push(discard1, discard2);
                    log(`[Action] Skull Devourer กินกะโหลก! ทิ้ง ${discard1.name} และ ${discard2.name}`, 'text-gray-500 font-bold');

                    const opp = state.players[opponentKey];
                    opp.field.forEach(c => {
                        if (c.type === 'Character') {
                            c.atk = 1;
                            log(`[Effect] ${c.name} ถูกดูดพลัง ATK เหลือ 1!`, 'text-gray-600');
                        }
                    });
                } else {
                    log(`[Fail] Skull Devourer ใช้ไม่ได้ – มือมีน้อยกว่า 2 ใบ`, 'text-red-500');
                }
            }
            else if (card.name === 'Lightning Bolt') {
                const opp = state.players[opponentKey];
                if (opp.field.length > 0) {
                    const target = opp.field[Math.floor(Math.random() * opp.field.length)];
                    target.hp -= 4;
                    log(`[Action] Lightning Bolt! ${target.name} ถูกฟ้าผ่า 4 ดาเมจ ⚡`, 'text-yellow-400');
                    checkDeath(opponentKey);

                    if (opp.hand.length > 0) {
                        const discardIndex = Math.floor(Math.random() * opp.hand.length);
                        const discarded = opp.hand.splice(discardIndex, 1)[0];
                        opp.graveyard.push(discarded);
                        log(`[Lightning Bolt] ทิ้งการ์ดสุ่มของฝั่งตรงข้าม: ${discarded.name}`, 'text-yellow-600 font-bold');
                    }
                } else {
                    log(`[Fail] Lightning Bolt ไม่มีเป้า`, 'text-yellow-600');
                }
            }
            else if (card.name === 'Apple') {
                log(`[Action] 🍎 Apple! Heal +5 HP ให้ทุกหน่วยฝั่งเรา`, 'text-red-400');
                p.field.forEach(c => {
                    if (c.type === 'Character' && !c.status.includes('Poison')) {
                        c.hp = Math.min(getCharStats(c).maxHp, c.hp + 5);
                    }
                });
            }
            else if (card.name === 'Golden Apple') {
                log(`[Action] 🍏 Golden Apple! +4 Max HP ให้ทุกหน่วยฝั่งเรา (ชั่วคราว 2 เทิร์น)`, 'text-amber-500 font-bold');
                p.field.forEach(c => {
                    if (c.type === 'Character') {
                        c.maxHp += 4;
                        c.hp += 4;
                        if (!c.goldenBuffExpires) c.goldenBuffExpires = [];
                        c.goldenBuffExpires.push(2);
                        log(`Golden Apple บัฟ ${c.name} +4 Max HP (2 เทิร์น)`, 'text-amber-300');
                    }
                });
            }
            else if (card.name === 'Mega Cage') {
                log(`[Action] 🗝️ Mega Cage! Freeze ศัตรูทุกตัว 1 เทิร์น ❄️`, 'text-cyan-400 font-bold');
                const opp = state.players[opponentKey];
                opp.field.forEach(c => {
                    if (!c.status.includes('Freeze')) { c.status.push('Freeze'); c.freezeTurns = 2; }
                });
            }
            else if (card.name === 'DNA Replication') {
                log(`[Action] DNA Replication! +3 ATK / +3 HP ให้ Character 3 ตัวสุ่ม (ถาวร)`, 'text-purple-500 font-bold');
                let targets = [...p.field].filter(c => c.type === 'Character').sort(() => Math.random() - 0.5).slice(0, 3);
                targets.forEach(t => {
                    t.atk += 3;
                    t.maxHp += 3;
                    t.hp += 3;
                    log(`DNA Replication บัฟ ${t.name} +3/+3`, 'text-purple-400');
                });
            }
            else if (card.name === 'Call of the Wild') {
                log(`[Action] Call of the Wild! อัญเชิญ Character สุ่ม 2 ตัวจาก Animal Kingdom`, 'text-teal-400 font-bold');
                let summonedCount = 0;
                const animalCandidates = p.deck.filter(c => c.type === 'Character');
                for (let i = 0; i < 2 && summonedCount < 2 && p.field.length < getMaxFieldSlots(playerKey) && animalCandidates.length > 0; i++) {
                    const randIdx = Math.floor(Math.random() * animalCandidates.length);
                    const selected = animalCandidates[randIdx];
                    const deckIdx = p.deck.findIndex(d => d.id === selected.id);
                    if (deckIdx !== -1) {
                        const summoned = p.deck.splice(deckIdx, 1)[0];
                        summoned.attacksLeft = summoned.maxAttacks;
                        p.field.push(summoned);
                        log(`[Summon] Call of the Wild → ${summoned.name}`, 'text-teal-300');
                        triggerOnSummon(summoned, playerKey);
                        summonedCount++;
                    }
                }
            }
            else if (card.name === 'Fullmoon') {
                log(`[Action] 🌕 Fullmoon! Wolf ทุกตัวในสนาม +5 ATK / +5 HP ถาวร!`, 'text-purple-400 font-bold');
                p.field.forEach(c => {
                    const effName = (c.name.startsWith('Shadow Token') || c.name.startsWith('Shadow army') || c.name.includes('Loki Clone')) ? c.originalName : c.name;
                    if (effName === 'Wolf') {
                        c.atk += 5;
                        c.maxHp += 5;
                        c.hp += 5;
                        log(`Fullmoon บัฟ ${c.name} +5/+5`, 'text-purple-300');
                    }
                });
            }
            else if (card.name === 'Mjolnir') {
                let thors = p.field.filter(c => {
                    const eff = (c.name.startsWith('Shadow Token') || c.name.startsWith('Shadow army') || c.name.includes('Loki Clone')) ? c.originalName : c.name;
                    return eff === 'Thor';
                });
                if (thors.length > 0) {
                    const thor = thors[Math.floor(Math.random() * thors.length)];
                    const oldAtk = thor.atk;
                    const oldMaxHp = thor.maxHp;
                    const oldHp = thor.hp;
                    thor.atk *= 2;
                    thor.maxHp *= 2;
                    thor.hp = Math.min(thor.hp * 2, thor.maxHp);
                    log(`You are worthy! ⚡ Thor stats doubled: ATK ${oldAtk} → ${thor.atk} | HP ${oldHp}/${oldMaxHp} → ${thor.hp}/${thor.maxHp}`, "text-yellow-400 font-bold");
                } else {
                    log(`[Mjolnir] ไม่พบ Thor บนสนาม!`, "text-red-500");
                }
            }
            else if (card.name === 'Welcome to Heaven') {
                log(`[Action] Welcome to Heaven!`, 'text-sky-400 font-bold');
                if (p.field.length >= 2) {
                    for (let k = 0; k < 2; k++) {
                        if (p.field.length > 0) {
                            const idx = Math.floor(Math.random() * p.field.length);
                            const removed = p.field.splice(idx, 1)[0];
                            p.graveyard.push(removed);
                            log(`[Heaven] ส่ง ${removed.name} ไปสุสาน`, 'text-sky-300');
                        }
                    }
                    let summonedCount = 0;
                    // รวม hand+deck แล้วสุ่มเฉพาะ Character จนได้ 2 ตัว
                    const combined = [...p.hand, ...p.deck].filter(c => c.type === 'Character');
                    const shuffled = combined.sort(() => Math.random() - 0.5);
                    for (let i = 0; i < shuffled.length && summonedCount < 2; i++) {
                        if (p.field.length >= getMaxFieldSlots(playerKey)) break;
                        const picked = shuffled[i];
                        // ลบออกจาก hand หรือ deck
                        const hIdx = p.hand.findIndex(c => c.id === picked.id);
                        if (hIdx !== -1) p.hand.splice(hIdx, 1);
                        else {
                            const dIdx = p.deck.findIndex(c => c.id === picked.id);
                            if (dIdx !== -1) p.deck.splice(dIdx, 1);
                            else continue;
                        }
                        picked.attacksLeft = picked.maxAttacks || 1;
                        p.field.push(picked);
                        log(`[Heaven] Random Summon ${picked.name}!`, 'text-sky-400');
                        triggerOnSummon(picked, playerKey);
                        summonedCount++;
                    }
                    if (summonedCount < 2) log(`[Heaven] ไม่มี Character พอในมือ/เด็ค`, 'text-sky-300');
                } else {
                    log(`[Fail] ไม่มี Field Card พอสำหรับ Welcome to Heaven`, 'text-red-500');
                }
            }
            else if (card.name === 'หาแหวน Dobble Bot') {
                log(`[Action] หาแหวน Dobble Bot!`, 'text-purple-300');
                let allItems = [];
                Object.keys(CardSets).forEach(th => {
                    Object.keys(CardSets[th]).forEach(k => {
                        if (CardSets[th][k].type === 'Item') {
                            allItems.push({key: k, theme: th});
                        }
                    });
                });
                if (allItems.length > 0) {
                    const randIdx = Math.floor(Math.random() * allItems.length);
                    const randItem = allItems[randIdx];
                    const newItem = createCardInstance(randItem.key, randItem.theme);
                    p.hand.push(newItem);
                    log(`ได้ Item: ${newItem.name}`, 'text-purple-400');
                }
                const pasut = p.field.find(c => c.name === 'Pasut Kleebua');
                if (pasut) {
                    pasut.atk += 2;
                    pasut.maxHp += 2;
                    pasut.hp += 2;
                    log(`Pasut Kleebua +2 ATK / +2 HP`, 'text-red-400 font-bold');
                }
            }
            else if (card.name === 'Gigatomachy') {
                const hasZeus = p.field.some(c => {
                    const n = (c.name.startsWith('Shadow Token') || c.name.startsWith('Shadow army') || c.name.includes('Loki Clone')) ? c.originalName : c.name;
                    return n === 'Zeus' && getCharStats(c).hp > 0;
                });
                const buff = hasZeus ? 7 : 4;
                p.field.forEach(c => {
                    if (c.type === 'Character') {
                        applyTempBuff(c, buff, buff, 2);
                    }
                });
                log(`[Gigatomachy] +${buff} ATK/HP ให้หน่วยฝั่งเรา (1 เทิร์น)!`, 'text-red-400 font-bold');
            }
            else if (card.name === 'Underworld Descent') {
                const gy = p.graveyard.filter(c => c.type === 'Character' && c.cost <= 7 && c.name !== 'Subaru');
                if (gy.length > 0 && p.field.length < getMaxFieldSlots(playerKey)) {
                    const rIndex = Math.floor(Math.random() * gy.length);
                    const actualIndex = p.graveyard.findIndex(c => c.id === gy[rIndex].id);
                    const revived = p.graveyard.splice(actualIndex, 1)[0];
                    revived.hp = revived.maxHp || revived.hp;
                    revived.status = [];
                    revived.items = [];
                    p.field.push(revived);
                    log(`[Underworld Descent] ชุบ ${revived.name} จากสุสาน!`, 'text-purple-400');
                    triggerOnSummon(revived, playerKey);
                }
            }
            else if (card.name === 'Apotheosis') {
                p.apotheosisTurns = 2;
                log(`[Apotheosis] หน่วยฝั่งเรา +30% Evade 2 เทิร์น!`, 'text-amber-400 font-bold');
            }
            else if (card.name === 'Ragnarok') {
                if (p.hp > 5) {
                    log(`[Ragnarok] ใช้ไม่ได้! Base HP ต้อง ≤5`, 'text-red-500');
                    return;
                }
                p.hp = 2;
                log(`RAGNAROK DESCENDS! โลกาภิวัตน์สิ้นสุด... Base เหลือ 2 HP!`, 'text-red-600 font-bold');
                let reduced = 0;
                for (let i = 0; i < 3 && p.hand.length > 0; i++) {
                    const idx = Math.floor(Math.random() * p.hand.length);
                    const cCost = getActualCost(p.hand[idx], playerKey);
                    if (cCost > 0) p.hand[idx].costReducer += cCost;
                    reduced++;
                }
                log(`[Ragnarok] การ์ดในมือ ${reduced} ใบ Cost 0 ทันที!`, 'text-red-300');
            }
            else if (card.name === 'Bad Luck Try Again') {
                log(`[Bad Luck Try Again] ... ลองใหม่อีกครั้ง!`, 'text-gray-400');
                // ทิ้ง 2 ใบสุ่ม (ไม่รวม Holy Grail)
                for (let i = 0; i < 2 && p.hand.length > 0; i++) {
                    const idx = Math.floor(Math.random() * p.hand.length);
                    const discarded = p.hand[idx];
                    // Holy Grail ไม่สามารถถูกทิ้งได้
                    if (discarded.name === 'Holy Grail' || discarded.type === 'Spell') {
                        log(`ไม่สามารถทิ้ง Holy Grail ได้!`, 'text-yellow-400');
                    } else {
                        p.hand.splice(idx, 1);
                        p.graveyard.push(discarded);
                        log(`ทิ้ง ${discarded.name}`, 'text-gray-300');
                    }
                }
                // จั่ว 5 ใบ
                drawCard(playerKey, 5);
            }
            else if (card.name === 'Mid Summon') {
                const candidates = p.deck.filter(c => c.type === 'Character' && c.cost >= 5 && c.cost <= 7);
                if (candidates.length > 0 && p.field.length < getMaxFieldSlots(playerKey)) {
                    const randIdx = Math.floor(Math.random() * candidates.length);
                    const deckIdx = p.deck.findIndex(d => d.id === candidates[randIdx].id);
                    const summoned = p.deck.splice(deckIdx, 1)[0];
                    summoned.attacksLeft = summoned.maxAttacks || 1;
                    p.field.push(summoned);
                    log(`[Mid Summon] อัญเชิญ ${summoned.name} (cost 5-7)!`, 'text-indigo-400');
                    triggerOnSummon(summoned, playerKey);
                }
            }
            else if (card.name === 'Heart of Tossakan') {
                log(`[Heart of Tossakan] Tossakan becomes Immortal for 2 turns!`, 'text-emerald-500 font-bold');
                let foundToss = false;
                p.field.forEach(c => {
                    const n = (c.name.startsWith('Shadow Token') || c.name.startsWith('Shadow army') || c.name.includes('Loki Clone')) ? (c.originalName || c.name) : c.name;
                    if (n === 'Tossakan') {
                        c.tossakanImmune = true;
                        c.tossakanImmortalTurns = 2;
                        foundToss = true;
                    }
                });
                if (!foundToss) log(`[Fail] ไม่พบ Tossakan บนสนาม`, 'text-red-400');
            }
            else if (card.name === 'Toy Box Surprise') {
                log(`[Action] Toy Box Surprise! สุ่มอัญเชิญ Character 2 ตัวจากเด็ค`, 'text-yellow-400 font-bold');
                let summonedCount = 0;
                const candidates = p.deck.filter(c => c.type === 'Character');
                for (let i = 0; i < 2 && summonedCount < 2 && p.field.length < getMaxFieldSlots(playerKey) && candidates.length > 0; i++) {
                    const randIdx = Math.floor(Math.random() * candidates.length);
                    const selected = candidates[randIdx];
                    const deckIdx = p.deck.findIndex(d => d.id === selected.id);
                    if (deckIdx !== -1) {
                        const summoned = p.deck.splice(deckIdx, 1)[0];
                        summoned.attacksLeft = summoned.maxAttacks || 1;
                        p.field.push(summoned);
                        log(`[Summon] Toy Box Surprise → ${summoned.name}`, 'text-yellow-300');
                        triggerOnSummon(summoned, playerKey);
                        summonedCount++;
                    }
                }
            }
            else if (card.name === 'Toy Takeover') {
                log(`[Action] Toy Takeover!`, 'text-red-400 font-bold');
                const opp = state.players[opponentKey];
                if (opp.field.length > 0) {
                    const target = opp.field[Math.floor(Math.random() * opp.field.length)];
                    const origName = target.originalName || target.name;
                    target.name = `Toy ${origName}`;
                    target.originalName = `Toy ${origName}`;
                    target.atk = 2;
                    target.hp = 2;
                    target.maxHp = 2;
                    target.text = 'Toy 2/2 (ไร้ความสามารถ)';
                    target.silenced = true;
                    target.status = [];
                    target.color = 'bg-yellow-600';
                    target.art = 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80';
                    log(`เปลี่ยน ${origName} เป็น Toy 2/2!`, 'text-red-300');
                }
            }
            else if (card.name === 'Lego Army Set') {
                log(`[Action] Lego Army Set! อัญเชิญ Lego Man x3`, 'text-yellow-400 font-bold');
                let summoned = 0;
                for (let i = p.deck.length - 1; i >= 0 && summoned < 3 && p.field.length < getMaxFieldSlots(playerKey); i--) {
                    if (p.deck[i].name === 'Lego Man') {
                        const lm = p.deck.splice(i, 1)[0];
                        lm.attacksLeft = lm.maxAttacks || 1;
                        p.field.push(lm);
                        log(`Lego Man ถูกอัญเชิญ!`, 'text-yellow-300');
                        triggerOnSummon(lm, playerKey);
                        summoned++;
                    }
                }
            }
            else if (card.name === 'Use Glue to Fix!') {
                log(`[Action] Use Glue to Fix! ชุบ 2 ตัวจากสุสาน`, 'text-green-400 font-bold');
                let count = 0;
                const gy = p.graveyard;
                while (count < 2 && p.field.length < getMaxFieldSlots(playerKey)) {
                    const dead = gy.filter(c => c.type === 'Character');
                    if (dead.length === 0) break;
                    const r = Math.floor(Math.random() * dead.length);
                    const idx = gy.findIndex(c => c.id === dead[r].id);
                    if (idx === -1) break;
                    const revived = gy.splice(idx, 1)[0];
                    revived.hp = revived.maxHp || revived.hp;
                    revived.status = [];
                    revived.items = [];
                    revived.attacksLeft = revived.maxAttacks || 1;
                    p.field.push(revived);
                    log(`Glue Fix! ชุบ ${revived.name}`, 'text-green-300');
                    triggerOnSummon(revived, playerKey);
                    count++;
                }
            }
            else if (card.name === 'Clay Barrier') {
                log(`[Action] Clay Barrier! 100% Damage Reduction จนจบเทิร์น`, 'text-amber-400 font-bold');
                p.field.forEach(c => {
                    if (c.type === 'Character') c.clayBarrierTurns = 2;
                });
            }
            // === NEW HUMANITY ACTION CARDS ===
            else if (card.name === 'Normandy Landings') {
                log(`[Action] Normandy Landings! อัญเชิญ Character cost 3+ จากเด็ค 2 ตัว!`, 'text-blue-400 font-bold');
                let summonedCount = 0;
                for (let i = 0; i < 2 && summonedCount < 2 && p.field.length < getMaxFieldSlots(playerKey); i++) {
                    const candidates = p.deck.filter(c => c.type === 'Character' && c.cost >= 3);
                    if (candidates.length === 0) break;
                    const randIdx = Math.floor(Math.random() * candidates.length);
                    const selected = candidates[randIdx];
                    const deckIdx = p.deck.findIndex(d => d.id === selected.id);
                    if (deckIdx !== -1) {
                        const s = p.deck.splice(deckIdx, 1)[0];
                        s.atk += 1;
                        s.maxHp += 1;
                        s.hp += 1;
                        s.attacksLeft = s.maxAttacks || 1;
                        p.field.push(s);
                        log(`[Normandy] อัญเชิญ ${s.name} (+1 ATK/+1 HP)!`, 'text-blue-300');
                        triggerOnSummon(s, playerKey);
                        summonedCount++;
                    }
                }
            }
            else if (card.name === 'Hiroshima Atomic Bombing') {
                log(`[Action] ☢️ HIROSHIMA ATOMIC BOMBING! ทำลายทุกอย่างบนสนาม!`, 'text-orange-600 font-bold');
                ['player', 'ai'].forEach(pk => {
                    state.players[pk].field.forEach(c => {
                        if (c.type === 'Character') c.hp = -99;
                    });
                });
                checkDeath('player');
                checkDeath('ai');
                state.players.player.hp -= 2;
                state.players.ai.hp -= 2;
                log(`💥 ทั้งสองฝ่ายเสีย Base HP -2!`, 'text-red-500 font-bold');
                checkWinCondition();
            }
            else if (card.name === 'Theory of Relativity') {
                if (p.hand.length >= 4) {
                    log(`[Action] Theory of Relativity! บิดเบี้ยวเวลา!`, 'text-purple-400 font-bold');
                    for (let i = 0; i < 5 && p.hand.length > 0; i++) {
                        const idx = Math.floor(Math.random() * p.hand.length);
                        const discarded = p.hand.splice(idx, 1)[0];
                        p.graveyard.push(discarded);
                        log(`ทิ้ง ${discarded.name}`, 'text-gray-400');
                    }
                    state.skipOpponentTurn = true;
                    log(`⏰ เวลาบิดเบี้ยว! เทิร์นคู่ต่อสู้ถูกข้าม!`, 'text-purple-300 font-bold');
                } else {
                    log(`[Fail] ต้องมีการ์ดในมืออย่างน้อย 5 ใบ`, 'text-red-400');
                }
            }
            else if (card.name === 'Prediction of Nostradamus') {
                const opp = state.players[opponentKey];
                const handSize = opp.hand.length;
                if (handSize > 0) {
                    const affectCount = Math.ceil(handSize / 2);
                    const isOdd = handSize % 2 !== 0;
                    if (isOdd) {
                        p.cost = Math.min(20, p.cost + 2);
                        log(`[Action] 🔮 Nostradamus! มือศัตรูเลขคี่ → +2 Cost ฝั่งเรา`, 'text-indigo-300');
                    }
                    // สุ่มการ์ดครึ่งหนึ่งของมือศัตรู แล้วเพิ่ม cost ขึ้น 2
                    const shuffled = [...opp.hand].sort(() => Math.random() - 0.5);
                    const targets = shuffled.slice(0, affectCount);
                    targets.forEach(c => {
                        c.costReducer = (c.costReducer || 0) - 2; // costReducer ลบ = cost เพิ่ม
                        log(`🔮 [Nostradamus] ${c.name} Cost +2 (ทำนายชะตา!)`, 'text-indigo-300');
                    });
                    log(`[Action] 🔮 Nostradamus ทำนาย! การ์ด ${affectCount} ใบในมือศัตรู Cost +2!`, 'text-indigo-400 font-bold');
                } else {
                    log(`[Fail] คู่ต่อสู้ไม่มีการ์ดในมือ`, 'text-gray-400');
                }
            }
            else if (card.name === 'Dynasty Collapse') {
                if (p.hand.length < 2) {
                    log(`[Action] Dynasty Collapse! อาณาจักรล่มสลาย!`, 'text-red-600 font-bold');
                    const opp = state.players[opponentKey];
                    opp.field.forEach(c => {
                        if (c.type === 'Character') c.hp = -99;
                    });
                    checkDeath(opponentKey);
                } else {
                    log(`[Fail] ต้องมีการ์ดในมือน้อยกว่า 2 ใบ`, 'text-red-400');
                }
            }
            else if (card.name === 'Kamikaze') {
                log(`[Action] Kamikaze! เลือกยูนิตของคุณเพื่อสละชีพ`, 'text-red-500 font-bold');
                // This requires target selection - handled by requiresTarget flag
            }

            p.graveyard.push(card);
        }

        function triggerAlbertEinsteinOngoingOnCardPlayed(playerKey) {
            const p = state.players[playerKey];
            if (!p) return;

            const einsteins = p.field.filter(c => {
                const effName = getEffectiveName(c);
                return effName === 'Albert Einstein' && getCharStats(c).hp > 0 && !c.silenced;
            });
            if (einsteins.length === 0) return;

            const friends = p.field.filter(fc => fc.type === 'Character' && getCharStats(fc).hp > 0);
            if (friends.length === 0) return;

            // Trigger 1 time per Einstein on field (stacking)
            einsteins.forEach(() => {
                const target = friends[Math.floor(Math.random() * friends.length)];
                if (!target) return;
                target.atk += 2;
                target.hp += 2;
                target.maxHp += 2;
                log(`[Albert Einstein] ทุกครั้งที่ใช้การ์ด → ${target.name} +2 ATK/+2 HP (ถาวร)`, 'text-sky-200 font-bold');
            });
        }

        
        function clearFieldEffects(fieldCard) {
            if (!fieldCard) return;
            log(`[Field] ${fieldCard.name} ถูกทับ/ทำลาย → เอฟเฟคหาย`, 'text-gray-400');
            // Field effects are automatically cleared when the field card is replaced
            // because they are checked via state.sharedFieldCard in various places
        }

