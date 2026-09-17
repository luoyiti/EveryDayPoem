# Design QA — 每日古诗文 / 秋赋

## Visual brief

- 时间：正文从“爽节”与云净水洁写起，后半明确进入月色、星汉与夜鹊；页面用黄昏向夜空过渡的连续空间表达章法，不把它误认作某个具体史实时刻。
- 地点：只呈现赋中可支持的水岸、青山、楼阁、帷幔、江浦与河畔，不指认具体城市或宫苑。
- 情绪温度：清冷、疏朗、明净，末尾保留莲香草青的余温；不把“秋”简化为衰败或落叶。
- 核心意象：高天、澄水、珠露、燕雁、绮阁、轻绡碧幔、金波、玉绳、夜鹊、牵牛、莲与青草。
- 视觉命题：**一扇轻幔把视线从澄水抬向星汉，再把读者送回仍有莲香草青的河畔；秋的核心不是萧瑟，而是“净、高、洁、澈”中的余生机。**
- 构图：不使用居中卡片。八段正文分居一条垂直“秋—水—阁—夜”脊线两侧，阅读顺序交替上升；四个阶段按钮改变注释焦点，方向键逐段移动。

## Text and source check

- 维基文库《秋赋》及其所收《全唐文》卷一百三十八核对作者、唐代归属与正文，采用“镜青山之凄澈、临冰观、开雾谷之疏幌”这一《全唐文》数字本系统。
- 四库《全唐文》卷一百三十八电子本交叉核对篇名、作者和主体正文；其云字有 OCR 缺损，因此不据该缺字改动正文。
- 另查清代类书所引旧文，见“晃澈、临飞观、雾縠”等异文。本页只在注释提示“临飞观”异文，不把不同传本混拼入正文。
- 本轮候选为 `秋赋 / 虞世南 / 观四时之代序`（赋）、`沉醉东风·渔夫 / 白朴 / 黄芦岸白蘋渡口`（曲）、`夕次盱眙县 / 韦应物 / 落帆逗淮镇`（诗）。精确 HEAD 的 132 篇排除库检索题名与首句均无命中，仓库现有代码首句搜索也为 0。最终选择《秋赋》，使最近 7 次体裁成为“赋、词、文、诗、曲、文、词”，覆盖诗、词、曲、文、赋五类。

## Asset and implementation

- `public/assets/poems/qiufu-clear-autumn.webp`：本轮 ImageGen 独立生成并压缩为 480×270 WebP；以澄水、远山、楼阁、轻幔、月星、飞雁与河畔莲叶构成，不含文字或 UI。
- `src/ClearAutumnPage.jsx`：八段原文沿垂直时序脊线交替排布，以“澄 / 清 / 登 / 夜”四阶段组织注释；支持方向键逐段阅读、译文、赏析、背诵、默写与往日篇章。
- `src/clear-autumn.css`：桌面版将正文分布在脊线两侧，移动端收窄为双列短行；包含焦点可见性、暗部对比度和 `prefers-reduced-motion`。
- 数据契约：唯一 id/layout、8 段正文、8 条对应注释、译文、135 字赏析、学习文案、`/assets/poems/` 资源路径及 2026-09-18（Asia/Shanghai）学习记录均已源代码级检查。

## Verification

- 任务基线 exact SHA 的 GitHub Actions `Validate poetry content` 已重新运行最新 attempt，网络无关内容检查、锁定依赖安装、production build 与 Sites tests 全部 success。
- `npm run bootstrap`：隔离工作区运行仓库脚本，观察到退出码 20 / `DEPENDENCY_NETWORK_UNAVAILABLE`；本地 npm cache 不完整且 `registry.npmjs.org` 无法解析。
- 本地 `npm run build` / `npm run test:sites` / 桌面及手机浏览器运行时检查：未执行；bootstrap=20 且依赖不可用，按仓库协议改以最终提交的 GitHub Actions / Vercel 为远端 build gate。
- 提交前已做源代码级数据契约、资源存在性、中文字符串、赏析长度、学习记录首项、App layout 分发、键盘路径与响应式规则检查。
- 未提交 `dist/`、`.vercel/`、`node_modules/`、QA 截图或生成器中间文件。

final result: source review completed; remote build gate pending
