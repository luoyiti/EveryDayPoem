# Design QA — 每日古诗文 / 夕次盱眙县

## Visual brief

- 时间：傍晚由日沈转入夜色；只依据“日沈夕”“独夜”“听钟”组织光线变化，不附会具体时辰。
- 地点：盱眙、淮水边的泊舟与孤驿环境；画面只取水面、船舷、芦洲、远山与极简岸边建筑，不复原具体历史地标。
- 天气与色温：正文明确“风起波”，因此水面保留风纹；色温由残余暮光的微暖过渡到蓝灰夜色。
- 核心意象：落帆、孤驿、风波、沉日、山郭、人归、雁下、芦洲、秦关与夜钟。
- 视觉命题：**舟停了，暮色却继续移动；当人归、雁下之后，页面只剩一声看不见的钟，把“未眠客”留在所有归宿之外。**
- 构图：不采用居中卡片。正文按“泊 / 暮 / 归 / 钟”四个岸标沿一条横向航线展开；每次只显出一联及对应注释，方向键可沿航线前后移动，结尾由视觉转为听觉提示。

## Text and source check

- 维基文库《全唐诗》卷191《夕次盱眙县》核对篇名、作者与正文，采用“落帆逗淮镇”“芦洲白”；其“逗”下注“一作透”。
- 识典古籍《御定全唐诗录》韦应物卷交叉核对全诗；该数字本作“蘆州白”，本页不据单一数字转写改动通行“芦洲白”。
- 古文岛整理页用于交叉核对“次、逗、舫、冥冥、芦洲、秦关”等基础词义；创作背景未写入正文数据，避免把二手考据当成确定史实。
- 本轮候选为 `夕次盱眙县 / 韦应物 / 落帆逗淮镇`（诗）、`蝶恋花·通涟水赠赵晦之 / 苏轼 / 自古涟漪佳绝地`（词）、`沉醉东风·渔夫 / 白朴 / 黄芦岸白蘋渡口`（曲）。精确 HEAD 的 132 篇排除库检索题名/首句均无命中，仓库代码搜索三篇也均为 0；最终选择《夕次盱眙县》。

## Asset and implementation

- `public/assets/poems/xuci-xuyi-twilight.webp`：本轮 ImageGen 独立生成并压缩为 320×180 WebP；包含暮水、船舷、芦洲、归雁与远岸，不含文字或 UI。
- `src/XuyiMooringPage.jsx`：以“泊 / 暮 / 归 / 钟”四站横向推进，原文与逐句注释、译文、赏析、背诵、默写、历史入口完整可用；支持方向键与 Escape。
- `src/xuyi-mooring.css`：桌面构图为左侧题名、中央航线、右侧联句与竖向夜色刻度；移动端改为单列并固定学习工具栏；包含键盘焦点与 `prefers-reduced-motion`。
- 数据契约：唯一 id/layout、8 句原文、8 条一一对应注释、译文、134 字赏析、学习文案、`/assets/poems/` 资源路径与 2026-09-18（Asia/Shanghai）学习记录均已源代码级检查。

## Verification

- 任务基线 exact SHA 的 GitHub Actions `Validate poetry content` 已重新运行 attempt 2，网络无关内容检查、锁定依赖安装、production build 与 Sites tests 全部 success。
- `npm run bootstrap`：隔离工作区运行仓库同版脚本，返回退出码 20 / `DEPENDENCY_NETWORK_UNAVAILABLE`；本地 npm cache 不完整且 `registry.npmjs.org` 无法解析。
- 本地 `npm run build` / `npm run test:sites` / 桌面及手机浏览器运行时检查：未执行；bootstrap=20 且依赖不可用，按仓库协议改以最终提交的 GitHub Actions / Vercel 为远端 build gate。
- 提交前执行源代码级数据契约、资源存在性、中文字符串、赏析长度、学习记录首项、App layout 分发、CSS 响应式规则与候选重复检查。
- 未提交 `dist/`、`.vercel/`、`node_modules/`、`.firecrawl/`、QA 截图或生成器中间文件。

final result: source review completed; remote build gate pending
