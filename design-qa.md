# Design QA — 每日古诗文 / 秋夜寄邱员外

## Visual brief

- 时间与地点：清凉秋夜，诗人散步所在的“此夜”与友人幽居的“彼山”被留白分隔；页面不把两地误画成同一现场。
- 天气与色温：原诗只写“凉天”，因此采用蓝黑、松针灰绿与纸灰，不增加雨雪、月亮或灯火。
- 材质与核心意象：暗色空气、空山、松针与松子；真实图像只作为极低对比度夜色纹理，主体叙事由空间留白与文字完成。
- 视觉命题：前两句停在左侧“此夜”，第三句跨过中央距离线进入右侧“彼山”，第四句留在远端；一枚不可见但可想象的“松子落”以声音把两处空间连接。
- 转折：第三句从实写自己的散步转入遥想友人的空山；构图、阅读顺序与既有村夜“推门”、分水岭“双轨”、台城“历史断面”、兰溪“水镜”等均不同。

## Asset and implementation

- Image asset: `public/assets/poems/autumn-letter-texture.webp`, 1200 × 900 WebP。来自本次任务 ImageGen 输出中的无文字、无 UI 深蓝夜空区域，经裁切、降饱和和轻微模糊后作为低对比度纹理；页面不把纹理中的细节解释为诗中史实。
- Layout: `autumn-letter` 独立 React 页面，组件 `src/AutumnLetterPage.jsx`，样式 `src/autumn-letter.css`。
- 阅读顺序：四句按“怀君 → 散步 → 空山 → 未眠”从左向右跨越中央距离线；前两句属于“此夜”，后两句属于“彼山”。
- 学习路径：逐句注释、译文、赏析、背诵、默写与历史入口均可达；Escape 可关闭学习层。
- Accessibility: 逐句按钮提供 `aria-current`，注释与详情使用 `aria-live`，学习层使用 dialog 语义，键盘焦点清晰，并提供 `prefers-reduced-motion`。
- Responsive: 手机端仍保留左右空间的轻微错位和中央距离线，工具区固定在底部，详情层避开工具栏。

## Verification

- Baseline `npm run verify:offline`: passed before content changes; exclusion-library contract 60 + 72 = 132，daily tests 2/2。
- Candidate exclusion checks: 秋夜寄邱员外 / 宿石邑山中 / 江楼感旧均退出码 0；并人工对照当前课程排除库、现有诗库与学习记录，无重复。
- Text collation: display title uses the common modern title `秋夜寄邱员外`; alias `秋夜寄丘二十二员外` is recorded by《全唐诗》卷188。正文采用通行“空山松子落”，并在注释中说明《全唐诗》卷188作“山空松子落”。
- `npm run bootstrap`: exit 20 with `DEPENDENCY_NETWORK_UNAVAILABLE` (`registry.npmjs.org` DNS unavailable).
- Final `npm run verify:offline`: passed after final source edits; exclusion-library contract 60 + 72 = 132，daily tests 2/2。
- Local Vite build / desktop-mobile browser runtime QA: not executed under the exit-20 recovery path; final build gate is GitHub Actions and Vercel for the single commit.
- Production status: pending the single Git commit's remote build and production runtime verification.

final result: pending remote build gate

---

# Design QA — 每日古诗文 / 村夜

## Visual brief

- 时间与地点：秋夜乡村，从村落边缘走出前门，视线由近处霜草与空路突然打开到月下田野。
- 天气与色温：原诗只明确“霜草”与“月明”，页面采用冷灰、靛蓝与月白；不额外添加雨雪天气。
- 材质与核心意象：霜草、村路、门槛、空旷田野、月光与浅白荞麦花。
- 视觉命题：前两句被压在暗色“门内”区域，读到“独出前门”后页面横向展开，第四句落到更明亮的月田；主交互“推门见月”直接回应第三句的空间转折。
- 构图区别：不复用既有雨幕、水镜、渡口远望、台城历史断面、分水岭双轨、雪纸长卷或晨窗结构。

## Asset and implementation

- Image asset: `public/assets/poems/village-night.webp`, 960 × 600 WebP。来自本次任务中的 ImageGen 输出，经裁切仅保留无文字、无 UI 的生成式山林区域，再作冷色与门槛暗部处理；图像只承担氛围层，页面结构仍由 HTML/CSS 与阅读交互表达。
- Layout: `village-night` 独立 React 页面，组件 `src/VillageNightPage.jsx`，样式 `src/village-night.css`。
- 阅读顺序：四句沿“霜草 → 空村 → 出门 → 月田”展开；第三、四句在桌面端向右偏移，形成从封闭到开阔的视觉转折。
- 学习路径：逐句注释、译文、赏析、背诵、默写和历史入口均可达；Escape 可关闭学习层。
- Accessibility: 逐句按钮提供 `aria-current`，注释/详情使用 `aria-live`，学习层使用 dialog 语义，并提供 `prefers-reduced-motion`。
- Responsive: 手机端将横向展开收为轻微错位的纵向序列，底部五项学习工具固定可达，详情层避开工具栏。

## Verification

- Baseline `npm run verify:offline`: passed before content changes; exclusion library contract 60 + 72 = 132，daily tests 2/2。
- Candidate exclusion checks: 村夜 / 江楼旧感 / 宿骆氏亭寄怀崔雍崔衮均退出码 0；并人工对照当前 132 条课程排除库与学习记录，无重复。
- `npm run bootstrap`: exit 20 with `DEPENDENCY_NETWORK_UNAVAILABLE` (`registry.npmjs.org` DNS unavailable).
- Final `npm run verify:offline`: passed in the reconstructed workspace; daily-content tests 2/2 passed，赏析 134 字。
- Source inspection: daily data contract、唯一布局分发、资源路径、逐句注释、译文、赏析、背诵、默写、历史入口、移动端 CSS 与 reduced-motion 均已检查。
- Local Vite build / desktop-mobile browser runtime QA: 未执行；原因是 bootstrap 按仓库协议进入退出码 20 恢复路径，本地依赖不可用。最终 build gate 由 GitHub Actions 与 Vercel 对唯一提交执行。
- Production status: pending the single Git commit's remote build and production runtime verification.

final result: pending remote build gate

---

# Design QA — 每日古诗文 / 过分水岭

## Visual brief

- 时间与地点：行人入山三日后抵达分水岭，第三句在岭头与溪水分路；末句进入“一夜声”的听觉时段。
- 天气与色温：原诗未交代雨雪、月色或晴阴，页面不额外编造天气；采用石墨黑、冷青灰与少量土褐作为中性色温。
- 材质与核心意象：山路、溪水、山岭、岩面与持续的潺湲水声。右侧只放一条狭长山谷溪流图像，作为空间提示，不把图中景物解释为具体史实或诗中实景复原。
- 视觉命题：前两句让“人路”和“水路”两条细线并行，读到第三句时两线真正分开，第四句被放到另一列，只剩水声留在远侧。
- 转折：第三句“岭头便是分头处”是页面结构转折；空间构图、阅读顺序和交互均不同于既有雨幕、水镜、斜向远望、历史断面、雪纸长卷与晨窗页面。

## Asset and implementation

- Image asset: `public/assets/poems/watershed-parting.webp`, 460 × 1000 WebP。来自本次任务中的 ImageGen 输出，经裁切仅保留无文字、无 UI 的山谷溪流区域；页面不依赖该图完成构图，图像只作为右侧窄幅空间线索。
- Layout: `watershed-parting` 独立 React 页面，组件 `src/WatershedPage.jsx`，样式 `src/watershed-parting.css`。
- 阅读顺序：四句按“同行 → 同行 → 分头 → 水声”组织；第三句后排版轨迹分离，第四句进入右列。
- 学习路径：逐句注释、译文、赏析、背诵、默写和历史入口均可达；Escape 可关闭学习层与历史抽屉。
- Accessibility: 逐句按钮使用 `aria-current`，注释/详情使用 `aria-live`，焦点样式明确，并提供 `prefers-reduced-motion` 降低动态。
- Responsive: 手机端保留双轨分离关系，将右侧图像压缩为短横幅；五项学习工具固定在底部，详情层避开底部工具区。

## Verification

- Baseline `npm run verify:offline`: passed before content changes; exclusion library 60 + 72 = 132，daily tests 2/2。
- Candidate exclusion checks: 过分水岭 / 江村晚眺 / 野望均退出码 0。
- `npm run bootstrap`: exit 20 with `DEPENDENCY_NETWORK_UNAVAILABLE` (`registry.npmjs.org` DNS unavailable).
- Final `npm run verify:offline`: passed; exclusion library contract and daily-content tests 2/2 passed.
- Source inspection: daily data contract、资源路径、唯一布局分发、注释/译文/赏析/背诵/默写/历史入口、移动端 CSS 与 reduced-motion 均已检查。
- Local Vite build / desktop-mobile browser runtime QA: 未执行；原因是 bootstrap 按仓库协议进入退出码 20 恢复路径，本地依赖不可用。最终 build gate 由 GitHub Actions 与 Vercel 对唯一提交执行。
- Production status: pending the single Git commit's remote build and production runtime verification.

final result: pending remote build gate

---

# Prior QA history

- 台城：四段“历史断面” + 右侧窄幅场景；bootstrap 走 exit-20 路径，生产验证由 Vercel 完成。
- 题金陵渡：四段近远视线轨迹；bootstrap 走 exit-20 路径，最终由 Vercel 完成生产构建与运行时验证。
- 咸阳值雨：四层雨幕构图；桌面/移动与学习交互此前通过生产 QA。
- 枫桥夜泊：夜航舱窗构图；桌面/移动视觉比较与学习交互此前通过 QA。
- 兰溪棹歌：水镜逐句构图；bootstrap 走 exit-20 路径，生产验证由 Vercel 完成。
