# Design QA — 每日古诗文 / 早秋三首·其一

## Visual brief

- 时间：诗本身从“遥夜”推进至“晓”，页面也以夜色向晨光的横向渐变组织阅读，不把生成图中的具体日出时刻当作创作史实。
- 地点：不虚构具体作诗地点；背景只使用诗中可支持的青萝、露草、残萤、早雁、高树、远山与“一叶”等自然意象。
- 天气与色温：由冷蓝黑长夜过渡到极克制的暖晨光；地表保留露水湿润感，远山在天光中逐层显出。
- 材质：湿叶、藤萝、岩石、露水与远山保持写实质感；暖色只服务于由夜到晓的时间转折。
- 核心意象：左近的残萤与露草、抬头可见的雁阵与天河、晨光中仍浓密的树冠和层叠远山，以及近景单独落下的一叶。
- 视觉命题：**不直接宣布“秋来了”，而让读者沿着夜声、露光、晨山一路读到最后一片落叶，自己认出早秋。**
- 构图：桌面用左侧题名、细窄时间轨、四联逐步右移的正文和右侧动态边注构成“夜→露→晓→叶”的时间阈值；移动端收成纵向时间线。与上一日《人月圆·山中书事》的“由远及近账页”不同，本页以时间推进而非空间尺度为主要交互。

## Text and source check

- 识典古籍《丁卯集（许浑集）·早秋三首》录作：“遥夜泛清瑟，西风生翠萝。残萤委玉露，早雁拂金河。高树晓还密，远山晴更多。淮南一叶下，自觉老烟波。”本页正文采用这一完整传本系统。
- 古文岛 / 原古诗文网《早秋三首·其一》与上述首、颈联一致，并记录“委一作栖”“洞庭波一作老烟波”等常见异文；本页不把不同版本混拼，只在注释中简短说明末句异文。
- 本轮候选为 `早秋三首·其一 / 许浑 / 遥夜泛清瑟`（诗）、`临皋闲题 / 苏轼 / 临皋亭下八十数步`（文）、`采桑子·十年前是尊前客 / 欧阳修 / 十年前是尊前客`（词）。三篇均不在当前学习记录、现有诗库与 132 篇课程标准排除库中；最终选择《早秋三首·其一》，使最近 7 篇保持诗、词、曲、文、赋五类全覆盖，并在两次非诗发布后回到诗体。

## Asset and implementation

- `public/assets/poems/early-autumn-leaf.webp`：本轮 ImageGen 独立生成并压缩为 384×216 WebP；页面以全屏背景配合暗部遮罩使用。画面从露草残萤的夜色过渡到雁阵、晨光、远山与近景落叶，不含文字或 UI。
- `src/EarlyAutumnPage.jsx`：以“夜 / 露 / 晓 / 叶”四个时间节点驱动原文与边注；方向键可顺序阅读，译文、赏析、背诵、默写与历史入口完整，Escape 可关闭覆盖层。
- `src/early-autumn.css`：桌面四联依时间推进轻微右移；移动端改为单列时间轨。包含键盘焦点、文本对比度与 `prefers-reduced-motion` 处理。
- 数据契约：唯一 id/layout、4 联正文、4 条逐联注释、译文、141 字赏析、学习文案、`/assets/poems/` 资源路径与 2026-09-15（Asia/Shanghai）学习记录均已源代码级检查。

## Verification

- 基线 exact SHA 的 GitHub Actions `Validate poetry content`：completed / success。
- `npm run bootstrap`：在本轮隔离重建工作区运行仓库原生脚本，退出码 20 / `DEPENDENCY_NETWORK_UNAVAILABLE`；offline npm cache 缺少字体包，且 `registry.npmjs.org` 无法解析。
- `npm run verify:offline`：fresh reconstruction 通过，课程排除库 `60 + 72 = 132`、5 项 matcher 全通过，daily content tests `2/2` 全通过。
- 本地 `npm run build` / `npm run test:sites`：未执行；bootstrap=20 且依赖不可用，按仓库协议改以远端 GitHub Actions / Vercel 为最终 build gate。
- 桌面/手机运行时浏览器检查：未执行；本地依赖不可用。已完成源代码级响应式、资源路径、布局分发、键盘焦点与学习入口检查。
- 未提交 `dist/`、`.vercel/`、`node_modules/`、`.firecrawl/` 或 QA 截图。

final result: source review completed; remote build gate pending
