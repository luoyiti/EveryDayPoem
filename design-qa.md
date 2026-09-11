# Design QA — 每日古诗文 / 西江月·问讯湖边春色

## Visual brief

- 时间：词中明写“春色”“东风”“杨柳”，页面只据此表现春日湖面，不补写具体年月、时辰或天气史实。
- 地点：以湖船、杨柳、寒光亭、水天和沙鸥组织空间；不根据后世题名争议复原某一处寺院或具体地貌。
- 色温：水面以清灰蓝与薄雾青为主，日光仅作柔和暖色过渡；春色低饱和，不使用桃花式通用“国风”装饰。
- 核心意象：开阔湖面、横向舟行、近景柳丝、远处亭影、从水面飞起的沙鸥；无人物肖像、题字、印章或现代设施。
- 视觉命题：舟行把“重来三年”的时间感向前推，柳丝从近处掠过；过片从外景收回“世路”，最终湖面再次打开，沙鸥飞起，把个人经历释放到水天之间。
- 构图：桌面不使用居中大卡片，改为标题岸标 + 横向水线四段 + 下方湖上札记；移动端把水线变为可横向滑读的四段，不复制上一日“独 / 听 / 叹 / 观”的夜刻结构。

## Text and source check

- 识典古籍《于湖居士文集（张孝祥集）》卷三十四据四部丛刊本收此《西江月》，正文作“问讯湖边春色……寒光亭下水如天，飞起沙鸥一片”；本页据此采用“水如天”。
- 《于湖词（四库全书本）》卷一同收此词，正文前七句一致，末句系统作“寒光亭下水连天”；本页将“水连天”作为传本异文写入注释，不混拼正文。
- 维基文库独立作品页同时列出《于湖词》四库本、《于湖居士文集》四部丛刊本与《唐宋名家词选》三条收录线索；现代页面题作“丹阳湖”等，本页为避免后世题名差异，采用“西江月·问讯湖边春色”的首句式标题。
- 本轮候选为 `西江月·问讯湖边春色 / 张孝祥 / 问讯湖边春色`（词）、`临皋闲题 / 苏轼 / 临皋亭下八十数步`（文）、`人月圆·山中书事 / 张可久 / 兴亡千古繁华梦`（曲）。三者均经当前精确 HEAD 的排除库匹配逻辑与仓库全文检索复核，无课程标准或已发布篇目命中；最终选择第一篇。

## Asset and implementation

- `public/assets/poems/danyang-lake-breeze.webp`：本轮 ImageGen 独立生成并转为 WebP；柳丝从右上近景进入，湖船与沙鸥置于右侧，左部保留开阔水面和低细节负空间。
- `src/DanyangLakePage.jsx`：独立“横向水线”阅读结构；四段可点击并支持左右方向键，注释随段落切换，译文、赏析、背诵、默写与历史入口完整，Escape 可关闭覆盖层。
- `src/danyang-lake.css`：桌面采用岸标题名、跨湖水线、札记与竖向学习工具；移动端水线改为横向 scroll-snap，札记和学习工具固定在底部，避免正文与背景高细节区冲突；包含键盘焦点与 `prefers-reduced-motion`。
- 数据契约：唯一 id/layout、4 段正文、4 条注释、译文、123 字赏析、学习文案、`/assets/poems/` 资源路径与 2026-09-12（Asia/Shanghai）学习记录已检查。

## Verification

- 任务开始基线 GitHub Actions `Validate poetry content` 已对精确基线 SHA 重新运行，`Network-independent content checks`、依赖安装、production build 与 Sites tests 均 completed / success。
- `npm run bootstrap`：本地 npm cache 不可用，且 `registry.npmjs.org` DNS 无法解析，按仓库脚本语义返回退出码 20 / `DEPENDENCY_NETWORK_UNAVAILABLE`。
- 本地 `npm run build`：未执行，原因是 bootstrap=20 且依赖不可用。
- 本地 `npm run test:sites`：未执行，同上。
- 桌面/手机运行时浏览器检查：未执行，同上；已完成源代码级响应式、资源路径、布局分发、文本长度与交互入口检查，提交后由 GitHub Actions / Vercel 作为最终 build gate。
- 未提交 `dist/`、`.vercel/`、`node_modules/`、`.firecrawl/` 或 QA 截图。

final result: source review passed; remote build gate pending
