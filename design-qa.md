# Design QA — 每日古诗文 / 秋夜独坐

## Visual brief

- 时间：正文明确“欲二更”，页面只据此表现夜深将近二更，不补写具体年月或创作地点；题目另有“一作《冬夜书怀》”的异名，只作版本信息保留。
- 地点：只使用“空堂”、雨中山果与灯下草虫能支持的室内外阈限，不复原辋川、长安或具体宅院。
- 天气与色温：秋雨为正文明确意象；室外冷蓝黑、湿石与树影压低亮度，室内只留一处暖灯作为“灯下”的视觉节点。
- 材质与核心意象：空堂、木石阈限、雨线、湿叶、山果、灯影与细小虫声；背景图不含人物、文字、按钮、印章或现代设施。
- 视觉命题：声音由远及近——先是空堂的寂静，再听雨中山果坠落、灯下草虫低鸣，随后页面从“听见夜”转到“听见自己”的白发、黄金与无生。
- 转折：颔联是唯一集中写外界声响的联，颈联开始从感官撤回衰老与方术，尾联落到佛家“无生”。页面用“独 / 听 / 叹 / 观”四个夜刻，而不是复用田野章法或天涯谱线。

## Text and source check

- 《御定全唐诗（四库全书本）》卷一百二十六收王维《秋夜独坐》，题下注“一作冬夜书怀”，正文为“独坐悲双鬓……唯有学无生”，本页据此作为正文版本。
- 中国哲学书电子化计划《全唐诗》卷一百二十六同收《秋夜独坐》，八句字序与上述版本一致，可交叉核对题名、作者与正文。
- 古诗文网整理本正文一致，并释“欲二更”为将近二更、“黄金”为炼丹求长生语境、“无生”为佛家语；本页仅用作词义辅助，不采用其未经正文支持的具体创作地点叙述。
- 候选 `秋夜独坐 / 王维 / 独坐悲双鬓`（诗）、`踏莎行·郴州旅舍 / 秦观 / 雾失楼台`（词）、`秋夜曲 / 王维 / 桂魄初生秋露微`（诗）经排除逻辑与精确仓库搜索复核，均不命中当前课程标准排除库，也未在现有诗库/学习记录发布；命令级排除检查均返回 0。

## Asset and implementation

- `public/assets/poems/autumn-night-alone.webp`：本轮 ImageGen 独立生成，冷雨山林与暖灯空堂由门槛切开；正文区域保持暗部和低细节，未把任何人物或具体宅院当作史实。
- `src/AutumnNightListeningPage.jsx`：独立“独 / 听 / 叹 / 观”四联夜刻结构；逐联切换注释，译文、赏析、背诵、默写、历史入口完整，Escape 可关闭覆盖层。
- `src/autumn-night-listening.css`：桌面以竖题名轴 + 四联横向夜刻 + 侧注形成由外到内的阅读；移动端收为单列夜刻；包含键盘焦点与 `prefers-reduced-motion`。
- 数据契约：唯一 id/layout、4 联正文、4 条注释、译文、142 字赏析、学习文案、`/assets/poems/` 资源路径与 2026-09-11（Asia/Shanghai）学习记录已检查。

## Verification

- 当前精确基线 GitHub Actions `Validate poetry content`：通过；对应任务基线 SHA 的最新运行状态为 completed / success。
- fresh reconstruction `npm run verify:offline`：通过；课程排除契约 60 + 72 = 132，5 项 matcher 通过，daily tests 2/2。
- `npm run bootstrap`：退出码 20，输出 `DEPENDENCY_NETWORK_UNAVAILABLE`；按仓库协议继续。
- 本地 `npm run build`：未执行，原因是 bootstrap=20 且依赖不可用。
- 本地 `npm run test:sites`：未执行，同上。
- 桌面/手机运行时浏览器检查：未执行，同上；已完成源代码级响应式、资源路径、布局分发与交互入口检查，提交后由 GitHub Actions / Vercel 作为最终 build gate。
- 未提交 `dist/`、`.vercel/`、`node_modules/`、`.firecrawl/` 或 QA 截图。

final result: source review passed; remote build gate pending
