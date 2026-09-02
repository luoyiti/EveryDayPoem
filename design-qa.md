# Design QA — 每日古诗文 / 栾家濑

## Visual brief

- 时间：初秋白昼，不虚构具体时辰；雨正在落。
- 地点：辋川一带的石濑空间，只使用题名与正文能支持的浅滩、石面、水流，不添加具体建筑。
- 天气与色温：连续秋雨；冷青灰低饱和，白鹭作为唯一高明度生命体。
- 材质与核心意象：湿石、急流、水花、白鹭；视觉命题是“水声持续，水花一跳，白鹭受惊后重新落回静里”。
- 转折：第三句“跳波”把连续流动变成瞬时迸溅，第四句“惊复下”完成由动返静；页面主交互以白鹭位置和逐句水势响应此转折。

## Text and source check

- 维基文库《辋川集（王维）/栾家濑》标注上接《全唐诗》卷一百二十八，正文作“飒飒秋雨中，浅浅石溜泻。跳波自相溅，白鹭惊复下”。
- 识典古籍《类笺唐王右丞诗集》卷九收《辋川集》及《栾家濑》，正文同样为秋雨、石溜、白鹭四句；页面所呈旧本字序见“波跳自相溅”，本页采用《全唐诗》系统的通行“跳波”。
- 课程排除：`栾家濑 / 王维 / 飒飒秋雨中`、`华子冈 / 裴迪 / 日落松风起`、`临湖亭 / 裴迪 / 当轩弥滉漾` 均实际执行 `npm run check:exclusion`，退出码 0；并通过 GitHub 搜索与学习记录复核无重复。

## Asset and implementation

- `public/assets/poems/luanjia-rapids.webp`：ImageGen 在本次环境错误返回报告式图像，未按场景指令生成写实溪濑；为避免任何错误文字/UI进入页面，已对生成结果整体裁切、重度模糊、反相调色并再次模糊，得到无可辨文字或图形的低频雨水纹理。页面不将纹理中的任何具体形态解释为诗中史实。
- `src/LuanjiaRapidsPage.jsx`：独立“听雨—石溜—跳波—复下”水势阅读轨迹；白鹭图标使用 Phosphor 图标库，第三句上扬、第四句回落；逐句注释、译文、赏析、背诵、默写、历史入口完整，Escape 可关闭覆盖层。
- `src/luanjia-rapids.css`：桌面为三列“题签 / 水道 / 侧注”结构，移动端收为纵向石濑；包含键盘焦点与 `prefers-reduced-motion`。
- `src/App.jsx`：新增 `poem.layout === "luanjia-rapids"` 独立分发；未修改通用发布测试。
- 数据契约：唯一 id/layout、4 行原文、4 条逐句注释、译文、141 字赏析、学习文案、`/assets/poems/` 资源路径与 2026-09-03 学习记录已检查。

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

此前页面：秋日（斜巷夕照）、山雨（远山雨因果轴）、宿甘露寺僧舍（开窗入江）、秋浦途中（雨路问雁）、溪居即事（漂移轴）、秋夜寄邱员外（双空间秋夜）、村夜（推门见月）、过分水岭（双轨分流）、台城（历史断面）、题金陵渡（近远视线）、咸阳值雨（四层雨幕）、枫桥夜泊（夜航舱窗）、兰溪棹歌（水镜逐句）。
