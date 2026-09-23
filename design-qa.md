# Design QA — 每日古诗文 / 水仙子·咏江南

## Visual brief
- 时间与地点：不指定具体史实时辰，以晴日薄岚下的江南秋水为场景；只取正文可支持的烟水、晴岚、画檐、芰荷、沙鸥、画船、酒旗。
- 核心命题：**景物先走，心意最后抵达。** 视线从远处烟岚进入两岸人家，再落到芰荷与沙鸥，随后随香风、画船、酒旗向前，直到末句才出现“爱杀江南”的观看者。
- 构图：左侧留大面积低细节烟水作为标题负空间，右侧承载画檐、芰荷、鸥鸟、远舟与无字酒旗；正文区采用四站横向“水路”而非上一页的三列笼内/檐外结构。
- 色彩：低饱和青灰水色、岚白、荷叶绿和少量暖木色；无人物特写、现代物件、可读文字。

## Text and source check
- 古文岛《水仙子·咏江南》核对作者、时代、题名及完整正文，采用“芰荷丛一段秋光淡”“酒旗儿风外飐”“爱杀江南”文本。
- 弥勒市人民政府《诗意栖居红河水乡》引用本曲前半，交叉核对“一江烟水照晴岚，两岸人家接画檐，芰荷丛一段秋光淡。看沙鸥舞再三，卷香风十里珠帘”。
- 华东师范大学转载文汇报文章再次引用开篇两句，辅助核对江南水乡意象。
- 赏析 131 字；4 段原文与 4 条注释一一对应。
- 候选：`水仙子·咏江南 / 张养浩 / 一江烟水照晴岚`（曲）、`书河上亭壁 / 寇准 / 岸阔樯稀波渺茫`（诗）、`蝶恋花·槛菊愁烟兰泣露 / 晏殊 / 槛菊愁烟兰泣露`（词）。精确基线的课程排除库题名/首句检索均无命中；最终作品还须由实际提交树的仓库 matcher 再验证。
- 发布前最近七篇体裁：赋、文、词、诗、文、曲、词；本轮选择“曲”后为曲、赋、文、词、诗、文、曲，覆盖四类且没有连续三次同体裁；最近十四篇仍同时包含诗、词、曲、文、赋。

## Asset and implementation
- `public/assets/poems/shuixianzi-jiangnan.webp`：本轮 ImageGen 独立生成并压缩为 512×288 WebP、6460 B；本地 RIFF 声明长度与实际字节数一致。
- `src/JiangnanWaterPage.jsx`：独立页面以“烟—鸥—舟—爱”四段水路组织阅读，支持点击/方向键逐段注释、今译、赏析、背诵、默写、历史入口与完成状态记录。
- `src/jiangnan-water.css`：桌面横向水路 + 双栏当前段，移动端改为紧凑四站 + 单栏；包含 `focus-visible` 与 `prefers-reduced-motion`。
- 数据契约：id `shuixianzi-jiangnan`、layout `jiangnan-water-ribbon`、4:4 原文/注释、资源路径、2026-09-24（Asia/Shanghai）学习记录均已做源代码级检查。

## Verification
- 精确任务基线 SHA 的 GitHub Actions `Validate poetry content` attempt 2 已成功，包含 Network-independent content checks、locked dependencies、production build 与 Sites tests。
- `npm run bootstrap` 在 connector-reconstructed 依赖配置中返回 20 / `DEPENDENCY_NETWORK_UNAVAILABLE`；因此按协议不伪造本地 production build、Sites tests 或桌面/手机运行时结果，最终以实际提交树的 GitHub Actions 与 Vercel Git 集成为权威 gate。
- 提交前源代码级检查覆盖：daily id、学习记录首项、唯一布局分发、4:4 原文/注释、131 字赏析、WebP RIFF 完整性、响应式/焦点/减少动态声明。
- 未提交 `dist/`、`.vercel/`、`node_modules/`、截图或生成器中间文件。

final result: source verification completed; remote build gate pending
