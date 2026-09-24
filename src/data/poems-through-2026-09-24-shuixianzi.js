import { poems as previousPoems } from "./poems-through-2026-09-23-yingfu.js";

export const poems = [
  {
    id: "shuixianzi-jiangnan",
    layout: "jiangnan-water-ribbon",
    title: "水仙子·咏江南",
    author: "张养浩",
    dynasty: "元",
    genre: "曲",
    form: "双调·水仙子（小令）",
    learnedAt: "2026.09.24",
    image: "/assets/poems/shuixianzi-jiangnan.webp",
    lines: [
      "一江烟水照晴岚，两岸人家接画檐。",
      "芰荷丛一段秋光淡。看沙鸥舞再三。",
      "卷香风十里珠帘。画船儿天边至。",
      "酒旗儿风外飐。爱杀江南！"
    ],
    notes: [
      { term: "烟水 · 晴岚 · 画檐", text: "“烟水”是烟霭笼罩的江面；“岚”指山间雾气。开篇先写满江水气与晴日山岚，再把镜头推近到两岸相接的彩绘屋檐，江天与人家同入一幅长卷。" },
      { term: "芰荷 · 秋光淡 · 再三", text: "“芰”是菱，“芰荷”合指菱叶、荷叶一类水生植物；“秋光淡”写秋色清浅疏淡。“再三”不是三次，而是反复、多次，沙鸥的翻飞使静景有了节奏。" },
      { term: "卷香风 · 珠帘 · 画船", text: "“卷香风十里珠帘”语序峭拔，可理解为香风掠过十里人家珠帘；“画船”是装饰华美的游船。嗅觉与视觉在这里相接，远处船只又把视线带回江面。" },
      { term: "飐 · 爱杀", text: "“飐”指风吹物体轻轻摆动，这里写酒旗临风招展；“杀”是程度补语，“爱杀”即爱煞、极爱。全曲直到末句才直接落到情感，让此前的白描突然收束为一句赞叹。" }
    ],
    translation: "满江烟霭与晴日山岚相互映照，两岸人家的彩绘屋檐仿佛接连不断。菱叶荷叶成片铺开，秋色显得清淡；沙鸥一次次在水面翻飞。带着香气的风掠过十里珠帘，装饰华美的游船仿佛从天边驶来。酒旗在风外轻轻招展——真让人爱煞这江南。",
    appreciation: "这支小令几乎不写“我”，只让江南自己展开：烟水与晴岚先铺远景，画檐和芰荷把视线收近，沙鸥、香风、画船、酒旗又依次把静景吹动。最妙的是结尾“爱杀江南”，此前层层白描在这一句忽然有了观看者的温度。张养浩把秋写得清淡而明丽，也让水乡的自然与人间烟火在同一条江面上相接。",
    studyCopy: {
      dictationTitle: "沿一江烟水，写出八层江南",
      dictationSuccess: "四段全对：烟岚、芰荷、香风、酒旗都已归位。",
      recitationHint: "按“烟水画檐—芰荷沙鸥—香风画船—酒旗爱杀”四段记。"
    },
    sources: [
      { title: "古文岛《水仙子·咏江南》", url: "https://m.gushiwen.cn/mingju/juv_b50d1585804c.aspx", note: "核对张养浩、元代、小令题名及完整正文；采用“芰荷丛一段秋光淡”“酒旗儿风外飐”文本。" },
      { title: "弥勒市人民政府《诗意栖居红河水乡》", url: "https://www.hhml.gov.cn/info/5181/59721.htm", note: "政府文化文章引用本曲前半，交叉核对“一江烟水照晴岚”“两岸人家接画檐”“芰荷丛一段秋光淡”等关键句。" },
      { title: "华东师范大学《江南文化景观中的海派剪纸》", url: "https://www.ecnu.edu.cn/info/1095/3800.htm", note: "校方转载文汇报文章引用开篇两句，用于再次核对作品的江南水乡意象与字句。" }
    ]
  },
  ...previousPoems
];

export const poemsById = Object.fromEntries(poems.map((poem) => [poem.id, poem]));
