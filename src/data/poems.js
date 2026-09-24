import { poems as previousPoems } from "./poems-through-2026-09-24-river-half.js";

export const poems = [
  {
    id: "tashaxing-mei-can",
    layout: "spring-water-distance",
    title: "踏莎行·候馆梅残",
    author: "欧阳修",
    dynasty: "宋",
    genre: "词",
    form: "踏莎行（词牌）",
    learnedAt: "2026.09.25",
    image: "/assets/poems/tashaxing-mei-can-spring-road.webp",
    lines: [
      "候馆梅残，溪桥柳细，草薰风暖摇征辔。离愁渐远渐无穷，迢迢不断如春水。",
      "寸寸柔肠，盈盈粉泪，楼高莫近危栏倚。平芜尽处是春山，行人更在春山外。"
    ],
    notes: [
      { term: "候馆 · 梅残 · 柳细 · 征辔", text: "“候馆”指旅途中歇宿的馆舍；“征辔”是行旅中马的缰辔。开篇连续写残梅、细柳、薰草与暖风，明明是春意渐盛，却把镜头放在不断向前的行程上，为后面的离愁蓄势。" },
      { term: "柔肠 · 粉泪 · 危栏 · 平芜 · 春山外", text: "下片转入设想中的闺中视角。“平芜”是平远的草野，“危栏”指高楼栏杆。不要登高远望，因为草野尽处还有春山，而行人已经在春山之外；视线越推越远，思念反而越显迫近。" }
    ],
    translation: "旅舍旁的梅花已经残谢，溪桥边柳丝初长，草木散发暖香，春风吹动远行人的马辔。人走得越远，离愁反而越没有尽头，像绵延不断的春水。想来那留居之人此刻柔肠寸断、泪痕盈盈；不要登高倚栏远望吧，平野尽头仍是春山，而远行的人已经到了春山之外。",
    appreciation: "这首词的妙处在于视角突然易位。上片随行人向远处推进：梅残、柳细、草薰风暖，本是明媚春景，却被“渐远渐无穷”的离愁拉成长长春水。下片不再直写行人，而设想楼中人远望；平芜尽处尚有春山，行人又在山外。空间被一层层推远，思念反而因此更近。",
    studyCopy: {
      dictationTitle: "从候馆写到春山之外",
      dictationSuccess: "上下两片都已归位：行路渐远，目光更远。",
      recitationHint: "按“候馆溪桥—春水离愁—柔肠粉泪—春山外”四个节点记。"
    },
    sources: [
      { title: "维基文库《踏莎行（欧阳修）》", url: "https://zh.wikisource.org/zh/%E8%B8%8F%E8%8E%8E%E8%A1%8C_%28%E6%AD%90%E9%99%BD%E4%BF%AE%29", note: "核对作者、词牌与全文；正文采用“草薰风暖摇征辔”“楼高莫近危栏倚”文本。" },
      { title: "《六一词》", url: "https://zh.wikisource.org/zh/%E5%85%AD%E4%B8%80%E8%A9%9E", note: "以欧阳修词集数字本再次核对全文及上下片次序。" },
      { title: "云南日报《试论欧阳修词作中的“悬拟”手法》", url: "https://www.ynxc.gov.cn/html/2025/shekedongtai_0317/3021290.html", note: "全文引录本词并讨论上片行人、下片悬想居者的双重视角，用于核对章法解释。" }
    ]
  },
  ...previousPoems
];

export const poemsById = Object.fromEntries(poems.map((poem) => [poem.id, poem]));
