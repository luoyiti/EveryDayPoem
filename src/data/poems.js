import { poems as previousPoems } from "./poems-through-2026-09-08.js";

export const poems = [
  {
    id: "wangbo-mountain",
    layout: "wangbo-mountain",
    title: "山中",
    author: "王勃",
    dynasty: "唐",
    genre: "诗",
    form: "五言绝句",
    learnedAt: "2026.09.08",
    image: "/assets/poems/wangbo-mountain-autumn.webp",
    lines: ["长江悲已滞", "万里念将归", "况属高风晚", "山山黄叶飞"],
    notes: [
      { term: "长江 · 悲已滞", text: "“滞”指淹留、久留。首句不是说长江真的停流，而是把面对长江时的久客之悲压进一个“滞”字：江水在前，人却未归。" },
      { term: "万里 · 念将归", text: "“万里”极写归途遥远；“念将归”是心中想着归去。它与上句“已滞”相对，一边是已经久留，一边是仍在盼归。" },
      { term: "况属 · 高风晚", text: "“况属”意为何况正逢；“高风”可理解为高处劲风、秋风。传世版本此处另有“复”字异文，本页采用《全唐诗》系统正文“属”。" },
      { term: "山山 · 黄叶飞", text: "“山山”把视野从一处山头推向重重山岭；黄叶被风吹起，末句只写眼前景物，不再直说思归，却让旅愁留在漫山飘动的秋色中。" }
    ],
    translation: "面对长江，我为自己久滞异乡而悲；远隔万里，心中总念着归去。何况正逢秋风高起的傍晚，重重山岭之间，黄叶正在纷纷飞落。",
    appreciation: "前两句把旅愁压在两个尺度上：“长江”展开眼前水势，“万里”拉长归途；“已滞”与“将归”又把久留和愿望对置。后两句忽然转向纯景，高风入晚，黄叶从一山飞到又一山。情绪不再被解释，而交给连续山势与落叶。全诗由内心的滞重推向外界的飘动，以开阔秋景收住思归之悲。",
    studyCopy: {
      dictationTitle: "从长江写到山山黄叶",
      dictationSuccess: "四句无误，长江、万里、高风与黄叶已经连成完整的归思。",
      recitationHint: "按“长江久滞—万里思归—高风入晚—山山叶飞”四个节点复述。"
    }
  },
  ...previousPoems
];

export const poemsById = Object.fromEntries(poems.map((poem) => [poem.id, poem]));
