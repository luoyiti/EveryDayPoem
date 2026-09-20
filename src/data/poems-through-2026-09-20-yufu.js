import { poems as previousPoems } from "./poems-through-2026-09-19-tashaxing.js";

export const poems = [
  {
    id: "chenzui-yufu-autumn",
    layout: "chenzui-yufu-autumn",
    title: "沉醉东风·渔父",
    author: "白朴",
    dynasty: "元",
    genre: "曲",
    form: "双调·沉醉东风（小令）",
    learnedAt: "2026.09.20",
    image: "/assets/poems/yufu-autumn-river.webp",
    lines: [
      "黄芦岸白蘋渡口，",
      "绿杨堤红蓼滩头。",
      "虽无刎颈交，",
      "却有忘机友。",
      "点秋江白鹭沙鸥，",
      "傲煞人间万户侯，",
      "不识字烟波钓叟。"
    ],
    notes: [
      { term: "黄芦 · 白蘋 · 渡口", text: "黄芦是秋日水边转黄的芦苇；白蘋（pín）是生于浅水湿地的水生植物。开句先定下秋江渡口，又用黄、白两色把岸与水分开。" },
      { term: "绿杨 · 红蓼 · 滩头", text: "红蓼是水边常见草本，秋日花穗泛红。黄芦、白蘋与绿杨、红蓼两句成对，把一处渔父栖身的水岸写得明净而有层次。" },
      { term: "刎颈交", text: "指可以同生死、共患难的朋友，典出廉颇、蔺相如“刎颈之交”的故事。曲中说“虽无”，先主动放下世俗交游的尺度。" },
      { term: "忘机友", text: "“机”指机心、巧诈；“忘机”即没有算计之心。“却有”承接上句转折，朋友不必以权势和利害维系，也可理解为与自然相亲的伙伴。" },
      { term: "点 · 白鹭 · 沙鸥", text: "“点”把秋江上零星飞落的白鹭、沙鸥写成活动的亮点。它既回应前面的“忘机友”，也让前两句的静态色彩忽然有了动势。" },
      { term: "傲煞 · 万户侯", text: "“傲煞”即极其轻视、傲视；“万户侯”本指享有万户食邑的侯爵，这里泛指显贵。维基文库所据《全元曲》数字本作“傲杀”，本页从香港教育局整理本作“傲煞”。" },
      { term: "烟波 · 钓叟", text: "“烟波”指烟雾笼罩的水面；“钓叟”是垂钓老人。结尾以“不识字”与“万户侯”相对，不在知识多少上立论，而以一个远离功名秩序的渔父形象收束全曲。" }
    ],
    translation: "秋日渡口旁是转黄的芦苇和白蘋，河堤、滩头又有绿杨与红蓼相映。虽然没有可以同生共死的显赫知交，却有彼此没有机心的朋友；秋江上点点白鹭、沙鸥，正自在相伴。那烟波里垂钓的老人，竟足以傲视人间的万户侯——他不识字，也不把富贵功名放在心上。",
    appreciation: "这支小令先把秋江铺成四色图景：黄芦、白蘋、绿杨、红蓼相互映衬，静景中又由“点”字引出白鹭沙鸥的飞动。中间“虽无—却有”一转，把世俗的生死之交换成无机心的自然伙伴。末两句才推出烟波钓叟，以“不识字”对“万户侯”，不是赞美无知，而是借渔父形象反衬功名富贵，收束到淡泊自适的价值选择。",
    studyCopy: {
      dictationTitle: "从四色水岸，写到烟波钓叟",
      dictationSuccess: "七句无误：黄白绿红、刎颈与忘机、鸥鹭、万户侯和钓叟都已归位。",
      recitationHint: "按“黄白岸—绿红滩—无刎颈—有忘机—鸥鹭—万户侯—钓叟”七层记。"
    },
    sources: [
      { title: "维基文库《沉醉东风（白朴）》", url: "https://zh.wikisource.org/zh-hans/沉醉東風_(白樸)", note: "据《全元曲》数字整理，核对曲牌、作者、正文及“傲杀”等异文。" },
      { title: "香港教育局《沉醉东风·渔父词》", url: "https://www.edb.gov.hk/attachment/tc/curriculum-development/kla/chi-edu/recommended-passages/KS4_18b.pdf", note: "核对“傲煞”正文、体裁说明与白蘋、红蓼、忘机等注释。" }
    ]
  },
  ...previousPoems
];

export const poemsById = Object.fromEntries(poems.map((poem) => [poem.id, poem]));
