// ============================================================
// 30_holy_war.js — Holy War 10 Commandment (Ultimate Complete Edition)
// ============================================================

const HW_THEME = 'holy_war';

// --- รูปภาพและเสียง ---
const HW_ASSETS = {
    sealFrag: 'https://file.garden/aeeLCXSsJxTPrRbp/1000038552-removebg-preview%20(1).png',
    premiumTkt: 'https://file.garden/aeeLCXSsJxTPrRbp/1000038587-removebg-preview.png',
    audio: {
        'Gloxinia': 'https://file.garden/aeeLCXSsJxTPrRbp/8ae890af269d51147b146f509b628488.mp3',
        'Zeldris': 'https://file.garden/aeeLCXSsJxTPrRbp/tmplnthofc7.mp3',
        'Galand': 'https://file.garden/aeeLCXSsJxTPrRbp/galand-1.mp3',
        'Estarossa': 'https://file.garden/aeeLCXSsJxTPrRbp/f7010d605fba06053f2651375e8d76bb.mp3',
        'Drole': 'https://file.garden/aeeLCXSsJxTPrRbp/cbe752ce6f27d21bdc9f938c0cc4b0c4.mp3'
    }
};

// --- คำพูดตอนเปิดกาชา Epic+ ---
const HW_QUOTES = {
    'Demon King': "ข้าคือราชาผู้ปกครองความมืดมิดทั้งปวง... จงสยบแทบเท้าข้า!",
    'Derieri': "เรื่องนั้นช่างมันเถอะ... ข้าจะซัดพวกมันให้กระเด็นเอง!",
    'Galand': "ฮ่าฮ่าฮ่า! ต่อหน้า 'ความจริง' การโกหกเป็นสิ่งไร้ค่า!",
    'Gloxinia': "วิญญาณหอกศักดิ์สิทธิ์ Basquias... จงชำระล้าง!",
    'Drole': "การร่ายรำของยักษ์ จะทำให้แผ่นดินสั่นสะเทือน!",
    'Estarossa': "ความรักของข้า... จะทำให้พวกเจ้าไร้เรี่ยวแรง...",
    'Melascula': "วิญญาณของพวกเจ้าช่างหอมหวานเสียจริง...",
    'Grayroad': "ความตายย่อมแลกด้วยความตาย... นั่นคือความสงบ.",
    'Fraudrin': "ร่างนี้เป็นของข้า... พลังนี้ก็เป็นของข้า!",
    'Monspeet': "เปลวเพลิงแห่งนรก จะแผดเผาทุกสิ่งเป็นจุล.",
    'Zeldris': "ในนามของราชาปีศาจ ข้าจะพิพากษาพวกเจ้าเอง!",
    'Atollah': "คมดาบของข้า จะสูบเลือดของเจ้าจนหมดสิ้น!",
    'Derocchio': "จงลิ้มรสความสับสนวุ่นวายนี้ซะ!",
    'Dahaaka': "พลังของเจ้า... ข้าขอรับไปล่ะนะ!",
    'Belion': "เพื่อเผ่าพันธุ์ปีศาจ ข้าจะบดขยี้ศัตรูให้สิ้น!",
    'Cusack': "พิษร้ายนี้จะกัดกินวิญญาณของเจ้า...",
    'Galla': "การโจมตีของข้า ไม่มีใครหลบพ้น!",
    'Pump': "เตรียมตัวพบกับฝันร้ายได้เลย!",
    'Gelda': "เลือดของเจ้า... ทำให้ข้าแข็งแกร่งขึ้น...",
    'Chandler': "ความมืดมิดที่แท้จริง จะกลืนกินแสงสว่างทั้งมวล!"
};

// --- ฐานข้อมูลการ์ด ---
const HW_CARDS = {
    // Mystic (0.5%)
    'Demon King': { name: 'Demon King', type: 'Champion', cost: 12, atk: 10, hp: 10, maxHp: 10, text: 'เมื่อรับดาเมจ ≥5 จะเปลี่ยนเป็นการเพิ่ม HP แทน | หากรับดาเมจจาก Spell/Action จนตายและ HP ≥4 จะรอดตายและเปลี่ยน HP เป็น 10 | Ongoing: เมื่อได้รับการ Heal จะโดนดาเมจ -5 แทน', color: 'bg-black', maxAttacks: 1, isChampion: true, rarity: 'Mystic', art: 'https://file.garden/aeeLCXSsJxTPrRbp/1864e538d25cb5f072cbca94348d55ae%20(1).jpg' },
    
    // Legendary (1%)
    'Derieri': { name: 'Derieri', type: 'Character', cost: 6, atk: 3, hp: 7, maxHp: 7, text: 'โจมตีโดนเป้าหมาย: +3 ATK | ได้รับบัฟ/สถานะ: +3 HP | หาก ATK ≥ 15 การโจมตีจะเป็น One Shot Kill (ตายทันที)', color: 'bg-orange-800', maxAttacks: 1, rarity: 'Legendary', art: 'https://file.garden/aeeLCXSsJxTPrRbp/19f7f017cebeddbce27d39f4adfbde04.jpg' },
    'Galand': { name: 'Galand', type: 'Character', cost: 7, atk: 7, hp: 7, maxHp: 7, text: 'เมื่อโจมตี หากเป้าหมายหลบหลีกหรือมี Taunt รับแทน เป้าหมายแรกจะถูก Freeze ถาวร | หากเป้าหมาย Immune CC, Galand +5/+5', color: 'bg-red-900', maxAttacks: 1, rarity: 'Legendary', art: 'https://file.garden/aeeLCXSsJxTPrRbp/f6aa4c753b4994ab064970f7c7a5ae07.jpg' },
    'Gloxinia': { name: 'Gloxinia', type: 'Character', cost: 8, atk: 4, hp: 4, maxHp: 4, text: 'Summon & End Turn: สุ่มใช้ 1 ใน 6 รูปแบบของวิญญาณหอกศักดิ์สิทธิ์ Basquias', color: 'bg-green-700', maxAttacks: 1, rarity: 'Legendary', art: 'https://file.garden/aeeLCXSsJxTPrRbp/file_00000000295872089c6e98b8a86ededb.png' },
    'Drole': { name: 'Drole', type: 'Character', cost: 10, atk: 1, hp: 12, maxHp: 12, text: 'โจมตี 4 ครั้ง | ตี Base ดาเมจเป็น 0 | End Turn: +1 ATK, +2 HP | หากมี Gloxinia ในสนาม Drole ลดดาเมจรับ 20% (สูงสุด 80%) และ Gloxinia ได้ +2/+2', color: 'bg-stone-700', maxAttacks: 4, rarity: 'Legendary', art: 'https://file.garden/aeeLCXSsJxTPrRbp/4d2947d41661c9d4fe977fce5e4eb639.jpg' },
    'Estarossa': { name: 'Estarossa', type: 'Character', cost: 9, atk: 4, hp: 7, maxHp: 7, text: 'Summon: สุ่มศัตรู 1 ตัวติด Estarossa Love (ตี Estarossa ดาเมจ 0) 3 เทิร์น | Attack: 50% ทำให้เป้าหมายติด Love 2 เทิร์น | ถูกโจมตี: สะท้อนดาเมจ 50%', color: 'bg-zinc-800', maxAttacks: 1, rarity: 'Legendary', art: 'https://file.garden/aeeLCXSsJxTPrRbp/a2af9d58713feafca9d7fa5e6409b928.jpg' },
    'Melascula': { name: 'Melascula', type: 'Character', cost: 8, atk: 2, hp: 2, maxHp: 2, text: 'Summon: สุ่ม 1-ฮีลตัวเอง+10 เพื่อน+5 | 2-บัฟ ATK ตัวเอง+8 เพื่อน+3 | 3-ฮีล Base +2(ถ้าเต็มได้ Cost+5)และตัวเองหลบหลีก 80% | Death: จั่ว 4 ใบ', color: 'bg-fuchsia-900', maxAttacks: 1, rarity: 'Legendary', art: 'https://file.garden/aeeLCXSsJxTPrRbp/9710de835748d892287fb9dba5dbeb77.jpg' },
    'Grayroad': { name: 'Grayroad', type: 'Character', cost: 10, atk: 5, hp: 10, maxHp: 10, text: 'โจมตีไม่ได้ถ้าฝั่งเรามี ≥2 ตัว | End turn: ศัตรูสุ่ม -2 ATK | Pacifism: ใครก็ตามที่ฆ่าด้วยการโจมตีปกติ ผู้นั้นจะตายตาม (ยกเว้น Grayroad)', color: 'bg-gray-800', maxAttacks: 1, rarity: 'Legendary', art: 'https://hedwig-cf.netmarble.com/forum-common/nanagb/7ds_en/thumbnail/dd1f254f2e8d4d81b282e987ef3a8ffe_1611540478229_d.jpg' },
    'Fraudrin': { name: 'Fraudrin', type: 'Character', cost: 6, atk: 7, hp: 7, maxHp: 7, text: 'Summon: สุ่มสวม Item 1 ใบจากเกม | ถูกโจมตี: ตัว Cost ต่ำสุดฝั่งเรารับดาเมจแทน', color: 'bg-purple-900', maxAttacks: 1, rarity: 'Legendary', art: 'https://file.garden/aeeLCXSsJxTPrRbp/6511d0bf3c6c3f55e04f25cc4b44b971.jpg' },
    'Monspeet': { name: 'Monspeet', type: 'Character', cost: 7, atk: 6, hp: 5, maxHp: 5, text: 'Summon: ศัตรู 1 ตัวติด Reticence (ใบ้) 2 เทิร์น | Attack: Splash 2 ดาเมจใส่ศัตรูสุ่ม 1 ตัว', color: 'bg-red-800', maxAttacks: 1, rarity: 'Legendary', art: 'https://i.pinimg.com/474x/c1/72/12/c17212109cdfe496246a1c591ba8324c.jpg' },
    'Zeldris': { name: 'Zeldris', type: 'Character', cost: 10, atk: 5, hp: 7, maxHp: 7, text: 'Summon: ดึงมือศัตรูลงสนามจนเต็ม แล้วทำ 5 ดาเมจใส่ตัวที่โดนดึง (ถ้าตายส่งไป Space Zone) | Ongoing: Immune ต่อ Spell และ Action', color: 'bg-red-950', maxAttacks: 1, rarity: 'Legendary', art: 'https://file.garden/aeeLCXSsJxTPrRbp/7a3f30c534daabe79c2a3234f5a18d1c.jpg' },
    
    // Epic (5%)
    'Atollah': { name: 'Atollah', type: 'Character', cost: 5, atk: 3, hp: 4, maxHp: 4, text: 'Attack: เป้าหมาย Bleed 2 เทิร์น | ถูกโจมตี: สวนกลับ 2 ดาเมจ และผู้โจมตี Bleed 2 เทิร์น', color: 'bg-rose-800', maxAttacks: 1, rarity: 'Epic', art: 'https://file.garden/aeeLCXSsJxTPrRbp/5ff1a1962ca21b176ba3d241cb308adc.jpg' },
    'Derocchio': { name: 'Derocchio', type: 'Character', cost: 9, atk: 4, hp: 5, maxHp: 5, text: 'Summon: สุ่มศัตรูติด Freeze 1, Burn 1, Bleed 1, Paralyze 1 (ตัวละ 2 เทิร์น)', color: 'bg-orange-700', maxAttacks: 1, rarity: 'Epic', art: 'https://file.garden/aeeLCXSsJxTPrRbp/b5cf3feb890530ef0187a66ab0eadaaf.jpg' },
    'Dahaaka': { name: 'Dahaaka', type: 'Character', cost: 7, atk: 1, hp: 5, maxHp: 5, text: 'Attack: ทำให้เป้าหมาย Paralyze | End turn: ฆ่าการ์ด Cost ≤4 สุ่ม 1 ตัว แล้วขโมย Stat', color: 'bg-lime-800', maxAttacks: 1, rarity: 'Epic', art: 'https://file.garden/aeeLCXSsJxTPrRbp/bd0a9ffe7e7b44d3b4bcf5943a7fdf44.jpg' },
    'Belion': { name: 'Belion', type: 'Character', cost: 8, atk: 2, hp: 8, maxHp: 8, text: 'Summon: +2 ATK ต่อเพื่อนบนสนาม (4 เทิร์น) | ฆ่าศัตรูสำเร็จ: สุ่มเพื่อน 2 ตัว +1/+1', color: 'bg-slate-800', maxAttacks: 1, rarity: 'Epic', art: 'https://file.garden/aeeLCXSsJxTPrRbp/90cbefd450dbcbdf3333fd64575dc36f.jpg' },
    'Cusack': { name: 'Cusack', type: 'Character', cost: 10, atk: 6, hp: 9, maxHp: 9, text: 'Summon: สุ่มศัตรู 1 ตัว Poison 5 เทิร์น | Ongoing: Immune Poison | Death: สุ่มสร้างการ์ด Cost ≤3 ลงสนาม', color: 'bg-indigo-900', maxAttacks: 1, rarity: 'Epic', art: 'https://file.garden/aeeLCXSsJxTPrRbp/1e3489289ac7f2e6120345bd459a59c6.jpg' },
    'Galla': { name: 'Galla', type: 'Character', cost: 8, atk: 7, hp: 7, maxHp: 7, text: 'Attack: True Damage และมีโอกาส 50% ตี x2 ดาเมจ | Death: จั่ว 2 ใบ', color: 'bg-pink-800', maxAttacks: 1, rarity: 'Epic', art: 'https://file.garden/aeeLCXSsJxTPrRbp/2abfdd70a186d324730d22dd06f28061.jpg' },
    'Pump': { name: 'Pump', type: 'Character', cost: 4, atk: 2, hp: 2, maxHp: 2, text: 'End turn: สุ่ม 1-ตัวเรา+2HP 2-ตัวเรา+2ATK 3-สร้าง Mini Pump 1/1 Taunt', color: 'bg-yellow-600', maxAttacks: 1, rarity: 'Epic', art: 'https://file.garden/aeeLCXSsJxTPrRbp/d4fcca113396760728ff8b2bf633b791.jpg' },
    'Gelda': { name: 'Gelda', type: 'Character', cost: 7, atk: 3, hp: 3, maxHp: 3, text: 'สเตตัส x2 ในเทิร์นเลขคู่ | Attack: Heal ตัวเองเท่ากับ 50% ของดาเมจ และเป้าหมาย Bleed | มี Zeldris ในสนาม: +3/+3', color: 'bg-rose-900', maxAttacks: 1, rarity: 'Epic', art: 'https://file.garden/aeeLCXSsJxTPrRbp/060842effad2bca7c0be1f62c953dcf8.jpg' },
    'Chandler': { name: 'Chandler', type: 'Character', cost: 9, atk: 4, hp: 6, maxHp: 6, text: 'Summon: เปลี่ยนสนามเป็น True Night (สเตตัสทุกตัวถูกล็อคเท่า Base) | ศัตรูร่าย Spell/Action: โดน 4 ดาเมจสุ่ม', color: 'bg-blue-900', maxAttacks: 1, rarity: 'Epic', art: 'https://file.garden/aeeLCXSsJxTPrRbp/68de37f45bf7ee601414f67b516edb73.jpg' },
    
    // Rare (15%)
    'Fat Albion': { name: 'Fat Albion', type: 'Character', cost: 9, atk: 3, hp: 7, maxHp: 7, text: 'Summon: ทำ 4 ดาเมจใส่ศัตรูสุ่ม 3 ตัว', color: 'bg-stone-500', maxAttacks: 1, rarity: 'Rare', art: 'https://file.garden/aeeLCXSsJxTPrRbp/8939a082615d8d9d1ada4aac861f6df1.jpg' },
    'Thin Albion': { name: 'Thin Albion', type: 'Character', cost: 10, atk: 4, hp: 14, maxHp: 14, text: 'Ongoing: รับดาเมจลดลง 2 หน่วยเสมอ', color: 'bg-stone-400 text-black', maxAttacks: 1, rarity: 'Rare', art: 'https://file.garden/aeeLCXSsJxTPrRbp/5ad937841b1c289d6c3857c03585ccea.jpg' },
    'Silver Demon': { name: 'Silver Demon', type: 'Character', cost: 7, atk: 4, hp: 4, maxHp: 4, text: 'Base HP < 10: ได้ +6/+6 | Base HP < 5: เมื่อฆ่าศัตรูได้ 20% Evade (Max 80%)', color: 'bg-slate-300 text-black', maxAttacks: 1, rarity: 'Rare', art: 'https://file.garden/aeeLCXSsJxTPrRbp/file_000000007410720b9bcc5f83a70c8d90.png' },
    'Copper Demon': { name: 'Copper Demon', type: 'Character', cost: 6, atk: 3, hp: 3, maxHp: 3, text: 'Base HP > 15: ได้ +4/+4 | Base HP > 17 และการ์ดนี้ตาย: ทำลายศัตรูสุ่ม 1 ตัว', color: 'bg-orange-800', maxAttacks: 1, rarity: 'Rare', art: 'https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/f/5851f423-3ac3-4eef-88d5-2be0fc69382b/dee2ugl-f87b778f-5b8d-4413-b89f-1d126f083c37.png/v1/fill/w_1280,h_720,q_80,strp/7_deadly_sins_copper_demon_by_mdwyer5_dee2ugl-fullview.jpg' },
    
    // Uncommon (30%)
    'Ochre Demon': { name: 'Ochre Demon', type: 'Character', cost: 5, atk: 1, hp: 5, maxHp: 5, text: 'Summon: ศัตรู 1 ตัว Paralyze 2 เทิร์น | Death: สุ่มดึงการ์ด Cost ≥5 จากเด็คขึ้นมือ', color: 'bg-yellow-700', maxAttacks: 1, rarity: 'Uncommon', art: 'https://static.wikia.nocookie.net/nanatsu-no-taizai/images/9/92/Ochre_Demon_anime.png/revision/latest/scale-to-width-down/1200?cb=20191010194712' },
    'Possessed Knight': { name: 'Possessed Knight', type: 'Character', cost: 5, atk: 4, hp: 3, maxHp: 3, text: 'Attack: 50% ทำให้เป้าหมาย Paralyze | หากตีเป้าที่ Paralyze อยู่ ทำดาเมจเพิ่ม 5', color: 'bg-zinc-600', maxAttacks: 1, rarity: 'Uncommon', art: 'https://static.wikia.nocookie.net/nanatsu-no-taizai/images/f/f6/Knight_%28GoE%29.png/revision/latest?cb=20230107083014' },
    'White Demon': { name: 'White Demon', type: 'Character', cost: 2, atk: 1, hp: 1, maxHp: 1, text: 'Summon: สุ่มเรียก White Demon เพิ่ม 1-5 ตัว | Ongoing: +1/+1 ต่อ White Demon บนสนาม', color: 'bg-gray-100 text-black', maxAttacks: 1, rarity: 'Uncommon', art: 'https://file.garden/aeeLCXSsJxTPrRbp/35c68e56f5f7c9a99632fa8a9a2cf7e3.jpg' },
    'Grey Demon': { name: 'Grey Demon', type: 'Character', cost: 6, atk: 3, hp: 6, maxHp: 6, text: 'Summon: ทำ 1 ดาเมจสุ่ม 5 ครั้ง | Ongoing: ดาเมจ ≤3 โจมตีการ์ดนี้ไม่เข้า', color: 'bg-gray-600', maxAttacks: 1, rarity: 'Uncommon', art: 'https://file.garden/aeeLCXSsJxTPrRbp/file_00000000ad1c720baae3c76a875707a2.png' },
    
    // Common (48.5%)
    'Orange Demon': { name: 'Orange Demon', type: 'Character', cost: 3, atk: 2, hp: 1, maxHp: 1, text: 'ใครก็ตามใช้ Action Card: สุ่มทำ 3 ดาเมจใส่ศัตรู', color: 'bg-orange-500', maxAttacks: 1, rarity: 'Common', art: 'https://static.wikia.nocookie.net/nanatsu-no-taizai/images/a/a4/Orange_Demon_anime.png/revision/latest?cb=20200213033818' },
    'Green Demon': { name: 'Green Demon', type: 'Character', cost: 2, atk: 1, hp: 1, maxHp: 1, text: 'Death: คืนชีพ 100% (2 ครั้งแรก) หลังจากนั้นโอกาสเหลือ 10%', color: 'bg-green-600', maxAttacks: 1, rarity: 'Common', art: 'https://file.garden/aeeLCXSsJxTPrRbp/384aa134e5cc52cbcd95e1f9e5194db8.jpg' },
    'Red Demon': { name: 'Red Demon', type: 'Character', cost: 7, atk: 1, hp: 10, maxHp: 10, text: 'Summon: ศัตรู 2 ตัวติด Burn 3 เทิร์น', color: 'bg-red-600', maxAttacks: 1, rarity: 'Common', art: 'https://file.garden/aeeLCXSsJxTPrRbp/file_00000000b228720b811b1b0a8c076a4a.png' },
    'Blue Demon': { name: 'Blue Demon', type: 'Character', cost: 0, atk: 2, hp: 2, maxHp: 2, text: 'ปีศาจระดับล่างทั่วไป', color: 'bg-blue-600', maxAttacks: 1, rarity: 'Common', art: 'https://file.garden/aeeLCXSsJxTPrRbp/6a3d18753b117f12e839b642496a9840.jpg' }
};

// --- การ์ดเวทมนตร์และไอเทมสร้างพิเศษ (ShopOnly) ---
const HW_TOKENS = {
    'Basquias': { name: 'Basquias', type: 'Item', cost: 0, text: '+2 ATK | โจมตี: 2 ดาเมจใส่การ์ดศัตรูสุ่ม 1 ใบ', color: 'bg-yellow-600', requiresTarget: true, shopOnly: true, art: 'https://file.garden/aeeLCXSsJxTPrRbp/3f25d2729a301fb3208d21c809b6832f.jpg', _theme: HW_THEME },
    'Form Two: Guardian': { name: 'Form Two: Guardian', type: 'Spell', cost: 5, text: 'เรียก Guardian 5/5 (Taunt) หากมี Gloxinia จะเป็น ATK 10', color: 'bg-lime-700', requiresTarget: false, shopOnly: true, art: 'https://file.garden/aeeLCXSsJxTPrRbp/3f25d2729a301fb3208d21c809b6832f.jpg', _theme: HW_THEME },
    'Guardian Token': { name: 'Guardian', type: 'Character', cost: 0, atk: 5, hp: 5, maxHp: 5, text: 'Taunt', color: 'bg-stone-600', maxAttacks: 1, shopOnly: true, art: 'https://file.garden/aeeLCXSsJxTPrRbp/3f25d2729a301fb3208d21c809b6832f.jpg', _theme: HW_THEME },
    'Yggdra Armor': { name: 'Yggdra Armor', type: 'Item', cost: 0, text: '+7 ATK / +7 HP | เมื่อผู้สวมใส่ตาย ทำลายไอเทมนี้ ผู้ใส่รอดด้วย HP=1 และ Immortal 1 เทิร์น', color: 'bg-emerald-600', requiresTarget: true, shopOnly: true, art: 'https://file.garden/aeeLCXSsJxTPrRbp/e92facebd2bf495cac50c83894b4b879%20(1).jpg', _theme: HW_THEME },
    'Form Seven: Moon Rose': { name: 'Form Seven: Moon Rose', type: 'Spell', cost: 1, text: 'ฮีล 2 HP ให้ 1 เป้าหมาย | หากเป็น Drole หรือ Gloxinia จะฮีลเต็มแทน', color: 'bg-pink-500', requiresTarget: true, targetEnemy: false, shopOnly: true, art: 'https://file.garden/aeeLCXSsJxTPrRbp/3f25d2729a301fb3208d21c809b6832f.jpg', _theme: HW_THEME },
    'Form Nine: Death Thorn': { name: 'Form Nine: Death Thorn', type: 'Spell', cost: 5, text: 'ทำ 10 ดาเมจ 10 ครั้ง สุ่มเป้าหมาย (โอกาสสำเร็จครั้งละ 10%)', color: 'bg-purple-800', requiresTarget: false, shopOnly: true, art: 'https://file.garden/aeeLCXSsJxTPrRbp/3f25d2729a301fb3208d21c809b6832f.jpg', _theme: HW_THEME },
    'Form Ten: Emerald Octo': { name: 'Form Ten: Emerald Octo', type: 'Item', cost: 0, text: '+10 HP | โจมตี: เป้าหมายติด Paralyze', color: 'bg-teal-600', requiresTarget: true, shopOnly: true, art: 'https://file.garden/aeeLCXSsJxTPrRbp/3f25d2729a301fb3208d21c809b6832f.jpg', _theme: HW_THEME },
    'Mini Pump': { name: 'Mini Pump', type: 'Character', cost: 0, atk: 1, hp: 1, maxHp: 1, text: 'Taunt หากมี Pump ในสนาม', color: 'bg-yellow-800', maxAttacks: 1, shopOnly: true, art: 'https://file.garden/aeeLCXSsJxTPrRbp/d4fcca113396760728ff8b2bf633b791.jpg', _theme: HW_THEME }
};

// --- ระบบและ UI Gacha ---
document.addEventListener('DOMContentLoaded', () => {
    // 1. Inject Cards to Game Database
    if (typeof CardSets !== 'undefined') {
        if (!CardSets[HW_THEME]) CardSets[HW_THEME] = {};
        Object.keys(HW_CARDS).forEach(k => CardSets[HW_THEME][k] = JSON.parse(JSON.stringify({...HW_CARDS[k], _theme: HW_THEME})));
        Object.keys(HW_TOKENS).forEach(k => CardSets[HW_THEME][k] = JSON.parse(JSON.stringify({...HW_TOKENS[k], _theme: HW_THEME})));
    }

    // 2. Init Player Data
    if (typeof playerData !== 'undefined') {
        if (playerData.sealFragments === undefined) playerData.sealFragments = 0;
        if (playerData.premiumTickets === undefined) playerData.premiumTickets = 0;
        if (playerData.hwPulls === undefined) playerData.hwPulls = 0;
        if (playerData.hwTotalPulls === undefined) playerData.hwTotalPulls = 0;
        if (playerData.bossKeys === undefined) playerData.bossKeys = 0;
        if (!playerData.unlockedArtstyles) playerData.unlockedArtstyles = [];
    }

    // 3. Redeem Codes
    if (typeof REDEEM_CODES !== 'undefined') {
        REDEEM_CODES['10COMMANDMENT'] = { sealFragments: 10, premiumTickets: 1, label: '📜 10 Seals & 1 Premium Ticket', oneTime: true };
        REDEEM_CODES['100PULLFREE'] = { bossKeys: 100, label: '🔑 100 Boss Keys', oneTime: true };
    }

    // 4. Patch Redeem Code Function
    if (typeof window.redeemCode === 'function') {
        const _origHWRedeem = window.redeemCode;
        window.redeemCode = function() {
            const raw = document.getElementById('redeem-input')?.value?.trim().toUpperCase().replace(/\s+/g, '');
            const reward = (typeof REDEEM_CODES !== 'undefined') ? REDEEM_CODES[raw] : null;
            if (reward && (reward.sealFragments || reward.premiumTickets)) {
                const used = typeof getUsedCodes === 'function' ? getUsedCodes() : [];
                const msg = document.getElementById('redeem-msg');
                if (reward.oneTime && used.includes(raw)) {
                    if (msg) { msg.style.color='#f87171'; msg.textContent='❌ โค้ดนี้ใช้ไปแล้ว'; } return;
                }
                if (reward.sealFragments) playerData.sealFragments = (playerData.sealFragments || 0) + reward.sealFragments;
                if (reward.premiumTickets) playerData.premiumTickets = (playerData.premiumTickets || 0) + reward.premiumTickets;
                if (typeof saveData === 'function') saveData();
                if (typeof markCodeUsed === 'function') markCodeUsed(raw);
                if (typeof updateHubUI === 'function') updateHubUI();
                if (msg) { msg.style.color='#4ade80'; msg.textContent=`🎉 ได้รับ ${reward.label} สำเร็จ!`; }
                if (typeof showToast === 'function') showToast(`🎁 รับ ${reward.label} สำเร็จ!`, '#fbbf24');
                document.getElementById('redeem-input').value = '';
                if (document.getElementById('hw-seal-cnt')) document.getElementById('hw-seal-cnt').innerText = playerData.sealFragments;
                if (document.getElementById('hw-tkt-cnt')) document.getElementById('hw-tkt-cnt').innerText = playerData.premiumTickets;
                return;
            }
            _origHWRedeem.apply(this, arguments);
        };
    }

    // 5. UI Button Injection in Pack Shop
    if (typeof window.renderPacksPanel === 'function') {
        const _origRenderPacksPanelHW = window.renderPacksPanel;
        window.renderPacksPanel = function() {
            _origRenderPacksPanelHW.apply(this, arguments);
            const panel = document.getElementById('hub-panel-packs');
            if (!panel) return;
            const old = document.getElementById('_hw-gacha-sec');
            if (old) old.remove();

            const pulls = playerData.hwPulls || 0;
            const totalPulls = playerData.hwTotalPulls || 0;

            const sec = document.createElement('div');
            sec.id = '_hw-gacha-sec';
            sec.style.cssText = 'padding:0 0 24px';
            sec.innerHTML = `
            <!-- Divider -->
            <div style="display:flex;align-items:center;gap:10px;margin:16px 0 14px">
              <div style="flex:1;height:1px;background:linear-gradient(90deg,transparent,#f43f5e)"></div>
              <div style="font-size:0.75rem;font-weight:900;color:#f43f5e;letter-spacing:1px">⚔️ HOLY WAR GACHA</div>
              <div style="flex:1;height:1px;background:linear-gradient(90deg,#f43f5e,transparent)"></div>
            </div>

            <!-- Main Pack Banner -->
            <div style="background:linear-gradient(135deg,#1a050e,#4c0519);
                 border:2.5px solid #f43f5e;border-radius:20px;overflow:hidden;
                 box-shadow:0 0 36px rgba(244,63,94,0.25);margin-bottom:12px">

              <!-- Header art strip with Featured Characters -->
              <div style="position:relative;height:170px;overflow:hidden">
                <!-- Background Image (Demon King) -->
                <img src="${HW_CARDS['Demon King'].art}"
                     style="width:100%;height:100%;object-fit:cover;object-position:center 30%;filter:brightness(0.4)">
                
                <!-- Gradients for blending -->
                <div style="position:absolute;inset:0;background:linear-gradient(to right, #000000ee 0%, transparent 40%, #000000dd 100%);"></div>
                <div style="position:absolute;inset:0;background:linear-gradient(to bottom,transparent 30%,#1a050e 100%)"></div>
                
                <!-- Labels -->
                <div style="position:absolute;top:10px;left:12px;
                     background:rgba(220,38,38,0.88);
                     border:1.5px solid #fca5a5;
                     border-radius:20px;padding:3px 10px;font-size:0.64rem;font-weight:900;
                     color:#fca5a5">
                  🔥 NEW ARRIVAL
                </div>
                
                <div style="position:absolute;top:10px;right:12px;
                     background:rgba(0,0,0,0.75);border:1.5px solid #f43f5e;
                     border-radius:20px;padding:3px 10px;font-size:0.64rem;font-weight:900;color:#fda4af">
                  Pity: ${totalPulls}/50 (สุ่ม), ${totalPulls}/100 (เลือก)
                </div>

                <!-- Banner Titles -->
                <div style="position:absolute;bottom:12px;left:14px">
                  <div style="font-size:1.3rem;font-weight:900;color:white;text-shadow:0 2px 8px rgba(0,0,0,0.9); line-height:1.1">
                    ⚔️ The 10 Commandments
                  </div>
                  <div style="font-size:0.7rem;color:#fda4af;margin-top:4px;">อัญเชิญบัญญัติทั้ง 10 และราชาปีศาจ!</div>
                </div>

                <!-- Featured Characters (หน้าตู้) -->
                <div style="position:absolute; bottom:12px; right:12px; display:flex; gap:8px; align-items:flex-end;">
                     <div style="text-align:center;">
                         <div style="width:42px; height:42px; border-radius:50%; border:2px solid #fbbf24; overflow:hidden; box-shadow:0 0 12px rgba(251,191,36,0.6);">
                             <img src="${HW_CARDS['Zeldris'].art}" style="width:100%;height:100%;object-fit:cover;object-position:top;">
                         </div>
                     </div>
                     <div style="text-align:center;">
                         <div style="width:42px; height:42px; border-radius:50%; border:2px solid #fbbf24; overflow:hidden; box-shadow:0 0 12px rgba(251,191,36,0.6);">
                             <img src="${HW_CARDS['Estarossa'].art}" style="width:100%;height:100%;object-fit:cover;object-position:top;">
                         </div>
                     </div>
                     <div style="text-align:center;">
                         <div style="width:52px; height:52px; border-radius:50%; border:2.5px solid #ef4444; overflow:hidden; box-shadow:0 0 15px rgba(239,68,68,0.8);">
                             <img src="${HW_CARDS['Demon King'].art}" style="width:100%;height:100%;object-fit:cover;object-position:top;">
                         </div>
                         <div style="font-size:0.5rem; color:#fca5a5; font-weight:bold; margin-top:2px; background:rgba(0,0,0,0.7); border-radius:4px; padding:1px 4px;">MYSTIC</div>
                     </div>
                </div>
              </div>

              <div style="padding:16px">
                <!-- Resource Balances -->
                <div style="display:grid; grid-template-columns:1fr 1fr; gap:10px; margin-bottom: 14px;">
                    <div style="background: #1e1b4b; border: 1px solid #a855f7; border-radius: 10px; padding: 8px 12px; display:flex; align-items:center; gap:8px;">
                        <img src="${HW_ASSETS.sealFrag}" style="height:24px; filter:drop-shadow(0 0 5px rgba(168,85,247,0.5));">
                        <div style="text-align:left; line-height:1.1;">
                            <div style="font-size:0.55rem; color:#c084fc;">Seal Fragment</div>
                            <div style="color:#fcd34d; font-weight:900; font-size: 1rem;" id="hw-seal-cnt">${playerData.sealFragments || 0}</div>
                        </div>
                    </div>
                    <div style="background: #2e0b16; border: 1px solid #f43f5e; border-radius: 10px; padding: 8px 12px; display:flex; align-items:center; gap:8px;">
                        <img src="${HW_ASSETS.premiumTkt}" style="height:24px; filter:drop-shadow(0 0 5px rgba(244,63,94,0.5));">
                        <div style="text-align:left; line-height:1.1;">
                            <div style="font-size:0.55rem; color:#fda4af;">Premium Ticket</div>
                            <div style="color:#fca5a5; font-weight:900; font-size: 1rem;" id="hw-tkt-cnt">${playerData.premiumTickets || 0}</div>
                        </div>
                    </div>
                </div>
                
                <div style="background:rgba(244,63,94,0.15);border:1px dashed #be123c;border-radius:10px;padding:8px 10px;margin-bottom:14px;font-size:0.65rem;color:#fda4af;text-align:center">
                  🔥 เปิดครบ 30 ครั้ง รับสิทธิ์เปิด 10 ครั้ง ฟรีทันที! <span style="color:#fff; font-weight:bold;">(รอบปัจจุบัน: ${pulls % 30}/30)</span>
                </div>

                <div style="display:flex; justify-content:center; gap:8px; margin-bottom: 12px;">
                    <button onclick="rollHolyWarGacha(1)" style="flex:1; background: linear-gradient(135deg, #1e3a8a, #3b82f6); color: white; font-weight: 900; padding: 12px 6px; border-radius: 12px; border: none; cursor: pointer; box-shadow: 0 4px 15px rgba(59,130,246,0.4); font-size:0.85rem; line-height:1.2;">
                        สุ่ม 1 ครั้ง<br><span style="font-size:0.65rem; color:#bfdbfe; font-weight:normal;">(ใช้ 1 Seal)</span>
                    </button>
                    <button onclick="rollHolyWarGacha(10)" style="flex:1; background: linear-gradient(135deg, #7c3aed, #a855f7); color: white; font-weight: 900; padding: 12px 6px; border-radius: 12px; border: none; cursor: pointer; box-shadow: 0 4px 15px rgba(124,58,237,0.4); font-size:0.85rem; line-height:1.2;">
                        สุ่ม 10 ครั้ง<br><span style="font-size:0.65rem; color:#e9d5ff; font-weight:normal;">(ใช้ 9 Seal)</span>
                    </button>
                    <button onclick="rollHolyWarPremium()" style="flex:1; background: linear-gradient(135deg, #9f1239, #e11d48); color: white; font-weight: 900; padding: 12px 6px; border-radius: 12px; border: none; cursor: pointer; box-shadow: 0 4px 15px rgba(225,29,72,0.4); font-size:0.85rem; line-height:1.2;">
                        Premium<br><span style="font-size:0.65rem; color:#fecdd3; font-weight:normal;">(การันตี Leg+)</span>
                    </button>
                </div>

                <div style="display:flex; justify-content:space-between; gap:8px;">
                    <button onclick="claimHolyWarPity(50)" style="flex:1; background: #b45309; color: white; border:none; padding: 10px; border-radius: 10px; font-weight: bold; cursor: pointer; font-size:0.75rem;">🎁 สุ่ม Pity (50)</button>
                    <button onclick="claimHolyWarPity(100)" style="flex:1; background: #fbbf24; color: black; border:none; padding: 10px; border-radius: 10px; font-weight: bold; cursor: pointer; font-size:0.75rem;">👑 เลือก Pity (100)</button>
                </div>
              </div>
            </div>`;
            
            const wrapper = panel.querySelector('div[style*="max-width:700px"]') || panel;
            wrapper.appendChild(sec);
        };
    }

    // 6. Start Hooks
    _hookHolyWarMechanics();

    // ==========================================
    // 7. เพิ่ม Artstyle ใหม่เป็นรางวัลจากบอส
    // ==========================================
    if (typeof ARTSTYLE_CFG !== 'undefined') {
        ARTSTYLE_CFG['zeldris_pratchaya'] = {
            id: 'zeldris_pratchaya', label: 'Zeldris - Pratchaya Form', emoji: '⚔️',
            targetCard: 'Zeldris', art: 'https://file.garden/aeeLCXSsJxTPrRbp/1777806827171.jpg',
            shopCost: 0, currency: 'dungeon'
        };
        ARTSTYLE_CFG['fraudrin_unhuman'] = {
            id: 'fraudrin_unhuman', label: 'Fraudrin - Unhuman', emoji: '👹',
            targetCard: 'Fraudrin', art: 'https://file.garden/aeeLCXSsJxTPrRbp/1777806827171.jpg',
            shopCost: 0, currency: 'dungeon'
        };
    }

    // ==========================================
    // 8. Dungeon Panel — Demon Clan Invasion
    // ==========================================
    if (typeof window.renderDungeonPanel === 'function') {
        const _origDungeonHW = window.renderDungeonPanel;
        window.renderDungeonPanel = function() {
            _origDungeonHW.apply(this, arguments);
            const pnl = document.getElementById('hub-panel-dungeon');
            if (!pnl) return;
            if (document.getElementById('_hw-demon-banner')) return; // ป้องกัน inject ซ้ำ

            let deckOptions = playerData.decks.map(deck => `<option value="${deck.id}">${deck.name}</option>`).join('');
            if (!deckOptions) deckOptions = '<option value="">ไม่มีเด็คที่พร้อมเล่น</option>';

            const bannerHTML = `
            <div id="_hw-demon-banner" style="background:linear-gradient(135deg, #2e050c, #000000); border:2px solid #ef4444; border-radius:20px; padding:20px; display:flex; gap:20px; box-shadow:0 0 30px rgba(239,68,68,0.2); margin-top:20px;">
                <div style="width:160px; height:220px; border-radius:12px; overflow:hidden; border:2px solid #f87171; flex-shrink:0; box-shadow:0 0 20px rgba(248,113,113,0.3);">
                    <img src="${HW_CARDS['Demon King'].art}" style="width:100%;height:100%;object-fit:cover;">
                </div>
                <div style="flex:1;">
                    <div style="color:#fca5a5; font-weight:900; font-size:0.8rem; letter-spacing:1px; margin-bottom:4px;">👹 SPECIAL DUNGEON</div>
                    <div style="font-size:2rem; font-weight:900; color:white; margin-bottom:4px; line-height:1;">Demon Clan Invasion</div>
                    <div style="color:#9ca3af; font-size:0.85rem; margin-bottom:12px;">เผชิญหน้ากองทัพปีศาจระดับสูง! <br><b style="color:#4ade80;">สเตตัสปีศาจถูกบัฟพิเศษทะลุขีดจำกัด!</b></div>
                    
                    <div style="background:rgba(0,0,0,0.5); padding:12px; border-radius:10px; border:1px solid #334155; margin-bottom:16px; font-size:0.85rem;">
                        <div style="color:#fbbf24; font-weight:900; margin-bottom:6px;">🏆 ของรางวัลการท้าทาย:</div>
                        <div style="display:grid;grid-template-columns:1fr 1fr;gap:6px; color:white; font-size:0.8rem;">
                            <div>📜 100%: <b>Seal Fragment x1</b></div>
                            <div>🎨 5%: <b>Artstyle Zeldris</b></div>
                            <div>🎭 5%: <b>Artstyle Fraudrin</b></div>
                            <div>🎟️ 1%: <b>Premium Ticket x1</b></div>
                        </div>
                    </div>
                    
                    <div style="display:flex; align-items:center; gap:10px;">
                        <select id="dungeon-deck-select-hw" style="background:#1f2937; color:white; border:1px solid #4b5563; padding:12px; border-radius:10px; flex:1; font-size:0.9rem; font-weight:bold;">
                            ${deckOptions}
                        </select>
                        <button onclick="startDungeon_hw_demons()" style="background:linear-gradient(135deg, #dc2626, #7f1d1d); color:white; font-weight:900; padding:12px 24px; border-radius:10px; border:1px solid #f87171; cursor:pointer; font-size:1rem; box-shadow:0 0 15px rgba(220,38,38,0.4); white-space:nowrap;">
                            ⚔️ บุกดันเจี้ยน (ใช้ 1 🔑)
                        </button>
                    </div>
                    <div style="margin-top:8px; font-size:0.75rem; color:#6b7280; text-align:right;">
                        🔑 Boss Keys: <b style="color:#fbbf24;">${playerData.bossKeys || 0}</b>
                    </div>
                </div>
            </div>`;

            const wrapper = pnl.querySelector('div[style*="max-width:800px"]') || pnl;
            wrapper.insertAdjacentHTML('beforeend', bannerHTML);
        };
    }

    // ==========================================
    // 9. endGame Hook — ให้รางวัลเมื่อชนะ Demon Dungeon
    // ==========================================
    if (typeof window.endGame === 'function' && !window._hwEndGamePatched) {
        const _origEndGameHW = window.endGame;
        window.endGame = function(winner) {
            if (window.gameMode === 'dungeon' && window.currentDungeonId === 'hw_demons') {
                // ตั้ง gameMode = 'ai' ก่อนเรียก original เพื่อกัน white whale bug ของดันเจี้ยนเก่า
                window.gameMode = 'ai';

                _origEndGameHW.apply(this, arguments);

                if (winner === 'player') {
                    let msg = "🎉 ชนะกองทัพปีศาจ! ได้รับ Seal Fragment x1";
                    playerData.sealFragments = (playerData.sealFragments || 0) + 1;

                    const r = Math.random();
                    if (r < 0.01) {
                        // 1% Premium Ticket
                        playerData.premiumTickets = (playerData.premiumTickets || 0) + 1;
                        msg += " และ 🎟️ Premium Ticket x1!";
                    } else if (r < 0.06) {
                        // 5% Zeldris Artstyle
                        if (!playerData.unlockedArtstyles.includes('zeldris_pratchaya')) {
                            playerData.unlockedArtstyles.push('zeldris_pratchaya');
                            msg += " และ 🎨 Artstyle Zeldris (Pratchaya Form)!";
                        }
                    } else if (r < 0.11) {
                        // 5% Fraudrin Artstyle
                        if (!playerData.unlockedArtstyles.includes('fraudrin_unhuman')) {
                            playerData.unlockedArtstyles.push('fraudrin_unhuman');
                            msg += " และ 🎭 Artstyle Fraudrin (Unhuman)!";
                        }
                    }

                    if (typeof saveData === 'function') saveData();
                    if (typeof updateHubUI === 'function') updateHubUI();
                    if (typeof showToast === 'function') showToast(msg, '#4ade80');
                    if (typeof log === 'function') setTimeout(() => log(`🏆 ${msg}`, 'text-green-400 font-bold'), 600);
                }
                window.currentDungeonId = null;
            } else {
                _origEndGameHW.apply(this, arguments);
            }
        };
        window._hwEndGamePatched = true;
    }

    // ==========================================
    // 10. buildDeck Patch — Demon Boss Deck (patch ครั้งเดียว)
    // ==========================================
    if (typeof window.buildDeck === 'function' && !window._hwBuildDeckPatched) {
        const _origBuildDeckHW = window.buildDeck;
        window.buildDeck = function(theme) {
            if (theme === 'hw_demons_boss') {
                const bossDeck = [];
                const makeDemon = (name, atk, hp) => {
                    const c = typeof createCardInstance === 'function' ? createCardInstance(name, 'holy_war') : null;
                    if (c) { c.atk = atk; c.hp = hp; c.maxHp = hp; c.isDungeonBoss2 = true; }
                    return c;
                };
                for (let i = 0; i < 15; i++) bossDeck.push(makeDemon('Red Demon', 10, 10));
                for (let i = 0; i < 15; i++) bossDeck.push(makeDemon('Grey Demon', 15, 15));
                for (let i = 0; i < 20; i++) bossDeck.push(makeDemon('White Demon', 5, 5));
                for (let i = 0; i < 10; i++) bossDeck.push(makeDemon('Silver Demon', 20, 20));
                return bossDeck.sort(() => Math.random() - 0.5);
            }
            return _origBuildDeckHW.call(this, theme);
        };
        window._hwBuildDeckPatched = true;
    }
});

// --- ==========================================
// --- ฟังก์ชันเข้าสู่ดันเจี้ยน Demon Clan
// --- ==========================================
window.startDungeon_hw_demons = function() {
    const deckId = document.getElementById('dungeon-deck-select-hw')?.value;
    const deck = playerData.decks?.find(d => d.id === deckId);
    if (!deck) {
        if (typeof showToast === 'function') showToast('❌ กรุณาสร้างและเลือกเด็คก่อน', '#f87171');
        return;
    }
    if ((playerData.bossKeys || 0) < 1) {
        if (typeof showToast === 'function') showToast('🔑 Boss Keys ไม่พอ! (ต้องการ 1 อัน)', '#f87171');
        return;
    }

    // หัก 1 กุญแจ
    playerData.bossKeys -= 1;
    if (typeof saveData === 'function') saveData();

    // ใช้ normalizeDeckCards เพื่อให้เด็คถูกเตรียมถูกต้อง ป้องกันบัคจั่วไม่ได้
    if (typeof normalizeDeckCards === 'function') {
        _pendingCollectionDeck = normalizeDeckCards(deck);
    } else {
        _pendingCollectionDeck = (deck.cards || []).map(c =>
            typeof c === 'string' ? { name: c, theme: deck.theme || 'isekai_adventure' } : c
        );
    }
    _collectionDeckUsed = false;
    _isRankedGame = false;
    window.gameMode = 'dungeon';
    window.currentDungeonId = 'hw_demons';

    const hubEl = document.getElementById('hub-screen');
    const gameEl = document.getElementById('game-screen');
    if (hubEl) hubEl.style.display = 'none';
    if (gameEl) gameEl.style.display = '';
    const ts = document.getElementById('theme-selector');
    if (ts) ts.style.display = 'none';

    selectedPlayerTheme = deck.theme || 'isekai_adventure';
    selectedAITheme = 'hw_demons_boss';

    if (typeof resetAndInitGame === 'function') resetAndInitGame();

    if (typeof log === 'function') {
        setTimeout(() => log('👹 กองทัพปีศาจปรากฏตัว! ระวังตัวด้วยพวกมันถูกเสริมพลังขั้นสุด!', 'text-red-500 font-bold text-lg'), 800);
    }
};

// --- ระบบ Logic การสุ่ม ---
function getHolyWarRate() {
    const roll = Math.random() * 100;
    if (roll < 0.5) return 'Mystic';
    if (roll < 1.5) return 'Legendary';
    if (roll < 6.5) return 'Epic';
    if (roll < 21.5) return 'Rare';
    if (roll < 51.5) return 'Uncommon';
    return 'Common';
}

function getRandomHWCardByRarity(rarity) {
    const pool = Object.keys(HW_CARDS).filter(k => HW_CARDS[k].rarity === rarity);
    if (pool.length === 0) return 'Blue Demon';
    return pool[Math.floor(Math.random() * pool.length)];
}

window.rollHolyWarGacha = function(times) {
    if (times === 10) {
        const currentPulls = playerData.hwPulls || 0;
        if (currentPulls > 0 && currentPulls % 30 === 0 && !playerData.hwFreeClaimed) {
            playerData.hwFreeClaimed = true;
            executeHWRoll(10);
            return;
        }
        if ((playerData.sealFragments || 0) < 9) {
            if(typeof showToast === 'function') showToast('❌ Seal Fragments ไม่พอ! (ต้องการ 9)', '#f87171'); return;
        }
        playerData.sealFragments -= 9;
        playerData.hwFreeClaimed = false;
        executeHWRoll(10);
    } else {
        if ((playerData.sealFragments || 0) < 1) {
            if(typeof showToast === 'function') showToast('❌ Seal Fragments ไม่พอ! (ต้องการ 1)', '#f87171'); return;
        }
        playerData.sealFragments -= 1;
        executeHWRoll(1);
    }
}

window.rollHolyWarPremium = function() {
    if ((playerData.premiumTickets || 0) < 1) {
        if(typeof showToast === 'function') showToast('❌ Premium Ticket ไม่พอ!', '#f87171'); return;
    }
    playerData.premiumTickets -= 1;
    const rarity = Math.random() < 0.1 ? 'Mystic' : 'Legendary';
    const cardName = getRandomHWCardByRarity(rarity);
    executeHWRoll(0, [cardName]);
}

function executeHWRoll(times, preselected = null) {
    const results = [];
    if (preselected) {
        results.push(...preselected);
    } else {
        for (let i = 0; i < times; i++) {
            const r = getHolyWarRate();
            results.push(getRandomHWCardByRarity(r));
            playerData.hwPulls = (playerData.hwPulls || 0) + 1;
            playerData.hwTotalPulls = (playerData.hwTotalPulls || 0) + 1;
        }
    }

    results.forEach(name => {
        const key = `${name}|${HW_THEME}`;
        playerData.collection[key] = (playerData.collection[key] || 0) + 1;
    });
    
    if (typeof saveData === 'function') saveData();
    if (typeof updateHubUI === 'function') updateHubUI();
    if (typeof renderPacksPanel === 'function') renderPacksPanel();

    // หาการ์ดที่ระดับสูงสุดในรอบนี้ เพื่อเล่น Quote Animation
    const rankValue = { 'Mystic': 3, 'Legendary': 2, 'Epic': 1, 'Rare': 0, 'Uncommon': 0, 'Common': 0 };
    let highestCard = null;
    let maxR = -1;
    results.forEach(n => {
        const r = HW_CARDS[n]?.rarity || 'Common';
        if ((rankValue[r] || 0) > maxR) { maxR = rankValue[r] || 0; highestCard = n; }
    });

    // ถ้าได้ Epic ขึ้นไปและมีคำพูด → เล่น Quote Animation ก่อนแสดงผล
    if (maxR >= 1 && highestCard && HW_QUOTES[highestCard]) {
        _showHWQuoteAnimation(highestCard, () => showHolyWarReveal(results));
    } else {
        showHolyWarReveal(results);
    }
}

function _showHWQuoteAnimation(cardName, callback) {
    const card = HW_CARDS[cardName];
    const quote = HW_QUOTES[cardName] || "พลังแห่งความมืดกำลังตื่นขึ้น...";
    const colorMap = { 'Mystic': '#ef4444', 'Legendary': '#fbbf24', 'Epic': '#c084fc' };
    const glowColor = colorMap[card?.rarity] || '#ef4444';

    // สร้าง Overlay
    const ov = document.createElement('div');
    ov.id = '_hw-quote-anim';
    ov.style.cssText = `
        position:fixed;inset:0;background:#000;z-index:10000;
        display:flex;flex-direction:column;align-items:center;justify-content:center;
        transition:opacity 0.4s ease;
    `;

    // รูปการ์ด
    const imgEl = document.createElement('img');
    imgEl.src = card?.art || '';
    imgEl.style.cssText = `
        width:140px;height:200px;object-fit:cover;border-radius:12px;
        border:2px solid ${glowColor};box-shadow:0 0 30px ${glowColor}88;
        margin-bottom:24px;opacity:0;transform:scale(0.8);
        transition:all 0.5s ease;
    `;

    // กล่องคำพูด
    const quoteBox = document.createElement('div');
    quoteBox.style.cssText = `
        color:${glowColor};font-size:1.4rem;font-weight:bold;font-style:italic;
        text-align:center;max-width:80%;opacity:1;
        letter-spacing:1px;line-height:1.7;
        text-shadow:0 0 12px ${glowColor};
        min-height:2.5em;
    `;
    quoteBox.innerHTML = '';

    // ชื่อการ์ด
    const nameTag = document.createElement('div');
    nameTag.style.cssText = `
        margin-top:16px;font-size:0.8rem;color:#9ca3af;
        letter-spacing:2px;text-transform:uppercase;opacity:0;transition:opacity 0.5s ease 0.3s;
    `;
    nameTag.textContent = `— ${cardName} —`;

    ov.appendChild(imgEl);
    ov.appendChild(quoteBox);
    ov.appendChild(nameTag);
    document.body.appendChild(ov);

    // เล่นเสียง (ถ้ามี)
    if (HW_ASSETS.audio && HW_ASSETS.audio[cardName]) {
        const snd = new Audio(HW_ASSETS.audio[cardName]);
        snd.volume = 0.8;
        snd.play().catch(() => {});
    } else {
        // เสียง Epic default
        const snd = new Audio('https://files.catbox.moe/mu7wrw.wav');
        snd.volume = 0.5;
        snd.play().catch(() => {});
    }

    // Fade-in รูป
    setTimeout(() => {
        imgEl.style.opacity = '1';
        imgEl.style.transform = 'scale(1)';
        nameTag.style.opacity = '1';
    }, 100);

    // Typewriter คำพูด
    let i = 0;
    function typeWriter() {
        if (i < quote.length) {
            quoteBox.innerHTML += quote.charAt(i);
            i++;
            setTimeout(typeWriter, 45);
        } else {
            // รอ 2 วินาทีแล้ว Fade out
            setTimeout(() => {
                ov.style.opacity = '0';
                setTimeout(() => {
                    ov.remove();
                    callback();
                }, 400);
            }, 2000);
        }
    }
    setTimeout(typeWriter, 500);
}

function showHolyWarReveal(cards) {
    const ov = document.createElement('div');
    ov.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,0.95);z-index:9999;display:flex;flex-direction:column;align-items:center;justify-content:center;animation:fadeIn 0.3s ease;overflow-y:auto;padding:20px;';
    
    let hasEpicOrHigher = false;
    let audioToPlay = null;

    const cardsHtml = cards.map(name => {
        const c = HW_CARDS[name];
        if (['Mystic', 'Legendary', 'Epic'].includes(c.rarity)) hasEpicOrHigher = true;
        if (HW_ASSETS.audio[name] && !audioToPlay) audioToPlay = HW_ASSETS.audio[name];
        
        const colorMap = { 'Mystic':'#ef4444', 'Legendary':'#fbbf24', 'Epic':'#c084fc', 'Rare':'#60a5fa', 'Uncommon':'#4ade80', 'Common':'#9ca3af' };
        const borderColor = colorMap[c.rarity];

        return `
        <div style="width:100px; margin:5px; border-radius:10px; border:2px solid ${borderColor}; background:#111827; overflow:hidden; box-shadow:0 0 10px ${borderColor}66; text-align:center;">
            <img src="${c.art}" style="width:100%; height:90px; object-fit:cover;">
            <div style="padding:4px; font-size:0.6rem; color:white; font-weight:bold; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">${name}</div>
            <div style="font-size:0.5rem; color:${borderColor}; padding-bottom:4px;">${c.rarity}</div>
        </div>`;
    }).join('');

    ov.innerHTML = `
        <h2 style="color:#fcd34d; font-size:2rem; margin-bottom:20px; text-shadow:0 0 15px #fcd34d;">⚔️ Holy War Summon ⚔️</h2>
        <div style="display:flex; flex-wrap:wrap; justify-content:center; max-width:600px;">${cardsHtml}</div>
        <button onclick="this.parentElement.remove()" style="margin-top:30px; background:#4f46e5; color:white; border:none; padding:10px 30px; border-radius:10px; font-size:1.2rem; cursor:pointer;">สุดยอด!</button>
    `;
    document.body.appendChild(ov);

    if (audioToPlay) {
        const snd = new Audio(audioToPlay);
        snd.volume = 0.8;
        snd.play().catch(()=>{});
    } else if (hasEpicOrHigher) {
        const snd = new Audio('https://files.catbox.moe/mu7wrw.wav');
        snd.volume = 0.5;
        snd.play().catch(()=>{});
    }
}

// --- ระบบ Pity ---
window.claimHolyWarPity = function(type) {
    const pulls = playerData.hwTotalPulls || 0;
    if (type === 50) {
        if (pulls < 50) { if(typeof showToast==='function') showToast(`❌ ต้องสุ่มให้ครบ 50 ครั้งก่อน (ปัจจุบัน ${pulls})`, '#f87171'); return; }
        if (playerData.hwPity50Claimed) { if(typeof showToast==='function') showToast(`❌ รับไปแล้ว!`, '#f87171'); return; }
        playerData.hwPity50Claimed = true;
        const cardName = getRandomHWCardByRarity('Legendary');
        playerData.collection[`${cardName}|${HW_THEME}`] = (playerData.collection[`${cardName}|${HW_THEME}`] || 0) + 1;
        if(typeof saveData==='function') saveData(); 
        if(typeof showToast==='function') showToast(`🎉 ได้รับ ${cardName} จาก Pity 50!`, '#fbbf24');
    } else if (type === 100) {
        if (pulls < 100) { if(typeof showToast==='function') showToast(`❌ ต้องสุ่มให้ครบ 100 ครั้งก่อน (ปัจจุบัน ${pulls})`, '#f87171'); return; }
        if (playerData.hwPity100Claimed) { if(typeof showToast==='function') showToast(`❌ รับไปแล้ว!`, '#f87171'); return; }
        
        const legPool = Object.keys(HW_CARDS).filter(k => HW_CARDS[k].rarity === 'Legendary');
        const selectHtml = legPool.map(n => `<button onclick="selectPity100('${n}')" style="margin:5px; padding:10px; background:#1e1b4b; color:white; border:1px solid #fbbf24; border-radius:8px; cursor:pointer;">${n}</button>`).join('');
        
        const ov = document.createElement('div');
        ov.id = 'hw-pity100-overlay';
        ov.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,0.95);z-index:9999;display:flex;flex-direction:column;align-items:center;justify-content:center;';
        ov.innerHTML = `
            <h2 style="color:#fbbf24; margin-bottom:20px;">เลือก Legendary ที่ต้องการ</h2>
            <div style="max-width:500px; display:flex; flex-wrap:wrap; justify-content:center;">${selectHtml}</div>
            <button onclick="this.parentElement.remove()" style="margin-top:20px; padding:10px 20px;">ปิด</button>
        `;
        document.body.appendChild(ov);
    }
}

window.selectPity100 = function(cardName) {
    playerData.hwPity100Claimed = true;
    playerData.collection[`${cardName}|${HW_THEME}`] = (playerData.collection[`${cardName}|${HW_THEME}`] || 0) + 1;
    if(typeof saveData==='function') saveData();
    document.getElementById('hw-pity100-overlay').remove();
    if(typeof showToast==='function') showToast(`🎉 เลือก ${cardName} สำเร็จ!`, '#fbbf24');
}

// --- ระบบ Mechanics โลก --- 
function _hookHolyWarMechanics() {
    // 1. Get Char Stats Hook
    if (typeof window.getCharStats === 'function') {
        const _origStats = window.getCharStats;
        window.getCharStats = function(char) {
            let stats = _origStats.apply(this, arguments);
            if (char.silenced) return stats;
            const effName = char.originalName || char.name;

            const pKey = typeof state !== 'undefined' && state.players.player.field.some(c => c.id === char.id) ? 'player' : 'ai';
            if (typeof state !== 'undefined' && state.players[pKey]) {
                const baseHp = state.players[pKey].hp;
                const ownField = state.players[pKey].field;

                if (effName === 'Thin Albion') {
                    stats.damageReduce = (stats.damageReduce || 0) + 2;
                }
                if (effName === 'Silver Demon' && baseHp < 10) {
                    stats.atk += 6; stats.maxHp += 6;
                }
                if (effName === 'Copper Demon' && baseHp > 15) {
                    stats.atk += 4; stats.maxHp += 4;
                }
                if (effName === 'White Demon') {
                    const wdCount = ownField.filter(c => (c.originalName || c.name) === 'White Demon').length;
                    stats.atk += wdCount; stats.maxHp += wdCount;
                }
                if (effName === 'Gelda') {
                    const hasZel = ownField.some(c => (c.originalName || c.name) === 'Zeldris');
                    if (hasZel) {
                        stats.atk += 3; stats.maxHp += 3;
                    }
                    if (state.totalTurns % 2 === 0) {
                        stats.atk *= 2; stats.maxHp *= 2;
                    }
                }
                if (effName === 'Drole') {
                    const hasGlox = ownField.some(c => (c.originalName || c.name) === 'Gloxinia');
                    if (hasGlox) stats.damageReduce += Math.floor(stats.maxHp * 0.20);
                }
                if (effName === 'Gloxinia') {
                    const hasDrole = ownField.some(c => (c.originalName || c.name) === 'Drole');
                    if (hasDrole) {
                        stats.atk += 2; stats.maxHp += 2;
                    }
                }
                if (effName === 'Grayroad') {
                    if (ownField.length >= 2) {
                        stats.maxAttacks = 0;
                    }
                }

                // --- [FIX] คำนวณ HP แท้จริงจาก maxHp ที่บัฟแล้ว ป้องกันบัคอมตะ ---
                if (char.hp <= -99) {
                    stats.hp = 0; // โดน Instakill → ตายแน่นอน 100%
                } else {
                    const hpBuff = stats.maxHp - (char.maxHp || 0);
                    stats.hp = Math.max(0, char.hp + hpBuff);
                }
            }

            if (typeof state !== 'undefined' && state.sharedFieldCard && state.sharedFieldCard.name === 'Chandler True Night') {
                const dbCard = CardSets[char._theme] ? CardSets[char._theme][effName] : null;
                if (dbCard) {
                    stats.atk = dbCard.atk || 0;
                    stats.maxHp = dbCard.hp || 0;
                    // [FIX] ให้ hp ไหลตาม char.hp จริง ไม่ clamp ทับ (การ clamp ทำตอน Summon แล้ว)
                    stats.hp = char.hp <= -99 ? 0 : Math.max(0, char.hp);
                }
            }
            return stats;
        };
    }

    // 2. Initiate Attack Hook
    if (typeof window.initiateAttack === 'function') {
        const _origInitAttack = window.initiateAttack;
        window.initiateAttack = function(atkId, tgtId, isBase) {
            if (typeof state === 'undefined' || isBase) { _origInitAttack.apply(this, arguments); return; }
            
            const atkKey = state.currentTurn;
            const defKey = atkKey === 'player' ? 'ai' : 'player';
            const attacker = state.players[atkKey].field.find(c => c.id === atkId);
            let target = state.players[defKey].field.find(c => c.id === tgtId);

            if (attacker && target) {
                const aN = attacker.originalName || attacker.name;
                let tN = target.originalName || target.name;

                if (tN === 'Estarossa' && attacker._estarossaLove > 0) {
                    if (typeof log === 'function') log(`🖤[Estarossa] เป้าหมายตกหลุมรัก... ดาเมจกลายเป็น 0!`, 'text-gray-400');
                    attacker.attacksLeft -= 1;
                    state.selectedCardId = null; 
                    if (typeof updateUI === 'function') updateUI();
                    return;
                }

                if (tN === 'Fraudrin' && !target.silenced) {
                    const others = state.players[defKey].field.filter(c => c.id !== target.id && typeof getCharStats==='function' && getCharStats(c).hp > 0);
                    if (others.length > 0) {
                        const lowestCostUnit = others.sort((a,b) => (a.cost || 0) - (b.cost || 0))[0];
                        arguments[1] = lowestCostUnit.id;
                        target = lowestCostUnit;
                        tN = target.originalName || target.name;
                        if(typeof log === 'function') log(`🟣 [Fraudrin] ขี้ขลาด! โยนการโจมตีไปให้ ${target.name} รับแทน!`, 'text-purple-400 font-bold');
                    }
                }

                if (tN === 'Silver Demon' && !target.silenced && (target.silverEvade || 0) > 0) {
                    if (Math.random() < target.silverEvade) {
                        if(typeof log === 'function') log(`⚪[Silver Demon] หลบหลีกพริบตา! (${(target.silverEvade*100).toFixed(0)}%)`, 'text-slate-300 font-bold');
                        attacker.attacksLeft -= 1;
                        state.selectedCardId = null;
                        if (typeof updateUI === 'function') updateUI();
                        return;
                    }
                }

                if (aN === 'Possed knight' && !attacker.silenced && target.status.includes('Paralyze')) {
                    attacker.atk += 5;
                    attacker._possessedBoost = true;
                    if(typeof log === 'function') log(`🗡️ [Possessed Knight] โจมตีเป้าหมายที่ไร้ทางสู้! ดาเมจ +5!`, 'text-zinc-400 font-bold');
                }

                const prevTgtHp = target.hp;
                let evadeOrTaunt = false;
                const origTargetId = target.id;

                _origInitAttack.apply(this, arguments);
                
                if (attacker._possessedBoost) {
                    attacker.atk -= 5;
                    attacker._possessedBoost = false;
                }

                const tgtAfter = state.players[defKey].field.find(c => c.id === origTargetId);
                if (tgtAfter && tgtAfter.hp === prevTgtHp && tgtAfter.hp > 0) evadeOrTaunt = true;

                if (tN === 'Grey Demon' && !target.silenced) {
                    const dmgTaken = prevTgtHp - (tgtAfter ? tgtAfter.hp : 0);
                    if (dmgTaken > 0 && dmgTaken <= 3 && tgtAfter) {
                        tgtAfter.hp = prevTgtHp;
                        if(typeof log === 'function') log(`🩶 [Grey Demon] ผิวหนังหนาทึบ! ดาเมจ ${dmgTaken} ไม่สะเทือน!`, 'text-gray-400 font-bold');
                    }
                }

                if (aN === 'Possed knight' && !attacker.silenced && tgtAfter && tgtAfter.hp > 0 && !tgtAfter.tossakanImmune) {
                    if (Math.random() < 0.5) {
                        if (!tgtAfter.status.includes('Paralyze')) tgtAfter.status.push('Paralyze');
                        tgtAfter.paralyzeTurns = Math.max(tgtAfter.paralyzeTurns || 0, 2);
                        if(typeof log === 'function') log(`🗡️ [Possessed Knight] พลังมืดทำให้ ${tgtAfter.name} ติด Paralyze!`, 'text-zinc-400 font-bold');
                    }
                }

                if (aN === 'Gelda' && !attacker.silenced && tgtAfter) {
                    if (tgtAfter.hp > 0 && !tgtAfter.status.includes('Bleed') && !tgtAfter.tossakanImmune) {
                        tgtAfter.status.push('Bleed'); 
                        tgtAfter.shalltearBleedTurns = 2;
                    }
                    const dmgTaken = prevTgtHp - Math.max(0, tgtAfter.hp);
                    const heal = Math.floor(dmgTaken * 0.5);
                    if (heal > 0 && typeof getCharStats === 'function') {
                        attacker.hp = Math.min(getCharStats(attacker).maxHp, attacker.hp + heal);
                        if(typeof log === 'function') log(`🧛‍♀️[Gelda] สูบเลือดฟื้นฟู ${heal} HP!`, 'text-rose-400 font-bold');
                    }
                }

                if (aN === 'Silver Demon' && !attacker.silenced && (!tgtAfter || tgtAfter.hp <= 0)) {
                    const baseHp = state.players[atkKey].hp;
                    if (baseHp < 5) {
                        attacker.silverEvade = Math.min(0.8, (attacker.silverEvade || 0) + 0.2);
                        if(typeof log === 'function') log(`⚪ [Silver Demon] สังหารสำเร็จ! ความเร็วหลบหลีกเพิ่มเป็น ${(attacker.silverEvade*100).toFixed(0)}%`, 'text-slate-300 font-bold');
                    }
                }

                if (aN === 'Derieri' && tgtAfter && tgtAfter.hp < prevTgtHp) {
                    attacker.atk += 3;
                    if (attacker.atk >= 15 && tgtAfter.hp > 0) {
                        tgtAfter.hp = -99;
                        if (typeof log === 'function') log(`🔥 [Derieri] Combo Star ครบ 15! ONE SHOT KILL!`, 'text-orange-500 font-bold');
                    } else {
                        if (typeof log === 'function') log(`🔥 [Derieri] Combo Star! ATK +3`, 'text-orange-400');
                    }
                }

                if (aN === 'Galand' && evadeOrTaunt && tgtAfter) {
                    if (!tgtAfter.tossakanImmune) {
                        tgtAfter.status.push('Freeze'); tgtAfter.freezeTurns = 999;
                        if (typeof log === 'function') log(`🗿 [Galand] Commandment of Truth! ผู้หลอกลวงต้องถูกสาปให้แข็งถาวร!`, 'text-red-500 font-bold');
                    } else {
                        attacker.atk += 5; attacker.maxHp += 5; attacker.hp += 5;
                        if (typeof log === 'function') log(`🗿 [Galand] ศัตรูต่อต้านคำสาป! Galand คลุ้มคลั่ง +5/+5!`, 'text-red-400 font-bold');
                    }
                }

                if (aN === 'Estarossa' && Math.random() < 0.5 && tgtAfter) {
                    tgtAfter._estarossaLove = 2;
                    if (typeof log === 'function') log(`🖤[Estarossa] เป้าหมายถูกครอบงำด้วยความรัก 2 เทิร์น!`, 'text-gray-400');
                }
                if (tN === 'Estarossa' && prevTgtHp > 0) {
                    // [FIX ESTAROSSA] ค้นหาเลือดเป้าหมายแม้จะตกสุสานไปแล้ว
                    let currentTgtHp = 0;
                    const tAfter = state.players[defKey].field.find(c => c.id === origTargetId);
                    if (tAfter) {
                        currentTgtHp = tAfter.hp;
                    } else {
                        const tGy = state.players[defKey].graveyard?.find(c => c.id === origTargetId);
                        if (tGy) currentTgtHp = tGy.hp;
                        else {
                            const tSp = state.players[defKey].spaceZone?.find(c => c.id === origTargetId);
                            if (tSp) currentTgtHp = tSp.hp;
                        }
                    }
                    const dmgTaken = prevTgtHp - Math.max(0, currentTgtHp);
                    const reflect = Math.floor(dmgTaken * 0.5);
                    if (reflect > 0) {
                        const currentAttacker = state.players[atkKey].field.find(c => c.id === atkId);
                        if (currentAttacker && currentAttacker.hp > 0) {
                            currentAttacker.hp -= reflect;
                            if (typeof log === 'function') log(`🖤 [Estarossa] Full Counter! สะท้อน ${reflect} ดาเมจใส่ ${aN}!`, 'text-gray-300 font-bold');
                            if (typeof checkDeath === 'function') checkDeath(atkKey);
                            if (typeof updateUI === 'function') updateUI();
                        }
                    }
                }

                if (aN === 'Galla' && Math.random() < 0.5 && tgtAfter) {
                    tgtAfter.hp -= attacker.atk;
                    if (typeof log === 'function') log(`🩸 [Galla] การโจมตีคริติคอลทะลุเกราะ!`, 'text-pink-400');
                }

                if (aN === 'Monspeet') {
                    const others = state.players[defKey].field.filter(c => c.id !== (tgtAfter?tgtAfter.id:tgtId) && c.hp > 0);
                    if (others.length > 0) {
                        const splashTgt = others[Math.floor(Math.random() * others.length)];
                        splashTgt.hp -= 2;
                        if (typeof log === 'function') log(`🔥 [Monspeet] เปลวเพลิงลุกลาม 2 ดาเมจใส่ ${splashTgt.name}`, 'text-red-400');
                    }
                }

                if (aN === 'Atollah' && tgtAfter) {
                    if (!tgtAfter.status.includes('Bleed')) tgtAfter.status.push('Bleed');
                    tgtAfter.shalltearBleedTurns = 2;
                }
                if (tN === 'Atollah') {
                    attacker.hp -= 2;
                    if (!attacker.status.includes('Bleed')) attacker.status.push('Bleed');
                    attacker.shalltearBleedTurns = 2;
                    if (typeof log === 'function') log(`🗡️ [Atollah] สวนกลับ 2 ดาเมจ + Bleed!`, 'text-rose-400');
                }

                if ((!tgtAfter || tgtAfter.hp <= 0) && !attacker.silenced && aN !== 'Grayroad') {
                    const hasGrayroad = state.players.player.field.some(c => (c.originalName || c.name) === 'Grayroad' && !c.silenced && c.hp > 0) ||
                                        state.players.ai.field.some(c => (c.originalName || c.name) === 'Grayroad' && !c.silenced && c.hp > 0);
                    if (hasGrayroad) {
                        attacker.hp = -99;
                        if(typeof log === 'function') log(`💀 [Grayroad] ธรรมบัญญัติแห่งความสงบ! ผู้ที่พรากชีวิตด้วยคมดาบ ย่อมถูกสูบเวลาชีวิต! ${attacker.name} ตายตามไป!`, 'text-gray-500 font-bold');
                        if(typeof checkDeath === 'function') checkDeath(atkKey);
                    }
                }

                if (attacker.items && attacker.items.some(i => i.name === 'Basquias')) {
                    const others = state.players[defKey].field.filter(c => c.id !== origTargetId && c.hp > 0);
                    if (others.length > 0) {
                        const splash = others[Math.floor(Math.random() * others.length)];
                        splash.hp -= 2;
                        if (typeof log === 'function') log(`🧚 [Basquias] ลำแสงหอกศักดิ์สิทธิ์ ชิ่งโดน ${splash.name} 2 ดาเมจ!`, 'text-yellow-400');
                    }
                }

                if (attacker.items && attacker.items.some(i => i.name === 'Form Ten: Emerald Octo') && tgtAfter) {
                    if (!tgtAfter.status.includes('Paralyze') && !tgtAfter.tossakanImmune) {
                        tgtAfter.status.push('Paralyze');
                        tgtAfter.paralyzeTurns = Math.max(tgtAfter.paralyzeTurns || 0, 2);
                        if (typeof log === 'function') log(`🐙 [Emerald Octo] หนวดมรกต รัดเป้าหมายให้ขยับไม่ได้!`, 'text-teal-400 font-bold');
                    }
                }

                if (typeof checkDeath === 'function') checkDeath(defKey);

            } else {
                const aN = attacker ? (attacker.originalName || attacker.name) : '';
                if (aN === 'Drole') {
                    if (typeof log === 'function') log(`[Drole] โจมตี Base ไม่เกิดดาเมจ!`, 'text-stone-400');
                    attacker.attacksLeft -= 1;
                    state.selectedCardId = null; 
                    if (typeof updateUI === 'function') updateUI();
                    return;
                }
                _origInitAttack.apply(this, arguments);
            }
        };
    }

    // 3. Trigger On Summon
    if (typeof window.triggerOnSummon === 'function') {
        const _origSummon = window.triggerOnSummon;
        window.triggerOnSummon = function(card, pk) {
            _origSummon.apply(this, arguments);
            if (card.silenced) return;
            const eff = card.originalName || card.name;
            const p = state.players[pk];
            const oppKey = pk === 'player' ? 'ai' : 'player';
            const opp = state.players[oppKey];

            if (eff === 'Gloxinia') {
                executeGloxiniaForm(card, pk);
            }
            if (eff === 'Melascula') {
                const rand = Math.floor(Math.random() * 3);
                if (rand === 0) {
                    card.maxHp += 10; card.hp += 10;
                    const friends = p.field.filter(c => c.id !== card.id && c.hp > 0);
                    if (friends.length > 0) { const f = friends[0]; f.maxHp += 5; f.hp += 5; }
                    if (typeof log === 'function') log(`🐍[Melascula] Faith 1: บัฟ HP ให้ตัวเองและเพื่อน!`, 'text-fuchsia-400');
                } else if (rand === 1) {
                    card.atk += 8;
                    const friends = p.field.filter(c => c.id !== card.id && c.hp > 0);
                    if (friends.length > 0) { const f = friends[0]; f.atk += 3; }
                    if (typeof log === 'function') log(`🐍 [Melascula] Faith 2: บัฟ ATK มหาศาล!`, 'text-fuchsia-400');
                } else {
                    if (p.hp >= 20) { p.cost = Math.min(20, p.cost + 5); } else { p.hp = Math.min(20, p.hp + 2); }
                    card.hasEvade = true;
                    if (typeof log === 'function') log(`🐍 [Melascula] Faith 3: ฮีล Base และได้รับ Evade!`, 'text-fuchsia-400');
                }
            }
            if (eff === 'Zeldris') {
                card.isSpellImmune = true;
                card.tossakanImmune = true;
                const pulled = [];
                while (opp.hand.length > 0 && opp.field.length < (typeof getMaxFieldSlots === 'function' ? getMaxFieldSlots(oppKey) : 6)) {
                    const idx = Math.floor(Math.random() * opp.hand.length);
                    const c = opp.hand[idx];
                    if (c.type === 'Character') {
                        opp.hand.splice(idx, 1);
                        c.attacksLeft = c.maxAttacks || 1;
                        opp.field.push(c);
                        pulled.push(c);
                        _origSummon(c, oppKey);
                    } else {
                        break; 
                    }
                }
                if (pulled.length > 0) {
                    if (typeof log === 'function') log(`⚔️ [Zeldris] Ominous Nebula! ดึงศัตรูลงสนามและทำ 5 ดาเมจ!`, 'text-red-500 font-bold');
                    pulled.forEach(c => { 
                        c.hp -= 5; 
                        if (c.hp <= 0) { c.hp = -99; c.zeldrisSpaceZone = true; }
                    });
                    if (typeof checkDeath === 'function') checkDeath(oppKey);
                }
            }
            if (eff === 'Derocchio') {
                const alive = opp.field.filter(c => c.hp > 0 && !c.tossakanImmune);
                const shuffled = [...alive].sort(() => Math.random() - 0.5);
                if (shuffled[0]) { shuffled[0].status.push('Freeze'); shuffled[0].freezeTurns = 2; }
                if (shuffled[1]) { shuffled[1].status.push('Burn'); shuffled[1].burnTurns = 2; }
                if (shuffled[2]) { shuffled[2].status.push('Bleed'); shuffled[2].shalltearBleedTurns = 2; }
                if (shuffled[3]) { shuffled[3].status.push('Paralyze'); shuffled[3].paralyzeTurns = 2; }
                if (typeof log === 'function') log(`🦁[Derocchio] สาด Debuff ใส่ศัตรู!`, 'text-orange-400');
            }
            if (eff === 'Belion') {
                const count = p.field.length - 1;
                if (count > 0) { card.atk += (count * 2); if (typeof log === 'function') log(`[Belion] +${count*2} ATK!`, 'text-slate-400'); }
            }
            if (eff === 'Cusack') {
                const alive = opp.field.filter(c => c.hp > 0 && !c.tossakanImmune);
                if (alive.length > 0) {
                    const t = alive[Math.floor(Math.random() * alive.length)];
                    t.status.push('Poison');
                    if (typeof log === 'function') log(`[Cusack] สาปพิษใส่ ${t.name}!`, 'text-indigo-400');
                }
                card.tossakanImmune = true;
            }
            if (eff === 'Estarossa') {
                const alive = opp.field.filter(c => c.hp > 0);
                if (alive.length > 0) {
                    const t = alive[Math.floor(Math.random() * alive.length)];
                    t._estarossaLove = 3;
                    if (typeof log === 'function') log(`🖤 [Estarossa] ${t.name} ติดคำสาปแห่งความรัก!`, 'text-gray-400');
                }
            }
            if (eff === 'Chandler') {
                if (state.sharedFieldCard && state.sharedFieldCard.isUltimateField) return;
                state.sharedFieldCard = { name: 'Chandler True Night', cost: 0, text: 'True Night', color: 'bg-blue-900', art: '' };
                state.sharedFieldCardOwner = pk;
                if (typeof log === 'function') log(`🌑 [Chandler] True Night ปกคลุมสนาม! สเตตัสถูกล็อค!`, 'text-blue-500 font-bold');
                // [FIX CHANDLER] หั่น HP จริงของทุกคนให้เท่า Base ป้องกันเลือดทิพย์ตอนโดนตี
                ['player', 'ai'].forEach(owner => {
                    state.players[owner].field.forEach(c => {
                        const eName = c.originalName || c.name;
                        const dbC = (typeof CardSets !== 'undefined' && c._theme && CardSets[c._theme]) ? CardSets[c._theme][eName] : null;
                        if (dbC && c.hp > (dbC.hp || 0)) {
                            c.hp = dbC.hp;
                        }
                    });
                });
                if (typeof updateFieldZoneBackground === 'function') updateFieldZoneBackground(state.sharedFieldCard);
            }
            if (eff === 'Fat Albion') {
                const enemies = opp.field.filter(c => typeof getCharStats==='function' && getCharStats(c).hp > 0);
                const shuffled = [...enemies].sort(() => Math.random() - 0.5).slice(0, 3);
                shuffled.forEach(t => {
                    t.hp -= 4;
                    if(typeof log === 'function') log(`[Fat Albion] ทำ 4 ดาเมจใส่ ${t.name}!`, 'text-stone-400 font-bold');
                });
                if (shuffled.length > 0 && typeof checkDeath === 'function') checkDeath(oppKey);
            }
            if (eff === 'White Demon' && !card.whiteDemonSummoned) {
                card.whiteDemonSummoned = true;
                const count = Math.floor(Math.random() * 3) + 1; // [FIX] 1-3 ตัว (เดิม 1-5)
                if(typeof log === 'function') log(`[White Demon] แบ่งตัว! อัญเชิญพวกมาเพิ่มอีก ${count} ตัว!`, 'text-gray-300 font-bold');
                for (let i = 0; i < count && p.field.length < (typeof getMaxFieldSlots === 'function' ? getMaxFieldSlots(pk) : 6); i++) {
                    const wd = JSON.parse(JSON.stringify(card));
                    wd.id = 'card_' + Date.now() + Math.floor(Math.random()*1000);
                    wd.status = []; wd.items = []; wd.attacksLeft = 1;
                    p.field.push(wd);
                }
            }
            if (eff === 'Grey Demon') {
                if(typeof log === 'function') log(`[Grey Demon] สาดดาเมจมืด! โจมตี 1 ดาเมจ 5 ครั้งแบบสุ่ม!`, 'text-gray-500 font-bold');
                for (let i = 0; i < 5; i++) {
                    const alive = opp.field.filter(c => typeof getCharStats==='function' && getCharStats(c).hp > 0);
                    if (alive.length > 0) {
                        const t = alive[Math.floor(Math.random() * alive.length)];
                        t.hp -= 1;
                    }
                }
                if (typeof checkDeath === 'function') checkDeath(oppKey);
            }
            if (eff === 'Red Demon') {
                const alive = opp.field.filter(c => typeof getCharStats==='function' && getCharStats(c).hp > 0 && !c.tossakanImmune);
                const shuffled = [...alive].sort(() => Math.random() - 0.5).slice(0, 2);
                shuffled.forEach(t => {
                    if (!t.status.includes('Burn')) t.status.push('Burn');
                    t.burnTurns = Math.max(t.burnTurns || 0, 3);
                    if(typeof log === 'function') log(`[Red Demon] แผดเผา ${t.name} (Burn 3 เทิร์น)!`, 'text-red-500 font-bold');
                });
            }
            if (eff === 'Ochre Demon') {
                const alive = opp.field.filter(c => typeof getCharStats==='function' && getCharStats(c).hp > 0 && !c.tossakanImmune);
                if (alive.length > 0) {
                    const t = alive[Math.floor(Math.random() * alive.length)];
                    if (!t.status.includes('Paralyze')) t.status.push('Paralyze');
                    t.paralyzeTurns = Math.max(t.paralyzeTurns || 0, 2);
                    if(typeof log === 'function') log(`[Ochre Demon] พ่นพิษชา! ${t.name} ติด Paralyze 2 เทิร์น!`, 'text-yellow-500 font-bold');
                }
            }
            if (eff === 'Fraudrin') {
                let allItems = [];
                Object.keys(CardSets).forEach(th => {
                    Object.keys(CardSets[th]).forEach(k => {
                        if (CardSets[th][k].type === 'Item') allItems.push({key: k, theme: th});
                    });
                });
                if (allItems.length > 0) {
                    const randItem = allItems[Math.floor(Math.random() * allItems.length)];
                    const itemCard = typeof createCardInstance === 'function' ? createCardInstance(randItem.key, randItem.theme) : null;
                    if (itemCard) {
                        card.items.push(itemCard);
                        if(typeof log === 'function') log(`[Fraudrin] ขโมยยุทธภัณฑ์! สวมใส่ ${itemCard.name} ทันที!`, 'text-purple-400 font-bold');
                    }
                }
            }
        };
    }

    // 4. Action Tracker (Orange Demon, Chandler, Spells)
    function trackActionUsed(pk) {
        ['player', 'ai'].forEach(owner => {
            state.players[owner].field.forEach(c => {
                const n = c.originalName || c.name;
                if (n === 'Orange Demon' && !c.silenced && c.hp > 0) {
                    const oppKey = owner === 'player' ? 'ai' : 'player';
                    const oppField = state.players[oppKey].field.filter(x => typeof getCharStats==='function' && getCharStats(x).hp > 0);
                    if (oppField.length > 0) {
                        const t = oppField[Math.floor(Math.random() * oppField.length)];
                        t.hp -= 3;
                        if(typeof log === 'function') log(`🔥 [Orange Demon] โกรธแค้นต่อเวทมนตร์! พ่นไฟ 3 ดาเมจใส่ ${t.name}!`, 'text-orange-500 font-bold');
                        if (typeof checkDeath === 'function') checkDeath(oppKey);
                    }
                }
                if (n === 'Chandler' && pk !== owner && !c.silenced && c.hp > 0) { 
                    const oppKey = owner === 'player' ? 'ai' : 'player';
                    const oppField = state.players[oppKey].field.filter(x => typeof getCharStats==='function' && getCharStats(x).hp > 0);
                    if (oppField.length > 0) {
                        const t = oppField[Math.floor(Math.random() * oppField.length)];
                        t.hp -= 4;
                        if(typeof log === 'function') log(`🌑 [Chandler] Full Counter! สวนเวท 4 ดาเมจใส่ ${t.name}!`, 'text-blue-500 font-bold');
                        if (typeof checkDeath === 'function') checkDeath(oppKey);
                    }
                }
            });
        });
    }

    if (typeof window.executeNonTargetAction === 'function') {
        const _origExecNT = window.executeNonTargetAction;
        window.executeNonTargetAction = function(card, pk) {
            const eff = card.originalName || card.name;
            const p = state.players[pk];
            const oppKey = pk === 'player' ? 'ai' : 'player';
            const opp = state.players[oppKey];

            if (eff === 'Form Two: Guardian') {
                if (p.field.length < (typeof getMaxFieldSlots === 'function' ? getMaxFieldSlots(pk) : 6)) {
                    const hasGlox = p.field.some(c => (c.originalName || c.name) === 'Gloxinia');
                    const atkVal = hasGlox ? 10 : 5;
                    const guardian = { 
                        id: 'card_'+Date.now(), name: 'Guardian', originalName: 'Guardian Token', 
                        type: 'Character', cost: 0, atk: atkVal, hp: 5, maxHp: 5, 
                        text: 'Taunt', color: 'bg-stone-600', maxAttacks: 1, 
                        status: [], items: [], attacksLeft: 1 
                    };
                    p.field.push(guardian);
                    if (typeof log === 'function') log(`🐻 [Guardian] พฤกษาพิทักษ์ปรากฏตัว! (ATK: ${atkVal})`, 'text-lime-400 font-bold');
                } else {
                    if (typeof log === 'function') log(`❌ สนามเต็ม ไม่สามารถเรียก Guardian ได้`, 'text-red-400');
                }
                p.graveyard.push(card);
                if (typeof updateUI === 'function') updateUI();
                trackActionUsed(pk);
                return;
            }
            if (eff === 'Form Nine: Death Thorn') {
                if (typeof log === 'function') log(`🥀 [Death Thorn] เถาวัลย์มรณะโจมตี 10 ครั้งรวด!`, 'text-purple-500 font-bold');
                let hits = 0;
                for (let i = 0; i < 10; i++) {
                    if (Math.random() < 0.10) {
                        const alive = opp.field.filter(c => typeof getCharStats === 'function' && getCharStats(c).hp > 0);
                        if (alive.length > 0) {
                            const t = alive[Math.floor(Math.random() * alive.length)];
                            t.hp -= 10;
                            hits++;
                        } else {
                            opp.hp -= 10;
                            hits++;
                        }
                    }
                }
                if (typeof log === 'function') log(`🥀 [Death Thorn] โจมตีสำเร็จ ${hits} ครั้ง!`, 'text-purple-400');
                if (typeof checkDeath === 'function') checkDeath(oppKey);
                if (typeof checkWinCondition === 'function') checkWinCondition();
                p.graveyard.push(card);
                if (typeof updateUI === 'function') updateUI();
                trackActionUsed(pk);
                return;
            }

            _origExecNT.apply(this, arguments);
            trackActionUsed(pk);
        };
    }

    if (typeof window.resolveTargetedPlay === 'function') {
        const _origTargetPlay = window.resolveTargetedPlay;
        window.resolveTargetedPlay = function(pk, srcId, tgtId) {
            const p = state.players[pk];
            const card = p.hand.find(c => c.id === srcId);
            
            if (card && card.name === 'Form Seven: Moon Rose') {
                const target = p.field.find(c => c.id === tgtId);
                if (target) {
                    const tName = target.originalName || target.name;
                    if (tName === 'Gloxinia' || tName === 'Drole') {
                        target.hp = (typeof getCharStats === 'function') ? getCharStats(target).maxHp : target.maxHp;
                        if (typeof log === 'function') log(`🌹 [Moon Rose] หยาดน้ำอมฤต! ฮีล ${target.name} จนเต็ม!`, 'text-pink-400 font-bold');
                    } else {
                        const max = (typeof getCharStats === 'function') ? getCharStats(target).maxHp : target.maxHp;
                        target.hp = Math.min(max, target.hp + 2);
                        if (typeof log === 'function') log(`🌹 [Moon Rose] ฮีล 2 HP ให้ ${target.name}`, 'text-pink-300');
                    }
                    p.cost -= (typeof getActualCost === 'function' ? getActualCost(card, pk) : card.cost);
                    p.hand.splice(p.hand.indexOf(card), 1);
                    p.graveyard.push(card);
                    if (typeof cancelTargeting === 'function') cancelTargeting();
                    if (typeof updateUI === 'function') updateUI();
                    trackActionUsed(pk);
                    return;
                }
            }

            _origTargetPlay.apply(this, arguments);
            if (card && (card.type === 'Action' || card.type === 'Spell')) {
                trackActionUsed(pk);
            }
        };
    }

    // 5. Check Death Hook
    if (typeof window.checkDeath === 'function') {
        const _origDeath = window.checkDeath;
        window.checkDeath = function(pk) {
            const p = state.players[pk];
            const oppKey = pk === 'player' ? 'ai' : 'player';

            p.field.forEach(c => {
                if (typeof getCharStats==='function' && getCharStats(c).hp <= 0 && !c.isDyingProcessing) {
                    const eff = c.originalName || c.name;

                    if (eff === 'Demon King' && c.hp === -99 && c.maxHp >= 4) {
                        c.hp = 10; c.isDyingProcessing = false;
                        if (typeof log === 'function') log(`👑 [Demon King] พลังแห่งจอมมารต่อต้านความตาย!`, 'text-red-500 font-bold');
                        return;
                    }

                    if (c.items && c.items.some(i => i.name === 'Yggdra Armor')) {
                        c.hp = 1; c.immortalTurns = 2;
                        c.items = c.items.filter(i => i.name !== 'Yggdra Armor');
                        c.isDyingProcessing = false;
                        if (typeof log === 'function') log(`🛡️ เกราะ Yggdra แตกสลาย! แต่ช่วยชีวิตไว้ได้!`, 'text-emerald-400 font-bold');
                        return;
                    }

                    if (c.zeldrisSpaceZone) {
                        c.isDyingProcessing = true;
                        p.spaceZone.push(c);
                        p.field.splice(p.field.indexOf(c), 1);
                        return;
                    }

                    if (eff === 'Melascula') {
                        if (typeof window.drawCard === 'function') window.drawCard(pk, 4);
                        if (typeof log === 'function') log(`🐍[Melascula] จั่ว 4 ใบเมื่อตาย`, 'text-fuchsia-400');
                    }
                    if (eff === 'Galla') {
                        if (typeof window.drawCard === 'function') window.drawCard(pk, 2);
                    }
                    if (eff === 'Cusack') {
                        const pool = Object.keys(CardSets).flatMap(th => Object.values(CardSets[th])).filter(cc => cc.type === 'Character' && cc.cost <= 3);
                        if (pool.length > 0 && p.field.length < (typeof getMaxFieldSlots === 'function' ? getMaxFieldSlots(pk) : 6)) {
                            const sel = pool[Math.floor(Math.random() * pool.length)];
                            const inst = JSON.parse(JSON.stringify(sel));
                            inst.id = 'card_' + Date.now() + Math.floor(Math.random()*1000); 
                            inst.status = []; inst.items = []; inst.attacksLeft = 1;
                            p.field.push(inst);
                            if (typeof log === 'function') log(`[Cusack] เรียก ${inst.name} ก่อนตาย!`, 'text-indigo-400');
                        }
                    }
                    if (eff === 'Ochre Demon') {
                        const candidates = p.deck.filter(x => (x.cost || 0) >= 5);
                        if (candidates.length > 0) {
                            const pick = candidates[Math.floor(Math.random() * candidates.length)];
                            const idx = p.deck.findIndex(x => x.id === pick.id);
                            p.hand.push(p.deck.splice(idx, 1)[0]);
                            if(typeof log === 'function') log(`🟡 [Ochre Demon] ตายแล้วดึงการ์ด Cost ≥5 ขึ้นมือ!`, 'text-yellow-500');
                        }
                    }
                    if (eff === 'Green Demon') {
                        const revives = c.greenDemonRevives || 0;
                        const chance = revives < 2 ? 1.0 : 0.1;
                        if (Math.random() < chance) {
                            c.greenDemonRevives = revives + 1;
                            c.hp = c.maxHp;
                            c.isDyingProcessing = false;
                            if(typeof log === 'function') log(`🟢 [Green Demon] สละวิญญาณฟื้นคืนชีพ! (ครั้งที่ ${c.greenDemonRevives})`, 'text-green-500 font-bold');
                            return;
                        }
                    }
                    if (eff === 'Copper Demon' && p.hp > 17) {
                        const enemies = state.players[oppKey].field.filter(x => typeof getCharStats==='function' && getCharStats(x).hp > 0);
                        if (enemies.length > 0) {
                            const t = enemies[Math.floor(Math.random() * enemies.length)];
                            t.hp = -99;
                            if(typeof log === 'function') log(`🟤 [Copper Demon] ตายอย่างสมเกียรติ! พลีชีพระเบิดใส่ ${t.name}!`, 'text-orange-500 font-bold');
                            checkDeath(oppKey);
                        }
                    }
                }
            });
            _origDeath.apply(this, arguments);
        };
    }

    // 6. End Phase Hook
    if (typeof window.resolveEndPhase === 'function') {
        const _origEnd = window.resolveEndPhase;
        window.resolveEndPhase = function(pk) {
            _origEnd.apply(this, arguments);
            const p = state.players[pk];
            const oppKey = pk === 'player' ? 'ai' : 'player';
            
            p.field.forEach(c => {
                if (c.hp <= 0 || c.silenced) return;
                const eff = c.originalName || c.name;

                if (eff === 'Gloxinia') {
                    executeGloxiniaForm(c, pk);
                }
                if (eff === 'Drole') {
                    c.atk += 1; c.hp += 2; c.maxHp += 2;
                }
                if (eff === 'Grayroad') {
                    const enemies = state.players[oppKey].field.filter(x => x.hp > 0);
                    if (enemies.length > 0) {
                        const t = enemies[Math.floor(Math.random() * enemies.length)];
                        t.atk = Math.max(0, t.atk - 2);
                        if (typeof log === 'function') log(`💀[Grayroad] สาปแช่งให้ ${t.name} ATK -2`, 'text-gray-400');
                    }
                }
                if (eff === 'Dahaaka') {
                    const weak = p.field.concat(state.players[oppKey].field).filter(x => x.id !== c.id && x.cost <= 4 && x.hp > 0);
                    if (weak.length > 0) {
                        const t = weak[Math.floor(Math.random() * weak.length)];
                        c.atk += t.atk; c.maxHp += t.maxHp; c.hp += t.hp;
                        t.hp = -99;
                        if (typeof log === 'function') log(`🦎 [Dahaaka] กลืนกิน ${t.name} และดูดซับพลัง!`, 'text-lime-400');
                        if (typeof checkDeath === 'function') { checkDeath('player'); checkDeath('ai'); }
                    }
                }
                if (eff === 'Pump') {
                    const r = Math.floor(Math.random() * 3);
                    if (r === 0) { c.maxHp += 2; c.hp += 2; } 
                    else if (r === 1) { c.atk += 2; } 
                    else {
                        if (p.field.length < (typeof getMaxFieldSlots === 'function' ? getMaxFieldSlots(pk) : 6)) {
                            const m = { id: 'card_'+Date.now(), name: 'Mini Pump', originalName: 'Mini Pump', type: 'Character', cost: 0, atk: 1, hp: 1, maxHp: 1, text: 'Taunt', color: 'bg-yellow-800', maxAttacks: 1, status: [], items: [], attacksLeft: 0 };
                            p.field.push(m);
                        }
                    }
                }
                
                if (c._estarossaLove > 0) c._estarossaLove--;
            });
        };
    }
}

// --- Helper Functions (Gloxinia) ---
function executeGloxiniaForm(glox, pk) {
    const p = state.players[pk];
    const rand = Math.floor(Math.random() * 6);
    const mkSp = (n) => { const db = HW_TOKENS[n]; return { id: 'card_'+Date.now(), name: db.name, originalName: db.name, type: db.type, cost: db.cost, text: db.text, color: db.color, _theme: HW_THEME, requiresTarget: db.requiresTarget }; };
    
    if (rand === 0) { glox.items.push(mkSp('Basquias')); if (typeof log === 'function') log(`🧚 [Gloxinia] Form 1: Basquias!`, 'text-green-300'); }
    else if (rand === 1) { p.hand.push(mkSp('Form Two: Guardian')); if (typeof log === 'function') log(`🧚 [Gloxinia] Form 2: Guardian!`, 'text-green-300'); }
    else if (rand === 2) { glox.items.push(mkSp('Yggdra Armor')); if (typeof log === 'function') log(`🧚[Gloxinia] Form 5: Yggdra Armor!`, 'text-green-300'); }
    else if (rand === 3) { p.hand.push(mkSp('Form Seven: Moon Rose')); if (typeof log === 'function') log(`🧚 [Gloxinia] Form 7: Moon Rose!`, 'text-green-300'); }
    else if (rand === 4) { p.hand.push(mkSp('Form Nine: Death Thorn')); if (typeof log === 'function') log(`🧚 [Gloxinia] Form 9: Death Thorn!`, 'text-green-300'); }
    else if (rand === 5) { glox.items.push(mkSp('Form Ten: Emerald Octo')); if (typeof log === 'function') log(`🧚 [Gloxinia] Form 10: Emerald Octo!`, 'text-green-300'); }
}
