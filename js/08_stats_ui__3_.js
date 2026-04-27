// ============================================================
// 08_stats_ui.js — Stats, leaderboard, endgame, checkWinCondition
// ============================================================
        // ── Helpers ────────────────────────────────────
        function winrateStr(wins, games) {
            if (!games) return '0%';
            return Math.round((wins / games) * 100) + '%';
        }
        function streakLabel(streak) {
            if (streak > 0) return `🔥 W${streak}`;
            if (streak < 0) return `💀 L${Math.abs(streak)}`;
            return '—';
        }
        const deckNames = {
            isekai_adventure: '⚔️ Isekai', animal_kingdom: '🐾 Animal',
            mythology: '⚡ Myth', suankularb: '🌹 Suankularb', toy_trooper: '🧸 Toy'
        };

        // ── Render My Stats ────────────────────────────
        function renderMyStats(data, tab='overall') {
            const el = document.getElementById('my-stats-content');
            if (!data) {
                el.innerHTML = `<div style="color:#6b7280;text-align:center;padding:12px;">ยังไม่มีข้อมูล<br><span style="font-size:11px;">เล่นโหมด Online แล้วข้อมูลจะปรากฏ</span></div>`;
                return;
            }

            // Tab bar
            const tabs = [['overall','🌐 Overall'],['deck','🃏 Per Deck'],['card','🎴 Per Card'],['matchup','⚔️ Matchup'],['history','📜 History']];
            const tabBar = tabs.map(([t,label]) =>
                `<button onclick="renderMyStats(window._statsData,'${t}')" style="flex:1;padding:6px 4px;border-radius:6px;border:none;cursor:pointer;font-size:11px;font-weight:700;color:white;background:${t===tab?'#7c3aed':'#374151'};">${label}</button>`
            ).join('');

            if (tab === 'overall') {
                const wr = winrateStr(data.wins, data.games);
                const avgDB = data.games ? Math.round((data.totalDamageBase||0)/data.games) : 0;
                const avgDC = data.games ? Math.round((data.totalDamageChar||0)/data.games) : 0;
                const avgK  = data.games ? ((data.totalKills||0)/data.games).toFixed(1) : '0';
                el.innerHTML = `
                    <div style="display:flex;gap:4px;margin-bottom:10px;">${tabBar}</div>
                    <div style="font-size:16px;font-weight:800;color:#a78bfa;text-align:center;margin-bottom:8px;">${data.displayName||'ผู้เล่น'}</div>
                    <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:6px;margin-bottom:8px;">
                        <div style="background:#065f46;border-radius:8px;padding:8px;text-align:center;"><div style="font-size:20px;font-weight:800;color:#4ade80;">${data.wins}</div><div style="font-size:10px;color:#86efac;">WIN</div></div>
                        <div style="background:#7f1d1d;border-radius:8px;padding:8px;text-align:center;"><div style="font-size:20px;font-weight:800;color:#f87171;">${data.losses}</div><div style="font-size:10px;color:#fca5a5;">LOSS</div></div>
                        <div style="background:#1e3a5f;border-radius:8px;padding:8px;text-align:center;"><div style="font-size:20px;font-weight:800;color:#60a5fa;">${data.games}</div><div style="font-size:10px;color:#93c5fd;">GAMES</div></div>
                    </div>
                    <div style="display:grid;grid-template-columns:1fr 1fr;gap:6px;margin-bottom:8px;">
                        <div style="background:#374151;border-radius:8px;padding:8px;text-align:center;"><div style="color:#fbbf24;font-weight:800;font-size:18px;">${wr}</div><div style="font-size:10px;color:#9ca3af;">Winrate</div></div>
                        <div style="background:#374151;border-radius:8px;padding:8px;text-align:center;"><div style="font-size:14px;font-weight:700;">${streakLabel(data.streak)}</div><div style="font-size:10px;color:#9ca3af;">Streak (Best:${data.bestStreak||0})</div></div>
                    </div>
                    <div style="background:#1f2937;border-radius:10px;padding:10px;border:1px solid #374151;margin-bottom:6px;">
                        <div style="font-size:10px;color:#6b7280;margin-bottom:6px;">⚔️ Combat Stats (รวม)</div>
                        <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:6px;text-align:center;">
                            <div><div style="color:#f87171;font-weight:700;">${data.totalDamageBase||0}</div><div style="font-size:10px;color:#9ca3af;">Base DMG</div></div>
                            <div><div style="color:#fb923c;font-weight:700;">${data.totalDamageChar||0}</div><div style="font-size:10px;color:#9ca3af;">Char DMG</div></div>
                            <div><div style="color:#a78bfa;font-weight:700;">${data.totalKills||0}</div><div style="font-size:10px;color:#9ca3af;">Kills</div></div>
                        </div>
                        <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:6px;text-align:center;margin-top:6px;">
                            <div><div style="color:#34d399;font-size:13px;">${avgDB}</div><div style="font-size:10px;color:#9ca3af;">Avg/Game</div></div>
                            <div><div style="color:#fbbf24;font-size:13px;">${avgDC}</div><div style="font-size:10px;color:#9ca3af;">Avg/Game</div></div>
                            <div><div style="color:#c084fc;font-size:13px;">${avgK}</div><div style="font-size:10px;color:#9ca3af;">Avg/Game</div></div>
                        </div>
                    </div>
                    <div style="background:#1f2937;border-radius:10px;padding:10px;border:1px solid #374151;">
                        <div style="font-size:10px;color:#6b7280;margin-bottom:4px;">🃏 การ์ดที่เล่นบ่อยที่สุด</div>
                        <div style="display:flex;justify-content:space-between;">
                            <span style="color:#60a5fa;font-weight:700;">${data.mostPlayedCard||'—'}</span>
                            <span style="color:#9ca3af;font-size:12px;">${data.mostPlayedCardCount||0} ครั้ง · รวม ${data.totalCardsPlayed||0}</span>
                        </div>
                    </div>`;
            } else if (tab === 'deck') {
                const ds = data.deckStats || {};
                // Sub-tab: which deck to show card breakdown
                const activeDeck = window._activeDeckTab || null;
                const deckRows = Object.entries(deckNames).map(([key, label]) => {
                    const d = ds[key];
                    const isActive = activeDeck === key;
                    if (!d || !d.games) return `<div style="background:#1f2937;border-radius:8px;padding:8px 12px;display:flex;justify-content:space-between;align-items:center;border:1px solid #374151;"><span style="color:#6b7280;font-size:13px;">${label}</span><span style="color:#4b5563;font-size:12px;">ยังไม่ได้เล่น</span></div>`;
                    const wr = winrateStr(d.wins, d.games);
                    // Top card by on-play winrate (min 3 plays)
                    const cwc = d.cardWinCount || {};
                    const cpc = d.cardPlayCount || {};
                    const topWrCard = Object.entries(cpc).filter(([,ct])=>ct>=3)
                        .map(([n,ct])=>([n, Math.round(((cwc[n]||0)/ct)*100), ct]))
                        .sort((a,b)=>b[1]-a[1])[0];
                    const topPlayCard = Object.entries(cpc).sort((a,b)=>b[1]-a[1])[0];

                    // Card breakdown section
                    let cardBreakdown = '';
                    if (isActive) {
                        const deckCardSearch = window._deckCardSearch || '';
                        let sortedCards = Object.entries(cpc).sort((a,b)=>b[1]-a[1]);
                        if (deckCardSearch) sortedCards = sortedCards.filter(([n])=>n.toLowerCase().includes(deckCardSearch.toLowerCase()));
                        cardBreakdown = `<div style="margin-top:8px;border-top:1px solid #374151;padding-top:8px;">
                            <div style="font-size:10px;color:#6b7280;margin-bottom:6px;">🎴 On-Play Winrate ต่อการ์ด (min 3 plays) — แสดงทั้งหมด ${sortedCards.length} ใบ</div>
                            <input type="text" placeholder="🔍 ค้นหาการ์ด..." value="${deckCardSearch}"
                                oninput="window._deckCardSearch=this.value;renderMyStats(window._statsData,'deck')"
                                style="width:100%;background:#111827;color:white;border:1px solid #374151;border-radius:6px;padding:5px 8px;font-size:11px;margin-bottom:6px;box-sizing:border-box;outline:none;"/>
                            <div style="max-height:220px;overflow-y:auto;">
                            ${sortedCards.map(([n,ct])=>{
                                const wins = cwc[n]||0;
                                const cardWr = ct>=1 ? Math.round((wins/ct)*100) : 0;
                                const barColor = cardWr>=60?'#4ade80':cardWr>=40?'#fbbf24':'#f87171';
                                return `<div style="display:flex;align-items:center;gap:6px;padding:3px 0;border-bottom:1px solid #1f2937;">
                                    <div style="flex:1;font-size:11px;">${n}</div>
                                    <div style="font-size:10px;color:#9ca3af;">${ct}×</div>
                                    <div style="color:${barColor};font-size:11px;font-weight:700;min-width:32px;text-align:right;">${ct>=3?cardWr+'%':'—'}</div>
                                    <div style="width:36px;height:5px;background:#374151;border-radius:3px;overflow:hidden;">
                                        <div style="height:100%;width:${cardWr}%;background:${barColor};"></div>
                                    </div>
                                </div>`;
                            }).join('')}
                            </div>
                        </div>`;
                    }

                    return `<div style="background:${isActive?'#1e1b4b':'#1f2937'};border-radius:8px;padding:10px 12px;border:1px solid ${isActive?'#7c3aed':'#374151'};cursor:pointer;" onclick="window._activeDeckTab='${isActive?null:key}';renderMyStats(window._statsData,'deck')">
                        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:4px;">
                            <span style="font-weight:700;font-size:13px;">${label}</span>
                            <div style="text-align:right;">
                                <span style="color:#4ade80;font-weight:800;font-size:15px;">${wr}</span>
                                <span style="color:#6b7280;font-size:10px;margin-left:4px;">WR</span>
                            </div>
                        </div>
                        <div style="display:flex;gap:8px;font-size:11px;color:#9ca3af;flex-wrap:wrap;">
                            <span>${d.wins}W ${d.losses}L · ${d.games}G</span>
                            <span>⚔️${(d.damageBase||0)+(d.damageChar||0)}</span>
                            <span>💀${d.kills||0}</span>
                            ${topWrCard ? `<span style="color:#4ade80;">🏆 ${topWrCard[0]} ${topWrCard[1]}%</span>` : ''}
                        </div>
                        ${topPlayCard&&!isActive ? `<div style="font-size:10px;color:#60a5fa;margin-top:3px;">🃏 most: ${topPlayCard[0]} ×${topPlayCard[1]} · กดดูการ์ดทั้งหมด</div>` : ''}
                        ${cardBreakdown}
                    </div>`;
                }).join('');
                el.innerHTML = `<div style="display:flex;gap:4px;margin-bottom:10px;">${tabBar}</div>
                    <div style="font-size:10px;color:#6b7280;margin-bottom:6px;">กดที่ Deck เพื่อดู On-Play Winrate ต่อการ์ด</div>
                    <div style="display:flex;flex-direction:column;gap:6px;">${deckRows}</div>`;

            } else if (tab === 'card') {
                const cc  = data.cardPlayCount  || {};
                const cwc = data.cardWinCount   || {};
                const total = data.totalCardsPlayed || 1;
                const cardSort   = window._cardSort   || 'plays';
                const cardSearch = window._cardSearch || '';
                let sortedCards = Object.entries(cc).map(([n,ct])=>({
                    name:n, plays:ct, wins:cwc[n]||0,
                    wr: ct>=3 ? Math.round(((cwc[n]||0)/ct)*100) : -1,
                    pct: Math.round((ct/total)*100)
                }));
                if (cardSort==='plays')  sortedCards.sort((a,b)=>b.plays-a.plays);
                if (cardSort==='wr')     sortedCards.sort((a,b)=>b.wr-a.wr);
                // filter by search
                if (cardSearch) sortedCards = sortedCards.filter(c=>c.name.toLowerCase().includes(cardSearch.toLowerCase()));

                const sortBtns = [['plays','🃏 เล่นบ่อย'],['wr','📈 WR%']].map(([s,l])=>
                    `<button onclick="window._cardSort='${s}';renderMyStats(window._statsData,'card')" style="flex:1;padding:4px;border-radius:5px;border:none;cursor:pointer;font-size:11px;font-weight:700;color:white;background:${cardSort===s?'#7c3aed':'#374151'};">${l}</button>`
                ).join('');

                const rows = sortedCards.map((c,i)=>{
                    const barColor = c.wr>=60?'#4ade80':c.wr>=40?'#fbbf24':c.wr>=0?'#f87171':'#6b7280';
                    return `<div style="display:flex;align-items:center;gap:8px;padding:7px 0;border-bottom:1px solid #1f2937;">
                        <div style="color:#6b7280;font-size:10px;min-width:18px;text-align:right;">${i+1}</div>
                        <div style="flex:1;font-size:12px;font-weight:600;">${c.name}</div>
                        <div style="text-align:right;min-width:28px;"><div style="color:#60a5fa;font-size:11px;font-weight:700;">${c.plays}×</div><div style="color:#6b7280;font-size:9px;">${c.pct}%</div></div>
                        <div style="min-width:34px;text-align:right;">
                            <div style="color:${barColor};font-size:12px;font-weight:700;">${c.wr>=0?c.wr+'%':'—'}</div>
                            <div style="font-size:9px;color:#6b7280;">${c.wr>=0?c.wins+'W':''}</div>
                        </div>
                        <div style="width:36px;height:6px;background:#374151;border-radius:3px;overflow:hidden;">
                            <div style="height:100%;width:${c.wr>=0?c.wr:0}%;background:${barColor};"></div>
                        </div>
                    </div>`;
                }).join('');
                el.innerHTML = `<div style="display:flex;gap:4px;margin-bottom:10px;">${tabBar}</div>
                    <div style="display:flex;gap:4px;margin-bottom:8px;">${sortBtns}</div>
                    <input type="text" placeholder="🔍 ค้นหาการ์ด..." value="${cardSearch}"
                        oninput="window._cardSearch=this.value;renderMyStats(window._statsData,'card')"
                        style="width:100%;background:#1f2937;color:white;border:1px solid #374151;border-radius:8px;padding:6px 10px;font-size:12px;margin-bottom:8px;box-sizing:border-box;outline:none;"/>
                    <div style="font-size:10px;color:#6b7280;margin-bottom:6px;">แสดงทั้งหมด ${sortedCards.length} ใบ · WR% = Winrate ของเกมที่เล่นการ์ดนั้น (min 3 plays)</div>
                    <div style="max-height:340px;overflow-y:auto;">${rows || '<div style="color:#6b7280;text-align:center;padding:12px;">ยังไม่มีข้อมูล</div>'}</div>`;

            } else if (tab === 'matchup') {
                const muData = data.matchupStats || {};
                const muEntries = Object.values(muData).sort((a,b)=>b.games-a.games);
                const muRows = muEntries.map(mu => {
                    const wr = winrateStr(mu.wins, mu.games);
                    const wrNum = mu.games ? Math.round((mu.wins/mu.games)*100) : 0;
                    const barColor = wrNum>=60?'#4ade80':wrNum>=40?'#fbbf24':'#f87171';
                    const myLabel  = deckNames[mu.myDeck]  || mu.myDeck;
                    const oppLabel = deckNames[mu.oppDeck] || mu.oppDeck;
                    return `<div style="background:#1f2937;border-radius:10px;padding:10px 12px;border:1px solid #374151;">
                        <div style="display:flex;align-items:center;gap:6px;margin-bottom:6px;">
                            <span style="font-size:13px;font-weight:700;color:#a78bfa;">${myLabel}</span>
                            <span style="color:#6b7280;font-size:11px;">vs</span>
                            <span style="font-size:13px;font-weight:700;color:#f87171;">${oppLabel}</span>
                            <span style="margin-left:auto;color:${barColor};font-weight:800;font-size:16px;">${wr}</span>
                        </div>
                        <div style="display:flex;align-items:center;gap:8px;">
                            <div style="flex:1;height:7px;background:#374151;border-radius:4px;overflow:hidden;">
                                <div style="height:100%;width:${wrNum}%;background:${barColor};border-radius:4px;"></div>
                            </div>
                            <span style="font-size:11px;color:#9ca3af;">${mu.wins}W ${mu.losses}L · ${mu.games}G</span>
                        </div>
                    </div>`;
                }).join('');
                el.innerHTML = `<div style="display:flex;gap:4px;margin-bottom:10px;">${tabBar}</div>
                    <div style="font-size:10px;color:#6b7280;margin-bottom:8px;">Winrate ของ Deck คุณ เมื่อเจอ Deck คู่แข่ง</div>
                    <div style="display:flex;flex-direction:column;gap:6px;max-height:380px;overflow-y:auto;">${muRows || '<div style="color:#6b7280;text-align:center;padding:12px;">ยังไม่มีข้อมูล Matchup</div>'}</div>`;

            } else if (tab === 'history') {
                const hist = data.gameHistory || [];
                const histRows = hist.map((h, i) => {
                    const isWin = h.result === 'win';
                    const d = new Date(h.ts);
                    const dateStr = d.toLocaleDateString('th-TH', {day:'numeric',month:'short'}) + ' ' + d.toLocaleTimeString('th-TH',{hour:'2-digit',minute:'2-digit'});
                    const myLabel  = deckNames[h.myDeck]  || h.myDeck  || '?';
                    const oppLabel = deckNames[h.oppDeck] || h.oppDeck || '?';
                    return `<div style="background:${isWin?'#052e16':'#2d0a0a'};border-radius:12px;padding:12px;border:2px solid ${isWin?'#166534':'#7f1d1d'};">
                        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:6px;">
                            <div style="display:flex;align-items:center;gap:8px;">
                                <span style="font-size:20px;">${isWin?'🏆':'💀'}</span>
                                <div>
                                    <div style="font-weight:800;font-size:14px;color:${isWin?'#4ade80':'#f87171'};">${isWin?'ชนะ':'แพ้'}</div>
                                    <div style="font-size:10px;color:#6b7280;">${dateStr}</div>
                                </div>
                            </div>
                            <div style="text-align:right;">
                                <div style="font-size:12px;font-weight:700;color:#a78bfa;">${myLabel} <span style="color:#6b7280;">vs</span> ${oppLabel}</div>
                                <div style="font-size:10px;color:#6b7280;">${h.turns || 0} turns · ${h.cardsPlayed || 0} cards</div>
                            </div>
                        </div>
                        <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:4px;text-align:center;background:rgba(0,0,0,0.3);border-radius:8px;padding:6px;">
                            <div><div style="color:#f87171;font-weight:700;font-size:13px;">${h.damageBase||0}</div><div style="font-size:9px;color:#9ca3af;">Base DMG</div></div>
                            <div><div style="color:#fb923c;font-weight:700;font-size:13px;">${h.damageChar||0}</div><div style="font-size:9px;color:#9ca3af;">Char DMG</div></div>
                            <div><div style="color:#a78bfa;font-weight:700;font-size:13px;">${h.kills||0}</div><div style="font-size:9px;color:#9ca3af;">Kills</div></div>
                        </div>
                        ${h.topCard && h.topCard!=='—' ? `<div style="margin-top:6px;font-size:10px;color:#60a5fa;">🃏 การ์ดที่เล่นมากที่สุด: <b>${h.topCard}</b></div>` : ''}
                    </div>`;
                }).join('');
                el.innerHTML = `<div style="display:flex;gap:4px;margin-bottom:10px;">${tabBar}</div>
                    <div style="font-size:10px;color:#6b7280;margin-bottom:8px;">ประวัติ 5 เกมล่าสุด (Online mode)</div>
                    <div style="display:flex;flex-direction:column;gap:8px;max-height:420px;overflow-y:auto;">${histRows || '<div style="color:#6b7280;text-align:center;padding:12px;">ยังไม่มีประวัติเกม</div>'}</div>`;
            }
        }

        let lbSortMode = 'wins';
        let lbAllRows = [];

        function renderLeaderboard(myUid) {
            const lbEl = document.getElementById('leaderboard-list');
            if (!lbAllRows.length) { lbEl.innerHTML = '<div style="text-align:center;color:#6b7280;padding:12px;">ยังไม่มีข้อมูล</div>'; return; }
            let sorted = [...lbAllRows];
            if (lbSortMode === 'wins')    sorted.sort((a,b)=>(b.wins||0)-(a.wins||0));
            if (lbSortMode === 'winrate') sorted.sort((a,b)=>{ const wA=a.games?a.wins/a.games:0,wB=b.games?b.wins/b.games:0; return wB-wA; });
            if (lbSortMode === 'damage')  sorted.sort((a,b)=>((b.totalDamageBase||0)+(b.totalDamageChar||0))-((a.totalDamageBase||0)+(a.totalDamageChar||0)));
            if (lbSortMode === 'kills')   sorted.sort((a,b)=>(b.totalKills||0)-(a.totalKills||0));
            lbEl.innerHTML = sorted.slice(0,10).map((r,i) => {
                const medal = i===0?'🥇':i===1?'🥈':i===2?'🥉':`#${i+1}`;
                const wr = winrateStr(r.wins, r.games);
                const isMe = r._uid === myUid;
                const totalDmg = (r.totalDamageBase||0)+(r.totalDamageChar||0);
                const bestDeck = r.deckStats ? Object.entries(r.deckStats)
                    .filter(([,d])=>d.games>=1).sort((a,b)=>{ const wA=a[1].games?a[1].wins/a[1].games:0,wB=b[1].games?b[1].wins/b[1].games:0; return wB-wA; })[0] : null;
                return `<div style="background:${isMe?'#312e81':'#1f2937'};border-radius:10px;padding:10px 12px;border:1px solid ${isMe?'#7c3aed':'#374151'};">
                                ${r.photoURL ? `<img src="${r.photoURL}" style="width:24px;height:24px;border-radius:50%;" onerror="this.style.display='none'"/>` : ''}
                        <div style="flex:1;font-weight:700;color:${isMe?'#a78bfa':'white'};font-size:13px;">${r.displayName||'?'}</div>
                        <div style="text-align:right;"><div style="color:#4ade80;font-weight:800;font-size:15px;">${wr}</div><div style="font-size:10px;color:#6b7280;">${r.wins}W ${r.losses}L</div></div>
                    </div>
                    <div style="display:flex;gap:8px;font-size:10px;color:#9ca3af;flex-wrap:wrap;">
                        <span>⚔️${totalDmg} DMG</span><span>💀${r.totalKills||0} K</span><span>${streakLabel(r.streak)}</span>
                        ${bestDeck ? `<span style="color:#fbbf24;">${deckNames[bestDeck[0]]||bestDeck[0]} ${winrateStr(bestDeck[1].wins,bestDeck[1].games)}</span>` : ''}
                    </div>
                </div>`;
            }).join('');
        }

        function setLbSort(mode) {
            lbSortMode = mode;
            ['wins','winrate','damage','kills'].forEach(m => {
                const btn = document.getElementById('lb-sort-'+m);
                if (btn) btn.style.background = m===mode?'#7c3aed':'#374151';
            });
            renderLeaderboard(getUserKey());
        }

        async function showStatsModal() {
            document.getElementById('stats-modal').style.display = 'flex';
            const uid = getUserKey();
            const el = document.getElementById('my-stats-content');

            if (uid) {
                el.innerHTML = '<div style="text-align:center;color:#9ca3af;padding:8px;">กำลังโหลด...</div>';
                try {
                    const snap = await db.ref('statsV2/' + uid).get();
                    window._statsData = snap.val();
                    renderMyStats(window._statsData, 'overall');
                } catch(e) { el.innerHTML = '<div style="color:#ef4444;text-align:center;">โหลดไม่สำเร็จ</div>'; }
            } else {
                el.innerHTML = '<div style="color:#6b7280;text-align:center;padding:12px;">🔒 Login ด้วย Google ก่อนเพื่อดู Stats ของคุณ<br><button onclick="googleLogin()" style="margin-top:8px;background:#4285f4;color:white;border:none;border-radius:8px;padding:8px 16px;cursor:pointer;font-weight:700;">Login with Google</button></div>';
            }

            // Leaderboard
            const lbEl = document.getElementById('leaderboard-list');
            lbEl.innerHTML = '<div style="text-align:center;color:#6b7280;padding:12px;">กำลังโหลด...</div>';
            let sortBar = document.getElementById('lb-sort-bar');
            if (!sortBar) {
                sortBar = document.createElement('div');
                sortBar.id = 'lb-sort-bar';
                sortBar.style.cssText = 'display:flex;gap:6px;margin-bottom:8px;flex-wrap:wrap;';
                sortBar.innerHTML = [['wins','🏆 Wins'],['winrate','📈 WR%'],['damage','⚔️ DMG'],['kills','💀 Kills']].map(([m,l]) =>
                    `<button id="lb-sort-${m}" onclick="setLbSort('${m}')" style="flex:1;padding:5px 4px;border-radius:6px;border:none;cursor:pointer;font-size:11px;font-weight:700;color:white;background:${m===lbSortMode?'#7c3aed':'#374151'};">${l}</button>`
                ).join('');
                lbEl.parentNode.insertBefore(sortBar, lbEl);
            }
            try {
                const snap = await db.ref('statsV2').orderByChild('wins').limitToLast(20).get();
                lbAllRows = [];
                snap.forEach(child => { const v = child.val(); v._uid = child.key; lbAllRows.push(v); });
                renderLeaderboard(uid);
            } catch(e) { lbEl.innerHTML = '<div style="text-align:center;color:#ef4444;padding:12px;">โหลดไม่สำเร็จ</div>'; }
        }

        function closeStatsModal() {
            document.getElementById('stats-modal').style.display = 'none';
        }

        async function refreshRematchStats() {
            const uid = getUserKey();
            if (!uid) return;
            const box = document.getElementById('rematch-stats-box');
            const el = document.getElementById('rematch-stats-content');
            if (!box || !el) return;
            try {
                const snap = await db.ref('statsV2/' + uid).get();
                const d = snap.val();
                if (!d) return;
                const wr = winrateStr(d.wins, d.games);
                const ds = (d.deckStats || {})[selectedPlayerTheme];
                const deckWr = ds && ds.games ? winrateStr(ds.wins, ds.games) : '—';
                el.innerHTML = `
                    <div style="display:grid;grid-template-columns:1fr 1fr 1fr 1fr;gap:6px;margin-bottom:6px;text-align:center;">
                        <div><div style="color:#4ade80;font-weight:800;">${d.wins}W</div><div style="font-size:9px;color:#9ca3af;">Win</div></div>
                        <div><div style="color:#f87171;font-weight:800;">${d.losses}L</div><div style="font-size:9px;color:#9ca3af;">Loss</div></div>
                        <div><div style="color:#fbbf24;font-weight:800;">${wr}</div><div style="font-size:9px;color:#9ca3af;">WR%</div></div>
                        <div><div style="font-size:13px;font-weight:700;">${streakLabel(d.streak)}</div><div style="font-size:9px;color:#9ca3af;">Streak</div></div>
                    </div>
                    <div style="border-top:1px solid #374151;padding-top:6px;font-size:10px;color:#9ca3af;display:flex;gap:8px;justify-content:center;flex-wrap:wrap;">
                        <span>Deck WR: <b style="color:#60a5fa;">${deckWr}</b></span>
                        <span>⚔️${d.totalDamageBase||0}</span><span>💀${d.totalKills||0}</span>
                    </div>`;
                box.style.display = 'block';
            } catch(e) {}
        }

        // ── getPlayerName fallback (for old references) ─
        function getPlayerName() {
            if (!currentUser) return '';
            if (currentUser.isAnonymous) return currentUser._guestName || 'Guest';
            return currentUser.displayName || '';
        }

        function checkWinCondition() {
            if (state.players.ai.hp <= 0) endGame('player');
            if (state.players.player.hp <= 0) endGame('ai');
        }

        // P2-only: แสดง end screen โดยไม่บันทึก stats (รอ listenForP2Stats)
        function endGameUIOnly(winner) {
            const isOnline = gameMode === 'online';
            let winnerLabel;
            if (winner === 'player') winnerLabel = 'P1 ชนะ! 🎉';
            else winnerLabel = 'P2 ชนะ! 🎉';
            playSound(winner === 'ai' ? 'win' : 'lose');
            stopBGM();
            document.getElementById('rematch-title').innerText = winner === 'ai' ? '🏆 ชนะ!' : '💀 แพ้...';
            document.getElementById('rematch-winner').innerText = winnerLabel;
            document.getElementById('rematch-modal').classList.add('active');
            // Setup rematch button same as endGame
            const rematchBtn = document.getElementById('btn-rematch');
            const rematchStatus = document.getElementById('rematch-status');
            if (isOnline) {
                rematchBtn.style.display = 'inline-block';
                rematchStatus.innerText = '';
                // P2: ใช้ listener เดียวกับ endGame — P1 จะ reset votes แล้ว P2 ค่อย listen
                // รอให้ P1 reset votes ก่อน (P1 ทำใน endGame) แล้วค่อยฟัง
                function p2ListenRematchVotes() {
                    db.ref('rooms/' + onlineRoomId + '/rematchVotes').on('value', snap => {
                        const votes = snap.val() || {};
                        const voteCount = Object.keys(votes).length;
                        if (voteCount === 1) {
                            if (votes[myRole]) { rematchStatus.innerText = '⏳ รอคู่ต่อสู้ยืนยัน...'; rematchBtn.disabled = true; rematchBtn.style.opacity = '0.5'; }
                            else { rematchStatus.innerText = '🔔 คู่ต่อสู้ต้องการ Rematch!'; rematchBtn.disabled = false; rematchBtn.style.opacity = '1'; }
                        }
                        if (voteCount >= 2) {
                            db.ref('rooms/' + onlineRoomId + '/rematchVotes').off();
                            document.getElementById('rematch-modal').classList.remove('active');
                            rematchBtn.disabled = false; rematchBtn.style.opacity = '1';
                            p2HasJoined = false; p2ReadyToReceive = false; sessionToken = null;
                            db.ref('rooms/' + onlineRoomId + '/gameReady').on('value', snap2 => {
                                const token = snap2.val();
                                if (!token) return;
                                db.ref('rooms/' + onlineRoomId + '/gameReady').off();
                                sessionToken = token; p2ReadyToReceive = true;
                                document.getElementById('chat-box').style.display = 'block';
                                // แจ้ง P1 ว่า P2 join แล้ว
                                db.ref('rooms/' + onlineRoomId + '/p2join').set(Date.now());
                                listenForStateFromHost(); listenForLogs(); listenForChat();
                                listenForP2MulliganOffer(); listenForP2Stats(); listenForSoundEvents();
                            });
                        }
                    });
                }
                // รอ 800ms ให้ P1 มีเวลา reset votes ก่อน
                setTimeout(p2ListenRematchVotes, 800);
            }
        }

        function endGame(winner) {
            // --- แจก Battle Point 500 แต้มทุกครั้งที่จบเกม (ชนะหรือแพ้) ---
            if (typeof window.addBattlePoints === 'function') {
                window.addBattlePoints(500);
            }
            // -----------------------------------------------------------

            const isOnline = gameMode === 'online';
            let winnerLabel;
            if (winner === 'player') winnerLabel = isOnline ? 'P1 ชนะ! 🎉' : (gameMode === 'local' ? 'P1 ชนะ! 🎉' : 'คุณชนะ! 🎉');
            else winnerLabel = isOnline ? 'P2 ชนะ! 🎉' : (gameMode === 'local' ? 'P2 ชนะ! 🎉' : 'AI ชนะ...');

            playSound(winner === 'player' ? 'win' : 'lose');
            if (gameMode === 'online') pushSoundEvent(winner === 'player' ? 'win' : 'lose');
            stopBGM();

            // บันทึก stats ทั้ง P1 และ P2 (เฉพาะ Online mode)
            if (isOnline) {
                const didWin = (myRole === 'player' && winner === 'player') || (myRole === 'ai' && winner === 'ai');
                if (selectedPlayerTheme === selectedAITheme) {
                    // ไม่บันทึกถ้า deck เดียวกัน
                    refreshRematchStats();
                } else {
                    recordGameResult(didWin).then(() => refreshRematchStats());
                    // P1 push p2stats ขึ้น Firebase ให้ P2 บันทึกเอง
                    if (myRole === 'player') {
                        db.ref('rooms/' + onlineRoomId + '/p2stats').set({
                            ...sessionStatsP2,
                            winner,
                            ts: Date.now()
                        });
                    }
                }
            }

            document.getElementById('rematch-title').innerText = winner === 'player' ? '🏆 ชนะ!' : '💀 แพ้...';
            document.getElementById('rematch-winner').innerText = winnerLabel;
            document.getElementById('rematch-modal').classList.add('active');

            // ── [HXH] Rod Token reward — AI mode เท่านั้น (รวม Ranked AI) ──
            if ((gameMode === 'ai') && winner === 'player') {
                if (typeof _grantHxHWinReward === 'function') _grantHxHWinReward();
            }
            // Push state ที่มี hp=0 ให้ P2 รับ → trigger endGameUIOnly ฝั่ง P2
            if (isOnline && myRole === 'player') pushStateToFirebase();

            // Online: ทั้งคู่กด Rematch ได้ - ใช้ Firebase เพื่อ sync
            const rematchBtn = document.getElementById('btn-rematch');
            const rematchStatus = document.getElementById('rematch-status');
            if (isOnline) {
                rematchBtn.style.display = 'inline-block';
                rematchStatus.innerText = '';
                // Reset rematch votes ใน Firebase
                db.ref('rooms/' + onlineRoomId + '/rematchVotes').remove();
                // ฟัง rematch votes จากทั้งคู่
                db.ref('rooms/' + onlineRoomId + '/rematchVotes').on('value', snap => {
                    const votes = snap.val() || {};
                    const voteCount = Object.keys(votes).length;
                    if (voteCount === 1) {
                        const iMeVoted = votes[myRole];
                        if (iMeVoted) {
                            rematchStatus.innerText = '⏳ รอคู่ต่อสู้ยืนยัน...';
                            rematchBtn.disabled = true;
                            rematchBtn.style.opacity = '0.5';
                        } else {
                            rematchStatus.innerText = '🔔 คู่ต่อสู้ต้องการ Rematch!';
                        }
                    }
                    if (voteCount >= 2) {
                        // ทั้งคู่กดแล้ว → ปิด listener แล้วเริ่ม
                        db.ref('rooms/' + onlineRoomId + '/rematchVotes').off();
                        document.getElementById('rematch-modal').classList.remove('active');
                        rematchBtn.disabled = false;
                        rematchBtn.style.opacity = '1';
                        if (myRole === 'player') {
                            doRematch(); // P1 เป็นคนเริ่มเกม
                        } else {
                            // P2 รอ gameReady token ใหม่
                            p2HasJoined = false;
                            p2ReadyToReceive = false;
                            sessionToken = null;
                            db.ref('rooms/' + onlineRoomId + '/gameReady').on('value', snap2 => {
                                const token = snap2.val();
                                if (!token) return;
                                db.ref('rooms/' + onlineRoomId + '/gameReady').off();
                                sessionToken = token;
                                p2ReadyToReceive = true;
                                document.getElementById('chat-box').style.display = 'block';
                                // แจ้ง P1 ว่า P2 join แล้ว
                                db.ref('rooms/' + onlineRoomId + '/p2join').set(Date.now());
                                listenForStateFromHost();
                                listenForLogs();
                                listenForChat();
                                listenForP2MulliganOffer();
                                listenForP2Stats();
                                listenForSoundEvents();
                            });
                        }
                    }
                });
            }
        }

        // P2 หรือ P1 กดปุ่ม Rematch → vote ลง Firebase
        async function requestRematch() {
            const rematchBtn = document.getElementById('btn-rematch');
            rematchBtn.disabled = true;
            rematchBtn.style.opacity = '0.5';
            document.getElementById('rematch-status').innerText = '⏳ รอคู่ต่อสู้ยืนยัน...';
            if (gameMode === 'online') {
                await db.ref('rooms/' + onlineRoomId + '/rematchVotes/' + myRole).set(true);
            } else {
                doRematch();
            }
        }

        async function doRematch() {
            document.getElementById('rematch-modal').classList.remove('active');
            const rematchBtn = document.getElementById('btn-rematch');
            rematchBtn.disabled = false;
            rematchBtn.style.opacity = '1';
            if (gameMode === 'online') {
                // สร้าง session token ใหม่
                sessionToken = Date.now().toString();
                p2HasJoined = false;
                // ล้างข้อมูลเก่า
                await db.ref('rooms/' + onlineRoomId).update({
                    gameReady: false, state: null, p2mulligan: null,
                    logs: null, chat: null, rematch: null, rematchVotes: null, p2join: null,
                    soundEvent_player: null, soundEvent_ai: null
                });
                setTimeout(async () => {
                    document.getElementById('chat-box').style.display = 'block';
                    db.ref('rooms/' + onlineRoomId + '/logs').remove();
                    db.ref('rooms/' + onlineRoomId + '/chat').remove();
                    await db.ref('rooms/' + onlineRoomId + '/gameReady').set(sessionToken);
                    setTimeout(() => {
                        resetAndInitGame();
                        // ไม่ set p2HasJoined = true ที่นี่ — รอ P2 ส่ง gameReady ก่อน
                        // p2HasJoined จะถูก set เมื่อ P2 acknowledge token ใน listenForP2Join
                        pushStateToFirebase();
                        listenForP2Actions();
                        listenForChat();
                        // รอ P2 join ก่อนค่อย push state อย่างจริงจัง
                        db.ref('rooms/' + onlineRoomId + '/p2join').on('value', snapJ => {
                            if (!snapJ.val()) return;
                            db.ref('rooms/' + onlineRoomId + '/p2join').off();
                            p2HasJoined = true;
                            pushStateToFirebase();
                        });
                    }, 1200);
                }, 500);
            } else {
                resetAndInitGame();
            }
        }

        // ================================================================
        // ================================================================
        // AI SYSTEM v3 — Minimax + Alpha-Beta + Synergy + Lethal
        // ================================================================

        // ── Synergy table: ถ้ามีครึ่งหนึ่ง อีกครึ่งได้ bonus ──────────

// ============================================================
// JJK END-GAME DROPS (Stats UI Hook)
// ============================================================
const _origRefreshRematchStats = window.refreshRematchStats;
window.refreshRematchStats = async function() {
    // โหลดหน้าต่าง Stats ตามปกติ
    if (_origRefreshRematchStats) {
        await _origRefreshRematchStats.apply(this, arguments);
    }
    
    // ระบบสุ่มดรอปการ์ด JJK เมื่อโชว์หน้า UI จบเกม
    if (typeof playerData !== 'undefined' && playerData.collection) {
        const roll = Math.random() * 100;
        let dropMsg = "";
        
        if (roll < 3) {
            // โอกาส 3% ได้ Six Eye
            playerData.collection['Six Eye|jjk'] = (playerData.collection['Six Eye|jjk'] || 0) + 1;
            dropMsg = "👁️ ได้รับการ์ดสุ่มดรอปสุดแรร์: Six Eye (3%)!";
        } else if (roll < 23) { 
            // โอกาส 20% ได้ Sukuna Finger (เพราะ 3 ถึง 23 คือ 20%)
            playerData.collection['Sukuna Finger|jjk'] = (playerData.collection['Sukuna Finger|jjk'] || 0) + 1;
            dropMsg = "🩸 ได้รับการ์ดสุ่มดรอป: Sukuna Finger (20%)!";
        }
        
        if (dropMsg !== "") {
            if (typeof saveData === 'function') saveData();
            // หน่วงเวลา 1 วินาทีให้หน้าต่างเด้งเสร็จก่อน แล้วค่อยโชว์ข้อความ
            setTimeout(() => {
                if (typeof showToast === 'function') showToast(dropMsg, '#a855f7');
            }, 1000);
        }
    }
};
