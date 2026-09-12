# Design QA — 每日古诗文 / 右溪记

## Visual brief

- 时间：原文没有明写具体时辰，页面只采用柔和自然日光，不将晨昏或天气补写为史实。
- 地点：围绕“小溪—怪石—清流—休木异竹—亭宇”的文本空间组织画面，不复原某一现代景区，也不加入人物肖像。
- 色温与材质：湿润石灰青、深松墨绿与清水灰蓝为主，木亭只保留少量暖褐；岩石、水面、竹叶和苔藓保持真实材质。
- 核心意象：清溪撞击怪石，左侧阴翳而近乎无名的野溪向右侧较开阔、被整理的空间推进，远处仅以极小亭宇回应“俾为亭宇”。
- 视觉命题：先让清溪在怪石之间无名流动，阅读沿水而下；到末段，页面从自然观察转到“疏凿—命名—刻石”，让一处被忽略的景物进入公共记忆。
- 构图：不使用居中大卡片。桌面以左侧题名石、中央错落四段“溪程”和右下边注组成斜向水路；移动端改为横向 scroll-snap 的四段溪程，保留“见溪 / 观流 / 惜溪 / 题名”的阅读顺序。

## Text and source check

- 识典古籍《唐元次山文集（元结集）》所收《右溪记》作“欹嵌盘屈”“休木异竹”“所游处”，本页以这一传本系统为正文底本。
- 维基文库《右溪记》标明作品收入《全唐文》卷三百八十二，相关传本作“盘缺”“佳木”，且“所游处”等处有文字差异；本页仅在注释中提示“休木 / 佳木”异文，不混拼正文。
- 本轮候选为 `右溪记 / 元结 / 道州城西百余步有小溪`（文）、`鹧鸪天·鹅湖归病起作 / 辛弃疾 / 枕簟溪堂冷欲秋`（词）、`寿阳曲·江天暮雪 / 马致远 / 天将暮，雪乱舞`（曲）。三者均执行 `npm run check:exclusion` 返回 0，并经当前精确 HEAD 全文检索复核未发现已发布同篇；最终选择《右溪记》。

## Asset and implementation

- `public/assets/poems/youxi-stream.webp`：本轮 ImageGen 独立生成并转为 WebP；左侧深暗怪石与竹影形成低细节文字区，溪流由近及远穿过岩石，右上仅有小型亭宇，画面内无文字或 UI。
- `src/YouxiStreamPage.jsx`：采用“溪程”阅读结构，不复制上一日横向湖面水线。四段原文对应“见溪 / 观流 / 惜溪 / 题名”，支持点击与方向键切换，注释随段落联动；译文、赏析、背诵、默写和历史入口完整，Escape 可关闭覆盖层。
- `src/youxi-stream.css`：桌面以斜向错层原文模拟水势，题名、原文和边注分处三个空间层级；移动端转为可横向滑读的四段。包含键盘焦点、高对比文字和 `prefers-reduced-motion` 处理。
- 数据契约：唯一 id/layout、4 段正文、4 条一一对应注释、译文、146 字赏析、学习文案、`/assets/poems/` 资源路径与 2026-09-13（Asia/Shanghai）学习记录已检查。

## Verification

- 基线 `main` 精确 SHA 的既有 GitHub Actions `Validate poetry content` 为 completed / success，证明任务开始时远端基线已通过网络无关检查、依赖安装、production build 与 Sites tests。
- 本轮开始时 `npm run verify:offline`：通过；本地发布契约重建检查为 `60 + 72 = 132`、5 项 matcher 与 daily tests `2/2`。
- 三个候选的 `npm run check:exclusion`：均退出码 0。
- `npm run bootstrap`：退出码 20 / `DEPENDENCY_NETWORK_UNAVAILABLE`；本地 npm cache 无相应依赖，`registry.npmjs.org` 无法解析。
- 本地 `npm run build`：未执行，原因是 bootstrap=20 且依赖不可用。
- 本地 `npm run test:sites`：未执行，同上。
- 桌面/手机运行时浏览器检查：未执行，同上；已完成源代码级响应式、资源路径、布局分发、文本长度与学习入口检查，提交后由 GitHub Actions / Vercel 作为最终 build gate。
- 未提交 `dist/`、`.vercel/`、`node_modules/`、`.firecrawl/` 或 QA 截图。

final result: source review passed; remote build gate pending
