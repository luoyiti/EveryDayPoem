# Design QA — 每日古诗文 / 人月圆·山中书事

## Visual brief

- 时间：正文没有限定具体时辰；背景只借柔和斜光建立冷暖层次，不把晨昏写成作品史实。
- 地点：不复原“孔林 / 吴宫 / 楚庙”的真实地理位置，而把远处乔木、蔓草旧迹与寒鸦处理成历史感的抽象远景；近处转入松林、山泉、茅舍与茶具，回应“数间茅舍”“松花酿酒”“春水煎茶”。
- 色温与材质：远景以雾灰蓝、墨绿和冷石色为主，近景只在松木、茅舍、陶器和斜光处出现少量暖金；岩石、流水、松枝、茅草与陶器保持写实材质。
- 核心意象：历史旧迹与寒鸦在远处压低，视线沿山谷、松林、泉水逐步收近到村家与茶盏。
- 视觉命题：把“兴亡千古繁华梦”的巨大时间尺度压缩成遥远冷景，再让四段阅读一步步靠近“茅舍—藏书—酒—茶”的可触摸日常，完成“倦天涯”到“山中何事”的转折。
- 构图：不使用上一日《右溪记》的斜向水路，也不复用《折桂令·九日》的三栏横景。桌面以左侧窄题名、中央四层“远近账页”、右下边注形成不对称阅读轴；四段原文逐级右移，模拟尺度由远到近。移动端取消错位，改为沿一条垂直尺度阅读。

## Text and source check

- 维基文库《人月圆·山中书事》标明作者张可久、时代元，正文为“兴亡千古繁华梦……春水煎茶”，并归入元曲；本页以此通行文本为正文底本。
- 古文岛 / 原古诗文网《人月圆·山中书事》正文与维基文库一致，并标注“人月圆”为曲牌名、《中原音韵》入黄钟宫；本页据此标注 `黄钟·人月圆（小令）`，不补写无法核实的创作地点或具体行旅背景。
- 本轮候选为 `人月圆·山中书事 / 张可久 / 兴亡千古繁华梦`（曲）、`沉醉东风·渔夫 / 白朴 / 黄芦岸白蘋渡口`（曲）、`夕次盱眙县 / 韦应物 / 落帆逗淮镇`（诗）。三者均在按精确仓库脚本重建的 132 篇课程排除库环境中执行 `npm run check:exclusion`，退出码均为 0；并经任务基线仓库代码搜索复核未发现已发布同篇。最终选择《人月圆·山中书事》。

## Asset and implementation

- `public/assets/poems/renyueyuan-mountain.webp`：本轮 ImageGen 独立生成并转为 WebP；远处为冷色旧迹、乔木和寒鸦，近处为山村、松枝、泉水与茶具，画面无文字与 UI，左侧保留深暗低细节区域。
- `src/MountainTeaPage.jsx`：采用“千古 / 遗迹 / 村家 / 山中”四层距离账页。点击或方向键可逐层收近，边注与当前段落同步；译文、赏析、背诵、默写和历史入口完整，Escape 可关闭覆盖层。
- `src/mountain-tea.css`：桌面四段原文逐级右移，细线尺度从“远”指向“近”；移动端转为单列垂直尺度。包含键盘焦点、文本对比度与 `prefers-reduced-motion` 处理。
- 数据契约：唯一 id/layout、4 段正文、4 条逐段注释、译文、132 字赏析、学习文案、`/assets/poems/` 资源路径与 2026-09-14（Asia/Shanghai）学习记录均已源代码级检查。

## Verification

- 任务开始时重新运行基线精确 SHA 的 GitHub Actions `Validate poetry content`，结果 completed / success；网络无关检查、locked dependencies、production build 与 Sites tests 均通过。
- `npm run bootstrap`：退出码 20 / `DEPENDENCY_NETWORK_UNAVAILABLE`；本地 npm cache 不具备完整依赖且 `registry.npmjs.org` 无法解析。
- 本地 `npm run build`：未执行，原因是 bootstrap=20 且依赖不可用。
- 本地 `npm run test:sites`：未执行，同上。
- 桌面/手机运行时浏览器检查：未执行，同上；已完成源代码级响应式、资源路径、布局分发、文本长度与学习入口检查，提交后以 GitHub Actions / Vercel 作为最终 build gate。
- 未提交 `dist/`、`.vercel/`、`node_modules/`、`.firecrawl/` 或 QA 截图。

final result: source review passed; remote build gate pending
