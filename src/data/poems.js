import { poems as basePoems } from "./poems-base.js";

export const poems = [
  {
    id: "qiupu-road",
    layout: "qiupu-road",
    title: "秋浦途中",
    author: "杜牧",
    dynasty: "唐",
    learnedAt: "2026.08.30",
    image: "/assets/poems/qiupu-rain-texture.webp",
    lines: ["萧萧山路穷秋雨", "淅淅溪风一岸蒲", "为问寒沙新到雁", "来时还下杜陵无"],
    notes: [
      { term: "萧萧 · 穷秋", text: "“萧萧”写秋雨的声势；“穷秋”即深秋、晚秋。首句把行旅放进连绵雨声与山路之中。" },
      { term: "淅淅 · 蒲", text: "“淅淅”形容溪风吹拂的细碎声响；“蒲”指水边蒲草。《全唐诗》卷五百二十三另录“一片蒲”异文，本页采用“一岸蒲”的通行版本。" },
      { term: "寒沙 · 新到雁", text: "“寒沙”指秋日清冷的沙洲；“新到雁”是新近飞抵此地的雁群。诗到这里从脚下山路忽然抬头望向远空。" },
      { term: "杜陵 · 无", text: "杜陵在长安东南，杜牧家族旧居与樊川故园都在这一带。“无”用于句末发问，相当于“否”，问归雁来时是否经过故园。" },
    ],
    translation: "深秋的山路上，秋雨萧萧不尽；溪边的风淅淅吹过一岸蒲草。我想问问刚落在寒冷沙洲上的雁群：你们南来时，可曾经过长安杜陵一带？",
    appreciation: "前两句先把旅途压进细密的声响：山路秋雨萧萧，溪风掠过蒲草淅淅，视线贴近湿冷的地面。后两句忽然抬头问雁，空间由眼前秋浦一下跨回长安杜陵。诗人没有直说乡愁，只把问题交给南来的雁群；一个“问”字让风雨中的孤行有了遥远的方向，也使前景的寒意转成对故园的惦念。",
    studyCopy: {
      dictationTitle: "沿雨声走到杜陵",
      dictationSuccess: "四句无误，山路、溪风、新雁与杜陵已经连成一条归路。",
      recitationHint: "先记“雨—风—雁—杜陵”四个节点，再从脚下山路一路抬头到远方。",
    },
  },
  ...basePoems,
];

export const poemsById = Object.fromEntries(poems.map((poem) => [poem.id, poem]));
