# Design QA — 每日古诗文 / 鲁山山行

## Visual brief

- 时间：霜后深秋至初冬的清晨；不绑定具体史实时辰，只以冷色漫射光体现“霜落、林空”的空气感。
- 地点：鲁山语境中的山径与溪谷；不复原具体宋代地标，只保留群峰、幽径、疏林、溪流和云气的关系。
- 天气与色温：清冷、湿润、薄雾，蓝灰山体与褐灰林木为主，少量低饱和暖褐来自枯叶和鹿身。
- 材质：霜草、湿石、山径、疏林、清溪、云雾。
- 核心意象：高低群山、随步而改的峰形、幽径、霜林、熊升树、鹿饮溪、云外鸡声。
- 视觉命题：**山景不是一幅静止全景，而是随着脚步不断改形；页面让读者沿四个错位停点前行，最后把视觉主动撤掉，只留下“云外一声鸡”，完成从看见到听见的感官转折。**
- 构图：桌面端左侧固定大幅山径环境，右侧为错位高低的四站“山径”；原文沿路径起伏而非自上而下排卡片。移动端改为纵向步道，仍保留四站和最后的听觉落点。

## Text and source check

- 识典古籍《宛陵先生集·鲁山山行》：核对题名、作者及“适与野情惬……云外一声鸡”八句正文，本页以该集数字整理为主。
- 维基文库《梅尧臣集/卷07》：交叉核对《鲁山山行》在梅尧臣诗集中的卷次与通行文本；两源均作“幽径独行迷”。
- 本轮候选为 `鲁山山行 / 梅尧臣 / 适与野情惬`（诗）、`鹧鸪天·鹅湖归病起作 / 辛弃疾 / 枕簟溪堂冷欲秋`（词）、`西湖七月半 / 张岱 / 西湖七月半，一无可看`（文）。三项 `npm run check:exclusion` 均返回 0；精确任务 HEAD 的仓库搜索亦未发现候选题名或首句已存在。
- 最近七篇（发布前）体裁为：文、曲、词、诗、赋、词、文；已覆盖五类。本次选择“诗”，避免继续叠加“文/词”，并让最近七篇更新为诗、文、曲、词、诗、赋、词，仍覆盖五类。

## Asset and implementation

- `public/assets/poems/lushan-mountain-trail.webp`：本轮 ImageGen 独立生成后转换为 WebP，640×360，9658 B；画面含山径、霜林、群峰、溪流与鹿，不含文字或 UI。
- `src/LushanMountainPage.jsx`：独立页面采用“入山—转峰—霜林—闻鸡”四站路径结构；左右方向键或点击停点切换逐联注释，末站只保留“云外 · 一声鸡”的听觉提示；提供译文、赏析、背诵、默写与历史入口。
- `src/lushan-mountain.css`：桌面为“固定山景 + 起伏山径”双区布局，移动端转为纵向步道；包含 `focus-visible`、正文对比和 `prefers-reduced-motion`。
- 数据契约：唯一 id/layout、4 联原文、4 条一一对应注释、译文、135 字赏析、学习文案、资源路径与 2026-09-21（Asia/Shanghai）学习记录已完成源代码级检查。

## Verification

- 精确任务基线 SHA 的 GitHub Actions `Validate poetry content` 已在本轮重新运行（attempt 2）并成功，其中 `Network-independent content checks` 即仓库原生 `npm run verify:offline`。
- 在 connector-reconstructed 验证工作区执行三组候选 `npm run check:exclusion`，三项均退出 0；并对精确 HEAD 做题名/首句仓库检索复核。
- `npm run bootstrap` 返回退出码 20，并输出 `DEPENDENCY_NETWORK_UNAVAILABLE`；因此按仓库协议继续，本地 production build / Sites tests / 桌面与手机浏览器运行时检查未执行。
- 提交前 connector-reconstructed `npm run verify:offline` 通过：132 条计数契约、5 项 matcher checks、daily tests 2/2；最终提交仍由 GitHub Actions 与 Vercel 对实际 Git 树再次执行，作为权威 build gate。
- 未提交 `dist/`、`.vercel/`、`node_modules/`、`.firecrawl/`、QA 截图或生成器中间文件。

final result: source review completed; remote build gate pending
