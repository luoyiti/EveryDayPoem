import { poems as previousPoems } from "./poems-through-2026-09-21-cold-spring.js";

export const poems = [
  {
    id: "lushan-mountain-walk",
    layout: "lushan-mountain-walk",
    title: "鲁山山行",
    author: "梅尧臣",
    dynasty: "宋",
    genre: "诗",
    form: "五言律诗",
    learnedAt: "2026.09.21",
    image: "/assets/poems/lushan-mountain-trail.webp",
    lines: [
      "适与野情惬，千山高复低。",
      "好峰随处改，幽径独行迷。",
      "霜落熊升树，林空鹿饮溪。",
      "人家在何许？云外一声鸡。"
    ],
    notes: [
      { term: "适 · 野情 · 惬", text: "“适”是恰好、正好；“野情”指亲近山野的兴味；“惬”是称心、合意。起联不先交代行程，而从人的感受落笔：高低起伏的群山恰与游者的山野情怀相合。" },
      { term: "随处改 · 幽径 · 迷", text: "“随处改”写行走中观察角度不断变化，同一片山峰因此显出新的形态；“幽径”是僻静山路。“独行迷”既是路径曲折，也把读者的视点真正带入山中。" },
      { term: "霜落 · 熊升树 · 林空", text: "“霜落”点出深秋或初冬的寒意；树叶凋落后树林显得疏空，于是熊攀树、鹿临溪这些原本隐在密林里的活动都进入视野。这里写的是山野生命，并非猎奇铺陈。" },
      { term: "何许 · 云外 · 一声鸡", text: "“何许”即何处。诗人看不见人家，只听见云雾之外传来一声鸡鸣；视觉在这里忽然让位给听觉。最后不把村落直接写出，反而让“有人烟”因不可见而显得更远。" }
    ],
    translation: "正好这片山野很合我的心意，眼前群山一重重高低起伏。一路走去，秀丽的峰峦随着脚步和视角不断变换，幽深的小径又让独行的人渐渐辨不清方向。秋霜已降，林木疏落，可以看见熊攀上树，也看见鹿在溪边饮水。山中人家究竟在哪里？没有屋舍进入眼帘，只从云雾之外传来一声鸡鸣。",
    appreciation: "这首五律把“山行”写成视点不断移动的过程。首联先见群山高低，颔联随脚步转峰入径；颈联在霜后疏林中忽然看见熊、鹿，使静山有了生命。尾联尤其含蓄：诗人看不见人家，只听见云外鸡鸣，画面由近而远、感官由视觉转为听觉。一个“迷”字与一声鸡鸣前后照应，让幽深山境既隔绝又有人间气息。",
    studyCopy: {
      dictationTitle: "沿四联山径，记住最后一声鸡",
      dictationSuccess: "四联无误：群山、转峰、霜林与云外鸡声都已归位。",
      recitationHint: "按“群山高低—好峰改路—熊鹿霜林—云外鸡鸣”四步记。"
    },
    sources: [
      { title: "识典古籍《宛陵先生集·鲁山山行》", url: "https://www.shidianguji.com/book/SBCK199/chapter/SBCK199_380", note: "据《宛陵先生集》数字整理核对题名、作者与八句正文，本页正文以此系统为主。" },
      { title: "维基文库《梅尧臣集/卷07》", url: "https://zh.wikisource.org/zh-hans/梅尧臣集/卷07", note: "交叉核对《鲁山山行》在梅尧臣诗集中的卷次与通行文本。" }
    ]
  },
  ...previousPoems
];

export const poemsById = Object.fromEntries(poems.map((poem) => [poem.id, poem]));
