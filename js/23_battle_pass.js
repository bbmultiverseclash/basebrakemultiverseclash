// ============================================================
// 23_battle_pass.js — Jujutsu Kaisen Season 1 (Extended Lv.40)
// ============================================================

const BP_CONFIG = {
    seasonName: "Jujutsu Kaisen: Cursed Clash",
    maxLevel: 100, // ขยายเป็น 100 เลเวล
    pointsPerGame: 500,
    premiumPrice: 199,
    premiumFirstTimePrice: 99,
    firstTimeKey: 'bp_s1_first_buy'
};

// ─── การตั้งค่ารางวัล 1-40 ───
const BP_REWARDS = {
    free: {
        1: { type: 'card', name: 'Yuji Itadori', theme: 'jjk' },
        3: { type: 'coins', amount: 150 },
        5: { type: 'avatar', id: 'av_yuji', label: 'Yuji Itadori', art: 'https://file.garden/aeeLCXSsJxTPrRbp/7a3ffe40ffa26b52a3652d939fd8273f.jpg' },
        7: { type: 'card', name: 'Six Eye', theme: 'jjk' },
        9: { type: 'coins', amount: 300 },
        10: { type: 'gems', amount: 5 },
        13: { type: 'xp', amount: 1500 },
        15: { type: 'banner', id: 'bn_today', label: 'Strongest Today', art: 'https://i.ibb.co/GQRYm9vw/image.png' },
        16: { type: 'coins', amount: 500 },
        18: { type: 'card', name: 'Six Eye', theme: 'jjk' },
        20: { type: 'card', name: 'Nobara Kugisaki', theme: 'jjk' },

        // --- ส่วนขยาย 21-40 ---
        22: { type: 'coins', amount: 750 },
        24: { type: 'gems', amount: 5 },
        25: { type: 'card', name: 'Playful Cloud', theme: 'jjk' },
        27: { type: 'card', name: 'Six Eye', theme: 'jjk' },
        29: { type: 'coins', amount: 1000 },
        30: { type: 'avatar', id: 'av_hiromi', label: 'Hiromi Higuruma', art: 'https://file.garden/aewtACVxx2XDWiFH/95496.jpg' },
        31: { type: 'card', name: 'Hiromi Higuruma', theme: 'jjk' },
        33: { type: 'coins', amount: 1500 },
        34: { type: 'xp', amount: 3000 },
        35: { type: 'card', name: 'Megumi Fushiguro', theme: 'jjk' },
        38: { type: 'coins', amount: 2000 },
        40: { type: 'banner', id: 'bn_ms_potential', label: 'MS Potential', art: 'https://file.garden/aeeLCXSsJxTPrRbp/1777097003700.jpg' },
        // --- ส่วนขยาย 41-50 ---
        42: { type: 'coins', amount: 3000 },
        45: { type: 'card', name: 'Black Flash', theme: 'jjk' },
        47: { type: 'card', name: 'Stitch & Repair', theme: 'jjk' },
        48: { type: 'artstyle', id: 'megumi_jp', label: 'Megumi - JP Art', targetCard: 'Megumi Fushiguro', art: 'https://file.garden/aeeLCXSsJxTPrRbp/enhanced_image_soft.png' },
        49: { type: 'gems', amount: 10 },
        50: { type: 'multi', items: [
            { type: 'card', name: 'Gojo Satoru', theme: 'jjk' },
            { type: 'title', title: 'The Honored One', label: 'Title: The Honored One' }
        ]}
    },
    premium: {
        1: { type: 'multi', items: [
            { type: 'avatar', id: 'av_yuta', label: 'Yuta Okkotsu', art: 'https://file.garden/aeeLCXSsJxTPrRbp/d7ae8acce56e71262672568eff870699.jpg' },
            { type: 'card', name: 'Yuta Okkotsu', theme: 'jjk' }
        ]},
        2: { type: 'coins', amount: 150 },
        3: { type: 'coins', amount: 150 },
        4: { type: 'gems', amount: 5 },
        5: { type: 'card', name: 'Six Eye', theme: 'jjk' },
        6: { type: 'coins', amount: 300 },
        7: { type: 'coins', amount: 300 },
        8: { type: 'gems', amount: 5 },
        9: { type: 'coins', amount: 300 },
        10: { type: 'card', name: 'Six Eye', theme: 'jjk' },
        11: { type: 'coins', amount: 300 },
        12: { type: 'gems', amount: 5 },
        13: { type: 'xp', amount: 2500 },
        14: { type: 'gems', amount: 5 },
        15: { type: 'banner', id: 'bn_history', label: 'Strongest History', art: 'https://i.ibb.co/4nW1WZNS/image.png' },
        16: { type: 'coins', amount: 500 },
        17: { type: 'coins', amount: 500 },
        18: { type: 'card', name: 'Sukuna Finger', theme: 'jjk', count: 2 },
        19: { type: 'coins', amount: 500 },
        20: { type: 'card', name: 'Toji Fushiguro', theme: 'jjk' },
        21: { type: 'coins', amount: 750 },
        22: { type: 'coins', amount: 750 },
        23: { type: 'card', name: 'Sukuna Finger', theme: 'jjk', count: 3 },
        24: { type: 'gems', amount: 5 },
        25: { type: 'card', name: 'Dragon Bone', theme: 'jjk' },
        26: { type: 'gems', amount: 5 },
        27: { type: 'card', name: 'Sukuna Finger', theme: 'jjk', count: 2 },
        28: { type: 'gems', amount: 5 },
        29: { type: 'coins', amount: 1000 },
        30: { type: 'multi', items: [
            { type: 'avatar', id: 'av_kenjaku', label: 'Kenjaku', art: 'https://file.garden/aeeLCXSsJxTPrRbp/b6595a016c7a33c05ef0b24922a492e7.jpg' },
            { type: 'card', name: 'Split Soul Katana', theme: 'jjk' }
        ]},
        31: { type: 'card', name: 'Sukuna Finger', theme: 'jjk', count: 3 },
        32: { type: 'gems', amount: 5 },
        33: { type: 'coins', amount: 1500 },
        34: { type: 'xp', amount: 6000 },
        35: { type: 'card', name: 'Kenjaku', theme: 'jjk' },
        36: { type: 'coins', amount: 1500 },
        37: { type: 'card', name: 'Mahoraga', theme: 'jjk' },
        38: { type: 'coins', amount: 2000 },
        39: { type: 'coins', amount: 2000 },
        40: { type: 'multi', items: [
            { type: 'banner', id: 'bn_sukuna_gojo', label: 'Sukuna vs Gojo', art: 'https://file.garden/aeeLCXSsJxTPrRbp/1777102946721.jpg' },
            { type: 'card', name: 'Prison Realm', theme: 'jjk' }
        ]},
        // --- ส่วนขยาย 41-50 ---
        41: { type: 'gems', amount: 10 },
        42: { type: 'artstyle', id: 'toji_wrath', label: 'Toji - Cursed Wrath', targetCard: 'Toji Fushiguro', art: 'https://file.garden/aeeLCXSsJxTPrRbp/1777121615565.jpg' },
        43: { type: 'coins', amount: 5000 },
        44: { type: 'card', name: 'Sukuna Finger', theme: 'jjk', count: 1 },
        45: { type: 'artstyle', id: 'mahoraga_mafia', label: 'Mahoraga - Mafia', targetCard: 'Mahoraga', art: 'https://file.garden/aeeLCXSsJxTPrRbp/396d790266037a28bae263dea7dbe086.jpg' },
        46: { type: 'card', name: 'Sukuna Finger', theme: 'jjk', count: 2 },
        47: { type: 'frame', id: 'fr_sukuna', label: 'Sukuna Border', color: '#ef4444', art: 'https://file.garden/aeeLCXSsJxTPrRbp/1000038109-removebg-preview.png' },
        48: { type: 'card', name: 'Sukuna Finger', theme: 'jjk', count: 3 },
        49: { type: 'multi', items: [
            { type: 'gems', amount: 15 },
            { type: 'card', name: 'Domain Expansion', theme: 'jjk' }
        ]},
        50: { type: 'multi', items: [
            { type: 'card', name: 'Ryomen Sukuna', theme: 'jjk' },
            { type: 'title', title: 'Malevolent Cursed King', label: 'Title: Malevolent King' },
            { type: 'gems', amount: 25 }
        ]}
    }
};

// ─── กล่อง Gacha (Level 51-100) ───
// Free: สลับ (51, 53, 55...) | Premium: ทุกเลเวล
for (let i = 51; i <= 100; i++) {
    if (i % 2 !== 0) BP_REWARDS.free[i] = { type: 'gacha_box', label: 'JJK Cursed Box' };
    BP_REWARDS.premium[i] = { type: 'gacha_box', label: 'JJK Cursed Box' };
}

// ─── ข้อมูลการ์ด JJK ───
const JJK_CARDS_DATA = {
    'Yuji Itadori': {
        name: 'Yuji Itadori', type: 'Character', cost: 6, atk: 5, hp: 5, maxHp: 5,
        text: 'Ongoing: มีโอกาส 50% Crit (x2 DMG) | หาก HP < 3 จะ Crit 100%',
        color: 'bg-red-700', art: 'https://i.ibb.co/0RnBcsm7/image.png'
    },
    'Nobara Kugisaki': {
        name: 'Nobara Kugisaki', type: 'Character', cost: 5, atk: 3, hp: 4, maxHp: 4,
        text: 'Summon: รับ Strawdoll Nail | Attack: รับ Hair Pin | End Turn: รับทั้งคู่ขึ้นมือ',
        color: 'bg-indigo-900', art: 'https://i.ibb.co/ptj5z7N/image.png'
    },
    'Yuta Okkotsu': {
        name: 'Yuta Okkotsu', type: 'Character', cost: 8, atk: 3, hp: 7, maxHp: 7,
        text: 'Summon: เรียก Rika | Bond: มี Rika บนสนาม +5 HP/+5 ATK | Guardian: Rika รับดาเมจแทน Yuta | Rika ตาย: Yuta +3/+3 ถาวร',
        color: 'bg-slate-800', art: 'https://i.ibb.co/xtY37YZf/image.png'
    },
    'Rika': {
        name: 'Rika', type: 'Character', cost: 0, atk: 1, hp: 8, maxHp: 8,
        text: 'Token: โล่ของยูตะ รับความเสียหายแทนยูตะเสมอ',
        color: 'bg-purple-950', art: 'https://i.ibb.co/xtY37YZf/image.png'
    },
    'Toji Fushiguro': {
        name: 'Toji Fushiguro', type: 'Character', cost: 7, atk: 5, hp: 6, maxHp: 6,
        text: 'Ongoing: หากศัตรูมี 3 ตัวขึ้นไป ATK 5->10 | On Attack: เป็น True Damage | หากเป้าหมาย HP > 7 มีโอกาส Crit 50%',
        color: 'bg-zinc-900', art: 'https://i.ibb.co/FbM02CSL/image.png'
    },
    'Six Eye': { name: 'Six Eye', type: 'Item', cost: 2, text: 'ไอเทมประดับ (ไม่มีความสามารถ)', color: 'bg-sky-400', requiresTarget: true },
    'Sukuna Finger': { name: 'Sukuna Finger', type: 'Item', cost: 3, text: 'นิ้วต้องสาปของสุคุนะ', color: 'bg-red-950', requiresTarget: true },
    'Strawdoll Nail': { name: 'Strawdoll Nail', type: 'Spell', cost: 1, text: '1 DMG และ Mark ศัตรูสุ่ม 1 ตัว', color: 'bg-blue-600', isNobaraSpell: true },
    'Hair Pin': { name: 'Hair Pin', type: 'Spell', cost: 2, text: '3 DMG ใส่ตัวที่มี Mark | 1 DMG กระจายตัวอื่น', color: 'bg-indigo-700', isNobaraSpell: true },

    // --- การ์ดใหม่ระดับ 21-40 ---
    'Dragon Bone': {
        name: 'Dragon Bone', type: 'Item', cost: 4,
        text: '+1 ATK | เมื่อผู้ใส่โดนดาเมจและไม่ตาย เอาดาเมจมาบวก ATK ถาวร (ถ้าเป็น Toji/Maki บวก x2)',
        color: 'bg-stone-800', requiresTarget: true,
        art: 'https://file.garden/aeeLCXSsJxTPrRbp/file_00000000579871fa845ee3ec1a20c3fc.png'
    },
    'Split Soul Katana': {
        name: 'Split Soul Katana', type: 'Item', cost: 7,
        text: '+4 ATK | 30% โอกาสทำ DMG x2 (หากใส่ให้ Toji/Maki: +4 ATK, +2 HP, โอกาส 60%)',
        color: 'bg-zinc-800', requiresTarget: true,
        art: 'https://file.garden/aeeLCXSsJxTPrRbp/file_00000000d07c71fabf55fd8194f446b5.png'
    },
    'Megumi Fushiguro': {
        name: 'Megumi Fushiguro', type: 'Character', cost: 9, atk: 3, hp: 4, maxHp: 4,
        text: 'Summon: เรียก Divine Dogs(4/2), Max Elephant(1/8 Taunt), Nue(3/4 30% Evade)',
        color: 'bg-stone-900', maxAttacks: 1,
        art: 'https://i1.sndcdn.com/artworks-O3vOA1yzjTR4uyon-Gu39sg-t500x500.jpg'
    },
    'Mahoraga': {
        name: 'Mahoraga', type: 'Character', cost: 8, atk: 8, hp: 8, maxHp: 8,
        text: 'Summon: การ์ดในมือศัตรู Cost +1 | Ongoing: Immune ทุกสถานะผิดปกติ | ตาย: 50% คืนชีพเต็มและร่าย Summon อีกครั้ง',
        color: 'bg-zinc-300 text-black', maxAttacks: 1,
        art: 'https://s.yimg.com/ny/api/res/1.2/9j3vYgeoP_7PjQM1YFFwpQ--/YXBwaWQ9aGlnaGxhbmRlcjt3PTEyNDI7aD03MDI7Y2Y9d2VicA--/https://media.zenfs.com/en/comingsoon_net_477/fdac9db9b7a9b0e05d73871d17faf2e8'
    },
    'Prison Realm': {
        name: 'Prison Realm', type: 'Action', cost: 8,
        text: 'สุ่มศัตรู 2 ตัว ติด Levitate (ลอยตัว) 3 เทิร์น ไม่สามารถโจมตีได้',
        color: 'bg-gray-900', requiresTarget: false,
        art: 'https://file.garden/aeeLCXSsJxTPrRbp/51f4dbefdf94c63a7a1678f630268513.jpg'
    },
    'Playful Cloud': {
        name: 'Playful Cloud', type: 'Item', cost: 5,
        text: 'ใส่ได้เฉพาะ Toji, Maki หรือตัวละครที่ไร้ความสามารถ | Effect: ATK + ตาม HP ปัจจุบันของผู้ใส่',
        color: 'bg-red-800', requiresTarget: true,
        art: 'https://file.garden/aeeLCXSsJxTPrRbp/file_000000009e2871fa981160f7cc56d05c.png'
    },
    'Hiromi Higuruma': {
        name: 'Hiromi Higuruma', type: 'Character', cost: 9, atk: 2, hp: 8, maxHp: 8,
        text: 'Summon: เทียบพลังรวม (ATK+HP) กับศัตรู 1 ตัว ถ้าเราน้อยกว่าศัตรูโดนเด้งไป Space Zone แต่ถ้าเรามากกว่า การ์ดใบนี้ตายเอง | Ongoing: ทุกตัวในสนาม ATK=2 เสมอ',
        color: 'bg-yellow-900', maxAttacks: 1,
        art: 'https://file.garden/aeeLCXSsJxTPrRbp/369316c1d7b1e0c1388ecc1155d67742.jpg'
    },
    'Kenjaku': {
        name: 'Kenjaku', type: 'Character', cost: 10, atk: 4, hp: 6, maxHp: 6,
        text: 'Summon: สุ่มสร้าง Spirit Token ก๊อปปี้ Stats จากพันธมิตร 1 ตัว และศัตรู 1 ตัว | ตาย: ยึดร่างพันธมิตร 1 ตัว เปลี่ยนชื่อเป็น Kenjaku +4 ATK/+6 HP',
        color: 'bg-slate-900', maxAttacks: 1,
        art: 'https://file.garden/aeeLCXSsJxTPrRbp/fec357e396ee2ed1aec715050f18f858.jpg'
    },

    // --- การ์ดใหม่ระดับ 41-50 ---
    'Black Flash': {
        name: 'Black Flash', type: 'Spell', cost: 4,
        text: 'เลือกพันธมิตร 1 ตัว: +3 ATK | โอกาส 20% ดาเมจ x2 ถาวร | เทิร์นนี้ดาเมจ x2 100%',
        color: 'bg-red-800', requiresTarget: true,
        art: 'https://file.garden/aeeLCXSsJxTPrRbp/6014951b182e97ac2ee596bb58d384ae.jpg'
    },
    'Stitch & Repair': {
        name: 'Stitch & Repair', type: 'Spell', cost: 6,
        text: 'เลือกพันธมิตร 1 ตัว: ฮีลเท่ากับ Cost ของตัวนั้น และล้างสถานะผิดปกติทั้งหมด | หากตัวนี้ตาย จะ Heal Base +1 HP',
        color: 'bg-blue-800', requiresTarget: true,
        art: 'https://file.garden/aeeLCXSsJxTPrRbp/1cb06dd151428dcd873f832cd2975109%20(1).jpg'
    },
    'Domain Expansion': {
        name: 'Domain Expansion', type: 'Action', cost: 12,
        text: 'เลือกตัวเรา 1 ตัว และศัตรู 1 ตัว: ตัวอื่นเด้งกลับมือ(เรา Cost 0, ศัตรู Cost+1) | เป้าเรา +5/+5 ตีการันตีโดน | ฆ่าสำเร็จ: Base ศัตรู -3, ทิ้งมือ 3 ใบ, อมตะเทิร์นหน้า',
        color: 'bg-indigo-950', requiresTarget: true,
        art: 'https://file.garden/aeeLCXSsJxTPrRbp/file_00000000ab1871faae6dd625bf8c2452.png'
    },
    'Gojo Satoru': {
        name: 'Gojo Satoru', type: 'Character', cost: 10, atk: 2, hp: 6, maxHp: 6,
        text: 'Ongoing: ATK < 6 ทะลุมุเก็นไม่ได้ (DMG=0) | ตาย: 50% คืนชีพเต็ม | จบเทิร์น: เสก Ao→Aka→Murasaki ตามลำดับ',
        color: 'bg-sky-500', maxAttacks: 1,
        art: 'https://file.garden/aeeLCXSsJxTPrRbp/b16a0f9e4d6f54edadd63f512f6d61a8.jpg'
    },
    'Ao':       { name: 'Ao',       type: 'Spell',  cost: 4, text: '2 ดาเมจ ใส่ศัตรูสุ่ม 2 ตัว + Freeze 1 เทิร์น',    color: 'bg-blue-500',   requiresTarget: false, art: 'https://file.garden/aeeLCXSsJxTPrRbp/fe145850f3c9eb1c18ec12625a5e9cc1.jpg', isGojoSpell: true },
    'Aka':      { name: 'Aka',      type: 'Spell',  cost: 5, text: '3 ดาเมจ ใส่ศัตรูสุ่ม 3 ตัว',                       color: 'bg-red-500',    requiresTarget: false, art: 'https://file.garden/aeeLCXSsJxTPrRbp/c98cb44105465aba8db76a0a3494d4d4.jpg', isGojoSpell: true },
    'Murasaki': { name: 'Murasaki', type: 'Spell',  cost: 8, text: 'ทำลาย Character ศัตรูสุ่ม 3 ตัวทันที',             color: 'bg-purple-600', requiresTarget: false, art: 'https://file.garden/aeeLCXSsJxTPrRbp/7655d448cac090d8e4fe4ca8e6969021.jpg', isGojoSpell: true },
    'Ryomen Sukuna': {
        name: 'Ryomen Sukuna', type: 'Character', cost: 10, atk: 4, hp: 8, maxHp: 8,
        text: 'On Attack: True Damage (ทะลุเกราะ) | จบเทิร์น: สุ่มดึง Cleave, Fuga หรือ Malevolent Shrine เข้ามือ',
        color: 'bg-red-950', maxAttacks: 1,
        art: 'https://file.garden/aeeLCXSsJxTPrRbp/7b133f18e561a77833b30fb48f9137be.jpg'
    },
    'Cleave':  { name: 'Cleave',  type: 'Spell',  cost: 2, text: 'ทำ 4 ดาเมจ ใส่ศัตรูสุ่ม 1 ตัว',                                         color: 'bg-red-700',    requiresTarget: false, isSukunaSpell: true },
    'Fuga':    { name: 'Fuga',    type: 'Action', cost: 8, text: 'ทำ 6 ดาเมจ ใส่ศัตรูทั้งหมด หากไม่ตายจะติด Burn 2 เทิร์น',            color: 'bg-orange-600', requiresTarget: false, isSukunaSpell: true },
    'Malevolent Shrine': {
        name: 'Malevolent Shrine', type: 'Field', cost: 9,
        text: 'Ultimate Field: ทำลายไม่ได้ (เว้นแต่ Ultimate Field) | จบเทิร์น: ศัตรูทั้งหมดโดน 2 ดาเมจ',
        color: 'bg-red-900', isUltimateField: true,
        art: 'https://file.garden/aeeLCXSsJxTPrRbp/6951dfc299ecc304db62cb44adb46545.jpg'
    },

    // --- การ์ดใน Gacha Box (Lv.51-100) ---
    'Mahito': { name: 'Mahito', type: 'Character', cost: 8, atk: 4, hp: 8, maxHp: 8, text: 'Attack: มอบ Soul Mark (จบเทิร์นโดน 1 True Dmg จนกว่า Mahito ตาย) | Death: สุ่มศัตรู 2 ตัว -2 ATK ถาวร', color: 'bg-sky-800', maxAttacks: 1, art: 'https://file.garden/aeeLCXSsJxTPrRbp/8bf6343470a915197d9f1a9cc6f24b47.jpg' },
    'Yuki Tsukumo': { name: 'Yuki Tsukumo', type: 'Character', cost: 7, atk: 4, hp: 7, maxHp: 7, text: 'Summon, Attack & End Turn: +1 Mass Charge | ครบ 3 Charge: ทำ 2 Dmg ทั่วกระดานศัตรู แล้วรีเซ็ต', color: 'bg-yellow-700', maxAttacks: 1, art: 'https://file.garden/aeeLCXSsJxTPrRbp/78c42d7949f783bd977df6ac008645f6.jpg' },
    'Naoya Zenin': { name: 'Naoya Zenin', type: 'Character', cost: 6, atk: 4, hp: 5, maxHp: 5, text: 'Ongoing: โจมตี 2 ครั้ง | On Attack: จั่ว 1 ใบ', color: 'bg-stone-300 text-black', maxAttacks: 2, art: 'https://file.garden/aeeLCXSsJxTPrRbp/7e9603aef7d9171ac7f8d86bbd3da74f.jpg' },
    'Maki Zenin': { name: 'Maki Zenin', type: 'Character', cost: 7, atk: 7, hp: 6, maxHp: 6, text: 'Ongoing: Immune ดาเมจ/เอฟเฟกต์ จาก Spell และ Action ที่ Cost ≤ 5', color: 'bg-emerald-900', maxAttacks: 1, art: 'https://file.garden/aeeLCXSsJxTPrRbp/30767d18cbcd5a4d1d4ed1a953acb544.jpg' },
    'Jogo': { name: 'Jogo', type: 'Character', cost: 8, atk: 3, hp: 7, maxHp: 7, text: 'ถูกโจมตี: ผู้ตีและศัตรูสุ่ม 1 ตัวติด Burn 2T | Attack: x2 DMG ใส่ตัวติด Burn | จบเทิร์น: ได้ Spell ภูเขาเหล็ก', color: 'bg-orange-800', maxAttacks: 1, art: 'https://file.garden/aeeLCXSsJxTPrRbp/jogo.jpg' },
    'Coffin of the Iron Mountain': { name: 'Coffin of the Iron Mountain', type: 'Spell', cost: 6, text: 'ศัตรูทั้งหมดติด Burn 4 เทิร์น', color: 'bg-orange-800', requiresTarget: false, isJogoSpell: true },
    'Kashimo': { name: 'Kashimo', type: 'Character', cost: 8, atk: 3, hp: 7, maxHp: 7, text: 'Ongoing: โจมตี 2 ครั้ง (ถ้า HP ≤ 3 จะตีได้ 4 ครั้ง) | Attack: Mark ศัตรู (ใครตีตัวมี Mark โดน +3 Dmg แล้วลบ Mark)', color: 'bg-cyan-600', maxAttacks: 2, art: 'https://file.garden/aeeLCXSsJxTPrRbp/49b72e4d59ff9db89d4c1ac884eafea8.jpg' },
    'Go Away': { name: 'Go Away', type: 'Spell', cost: 5, text: 'เด้งการ์ดศัตรู 1 ใบกลับขึ้นมือ', color: 'bg-slate-700', requiresTarget: true, targetEnemy: true, art: 'https://file.garden/aeeLCXSsJxTPrRbp/05942734a9a85467f135191e13ee75a2.jpg' },
    'Die!': { name: 'Die!', type: 'Spell', cost: 6, text: 'Base HP ตัวเองลดเหลือ 2 จากนั้นทำลายศัตรูสุ่ม 2 ตัว', color: 'bg-red-950', requiresTarget: false, art: 'https://file.garden/aeeLCXSsJxTPrRbp/bfee5070e3a0d530943bb14421e3e5cb.jpg' },
    'Idle Transfiguration': { name: 'Idle Transfiguration', type: 'Spell', cost: 6, text: 'เลือกศัตรู: -4 HP และ -4 ATK | หากมี Soul Mark จะถูก Paralyze 2 เทิร์น', color: 'bg-blue-800', requiresTarget: true, targetEnemy: true },
    'Cursed Energy Flow': { name: 'Cursed Energy Flow', type: 'Spell', cost: 0, text: 'เลือกพันธมิตร: +2 ATK ถาวร แต่ -1 HP ถาวร', color: 'bg-fuchsia-700', requiresTarget: true },
    'Last Stand': { name: 'Last Stand', type: 'Action', cost: 7, text: 'หาก Base HP ≤ 7: พันธมิตรทั้งหมด +3 ATK/+3 HP (เทิร์นนี้) | ถ้าเทิร์นนี้ฆ่าศัตรูได้: +1 Base HP (สูงสุด 5)', color: 'bg-yellow-800', requiresTarget: false, art: 'https://file.garden/aeeLCXSsJxTPrRbp/703da43981e4d15c16a18a11658c94f7.jpg' },
    'Boogie Woogie': { name: 'Boogie Woogie', type: 'Action', cost: 10, text: 'สลับค่า Cost และ ATK ของการ์ดสุ่ม 5 ใบในมือตัวเอง', color: 'bg-zinc-700', requiresTarget: false },
    'Slaughter Demon': { name: 'Slaughter Demon', type: 'Item', cost: 2, text: '+3 ATK | เมื่อโจมตีศัตรูที่ ATK มากกว่า จะทำดาเมจเพิ่ม +2', color: 'bg-red-800', requiresTarget: true, art: 'https://file.garden/aeeLCXSsJxTPrRbp/141d2e124d44a1960fc6b45fe351273b.jpg' },
    'Inverted Spear of Heaven': { name: 'Inverted Spear of Heaven', type: 'Item', cost: 7, text: 'ใส่ได้เฉพาะ Toji | หาก Toji โจมตีแล้วเป้าหมายไม่ตาย เปลี่ยนเป้าหมายเป็น "ผู้ไร้ความสามารถ" (ใบ้)', color: 'bg-stone-400 text-black', requiresTarget: true, art: 'https://file.garden/aeeLCXSsJxTPrRbp/file_000000000df871fa942ac60be4b5118e.png' },
    'Horizon of the Captivating Skandha': { name: 'Horizon of the Captivating Skandha', type: 'Field', cost: 8, text: 'Ultimate Field | เริ่มเทิร์น: สร้าง Fish Token (2/2) x2 | จบเทิร์น: การ์ดชื่อ Fish ทั้งหมด +1 ATK', color: 'bg-teal-900', isUltimateField: true },
    'Fish Token': { name: 'Fish Token', type: 'Character', cost: 0, atk: 2, hp: 2, maxHp: 2, text: 'ปลาชิกิงามิ', color: 'bg-teal-700', maxAttacks: 1 }
};

// ─── ข้อมูล Fern Value Pack ───
const FERN_EXPIRY   = new Date('2026-04-26T00:00:00+07:00').getTime();
const TRIGON_EXPIRY = new Date('2026-04-27T00:00:00+07:00').getTime();
const BP_SEASON_END = new Date('2026-05-09T00:00:00+07:00').getTime();

const FERN_CARDS_DATA = {
    'Fern the Sniper': {
        name: 'Fern the Sniper', type: 'Character', cost: 7, atk: 2, hp: 6, maxHp: 6,
        text: 'จบเทิร์น: ได้รับการ์ดเวท "Fern Zoltrak" 5 ใบขึ้นมือ',
        color: 'bg-purple-800', maxAttacks: 1, rarity: 'Epic',
        art: 'https://file.garden/aeeLCXSsJxTPrRbp/7c6b158231b05d29e23842940482fe9f.jpg'
    },
    'Fern Zoltrak': {
        name: 'Fern Zoltrak', type: 'Spell', cost: 1,
        text: 'ยิงสุ่ม 2 ดาเมจ (ถ้ามี Frieren บนสนาม ดาเมจจะเป็น 5)',
        color: 'bg-violet-600', requiresTarget: false, isFernSpell: true,
        art: 'https://i.pinimg.com/736x/94/1d/ba/941dbaae1b31fc8f0f9970cb184606d3.jpg'
    }
};

const TRIGON_CARDS_DATA = {
    'Trigon': {
        name: 'Trigon', type: 'Character', cost: 8, atk: 5, hp: 7, maxHp: 7,
        text: 'Summon: ได้ Spell "Soul Absorption" x2 | Death: สุ่มศัตรู 1 ตัวลด ATK ลงเท่ากับ Cost ของมัน',
        color: 'bg-red-900', maxAttacks: 1, rarity: 'Epic',
        art: 'https://file.garden/aeeLCXSsJxTPrRbp/1777182789976.jpg'
    },
    'Soul Absorption': {
        name: 'Soul Absorption', type: 'Spell', cost: 3,
        text: 'สุ่มขโมยครึ่ง ATK ของศัตรู 1 ตัว มาบวกให้ Trigon',
        color: 'bg-red-950', requiresTarget: false, isTrigonSpell: true
    }
};

// ─── FIX: ซ่อมแซม Artstyle สำหรับคนที่กด Claim ไปแล้วแต่ไม่ขึ้น ────────────
function fixClaimedArtstyles() {
    if (typeof playerData === 'undefined' || typeof BP_REWARDS === 'undefined') return;
    if (!playerData.unlockedArtstyles) playerData.unlockedArtstyles = [];
    const allClaimed = [
        ...(playerData.bpClaimedFree || []).map(lv => BP_REWARDS.free?.[lv]),
        ...(playerData.bpClaimedPremium || []).map(lv => BP_REWARDS.premium?.[lv]),
    ];
    let changed = false;
    allClaimed.forEach(reward => {
        if (!reward) return;
        const checkReward = (r) => {
            if (r && r.type === 'artstyle' && !playerData.unlockedArtstyles.includes(r.id)) {
                playerData.unlockedArtstyles.push(r.id);
                changed = true;
            }
        };
        if (reward.type === 'multi') reward.items?.forEach(checkReward);
        else checkReward(reward);
    });
    if (changed && typeof saveData === 'function') saveData();
}

document.addEventListener('DOMContentLoaded', () => {

    if (typeof CardSets !== 'undefined') {
        CardSets['jjk'] = JJK_CARDS_DATA;
        if (!CardSets['frieren_mage']) CardSets['frieren_mage'] = {};
        CardSets['frieren_mage']['Fern the Sniper'] = JSON.parse(JSON.stringify(FERN_CARDS_DATA['Fern the Sniper']));
        CardSets['frieren_mage']['Trigon'] = JSON.parse(JSON.stringify(TRIGON_CARDS_DATA['Trigon']));
    }

    // 1b. Inject Artstyles (สำหรับของรางวัล Lv.41-50)
    if (typeof window.ARTSTYLE_CFG === 'undefined') window.ARTSTYLE_CFG = {};
    window.ARTSTYLE_CFG['megumi_jp']      = { id:'megumi_jp',      label:'Megumi - JP Art',      emoji:'🖌️', targetCard:'Megumi Fushiguro', art:'https://file.garden/aeeLCXSsJxTPrRbp/enhanced_image_soft.png',                  shopCost:0 };
    window.ARTSTYLE_CFG['toji_wrath']     = { id:'toji_wrath',     label:'Toji - Cursed Wrath',  emoji:'🗡️', targetCard:'Toji Fushiguro',   art:'https://file.garden/aeeLCXSsJxTPrRbp/1777121615565.jpg',                       shopCost:0 };
    window.ARTSTYLE_CFG['mahoraga_mafia'] = { id:'mahoraga_mafia', label:'Mahoraga - Mafia',     emoji:'🛞', targetCard:'Mahoraga',         art:'https://file.garden/aeeLCXSsJxTPrRbp/396d790266037a28bae263dea7dbe086.jpg',   shopCost:0 };

    // 1c. Inject Sukuna Frame into COSMETICS_CATALOG
    if (typeof COSMETICS_CATALOG !== 'undefined') {
        if (!COSMETICS_CATALOG.frames.find(f => f.id === 'fr_sukuna')) {
            COSMETICS_CATALOG.frames.push({ id: 'fr_sukuna', label: 'Sukuna Border', color: '#ef4444', effect: 'shadow', art: 'https://file.garden/aeeLCXSsJxTPrRbp/1000038109-removebg-preview.png', locked: true });
        }
    }

    // 2. เตรียมข้อมูลผู้เล่น
    if (typeof playerData !== 'undefined') {
        if (playerData.bpPoints === undefined) playerData.bpPoints = 0;
        if (playerData.bpLevel === undefined) playerData.bpLevel = 0;
        if (playerData.hasPremiumBP === undefined) playerData.hasPremiumBP = false;
        if (!playerData.bpClaimedFree) playerData.bpClaimedFree = [];
        if (!playerData.bpClaimedPremium) playerData.bpClaimedPremium = [];
        if (playerData.fernPackBought === undefined) playerData.fernPackBought = false;
        if (playerData.trigonPackBought === undefined) playerData.trigonPackBought = false;

        // [FIX] ซ่อมแซมให้คนที่เคยกด Claim Artstyle ไปแล้วแต่ไม่ขึ้น
        fixClaimedArtstyles();
    }

    // 3. Inject Redeem Code
    if (typeof REDEEM_CODES !== 'undefined') {
        REDEEM_CODES['VALORPASS'] = { gems: 70, label: 'Valor Pass 💎', oneTime: true };
    }

    // 4. ปุ่มเมนู Battle Pass
    const navBar = document.querySelector('.hub-nav-bar');
    if (navBar && !document.getElementById('hub-tab-bp')) {
        const btn = document.createElement('button');
        btn.id = 'hub-tab-bp';
        btn.className = 'hub-nav-btn';
        btn.innerHTML = '🔥 Pass';
        btn.onclick = () => showHubTab('bp');
        navBar.appendChild(btn);
    }

    // 4. หน้าจอ Battle Pass Panel
    const container = document.getElementById('hub-panel-home')?.parentElement;
    if (container && !document.getElementById('hub-panel-bp')) {
        const pnl = document.createElement('div');
        pnl.id = 'hub-panel-bp';
        pnl.style.display = 'none';
        container.appendChild(pnl);
    }

    // 5. เชื่อมต่อระบบ Tab
    const _origTab = window.showHubTab;
    window.showHubTab = function(tab) {
        const bpBtn = document.getElementById('hub-tab-bp');
        const bpPnl = document.getElementById('hub-panel-bp');
        if (tab === 'bp') {
            ['home', 'packs', 'collection', 'deckbuilder', 'play', 'profile', 'themes'].forEach(t => {
                const b = document.getElementById(`hub-tab-${t}`);
                const p = document.getElementById(`hub-panel-${t}`);
                if (b) b.classList.remove('active-tab');
                if (p) p.style.display = 'none';
            });
            if (bpBtn) bpBtn.classList.add('active-tab');
            if (bpPnl) bpPnl.style.display = 'block';
            renderBattlePass();
        } else {
            if (bpBtn) bpBtn.classList.remove('active-tab');
            if (bpPnl) bpPnl.style.display = 'none';
            if (_origTab) _origTab(tab);
        }
    };

    _patchCombatForJJK();
    _patchPointRewards();
});

// ─── ระบบคำนวณแต้มและเลเวล ───
function getPointsRequired(level) {
    return 100 * level; // เวล 1 ใช้ 100, เวล 2 ใช้ 200...
}

window.addBattlePoints = function(amount) {
    if (typeof playerData === 'undefined') return;
    if (playerData.bpPoints === undefined) playerData.bpPoints = 0;
    if (playerData.bpLevel === undefined) playerData.bpLevel = 0;
    playerData.bpPoints += amount;
    console.log(`BP Added: ${amount}. Current Total: ${playerData.bpPoints}`);
    
    while (playerData.bpLevel < BP_CONFIG.maxLevel) {
        let req = getPointsRequired(playerData.bpLevel + 1);
        if (playerData.bpPoints >= req) {
            playerData.bpPoints -= req;
            playerData.bpLevel++;
            if (typeof showToast === 'function') showToast(`⭐ Battle Pass LV UP: ${playerData.bpLevel}`, '#fbbf24');
        } else {
            break;
        }
    }
    if (typeof saveData === 'function') saveData();
    if (typeof updateHubUI === 'function') updateHubUI();
};

function buyPremiumBP() {
    const isFirst = !playerData[BP_CONFIG.firstTimeKey];
    const cost = isFirst ? BP_CONFIG.premiumFirstTimePrice : BP_CONFIG.premiumPrice;

    if (playerData.gems < cost) {
        alert("Gems ไม่พอ!"); return;
    }

    if (confirm(`ซื้อ Premium Pass ซีซั่นนี้ในราคา ${cost} Gems?`)) {
        playerData.gems -= cost;
        playerData.hasPremiumBP = true;
        playerData[BP_CONFIG.firstTimeKey] = true;
        if (typeof saveData === 'function') saveData();
        renderBattlePass();
        if (typeof showToast === 'function') showToast('👑 ปลดล็อก Premium Pass แล้ว!', '#4ade80');
    }
}

// ─── ให้ BP หลังชนะ/แพ้ ───
function _patchPointRewards() {
    if (typeof window.awardWin === 'function') {
        const _origAwardWin = window.awardWin;
        window.awardWin = function() {
            const result = _origAwardWin.apply(this, arguments);
            window.addBattlePoints(BP_CONFIG.pointsPerGame);
            return result;
        };
    }
    if (typeof window.awardLoss === 'function') {
        const _origAwardLoss = window.awardLoss;
        window.awardLoss = function() {
            const result = _origAwardLoss.apply(this, arguments);
            window.addBattlePoints(BP_CONFIG.pointsPerGame);
            return result;
        };
    }
}

// ─── การแสดงผล UI ───
function renderBattlePass() {
    const pnl = document.getElementById('hub-panel-bp');
    if (!pnl) return;

    const lv = playerData.bpLevel;
    const pts = playerData.bpPoints;
    const req = getPointsRequired(lv + 1);
    const pct = Math.min(100, (pts / req) * 100);

    const isFernAvailable   = Date.now() < FERN_EXPIRY;
    const fernBought   = playerData.fernPackBought || false;
    const canBuyFern   = isFernAvailable && !fernBought && (playerData.gems >= 30);

    const isTrigonAvailable = Date.now() < TRIGON_EXPIRY;
    const trigonBought = playerData.trigonPackBought || false;
    const canBuyTrigon = isTrigonAvailable && !trigonBought && (playerData.gems >= 30);

    let rows = '';
    for (let i = 1; i <= BP_CONFIG.maxLevel; i++) {
        const isReached = lv >= i;
        const free = BP_REWARDS.free[i];
        const prem = BP_REWARDS.premium[i];

        rows += `
        <div style="display: flex; align-items: flex-start; gap: 10px; background: ${isReached ? 'rgba(251,191,36,0.1)' : '#111827'}; border: 1px solid ${isReached ? '#fbbf24' : '#374151'}; padding: 12px; border-radius: 12px; margin-bottom: 8px; min-height: 100px;">
            <div style="width: 30px; font-weight: 900; color: ${isReached ? '#fbbf24' : '#4b5563'}; text-align: center; padding-top: 4px;">${i}</div>
            <div style="flex: 1; font-size: 0.75rem;">${renderBPItem(free, 'free', i, isReached)}</div>
            <div style="width: 1px; align-self: stretch; background: #374151;"></div>
            <div style="flex: 1; font-size: 0.75rem; position: relative;">
                ${!playerData.hasPremiumBP ? '<div style="position:absolute;inset:0;background:rgba(0,0,0,0.6);display:flex;align-items:center;justify-content:center;z-index:2;border-radius:4px;font-size:1.2rem;">🔒</div>' : ''}
                ${renderBPItem(prem, 'premium', i, isReached)}
            </div>
        </div>`;
    }

    pnl.innerHTML = `
    <div style="max-width: 500px; margin: 0 auto; padding: 20px;">

        <!-- FERN VALUE BUNDLE -->
        <div style="background: linear-gradient(135deg, #2e1065, #172554); border: 3px solid ${isFernAvailable ? '#c084fc' : '#374151'}; border-radius: 24px; padding: 20px; margin-bottom: 20px; box-shadow: 0 10px 30px rgba(168,85,247,0.3); position: relative; overflow: hidden; display: flex; gap: 20px; align-items: center;">
            <div style="position: absolute; top: 15px; right: -30px; background: ${isFernAvailable ? '#ef4444' : '#374151'}; color: white; padding: 5px 40px; font-weight: 900; font-size: 0.7rem; transform: rotate(45deg);">
                ${isFernAvailable ? '1 DAY ONLY' : 'EXPIRED'}
            </div>
            <div style="width: 80px; height: 110px; border-radius: 10px; border: 2px solid #c084fc; overflow: hidden; flex-shrink: 0; box-shadow: 0 0 15px rgba(192,132,252,0.4);">
                <img src="${FERN_CARDS_DATA['Fern the Sniper'].art}" style="width: 100%; height: 100%; object-fit: cover;">
            </div>
            <div style="flex: 1;">
                <div style="color: #c084fc; font-weight: 900; font-size: 0.7rem; letter-spacing: 2px;">⚡ BP BOOSTER BUNDLE</div>
                <h3 style="margin: 4px 0; font-size: 1.2rem; font-weight: 900; color: white;">Fern the Sniper</h3>
                <div style="font-size: 0.75rem; color: #d8b4fe; margin-bottom: 10px; line-height: 1.4;">
                    การ์ด <strong style="color:#fbcfe8;">Fern</strong> (Epic) 1 ใบ + <strong style="color:#fbbf24;">+5,000 BP</strong> ทันที!
                </div>
                <div style="display: flex; align-items: center; gap: 12px;">
                    <div style="font-size: 1.1rem; font-weight: 900; color: ${isFernAvailable ? '#60a5fa' : '#6b7280'};">💎 30 Gems</div>
                    <button onclick="buyFernBPPack()" ${canBuyFern ? '' : 'disabled'} style="background: ${canBuyFern ? 'linear-gradient(135deg, #c084fc, #9333ea)' : '#374151'}; color: ${canBuyFern ? 'white' : '#9ca3af'}; border: none; padding: 8px 18px; border-radius: 10px; font-weight: 900; cursor: ${canBuyFern ? 'pointer' : 'not-allowed'}; font-size: 0.8rem;">
                        ${fernBought ? '✅ Purchased' : !isFernAvailable ? '🔒 Expired' : playerData.gems < 30 ? '💎 Not Enough' : 'BUY NOW'}
                    </button>
                </div>
            </div>
        </div>

        <!-- TRIGON VALUE BUNDLE -->
        <div style="background: linear-gradient(135deg, #450a0a, #2a0a0a); border: 3px solid ${isTrigonAvailable ? '#f87171' : '#374151'}; border-radius: 24px; padding: 20px; margin-bottom: 20px; box-shadow: 0 10px 30px rgba(248,113,113,0.3); position: relative; overflow: hidden; display: flex; gap: 20px; align-items: center;">
            <div style="position: absolute; top: 15px; right: -30px; background: ${isTrigonAvailable ? '#ef4444' : '#374151'}; color: white; padding: 5px 40px; font-weight: 900; font-size: 0.7rem; transform: rotate(45deg);">
                ${isTrigonAvailable ? '1 DAY ONLY' : 'EXPIRED'}
            </div>
            <div style="width: 80px; height: 110px; border-radius: 10px; border: 2px solid #f87171; overflow: hidden; flex-shrink: 0; box-shadow: 0 0 15px rgba(248,113,113,0.4);">
                <img src="${TRIGON_CARDS_DATA['Trigon'].art}" style="width: 100%; height: 100%; object-fit: cover;">
            </div>
            <div style="flex: 1;">
                <div style="color: #f87171; font-weight: 900; font-size: 0.7rem; letter-spacing: 2px;">🔥 BP BOOSTER BUNDLE</div>
                <h3 style="margin: 4px 0; font-size: 1.2rem; font-weight: 900; color: white;">Trigon</h3>
                <div style="font-size: 0.75rem; color: #fca5a5; margin-bottom: 10px; line-height: 1.4;">
                    การ์ด <strong style="color:#fca5a5;">Trigon</strong> (Epic) 1 ใบ + <strong style="color:#fbbf24;">+5,000 BP</strong> ทันที!
                </div>
                <div style="display: flex; align-items: center; gap: 12px;">
                    <div style="font-size: 1.1rem; font-weight: 900; color: ${isTrigonAvailable ? '#f87171' : '#6b7280'};">💎 30 Gems</div>
                    <button onclick="buyTrigonBPPack()" ${canBuyTrigon ? '' : 'disabled'} style="background: ${canBuyTrigon ? 'linear-gradient(135deg, #ef4444, #b91c1c)' : '#374151'}; color: ${canBuyTrigon ? 'white' : '#9ca3af'}; border: none; padding: 8px 18px; border-radius: 10px; font-weight: 900; cursor: ${canBuyTrigon ? 'pointer' : 'not-allowed'}; font-size: 0.8rem;">
                        ${trigonBought ? '✅ Purchased' : !isTrigonAvailable ? '🔒 Expired' : playerData.gems < 30 ? '💎 Not Enough' : 'BUY NOW'}
                    </button>
                </div>
            </div>
        </div>

        <div style="background: linear-gradient(135deg, #450a0a, #020617); padding: 20px; border-radius: 20px; border: 2px solid #fbbf24; margin-bottom: 20px; text-align: center;">
            <div style="font-weight: 900; color: #fbbf24; letter-spacing: 2px;">BATTLE PASS</div>
            <div style="font-size: 1.2rem; font-weight: 900; color: white; margin-bottom: 10px;">${BP_CONFIG.seasonName}</div>
            <div style="display: flex; justify-content: space-between; font-size: 0.7rem; color: #9ca3af; margin-bottom: 4px;">
                <span>LV. ${lv}</span>
                <span>${lv < BP_CONFIG.maxLevel ? pts + '/' + req + ' BP' : 'MAX LEVEL'}</span>
            </div>
            <div style="height: 8px; background: #000; border-radius: 4px; overflow: hidden; margin-bottom: 15px;">
                <div style="width: ${pct}%; height: 100%; background: #fbbf24; box-shadow: 0 0 10px #fbbf24;"></div>
            </div>
            ${!playerData.hasPremiumBP ? 
                `<button onclick="buyPremiumBP()" style="background: #fbbf24; color: black; border: none; padding: 10px 20px; border-radius: 10px; font-weight: 900; cursor: pointer;">👑 UPGRADE (${!playerData[BP_CONFIG.firstTimeKey] ? '99' : '199'} Gems)</button>` : 
                `<div style="color: #4ade80; font-weight: 900; font-size: 0.8rem;">✨ PREMIUM ACTIVE ✨</div>`
            }
        </div>
        <div style="display:flex; justify-content: space-between; padding: 0 10px 10px; font-size: 0.65rem; color: #6b7280; font-weight: bold;">
            <span>LVL</span><span>FREE REWARDS</span><span>PREMIUM REWARDS</span>
        </div>
        <div>${rows}</div>
    </div>`;
}

function renderBPItem(item, pool, level, isReached) {
    if (!item) return `<div style="display:flex;align-items:center;justify-content:center;height:80px;color:#374151;">—</div>`;
    const claimedArr = pool === 'free' ? playerData.bpClaimedFree : playerData.bpClaimedPremium;
    const isClaimed = claimedArr.includes(level);
    const canClaim = isReached && !isClaimed && (pool === 'free' || playerData.hasPremiumBP);

    const claimBtn = isClaimed
        ? `<div style="color:#4ade80;font-size:0.6rem;font-weight:900;margin-top:4px;">✅ Claimed</div>`
        : canClaim
            ? `<button onclick="claimBattlePassReward('${pool}', ${level})" style="background:#fbbf24;border:none;border-radius:4px;font-size:0.6rem;padding:2px 8px;font-weight:900;cursor:pointer;margin-top:4px;">CLAIM</button>`
            : `<div style="color:#4b5563;font-size:0.7rem;margin-top:4px;">🔒</div>`;

    // ─── render preview ของ reward แต่ละชนิด ───
    function renderPreview(r) {
        if (r.type === 'card') {
            const cardData = JJK_CARDS_DATA[r.name]
                || Object.values(typeof CardSets !== 'undefined' ? CardSets : {})
                         .flatMap(s => Object.values(s))
                         .find(c => c.name === r.name);
            const art = cardData?.art || '';
            const count = r.count > 1 ? `<div style="position:absolute;top:2px;right:2px;background:rgba(0,0,0,0.8);color:#fbbf24;font-size:0.55rem;font-weight:900;padding:1px 3px;border-radius:3px;">x${r.count}</div>` : '';
            return `
                <div style="text-align:center;">
                    <div style="width:52px;height:72px;border-radius:6px;overflow:hidden;border:1px solid #4b5563;margin:0 auto 3px;background:#1f2937;position:relative;">
                        ${art ? `<img src="${art}" style="width:100%;height:100%;object-fit:cover;">` : `<div style="width:100%;height:100%;display:flex;align-items:center;justify-content:center;font-size:1.5rem;">🃏</div>`}
                        ${count}
                    </div>
                    <div style="font-size:0.5rem;color:#d1d5db;font-weight:bold;line-height:1.2;max-width:58px;word-break:break-word;">${r.name}</div>
                </div>`;
        }
        if (r.type === 'banner') {
            return `
                <div style="text-align:center;">
                    <div style="width:66px;height:38px;border-radius:5px;overflow:hidden;border:1px solid #6366f1;margin:0 auto 3px;">
                        <img src="${r.art}" style="width:100%;height:100%;object-fit:cover;">
                    </div>
                    <div style="font-size:0.5rem;color:#d1d5db;font-weight:bold;max-width:70px;word-break:break-word;">🖼️ ${r.label}</div>
                </div>`;
        }
        if (r.type === 'avatar') {
            return `
                <div style="text-align:center;">
                    <div style="width:44px;height:44px;border-radius:50%;overflow:hidden;border:2px solid #fbbf24;margin:0 auto 3px;">
                        <img src="${r.art}" style="width:100%;height:100%;object-fit:cover;">
                    </div>
                    <div style="font-size:0.5rem;color:#d1d5db;font-weight:bold;max-width:58px;word-break:break-word;">👤 ${r.label}</div>
                </div>`;
        }
        if (r.type === 'coins') return `<div style="text-align:center;"><div style="font-size:1.8rem;line-height:1;">🪙</div><div style="font-size:0.55rem;color:white;font-weight:bold;margin-top:2px;">${r.amount}</div></div>`;
        if (r.type === 'gems')  return `<div style="text-align:center;"><div style="font-size:1.8rem;line-height:1;">💎</div><div style="font-size:0.55rem;color:white;font-weight:bold;margin-top:2px;">${r.amount}</div></div>`;
        if (r.type === 'xp')   return `<div style="text-align:center;"><div style="font-size:1.8rem;line-height:1;">⭐</div><div style="font-size:0.55rem;color:white;font-weight:bold;margin-top:2px;">${r.amount} XP</div></div>`;
        if (r.type === 'frame') return `
            <div style="text-align:center;">
                <div style="width:44px;height:44px;border-radius:50%;overflow:hidden;border:2px solid ${r.color || '#ef4444'};margin:0 auto 3px;background:#111827;position:relative;">
                    ${r.art ? `<img src="${r.art}" style="position:absolute;inset:-5px;width:calc(100% + 10px);height:calc(100% + 10px);">` : ''}
                </div>
                <div style="font-size:0.5rem;color:#d1d5db;font-weight:bold;max-width:58px;word-break:break-word;">✨ ${r.label}</div>
            </div>`;
        if (r.type === 'artstyle') return `
            <div style="text-align:center;">
                <div style="width:44px;height:44px;border-radius:8px;overflow:hidden;border:1px solid #a855f7;margin:0 auto 3px;">
                    <img src="${r.art}" style="width:100%;height:100%;object-fit:cover;">
                </div>
                <div style="font-size:0.5rem;color:#d1d5db;font-weight:bold;max-width:58px;word-break:break-word;">🎨 ${r.label}</div>
            </div>`;
        if (r.type === 'title') return `
            <div style="text-align:center;">
                <div style="background:rgba(251,191,36,0.2);border:1px solid #fbbf24;color:#fbbf24;padding:4px 8px;border-radius:6px;font-size:0.55rem;font-weight:900;margin-bottom:3px;">👑 ${r.title}</div>
                <div style="font-size:0.45rem;color:#9ca3af;font-weight:bold;">TITLE</div>
            </div>`;
        if (r.type === 'gacha_box') return `
            <div style="text-align:center;">
                <div style="width:52px;height:52px;border-radius:10px;background:linear-gradient(135deg,#450a0a,#1e1b4b);border:2px solid #fbbf24;display:flex;align-items:center;justify-content:center;font-size:1.8rem;margin:0 auto 3px;box-shadow:0 0 10px rgba(251,191,36,0.4);">📦</div>
                <div style="font-size:0.5rem;color:#fbbf24;font-weight:bold;">JJK Box</div>
            </div>`;
        return `<div style="font-size:0.6rem;color:#9ca3af;">${r.type}</div>`;
    }

    let preview = '';
    if (item.type === 'multi') {
        preview = `<div style="display:flex;gap:4px;flex-wrap:wrap;justify-content:center;">${item.items.map(renderPreview).join('')}</div>`;
    } else {
        preview = renderPreview(item);
    }

    return `
        <div style="text-align:center;opacity:${isReached ? '1' : '0.45'};">
            ${preview}
            ${claimBtn}
        </div>`;
}

// ─── Gacha Box Logic ───
function openJJKBox() {
    const roll = Math.random() * 100;
    if (roll < 70) return { type: 'coins', amount: 500, label: '500 Coins' };
    if (roll < 80) return { type: 'gems', amount: 10, label: '10 Gems' };
    if (roll < 85) {
        const arts = [
            { id: 'oppenheimer_domain', label: 'Oppenheimer Domain', targetCard: 'Oppenheimer', art: 'https://file.garden/aeeLCXSsJxTPrRbp/1777176887957.jpg' },
            { id: 'leonidas_army', label: 'Leonidas Army', targetCard: 'Leonidas I', art: 'https://file.garden/aeeLCXSsJxTPrRbp/file_00000000f894720b959286e79f4e90aa.png' },
            { id: 'chameleon_cursed', label: 'Cursed Spirit', targetCard: 'Chameleon', art: 'https://file.garden/aeeLCXSsJxTPrRbp/file_00000000d3ec7208963be103b3428d6e.png' },
            { id: 'subaru_madness', label: 'Cursed Madness', targetCard: 'Subaru', art: 'https://file.garden/aeeLCXSsJxTPrRbp/1777177068586.jpg' },
            { id: 'desert_eagle_cursed', label: 'Cursed Gun', targetCard: 'Desert Eagle', art: 'https://file.garden/aeeLCXSsJxTPrRbp/1777177110354.jpg' }
        ];
        const a = arts[Math.floor(Math.random() * arts.length)];
        return { type: 'artstyle', id: a.id, label: a.label, targetCard: a.targetCard, art: a.art };
    }
    if (roll < 91) {
        const chars = ['Mahito', 'Yuki Tsukumo', 'Naoya Zenin', 'Maki Zenin', 'Jogo', 'Kashimo'];
        const name = chars[Math.floor(Math.random() * chars.length)];
        return { type: 'card', name, theme: 'jjk', label: name };
    }
    if (roll < 95) {
        const spells = ['Go Away', 'Die!', 'Idle Transfiguration', 'Cursed Energy Flow'];
        const name = spells[Math.floor(Math.random() * spells.length)];
        return { type: 'card', name, theme: 'jjk', label: name };
    }
    if (roll < 97) {
        const acts = ['Last Stand', 'Boogie Woogie'];
        const name = acts[Math.floor(Math.random() * acts.length)];
        return { type: 'card', name, theme: 'jjk', label: name };
    }
    if (roll < 99) {
        const items = ['Slaughter Demon', 'Inverted Spear of Heaven'];
        const name = items[Math.floor(Math.random() * items.length)];
        return { type: 'card', name, theme: 'jjk', label: name };
    }
    return { type: 'card', name: 'Horizon of the Captivating Skandha', theme: 'jjk', label: 'Horizon of the Captivating Skandha' };
}

function claimBattlePassReward(pool, level) {
    const reward = BP_REWARDS[pool][level];
    if (!reward) return;

    const give = (r) => {
        if (r.type === 'card') {
            const k = `${r.name}|${r.theme}`;
            playerData.collection[k] = (playerData.collection[k] || 0) + (r.count || 1);
        } else if (r.type === 'coins') playerData.coins += r.amount;
        else if (r.type === 'gems') playerData.gems += r.amount;
        else if (r.type === 'xp' && typeof addXp === 'function') addXp(r.amount);
        else if (r.type === 'title') {
            if (!playerData.unlockedTitles) playerData.unlockedTitles = [];
            if (!playerData.unlockedTitles.includes(r.title)) playerData.unlockedTitles.push(r.title);
        } else if (r.type === 'artstyle') {
            if (!playerData.unlockedArtstyles) playerData.unlockedArtstyles = [];
            if (!playerData.unlockedArtstyles.includes(r.id)) playerData.unlockedArtstyles.push(r.id);
            // ลงทะเบียน Artstyle ใน ARTSTYLE_CFG ทันที เพื่อให้ระบบ equip รู้จัก
            if (typeof ARTSTYLE_CFG !== 'undefined' && !ARTSTYLE_CFG[r.id]) {
                ARTSTYLE_CFG[r.id] = { id: r.id, label: r.label, targetCard: r.targetCard, art: r.art, emoji: '✨', shopCost: 0 };
            }
        } else if (r.type === 'avatar' || r.type === 'banner' || r.type === 'frame') {
            if (!playerData.unlockedCosmetics) playerData.unlockedCosmetics = [];
            if (!playerData.unlockedCosmetics.includes(r.id)) playerData.unlockedCosmetics.push(r.id);
            const catKey = r.type === 'avatar' ? 'avatars' : r.type === 'banner' ? 'banners' : 'frames';
            if (typeof COSMETICS_CATALOG !== 'undefined') {
                const existing = COSMETICS_CATALOG[catKey]?.find(x => x.id === r.id);
                if (existing) existing.locked = false;
                else if (COSMETICS_CATALOG[catKey]) COSMETICS_CATALOG[catKey].push({ id: r.id, label: r.label, art: r.art, color: r.color, locked: false });
            }
        }
    };

    if (reward.type === 'multi') reward.items.forEach(give);
    else if (reward.type === 'gacha_box') {
        const roll = openJJKBox();
        give(roll);
        if (typeof showToast === 'function') showToast(`📦 JJK Box: ${roll.label || roll.name || roll.type}!`, '#fbbf24');
    }
    else give(reward);

    if (pool === 'free') playerData.bpClaimedFree.push(level);
    else playerData.bpClaimedPremium.push(level);

    if (typeof saveData === 'function') saveData();
    renderBattlePass();
    if (typeof updateHubUI === 'function') updateHubUI();
}

// ─── พลังพิเศษของการ์ด JJK ───
function _patchCombatForJJK() {
    // 0. Playful Cloud: ตรวจสอบเงื่อนไขก่อนใส่
    if (typeof resolveTargetedPlay === 'function') {
        const _origResolveTarget = window.resolveTargetedPlay;
        window.resolveTargetedPlay = function(playerKey, sourceCardId, targetCharId) {
            const p = state.players[playerKey];
            const card = p.hand.find(c => c.id === sourceCardId);
            const oppKey = playerKey === 'player' ? 'ai' : 'player';
            const targetChar = card?.targetEnemy
                ? state.players[oppKey].field.find(c => c.id === targetCharId)
                : p.field.find(c => c.id === targetCharId);

            if (card && card.name === 'Playful Cloud' && targetChar) {
                const effName = targetChar.originalName || targetChar.name;
                const hasNoAbility = (!targetChar.text || targetChar.text.trim() === '' || targetChar.silenced);
                if (effName !== 'Toji Fushiguro' && effName !== 'Maki Zenin' && !hasNoAbility) {
                    if (playerKey === 'player' && typeof alert === 'function')
                        alert('Playful Cloud ใส่ได้เฉพาะ Toji, Maki หรือตัวละครที่ไร้ความสามารถเท่านั้น!');
                    if (typeof cancelTargeting === 'function') cancelTargeting();
                    return;
                }
            }

            // Black Flash: +3 ATK + crit flag (100% this turn, 20% permanent)
            if (card && card.name === 'Black Flash' && targetChar) {
                targetChar.atk += 3;
                targetChar.blackFlashCritPerm = true;
                targetChar.blackFlashTurn = state.totalTurns;
                if (typeof log === 'function') log(`⚡ [Black Flash] ${targetChar.name} +3 ATK และเตรียมปล่อยประกายทมิฬ!`, 'text-red-400 font-bold');
                p.cost -= (typeof getActualCost === 'function' ? getActualCost(card, playerKey) : card.cost);
                p.hand.splice(p.hand.indexOf(card), 1);
                p.graveyard.push(card);
                if (typeof cancelTargeting === 'function') cancelTargeting();
                if (typeof updateUI === 'function') updateUI();
                return;
            }

            // Stitch & Repair: ฮีล + ล้างสถานะ
            if (card && card.name === 'Stitch & Repair' && targetChar) {
                targetChar.hp = Math.min((targetChar.maxHp || 99), targetChar.hp + (targetChar.cost || 0));
                targetChar.status = (targetChar.status || []).filter(s => !['Freeze','Bleed','Burn','Poison','Paralyze'].includes(s));
                targetChar.stitchDeathHeal = true;
                if (typeof log === 'function') log(`🧵 [Stitch & Repair] ฮีล ${targetChar.name} +${targetChar.cost || 0} HP และล้างสถานะผิดปกติ!`, 'text-blue-300 font-bold');
                p.cost -= (typeof getActualCost === 'function' ? getActualCost(card, playerKey) : card.cost);
                p.hand.splice(p.hand.indexOf(card), 1);
                p.graveyard.push(card);
                if (typeof cancelTargeting === 'function') cancelTargeting();
                if (typeof updateUI === 'function') updateUI();
                return;
            }

            // Domain Expansion: กางอาณาเขต
            if (card && card.name === 'Domain Expansion' && targetChar) {
                const opp = state.players[oppKey];
                const enemies = opp.field.filter(c => getCharStats(c).hp > 0);
                
                if (enemies.length === 0) {
                    if (typeof log === 'function') log(`🌌 [Domain Expansion] ล้มเหลว ไม่มีศัตรูให้ดึงเข้าอาณาเขต`, 'text-gray-500');
                    if (typeof cancelTargeting === 'function') cancelTargeting();
                    return;
                }

                // แสดง Modal เลือกศัตรู
                const isHumanTurn = (playerKey === 'player' && window.gameMode !== 'ai') || (window.gameMode === 'online' && playerKey === myRole);
                if (isHumanTurn) {
                    showDomainTargetModal(playerKey, card, targetChar, enemies, oppKey);
                } else {
                    // AI เล่น สุ่มเป้าหมาย
                    const chosenEnemy = enemies[Math.floor(Math.random() * enemies.length)];
                    executeDomainExpansion(playerKey, card, targetChar, chosenEnemy, oppKey);
                }

                if (typeof cancelTargeting === 'function') cancelTargeting();
                if (typeof updateUI === 'function') updateUI();
                return;
            }

            _origResolveTarget.apply(this, arguments);
        };
    }

    // 1. โลจิกโจมตี (Yuji, Toji, Yuta + Split Soul Katana, Dragon Bone, Nue Evade, Max Elephant Taunt)
    if (typeof initiateAttack === 'function') {
        const _orig = window.initiateAttack;
        window.initiateAttack = function(attackerId, targetId, targetIsBase) {
            if (typeof state === 'undefined' || targetIsBase) return _orig.apply(this, arguments);

            const atkKey = state.currentTurn;
            const defKey = atkKey === 'player' ? 'ai' : 'player';
            const attacker = state.players[atkKey].field.find(c => c.id === attackerId);
            let target = state.players[defKey].field.find(c => c.id === targetId);

            if (attacker) {
                const aN = attacker.originalName || attacker.name;

                // Split Soul Katana: 30% crit (60% for Toji/Maki)
                if (attacker.items && attacker.items.some(i => i.name === 'Split Soul Katana')) {
                    const isTojiMaki = ['Toji Fushiguro', 'Maki Zenin'].includes(aN);
                    if (Math.random() < (isTojiMaki ? 0.6 : 0.3)) {
                        attacker.atk *= 2; attacker._jjkCrit = true;
                        if (typeof log === 'function') log(`🗡️ [Split Soul] ฟันวิญญาณ! Critical x2 Damage!`, 'text-purple-400 font-bold');
                    }
                }

                // Black Flash crit: 100% เทิร์นนี้, 20% ถาวร
                if (attacker.blackFlashTurn === state.totalTurns || (attacker.blackFlashCritPerm && Math.random() < 0.2)) {
                    if (!attacker._jjkCrit) { attacker.atk *= 2; attacker._jjkCrit = true; }
                    if (typeof log === 'function') log(`⚡ [Black Flash] ประกายทมิฬทำงาน! ดาเมจ x2!`, 'text-red-500 font-bold');
                }

                // Yuji Crit
                if (aN === 'Yuji Itadori') {
                    const hp = getCharStats(attacker).hp;
                    if (Math.random() < 0.5 || hp < 3) {
                        attacker.atk *= 2;
                        attacker._jjkCrit = true;
                        if (typeof log === 'function') log(`👊 [Yuji] ประกายทมิฬ! Critical x2 Damage!`, 'text-red-500 font-bold');
                    }
                }

                // Toji Logic
                if (aN === 'Toji Fushiguro' && target) {
                    if (getCharStats(target).hp > 7 && Math.random() < 0.5 && !attacker._jjkCrit) {
                        attacker.atk *= 2;
                        attacker._jjkCrit = true;
                        if (typeof log === 'function') log(`🗡️ [Toji] สังหารสวรรค์! Critical x2 Damage!`, 'text-zinc-400 font-bold');
                    }
                }

                // Gojo Infinity: ถ้า ATK < 6 โจมตีไม่เข้า (ยกเว้น domainGuaranteedHit)
                if (target && (target.originalName || target.name) === 'Gojo Satoru' && !target.silenced && !attacker.domainGuaranteedHit) {
                    const atkPow = getCharStats(attacker).atk;
                    if (atkPow < 6) { // <--- เปลี่ยนจาก 8 เป็น 6
                        if (typeof log === 'function') log(`🌌 [Infinity] มุเก็นทำงาน! ATK ${atkPow} < 6 โจมตีโกโจไม่เข้า!`, 'text-sky-300 font-bold');
                        attacker.attacksLeft--;
                        if (attacker._jjkCrit) { attacker.atk /= 2; delete attacker._jjkCrit; }
                        if (typeof updateUI === 'function') updateUI();
                        return;
                    }
                }

                // Yuta's Rika Guardian
                if (target && (target.originalName || target.name) === 'Yuta Okkotsu') {
                    const rika = state.players[defKey].field.find(c => (c.originalName || c.name) === 'Rika' && c.hp > 0);
                    if (rika) {
                        if (typeof log === 'function') log(`🛡️ [Rika] กางอาณาเขตปกป้องยูตะ! รับความเสียหายแทน`, 'text-purple-400 font-bold');
                        arguments[1] = rika.id;
                        target = rika;
                    }
                }

                // Max Elephant Taunt (when Megumi is alive on defending side)
                const hasMegumi = state.players[defKey].field.some(c => (c.originalName || c.name) === 'Megumi Fushiguro' && getCharStats(c).hp > 0);
                const maxElephant = state.players[defKey].field.find(c => (c.originalName || c.name) === 'Max Elephant' && getCharStats(c).hp > 0);
                if (hasMegumi && maxElephant && target && target.id !== maxElephant.id) {
                    arguments[1] = maxElephant.id;
                    target = maxElephant;
                    if (typeof log === 'function') log(`🐘 [Max Elephant] Taunt! ปกป้อง Megumi!`, 'text-blue-400 font-bold');
                }

                // Nue Evade 30% (ยกเว้น domainGuaranteedHit)
                if (target && (target.originalName || target.name) === 'Nue' && !attacker.domainGuaranteedHit) {
                    if (Math.random() < 0.3) {
                        if (typeof log === 'function') log(`⚡ [Nue] บินหลบการโจมตีสำเร็จ! (30%)`, 'text-yellow-300');
                        attacker.attacksLeft--;
                        if (attacker._jjkCrit) { attacker.atk /= 2; delete attacker._jjkCrit; }
                        if (typeof updateUI === 'function') updateUI();
                        return;
                    }
                }
            }

            // Snapshot HP before attack (for Dragon Bone + Domain kill check)
            const prevTargetHp = target ? target.hp : 0;

            _orig.apply(this, arguments);

            // Domain Expansion Kill Check
            if (attacker && attacker.domainActiveTurn === state.totalTurns) {
                // เช็คว่าศัตรูตายจริงไหม (HP <= 0 หรือหายไปจากสนาม)
                const targetDied = !state.players[defKey].field.some(c => c.id === targetId) || (target && target.hp <= 0);
                if (targetDied) {
                    state.players[defKey].hp = Math.max(0, (state.players[defKey].hp || 20) - 3); // Base ศัตรู -3
                    const hand = state.players[defKey].hand;
                    for (let i = 0; i < 3 && hand.length > 0; i++) {
                        const idx = Math.floor(Math.random() * hand.length);
                        state.players[defKey].graveyard.push(hand.splice(idx, 1)[0]); // ทิ้งมือ 3 ใบ
                    }
                    attacker.immortalTurns = 2; // อมตะเทิร์นศัตรู
                    if (typeof log === 'function') log(`🌌 [Domain Expansion] ฆ่าสำเร็จ! Base ศัตรู -3, ทิ้งมือศัตรู 3 ใบ, อมตะเทิร์นหน้า!`, 'text-indigo-400 font-bold');
                    if (typeof checkWinCondition === 'function') checkWinCondition();
                }
            }

            // Dragon Bone: gain ATK equal to damage absorbed (x2 for Toji/Maki)
            if (target && target.hp > 0 && target.items && target.items.some(i => i.name === 'Dragon Bone')) {
                const dmgTaken = prevTargetHp - target.hp;
                if (dmgTaken > 0) {
                    const tN = target.originalName || target.name;
                    const bonus = ['Toji Fushiguro', 'Maki Zenin'].includes(tN) ? dmgTaken * 2 : dmgTaken;
                    target.dragonBoneAtk = (target.dragonBoneAtk || 0) + bonus;
                    if (typeof log === 'function') log(`🐉 [Dragon Bone] ดูดซับพลัง! +${bonus} ATK ถาวร`, 'text-red-400 font-bold');
                }
            }

            if (attacker && attacker._jjkCrit) {
                attacker.atk /= 2;
                delete attacker._jjkCrit;
            }

            // Nobara's On Attack
            if (attacker && (attacker.originalName || attacker.name) === 'Nobara Kugisaki') {
                state.players[atkKey].hand.push(_mkJJKSpell('Hair Pin'));
            }
        };
    }

    // 2. โลจิกสเตตัส (Toji True Damage & Yuta Stats)
    if (typeof getCharStats === 'function') {
        const _origStats = window.getCharStats;
        window.getCharStats = function(char) {
            let stats = _origStats(char);
            if (char.silenced) return stats;
            const name = char.originalName || char.name;
            const ownerKey = state.players.player.field.some(c => c.id === char.id) ? 'player' : 'ai';
            const oppKey = ownerKey === 'player' ? 'ai' : 'player';

            if (name === 'Yuta Okkotsu') {
                if (state.players[ownerKey].field.some(c => (c.originalName || c.name) === 'Rika' && c.hp > 0)) {
                    stats.atk += 5; stats.hp += 5; stats.maxHp += 5;
                }
            }
            if (name === 'Toji Fushiguro') {
                stats.damageMultiplier = 1; // เจาะเกราะ (True Damage)
                if (state.players[oppKey].field.length >= 3) stats.atk += 5;
            }

            // Playful Cloud: +ATK ตาม HP ปัจจุบัน
            if (char.items && char.items.some(i => i.name === 'Playful Cloud')) {
                stats.atk += char.hp;
            }

            // Dragon Bone: +1 ATK base + accumulated bonus
            if (char.items && char.items.some(i => i.name === 'Dragon Bone')) {
                stats.atk += 1 + (char.dragonBoneAtk || 0);
            }

            // Split Soul Katana: +4 ATK (+2 HP for Toji/Maki)
            if (char.items && char.items.some(i => i.name === 'Split Soul Katana')) {
                const isTojiMaki = ['Toji Fushiguro', 'Maki Zenin'].includes(name);
                stats.atk += 4;
                if (isTojiMaki) { stats.hp += 2; stats.maxHp += 2; }
            }

            // Hiromi Higuruma: บังคับทุกตัวในสนาม ATK = 2
            const hasHiromi = state.players.player.field.some(c => (c.originalName || c.name) === 'Hiromi Higuruma' && c.hp > 0 && !c.silenced) ||
                              state.players.ai.field.some(c => (c.originalName || c.name) === 'Hiromi Higuruma' && c.hp > 0 && !c.silenced);
            if (hasHiromi) stats.atk = 2;

            return stats;
        };
    }

    // 3. Nobara & Yuta On Summon
    if (typeof triggerOnSummon === 'function') {
        const _origSummon = window.triggerOnSummon;
        window.triggerOnSummon = function(card, pk) {
            _origSummon(card, pk);
            const name = card.originalName || card.name;
            if (name === 'Nobara Kugisaki') state.players[pk].hand.push(_mkJJKSpell('Strawdoll Nail'));
            if (name === 'Yuta Okkotsu' && state.players[pk].field.length < getMaxFieldSlots(pk)) {
                const rika = _mkJJKToken('Rika');
                state.players[pk].field.push(rika);
                if (typeof log === 'function') log(`💍 [Yuta] "มาเถอะ... ริกะ!!"`, 'text-purple-300 font-bold italic');
            }

            // Megumi Fushiguro: เรียก Divine Dogs, Max Elephant, Nue
            if (name === 'Megumi Fushiguro') {
                const p = state.players[pk];
                const summon = (tN, tAtk, tHp, tText) => {
                    if (p.field.length < getMaxFieldSlots(pk)) {
                        p.field.push({
                            id: 'card_' + (cardIdCounter++), name: tN, originalName: tN,
                            type: 'Character', cost: 0, atk: tAtk, hp: tHp, maxHp: tHp,
                            text: tText, color: 'bg-zinc-800', maxAttacks: 1, attacksLeft: 1,
                            status: [], items: [], silenced: false, tempBuffs: []
                        });
                    }
                };
                summon('Divine Dogs', 4, 2, 'ตาย: Base ศัตรู -1 HP');
                summon('Max Elephant', 1, 8, 'Taunt เมื่อ Megumi อยู่บนสนาม');
                summon('Nue', 3, 4, '30% Evade');
                if (typeof log === 'function') log(`🐺🐘🦉 [Megumi] อัญเชิญชิกิงามิ: Divine Dogs, Max Elephant, Nue!`, 'text-gray-300 font-bold');
            }

            // Mahoraga: Cost +1 ทุกการ์ดในมือศัตรู + CC Immune
            if (name === 'Mahoraga') {
                card.tossakanImmune = true;
                const oppKey = pk === 'player' ? 'ai' : 'player';
                state.players[oppKey].hand.forEach(c => { c.costReducer = (c.costReducer || 0) - 1; });
                if (typeof log === 'function') log(`🛞 [Mahoraga] ปรับตัว! การ์ดในมือศัตรู Cost +1`, 'text-gray-300 font-bold');
            }

            // Hiromi Higuruma: ตัดสินศัตรู
            if (name === 'Hiromi Higuruma') {
                const oppKey = pk === 'player' ? 'ai' : 'player';
                const enemies = state.players[oppKey].field.filter(c => getCharStats(c).hp > 0);
                if (enemies.length > 0) {
                    const target = enemies[Math.floor(Math.random() * enemies.length)];
                    const myPower = getCharStats(card).hp + getCharStats(card).atk;
                    const oppPower = getCharStats(target).hp + getCharStats(target).atk;
                    if (typeof log === 'function') log(`⚖️ [Hiromi] การตัดสินเริ่มขึ้น! (พลังรวมเรา ${myPower} vs ศัตรู ${oppPower})`, 'text-yellow-400');
                    if (myPower > oppPower) {
                        card.hp = -99;
                        if (typeof log === 'function') log(`⚖️ [Hiromi] มีความผิด! พลังมากกว่า ศาลสั่งประหาร Hiromi!`, 'text-red-400 font-bold');
                    } else if (myPower < oppPower) {
                        const idx = state.players[oppKey].field.findIndex(c => c.id === target.id);
                        if (idx !== -1) {
                            const removed = state.players[oppKey].field.splice(idx, 1)[0];
                            if (!state.players[oppKey].spaceZone) state.players[oppKey].spaceZone = [];
                            state.players[oppKey].spaceZone.push(removed);
                            if (typeof log === 'function') log(`⚖️ [Hiromi] พลังน้อยกว่า! ริบทรัพย์ ${removed.name} เนรเทศไป Space Zone!`, 'text-indigo-400 font-bold');
                        }
                    } else {
                        if (typeof log === 'function') log(`⚖️ [Hiromi] เสมอ... ศาลยกฟ้อง`, 'text-gray-400');
                    }
                }
            }

            // Kenjaku: สร้าง Spirit Token
            if (name === 'Kenjaku') {
                const oppKey = pk === 'player' ? 'ai' : 'player';
                const p = state.players[pk];
                const allies = p.field.filter(c => c.id !== card.id && c.type === 'Character');
                const enemies = state.players[oppKey].field.filter(c => c.type === 'Character');

                const spawnToken = (src) => {
                    if (!src || p.field.length >= getMaxFieldSlots(pk)) return;
                    const s = getCharStats(src);
                    const tok = _mkJJKToken('Rika');
                    tok.name = 'Spirit ' + (src.originalName || src.name);
                    tok.originalName = 'Spirit Token';
                    tok.atk = s.atk; tok.hp = s.hp; tok.maxHp = s.maxHp;
                    tok.text = 'Spirit Token (ไร้ความสามารถ)';
                    tok.silenced = true; tok.art = src.art;
                    p.field.push(tok);
                };

                if (allies.length > 0) spawnToken(allies[Math.floor(Math.random() * allies.length)]);
                if (enemies.length > 0) spawnToken(enemies[Math.floor(Math.random() * enemies.length)]);
                if (typeof log === 'function') log(`🧠 [Kenjaku] บงการวิญญาณ! สร้าง Spirit Token!`, 'text-purple-400 font-bold');
            }
        };
    }

    // 4. Nobara End Turn
    if (typeof resolveEndPhase === 'function') {
        const _origEnd = window.resolveEndPhase;
        window.resolveEndPhase = function(pk) {
            _origEnd(pk);
            state.players[pk].field.forEach(c => {
                if ((c.originalName || c.name) === 'Nobara Kugisaki' && !c.silenced) {
                    state.players[pk].hand.push(_mkJJKSpell('Strawdoll Nail'));
                    state.players[pk].hand.push(_mkJJKSpell('Hair Pin'));
                }
                // Fern End Turn: ได้รับ Fern Zoltrak 5 ใบ
                if ((c.originalName || c.name) === 'Fern the Sniper' && !c.silenced && getCharStats(c).hp > 0) {
                    for (let i = 0; i < 5; i++) state.players[pk].hand.push(_mkFernSpell());
                    if (typeof log === 'function') log(`💜 [Fern] เวทมนตร์ความเร็วสูง! ได้รับ Fern Zoltrak 5 ใบ!`, 'text-purple-300 font-bold');
                }
                // Gojo End Turn: เสก Ao→Aka→Murasaki ตามลำดับ
                if ((c.originalName || c.name) === 'Gojo Satoru' && !c.silenced && getCharStats(c).hp > 0) {
                    const spells = ['Ao', 'Aka', 'Murasaki'];
                    const spellName = spells[(c.gojoTurn || 0) % 3];
                    state.players[pk].hand.push(_mkGojoSpell(spellName));
                    c.gojoTurn = (c.gojoTurn || 0) + 1;
                    if (typeof log === 'function') log(`🌌 [Gojo] สานพลังไร้ขีดจำกัด! ได้รับ ${spellName}`, 'text-sky-300 font-bold');
                }
                // Sukuna End Turn: สุ่ม Cleave / Fuga / Malevolent Shrine
                if ((c.originalName || c.name) === 'Ryomen Sukuna' && !c.silenced && getCharStats(c).hp > 0) {
                    const skills = ['Cleave', 'Fuga', 'Malevolent Shrine'];
                    const pick = skills[Math.floor(Math.random() * skills.length)];
                    state.players[pk].hand.push(_mkSukunaSpell(pick));
                    if (typeof log === 'function') log(`🔥 [Sukuna] รวบรวมคำสาป... ได้รับ ${pick}`, 'text-red-400 font-bold');
                }
            });
            // Malevolent Shrine: ศัตรูทั้งหมดโดน 2 ดาเมจจบเทิร์น
            const shrine = state.sharedFieldCard;
            if (shrine && shrine.name === 'Malevolent Shrine' && state.sharedFieldCardOwner === pk) {
                const oppKey = pk === 'player' ? 'ai' : 'player';
                state.players[oppKey].field.forEach(c => { if (getCharStats(c).hp > 0) c.hp -= 2; });
                if (typeof log === 'function') log(`⛩️ [Malevolent Shrine] ฟันไม่ยั้ง! ศัตรูทั้งหมดโดน 2 ดาเมจ`, 'text-red-500 font-bold');
                if (typeof checkDeath === 'function') checkDeath(pk === 'player' ? 'ai' : 'player');
            }

        };
    }

    // 5. Nobara + Gojo + Sukuna Spells Logic
    if (typeof executeNonTargetAction === 'function') {
        const _origAct = window.executeNonTargetAction;
        window.executeNonTargetAction = function(card, pk) {
            if (card.isNobaraSpell) {
                const oppKey = pk === 'player' ? 'ai' : 'player';
                const opp = state.players[oppKey];
                if (card.name === 'Strawdoll Nail') {
                    const targets = opp.field.filter(c => getCharStats(c).hp > 0);
                    if (targets.length > 0) {
                        const t = targets[Math.floor(Math.random() * targets.length)];
                        t.hp -= 1; t._jjkMarked = true;
                        if (typeof log === 'function') log(`🔨 [Nail] สร้าง 1 ดาเมจ และ Mark ${t.name}!`, 'text-blue-400');
                    }
                } else if (card.name === 'Hair Pin') {
                    opp.field.forEach(c => {
                        if (c._jjkMarked) {
                            c.hp -= 3; c._jjkMarked = false;
                            if (typeof log === 'function') log(`💥 [Hair Pin] ระเบิดไสยเวท 3 ดาเมจใส่ตัวที่ถูก Mark!`, 'text-blue-500 font-bold');
                        } else {
                            c.hp -= 1;
                        }
                    });
                }
                if (typeof checkDeath === 'function') checkDeath(oppKey);
                state.players[pk].graveyard.push(card);
                return;
            }
            // Fern Zoltrak Spell
            if (card.isFernSpell) {
                const oppKey = pk === 'player' ? 'ai' : 'player';
                const opp = state.players[oppKey];
                const hasFrieren = state.players[pk].field.some(c => (c.originalName || c.name) === 'Frieren' && getCharStats(c).hp > 0 && !c.silenced);
                const dmg = hasFrieren ? 5 : 2;
                const targets = opp.field.filter(c => getCharStats(c).hp > 0);
                if (targets.length > 0) {
                    const t = targets[Math.floor(Math.random() * targets.length)];
                    t.hp -= dmg;
                    if (typeof log === 'function') {
                        if (hasFrieren) log(`💥 [Fern Zoltrak] ยิงทะลวง! ${t.name} โดน 5 ดาเมจ! (บัฟ Frieren)`, 'text-fuchsia-400 font-bold');
                        else log(`💥 [Fern Zoltrak] ยิงรัวๆ! ${t.name} โดน 2 ดาเมจ`, 'text-violet-300');
                    }
                    if (typeof checkDeath === 'function') checkDeath(oppKey);
                }
                state.players[pk].graveyard.push(card);
                return;
            }
            // Prison Realm: ผนึก 2 ตัวสุ่มใน Levitate 3 เทิร์น
            if (card.name === 'Prison Realm') {
                const oppKey = pk === 'player' ? 'ai' : 'player';
                const targets = [...state.players[oppKey].field]
                    .filter(c => getCharStats(c).hp > 0)
                    .sort(() => Math.random() - 0.5)
                    .slice(0, 2);
                targets.forEach(t => {
                    if (!t.status.includes('Levitate')) t.status.push('Levitate');
                    t.levitateTurns = 3;
                    if (typeof log === 'function') log(`⬛ [Prison Realm] ผนึก ${t.name} ติด Levitate 3 เทิร์น!`, 'text-gray-400 font-bold');
                });
                state.players[pk].graveyard.push(card);
                if (typeof updateUI === 'function') updateUI();
                return;
            }
            // Gojo Spells: Ao, Aka, Murasaki
            if (card.isGojoSpell) {
                const oppKey = pk === 'player' ? 'ai' : 'player';
                const enemies = () => state.players[oppKey].field.filter(c => getCharStats(c).hp > 0);
                if (card.name === 'Ao') {
                    [...enemies()].sort(() => Math.random()-0.5).slice(0,2).forEach(t => {
                        t.hp -= 2;
                        if (!t.status.includes('Freeze')) t.status.push('Freeze');
                        t.freezeTurns = 2;
                        if (typeof log === 'function') log(`🔵 [Ao] ${t.name} รับ 2 ดาเมจ + Freeze!`, 'text-blue-400 font-bold');
                    });
                } else if (card.name === 'Aka') {
                    [...enemies()].sort(() => Math.random()-0.5).slice(0,3).forEach(t => {
                        t.hp -= 3;
                        if (typeof log === 'function') log(`🔴 [Aka] ${t.name} รับ 3 ดาเมจ!`, 'text-red-400 font-bold');
                    });
                } else if (card.name === 'Murasaki') {
                    [...enemies()].sort(() => Math.random()-0.5).slice(0,3).forEach(t => {
                        t.hp = -99;
                        if (typeof log === 'function') log(`🟣 [Murasaki] ลบล้างมวลสาร! ${t.name} ถูกทำลายทันที!`, 'text-purple-500 font-bold');
                    });
                }
                if (typeof checkDeath === 'function') checkDeath(oppKey);
                state.players[pk].graveyard.push(card);
                return;
            }
            // Sukuna Spells: Cleave, Fuga
            if (card.isSukunaSpell) {
                const oppKey = pk === 'player' ? 'ai' : 'player';
                const enemies = state.players[oppKey].field.filter(c => getCharStats(c).hp > 0);
                if (card.name === 'Cleave') {
                    if (enemies.length > 0) {
                        const t = enemies[Math.floor(Math.random() * enemies.length)];
                        t.hp -= 4;
                        if (typeof log === 'function') log(`🔪 [Cleave] หั่น ${t.name} 4 ดาเมจ!`, 'text-red-500');
                    }
                } else if (card.name === 'Fuga') {
                    enemies.forEach(t => {
                        t.hp -= 6;
                        if (t.hp > 0 && !t.status.includes('Burn')) { t.status.push('Burn'); t.burnTurns = 2; }
                    });
                    if (typeof log === 'function') log(`🔥 [Fuga] เปลวเพลิงชำระล้าง! ศัตรูทั้งหมดโดน 6 + Burn!`, 'text-orange-500 font-bold');
                }
                if (typeof checkDeath === 'function') checkDeath(oppKey);
                state.players[pk].graveyard.push(card);
                return;
            }
            _origAct(card, pk);
        };
    }

    // 5b. Malevolent Shrine: ป้องกันการทับ Ultimate Field ด้วยการ์ดธรรมดา
    if (typeof playCard === 'function') {
        const _origPlayCard = window.playCard;
        window.playCard = function(playerKey, cardId) {
            const p = state.players[playerKey];
            const card = p.hand.find(c => c.id === cardId);
            if (card && card.type === 'Field' && state.sharedFieldCard && state.sharedFieldCard.isUltimateField && !card.isUltimateField) {
                if (typeof log === 'function') log(`⛩️ ไม่สามารถทับ Ultimate Field ด้วยการ์ดสนามธรรมดาได้!`, 'text-red-400');
                return;
            }
            _origPlayCard.apply(this, arguments);
        };
    }

    // 6. On Death Effects (Rika, Kenjaku, Divine Dogs, Mahoraga)
    if (typeof checkDeath === 'function') {
        const _origDeath = window.checkDeath;
        window.checkDeath = function(pk) {
            const p = state.players[pk];
            p.field.forEach(c => {
                if (getCharStats(c).hp <= 0 && !c.isDyingProcessing) {
                    const effName = c.originalName || c.name;

                    // Rika Legacy
                    if (effName === 'Rika') {
                        const yuta = p.field.find(x => (x.originalName || x.name) === 'Yuta Okkotsu' && getCharStats(x).hp > 0);
                        if (yuta) {
                            yuta.atk += 3; yuta.hp += 3; yuta.maxHp += 3;
                            if (typeof log === 'function') log(`💔 [Rika's Legacy] ยูตะได้รับพลังเฮือกสุดท้าย! +3/+3 ถาวร`, 'text-red-400 font-bold');
                        }
                    }

                    // Divine Dogs death: Base ศัตรู -1 HP
                    if (effName === 'Divine Dogs') {
                        const oppKey = pk === 'player' ? 'ai' : 'player';
                        state.players[oppKey].hp = (state.players[oppKey].hp || 20) - 1;
                        if (typeof log === 'function') log(`🐺 [Divine Dogs] ตาย! ฐานศัตรู -1 HP`, 'text-red-400');
                        if (typeof checkWinCondition === 'function') checkWinCondition();
                    }

                    // Kenjaku Death: ยึดร่างพันธมิตร
                    if (effName === 'Kenjaku') {
                        const allies = p.field.filter(a => a.id !== c.id && getCharStats(a).hp > 0 && !a.isDyingProcessing);
                        if (allies.length > 0) {
                            const host = allies[Math.floor(Math.random() * allies.length)];
                            host.name = 'Kenjaku';
                            host.originalName = 'Kenjaku';
                            host.atk += 4; host.maxHp += 6; host.hp += 6;
                            if (typeof log === 'function') log(`🧠 [Kenjaku] The Brain's Migration! ย้ายร่างยึด ${host.name} (+4 ATK / +6 HP)`, 'text-purple-500 font-bold');
                        }
                    }

                    // Stitch & Repair: ถ้าตัวที่ถูก Stitch ตาย → Base ฝั่งเรา +1 HP
                    if (c.stitchDeathHeal) {
                        p.hp = (p.hp || 20) + 1;
                        if (typeof log === 'function') log(`🧵 [Stitch & Repair] ตัวที่ถูกซ่อมตาย! Base เรา +1 HP`, 'text-blue-300 font-bold');
                    }

                    // Gojo: 50% คืนชีพ (ครั้งเดียว)
                    if (effName === 'Gojo Satoru' && !c._gojoRevived) {
                        if (Math.random() < 0.5) {
                            c.hp = c.maxHp;
                            c.status = [];
                            c._gojoRevived = true;
                            c.isDyingProcessing = false;
                            if (typeof log === 'function') log(`🌌 [Gojo] ฉันคือผู้แข็งแกร่งที่สุด! คืนชีพ 50% เลือดเต็ม!`, 'text-sky-300 font-bold');
                            return;
                        }
                    }

                    // Mahoraga: 50% chance to revive at full HP
                    if (effName === 'Mahoraga' && !c._mahoragaRevived) {
                        if (Math.random() < 0.5) {
                            c.hp = c.maxHp;
                            c.status = [];
                            c._mahoragaRevived = true;
                            c.isDyingProcessing = false;
                            // Re-trigger On Summon: Cost +1 for enemy hand
                            const oppKey = pk === 'player' ? 'ai' : 'player';
                            state.players[oppKey].hand.forEach(hc => { hc.costReducer = (hc.costReducer || 0) - 1; });
                            if (typeof log === 'function') log(`🛞 [Mahoraga] ปรับตัวสำเร็จ! คืนชีพเต็ม + ร่าย Summon อีกครั้ง!`, 'text-gray-300 font-bold');
                        }
                    }
                }
            });
            _origDeath(pk);
        };
    }
}

function _mkJJKSpell(name) {
    const tpl = JJK_CARDS_DATA[name];
    return {
        id: 'card_' + (cardIdCounter++), name: tpl.name, originalName: tpl.name,
        type: 'Spell', cost: tpl.cost, text: tpl.text, color: tpl.color,
        isNobaraSpell: true, _theme: 'jjk', art: '', status: [], items: []
    };
}

function _mkGojoSpell(name) {
    const tpl = JJK_CARDS_DATA[name];
    if (!tpl) return null;
    return {
        id: 'card_' + (cardIdCounter++), name: tpl.name, originalName: tpl.name,
        type: 'Spell', cost: tpl.cost, text: tpl.text, color: tpl.color, art: tpl.art || '',
        isGojoSpell: true, _theme: 'jjk', requiresTarget: false, status: [], items: []
    };
}

function _mkSukunaSpell(name) {
    const tpl = JJK_CARDS_DATA[name];
    if (!tpl) return null;
    const isField = name === 'Malevolent Shrine';
    const isAction = name === 'Fuga';
    return {
        id: 'card_' + (cardIdCounter++), name: tpl.name, originalName: tpl.name,
        type: isField ? 'Field' : (isAction ? 'Action' : 'Spell'),
        cost: tpl.cost, text: tpl.text, color: tpl.color, art: tpl.art || '',
        isSukunaSpell: !isField,
        isUltimateField: isField,
        _theme: 'jjk', requiresTarget: false, status: [], items: []
    };
}

function _mkJJKToken(name, cost = 0, atk = 0, hp = 1) {
    const base = JJK_CARDS_DATA[name] ? JSON.parse(JSON.stringify(JJK_CARDS_DATA[name])) : {};
    return {
        ...base,
        id: 'card_' + (cardIdCounter++),
        name: name, originalName: name,
        type: 'Character',
        cost: base.cost ?? cost,
        atk: base.atk ?? atk,
        hp: base.hp ?? hp,
        maxHp: base.maxHp ?? hp,
        status: [], items: [], attacksLeft: 0, tempBuffs: []
    };
}

function _mkFernSpell() {
    const tpl = FERN_CARDS_DATA['Fern Zoltrak'];
    return {
        id: 'card_' + (cardIdCounter++), name: tpl.name, originalName: tpl.name,
        type: 'Spell', cost: tpl.cost, text: tpl.text, color: tpl.color, art: tpl.art,
        _theme: 'frieren_mage', requiresTarget: false, isFernSpell: true,
        status: [], items: []
    };
}

// ─── Fern BP Pack Buy Logic ───
window.buyFernBPPack = function() {
    if (Date.now() > FERN_EXPIRY) { if (typeof showToast === 'function') showToast('❌ แพ็กเกจนี้หมดเวลาแล้ว!', '#f87171'); return; }
    if (playerData.fernPackBought) { if (typeof showToast === 'function') showToast('✅ คุณเป็นเจ้าของแพ็กนี้แล้ว', '#4ade80'); return; }
    if (playerData.gems < 30) { if (typeof showToast === 'function') showToast('💎 Gems ไม่พอ!', '#f87171'); return; }

    playerData.gems -= 30;
    playerData.fernPackBought = true;
    const cardKey = 'Fern the Sniper|frieren_mage';
    playerData.collection[cardKey] = (playerData.collection[cardKey] || 0) + 1;

    window.addBattlePoints(5000);

    if (typeof saveData === 'function') saveData();
    if (typeof updateHubUI === 'function') updateHubUI();
    renderBattlePass();
    _showFernReveal();
};

// ─── Trigon BP Pack Buy Logic ───
window.buyTrigonBPPack = function() {
    if (Date.now() > TRIGON_EXPIRY) { if (typeof showToast === 'function') showToast('❌ แพ็กเกจนี้หมดเวลาแล้ว!', '#f87171'); return; }
    if (playerData.trigonPackBought) { if (typeof showToast === 'function') showToast('✅ คุณเป็นเจ้าของแพ็กนี้แล้ว', '#4ade80'); return; }
    if (playerData.gems < 30) { if (typeof showToast === 'function') showToast('💎 Gems ไม่พอ!', '#f87171'); return; }

    playerData.gems -= 30;
    playerData.trigonPackBought = true;
    const cardKey = 'Trigon|frieren_mage';
    playerData.collection[cardKey] = (playerData.collection[cardKey] || 0) + 1;

    window.addBattlePoints(5000);

    if (typeof saveData === 'function') saveData();
    if (typeof updateHubUI === 'function') updateHubUI();
    renderBattlePass();
    _showTrigonReveal();
};

function _showTrigonReveal() {
    const ov = document.createElement('div');
    ov.id = 'trigon-reveal-ov';
    ov.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,0.95);z-index:100000;display:flex;align-items:center;justify-content:center;';
    ov.innerHTML = `
        <div style="background:linear-gradient(135deg,#450a0a,#2a0a0a);border:3px solid #f87171;border-radius:28px;padding:30px;max-width:380px;width:92%;text-align:center;box-shadow:0 0 60px rgba(248,113,113,0.5)">
            <h2 style="font-size:1.8rem;font-weight:900;color:#f87171;margin:0 0 5px;">🎉 ซื้อสำเร็จ!</h2>
            <div style="color:#fca5a5;font-size:0.85rem;margin-bottom:20px;">คุณได้รับของรางวัลจาก Value Bundle แล้ว</div>
            <div style="width:110px;height:150px;border-radius:12px;border:2px solid #f87171;overflow:hidden;margin:0 auto 20px;box-shadow:0 0 20px rgba(248,113,113,0.4);">
                <img src="${TRIGON_CARDS_DATA['Trigon'].art}" style="width:100%;height:100%;object-fit:cover;">
            </div>
            <div style="background:rgba(0,0,0,0.5);border:1px solid #f87171;border-radius:12px;padding:12px;margin-bottom:20px;">
                <div style="font-weight:bold;color:white;">🃏 Trigon x1</div>
                <div style="font-weight:bold;color:#fbbf24;margin-top:5px;font-size:1.2rem;">⭐ +5,000 BP</div>
                <div style="font-size:0.7rem;color:#9ca3af;margin-top:2px;">(Level Up อัตโนมัติแล้ว)</div>
            </div>
            <button onclick="document.getElementById('trigon-reveal-ov').remove()" style="width:100%;background:#f87171;color:black;border:none;padding:12px;border-radius:12px;font-weight:900;cursor:pointer;font-size:1rem;">เยี่ยมไปเลย!</button>
        </div>
    `;
    document.body.appendChild(ov);
}

function _showFernReveal() {
    const ov = document.createElement('div');
    ov.id = 'fern-reveal-ov';
    ov.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,0.95);z-index:100000;display:flex;align-items:center;justify-content:center;';
    ov.innerHTML = `
        <div style="background:linear-gradient(135deg,#2e1065,#172554);border:3px solid #c084fc;border-radius:28px;padding:30px;max-width:380px;width:92%;text-align:center;box-shadow:0 0 60px rgba(168,85,247,0.5)">
            <h2 style="font-size:1.8rem;font-weight:900;color:#c084fc;margin:0 0 5px;">🎉 ซื้อสำเร็จ!</h2>
            <div style="color:#d8b4fe;font-size:0.85rem;margin-bottom:20px;">คุณได้รับของรางวัลจาก Value Bundle แล้ว</div>
            <div style="width:110px;height:150px;border-radius:12px;border:2px solid #c084fc;overflow:hidden;margin:0 auto 20px;box-shadow:0 0 20px rgba(192,132,252,0.4);">
                <img src="${FERN_CARDS_DATA['Fern the Sniper'].art}" style="width:100%;height:100%;object-fit:cover;">
            </div>
            <div style="background:rgba(0,0,0,0.5);border:1px solid #c084fc;border-radius:12px;padding:12px;margin-bottom:20px;">
                <div style="font-weight:bold;color:white;">🃏 Fern the Sniper x1</div>
                <div style="font-weight:bold;color:#fbbf24;margin-top:5px;font-size:1.2rem;">⭐ +5,000 BP</div>
                <div style="font-size:0.7rem;color:#9ca3af;margin-top:2px;">(Level Up อัตโนมัติแล้ว)</div>
            </div>
            <button onclick="document.getElementById('fern-reveal-ov').remove()" style="width:100%;background:#c084fc;color:black;border:none;padding:12px;border-radius:12px;font-weight:900;cursor:pointer;font-size:1rem;">เยี่ยมไปเลย!</button>
        </div>
    `;
    document.body.appendChild(ov);
}

// ============================================================
// QUEST SYSTEM — Daily / Weekly / One-Time Quests + Promo Codes
// ============================================================

const QUEST_DEFS = {
    daily: [
        { id: 'daily_login',      label: 'Log In',               desc: 'Log in today.',                        icon: '🌅', target: 1,    reward: 200,  trackKey: 'loginDays'       },
        { id: 'daily_play_ai_2',  label: 'Play 2 Games vs AI',   desc: 'Play 2 games against the AI.',         icon: '🤖', target: 2,    reward: 300,  trackKey: 'gamesVsAI'       },
        { id: 'daily_win_rank_3', label: 'Win 3 Ranked Games',   desc: 'Win 3 games in Rank mode.',            icon: '🏆', target: 3,    reward: 400,  trackKey: 'rankWins'        },
        { id: 'daily_spend_500',  label: 'Spend 500 Coins',      desc: 'Spend a total of 500 coins.',          icon: '🪙', target: 500,  reward: 300,  trackKey: 'coinsSpent'      },
        { id: 'daily_elite_pack', label: 'Open 1 Elite Pack',    desc: 'Open at least 1 Elite pack.',          icon: '📦', target: 1,    reward: 800,  trackKey: 'elitePacksOpened'},
    ],
    weekly: [
        { id: 'weekly_login_5',    label: 'Log In 5 Days',        desc: 'Log in on 5 different days this week.',        icon: '📆', target: 5,    reward: 1000,  trackKey: 'loginDays'       },
        { id: 'weekly_play_ai_20', label: 'Play 20 Games vs AI',  desc: 'Play 20 games against the AI.',                icon: '🎮', target: 20,   reward: 1500,  trackKey: 'gamesVsAI'       },
        { id: 'weekly_damage_500', label: 'Deal 500 Base Damage', desc: 'Deal 500 total damage to the opponent base.',   icon: '💥', target: 500,  reward: 2500,  trackKey: 'totalBaseDamage' },
        { id: 'weekly_spend_7500', label: 'Spend 7,500 Coins',    desc: 'Spend a total of 7,500 coins this week.',       icon: '💰', target: 7500, reward: 5000,  trackKey: 'coinsSpent'      },
    ],
    oneTime: [
        { id: 'ot_login_10',    label: 'Log In 10 Days',      desc: 'Log in on 10 different days.',  icon: '🗓️', target: 10,    reward: 5000,  rewardType: 'xp', trackKey: 'totalLoginDays'  },
        { id: 'ot_win_rank_50', label: 'Win 50 Ranked Games', desc: 'Win 50 ranked games.',          icon: '🥇', target: 50,    reward: 7500,  rewardType: 'bp', trackKey: 'totalRankWins'   },
        { id: 'ot_login_12',    label: 'Log In 12 Days',      desc: 'Log in on 12 different days.',  icon: '🌟', target: 12,    reward: 7500,  rewardType: 'bp', trackKey: 'totalLoginDays'  },
        { id: 'ot_spend_20000', label: 'Spend 20,000 Coins',  desc: 'Spend 20,000 coins total.',     icon: '💎', target: 20000, reward: 10000, rewardType: 'bp', trackKey: 'totalCoinsSpent' },
    ],
};

const PROMO_CODES = {
    'FIRSTBP': { reward: 10000, rewardType: 'bp', label: '+10,000 BP', maxRedeems: 1 },
};

const QUEST_SEASON_KEY = 'bp_s1_jjk';

function _getTodayStr() {
    const d = new Date();
    return `${d.getFullYear()}-${d.getMonth()+1}-${d.getDate()}`;
}
function _getWeekStr() {
    const d = new Date();
    const start = new Date(d);
    start.setDate(d.getDate() - d.getDay());
    return `${start.getFullYear()}-${start.getMonth()+1}-${start.getDate()}`;
}

function _initQuestData() {
    if (typeof playerData === 'undefined') return;
    if (!playerData.quests) playerData.quests = {};
    const q = playerData.quests;

    if (q.seasonKey !== QUEST_SEASON_KEY) {
        q.seasonKey = QUEST_SEASON_KEY;
        q.otClaimed = {}; q.otProgress = {};
        q.totalLoginDays = 0; q.totalRankWins = 0; q.totalCoinsSpent = 0;
    }

    const today = _getTodayStr();
    if (q.dailyDate !== today) {
        q.dailyDate = today;
        q.dailyProgress = {}; q.dailyClaimed = {};
        if (q.lastLoginDate !== today) {
            q.lastLoginDate   = today;
            q.weeklyLoginDays = (q.weeklyLoginDays || 0) + 1;
            q.totalLoginDays  = (q.totalLoginDays  || 0) + 1;
            q.dailyProgress['loginDays'] = 1;
        }
    }

    const week = _getWeekStr();
    if (q.weeklyDate !== week) {
        q.weeklyDate = week;
        q.weeklyProgress = {}; q.weeklyClaimed = {};
        q.weeklyLoginDays = 0;
        if (q.lastLoginDate === today) q.weeklyProgress['loginDays'] = 1;
    }

    if (!q.redeemedCodes) q.redeemedCodes = {};
}

window.QuestSystem = {
    init() {
        _initQuestData();
        if (typeof saveData === 'function') saveData();
    },
    trackGameVsAI() {
        _initQuestData();
        const q = playerData.quests;
        q.dailyProgress['gamesVsAI']  = (q.dailyProgress['gamesVsAI']  || 0) + 1;
        q.weeklyProgress['gamesVsAI'] = (q.weeklyProgress['gamesVsAI'] || 0) + 1;
        if (typeof saveData === 'function') saveData();
    },
    trackRankWin() {
        _initQuestData();
        const q = playerData.quests;
        q.dailyProgress['rankWins']   = (q.dailyProgress['rankWins']   || 0) + 1;
        q.otProgress['totalRankWins'] = (q.otProgress['totalRankWins'] || 0) + 1;
        q.totalRankWins = (q.totalRankWins || 0) + 1;
        if (typeof saveData === 'function') saveData();
    },
    trackCoinsSpent(amount) {
        if (!amount || amount <= 0) return;
        _initQuestData();
        const q = playerData.quests;
        q.dailyProgress['coinsSpent']   = (q.dailyProgress['coinsSpent']   || 0) + amount;
        q.weeklyProgress['coinsSpent']  = (q.weeklyProgress['coinsSpent']  || 0) + amount;
        q.otProgress['totalCoinsSpent'] = (q.otProgress['totalCoinsSpent'] || 0) + amount;
        q.totalCoinsSpent = (q.totalCoinsSpent || 0) + amount;
        if (typeof saveData === 'function') saveData();
    },
    trackElitePackOpened() {
        _initQuestData();
        playerData.quests.dailyProgress['elitePacksOpened'] = (playerData.quests.dailyProgress['elitePacksOpened'] || 0) + 1;
        if (typeof saveData === 'function') saveData();
    },
    trackBaseDamage(amount) {
        if (!amount || amount <= 0) return;
        _initQuestData();
        playerData.quests.weeklyProgress['totalBaseDamage'] = (playerData.quests.weeklyProgress['totalBaseDamage'] || 0) + amount;
        if (typeof saveData === 'function') saveData();
    },
    claimQuest(type, id) {
        _initQuestData();
        const def = QUEST_DEFS[type]?.find(d => d.id === id);
        if (!def) return;
        const q = playerData.quests;
        const claimedMap  = type === 'daily' ? q.dailyClaimed   : type === 'weekly' ? q.weeklyClaimed  : q.otClaimed;
        const progressMap = type === 'daily' ? q.dailyProgress  : type === 'weekly' ? q.weeklyProgress : q.otProgress;
        if (claimedMap[id]) return;
        if ((progressMap[def.trackKey] || 0) < def.target) return;
        const rType = def.rewardType || 'bp';
        if (rType === 'bp') {
            window.addBattlePoints(def.reward);
            if (typeof showToast === 'function') showToast(`✅ Quest complete! +${def.reward.toLocaleString()} BP`, '#fbbf24');
        } else if (rType === 'xp') {
            if (typeof addXp === 'function') addXp(def.reward);
            if (typeof showToast === 'function') showToast(`✅ Quest complete! +${def.reward.toLocaleString()} XP`, '#86efac');
        }
        claimedMap[id] = true;
        if (typeof saveData === 'function') saveData();
        renderQuestPanel();
        if (typeof updateHubUI === 'function') updateHubUI();
    },
    redeemCode(raw) {
        _initQuestData();
        const code = (raw || '').trim().toUpperCase();
        const def  = PROMO_CODES[code];
        if (!def) { if (typeof showToast === 'function') showToast('❌ Invalid code!', '#f87171'); return; }
        const q = playerData.quests;
        if ((q.redeemedCodes[code] || 0) >= def.maxRedeems) {
            if (typeof showToast === 'function') showToast('⚠️ Code already redeemed!', '#f87171'); return;
        }
        q.redeemedCodes[code] = (q.redeemedCodes[code] || 0) + 1;
        if (def.rewardType === 'bp') {
            window.addBattlePoints(def.reward);
            if (typeof showToast === 'function') showToast(`🎁 Code redeemed! ${def.label}`, '#fbbf24');
        } else if (def.rewardType === 'coins') {
            playerData.coins = (playerData.coins || 0) + def.reward;
            if (typeof showToast === 'function') showToast(`🎁 +${def.reward} Coins!`, '#fbbf24');
        } else if (def.rewardType === 'gems') {
            playerData.gems = (playerData.gems || 0) + def.reward;
            if (typeof showToast === 'function') showToast(`🎁 +${def.reward} 💎 Gems!`, '#60a5fa');
        }
        if (typeof saveData === 'function') saveData();
        renderQuestPanel();
        if (typeof updateHubUI === 'function') updateHubUI();
    },
};

// ─── Auto-patch game events ───────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
    if (typeof playerData !== 'undefined') window.QuestSystem.init();

    // 1. Rank win (awardWin = online ranked only)
    if (typeof window.awardWin === 'function') {
        const _ow = window.awardWin;
        window.awardWin = function() {
            window.QuestSystem.trackRankWin();
            return _ow.apply(this, arguments);
        };
    }
    // P2 online rank win via recordGameResult
    if (typeof window.recordGameResult === 'function') {
        const _origRGR = window.recordGameResult;
        window.recordGameResult = async function(didWin) {
            if (didWin && typeof myRole !== 'undefined' && myRole === 'ai') {
                window.QuestSystem.trackRankWin();
            }
            return _origRGR.apply(this, arguments);
        };
    }

    // 2. AI game end (endGame fires when any game vs AI ends)
    if (typeof window.endGame === 'function') {
        const _oeg = window.endGame;
        window.endGame = function(winner) {
            _oeg.apply(this, arguments);
            if (typeof gameMode !== 'undefined' && gameMode === 'ai') {
                window.QuestSystem.trackGameVsAI();
            }
        };
    }

    // 3. Base damage tracking
    if (typeof window.trackDamageBase === 'function') {
        const _od = window.trackDamageBase;
        window.trackDamageBase = function(dmg, forPlayer) {
            _od.apply(this, arguments);
            const myKey = (typeof myRole !== 'undefined' && myRole) ? myRole : 'player';
            if ((forPlayer || myKey) === myKey) {
                window.QuestSystem.trackBaseDamage(dmg);
            }
        };
    }

    // 4. Elite Pack opening
    if (typeof window.openPack === 'function') {
        const _oop = window.openPack;
        window.openPack = function(packType, setName) {
            const result = _oop.apply(this, arguments);
            if (result && !result.error && (packType === 'elite' || packType === 'ready')) {
                window.QuestSystem.trackElitePackOpened();
            }
            return result;
        };
    }

    // 5. Coins spent — ดักจาก saveData เพื่อจับทุกกรณีที่ coins ลดลง
    let _lastCoinsForQuest = typeof playerData !== 'undefined' ? (playerData.coins || 0) : 0;
    let _isTrackingCoins = false;
    if (typeof window.saveData === 'function') {
        const _origSave = window.saveData;
        window.saveData = function() {
            if (!_isTrackingCoins && typeof playerData !== 'undefined' && playerData.coins !== undefined) {
                if (playerData.coins < _lastCoinsForQuest) {
                    const spent = _lastCoinsForQuest - playerData.coins;
                    _isTrackingCoins = true;
                    window.QuestSystem.trackCoinsSpent(spent);
                    _isTrackingCoins = false;
                }
                _lastCoinsForQuest = Math.max(playerData.coins, 0);
            }
            _origSave.apply(this, arguments);
        };
    }

    // 6. Tab switching
    if (typeof window.showHubTab === 'function') {
        const _ot = window.showHubTab;
        window.showHubTab = function(tab) {
            const btn = document.getElementById('hub-tab-quests');
            const pnl = document.getElementById('hub-panel-quests');
            if (tab === 'quests') {
                ['home', 'packs', 'collection', 'deckbuilder', 'play', 'profile', 'themes', 'bp', 'trade', 'social'].forEach(t => {
                    const b = document.getElementById(`hub-tab-${t}`);
                    const p = document.getElementById(`hub-panel-${t}`);
                    if (b) b.classList.remove('active-tab');
                    if (p) p.style.display = 'none';
                });
                if (btn) btn.classList.add('active-tab');
                if (pnl) { pnl.style.display = 'block'; renderQuestPanel(); }
            } else {
                if (btn) btn.classList.remove('active-tab');
                if (pnl) pnl.style.display = 'none';
                _ot(tab);
            }
        };
    }

    _injectQuestTab();
});

function _injectQuestTab() {
    const navBar = document.querySelector('.hub-nav-bar');
    if (navBar && !document.getElementById('hub-tab-quests')) {
        const btn = document.createElement('button');
        btn.id = 'hub-tab-quests';
        btn.className = 'hub-nav-btn';
        btn.innerHTML = '📋 Quests';
        btn.onclick = () => { if (typeof showHubTab === 'function') showHubTab('quests'); };
        navBar.appendChild(btn);
    }
    const container = document.getElementById('hub-panel-home')?.parentElement;
    if (container && !document.getElementById('hub-panel-quests')) {
        const pnl = document.createElement('div');
        pnl.id = 'hub-panel-quests';
        pnl.className = 'hub-panel';
        pnl.style.display = 'none';
        container.appendChild(pnl);
    }
}

function renderQuestPanel() {
    const pnl = document.getElementById('hub-panel-quests');
    if (!pnl || typeof playerData === 'undefined') return;
    _initQuestData();
    const q = playerData.quests;

    const renderSection = (type, defs, progressMap, claimedMap) => defs.map(def => {
        const progress = progressMap[def.trackKey] || 0;
        const pct      = Math.min(100, Math.floor((progress / def.target) * 100));
        const done     = progress >= def.target;
        const claimed  = claimedMap[def.id] || false;
        const canClaim = done && !claimed;
        const rLabel   = def.rewardType === 'xp' ? `+${def.reward.toLocaleString()} XP` : `+${def.reward.toLocaleString()} BP`;
        return `
        <div style="background:${claimed ? '#052e16' : done ? 'rgba(251,191,36,0.08)' : '#111827'};border:1px solid ${claimed ? '#166534' : done ? '#fbbf24' : '#374151'};border-radius:12px;padding:14px 16px;margin-bottom:8px;">
            <div style="display:flex;justify-content:space-between;align-items:flex-start;gap:10px;flex-wrap:wrap;">
                <div style="flex:1;min-width:160px;">
                    <div style="font-weight:900;color:${claimed ? '#4ade80' : done ? '#fbbf24' : 'white'};font-size:0.85rem;margin-bottom:2px;">${def.icon} ${def.label}</div>
                    <div style="font-size:0.7rem;color:#9ca3af;margin-bottom:8px;">${def.desc}</div>
                    <div style="display:flex;align-items:center;gap:8px;">
                        <div style="flex:1;height:6px;background:#1f2937;border-radius:3px;overflow:hidden;">
                            <div style="width:${pct}%;height:100%;background:${claimed ? '#4ade80' : done ? '#fbbf24' : '#3b82f6'};border-radius:3px;"></div>
                        </div>
                        <span style="font-size:0.65rem;color:#9ca3af;white-space:nowrap;">${Math.min(progress,def.target).toLocaleString()} / ${def.target.toLocaleString()}</span>
                    </div>
                </div>
                <div style="text-align:center;min-width:80px;">
                    <div style="font-size:0.7rem;font-weight:900;color:#fbbf24;margin-bottom:4px;">${rLabel}</div>
                    ${claimed
                        ? `<div style="color:#4ade80;font-size:0.7rem;font-weight:900;">✅ Claimed</div>`
                        : canClaim
                            ? `<button onclick="window.QuestSystem.claimQuest('${type}','${def.id}')" style="background:#fbbf24;border:none;border-radius:8px;padding:5px 12px;font-weight:900;cursor:pointer;font-size:0.75rem;">CLAIM</button>`
                            : `<div style="color:#4b5563;font-size:0.7rem;">🔒</div>`
                    }
                </div>
            </div>
        </div>`;
    }).join('');

    pnl.innerHTML = `
    <div style="max-width:500px;margin:0 auto;padding:20px;">
        <div style="text-align:center;margin-bottom:20px;">
            <div style="font-weight:900;font-size:1.1rem;color:white;letter-spacing:1px;">📋 QUESTS</div>
            <div style="font-size:0.7rem;color:#9ca3af;margin-top:2px;">Complete quests to earn Battle Pass Points</div>
        </div>
        <div style="margin-bottom:20px;">
            <div style="font-weight:900;color:#e5e7eb;letter-spacing:2px;font-size:0.7rem;text-transform:uppercase;margin-bottom:10px;padding-bottom:6px;border-bottom:1px solid #374151;">⏱ Daily Quests</div>
            ${renderSection('daily', QUEST_DEFS.daily, q.dailyProgress || {}, q.dailyClaimed || {})}
        </div>
        <div style="margin-bottom:20px;">
            <div style="font-weight:900;color:#e5e7eb;letter-spacing:2px;font-size:0.7rem;text-transform:uppercase;margin-bottom:10px;padding-bottom:6px;border-bottom:1px solid #374151;">📅 Weekly Quests</div>
            ${renderSection('weekly', QUEST_DEFS.weekly, q.weeklyProgress || {}, q.weeklyClaimed || {})}
        </div>
        <div style="margin-bottom:20px;">
            <div style="font-weight:900;color:#e5e7eb;letter-spacing:2px;font-size:0.7rem;text-transform:uppercase;margin-bottom:10px;padding-bottom:6px;border-bottom:1px solid #374151;">🏅 One-Time Quests</div>
            ${renderSection('oneTime', QUEST_DEFS.oneTime, q.otProgress || {}, q.otClaimed || {})}
        </div>
        <div style="margin-bottom:20px;">
            <div style="font-weight:900;color:#e5e7eb;letter-spacing:2px;font-size:0.7rem;text-transform:uppercase;margin-bottom:10px;padding-bottom:6px;border-bottom:1px solid #374151;">🎁 Promo Code</div>
            <div style="display:flex;gap:8px;">
                <input id="promo-code-input" type="text" placeholder="Enter code..." style="flex:1;background:#1f2937;border:1px solid #374151;border-radius:8px;padding:8px 12px;color:white;font-size:0.85rem;outline:none;text-transform:uppercase;">
                <button onclick="(()=>{const v=document.getElementById('promo-code-input').value;window.QuestSystem.redeemCode(v);document.getElementById('promo-code-input').value='';})()" style="background:#fbbf24;border:none;border-radius:8px;padding:8px 16px;font-weight:900;cursor:pointer;font-size:0.8rem;white-space:nowrap;">REDEEM</button>
            </div>
        </div>
    </div>`;
}
window.renderQuestPanel = renderQuestPanel;

window.showDomainTargetModal = function(playerKey, card, myUnit, enemies, oppKey) {
    const existing = document.getElementById('domain-modal');
    if (existing) existing.remove();

    const overlay = document.createElement('div');
    overlay.id = 'domain-modal';
    overlay.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,0.88);z-index:9500;display:flex;align-items:center;justify-content:center;flex-direction:column;gap:16px;';

    const box = document.createElement('div');
    box.style.cssText = 'background:#1e1b4b;border:3px solid #818cf8;border-radius:20px;padding:24px 28px;max-width:460px;width:92%;text-align:center;box-shadow:0 0 40px rgba(129,140,248,0.5);';

    const title = document.createElement('div');
    title.style.cssText = 'font-size:1.3rem;font-weight:900;color:#a5b4fc;margin-bottom:6px;';
    title.innerText = '🌌 กางอาณาเขต: เลือกเป้าหมายศัตรู';

    const list = document.createElement('div');
    list.style.cssText = 'display:flex;flex-wrap:wrap;gap:8px;justify-content:center;margin-top:16px;';

    enemies.forEach(t => {
        const stats = getCharStats(t);
        const btn = document.createElement('button');
        btn.style.cssText = 'background:#312e81;border:2px solid #4f46e5;color:white;border-radius:10px;padding:10px 16px;font-size:0.9rem;cursor:pointer;transition:background 0.15s;';
        btn.innerHTML = `<span style="font-weight:700;">${t.name}</span><br><span style="color:#fca5a5;font-size:0.75rem;">ATK ${stats.atk} / HP ${stats.hp}</span>`;
        btn.onmouseenter = () => btn.style.background = '#4338ca';
        btn.onmouseleave = () => btn.style.background = '#312e81';
        btn.onclick = () => {
            overlay.remove();
            executeDomainExpansion(playerKey, card, myUnit, t, oppKey);
        };
        list.appendChild(btn);
    });

    box.appendChild(title);
    box.appendChild(list);
    overlay.appendChild(box);
    document.body.appendChild(overlay);
};

window.executeDomainExpansion = function(playerKey, card, myUnit, enemyUnit, oppKey) {
    const p = state.players[playerKey];
    const opp = state.players[oppKey];

    // เปิดเสียง
    const audio = new Audio('https://file.garden/aeeLCXSsJxTPrRbp/rpreplay_final1623689697_mov.mp3');
    audio.volume = 0.8;
    audio.play().catch(()=>{});
    if (typeof log === 'function') log(`🌌 กางอาณาเขต! ${myUnit.name} vs ${enemyUnit.name}!`, 'text-indigo-400 font-bold text-lg');

    // เด้งการ์ดอื่นๆ กลับมือทั้งหมด
    for (let i = p.field.length - 1; i >= 0; i--) {
        if (p.field[i].id !== myUnit.id) {
            const c = p.field.splice(i, 1)[0];
            c.costReducer = c.cost; // ตัวเรา Cost = 0
            c.status =[]; c.attacksLeft = 0;
            p.hand.push(c);
        }
    }
    for (let i = opp.field.length - 1; i >= 0; i--) {
        if (opp.field[i].id !== enemyUnit.id) {
            const c = opp.field.splice(i, 1)[0];
            c.costReducer = (c.costReducer || 0) - 1; // ศัตรู Cost +1
            c.status =[]; c.attacksLeft = 0;
            opp.hand.push(c);
        }
    }

    myUnit.atk += 5; myUnit.hp += 5; myUnit.maxHp += 5;
    myUnit.domainGuaranteedHit = true;
    myUnit.domainActiveTurn = state.totalTurns;

    p.cost -= (typeof getActualCost === 'function' ? getActualCost(card, playerKey) : card.cost);
    const hIdx = p.hand.findIndex(x => x.id === card.id);
    if (hIdx !== -1) p.hand.splice(hIdx, 1);
    p.graveyard.push(card);

    if (typeof updateUI === 'function') updateUI();
};


// ============================================================
// HOTFIX: เพิ่ม Artstyle จาก JJK Box ลงในระบบให้มองเห็น + กดใส่ได้ (แก้ไขเรื่องตัวแปร)
// ============================================================
document.addEventListener('DOMContentLoaded', () => {
    // 1. ข้อมูล Artstyle ของกล่องสุ่มที่ตกหล่นไป นำมายัดเข้าระบบ
    const missingArts = [
        { id: 'oppenheimer_domain', label: 'Oppenheimer Domain', targetCard: 'Oppenheimer', art: 'https://file.garden/aeeLCXSsJxTPrRbp/1777176887957.jpg', emoji: '💥' },
        { id: 'leonidas_army', label: 'Leonidas Army', targetCard: 'Leonidas I', art: 'https://file.garden/aeeLCXSsJxTPrRbp/file_00000000f894720b959286e79f4e90aa.png', emoji: '🛡️' },
        { id: 'chameleon_cursed', label: 'Cursed Spirit', targetCard: 'Chameleon', art: 'https://file.garden/aeeLCXSsJxTPrRbp/file_00000000d3ec7208963be103b3428d6e.png', emoji: '🦎' },
        { id: 'subaru_madness', label: 'Cursed Madness', targetCard: 'Subaru', art: 'https://file.garden/aeeLCXSsJxTPrRbp/1777177068586.jpg', emoji: '😱' },
        { id: 'desert_eagle_cursed', label: 'Cursed Gun', targetCard: 'Desert Eagle', art: 'https://file.garden/aeeLCXSsJxTPrRbp/1777177110354.jpg', emoji: '🔫' }
    ];

    if (typeof ARTSTYLE_CFG !== 'undefined') {
        missingArts.forEach(a => {
            ARTSTYLE_CFG[a.id] = { ...a, isBPExclusive: true, shopCost: 0 };
        });
        ['megumi_jp', 'toji_wrath', 'mahoraga_mafia'].forEach(id => {
            if (ARTSTYLE_CFG[id]) ARTSTYLE_CFG[id].isBPExclusive = true;
        });
    }

    // 2. ดักจับหน้าต่าง Artstyle เพื่อเปลี่ยนปุ่ม "ซื้อ" เป็น "ล็อค" สำหรับกล่องสุ่ม
    if (typeof window.renderUnifiedArtstyleShop === 'function') {
        const _origRenderUnifiedArt = window.renderUnifiedArtstyleShop;
        window.renderUnifiedArtstyleShop = function() {
            _origRenderUnifiedArt(); // วาด UI ปกติก่อน

            const ov = document.getElementById('_artstyle-overlay');
            if (!ov) return;

            const buttons = ov.querySelectorAll('button');
            buttons.forEach(btn => {
                const onclick = btn.getAttribute('onclick') || '';
                // หาปุ่มที่เป็นฟังก์ชัน "ซื้อ"
                if (onclick.includes('buyUnifiedArtstyle') || onclick.includes('buyArtstyle')) {
                    const match = onclick.match(/'([^']+)'/);
                    if (match) {
                        const id = match[1];
                        const cfg = (typeof ARTSTYLE_CFG !== 'undefined') ? ARTSTYLE_CFG[id] : null;
                        // ถ้าเป็นการ์ด Exclusive จากแพส/กล่องสุ่ม ให้ซ่อนปุ่มซื้อแล้วขึ้นป้ายบอกแทน
                        if (cfg && cfg.isBPExclusive) {
                            const parent = btn.parentNode;
                            btn.remove();
                            const lockDiv = document.createElement('div');
                            lockDiv.style.cssText = 'background:#374151;color:#fca5a5;padding:7px 10px;border-radius:8px;font-size:0.6rem;font-weight:700;min-width:56px;text-align:center;border:1px solid #f87171';
                            lockDiv.innerHTML = '🔒 จากกล่อง JJK';
                            parent.appendChild(lockDiv);
                        }
                    }
                }
            });
        };
    }
});

// ============================================================
// UPDATE: JJK Evolve (Gojo Shibuya & Sukuna Full Power)
// ============================================================
document.addEventListener('DOMContentLoaded', () => {
    // 1. เพิ่มการ์ดใหม่
    const JJK_EVOLVED = {
        'Gojo Satoru (Shibuya Station)': {
            name: 'Gojo Satoru (Shibuya Station)', type: 'Champion', cost: 11, atk: 4, hp: 11, maxHp: 11,
            text: '♛ Champion | Ongoing: ATK < 8 ตีไม่เข้า (DMG=0) | Death: 50% คืนชีพเต็ม | End Turn: เสกเวทตามลำดับ (Ao→Aka→Murasaki→Unlimited Void)',
            color: 'bg-sky-600', maxAttacks: 1, isChampion: true,
            art: 'https://file.garden/aeeLCXSsJxTPrRbp/file_00000000b95c71fa91c3165e22d22b3d.png', _theme: 'jjk'
        },
        'Ryomen Sukuna (Full Power)': {
            name: 'Ryomen Sukuna (Full Power)', type: 'Champion', cost: 12, atk: 4, hp: 15, maxHp: 15,
            text: '♛ Champion | On Attack: True Damage | End Turn: สุ่มดึง Cleave(Ev), Fuga, Malevolent Shrine, หรือ Summon Mahoraga',
            color: 'bg-red-950', maxAttacks: 1, isChampion: true,
            art: 'https://file.garden/aeeLCXSsJxTPrRbp/ff5cdd8ac5a20a0775af0b78764bd3b6.jpg', _theme: 'jjk'
        },
        // Spells for Gojo
        'Ao (Evolved)': { name: 'Ao (Evolved)', type: 'Spell', cost: 4, text: '2 ดาเมจ ใส่ศัตรูสุ่ม 2 ตัว + แช่แข็ง(Freeze) 1 เทิร์น (ทั้งเทิร์นเขาและเรา)', color: 'bg-blue-600', requiresTarget: false, _theme: 'jjk', isEvGojoSpell: true, shopOnly: true },
        'Aka (Evolved)': { name: 'Aka (Evolved)', type: 'Spell', cost: 5, text: '3 ดาเมจ ใส่ศัตรูสุ่ม 3 ตัว', color: 'bg-red-600', requiresTarget: false, _theme: 'jjk', isEvGojoSpell: true, shopOnly: true },
        'Murasaki (Evolved)': { name: 'Murasaki (Evolved)', type: 'Spell', cost: 8, text: 'ทำลายการ์ดบนสนามฝั่งศัตรูทั้งหมดทันที', color: 'bg-purple-700', requiresTarget: false, _theme: 'jjk', isEvGojoSpell: true, shopOnly: true },
        'Unlimited Void': { name: 'Unlimited Void', type: 'Field', cost: 9, text: 'Ultimate Field | จบเทิร์น: 50% โอกาสทำให้ศัตรู 1-5 ตัว ติด Paralyze 2 เทิร์น', color: 'bg-slate-900', isUltimateField: true, _theme: 'jjk', shopOnly: true },
        // Spells for Sukuna
        'Cleave (Evolved)': { name: 'Cleave (Evolved)', type: 'Spell', cost: 5, text: 'ทำ 8 ดาเมจ ใส่ศัตรูสุ่ม 1 ตัว', color: 'bg-red-800', requiresTarget: false, _theme: 'jjk', isEvSukunaSpell: true, shopOnly: true },
        'Summon Mahoraga': { name: 'Summon Mahoraga', type: 'Spell', cost: 4, text: 'อัญเชิญ Mahoraga ลงสู่สนาม', color: 'bg-zinc-700', requiresTarget: false, _theme: 'jjk', isEvSukunaSpell: true, shopOnly: true }
    };
    if (typeof CardSets !== 'undefined') Object.assign(CardSets['jjk'], JJK_EVOLVED);

    // 2. เพิ่มสูตร Enhance
    if (typeof ENHANCE_RECIPES !== 'undefined') {
        Object.assign(ENHANCE_RECIPES, {
            'Gojo Satoru (Shibuya Station)': {
                baseCard: 'Gojo Satoru|jjk', materials:[{ name: 'Six Eye', theme: 'jjk', count: 6 }],
                gems: 30, coins: 10000, result: 'Gojo Satoru (Shibuya Station)|jjk'
            },
            'Ryomen Sukuna (Full Power)': {
                baseCard: 'Ryomen Sukuna|jjk', materials:[{ name: 'Sukuna Finger', theme: 'jjk', count: 20 }],
                gems: 30, coins: 10000, result: 'Ryomen Sukuna (Full Power)|jjk'
            }
        });
    }

    // 3. ระบบ True Damage (Sukuna FP) & Infinity (Gojo < 8)
    if (typeof window.hasTrueDamage === 'function') {
        const _origTrueDmg = window.hasTrueDamage;
        window.hasTrueDamage = function(card) {
            if ((card.originalName || card.name) === 'Ryomen Sukuna (Full Power)') return true;
            return _origTrueDmg(card);
        };
    }

    if (typeof window.initiateAttack === 'function') {
        const _origInitAtk_Ev = window.initiateAttack;
        window.initiateAttack = function(attackerId, targetId, targetIsBase) {
            if (!targetIsBase && typeof state !== 'undefined') {
                const target = state.players[state.currentTurn === 'player' ? 'ai' : 'player'].field.find(c => c.id === targetId);
                const attacker = state.players[state.currentTurn].field.find(c => c.id === attackerId);
                if (target && attacker && (target.originalName || target.name) === 'Gojo Satoru (Shibuya Station)' && !target.silenced && !attacker.domainGuaranteedHit) {
                    if (getCharStats(attacker).atk < 8) {
                        if (typeof log === 'function') log(`🌌 [Infinity] มุเก็นทำงาน! ATK < 8 โจมตีโกโจ(Evolved)ไม่เข้า!`, 'text-sky-300 font-bold');
                        attacker.attacksLeft--;
                        if (typeof updateUI === 'function') updateUI();
                        return;
                    }
                }
            }
            _origInitAtk_Ev.apply(this, arguments);
        };
    }

    // 4. ระบบการตาย (Gojo 50%)
    if (typeof window.checkDeath === 'function') {
        const _origCheckDeath_Ev = window.checkDeath;
        window.checkDeath = function(pk) {
            state.players[pk].field.forEach(c => {
                if (getCharStats(c).hp <= 0 && !c.isDyingProcessing && (c.originalName || c.name) === 'Gojo Satoru (Shibuya Station)' && !c._gojoEvRevived) {
                    if (Math.random() < 0.5) {
                        c.hp = c.maxHp; c.status = []; c._gojoEvRevived = true; c.isDyingProcessing = false;
                        if (typeof log === 'function') log(`🌌[Gojo] โย่ว! คืนชีพ 50% เลือดเต็ม!`, 'text-sky-300 font-bold');
                    }
                }
            });
            _origCheckDeath_Ev.apply(this, arguments);
        };
    }

    // 5. ระบบจบเทิร์น (เสกเวท + Unlimited Void)
    if (typeof window.resolveEndPhase === 'function') {
        const _origEndPhase_Ev = window.resolveEndPhase;
        window.resolveEndPhase = function(pk) {
            _origEndPhase_Ev.apply(this, arguments);
            const p = state.players[pk];
            p.field.forEach(c => {
                if (getCharStats(c).hp <= 0 || c.silenced) return;
                const effName = c.originalName || c.name;
                if (effName === 'Gojo Satoru (Shibuya Station)') {
                    const spells = ['Ao (Evolved)', 'Aka (Evolved)', 'Murasaki (Evolved)', 'Unlimited Void'];
                    const spellObj = _mkJJKToken(spells[(c.gojoTurn || 0) % 4], 'jjk');
                    if (spellObj) p.hand.push(spellObj);
                    c.gojoTurn = (c.gojoTurn || 0) + 1;
                    if (typeof log === 'function') log(`🌌 [Gojo] สานพลังไร้ขีดจำกัด! ได้รับเวทเข้ามือ`, 'text-sky-300 font-bold');
                }
                if (effName === 'Ryomen Sukuna (Full Power)') {
                    const skills = ['Cleave (Evolved)', 'Fuga', 'Malevolent Shrine', 'Summon Mahoraga'];
                    const spellObj = _mkJJKToken(skills[Math.floor(Math.random() * skills.length)], 'jjk');
                    if (spellObj) p.hand.push(spellObj);
                    if (typeof log === 'function') log(`🔥 [Sukuna] รวบรวมคำสาปแห่งราชันย์... ได้รับเวทเข้ามือ`, 'text-red-500 font-bold');
                }
            });

            // Unlimited Void Effect
            const field = state.sharedFieldCard;
            if (field && field.name === 'Unlimited Void' && state.sharedFieldCardOwner === pk && Math.random() < 0.5) {
                const oppKey = pk === 'player' ? 'ai' : 'player';
                const enemies = state.players[oppKey].field.filter(c => getCharStats(c).hp > 0);
                if (enemies.length > 0) {
                    const count = Math.floor(Math.random() * 5) + 1;
                    const targets = [...enemies].sort(() => Math.random() - 0.5).slice(0, count);
                    targets.forEach(t => {
                        if (!t.status.includes('Paralyze')) t.status.push('Paralyze');
                        t.paralyzeTurns = 4;
                    });
                    if (typeof log === 'function') log(`🌌 [Unlimited Void] ข้อมูลมหาศาลไหลเข้าสมอง! ศัตรู ${targets.length} ตัวติด Paralyze 2 เทิร์น!`, 'text-indigo-400 font-bold');
                }
            }
        };
    }

    // 6. ระบบใช้เวทมนตร์ (Execute Non Target)
    if (typeof window.executeNonTargetAction === 'function') {
        const _origExecNT_Ev = window.executeNonTargetAction;
        window.executeNonTargetAction = function(card, pk) {
            const eff = card.originalName || card.name;
            const p = state.players[pk];
            const oppKey = pk === 'player' ? 'ai' : 'player';
            const opp = state.players[oppKey];

            if (eff === 'Ao (Evolved)') {
                const enemies = opp.field.filter(c => getCharStats(c).hp > 0 && !c.isSpellImmune);
                [...enemies].sort(() => Math.random() - 0.5).slice(0, 2).forEach(t => {
                    t.hp -= 2;
                    if (!t.status.includes('Freeze')) t.status.push('Freeze');
                    t.freezeTurns = 4;
                });
                if (typeof log === 'function') log(`🔵 [Ao] ดึงดูดและบดขยี้! 2 ดาเมจ + แช่แข็ง 2 ตัว`, 'text-blue-500 font-bold');
                p.graveyard.push(card);
                if (typeof checkDeath === 'function') checkDeath(oppKey);
                return;
            }
            if (eff === 'Aka (Evolved)') {
                const enemies = opp.field.filter(c => getCharStats(c).hp > 0 && !c.isSpellImmune);
                [...enemies].sort(() => Math.random() - 0.5).slice(0, 3).forEach(t => t.hp -= 3);
                if (typeof log === 'function') log(`🔴 [Aka] ผลักไสและฉีกขาด! 3 ดาเมจ ใส่ศัตรู 3 ตัว`, 'text-red-500 font-bold');
                p.graveyard.push(card);
                if (typeof checkDeath === 'function') checkDeath(oppKey);
                return;
            }
            if (eff === 'Murasaki (Evolved)') {
                opp.field.forEach(t => { if (!t.isSpellImmune) t.hp = -99; });
                if (typeof log === 'function') log(`🟣 [Murasaki] ลบล้างมวลสารอย่างสมบูรณ์! ศัตรูทั้งหมดสูญสลาย!`, 'text-purple-600 font-bold');
                p.graveyard.push(card);
                if (typeof checkDeath === 'function') checkDeath(oppKey);
                return;
            }
            if (eff === 'Cleave (Evolved)') {
                const enemies = opp.field.filter(c => getCharStats(c).hp > 0 && !c.isSpellImmune);
                if (enemies.length > 0) {
                    const t = enemies[Math.floor(Math.random() * enemies.length)];
                    t.hp -= 8;
                    if (typeof log === 'function') log(`🔪 [Cleave] ตัดวิญญาณ! ${t.name} รับ 8 ดาเมจ!`, 'text-red-600 font-bold');
                    if (typeof checkDeath === 'function') checkDeath(oppKey);
                }
                p.graveyard.push(card);
                return;
            }
            if (eff === 'Summon Mahoraga') {
                if (p.field.length < (typeof getMaxFieldSlots === 'function' ? getMaxFieldSlots(pk) : 6)) {
                    const maho = typeof createCardInstance === 'function' ? createCardInstance('Mahoraga', 'jjk') : null;
                    if (maho) {
                        maho.attacksLeft = 1;
                        p.field.push(maho);
                        if (typeof log === 'function') log(`🛞 [Summon Mahoraga] อัญเชิญมโหราค!`, 'text-gray-300 font-bold');
                        if (typeof triggerOnSummon === 'function') triggerOnSummon(maho, pk);
                    }
                }
                p.graveyard.push(card);
                return;
            }
            _origExecNT_Ev.apply(this, arguments);
        };
    }

    function _mkJJKToken(name, theme) {
        const tpl = JJK_EVOLVED[name] || (typeof CardSets !== 'undefined' && CardSets[theme] ? CardSets[theme][name] : null);
        if (!tpl) return null;
        return {
            id: 'card_' + (cardIdCounter++), name: tpl.name, originalName: tpl.name,
            type: tpl.type, cost: tpl.cost, text: tpl.text, color: tpl.color, art: tpl.art || '',
            requiresTarget: tpl.requiresTarget || false, isUltimateField: tpl.isUltimateField || false,
            status: [], items: []
        };
    }
});
