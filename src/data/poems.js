import { poems as previousPoems } from "./poems-through-2026-09-10-guitian.js";

export const poems = [
  {
    id: "autumn-night-alone",
    layout: "autumn-night-listening",
    title: "秋夜独坐",
    author: "王维",
    dynasty: "唐",
    genre: "诗",
    form: "五言律诗（一作《冬夜书怀》）",
    learnedAt: "2026.09.11",
    image: "/assets/poems/autumn-night-alone.webp",
    lines: [
      "独坐悲双鬓，空堂欲二更。",
      "雨中山果落，灯下草虫鸣。",
      "白发终难变，黄金不可成。",
      "欲知除老病，唯有学无生。"
    ],
    notes: [
      { term: "双鬓 · 欲二更", text: "“双鬓”点出鬓发已白。“欲二更”是将近二更；二更约在夜间九时至十一时。首联以独坐、空堂和渐深的夜色，把衰老之感压进极静的室内。" },
      { term: "山果落 · 草虫鸣", text: "“山果”指山中的野果；“草虫”指草丛间的小虫。雨中果实坠落、灯下虫声细起，两个微小声音把空堂之外与灯影之内连接起来。" },
      { term: "白发 · 黄金不可成", text: "“黄金”在传统注释中联系方士炼丹、求长生之说。《史记·封禅书》记栾大曾妄称“黄金可成”等术。此联以白发不可逆与方术不可恃相对。" },
      { term: "老病 · 无生", text: "“老病”即衰老与疾病；“无生”为佛家语。末联不再向外求驻年之术，而把答案转向对生灭的理解，完成全诗由听夜、叹老到观念上的收束。" }
    ],
    translation: "独自坐着，看着双鬓斑白而心生感慨；空荡的堂中，夜已将近二更。雨里不时传来山中野果坠落的声音，灯下草虫细细鸣叫。白发终究难再变黑，求取长生的炼金方术也不可凭恃。若问怎样面对衰老和病苦，诗人最后把答案落在佛家“无生”之学上。",
    appreciation: "这首五律的力量来自听觉与思想的突然衔接。首联先把人安置在将近二更的空堂，衰老之感尚属内心；颔联却让山果坠地、草虫低鸣，细小声响把夜的空寂具体化。颈联从白发转到求仙炼金的无效，末联再以“学无生”收束：不是否认衰病，而是把对身体变化的执着移向佛理。景物只占两句，却成为从感官进入观念的门。",
    studyCopy: {
      dictationTitle: "把雨夜四联听回来",
      dictationSuccess: "四联无误，空堂、山果、白发与无生已经连成一夜。",
      recitationHint: "按“独坐二更—雨果虫鸣—白发黄金—老病无生”四层推进复述。"
    }
  },
  ...previousPoems
];

export const poemsById = Object.fromEntries(poems.map((poem) => [poem.id, poem]));
