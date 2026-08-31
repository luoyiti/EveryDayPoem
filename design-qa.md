# Design QA — 每日古诗文 / 山雨

## Visual brief

- 时间：由整夜星月清明推进到“平明”，不添加具体月相或具体日期。
- 地点：山林与溪流；“他山”只作为远处、不可见的因果来源。
- 天气与色温：观察点整夜无云无雷，冷银蓝夜色向黎明灰青过渡。
- 材质与核心意象：暗林、湿石、溪水；核心意象是星月白与突然变急的水流。
- 视觉命题：“眼前仍晴，水却替远山带来雨的消息。”
- 转折：第三句“平明忽见溪流急”，阅读轴由静夜下移到急溪，空间与时间同步转向。

## Text and source check

- 《西岩集（翁卷，四库全书本）》收《山雨》，正文作“一夜满林星月白，且无云气亦无雷。平明忽见溪流急，知是他山落雨来”。
- 古诗文网现代整理本题名、作者和其余正文一致，第二句作“亦无云气亦无雷”；本页采用四库本“且无”，并在注释说明异文。
- 课程排除：`山雨`、`新凉`、`初秋行圃（其四）` 三候选均实际执行 `npm run check:exclusion`，退出码 0；实际课程排除库已由 GitHub 连接器读取核对，候选均未命中。

## Asset and implementation

- `public/assets/poems/mountain-rain-signal.webp`：本次 ImageGen 两次未按场景指令返回纯场景，而返回报告式画面；因此仅从本次生成结果中的无文字场景区裁切，并重度模糊、降饱和、降亮度为低细节山林水色纹理。页面不把纹理中任何具体物件解释为诗中史实。
- `src/MountainRainPage.jsx`：独立“夜—平明”阅读轴，四句按时间/水势错位推进；注释、译文、赏析、背诵、默写、历史入口完整；Escape 可关闭覆盖层；进度存储失败不阻断学习。
- `src/mountain-rain.css`：桌面与 `max-width:800px` 移动布局均有定义；包含 `prefers-reduced-motion` 降级。
- `src/App.jsx`：新增 `poem.layout === "mountain-rain-signal"` 独立分发；未修改通用发布测试。
- 数据契约：唯一 id/layout、4 行原文、4 条逐句注释、译文、140 字赏析、学习文案、`/assets/poems/` 资源路径与 2026-09-01 学习记录均已检查。

## Verification

- 基线 `npm run verify:offline`：通过；课程排除契约 60 + 72 = 132，5 项 matcher 通过，daily tests 2/2。
- `npm run bootstrap`：退出码 20，输出 `DEPENDENCY_NETWORK_UNAVAILABLE`；按仓库协议继续。
- 最终 `npm run verify:offline`：通过；daily tests 2/2。
- 本地 `npm run build`：未执行，原因是 bootstrap=20 且依赖不可用。
- 本地 `npm run test:sites`：未执行，同上。
- 桌面/手机运行时浏览器检查：未执行，同上；提交后由 Vercel 生产构建与生产 URL 验证作为最终 gate。
- 未提交 `dist/`、`.vercel/`、`node_modules/`、`.firecrawl/` 或 QA 截图。

final result: source review passed; remote build gate pending

---

# Prior QA history

详细历史 QA 可由本提交父节点 `8cc7fe83fab767615cd79a7722e610c67adac897` 的 `design-qa.md` 核验；本次保留此前页面的发布结论摘要：宿甘露寺僧舍（开窗入江）、秋浦途中（雨路问雁）、溪居即事（漂移轴）、秋夜寄邱员外（双空间秋夜）、村夜（推门见月）、过分水岭（双轨分流）、台城（历史断面）、题金陵渡（近远视线）、咸阳值雨（四层雨幕）、枫桥夜泊（夜航舱窗）、兰溪棹歌（水镜逐句）。
