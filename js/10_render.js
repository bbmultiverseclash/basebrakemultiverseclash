// ============================================================
// 10_render.js — UI rendering: updateUI, renderCard, renderField, graveyard
// ============================================================
        function updateUI() {
            checkOngoingAuras();

            // ── Online/Draft P2 (Guest): ใช้ renderForP2 ทั้งหมด ──
            if ((gameMode === 'online' || gameMode === 'draft') && myRole === 'ai') {
                renderForP2();
                return;
            }

            const isLocal = gameMode === 'local';
            document.querySelector('#ai-base-ui .text-xs').innerText = isLocal ? 'P2 BASE' : 'AI BASE';
            document.querySelector('#player-base-ui .text-xs').innerText = isLocal ? 'P1 BASE' : 'PLAYER BASE';
            document.getElementById('ai-hand-label').innerText = isLocal ? 'P2 HAND' : 'AI HAND';

            document.getElementById('player-hp').innerText = state.players.player.hp;
            document.getElementById('ai-hp').innerText = state.players.ai.hp;
            document.getElementById('player-cost').innerText = isChaosMode ? '∞' : state.players.player.cost;
            document.getElementById('ai-cost').innerText = isChaosMode ? '∞' : state.players.ai.cost;
            
            document.getElementById('player-deck-count').innerText = state.players.player.deck.length;
            document.getElementById('ai-deck-count').innerText = state.players.ai.deck.length;
            document.getElementById('ai-hand-count').innerText = `${state.players.ai.hand.length} Cards`;
            
            document.getElementById('player-gy-count').innerText = state.players.player.graveyard.length;
            document.getElementById('ai-gy-count').innerText = state.players.ai.graveyard.length;

            // Space Zone counts
            document.getElementById('player-sz-count').innerText = state.players.player.spaceZone.length;
            document.getElementById('ai-sz-count').innerText = state.players.ai.spaceZone.length;

            let turnName = state.currentTurn === 'player' 
                ? (isLocal ? 'P1' : 'PLAYER') 
                : (isLocal ? 'P2' : 'AI');
            document.getElementById('turn-indicator').innerText = `TURN ${state.totalTurns} (${turnName})`;

            renderHand();
            renderField('ai-field', state.players.ai.field, 'ai');
            renderField('player-field', state.players.player.field, 'player');
            renderFieldCard('player-field-zone', state.sharedFieldCard);
            renderFieldCard('ai-field-zone', state.sharedFieldCard);

            const btn = document.getElementById('btn-next-phase');
            let showBtn;
            if (gameMode === 'online' || gameMode === 'draft') {
                // P1 Host: แสดงปุ่มเฉพาะตาของ player เท่านั้น
                showBtn = !state.targeting.active && state.currentTurn === 'player';
            } else if (gameMode === 'ai') {
                showBtn = !state.targeting.active && state.currentTurn === 'player';
            } else {
                showBtn = !state.targeting.active;
            }
            btn.style.display = showBtn ? 'block' : 'none';
            if (showBtn) btn.innerText = state.phase === 'MAIN' ? 'เข้าสู่ BATTLE PHASE' : 'จบเทิร์น';

            // Online: sync state และ update indicator
            pushStateToFirebase();
            updateOnlineTurnIndicator();
        }

        function renderHand() {
            const handZone = document.getElementById('player-hand');
            handZone.innerHTML = '';
            // online/draft P2 ใช้ key 'ai' แต่ต้องเห็นมือตัวเอง
            let handPlayerKey;
            if (gameMode === 'online' || gameMode === 'draft') {
                handPlayerKey = myRole; // 'player' หรือ 'ai'
            } else if (gameMode === 'local') {
                handPlayerKey = state.currentTurn;
            } else {
                handPlayerKey = 'player';
            }
            const p = state.players[handPlayerKey];

            p.hand.forEach(c => {
                if (!c) return; // กัน slot ว่างใน hand ทำให้ render พัง
                const actualCost = getActualCost(c, handPlayerKey);
                const el = renderCard(c, true, actualCost);

                const canPlay = state.phase === 'MAIN'
                              && state.currentTurn === handPlayerKey
                              && !state.targeting.active
                              && (isChaosMode || actualCost <= p.cost)
                              && (c.type !== 'Character' || p.field.length < getMaxFieldSlots(handPlayerKey));

                if (canPlay) {
                    el.classList.add('cursor-pointer', 'hover:border-green-400', 'border-2', 'border-transparent');
                    el.onclick = () => playCard(handPlayerKey, c.id);
                } else {
                    el.classList.add('opacity-70', 'cursor-not-allowed');
                }

                if (state.targeting.active && state.targeting.sourceCardId === c.id) {
                    el.classList.add('selected');
                    el.classList.remove('opacity-70');
                }

                handZone.appendChild(el);
            });
        }

        function renderField(containerId, cards, owner) {
            const container = document.getElementById(containerId);
            container.innerHTML = '';
            cards.forEach(c => {
                const el = renderCard(c, false, c.cost, getCharStats(c));

                if (state.targeting.active) {
                    if (state.targeting.validTargets.includes(c.id)) {
                        el.classList.add('valid-target', 'cursor-pointer');
                        el.onclick = () => resolveTargetedPlay(state.targeting.sourcePlayer || 'player', state.targeting.sourceCardId, c.id);
                    } else {
                        el.classList.add('invalid-target');
                    }
                } else {
                    // ตัดสินว่า "เจ้าของ" ฝั่งนี้คือผู้เล่นคนไหน
                    const isOnlineOrDraft = (gameMode === 'online' || gameMode === 'draft');
                    const isMyField = isOnlineOrDraft ? (owner === myRole) : (state.currentTurn === owner);
                    // [FIX] ใน AI mode ป้องกัน player คลิกการ์ด AI ได้ระหว่าง AI BATTLE phase
                    const canControl = isOnlineOrDraft
                        ? (owner === myRole && state.currentTurn === myRole)
                        : (state.currentTurn === owner && (gameMode !== 'ai' || owner === 'player'));

                    if (canControl && state.phase === 'BATTLE') {
                        if (c.attacksLeft > 0 && getCharStats(c).hp > 0) {
                            el.classList.add('can-attack');
                            if (state.selectedCardId === c.id) el.classList.add('selected');
                            el.onclick = () => { state.selectedCardId = c.id; updateUI(); };
                        } else {
                            el.classList.add('exhausted');
                        }
                    }

                    // เป้าหมาย: ฝั่งตรงข้าม
                    const isOpponentField = isOnlineOrDraft ? (owner !== myRole) : (owner !== state.currentTurn);
                    if (state.selectedCardId && state.phase === 'BATTLE' && isOpponentField) {
                        const oppP = state.players[owner];
                        const effName = (c.name.startsWith('Shadow Token') || c.name.startsWith('Shadow army') || c.name.includes('Loki Clone')) ? c.originalName : c.name;
                        const isShionProtected = effName === 'Sinon' && oppP.field.length > 1;
                        const isKingProtected  = effName === 'King'  && oppP.field.filter(cc => getCharStats(cc).hp > 0).length > 1;
                        const isF35Untargetable = !isItemSuppressed() && c.items && c.items.some(i => i.name === 'F-35') && oppP.field.filter(cc => cc.id !== c.id && getCharStats(cc).hp > 0).length > 0;
                        if (!isShionProtected && !isKingProtected && !isF35Untargetable) {
                            el.classList.add('cursor-crosshair', 'hover:border-red-500', 'border-2', 'border-transparent');
                            el.onclick = () => initiateAttack(state.selectedCardId, c.id, false);
                        } else {
                            el.style.opacity = '0.7';
                            el.title = isF35Untargetable ? '✈️ F-35 Untargetable!' : isShionProtected ? 'Sinon ถูกปกป้อง!' : 'King เป็นเป้าหมายสุดท้าย!';
                        }
                    }
                }

                container.appendChild(el);
            });
        }

        function renderFieldCard(containerId, card) {
            const container = document.getElementById(containerId);
            container.innerHTML = '';
            if (card) {
                const div = document.createElement('div');
                // ถ้ามีรูป ใช้ full-art style
                if (card.art) {
                    div.className = `card field-card full-art text-white rounded shadow`;
                    div.style.backgroundImage = `url('${card.art}')`;
                } else {
                    div.className = `card field-card ${card.color} text-white rounded p-1 flex flex-col justify-center items-center text-center shadow`;
                }
                div.innerHTML = `
                    <div style="position:absolute;bottom:0;left:0;right:0;padding:3px 4px;z-index:2;">
                        <div class="text-[0.6rem] font-bold name" style="color:#fff;text-shadow:0 0 6px #000,1px 1px 0 #000,-1px -1px 0 #000;">${card.name}</div>
                        <div class="text-[0.4rem]" style="color:#fde68a;text-shadow:0 0 4px #000;line-height:1.2;">${card.text.substring(0,60)}${card.text.length>60?'...':''}</div>
                    </div>`;
                container.appendChild(div);
            }
            // อัปเดต background ของ field zones
            updateFieldZoneBackground(card);
        }

        const FIELD_CARD_ART = {
            'Throne of the Kings': 'https://files.catbox.moe/3t0pdo.jpg',
            'Jura Tempest':         'https://i.pinimg.com/736x/0d/dc/8d/0ddc8d739e7aa70f1bafecef8ce4a4fa.jpg',
            'Wild Kingdom':        'https://images.unsplash.com/photo-1516426122078-c23e76319801?w=800&q=80',
            'Ruined Asguard':      'https://images.unsplash.com/photo-1589659632731-81891b9b3e51?w=800&q=80',
            'Holy Grail':          'https://images.unsplash.com/photo-1529778873920-4da4926a72c2?w=800&q=80',
            'Lego Floor':          'https://images.unsplash.com/photo-1585366119957-e9730b6d0f60?w=800&q=80',
            'Chess Board':         'https://images.unsplash.com/photo-1611195974226-a6a9be9dd763?w=800&q=80',
        };

        function updateFieldZoneBackground(card) {
            const zones = ['player-field', 'ai-field'];
            zones.forEach(zId => {
                const z = document.getElementById(zId);
                if (!z) return;
                if (card && card.art) {
                    z.style.backgroundImage = `url('${card.art}')`;
                    z.classList.add('has-field-bg');
                    z.style.borderColor = '#fbd38d';
                    z.style.borderWidth = '2px';
                    z.style.borderStyle = 'solid';
                } else if (card) {
                    // ไม่มีรูปแต่มีฟิลด์ — ใช้ gradient
                    z.style.backgroundImage = '';
                    z.classList.add('has-field-bg');
                    z.style.borderColor = '#fbd38d';
                    z.style.borderWidth = '2px';
                    z.style.borderStyle = 'solid';
                } else {
                    z.style.backgroundImage = '';
                    z.style.borderColor = '';
                    z.style.borderWidth = '';
                    z.classList.remove('has-field-bg');
                }
            });
            // อัปเดต field label ทั้งสอง zone
            ['ai-field-label','player-field-label'].forEach(lId => {
                const lbl = document.getElementById(lId);
                if (lbl) lbl.textContent = card ? `[${card.name}]` : '';
            });
        }

        function renderCard(card, inHand, displayCost, currentStats = null) {
            if (!card) {
                const div = document.createElement('div');
                div.className = 'card bg-gray-900 text-white rounded-lg p-2 flex flex-col justify-between relative shadow-lg border border-gray-600 opacity-50';
                div.innerText = 'Invalid card';
                return div;
            }
            const div = document.createElement('div');
            
            let classes = `card ${card.color} text-white rounded-lg p-2 flex flex-col justify-between relative shadow-lg border border-gray-600`;
            if (card.art) {
                classes += ' full-art';
                div.style.backgroundImage = `url('${card.art}')`;
            }
            
            div.className = classes;
            div.dataset.id = card.id;
            
            let statusHTML = '';
            if (card.status && card.status.length > 0) {
                const icons = card.status.map(s => StatusIcons[s] || s).join('');
                statusHTML += `<div class="absolute -top-2 -right-2 bg-gray-900 text-[0.7rem] px-1 rounded shadow-md z-10 border border-gray-500">${icons}</div>`;
            }
            if (!inHand && card.attacksLeft > 1 && card.attacksLeft < 999) {
                 statusHTML += `<div class="absolute -top-2 -left-2 bg-yellow-500 text-black text-[0.6rem] font-bold px-1 rounded shadow-md z-10">⚡x${card.attacksLeft}</div>`;
            }
            if (!inHand && card.attacksLeft >= 999) {
                 statusHTML += `<div class="absolute -top-2 -left-2 bg-yellow-500 text-black text-[0.6rem] font-bold px-1 rounded shadow-md z-10">∞</div>`;
            }

            if (!inHand && card.items && card.items.length > 0) {
                const suppressed = isItemSuppressed();
                statusHTML += `<div class="item-badge ${suppressed ? 'opacity-50 line-through' : ''}" onclick="event.stopPropagation();showItemList(this)" data-card-id="${card.id}">🎒x${card.items.length}</div>`;
            }

            const costColor = (displayCost < card.cost) ? 'text-green-300 border-green-400 bg-green-900' : 'text-white border-blue-400 bg-blue-600';

            const displayAtk = currentStats ? currentStats.atk : card.atk;
            const displayHp = currentStats ? currentStats.hp : card.hp;
            const atkColor = (currentStats && currentStats.atk > card.atk) ? 'text-green-300' : 'text-yellow-400';
            const hpColor = (currentStats && currentStats.hp > card.hp) ? 'text-green-300' : 'text-green-400';

            div.innerHTML = `
                ${statusHTML}
                <div class="flex justify-between items-start gap-1">
                    <div class="font-bold text-[0.6rem] truncate flex-grow name" title="${card.name}">${card.name}</div>
                    <div class="${costColor} rounded-full w-5 h-5 flex items-center justify-center text-[0.6rem] font-bold border flex-shrink-0 shadow cost">${displayCost}</div>
                </div>
                <div class="text-[0.45rem] text-yellow-200 mt-1 uppercase opacity-80">${card.type}</div>
                ${card.text ? `<div class="text-[0.5rem] leading-tight text-gray-200 mt-1 flex-grow overflow-hidden text">${card.stolenText || card.text}</div>` : '<div class="flex-grow"></div>'}
                
                ${card.type === 'Character' ? `
                <div class="flex justify-between items-end mt-1 pt-1 border-t border-gray-500 border-opacity-50">
                    <div class="${atkColor} font-bold text-[0.7rem] flex items-center atk" title="ATK">⚔️${displayAtk}</div>
                    <div class="${hpColor} font-bold text-[0.7rem] flex items-center hp" title="HP">❤️${displayHp}</div>
                </div>` : ''}
            `;
            // กดค้างเพื่อซูมการ์ด
            let zoomTimer = null;
            div.addEventListener('pointerdown', (e) => {
                zoomTimer = setTimeout(() => showZoom(card, div, displayCost), 350);
            });
            div.addEventListener('pointerup',   () => { clearTimeout(zoomTimer); hideZoom(); });
            div.addEventListener('pointerleave',() => { clearTimeout(zoomTimer); hideZoom(); });
            div.addEventListener('contextmenu', (e) => { e.preventDefault(); showZoom(card, div, displayCost); });

            return div;
        }

        function showItemList(badgeEl) {
            const cardId = badgeEl.dataset.cardId;
            // ค้นหาการ์ดจากทุก zone
            let foundCard = null;
            ['player','ai'].forEach(pk => {
                const c = state.players[pk].field.find(c => c.id === cardId);
                if (c) foundCard = c;
            });
            if (!foundCard || !foundCard.items || foundCard.items.length === 0) return;

            const modal = document.getElementById('item-view-modal');
            const title = document.getElementById('item-view-title');
            const list  = document.getElementById('item-view-list');

            title.innerText = `🎒 ${foundCard.name} — Items (${foundCard.items.length} ชิ้น)`;
            list.innerHTML = '';

            const suppressed = isItemSuppressed();
            foundCard.items.forEach((item, idx) => {
                const row = document.createElement('div');
                row.style.cssText = 'background:rgba(168,85,247,0.15); border:1px solid #7e22ce; border-radius:10px; padding:10px 12px; margin-bottom:8px;';
                row.innerHTML = `
                    <div style="font-weight:700; color:#d8b4fe; font-size:0.9rem;">${idx+1}. ${item.name} ${suppressed ? '<span style="color:#f87171;font-size:0.7rem;">(ถูกยับยั้ง)</span>' : ''}</div>
                    <div style="font-size:0.75rem; color:#9ca3af; margin-top:4px;">${item.text || ''}</div>
                    <div style="font-size:0.7rem; color:#6b7280; margin-top:2px;">Cost: ${item.cost}</div>
                `;
                list.appendChild(row);
            });

            modal.style.display = 'flex';
        }

        function hideItemList() {
            document.getElementById('item-view-modal').style.display = 'none';
        }

        function showZoom(card, srcEl, displayCost) {
            const overlay = document.getElementById('card-zoom-overlay');
            const inner   = document.getElementById('card-zoom-inner');
            inner.innerHTML = '';
            const big = renderCard(card, false, displayCost ?? card.cost);
            inner.appendChild(big);
            overlay.classList.add('active');
        }
        function hideZoom() {
            document.getElementById('card-zoom-overlay').classList.remove('active');
        }

        // ====================== GRAVEYARD + ZOOM + ANIMATION ======================

        function showGraveyard(playerKey) {
            const modal = document.getElementById('graveyard-modal');
            const list = document.getElementById('graveyard-list');
            const title = document.getElementById('graveyard-title');
            
            list.innerHTML = '';
            const gy = state.players[playerKey].graveyard;
            
            title.innerHTML = `${playerKey.toUpperCase()} GRAVEYARD <span class="text-sm text-gray-400">(${gy.length} ใบ)</span>`;
            title.className = playerKey === 'player' ? 'text-2xl font-bold text-green-400' : 'text-2xl font-bold text-red-400';
            
            gy.forEach(card => {
                const el = renderCard(card, false, getActualCost(card, playerKey));
                el.style.width = '92px';
                el.style.height = '128px';
                el.style.cursor = 'pointer';
                el.onclick = () => showCardDetail(card);
                el.ondblclick = () => showCardDetail(card);
                list.appendChild(el);
            });
            
            modal.style.display = 'flex';
        }

        function hideGraveyard() {
            document.getElementById('graveyard-modal').style.display = 'none';
        }

        function showSpaceZone(playerKey) {
            const modal = document.getElementById('spacezone-modal');
            const list = document.getElementById('spacezone-list');
            const title = document.getElementById('spacezone-title');

            list.innerHTML = '';
            const sz = state.players[playerKey].spaceZone || [];

            title.innerHTML = `${playerKey.toUpperCase()} SPACE ZONE 🌌 <span class="text-sm text-indigo-300">(${sz.length} ใบ)</span>`;

            if (sz.length === 0) {
                list.innerHTML = '<div class="text-indigo-300 text-sm">ไม่มีการ์ดใน Space Zone</div>';
            } else {
                sz.forEach(card => {
                    const el = renderCard(card, false, getActualCost(card, playerKey));
                    el.style.width = '92px';
                    el.style.height = '128px';
                    el.style.cursor = 'pointer';
                    el.style.filter = 'hue-rotate(45deg) saturate(0.5) opacity(0.8)';
                    el.onclick = () => showCardDetail(card);
                    el.ondblclick = () => showCardDetail(card);
                    list.appendChild(el);
                });
            }

            modal.style.display = 'flex';
        }

        function hideSpaceZone() {
            document.getElementById('spacezone-modal').style.display = 'none';
        }

        function showCardDetail(card) {
            hideGraveyard();
            const modal = document.getElementById('card-detail-modal');
            const container = document.getElementById('detail-card-container');
            
            container.innerHTML = '';
            const bigCard = renderCard(card, false, getActualCost(card, 'player'));
            bigCard.style.transform = 'scale(1.15)';
            container.appendChild(bigCard);
            
            modal.style.display = 'block';
        }

        function hideCardDetail() {
            document.getElementById('card-detail-modal').style.display = 'none';
        }

        // Animation ตอนทิ้งการ์ด
        function animateDiscard(cardElement) {
            if (!cardElement) return;
            cardElement.classList.add('discard-fly');
            setTimeout(() => {
                if (cardElement.parentNode) cardElement.remove();
            }, 900);
        }
        function offerMulligan(playerKey) {
    currentMulliganPlayer = playerKey;
    selectedMulliganCards = [];

    const modal = document.getElementById('mulligan-modal');
    const title = document.getElementById('mulligan-title');
    const handDiv = document.getElementById('mulligan-hand');

    title.innerHTML = `${playerKey.toUpperCase()} MULLIGAN (Turn 1)`;
    title.className = playerKey === 'player' ? 'text-green-400' : 'text-red-400';
    handDiv.innerHTML = '';

    const p = state.players[playerKey];
    p.hand.forEach(c => {
        const el = renderCard(c, true, getActualCost(c, playerKey));
        el.style.width = '105px';
        el.style.height = '145px';
        el.style.cursor = 'pointer';
        el.onclick = () => toggleMulliganSelect(c.id, el);
        handDiv.appendChild(el);
    });

    modal.style.display = 'flex';
}

