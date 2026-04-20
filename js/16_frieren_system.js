// ============================================================
// 16_frieren_system.js — Frieren: Mage of the Endless Journey
// LIMITED TIME PACK (หมดเขต 26 เมษายน 2026 เท่านั้น!)
// ============================================================

const FRIEREN_ART_NORMAL  = 'https://i.pinimg.com/1200x/1c/ce/0a/1cce0ab4a8d5e2a94d69b2ea4e3a774f.jpg';
const FRIEREN_ART_EASTER  = 'https://i.pinimg.com/736x/34/c6/9d/34c69d44a3e36bc3df897bf822ce056b.jpg';
const ZOLTRAAK_ART        = 'https://i.pinimg.com/736x/94/1d/ba/941dbaae1b31fc8f0f9970cb184606d3.jpg';
const FRIEREN_PACK_EXPIRY = new Date('2026-04-26T23:59:59+07:00');

function _isFrierenPackAvailable() { return new Date() < FRIEREN_PACK_EXPIRY; }

const _FRIEREN_CARDS_TPL = {
    'Frieren': {
        name:'Frieren', type:'Character', cost:9, atk:5, hp:5, maxHp:5,
        text:'Summon: ให้ Character ฝั่งเราสุ่ม 1 ตัวอมตะ 2 เทิร์น | จบเทิร์น: เพิ่ม Spell สุ่ม 2 ใบเข้ามือ',
        color:'bg-indigo-400', maxAttacks:1,
        art:FRIEREN_ART_NORMAL,
        altArts:{ normal:FRIEREN_ART_NORMAL, easter:FRIEREN_ART_EASTER },
        _theme:'frieren_mage'
    },
    'Concealment Magic': {
        name:'Concealment Magic', type:'Spell', cost:5,
        text:'Spell: ให้ Character ฝั่งเราสุ่ม 1 ตัวอมตะ 2 เทิร์น',
        color:'bg-indigo-700', requiresTarget:false, art:FRIEREN_ART_NORMAL, _theme:'frieren_mage'
    },
    'Zoltraak': {
        name:'Zoltraak', type:'Spell', cost:5,
        text:'Spell: ทำลาย Character ศัตรูสุ่ม 1 ตัวทันที',
        color:'bg-violet-700', requiresTarget:false, art:ZOLTRAAK_ART, _theme:'frieren_mage'
    },
    'Analysis': {
        name:'Analysis', type:'Spell', cost:1,
        text:'Spell: ทำให้ Spell Card อื่นสุ่ม 1 ใบในมือ Cost 0',
        color:'bg-sky-700', requiresTarget:false, art:FRIEREN_ART_NORMAL, _theme:'frieren_mage'
    }
};
const FRIEREN_SPELL_NAMES = ['Concealment Magic','Zoltraak','Analysis'];

function _mkFrierenSpell(spellName) {
    const tpl = _FRIEREN_CARDS_TPL[spellName];
    if (!tpl || typeof cardIdCounter==='undefined') return null;
    return {
        id:'card_'+(cardIdCounter++), name:tpl.name, originalName:tpl.name,
        type:'Spell', cost:tpl.cost, atk:0, hp:0, maxHp:0,
        text:tpl.text, color:tpl.color, maxAttacks:0, attacksLeft:0,
        art:tpl.art, _theme:'frieren_mage', isFrierenSpell:true,
        requiresTarget:false, targetEnemy:false, status:[], items:[], stolenText:'',
        hasAsunaBuff:false, hasRamBuff:false, hasRemBuff:false,
        silenced:false, costReducer:0, damageReduce:0,
        shalltearBleedTurns:0, paralyzeTurns:0, freezeTurns:0,
        bleedTurns:0, burnTurns:0, immortalTurns:0,
        goldenBuffExpires:[], poseidonReduceTurn:0, queenImmortalTurns:0,
        escutcheonTurns:0, tossakanImmortalTurns:0, tossakanImmune:false,
        tossakanPermanentReduce:false, isSun:false, herculesExtraLives:0,
        natureWandUsed:false, clayBarrierTurns:0, tempBuffs:[], altairLastKilledAtk:0
    };
}

function buyFrierenPack() {
    if (!_isFrierenPackAvailable()) { showToast('⏰ Frieren Pack หมดเขตแล้ว!','#f87171'); return; }
    if ((playerData.gems||0) < 99) { showToast('💎 Gem ไม่พอ! ต้องการ 99','#f87171'); return; }
    playerData.gems -= 99;
    ['Frieren','Concealment Magic','Zoltraak','Analysis'].forEach(n => {
        const key=`${n}|frieren_mage`;
        playerData.collection[key]=(playerData.collection[key]||0)+1;
    });
    playerData.easterTokens=(playerData.easterTokens||0)+20;
    saveData(); updateHubUI(); _showFrierenRevealScreen();
}

function _showFrierenRevealScreen() {
    const ov=document.createElement('div');
    ov.style.cssText='position:fixed;inset:0;background:rgba(0,0,0,0.95);z-index:9900;display:flex;align-items:center;justify-content:center';
    ov.innerHTML=`<div style="background:linear-gradient(135deg,#0d0b2e,#1a1247);border:3px solid #818cf8;border-radius:28px;padding:32px 22px;max-width:460px;width:92%;text-align:center;box-shadow:0 0 80px rgba(129,140,248,0.5)">
  <div style="font-size:2.8rem;margin-bottom:4px">✨</div>
  <div style="font-size:1.35rem;font-weight:900;color:#a5b4fc;margin-bottom:2px">Frieren: Mage of the Endless Journey</div>
  <div style="font-size:0.68rem;color:#6b7280;margin-bottom:22px">การ์ดถูกเพิ่มใน Collection แล้ว</div>
  <div style="display:flex;gap:8px;justify-content:center;flex-wrap:wrap;margin-bottom:18px">
    ${[['Frieren','★ Legendary','#fb923c',FRIEREN_ART_NORMAL],['Concealment Magic','✦ Spell','#818cf8',FRIEREN_ART_NORMAL],['Zoltraak','✦ Spell','#a78bfa',ZOLTRAAK_ART],['Analysis','✦ Spell','#60a5fa',FRIEREN_ART_NORMAL]].map(([n,r,col,art])=>`<div style="width:84px;border-radius:12px;overflow:hidden;border:2.5px solid ${col};box-shadow:0 0 16px ${col}55;background:#0f0c29;flex-shrink:0"><img src="${art}" style="width:100%;height:58px;object-fit:cover"><div style="padding:4px 3px;background:rgba(0,0,0,0.7)"><div style="font-size:0.5rem;font-weight:900;color:${col};text-align:center">${r}</div><div style="font-size:0.58rem;font-weight:800;color:white;text-align:center;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${n}</div></div></div>`).join('')}
  </div>
  <div style="background:linear-gradient(135deg,#1a0a1e,#2d0f3e);border:2px solid #f472b6;border-radius:14px;padding:12px 18px;margin-bottom:18px;display:flex;align-items:center;gap:12px"><span style="font-size:1.8rem">🐣</span><div style="text-align:left"><div style="font-size:0.95rem;font-weight:900;color:#f9a8d4">+20 Easter Token!</div><div style="font-size:0.65rem;color:#9ca3af">สะสมสำหรับร้านค้า Easter</div></div></div>
  <button onclick="this.closest('div[style*=fixed]').remove();renderPacksPanel()" style="background:linear-gradient(135deg,#4f46e5,#6366f1);color:white;border:none;padding:13px 38px;border-radius:16px;font-weight:900;font-size:1.1rem;cursor:pointer">✨ Wunderbar!</button>
</div>`;
    document.body.appendChild(ov);
}

function switchCardArt(cardName, style) {
    if (!playerData.selectedArts) playerData.selectedArts={};
    playerData.selectedArts[cardName]=style;
    saveData();
    showToast(`🎨 เปลี่ยน Art → ${style}`,'#a5b4fc');
    showCardDetailModal(cardName,'frieren_mage');
}

function _frierenCountdown() {
    const diff=FRIEREN_PACK_EXPIRY-new Date();
    if(diff<=0) return '⏰ หมดเขตแล้ว';
    const d=Math.floor(diff/86400000), h=Math.floor((diff%86400000)/3600000), m=Math.floor((diff%3600000)/60000);
    return d>0?`⏳ เหลือ ${d} วัน ${h} ชม.`:`⏳ เหลือ ${h} ชม. ${m} นาที`;
}

document.addEventListener('DOMContentLoaded',()=>{
    if(typeof CardSets!=='undefined'){
        CardSets['frieren_mage']={};
        Object.entries(_FRIEREN_CARDS_TPL).forEach(([k,v])=>{ CardSets['frieren_mage'][k]=JSON.parse(JSON.stringify(v)); });
        if(!CardSets['frieren_mage']['Frieren'].altArts) CardSets['frieren_mage']['Frieren'].altArts=_FRIEREN_CARDS_TPL['Frieren'].altArts;
    }
    if(typeof playerData!=='undefined'){
        if(!playerData.selectedArts)              playerData.selectedArts={};
        if(playerData.easterTokens===undefined)   playerData.easterTokens=0;
    }
    if(typeof cardSounds!=='undefined'){
        cardSounds['Frieren']=new Audio('https://files.catbox.moe/amtd5f.mp3');
        cardSounds['Frieren'].volume=0.75;
    }
    if(typeof triggerOnSummon==='function'){
        const _o=triggerOnSummon;
        window.triggerOnSummon=function(card,pk){
            _o(card,pk);
            if((card.originalName||card.name)==='Frieren'&&!card._frierenSummonDone){
                card._frierenSummonDone=true;
                const others=state.players[pk].field.filter(c=>c.id!==card.id&&c.type==='Character'&&typeof getCharStats==='function'&&getCharStats(c).hp>0);
                if(others.length>0){ const pick=others[Math.floor(Math.random()*others.length)]; pick.immortalTurns=Math.max(pick.immortalTurns||0,4); if(typeof log==='function') log(`✨ [Frieren] ${pick.name} ได้รับ Immortal 2 เทิร์น!`,'text-indigo-300 font-bold'); }
                else if(typeof log==='function') log(`✨ [Frieren] ไม่มี Character อื่นบนสนาม`,'text-indigo-400');
            }
        };
    }
    if(typeof resolveEndPhase==='function'){
        const _o=resolveEndPhase;
        window.resolveEndPhase=function(pk){ _o(pk); _frierenEndOfTurn(pk); };
    }
    if(typeof executeNonTargetAction==='function'){
        const _o=executeNonTargetAction;
        window.executeNonTargetAction=function(card,pk){
            if(card.isFrierenSpell||card._theme==='frieren_mage'){ _execFrierenSpell(card,pk); return; }
            _o(card,pk);
        };
    }
    if(typeof renderCard==='function'){
        const _o=renderCard;
        window.renderCard=function(card,inHand,displayCost,cs){
            if(card&&typeof playerData!=='undefined'){
                const arts=playerData.equippedArts||playerData.selectedArts||{};
                const style=arts[card.originalName||card.name];
                if(style){
                    const altArts=card.altArts||_FRIEREN_CARDS_TPL[card.originalName||card.name]?.altArts||window._EASTER_ARTSTYLE_MAP?.[card.originalName||card.name];
                    if(altArts?.[style]) card=Object.assign({},card,{art:altArts[style]});
                }
            }
            return _o(card,inHand,displayCost,cs);
        };
    }
    if(typeof renderPacksPanel==='function'){
        const _o=renderPacksPanel;
        window.renderPacksPanel=function(){ _o(); _appendFrierenSection(); };
    }
    if(typeof showCardDetailModal==='function'){
        const _o=showCardDetailModal;
        window.showCardDetailModal=function(name,theme){
            _o(name,theme);
            const src=_FRIEREN_CARDS_TPL[name];
            if(src?.altArts&&Object.keys(src.altArts).length>1) _injectFrierenArtSwitcher(name,src.altArts);
        };
    }
    setTimeout(()=>{
        if(typeof playerData!=='undefined'){
            if(!playerData.selectedArts)              playerData.selectedArts={};
            if(playerData.easterTokens===undefined)   playerData.easterTokens=0;
        }
    },0);
});

function _frierenEndOfTurn(pk){
    const p=state.players[pk];
    p.field.forEach(c=>{
        const eff=(c.name.startsWith('Shadow Token')||c.name.startsWith('Shadow army')||c.name.includes('Loki Clone'))?(c.originalName||c.name):c.name;
        if(eff!=='Frieren') return;
        if(typeof getCharStats==='function'&&getCharStats(c).hp<=0) return;
        if(c.silenced) return;
        const sn=FRIEREN_SPELL_NAMES[Math.floor(Math.random()*FRIEREN_SPELL_NAMES.length)];
        for(let i=0;i<2;i++){ const sp=_mkFrierenSpell(sn); if(sp) p.hand.push(sp); }
        if(typeof log==='function') log(`✨ [Frieren] จบเทิร์น: เพิ่ม ${sn} ×2 เข้ามือ!`,'text-indigo-300 font-bold');
    });
}

function _execFrierenSpell(card,pk){
    const p=state.players[pk];
    const oppKey=pk==='player'?'ai':'player';
    const opp=state.players[oppKey];
    if(card.name==='Concealment Magic'){
        const allies=p.field.filter(c=>c.type==='Character'&&typeof getCharStats==='function'&&getCharStats(c).hp>0);
        if(allies.length>0){ const pick=allies[Math.floor(Math.random()*allies.length)]; pick.immortalTurns=Math.max(pick.immortalTurns||0,4); if(typeof log==='function') log(`🌫️ [Concealment Magic] ${pick.name} อมตะ 2 เทิร์น!`,'text-indigo-300 font-bold'); }
    } else if(card.name==='Zoltraak'){
        const enemies=opp.field.filter(c=>c.type==='Character'&&typeof getCharStats==='function'&&getCharStats(c).hp>0);
        if(enemies.length>0){ const pick=enemies[Math.floor(Math.random()*enemies.length)]; const n=pick.name; pick.hp=-99; if(typeof log==='function') log(`🔮 [Zoltraak] ${n} ถูกทำลาย! 💜`,'text-violet-400 font-bold'); if(typeof checkDeath==='function') checkDeath(oppKey); }
    } else if(card.name==='Analysis'){
        const spells=p.hand.filter(c=>c.type==='Spell'&&c.id!==card.id);
        if(spells.length>0){ const pick=spells[Math.floor(Math.random()*spells.length)]; pick.costReducer=(pick.costReducer||0)+pick.cost; if(typeof log==='function') log(`🔍 [Analysis] ${pick.name} Cost → 0`,'text-sky-300 font-bold'); }
    }
    p.graveyard.push(card);
}

function _appendFrierenSection(){
    const panel=document.getElementById('hub-panel-packs');
    if(!panel) return;
    const old=document.getElementById('_frieren-gem-sec');
    if(old) old.remove();
    const available=_isFrierenPackAvailable(), countdown=_frierenCountdown();
    const gems=(typeof playerData!=='undefined')?(playerData.gems||0):0;
    const owned=(typeof playerData!=='undefined')?(playerData.collection['Frieren|frieren_mage']||0):0;
    const canBuy=available&&gems>=99;
    const sec=document.createElement('div');
    sec.id='_frieren-gem-sec'; sec.style.cssText='padding:0 0 8px';
    sec.innerHTML=`<div style="display:flex;align-items:center;gap:10px;margin:10px 0 14px"><div style="flex:1;height:1px;background:linear-gradient(90deg,transparent,#818cf8)"></div><div style="font-size:0.75rem;font-weight:900;color:#818cf8;letter-spacing:1px">💎 GEM SHOP</div><div style="flex:1;height:1px;background:linear-gradient(90deg,#818cf8,transparent)"></div></div>
<div style="background:linear-gradient(135deg,#0d0b2e,#1a1247);border:2.5px solid ${available?'#818cf8':'#374151'};border-radius:20px;overflow:hidden">
  <div style="position:relative;height:130px;overflow:hidden"><img src="${FRIEREN_ART_NORMAL}" style="width:100%;height:100%;object-fit:cover;filter:brightness(${available?'0.6':'0.3'})"><div style="position:absolute;inset:0;background:linear-gradient(to bottom,transparent 25%,#0d0b2e)"></div>
    <div style="position:absolute;top:10px;left:12px;background:${available?'rgba(220,38,38,0.88)':'rgba(55,65,81,0.9)'};border:1.5px solid ${available?'#fca5a5':'#4b5563'};border-radius:20px;padding:3px 10px;font-size:0.64rem;font-weight:900;color:${available?'#fca5a5':'#9ca3af'}">${available?'⏱️ LIMITED TIME':'🔒 หมดเขตแล้ว'}</div>
    ${owned>0?`<div style="position:absolute;top:10px;right:12px;background:rgba(0,80,0,0.85);border:1.5px solid #4ade80;border-radius:20px;padding:3px 10px;font-size:0.64rem;font-weight:900;color:#4ade80">✓ มีแล้ว ×${owned}</div>`:''}
    <div style="position:absolute;bottom:10px;left:14px"><div style="font-size:1rem;font-weight:900;color:white">Frieren: Mage of the Endless Journey</div><div style="font-size:0.64rem;color:${available?'#a5b4fc':'#6b7280'}">${countdown}</div></div>
  </div>
  <div style="padding:14px">
    <div style="display:flex;align-items:center;gap:12px">
      <div style="flex:1"><div style="font-size:1.2rem;font-weight:900;color:${available?'#93c5fd':'#6b7280'}">💎 99 Gems</div><div style="font-size:0.6rem;color:#6b7280">หมดเขต 26 เม.ย. 2026 · 4 การ์ด + 🐣 20 Token</div></div>
      <button onclick="buyFrierenPack()" ${canBuy?'':'disabled'} style="background:${canBuy?'linear-gradient(135deg,#4f46e5,#6366f1)':'#374151'};color:${canBuy?'white':'#6b7280'};border:none;padding:13px 20px;border-radius:14px;font-weight:900;font-size:0.9rem;cursor:${canBuy?'pointer':'not-allowed'};white-space:nowrap">${!available?'🔒 หมดเขต':gems<99?'💎 ไม่พอ':'✨ ซื้อเลย!'}</button>
    </div>
  </div>
</div>`;
    const inner=panel.querySelector('div[style*="max-width:700px"]')||panel;
    inner.appendChild(sec);
}

function _injectFrierenArtSwitcher(cardName, altArts){
    const modal=document.getElementById('col-card-modal');
    if(!modal) return;
    const old=modal.querySelector('#_frieren-art-sw');
    if(old) old.remove();
    const current=(playerData.selectedArts||{})[cardName]||'normal';
    const row=modal.querySelector('div[style*="display:flex;gap:8px"]');
    if(!row) return;
    const wrap=document.createElement('div');
    wrap.id='_frieren-art-sw'; wrap.style.cssText='padding:0 18px 14px';
    wrap.innerHTML=`<div style="background:linear-gradient(135deg,#0d0b2e,#1a1247);border:1.5px solid #818cf8;border-radius:14px;padding:12px">
  <div style="font-size:0.6rem;color:#818cf8;font-weight:900;text-transform:uppercase;letter-spacing:0.8px;margin-bottom:10px">🎨 Art Style</div>
  <div style="display:flex;gap:8px">
    ${Object.entries(altArts).map(([style,url])=>{const active=current===style;return`<div onclick="switchCardArt(${JSON.stringify(cardName)},${JSON.stringify(style)})" style="flex:1;border:2.5px solid ${active?'#f9a8d4':'#374151'};border-radius:10px;overflow:hidden;cursor:pointer"><img src="${url}" style="width:100%;height:68px;object-fit:cover;display:block"><div style="background:rgba(0,0,0,0.82);padding:4px;text-align:center"><div style="font-size:0.6rem;font-weight:900;color:${active?'#f9a8d4':'#9ca3af'}">${style==='easter'?'🐣 Easter':'🖼️ Normal'}</div>${active?'<div style="font-size:0.5rem;color:#4ade80">✓ กำลังใช้</div>':''}</div></div>`;}).join('')}
  </div>
</div>`;
    row.parentNode.insertBefore(wrap,row);
}
