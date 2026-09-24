# Design QA — 每日古诗文 / 书河上亭壁

## Visual brief
- 时间与地点：河阳一带河上亭的秋日傍晚；视觉只取组诗小序与秋篇可支持的高亭、阔河、稀樯、远树、疏林、秋山和夕阳，不复原具体亭址。
- 核心命题：**河面越开，人越小；夕阳只照半山，让苍茫与余温同时存在。** 页面从近处高栏向河面、疏林、半山逐层拉远，呼应两联由近而远的观看。
- 构图：首屏从亭内阴影向右侧开阔河面展开；栏杆成为近景斜线，水面承担大面积负空间，稀少船桅与半山夕照落在远处。正文区只设“河 / 山”两层远望，不沿用上一页四站水路。
- 色温与材质：冷灰蓝河水、暗木亭栏、低饱和枯褐林色与克制夕阳金；真实木、瓦、水、落叶和薄雾材质，无人物、现代物件或可读文字。

## Text and source check
- 《石仓历代诗选》四库全书本卷一百二十四收寇准组诗小序及四绝，秋篇作“岸阔樯稀浪渺茫……一半秋山带夕阳”；本页以此为正文底本。
- 古文岛《书河上亭壁》核对题名、作者和全诗；其首句作“波渺茫”，并明注“波 一作：浪”，因此本页只在注释说明异文，不混拼。
- 赏析 123 字；2 联原文与 2 条注释一一对应。
- 候选：`书河上亭壁 / 寇准 / 岸阔樯稀浪渺茫`（诗）、`西湖七月半 / 张岱 / 西湖七月半，一无可看`（文）、`蝶恋花·槛菊愁烟兰泣露 / 晏殊 / 槛菊愁烟兰泣露`（词）；三项均以当前 132 篇课程排除库运行仓库 matcher，退出码均为 0；仓库题名/首句检索无已发布同篇。
- 发布前最近七篇体裁：曲、赋、文、词、诗、文、曲；本轮选择“诗”后为诗、曲、赋、文、词、诗、文，七次中仍覆盖五类体裁且不存在连续三次同体裁。

## Asset and implementation
- `public/assets/poems/he-shang-pavilion-sunset.webp`：本轮 ImageGen 独立生成，压缩为 512×288 WebP、6442 B；RIFF 声明长度与实际字节数一致。
- `src/RiverHalfLightPage.jsx`：独立页面以“河 / 山”两层远望组织阅读；支持点击与方向键切换逐联笺记、今译、赏析、背诵、默写、历史入口及本地完成状态。
- `src/river-half-light.css`：桌面以亭内阴影 + 河面远望形成左右张力，移动端改为上下叙事；包含 `focus-visible` 与 `prefers-reduced-motion`。
- 数据契约：id `river-half-sunset`、layout `river-half-light`、2:2 原文/注释、资源路径及 2026-09-24（Asia/Shanghai）学习记录已做源代码级检查。

## Verification
- 精确任务基线 SHA 的 GitHub Actions `Validate poetry content` attempt 3 已成功，包含 Network-independent content checks、locked dependencies、production build 与 Sites tests。
- `npm run bootstrap` 返回 20 / `DEPENDENCY_NETWORK_UNAVAILABLE`；按仓库协议继续内容工作，不伪造本地 production build、Sites tests 或桌面/手机运行时结果，最终以实际提交树的 GitHub Actions 与 Vercel Git 集成为 build gate。
- 提交前检查覆盖：daily id、学习记录首项、唯一布局分发、2:2 原文/注释、123 字赏析、WebP RIFF 完整性、响应式/焦点/减少动态声明。
- 未提交 `dist/`、`.vercel/`、`node_modules/`、QA 截图或生成器中间文件。

final result: source verification completed; remote build gate pending
