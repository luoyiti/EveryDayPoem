# Design QA — 每日古诗文 / 点绛唇·感兴

## Visual brief

- 时间：正文没有明确时刻，只以云雨、水村、孤烟与天际征鸿组织空间；页面采用雨后低云的漫射自然光，不把画面钉死在某个史实时辰。
- 地点：只抽象呈现“江南”水乡与渔市，不指认具体城市、河湖或作者凭栏所在。
- 天气与色温：冷灰青为主，湿木与远处极弱暖光为辅；画面保持雨后空气的清湿感，不虚构暴雨或艳丽日落。
- 材质：湿木栏杆、水面、低矮瓦屋、薄雾和一缕炊烟；生成图不含文字或 UI。
- 核心意象：雨云、江南水村、渔市、一缕孤烟、天际征鸿与凭栏凝睇。
- 视觉命题：**读者从近处湿栏起步，沿一缕孤烟把目光推到天际雁行，再由最远处折返“平生事”；页面让空间距离本身承担词的转折。**
- 构图：不使用居中大卡片。桌面版把四句分布在一条由近到远的斜向视线中，第四句位于最远端后回收至右侧解释；移动端保留四个递进层级并压缩水平位移。

## Text and source check

- 维基文库《点绛唇（王禹偁）》核对作者、北宋、词体与九句正文，作“谁会凭栏意”。
- 古文岛 / 原古诗文网《点绛唇·感兴》交叉核对现代通行题名、正文、词牌释义以及“征鸿、缀、凝睇”等常用解释，并提示“栏”通“阑”。
- 旧式来源常仅以词牌“点绛唇”为题，现代整理本多加“感兴”；本页采用现代通行题名，并在首条注释说明，不把编辑题误作作者自题。
- 本轮候选为 `点绛唇·感兴 / 王禹偁 / 雨恨云愁`（词）、`清平乐·金风细细 / 晏殊 / 金风细细`（词）、`淮上喜会梁川故人 / 韦应物 / 江汉曾为客`（诗）。三项均用仓库 matcher 执行排除检查并返回 0，且精确 HEAD 代码搜索首句均无命中；最终选择《点绛唇·感兴》，使昨日“文”后切回词体，同时最近 7 次继续覆盖诗、词、曲、文、赋五类。

## Asset and implementation

- `public/assets/poems/dianjiangchun-rain-gaze.webp`：本轮 ImageGen 独立生成并压缩为 640×360 WebP；画面以低云、水面、水村、单缕炊烟、远雁与湿栏组织，不含诗文或 UI。
- `src/DianjiangchunGazePage.jsx`：四句被组织成“雨 / 烟 / 鸿 / 睇”四个视距节点；方向键可逐句推进，译文、赏析、背诵、默写和历史入口完整，Escape 可关闭覆盖层。
- `src/dianjiangchun-gaze.css`：桌面以斜向 sightline 取代常规卡片栅格；移动端缩短横向位移；包含焦点可见性、暗部对比度和 `prefers-reduced-motion`。
- 数据契约：唯一 id/layout、4 句正文、4 条逐句注释、译文、134 字赏析、学习文案、`/assets/poems/` 资源路径及 2026-09-17（Asia/Shanghai）学习记录均已源代码级检查。

## Verification

- 任务基线 exact SHA 的 GitHub Actions `Validate poetry content` 已重新运行 attempt 2，completed / success。
- `npm run bootstrap`：隔离工作区运行仓库脚本，退出码 20 / `DEPENDENCY_NETWORK_UNAVAILABLE`；本地 npm cache 不完整且 `registry.npmjs.org` 无法解析。
- `npm run verify:offline`：提交前以本轮 fresh reconstruction 运行；课程排除库契约、matcher 与 daily content tests 以实际输出为准。
- 本地 `npm run build` / `npm run test:sites`：未执行；bootstrap=20 且依赖不可用，按仓库协议改以远端 GitHub Actions / Vercel 为最终 build gate。
- 桌面/手机运行时浏览器检查：未执行；本地依赖不可用。已完成源代码级响应式、资源路径、布局分发、键盘焦点与学习入口检查。
- 未提交 `dist/`、`.vercel/`、`node_modules/`、`.firecrawl/` 或 QA 截图。

final result: source review completed; remote build gate pending
