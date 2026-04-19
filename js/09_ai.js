// ============================================================
// 09_ai.js — AI system: scoring, card picking, attack logic
// ============================================================
        const AI_SYNERGY = [
            // ── Isekai ──
            ['Hades','Cerberus'],
            ['Kirito','Asuna'],
            ['Rem','Ram'],
            ['Rimuru Tempest','Jura Tempest'],
            ['Rimuru Tempest','Slime'],
            ['Aqua','Kazuma Satou'],
            ['Ainz Ooal Gown','Shalltear'],
            ['Subaru','Emilia'],
            ['Arthur Leywin','Aether Core'],
            ['Reinhard','Dragon Sword Reid'],
            // ── Mythology ──
            ['Zeus','Cronos'],
            ['Hades','Cronos'],
            ['Poseidon','Cronos'],
            ['Poseidon','Trident'],
            ['Odin','Gungnir'],
            ['King Arthur','Excalibur'],
            ['King Arthur','Holy Grail'],
            ['Rama','The Arrow of Brahma'],
            ['Fairy','Nature Realm Wand'],
            ['Sun Wukong','Ruyi Jingu'],
            ['Thor','Mjolnir'],
            ['Hercules','Bloody Fang'],
            ['Jormungandr','Holy Grail'],
            // ── Suankularb ──
            ['Phatchee','Teak'],
            // ── Toy Trooper ──
            ['Majorette','Hot Wheel'],
            ['Teddy Bear','Toy Soldier'],
            ['Toy-Rex','Toy Box Surprise'],
            // ── Animal Kingdom ──
            ['Wolf','Fullmoon'],
            ['Wolf','Call of the Wild'],
            ['Skeleton King','Skeleton'],
            // ── Humanity ──
            ['H.P. Lovecraft','Skull Devourer'],
            ['Sung Jin-Woo','Shadow'],
            ['Julius Caesar','Heavenly Soldier'],
            ['Kim Dokja','Fran'],
            // ── Cross-deck ──
            ['Simo Häyhä','Ruined Asguard'],
            ['Goblin','Goblin Lord'],
        ];

        // ── Item priority: item ควรใส่กับใคร ────────────────────────
        const AI_ITEM_TARGET = {
            // ── Specific-target items (ใส่ได้แค่ตัวนี้) ──
            'Excalibur':          c => getEffectiveName(c)==='King Arthur' ? 999 : -999,
            'Gungnir':            c => getEffectiveName(c)==='Odin' ? 999 : -999,
            'Ruyi Jingu':         c => getEffectiveName(c)==='Sun Wukong' ? 999 : -999,
            'Trident':            c => getEffectiveName(c)==='Poseidon' ? 999 : -999,
            'Sword of Oni':       c => getEffectiveName(c)==='Oni' ? 999 : -999,
            'Nature Realm Wand':  c => getEffectiveName(c)==='Fairy' ? 999 : -999,
            'The Arrow of Brahma':c => getEffectiveName(c)==='Rama' ? 999 : -999,
            'Dragon Sword Reid':  c => getEffectiveName(c)==='Reinhard' ? 999 : -999,
            'Aether Core':        c => getEffectiveName(c)==='Arthur Leywin' ? 999 : -999,
            'Mjolnir':            c => getEffectiveName(c)==='Thor' ? 999 : -999,
            // ── ATK-focused items (ใส่ตัว ATK สูงสุด) ──
            'Bloody Fang':        c => getCharStats(c).atk * 3 + getCharStats(c).hp, // ATK + lifesteal = ตัว ATK สูง
            'Sword':              c => getCharStats(c).atk,
            'Attack Rune':        c => getCharStats(c).atk,
            'BB Gun':             c => getCharStats(c).atk,
            'Nerf Gun':           c => getCharStats(c).atk,
            'Balloon Sword':      c => getCharStats(c).atk,
            'Bee Eye Glass':      c => getCharStats(c).atk,
            'Water Balloon':      c => getCharStats(c).atk,
            // ── HP-focused items (ใส่ตัวที่ HP เหลือน้อย หรือตัว tank) ──
            'Shield':             c => getCharStats(c).hp,
            'Defend Rune':        c => getCharStats(c).hp,
            'Escutcheon':         c => getCharStats(c).hp,
            'Clay Armor':         c => getCharStats(c).hp,
            'Air Balloon':        c => getCharStats(c).hp, // ใส่ตัวที่ HP น้อย เพื่อกันตาย
            // ── Value items (ใส่ตัวที่ value รวมสูงสุด) ──
            'Ring of Ainz Ooal Gown': c => getCharStats(c).atk + getCharStats(c).hp,
            'Shield of the Hero': c => getCharStats(c).hp,
            // ── Special logic ──
            'Bloody Fang':        c => getCharStats(c).atk * 3, // override — lifesteal ดีที่สุดกับ ATK สูง
        };

        // ── Card value สำหรับ board evaluation ──────────────────────
        function aiCardVal(c, ownerKey) {
            const s = getCharStats(c);
            const multiAtk = s.maxAttacks > 1 ? 1.5 : 1.0;
            const frozen = c.status && (c.status.includes('Freeze') || c.status.includes('Paralyze')) ? 0.25 : 1.0;
            const synergyBonus = AI_SYNERGY.reduce((acc, pair) => {
                const eff = getEffectiveName(c);
                if (!pair.includes(eff)) return acc;
                const partner = pair.find(p => p !== eff);
                const field = state.players[ownerKey].field;
                const hand  = state.players[ownerKey].hand;
                const hasPartner = [...field,...hand].some(x => getEffectiveName(x) === partner);
                return acc + (hasPartner ? 8 : 0);
            }, 0);
            return (s.atk * 2.5 + s.hp * 1.2) * multiAtk * frozen + synergyBonus;
        }

        // ── Board score (ยิ่งสูง = AI ได้เปรียบ) ─────────────────────
        function aiBoardScore(st) {
            st = st || state;
            const ai = st.players.ai;
            const pl = st.players.player;
            const aiFieldVal = ai.field.reduce((s,c)=>s+aiCardVal(c,'ai'),0);
            const plFieldVal = pl.field.reduce((s,c)=>s+aiCardVal(c,'player'),0);
            const aiAtk = ai.field.filter(c=>c.attacksLeft>0&&!c.status.includes('Freeze')&&!c.status.includes('Paralyze'))
                            .reduce((s,c)=>s+getCharStats(c).atk,0);
            const plAtk = pl.field.reduce((s,c)=>s+getCharStats(c).atk*(c.maxAttacks||1),0);

            // HP score — penalty ชั้นๆ ถ้าใกล้ตาย
            const aiHpScore = ai.hp*4 - (ai.hp<=8?15:0) - (ai.hp<=5?35:0) - (ai.hp<=3?60:0);
            const plHpScore = pl.hp*4;

            // Lethal bonus — ถ้าจบได้เทิร์นนี้ score สูงสุด
            const lethalBonus = (aiAtk>=pl.hp && pl.field.length===0) ? 300 : 0;

            // Near-lethal bonus — ถ้าเกือบจบ
            const nearLethal = pl.hp<=8 ? (8-pl.hp)*5 : 0;

            // Hand advantage
            const handAdv = (ai.hand.length - pl.hand.length) * 2;

            // Field control
            const fieldCtrl = (ai.field.length - pl.field.length) * 4;

            // Taunt bonus — ถ้าเรามี taunt ศัตรูโจมตี free ไม่ได้
            const aiTaunt = ai.field.filter(c=>c.text&&c.text.toLowerCase().includes('taunt')).length;
            const tauntBonus = aiTaunt * 6;

            // Danger penalty — ถ้าศัตรู ATK รวม >= HP เรา = อันตราย
            const dangerPenalty = plAtk >= ai.hp ? -40 : 0;

            return aiHpScore - plHpScore + aiFieldVal - plFieldVal
                 + handAdv + fieldCtrl + lethalBonus + nearLethal
                 + tauntBonus + dangerPenalty;
        }

        // ── Simulate ลงการ์ด (ไม่แก้ state จริง) ────────────────────
        function aiSimPlayCard(cardId, targetId) {
            // Deep copy state แบบเบา
            const snap = JSON.parse(JSON.stringify({
                players: { ai: state.players.ai, player: state.players.player },
                sharedFieldCard: state.sharedFieldCard,
                actionPlayedThisTurn: state.actionPlayedThisTurn,
                currentTurn: state.currentTurn,
            }));
            const p = snap.players.ai;
            const cidx = p.hand.findIndex(c=>c.id===cardId);
            if (cidx===-1) return null;
            const card = p.hand[cidx];
            const cost = getActualCost(card,'ai');
            if (p.cost < cost) return null;
            p.cost -= cost;
            p.hand.splice(cidx,1);
            if (card.type==='Character') {
                card.attacksLeft = card.maxAttacks||1;
                p.field.push(card);
            }
            return snap;
        }

        // ── Lethal check: ถ้าโจมตี base ได้ชนะทันทีไหม ─────────────
        function aiCheckLethal() {
            const ai = state.players.ai;
            const pl = state.players.player;
            // ถ้ามีตัวขวางที่ไม่ได้ติด Levitate จะโจมตีฐานไม่ได้
            const hasBlocker = pl.field.some(c => getCharStats(c).hp > 0 && !c.status.includes('Levitate'));
            if (hasBlocker) return false;
            const totalAtk = ai.field
                .filter(c=>c.attacksLeft>0 && !c.status.includes('Freeze') && !c.status.includes('Paralyze') && !c.status.includes('Levitate'))
                .reduce((s,c)=>s+getCharStats(c).atk,0);
            return totalAtk >= pl.hp;
        }

        // ── เลือกการ์ดดีสุดจะลง (lookahead 1 step) ──────────────────
        function aiBestCardToPlay() {
            const ai = state.players.ai;
            const pl = state.players.player;
            const maxSlots = getMaxFieldSlots('ai');

            // Lethal check ก่อน — ถ้าชนะได้แล้วไม่ต้องลงการ์ด
            if (aiCheckLethal() && pl.field.length===0) return null;

            const playable = ai.hand.filter(c => {
                const cost = getActualCost(c,'ai');
                if (cost > ai.cost) return false;
                if (c.type==='Action' && state.actionPlayedThisTurn) return false;
                if (c.type==='Character' && ai.field.length>=maxSlots) return false;
                if (c.requiresTarget) {
                    const tf = c.targetEnemy ? pl.field : ai.field;
                    return tf.filter(x=>getCharStats(x).hp>0).length>0;
                }
                return true;
            });

            if (!playable.length) return null;

            // Score แต่ละการ์ดด้วย lookahead
            const scored = playable.map(card => {
                let score = 0;
                const cost = getActualCost(card,'ai');
                const eff = getEffectiveName(card);

                if (card.type==='Character') {
                    const s = getCharStats(card);
                    // Base value / cost ratio
                    score = (s.atk*2.5 + s.hp*1.2) / Math.max(1,cost) * 12;

                    // Emergency — field ว่าง ลงด่วน
                    if (ai.field.length===0) score += 35;

                    // Synergy bonus
                    AI_SYNERGY.forEach(pair => {
                        if (!pair.includes(eff)) return;
                        const partner = pair.find(p=>p!==eff);
                        const hasPartner = [...ai.field,...ai.hand].some(x=>getEffectiveName(x)===partner);
                        if (hasPartner) score += 20;
                    });

                    // Defensive — HP ต่ำ ลงตัว HP สูง หรือตัว Taunt
                    if (ai.hp<=8 && s.hp>=6) score += 20;
                    if (ai.hp<=8 && c.text && c.text.toLowerCase().includes('taunt')) score += 25;

                    // Offensive — enemy base ต่ำ ลงตัว ATK สูง
                    if (pl.hp<=10 && s.atk>=5) score += 25;
                    if (pl.hp<=6 && s.atk>=4) score += 35; // urgent rush

                    // ลงตัว high-cost เมื่อคุ้มค่า
                    if (cost>=8 && s.atk+s.hp>=14) score += 12;

                    // Taunt bonus ทั่วไป — ถ้า enemy มีตัวเยอะ taunt ดีมาก
                    if (c.text && c.text.toLowerCase().includes('taunt') && pl.field.length>=2) score += 15;

                    // True Damage bonus — ถ้า enemy มี damage reduce
                    if (c.text && c.text.toLowerCase().includes('true damage') && pl.field.length>=1) score += 10;

                    // Evade bonus — ถ้า enemy มี ATK สูง
                    const plMaxAtk = pl.field.reduce((m,x)=>Math.max(m,getCharStats(x).atk),0);
                    if (c.text && c.text.toLowerCase().includes('evade') && plMaxAtk>=5) score += 12;

                    // Field full — ลดคะแนนตัวที่ลงไม่ได้ค่า
                    if (ai.field.length >= getMaxFieldSlots('ai')-1 && cost<=2 && s.atk+s.hp<=5) score -= 20;

                    // Lookahead: simulate แล้ว score board
                    const snap = aiSimPlayCard(card.id);
                    if (snap) {
                        const prevScore = aiBoardScore();
                        // estimate board after playing (simple)
                        score += 5; // playing a card is generally good
                    }

                } else if (card.type==='Item') {
                    const scorer = AI_ITEM_TARGET[eff];
                    const targetField = card.targetEnemy ? pl.field : ai.field;
                    const aliveTargets = targetField.filter(c=>getCharStats(c).hp>0);
                    if (scorer && aliveTargets.length>0) {
                        const best = aliveTargets.sort((a,b)=>scorer(b)-scorer(a))[0];
                        const bestScore = scorer(best);
                        if (bestScore >= 900) score = 95; // must-equip (specific target)
                        else if (bestScore > 0) score = 55 + bestScore*0.3;
                        else score = -50;
                    } else if (!scorer && aliveTargets.length>0) {
                        score = ai.field.length>0 ? 45 : 10; // field ว่าง = score ต่ำแต่ยังลงได้
                    } else {
                        score = -99; // ไม่มี target จริงๆ → ไม่ลง
                    }
                } else if (card.type==='Action') {
                    score = aiScoreAction(card, eff);
                } else if (card.type==='Field') {
                    score = ai.field.length>=2 ? 65 : (ai.field.length===1 ? 35 : 10);
                    // Holy Grail — ลงถ้า graveyard มี char เยอะ
                    if (eff==='Holy Grail') {
                        const gyChar = ai.graveyard.filter(c=>c.type==='Character').length;
                        score = gyChar>=3 ? 90 : 20;
                    }
                }

                return { card, score };
            });

            scored.sort((a,b)=>b.score-a.score);
            // ลงการ์ดเสมอถ้ามีในมือ — เพียงแต่เลือก score สูงสุด
            // ถ้าทุกใบ score ติดลบ → ยังลงใบที่ดีที่สุด (ดีกว่าไม่ทำอะไร)
            return scored[0] ? scored[0].card : null;
        }

        function aiScoreAction(card, eff) {
            const ai = state.players.ai;
            const pl = state.players.player;

            if (['Apple','Golden Apple'].includes(eff)) {
                const missing = ai.field.reduce((s,c)=>s+Math.max(0,getCharStats(c).maxHp-getCharStats(c).hp),0);
                return missing>=5 ? 85 : missing>=2 ? 50 : -20;
            }
            if (['Mega Cage'].includes(eff)) return pl.field.length>=2 ? 90 : pl.field.length===1 ? 55 : -10;
            if (['DNA Replication','Wild Kingdom'].includes(eff)) return ai.field.length>=2 ? 80 : 20;
            if (['Fullmoon'].includes(eff)) {
                const wolves = ai.field.filter(c=>getEffectiveName(c)==='Wolf').length;
                return wolves>=1 ? 95 : -30;
            }
            if (['Call of the Wild','Random Summon'].includes(eff)) {
                return ai.field.length < getMaxFieldSlots('ai')-1 ? 70 : 15;
            }
            if (['Explosion'].includes(eff)) return pl.field.length>=2 ? 85 : 30;
            if (['Goal of All Life is Death'].includes(eff)) {
                // ลงถ้า board ศัตรูได้เปรียบเรามาก
                return (pl.field.length>=3 && ai.field.length<=1) ? 95 : -10;
            }
            if (['Rafael'].includes(eff)) return ai.hand.length<=2 ? 75 : 25;
            if (['Teacher'].includes(eff)) {
                const best = ai.field.filter(c=>getCharStats(c).hp>0)
                    .sort((a,b)=>getCharStats(b).atk-getCharStats(a).atk)[0];
                return best && getCharStats(best).atk>=4 ? 80 : 30;
            }
            if (['I Think I Can Make This in LEGO'].includes(eff)) {
                const best = pl.field.filter(c=>getCharStats(c).hp>0)
                    .sort((a,b)=>aiCardVal(b,'player')-aiCardVal(a,'player'))[0];
                return best ? 70 : -10;
            }
            if (['Welcome to Heaven'].includes(eff)) return ai.field.length>=2 ? 85 : 20;
            if (['Revive'].includes(eff)) return ai.graveyard.filter(c=>c.type==='Character').length>=2 ? 70 : 20;

            // Explosion, Goal of All Life is Death
            if (['Explosion'].includes(eff)) return pl.field.length>=2 ? 88 : pl.field.length===1 ? 45 : -20;
            if (['Goal of All Life is Death'].includes(eff)) {
                const plAdv = plFieldVal => pl.field.length>=3 && ai.field.length<=1;
                return (pl.field.length>=3 && ai.field.length<=1) ? 92 : -30;
            }

            // Apotheosis — ลงถ้ามีตัวในสนามและ enemy มีตัวเยอะ
            if (['Apotheosis'].includes(eff)) return (ai.field.length>=2 && pl.field.length>=2) ? 75 : 20;

            // Ragnarok — เก็บไว้ใช้เมื่อสถานการณ์วิกฤต
            if (['Ragnarok'].includes(eff)) return (ai.hp<=5 && pl.field.length>=2) ? 90 : -20;

            // Underworld Descent
            if (['Underworld Descent'].includes(eff)) return ai.graveyard.filter(c=>c.type==='Character').length>=3 ? 80 : 25;

            // Clay Barrier
            if (['Clay Barrier'].includes(eff)) return (ai.hp<=10 && ai.field.length>=1) ? 65 : 20;

            // Gigatomachy
            if (['Gigatomachy'].includes(eff)) return pl.field.length>=3 ? 85 : 30;

            // Mid Summon, Army Summon
            if (['Mid Summon','Army Summon'].includes(eff)) return ai.field.length<getMaxFieldSlots('ai')-1 ? 72 : 15;

            // Monopoly — ลงถ้า cost เราน้อย
            if (['Monopoly'].includes(eff)) return ai.cost<=5 ? 70 : 20;

            // Use Glue to Fix!, Bad Luck Try Again
            if (['Use Glue to Fix!','Bad Luck Try Again'].includes(eff)) return 40;

            // หาแหวน Dobble Bot
            if (eff==='หาแหวน Dobble Bot') return ai.field.length>=1 ? 60 : 15;

            // Default
            const cost = getActualCost(card,'ai');
            return cost<=3 ? 45 : cost<=5 ? 30 : 15;
        }

        // ── เลือก Item target ที่ดีสุด ────────────────────────────────
        function aiPickItemTarget(card) {
            const ai = state.players.ai;
            const pl = state.players.player;
            const eff = getEffectiveName(card);
            const scorer = AI_ITEM_TARGET[eff];
            if (!scorer) return null;
            const field = card.targetEnemy ? pl.field : ai.field;
            const alive = field.filter(c=>getCharStats(c).hp>0);
            if (!alive.length) return null;
            return alive.sort((a,b)=>scorer(b)-scorer(a))[0];
        }

        // ── เลือก target โจมตีดีสุด ──────────────────────────────────
        function aiBestTarget(attacker, enemyField) {
            const atkStats = getCharStats(attacker);
            const targetable = enemyField.filter(c => {
                const eff = getEffectiveName(c);
                const alive = enemyField.filter(x=>getCharStats(x).hp>0);
                if (eff==='Sinon' && alive.length>1) return false;
                if (eff==='King'  && alive.length>1) return false;
                // F-35: Untargetable
                if (!isItemSuppressed() && c.items && c.items.some(i => i.name === 'F-35')) {
                    const friends = enemyField.filter(f => f.id !== c.id && getCharStats(f).hp > 0);
                    if (friends.length > 0) return false;
                }
                return getCharStats(c).hp>0;
            });
            if (!targetable.length) return null;

            // Priority 1: lethal — ฆ่าได้ + คุณค่าสูงสุด
            const killable = targetable.filter(c=>getCharStats(c).hp<=atkStats.atk);
            if (killable.length) return killable.sort((a,b)=>aiCardVal(b,'player')-aiCardVal(a,'player'))[0];

            // Priority 2: ตัวที่ ATK สูง (threat removal)
            const highThreat = [...targetable].sort((a,b)=>getCharStats(b).atk-getCharStats(a).atk)[0];
            const lowestHp  = [...targetable].sort((a,b)=>getCharStats(a).hp-getCharStats(b).hp)[0];

            // ถ้า high threat โจมตีได้มากพอ เลือก threat ก่อน
            if (getCharStats(highThreat).atk >= 4) return highThreat;
            return lowestHp;
        }

        // ── Main AI loop ──────────────────────────────────────────────
        function playAI() {
            if (state.currentTurn !== 'ai' || (gameMode !== 'ai' && !isChaosMode)) return;

            if (state.phase === 'MAIN') {
                let maxPlays = 12;
                const playNext = () => {
                    if (state.currentTurn !== 'ai' || state.phase !== 'MAIN') return;
                    if (--maxPlays <= 0) { setTimeout(() => nextPhase(), 500); return; }

                    const ai = state.players.ai;
                    const pl = state.players.player;

                    // ── Build playable list ──
                    const playable = ai.hand.filter(c => {
                        const cost = getActualCost(c, 'ai');
                        if (cost > ai.cost) return false;
                        if (c.type === 'Action' && state.actionPlayedThisTurn) return false;
                        if (c.type === 'Character' && ai.field.length >= getMaxFieldSlots('ai')) return false;
                        if (c.requiresTarget) {
                            const tf = c.targetEnemy ? pl.field : ai.field;
                            return tf.filter(x => getCharStats(x).hp > 0).length > 0;
                        }
                        return true;
                    });

                    if (!playable.length) { setTimeout(() => nextPhase(), 600); return; }

                    // ── Simple scoring: pick best card ──
                    const scored = playable.map(c => {
                        const eff = getEffectiveName(c);
                        const st = getCharStats(c);
                        const cost = Math.max(1, getActualCost(c, 'ai'));
                        let score = 0;

                        if (c.type === 'Character') {
                            score = (st.atk * 2 + st.hp * 1.5) / cost * 10;
                            if (ai.field.length === 0) score += 30; // need something on board
                            if (ai.hp <= 8 && st.hp >= 5) score += 15; // defensive
                            if (pl.hp <= 8 && st.atk >= 4) score += 20; // aggressive lethal push
                        } else if (c.type === 'Item') {
                            const tf = c.targetEnemy ? pl.field : ai.field;
                            score = tf.filter(x => getCharStats(x).hp > 0).length > 0 ? 45 : -99;
                            // Required-target items (specific named targets)
                            const sc = AI_ITEM_TARGET[eff];
                            if (sc) {
                                const best = tf.filter(x => getCharStats(x).hp > 0)
                                    .sort((a, b) => sc(b) - sc(a))[0];
                                if (best) score = sc(best) >= 900 ? 90 : Math.max(0, 40 + sc(best) * 0.2);
                                else score = -99;
                            }
                        } else if (c.type === 'Action') {
                            score = aiScoreAction(c, eff);
                        } else if (c.type === 'Field') {
                            score = ai.field.length >= 1 ? 55 : 15;
                        }
                        return { c, score };
                    }).sort((a, b) => b.score - a.score);

                    // Don't play if best score is very negative
                    if (scored[0].score < -50) { setTimeout(() => nextPhase(), 600); return; }

                    const best = scored[0].c;

                    if (best.requiresTarget) {
                        const eff = getEffectiveName(best);
                        const tf = best.targetEnemy ? pl.field : ai.field;
                        const alive = tf.filter(x => getCharStats(x).hp > 0);
                        let target = aiPickItemTarget(best);
                        if (!target || !alive.some(x => x.id === target.id)) {
                            target = alive.sort((a, b) =>
                                aiCardVal(b, best.targetEnemy ? 'player' : 'ai') -
                                aiCardVal(a, best.targetEnemy ? 'player' : 'ai')
                            )[0];
                        }
                        if (target) resolveTargetedPlay('ai', best.id, target.id);
                        else { setTimeout(() => nextPhase(), 600); return; }
                    } else {
                        playCard('ai', best.id);
                    }
                    setTimeout(playNext, 700);
                };
                setTimeout(playNext, 500);

            } else if (state.phase === 'BATTLE') {
                if (state.totalTurns <= 1) { setTimeout(() => nextPhase(), 600); return; }

                const processAIAttack = () => {
                    if (state.phase !== 'BATTLE' || state.currentTurn !== 'ai') return;
                    const ai = state.players.ai;
                    const pl = state.players.player;

                    const attackers = ai.field.filter(c =>
                        c.attacksLeft > 0 &&
                        !c.status.includes('Freeze') &&
                        !c.status.includes('Paralyze') &&
                        !c.status.includes('Levitate')
                    );
                    if (!attackers.length) { setTimeout(() => nextPhase(), 600); return; }

                    // Sort: kill-able targets first, then by ATK
                    attackers.sort((a, b) => {
                        const sa = getCharStats(a), sb = getCharStats(b);
                        const killA = pl.field.filter(c => getCharStats(c).hp <= sa.atk).length;
                        const killB = pl.field.filter(c => getCharStats(c).hp <= sb.atk).length;
                        if (killA !== killB) return killB - killA;
                        return sb.atk - sa.atk;
                    });

                    const attacker = attackers[0];
                    const hasBlocker = pl.field.some(c => getCharStats(c).hp > 0 && !c.status.includes('Levitate'));

                    if (!hasBlocker) {
                        initiateAttack(attacker.id, null, true);
                        setTimeout(processAIAttack, 700);
                        return;
                    }

                    const target = aiBestTarget(attacker, pl.field);
                    if (target) initiateAttack(attacker.id, target.id, false);
                    else attacker.attacksLeft = 0;
                    setTimeout(processAIAttack, 700);
                };
                setTimeout(processAIAttack, 500);
            }
        }

        // ── F-35: Modal ให้ผู้เล่นเลือก target ตอนเริ่มเทิร์น ──
        function showF35TargetModal(carrierCard, targets) {
            // ถ้ามี modal เก่าอยู่ให้ลบก่อน
            const existing = document.getElementById('f35-modal');
            if (existing) existing.remove();

            const overlay = document.createElement('div');
            overlay.id = 'f35-modal';
            overlay.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,0.88);z-index:9500;display:flex;align-items:center;justify-content:center;flex-direction:column;gap:16px;';

            const box = document.createElement('div');
            box.style.cssText = 'background:#1f2937;border:3px solid #38bdf8;border-radius:20px;padding:24px 28px;max-width:460px;width:92%;text-align:center;box-shadow:0 0 40px rgba(56,189,248,0.5);';

            const title = document.createElement('div');
            title.style.cssText = 'font-size:1.1rem;font-weight:900;color:#38bdf8;margin-bottom:6px;';
            title.innerText = '✈️ F-35 — เลือกเป้าหมาย';

            const sub = document.createElement('div');
            sub.style.cssText = 'font-size:0.8rem;color:#9ca3af;margin-bottom:16px;';
            sub.innerText = 'จบเทิร์น: F-35 จะโจมตีเป้านี้ 3 ดาเมจ';

            const list = document.createElement('div');
            list.style.cssText = 'display:flex;flex-wrap:wrap;gap:8px;justify-content:center;';

            targets.forEach(t => {
                const stats = getCharStats(t);
                const btn = document.createElement('button');
                btn.style.cssText = 'background:#374151;border:2px solid #4b5563;color:white;border-radius:10px;padding:8px 14px;font-size:0.8rem;cursor:pointer;transition:background 0.15s;';
                btn.innerHTML = `<span style="font-weight:700;">${t.name}</span><br><span style="color:#6ee7b7;font-size:0.7rem;">${stats.hp}/${stats.maxHp} HP</span>`;
                btn.onmouseenter = () => btn.style.background = '#1e40af';
                btn.onmouseleave = () => btn.style.background = '#374151';
                btn.onclick = () => {
                    carrierCard.f35TargetId = t.id;
                    log(`✈️ [F-35] ล็อกเป้าหมาย: ${t.name}`, 'text-sky-400');
                    overlay.remove();
                };
                list.appendChild(btn);
            });

            box.appendChild(title);
            box.appendChild(sub);
            box.appendChild(list);
            overlay.appendChild(box);
            document.body.appendChild(overlay);
        }

