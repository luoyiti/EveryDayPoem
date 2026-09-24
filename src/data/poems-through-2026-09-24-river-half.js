import { poems as previousPoems } from "./poems-through-2026-09-24-shuixianzi.js";

export const poems = [
  {
    id: "river-half-sunset",
    layout: "river-half-light",
    title: "书河上亭壁",
    author: "寇准",
    dynasty: "宋",
    genre: "诗",
    form: "七言绝句（《河上亭壁》四绝之一）",
    learnedAt: "2026.09.24",
    image: "/assets/poems/he-shang-pavilion-sunset.webp",
    lines: [
      "岸阔樯稀浪渺茫，独凭危槛思何长。",
      "萧萧远树疏林外，一半秋山带夕阳。"
    ],
    notes: [
      { term: "岸阔 · 樯稀 · 浪渺茫 · 危槛", text: "“樯”是船桅；“危”有高意，“危槛”即高处栏杆。首句用“阔、稀、渺茫”连续拉开河面尺度，第二句再以“独凭”把人的身影压到辽阔景物之中。四库本《石仓历代诗选》作“浪渺茫”，今人通行整理本常作“波渺茫”。" },
      { term: "萧萧 · 疏林 · 一半秋山", text: "“萧萧”写秋风吹动远树的声势与疏落感；“疏林外”把视线再推向更远的山。“一半秋山带夕阳”不是把整座山照亮，而只留半山斜照，使暮色与余光同时存在。" }
    ],
    translation: "河岸宽阔，水上船桅稀少，茫茫波浪向远处展开。我独自倚着高亭的栏杆，思绪也仿佛被拉得很长。秋风吹动远树，疏林之外仍有层层山色；将落的夕阳只照着半面秋山。",
    appreciation: "这首绝句几乎只用远近层次制造秋意。首句把岸之阔、樯之稀与烟浪的渺茫叠在一起，空间越开，独凭危槛的身影越显孤单。后两句继续把视线推过疏林，直到夕阳只照亮半面秋山。妙处正在“一半”：光没有彻底熄灭，景物也没有被情绪吞没，苍茫与温度因此同时停在画面里。",
    studyCopy: {
      dictationTitle: "从阔河写到半山夕阳",
      dictationSuccess: "两联都已归位：阔岸危槛、疏林半山。",
      recitationHint: "先记“岸阔—樯稀—危槛”，再记“远树—疏林—半山夕阳”。"
    },
    sources: [
      { title: "《石仓历代诗选》四库全书本·卷一百二十四", url: "https://zh.wikisource.org/zh-hans/%E7%9F%B3%E5%80%89%E6%AD%B7%E4%BB%A3%E8%A9%A9%E9%81%B8_(%E5%9B%9B%E5%BA%AB%E5%85%A8%E6%9B%B8%E6%9C%AC)/%E5%85%A8%E8%A6%BD5", note: "核对寇准、组诗小序及秋篇全文；正文据此采用“岸阔樯稀浪渺茫”。" },
      { title: "古文岛《书河上亭壁》", url: "https://m.gushiwen.cn/shiwenv_10086b1c2cc6.aspx", note: "交叉核对题名、作者与全诗；该整理本首句作“波渺茫”，并标明“波 一作：浪”，本页不混拼两种异文。" }
    ]
  },
  ...previousPoems
];

export const poemsById = Object.fromEntries(poems.map((poem) => [poem.id, poem]));
