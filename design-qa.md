# Design QA — 每日古诗文 / 新秋夜寄诸弟

## Visual brief

- 时间：新秋深夜；地点只确定为诗人所处的空斋与“诸弟”所在的另一地，不虚构具体城市或建筑。
- 天气与色温：正文未言风雨，因此页面保持清冷、干燥的深蓝黑夜色；室内只留极弱暖边光，不渲染悲情。
- 材质与核心意象：高梧、单叶、旧木窗、素纸、星河；视觉命题是“兄弟隔在两地，只有同一条星河能被共同看见”。
- 转折：前四句从“两地/星河”逐步收回“高梧/空斋”，后四句由归思转到人瘼、微痾与年华。桌面布局因此用双列远近结构，并让后四句逐级内收；移动端则按诗序纵向展开。

## Text and source check

- 《全唐诗》卷一百八十八韦应物条收《新秋夜寄诸弟》，正文为“两地俱秋夕，相望共星河。高梧一叶下，空斋归思多。方用忧人瘼，况自抱微痾。无将别来近，颜鬓已蹉跎”，并记第二句“共”一作“在”。
- 维基文库《御定全唐诗（四库全书本）》卷188与《全唐诗》系统交叉核对作者、卷次与篇目；古文岛页面亦录同一通行正文并解释“星河、人瘼、微痾、蹉跎”等词。
- 候选 `新秋夜寄诸弟 / 韦应物 / 两地俱秋夕`、`秋凉晚步 / 杨万里 / 秋气堪悲未必然`、`早秋 / 许浑 / 遥夜泛清瑟` 均执行 `npm run check:exclusion`，退出码 0；并通过当前诗库与学习记录复核无重复。

## Asset and implementation

- ImageGen 两次误生成报告式图像，未直接使用其中任何文字或 UI。仅从第二次生成结果的无文字中央山水带提取像素，进行裁切、重采样、强模糊与冷青黑低频处理，并加入极少量星点，形成不可辨认原报告内容的背景纹理 `public/assets/poems/autumn-brothers-stars.webp`。页面不把该纹理中的具体地貌解释为史实。
- `src/AutumnBrothersPage.jsx`：独立“双地共望 → 梧叶收回 → 空斋自持”阅读结构；八句逐句注释、译文、赏析、背诵、默写、历史入口完整，Escape 可关闭覆盖层。
- `src/autumn-brothers.css`：桌面双列远近结构，后四句逐级内收；移动端恢复诗序纵向阅读；含键盘焦点与 `prefers-reduced-motion`。
- `src/App.jsx`：新增 `poem.layout === "autumn-brothers-stars"` 独立分发；未修改通用发布测试。
- 数据契约：唯一 id/layout、8 行原文、8 条逐句注释、译文、124 字赏析、学习文案、`/assets/poems/` 资源路径与 2026-09-05 学习记录已检查。

## Verification

- 任务基线网络无关契约：课程排除库 60 + 72 = 132，5 项 matcher；daily tests 2/2。当前 main 的上一轮 GitHub Actions / Vercel 亦为成功基线。
- `npm run bootstrap`：退出码 20，输出 `DEPENDENCY_NETWORK_UNAVAILABLE`；按仓库协议继续。
- 提交前 `npm run verify:offline`：在本次 fresh reconstruction 中通过；最终精确 GitHub tree 仍以 GitHub Actions 与 Vercel 远端构建为正式 gate。
- 本地 `npm run build`：未执行，原因是 bootstrap=20 且依赖不可用。
- 本地 `npm run test:sites`：未执行，同上。
- 桌面/手机运行时浏览器检查：未执行，同上；已完成源代码级响应式、资源路径、按钮入口与数据契约检查，提交后由 Vercel production build 与生产 URL 继续验证。
- 未提交 `dist/`、`.vercel/`、`node_modules/`、`.firecrawl/` 或 QA 截图。

final result: source review passed; remote build gate pending
