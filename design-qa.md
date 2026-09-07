# Design QA — 每日古诗文 / 山中

## Visual brief

- 时间：依据“高风晚”设为晚秋将暮，但不虚构具体日期或天气事件。
- 地点：只表现山中远望长江的空间关系，不复原王勃真实行旅地点。
- 色温与材质：冷蓝灰山体与江面为底，天际保留少量暮光；近景岩石、枯枝和黄叶承担触感与风势。
- 核心意象：长江、万里远山、高风、连续山岭与黄叶。
- 视觉命题：“前两句停在江边，后两句让视线沿山势向外扩张；人的‘滞’与叶的‘飞’形成相反运动。”
- 转折：第三句“况属高风晚”从直接写思归转入纯景；页面前两句保持近岸秩序，后三、四句逐级右移，把阅读推向更远的山势。

## Text and source check

- 维基文库《山中（王勃）》标明本诗见《万首唐人绝句》四库本、《王子安集》四部丛刊本、《唐诗品彚》四库本及《全唐诗》卷五十六；正文为“长江悲已滞，万里念将归。况属高风晚，山山黄叶飞”，并注明“属”一作“复”。
- 古诗文网整理本正文与上述通行本一致，并释“滞”为淹留、“况属”为何况正逢。本页采用“况属”，异文仅在注释中简短说明。
- 候选 `山中 / 王勃 / 长江悲已滞`（诗）、`西江月·阻风山峰下 / 张孝祥 / 满载一船秋色`（词）、`折桂令·九日 / 张可久 / 对青山强整乌纱`（曲）均执行 `npm run check:exclusion`，退出码 0；任务基线 HEAD 的 GitHub 代码搜索也未发现三篇正文或首句，远端精确树提交后再由真实 132 篇排除库最终校验。
- 发布前最近 7 条体裁为文、赋、词、曲、诗、诗、诗，已经覆盖五类；本轮回到“诗”不会形成连续三次同体裁，并保持 7 次窗口至少三类的要求。

## Asset and implementation

- `public/assets/poems/wangbo-mountain-autumn.webp`：ImageGen 独立生成无文字山岭、江面、暮光与风中黄叶场景，压缩为 320×180 WebP；左侧保留低细节暗部承载题签与原文，不把具体山川形制解释为历史复原。
- `src/WangboMountainPage.jsx`：独立“江边停驻 → 万里归程 → 高风转景 → 山山叶飞”阅读轨迹；逐句注释、译文、赏析、背诵、默写和历史入口完整，Escape 可关闭覆盖层。
- `src/wangbo-mountain.css`：桌面三列“题签 / 斜向诗行 / 注释距离尺”，四句沿山势递进位移；移动端取消横移，避免横向溢出；包含键盘焦点与 `prefers-reduced-motion`。
- `src/App.jsx`：新增 `poem.layout === "wangbo-mountain"` 独立分发；通用发布测试未修改。
- `data/learning-record.json`：新增 2026-09-08 记录并保存 `genre: "诗"`。

## Verification

- 任务基线 SHA `e1423258e00ec8a0bbb2b817752abf6808bfb91b` 的 GitHub Actions `Validate poetry content` 在本轮重新运行并 `completed / success`，证明精确基线仓库树通过 `verify:offline`、依赖安装与 production build gate。
- `npm run bootstrap`：退出码 20，输出 `DEPENDENCY_NETWORK_UNAVAILABLE`；按仓库协议继续。
- fresh reconstruction 的提交前 `npm run verify:offline`：通过；课程排除契约 60 + 72 = 132，5 项 matcher 通过，daily tests 2/2。
- 本地 `npm run build`：未执行，原因是 bootstrap=20 且依赖不可用。
- 本地 `npm run test:sites`：未执行，同上。
- 桌面/手机运行时浏览器检查：未执行，同上；已完成数据契约、资源路径、布局分发、CSS/JS 源码与移动端规则检查，提交后以 GitHub Actions 与 Vercel 精确提交树为最终 gate。
- 未提交 `dist/`、`.vercel/`、`node_modules/`、`.firecrawl/` 或 QA 截图。

final result: source review passed; remote build gate pending
