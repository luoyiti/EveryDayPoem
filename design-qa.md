# Design QA — 每日古诗文 / 秋日

## Visual brief

- 时间：秋日傍晚，以“反照”作为一天将尽的唯一时间线索，不增补具体日期。
- 地点：闾巷、古道与禾黍田相接的乡野空间；不把未见于正文的具体城邑当作史实。
- 天气与色温：无雨、微风；低角度暖色余照切入冷灰褐阴影。
- 材质与核心意象：土巷、旧路、禾黍；核心意象是“光进入空巷”与“风让禾黍成为唯一运动”。
- 视觉命题：“夕照有人间的温度，古道却无人；最后只剩禾黍替秋风回答。”
- 转折：第二句由景直入“忧”，第三、四句再退回无人古道与风动禾黍；页面阅读轨迹从巷内斜向田边推进。

## Text and source check

- 《全唐诗》卷二百六十九收耿湋《秋日》：“反照入闾巷，忧来与谁语。古道无人行，秋风动禾黍。”并记“忧来与谁”一作“愁来谁共”、“无”一作“少”。
- 《千家诗》卷一亦收此篇，题名、作者和核心正文与《全唐诗》系统相合；本页采用《全唐诗》正文，并把两个常见异文记入逐句注释。
- 课程排除：`秋日 / 耿湋 / 反照入闾巷`、`秋日登吴公台上寺远眺 / 刘长卿 / 古台摇落后`、`秋日赴阙题潼关驿楼 / 许浑 / 红叶晚萧萧` 均实际执行 `npm run check:exclusion`，退出码 0；并核对现有诗库与学习记录无重复。

## Asset and implementation

- `public/assets/poems/autumn-lane-light.webp`：ImageGen 本次仍错误返回报告式画面，未按场景指令生成写实乡野；为避免把错误文字/UI带入诗页，仅将本次生成结果整体下采样、重度模糊、降饱和与降亮度，得到不含任何可辨文字或图形的低频生成纹理。页面不把纹理中的任何具体信息解释为诗中史实。
- `src/AutumnLanePage.jsx`：独立“闾巷—古道—田边”斜向阅读轨迹；四句随路径错位推进，注释随当前位置切换；译文、赏析、背诵、默写、历史入口完整，Escape 可关闭覆盖层。
- `src/autumn-lane.css`：桌面以斜向步进和侧注构成，不复用“山雨”的夜—平明轴；移动端改为单列窄巷式缩进；包含键盘焦点与 `prefers-reduced-motion`。
- `src/App.jsx`：新增 `poem.layout === "autumn-lane-light"` 独立分发；未修改通用发布测试。
- 数据契约：唯一 id/layout、4 行原文、4 条逐句注释、译文、131 字赏析、学习文案、`/assets/poems/` 资源路径与 2026-09-02 学习记录已检查。

## Verification

- 基线 `npm run verify:offline`：通过；课程排除契约 60 + 72 = 132，5 项 matcher 通过，daily tests 2/2。
- `npm run bootstrap`：退出码 20，输出 `DEPENDENCY_NETWORK_UNAVAILABLE`；按仓库协议继续。
- 最终 `npm run verify:offline`：通过；课程排除契约 60 + 72 = 132，5 项 matcher 通过，daily tests 2/2。
- 本地 `npm run build`：未执行，原因是 bootstrap=20 且依赖不可用。
- 本地 `npm run test:sites`：未执行，同上。
- 桌面/手机运行时浏览器检查：未执行，同上；已完成源代码级响应式、资源路径、按钮入口与数据契约检查，提交后由 Vercel 构建和生产 URL 作为最终 gate。
- 未提交 `dist/`、`.vercel/`、`node_modules/`、`.firecrawl/` 或 QA 截图。

final result: source review passed; remote build gate pending

---

# Prior QA history

详细历史 QA 可由本提交父节点 `ec8a3ecf0c432ffbc16425095dc4d940b0811906` 的 `design-qa.md` 核验；本次保留此前页面的发布结论摘要：山雨（远山雨因果轴）、宿甘露寺僧舍（开窗入江）、秋浦途中（雨路问雁）、溪居即事（漂移轴）、秋夜寄邱员外（双空间秋夜）、村夜（推门见月）、过分水岭（双轨分流）、台城（历史断面）、题金陵渡（近远视线）、咸阳值雨（四层雨幕）、枫桥夜泊（夜航舱窗）、兰溪棹歌（水镜逐句）。
