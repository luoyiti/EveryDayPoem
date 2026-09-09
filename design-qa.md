# Design QA — 每日古诗文 / 归田赋

## Visual brief

- 时间：正文明确“仲春令月”，页面据此使用春日自然光；不把当前发布日期的秋季气候混入作品世界。
- 地点：只表现原隰、长流、山丘与远处可归的蓬庐感，不复原具体洛阳或张衡故居。
- 天气与色温：“时和气清”，以清润草绿、暖白日光和远山灰蓝为主；左侧保留较深暗部承接“埃尘”，右侧逐渐开向明亮春野。
- 材质与核心意象：草甸、低湿地、河流、远山、飞鸟、林缘与极远的小屋；背景图无文字、按钮、印章或现代设施。
- 视觉命题：阅读不是一路向前，而是四次松开——从都邑的收束，到仲春原野的展开，再到山泽上下运动，最后在日暮重新收回蓬庐。
- 转折：第一段“超埃尘以遐逝”完成真正离场；第二段视野骤然打开。页面以四段章法索引“辞 / 春 / 游 / 归”回应这一结构，而不是沿用上一首的天涯谱线。

## Text and source check

- 维基文库《归田赋》标明收入《昭明文选》卷十五，正文采用“游都邑以永久”“王雎鼓翼，仓庚哀鸣”“于时曜灵俄景，系以望舒”等字句，本页依此系统。
- 中国哲学书电子化计划《艺文类聚》卷三十六引《后汉张衡归田赋》，可交叉核对开篇、仲春春野与末段日暮归庐的主要文句；该引文为节录且存在“盘游/般游”“域外/物外”等异文，因此不用于拼接正文。
- 古诗文网整理本完整收录《归田赋》，与《昭明文选》系统整体一致，但“鸧鹒/仓庚”“继以望舒/系以望舒”等有异文；本页保持单一版本，不混拼。
- 候选 `归田赋 / 张衡 / 游都邑以永久`（赋）、`游沙湖 / 苏轼 / 黄州东南三十里为沙湖`（文）、`西江月·阻风山峰下 / 张孝祥 / 满载一船秋色`（词）均执行 `npm run check:exclusion`，退出码 0；学习记录无同篇发布记录。

## Asset and implementation

- `public/assets/poems/guitian-spring-field.webp`：本轮 ImageGen 独立生成；左侧林影与石面压低细节，右侧河谷、春野、飞鸟与远山逐级展开，为文字与四段章法预留空间。
- `src/GuitianFieldPage.jsx`：独立“辞 / 春 / 游 / 归”四段阅读结构；点击切换原文与对应注释，译文、赏析、背诵、默写、历史入口完整，Escape 可关闭覆盖层。
- `src/guitian-field.css`：桌面采用窄题名轴 + 章法索引 + 大段原文 + 侧注的非卡片式构图；移动端改为横向章法索引与单列原文，包含键盘焦点和 `prefers-reduced-motion`。
- 数据契约：唯一 id/layout、4 段正文、4 条注释、译文、146 字赏析、学习文案、`/assets/poems/` 资源路径与 2026-09-10（Asia/Shanghai）学习记录已检查。

## Verification

- 基线 fresh reconstruction `npm run verify:offline`：通过；课程排除契约 60 + 72 = 132，5 项 matcher 通过，daily tests 2/2。
- `npm run bootstrap`：退出码 20，输出 `DEPENDENCY_NETWORK_UNAVAILABLE`；按仓库协议继续。
- 提交前 fresh reconstruction `npm run verify:offline`：通过；课程排除契约 60 + 72 = 132，5 项 matcher 通过，daily tests 2/2。
- 本地 `npm run build`：未执行，原因是 bootstrap=20 且依赖不可用。
- 本地 `npm run test:sites`：未执行，同上。
- 桌面/手机运行时浏览器检查：未执行，同上；已完成源代码级响应式、资源路径、布局分发与交互入口检查，提交后由 GitHub Actions / Vercel 作为最终 build gate。
- 未提交 `dist/`、`.vercel/`、`node_modules/`、`.firecrawl/` 或 QA 截图。

final result: source review passed; remote build gate pending
