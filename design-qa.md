# Design QA — 每日古诗文 / 记过合浦

## Visual brief

- 时间：正文明确写“六月晦，无月”，页面因此以无月海夜为时间核心；不额外虚构具体时刻。
- 地点：由海康往合浦途中、碇宿大海；背景只抽象呈现夜海与远岸，不复原无法核实的具体航线地貌。
- 天气与色温：前文“连日大雨”说明此前持续降雨；海宿当夜只表现潮湿、云层已开而星河可见，不虚构仍在暴雨。主色为蓝黑、冷银，暖色仅留在船木与书卷材质。
- 材质：湿木船舷、绳索、暗海、纸卷与锚具；生成图不含文字或 UI。
- 核心意象：坏桥涨水后的转海、无月、天水相接、星河满天、随身未有别本的书稿。
- 视觉命题：**陆路越走越窄，夜海却忽然把视野打开；读者沿五个“航记”节点，从坏桥涨水走到星河，再由星河收回手边书稿与最终抵岸。**
- 构图：不沿用上一日《早秋三首·其一》的“夜→晓”时间阈值。桌面版把题名、当前航记、解释、五段行程分置四列，以水平“水线”贯穿；移动端改为可横向浏览的五段航标，原文仍居首要阅读层级。

## Text and source check

- 维基文库《东坡志林》卷一“记游·记过合浦”与单篇《记过合浦》均录“无复桥船”“六月晦，无月”“天水相接，星河满天”等正文，本页以该系统为正文底本。
- 维基文库《东坡全集（四库全书本）》卷一百一同篇此处作“无复船”，其余核心叙事一致；本页不混拼，仅在注释中说明这一异文。
- 古文岛 / 原古诗文网同篇用于交叉核对“适、并海、即、徐闻、厄、过”等常用释义，其中“过”释为苏轼幼子苏过。
- 本轮候选为 `记过合浦 / 苏轼 / 余自海康适合浦`（文）、`沉醉东风·渔夫 / 白朴 / 黄芦岸白蘋渡口`（曲）、`夕次盱眙县 / 韦应物 / 落帆逗淮镇`（诗）。三项均用仓库 matcher 执行排除检查并返回 0，且经精确 HEAD 仓库搜索及 132 篇排除库复核无重复；最终选择《记过合浦》，使昨日“诗”后回到短篇散文，同时最近 7 次仍覆盖诗、词、曲、文、赋五类。

## Asset and implementation

- `public/assets/poems/hepu-starry-sea.webp`：本轮 ImageGen 独立生成并压缩为 1024×576 WebP；画面以湿木船舷、绳索、书卷、夜海和星河组织，不含诗文或 UI。
- `src/HepuStarrySeaPage.jsx`：五段原文被组织成“陆 / 海 / 息 / 书 / 岸”五个航记节点；键盘方向键可逐段阅读，译文、赏析、背诵、默写与历史入口完整，Escape 可关闭覆盖层。
- `src/hepu-starry-sea.css`：桌面为四列航海日志结构，移动端把五个节点改为横向航标；包含焦点可见性、暗部对比度和 `prefers-reduced-motion` 处理。
- 数据契约：唯一 id/layout、5 段正文、5 条逐段注释、译文、139 字赏析、学习文案、`/assets/poems/` 资源路径及 2026-09-16（Asia/Shanghai）学习记录均已源代码级检查。

## Verification

- 任务基线 exact SHA 的 GitHub Actions `Validate poetry content`：completed / success。
- `npm run bootstrap`：本轮隔离重建工作区运行仓库原生脚本，退出码 20 / `DEPENDENCY_NETWORK_UNAVAILABLE`；offline npm cache 缺少字体包且 `registry.npmjs.org` 无法解析。
- `npm run verify:offline`：基线 fresh reconstruction 通过；课程排除库契约 `60 + 72 = 132`、5 项 matcher、daily content tests `2/2` 全通过。提交前将再次以新内容运行。
- 本地 `npm run build` / `npm run test:sites`：未执行；bootstrap=20 且依赖不可用，按仓库协议改以远端 GitHub Actions / Vercel 为最终 build gate。
- 桌面/手机运行时浏览器检查：未执行；本地依赖不可用。已完成源代码级响应式、资源路径、布局分发、键盘焦点与学习入口检查。
- 未提交 `dist/`、`.vercel/`、`node_modules/`、`.firecrawl/` 或 QA 截图。

final result: source review completed; remote build gate pending
