// ============================================================
// 05_play.js — playCard, getActualCost, resolveTargetedPlay
// ============================================================
function playCard(playerKey, cardId) {
            // Online P2: ถ้าการ์ดต้องเลือกเป้าหมาย → เปิด UI ก่อน อย่าส่ง P1 ทันที
            if ((gameMode === 'online' || gameMode === 'draft') && myRole === 'ai' && playerKey === 'ai') {
                const p2 = state.players['ai'];
                const p2CardIdx = p2.hand.findIndex(c => c.id === cardId);
                if (p2CardIdx !== -1 && p2.hand[p2CardIdx].requiresTarget) {
                    // fall through → เปิด targeting UI ฝั่ง P2 ก่อน
                } else {
                    sendOnlineAction({ type: 'playCard', cardId }); return;
                }
            }
            if (state.phase !== 'MAIN' || state.currentTurn !== playerKey || state.targeting.active) return;
            
            const p = state.players[playerKey];
            const cardIndex = p.hand.findIndex(c => c.id === cardId);
            if (cardIndex === -1) return;
            
            const card = p.hand[cardIndex];
            const costToPay = getActualCost(card, playerKey);

            if (p.cost < costToPay) return;
            if (card.type === 'Character' && p.field.length >= getMaxFieldSlots(playerKey)) return;

            // Colosseum: ถ้าฝั่งใดฝั่งหนึ่งมี Colosseum → ทั้งสองฝั่ง max 1 Character
            if (card.type === 'Character') {
                const oppKey = playerKey === 'player' ? 'ai' : 'player';
                const myHasCol = state.sharedFieldCard && state.sharedFieldCard.name === 'Colosseum';
                const oppHasCol = state.sharedFieldCard && state.sharedFieldCard.name === 'Colosseum';
                if (myHasCol || oppHasCol) {
                    const existingChars = p.field.filter(c => c.type === 'Character' && getCharStats(c).hp > 0);
                    if (existingChars.length >= 1) {
                        if (playerKey === 'player' || gameMode === 'local' || ((gameMode === 'online' || gameMode === 'draft') && myRole === 'ai' && playerKey === 'ai')) {
                            alert('⚔️ [Colosseum] ไม่สามารถลงการ์ดได้! ต้องรอให้ตัวละครในสนามตายก่อน');
                        }
                        return;
                    }
                }
            }

            if (card.type === 'Action' && state.actionPlayedThisTurn) {
                if (playerKey === 'player' || gameMode === 'local' || ((gameMode === 'online' || gameMode === 'draft') && myRole === 'ai' && playerKey === 'ai')) {
                    alert('⚠️ สามารถเล่น Action Card ได้เพียง 1 ใบต่อเทิร์นเท่านั้น!');
                }
                return;
            }

            if (card.requiresTarget) {
                let targetField = card.targetEnemy ? state.players[playerKey === 'player' ? 'ai' : 'player'].field : p.field;
                let validTargets = targetField.filter(c => getCharStats(c).hp > 0);

                // Evolve: ล็อกเป้าหมายเฉพาะร่างต้นบนสนามฝ่ายเรา
                if (card.evolveFrom) {
                    validTargets = p.field.filter(c => getEffectiveName(c) === card.evolveFrom && getCharStats(c).hp > 0);
                }

                if (card.name === 'Aether Core') validTargets = p.field.filter(c => c.name === 'Arthur Leywin');
                if (card.name === 'Dragon Sword Reid') validTargets = p.field.filter(c => c.name === 'Reinhard');
                if (card.name === 'Gungnir') validTargets = p.field.filter(c => c.name === 'Odin');
                if (card.name === 'Sword of Oni') validTargets = p.field.filter(c => {
                    const n = (c.name.startsWith('Shadow Token') || c.name.startsWith('Shadow army') || c.name.includes('Loki Clone')) ? c.originalName : c.name;
                    return n === 'Oni';
                });
                if (card.name === 'Trident') validTargets = p.field.filter(c => {
                    const n = (c.name.startsWith('Shadow Token') || c.name.startsWith('Shadow army') || c.name.includes('Loki Clone')) ? c.originalName : c.name;
                    return n === 'Poseidon';
                });
                if (card.name === 'Nature Realm Wand') validTargets = p.field.filter(c => {
                    const n = (c.name.startsWith('Shadow Token') || c.name.startsWith('Shadow army') || c.name.includes('Loki Clone')) ? c.originalName : c.name;
                    return n === 'Fairy';
                });
                if (card.name === 'Ruyi Jingu') validTargets = p.field.filter(c => {
                    const n = (c.name.startsWith('Shadow Token') || c.name.startsWith('Shadow army') || c.name.includes('Loki Clone')) ? c.originalName : c.name;
                    return n === 'Sun Wukong';
                });
                if (card.name === 'Excalibur') validTargets = p.field.filter(c => {
                    const n = (c.name.startsWith('Shadow Token') || c.name.startsWith('Shadow army') || c.name.includes('Loki Clone')) ? c.originalName : c.name;
                    return n === 'King Arthur';
                });
                if (card.name === 'The Arrow of Brahma') validTargets = p.field.filter(c => {
                    const n = (c.name.startsWith('Shadow Token') || c.name.startsWith('Shadow army') || c.name.includes('Loki Clone')) ? c.originalName : c.name;
                    return n === 'Rama' && getCharStats(c).hp > 0;
                });
                if (card.name === 'Spartan Shield') validTargets = p.field.filter(c => getEffectiveName(c) === 'Leonidas I' && getCharStats(c).hp > 0);
                if (card.name === 'Niten Ichi-ryū') validTargets = p.field.filter(c => getEffectiveName(c) === 'Miyamoto Musashi' && getCharStats(c).hp > 0);

                if (validTargets.length === 0) {
                    if (playerKey === 'player' || gameMode === 'local' || ((gameMode === 'online' || gameMode === 'draft') && myRole === 'ai' && playerKey === 'ai'))
                        alert(`ไม่มีเป้าหมายที่เหมาะสมสำหรับ ${card.name}!`);
                    return;
                }

                const isHumanTurn = gameMode === 'local' || playerKey === 'player' || ((gameMode === 'online' || gameMode === 'draft') && myRole === 'ai' && playerKey === 'ai');
                if (isHumanTurn) {
                    state.targeting = {
                        active: true,
                        sourceCardId: cardId,
                        validTargets: validTargets.map(c => c.id),
                        sourcePlayer: playerKey,
                        targetEnemy: card.targetEnemy || false
                    };
                    document.getElementById('targeting-overlay').style.display = 'block';
                    updateUI();
                    return;
                } else {
                    const target = validTargets[Math.floor(Math.random() * validTargets.length)];
                    resolveTargetedPlay('ai', cardId, target.id);
                    return;
                }
            }

            p.cost -= costToPay;
            p.hand.splice(cardIndex, 1);
            state.cardsPlayedThisTurn = (state.cardsPlayedThisTurn || 0) + 1;
            // Mozart: เล่นการ์ด +1 Note
            mozartAddNotes(playerKey, 1, 'เล่นการ์ด');
            // Track card played
            if (((gameMode === 'online' || gameMode === 'draft') && playerKey === myRole) || (gameMode !== 'online' && gameMode !== 'draft' && playerKey === 'player')) {
                trackCardPlayed(card.name);
            }
            if ((gameMode === 'online' || gameMode === 'draft') && myRole === 'player' && playerKey === 'ai') {
                sessionStatsP2.cardsPlayed[card.name] = (sessionStatsP2.cardsPlayed[card.name] || 0) + 1;
                sessionStatsP2.cardsPlayedTotal++;
            }

            if (card.type === 'Action') {
                state.actionPlayedThisTurn = true;
                log(`${playerKey.toUpperCase()} ใช้งาน ${card.name}!`, 'text-blue-300');
                executeNonTargetAction(card, playerKey);
            } else if (card.type === 'Spell') {
                // Spell: ใช้ได้ไม่จำกัดต่อเทิร์น (ไม่ติด Action limit) ใช้แล้วทิ้งสุสาน
                log(`✨ ${playerKey.toUpperCase()} ร่ายมนตร์ ${card.name}!`, 'text-indigo-300 font-bold');
                executeNonTargetAction(card, playerKey);
                p.graveyard.push(card);
            } else if (card.type === 'Item' && card.isConsumable) {
                // <-- เพิ่มบล็อกนี้: ส่งไปทำงานเหมือน Action แต่ไม่ติด Limit
                log(`${playerKey.toUpperCase()} ใช้งานไอเทม ${card.name}!`, 'text-purple-300');
                executeNonTargetAction(card, playerKey);

            } else if (card.type === 'Field') {
                log(`🌍 ${playerKey.toUpperCase()} เปิดใช้งาน Field: ${card.name}!`, 'text-amber-400 font-bold');
                // Reset costReducer for the new field card
                card.costReducer = 0;
                // Holy Grail ไม่สามารถถูกแทนที่ได้
                if (state.sharedFieldCard && state.sharedFieldCard.name === 'Holy Grail') {
                    log(`✨ [Holy Grail] จอกศักด์สิทธิ์ไม่สามารถถูกแทนที่ได้! กลับเข้ามือ`, 'text-yellow-400 font-bold');
                    // [FIX] คืน cost และการ์ดกลับมือก่อน return พร้อม updateUI
                    p.cost += costToPay;
                    p.hand.splice(cardIndex, 0, card);
                    state.cardsPlayedThisTurn = Math.max(0, (state.cardsPlayedThisTurn || 0) - 1);
                    updateUI();
                    return;
                }
                // Clear effects from old field card before replacing
                if (state.sharedFieldCard) {
                    clearFieldEffects(state.sharedFieldCard);
                    p.graveyard.push(state.sharedFieldCard);
                }
                state.sharedFieldCard = card;
                state.sharedFieldCardOwner = playerKey;
                // Holy Grail log
                if (card.name === 'Holy Grail') {
                    const charCount = p.graveyard.filter(c => c.type === 'Character').length;
                    const actualCost = Math.max(0, 300 - charCount * 30);
                    log(`✨ [Holy Grail] จอกศักด์สิทธิ์ปรากฏ! (Cost ปัจจุบัน: ${actualCost})`, 'text-yellow-300 font-bold');
                }
                if(card.name === 'Throne of the Kings') {
                    log(`[Effect] กฎของราชา: Item ทุกชิ้นบนสนามถูกระงับพลัง!`, 'text-amber-200');
                }
                if (card.name === 'Jura Tempest') {
                    log(`[Effect] Jura Tempest! Cost ทุกใบลดลง + Stat บัฟ!`, 'text-green-300');
                }
                if (card.name === 'Wild Kingdom') {
                    log(`[Effect] Wild Kingdom! ฝั่งเรา +3 ATK / +3 HP`, 'text-emerald-400 font-bold');
                }
                if (card.name === 'Lego Floor') {
                    // getCharStats คำนวณ -2 HP เป็น ongoing penalty — แค่ log แจ้งเฉยๆ
                    ['player','ai'].forEach(pk => {
                        state.players[pk].field.forEach(c => {
                            if (c.type === 'Character' && c.cost >= 4) {
                                log(`[Lego Floor] ${c.name} โดน Lego ลด HP -2!`, 'text-yellow-400 font-bold');
                            }
                        });
                    });
                }
                if (card.name === 'Chess Board') {
                    log(`[Chess Board] สนามของคุณขยายเป็น 6 ช่อง!`, 'text-amber-500 font-bold');
                }
                // === NEW HUMANITY FIELD CARDS ===
                else if (card.name === 'Colosseum') {
                    // Already handled by the shared field logic above
                    log(`[Colosseum] โคลอสเซียมเปิดแล้ว! Max 1 Character ต่อฝั่ง`, 'text-amber-500 font-bold');
                    // Enforce: ถ้ามีตัวละคร > 1 ตัว → คืนทุกตัวยกเว้นตัวแรกกลับมือ cost 0
                    ['player','ai'].forEach(pk => {
                        const pp = state.players[pk];
                        const chars = pp.field.filter(c => c.type === 'Character');
                        if (chars.length > 1) {
                            for (let ci = chars.length - 1; ci >= 1; ci--) {
                                const ret = chars[ci];
                                const fi = pp.field.findIndex(c => c.id === ret.id);
                                if (fi !== -1) {
                                    pp.field.splice(fi, 1);
                                    ret.costReducer = ret.cost;
                                    ret.attacksLeft = 0;
                                    pp.hand.push(ret);
                                    log(`[Colosseum] ${ret.name} คืนสู่มือ (Cost 0)`, 'text-amber-300');
                                }
                            }
                        }
                    });
                }
                else if (card.name === 'The Great Wall Of China') {
                    // Already handled by the shared field logic above
                    log(`[Great Wall] กำแพงเมืองจีนปกป้อง! ยูนิตทั้งหมด -20% ดาเมจ`, 'text-stone-500 font-bold');
                }
                else if (card.name === 'Statue of Liberty') {
                    // Already handled by the shared field logic above
                    p.statueOfLibertyUsed = false;
                    log(`[Liberty] เทพีเสรีภาพคุ้มครอง! ยูนิตรอดตาย 1 HP (1 ครั้ง/เทิร์น)`, 'text-cyan-500 font-bold');
                }
            } else {
                card.attacksLeft = card.maxAttacks || 1;
                p.field.push(card);
                log(`${playerKey.toUpperCase()} ลงการ์ด ${card.name} (Cost: ${costToPay})`, 'text-green-300');
                // [FIX] ครอบ try-catch เพื่อกัน triggerOnSummon throw → updateUI ไม่ถูกเรียก
                try { triggerOnSummon(card, playerKey); }
                catch(e) { console.error(`[triggerOnSummon] ${card.name}:`, e); }
            }
            
            // [FIX] แต่ละขั้นครอบ try-catch เพื่อให้ updateUI() ถูกเรียกเสมอ
            try { triggerAlbertEinsteinOngoingOnCardPlayed(playerKey); }
            catch(e) { console.error('[playCard] Einstein error:', e); }
            try { checkDeath('player'); checkDeath('ai'); }
            catch(e) { console.error('[playCard] checkDeath error:', e); }
            updateUI(); // ← ถูกเรียกเสมอ การ์ดแสดงผลแน่นอน
        }

        function resolveTargetedPlay(playerKey, sourceCardId, targetCharId) {
            // Online P2: ส่ง action ให้ host execute
            if ((gameMode === 'online' || gameMode === 'draft') && myRole === 'ai' && playerKey === 'ai') {
                sendOnlineAction({ type: 'resolveTarget', sourceCardId, targetCharId }); return;
            }
            if ((gameMode === 'online' || gameMode === 'draft') && myRole === 'player' && playerKey === 'ai') {
                const p2card = state.players.ai.hand.find(c => c.id === sourceCardId);
                if (p2card) {
                    sessionStatsP2.cardsPlayed[p2card.name] = (sessionStatsP2.cardsPlayed[p2card.name] || 0) + 1;
                    sessionStatsP2.cardsPlayedTotal++;
                }
            }
            const p = state.players[playerKey];
            const cardIndex = p.hand.findIndex(c => c.id === sourceCardId);
            if (cardIndex === -1) return;
            
            const card = p.hand[cardIndex];
            const costToPay = getActualCost(card, playerKey);
            
            const oppKey = playerKey === 'player' ? 'ai' : 'player';
            let targetChar;
            if (card.targetEnemy) {
                targetChar = state.players[oppKey].field.find(c => c.id === targetCharId);
            } else {
                targetChar = p.field.find(c => c.id === targetCharId);
            }

            if (!targetChar || (gameMode !== 'chaos' && p.cost < costToPay)) { cancelTargeting(); return; }

            // ตรวจ item เฉพาะ — ต้องใส่ถูกตัวเท่านั้น
            const _itemRestrict = {
                'Aether Core': 'Arthur Leywin',
                'Dragon Sword Reid': 'Reinhard',
                'Gungnir': 'Odin',
                'Ruyi Jingu': 'Sun Wukong',
                'Trident': 'Poseidon',
                'Sword of Oni': 'Oni',
                'Nature Realm Wand': 'Fairy',
                'The Arrow of Brahma': 'Rama',
                'Mjolnir': 'Thor',
                'Excalibur': 'King Arthur',
                'Spartan Shield': 'Leonidas I',
                'Niten Ichi-ryū': 'Miyamoto Musashi',
            };
            if (_itemRestrict[card.name]) {
                const requiredName = _itemRestrict[card.name];
                const targetEff = getEffectiveName(targetChar);
                if (targetEff !== requiredName) {
                    if (playerKey === 'player' || ((gameMode === 'online' || gameMode === 'draft') && myRole === 'ai' && playerKey === 'ai'))
                        alert(`${card.name} ใช้ได้กับ ${requiredName} เท่านั้น!`);
                    cancelTargeting();
                    return;
                }
            }

            p.cost -= costToPay;
            p.hand.splice(cardIndex, 1);
            state.cardsPlayedThisTurn = (state.cardsPlayedThisTurn || 0) + 1;
            // Mozart: เล่นการ์ด +1 Note
            mozartAddNotes(playerKey, 1, 'เล่นการ์ด');
            cancelTargeting();

        if (card.type === 'Action') state.actionPlayedThisTurn = true;

            // ── EVOLVE ──────────────────────────────────────────────────────
            if (card.evolveFrom) {
                // Overwrite the field card's stats with the evolved form
                const evolvedTemplate = CardSets[card._theme || 'mage']?.[card.name] || card;
                targetChar.name      = card.name;
                targetChar.atk       = card.atk;
                targetChar.hp        = card.maxHp;
                targetChar.maxHp     = card.maxHp;
                targetChar.text      = card.text;
                targetChar.color     = card.color;
                targetChar.art       = card.art || targetChar.art;
                targetChar.maxAttacks = card.maxAttacks || 1;
                targetChar.attacksLeft = card.maxAttacks || 1;
                targetChar.originalName = card.name;
                targetChar.status    = targetChar.status || [];
                targetChar.tempBuffs = targetChar.tempBuffs || [];
                // ส่งการ์ดจากมือลงสุสาน (ข้อมูลไปสิงร่างบนสนามแล้ว)
                p.graveyard.push(card);
                log(`🔥 ${playerKey.toUpperCase()} ${targetChar.name} วิวัฒนาการเป็นร่างใหม่!`, 'text-fuchsia-400 font-bold');
                triggerOnSummon(targetChar, playerKey);
                updateUI();
                if ((gameMode === 'online' || gameMode === 'draft') && myRole === 'player') pushStateToFirebase();
                return;
            }

            // ── TARGETED SPELL ───────────────────────────────────────────────
            if (card.type === 'Spell') {
                log(`✨ ${playerKey.toUpperCase()} ร่ายมนตร์ ${card.name} ใส่ ${targetChar.name}!`, 'text-indigo-300 font-bold');
                executeTargetedAction(card, playerKey, targetChar);
                p.graveyard.push(card);
                updateUI();
                if ((gameMode === 'online' || gameMode === 'draft') && myRole === 'player') pushStateToFirebase();
                return;
            }

            // 1. ถ้าเป็นไอเทมสวมใส่ (ไม่เป็น Consumable)
            if (card.type === 'Item' && !card.isConsumable) {
                targetChar.items.push(card);
                log(`[Item] สวมใส่ ${card.name} ให้ ${targetChar.name}!`, 'text-purple-300 font-bold');

                if (card.name === 'Escutcheon') {
                    targetChar.escutcheonTurns = 2;
                    log(`[Escutcheon] Untargetable 1 เทิร์น!`, 'text-gray-300');
                }

                // Exo Skeleton Suit: ถ้าใส่ให้ Soldier → สุ่มหยิบ Item จาก deck อีก 1 ใบ equip ให้ Soldier
                if (card.name === 'Exo Skeleton Suit') {
                    const targetEffName = (targetChar.name.startsWith('Shadow Token') || targetChar.name.startsWith('Shadow army') || targetChar.name.includes('Loki Clone')) ? targetChar.originalName : targetChar.name;
                    if (targetEffName === 'Soldier') {
                        const itemCards = p.deck.filter(c => c.type === 'Item');
                        if (itemCards.length > 0) {
                            const randItem = itemCards[Math.floor(Math.random() * itemCards.length)];
                            const deckIdx = p.deck.findIndex(c => c.id === randItem.id);
                            if (deckIdx !== -1) {
                                const newItem = p.deck.splice(deckIdx, 1)[0];
                                targetChar.items.push(newItem);
                                log(`🤖 [Exo Skeleton Suit] Soldier ได้รับ ${newItem.name} จากสำรับโดยอัตโนมัติ!`, 'text-cyan-400 font-bold');
                            }
                        } else {
                            log(`🤖 [Exo Skeleton Suit] ไม่มี Item ในสำรับ`, 'text-cyan-600');
                        }
                    }
                }

                if (card.name === "Genie's Lamp") {
                    card.wishCount = 0;
                    card.wishesGranted =[];
                    log(`🧞 [Genie's Lamp] ตะเกียงของจิ้น! ทิ้งการ์ดในมือ 5 ใบ...`, 'text-yellow-400 font-bold');
                    for (let i = 0; i < 5 && p.hand.length > 0; i++) {
                        const idx = Math.floor(Math.random() * p.hand.length);
                        const discarded = p.hand.splice(idx, 1)[0];
                        p.graveyard.push(discarded);
                        log(`🧞 ทิ้ง ${discarded.name}`, 'text-yellow-300');
                    }
                }

                if (card.name === 'The Arrow of Brahma') {
                    const ownerP = state.players[playerKey];
                    ownerP.hp = Math.max(1, ownerP.hp - 2);
                    log(`[The Arrow of Brahma] Base HP -2`, 'text-red-500 font-bold');
                    checkWinCondition();

                    const oppK = playerKey === 'player' ? 'ai' : 'player';
                    const oP = state.players[oppK];
                    if (oP.field.length > 0) {
                        const r = Math.floor(Math.random() * oP.field.length);
                        const vic = oP.field.splice(r, 1)[0];
                        oP.graveyard.push(vic);
                        log(`[Arrow of Brahma] Random destroy ${vic.name} on opponent field!`, 'text-green-500');
                        checkDeath(oppK);
                    }
                }

                if (card.name === 'BB Gun' && !isItemSuppressed()) {
                    log(`[BB Gun On Summon] ยิงสุ่ม 7 ครั้ง!`, 'text-gray-400');
                    const opp = state.players[playerKey === 'player' ? 'ai' : 'player'];
                    for (let i = 0; i < 7; i++) {
                        if (opp.field.length > 0) {
                            const randT = opp.field[Math.floor(Math.random() * opp.field.length)];
                            randT.hp -= 1;
                        }
                    }
                    checkDeath(playerKey === 'player' ? 'ai' : 'player');
                }
                if (card.name === 'Ring of Ainz Ooal Gown') {
                    log(`[Ring of Ainz Ooal Gown] สวมใส่ ${targetChar.name}! พร้อมปกป้อง (ทิ้งแหวนแทนเมื่อจะถูกทำลาย)`, 'text-purple-400');
                }
                if (card.name === 'Air Balloon') {
                    log(`[Air Balloon] พร้อมปกป้องตัวที่ใส่!`, 'text-sky-400');
                }
                if (card.name === 'Nerf Gun') {
                    log(`[Nerf Gun] +3 ATK ติดตั้งแล้ว`, 'text-orange-400');
                }
                if (card.name === 'B-2 Spirit') {
                    if (state.sharedFieldCard) {
                        p.graveyard.push(state.sharedFieldCard);
                        log(`✈️[B-2 Spirit] ทำลาย Field Card: ${state.sharedFieldCard.name}`, 'text-gray-400 font-bold');
                        state.sharedFieldCard = null;
                        state.sharedFieldCardOwner = null;
                        updateFieldZoneBackground(null);
                    }
                }
            } 
            // 2. ถ้าเป็นไอเทมใช้แล้วทิ้ง (Consumable) และต้องเล็งเป้า
            else if (card.type === 'Item' && card.isConsumable) {
                log(`[Item] ใช้งาน ${card.name} ใส่ ${targetChar.name}!`, 'text-purple-300 font-bold');

                // --- ใส่เอฟเฟกต์ของ Item แบบเล็งเป้าตรงนี้ ---
                // เช่น:
                // if (card.name === 'Health Potion') {
                //     targetChar.hp += 5;
                // }
                // ----------------------------------------

                p.graveyard.push(card); // ไอเทมใช้แล้วทิ้ง ลงสุสานทันที
            } 
            // 3. Action Card (แบบเดิม)
            else if (card.name === 'Teacher') {
                targetChar.atk *= 2;
                log(`[Action] Teacher สั่งสอน ${targetChar.name}! พลังโจมตีพื้นฐานเพิ่มเป็น ${targetChar.atk}!`, 'text-sky-300 font-bold');
                p.graveyard.push(card);
            } 
            else if (card.name === 'I Think I Can Make This in LEGO') {
                // Deep copy เพื่อให้ abilities ทำงานได้จริงผ่าน originalName
                const clone = JSON.parse(JSON.stringify(targetChar));
                clone.id = 'card_' + (cardIdCounter++);
                clone.name = `LEGO ${targetChar.originalName || targetChar.name}`;
                // originalName สำคัญมาก — ใช้ trigger abilities ใน triggerOnSummon/checkDeath/etc.
                clone.originalName = targetChar.originalName || targetChar.name;
                // Stat ครึ่งหนึ่ง
                clone.atk = Math.max(1, Math.floor((targetChar.atk || 0) / 2));
                clone.hp = Math.max(1, Math.floor((targetChar.maxHp || targetChar.hp || 1) / 2));
                clone.maxHp = clone.hp;
                clone.attacksLeft = clone.maxAttacks || 1;
                // reset สถานะ
                clone.status = [];
                clone.items = [];
                clone.silenced = false;
                clone.stolenText = '';
                clone.hasAsunaBuff = false;
                clone.hasRamBuff = false;
                clone.hasRemBuff = false;
                clone.costReducer = 0;
                clone.damageReduce = 0;
                clone.bleedTurns = 0;
                clone.burnTurns = 0;
                clone.paralyzeTurns = 0;
                clone.escutcheonTurns = 0;
                clone.queenImmortalTurns = 0;
                clone.immortalTurns = 0;
                clone.herculesExtraLives = 0;
                clone.natureWandUsed = false;
                clone.tossakanPermanentReduce = false;
                clone.tossakanImmune = false;
                clone.isSun = false;
                clone.clayBarrierTurns = 0;
                if (p.field.length < getMaxFieldSlots(playerKey)) {
                    p.field.push(clone);
                    log(`[LEGO] สร้าง LEGO ${clone.originalName} (Stat ครึ่งหนึ่ง + abilities ต้นฉบับ)!`, 'text-amber-400 font-bold');
                    triggerOnSummon(clone, playerKey);
                } else {
                    log(`สนามเต็ม ไม่สามารถสร้าง LEGO ได้`, 'text-red-500');
                }
                p.graveyard.push(card);
            } else if (card.name === 'Kamikaze') {
                // Kamikaze: destroy your unit to destroy enemy unit
                const yourUnit = p.field.find(c => c.id === targetCharId);
                if (yourUnit) {
                    // Find enemy target
                    const opp = state.players[oppKey];
                    if (opp.field.length > 0) {
                        const enemyTarget = opp.field[Math.floor(Math.random() * opp.field.length)];
                        // Destroy your unit
                        yourUnit.hp = -99;
                        checkDeath(playerKey);
                        // Destroy enemy unit
                        enemyTarget.hp = -99;
                        checkDeath(oppKey);
                        log(`[Kamikaze] ${yourUnit.name} พุ่งชน ${enemyTarget.name}! ทั้งคู่ถูกทำลาย!`, 'text-red-600 font-bold');
                    } else {
                        log(`[Fail] ไม่มียูนิตศัตรูบนสนาม`, 'text-red-400');
                    }
                }
                p.graveyard.push(card);
            } else if (card.name === 'Socrates') {
                // Socrates: Apply Paralyze to selected target
                if (targetChar) {
                    if (!targetChar.status.includes('Paralyze')) targetChar.status.push('Paralyze');
                    targetChar.paralyzeTurns = 2;
                    log(`[Socrates] ${targetChar.name} ถูกห้ามโจมตีเทิร์นหน้า!`, 'text-sky-300');
                }
                // Now summon Socrates to the field
                card.attacksLeft = card.maxAttacks || 1;
                card.socratesTargetApplied = true; // Flag to prevent double application in triggerOnSummon
                p.field.push(card);
                log(`${playerKey.toUpperCase()} ลงการ์ด ${card.name} (Cost: ${costToPay})`, 'text-green-300');
                // [FIX] ครอบ try-catch
                try { triggerOnSummon(card, playerKey); }
                catch(e) { console.error(`[resolveTarget/Socrates] triggerOnSummon error:`, e); }
            }

            // [FIX] ครอบ try-catch ทุก step เพื่อให้ updateUI() ถูกเรียกเสมอ
            try { triggerAlbertEinsteinOngoingOnCardPlayed(playerKey); }
            catch(e) { console.error('[resolveTarget] Einstein error:', e); }
            updateUI(); // ← ถูกเรียกเสมอ
        }

