# Design QA — 每日古诗文 / 折桂令·九日

## Visual brief

- 时间：题名“九日”指重阳，正文明确秋景与“一抹斜阳”；页面只落实为秋日将晚，不虚构具体年份或地点。
- 地点：以青山、天涯远景为主，不复原具体宴饮场所；宴席只通过近景暖色器物感与页面中段的排布节奏暗示。
- 天气与色温：西风秋晴，远山冷灰，斜阳暖金；前半仍保留节日余温，末段逐渐冷下来。
- 材质与核心意象：青山、归雁、斜阳、寒鸦、黄菊、酒器；背景图不写作品文字或 UI。
- 视觉命题：四段曲词像四条逐渐向天涯伸出的谱线——归雁先横过天空，中段宴席声色暂时聚拢，第三段由白发与黄花把时间压深，最后只剩斜阳与寒鸦。
- 转折：第二段最热闹，第三段“人老去”骤然转冷；页面因此让四条句位逐级右移，阅读从近处宴席被推向远处天涯。

## Text and source check

- 维基文库《折桂令（张可久）》“九日”条正文作“对青山强整乌纱，归雁横秋，倦客思家……回首天涯，一抹斜阳，数点寒鸦”。
- 古诗文网整理本题作《蟾宫曲·九日》，正文与上述一致；“折桂令 / 蟾宫曲”为同一曲牌系统的异名，本页题名依维基文库作《折桂令·九日》，form 标注“双调·折桂令（又名蟾宫曲）”。
- 候选 `折桂令·九日 / 张可久 / 对青山强整乌纱`（曲）、`归田赋 / 张衡 / 游都邑以永久`（赋）、`游沙湖 / 苏轼 / 黄州东南三十里为沙湖`（文）均实际执行 `npm run check:exclusion`，退出码 0；GitHub 当前仓库代码搜索亦均无同篇命中。

## Asset and implementation

- `public/assets/poems/zhegui-jiuri-sunset.webp`：本轮 ImageGen 独立生成，无文字、按钮、印章或现代建筑；左侧暗部用于题名与工具，右侧承担斜阳、远山、归雁与秋菊，移动裁切后仍保留主要意象。
- `src/JiuriHorizonPage.jsx`：独立“四条秋日谱线”阅读结构；点击逐段切换注释，译文、赏析、背诵、默写、历史入口完整，Escape 可关闭覆盖层。
- `src/jiuri-horizon.css`：桌面三列“题名 / 谱线 / 侧注”，四段逐级向天涯偏移；移动端折为单列，包含键盘焦点与 `prefers-reduced-motion`。
- 数据契约：唯一 id/layout、4 段正文、4 条注释、译文、100—180 字赏析、学习文案、`/assets/poems/` 资源路径与 2026-09-09（Asia/Shanghai）学习记录已检查。

## Verification

- 基线 `npm run verify:offline`：通过；课程排除契约 60 + 72 = 132，5 项 matcher 通过，daily tests 2/2。
- `npm run bootstrap`：退出码 20，输出 `DEPENDENCY_NETWORK_UNAVAILABLE`；按仓库协议继续。
- 提交前 `npm run verify:offline`：通过；课程排除契约 60 + 72 = 132，5 项 matcher 通过，daily tests 2/2。
- 本地 `npm run build`：未执行，原因是 bootstrap=20 且依赖不可用。
- 本地 `npm run test:sites`：未执行，同上。
- 桌面/手机运行时浏览器检查：未执行，同上；已完成源代码级响应式、资源路径、布局分发与交互入口检查，远端 GitHub Actions / Vercel 作为最终 build gate。
- 未提交 `dist/`、`.vercel/`、`node_modules/`、`.firecrawl/` 或 QA 截图。

final result: source review passed; remote build gate pending
