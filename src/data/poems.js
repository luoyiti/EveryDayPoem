import { poems as previousPoems } from "./poems-through-2026-09-03.js";

export const poems = [
  {
    id: "xinliang-fields",
    layout: "xinliang-fields",
    title: "新凉",
    author: "徐玑",
    dynasty: "宋",
    learnedAt: "2026.09.04",
    image: "/assets/poems/xinliang-morning.webp",
    lines: ["水满田畴稻叶齐", "日光穿树晓烟低", "黄莺也爱新凉好", "飞过青山影里啼"],
    notes: [
      { term: "田畴 · 稻叶齐", text: "“田畴”指耕作的田地。水满田间，稻叶齐整铺展，开篇先用平直、充盈的水田写出初秋清润的气息。" },
      { term: "日光 · 晓烟低", text: "“晓烟”是清晨低浮的雾气。日光从树隙穿过，薄雾仍贴近田野，明亮与清凉在同一幅晨景里并存。" },
      { term: "黄莺 · 也爱", text: "“也爱”把人的感受轻轻移给黄莺，是诗意的拟人写法，并非对鸟类习性的实证判断。" },
      { term: "青山影里 · 啼", text: "黄莺飞入远处青山的阴影中鸣叫。末句由静止田野转向飞行与声音，使清晨的空间从近处水田一下打开到远山。" }
    ],
    translation: "田野里水面充盈，稻叶长得整整齐齐；清晨的日光穿过树木，薄雾低低浮在田间。黄莺仿佛也喜爱这初秋的新凉，飞进青山的影子里，一路清脆啼鸣。",
    appreciation: "前两句把“凉”写在景物的尺度里：水满田畴，稻叶齐整；晨光穿树而来，薄雾却仍低低贴着田面，明亮与清润同时存在。后两句忽然添入黄莺，“也爱”将人的感受轻轻移给飞鸟；末句随莺影越过青山，画面由平展水田转向远山深处。全诗不直接议论秋意，只凭光、雾、稻叶与一声鸟鸣，让初秋清晨的爽朗自然显现。",
    studyCopy: {
      dictationTitle: "沿田畴写到莺影",
      dictationSuccess: "四句无误，水田、晓烟、黄莺与青山已经连成一幅新凉晨景。",
      recitationHint: "先记“水满田畴—日穿晓烟—黄莺也爱—飞入青山”四个节点，再复述原句。"
    }
  },
  ...previousPoems
];

export const poemsById = Object.fromEntries(poems.map((poem) => [poem.id, poem]));
