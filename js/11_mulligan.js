// ============================================================
// 11_mulligan.js — Mulligan offer, select, confirm, skip
// ============================================================
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

function toggleMulliganSelect(cardId, el) {
    const idx = selectedMulliganCards.indexOf(cardId);
    if (idx === -1) {
        if (selectedMulliganCards.length < 2) {
            selectedMulliganCards.push(cardId);
            el.classList.add('selected', 'border-green-400', 'scale-105');
        }
    } else {
        selectedMulliganCards.splice(idx, 1);
        el.classList.remove('selected', 'border-green-400', 'scale-105');
    }
}

function confirmMulligan() {
    // ถ้าเป็น P2 ในโหมด Online ให้ส่ง ID การ์ดที่อยากเปลี่ยนไปให้ P1 จัดการสุ่มให้
    if (gameMode === 'online' && myRole === 'ai') {
        sendOnlineAction({ type: 'doMulligan', returnedIds: selectedMulliganCards });
        document.getElementById('mulligan-modal').style.display = 'none';
        return;
    }

    const p = state.players[currentMulliganPlayer];
    const count = selectedMulliganCards.length;

    if (count > 0) {
        const returnedIds = new Set();
        selectedMulliganCards.forEach(id => {
            const idx = p.hand.findIndex(c => c.id === id);
            if (idx !== -1) {
                const card = p.hand.splice(idx, 1)[0];
                p.deck.push(card);
                returnedIds.add(card.id);
            }
        });
        // Shuffle deck multiple times to avoid drawing back the same cards
        for (let s = 0; s < 5; s++) p.deck.sort(() => Math.random() - 0.5);
        // Draw new cards, ensuring they are not the same ones we just returned
        let drawn = 0;
        let attempts = 0;
        while (drawn < count && p.deck.length > 0 && attempts < p.deck.length * 2) {
            const candidate = p.deck[p.deck.length - 1];
            if (returnedIds.has(candidate.id) && p.deck.length > count) {
                const moved = p.deck.pop();
                const insertIdx = Math.floor(Math.random() * Math.max(1, p.deck.length - count));
                p.deck.splice(insertIdx, 0, moved);
                attempts++;
            } else {
                p.hand.push(p.deck.pop());
                drawn++;
            }
        }
        while (drawn < count && p.deck.length > 0) {
            p.hand.push(p.deck.pop());
            drawn++;
        }
        log(`${currentMulliganPlayer.toUpperCase()} Mulligan สำเร็จ! ใส่กลับ ${count} ใบ`, 'text-green-400 font-bold');
    } else {
        log(`${currentMulliganPlayer.toUpperCase()} ข้าม Mulligan`, 'text-gray-400');
    }

    document.getElementById('mulligan-modal').style.display = 'none';

    if (gameMode === 'local' && currentMulliganPlayer === 'player') {
        setTimeout(() => offerMulligan('ai'), 800);
    } else if (gameMode === 'online' && myRole === 'player') {
        p2HasJoined = true;
        pushStateToFirebase();
        db.ref('rooms/' + onlineRoomId + '/p2mulligan').set({ offer: true, ts: Date.now() });
        db.ref('rooms/' + onlineRoomId + '/p2mulligan/done').on('value', snap => {
            if (!snap.val()) return;
            db.ref('rooms/' + onlineRoomId + '/p2mulligan/done').off();
            startPhase('MAIN');
        });
    } else {
        startPhase('MAIN');
    }
}

function skipMulligan() {
    // ถ้าเป็น P2 Online ข้ามไปเลย ส่ง doMulligan พร้อม returnedIds ว่าง
    if (gameMode === 'online' && myRole === 'ai') {
        sendOnlineAction({ type: 'doMulligan', returnedIds: [] });
        document.getElementById('mulligan-modal').style.display = 'none';
        return;
    }

    const p = state.players[currentMulliganPlayer];
    log(`${currentMulliganPlayer.toUpperCase()} ข้าม Mulligan`, 'text-gray-400');
    document.getElementById('mulligan-modal').style.display = 'none';

    if (gameMode === 'local' && currentMulliganPlayer === 'player') {
        setTimeout(() => offerMulligan('ai'), 800);
    } else if (gameMode === 'online' && myRole === 'player') {
        p2HasJoined = true;
        pushStateToFirebase();
        db.ref('rooms/' + onlineRoomId + '/p2mulligan').set({ offer: true, ts: Date.now() });
        db.ref('rooms/' + onlineRoomId + '/p2mulligan/done').on('value', snap => {
            if (!snap.val()) return;
            db.ref('rooms/' + onlineRoomId + '/p2mulligan/done').off();
            startPhase('MAIN');
        });
    } else {
        startPhase('MAIN');
    }
}
        document.getElementById('start-game-btn').onclick = async () => {
            selectedPlayerTheme = document.getElementById('player-theme').value;
            selectedAITheme     = document.getElementById('ai-theme').value;
            // gameMode ถูก set จาก selectMode() แล้ว

            if (gameMode === 'online') {
                await startOnlineGame();
                return;
            }
            document.getElementById('theme-selector').style.display = 'none';
            resetAndInitGame();
        };

