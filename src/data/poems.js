import { poems as previousPoems } from "./poems-through-2026-09-11-autumn-night.js";

export const poems = [
  {
    id: "danyang-lake-breeze",
    layout: "danyang-lake-breeze",
    title: "西江月·问讯湖边春色",
    author: "张孝祥",
    dynasty: "宋",
    genre: "词",
    form: "西江月",
    learnedAt: "2026.09.12",
    image: "/assets/poems/danyang-lake-breeze.webp",
    lines: [
      "问讯湖边春色，重来又是三年。",
      "东风吹我过湖船，杨柳丝丝拂面。",
      "世路如今已惯，此心到处悠然。",
      "寒光亭下水如天，飞起沙鸥一片。"
    ],
    notes: [
      { term: "问讯 · 重来三年", text: "“问讯”本有问候、探问之意，这里把湖边春色当作久别重逢的对象。“重来又是三年”只明说两次来游相隔三年，不据此补造具体行程。" },
      { term: "东风 · 湖船 · 杨柳", text: "东风推动湖上舟行，近岸柳丝随风拂面。两个动词“吹”“拂”把春景写成迎面而来的触觉，不是隔岸观看的静止画面。" },
      { term: "世路 · 到处悠然", text: "“世路”可指人世经历与仕途道路；“已惯”由眼前湖景忽然转入自我经验。“到处悠然”不是说外界从此无波折，而是把重心移到自己的心境。" },
      { term: "寒光亭 · 水如天 · 沙鸥", text: "“寒光亭”为词中亭名。“水如天”写湖面与天空相映，沙鸥忽从水面飞起。《于湖词》四库本此处作“水连天”，本页据《于湖居士文集》系统采用“水如天”。" }
    ],
    translation: "我向湖边的春色问候，再次来到这里，已经又隔了三年。春风吹着我的船横过湖面，细细柳丝迎面轻拂。人世道路上的种种经历，如今已经渐渐看惯；无论身在何处，我都愿让此心保持从容。寒光亭下，湖水明净得仿佛与天空相映，忽然有一片沙鸥从水面飞起。",
    appreciation: "这阕《西江月》把一次重游写成由外景转入心境的短行程。上片“问讯”有久别重逢之意，东风推船、柳丝拂面，春色在舟行中迎面而来。过片忽从湖上收回“世路”，一句“已惯”化去波折，再以“到处悠然”放宽胸襟。末尾水天相映，沙鸥骤起，个人经历重新落回开阔湖光。",
    studyCopy: {
      dictationTitle: "让一叶湖船驶到水天之间",
      dictationSuccess: "四段无误，问讯春色、东风湖船、世路悠然与水天沙鸥已经连成一程。",
      recitationHint: "按“问讯重来—东风柳面—世路悠然—水天沙鸥”四个节点复述。"
    }
  },
  ...previousPoems
];

export const poemsById = Object.fromEntries(poems.map((poem) => [poem.id, poem]));
