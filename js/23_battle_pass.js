// ============================================================
// 23_battle_pass.js — Jujutsu Kaisen Season 1 (Extended Lv.40)
// ============================================================

const BP_CONFIG = {
    seasonName: "Jujutsu Kaisen: Cursed Clash",
    maxLevel: 50, // ขยายเป็น 50 เลเวล
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
        text: 'เลือกพันธมิตร 1 ตัวกางอาณาเขต การ์ดอื่นเด้งกลับมือ (เรา Cost 0, ศัตรู Cost+1) | เป้า +5/+5, ตีทะลุหลบ | ฆ่าสำเร็จ: Base ศัตรู -3, ทิ้งมือศัตรู 3 ใบ, อมตะเทิร์นถัดไป',
        color: 'bg-indigo-950', requiresTarget: true,
        art: 'https://file.garden/aeeLCXSsJxTPrRbp/file_00000000ab1871faae6dd625bf8c2452.png'
    },
    'Gojo Satoru': {
        name: 'Gojo Satoru', type: 'Character', cost: 10, atk: 2, hp: 6, maxHp: 6,
        text: 'Ongoing: ATK < 8 ทะลุมุเก็นไม่ได้ (DMG=0) | ตาย: 50% คืนชีพเต็ม | จบเทิร์น: เสก Ao→Aka→Murasaki ตามลำดับ',
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
    }
};

// ─── ข้อมูล Fern Value Pack ───
const FERN_EXPIRY = new Date('2026-04-26T00:00:00+07:00').getTime();

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

document.addEventListener('DOMContentLoaded', () => {
    // 1. ฉีดการ์ด JJK + Fern
    if (typeof CardSets !== 'undefined') {
        CardSets['jjk'] = JJK_CARDS_DATA;
        if (!CardSets['frieren_mage']) CardSets['frieren_mage'] = {};
        CardSets['frieren_mage']['Fern the Sniper'] = JSON.parse(JSON.stringify(FERN_CARDS_DATA['Fern the Sniper']));
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

    const isFernAvailable = Date.now() < FERN_EXPIRY;
    const fernBought = playerData.fernPackBought || false;
    const canBuyFern = isFernAvailable && !fernBought && (playerData.gems >= 30);

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
                if (enemies.length > 0) {
                    const chosenEnemy = enemies[Math.floor(Math.random() * enemies.length)];
                    // เด้งทุกตัวกลับมือ (เรา Cost 0, ศัตรู Cost+1)
                    for (let i = p.field.length - 1; i >= 0; i--) {
                        if (p.field[i].id !== targetChar.id) {
                            const c = p.field.splice(i, 1)[0];
                            c.costReducer = (c.cost || 0); // ทำให้ Cost = 0
                            p.hand.push(c);
                        }
                    }
                    for (let i = opp.field.length - 1; i >= 0; i--) {
                        if (opp.field[i].id !== chosenEnemy.id) {
                            const c = opp.field.splice(i, 1)[0];
                            c.costReducer = (c.costReducer || 0) - 1; // Cost +1
                            opp.hand.push(c);
                        }
                    }
                    targetChar.atk += 5; targetChar.hp += 5; targetChar.maxHp += 5;
                    targetChar.domainGuaranteedHit = true;
                    targetChar.domainActiveTurn = state.totalTurns;
                    if (typeof log === 'function') log(`🌌 [Domain Expansion] กางอาณาเขต! ${targetChar.name} vs ${chosenEnemy.name}!`, 'text-indigo-400 font-bold');
                } else {
                    if (typeof log === 'function') log(`🌌 [Domain Expansion] ล้มเหลว ไม่มีศัตรูให้ดึงเข้าอาณาเขต`, 'text-gray-500');
                }
                p.cost -= (typeof getActualCost === 'function' ? getActualCost(card, playerKey) : card.cost);
                p.hand.splice(p.hand.indexOf(card), 1);
                p.graveyard.push(card);
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

                // Gojo Infinity: ถ้า ATK < 8 โจมตีไม่เข้า (ยกเว้น domainGuaranteedHit)
                if (target && (target.originalName || target.name) === 'Gojo Satoru' && !target.silenced && !attacker.domainGuaranteedHit) {
                    const atkPow = getCharStats(attacker).atk;
                    if (atkPow < 8) {
                        if (typeof log === 'function') log(`🌌 [Infinity] มุเก็นทำงาน! ATK ${atkPow} < 8 โจมตีโกโจไม่เข้า!`, 'text-sky-300 font-bold');
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
            if (attacker && attacker.domainActiveTurn === state.totalTurns && target && getCharStats(target).hp <= 0) {
                state.players[defKey].hp = (state.players[defKey].hp || 20) - 3;
                const hand = state.players[defKey].hand;
                for (let i = 0; i < 3 && hand.length > 0; i++) {
                    const idx = Math.floor(Math.random() * hand.length);
                    state.players[defKey].graveyard.push(hand.splice(idx, 1)[0]);
                }
                attacker.immortalTurns = 2;
                if (typeof log === 'function') log(`🌌 [Domain Expansion] ฆ่าสำเร็จ! Base ศัตรู -3, ทิ้งมือ 3 ใบ, อมตะเทิร์นหน้า!`, 'text-indigo-400 font-bold');
                if (typeof checkWinCondition === 'function') checkWinCondition();
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