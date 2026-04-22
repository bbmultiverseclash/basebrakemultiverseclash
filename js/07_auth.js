// ============================================================
// 07_auth.js — Firebase auth: login, logout, recordGameResult
// ============================================================

        // ── [FIX] Guard ป้องกัน double-click / popup ซ้อน ──────
        let _authLoginInProgress = false;

        async function guestLogin() {
            const btn = document.getElementById('guest-btn');
            const errEl = document.getElementById('login-error');
            if (!firebaseReady || typeof firebase === 'undefined') {
                if (errEl) { errEl.textContent = 'ต้องเปิดจาก GitHub Pages เพื่อใช้ Online mode'; errEl.style.display = 'block'; }
                return;
            }
            if (btn) { btn.disabled = true; btn.textContent = '⏳ กำลังเข้า...'; }
            if (errEl) errEl.style.display = 'none';
            try {
                const result = await firebase.auth().signInAnonymously();
                result.user._guestName = randomGuestName();
            } catch(e) {
                if (btn) { btn.disabled = false; btn.innerHTML = '👤 เล่นเป็น Guest (ไม่บันทึก Stats)'; }
                if (errEl) { errEl.textContent = 'Guest login ไม่สำเร็จ: ' + (e.message || e.code); errEl.style.display = 'block'; }
            }
        }

        async function googleLogin() {
            // ── [FIX] ป้องกัน double-click เปิด popup ซ้อน ──
            if (_authLoginInProgress) return;
            _authLoginInProgress = true;

            const btn = document.getElementById('login-btn');
            const loading = document.getElementById('login-loading');
            const errEl = document.getElementById('login-error');
            if (!firebaseReady || typeof firebase === 'undefined') {
                if (errEl) { errEl.textContent = 'ต้องเปิดจาก GitHub Pages เพื่อใช้ Online mode'; errEl.style.display = 'block'; }
                _authLoginInProgress = false;
                return;
            }
            if (btn) btn.style.display = 'none';
            if (loading) loading.style.display = 'flex';
            if (errEl) errEl.style.display = 'none';
            try {
                const provider = new firebase.auth.GoogleAuthProvider();
                // ใช้ signInWithPopup — redirect บน Android Chrome มักไม่ return result
                // auth/cancelled-popup-request ที่เคย error เกิดจาก getRedirectResult()
                // conflict กับ popup ไม่ใช่ popup มีปัญหา (แก้แล้วใน initAuth)
                await firebase.auth().signInWithPopup(provider);
            } catch(e) {
                console.error('Google Login Error:', e.code, e.message);
                if (btn) btn.style.display = 'flex';
                if (loading) loading.style.display = 'none';
                if (errEl) { errEl.textContent = 'Login ไม่สำเร็จ: ' + (e.message || e.code || 'กรุณาลองใหม่'); errEl.style.display = 'block'; }
            } finally {
                _authLoginInProgress = false;
            }
        }

        async function googleLogout() {
            if (!firebaseReady || typeof firebase === 'undefined') return;
            _authLoginInProgress = false;
            await firebase.auth().signOut();
        }

        function getUserKey() {
            return currentUser ? currentUser.uid : null;
        }

        // ── Record result to Firebase ──────────────────
        async function recordGameResult(didWin) {
            const uid = getUserKey();
            if (!uid || gameMode !== 'online' || isGuestUser) return;

            const myDeck  = (myRole === 'player') ? selectedPlayerTheme : selectedAITheme;
            const oppDeck = (myRole === 'player') ? selectedAITheme : selectedPlayerTheme;

            const ref = db.ref('statsV2/' + uid);
            try {
                const snap = await ref.get();
                const cur = snap.val() || {
                    displayName: currentUser.displayName || 'ผู้เล่น',
                    photoURL: currentUser.photoURL || '',
                    wins:0, losses:0, games:0, streak:0, bestStreak:0,
                    totalDamageBase:0, totalDamageChar:0, totalKills:0,
                    totalCardsPlayed:0, totalTurns:0,
                    cardPlayCount:{}, cardWinCount:{}, cardLossCount:{},
                    mostPlayedCard:'', mostPlayedCardCount:0,
                    deckStats:{}, matchupStats:{}, gameHistory:[], lastPlayed:0
                };

                // Streak
                const newStreak = didWin
                    ? (cur.streak >= 0 ? cur.streak + 1 : 1)
                    : (cur.streak <= 0 ? cur.streak - 1 : -1);

                // Merge card counts (global)
                const mergedCards    = { ...(cur.cardPlayCount  || {}) };
                const mergedCardWins = { ...(cur.cardWinCount   || {}) };
                const mergedCardLoss = { ...(cur.cardLossCount  || {}) };
                for (const [cn, ct] of Object.entries(sessionStats.cardsPlayed)) {
                    mergedCards[cn]    = (mergedCards[cn]    || 0) + ct;
                    mergedCardWins[cn] = (mergedCardWins[cn] || 0) + (didWin ? ct : 0);
                    mergedCardLoss[cn] = (mergedCardLoss[cn] || 0) + (didWin ? 0 : ct);
                }
                const topEntry = Object.entries(mergedCards).sort((a,b)=>b[1]-a[1])[0];

                // Per-deck stats
                const deckStats = JSON.parse(JSON.stringify(cur.deckStats || {}));
                const ds = deckStats[myDeck] || {
                    wins:0, losses:0, games:0, damageBase:0, damageChar:0, kills:0,
                    cardPlayCount:{}, cardWinCount:{}, cardLossCount:{}
                };
                ds.wins       += didWin ? 1 : 0;
                ds.losses     += didWin ? 0 : 1;
                ds.games      += 1;
                ds.damageBase += sessionStats.damageDealt;
                ds.damageChar += sessionStats.damageToChars;
                ds.kills      += sessionStats.kills;
                const dcc  = { ...(ds.cardPlayCount || {}) };
                const dccW = { ...(ds.cardWinCount  || {}) };
                const dccL = { ...(ds.cardLossCount || {}) };
                for (const [cn, ct] of Object.entries(sessionStats.cardsPlayed)) {
                    dcc[cn]  = (dcc[cn]  || 0) + ct;
                    dccW[cn] = (dccW[cn] || 0) + (didWin ? ct : 0);
                    dccL[cn] = (dccL[cn] || 0) + (didWin ? 0 : ct);
                }
                ds.cardPlayCount = dcc;
                ds.cardWinCount  = dccW;
                ds.cardLossCount = dccL;
                deckStats[myDeck] = ds;

                // Matchup stats (myDeck vs oppDeck)
                const matchupStats = JSON.parse(JSON.stringify(cur.matchupStats || {}));
                const muKey = myDeck + '__vs__' + oppDeck;
                const mu = matchupStats[muKey] || { myDeck, oppDeck, wins:0, losses:0, games:0 };
                mu.wins   += didWin ? 1 : 0;
                mu.losses += didWin ? 0 : 1;
                mu.games  += 1;
                matchupStats[muKey] = mu;

                // Game History (max 5)
                const topCardThisGame = (()=>{
                    const e = Object.entries(sessionStats.cardsPlayed);
                    return e.length ? e.sort((a,b)=>b[1]-a[1])[0][0] : '—';
                })();
                const newEntry = {
                    ts:          Date.now(),
                    result:      didWin ? 'win' : 'loss',
                    myDeck,
                    oppDeck,
                    turns:       sessionStats.turnsPlayed,
                    damageBase:  sessionStats.damageDealt,
                    damageChar:  sessionStats.damageToChars,
                    kills:       sessionStats.kills,
                    cardsPlayed: sessionStats.cardsPlayedTotal,
                    topCard:     topCardThisGame,
                };
                const history = [newEntry, ...(cur.gameHistory || [])].slice(0, 5);

                const updated = {
                    displayName:         currentUser.displayName || cur.displayName,
                    photoURL:            currentUser.photoURL || cur.photoURL,
                    wins:                cur.wins + (didWin ? 1 : 0),
                    losses:              cur.losses + (didWin ? 0 : 1),
                    games:               cur.games + 1,
                    streak:              newStreak,
                    bestStreak:          Math.max(cur.bestStreak || 0, newStreak),
                    lastPlayed:          Date.now(),
                    totalDamageBase:     (cur.totalDamageBase||0) + sessionStats.damageDealt,
                    totalDamageChar:     (cur.totalDamageChar||0) + sessionStats.damageToChars,
                    totalKills:          (cur.totalKills||0) + sessionStats.kills,
                    totalCardsPlayed:    (cur.totalCardsPlayed||0) + sessionStats.cardsPlayedTotal,
                    totalTurns:          (cur.totalTurns||0) + sessionStats.turnsPlayed,
                    cardPlayCount:       mergedCards,
                    cardWinCount:        mergedCardWins,
                    cardLossCount:       mergedCardLoss,
                    mostPlayedCard:      topEntry ? topEntry[0] : '',
                    mostPlayedCardCount: topEntry ? topEntry[1] : 0,
                    deckStats,
                    matchupStats,
                    gameHistory:         history,
                };
                await ref.set(updated);
                resetSessionStats();
            } catch(e) { console.warn('Stats save failed', e); }
        }


