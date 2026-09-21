import { poems as previousPoems } from "./poems-through-2026-09-21-lushan.js";

export const poems = [
  {
    id: "ehu-recovery",
    layout: "ehu-evening-fold",
    title: "鹧鸪天·鹅湖归病起作",
    author: "辛弃疾",
    dynasty: "宋",
    genre: "词",
    form: "鹧鸪天",
    learnedAt: "2026.09.22",
    image: "/assets/poems/ehu-recovery-dusk.webp",
    lines: [
      "枕簟溪堂冷欲秋，断云依水晚来收。",
      "红莲相倚浑如醉，白鸟无言定自愁。",
      "书咄咄，且休休。一丘一壑也风流。",
      "不知筋力衰多少，但觉新来懒上楼。"
    ],
    notes: [
      { term: "枕簟 · 溪堂 · 断云", text: "“簟”是竹席；“溪堂”是临水的堂舍。“冷欲秋”写暑气将退、凉意先到。“断云”即片云，“晚来收”写傍晚云气渐渐敛去。" },
      { term: "浑如醉 · 无言 · 定自愁", text: "“浑如”即简直像；“无言”是不鸣。词人把“醉”与“愁”投向红莲、白鸟，眼前景物因此带上病后静观时的主观情绪。" },
      { term: "书咄咄 · 且休休 · 一丘一壑", text: "“书咄咄”用殷浩被废后书空“咄咄怪事”的典故；“休休”关联司空图休休亭故事。“一丘一壑”指可供栖隐的山水，由不平转向自我排解。" },
      { term: "筋力 · 但 · 懒上楼", text: "“筋力”指体力、精力；“但”是只。题目点明“病起”，结尾不作高声议论，只以近来懒得登楼这一身体动作，写出病后真实的衰疲。" }
    ],
    translation: "溪堂的枕席已经透出近秋的凉意，傍晚片云贴着水面渐渐收尽。红莲彼此倚靠，仿佛醉了；白鸟静默不鸣，像独自在发愁。与其像殷浩那样书空叹怪，不如暂且休歇，一丘一壑自有可赏的风流。病后不知体力衰退了多少，只觉得近来连上楼也懒了。",
    appreciation: "上片从触觉的“冷”写到暮云、红莲、白鸟，景物由远及近，却处处被词人的心绪染色：莲似醉，鸟似愁。下片忽以“书咄咄”“且休休”两典把失意转成自我排解，“一丘一壑”看似旷达，末句却落回病后身体的真实感受。“懒上楼”不作高声悲叹，只用一个日常动作写出志意、年龄与体力同时受阻的沉重，含蓄而有余味。",
    studyCopy: {
      dictationTitle: "从溪堂初凉，写到最后一步楼梯",
      dictationSuccess: "四段无误：暮云、红莲白鸟、丘壑与止步都已归位。",
      recitationHint: "按“初凉收云—莲醉鸟愁—咄咄休休—病后懒楼”四层记。"
    },
    sources: [
      { title: "识典古籍《稼轩长短句（稼轩词）·鹅湖归病起作》", url: "https://www.shidianguji.com/book/SDZJ0058/chapter/1lx9fx6k6n8cq", note: "据《稼轩长短句》数字整理核对题名、作者与全文，本页正文以此文本为主。" },
      { title: "古文岛《鹧鸪天·鹅湖归病起作》", url: "https://www.gushiwen.cn/GuShiWen_b40f410ca1.aspx", note: "交叉核对全文，并参考词牌、簟、溪堂、浑如、咄咄等基础注释。" },
      { title: "《北京大学学报（哲学社会科学版）》〈读稼轩词札记〉", url: "https://ccj.pku.edu.cn/Article/DownLoad?id=271012639&type=ArticleFile", note: "参考对“一丘一壑”等词义与前人阐释的辨析，避免把景物简单坐实为政治象征。" }
    ]
  },
  ...previousPoems
];

export const poemsById = Object.fromEntries(poems.map((poem) => [poem.id, poem]));
