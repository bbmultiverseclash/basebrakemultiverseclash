// ============================================================
// 20_ultra_upgrade.js — Ultra Upgrade v1 Pack & New Mechanics
// จำกัดเวลา 3 วัน (หมดเขต 26 เม.ย. 2026)
// ============================================================

const _ULTRA_CARDS = {
    'Muhammad Ali': {
        name: 'Muhammad Ali', type: 'Character', cost: 10, atk: 2, hp: 8, maxHp: 8,
        text: 'หลบ 2 การโจมตีแรกของทุกเทิร์น | โจมตีได้ 3 ครั้ง',
        color: 'bg-red-800', maxAttacks: 3, 
        art: 'https://i.ibb.co/W4hnfNnm/BCO-90a9b4c9-0e24-45b9-adf8-9ac1ce9c66e1-1.png', _theme: 'humanity'
    },
    'megumin': {
        name: 'megumin', type: 'Character', cost: 3, atk: 1, hp: 2, maxHp: 2,
        text: 'ตาย: ได้การ์ด Explosion (Cost 3) ขึ้นมือ',
        color: 'bg-red-700', maxAttacks: 1, 
        art: 'https://file.garden/aeeLCXSsJxTPrRbp/39b0d0d6ed0807076fffd45aa5050a8d%20(1).jpg', _theme: 'isekai_adventure'
    },
    'White Whale': {
        name: 'White Whale', type: 'Character', cost: 10, atk: 1, hp: 15, maxHp: 15,
        text: '50% หลบหลีก | Summon: ส่งศัตรู 1 ตัวกลับขึ้นมือ และ Cost +10 เป็นเวลา 2 เทิร์น',
        color: 'bg-sky-100 text-black', maxAttacks: 1, 
        art: 'https://file.garden/aeeLCXSsJxTPrRbp/file_00000000f4e071fa9791b97d3456c4f7.png', _theme: 'isekai_adventure'
    },
    'Enuma elish': {
        name: 'Enuma elish', type: 'Item', cost: 12,
        text: 'สวมใส่ Gilgamesh เท่านั้น! ทิ้ง 5 ใบ | +10 ATK/HP (ไอเทมอื่นถูกถอด) | โจมตีโดนศัตรูอีก 2 ตัว | จบเทิร์น: 30% ทำลายการ์ดทุกใบฝั่งตรงข้าม ส่วนฝั่งเราโดน 5 ดาเมจต่อตัว',
        color: 'bg-yellow-500', requiresTarget: true, 
        art: 'https://file.garden/aeeLCXSsJxTPrRbp/file_00000000245c71fa82141f048cf5b310.png', _theme: 'mythology'
    },
    'Boxing Gloves': {
        name: 'Boxing Gloves', type: 'Item', cost: 5,
        text: '+3 ATK / +2 HP | ถ้าใส่ Ali หรือ Mike Tyson: +5 ATK/HP และลดดาเมจรับ 1',
        color: 'bg-red-600', requiresTarget: true, 
        art: 'https://i.ibb.co/9mjZyN8Z/BCO-04410323-5cc4-4956-8c64-64e1bbbecdb2.png', _theme: 'humanity'
    },
    'Flash Sale Frenzy': {
        name: 'Flash Sale Frenzy', type: 'Action', cost: 10,
        text: 'Action: การ์ดในมือที่ Cost <= 6 จะกลายเป็น Cost 0 ในเทิร์นนี้',
        color: 'bg-pink-500', 
        art: 'https://i.ibb.co/mrfCGM6D/BCO-9c4eeea1-6792-47d3-bd3b-8d55841cc48b.png', _theme: 'humanity'
    },
    'ReturningTo Shelves': {
        name: 'ReturningTo Shelves', type: 'Action', cost: 8,
        text: 'Action: สุ่มส่งศัตรู 2 ตัวบนสนามกลับขึ้นมือ (Cost +1)',
        color: 'bg-amber-600', 
        art: 'https://i.ibb.co/7xfs8pXt/BCO-55ad2aeb-fd33-4d01-b0ff-e90cea667a1f.png', _theme: 'toy_trooper'
    }
};

// ─── INIT & INJECT ───────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
    // Inject into CardSets
    if (typeof CardSets !== 'undefined') {
        Object.keys(_ULTRA_CARDS).forEach(k => {
            const theme = _ULTRA_CARDS[k]._theme;
            if (!CardSets[theme]) CardSets[theme] = {};
            CardSets[theme][k] = JSON.parse(JSON.stringify(_ULTRA_CARDS[k]));
        });
    }

    // Inject Redeem Code
    if (typeof REDEEM_CODES !== 'undefined') {
        REDEEM_CODES['ALITHEGOAT'] = { hxhCard: 'Boxing Gloves', label: '🥊 Boxing Gloves', oneTime: true };
    }

    // Inject Collector Challenge
    if (typeof CARD_COLLECTORS !== 'undefined') {
        CARD_COLLECTORS.push({
            id: 'toys_lover_v1',
            name: 'Toys Lover v1',
            emoji: '🧸',
            required:[
                { name: 'Chess Board', count: 1 },
                { name: 'Rubick', count: 2 },
                { name: 'Gundam Model', count: 2 },
                { name: 'Toy-Rex', count: 3 },
                { name: 'Ficker', count: 5 },
                { name: 'Lego Man', count: 10 }
            ],
            reward: { xp: 1500, specificCards:['ReturningTo Shelves|toy_trooper'] }
        });
    }

    // Hook checkCardCollectors to grant specificCards
    if (typeof checkCardCollectors === 'function') {
        const _origCheckCardColl_ultra = window.checkCardCollectors;
        window.checkCardCollectors = function() {
            if (!playerData.completedCollectors) playerData.completedCollectors = [];
            const prevCompleted = [...playerData.completedCollectors];

            _origCheckCardColl_ultra.apply(this, arguments);

            const nowCompleted = playerData.completedCollectors;
            const newlyCompleted = nowCompleted.filter(id => !prevCompleted.includes(id));

            newlyCompleted.forEach(id => {
                const ch = CARD_COLLECTORS.find(c => c.id === id);
                if (ch && ch.reward && ch.reward.specificCards) {
                    ch.reward.specificCards.forEach(sc => {
                        playerData.collection[sc] = (playerData.collection[sc] || 0) + 1;
                        if (typeof showToast === 'function') showToast(`🎁 ได้รับการ์ดพิเศษ: ${sc.split('|')[0]}`, '#fbbf24');
                    });
                    if (typeof saveData === 'function') saveData();
                }
            });
        };
    }

    // ─── MONKEY PATCHES FOR MECHANICS ─────────────────────────────

    // 1. initiateAttack (Ali Evade, White Whale Evade, Enuma Splash)
    if (typeof initiateAttack === 'function') {
        const _origInitAttack_ultra = window.initiateAttack;
        window.initiateAttack = function(attackerId, targetId, targetIsBase) {
            if (typeof state === 'undefined' || targetIsBase) {
                return _origInitAttack_ultra.apply(this, arguments);
            }
            const atkKey = state.currentTurn;
            const defKey = atkKey === 'player' ? 'ai' : 'player';
            const attacker = state.players[atkKey].field.find(c => c.id === attackerId);
            const target = state.players[defKey].field.find(c => c.id === targetId);

            if (attacker && target && typeof getCharStats !== 'undefined') {
                const tN = target.originalName || target.name;

                // Ali Evade (2 times per turn)
                if (tN === 'Muhammad Ali' && (target.aliDodgesThisTurn || 0) < 2 && !target.silenced) {
                    target.aliDodgesThisTurn = (target.aliDodgesThisTurn || 0) + 1;
                    if (typeof log === 'function') log(`🥊 [Muhammad Ali] Float like a butterfly! หลบการโจมตีครั้งที่ ${target.aliDodgesThisTurn}/2!`, 'text-yellow-400 font-bold');
                    attacker.attacksLeft -= 1;
                    state.selectedCardId = null;
                    if (typeof updateUI === 'function') updateUI();
                    return; 
                }

                // White Whale Evade (50%)
                if (tN === 'White Whale' && Math.random() < 0.5 && !target.silenced) {
                    if (typeof log === 'function') log(`🐋 [White Whale] หมอกแห่งการลบเลือน! หลบการโจมตีได้สำเร็จ!`, 'text-sky-300 font-bold');
                    attacker.attacksLeft -= 1;
                    state.selectedCardId = null;
                    if (typeof updateUI === 'function') updateUI();
                    return;
                }
            }

            // Run original combat
            _origInitAttack_ultra.apply(this, arguments);

            // Enuma Elish Splash & Sound
            if (attacker && !targetIsBase && getCharStats(attacker).hp > 0) {
                const hasEnuma = attacker.items && attacker.items.some(i => i.name === 'Enuma elish');
                if (hasEnuma && typeof isItemSuppressed === 'function' && !isItemSuppressed()) {
                    const actualDmg = getCharStats(attacker).atk;
                    const others = state.players[defKey].field.filter(c => c.id !== targetId && getCharStats(c).hp > 0);
                    const chosen = [...others].sort(()=>Math.random()-0.5).slice(0, 2);
                    chosen.forEach(t => {
                        t.hp -= actualDmg;
                        if (typeof log === 'function') log(`⚔️ [Enuma elish] EA ผ่ามิติ! โดน ${t.name} อีก ${actualDmg} ดาเมจ!`, 'text-red-400 font-bold');
                    });
                    
                    // Play EA Sound on attack
                    const eaSnd = new Audio('https://files.catbox.moe/iru9x2.mp3');
                    eaSnd.volume = 0.8;
                    eaSnd.play().catch(()=>{});

                    if (chosen.length > 0 && typeof checkDeath === 'function') checkDeath(defKey);
                }
            }
        };
    }

    // 2. getCharStats (Enuma Stats & Boxing Gloves Stats)
    if (typeof getCharStats === 'function') {
        const _origGetCharStats_ultra = window.getCharStats;
        window.getCharStats = function(char) {
            let stats = _origGetCharStats_ultra(char);
            if (char.silenced || (typeof isItemSuppressed === 'function' && isItemSuppressed())) return stats;

            if (char.items) {
                let hasBoxing = false;
                let hasEnuma = false;
                char.items.forEach(i => {
                    if (i.name === 'Boxing Gloves') hasBoxing = true;
                    if (i.name === 'Enuma elish') hasEnuma = true;
                });

                if (hasEnuma) {
                    stats.atk += 10;
                    stats.hp += 10;
                    stats.maxHp += 10;
                }

                if (hasBoxing) {
                    const effName = char.originalName || char.name;
                    if (effName === 'Muhammad Ali' || effName === 'Mike Tyson') {
                        stats.atk += 5;
                        stats.hp += 5;
                        stats.maxHp += 5;
                        stats.damageReduce = (stats.damageReduce || 0) + 1;
                    } else {
                        stats.atk += 3;
                        stats.hp += 2;
                        stats.maxHp += 2;
                    }
                }
            }
            return stats;
        };
    }

    // 3. executeNonTargetAction (Flash Sale Frenzy, ReturningTo Shelves, Explosion sound)
    if (typeof executeNonTargetAction === 'function') {
        const _origExecNonTarget_ultra = window.executeNonTargetAction;
        window.executeNonTargetAction = function(card, playerKey) {
            const eff = card.originalName || card.name;
            const p = state.players[playerKey];
            const oppKey = playerKey === 'player' ? 'ai' : 'player';
            const opp = state.players[oppKey];

            if (eff === 'Flash Sale Frenzy') {
                if (typeof log === 'function') log(`🛒 [Flash Sale Frenzy] ลดแลกแจกแถม! การ์ด Cost <= 6 ในมือ Cost เป็น 0 เทิร์นนี้!`, 'text-pink-400 font-bold');
                p.hand.forEach(c => {
                    const actCost = typeof getActualCost === 'function' ? getActualCost(c, playerKey) : c.cost;
                    if (actCost <= 6 && !c.flashSaleFrenzyTurn) {
                        c.flashSaleCostDiff = actCost;
                        c.costReducer = (c.costReducer || 0) + actCost;
                        c.flashSaleFrenzyTurn = true;
                    }
                });
                p.graveyard.push(card);
                return;
            }
            
            if (eff === 'ReturningTo Shelves') {
                if (typeof log === 'function') log(`📦 [ReturningTo Shelves] นำสินค้ากลับคืนชั้น!`, 'text-amber-400 font-bold');
                const enemies = opp.field.filter(c => typeof getCharStats==='function' && getCharStats(c).hp > 0);
                const targets = [...enemies].sort(()=>Math.random()-0.5).slice(0, 2);
                targets.forEach(t => {
                    const idx = opp.field.findIndex(c => c.id === t.id);
                    if (idx !== -1) {
                        const bounced = opp.field.splice(idx, 1)[0];
                        bounced.costReducer = (bounced.costReducer || 0) - 1; // +1 cost = -1 reducer
                        bounced.hp = bounced.maxHp;
                        bounced.status =[];
                        bounced.attacksLeft = 0;
                        opp.hand.push(bounced);
                        if (typeof log === 'function') log(`📦 ส่ง ${bounced.name} กลับขึ้นมือ (Cost +1)`, 'text-amber-300');
                    }
                });
                p.graveyard.push(card);
                return;
            }

            if (eff === 'Explosion') {
                const expSnd = new Audio('https://files.catbox.moe/63isrc.mp3');
                expSnd.volume = 0.8;
                expSnd.play().catch(()=>{});
            }

            _origExecNonTarget_ultra.apply(this, arguments);
        };
    }

    // 4. resolveTargetedPlay (Enuma Elish Equip Logic)
    if (typeof resolveTargetedPlay === 'function') {
        const _origResolveTarget_ultra = window.resolveTargetedPlay;
        window.resolveTargetedPlay = function(playerKey, sourceCardId, targetCharId) {
            const p = state.players[playerKey];
            const card = p.hand.find(c => c.id === sourceCardId);
            
            if (card && card.name === 'Enuma elish') {
                const oppKey = playerKey === 'player' ? 'ai' : 'player';
                const targetChar = card.targetEnemy ? state.players[oppKey].field.find(c=>c.id===targetCharId) : p.field.find(c=>c.id===targetCharId);
                
                if (targetChar) {
                    const effN = targetChar.originalName || targetChar.name;
                    if (effN !== 'Gilgamesh') {
                        if (playerKey === 'player' || gameMode === 'local' || (typeof gameMode !== 'undefined' && gameMode === 'online' && myRole === 'ai' && playerKey === 'ai')) {
                            alert("Enuma elish สวมใส่ได้แค่ Gilgamesh เท่านั้น!");
                        }
                        if (typeof cancelTargeting === 'function') cancelTargeting();
                        return;
                    }
                    
                    // Valid! Remove all other items from Gilgamesh.
                    if (targetChar.items && targetChar.items.length > 0) {
                        p.graveyard.push(...targetChar.items);
                        targetChar.items =[];
                    }

                    // Discard 5 cards
                    let discardCount = 0;
                    for (let i = p.hand.length - 1; i >= 0 && discardCount < 5; i--) {
                        if (p.hand[i].id !== sourceCardId) {
                            p.graveyard.push(p.hand.splice(i, 1)[0]);
                            discardCount++;
                        }
                    }
                    if (typeof log === 'function') log(`[Enuma elish] สละการ์ด ${discardCount} ใบเพื่อปลดปล่อย EA!`, 'text-red-400 font-bold');
                }
            }
            _origResolveTarget_ultra.apply(this, arguments);
        };
    }

    // 5. triggerOnSummon (White Whale)
    if (typeof triggerOnSummon === 'function') {
        const _origOnSummon_ultra = window.triggerOnSummon;
        window.triggerOnSummon = function(card, playerKey) {
            _origOnSummon_ultra.apply(this, arguments);
            const eff = card.originalName || card.name;
            const oppKey = playerKey === 'player' ? 'ai' : 'player';
            const opp = state.players[oppKey];

            if (eff === 'White Whale') {
                const enemies = opp.field.filter(c => typeof getCharStats === 'function' && getCharStats(c).hp > 0);
                if (enemies.length > 0) {
                    const target = enemies[Math.floor(Math.random() * enemies.length)];
                    const idx = opp.field.findIndex(c => c.id === target.id);
                    if (idx !== -1) {
                        const bounced = opp.field.splice(idx, 1)[0];
                        bounced.costReducer = (bounced.costReducer || 0) - 10;
                        bounced.whiteWhalePenaltyTurns = 4; // 2 round-trips
                        bounced.hp = bounced.maxHp;
                        bounced.status =[];
                        bounced.attacksLeft = 0;
                        opp.hand.push(bounced);
                        if (typeof log === 'function') log(`🐋 [White Whale] พ่นหมอกส่ง ${bounced.name} กลับขึ้นมือ และ Cost +10 เป็นเวลา 2 เทิร์น!`, 'text-sky-300 font-bold');
                    }
                }
            }
        };
    }

    // 6. checkDeath (megumin)
    if (typeof checkDeath === 'function') {
        const _origCheckDeath_ultra = window.checkDeath;
        window.checkDeath = function(playerKey) {
            const p = state.players[playerKey];
            p.field.forEach(c => {
                if (typeof getCharStats === 'function' && getCharStats(c).hp <= 0 && !c.isDyingProcessing) {
                    const eff = c.originalName || c.name;
                    if (eff === 'megumin' && !c._ultraMeguminDead) {
                        c._ultraMeguminDead = true;
                        const exp = typeof createCardInstance === 'function' ? createCardInstance('Explosion', 'isekai_adventure') : null;
                        if (exp) {
                            exp.cost = 3; 
                            p.hand.push(exp);
                            if (typeof log === 'function') log(`💥[megumin] ร่ายเวทสุดท้ายทิ้งไว้! ได้รับ Explosion (Cost 3)`, 'text-red-400 font-bold');
                        }
                    }
                }
            });
            _origCheckDeath_ultra.apply(this, arguments);
        };
    }

    // 7. resolveEndPhase (Ali, Flash Sale, White Whale, Enuma Elish self-destruct)
    if (typeof resolveEndPhase === 'function') {
        const _origEndPhase_ultra = window.resolveEndPhase;
        window.resolveEndPhase = function(playerKey) {
            _origEndPhase_ultra.apply(this, arguments);
            const p = state.players[playerKey];

            p.field.forEach(c => {
                const eff = c.originalName || c.name;
                if (eff === 'Muhammad Ali') {
                    c.aliDodgesThisTurn = 0;
                }

                // ── Enuma Elish (Gilgamesh) 30% End Turn ──
                if (c.items && c.items.some(i => i.name === 'Enuma elish') && !c.silenced && (typeof isItemSuppressed==='function' && !isItemSuppressed())) {
                    if (Math.random() < 0.3) {
                        if (typeof log === 'function') log(`💥 [Enuma elish] พลังของ EA กวาดล้างศัตรูทั้งหมด! ส่วนฝั่งเราโดนลูกหลง 5 ดาเมจ!`, 'text-red-600 font-bold');
                        const oppKey = playerKey === 'player' ? 'ai' : 'player';
                        
                        // ศัตรูตายทั้งหมด
                        state.players[oppKey].field.forEach(enemy => {
                            enemy.hp = -99;
                        });
                        if (typeof checkDeath === 'function') checkDeath(oppKey);
                        
                        // ฝั่งเรา (รวมถึง Gilgamesh เอง) โดน 5 ดาเมจต่อตัว
                        p.field.forEach(ally => {
                            ally.hp -= 5;
                        });
                        if (typeof checkDeath === 'function') checkDeath(playerKey);
                    }
                }
            });

            p.hand.forEach(c => {
                if (c.whiteWhalePenaltyTurns > 0) {
                    c.whiteWhalePenaltyTurns--;
                    if (c.whiteWhalePenaltyTurns <= 0) {
                        c.costReducer += 10; 
                    }
                }
                if (c.flashSaleFrenzyTurn) {
                    c.costReducer -= c.flashSaleCostDiff;
                    c.flashSaleFrenzyTurn = false;
                }
            });
        };
    }

    // ─── UI INJECTION: ULTRA UPGRADE V1 PACK ─────────────────────
    function _appendUltraUpgradeSection() {
        const panel = document.getElementById('hub-panel-packs');
        if (!panel) return;
        const old = document.getElementById('_ultra-pack-sec');
        if (old) old.remove();

        const ULTRA_EXPIRY = new Date('2026-04-26T23:59:59+07:00');
        const available = new Date() < ULTRA_EXPIRY;
        const diff = ULTRA_EXPIRY - new Date();
        const d = Math.floor(diff / 86400000);
        const h = Math.floor((diff % 86400000) / 3600000);
        const countdown = diff <= 0 ? '⏰ หมดเขตแล้ว' : `⏳ เหลือ ${d} วัน ${h} ชม.`;

        const coins = typeof playerData !== 'undefined' ? (playerData.coins || 0) : 0;
        const pulled = typeof playerData !== 'undefined' ? (playerData.ultraPacksBought || 0) : 0;
        const maxPulls = 5;
        const canSingle = available && coins >= 1000 && pulled < maxPulls;

        const sec = document.createElement('div');
        sec.id = '_ultra-pack-sec';
        sec.style.cssText = 'padding:0 0 24px';
        sec.innerHTML = `
        <!-- Divider -->
        <div style="display:flex;align-items:center;gap:10px;margin:16px 0 14px">
          <div style="flex:1;height:1px;background:linear-gradient(90deg,transparent,#f43f5e)"></div>
          <div style="font-size:0.75rem;font-weight:900;color:#f43f5e;letter-spacing:1px">🚀 ULTRA UPGRADE V1</div>
          <div style="flex:1;height:1px;background:linear-gradient(90deg,#f43f5e,transparent)"></div>
        </div>

        <!-- Pack Card -->
        <div style="background:linear-gradient(135deg,#2e0b16,#4c0519);
             border:2.5px solid ${available ? '#f43f5e' : '#374151'};border-radius:20px;overflow:hidden;
             box-shadow:0 0 ${available ? '36px rgba(244,63,94,0.22)' : 'none'};margin-bottom:12px">

          <div style="position:relative;height:130px;overflow:hidden">
            <img src="https://i.ibb.co/W4hnfNnm/BCO-90a9b4c9-0e24-45b9-adf8-9ac1ce9c66e1-1.png"
                 style="width:100%;height:100%;object-fit:cover;object-position:top;filter:brightness(${available ? '0.6' : '0.22'})">
            <div style="position:absolute;inset:0;background:linear-gradient(to bottom,transparent 20%,#2e0b16)"></div>
            <div style="position:absolute;top:10px;left:12px;
                 background:${available ? 'rgba(220,38,38,0.88)' : 'rgba(55,65,81,0.9)'};
                 border:1.5px solid ${available ? '#fca5a5' : '#4b5563'};
                 border-radius:20px;padding:3px 10px;font-size:0.64rem;font-weight:900;
                 color:${available ? '#fca5a5' : '#9ca3af'}">
              ${available ? '⏱️ LIMITED · 3 วัน เท่านั้น' : '🔒 หมดเขตแล้ว'}</div>
            <div style="position:absolute;top:10px;right:12px;
                 background:rgba(0,0,0,0.75);border:1.5px solid #f43f5e;
                 border-radius:20px;padding:3px 10px;font-size:0.64rem;font-weight:900;color:#fda4af">
              ${pulled}/${maxPulls} ครั้ง</div>
            <div style="position:absolute;bottom:10px;left:14px">
              <div style="font-size:1.05rem;font-weight:900;color:white;text-shadow:0 2px 8px rgba(0,0,0,0.9)">
                🚀 Ultra Upgrade v1</div>
              <div style="font-size:0.66rem;color:${available ? '#fda4af' : '#6b7280'}">${countdown}</div>
            </div>
          </div>

          <div style="padding:14px">
            <div style="display:grid;grid-template-columns:repeat(5,1fr);gap:4px;margin-bottom:10px">
              ${['Muhammad Ali','megumin','Enuma elish','Flash Sale Frenzy','White Whale'].map(n => {
                  const t = _ULTRA_CARDS[n];
                  return `<div style="background:#16050b;border:1px solid #f43f5e44;border-radius:8px;overflow:hidden">
                    <img src="${t.art}" style="width:100%;height:38px;object-fit:cover">
                    <div style="padding:2px 3px;text-align:center">
                      <div style="font-size:0.45rem;font-weight:800;color:#fda4af;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${n}</div>
                    </div>
                  </div>`;
              }).join('')}
            </div>
            <div style="background:rgba(244,63,94,0.1);border:1px solid #be123c;border-radius:10px;padding:6px 10px;margin-bottom:12px;font-size:0.63rem;color:#fda4af;text-align:center">
              🎲 โอกาสดรอป 20% เท่ากันทุกใบ · รวมการ์ดสุดแกร่งอัปเดตใหม่
            </div>
            <div style="display:flex;align-items:center;gap:12px">
              <div style="flex:1">
                <div style="font-size:1.05rem;font-weight:900;color:${available ? '#fbbf24' : '#6b7280'}">
                  🪙 1,000 / ดึง 1 ใบ</div>
              </div>
              <button onclick="buyUltraPack()"
                ${canSingle ? '' : 'disabled'}
                style="background:${canSingle ? 'linear-gradient(135deg,#be123c,#f43f5e)' : '#374151'};
                       color:${canSingle ? 'white' : '#6b7280'};border:none;
                       padding:11px 18px;border-radius:12px;font-weight:900;font-size:0.9rem;
                       cursor:${canSingle ? 'pointer' : 'not-allowed'};white-space:nowrap;
                       box-shadow:${canSingle ? '0 0 14px rgba(244,63,94,0.4)' : 'none'}">
                ${!available ? '🔒 หมดเขต' : pulled >= maxPulls ? '✅ ครบแล้ว' : coins < 1000 ? '🪙 ไม่พอ' : '🚀 ดึงเลย!'}
              </button>
            </div>
          </div>
        </div>`;

        const inner = panel.querySelector('div[style*="max-width:700px"]') || panel;
        inner.appendChild(sec);
    }

    window.buyUltraPack = function() {
        const ULTRA_EXPIRY = new Date('2026-04-26T23:59:59+07:00');
        if (new Date() >= ULTRA_EXPIRY) { showToast('⏰ Pack หมดเขตแล้ว!', '#f87171'); return; }
        if (playerData.coins < 1000) { showToast(`🪙 เหรียญไม่พอ!`, '#f87171'); return; }
        const pulled = playerData.ultraPacksBought || 0;
        if (pulled >= 5) { showToast(`🔒 ซื้อครบ 5 ครั้งแล้ว!`, '#f87171'); return; }

        playerData.coins -= 1000;
        playerData.ultraPacksBought = pulled + 1;

        const pool =['Muhammad Ali','megumin','Enuma elish','Flash Sale Frenzy','White Whale'];
        const cardName = pool[Math.floor(Math.random() * pool.length)];
        const theme = _ULTRA_CARDS[cardName]._theme;
        const key = `${cardName}|${theme}`;
        playerData.collection[key] = (playerData.collection[key] || 0) + 1;

        saveData();
        if (typeof updateHubUI === 'function') updateHubUI();
        
        // Show reveal overlay
        const tpl = _ULTRA_CARDS[cardName];
        const ov = document.createElement('div');
        ov.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,0.96);z-index:9900;display:flex;align-items:center;justify-content:center';
        ov.innerHTML = `
        <div style="background:linear-gradient(135deg,#2e0b16,#4c0519,#2e0b16);
             border:3px solid #f43f5e;border-radius:28px;padding:32px 22px;
             max-width:360px;width:92%;text-align:center;
             box-shadow:0 0 80px rgba(244,63,94,0.55)">
          <div style="font-size:2.8rem;margin-bottom:4px">🚀</div>
          <div style="font-size:1.2rem;font-weight:900;color:#fda4af;margin-bottom:2px">Ultra Upgrade v1</div>
          <div style="font-size:0.68rem;color:#9ca3af;margin-bottom:18px">ดึง ${playerData.ultraPacksBought}/5 ครั้ง</div>
          <div style="width:150px;margin:0 auto 18px;border-radius:16px;overflow:hidden;
               border:3px solid #f43f5e;box-shadow:0 0 30px rgba(244,63,94,0.6)">
            <img src="${tpl.art}" style="width:100%;height:190px;object-fit:cover">
            <div style="background:rgba(0,0,0,0.88);padding:8px 6px">
              <div style="font-size:0.62rem;font-weight:900;color:#fda4af;margin-bottom:2px">Ultra Edition</div>
              <div style="font-size:0.9rem;font-weight:900;color:white">${cardName}</div>
              <div style="font-size:0.55rem;color:#9ca3af">Cost ${tpl.cost} ${tpl.atk!==undefined ? `· ATK ${tpl.atk} / HP ${tpl.hp}` : ''}</div>
            </div>
          </div>
          <div style="background:rgba(244,63,94,0.12);border:1px solid #be123c;
               border-radius:10px;padding:8px 12px;margin-bottom:18px;font-size:0.66rem;color:#fecdd3;text-align:left">
            ${tpl.text}
          </div>
          <button onclick="this.closest('div[style*=fixed]').remove();if(typeof renderPacksPanel==='function') renderPacksPanel();"
            style="background:linear-gradient(135deg,#be123c,#f43f5e);color:white;border:none;
                   padding:13px 38px;border-radius:16px;font-weight:900;font-size:1.05rem;cursor:pointer;
                   box-shadow:0 0 22px rgba(244,63,94,0.5)">ยอดเยี่ยม!</button>
        </div>`;
        document.body.appendChild(ov);

        setTimeout(() => {
            if (typeof checkCollectionMilestones === 'function') checkCollectionMilestones();
            if (typeof checkTitleUnlocks === 'function') checkTitleUnlocks();
            if (typeof checkCardCollectors === 'function') checkCardCollectors();
        }, 2000);
    };

    if (typeof renderPacksPanel === 'function') {
        const _origRenderPacksPanel = window.renderPacksPanel;
        window.renderPacksPanel = function() {
            _origRenderPacksPanel.apply(this, arguments);
            _appendUltraUpgradeSection();
        };
    }
});
