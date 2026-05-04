// ============================================================
// 29_normal_enchant.js — Normal Enchant System & New Cards
// ============================================================

document.addEventListener('DOMContentLoaded', () => {

    // 1. กำหนดตัวแปร Normal Scroll ให้ Player Data
    if (typeof playerData !== 'undefined' && playerData.normalScrolls === undefined) {
        playerData.normalScrolls = 0;
    }

    // 2. ข้อมูลการ์ดใหม่
    const NEW_ENCHANT_CARDS = {
        'Odin - Lord of the Einherjar': {
            name: 'Odin - Lord of the Einherjar', type: 'Character', cost: 8, atk: 6, hp: 12, maxHp: 12,
            text: 'On summon: สุ่มดึง Item 2 ใบจากเด็คขึ้นมือ | จบเทิร์น: ตัวเองเสีย 2 HP เพื่อบัฟ +2 ATK/+2 HP ให้เพื่อน 2 ตัว | ตาย: ทำ 5 ดาเมจใส่ศัตรู 1 ตัว',
            color: 'bg-blue-900', maxAttacks: 1, shopOnly: true, rarity: 'Mythic',
            art: 'https://file.garden/aeeLCXSsJxTPrRbp/file_00000000464c720895bb55d0a5d62d70.png', _theme: 'mythology'
        },
        'H.P. Lovecraft (Awakened)': {
            name: 'H.P. Lovecraft (Awakened)', type: 'Character', cost: 10, atk: 1, hp: 3, maxHp: 3,
            text: 'On Summon: สร้าง Cthulhu Token 12/4 | ตาย: ได้รับการ์ดเวทมนตร์ Necronomicon ขึ้นมือ',
            color: 'bg-indigo-950', maxAttacks: 1, shopOnly: true, rarity: 'Mythic',
            art: 'https://i.pinimg.com/1200x/60/b8/fd/60b8fdd63ab4cfee6b06389179706b90.jpg', _theme: 'humanity'
        },
        'Necronomicon': {
            name: 'Necronomicon', type: 'Action', cost: 8,
            text: 'Action: อัญเชิญสุ่ม 1 ใน 3 เทพโบราณ (Azathoth, Nyarlathotep, Yog-Sothoth) ลงสนาม',
            color: 'bg-purple-950', shopOnly: true, _theme: 'humanity'
        },
        'Azathoth': {
            name: 'Azathoth', type: 'Character', cost: 0, atk: 0, hp: 30, maxHp: 30,
            text: 'Ongoing: หากการ์ดใบนี้อยู่บนสนามครบ 10 เทิร์น Base ศัตรู -10 HP ทันที',
            color: 'bg-zinc-900', maxAttacks: 0, shopOnly: true, rarity: 'Mythic',
            art: 'https://file.garden/aeeLCXSsJxTPrRbp/ad363dfe85551c37d47f364e2fc389ac.jpg', _theme: 'humanity'
        },
        'Nyarlathotep': {
            name: 'Nyarlathotep', type: 'Character', cost: 0, atk: 0, hp: 5, maxHp: 5,
            text: 'On Death: คืนชีพด้วยการกลายร่างเป็นการ์ดศัตรู 1 ใบที่มีอยู่บนสนาม พร้อมได้รับบัฟ +3 ATK/+3 HP',
            color: 'bg-zinc-800', maxAttacks: 0, shopOnly: true, rarity: 'Mythic',
            art: 'https://file.garden/aeeLCXSsJxTPrRbp/25a2dd4653770de5aaf42f30fa8607e7.jpg', _theme: 'humanity'
        },
        'Yog-Sothoth': {
            name: 'Yog-Sothoth', type: 'Character', cost: 0, atk: 11, hp: 11, maxHp: 11,
            text: 'On Summon: สุ่มอัญเชิญ Character 3 ตัวจากเด็คของคุณลงสนามทันที',
            color: 'bg-zinc-700', maxAttacks: 1, shopOnly: true, rarity: 'Mythic',
            art: 'https://file.garden/aeeLCXSsJxTPrRbp/63118aa4e1a67dba0a521cf4f6a3622a.jpg', _theme: 'humanity'
        },
        'Elephant - Musth state': {
            name: 'Elephant - Musth state', type: 'Character', cost: 7, atk: 5, hp: 10, maxHp: 10,
            text: 'On Summon: ทำ 2 ดาเมจใส่ศัตรูทุกตัว | Ongoing: ลดดาเมจรับ 30% | On attack: 50% โอกาสทำดาเมจเพิ่ม +5',
            color: 'bg-stone-700', maxAttacks: 1, shopOnly: true, rarity: 'Mythic',
            art: 'https://file.garden/aeeLCXSsJxTPrRbp/e1e217cc174580f7b64d4a9292616890.jpg', _theme: 'animal_kingdom'
        },
        'Julius Caesar - Conquest of Gaul': {
            name: 'Julius Caesar - Conquest of Gaul', type: 'Character', cost: 10, atk: 8, hp: 8, maxHp: 8,
            text: 'On Summon: บัฟเพื่อนทุกตัว +3 ATK/+3 HP ถาวร | On Attack: True Dmg และถ้าฆ่าเป้าหมายได้ สุ่มทำ 4 ดาเมจใส่อีก 1 ตัว | On Death: ได้รับ 3 Cost',
            color: 'bg-amber-800', maxAttacks: 1, shopOnly: true, rarity: 'Mythic',
            art: 'https://file.garden/aeeLCXSsJxTPrRbp/file_00000000c04c72088e9b2cd0080a70d4.png', _theme: 'humanity'
        },
        'Attack rune - Rampage rune': {
            name: 'Attack rune - Rampage rune', type: 'Item', cost: 3,
            text: 'ใส่ 1 ใบ: +3 ATK | 2 ใบ: +7 ATK, +4 HP | 3 ใบขึ้นไป: +15 ATK, +10 HP',
            color: 'bg-red-700', requiresTarget: true, shopOnly: true, rarity: 'Epic', _theme: 'mythology'
        },
        'Defend rune - Aegis rune': {
            name: 'Defend rune - Aegis rune', type: 'Item', cost: 3,
            text: 'ใส่ 1 ใบ: +4 HP | 2 ใบ: +9 HP, +3 ATK | 3 ใบขึ้นไป: +20 HP, +8 ATK',
            color: 'bg-blue-700', requiresTarget: true, shopOnly: true, rarity: 'Epic', _theme: 'mythology'
        },
        'Emilia v2': {
            name: 'Emilia v2', type: 'Character', cost: 9, atk: 6, hp: 6, maxHp: 6,
            text: 'On summon: แช่แข็งศัตรูทุกตัว 1 เทิร์น (ถ้าแข็งอยู่แล้ว +1 เทิร์นและโดน 3 ดาเมจ) | Ongoing: มี Puck ในสนาม Puck +4 ATK, ถ้ามี Subaru จะถูกเป็นเป้าหมายสุดท้าย | จบเทิร์น: 50% ได้รับเวท Al Huma',
            color: 'bg-cyan-700', maxAttacks: 1, shopOnly: true, rarity: 'Mythic',
            art: 'https://file.garden/aeeLCXSsJxTPrRbp/506a74b335359dddb477cf161947bcf0.jpg', _theme: 'isekai_adventure'
        },
        'Al Huma': {
            name: 'Al Huma', type: 'Spell', cost: 5,
            text: 'ทำ 3 ดาเมจใส่ 2 เป้าหมายและ Freeze 1 เทิร์น (ถ้าเป้าหมาย Freeze อยู่แล้ว ทำ 7 ดาเมจและ +1 เทิร์น)',
            color: 'bg-sky-400', requiresTarget: false, shopOnly: true, _theme: 'isekai_adventure'
        },
        'Soldier - SEAL Marshal': {
            name: 'Soldier - SEAL Marshal', type: 'Character', cost: 3, atk: 2, hp: 2, maxHp: 2,
            text: 'On reveal: สุ่ม Equip 1 item จากสุสานของเรา (ถ้าไม่มีสุ่มจาก database) | On dead: ทำ 5 ดาเมจใส่ศัตรูที่ cost ต่ำสุด',
            color: 'bg-slate-800', maxAttacks: 1, shopOnly: true, rarity: 'Mythic',
            art: 'https://i.pinimg.com/736x/87/da/ff/87daffe927f67866d98c25dbf75841ed.jpg', _theme: 'humanity'
        },
        'Fairy - Jade Empress': {
            name: 'Fairy - Jade Empress', type: 'Character', cost: 10, atk: 2, hp: 10, maxHp: 10,
            text: 'On summon: Heal ทีมจนเต็มและล้าง CC ทั้งหมด | Ongoing: เมื่อยูนิตทีมเราโดนดาเมจ -> Heal 5 HP | On attack: ถ้าฆ่าได้ +2 Max HP ให้ทีม | On dead: Heal Base 4 HP',
            color: 'bg-emerald-600', maxAttacks: 1, shopOnly: true, rarity: 'Mythic',
            art: 'https://i.pinimg.com/736x/55/0c/fc/550cfca7f884f1837fc9a5ff6b986dc5.jpg', _theme: 'mythology'
        },
        'Grizzly Bear - Mountain King': {
            name: 'Grizzly Bear - Mountain King', type: 'Character', cost: 7, atk: 7, hp: 7, maxHp: 7,
            text: 'On reveal: Draw 5 cards | On get attack: 50% ลดดาเมจเหลือ 1 (Max 2 ครั้ง/เทิร์น) | On attack: 50% โอกาสทำดาเมจ x2',
            color: 'bg-amber-800', maxAttacks: 1, shopOnly: true, rarity: 'Mythic',
            art: 'https://img.freepik.com/premium-photo/fantasy-art-giant-bear-nature_421632-1563.jpg', _theme: 'animal_kingdom'
        }
    };

    if (typeof CardSets !== 'undefined') {
        Object.keys(NEW_ENCHANT_CARDS).forEach(k => {
            const theme = NEW_ENCHANT_CARDS[k]._theme;
            if (!CardSets[theme]) CardSets[theme] = {};
            CardSets[theme][k] = JSON.parse(JSON.stringify(NEW_ENCHANT_CARDS[k]));
        });
    }

    // 3. เพิ่มสูตร Enhance พร้อมรองรับ normalScrolls
    if (typeof ENHANCE_RECIPES !== 'undefined') {
        Object.assign(ENHANCE_RECIPES, {
            'Odin - Lord of the Einherjar': {
                baseCard: 'Odin|mythology',
                materials:[{name: 'Sword', theme: 'mythology', count: 10}],
                gems: 5, coins: 1000, normalScrolls: 10, result: 'Odin - Lord of the Einherjar|mythology'
            },
            'H.P. Lovecraft (Awakened)': {
                baseCard: 'H.P. Lovecraft|humanity',
                materials:[{name: 'Octopus', theme: 'animal_kingdom', count: 30}, {name: 'Polar Bear', theme: 'animal_kingdom', count: 20}],
                gems: 20, coins: 6666, normalScrolls: 25, result: 'H.P. Lovecraft (Awakened)|humanity'
            },
            'Elephant - Musth state': {
                baseCard: 'Elephant|animal_kingdom',
                materials:[{name: 'Apple', theme: 'animal_kingdom', count: 10}],
                gems: 5, coins: 1500, normalScrolls: 10, result: 'Elephant - Musth state|animal_kingdom'
            },
            'Julius Caesar - Conquest of Gaul': {
                baseCard: 'Julius Caesar|humanity',
                materials:[{name: 'Julius Caesar', theme: 'humanity', count: 2}, {name: 'Soldier', theme: 'humanity', count: 20}],
                gems: 20, coins: 2500, normalScrolls: 25, result: 'Julius Caesar - Conquest of Gaul|humanity'
            },
            'Attack rune - Rampage rune': {
                baseCard: 'Attack Rune|mythology',
                materials:[{name: 'Attack Rune', theme: 'mythology', count: 19}, {name: 'Defend Rune', theme: 'mythology', count: 10}],
                gems: 15, coins: 1500, normalScrolls: 10, result: 'Attack rune - Rampage rune|mythology'
            },
            'Defend rune - Aegis rune': {
                baseCard: 'Defend Rune|mythology',
                materials:[{name: 'Defend Rune', theme: 'mythology', count: 19}, {name: 'Attack Rune', theme: 'mythology', count: 10}],
                gems: 15, coins: 1500, normalScrolls: 10, result: 'Defend rune - Aegis rune|mythology'
            },
            'Emilia v2': {
                baseCard: 'Emilia|isekai_adventure',
                materials:[{name: 'Emilia', theme: 'isekai_adventure', count: 4}, {name: 'Subaru', theme: 'isekai_adventure', count: 10}],
                gems: 10, coins: 3000, normalScrolls: 25, result: 'Emilia v2|isekai_adventure'
            },
            'Soldier - SEAL Marshal': {
                baseCard: 'Soldier|humanity',
                materials:[{name: 'Soldier', theme: 'humanity', count: 29}, {name: 'Desert Eagle', theme: 'humanity', count: 10}, {name: 'Exo Skeleton Suit', theme: 'humanity', count: 10}],
                gems: 15, coins: 0, normalScrolls: 5, result: 'Soldier - SEAL Marshal|humanity'
            },
            'Fairy - Jade Empress': {
                baseCard: 'Fairy|mythology',
                materials:[{name: 'Fairy', theme: 'mythology', count: 9}, {name: 'Nature Realm Wand', theme: 'mythology', count: 10}, {name: 'Apple', theme: 'animal_kingdom', count: 10}],
                gems: 30, coins: 10000, normalScrolls: 30, result: 'Fairy - Jade Empress|mythology'
            },
            'Grizzly Bear - Mountain King': {
                baseCard: 'Grizzly Bear|animal_kingdom',
                materials:[{name: 'Grizzly Bear', theme: 'animal_kingdom', count: 9}, {name: 'Apple', theme: 'animal_kingdom', count: 10}, {name: 'Wild Kingdom', theme: 'animal_kingdom', count: 10}],
                gems: 0, coins: 1500, normalScrolls: 15, result: 'Grizzly Bear - Mountain King|animal_kingdom'
            }
        });
    }

    // 4. ระบบ Redeem Code
    if (typeof REDEEM_CODES !== 'undefined') {
        REDEEM_CODES['FREEEVOLE'] = { normalScrolls: 25, label: '📜 25 Normal Scrolls', oneTime: true };
        REDEEM_CODES['FREEENCHANCE'] = { normalScrolls: 25, bossKeys: 25, label: '📜 25 Normal Scrolls & 25 Boss Keys', oneTime: true };
    }

    if (typeof window.redeemCode === 'function') {
        const _origRdm_NScrl = window.redeemCode;
        window.redeemCode = function() {
            const raw = document.getElementById('redeem-input')?.value?.trim().toUpperCase();
            const reward = (typeof REDEEM_CODES !== 'undefined') ? REDEEM_CODES[raw] : null;
            if (reward && reward.normalScrolls) {
                const used = typeof getUsedCodes === 'function' ? getUsedCodes() :[];
                const msg = document.getElementById('redeem-msg');
                if (reward.oneTime && used.includes(raw)) {
                    if (msg) { msg.style.color='#f87171'; msg.textContent='❌ โค้ดนี้ใช้ไปแล้ว'; } return;
                }
                playerData.normalScrolls = (playerData.normalScrolls || 0) + reward.normalScrolls;
                if (reward.bossKeys) {
                    playerData.bossKeys = (playerData.bossKeys || 0) + reward.bossKeys;
                }
                if (typeof markCodeUsed === 'function') markCodeUsed(raw);
                if (typeof saveData === 'function') saveData();
                if (typeof updateHubUI === 'function') updateHubUI();
                
                if (msg) { msg.style.color='#fbbf24'; msg.textContent=`🎉 ได้รับ ${reward.label}!`; }
                if (typeof showToast === 'function') showToast(`🎁 รับ ${reward.label} สำเร็จ!`, '#fbbf24');
                document.getElementById('redeem-input').value = '';
                return;
            }
            _origRdm_NScrl.apply(this, arguments);
        };
    }

    // 5. Override หน้าต่าง Enhance ให้รองรับ Normal Scroll
    if (typeof window.openEnhanceModal === 'function') {
        window.openEnhanceModal = function(recipeKey) {
            const recipe = ENHANCE_RECIPES[recipeKey];
            const targetTheme = recipe.result.split('|')[1];
            const targetData = CardSets[targetTheme][recipeKey];
            const ownedBase = playerData.collection[recipe.baseCard] || 0;

            const hasMats = recipe.materials.every(m => (playerData.collection[`${m.name}|${m.theme}`]||0) >= m.count);
            const hasCoins = (playerData.coins||0) >= (recipe.coins||0);
            const hasGems = (playerData.gems||0) >= (recipe.gems||0);
            const hasNormalTk = recipe.rzNormalTokens ? ((playerData.rzNormalTokens||0) >= recipe.rzNormalTokens) : true;
            const hasNormalScroll = recipe.normalScrolls ? ((playerData.normalScrolls||0) >= recipe.normalScrolls) : true;
            
            const canDo = (ownedBase >= 1 && hasCoins && hasGems && hasNormalTk && hasNormalScroll && hasMats);

            const ov = document.createElement('div');
            ov.id = 'enhance-overlay';
            ov.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,0.9);z-index:100000;display:flex;align-items:center;justify-content:center;';
            ov.innerHTML = `
                <div style="background:linear-gradient(135deg,#1e1b4b,#0f172a);border:3px solid #7c3aed;border-radius:24px;padding:24px;max-width:380px;width:90%;text-align:center;">
                    <div style="font-size:1.5rem;font-weight:900;color:#a78bfa;margin-bottom:15px">✨ Card Evolution ✨</div>
                    <img src="${targetData.art}" style="width:120px;height:160px;border-radius:10px;border:2px solid #fbbf24;margin-bottom:10px;object-fit:cover">
                    <div style="color:white;font-weight:bold;margin-bottom:10px">${recipeKey}</div>
                    <div style="background:rgba(0,0,0,0.3);padding:10px;border-radius:10px;margin-bottom:10px;text-align:left;font-size:0.8rem">
                        ${recipe.materials.map(m => `<div style="color:${(playerData.collection[`${m.name}|${m.theme}`]||0) >= m.count ? '#4ade80':'#f87171'}">📦 ${m.name} : ${(playerData.collection[`${m.name}|${m.theme}`]||0)}/${m.count}</div>`).join('')}
                        ${recipe.coins > 0 ? `<div style="color:${hasCoins ? '#fbbf24':'#f87171'}">🪙 Coins: ${playerData.coins}/${recipe.coins}</div>` : ''}
                        ${recipe.gems > 0 ? `<div style="color:${hasGems ? '#93c5fd':'#f87171'}">💎 Gems: ${playerData.gems}/${recipe.gems}</div>` : ''}
                        ${recipe.rzNormalTokens > 0 ? `<div style="color:${hasNormalTk ? '#38bdf8':'#f87171'}">💠 RZ Normal Tokens: ${(playerData.rzNormalTokens||0)}/${recipe.rzNormalTokens}</div>` : ''}
                        ${recipe.normalScrolls > 0 ? `<div style="color:${hasNormalScroll ? '#fcd34d':'#f87171'}">📜 Normal Scrolls: ${(playerData.normalScrolls||0)}/${recipe.normalScrolls}</div>` : ''}
                    </div>
                    <div style="display:flex;gap:10px">
                        <button onclick="confirmEnhance('${recipeKey}')" ${canDo ? '' : 'disabled'} style="flex:1;background:${canDo?'#7c3aed':'#374151'};color:white;padding:12px;border-radius:10px;border:none;font-weight:bold;cursor:pointer">อัปเกรด</button>
                        <button onclick="document.getElementById('enhance-overlay').remove()" style="flex:1;background:#4b5563;color:white;padding:12px;border-radius:10px;border:none;cursor:pointer">ยกเลิก</button>
                    </div>
                </div>`;
            document.body.appendChild(ov);
        };

        window.confirmEnhance = function(recipeKey) {
            const recipe = ENHANCE_RECIPES[recipeKey];
            
            // 1. หักการ์ดหลัก
            playerData.collection[recipe.baseCard]--;
            if (playerData.collection[recipe.baseCard] <= 0) delete playerData.collection[recipe.baseCard];
            
            // 2. วนลูปหักวัตถุดิบทั้งหมด
            recipe.materials.forEach(m => {
                const key = `${m.name}|${m.theme}`;
                playerData.collection[key] -= m.count;
                if (playerData.collection[key] <= 0) delete playerData.collection[key];
            });
            
            // 3. หักเงินและเพชร
            if (recipe.coins) playerData.coins -= recipe.coins;
            if (recipe.gems) playerData.gems -= recipe.gems;
            if (recipe.rzNormalTokens) playerData.rzNormalTokens -= recipe.rzNormalTokens;
            if (recipe.normalScrolls) playerData.normalScrolls -= recipe.normalScrolls;
            
            // 4. มอบการ์ดใหม่
            playerData.collection[recipe.result] = (playerData.collection[recipe.result] || 0) + 1;
            
            if (typeof saveData === 'function') saveData();
            if (typeof updateHubUI === 'function') updateHubUI();
            if (typeof renderCollectionPanel === 'function') renderCollectionPanel();
            document.getElementById('enhance-overlay').remove();
            document.getElementById('col-card-modal')?.remove();
            if (typeof showToast === 'function') showToast(`🎉 อัปเกรดเป็น ${recipeKey} สำเร็จ!`, '#fbbf24');
        };
    }

    // 6. Hooks Mechanics การ์ดใหม่ทั้งหมด

    // ── triggerOnSummon ──
    if (typeof window.triggerOnSummon === 'function') {
        const _origSummon = window.triggerOnSummon;
        window.triggerOnSummon = function(card, pk) {
            const eff = card.originalName || card.name;
            const p = state.players[pk];
            const oppKey = pk === 'player' ? 'ai' : 'player';
            const opp = state.players[oppKey];

            if (eff === 'Odin - Lord of the Einherjar' && !card.silenced) {
                if (typeof log === 'function') log(`⚡ [Odin] รวบรวมสรรพาวุธ! สุ่มดึง Item 2 ใบจากเด็คขึ้นมือ`, 'text-blue-300 font-bold');
                const items = p.deck.filter(c => c.type === 'Item');
                let drawn = 0;
                for (let i = 0; i < 2 && items.length > 0; i++) {
                    const pick = items[Math.floor(Math.random() * items.length)];
                    const idx = p.deck.findIndex(c => c.id === pick.id);
                    if (idx !== -1) {
                        p.hand.push(p.deck.splice(idx, 1)[0]);
                        items.splice(items.findIndex(c => c.id === pick.id), 1);
                        drawn++;
                    }
                }
                if (drawn === 0 && typeof log === 'function') log(`[Odin] ไม่มี Item ในเด็คให้ดึง`, 'text-gray-500');
            }
            
            if (eff === 'H.P. Lovecraft (Awakened)' && !card.silenced) {
                if (typeof log === 'function') log(`🐙 "The oldest and strongest emotion of mankind is fear..."`, 'text-indigo-200 font-bold italic');
                if (p.field.length < (typeof getMaxFieldSlots === 'function' ? getMaxFieldSlots(pk) : 6)) {
                    const cthulhu = typeof createCardInstance === 'function' ? createCardInstance('Cthulhu', 'humanity') : {
                        id: 'card_' + Date.now(), name: 'Cthulhu', originalName: 'Cthulhu',
                        type: 'Character', cost: 0, atk: 12, hp: 4, maxHp: 4,
                        text: "ตาย: Lovecraft +7 ATK | Lovecraft ตาย: Cthulhu ATK x2", color: 'bg-green-950',
                        maxAttacks: 1, attacksLeft: 1, status: [], items:[]
                    };
                    p.field.push(cthulhu);
                    if (typeof log === 'function') log(`[Lovecraft Awakened] สร้าง Cthulhu Token 12/4!`, 'text-indigo-400 font-bold');
                }
            }

            if (eff === 'Yog-Sothoth' && !card.silenced) {
                if (typeof log === 'function') log(`👁️ [Yog-Sothoth] The Gate and the Key! อัญเชิญ Character สุ่ม 3 ตัวจากเด็ค!`, 'text-purple-400 font-bold');
                const chars = p.deck.filter(c => c.type === 'Character');
                let summoned = 0;
                for (let i = 0; i < 3 && chars.length > 0 && p.field.length < (typeof getMaxFieldSlots==='function'?getMaxFieldSlots(pk):6); i++) {
                    const pick = chars[Math.floor(Math.random() * chars.length)];
                    const idx = p.deck.findIndex(c => c.id === pick.id);
                    const s = p.deck.splice(idx, 1)[0];
                    s.attacksLeft = s.maxAttacks || 1;
                    p.field.push(s);
                    if (typeof triggerOnSummon === 'function') triggerOnSummon(s, pk);
                    summoned++;
                }
            }

            if (eff === 'Elephant - Musth state' && !card.silenced) {
                if (typeof log === 'function') log(`🐘 [Elephant] Musth State! ทำ 2 ดาเมจใส่ศัตรูทุกตัว!`, 'text-stone-400 font-bold');
                opp.field.forEach(c => { c.hp -= 2; });
                if (typeof checkDeath === 'function') checkDeath(oppKey);
            }

            if (eff === 'Julius Caesar - Conquest of Gaul' && !card.silenced) {
                if (typeof log === 'function') log(`🗡️[Caesar] Conquest of Gaul! บัฟเพื่อนทุกตัว +3/+3 ถาวร!`, 'text-amber-400 font-bold');
                p.field.forEach(c => {
                    if (c.id !== card.id) {
                        c.atk += 3; c.hp += 3; c.maxHp += 3;
                    }
                });
            }

            if (eff === 'Emilia v2' && !card.silenced) {
                if (typeof log === 'function') log(`❄️ [Emilia] พายุหิมะนิรันดร์! แช่แข็งศัตรูทุกตัว!`, 'text-sky-300 font-bold');
                opp.field.forEach(c => {
                    if (!c.tossakanImmune && !hasNatureImmune(oppKey)) {
                        if (c.status.includes('Freeze')) {
                            c.freezeTurns = (c.freezeTurns || 0) + 2;
                            c.hp -= 3;
                            if (typeof log === 'function') log(`❄️ ${c.name} ถูกแช่แข็งซ้ำ! +1 เทิร์น และโดน 3 ดาเมจ!`, 'text-sky-400');
                        } else {
                            c.status.push('Freeze');
                            c.freezeTurns = 2;
                        }
                    }
                });
                if (typeof checkDeath === 'function') checkDeath(oppKey);
            }

            if (eff === 'Soldier - SEAL Marshal' && !card.silenced) {
                const items = p.graveyard.filter(c => c.type === 'Item');
                if (items.length > 0) {
                    const rand = items[Math.floor(Math.random() * items.length)];
                    const idx = p.graveyard.findIndex(c => c.id === rand.id);
                    const item = p.graveyard.splice(idx, 1)[0];
                    card.items.push(item);
                    if (typeof log === 'function') log(`🎖️ [SEAL Marshal] สวมใส่ ${item.name} จากสุสาน!`, 'text-amber-300 font-bold');
                } else {
                    const allItems =[];
                    Object.keys(CardSets).forEach(th => {
                        Object.keys(CardSets[th]).forEach(k => {
                            if (CardSets[th][k].type === 'Item' && !CardSets[th][k].shopOnly) {
                                allItems.push({key: k, theme: th});
                            }
                        });
                    });
                    if (allItems.length > 0) {
                        const randItem = allItems[Math.floor(Math.random() * allItems.length)];
                        const itemCard = typeof createCardInstance === 'function' ? createCardInstance(randItem.key, randItem.theme) : null;
                        if (itemCard) {
                            card.items.push(itemCard);
                            if (typeof log === 'function') log(`🎖️[SEAL Marshal] สุ่มสวมใส่ ${itemCard.name} สำเร็จ!`, 'text-amber-300 font-bold');
                        }
                    }
                }
            }

            if (eff === 'Fairy - Jade Empress' && !card.silenced) {
                if (typeof log === 'function') log(`🧚 [Jade Empress] แสงสว่างแห่งชีวิต! Heal เต็มและล้าง CC ทีมเราทั้งหมด!`, 'text-emerald-400 font-bold');
                p.field.forEach(c => {
                    c.hp = (typeof getCharStats === 'function') ? getCharStats(c).maxHp : c.maxHp;
                    c.status = c.status.filter(s => !['Burn', 'Bleed', 'Paralyze', 'Freeze', 'Poison'].includes(s));
                    c.burnTurns = 0;
                    c.shalltearBleedTurns = 0;
                    c.paralyzeTurns = 0;
                    c.freezeTurns = 0;
                });
            }

            if (eff === 'Grizzly Bear - Mountain King' && !card.silenced) {
                if (typeof log === 'function') log(`🐻 [Mountain King] เสียงคำรามก้องภูเขา! จั่ว 5 ใบ!`, 'text-amber-500 font-bold');
                if (typeof drawCard === 'function') drawCard(pk, 5);
            }

            _origSummon.apply(this, arguments);
        };
    }

    // ── resolveEndPhase ──
    if (typeof window.resolveEndPhase === 'function') {
        const _origEnd = window.resolveEndPhase;
        window.resolveEndPhase = function(pk) {
            _origEnd(pk);
            const p = state.players[pk];

            p.field.forEach(c => {
                const eff = c.originalName || c.name;
                
                if (eff === 'Odin - Lord of the Einherjar' && !c.silenced && getCharStats(c).hp > 0) {
                    c.hp -= 2;
                    if (typeof log === 'function') log(`⚡[Odin] สละ 2 HP... บัฟเพื่อน 2 ตัว +2/+2!`, 'text-blue-400 font-bold');
                    const friends = p.field.filter(f => f.id !== c.id && getCharStats(f).hp > 0);
                    const targets = [...friends].sort(() => Math.random() - 0.5).slice(0, 2);
                    targets.forEach(t => {
                        t.atk += 2; t.hp += 2; t.maxHp += 2;
                    });
                    if (c.hp <= 0) c.isDyingProcessing = true;
                }

                if (eff === 'Azathoth' && !c.silenced && getCharStats(c).hp > 0) {
                    c.azathothTurns = (c.azathothTurns || 0) + 1;
                    if (typeof log === 'function') log(`🌌 [Azathoth] หลับใหลอยู่... (Turn ${c.azathothTurns}/10)`, 'text-purple-300');
                    if (c.azathothTurns >= 10) {
                        const oppKey = pk === 'player' ? 'ai' : 'player';
                        state.players[oppKey].hp -= 10;
                        if (typeof log === 'function') log(`🌌 [Azathoth] ตื่นขึ้นมา! ศัตรูรับ 10 ดาเมจทะลุ Base!`, 'text-purple-600 font-bold');
                        c.azathothTurns = 0;
                        if (typeof checkWinCondition === 'function') checkWinCondition();
                    }
                }

                if (eff === 'Emilia v2' && !c.silenced && getCharStats(c).hp > 0) {
                    if (Math.random() < 0.5) {
                        const spell = typeof createCardInstance === 'function' ? createCardInstance('Al Huma', 'isekai_adventure') : null;
                        if (spell) {
                            p.hand.push(spell);
                            if (typeof log === 'function') log(`❄️[Emilia v2] สร้างเวท Al Huma ขึ้นมือ!`, 'text-sky-300 font-bold');
                        }
                    }
                }
            });
            if (typeof checkDeath === 'function') checkDeath(pk);
        };
    }

    // ── checkDeath ──
    if (typeof window.checkDeath === 'function') {
        const _origDeath = window.checkDeath;
        window.checkDeath = function(pk) {
            const p = state.players[pk];
            const oppKey = pk === 'player' ? 'ai' : 'player';

            p.field.forEach(c => {
                if (getCharStats(c).hp <= 0 && !c.isDyingProcessing) {
                    const effName = c.originalName || c.name;

                    if (effName === 'Odin - Lord of the Einherjar') {
                        const enemies = state.players[oppKey].field.filter(ec => getCharStats(ec).hp > 0);
                        if (enemies.length > 0) {
                            const t = enemies[Math.floor(Math.random() * enemies.length)];
                            t.hp -= 5;
                            if (typeof log === 'function') log(`⚡ [Odin Death] ทำ 5 ดาเมจใส่ ${t.name}!`, 'text-blue-400 font-bold');
                        }
                    }

                    if (effName === 'H.P. Lovecraft (Awakened)') {
                        const spell = typeof createCardInstance === 'function' ? createCardInstance('Necronomicon', 'humanity') : null;
                        if (spell) {
                            p.hand.push(spell);
                            if (typeof log === 'function') log(`🐙[Lovecraft Death] ทิ้งคัมภีร์ Necronomicon ไว้บนมือคุณ!`, 'text-purple-400 font-bold');
                        }
                    }

                    if (effName === 'Nyarlathotep') {
                        const enemies = state.players[oppKey].field.filter(ec => getCharStats(ec).hp > 0);
                        if (enemies.length > 0 && p.field.length < (typeof getMaxFieldSlots==='function'?getMaxFieldSlots(pk):6)) {
                            const t = enemies[Math.floor(Math.random() * enemies.length)];
                            const clone = JSON.parse(JSON.stringify(t));
                            clone.id = 'card_' + Date.now() + Math.floor(Math.random()*1000);
                            clone.hp = clone.maxHp + 3;
                            clone.maxHp += 3;
                            clone.atk += 3;
                            clone.status =[];
                            clone.items =[];
                            clone.attacksLeft = clone.maxAttacks || 1;
                            clone.isDyingProcessing = false;
                            p.field.push(clone);
                            if (typeof log === 'function') log(`🌌 [Nyarlathotep Death] คืนชีพในร่างของ ${t.name} พร้อม +3/+3!`, 'text-purple-500 font-bold');
                        }
                    }

                    if (effName === 'Julius Caesar - Conquest of Gaul') {
                        p.cost += 3;
                        if (typeof log === 'function') log(`🗡️[Caesar Death] ได้รับ 3 Cost!`, 'text-amber-400 font-bold');
                    }

                    if (effName === 'Soldier - SEAL Marshal') {
                        const enemies = state.players[oppKey].field.filter(ec => getCharStats(ec).hp > 0);
                        if (enemies.length > 0) {
                            enemies.sort((a, b) => (a.cost || 0) - (b.cost || 0));
                            const lowestCost = enemies[0].cost || 0;
                            const lowestEnemies = enemies.filter(ec => (ec.cost || 0) === lowestCost);
                            const t = lowestEnemies[Math.floor(Math.random() * lowestEnemies.length)];
                            t.hp -= 5;
                            if (typeof log === 'function') log(`🎖️[SEAL Marshal Death] ปลิดชีพเป้าหมายอ่อนแอ! 5 ดาเมจใส่ ${t.name}!`, 'text-red-400 font-bold');
                        }
                    }

                    if (effName === 'Fairy - Jade Empress') {
                        p.hp = Math.min(20, p.hp + 4);
                        if (typeof log === 'function') log(`🧚[Jade Empress Death] ละอองแสงสุดท้าย... Base +4 HP!`, 'text-emerald-300 font-bold');
                    }
                }
            });
            _origDeath.apply(this, arguments);
        };
    }

    // ── executeNonTargetAction (Necronomicon, Al Huma) ──
    if (typeof window.executeNonTargetAction === 'function') {
        const _origExec = window.executeNonTargetAction;
        window.executeNonTargetAction = function(card, pk) {
            const p = state.players[pk];
            const oppKey = pk === 'player' ? 'ai' : 'player';
            const opp = state.players[oppKey];

            if (card.name === 'Necronomicon') {
                const gods =['Azathoth', 'Nyarlathotep', 'Yog-Sothoth'];
                const pick = gods[Math.floor(Math.random() * gods.length)];
                const godCard = typeof createCardInstance === 'function' ? createCardInstance(pick, 'humanity') : null;
                
                if (godCard && p.field.length < (typeof getMaxFieldSlots==='function'?getMaxFieldSlots(pk):6)) {
                    godCard.attacksLeft = godCard.maxAttacks || 1;
                    p.field.push(godCard);
                    if (typeof log === 'function') log(`🐙 [Necronomicon] อัญเชิญเทพโบราณ: ${pick}!`, 'text-purple-500 font-bold');
                    if (typeof window.triggerOnSummon === 'function') window.triggerOnSummon(godCard, pk);
                } else {
                    if (typeof log === 'function') log(`🐙 [Necronomicon] สนามเต็ม! ไม่สามารถอัญเชิญได้`, 'text-gray-500');
                }
                p.graveyard.push(card);
                return;
            }
            
            if (card.name === 'Al Huma') {
                const enemies = opp.field.filter(c => getCharStats(c).hp > 0 && !c.isSpellImmune);
                const targets = [...enemies].sort(() => Math.random() - 0.5).slice(0, 2);
                if (targets.length > 0) {
                    targets.forEach(t => {
                        if (t.status.includes('Freeze')) {
                            t.hp -= 7; // 3 + 4
                            t.freezeTurns = (t.freezeTurns || 0) + 2;
                            if (typeof log === 'function') log(`❄️ [Al Huma] คริติคอลหิมะ! ${t.name} รับ 7 ดาเมจ และถูกแช่แข็งซ้ำ!`, 'text-sky-400 font-bold');
                        } else {
                            t.hp -= 3;
                            if (!t.tossakanImmune && !hasNatureImmune(oppKey)) {
                                t.status.push('Freeze');
                                t.freezeTurns = 2;
                            }
                            if (typeof log === 'function') log(`❄️ [Al Huma] 3 ดาเมจ และแช่แข็ง ${t.name}!`, 'text-sky-300 font-bold');
                        }
                    });
                    if (typeof checkDeath === 'function') checkDeath(oppKey);
                } else {
                    if (typeof log === 'function') log(`❄️[Al Huma] ไม่มีเป้าหมายให้แช่แข็ง`, 'text-gray-500');
                }
                p.graveyard.push(card);
                return;
            }
            
            _origExec.apply(this, arguments);
        };
    }

    // ── initiateAttack (Damage Intercept, On Attack Kills, Evade) ──
    if (typeof window.initiateAttack === 'function') {
        const _origAtk2 = window.initiateAttack;
        window.initiateAttack = function(atkId, tgtId, isBase) {
            if (typeof state === 'undefined' || isBase) return _origAtk2.apply(this, arguments);

            const pk = state.currentTurn;
            const oppKey = pk === 'player' ? 'ai' : 'player';
            const attacker = state.players[pk].field.find(c => c.id === atkId);
            let target = state.players[oppKey].field.find(c => c.id === tgtId);

            if (attacker && target) {
                const aName = attacker.originalName || attacker.name;
                const tName = target.originalName || target.name;
                
                if (tName === 'Emilia v2') {
                    const hasSubaru = state.players[oppKey].field.some(c => {
                        const n = c.originalName || c.name;
                        return (n === 'Subaru' || n === 'Subaru v2') && getCharStats(c).hp > 0;
                    });
                    const others = state.players[oppKey].field.filter(c => c.id !== target.id && getCharStats(c).hp > 0);
                    if (hasSubaru && others.length > 0) {
                        if (typeof log === 'function') log("❄️ [Emilia v2] เป็นเป้าหมายสุดท้าย! ต้องกำจัด Subaru ก่อน", "text-sky-300");
                        attacker.attacksLeft += 1;
                        state.selectedCardId = null;
                        if(typeof updateUI === 'function') updateUI();
                        return;
                    }
                }

                if (aName === 'Grizzly Bear - Mountain King' && !attacker.silenced && Math.random() < 0.5) {
                    attacker.atk *= 2;
                    attacker._grizzlyBoost = true;
                    if (typeof log === 'function') log(`🐻 [Mountain King] พลังหมีภูเขา! ดาเมจ x2!`, 'text-amber-400 font-bold');
                }

                if (aName === 'Elephant - Musth state' && !attacker.silenced && Math.random() < 0.5) {
                    attacker.atk += 5;
                    attacker._elephantBoost = true;
                    if (typeof log === 'function') log(`🐘 [Elephant] Musth State! กระทืบแรงขึ้น +5 ดาเมจ!`, 'text-stone-400 font-bold');
                }
            }

            // Snapshot HP for damage interception (Fairy - Jade Empress, Grizzly Bear)
            let snapshot = [];
            state.players[oppKey].field.forEach(c => {
                snapshot.push({ id: c.id, hp: c.hp, maxHp: c.maxHp });
            });

            _origAtk2.apply(this, arguments);

            if (attacker && attacker._grizzlyBoost) {
                attacker.atk = Math.floor(attacker.atk / 2);
                attacker._grizzlyBoost = false;
            }
            if (attacker && attacker._elephantBoost) {
                attacker.atk -= 5;
                attacker._elephantBoost = false;
            }

            let anyAllyTookDmg = false;
            snapshot.forEach(snap => {
                let card = null;
                let currentZone = 'field';
['field', 'graveyard', 'spaceZone', 'hand'].forEach(z => {
                    const found = state.players[oppKey][z].find(c => c.id === snap.id);
                    if (found) { card = found; currentZone = z; }
                });

                if (card) {
                    let dmgTaken = snap.hp - card.hp;
                    if (dmgTaken > 0) {
                        const cName = card.originalName || card.name;
                        
                        if (cName === 'Grizzly Bear - Mountain King' && !card.silenced) {
                            if (card.grizzlyDmgReduceTurn !== state.totalTurns) {
                                card.grizzlyDmgReduceTurn = state.totalTurns;
                                card.grizzlyDmgReduceCount = 0;
                            }
                            if (card.grizzlyDmgReduceCount < 2 && Math.random() < 0.5) {
                                dmgTaken = 1;
                                card.grizzlyDmgReduceCount++;
                                card.hp = snap.hp - dmgTaken;
                                if (typeof log === 'function') log(`🐻 [Mountain King] หนังหนา! ลดดาเมจเหลือ 1!`, 'text-amber-400 font-bold');
                                
                                if (card.hp > 0 && currentZone === 'graveyard') {
                                    state.players[oppKey].graveyard = state.players[oppKey].graveyard.filter(c => c.id !== card.id);
                                    state.players[oppKey].field.push(card);
                                    card.isDyingProcessing = false;
                                }
                            }
                        }

                        if (dmgTaken > 0) anyAllyTookDmg = true;
                    }
                }
            });

            // Fairy - Jade Empress healing
            if (anyAllyTookDmg) {
                const jadeEmpresses = state.players[oppKey].field.filter(c => {
                    const n = c.originalName || c.name;
                    return n === 'Fairy - Jade Empress' && c.hp > 0 && !c.silenced;
                });
                if (jadeEmpresses.length > 0) {
                    state.players[oppKey].field.forEach(c => {
                        const snap = snapshot.find(s => s.id === c.id);
                        if (snap && c.hp < c.maxHp && c.hp > 0 && snap.hp > c.hp) {
                            c.hp = Math.min(c.maxHp, c.hp + 5);
                            if (typeof log === 'function') log(`🧚[Jade Empress] ละอองแสงฟื้นฟู! ${c.name} +5 HP!`, 'text-emerald-300 font-bold');
                        }
                    });
                }
            }

            // On Attack Kills (Caesar, Jade Empress)
            if (attacker && target) {
                const aName = attacker.originalName || attacker.name;
                const targetDied = !state.players[oppKey].field.some(c => c.id === target.id) || target.hp <= 0;
                
                if (targetDied) {
                    if (aName === 'Fairy - Jade Empress' && !attacker.silenced) {
                        state.players[pk].field.forEach(c => {
                            if (c.hp > 0) {
                                c.maxHp += 2;
                                c.hp += 2;
                            }
                        });
                        if (typeof log === 'function') log(`🧚 [Jade Empress] สังหารศัตรู! พรแห่งสวรรค์ +2 Max HP ให้ทีม!`, 'text-emerald-400 font-bold');
                    }
                    
                    if (aName === 'Julius Caesar - Conquest of Gaul' && !attacker.silenced) {
                        const otherEnemies = state.players[oppKey].field.filter(ec => getCharStats(ec).hp > 0);
                        if (otherEnemies.length > 0) {
                            const t = otherEnemies[Math.floor(Math.random() * otherEnemies.length)];
                            t.hp -= 4;
                            if (typeof log === 'function') log(`🗡️ [Caesar] สังหารสำเร็จ! โจมตีต่อเนื่อง 4 ดาเมจใส่ ${t.name}!`, 'text-amber-400 font-bold');
                        }
                    }
                }
            }

            if (typeof checkDeath === 'function') checkDeath(oppKey);
        };
    }

    // ── hasTrueDamage ──
    if (typeof window.hasTrueDamage === 'function') {
        const _origTrueDmg = window.hasTrueDamage;
        window.hasTrueDamage = function(card) {
            const effName = card.originalName || card.name;
            if (effName === 'Julius Caesar - Conquest of Gaul') return true;
            return _origTrueDmg.apply(this, arguments);
        };
    }

    // ── getCharStats (Runes, Elephant Reduction, Puck boost for Emilia) ──
    if (typeof window.getCharStats === 'function') {
        const _origStats = window.getCharStats;
        window.getCharStats = function(char) {
            let stats = _origStats.apply(this, arguments);
            if (char.silenced) return stats;

            const effName = char.originalName || char.name;
            const ownerKey = state.players.player.field.some(c => c.id === char.id) ? 'player' : 'ai';
            const ownField = state.players[ownerKey].field;

            if (effName === 'Elephant - Musth state') {
                stats.damageMultiplier = (stats.damageMultiplier || 1) * 0.7;
            }
            
            if (effName === 'Puck') {
                const hasEmiliaV2 = ownField.some(c => (c.originalName || c.name) === 'Emilia v2' && c.hp > 0);
                if (hasEmiliaV2) stats.atk += 4;
            }

            if (char.items && typeof isItemSuppressed === 'function' && !isItemSuppressed()) {
                let rampageCount = 0;
                let aegisCount = 0;
                char.items.forEach(item => {
                    if (item.name === 'Attack rune - Rampage rune') rampageCount++;
                    if (item.name === 'Defend rune - Aegis rune') aegisCount++;
                });

                if (rampageCount === 1) { stats.atk += 3; }
                else if (rampageCount === 2) { stats.atk += 7; stats.maxHp += 4; stats.hp += 4; }
                else if (rampageCount >= 3) { stats.atk += 15; stats.maxHp += 10; stats.hp += 10; }

                if (aegisCount === 1) { stats.maxHp += 4; stats.hp += 4; }
                else if (aegisCount === 2) { stats.maxHp += 9; stats.hp += 9; stats.atk += 3; }
                else if (aegisCount >= 3) { stats.maxHp += 20; stats.hp += 20; stats.atk += 8; }
            }

            return stats;
        };
    }

    // ============================================================
    // HOTFIX: Firebase Save Fix, Reinhard FP Immunity, Random Summon
    // ============================================================

    // --------------------------------------------------------
    // FIX 1: ซ่อมบัค Firebase เซฟการ์ดที่มีจุด (.) และแก้ปัญหาชื่อกลายเป็น %2E
    // --------------------------------------------------------

    // 1a. ซ่อมชื่อการ์ดที่พังไปแล้วในเครื่องให้กลับมาเป็นปกติ
    if (typeof playerData !== 'undefined' && playerData.collection) {
        const _restoredCol = {};
        for (const k in playerData.collection) {
            const rk = k.replace(/%2E/g, '.').replace(/%24/g, '$').replace(/%23/g, '#').replace(/%5B/g, '[').replace(/%5D/g, ']');
            _restoredCol[rk] = playerData.collection[k];
        }
        playerData.collection = _restoredCol;
    }

    // 1b. เซฟลงเครื่องด้วยชื่อปกติ — เซฟลง Cloud ค่อยแปลงจุด (ทำใน Object ใหม่ ไม่กวนของเดิม)
    if (typeof window.saveData === 'function') {
        window.saveData = function() {
            try { localStorage.setItem(SAVE_KEY, JSON.stringify(playerData)); } catch(e) {}
            if (typeof db !== 'undefined' && db && typeof currentUser !== 'undefined' && currentUser && !currentUser.isAnonymous) {
                const firebaseData = JSON.parse(JSON.stringify(playerData));
                const safeCollection = {};
                for (const k in firebaseData.collection) {
                    const safeKey = k.replace(/\./g, '%2E').replace(/\$/g, '%24').replace(/#/g, '%23').replace(/\[/g, '%5B').replace(/\]/g, '%5D');
                    safeCollection[safeKey] = firebaseData.collection[k];
                }
                firebaseData.collection = safeCollection;
                try { db.ref('playerSave/' + currentUser.uid).set(firebaseData); } catch(e) {}
            }
        };
    }

    // 1c. โหลดจาก Cloud แปลง %2E กลับเป็นจุดก่อนใช้งาน
    if (typeof window.loadPlayerDataFromFirebase === 'function') {
        window.loadPlayerDataFromFirebase = async function(uid) {
            if (typeof db === 'undefined' || !db || !uid) return;
            try {
                const snap = await db.ref('playerSave/' + uid).get();
                if (!snap.exists()) {
                    saveData();
                    if (typeof showToast === 'function') showToast('☁️ Progress บันทึกขึ้น Cloud แล้ว!', '#4ade80');
                    return;
                }
                let cloudData = snap.val();
                if (cloudData.collection) {
                    const restoredCollection = {};
                    for (const k in cloudData.collection) {
                        const restoredKey = k.replace(/%2E/g, '.').replace(/%24/g, '$').replace(/%23/g, '#').replace(/%5B/g, '[').replace(/%5D/g, ']');
                        restoredCollection[restoredKey] = cloudData.collection[k];
                    }
                    cloudData.collection = restoredCollection;
                }
                const cloudTotal = Object.values(cloudData.collection || {}).reduce((a, b) => a + b, 0);
                const localTotal = Object.values(playerData.collection || {}).reduce((a, b) => a + b, 0);
                if (cloudTotal >= localTotal) {
                    playerData = typeof migratePlayerData === 'function' ? migratePlayerData(cloudData) : cloudData;
                    try { localStorage.setItem(SAVE_KEY, JSON.stringify(playerData)); } catch(e) {}
                    if (typeof showToast === 'function') showToast('☁️ โหลด Progress จาก Cloud สำเร็จ!', '#60a5fa');
                } else {
                    saveData();
                    if (typeof showToast === 'function') showToast('☁️ Sync Progress ขึ้น Cloud สำเร็จ!', '#4ade80');
                }
                if (typeof updateHubUI === 'function') updateHubUI();
                if (typeof checkCollectionMilestones === 'function') checkCollectionMilestones();
            } catch(e) {
                console.error('[CloudSave] Error:', e);
            }
        };
    }

    // --------------------------------------------------------
    // FIX 2: Reinhard (Full Power) — กันดาเมจหมู่ + บัฟจบเทิร์น
    // --------------------------------------------------------
    function applyReinhardImmunity(fn, context) {
        return function(...args) {
            if (typeof state === 'undefined') return fn.apply(this, args);
            let preHp = {};['player', 'ai'].forEach(pk => {
                state.players[pk].field.forEach(c => { preHp[c.id] = c.hp; });
            });
            const result = fn.apply(this, args);
            ['player', 'ai'].forEach(pk => {
                state.players[pk].field.forEach(c => {
                    if (preHp[c.id] !== undefined && c.hp < preHp[c.id]) {
                        const effName = c.originalName || c.name;
                        if (effName === 'Reinhard (Full Power)') {
                            if (context === 'spell' || context === 'skill' || context === 'status') {
                                c.hp = preHp[c.id];
                                if (typeof log === 'function') log(`⚔️[Reinhard FP] กายาแห่งนักบุญดาบ! ไม่รับดาเมจจากเวทมนตร์ (Immune)`, 'text-yellow-400 font-bold');
                            }
                        }
                    }
                });
            });
            return result;
        };
    }

    // FIX 3: Random Summon — ไม่สุ่มเจอการ์ด shopOnly / บอส / ร่าง Evolve
    if (typeof window.executeNonTargetAction === 'function') {
        const _origExec = window.executeNonTargetAction;
        window.executeNonTargetAction = applyReinhardImmunity(function(card, pk) {
            if (card.name === 'Random Summon') {
                const p = state.players[pk];
                if (p.field.length < (typeof getMaxFieldSlots === 'function' ? getMaxFieldSlots(pk) : 6)) {
                    const allCharNames = Object.keys(CardSets[selectedPlayerTheme]).filter(k => {
                        const data = CardSets[selectedPlayerTheme][k];
                        return data.type === 'Character' && !data.shopOnly && !data.isChampion && !data.isDungeonBoss && !data.isDungeonBoss2;
                    });
                    if (allCharNames.length > 0) {
                        const randomName = allCharNames[Math.floor(Math.random() * allCharNames.length)];
                        const newChar = typeof createCardInstance === 'function' ? createCardInstance(randomName, selectedPlayerTheme) : null;
                        if (newChar) {
                            newChar.attacksLeft = newChar.maxAttacks || 1;
                            p.field.push(newChar);
                            if (typeof log === 'function') log(`[Action] Random Summon! อัญเชิญ ${newChar.name} ลงสู่สนาม!`, 'text-indigo-300 font-bold');
                            if (typeof window.triggerOnSummon === 'function') window.triggerOnSummon(newChar, pk);
                        }
                    }
                }
                p.graveyard.push(card);
                return;
            }
            return _origExec.apply(this, arguments);
        }, 'spell');
    }

    if (typeof window.resolveTargetedPlay === 'function') {
        window.resolveTargetedPlay = applyReinhardImmunity(window.resolveTargetedPlay, 'spell');
    }
    if (typeof window.triggerOnSummon === 'function') {
        window.triggerOnSummon = applyReinhardImmunity(window.triggerOnSummon, 'skill');
    }

    // Reinhard จบเทิร์น: สุ่มรับพร +3
    if (typeof window.resolveEndPhase === 'function') {
        const _origEndPhase = window.resolveEndPhase;
        window.resolveEndPhase = function(pk) {
            _origEndPhase.apply(this, arguments);
            const p = state.players[pk];
            p.field.forEach(c => {
                const eff = c.originalName || c.name;
                if (eff === 'Reinhard (Full Power)' && !c.silenced && getCharStats(c).hp > 0) {
                    const roll = Math.floor(Math.random() * 3);
                    if (roll === 0) {
                        c.maxHp += 3; c.hp += 3;
                        if (typeof log === 'function') log(`⚔️ [Reinhard FP] รับพรจากสวรรค์! Max HP +3`, 'text-yellow-300 font-bold');
                    } else if (roll === 1) {
                        c.atk += 3;
                        if (typeof log === 'function') log(`⚔️ [Reinhard FP] รับพรจากสวรรค์! ATK +3`, 'text-yellow-300 font-bold');
                    } else {
                        c.atk += 3; c.maxHp += 3; c.hp += 3;
                        if (typeof log === 'function') log(`⚔️ [Reinhard FP] รับพรแห่งนักบุญดาบสมบูรณ์! ATK/HP +3`, 'text-yellow-400 font-bold');
                    }
                }
            });
        };
    }

});
