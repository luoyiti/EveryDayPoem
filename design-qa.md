# Design QA — 每日古诗文 / 记游松风亭

## Visual brief

- 时间：正文没有给出具体时辰，页面只使用柔和自然光，不标定清晨、黄昏或特定天气。
- 地点：惠州嘉祐寺松风亭一带；只依据“松风亭下”“亭宇尚在木末”“就林止息”表现林间坡道、树梢与远亭，不复原具体历史建筑。
- 色温与材质：松林冷绿、岩石与土径的低饱和灰褐；远处日光只负责拉开“眼前可歇 / 高处未到”的距离。
- 核心意象：高处亭宇、树梢、上行石径与脚下可停之地。
- 视觉命题：“亭仍在树梢，人却在第三段停下；页面不再继续向高处爬，而把阅读重心移回‘此间’。”
- 转折：第三段“此间有甚么歇不得处”是全页结构折点；前两段逐级右移模拟追赶目标，第三段突然归零，后文保持在同一水平线展开。

## Text and source check

- 维基文库《记游松风亭》收于《东坡志林》卷一，正文作“思欲就林止息”“此间有甚么歇不得处”“当甚么时也不妨熟歇”，本页采用这一系统，并将“皷”按现代常用字写作“鼓”。
- 现代整理页所引《东坡集》版本常见“思欲就亭止息”“当恁么时”等异文；本页不混拼，在第一条注释中提示“就林 / 就亭”差异。
- 候选 `记游松风亭 / 苏轼 / 余尝寓居惠州嘉祐寺`（文）、`秋夜独坐 / 王维 / 独坐悲双鬓`（诗）、`点绛唇·蹴罢秋千 / 李清照 / 蹴罢秋千`（词）均运行 `npm run check:exclusion`，退出码 0；并经任务基线 HEAD 的 GitHub 代码搜索复核无重复。
- 最近 7 次记录在发布前已覆盖赋、词、曲、诗四类；最近 14 次亦已有诗、词、曲、赋。本轮选“文”，使最近发布序列进一步覆盖诗、词、曲、文、赋五类，并避免与最新“赋”连续同体裁。

## Asset and implementation

- `public/assets/poems/songfeng-rest.webp`：ImageGen 独立生成无文字林间坡道与高处亭宇场景；为适配连接器二进制写入限制，压缩为 160×90 WebP 并在页面中以暗色遮罩承载，保留原始构图关系，不把亭的具体形制当作历史复原。
- `src/SongfengRestPage.jsx`：独立“向亭上行 → 此间停步 → 极端假设”阅读路径；逐段注释、译文、赏析、背诵、默写和历史入口完整，Escape 可关闭覆盖层。
- `src/songfeng-rest.css`：桌面三列“题签 / 路径 / 注释”，前两段递进位移、第三段归零；移动端取消横向位移，保持原文完整和工具可触达；包含键盘焦点与 `prefers-reduced-motion`。
- `src/App.jsx`：新增 `poem.layout === "songfeng-rest"` 独立分发；未修改通用发布测试。
- `data/learning-record.json`：新增 2026-09-07 记录并保存 `genre: "文"`。

## Verification

- 任务基线 SHA `9b86d542693471830f12f84306f3fec9cce686e9` 的 GitHub Actions `Validate poetry content` 已 `completed / success`，证明精确基线仓库树通过网络无关内容检查与 production build gate。
- fresh reconstruction 的基线 `npm run verify:offline`：通过；课程排除契约 60 + 72 = 132，5 项 matcher 通过，daily tests 2/2。
- `npm run bootstrap`：退出码 20，输出 `DEPENDENCY_NETWORK_UNAVAILABLE`；按仓库协议继续。
- fresh reconstruction 的提交前 `npm run verify:offline`：通过；daily tests 2/2。
- 本地 `npm run build`：未执行，原因是 bootstrap=20 且依赖不可用。
- 本地 `npm run test:sites`：未执行，同上。
- 桌面/手机运行时浏览器检查：未执行，同上；已完成数据契约、资源路径、布局分发、CSS/JS 源码与移动端规则检查，提交后以 GitHub Actions 与 Vercel 精确提交树为最终 gate。
- 未提交 `dist/`、`.vercel/`、`node_modules/`、`.firecrawl/` 或 QA 截图。

final result: source review passed; remote build gate pending
