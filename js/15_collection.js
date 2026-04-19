// ============================================================
// 15_collection.js — Pack System, Collection, Ranks, Deck Builder
// ============================================================

// ─── CONSTANTS ──────────────────────────────────────────────────
const RARITY_CFG = {
    Common:    { label:'Common',    color:'#9ca3af', glow:'rgba(156,163,175,0.4)', border:'#6b7280', weight:60, emoji:'○' },
    Uncommon:  { label:'Uncommon',  color:'#4ade80', glow:'rgba(74,222,128,0.5)',  border:'#22c55e', weight:25, emoji:'◈' },
    Rare:      { label:'Rare',      color:'#60a5fa', glow:'rgba(96,165,250,0.7)',  border:'#3b82f6', weight:10, emoji:'◆' },
    Epic:      { label:'Epic',      color:'#c084fc', glow:'rgba(192,132,252,0.8)', border:'#a855f7', weight:4,  emoji:'✦' },
    Legendary: { label:'Legendary', color:'#fb923c', glow:'rgba(251,146,60,0.9)',  border:'#f97316', weight:1,  emoji:'★' },
};
const RARITY_ORDER = ['Common','Uncommon','Rare','Epic','Legendary'];

const RANKS_CFG = [
    { name:'Bronze',  emoji:'🥉', colorHex:'#cd7f32', rpMin:0,     rpMax:999,      coinWin:60,  rpGain:25, rpLoss:15 },
    { name:'Silver',  emoji:'🥈', colorHex:'#c0c0c0', rpMin:1000,  rpMax:2999,     coinWin:80,  rpGain:25, rpLoss:15 },
    { name:'Gold',    emoji:'🥇', colorHex:'#ffd700', rpMin:3000,  rpMax:5999,     coinWin:100, rpGain:25, rpLoss:15 },
    { name:'Diamond', emoji:'💎', colorHex:'#67e8f9', rpMin:6000,  rpMax:9999,     coinWin:150, rpGain:30, rpLoss:20 },
    { name:'Adam',    emoji:'⚡', colorHex:'#e879f9', rpMin:10000, rpMax:Infinity, coinWin:200, rpGain:35, rpLoss:20 },
];

const PACK_CFG = {
    standard: { name:'Standard Pack', cost:150, count:5, art:'🎴',
        desc:'5 การ์ดสุ่ม ทุกความหายาก',
        weights:{Common:60,Uncommon:25,Rare:10,Epic:4,Legendary:1}, guaranteed:null },
    premium:  { name:'Premium Pack',  cost:350, count:5, art:'⭐',
        desc:'มีการ์ด Rare ขึ้นไป 1 ใบ',
        weights:{Common:30,Uncommon:30,Rare:25,Epic:12,Legendary:3}, guaranteed:'Rare' },
    elite:    { name:'Elite Pack',    cost:900, count:5, art:'👑',
        desc:'มีการ์ด Epic ขึ้นไป 1 ใบ',
        weights:{Common:10,Uncommon:20,Rare:32,Epic:28,Legendary:10}, guaranteed:'Epic' },
    ready:    { name:'Ready-to-Play Pack', cost:7777, count:60, art:'🎮',
        desc:'60 การ์ดสุ่มจากทุก Set พร้อมเล่นทันที!',
        weights:{Common:50,Uncommon:28,Rare:14,Epic:6,Legendary:2}, guaranteed:null, allSets:true },
};

const SETS_META = {
    isekai_adventure: { label:'Isekai Adventure', emoji:'⚔️',  mascot:'Ainz Ooal Gown',   mascotArt:'https://files.catbox.moe/t06vc0.jpg' },
    animal_kingdom:   { label:'Animal Kingdom',   emoji:'🦁',  mascot:'Lion King of Forest',mascotArt:'https://upload.wikimedia.org/wikipedia/commons/thumb/7/73/Lion_waiting_in_Namibia.jpg/800px-Lion_waiting_in_Namibia.jpg' },
    humanity:         { label:'Humanity',         emoji:'🌍',  mascot:'Genghis Khan',       mascotArt:'https://upload.wikimedia.org/wikipedia/commons/thumb/e/ea/YuanEmperorAlbumGenghisPortrait.jpg/800px-YuanEmperorAlbumGenghisPortrait.jpg' },
    suankularb:       { label:'Suan Kularb',      emoji:'🏫',  mascot:'Pongneng',            mascotArt:'https://files.catbox.moe/rvzfo5.mp3' },
    space:            { label:'Space',            emoji:'🚀',  mascot:'Galax Dragon',        mascotArt:'https://images.unsplash.com/photo-1614730321146-b6fa6a46bcb4?w=800&q=80' },
    mythology:        { label:'Mythology',         emoji:'⚡',  mascot:'Zeus',                 mascotArt:'https://i.pinimg.com/1200x/11/4a/65/114a650cb062ffe6483a12057741508e.jpg' },
    toy_trooper:      { label:'Toy Trooper',        emoji:'🪖',  mascot:'Commander Rex',        mascotArt:'https://images.unsplash.com/photo-1558060370-d644479cb6f7?w=800&q=80' },
};

const SAVE_KEY = 'basebreak_v2_save';

// ─── CARD LORE ────────────────────────────────────────────────────
const CARD_LORE = {
    // ── Legendary ────────────────────────────────────────────────
    'Rimuru Tempest': {
        title: '★ ราชาปีศาจแห่ง Tempest',
        lore: 'สิ่งมีชีวิตที่ถูก Reincarnate ในร่าง Slime ผู้ทรงพลัง ผู้ก่อตั้งอาณาจักร Jura Tempest Federation ด้วยน้ำใจและปัญญา เขากลายเป็น Demon Lord ที่ปกครองด้วยความยุติธรรม รวมสายพันธุ์ต่างๆ ให้อยู่ร่วมกันอย่างสงบสุข และมีอำนาจที่เทียบเคียงได้กับเทพเจ้า'
    },
    'Ainz Ooal Gown': {
        title: '★ จอมมารแห่ง Nazarick',
        lore: 'Momonga ผู้เล่นมนุษย์ที่ถูกดูดเข้าสู่เกม YGGDRASIL ในร่างของ Overlord Skeleton ผู้ทรงพลัง เขาปกครอง Great Tomb of Nazarick ด้วยอำนาจสูงสุด มี NPC ผู้จงรักภักดีนับร้อย ค้นหาผู้เล่นคนอื่นและความลับของโลกใหม่ด้วยกลยุทธ์อันแยบยล'
    },
    'Genghis Khan': {
        title: '★ จักรพรรดิแห่งมองโกล',
        lore: 'เจงกีส ข่าน ผู้รวบรวมเผ่า Mongol และสร้างจักรวรรดิที่ใหญ่ที่สุดในประวัติศาสตร์มนุษยชาติ ตั้งแต่ทะเลแปซิฟิกจนถึงยุโรปตะวันออก ชนะศึกด้วยการทหารที่ไร้เทียมทานและยุทธวิธีม้าศึกที่เหนือกว่า พิชิตอาณาจักรกว่า 40 แห่ง'
    },
    'Alexander the great': {
        title: '★ ราชาผู้พิชิตโลก',
        lore: 'Alexander มหาราช กษัตริย์แห่ง Macedonia ผู้พิชิตอาณาจักรเปอร์เซีย อียิปต์ และอินเดีย ภายในระยะเวลาไม่ถึง 15 ปี สร้างอาณาจักรที่แผ่ขยายจาก Greece ถึง Punjab โดยไม่เคยพ่ายแพ้ในสนามรบเลยแม้แต่ครั้งเดียว'
    },
    'Julius Caesar': {
        title: '★ ผู้นำสาธารณรัฐโรม',
        lore: 'Julius Caesar นายพลและนักการเมืองผู้ยิ่งใหญ่แห่งโรม ผู้พิชิต Gaul และข้ามแม่น้ำ Rubicon เพื่อยึดอำนาจ ก่อนถูกลอบสังหารโดยผู้ร่วมงาน 23 บาดแผล แต่มรดกของเขาหล่อหลอมจักรวรรดิโรมันที่ยิ่งใหญ่ที่สุดในประวัติศาสตร์'
    },
    'Miyamoto Musashi': {
        title: '★ ดาบที่ไร้พ่าย',
        lore: 'Miyamoto Musashi นักดาบผู้ยิ่งใหญ่แห่งญี่ปุ่น เจ้าของ Two-Sword Style (Niten Ichi-ryū) ชนะดวลกว่า 60 ครั้งโดยไม่เคยพ่าย ผู้เขียน Book of Five Rings ซึ่งยังคงเป็นคัมภีร์กลยุทธ์ชั้นนำถึงปัจจุบัน ใช้ชีวิตวัยชราวาดรูปและประพันธ์บทกวี'
    },
    'Hiroshima Atomic Bombing': {
        title: '★ วันที่โลกเปลี่ยนไป',
        lore: '6 สิงหาคม 1945 สหรัฐฯ ทิ้งระเบิด Little Boy ที่ Hiroshima คร่าชีวิตกว่า 80,000 คนในทันที รัศมีความร้อน 4 กม. วัตถุที่อยู่ใกล้จุดระเบิดระเหยหายไปทันที เหตุการณ์นี้บังคับให้ญี่ปุ่นยอมแพ้ยุติสงครามโลกครั้งที่ 2 และเปิดยุคนิวเคลียร์'
    },
    'Theory of Relativity': {
        title: '★ สมการที่เปลี่ยนจักรวาล',
        lore: 'E = mc² สูตรที่ Einstein เสนอในปี 1905 เปลี่ยนความเข้าใจของมนุษย์ต่อจักรวาลอย่างสิ้นเชิง พิสูจน์ว่าเวลาและพื้นที่เป็นสิ่งสัมพัทธ์ และพลังงานกับมวลสารแปรเปลี่ยนกันได้ นำไปสู่การค้นพบพลังนิวเคลียร์และ GPS ในยุคปัจจุบัน'
    },
    'Blue Whale': {
        title: '★ เจ้าแห่งมหาสมุทร',
        lore: 'วาฬสีน้ำเงินเป็นสัตว์ที่ใหญ่ที่สุดที่เคยมีชีวิตอยู่บนโลก ยาวได้ถึง 33 เมตร หนักถึง 200 ตัน หัวใจใหญ่เท่ารถยนต์ เสียงร้องดังกว่าเครื่องยนต์ไอพ่นและได้ยินในระยะหลายร้อยกิโลเมตร เคยใกล้สูญพันธุ์จากการล่าปลาวาฬ ปัจจุบันได้รับการคุ้มครอง'
    },
    'Lion King of Forest': {
        title: '★ ราชาแห่งป่า',
        lore: 'สิงโตถูกขนานนามว่า "ราชาแห่งป่า" มาช้านาน สิงโตตัวผู้ปกครองฝูงด้วยพลังและเกียรติยศ เสียงคำรามดังได้ยินระยะ 8 กม. แต่สิงโตตัวเมียต่างหากที่เป็นนักล่าตัวจริง ทำงานเป็นทีมล้อมเหยื่อ ประสบความสำเร็จในการล่าถึง 30% ซึ่งสูงกว่าสัตว์ผู้ล่าส่วนใหญ่'
    },
    'Galax Dragon': {
        title: '★ มังกรแห่งจักรวาล',
        lore: 'Galax Dragon คือการรวมตัวของพลังจักรวาลที่ไม่มีที่สิ้นสุด เกิดจากการระเบิดของดาว Neutron Star สองดวงชนกัน ร่างกายประกอบด้วยพลาสมาและสสารมืด ปรากฏตัวเฉพาะในจุดที่แรงโน้มถ่วงของอวกาศบิดเบี้ยวจนเกือบพังทลาย'
    },
    'Skeleton King': {
        title: '★ ราชาแห่งความตาย',
        lore: 'เคยเป็นกษัตริย์ผู้ยิ่งใหญ่ที่ปกครองอาณาจักรอันรุ่งเรือง เมื่อสรรพสิ่งล่มสลายจากคำสาปนักมายากลชั่วร้าย วิญญาณของเขาถูกผูกติดกับกระดูก ตื่นขึ้นมาทุกครั้งที่โลกต้องการผู้พิทักษ์ความตาย กองทัพ Skeleton ของเขาเข้มแข็งขึ้นเรื่อยๆ ตามจำนวนผู้ล้มตาย'
    },
    'Goblin Lord': {
        title: '★ เจ้าแห่งเผ่า Goblin',
        lore: 'Goblin Lord เป็นหัวหน้าสูงสุดของเผ่า Goblin ที่รวบรวมกองทัพขนาดใหญ่ เขาเกิดมาในสนามรบ โตมาท่ามกลางเลือดและความรุนแรง ความน่ากลัวไม่ได้อยู่ที่ตัวเขาคนเดียว แต่คือความสามารถในการเรียกพวกพ้องมาช่วยไม่รู้จบสิ้น'
    },
    'Kim Dokja': {
        title: '★ ผู้อ่าน Omniscient',
        lore: 'Kim Dokja คือผู้อ่านคนเดียวที่อ่านนิยาย Three Ways to Survive in a Ruined World จนจบ และพบว่าโลกในนิยายกลายเป็นความจริง ความรู้ที่เขาสะสมมา 10 ปีกลายเป็นอาวุธที่ทรงพลังที่สุด เขาเดินทางเปลี่ยนชะตากรรมของโลกโดยเขียนตอนจบใหม่ด้วยชีวิตของตัวเอง'
    },
    'Sung Jin-Woo': {
        title: '★ Shadow Monarch',
        lore: 'Sung Jin-Woo เริ่มต้นในฐานะนักล่า E-Rank ที่อ่อนแอที่สุดในโลก หลังรอดชีวิตจาก Double Dungeon อย่างหวุดหวิด เขาได้รับระบบ Player ที่ทำให้เลเวลอัพได้ไม่มีขีดจำกัด กลายเป็น Shadow Monarch ผู้ควบคุมกองทัพวิญญาณและทรงพลังที่สุดในประวัติศาสตร์มนุษยชาติ'
    },
    'Emilia': {
        title: '★ เจ้าหญิงครึ่งเอลฟ์',
        lore: 'Emilia คือ Half-Elf ที่ถูกเข้าใจผิดเนื่องจากรูปร่างคล้าย Satella 魔女แห่งความโลภ เธอลงสมัครชิงบัลลังก์ด้วยใจบริสุทธิ์ ปรารถนาสร้างโลกที่ทุกชีวิตเท่าเทียมกัน Subaru คือคนเดียวที่ยืนหยัดเคียงข้างเธอแม้จะต้องตายซ้ำแล้วซ้ำเล่า'
    },
    'Maple': {
        title: '★ โล่ที่ไม่อาจทำลาย',
        lore: 'Maple เข้าเล่น VRMMORPG NewWorld Online โดยทุ่มสถานะทั้งหมดใส่ VIT-ความอดทน กลายเป็นตัวละครแทบทำลายไม่ได้แต่เดินช้ามาก ด้วยสไตล์เล่นที่แปลกประหลาด เธอค้นพบ Skill ลับที่ผู้พัฒนาเกมไม่คาดคิดว่าจะมีใครปลดล็อก จนกลายเป็นตำนานของเซิร์ฟเวอร์'
    },
    'Explosion': {
        title: '★ เวทมนตร์ที่ Megumin รัก',
        lore: 'Explosion เป็นเวทมนตร์ขั้นสูงสุดในโลก KonoSuba ที่ Megumin ฝึกมาตั้งแต่เด็ก เธอทุ่มสกิลพ้อยทั้งหมดให้เวทนี้จนไม่สามารถใช้เวทอื่นได้เลย แต่ Explosion เดียวสามารถทำลายปราสาทได้ทั้งหลัง ข้อเสียคือหลังใช้แล้วเธอหมดแรงนอนไม่ได้เป็นวันๆ'
    },
    'Reinhard': {
        title: '★ อัศวินดาบศักดิ์สิทธิ์',
        lore: 'Reinhard van Astrea คือ Divine Protection Knight ที่ทรงพลังที่สุดแห่งอาณาจักร Lugunica ได้รับพรจากเทพเจ้ามากกว่าใครในโลก ทั้งพลังกาย การรักษา และโชค เขาเป็นที่รู้จักในนาม "สุดยอดอัศวินแห่งยุค" แม้จะมีจิตใจอ่อนโยนอย่างเหลือเชื่อ'
    },
    // ── Champion ─────────────────────────────────────────────────
    'Altair': {
        title: '♛ แชมเปี้ยนแห่ง Isekai',
        lore: 'Altair คือนักรบตำนานที่ข้ามผ่านโลก Isekai มาหลายยุคหลายสมัย ทุกครั้งที่ล้มตาย เขาฟื้นกลับมาแข็งแกร่งกว่าเดิม สะสมประสบการณ์และภูมิคุ้มกันจากทุกผู้ที่เคยปราบเขา เป็นการ์ดที่หาได้ยากที่สุดในเกม — ปลดล็อคได้เพียงการสะสมการ์ด Isekai ครบ 40 ชนิดเท่านั้น'
    },
    // ── Epic ─────────────────────────────────────────────────────
    'Ainz Ooal Gown': {
        title: '★ จอมมารแห่ง Nazarick',
        lore: 'Momonga ผู้เล่นมนุษย์ที่ถูกดูดเข้าสู่โลก YGGDRASIL ในร่าง Overlord Skeleton ผู้ทรงพลัง ปกครอง Great Tomb of Nazarick ด้วยอำนาจสูงสุดและ NPC ผู้จงรักภักดีนับร้อย'
    },
    'Leonidas I': {
        title: '✦ ราชาแห่งสปาร์ตา',
        lore: 'Leonidas I กษัตริย์สปาร์ตาผู้นำทหาร 300 นายถือคืนช่อง Thermopylae ต่อกองทัพเปอร์เซียนับล้าน เป็นเวลา 3 วัน ความเสียสละของพวกเขาเป็นแรงบันดาลใจให้กรีซรวมตัวและพิชิตเปอร์เซียในที่สุด คำพูดสุดท้ายของเขาคือ "MOLON LABE — จงมาเอาเองถ้ากล้า!"'
    },
    'Vlad': {
        title: '✦ เจ้าชายแห่งความมืด',
        lore: 'Vlad III Dracula หรือ Vlad the Impaler เจ้าเมือง Wallachia ในคริสต์ศตวรรษที่ 15 ขึ้นชื่อว่าปักศัตรูด้วยหลักแหลม เพื่อสร้างความหวาดกลัว แต่ก็ได้รับการยกย่องในฐานะผู้ปกป้องชาติจากการรุกรานของออตโตมัน ตำนานของเขาเป็นต้นแบบของ Dracula'
    },
    'Oppenheimer': {
        title: '✦ บิดาแห่งระเบิดปรมาณู',
        lore: 'J. Robert Oppenheimer นักฟิสิกส์ชาวอเมริกันผู้นำโครงการ Manhattan Project สร้างระเบิดนิวเคลียร์ลูกแรกของโลก ขณะเห็นการระเบิดที่ Trinity Test เขากล่าวอ้าง Bhagavad Gita ว่า "Now I am become Death, the destroyer of worlds"'
    },
    'Nikola Tesla': {
        title: '✦ อัจฉริยะแห่งกระแสไฟฟ้า',
        lore: 'Nikola Tesla นักประดิษฐ์เซอร์เบีย-อเมริกัน ผู้คิดค้นระบบไฟฟ้ากระแสสลับ (AC) ที่ใช้กันทั่วโลกจนถึงปัจจุบัน แข่งขันกับ Edison ในสงครามกระแสไฟฟ้า พัฒนา Tesla Coil, Radio, และ X-Ray แต่เสียชีวิตในความยากจนโดยไม่ได้รับการยอมรับในยุคนั้น'
    },
    'Albert Einstein': {
        title: '✦ อัจฉริยะแห่งศตวรรษ',
        lore: 'Albert Einstein นักฟิสิกส์ชาวเยอรมัน-สวิส ผู้เสนอทฤษฎีสัมพัทธภาพพิเศษและสัมพัทธภาพทั่วไป รวมถึงสมการ E=mc² ได้รับรางวัล Nobel Physics 1921 สำหรับการค้นพบ Photoelectric Effect ที่นำไปสู่กลศาสตร์ควอนตัม'
    },
    'Simo Häyhä': {
        title: '✦ มือปืนที่น่ากลัวที่สุดในประวัติศาสตร์',
        lore: 'Simo Häyhä หรือ "White Death" ทหารฟินแลนด์ในสงคราม Winter War ปี 1939-1940 ยิงศัตรูได้ถึง 505 คนโดยใช้เพียง rifle ธรรมดา ไม่มีกล้อง Sniper ในอุณหภูมิ -40°C ทำให้กองทัพโซเวียตเสนอรางวัลสำหรับผู้ที่สามารถสังหารเขาได้'
    },
    'Anutin': {
        title: '✦ นักการเมืองผู้ทรงพลัง',
        lore: 'อนุทิน ชาญวีรกูล นักการเมืองชาวไทย หัวหน้าพรรคภูมิใจไทย อดีตรองนายกรัฐมนตรีและรัฐมนตรีว่าการกระทรวงสาธารณสุข ผู้มีบทบาทสำคัญในการจัดการวิกฤต COVID-19 ของประเทศไทย เป็นที่รู้จักจากการพูดตรงๆ และสไตล์ผู้นำที่เด็ดขาด'
    }
};

// ─── COLLECTION MILESTONES ────────────────────────────────────────
const COLLECTION_MILESTONES = [
    { count: 10,  reward: 100,   emoji: '🥉', label: 'Novice Collector' },
    { count: 20,  reward: 200,   emoji: '🥈', label: 'Apprentice' },
    { count: 30,  reward: 300,   emoji: '🥇', label: 'Collector' },
    { count: 40,  reward: 500,   emoji: '💎', label: 'Expert Collector' },
    { count: 50,  reward: 1000,  emoji: '👑', label: 'Master Collector' },
    { count: 60,  reward: 1000,  emoji: '✨', label: 'Grand Master' },
    { count: 70,  reward: 1500,  emoji: '🌟', label: 'Elite Collector' },
    { count: 80,  reward: 2000,  emoji: '🔥', label: 'Legendary Collector' },
    { count: 90,  reward: 3000,  emoji: '⚡', label: 'Mythic Collector' },
    { count: 100, reward: 5000,  emoji: '♛',  label: 'Ultimate Collector' },
];

// isekai unique-card count สำหรับ unlock Altair
const ALTAIR_UNLOCK_ISEKAI_COUNT = 40;

// ─── PLAYER DATA ─────────────────────────────────────────────────
let playerData;

function defaultPlayerData() {
    return { coins:800, rp:0, collection:{}, decks:[], wins:0, losses:0, totalGames:0,
             firstWinDate:null, activeDecks:{},
             claimedMilestones: [],
             altairUnlocked: false,
             altairCostBonus: 0,
             altairImmuneAtk: 0,
             altairImmuneCost: 0 };
}
function loadPlayerData() {
    try { const r = localStorage.getItem(SAVE_KEY); if(r) {
        const d = JSON.parse(r);
        // backward-compat: inject new fields if missing
        if (!d.claimedMilestones) d.claimedMilestones = [];
        if (d.altairUnlocked === undefined) d.altairUnlocked = false;
        if (d.altairCostBonus === undefined) d.altairCostBonus = 0;
        if (d.altairImmuneAtk === undefined) d.altairImmuneAtk = 0;
        if (d.altairImmuneCost === undefined) d.altairImmuneCost = 0;
        // Repair: altairUnlocked but card somehow missing from collection
        if (d.altairUnlocked && !(d.collection['Altair|isekai_adventure'] > 0)) {
            d.collection['Altair|isekai_adventure'] = 1;
        }
        return d;
    } } catch(e){}
    return defaultPlayerData();
}
function saveData() { try { localStorage.setItem(SAVE_KEY, JSON.stringify(playerData)); } catch(e){} }

playerData = loadPlayerData();

// ─── RARITY HELPERS ──────────────────────────────────────────────
const LEGENDARY_SET = new Set([
    'Rimuru Tempest','Ainz Ooal Gown','Goal of All Life is Death','Reinhard',
    'Goblin Lord','Kim Dokja','Sung Jin-Woo','Emilia','Maple','Explosion',
    'Miyamoto Musashi','Genghis Khan','Alexander the great','Julius Caesar',
    'Hiroshima Atomic Bombing','Theory of Relativity','Blue Whale',
    'Lion King of Forest','Galax Dragon','Skeleton King',
]);
const EPIC_SET = new Set([
    'Aqua','Shadow','Death Knight','Shalltear','Arthur Leywin','Kumoko',
    'Kazuma Satou','Celestia Yupitalia','Skull Devourer','Oppenheimer',
    'Nikola Tesla','Albert Einstein','Vlad','Leonidas I','Bayinnaung',
    'Simo Häyhä','Silverback Gorilla','Komodo Dragon','Grizzly Bear',
    'Polar Bear','Anaconda','Tiger','B-2 Spirit',"Genie's Lamp",'F-35',
    'Kirito','Asuna','Seyya','Subaru',
]);

function getCardRarity(name, data) {
    if (LEGENDARY_SET.has(name)) return 'Legendary';
    if (EPIC_SET.has(name)) return 'Epic';
    const cost = data?.cost ?? 0;
    if (cost >= 9) return 'Epic';
    if (cost >= 7) return 'Rare';
    if (cost >= 4) return 'Uncommon';
    return 'Common';
}

function getRankInfo(rp) {
    for (let i = RANKS_CFG.length-1; i >= 0; i--)
        if (rp >= RANKS_CFG[i].rpMin) return RANKS_CFG[i];
    return RANKS_CFG[0];
}
function getRankProgress(rp) {
    const rank = getRankInfo(rp);
    if (rank.rpMax === Infinity) return 100;
    return Math.min(100, Math.round((rp - rank.rpMin) / (rank.rpMax - rank.rpMin+1) * 100));
}

// ─── PACK OPENING ────────────────────────────────────────────────
function rollRarity(weights, guaranteedMin) {
    if (guaranteedMin) {
        const minIdx = RARITY_ORDER.indexOf(guaranteedMin);
        const eligible = {};
        let tot = 0;
        RARITY_ORDER.forEach((r,i) => { if(i>=minIdx){ eligible[r]=weights[r]||1; tot+=eligible[r]; } });
        let roll = Math.random()*tot;
        for(const [r,w] of Object.entries(eligible)){ roll-=w; if(roll<=0) return r; }
        return RARITY_ORDER[RARITY_ORDER.length-1];
    }
    let tot = Object.values(weights).reduce((a,b)=>a+b,0);
    let roll = Math.random()*tot;
    for(const [r,w] of Object.entries(weights)){ roll-=w; if(roll<=0) return r; }
    return 'Common';
}

function getSetCardPool(setName) {
    const cards = (typeof CardSets !== 'undefined') ? CardSets[setName] : {};
    if (!cards) return [];
    return Object.entries(cards)
        .filter(([, data]) => !data.isChampion)  // ไม่รวม Champion cards ในแพ็คปกติ
        .map(([name, data]) => ({
            name, data, rarity: getCardRarity(name, data), theme: setName
        }));
}

function openPack(packType, setName) {
    const cfg = PACK_CFG[packType];
    if (!cfg) return { error:'Unknown pack type' };
    if (playerData.coins < cfg.cost) return { error:'เหรียญไม่พอ!' };

    playerData.coins -= cfg.cost;
    const pool = getSetCardPool(setName);
    if (pool.length === 0) return { error:'ไม่มีการ์ดในเซต' };

    const result = [];
    for (let i = 0; i < cfg.count; i++) {
        const useGuaranteed = cfg.guaranteed && i === 0;
        const targetRarity = rollRarity(cfg.weights, useGuaranteed ? cfg.guaranteed : null);
        let candidates = pool.filter(c => c.rarity === targetRarity);
        if (!candidates.length) {
            // Fallback to any rarity
            for (const r of [...RARITY_ORDER].reverse()) {
                candidates = pool.filter(c => c.rarity === r);
                if (candidates.length) break;
            }
        }
        const card = candidates[Math.floor(Math.random() * candidates.length)];
        result.push(card);
        const key = `${card.name}|${setName}`;
        playerData.collection[key] = (playerData.collection[key] || 0) + 1;
    }
    saveData();
    return { cards: result };
}

// ─── READY-TO-PLAY PACK (60 ใบ ทุก Set) ────────────────────────────
function openReadyPack() {
    const cfg = PACK_CFG.ready;
    if (playerData.coins < cfg.cost) { showToast('เหรียญไม่พอ! ต้องการ 🪙 7,777', '#f87171'); return; }
    playerData.coins -= cfg.cost;

    // รวม pool จากทุก Set ที่มีการ์ด
    const allPool = [];
    if (typeof CardSets !== 'undefined') {
        Object.entries(CardSets).forEach(([setName, cards]) => {
            if (!cards || Object.keys(cards).length === 0) return;
            Object.entries(cards).forEach(([name, data]) => {
                if (!data.isChampion) {
                    allPool.push({ name, data, rarity: getCardRarity(name, data), theme: setName });
                }
            });
        });
    }
    if (allPool.length === 0) { showToast('ไม่มีการ์ด', '#f87171'); return; }

    const result = [];
    for (let i = 0; i < cfg.count; i++) {
        const useGuaranteed = cfg.guaranteed && i === 0;
        const targetRarity = rollRarity(cfg.weights, useGuaranteed ? cfg.guaranteed : null);
        let candidates = allPool.filter(c => c.rarity === targetRarity);
        if (!candidates.length) {
            for (const r of [...RARITY_ORDER].reverse()) {
                candidates = allPool.filter(c => c.rarity === r);
                if (candidates.length) break;
            }
        }
        const card = candidates[Math.floor(Math.random() * candidates.length)];
        result.push(card);
        const key = `${card.name}|${card.theme}`;
        playerData.collection[key] = (playerData.collection[key] || 0) + 1;
    }
    saveData();

    // แสดง modal สรุป (ไม่ flip ทีละใบ เพราะ 60 ใบ)
    showReadyPackSummary(result);
    updateHubUI();
    setTimeout(() => checkCollectionMilestones(), 3200);
}

function showReadyPackSummary(cards) {
    const rarityCount = {};
    cards.forEach(c => { rarityCount[c.rarity] = (rarityCount[c.rarity] || 0) + 1; });
    const highlight = cards.filter(c => c.rarity === 'Legendary' || c.rarity === 'Epic')
        .slice(0, 12);
    const overlay = document.createElement('div');
    overlay.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,0.92);z-index:9000;display:flex;align-items:center;justify-content:center;animation:fadeIn 0.3s ease';
    overlay.innerHTML = `
    <div style="background:linear-gradient(135deg,#0f0c29,#1a1640,#302b63);border:3px solid #7c3aed;border-radius:24px;padding:28px 24px;max-width:520px;width:92%;text-align:center;box-shadow:0 0 80px rgba(124,58,237,0.5);max-height:90vh;overflow-y:auto">
      <div style="font-size:2.5rem;margin-bottom:4px">🎮</div>
      <div style="font-size:1.4rem;font-weight:900;color:#a78bfa;margin-bottom:4px">Ready-to-Play Pack!</div>
      <div style="font-size:0.8rem;color:#9ca3af;margin-bottom:16px">60 การ์ดจากทุก Set ถูกเพิ่มเข้า Collection ของคุณแล้ว</div>
      <div style="display:flex;flex-wrap:wrap;gap:8px;justify-content:center;margin-bottom:16px">
        ${RARITY_ORDER.filter(r=>rarityCount[r]).reverse().map(r=>{
            const cfg = RARITY_CFG[r];
            return `<div style="background:#1f2937;border:1px solid ${cfg.border};border-radius:10px;padding:6px 14px;font-size:0.85rem;font-weight:700;color:${cfg.color}">${cfg.emoji} ${r}: <strong>${rarityCount[r]}</strong></div>`;
        }).join('')}
      </div>
      ${highlight.length>0?`
      <div style="font-size:0.75rem;color:#fbbf24;font-weight:700;margin-bottom:8px">✨ การ์ดหายากที่ได้รับ</div>
      <div style="display:flex;flex-wrap:wrap;gap:6px;justify-content:center;margin-bottom:16px">
        ${highlight.map(c=>{
            const r=RARITY_CFG[c.rarity];
            return `<div style="width:68px;border-radius:8px;overflow:hidden;border:2px solid ${r.border};background:#111827">
              ${c.data?.art?`<img src="${c.data.art}" style="width:100%;height:50px;object-fit:cover">`:`<div style="width:100%;height:50px;background:#374151;display:flex;align-items:center;justify-content:center">🃏</div>`}
              <div style="padding:2px 3px;font-size:0.5rem;font-weight:800;color:${r.color};text-align:center;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${c.name}</div>
            </div>`;
        }).join('')}
      </div>`:''}
      <button onclick="this.closest('div[style*=fixed]').remove();renderPacksPanel()"
        style="background:linear-gradient(135deg,#7c3aed,#4f46e5);color:white;border:none;padding:12px 32px;border-radius:14px;font-weight:900;font-size:1rem;cursor:pointer;box-shadow:0 0 20px rgba(124,58,237,0.5)">
        🎉 ยอดเยี่ยม!
      </button>
    </div>`;
    document.body.appendChild(overlay);
}

// ─── ANUTIN PACK (10,000 coins → Anutin + Bull ทันที) ──────────────
function buyAnutinPack() {
    const COST = 10000;
    if (playerData.coins < COST) { showToast(`เหรียญไม่พอ! ต้องการ 🪙 10,000`, '#f87171'); return; }
    playerData.coins -= COST;
    playerData.collection['Anutin|animal_kingdom'] = (playerData.collection['Anutin|animal_kingdom'] || 0) + 1;
    playerData.collection['Bull|animal_kingdom'] = (playerData.collection['Bull|animal_kingdom'] || 0) + 1;
    saveData();
    updateHubUI();

    const overlay = document.createElement('div');
    overlay.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,0.92);z-index:9000;display:flex;align-items:center;justify-content:center;animation:fadeIn 0.3s ease';
    overlay.innerHTML = `
    <div style="background:linear-gradient(135deg,#064e3b,#065f46,#0f172a);border:3px solid #10b981;border-radius:24px;padding:32px 24px;max-width:400px;width:90%;text-align:center;box-shadow:0 0 80px rgba(16,185,129,0.6)">
      <div style="font-size:2.5rem;margin-bottom:8px">🌿</div>
      <div style="font-size:1.4rem;font-weight:900;color:#34d399;margin-bottom:4px">Anutin Pack!</div>
      <div style="font-size:0.8rem;color:#6ee7b7;margin-bottom:20px">การ์ดถูกเพิ่มเข้า Collection ของคุณแล้ว!</div>
      <div style="display:flex;gap:16px;justify-content:center;margin-bottom:20px">
        <div style="text-align:center">
          <div style="width:90px;height:130px;border-radius:12px;overflow:hidden;border:3px solid #10b981;box-shadow:0 0 20px rgba(16,185,129,0.5);margin:0 auto 6px">
            <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/9/96/Anutin_Charnvirakul_2022.jpg/220px-Anutin_Charnvirakul_2022.jpg" style="width:100%;height:75%;object-fit:cover" onerror="this.style.display='none'">
            <div style="background:#065f46;padding:4px;font-size:0.65rem;font-weight:900;color:#34d399">Anutin</div>
            <div style="background:#065f46;padding:2px;font-size:0.55rem;color:#6ee7b7">✦ Epic • Cost 10</div>
          </div>
          <div style="font-size:0.75rem;color:#34d399;font-weight:700">✅ ได้รับแล้ว!</div>
        </div>
        <div style="text-align:center">
          <div style="width:90px;height:130px;border-radius:12px;overflow:hidden;border:3px solid #f97316;box-shadow:0 0 20px rgba(249,115,22,0.5);margin:0 auto 6px">
            <img src="https://cdn.displate.com/artwork/270x380/2025-07-13/39c31ad0-f6e3-4a67-a843-edb90389d11d.jpg" style="width:100%;height:75%;object-fit:cover" onerror="this.style.display='none'">
            <div style="background:#7c2d12;padding:4px;font-size:0.65rem;font-weight:900;color:#fb923c">Bull</div>
            <div style="background:#7c2d12;padding:2px;font-size:0.55rem;color:#fed7aa">◈ Uncommon • Cost 6</div>
          </div>
          <div style="font-size:0.75rem;color:#fb923c;font-weight:700">✅ ได้รับแล้ว!</div>
        </div>
      </div>
      <div style="background:rgba(16,185,129,0.15);border:1px solid #10b981;border-radius:10px;padding:10px;margin-bottom:16px;font-size:0.75rem;color:#6ee7b7">
        💡 Anutin ในสนาม + ชนะ Ranked → <strong style="color:#fbbf24">+500🪙 โบนัส!</strong>
      </div>
      <button onclick="this.closest('div[style*=fixed]').remove();renderPacksPanel()"
        style="background:linear-gradient(135deg,#059669,#047857);color:white;border:none;padding:12px 32px;border-radius:14px;font-weight:900;font-size:1rem;cursor:pointer;box-shadow:0 0 20px rgba(5,150,105,0.5)">
        🌿 ยอดเยี่ยม!
      </button>
    </div>`;
    document.body.appendChild(overlay);
    setTimeout(() => checkCollectionMilestones(), 500);
}

// ─── SELL CARD ───────────────────────────────────────────────────
function sellCard(name, theme) {
    const key = `${name}|${theme}`;
    const count = playerData.collection[key] || 0;
    if (count <= 0) { showToast('ไม่มีการ์ดนี้', '#f87171'); return; }
    // ป้องกันขาย Champion ที่มีแค่ 1 ใบ
    const data = (typeof CardSets !== 'undefined') ? (CardSets[theme] || {})[name] : null;
    if (data?.isChampion && count <= 1) { showToast('♛ Champion ขายไม่ได้ถ้ามีแค่ 1 ใบ!', '#fbbf24'); return; }
    if (!confirm(`ขาย ${name} 1 ใบ รับ 🪙 50 ?`)) return;
    playerData.collection[key]--;
    if (playerData.collection[key] <= 0) delete playerData.collection[key];
    playerData.coins += 50;
    saveData();
    updateHubUI();
    showToast(`💰 ขาย ${name} ได้ +50 🪙`, '#fbbf24');
    renderCollectionPanel();
}
function awardWin() {
    const rank = getRankInfo(playerData.rp);
    const coins = rank.coinWin;
    const rp = rank.rpGain;
    playerData.coins += coins;
    playerData.rp += rp;
    playerData.wins++;
    playerData.totalGames++;

    // Anutin Ranked Bonus: ถ้ามี Anutin ในคอลเลคชัน + เกม Ranked → +500 coins
    let anutinBonus = 0;
    const isRanked = (typeof _isRankedGame !== 'undefined' && _isRankedGame);
    if (isRanked) {
        const hasAnutin = Object.keys(playerData.collection).some(
            k => k.startsWith('Anutin|') && playerData.collection[k] > 0
        );
        if (hasAnutin) {
            anutinBonus = 500;
            playerData.coins += anutinBonus;
        }
    }

    saveData();
    return { coins, rp, anutinBonus };
}
function awardLoss() {
    const rank = getRankInfo(playerData.rp);
    playerData.rp = Math.max(0, playerData.rp - rank.rpLoss);
    playerData.losses++;
    playerData.totalGames++;
    saveData();
    return { rpLoss: rank.rpLoss };
}

// ─── COLLECTION MILESTONE CHECK ──────────────────────────────────
function checkCollectionMilestones() {
    if (!playerData.claimedMilestones) playerData.claimedMilestones = [];
    const uniqueCount = Object.keys(playerData.collection).filter(k => playerData.collection[k] > 0).length;
    const newRewards = [];

    COLLECTION_MILESTONES.forEach(m => {
        if (uniqueCount >= m.count && !playerData.claimedMilestones.includes(m.count)) {
            playerData.claimedMilestones.push(m.count);
            playerData.coins += m.reward;
            newRewards.push(m);
        }
    });

    // ── Altair unlock: สะสมการ์ด isekai_adventure ครบ 40 ชนิด ──
    if (!playerData.altairUnlocked) {
        const isekaiUnique = Object.keys(playerData.collection).filter(k => {
            const [, theme] = k.split('|');
            return theme === 'isekai_adventure' && playerData.collection[k] > 0 && !k.startsWith('Altair|');
        }).length;
        if (isekaiUnique >= ALTAIR_UNLOCK_ISEKAI_COUNT) {
            playerData.altairUnlocked = true;
            playerData.collection['Altair|isekai_adventure'] = (playerData.collection['Altair|isekai_adventure'] || 0) + 1;
            newRewards.push({ isAltair: true, emoji: '♛', label: 'Altair — Champion of Isekai', count: ALTAIR_UNLOCK_ISEKAI_COUNT });
        }
    }

    if (newRewards.length > 0) {
        saveData();
        showMilestonePopup(newRewards);
    }
    return newRewards;
}

function showMilestonePopup(rewards) {
    const overlay = document.createElement('div');
    overlay.style.cssText = `position:fixed;inset:0;background:rgba(0,0,0,0.85);z-index:10000;display:flex;align-items:center;justify-content:center;animation:fadeIn 0.3s ease`;
    overlay.innerHTML = `
    <div style="background:linear-gradient(135deg,#0f0c29,#302b63,#24243e);border:3px solid #fbbf24;border-radius:24px;padding:32px;max-width:480px;width:90%;text-align:center;box-shadow:0 0 80px rgba(251,191,36,0.5)">
      <div style="font-size:3rem;margin-bottom:8px">🎉</div>
      <div style="font-size:1.5rem;font-weight:900;color:#fbbf24;margin-bottom:16px">Collection Milestone!</div>
      ${rewards.map(m => m.isAltair ? `
        <div style="background:linear-gradient(135deg,#3d2600,#7c4a00);border:2px solid #f59e0b;border-radius:16px;padding:20px;margin:12px 0;box-shadow:0 0 30px rgba(245,158,11,0.6)">
          <div style="font-size:2.5rem">♛</div>
          <div style="font-size:1.1rem;font-weight:900;color:#fbbf24;margin:8px 0">การ์ด Altair ปลดล็อคแล้ว!</div>
          <div style="font-size:0.85rem;color:#fcd34d">สะสม Isekai ครบ ${ALTAIR_UNLOCK_ISEKAI_COUNT} ชนิด</div>
          <div style="margin-top:8px;font-size:0.8rem;color:#fde68a">Altair — Champion of Isekai ถูกเพิ่มใน Collection ของคุณแล้ว!</div>
          <div style="margin-top:4px;font-size:0.75rem;color:#fed7aa">♛ มีได้แค่ 1 ใบในเด็ค | Cost เริ่มต้น 12 (ลดสะสมได้)</div>
        </div>
      ` : `
        <div style="background:#1f2937;border:1px solid #374151;border-radius:12px;padding:16px;margin:8px 0;display:flex;align-items:center;gap:12px">
          <div style="font-size:2rem">${m.emoji}</div>
          <div style="text-align:left;flex:1">
            <div style="font-weight:800;color:white;font-size:0.9rem">${m.label}</div>
            <div style="font-size:0.75rem;color:#9ca3af">สะสมครบ ${m.count} ชนิดการ์ด</div>
          </div>
          <div style="font-size:1.1rem;font-weight:900;color:#fbbf24">+${m.reward.toLocaleString()} 🪙</div>
        </div>
      `).join('')}
      <button onclick="this.closest('div[style*=fixed]').remove();updateHubUI()"
        style="margin-top:20px;background:linear-gradient(135deg,#d97706,#92400e);color:white;border:none;padding:12px 32px;border-radius:14px;font-weight:900;font-size:1rem;cursor:pointer;box-shadow:0 0 20px rgba(217,119,6,0.5)">
        รับรางวัล! 🎁
      </button>
    </div>`;
    document.body.appendChild(overlay);
}

// ─── DECK MANAGEMENT ─────────────────────────────────────────────
const DECK_MIN = 60, DECK_MAX = 65, MAX_COPIES = 3;

function getCollectionCards() {
    // Returns all cards in collection as {name, theme, count, data, rarity}
    return Object.entries(playerData.collection)
        .filter(([,count]) => count > 0)
        .map(([key, count]) => {
            const [name, theme] = key.split('|');
            const data = (typeof CardSets!=='undefined') ? (CardSets[theme]||{})[name] : null;
            return { name, theme, count, data, rarity: getCardRarity(name, data), key };
        });
}

// ─── DECK HELPERS ────────────────────────────────────────────────
// Backward-compat: old decks have cards:string[], new have cards:{name,theme}[]
function normalizeDeckCards(deck) {
    return (deck.cards || []).map(c =>
        typeof c === 'string' ? { name: c, theme: deck.theme || 'isekai_adventure' } : c
    );
}

function saveDeck(name, cards) {
    if (cards.length < DECK_MIN || cards.length > DECK_MAX)
        return { error:`เด็คต้องมีการ์ด ${DECK_MIN}-${DECK_MAX} ใบ` };
    const id = 'deck_' + Date.now();
    const deck = { id, name, cards, isActive: false };
    playerData.decks.push(deck);
    saveData();
    return { ok: true, deck };
}

function setActiveDeck(deckId) {
    playerData.decks.forEach(d => d.isActive = (d.id === deckId));
    saveData();
}

function deleteDeck(deckId) {
    playerData.decks = playerData.decks.filter(d => d.id !== deckId);
    saveData();
}

function getActiveDeck() {
    return playerData.decks.find(d => d.isActive) || null;
}

// ─── GAME INTEGRATION ────────────────────────────────────────────
let _pendingCollectionDeck = null;
let _isRankedGame = false;
let _collectionDeckUsed = false;

// Patch buildDeck to intercept player deck building
document.addEventListener('DOMContentLoaded', function() {
    if (typeof buildDeck === 'undefined') return;
    const _origBuildDeck = buildDeck;
    buildDeck = function(theme) {
        if (_pendingCollectionDeck && !_collectionDeckUsed) {
            _collectionDeckUsed = true;
            // Build from collection
            const deck = [];
            _pendingCollectionDeck.forEach(({name, theme: t}) => {
                if (typeof createCardInstance !== 'undefined') {
                    const inst = createCardInstance(name, t);
                    if (inst) deck.push(inst);
                }
            });
            return deck.sort(() => Math.random() - 0.5);
        }
        if (_collectionDeckUsed) {
            _pendingCollectionDeck = null;
            _collectionDeckUsed = false;
        }
        return _origBuildDeck.call(this, theme);
    };
    
    // Hook endGame for rewards
    if (typeof endGame !== 'undefined') {
        const _origEndGame = endGame;
        endGame = function(winner) {
            _origEndGame(winner);
            if (_isRankedGame) {
                const isPlayerWin = (winner === 'player');
                const reward = isPlayerWin ? awardWin() : awardLoss();
                // Show reward toast
                showRewardToast(isPlayerWin, reward);
                _isRankedGame = false;
            }
        };
    }
});

function startRankedGame(deckId) {
    const deck = playerData.decks.find(d => d.id === deckId);
    if (!deck) { alert('ไม่พบเด็ค'); return; }

    // Normalize cards: backward-compat with old string[] decks
    _pendingCollectionDeck = normalizeDeckCards(deck);
    _collectionDeckUsed = false;
    _isRankedGame = true;

    // Derive main theme from most-used set in deck
    const themeCount = {};
    _pendingCollectionDeck.forEach(c => themeCount[c.theme]=(themeCount[c.theme]||0)+1);
    const mainTheme = Object.entries(themeCount).sort((a,b)=>b[1]-a[1])[0]?.[0] || 'isekai_adventure';

    // Set AI theme randomly
    const aiThemes = Object.keys(SETS_META).filter(s => s !== 'suankularb' && typeof CardSets!=='undefined' && CardSets[s] && Object.keys(CardSets[s]).length>0);
    if (typeof selectedAITheme !== 'undefined')
        selectedAITheme = aiThemes[Math.floor(Math.random() * aiThemes.length)];
    if (typeof selectedPlayerTheme !== 'undefined')
        selectedPlayerTheme = mainTheme;
    if (typeof gameMode !== 'undefined') gameMode = 'ai';

    // Switch screens
    document.getElementById('hub-screen').style.display = 'none';
    document.getElementById('game-screen').style.display = '';
    document.getElementById('theme-selector').style.display = 'none';
    
    if (typeof resetAndInitGame !== 'undefined') resetAndInitGame();
}

function backToHub() {
    document.getElementById('game-screen').style.display = 'none';
    document.getElementById('hub-screen').style.display = '';
    _isRankedGame = false;
    _pendingCollectionDeck = null;
    // Restore hidden elements in theme-selector (in case startRankedOnline hid them)
    const modeRow = document.getElementById('btn-mode-ai')?.parentElement;
    if (modeRow) modeRow.style.display = '';
    const ptSel = document.getElementById('player-theme');
    const themeRow = ptSel?.parentElement?.parentElement;
    if (themeRow) themeRow.style.display = '';
    const strip = document.getElementById('ranked-deck-strip');
    if (strip) strip.remove();
    updateHubUI();
}

// ─── REWARD TOAST ────────────────────────────────────────────────
function showRewardToast(isWin, reward) {
    const toast = document.createElement('div');
    toast.style.cssText = `position:fixed;top:30%;left:50%;transform:translateX(-50%);
        background:${isWin?'linear-gradient(135deg,#1a4731,#065f46)':'linear-gradient(135deg,#3b1515,#7f1d1d)'};
        border:3px solid ${isWin?'#4ade80':'#f87171'};border-radius:20px;padding:24px 40px;
        z-index:9999;text-align:center;box-shadow:0 0 60px ${isWin?'rgba(74,222,128,0.5)':'rgba(248,113,113,0.5)'};
        animation:toastIn 0.4s ease;min-width:260px;`;
    toast.innerHTML = `
        <div style="font-size:2.5rem;margin-bottom:8px">${isWin?'🏆':'💀'}</div>
        <div style="font-size:1.3rem;font-weight:900;color:${isWin?'#4ade80':'#f87171'}">${isWin?'ชนะ!':'แพ้...'}</div>
        ${isWin ? `
        <div style="color:#fbbf24;font-size:1rem;margin-top:8px">+${reward.coins} 🪙 Coins</div>
        <div style="color:#818cf8;font-size:0.9rem">+${reward.rp} RP</div>
        ` : `
        <div style="color:#f87171;font-size:1rem;margin-top:8px">-${reward.rpLoss} RP</div>
        `}`;
    document.body.appendChild(toast);
    setTimeout(() => { toast.style.animation='toastOut 0.4s ease forwards'; setTimeout(()=>toast.remove(),400); }, 3500);
}

// ─── HUB UI ──────────────────────────────────────────────────────
let hubTab = 'home';
let packOpenerState = { packType:'standard', setName:'isekai_adventure', revealedCards:[], revealIndex:0 };
let deckBuilderState = { setFilter:'All', cards:[], searchText:'', editingDeckId:null };

function showHubTab(tab) {
    hubTab = tab;
    ['home','packs','collection','deckbuilder','play'].forEach(t => {
        const btn = document.getElementById(`hub-tab-${t}`);
        const pnl = document.getElementById(`hub-panel-${t}`);
        if (btn) btn.classList.toggle('active-tab', t===tab);
        if (pnl) pnl.style.display = t===tab ? '' : 'none';
    });
    if (tab==='home') renderHomePanel();
    else if (tab==='packs') { renderPacksPanel(); _refreshVideoAdBtn(); }
    else if (tab==='collection') renderCollectionPanel();
    else if (tab==='deckbuilder') renderDeckBuilderPanel();
    else if (tab==='play') renderPlayPanel();
}

function updateHubUI() {
    const rank = getRankInfo(playerData.rp);
    const prog = getRankProgress(playerData.rp);
    const el = id => document.getElementById(id);
    if (el('hub-coins'))   el('hub-coins').textContent   = playerData.coins.toLocaleString();
    if (el('hub-rank-name')) el('hub-rank-name').textContent = `${rank.emoji} ${rank.name}`;
    if (el('hub-rp'))      el('hub-rp').textContent      = `${playerData.rp} RP`;
    if (el('hub-rp-bar'))  el('hub-rp-bar').style.width  = prog + '%';
    if (el('hub-rp-bar'))  el('hub-rp-bar').style.background = rank.colorHex;
    if (el('hub-wins'))    el('hub-wins').textContent    = playerData.wins;
    if (el('hub-losses'))  el('hub-losses').textContent  = playerData.losses;
    showHubTab(hubTab);
}

// ─── HOME PANEL ──────────────────────────────────────────────────
function renderHomePanel() {
    const rank = getRankInfo(playerData.rp);
    const prog = getRankProgress(playerData.rp);
    const total = Object.values(playerData.collection).reduce((a,b)=>a+b,0);
    const activeDeck = getActiveDeck();
    document.getElementById('hub-panel-home').innerHTML = `
    <div style="display:flex;flex-direction:column;gap:16px;max-width:640px;margin:0 auto;padding:16px;">
      <div class="hub-card" style="background:linear-gradient(135deg,#1a1a2e,#16213e);border:2px solid ${rank.colorHex};padding:24px;border-radius:20px;box-shadow:0 0 30px ${rank.colorHex}44">
        <div style="display:flex;align-items:center;gap:16px">
          <div style="font-size:3.5rem">${rank.emoji}</div>
          <div>
            <div style="font-size:1.5rem;font-weight:900;color:${rank.colorHex}">${rank.name}</div>
            <div style="color:#9ca3af;font-size:0.85rem">${playerData.rp} / ${rank.rpMax===Infinity?'∞':rank.rpMax} RP</div>
            <div style="margin-top:6px;height:8px;width:200px;background:#374151;border-radius:8px;overflow:hidden">
              <div style="height:100%;width:${prog}%;background:${rank.colorHex};border-radius:8px;transition:width 0.5s"></div>
            </div>
          </div>
          <div style="margin-left:auto;text-align:right">
            <div style="font-size:1.3rem;font-weight:800;color:#fbbf24">🪙 ${playerData.coins.toLocaleString()}</div>
            <div style="color:#9ca3af;font-size:0.75rem">${playerData.wins}W / ${playerData.losses}L</div>
          </div>
        </div>
      </div>

      <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px">
        <div class="hub-stat-card" onclick="showHubTab('packs')">
          <div style="font-size:2rem">🎴</div>
          <div style="font-size:1.1rem;font-weight:700;color:#f0abfc">เปิดแพ็ค</div>
          <div style="font-size:0.75rem;color:#9ca3af">ใช้ ${playerData.coins} เหรียญ</div>
        </div>
        <div class="hub-stat-card" onclick="showHubTab('collection')">
          <div style="font-size:2rem">📚</div>
          <div style="font-size:1.1rem;font-weight:700;color:#4ade80">Collection</div>
          <div style="font-size:0.75rem;color:#9ca3af">${total} การ์ดที่มี</div>
        </div>
        <div class="hub-stat-card" onclick="showHubTab('deckbuilder')">
          <div style="font-size:2rem">🔨</div>
          <div style="font-size:1.1rem;font-weight:700;color:#60a5fa">Deck Builder</div>
          <div style="font-size:0.75rem;color:#9ca3af">${playerData.decks.length} เด็คที่บันทึก</div>
        </div>
        <div class="hub-stat-card" onclick="showHubTab('play')">
          <div style="font-size:2rem">⚔️</div>
          <div style="font-size:1.1rem;font-weight:700;color:#fb923c">เล่นเกม</div>
          <div style="font-size:0.75rem;color:#9ca3af">${activeDeck ? activeDeck.name : 'ยังไม่มีเด็ค Active'}</div>
        </div>
        <div class="hub-stat-card" onclick="openRedeemModal()" style="border:2px solid #d97706">
          <div style="font-size:2rem">🎁</div>
          <div style="font-size:1.1rem;font-weight:700;color:#fbbf24">โค้ดรับของ</div>
          <div style="font-size:0.75rem;color:#9ca3af">กรอกโค้ดรับ Gold</div>
        </div>
      </div>

      ${RANKS_CFG.map(r => `
      <div style="display:flex;align-items:center;gap:12px;background:#111827;padding:10px 16px;border-radius:12px;border:1px solid ${r.rpMin<=playerData.rp?r.colorHex:'#374151'}">
        <span style="font-size:1.5rem">${r.emoji}</span>
        <div style="flex:1">
          <div style="font-weight:700;color:${r.rpMin<=playerData.rp?r.colorHex:'#6b7280'}">${r.name}</div>
          <div style="font-size:0.7rem;color:#6b7280">${r.rpMin===0?'0':r.rpMin.toLocaleString()} – ${r.rpMax===Infinity?'∞':r.rpMax.toLocaleString()} RP</div>
        </div>
        <div style="text-align:right;font-size:0.75rem;color:#fbbf24">+${r.coinWin}🪙/ชนะ</div>
        ${playerData.rp>=r.rpMin&&playerData.rp<=r.rpMax?`<span style="background:${r.colorHex};color:#000;padding:2px 8px;border-radius:10px;font-size:0.7rem;font-weight:900">◄ NOW</span>`:''}
      </div>`).join('')}
    </div>`;
}

// ─── PACKS PANEL ─────────────────────────────────────────────────
function renderPacksPanel() {
    const meta = SETS_META[packOpenerState.setName] || SETS_META.isekai_adventure;
    document.getElementById('hub-panel-packs').innerHTML = `
    <div style="max-width:700px;margin:0 auto;padding:16px">
      <div style="display:flex;align-items:center;gap:12px;margin-bottom:16px">
        <div style="font-size:3rem">${meta.emoji}</div>
        <div>
          <div style="font-size:1.3rem;font-weight:900;color:#f0abfc">Pack Shop</div>
          <div style="font-size:0.8rem;color:#9ca3af">เหรียญคุณ: <span style="color:#fbbf24;font-weight:700">🪙 ${playerData.coins.toLocaleString()}</span></div>
        </div>
      </div>

      <div style="margin-bottom:16px">
        <label style="color:#9ca3af;font-size:0.8rem;display:block;margin-bottom:6px">เลือก Set การ์ด:</label>
        <select onchange="packOpenerState.setName=this.value;renderPacksPanel()" style="background:#1f2937;color:white;border:1px solid #4b5563;padding:8px 16px;border-radius:10px;width:100%">
          ${Object.entries(SETS_META).filter(([k])=>typeof CardSets!=='undefined'&&CardSets[k]&&Object.keys(CardSets[k]).length>0).map(([k,v])=>`<option value="${k}" ${k===packOpenerState.setName?'selected':''}>${v.emoji} ${v.label}</option>`).join('')}
        </select>
      </div>

      <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:12px;margin-bottom:24px">
        ${Object.entries(PACK_CFG).filter(([type])=>type!=='ready').map(([type,cfg])=>`
        <div class="pack-card-shop ${packOpenerState.packType===type?'pack-selected':''}"
             onclick="packOpenerState.packType='${type}';renderPacksPanel()"
             style="background:#111827;border:2px solid ${packOpenerState.packType===type?'#f97316':'#374151'};border-radius:16px;padding:16px;text-align:center;cursor:pointer;transition:all 0.2s">
          <div style="font-size:2.5rem;margin-bottom:8px">${cfg.art}</div>
          <div style="font-weight:800;color:white;font-size:0.9rem">${cfg.name}</div>
          <div style="color:#9ca3af;font-size:0.7rem;margin:4px 0">${cfg.desc}</div>
          <div style="color:#fbbf24;font-weight:900;font-size:1.1rem">🪙 ${cfg.cost}</div>
        </div>`).join('')}
      </div>

      <div style="display:flex;align-items:center;gap:16px;background:#1f2937;border-radius:16px;padding:16px;border:1px solid #374151">
        <img src="${meta.mascotArt}" onerror="this.style.display='none'"
          style="width:80px;height:80px;object-fit:cover;border-radius:12px;border:2px solid #f97316">
        <div style="flex:1">
          <div style="font-size:0.8rem;color:#fbbf24;font-weight:700">${meta.label} — ${PACK_CFG[packOpenerState.packType].name}</div>
          <div style="font-size:0.9rem;color:white;font-weight:900;margin:4px 0">ราคา: 🪙 ${PACK_CFG[packOpenerState.packType].cost} เหรียญ</div>
          <div style="font-size:0.75rem;color:#9ca3af">${PACK_CFG[packOpenerState.packType].desc}</div>
        </div>
        <button onclick="buyAndOpenPack()" 
          style="background:linear-gradient(135deg,#ea580c,#dc2626);color:white;font-weight:900;padding:12px 24px;border-radius:14px;border:none;cursor:pointer;font-size:1rem;white-space:nowrap;box-shadow:0 0 20px rgba(234,88,12,0.5)">
          🎴 เปิดแพ็ค
        </button>
      </div>

      <!-- ─── Ready-to-Play Pack ─── -->
      <div style="margin-top:16px;background:linear-gradient(135deg,#1e1b4b,#312e81);border-radius:16px;padding:16px;border:2px solid #7c3aed;display:flex;align-items:center;gap:14px">
        <div style="font-size:3rem">🎮</div>
        <div style="flex:1">
          <div style="font-weight:900;color:#a78bfa;font-size:1rem">Ready-to-Play Pack</div>
          <div style="font-size:0.75rem;color:#c4b5fd;margin-top:2px">60 การ์ดสุ่มจาก<strong>ทุก Set</strong> ได้ทีเดียวเลย!</div>
          <div style="font-size:0.75rem;color:#fbbf24;font-weight:900;margin-top:4px">🪙 7,777</div>
        </div>
        <button onclick="openReadyPack()"
          style="background:linear-gradient(135deg,#7c3aed,#4f46e5);color:white;font-weight:900;padding:10px 18px;border-radius:12px;border:none;cursor:pointer;font-size:0.9rem;white-space:nowrap;box-shadow:0 0 16px rgba(124,58,237,0.5)">
          🎮 ซื้อเลย
        </button>
      </div>

      <!-- ─── Anutin Pack ─── -->
      <div style="margin-top:12px;background:linear-gradient(135deg,#064e3b,#065f46);border-radius:16px;padding:16px;border:2px solid #10b981;display:flex;align-items:center;gap:14px">
        <div style="font-size:3rem">🌿</div>
        <div style="flex:1">
          <div style="font-weight:900;color:#34d399;font-size:1rem">Anutin Pack ✦ Exclusive</div>
          <div style="font-size:0.75rem;color:#6ee7b7;margin-top:2px">ได้ <strong>Anutin</strong> (Cost 10, อมตะ) + <strong>Bull</strong> 1 ตัวทันที!</div>
          <div style="font-size:0.7rem;color:#a7f3d0;margin-top:2px">ชนะ Ranked มี Anutin → <strong style="color:#fbbf24">+500🪙 โบนัส</strong></div>
          <div style="font-size:0.75rem;color:#fbbf24;font-weight:900;margin-top:4px">🪙 10,000</div>
        </div>
        <button onclick="buyAnutinPack()"
          style="background:linear-gradient(135deg,#059669,#047857);color:white;font-weight:900;padding:10px 18px;border-radius:12px;border:none;cursor:pointer;font-size:0.9rem;white-space:nowrap;box-shadow:0 0 16px rgba(5,150,105,0.5)">
          🌿 ซื้อเลย
        </button>
      </div>

      <div style="margin-top:16px;background:linear-gradient(135deg,#064e3b,#065f46);border-radius:16px;padding:16px;border:2px solid #10b981;display:flex;align-items:center;gap:14px">
        <div style="font-size:2.8rem">📺</div>
        <div style="flex:1">
          <div style="font-weight:900;color:#34d399;font-size:1rem">ดูวิดีโอรับแพ็คฟรี!</div>
          <div style="font-size:0.75rem;color:#6ee7b7;margin-top:2px">ดูจนจบ → รับ Basic Pack มูลค่า 🪙 150 ฟรี</div>
          <div id="video-ad-cooldown-txt" style="font-size:0.7rem;color:#9ca3af;margin-top:2px"></div>
        </div>
        <button onclick="watchAdForPack()" id="watch-ad-btn"
          style="background:linear-gradient(135deg,#059669,#047857);color:white;font-weight:900;padding:10px 18px;border-radius:12px;border:none;cursor:pointer;font-size:0.9rem;white-space:nowrap;box-shadow:0 0 16px rgba(16,185,129,0.5)">
          ▶ ดูเลย
        </button>
      </div>
    </div>`;
}

// called after packs panel renders to refresh button state
function _refreshVideoAdBtn() { setTimeout(updateVideoAdButton, 50); }

function buyAndOpenPack() {
    const result = openPack(packOpenerState.packType, packOpenerState.setName);
    if (result.error) { showToast(result.error, '#f87171'); return; }
    packOpenerState.revealedCards = result.cards;
    packOpenerState.revealIndex = 0;
    showPackRevealModal(result.cards);
    updateHubUI();
    // ตรวจ Collection Milestone หลังซื้อแพ็ค
    setTimeout(() => checkCollectionMilestones(), 3200);
}

// ─── PACK REVEAL MODAL ───────────────────────────────────────────
function showPackRevealModal(cards) {
    const overlay = document.getElementById('pack-reveal-overlay');
    overlay.style.display = 'flex';
    
    const revealEl = document.getElementById('pack-reveal-cards');
    revealEl.innerHTML = cards.map((c,i) => {
        const r = RARITY_CFG[c.rarity];
        return `
        <div class="reveal-card" id="rcard-${i}" 
             style="width:110px;height:155px;perspective:600px;cursor:pointer;flex-shrink:0"
             onclick="flipRevealCard(${i})">
          <div class="reveal-inner" id="rinner-${i}" style="position:relative;width:100%;height:100%;transform-style:preserve-3d;transition:transform 0.6s;border-radius:12px">
            <div class="reveal-front" style="position:absolute;inset:0;backface-visibility:hidden;background:linear-gradient(135deg,#1e1b4b,#312e81);border-radius:12px;border:3px solid #6366f1;display:flex;align-items:center;justify-content:center;font-size:3rem">🃏</div>
            <div class="reveal-back" style="position:absolute;inset:0;backface-visibility:hidden;transform:rotateY(180deg);border-radius:12px;overflow:hidden;border:3px solid ${r.border};box-shadow:0 0 20px ${r.glow}">
              ${c.data?.art ? `<img src="${c.data.art}" style="width:100%;height:70%;object-fit:cover">` : `<div style="width:100%;height:70%;background:#374151;display:flex;align-items:center;justify-content:center;font-size:2rem">🃏</div>`}
              <div style="padding:4px 6px;background:rgba(0,0,0,0.85)">
                <div style="font-size:0.65rem;font-weight:900;color:${r.color};text-align:center">${r.emoji} ${r.label.toUpperCase()}</div>
                <div style="font-size:0.7rem;font-weight:800;color:white;text-align:center;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${c.name}</div>
                ${c.data?.type==='Character'?`<div style="font-size:0.6rem;color:#9ca3af;text-align:center">ATK:${c.data.atk} HP:${c.data.hp}</div>`:`<div style="font-size:0.6rem;color:#a78bfa;text-align:center">${c.data?.type||''}</div>`}
              </div>
            </div>
          </div>
        </div>`;
    }).join('');

    document.getElementById('pack-reveal-title').textContent = 
        `🎴 ${PACK_CFG[packOpenerState.packType].name} — ${SETS_META[packOpenerState.setName]?.label || packOpenerState.setName}`;
    
    // Auto-flip all after 3s if not clicked
    setTimeout(() => flipAllRevealCards(), 2800);
}

function flipRevealCard(i) {
    const inner = document.getElementById(`rinner-${i}`);
    if (inner) inner.style.transform = 'rotateY(180deg)';
    // Add glow to parent
    const card = document.getElementById(`rcard-${i}`);
    if (card && packOpenerState.revealedCards[i]) {
        const r = RARITY_CFG[packOpenerState.revealedCards[i].rarity];
        if (r) card.style.filter = `drop-shadow(0 0 12px ${r.border})`;
    }
}
function flipAllRevealCards() {
    packOpenerState.revealedCards.forEach((_,i) => flipRevealCard(i));
}
function closePackReveal() {
    document.getElementById('pack-reveal-overlay').style.display = 'none';
    renderPacksPanel();
}

// ─── CARD DETAIL MODAL ───────────────────────────────────────────
function showCardDetailModal(name, theme) {
    const data = (typeof CardSets !== 'undefined') ? (CardSets[theme] || {})[name] : null;
    if (!data) return;
    const count = playerData.collection[`${name}|${theme}`] || 0;
    const rarity = getCardRarity(name, data);
    const r = RARITY_CFG[rarity];
    const lore = CARD_LORE[name];
    const setMeta = SETS_META[theme];
    const isChamp = data.isChampion;

    // กำหนดสี border/glow ตาม rarity/champion
    const borderColor = isChamp ? '#f59e0b' : r.border;
    const glowColor  = isChamp ? 'rgba(245,158,11,0.6)' : r.glow;
    const labelColor = isChamp ? '#fbbf24' : r.color;
    const rarityLabel = isChamp ? '♛ Champion' : `${r.emoji} ${r.label}`;

    const isChar = data.type === 'Character' || data.type === 'Champion';

    let existing = document.getElementById('card-detail-modal');
    if (existing) existing.remove();

    const modal = document.createElement('div');
    modal.id = 'card-detail-modal';
    // Fix: ยึด position ตาม hub-screen จริง กัน offset ของ game container
    const hub = document.getElementById('hub-screen');
    const rect = hub ? hub.getBoundingClientRect() : {left:0, top:0, width:window.innerWidth, height:window.innerHeight};
    modal.style.cssText = `position:fixed;top:${rect.top}px;left:${rect.left}px;width:${rect.width}px;height:${rect.height}px;background:rgba(0,0,0,0.88);z-index:99998;display:flex;align-items:center;justify-content:center;box-sizing:border-box;padding:0 16px;`;
    modal.onclick = (e) => { if (e.target === modal) modal.remove(); };

    modal.innerHTML = `
    <div style="background:linear-gradient(135deg,#0f0c29,#1a1640,#1e1b4b);border:3px solid ${borderColor};border-radius:24px;
         padding:0;max-width:420px;width:90%;max-height:90vh;overflow-y:auto;overflow-x:hidden;
         box-shadow:0 0 60px ${glowColor};position:relative;box-sizing:border-box;word-break:break-word;overflow-wrap:break-word">

      <!-- Close button -->
      <button onclick="document.getElementById('card-detail-modal').remove()"
        style="position:absolute;top:10px;right:12px;background:rgba(0,0,0,0.5);color:#9ca3af;
               border:none;border-radius:50%;width:28px;height:28px;font-size:1rem;cursor:pointer;z-index:10;line-height:1">✕</button>

      <!-- Art header -->
      <div style="position:relative;width:100%;height:220px;overflow:hidden;border-radius:21px 21px 0 0">
        ${data.art
            ? `<img src="${data.art}" style="width:100%;height:100%;object-fit:cover" onerror="this.style.display='none'">`
            : `<div style="width:100%;height:100%;background:linear-gradient(135deg,#1e1b4b,#312e81);display:flex;align-items:center;justify-content:center;font-size:5rem">🃏</div>`}
        <!-- Gradient overlay -->
        <div style="position:absolute;inset:0;background:linear-gradient(to top,rgba(15,12,41,1) 0%,rgba(15,12,41,0.4) 50%,transparent 100%)"></div>
        <!-- Rarity badge top-left -->
        <div style="position:absolute;top:12px;left:12px;background:rgba(0,0,0,0.75);border:1.5px solid ${borderColor};
             border-radius:20px;padding:3px 10px;font-size:0.7rem;font-weight:800;color:${labelColor}">
          ${rarityLabel}
        </div>
        <!-- Count badge top-right -->
        <div style="position:absolute;top:12px;right:40px;background:rgba(0,0,0,0.75);border:1.5px solid #374151;
             border-radius:20px;padding:3px 10px;font-size:0.7rem;font-weight:800;color:#fbbf24">
          ×${count} ใบ
        </div>
        <!-- Card name -->
        <div style="position:absolute;bottom:12px;left:16px;right:16px">
          <div style="font-size:1.3rem;font-weight:900;color:white;text-shadow:0 2px 8px rgba(0,0,0,0.9)">${name}</div>
          <div style="font-size:0.72rem;color:#9ca3af">${setMeta?.emoji||''} ${setMeta?.label||theme} · ${data.type}</div>
        </div>
      </div>

      <!-- Stats & Info -->
      <div style="padding:16px 18px">

        <!-- Cost / ATK / HP row -->
        <div style="display:flex;gap:8px;margin-bottom:14px">
          <div style="flex:1;background:#111827;border-radius:10px;padding:8px;text-align:center;border:1px solid #374151">
            <div style="font-size:1.3rem;font-weight:900;color:#fbbf24">${data.cost}</div>
            <div style="font-size:0.6rem;color:#9ca3af">COST</div>
          </div>
          ${isChar ? `
          <div style="flex:1;background:#111827;border-radius:10px;padding:8px;text-align:center;border:1px solid #ef4444">
            <div style="font-size:1.3rem;font-weight:900;color:#f87171">${data.atk ?? '–'}</div>
            <div style="font-size:0.6rem;color:#9ca3af">ATK</div>
          </div>
          <div style="flex:1;background:#111827;border-radius:10px;padding:8px;text-align:center;border:1px solid #22c55e">
            <div style="font-size:1.3rem;font-weight:900;color:#4ade80">${data.hp ?? '–'}</div>
            <div style="font-size:0.6rem;color:#9ca3af">HP</div>
          </div>` : ''}
        </div>

        <!-- Ability text -->
        ${data.text ? `
        <div style="background:#111827;border-radius:12px;padding:12px 14px;margin-bottom:12px;border:1px solid ${borderColor}33">
          <div style="font-size:0.65rem;color:${labelColor};font-weight:700;margin-bottom:4px;text-transform:uppercase;letter-spacing:0.05em">⚡ Ability</div>
          <div style="font-size:0.82rem;color:#e5e7eb;line-height:1.5;overflow-wrap:break-word;word-break:break-word">${data.text}</div>
        </div>` : ''}

        <!-- Lore section (Legendary / Champion / selected Epic) -->
        ${lore ? `
        <div style="background:linear-gradient(135deg,rgba(245,158,11,0.08),rgba(251,191,36,0.05));
             border-radius:12px;padding:14px;margin-bottom:14px;
             border:1px solid rgba(251,191,36,0.25)">
          <div style="font-size:0.65rem;color:#fbbf24;font-weight:800;margin-bottom:6px;text-transform:uppercase;letter-spacing:0.05em">📜 ${lore.title}</div>
          <div style="font-size:0.8rem;color:#d1d5db;line-height:1.6;overflow-wrap:break-word;word-break:break-word">${lore.lore}</div>
        </div>` : ''}

        <!-- Action buttons -->
        <div style="display:flex;gap:8px">
          <button onclick="sellCard('${name.replace(/'/g,"\\'")}','${theme}');document.getElementById('card-detail-modal').remove()"
            ${count <= 0 ? 'disabled' : ''}
            style="flex:1;background:${count > 0 ? 'linear-gradient(135deg,#92400e,#78350f)':'#374151'};
                   color:${count > 0 ? '#fbbf24':'#6b7280'};border:1.5px solid ${count > 0 ? '#d97706':'#4b5563'};
                   padding:10px;border-radius:10px;font-weight:800;cursor:${count > 0 ? 'pointer':'not-allowed'};
                   font-size:0.85rem">
            💰 ขาย 1 ใบ (+50🪙)
          </button>
          <button onclick="document.getElementById('card-detail-modal').remove()"
            style="flex:1;background:#1f2937;color:#9ca3af;border:1.5px solid #374151;
                   padding:10px;border-radius:10px;font-weight:700;cursor:pointer;font-size:0.85rem">
            ✕ ปิด
          </button>
        </div>
      </div>
    </div>`;

    document.body.appendChild(modal);
}

// ─── COLLECTION PANEL ────────────────────────────────────────────
let collFilter = { rarity:'All', type:'All', search:'' };

function renderCollectionPanel() {
    const all = getCollectionCards();
    const rarityOpts = ['All',...RARITY_ORDER];
    const typeOpts = ['All','Character','Action','Item','Field'];
    const uniqueCount = Object.keys(playerData.collection).filter(k => playerData.collection[k] > 0).length;
    const claimedSet = new Set(playerData.claimedMilestones || []);

    const filtered = all.filter(c => {
        if (collFilter.rarity !== 'All' && c.rarity !== collFilter.rarity) return false;
        if (collFilter.type !== 'All' && c.data?.type !== collFilter.type) return false;
        if (collFilter.search && !c.name.toLowerCase().includes(collFilter.search.toLowerCase())) return false;
        return true;
    }).sort((a,b) => RARITY_ORDER.indexOf(b.rarity) - RARITY_ORDER.indexOf(a.rarity) || a.name.localeCompare(b.name));

    document.getElementById('hub-panel-collection').innerHTML = `
    <div style="padding:16px;max-width:900px;margin:0 auto">

      <!-- ── Milestone Progress ── -->
      <div style="background:linear-gradient(135deg,#0f0c29,#1a1640);border:1px solid #4b5563;border-radius:16px;padding:16px;margin-bottom:16px">
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:10px">
          <div style="font-weight:800;color:#fbbf24;font-size:0.95rem">🏆 Collection Milestones</div>
          <div style="font-size:0.8rem;font-weight:700;color:#9ca3af">${uniqueCount} / ${COLLECTION_MILESTONES[COLLECTION_MILESTONES.length-1].count} ชนิด</div>
        </div>
        <div style="display:flex;gap:4px;flex-wrap:wrap;margin-bottom:10px">
          ${COLLECTION_MILESTONES.map(m => {
              const done = claimedSet.has(m.count);
              const reached = uniqueCount >= m.count;
              return `<div title="${m.label} (${m.count} ชนิด → +${m.reward}🪙)" style="display:flex;flex-direction:column;align-items:center;gap:2px;width:48px">
                <div style="font-size:1.2rem;filter:${done?'none':'grayscale(1)'};opacity:${reached?1:0.4}">${m.emoji}</div>
                <div style="font-size:0.45rem;color:${done?'#4ade80':reached?'#fbbf24':'#6b7280'};font-weight:700;text-align:center">${done?'✓ รับแล้ว':reached?'รับได้!':m.count}</div>
                <div style="font-size:0.45rem;color:#9ca3af">+${m.reward>999?(m.reward/1000)+'k':m.reward}🪙</div>
              </div>`;
          }).join('')}
        </div>
        <div style="height:6px;background:#374151;border-radius:6px;overflow:hidden">
          <div style="height:100%;width:${Math.min(100,uniqueCount/COLLECTION_MILESTONES[COLLECTION_MILESTONES.length-1].count*100)}%;background:linear-gradient(90deg,#fbbf24,#f59e0b);border-radius:6px;transition:width 0.5s"></div>
        </div>
        <!-- Altair Unlock Progress -->
        ${(()=>{
          const isekaiUnique = Object.keys(playerData.collection).filter(k => { const [,t]=k.split('|'); return t==='isekai_adventure' && playerData.collection[k]>0 && !k.startsWith('Altair|'); }).length;
          const pct = Math.min(100, Math.round(isekaiUnique / ALTAIR_UNLOCK_ISEKAI_COUNT * 100));
          if (playerData.altairUnlocked) return `<div style="margin-top:10px;display:flex;align-items:center;gap:8px;background:linear-gradient(135deg,#3d2600,#7c4a00);border:1px solid #f59e0b;border-radius:10px;padding:8px 12px"><div style="font-size:1.4rem">♛</div><div><div style="font-weight:800;color:#fbbf24;font-size:0.8rem">Altair ปลดล็อคแล้ว! ✓</div><div style="font-size:0.65rem;color:#fcd34d">Champion of Isekai อยู่ใน Collection ของคุณแล้ว</div></div></div>`;
          return `<div style="margin-top:10px"><div style="display:flex;justify-content:space-between;margin-bottom:4px"><span style="font-size:0.7rem;color:#9ca3af">♛ Altair Unlock — สะสม Isekai ครบ ${ALTAIR_UNLOCK_ISEKAI_COUNT} ชนิด</span><span style="font-size:0.7rem;color:#fbbf24">${isekaiUnique}/${ALTAIR_UNLOCK_ISEKAI_COUNT}</span></div><div style="height:5px;background:#374151;border-radius:5px;overflow:hidden"><div style="height:100%;width:${pct}%;background:linear-gradient(90deg,#f59e0b,#fbbf24);border-radius:5px"></div></div></div>`;
        })()}
      </div>

      <div style="display:flex;flex-wrap:wrap;gap:8px;margin-bottom:12px;align-items:center">
        <input placeholder="🔍 ค้นหาการ์ด..." value="${collFilter.search}"
          oninput="collFilter.search=this.value;renderCollectionPanel()"
          style="flex:1;min-width:150px;background:#1f2937;color:white;border:1px solid #4b5563;padding:8px 12px;border-radius:10px">
        <select onchange="collFilter.rarity=this.value;renderCollectionPanel()" style="background:#1f2937;color:white;border:1px solid #4b5563;padding:8px;border-radius:10px">
          ${rarityOpts.map(r=>`<option value="${r}" ${r===collFilter.rarity?'selected':''}>${r==='All'?'ทุก Rarity':RARITY_CFG[r]?.emoji+' '+r}</option>`).join('')}
        </select>
        <select onchange="collFilter.type=this.value;renderCollectionPanel()" style="background:#1f2937;color:white;border:1px solid #4b5563;padding:8px;border-radius:10px">
          ${typeOpts.map(t=>`<option value="${t}" ${t===collFilter.type?'selected':''}>${t==='All'?'ทุกประเภท':t}</option>`).join('')}
        </select>
      </div>
      <div style="color:#9ca3af;font-size:0.75rem;margin-bottom:8px">${filtered.length} การ์ด (ทั้งหมด ${all.length} ชนิด)</div>
      <div style="display:flex;flex-wrap:wrap;gap:10px;justify-content:flex-start">
        ${filtered.map(c => {
            const r = RARITY_CFG[c.rarity] || RARITY_CFG['Legendary'];
            const isChamp = c.data?.isChampion;
            const hasLore = !!CARD_LORE[c.name];
            return `
            <div onclick="showCardDetailModal('${c.name.replace(/'/g,"\\'")}','${c.theme}')"
                 style="width:100px;border-radius:12px;overflow:hidden;border:2px solid ${isChamp?'#f59e0b':r.border};
                        box-shadow:0 0 ${isChamp?'16px rgba(245,158,11,0.7)':'10px '+r.glow};
                        background:#111827;cursor:pointer;position:relative;transition:transform 0.15s"
                 onmouseover="this.style.transform='scale(1.04)'" onmouseout="this.style.transform='scale(1)'"
                 title="${c.name}${isChamp?' ♛ Champion':''}${hasLore?' 📜 มี Lore':''}">
              ${c.data?.art ? `<img src="${c.data.art}" style="width:100%;height:70px;object-fit:cover">` : `<div style="width:100%;height:70px;background:#374151;display:flex;align-items:center;justify-content:center">🃏</div>`}
              <div style="padding:4px">
                <div style="font-size:0.58rem;color:${isChamp?'#fbbf24':r.color};font-weight:700">${isChamp?'♛ Champion':r.emoji+' '+r.label}</div>
                <div style="font-size:0.62rem;font-weight:800;color:white;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${c.name}</div>
                <div style="font-size:0.58rem;color:#6b7280">${c.data?.type||''}</div>
              </div>
              <div style="position:absolute;top:2px;right:2px;background:rgba(0,0,0,0.8);color:#fbbf24;font-size:0.6rem;font-weight:900;padding:1px 5px;border-radius:6px">x${c.count}</div>
              ${isChamp?`<div style="position:absolute;top:2px;left:2px;background:rgba(245,158,11,0.9);color:#000;font-size:0.5rem;font-weight:900;padding:1px 4px;border-radius:4px">♛</div>`:''}
              ${hasLore?`<div style="position:absolute;bottom:2px;right:2px;font-size:0.55rem;background:rgba(251,191,36,0.85);color:#000;padding:1px 3px;border-radius:3px;font-weight:900" title="มี Lore">📜</div>`:''}
            </div>`;
        }).join('')}
        ${filtered.length===0 ? `<div style="color:#6b7280;width:100%;text-align:center;padding:40px">ยังไม่มีการ์ด — ไปซื้อแพ็คกันเถอะ! 🎴</div>` : ''}
      </div>
      <!-- Sell hint -->
      <div style="margin-top:12px;font-size:0.7rem;color:#6b7280;text-align:center">💡 กดที่การ์ดเพื่อดูรายละเอียด, Ability, Lore และขายการ์ด (+50🪙/ใบ)</div>
    </div>`;
}

// ─── DECK BUILDER PANEL ──────────────────────────────────────────
function renderDeckBuilderPanel() {
    // Filter by set (setFilter) — 'All' shows everything, specific set filters left panel only
    const allCards = getCollectionCards();
    const baseCards = deckBuilderState.setFilter === 'All'
        ? allCards
        : allCards.filter(c => c.theme === deckBuilderState.setFilter);
    const filtered = deckBuilderState.searchText
        ? baseCards.filter(c => c.name.toLowerCase().includes(deckBuilderState.searchText.toLowerCase()))
        : baseCards;
    filtered.sort((a,b) => RARITY_ORDER.indexOf(b.rarity) - RARITY_ORDER.indexOf(a.rarity));
    
    const deckCards = deckBuilderState.cards; // [{name,theme}, ...]
    const deckCount = deckCards.length;
    // countMap keyed by "name|theme"
    const countMap = {};
    deckCards.forEach(c => { const k=`${c.name}|${c.theme}`; countMap[k]=(countMap[k]||0)+1; });
    const isValid = deckCount >= DECK_MIN && deckCount <= DECK_MAX;
    
    // unique sets in the current deck
    const deckSets = [...new Set(deckCards.map(c=>c.theme))];
    
    const setOptions = Object.entries(SETS_META).filter(([k])=>typeof CardSets!=='undefined'&&CardSets[k]&&Object.keys(CardSets[k]).length>0);
    
    document.getElementById('hub-panel-deckbuilder').innerHTML = `
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;padding:12px;max-width:1000px;margin:0 auto;height:calc(100vh - 180px)">
      <!-- Left: Collection -->
      <div style="display:flex;flex-direction:column;background:#111827;border-radius:16px;overflow:hidden;border:1px solid #374151">
        <div style="padding:12px;background:#1f2937;border-bottom:1px solid #374151">
          <div style="font-weight:800;color:white;margin-bottom:8px">📚 Collection (${allCards.length} ชนิด)</div>
          <div style="display:flex;gap:6px;flex-wrap:wrap">
            <select onchange="deckBuilderState.setFilter=this.value;renderDeckBuilderPanel()" style="background:#374151;color:white;border:none;padding:4px 8px;border-radius:8px;font-size:0.75rem">
              <option value="All" ${'All'===deckBuilderState.setFilter?'selected':''}>🌐 ทุก Set</option>
              ${setOptions.map(([k,v])=>`<option value="${k}" ${k===deckBuilderState.setFilter?'selected':''}>${v.emoji} ${v.label}</option>`).join('')}
            </select>
            <input placeholder="ค้นหา..." value="${deckBuilderState.searchText}"
              oninput="deckBuilderState.searchText=this.value;renderDeckBuilderPanel()"
              style="flex:1;background:#374151;color:white;border:none;padding:4px 8px;border-radius:8px;font-size:0.75rem">
          </div>
        </div>
        <div style="flex:1;overflow-y:auto;padding:8px;display:flex;flex-wrap:wrap;gap:6px;align-content:flex-start">
          ${filtered.length===0 ? `<div style="color:#6b7280;width:100%;text-align:center;padding:20px;font-size:0.8rem">ไม่มีการ์ด — ซื้อแพ็คก่อน!</div>` : ''}
          ${filtered.map(c => {
            const r = RARITY_CFG[c.rarity];
            const key = `${c.name}|${c.theme}`;
            const inDeck = countMap[key] || 0;
            const maxAllowed = c.data?.isChampion ? 1 : Math.min(MAX_COPIES, c.count);
            const canAdd = inDeck < maxAllowed && deckCount < DECK_MAX;
            const setMeta = SETS_META[c.theme];
            return `
            <div onclick="${canAdd?`addToDeck('${c.name.replace(/'/g,"\\'")}','${c.theme}')`:''}"
                 style="width:72px;border-radius:8px;overflow:hidden;border:2px solid ${c.data?.isChampion?'#f59e0b':r.border};background:#1a1a2e;cursor:${canAdd?'pointer':'not-allowed'};opacity:${canAdd?1:0.5};position:relative" title="${c.name} [${setMeta?.label||c.theme}]">
              ${c.data?.art ? `<img src="${c.data.art}" style="width:100%;height:52px;object-fit:cover">` : `<div style="width:100%;height:52px;background:#374151;display:flex;align-items:center;justify-content:center;font-size:1.2rem">🃏</div>`}
              <div style="padding:3px">
                <div style="font-size:0.52rem;font-weight:800;color:white;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${c.name}</div>
                <div style="font-size:0.5rem;color:${r.color}">${r.emoji} Cost:${c.data?.cost??'?'}</div>
              </div>
              ${inDeck>0?`<div style="position:absolute;top:1px;right:1px;background:#f97316;color:white;font-size:0.55rem;font-weight:900;padding:0 4px;border-radius:4px">${inDeck}/${maxAllowed}</div>`:''}
              <div style="position:absolute;bottom:1px;left:1px;background:rgba(0,0,0,0.75);color:#d1d5db;font-size:0.45rem;padding:0 3px;border-radius:3px">${setMeta?.emoji||''}</div>
            </div>`;
          }).join('')}
        </div>
      </div>
      
      <!-- Right: Deck -->
      <div style="display:flex;flex-direction:column;background:#111827;border-radius:16px;overflow:hidden;border:1px solid ${isValid?'#22c55e':'#374151'}">
        <div style="padding:12px;background:#1f2937;border-bottom:1px solid #374151">
          <div style="display:flex;justify-content:space-between;align-items:center">
            <div style="font-weight:800;color:white">🃏 เด็คของฉัน</div>
            <div style="font-size:0.8rem;font-weight:900;color:${isValid?'#4ade80':deckCount>DECK_MAX?'#f87171':'#fbbf24'}">${deckCount}/${DECK_MAX} ${isValid?'✓':''}</div>
          </div>
          <div style="font-size:0.65rem;color:#9ca3af;margin-top:2px">ขั้นต่ำ ${DECK_MIN} ใบ | รวมการ์ดได้หลาย Set</div>
          ${deckSets.length>0?`<div style="margin-top:4px;font-size:0.6rem;color:#6b7280">${deckSets.map(s=>SETS_META[s]?.emoji+' '+SETS_META[s]?.label||s).join(' · ')}</div>`:''}
          <div style="margin-top:6px;height:4px;background:#374151;border-radius:4px"><div style="height:100%;width:${Math.min(100,deckCount/DECK_MAX*100)}%;background:${isValid?'#22c55e':deckCount>DECK_MAX?'#ef4444':'#f97316'};border-radius:4px;transition:width 0.3s"></div></div>
        </div>
        <div style="flex:1;overflow-y:auto;padding:8px">
          ${Object.keys(countMap).length===0 ? `<div style="color:#6b7280;text-align:center;padding:20px;font-size:0.8rem">คลิกการ์ดทางซ้ายเพื่อเพิ่ม</div>` : ''}
          ${Object.entries(countMap).map(([key, cnt]) => {
            const [cardName, cardTheme] = key.split('|');
            const data = (typeof CardSets !== 'undefined') ? (CardSets[cardTheme]||{})[cardName] : null;
            const r = RARITY_CFG[getCardRarity(cardName,data)];
            const setMeta = SETS_META[cardTheme];
            return `
            <div style="display:flex;align-items:center;gap:6px;padding:5px 8px;margin-bottom:4px;background:#1f2937;border-radius:8px;border-left:3px solid ${r.border}">
              ${data?.art?`<img src="${data.art}" style="width:28px;height:28px;object-fit:cover;border-radius:4px">`:'<div style="width:28px;height:28px;background:#374151;border-radius:4px;display:flex;align-items:center;justify-content:center;font-size:0.8rem">🃏</div>'}
              <div style="flex:1;min-width:0">
                <div style="font-size:0.7rem;font-weight:700;color:white;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${cardName}</div>
                <div style="font-size:0.52rem;color:#6b7280">${setMeta?.emoji||''} ${setMeta?.label||cardTheme}</div>
              </div>
              <div style="font-size:0.8rem;font-weight:900;color:#fbbf24">×${cnt}</div>
              <button onclick="removeFromDeck('${cardName.replace(/'/g,"\\'")}','${cardTheme}')" style="background:#374151;color:#f87171;border:none;border-radius:6px;width:20px;height:20px;cursor:pointer;font-size:0.75rem;line-height:1">−</button>
            </div>`;
          }).join('')}
        </div>
        <div style="padding:12px;background:#1f2937;border-top:1px solid #374151;display:flex;gap:8px">
          <button onclick="saveDeckFromBuilder()" ${isValid?'':'disabled'}
            style="flex:1;background:${isValid?'linear-gradient(135deg,#059669,#065f46)':'#374151'};color:${isValid?'white':'#6b7280'};border:none;padding:10px;border-radius:10px;font-weight:800;cursor:${isValid?'pointer':'not-allowed'};font-size:0.85rem">
            💾 บันทึกเด็ค
          </button>
          <button onclick="clearDeck()" style="background:#374151;color:#f87171;border:none;padding:10px 14px;border-radius:10px;cursor:pointer;font-size:0.85rem">🗑</button>
        </div>
      </div>
    </div>
    
    <!-- Saved Decks -->
    ${playerData.decks.length>0?`
    <div style="padding:12px;max-width:1000px;margin:0 auto">
      <div style="font-weight:800;color:white;margin-bottom:8px">📋 เด็คที่บันทึกแล้ว</div>
      <div style="display:flex;flex-wrap:wrap;gap:10px">
        ${playerData.decks.map(d => {
          const normCards = normalizeDeckCards(d);
          const sets = [...new Set(normCards.map(c=>c.theme))];
          return `
          <div style="background:#1f2937;border:2px solid ${d.isActive?'#f97316':'#374151'};border-radius:12px;padding:12px;min-width:180px;max-width:220px">
            <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:4px">
              <div style="font-weight:800;color:white;font-size:0.9rem">${d.name}</div>
              ${d.isActive?`<span style="background:#f97316;color:white;font-size:0.6rem;padding:1px 6px;border-radius:6px;font-weight:900">ACTIVE</span>`:''}
            </div>
            <div style="font-size:0.75rem;color:#9ca3af">${sets.map(s=>SETS_META[s]?.emoji||'').join('')} ${normCards.length} ใบ</div>
            <div style="font-size:0.62rem;color:#6b7280;margin-top:2px">${sets.map(s=>SETS_META[s]?.label||s).join(', ')}</div>
            <div style="display:flex;gap:6px;margin-top:8px">
              <button onclick="setActiveDeck('${d.id}');renderDeckBuilderPanel()" style="flex:1;background:${d.isActive?'#374151':'#065f46'};color:${d.isActive?'#6b7280':'#4ade80'};border:none;padding:6px;border-radius:8px;cursor:pointer;font-size:0.7rem;font-weight:700">${d.isActive?'Active ✓':'Set Active'}</button>
              <button onclick="deleteDeck('${d.id}');renderDeckBuilderPanel()" style="background:#3b1515;color:#f87171;border:none;padding:6px 8px;border-radius:8px;cursor:pointer;font-size:0.7rem">🗑</button>
            </div>
          </div>`;
        }).join('')}
      </div>
    </div>` : ''}`;
}

function addToDeck(name, theme) {
    const countMap = {};
    deckBuilderState.cards.forEach(c => { const k=`${c.name}|${c.theme}`; countMap[k]=(countMap[k]||0)+1; });
    const inCollection = playerData.collection[`${name}|${theme}`] || 0;
    const cardData = (typeof CardSets !== 'undefined') ? (CardSets[theme]||{})[name] : null;
    const key = `${name}|${theme}`;
    if (cardData?.isChampion && (countMap[key]||0) >= 1) { showToast('♛ Champion มีได้แค่ 1 ใบในเด็ค!','#fbbf24'); return; }
    if ((countMap[key]||0) >= Math.min(MAX_COPIES, inCollection)) { showToast('ถึง limit แล้ว!','#f87171'); return; }
    if (deckBuilderState.cards.length >= DECK_MAX) { showToast(`สูงสุด ${DECK_MAX} ใบ!`,'#f87171'); return; }
    deckBuilderState.cards.push({name, theme});
    renderDeckBuilderPanel();
}

function removeFromDeck(name, theme) {
    let idx = -1;
    for (let i = deckBuilderState.cards.length-1; i >= 0; i--) {
        if (deckBuilderState.cards[i].name === name && deckBuilderState.cards[i].theme === theme) { idx = i; break; }
    }
    if (idx !== -1) { deckBuilderState.cards.splice(idx,1); renderDeckBuilderPanel(); }
}

function clearDeck() {
    if (confirm('เคลียร์การ์ดทั้งหมดในเด็ค?')) { deckBuilderState.cards = []; renderDeckBuilderPanel(); }
}

function saveDeckFromBuilder() {
    const name = prompt('ชื่อเด็ค:', 'My Deck') || 'My Deck';
    const result = saveDeck(name, [...deckBuilderState.cards]);
    if (result.error) { showToast(result.error,'#f87171'); return; }
    showToast('บันทึกเด็คสำเร็จ! 🎉','#4ade80');
    deckBuilderState.cards = [];
    renderDeckBuilderPanel();
}

// ─── PLAY PANEL ──────────────────────────────────────────────────
function renderPlayPanel() {
    const activeDeck = getActiveDeck();
    const rank = getRankInfo(playerData.rp);
    document.getElementById('hub-panel-play').innerHTML = `
    <div style="max-width:600px;margin:0 auto;padding:16px;display:flex;flex-direction:column;gap:16px">
      <div style="background:#1f2937;border-radius:16px;padding:20px;border:1px solid #374151">
        <div style="font-weight:900;color:white;font-size:1.1rem;margin-bottom:12px">🏆 Ranked Mode</div>
        ${activeDeck ? `
        ${(()=>{
          const normCards = normalizeDeckCards(activeDeck);
          const sets = [...new Set(normCards.map(c=>c.theme))];
          const mainEmoji = SETS_META[sets[0]]?.emoji || '🃏';
          const setsLabel = sets.map(s=>SETS_META[s]?.label||s).join(', ');
          return `
        <div style="background:#111827;border-radius:12px;padding:12px;margin-bottom:12px;border:2px solid #f97316">
          <div style="display:flex;align-items:center;gap:10px">
            <div style="font-size:2rem">${mainEmoji}</div>
            <div>
              <div style="font-weight:800;color:white">${activeDeck.name}</div>
              <div style="font-size:0.75rem;color:#9ca3af">${setsLabel} | ${normCards.length} ใบ</div>
            </div>
            <div style="margin-left:auto;font-size:0.75rem;background:#f97316;color:white;padding:2px 10px;border-radius:8px;font-weight:700">ACTIVE</div>
          </div>
        </div>`;
        })()}
        <div style="background:#111827;border-radius:10px;padding:10px;margin-bottom:12px;font-size:0.8rem;color:#9ca3af">
          ชนะ: +${rank.coinWin}🪙 +${rank.rpGain} RP | แพ้: -${rank.rpLoss} RP
        </div>
        <div style="display:flex;gap:8px">
          <button onclick="startRankedGame('${activeDeck.id}')" 
            style="flex:1;background:linear-gradient(135deg,#ea580c,#dc2626);color:white;font-weight:900;padding:14px;border-radius:14px;border:none;cursor:pointer;font-size:0.95rem;box-shadow:0 0 20px rgba(234,88,12,0.4)">
            🤖 Ranked AI
          </button>
          <button onclick="startRankedOnline('${activeDeck.id}')" 
            style="flex:1;background:linear-gradient(135deg,#7c3aed,#6d28d9);color:white;font-weight:900;padding:14px;border-radius:14px;border:none;cursor:pointer;font-size:0.95rem;box-shadow:0 0 20px rgba(124,58,237,0.4)">
            🌐 Ranked Online
          </button>
        </div>` : `
        <div style="text-align:center;color:#9ca3af;padding:20px">
          <div style="font-size:2rem;margin-bottom:8px">🃏</div>
          <div>ยังไม่มีเด็ค Active</div>
          <button onclick="showHubTab('deckbuilder')" style="margin-top:12px;background:#3730a3;color:white;border:none;padding:8px 20px;border-radius:10px;cursor:pointer">สร้างเด็คก่อน →</button>
        </div>`}
      </div>
      
      <div style="background:#1f2937;border-radius:16px;padding:20px;border:1px solid #374151">
        <div style="font-weight:900;color:white;font-size:1.1rem;margin-bottom:12px">⚡ Quick Play (ไม่มี RP)</div>
        <div style="display:flex;gap:6px;margin-bottom:12px">
          <button id="qp-btn-ai" onclick="setQPMode('ai')" style="flex:1;padding:8px;border-radius:8px;font-weight:700;font-size:13px;background:#166534;color:white;border:2px solid #4ade80;cursor:pointer">🤖 vs AI</button>
          <button id="qp-btn-online" onclick="setQPMode('online')" style="flex:1;padding:8px;border-radius:8px;font-weight:700;font-size:13px;background:#374151;color:white;border:2px solid transparent;cursor:pointer">🌐 Online</button>
        </div>
        <div id="qp-ai-options">
          <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-bottom:12px">
            <div>
              <label style="color:#9ca3af;font-size:0.75rem;display:block;margin-bottom:4px">ธีมของคุณ:</label>
              <select id="qp-player-theme" style="width:100%;background:#111827;color:white;border:1px solid #4b5563;padding:8px;border-radius:10px">
                ${Object.entries(SETS_META).filter(([k])=>typeof CardSets!=='undefined'&&CardSets[k]&&Object.keys(CardSets[k]).length>0).map(([k,v])=>`<option value="${k}">${v.emoji} ${v.label}</option>`).join('')}
              </select>
            </div>
            <div>
              <label style="color:#9ca3af;font-size:0.75rem;display:block;margin-bottom:4px">ธีม AI:</label>
              <select id="qp-ai-theme" style="width:100%;background:#111827;color:white;border:1px solid #4b5563;padding:8px;border-radius:10px">
                ${Object.entries(SETS_META).filter(([k])=>typeof CardSets!=='undefined'&&CardSets[k]&&Object.keys(CardSets[k]).length>0).map(([k,v])=>`<option value="${k}">${v.emoji} ${v.label}</option>`).join('')}
              </select>
            </div>
          </div>
          <button onclick="startQuickPlay()" style="width:100%;background:linear-gradient(135deg,#1d4ed8,#1e40af);color:white;font-weight:900;padding:12px;border-radius:14px;border:none;cursor:pointer;font-size:1rem">
            🎲 เริ่ม Quick Play vs AI
          </button>
        </div>
        <div id="qp-online-options" style="display:none">
          <div style="font-size:12px;color:#93c5fd;text-align:center;margin-bottom:8px">ว่างไว้ = สร้าง Room ใหม่ | ใส่ ID = Join เพื่อน</div>
          <div>
            <label style="color:#9ca3af;font-size:0.75rem;display:block;margin-bottom:4px">ธีมของคุณ:</label>
            <select id="qp-online-theme" style="width:100%;background:#111827;color:white;border:1px solid #4b5563;padding:8px;border-radius:10px;margin-bottom:8px">
              ${Object.entries(SETS_META).filter(([k])=>typeof CardSets!=='undefined'&&CardSets[k]&&Object.keys(CardSets[k]).length>0).map(([k,v])=>`<option value="${k}">${v.emoji} ${v.label}</option>`).join('')}
            </select>
          </div>
          <div style="display:flex;gap:6px;margin-bottom:8px">
            <input id="qp-room-input" placeholder="Room ID (ว่าง=สร้าง / ใส่=Join)"
              style="flex:1;background:#111827;color:white;padding:8px 10px;border-radius:8px;border:1px solid #4b5563;font-size:13px"/>
            <button onclick="copyQPRoomId()" style="background:#374151;color:white;padding:8px 12px;border-radius:8px;border:none;cursor:pointer">📋</button>
          </div>
          <div id="qp-online-status" style="text-align:center;font-size:12px;color:#fcd34d;min-height:18px;font-weight:600;margin-bottom:8px"></div>
          <button onclick="startQuickPlayOnline()" style="width:100%;background:linear-gradient(135deg,#0ea5e9,#0284c7);color:white;font-weight:900;padding:12px;border-radius:14px;border:none;cursor:pointer;font-size:1rem">
            🌐 เริ่ม Quick Play Online
          </button>
        </div>
      </div>
    </div>`;
}

function startQuickPlay() {
    const pTheme = document.getElementById('qp-player-theme')?.value || 'isekai_adventure';
    const aTheme = document.getElementById('qp-ai-theme')?.value || 'isekai_adventure';
    if (typeof selectedPlayerTheme !== 'undefined') selectedPlayerTheme = pTheme;
    if (typeof selectedAITheme !== 'undefined') selectedAITheme = aTheme;
    if (typeof gameMode !== 'undefined') gameMode = 'ai';
    _isRankedGame = false;
    _pendingCollectionDeck = null;
    document.getElementById('hub-screen').style.display = 'none';
    document.getElementById('game-screen').style.display = '';
    document.getElementById('theme-selector').style.display = 'none';
    if (typeof resetAndInitGame !== 'undefined') resetAndInitGame();
}

// ─── VIDEO AD FOR FREE PACK ──────────────────────────────────────
const VIDEO_AD_COOLDOWN_MS = 3 * 60 * 60 * 1000; // 3 hours
const VIDEO_AD_KEY = 'basebreak_video_ad_last';

function getVideoAdCooldownRemaining() {
    try {
        const last = parseInt(localStorage.getItem(VIDEO_AD_KEY) || '0');
        const remaining = VIDEO_AD_COOLDOWN_MS - (Date.now() - last);
        return remaining > 0 ? remaining : 0;
    } catch(e) { return 0; }
}

function formatCooldown(ms) {
    const s = Math.floor(ms/1000);
    const h = Math.floor(s/3600), m = Math.floor((s%3600)/60), sec = s%60;
    if (h > 0) return `${h}ชม. ${m}น.`;
    if (m > 0) return `${m}น. ${sec}ว.`;
    return `${sec}ว.`;
}

function updateVideoAdButton() {
    const btn = document.getElementById('watch-ad-btn');
    const txt = document.getElementById('video-ad-cooldown-txt');
    if (!btn) return;
    const rem = getVideoAdCooldownRemaining();
    if (rem > 0) {
        btn.disabled = true;
        btn.style.opacity = '0.4';
        btn.style.cursor = 'not-allowed';
        btn.textContent = '⏳ รอก่อน';
        if (txt) txt.textContent = `⏳ รับได้อีกใน ${formatCooldown(rem)}`;
    } else {
        btn.disabled = false;
        btn.style.opacity = '1';
        btn.style.cursor = 'pointer';
        btn.textContent = '▶ ดูเลย';
        if (txt) txt.textContent = '';
    }
}

function watchAdForPack() {
    if (getVideoAdCooldownRemaining() > 0) { showToast('⏳ รอ cooldown ก่อน!','#f87171'); return; }

    // Create fullscreen video overlay — ปิดไม่ได้ กดข้ามไม่ได้ จนกว่าวิดีโอจะจบ
    const overlay = document.createElement('div');
    overlay.id = 'video-ad-overlay';
    overlay.style.cssText = `
        position:fixed;inset:0;background:#000;z-index:99999;
        display:flex;flex-direction:column;align-items:center;justify-content:center;
    `;

    overlay.innerHTML = `
        <video id="ad-video" src="https://files.catbox.moe/1dtq5w.mp4"
            style="width:100%;height:100%;object-fit:cover;display:block"
            playsinline autoplay
            controlsList="nodownload nofullscreen noremoteplayback"
            disablePictureInPicture
            oncontextmenu="return false">
        </video>
        <div style="position:absolute;top:0;left:0;right:0;bottom:0;" oncontextmenu="return false"></div>
        <div style="position:absolute;top:16px;left:50%;transform:translateX(-50%);
            background:rgba(0,0,0,0.7);color:white;padding:8px 20px;border-radius:20px;
            font-size:0.85rem;font-weight:700;pointer-events:none;text-align:center">
            📺 ดูวิดีโอจนจบเพื่อรับ Basic Pack ฟรี 🪙150
        </div>
        <div id="ad-progress-bar" style="position:absolute;bottom:0;left:0;height:4px;width:0%;background:linear-gradient(90deg,#10b981,#34d399);transition:width 0.5s"></div>
        <div id="ad-timer-badge" style="position:absolute;bottom:14px;right:16px;
            background:rgba(0,0,0,0.75);color:#fbbf24;padding:6px 14px;border-radius:20px;
            font-size:0.9rem;font-weight:900;pointer-events:none">
            ⏳ ...
        </div>
    `;

    document.body.appendChild(overlay);

    // Block all interaction except the video itself
    overlay.addEventListener('click', e => { if(e.target.id!=='ad-video') e.stopPropagation(); }, true);
    overlay.addEventListener('touchstart', e => { if(e.target.id!=='ad-video') e.preventDefault(); }, {passive:false});
    document.addEventListener('keydown', blockKeys, true);

    const video = document.getElementById('ad-video');

    // Prevent seeking
    let maxTime = 0;
    video.addEventListener('timeupdate', () => {
        if (video.currentTime > maxTime + 0.5) {
            video.currentTime = maxTime;
        } else {
            maxTime = Math.max(maxTime, video.currentTime);
        }
        if (video.duration > 0) {
            const pct = (video.currentTime / video.duration) * 100;
            const bar = document.getElementById('ad-progress-bar');
            if (bar) bar.style.width = pct + '%';
            const rem = Math.ceil(video.duration - video.currentTime);
            const badge = document.getElementById('ad-timer-badge');
            if (badge) badge.textContent = rem > 0 ? `⏳ ${rem}ว.` : '✅ เสร็จแล้ว!';
        }
    });

    video.addEventListener('ended', () => {
        document.removeEventListener('keydown', blockKeys, true);
        overlay.remove();
        // Give reward
        localStorage.setItem(VIDEO_AD_KEY, Date.now().toString());
        const result = openPack('basic', packOpenerState.setName);
        if (!result.error) {
            packOpenerState.revealedCards = result.cards;
            packOpenerState.revealIndex = 0;
            showPackRevealModal(result.cards);
            updateHubUI();
            if (typeof renderPacksPanel !== 'undefined') renderPacksPanel();
            showToast('🎁 รับ Basic Pack ฟรีสำเร็จ!','#34d399');
        }
    });

    video.play().catch(() => {
        // autoplay blocked — show tap to play message
        const tap = document.createElement('div');
        tap.style.cssText = 'position:absolute;inset:0;display:flex;align-items:center;justify-content:center;cursor:pointer;z-index:2;';
        tap.innerHTML = '<div style="background:rgba(0,0,0,0.8);color:white;padding:24px 40px;border-radius:20px;font-size:1.2rem;font-weight:900;text-align:center">▶ แตะเพื่อเล่นวิดีโอ</div>';
        tap.onclick = () => { video.play(); tap.remove(); };
        overlay.appendChild(tap);
    });
}

function blockKeys(e) {
    // Block Escape and F5 during ad
    if (['Escape','F5'].includes(e.key)) e.preventDefault();
}

// ─── QUICK PLAY MODE TOGGLE ──────────────────────────────────────
let _qpMode = 'ai';
function setQPMode(mode) {
    _qpMode = mode;
    const aiBtn = document.getElementById('qp-btn-ai');
    const onlineBtn = document.getElementById('qp-btn-online');
    const aiOpts = document.getElementById('qp-ai-options');
    const onlineOpts = document.getElementById('qp-online-options');
    if (!aiBtn) return;
    if (mode === 'ai') {
        aiBtn.style.background = '#166534'; aiBtn.style.border = '2px solid #4ade80';
        onlineBtn.style.background = '#374151'; onlineBtn.style.border = '2px solid transparent';
        aiOpts.style.display = ''; onlineOpts.style.display = 'none';
    } else {
        onlineBtn.style.background = '#1e3a5f'; onlineBtn.style.border = '2px solid #3b82f6';
        aiBtn.style.background = '#374151'; aiBtn.style.border = '2px solid transparent';
        aiOpts.style.display = 'none'; onlineOpts.style.display = '';
    }
}

function startQuickPlayOnline() {
    const theme = document.getElementById('qp-online-theme')?.value || 'isekai_adventure';
    const roomId = document.getElementById('qp-room-input')?.value?.trim() || '';
    _isRankedGame = false;
    _pendingCollectionDeck = null;
    if (typeof selectedPlayerTheme !== 'undefined') selectedPlayerTheme = theme;
    if (typeof gameMode !== 'undefined') gameMode = 'online';
    document.getElementById('hub-screen').style.display = 'none';
    document.getElementById('game-screen').style.display = '';
    const ts = document.getElementById('theme-selector');
    if (ts) {
        ts.style.display = '';
        if (typeof selectMode !== 'undefined') selectMode('online');
        setTimeout(() => {
            const roomInput = document.getElementById('room-id-input');
            if (roomInput && roomId) { roomInput.value = roomId; if (typeof toggleP2ThemeOnline !== 'undefined') toggleP2ThemeOnline(roomId); }
            const p2theme = document.getElementById('p2-online-theme');
            if (p2theme) p2theme.value = theme;
        }, 100);
    }
}

function copyQPRoomId() {
    const v = document.getElementById('qp-room-input')?.value;
    if (v) { navigator.clipboard?.writeText(v); showToast('คัดลอก Room ID แล้ว 📋'); }
    else showToast('ยังไม่มี Room ID', '#f87171');
}

// ─── RANKED ONLINE ────────────────────────────────────────────────
function startRankedOnline(deckId) {
    const deck = playerData.decks.find(d => d.id === deckId);
    if (!deck) { alert('ไม่พบเด็ค'); return; }
    _pendingCollectionDeck = normalizeDeckCards(deck);
    _collectionDeckUsed = false;
    _isRankedGame = true;
    // Derive main theme from most-used set
    const themeCount = {};
    _pendingCollectionDeck.forEach(c => themeCount[c.theme]=(themeCount[c.theme]||0)+1);
    const mainTheme = Object.entries(themeCount).sort((a,b)=>b[1]-a[1])[0]?.[0] || 'isekai_adventure';
    if (typeof selectedPlayerTheme !== 'undefined') selectedPlayerTheme = mainTheme;
    if (typeof gameMode !== 'undefined') gameMode = 'online';
    document.getElementById('hub-screen').style.display = 'none';
    document.getElementById('game-screen').style.display = '';
    const ts = document.getElementById('theme-selector');
    if (ts) {
        ts.style.display = '';
        if (typeof selectMode !== 'undefined') selectMode('online');
        setTimeout(() => {
            // Set theme values silently
            const ptSel = document.getElementById('player-theme');
            if (ptSel) ptSel.value = mainTheme;
            const p2theme = document.getElementById('p2-online-theme');
            if (p2theme) p2theme.value = mainTheme;

            // Hide theme-select row + mode buttons — deck handles theme, user just needs Room ID
            const themeRow = ptSel?.parentElement?.parentElement;
            if (themeRow) themeRow.style.display = 'none';
            const modeRow = document.getElementById('btn-mode-ai')?.parentElement;
            if (modeRow) modeRow.style.display = 'none';

            // Inject deck info strip (remove old one if any)
            const existingStrip = document.getElementById('ranked-deck-strip');
            if (existingStrip) existingStrip.remove();
            const normCards = _pendingCollectionDeck;
            const sets = [...new Set(normCards.map(c=>c.theme))];
            const setsLabel = sets.map(s => (typeof SETS_META!=='undefined'&&SETS_META[s]) ? SETS_META[s].emoji+' '+SETS_META[s].label : s).join(' · ');
            const strip = document.createElement('div');
            strip.id = 'ranked-deck-strip';
            strip.style.cssText = 'width:100%;background:linear-gradient(135deg,#1a1a2e,#1e3a5f);border:2px solid #f97316;border-radius:12px;padding:10px 14px;display:flex;align-items:center;gap:10px;box-sizing:border-box';
            strip.innerHTML = `<div style="font-size:1.4rem">🃏</div><div style="flex:1;min-width:0"><div style="font-weight:900;color:white;font-size:0.9rem;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${deck.name}</div><div style="font-size:0.7rem;color:#9ca3af">${setsLabel} | ${normCards.length} ใบ</div></div><div style="font-size:0.65rem;background:#f97316;color:white;padding:2px 8px;border-radius:6px;font-weight:800">RANKED</div>`;
            // Insert strip before online-panel
            const onlinePanel = document.getElementById('online-panel');
            if (onlinePanel) ts.insertBefore(strip, onlinePanel);
            else ts.prepend(strip);
        }, 100);
    }
}

// ─── REDEEM CODE ──────────────────────────────────────────────────
const REDEEM_CODES = {
    'SUN888':  { gold: 2000, label: '☀️ Sun 888' },
    'RICHAF':  { gold: 9999, label: '💰 รวยไม่ไหวแล้วโว้ย' },
};
const REDEEM_USED_KEY = 'basebreak_redeem_used';

function getUsedCodes() {
    try { return JSON.parse(localStorage.getItem(REDEEM_USED_KEY) || '[]'); } catch(e) { return []; }
}
function markCodeUsed(code) {
    const used = getUsedCodes();
    used.push(code);
    localStorage.setItem(REDEEM_USED_KEY, JSON.stringify(used));
}

function openRedeemModal() {
    let modal = document.getElementById('redeem-modal');
    if (!modal) {
        modal = document.createElement('div');
        modal.id = 'redeem-modal';
        modal.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,0.85);z-index:2000;display:flex;align-items:center;justify-content:center;';
        modal.innerHTML = `
          <div style="background:#111827;border-radius:20px;border:2px solid #fbbf24;padding:28px 24px;max-width:380px;width:92%;text-align:center">
            <div style="font-size:1.5rem;font-weight:900;color:#fbbf24;margin-bottom:6px">🎁 กรอกโค้ดรับของ</div>
            <div style="font-size:0.8rem;color:#9ca3af;margin-bottom:18px">ใส่โค้ดแล้วกดรับ — ใช้ได้ครั้งเดียวต่อบัญชี</div>
            <input id="redeem-input" placeholder="ใส่โค้ดที่นี่..."
              style="width:100%;background:#1f2937;color:white;border:2px solid #374151;border-radius:10px;padding:12px 14px;font-size:1rem;margin-bottom:10px;text-align:center;box-sizing:border-box;text-transform:uppercase"
              oninput="this.value=this.value.toUpperCase()"
              onkeydown="if(event.key==='Enter')redeemCode()"/>
            <div id="redeem-msg" style="min-height:22px;font-size:0.85rem;font-weight:700;margin-bottom:12px"></div>
            <div style="display:flex;gap:8px">
              <button onclick="redeemCode()" style="flex:1;background:linear-gradient(135deg,#d97706,#b45309);color:white;font-weight:900;padding:12px;border-radius:10px;border:none;cursor:pointer;font-size:1rem">✅ รับของ</button>
              <button onclick="document.getElementById('redeem-modal').remove()" style="flex:1;background:#374151;color:#9ca3af;padding:12px;border-radius:10px;border:none;cursor:pointer;font-size:0.9rem">✕ ปิด</button>
            </div>
          </div>`;
        document.body.appendChild(modal);
    }
    modal.style.display = 'flex';
    setTimeout(() => document.getElementById('redeem-input')?.focus(), 100);
}

function redeemCode() {
    const raw = document.getElementById('redeem-input')?.value?.trim().toUpperCase().replace(/\s+/g,'');
    const msg = document.getElementById('redeem-msg');
    if (!raw) { msg.style.color='#f87171'; msg.textContent='⚠️ กรุณาใส่โค้ด'; return; }
    const used = getUsedCodes();
    if (used.includes(raw)) { msg.style.color='#f87171'; msg.textContent='❌ โค้ดนี้ใช้ไปแล้ว'; return; }
    const reward = REDEEM_CODES[raw];
    if (!reward) { msg.style.color='#f87171'; msg.textContent='❌ โค้ดไม่ถูกต้อง'; return; }
    // Apply reward
    if (reward.gold) playerData.coins += reward.gold;
    saveData();
    markCodeUsed(raw);
    updateHubUI();
    msg.style.color='#4ade80';
    msg.textContent=`🎉 รับ ${reward.label} สำเร็จ! +${reward.gold||0} Gold`;
    document.getElementById('redeem-input').value = '';
    showToast(`🎁 ${reward.label} — +${reward.gold||0} Gold!`, '#fbbf24');
}

// ─── TOAST ───────────────────────────────────────────────────────
function showToast(msg, color='#4ade80') {
    const t = document.createElement('div');
    t.style.cssText = `position:fixed;bottom:100px;left:50%;transform:translateX(-50%);
        background:#1f2937;color:${color};border:2px solid ${color};
        padding:10px 24px;border-radius:12px;font-weight:800;z-index:9999;
        animation:toastIn 0.3s ease;font-size:0.9rem;white-space:nowrap`;
    t.textContent = msg;
    document.body.appendChild(t);
    setTimeout(() => t.remove(), 2200);
}

// ─── INIT ────────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
    checkCollectionMilestones(); // auto-grant Altair if conditions already met
    updateHubUI();
    showHubTab('home');
});
