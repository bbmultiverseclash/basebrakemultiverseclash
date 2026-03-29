// ============================================================
// 06_combat.js — initiateAttack, checkDeath (combat resolution)
// ============================================================
        function initiateAttack(attackerId, targetId, targetIsBase = false) {
            // Online P2: ส่ง action ให้ host execute
            if (gameMode === 'online' && myRole === 'ai') {
                sendOnlineAction({ type: 'attack', attackerId, targetId, targetIsBase }); return;
            }
            playSound('attack');
            if (gameMode === 'online') pushSoundEvent('attack');
            (function() {
                const atkEl = document.querySelector('#player-field .card[data-id="' + attackerId + '"], #ai-field .card[data-id="' + attackerId + '"]');
                const defEl = targetIsBase
                    ? document.getElementById(state.currentTurn === 'player' ? 'ai-base-ui' : 'player-base-ui')
                    : document.querySelector('#player-field .card[data-id="' + targetId + '"], #ai-field .card[data-id="' + targetId + '"]');
                if (atkEl && defEl) {
                    const ar = atkEl.getBoundingClientRect();
                    const dr = defEl.getBoundingClientRect();
                    const dx = dr.left + dr.width/2 - (ar.left + ar.width/2);
                    const dy = dr.top  + dr.height/2 - (ar.top  + ar.height/2);
                    atkEl.style.setProperty('--atk-dx', (dx * 0.65) + 'px');
                    atkEl.style.setProperty('--atk-dy', (dy * 0.65) + 'px');
                    atkEl.classList.add('attacking');
                    setTimeout(() => { atkEl.classList.remove('attacking'); atkEl.style.removeProperty('--atk-dx'); atkEl.style.removeProperty('--atk-dy'); }, 460);
                    setTimeout(() => { if (defEl) defEl.classList.add('hit-flash'); setTimeout(() => defEl.classList.remove('hit-flash'), 360); }, 200);
                }
            })();
            if (state.phase !== 'BATTLE') return;
            if (state.totalTurns === 1) {
                log("ไม่สามารถทำดาเมจได้ในเทิร์นแรกของเกม!", "text-red-400");
                state.selectedCardId = null; updateUI(); return;
            }

            const atkPlayer = state.players[state.currentTurn];
            const defPlayerKey = state.currentTurn === 'player' ? 'ai' : 'player';
            const defPlayer = state.players[defPlayerKey];

            const attacker = atkPlayer.field.find(c => c.id === attackerId);
            if (!attacker || attacker.attacksLeft <= 0 || getCharStats(attacker).hp <= 0) return;

            // Used by "On death" effects that need the killer (e.g. Achimedes)
            state.lastAttackContext = { attackerId, attackerPlayerKey: state.currentTurn };

            attacker.attacksLeft -= 1;
            const attackerStats = getCharStats(attacker);
            const attackerEffectiveName = (attacker.name.startsWith('Shadow Token') || attacker.name.startsWith('Shadow army') || attacker.name.includes('Loki Clone')) ? attacker.originalName : attacker.name;

            if (targetIsBase) {
                // เช็คว่ามีตัวบล็อกที่ "ไม่ได้ลอยอยู่" (ไม่มีสถานะ Levitate) หรือไม่
                const hasBlocker = defPlayer.field.some(c => getCharStats(c).hp > 0 && !c.status.includes('Levitate'));
                
                if (hasBlocker) {
                    if (state.currentTurn === 'player' || gameMode === 'local') log("ต้องจัดการ Character ศัตรู (ที่ไม่ได้ลอยอยู่) ก่อนโจมตี Base!", "text-red-400");
                    return;
                }
                defPlayer.hp -= 1;
                log(`${attacker.name} โจมตี Base! รับดาเมจ 1 หน่วย (เหลือ ${defPlayer.hp})`, "text-yellow-400");
                // Track damage to base — attacker is state.currentTurn
                trackDamageBase(1, gameMode === 'online' ? state.currentTurn : 'player');
                // Bayinnaung: ทุกครั้งที่โจมตี Base → ATK+HP x2 ถาวร
                if (attackerEffectiveName === 'Bayinnaung') {
                    attacker.atk *= 2;
                    attacker.hp *= 2;
                    attacker.maxHp *= 2;
                    log(`👑 [Bayinnaung] โจมตี Base! ATK/HP x2 ถาวร! (ตอนนี้ ${attacker.atk}/${attacker.hp})`, 'text-yellow-500 font-bold');
                }
                checkWinCondition();
            } else {
                let target = defPlayer.field.find(c => c.id === targetId);
                if (!target) return;

                const targetEffectiveName = (target.name.startsWith('Shadow Token') || target.name.startsWith('Shadow army') || target.name.includes('Loki Clone')) ? target.originalName : target.name;
                const isKingProtected = targetEffectiveName === 'King' && defPlayer.field.filter(c => getCharStats(c).hp > 0).length > 1;
                if (isKingProtected) {
                    if (state.currentTurn === 'player' || gameMode === 'local') log("King เป็นเป้าหมายสุดท้าย! ต้องฆ่าตัวอื่นก่อน", "text-amber-400");
                    attacker.attacksLeft += 1; 
                    state.selectedCardId = null; updateUI(); return;
                }

                if (target.name === 'Sinon' && defPlayer.field.length > 1) {
                    if (state.currentTurn === 'player' || gameMode === 'local') log("ไม่สามารถล็อคเป้า Sinon ได้เมื่อมีเพื่อนยืนอยู่!", "text-fuchsia-400");
                    attacker.attacksLeft += 1; 
                    state.selectedCardId = null; updateUI(); return;
                }

                // Simo Häyhä: Untargetable ถ้ามีตัวอื่นในสนามฝั่งศัตรู (defPlayer)
                if (targetEffectiveName === 'Simo Häyhä' && defPlayer.field.filter(c => getCharStats(c).hp > 0).length > 1) {
                    if (state.currentTurn === 'player' || gameMode === 'local') log("☃️ [Simo] ไม่สามารถโจมตี Simo Häyhä ได้ขณะมีตัวอื่นอยู่ในสนาม!", "text-green-400 font-bold");
                    attacker.attacksLeft += 1;
                    state.selectedCardId = null; updateUI(); return;
                }

              let actualTarget = target;
const defSlimes = defPlayer.field.filter(c => {
    const en = (c.name.startsWith('Shadow Token') || c.name.startsWith('Shadow army') || c.name.includes('Loki Clone')) ? c.originalName : c.name;
    return en === 'Slime' && getCharStats(c).hp > 0;
});
if (defSlimes.length > 0 && targetEffectiveName !== 'Slime') {
    actualTarget = defSlimes[0];
    log(`[Taunt] Slime บังตัวแทน!`, 'text-lime-400 font-bold');
}

                
    const symbolBlock = defPlayer.field.find(c => {
    const en = (c.name.startsWith('Shadow Token') || c.name.startsWith('Shadow army') || c.name.includes('Loki Clone')) ? c .originalName : c.name;
         return en === 'Symbol Block' && getCharStats(c).hp > 0;
 });
if (symbolBlock && actualTarget.id !== symbolBlock.id) {
    actualTarget = symbolBlock;
    log(`[Taunt] Symbol Block เป็นเป้าหมายแรก!`, 'text-blue-400');
}

    // Teak Taunt: ถ้ามี Phatchee อยู่ในสนาม
    const teakTaunt = defPlayer.field.find(c => {
        const en = (c.name.startsWith('Shadow army')) ? c.originalName : c.name;
        return en === 'Teak' && c.hasPhatcheeTaunt && getCharStats(c).hp > 0;
    });
    if (teakTaunt && actualTarget.id !== teakTaunt.id) {
        actualTarget = teakTaunt;
        log(`[Taunt] Teak ยืนหน้าปกป้อง Phatchee! 💪`, 'text-indigo-400 font-bold');
    }

                const actualTargetEffectiveName = (actualTarget.name.startsWith('Shadow Token') || actualTarget.name.startsWith('Shadow army') || actualTarget.name.includes('Loki Clone')) ? actualTarget.originalName : actualTarget.name;

                if (attackerEffectiveName === 'Hercules') {
                    if (atkPlayer.field.length > 1) {
                        log(`[Hercules] โจมตีไม่ได้! ต้องอยู่คนเดียวบนสนาม`, 'text-orange-400');
                        attacker.attacksLeft += 1;
                        state.selectedCardId = null;
                        updateUI();
                        return;
                    }
                }

                if (actualTarget.escutcheonTurns > 0) {
                    log(`[Escutcheon] ${actualTarget.name} ถูกป้องกันการโจมตี!`, 'text-gray-400');
                    attacker.attacksLeft += 1;
                    state.selectedCardId = null;
                    updateUI();
                    return;
                }

                // F-35: Untargetable ขณะมี F-35 equipped และมีเพื่อนในสนาม
                if (!isItemSuppressed() && actualTarget.items && actualTarget.items.some(i => i.name === 'F-35')) {
                    const friends = defPlayer.field.filter(c => c.id !== actualTarget.id && getCharStats(c).hp > 0);
                    if (friends.length > 0) {
                        log(`✈️ [F-35] ${actualTarget.name} ไม่สามารถถูกโจมตีได้! (Untargetable)`, 'text-sky-400 font-bold');
                        attacker.attacksLeft += 1;
                        state.selectedCardId = null;
                        updateUI();
                        return;
                    }
                }

                if (actualTargetEffectiveName === 'Ostrich' && Math.random() < 0.5) {
                    log(`[Effect] Ostrich Void! ยกเลิกการโจมตีจาก ${attacker.name} 🦤`, 'text-amber-400 font-bold');
                    state.selectedCardId = null;
                    updateUI();
                    return;
                }

                // Mozart: โจมตี +1 Note
                state.attacksMadeThisTurn = (state.attacksMadeThisTurn || 0) + 1;
                mozartAddNotes(state.currentTurn, 1, 'โจมตี');

                let dmg = attackerStats.atk;
                // Genie's Lamp: Double Damage wish
                if (attacker.genieDamageDouble) {
                    dmg *= 2;
                    log(`🧞 [Genie's Lamp] Double Damage!`, 'text-yellow-300');
                }
                const targetStats = getCharStats(actualTarget);
                const isTrueDmg = hasTrueDamage(attacker) || 
                                  (attackerEffectiveName === 'Elephant' && targetStats.hp < 7) ||
                                  attackerEffectiveName === 'Julius Caesar';

                if (attackerEffectiveName === 'Julius Caesar') {
                    log(`🗡️ [Caesar On Attack] True Damage!`, 'text-amber-300');
                }

                if (attackerEffectiveName === 'Basilisk' && atkPlayer.hp < 10) {
                    dmg *= 2;
                    log(`[Effect] Basilisk! ดาเมจ x2 (Base เรา <10)`, 'text-emerald-500 font-bold');
                }

                if (actualTargetEffectiveName === 'Blue Whale') {
                    dmg = Math.floor(dmg * 0.5);
                    log(`[Effect] Blue Whale ลดดาเมจ 50% → ${dmg}`, 'text-blue-400 font-bold');
                }

                if (attackerEffectiveName === 'Fenrir') {
                    dmg *= 4;
                    log(`[Fenrir] Damage x4!`, 'text-gray-400 font-bold');
                }

                if (attackerEffectiveName === 'Rhino' && targetStats.hp > 10) {
                    dmg *= 2;
                    log(`[Rhino] x2 Damage (Current HP >10)!`, 'text-gray-700 font-bold');
                }

                // Mike Tyson: dodge first attack each turn (works against ALL damage including True Damage)
                {
                    const tysonName = (actualTarget.name.startsWith('Shadow Token') || actualTarget.name.startsWith('Shadow army') || actualTarget.name.includes('Loki Clone')) ? actualTarget.originalName : actualTarget.name;
                    if (tysonName === 'Mike Tyson' && !actualTarget.tysonDodgedThisTurn && !actualTarget.silenced) {
                        actualTarget.tysonDodgedThisTurn = true;
                        log(`🥊 [Mike Tyson] หลบการโจมตีแรกในเทิร์นนี้! (รวม True Damage) 💨`, 'text-red-300 font-bold');
                        dmg = 0;
                    }
                }

                // นายจันทร์หนวดเขี้ยว / นายทองเหม็น: max 1 damage if partner on field
                {
                    const tName = (actualTarget.name.startsWith('Shadow Token') || actualTarget.name.startsWith('Shadow army') || actualTarget.name.includes('Loki Clone')) ? actualTarget.originalName : actualTarget.name;
                    if (tName === 'นายจันทร์หนวดเขี้ยว' && !actualTarget.silenced) {
                        const ownerKey = state.players.player.field.some(cc => cc.id === actualTarget.id) ? 'player' : 'ai';
                        if (state.players[ownerKey].field.some(cc => (cc.originalName || cc.name) === 'นายทองเหม็น' && cc.id !== actualTarget.id && getCharStats(cc).hp > 0)) {
                            if (dmg > 1) { dmg = 1; log(`🛡️ [นายจันทร์หนวดเขี้ยว] มี นายทองเหม็น อยู่! โดนดาเมจสูงสุด 1!`, 'text-amber-300 font-bold'); }
                        }
                    }
                    if (tName === 'นายทองเหม็น' && !actualTarget.silenced) {
                        const ownerKey = state.players.player.field.some(cc => cc.id === actualTarget.id) ? 'player' : 'ai';
                        if (state.players[ownerKey].field.some(cc => (cc.originalName || cc.name) === 'นายจันทร์หนวดเขี้ยว' && cc.id !== actualTarget.id && getCharStats(cc).hp > 0)) {
                            if (dmg > 1) { dmg = 1; log(`🛡️ [นายทองเหม็น] มี นายจันทร์หนวดเขี้ยว อยู่! โดนดาเมจสูงสุด 1!`, 'text-amber-300 font-bold'); }
                        }
                    }
                }

                if (!isTrueDmg) {
                    if (actualTarget.name === 'Kazuma Satou' && Math.random() < 0.6) {
                        log(`[Evade] Kazuma หลบได้! 💨`, 'text-amber-400 font-bold');
                        dmg = 0;
                    }
                    if (targetStats.hasEvade && Math.random() < 0.5) {
                        log(`[Evade] 💨 ${actualTarget.name} เคลื่อนไหวพริบตา! หลบการโจมตีได้!`, 'text-purple-300 font-bold');
                        dmg = 0;
                    }
                    // Tesla: 99% evade 2 turns
                    if (actualTargetEffectiveName === 'Nikola Tesla' && (actualTarget.teslaEvadeTurns || 0) > 0 && Math.random() < 0.99) {
                        log(`⚡ [Tesla Evade] Tesla หลบได้! (${actualTarget.teslaEvadeTurns} เทิร์น)`, 'text-blue-300 font-bold');
                        dmg = 0;
                    }
                    // King Cobra: 30% evade
                    if (actualTargetEffectiveName === 'King Cobra' && Math.random() < 0.3) {
                        log(`🐍 [King Cobra Evade] King Cobra หลบได้! 💨`, 'text-green-400 font-bold');
                        dmg = 0;
                    }
                    if (actualTarget.items.some(i => i.name === 'Trident') && Math.random() < 0.3) {
                        log(`[Trident Evade] ${actualTarget.name} หลบได้! 🌊`, 'text-blue-300');
                        dmg = 0;
                    }
                    if (attacker.items.some(i => i.name === 'Bee Eye Glass') && Math.random() < 0.5) {
                        log(`👁️‍🗨️ [Bee Eye Glass] ${attacker.name} ตีพลาด!`, 'text-amber-400 font-bold');
                        dmg = 0;
                    }

                    if ((actualTargetEffectiveName === 'Majorette' || actualTargetEffectiveName === 'Hot Wheel') && Math.random() < 0.6) {
                        const pairName = actualTargetEffectiveName === 'Majorette' ? 'Hot Wheel' : 'Majorette';
                        const hasPair = defPlayer.field.some(cc => {
                            const nn = (cc.name.startsWith('Shadow Token') || cc.name.startsWith('Shadow army') || cc.name.includes('Loki Clone')) ? cc.originalName : cc.name;
                            return nn === pairName && getCharStats(cc).hp > 0;
                        });
                        if (hasPair) {
                            log(`[Evade 60%] ${actualTarget.name} หลบได้เพราะคู่กัน!`, 'text-pink-300 font-bold');
                            dmg = 0;
                        }
                    }
                }

                dmg = Math.max(0, dmg - targetStats.damageReduce);
                // Genie's Lamp: 30% Damage Reduction wish
                if (actualTarget.genieReduction) {
                    dmg = Math.floor(dmg * 0.7);
                    log(`🧞 [Genie's Lamp] 30% Damage Reduction!`, 'text-yellow-300');
                }
                // The Great Wall Of China: 20% damage reduction
                if (state.sharedFieldCard && state.sharedFieldCard.name === 'The Great Wall Of China') {
                    dmg = Math.floor(dmg * 0.8);
                    log(`[Great Wall] ลดดาเมจ 20%!`, 'text-stone-400');
                }
                dmg = Math.floor(dmg * (targetStats.damageMultiplier || 1));

                if (attackerEffectiveName === 'Salt water crocodile') {
                    if (targetStats.hp > 8) {
                        dmg += 2;
                        log(`[Effect] Salt water crocodile +2 ดาเมจ (เป้า HP >8)!`, 'text-emerald-300');
                    }
                }

                if (actualTargetEffectiveName === 'Giraffe' && attackerStats.atk < 5) {
                    dmg = 0;
                    log(`[Effect] Giraffe Instinct! ดาเมจจาก ${attacker.name} ถูกทำให้เป็น 0 (ATK <5) 🦒`, 'text-yellow-400 font-bold');
                }

                // Alexander the great: On attack wish (1 in 3)
                let alexWish = null;
                if (attackerEffectiveName === 'Alexander the great') {
                    const roll = Math.floor(Math.random() * 3);
                    if (roll === 0) {
                        dmg = 999;
                        log(`👑 [Alexander] Wish 1: instant kill!`, 'text-red-300 font-bold');
                    } else if (roll === 1) {
                        dmg *= 2;
                        log(`👑 [Alexander] Wish 2: double damage!`, 'text-red-200 font-bold');
                    } else {
                        alexWish = 'splash';
                        log(`👑 [Alexander] Wish 3: splash 3 to 2 other units!`, 'text-red-400 font-bold');
                    }
                }

                if (attackerEffectiveName === 'Shiva') {
                    dmg = 999;
                    log(`[Shiva] Infinity Strike! หนึ่งทีตาย!`, 'text-red-600 font-bold');
                }

                if (!targetIsBase && dmg > 0 && defPlayer.apotheosisTurns > 0 && Math.random() < 0.3) {
                    dmg = 0;
                    log(`[Apotheosis] ${actualTarget.name} หลบได้! (30% Evade)`, 'text-amber-300');
                }

                if (dmg > 0) {
                    if (actualTarget.name === 'Maple' && defPlayer.field.length === 1) {
                        dmg = Math.ceil(dmg * 0.3333); 
                        log(`[Effect] Maple ต้านทาน! ลดดาเมจเหลือ ${dmg}`, 'text-pink-300');
                    }

                    log(`⚔️ ${attacker.name} โจมตี ${actualTarget.name} ด้วยดาเมจ ${dmg} ${isTrueDmg ? '(True Damage)' : ''}`, "text-orange-300");
                    actualTarget.hp -= dmg;
                    // Track char damage — attacker is state.currentTurn
                    trackDamageChar(dmg, gameMode === 'online' ? state.currentTurn : 'player');

                    // Cavalry: 50% chance to splash 3 dmg to another enemy
                    if (attackerEffectiveName === 'Cavalry' && Math.random() < 0.5) {
                        const otherTargets = defPlayer.field.filter(c => c.id !== actualTarget.id && getCharStats(c).hp > 0);
                        if (otherTargets.length > 0) {
                            const splashTarget = otherTargets[Math.floor(Math.random() * otherTargets.length)];
                            splashTarget.hp -= 3;
                            log(`🐎 [Cavalry] Splash 3 dmg → ${splashTarget.name}!`, 'text-amber-400 font-bold');
                        }
                    }

                    // Tank: Splash 3 dmg to another card
                    if (attackerEffectiveName === 'Tank') {
                        const otherTargets = defPlayer.field.filter(c => c.id !== actualTarget.id && getCharStats(c).hp > 0);
                        if (otherTargets.length > 0) {
                            const splashTarget = otherTargets[Math.floor(Math.random() * otherTargets.length)];
                            splashTarget.hp -= 3;
                            log(`🚂 [Tank] Splash 3 dmg → ${splashTarget.name}!`, 'text-zinc-400 font-bold');
                        }
                    }

                    // Zweihander: 50% chance to poison for 2 turns
                    const hasZweihander = attacker.items && attacker.items.some(item => item.name === 'Zweihander');
                    if (hasZweihander && Math.random() < 0.5) {
                        if (!actualTarget.status.includes('Poison')) actualTarget.status.push('Poison');
                        log(`⚔️ [Zweihander] ${actualTarget.name} ได้รับ Poison 2 เทิร์น!`, 'text-purple-400 font-bold');
                    }

                    // Alexander splash: additional 3 damage to 2 other enemy units
                    if (alexWish === 'splash') {
                        const splashPool = defPlayer.field.filter(c => c.id !== actualTarget.id && getCharStats(c).hp > 0);
                        const chosen = [...splashPool].sort(() => Math.random() - 0.5).slice(0, 2);
                        chosen.forEach(t => {
                            t.hp -= 3;
                            log(`[Alexander] Splash -3 HP → ${t.name}`, 'text-red-300 font-bold');
                            if (getCharStats(t).hp <= 0 && !isItemSuppressed()) {
                                const balloonIndex = t.items.findIndex(i => i.name === 'Air Balloon');
                                if (balloonIndex !== -1) {
                                    const balloon = t.items.splice(balloonIndex, 1)[0];
                                    defPlayer.graveyard.push(balloon);
                                    t.hp = 1;
                                    log(`[Air Balloon] ระเบิดแทน! ${t.name} รอดตาย`, 'text-sky-400 font-bold');
                                }
                            }
                        });
                    }

                    // Musashi: ถ้าโดนดาเมจจนเหลือ HP 1 (และยังมีชีวิต) → +4 ATK ถาวร แต่จะตายเทิร์นถัดไป
                    const musActualName = (actualTarget.name.startsWith('Shadow Token') || actualTarget.name.startsWith('Shadow army') || actualTarget.name.includes('Loki Clone')) ? actualTarget.originalName : actualTarget.name;
                    if (musActualName === 'Miyamoto Musashi' && getCharStats(actualTarget).hp <= 0 && !actualTarget.musashiDied) {
                        // Musashi triggered: survive at HP=1, +4 ATK, die next turn
                        actualTarget.hp = 1;
                        actualTarget.atk += 4;
                        actualTarget.musashiDieNextTurn = true;
                        actualTarget.musashiDied = true; // prevent retriggering
                        log(`⚔️ [Musashi] ถูกโจมตีจนเหลือ 1 HP! +4 ATK ถาวร แต่จะตายเทิร์นถัดไป!`, 'text-stone-400 font-bold');
                    }
                    // Statue of Liberty: survive with 1 HP (once per turn)
                    else if (state.sharedFieldCard && state.sharedFieldCard.name === 'Statue of Liberty' && state.sharedFieldCardOwner === defPlayerKey && getCharStats(actualTarget).hp <= 0 && !defPlayer.statueOfLibertyUsed) {
                        actualTarget.hp = 1;
                        defPlayer.statueOfLibertyUsed = true;
                        log(`🗽 [Statue of Liberty] ${actualTarget.name} รอดตายด้วย 1 HP!`, 'text-cyan-400 font-bold');
                    }

                    if (dmg > 0) {
                        const hasFairy = defPlayer.field.some(fc => {
                            const n = (fc.name.startsWith('Shadow Token') || fc.name.startsWith('Shadow army') || fc.name.includes('Loki Clone')) ? (fc.originalName || fc.name) : fc.name;
                            return n === 'Fairy' && getCharStats(fc).hp > 0 && !fc.silenced;
                        });
                        if (hasFairy) {
                            const heal = 3;
                            actualTarget.hp += heal;
                            const maxNow = getCharStats(actualTarget).maxHp;
                            if (actualTarget.hp > maxNow) actualTarget.hp = maxNow;
                            log(`[Fairy Ongoing] ${actualTarget.name} รับดาเมจ → +3 HP`, 'text-pink-200');
                        }
                    }

                    if (actualTarget.items && actualTarget.items.some(i => i.name === 'Spartan Shield') && !actualTarget.spartanShieldUsedThisTurn) {
                        actualTarget.spartanShieldUsedThisTurn = true;
                        actualTarget.hp = Math.min(getCharStats(actualTarget).maxHp, actualTarget.hp + 5);
                        log(`🛡️ [Spartan Shield] Leonidas I ฮีล 5 HP เมื่อโดนโจมตี!`, 'text-amber-400 font-bold');
                    }

                    if (actualTargetEffectiveName === 'Celestia Yupitalia') {
                        if (!attacker.tossakanImmune && !hasNatureImmune(atkPlayer === state.players.player ? 'player' : 'ai')) {
                            attacker.status.push('Burn');
                            attacker.burnTurns = 3;
                            log(`[Effect] Celestia Yupitalia ทำให้ ${attacker.name} ถูก Burn 3 เทิร์น! 🔥`, 'text-indigo-400 font-bold');
                        }
                    }
                    if (attackerEffectiveName === 'Celestia Yupitalia') {
                        if (!actualTarget.tossakanImmune && !hasNatureImmune(defPlayerKey)) {
                            actualTarget.status.push('Burn');
                            actualTarget.burnTurns = 3;
                            log(`[Effect] Celestia Yupitalia ทำให้ ${actualTarget.name} ถูก Burn 3 เทิร์น! 🔥`, 'text-indigo-400 font-bold');
                        }
                    }

                    if (attackerEffectiveName === 'Ainz Ooal Gown') {
                        const randomStatus = StatusEffects[Math.floor(Math.random() * StatusEffects.length)];
                        if (!actualTarget.status.includes(randomStatus) && !actualTarget.tossakanImmune && !hasNatureImmune(defPlayerKey)) {
                            actualTarget.status.push(randomStatus);
                            log(`[Effect] มอบสถานะ: ${StatusIcons[randomStatus]}${randomStatus}!`, 'text-purple-300');
                        }
                    }
                    // Mike Tyson: 50% chance to instantly kill on attack
                    if (attackerEffectiveName === 'Mike Tyson' && getCharStats(actualTarget).hp > 0 && Math.random() < 0.5) {
                        actualTarget.hp = -99;
                        log(`🥊 [Mike Tyson] KNOCKOUT! ${actualTarget.name} ถูกน็อคตายทันที! (50%)`, 'text-red-500 font-bold');
                    }
                    // Schrödinger: 50% instant kill หรือ heal ศัตรูเต็ม
                    if (attackerEffectiveName === 'Schrödinger') {
                        if (getCharStats(actualTarget).hp > 0) {
                            if (Math.random() < 0.5) {
                                actualTarget.hp = -99;
                                log(`⚛️ [Schrödinger] Collapse! ${actualTarget.name} ตายทันที (50%)`, 'text-indigo-300 font-bold');
                            } else {
                                const maxNow = getCharStats(actualTarget).maxHp;
                                actualTarget.hp = maxNow;
                                log(`⚛️ [Schrödinger] Heal! ${actualTarget.name} กลับเต็ม HP (${maxNow})`, 'text-indigo-200 font-bold');
                            }
                        } else {
                            log(`⚛️ [Schrödinger] ไม่มีเป้าหมายศัตรูที่มีชีวิตให้ทำงาน`, 'text-indigo-200 font-bold');
                        }
                    }
                    // Jack the Ripper: ถ้าฆ่าตัวที่มี On Death → ปิด On Death
                    if (attackerEffectiveName === 'Jack the Ripper' && getCharStats(actualTarget).hp <= 0) {
                        actualTarget.jackSuppressed = true;
                        log(`🔪 [Jack the Ripper] ปิด On Death effect ของ ${actualTarget.name}!`, 'text-gray-400 font-bold');
                    }
                    if (attackerEffectiveName === 'Tanya Degurechaff') {
                        log(`[Effect] Tanya Splash 2 ดาเมจใส่ตัวอื่น!`, 'text-orange-400');
                        defPlayer.field.forEach(c => { 
                            if (c.id !== target.id) c.hp -= 2; 
                        });
                    }

                    if (attackerEffectiveName === 'Elephant' && targetStats.hp < 7 && dmg > 0) {
                        log(`[Effect] Elephant Stampede! True Damage ⚔️`, 'text-gray-500 font-bold');
                    }

                    if (attackerEffectiveName === 'Poseidon') {
                        drawCard(state.currentTurn, 1);
                        log(`[Poseidon] On attack: จั่ว 1 ใบ`, 'text-blue-300');
                    }

                    if (!attacker.silenced && attackerEffectiveName === 'Zeus' && dmg > 0) {
                        if (!actualTarget.status.includes('Paralyze') && !actualTarget.tossakanImmune && !hasNatureImmune(defPlayerKey)) {
                            actualTarget.status.push('Paralyze'); actualTarget.paralyzeTurns = 2;
                            log(`[Zeus] Paralyze ${actualTarget.name} 1 เทิร์น! ⚡`, 'text-yellow-300');
                        }
                        defPlayer.field.forEach(other => {
                            if (other.id !== actualTarget.id && getCharStats(other).hp > 0) {
                                other.hp -= 2;
                                log(`[Zeus Splash] ${other.name} รับ 2 ดาเมจ`, 'text-yellow-400');
                            }
                        });
                    }

                    if (getCharStats(actualTarget).hp <= 0) {
                        // Ring of Ainz — ตรวจว่า item ไม่ถูก suppress
                        if (!isItemSuppressed()) {
                            const ringIndex = actualTarget.items.findIndex(i => i.name === 'Ring of Ainz Ooal Gown');
                            if (ringIndex !== -1) {
                                const ring = actualTarget.items.splice(ringIndex, 1)[0];
                                defPlayer.graveyard.push(ring);
                                actualTarget.hp = 1;
                                log(`[Ring of Ainz Ooal Gown] ทิ้งแหวนแทน! ${actualTarget.name} รอดตาย (HP เหลือ 1)`, 'text-purple-500 font-bold');
                            }
                        }
                    }

                    if (attacker.name === 'Sung Jin-Woo' && getCharStats(actualTarget).hp <= 0 && actualTarget.type === 'Character') {
                        log("Arise.", 'text-slate-300 font-bold');
                        // สร้าง Shadow army ใหม่ล้วนๆ — stat = ต้นฉบับ +1/+1, ไม่มี ability
                        const killedName = actualTarget.originalName || actualTarget.name;
                        const shadowAtk = (actualTarget.atk || 0) + 1;
                        const shadowHp  = (actualTarget.maxHp || actualTarget.hp || 1) + 1;
                        const shadow = {
                            id: 'card_' + (cardIdCounter++),
                            name: `Shadow army (${killedName}) ${shadowAtk}/${shadowHp}`,
                            originalName: 'Shadow army',   // ← ไม่ใช่ชื่อต้นฉบับ = ระบบจะไม่ trigger ability ใดๆ
                            type: 'Character',
                            cost: 0,
                            atk: shadowAtk,
                            hp: shadowHp,
                            maxHp: shadowHp,
                            text: `Shadow of ${killedName}`,
                            color: 'bg-gray-950',
                            maxAttacks: 1,
                            attacksLeft: 1,
                            requiresTarget: false,
                            targetEnemy: false,
                            art: '',
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
                            clayBarrierTurns: 0,
                            tempBuffs: []
                        };

                        if (atkPlayer.field.length < getMaxFieldSlots(state.currentTurn)) {
                            atkPlayer.field.push(shadow);
                            log(`Shadow army (${killedName}) ${shadowAtk}/${shadowHp} ถูกอัญเชิญ!`, 'text-slate-400');
                            // ไม่ trigger OnSummon — Shadow army ไม่มี ability
                        } else {
                            log(`[Fail] สนามเต็ม ไม่สามารถอัญเชิญ Shadow army ได้`, 'text-red-500');
                        }
                    }
                    if (getCharStats(actualTarget).hp <= 0) {
                        if (attackerEffectiveName === 'Fran') {
                            attacker.atk *= 2;
                            log(`[Effect] 🗡️ Fran สังหารเป้าหมาย! พลังโจมตีพื้นฐานทวีคูณเป็น ${attacker.atk}!`, 'text-stone-300 font-bold');
                        }

                        // โลจิก Messi (ใส่ตรงนี้รับรองผล 100%)
                        if (attackerEffectiveName === 'Messi') {
                            if (typeof attacker.messiKillCount !== 'number') attacker.messiKillCount = 0;
                            attacker.messiKillCount += 1;
                            attacker.attacksLeft += 1; // คืนสิทธิ์การโจมตีให้ 1 ครั้ง
                            log(`⚽ [Messi] ทะลวงช่องว่าง! ฆ่าสำเร็จ (${attacker.messiKillCount}/3) → ได้สิทธิ์โจมตีต่อทันที!`, 'text-green-300 font-bold');
                            
                            if (attacker.messiKillCount >= 3) {
                                attacker.messiKillCount = 0; // reset เพื่อวนลูปใหม่
                                if (!attacker.messiDamageDoubled) {
                                    attacker.messiDamageDoubled = true;
                                    attacker.atk *= 2;
                                    log(`⚽ [Messi] Hattrick! ฆ่าครบ 3 ตัว! พลังโจมตี x2 ถาวร!`, 'text-green-400 font-bold');
                                } else {
                                    log(`⚽ [Messi] Hattrick อีกครั้ง!`, 'text-green-300 font-bold');
                                }
                            }
                        }

                        if (attackerEffectiveName === 'Rimuru Tempest') {
                            log(`[Effect] Rimuru กลืนกิน ${actualTarget.name} และสร้าง Slime 2/2!`, 'text-blue-300');
                            const slime = createCardInstance('Slime', 'isekai_adventure');
                            slime.attacksLeft = 1;
                            if (atkPlayer.field.length < getMaxFieldSlots(state.currentTurn)) {
                                atkPlayer.field.push(slime);
                                log(`Slime 2/2 (Taunt) ถูกอัญเชิญ!`, 'text-lime-400');
                            } else {
                                log(`[Fail] สนามเต็ม ไม่สามารถสร้าง Slime ได้`, 'text-red-500');
                            }
                        }

                        if (attackerEffectiveName === 'Sun Wukong') {
                            const atkOwnerKey = state.currentTurn;
                            state.players[atkOwnerKey].hp += 1;
                            attacker.hp = attacker.maxHp;
                            log(`[Kill] Sun Wukong สังหารเป้าหมาย! Base HP +1 | HP กลับสู่ ${attacker.maxHp}`, 'text-orange-400 font-bold');
                            checkWinCondition();
                        }
                        
                        // Medal of Promotion: Double stats on kill by normal attack
                        const hasMedal = attacker.items && attacker.items.some(item => item.name === 'Medal of Promotion');
                        if (hasMedal) {
                            attacker.atk *= 2;
                            attacker.maxHp *= 2;
                            attacker.hp *= 2;
                            log(`🏅 [Medal of Promotion] ${attacker.name} สถานะ x2!`, 'text-yellow-500 font-bold');
                        }
                    }

                    if (attacker.items.some(i => i.name === 'Bloody Fang') && dmg > 0) {
                        attacker.hp += dmg;
                        const max = getCharStats(attacker).maxHp;
                        if (attacker.hp > max) attacker.hp = max;
                        log(`[Bloody Fang] Heal ${dmg} ให้ ${attacker.name}!`, 'text-red-300');
                    }

                    if (attacker.items.some(i => i.name === 'Excalibur') && !targetIsBase) {
                        log(`[Excalibur] You are worthy young king! ⚔️ Splash ทุกตัว`, 'text-yellow-400');
                        const splashDmg = Math.floor(dmg / Math.max(1, defPlayer.field.length));
                        defPlayer.field.forEach(c => {
                            if (c.id !== targetId) c.hp -= splashDmg;
                        });
                    }

                    if (attackerEffectiveName === 'Odin' && attacker.items.some(i => i.name === 'Gungnir') && dmg > 0) {
                        const heal = Math.floor(dmg / 2);
                        attacker.hp += heal;
                        const maxHpNow = getCharStats(attacker).maxHp;
                        if (attacker.hp > maxHpNow) attacker.hp = maxHpNow;
                        log(`[Gungnir] Odin Heal +${heal} HP!`, 'text-blue-300');
                    }

                    if (attackerEffectiveName === 'Rook') {
                        log(`[Rook] Splash 2 ดาเมจใส่ทุกตัว!`, 'text-gray-300');
                        defPlayer.field.forEach(c => {
                            if (c.id !== actualTarget.id && getCharStats(c).hp > 0) {
                                c.hp -= 2;
                            }
                        });
                    }

                    if (attacker.items.some(i => i.name === 'Nerf Gun') && getCharStats(actualTarget).hp > 0) {
                        const extra = Math.floor(Math.random() * 5) + 1;
                        actualTarget.hp -= extra;
                        log(`[Nerf Gun] Extra dmg +${extra}!`, 'text-orange-300');
                    }
                }

                const onAttackBleed = {
                    'Bullet Ant': 3,
                    'Komodo Dragon': 2,
                    'Great White Shark': 3,
                    'Scorpion': 3,
                    'Mosquito': 2,
                    'King Cobra': 999  // ถาวร (999 = จนตาย)
                };
                if (onAttackBleed[attackerEffectiveName]) {
                    const turns = onAttackBleed[attackerEffectiveName];
                    if (!actualTarget.status.includes('Bleed') && !actualTarget.tossakanImmune && !hasNatureImmune(defPlayerKey)) {
                        actualTarget.status.push('Bleed');
                        actualTarget.shalltearBleedTurns = turns;
                        if (attackerEffectiveName === 'King Cobra') {
                            log(`[Effect] King Cobra ทำให้ ${actualTarget.name} ติด Bleed ถาวรจนตาย 🩸☠️`, 'text-red-600 font-bold');
                        } else {
                            log(`[Effect] ${attackerEffectiveName} ทำให้ ${actualTarget.name} ติด Bleed ${turns} เทิร์น 🩸`, 'text-red-500 font-bold');
                        }
                    }
                }

                if (!actualTarget.silenced && actualTargetEffectiveName === 'Porcupine' && dmg > 0) {
                    const counter = attackerStats.atk * 2;
                    attacker.hp -= counter;
                    log(`[Counter] Porcupine สวนกลับ ${counter} ดาเมจ!`, 'text-lime-400 font-bold');
                }

                if (!attacker.silenced && attackerEffectiveName === 'Anaconda' && getCharStats(actualTarget).hp > 0) {
                    attacker.hp -= 3;
                    actualTarget.hp = -99;
                    log(`[Effect] Anaconda เสียสละ 3 HP เพื่อฆ่า ${actualTarget.name} ทันที!`, 'text-emerald-500 font-bold');
                }

                if (actualTargetEffectiveName === 'Tossakan') {
                    log(`ปากแปดว่าเราเลี้ยงท่าน ก็ประมาณหมายใจให้เป็นผล ตัวเราชั่วเองจึ่งเสียชนม์...`, 'text-emerald-500 font-bold');
                }

                if (dmg > 0) {
                    if (actualTarget.poseidonReduceTurn > 0) {
                        actualTarget.poseidonReduceTurn = 0;
                        log(`[Poseidon] Reduction ถูกใช้ในเทิร์นที่ถูกตี`, 'text-blue-300');
                    }
                }

                if (actualTargetEffectiveName === 'Jack in the Box' && dmg > 0) {
                    attacker.status.push('Freeze'); attacker.freezeTurns = 2;
                    log(`[Jack in the Box Death] ทำให้ ${attacker.name} Freeze 1 เทิร์น!`, 'text-purple-400 font-bold');
                }

                if (getCharStats(actualTarget).hp <= 0 && !isItemSuppressed()) {
                    const balloonIndex = actualTarget.items.findIndex(i => i.name === 'Air Balloon');
                    if (balloonIndex !== -1) {
                        const balloon = actualTarget.items.splice(balloonIndex, 1)[0];
                        defPlayer.graveyard.push(balloon);
                        actualTarget.hp = 1;
                        log(`[Air Balloon] ระเบิดแทน! ${actualTarget.name} รอดตาย`, 'text-sky-400 font-bold');
                    }
                }

                // Charles Darwin Ongoing: if Darwin attacks and target survives -> +2 HP to 2 allies (permanent)
                if (attackerEffectiveName === 'Charles Darwin' && !targetIsBase && !attacker.silenced && getCharStats(actualTarget).hp > 0) {
                    const candidates = atkPlayer.field.filter(cc => cc.type === 'Character' && getCharStats(cc).hp > 0);
                    const chosen = [...candidates].sort(() => Math.random() - 0.5).slice(0, 2);
                    chosen.forEach(t => {
                        t.hp += 2;
                        t.maxHp += 2;
                        log(`🧬 [Darwin Ongoing] ${t.name} +2 HP (ถาวร)`, 'text-green-200 font-bold');
                    });
                }
            }

            // Shiva: "Kill then die" after an attack that dealt damage
            if (attackerEffectiveName === 'Shiva' && dmg > 0 && getCharStats(attacker).hp > 0) {
                attacker.hp = -99;
                log(`💀 [Shiva] ฆ่าแล้วตายไม่สนอะไร!`, 'text-red-600 font-bold');
            }

            checkDeath(defPlayerKey);
            if (getCharStats(attacker).hp <= 0) checkDeath(state.currentTurn);

            // Medal of Promotion: ถ้าฆ่าด้วย normal attack → double stats
            if (!targetIsBase && getCharStats(attacker).hp > 0 && actualTarget && actualTarget.id) {
                const targetDiedForMedal = !defPlayer.field.some(c => c.id === actualTarget.id);
                if (targetDiedForMedal && !isItemSuppressed()) {
                    const hasMedal = attacker.items && attacker.items.some(i => i.name === 'Medal of Promotion');
                    if (hasMedal && !attacker.medalDoubled) {
                        attacker.atk *= 2;
                        attacker.hp *= 2;
                        attacker.maxHp *= 2;
                        attacker.medalDoubled = true;
                        log(`🏅 [Medal of Promotion] ${attacker.name} ฆ่าได้! Stats x2 ถาวร! (${attacker.atk}/${attacker.hp})`, 'text-yellow-500 font-bold');
                    }
                }
            }

            // Julius Caesar: 50% โจมตีอีกครั้ง
            if (attackerEffectiveName === 'Julius Caesar' && !targetIsBase && getCharStats(attacker).hp > 0 && Math.random() < 0.5) {
                log(`🗡️ [Caesar On Attack] โชคดี! โจมตีซ้ำอีกครั้ง (50%)`, 'text-amber-400 font-bold');
                // find a random alive enemy to attack again
                const aliveDefenders = defPlayer.field.filter(c => getCharStats(c).hp > 0);
                if (aliveDefenders.length > 0 && getCharStats(attacker).hp > 0) {
                    const secondTarget = aliveDefenders[Math.floor(Math.random() * aliveDefenders.length)];
                    const caesarStats = getCharStats(attacker);
                    const caesarDmg = caesarStats.atk;
                    secondTarget.hp -= caesarDmg;
                    log(`🗡️ [Caesar] โจมตี ${secondTarget.name} อีก ${caesarDmg} ดาเมจ (True)`, 'text-amber-300');
                    checkDeath(defPlayerKey);
                }
            }

            state.lastAttackContext = null;
            state.selectedCardId = null;
            updateUI();
        }

        function checkDeath(playerKey) {
            const p = state.players[playerKey];
            for (let i = p.field.length - 1; i >= 0; i--) {
                let c = p.field[i];
                
                // ป้องกัน Infinite Loop: ถ้ากำลังรันเอฟเฟกต์ตายไปแล้ว ให้ข้ามไปเลย
                if (c.isDyingProcessing) continue; 
                
                // ถ้ายืนยันว่าเลือดหมดจริงๆ ให้มาร์คตัวนี้ว่ากำลังรันเอฟเฟกต์ตาย
                if (getCharStats(c).hp <= 0) {
                    c.isDyingProcessing = true; 
                }

                const effectiveName = (c.name.startsWith('Shadow Token') || c.name.startsWith('Shadow army') || c.name.includes('Loki Clone')) ? c.originalName : c.name;
                
                // Jack the Ripper: ปิด On Death effect ของตัวที่ถูก Jack ฆ่า
                if (c.jackSuppressed && getCharStats(c).hp <= 0) {
                    log(`🔪 [Jack the Ripper] On Death effect ของ ${c.name} ถูกปิด!`, 'text-gray-500 font-bold');
                    // Skip all death effects, go straight to removal
                    if (getCharStats(c).hp <= 0) {
                        playSound('discard');
                        if (gameMode === 'online') pushSoundEvent('discard');
                        p.graveyard.push(c);
                        p.field.splice(i, 1);
                    }
                    continue;
                }

                if (effectiveName === 'Queen' && c.queenImmortalTurns > 0) {
                    c.hp = getCharStats(c).maxHp;
                    log(`Queen Immortal: รอดตาย! เหลือ ${c.queenImmortalTurns} เทิร์น`, 'text-pink-500 font-bold');
                    c.isDyingProcessing = false; // 🟢 ล้างค่า Dying
                    continue;
                }

                if (effectiveName === 'Tossakan' && (c.tossakanImmortalTurns || 0) > 0) {
                    c.tossakanImmortalTurns--;
                    c.hp = getCharStats(c).maxHp;
                    log(`Tossakan Immortal: รอดตาย! เหลือ ${c.tossakanImmortalTurns} เทิร์น`, 'text-emerald-500 font-bold');
                    if (c.tossakanImmortalTurns <= 0) c.tossakanImmune = false;
                    c.isDyingProcessing = false; // 🟢 ล้างค่า Dying
                    continue;
                }

                if ((c.immortalTurns || 0) > 0 && getCharStats(c).hp <= 0) {
                    // Immortal: รอดตาย — ไม่ decrement ที่นี่ (decrement ใน resolveEndPhase เท่านั้น)
                    c.hp = 1;
                    log(`Immortal: รอดตาย! (เหลือ ${c.immortalTurns} เทิร์น, HP -> 1)`, 'text-emerald-400 font-bold');
                    c.isDyingProcessing = false; // 🟢 ล้างค่า Dying
                    continue;
                }

                const clayIndex = (!isItemSuppressed()) ? c.items.findIndex(item => item.name === 'Clay Armor') : -1;
                if (getCharStats(c).hp <= 0 && clayIndex !== -1) {
                    const clay = c.items.splice(clayIndex, 1)[0];
                    p.graveyard.push(clay);
                    c.hp = getCharStats(c).maxHp;
                    log(`[Clay Armor] ${c.name} รอดชีวิต! Clay Armor ถูกส่งสุสานแทน`, 'text-stone-300 font-bold');
                    c.isDyingProcessing = false; // 🟢 ล้างค่า Dying
                    continue;
                }

                if (effectiveName === 'Arthur Leywin' && getCharStats(c).hp <= 0) {
                    p.cost = Math.min(20, p.cost + 5);
                    log(`[Death] Arthur Leywin ตาย → ได้ Cost +5 ทันที!`, 'text-yellow-400 font-bold');
                }

                if (effectiveName === 'Salt water crocodile' && getCharStats(c).hp <= 0) {
                    const oppKey = playerKey === 'player' ? 'ai' : 'player';
                    state.players[oppKey].hp -= 2;
                    log(`[Death] Salt water crocodile ตาย → ทำดาเมจ 2 แก่ Base ศัตรู!`, 'text-emerald-400 font-bold');
                    checkWinCondition();
                }

                if (effectiveName === 'King Solomon' && getCharStats(c).hp <= 0) {
                    const candidates = p.deck.filter(cc => cc.type === 'Character' && cc.cost >= 8);
                    if (candidates.length > 0 && p.field.length < getMaxFieldSlots(playerKey)) {
                        const randIdx = Math.floor(Math.random() * candidates.length);
                        const selected = candidates[randIdx];
                        const deckIdx = p.deck.findIndex(d => d.id === selected.id);
                        const summoned = p.deck.splice(deckIdx, 1)[0];
                        summoned.attacksLeft = summoned.maxAttacks || 1;
                        p.field.push(summoned);
                        log(`[King Solomon Death] อัญเชิญ ${summoned.name} (cost ≥8) จากเด็ค!`, 'text-yellow-400 font-bold');
                        triggerOnSummon(summoned, playerKey);
                    }
                }

                if (effectiveName === 'Heavenly Soldier' && getCharStats(c).hp <= 0) {
                    if (p.hand.length > 0) {
                        const idx = Math.floor(Math.random() * p.hand.length);
                        p.hand[idx].costReducer = (p.hand[idx].costReducer || 0) + 3;
                        log(`[Heavenly Soldier] การ์ดในมือ 1 ใบ Cost -3!`, 'text-sky-300');
                    }
                }

                // ── Humanity death effects ──────────────────────────────
                if (effectiveName === 'Oppenheimer' && getCharStats(c).hp <= 0) {
                    const oppKey2 = playerKey === 'player' ? 'ai' : 'player';
                    state.players[oppKey2].hp -= 3;
                    log(`💥 [Oppenheimer Death] ระเบิด! Base ศัตรู -3 HP!`, 'text-gray-400 font-bold');
                    checkWinCondition();
                }

                if (effectiveName === 'Cthulhu' && getCharStats(c).hp <= 0) {
                    // เมื่อ Cthulhu ตาย → หา Lovecraft ในสนามแล้วบัฟ +7 ATK
                    const lovecraft = p.field.find(cc => (cc.originalName || cc.name) === 'H.P. Lovecraft' && cc.hp > 0);
                    if (lovecraft) {
                        lovecraft.atk += 7;
                        log(`🐙 [Cthulhu Death] Lovecraft +7 ATK ถาวร! (เป็น ${lovecraft.atk})`, 'text-indigo-400 font-bold');
                    } else {
                        log(`🐙 [Cthulhu Death] ไม่พบ Lovecraft ในสนาม`, 'text-gray-500');
                    }
                }

                if (effectiveName === 'H.P. Lovecraft' && getCharStats(c).hp <= 0) {
                    // เมื่อ Lovecraft ตาย → หา Cthulhu ในสนามแล้ว ATK x2
                    const cth = p.field.find(cc => (cc.originalName || cc.name) === 'Cthulhu' && cc.hp > 0);
                    if (cth) {
                        cth.atk *= 2;
                        log(`🐙 [Lovecraft Death] Cthulhu ATK x2! (เป็น ${cth.atk})`, 'text-green-400 font-bold');
                    }
                }

                if (effectiveName === 'Leonidas I' && getCharStats(c).hp <= 0) {
                    const oppKey3 = playerKey === 'player' ? 'ai' : 'player';
                    const opp3 = state.players[oppKey3];
                    opp3.field.forEach(cc => { cc.hp -= 3; log(`[Leonidas Death] ${cc.name} -3 HP`, 'text-red-400'); });
                    opp3.hp -= 2;
                    log(`🛡️ [Leonidas Death] ดาเมจ 3 ใส่ทุกตัวศัตรู + Base -2!`, 'text-red-500 font-bold');
                    checkWinCondition();
                    checkDeath(oppKey3);
                }

                if (effectiveName === 'Miyamoto Musashi' && getCharStats(c).hp <= 0) {
                    // handled during damage — musashi dying of natural causes (turn-end kill)
                    // Remove the pending kill flag if present
                    c.musashiDieNextTurn = false;
                }

                if (effectiveName === 'Vlad' && getCharStats(c).hp <= 0) {
                    const oppKey4 = playerKey === 'player' ? 'ai' : 'player';
                    const opp4 = state.players[oppKey4];
                    const markedCards = opp4.field.filter(cc => cc.vladMarkerId === c.id);
                    markedCards.forEach(mc => {
                        mc.hp = -99;
                        log(`🩸 [Vlad Death] ${mc.name} ที่โดน Mark ตายตามไปด้วย!`, 'text-red-500 font-bold');
                    });
                    if (markedCards.length > 0) checkDeath(oppKey4);
                }

                if (effectiveName === 'Artto' && getCharStats(c).hp <= 0) {
                    p.cost = Math.min(20, p.cost + 20);
                    log(`🎨 [Artto Death] ได้รับ 20 Cost! (ตอนนี้ ${p.cost})`, 'text-emerald-400 font-bold');
                }

                if (effectiveName === 'Farmer' && getCharStats(c).hp <= 0) {
                    if (p.hp < 20) {
                        p.hp = Math.min(20, p.hp + 1);
                        log(`🌾 [Farmer Death] Base HP +1! (ตอนนี้ ${p.hp})`, 'text-emerald-400 font-bold');
                    } else if (p.cost < 20) {
                        p.cost = Math.min(20, p.cost + 2);
                        log(`🌾 [Farmer Death] Base HP เต็ม → Cost +2! (ตอนนี้ ${p.cost})`, 'text-emerald-400 font-bold');
                    } else {
                        log(`🌾 [Farmer Death] Base HP และ Cost เต็มหมดแล้ว → ไม่ได้อะไร`, 'text-gray-500');
                    }
                }

                if (effectiveName === 'Adolf Hitler' && getCharStats(c).hp <= 0) {
                    // Death: random get 2 item cards from deck to hand
                    const items = p.deck.filter(cc => cc.type === 'Item');
                    const drawn = [];
                    for (let j = 0; j < 2 && items.length > 0; j++) {
                        const ri = Math.floor(Math.random() * items.length);
                        const item = items.splice(ri, 1)[0];
                        const deckIdx = p.deck.findIndex(d => d.id === item.id);
                        if (deckIdx !== -1) {
                            drawn.push(p.deck.splice(deckIdx, 1)[0]);
                        }
                    }
                    drawn.forEach(d => p.hand.push(d));
                    if (drawn.length > 0) log(`[Hitler Death] สุ่มจั่ว Item ${drawn.length} ใบ: ${drawn.map(d=>d.name).join(', ')}`, 'text-gray-300 font-bold');
                }

                if (effectiveName === 'Gregor Johann Mendel' && getCharStats(c).hp <= 0) {
                    // Death: randomly boost +2hp +2atk to 2 own units
                    const alive = p.field.filter(cc => cc.id !== c.id && getCharStats(cc).hp > 0);
                    const shuffled = [...alive].sort(() => Math.random() - 0.5).slice(0, 2);
                    shuffled.forEach(cc => {
                        cc.atk += 2;
                        cc.hp += 2;
                        cc.maxHp += 2;
                        log(`🧬 [Mendel Death] ${cc.name} +2 ATK, +2 HP!`, 'text-green-400 font-bold');
                    });
                }

                // ── Humanity death effects (เพิ่มการ์ดใหม่) ─────────────────────────────
                if (effectiveName === 'Mongol Cavalry' && getCharStats(c).hp <= 0) {
                    const hasKhan = p.field.some(cc => getEffectiveName(cc) === 'Genghis Khan' && getCharStats(cc).hp > 0 && !cc.silenced);
                    if (hasKhan && p.field.length < getMaxFieldSlots(playerKey)) {
                        const newCav = createCardInstance('Mongol Cavalry', 'humanity');
                        if (newCav) {
                            newCav.attacksLeft = newCav.maxAttacks || 1;
                            p.field.push(newCav);
                            log(`🐎 [Cavalry On Death] อัญเชิญ Mongol Cavalry ใหม่!`, 'text-amber-200 font-bold');
                            triggerOnSummon(newCav, playerKey);
                        }
                    }
                }

                if (effectiveName === 'Newton' && getCharStats(c).hp <= 0) {
                    p.hand.forEach(hc => {
                        hc.costReducer = (hc.costReducer || 0) + 1;
                    });
                    log(`[Newton Death] การ์ดในมือทุกใบ Cost -1`, 'text-sky-300 font-bold');
                }

                if (effectiveName === 'Schrödinger' && getCharStats(c).hp <= 0) {
                    if (Math.random() < 0.5 && p.field.length < getMaxFieldSlots(playerKey)) {
                        const theme = playerKey === 'player' ? selectedPlayerTheme : selectedAITheme;
                        const resp = createCardInstance('Schrödinger', theme);
                        if (resp) {
                            resp.attacksLeft = resp.maxAttacks || 1;
                            p.field.push(resp);
                            log(`⚛️ [Schrödinger Death] Respawn 50% สำเร็จ!`, 'text-indigo-200 font-bold');
                            triggerOnSummon(resp, playerKey);
                        }
                    } else {
                        log(`⚛️ [Schrödinger Death] ตายจริง (50%)`, 'text-indigo-300 font-bold');
                    }
                }

                if (effectiveName === 'Mozart' && getCharStats(c).hp <= 0) {
                    if (p.graveyard.length > 0) {
                        const idx = Math.floor(Math.random() * p.graveyard.length);
                        const returned = p.graveyard.splice(idx, 1)[0];
                        returned.hp = returned.maxHp || returned.hp; // ฟื้นฟูเลือดให้เต็ม
                        returned.status = []; // ล้างสถานะ
                        returned.items = [];  // ล้างไอเทม
                        p.hand.push(returned);
                        log(`🎻 [Mozart Death] คืนการ์ดจากสุสานสู่มือในสภาพสมบูรณ์: ${returned.name}`, 'text-purple-200 font-bold');
                    }
                }
                
                if (effectiveName === 'Achimedes' && getCharStats(c).hp <= 0) {
                    const ctx = state.lastAttackContext;
                    if (ctx && ctx.attackerPlayerKey && ctx.attackerId) {
                        const killerKey = ctx.attackerPlayerKey;
                        const killer = state.players[killerKey]?.field.find(cc => cc.id === ctx.attackerId);
                        if (killer && getCharStats(killer).hp > 0 && !killer.tossakanImmune && !hasNatureImmune(killerKey)) {
                            if (!killer.status.includes('Freeze')) killer.status.push('Freeze');
                            killer.freezeTurns = Math.max(killer.freezeTurns || 0, 4);
                            log(`❄️ [Achimedes Death] Freeze ผู้ฆ่า ${killer.name} 2 เทิร์น`, 'text-cyan-300 font-bold');
                        }
                    }
                }

                if (effectiveName === 'Luis Pasteur' && getCharStats(c).hp <= 0) {
                    const allies = p.field.filter(cc => cc.type === 'Character' && getCharStats(cc).hp > 0);
                    if (allies.length > 0) {
                        const target = allies[Math.floor(Math.random() * allies.length)];
                        const gain = 5;
                        target.hp = Math.min(getCharStats(target).maxHp, target.hp + gain);
                        log(`🧫 [Pasteur Death] ${target.name} +${gain} HP`, 'text-indigo-300 font-bold');
                    } else {
                        log(`🧫 [Pasteur Death] ไม่มีเพื่อนให้บัฟ +5 HP`, 'text-gray-500');
                    }
                }
                // ── End humanity death effects ──────────────────────────

                if (effectiveName === 'Pawn' && getCharStats(c).hp <= 0) {
                    log(`[Pawn Death] Draw 1 card!`, 'text-yellow-300');
                    drawCard(playerKey, 1);
                }
                       if (effectiveName === 'Kangaroo' && getCharStats(c).hp <= 0) {
                    log(`[Death] Kangaroo ตาย → จั่ว 3 ใบ!`, 'text-amber-400');
                    drawCard(playerKey, 3);
                }

                if (effectiveName === 'Ficker' && getCharStats(c).hp <= 0) {
                    const oppKey = playerKey === 'player' ? 'ai' : 'player';
                    const opp = state.players[oppKey];
                    if (opp.field.length > 0) {
                        let targets = [...opp.field].sort(() => Math.random() - 0.5).slice(0, 2);
                        targets.forEach(t => {
                            if (getCharStats(t).hp > 0) {
                                t.hp -= 1;
                                log(`[Ficker Death] 1 ดาเมจให้ ${t.name}`, 'text-gray-400');
                            }
                        });
                    }
                }

                if (getCharStats(c).hp <= 0) {
                    playSound('discard');
                    if (gameMode === 'online') pushSoundEvent('discard');
                    const balloonSwordIndex = c.items.findIndex(item => item.name === 'Balloon Sword');
                    if (balloonSwordIndex !== -1) {
                        const oppKey = playerKey === 'player' ? 'ai' : 'player';
                        const opp = state.players[oppKey];
                        if (opp.field.length > 0) {
                            const r = Math.floor(Math.random() * opp.field.length);
                            opp.field[r].hp -= 5;
                            log(`[Balloon Sword Death] สุ่ม 5 ดาเมจให้ศัตรู 1 ตัว!`, 'text-red-400');
                        }
                    }
                }

                if (getCharStats(c).hp <= 0) {
                    if (effectiveName === 'Hercules' && c.herculesExtraLives > 0) {
                        c.herculesExtraLives--;
                        const stats = getCharStats(c);
                        c.hp = stats.maxHp;
                        log(`[Hercules] ฟื้นคืนชีพทันที! ชีวิตสำรองเหลือ ${c.herculesExtraLives}`, 'text-orange-400 font-bold');
                        c.isDyingProcessing = false; // 🟢 ล้างค่า Dying
                        continue;
                    }

                    if (effectiveName === 'Fairy' && c.items.some(item => item.name === 'Nature Realm Wand') && !c.natureWandUsed) {
                        c.natureWandUsed = true;
                        c.hp = 5;
                        log(`[Nature Realm Wand] Fairy รอดตาย! HP ตั้งใหม่เป็น 5 (ใช้แล้ว 1 ครั้ง)`, 'text-green-400 font-bold');
                        c.isDyingProcessing = false; // 🟢 ล้างค่า Dying
                        continue;
                    }

                    if (effectiveName === 'Sun' && c.isSun) {
                        ['player','ai'].forEach(pk => {
                            state.players[pk].field.forEach(cc => {
                                cc.status = cc.status.filter(s => s !== 'Burn');
                                cc.burnTurns = 0;
                            });
                        });
                        log(`[Sun Death] ☀️ Burn หายจากทุกตัวทั้งสองฝั่ง!`, 'text-yellow-300 font-bold');
                    }

                    if (effectiveName === 'Fake Sun Wukong') {
                        state.players[playerKey].hp -= 1;
                        log(`[Death] Fake Sun Wukong ตาย → Base ฝั่งเรา -1 HP`, 'text-red-500 font-bold');
                        checkWinCondition();
                    }
                    if (effectiveName === 'Fairy') {
                        p.hp += 3;
                        log(`[Death] Fairy Heal Base +3 HP!`, 'text-pink-300 font-bold');
                        checkWinCondition();
                    }
                    if (effectiveName === 'Cyclops') {
                        drawCard(playerKey, 2);
                        log(`[Death] Cyclops จั่วการ์ด 2 ใบ!`, 'text-gray-300');
                    }

                    if (effectiveName === 'Phatchee') {
                        drawCard(playerKey, 1);
                        log(`[Death] Phatchee หายตัว... แต่ทิ้งการ์ดไว้ 1 ใบ! 🃏`, 'text-teal-400');
                    }
                    
                    if (effectiveName === 'Dog') {
                        const candidates = p.deck.filter(cc => cc.type === 'Character' && cc.cost >= 3);
                        if (candidates.length > 0 && p.field.length < getMaxFieldSlots(playerKey)) {
                            const randIdx = Math.floor(Math.random() * candidates.length);
                            const selected = candidates[randIdx];
                            const deckIdx = p.deck.findIndex(d => d.id === selected.id);
                            const summoned = p.deck.splice(deckIdx, 1)[0];
                            summoned.attacksLeft = summoned.maxAttacks;
                            p.field.push(summoned);
                            log(`[Death] Dog เรียก ${summoned.name} กลับมา!`, 'text-orange-400');
                            triggerOnSummon(summoned, playerKey);
                        }
                    }

                    if (effectiveName === 'Pasut Kleebua' || effectiveName === 'Tata') {
                        log(`มึงเรียกกูดีดีดิ คนอื่นถึงมาได้!!!`, 'text-red-500 font-bold');
                    }

                    if (c.items && c.items.length > 0) {
                        log(`[Drop] ไอเทมของ ${c.name} ร่วงหล่นลงสุสาน`, 'text-gray-400');
                        p.graveyard.push(...c.items);
                        c.items = [];
                    }

                    // === ANIMATION ตอนทิ้งการ์ดจากสนาม ===
                    const fieldContainer = document.getElementById(playerKey === 'player' ? 'player-field' : 'ai-field');
                    const cardEls = fieldContainer.querySelectorAll('.card');
                    for (let el of cardEls) {
                        if (el.textContent.includes(c.name)) {
                            animateDiscard(el);
                            break;
                        }
                    }

                    // --- ระบบ Burn Spread (ไฟลาม) ---
                    if (c.status.includes('Burn')) {
                        const isNatImmune = hasNatureImmune(playerKey);
                        const aliveAllies = p.field.filter(ally => ally.id !== c.id && getCharStats(ally).hp > 0 && !ally.status.includes('Burn') && !ally.tossakanImmune && !isNatImmune);
                        if (aliveAllies.length > 0) {
                            const target = aliveAllies[Math.floor(Math.random() * aliveAllies.length)];
                            target.status.push('Burn');
                            target.burnTurns = 2;
                            log(`🔥 [Burn Spread] เปลวเพลิงจากศพ ${c.name} ลุกลามไปติด ${target.name} (2 เทิร์น)!`, 'text-orange-500 font-bold');
                        }
                    }
                    // ----------------------------------

                    // Subaru: ตายกลับมือ Cost 0
                    if (effectiveName === 'Subaru') {
                log(`💜 "กลับมาจากความตายอีกแล้ว... Return by Death!"`, 'text-purple-300 font-bold italic');
                        p.field.splice(i, 1);
                        c.costReducer = c.cost; // cost = 0 เมื่อกลับมือ
                        c.hp = c.maxHp;
                        c.status = [];
                        c.items = [];
                        c.attacksLeft = 0;
                        c.isDyingProcessing = false; // ล้างสถานะก่อนกลับขึ้นมือ
                        p.hand.push(c);
                        log(`💜 [Subaru] Return by Death! กลับมาในมือ Cost 0`, 'text-purple-400 font-bold');
                        // Track kill (ศัตรูฆ่าได้)
                        trackKill(gameMode === 'online' ? state.currentTurn : 'player');
                        checkOngoingAuras();
                        continue; // ไม่ push graveyard
                    }

                    p.field.splice(i, 1);
                    // Track kill — killer is state.currentTurn, victim is playerKey
                    if (state.currentTurn !== playerKey) {
                        trackKill(gameMode === 'online' ? state.currentTurn : 'player');
                    }
                    c.isDyingProcessing = false; // ล้างสถานะก่อนลงสุสาน
                    p.graveyard.push(c);

                    if (effectiveName === 'Rubber Duck') {
                        log(`[Rubber Duck Death] อัญเชิญ Character สุ่ม 1 ตัวจาก Toy Deck!`, 'text-yellow-400 font-bold');
                        const toyChars = p.deck.filter(cc => cc.type === 'Character');
                        if (toyChars.length > 0 && p.field.length < getMaxFieldSlots(playerKey)) {
                            const rand = toyChars[Math.floor(Math.random() * toyChars.length)];
                            const idx = p.deck.findIndex(d => d.id === rand.id);
                            const summoned = p.deck.splice(idx, 1)[0];
                            summoned.attacksLeft = summoned.maxAttacks || 1;
                            p.field.push(summoned);
                            log(`Rubber Duck อัญเชิญ ${summoned.name}!`, 'text-yellow-300');
                        }
                    }
                }
            }
            checkOngoingAuras();
        }

        // ══════════════════════════════════════════════
        //  AUTH & STATS SYSTEM (Google Login)
        // ══════════════════════════════════════════════
        let currentUser = null; // Firebase user object
        let isGuestUser = false;

        const guestNames = ['Shadow Hawk','Iron Wolf','Storm Blade','Dark Ember','Frost Nova','Void Reaper','Sky Titan','Moon Knight','Star Breaker','Thunder Fang'];
        function randomGuestName() { return guestNames[Math.floor(Math.random()*guestNames.length)] + Math.floor(Math.random()*900+100); }

        function initAuth() {
            if (!firebaseReady || typeof firebase === 'undefined') return;
            const auth = firebase.auth();
            auth.onAuthStateChanged(user => {
                currentUser = user;
                const overlay = document.getElementById('login-overlay');
                if (user) {
                    if (overlay) overlay.style.display = 'none';
                    document.getElementById('auth-logged-out').style.display = 'none';
                    document.getElementById('auth-logged-in').style.display = 'flex';
                    if (user.isAnonymous) {
                        // Guest user
                        isGuestUser = true;
                        if (!user.displayName) {
                            // store guest name in user object locally
                            user._guestName = user._guestName || randomGuestName();
                        }
                        const guestName = user._guestName || user.displayName || 'Guest';
                        document.getElementById('auth-name').textContent = '👤 ' + guestName;
                        document.getElementById('auth-email').textContent = 'Guest (Stats ไม่บันทึก)';
                        const avatar = document.getElementById('auth-avatar');
                        avatar.style.display = 'none';
                        const statsBtn = document.getElementById('auth-stats-btn');
                        if (statsBtn) statsBtn.style.display = 'none';
                    } else {
                        // Google user
                        isGuestUser = false;
                        document.getElementById('auth-name').textContent = user.displayName || 'ผู้เล่น';
                        document.getElementById('auth-email').textContent = user.email || '';
                        const avatar = document.getElementById('auth-avatar');
                        if (user.photoURL) { avatar.src = user.photoURL; avatar.style.display = 'block'; }
                        else avatar.style.display = 'none';
                        const statsBtn = document.getElementById('auth-stats-btn');
                        if (statsBtn) statsBtn.style.display = 'inline-block';
                    }
                } else {
                    isGuestUser = false;
                    // แสดง overlay เฉพาะถ้าเลือก Online mode
                    if (overlay) overlay.style.display = (gameMode === 'online') ? 'flex' : 'none';
                    document.getElementById('auth-logged-out').style.display = 'flex';
                    document.getElementById('auth-logged-in').style.display = 'none';
                    const ll = document.getElementById('login-loading');
                    const lb = document.getElementById('login-btn');
                    if (ll) ll.style.display = 'none';
                    if (lb) lb.style.display = 'flex';
                }
            });
        }

