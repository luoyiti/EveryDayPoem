# Design QA — 每日古诗文 / 溪居即事

## Visual brief

- 时间与地点：江南水乡春日下午，溪湾、低篱与柴门之间发生一件极小的日常事件；页面不虚构具体地名与创作背景。
- 天气与色温：诗只明确“春风”，不额外添加雨雪、月夜或浓雾；采用纸白、湿润青绿与浅木色。
- 材质与核心意象：溪水、篱笆、未系小船、柴门与小童。主结构不用写实插画复述故事，而以一条“漂移轴”表现船被风吹入湾内，再以排版跳转表现小童奔向柴门。
- 视觉命题：前两句是一只空船从左向右漂来，后两句突然切换到小童的误认与奔跑；阅读轨迹从“无人之景”切到“有人之情”。
- 转折：第三句“小童疑是有村客”改变叙事主体；构图、阅读顺序与既有秋夜双空间、村夜推门、分水岭双轨、台城历史断面、兰溪水镜均不同。

## Asset and implementation

- Image asset: `public/assets/poems/streamside-breeze.webp`, 1200 × 900 WebP。当前任务确实调用 ImageGen，但运行时连续返回了与要求不一致的报告式画面；因此仅从本次生成结果的无文字、无 UI 场景区域裁切，并重度模糊、降对比与青绿调色，作为极低细节水气纹理。页面不把纹理中的具体物件解释为诗中史实。
- Layout: `streamside-breeze` 独立 React 页面，组件 `src/StreamsidePage.jsx`，样式 `src/streamside-breeze.css`。
- 阅读顺序：四句沿“未系船 → 春风入湾 → 小童误认 → 去却门闩”的路径错位展开；第三句之后视觉轨迹明显向柴门一侧跳转。
- 学习路径：逐句注释、译文、赏析、背诵、默写与历史入口均可达；Escape 可关闭学习层与历史层。
- Accessibility: 逐句按钮提供 `aria-current`，注释/详情使用 `aria-live`，学习层使用 dialog 语义，键盘焦点清晰，并提供 `prefers-reduced-motion`。
- Responsive: 手机端把漂移轴压缩为纵向错位阅读序列，五项学习工具固定在底部，详情层与学习层均避开工具栏。

## Verification

- Baseline `npm run verify:offline`: passed before content changes in a fresh network-independent reconstruction of the current SHA; exclusion matcher contract 60 + 72 = 132，daily tests 2/2。实际排除库文件同时通过 GitHub 连接器读取并对三个候选做字符串复核。
- Candidate exclusion checks: 溪居即事 / 江村晚眺 / 山中均执行 `npm run check:exclusion`，退出码 0；三者在当前课程排除库、现有诗库与学习记录中均无匹配。
- Text collation: 《全唐诗》卷714载“篱外谁家不系船，春风吹入钓鱼湾。小童疑是有村客，急向柴门去却关。”；《万首唐人绝句》四库本同篇第二句作“春风催入钓鱼湾”。发布采用《全唐诗》“吹入”的通行文本，并在注释中记录“催入”异文。
- `npm run bootstrap`: exit 20 with `DEPENDENCY_NETWORK_UNAVAILABLE` (`registry.npmjs.org` DNS unavailable).
- Final `npm run verify:offline`: passed after final source edits; exclusion matcher contract 60 + 72 = 132，daily tests 2/2。
- Source inspection: daily data contract、唯一布局分发、资源路径、四句注释、译文、144 字赏析、背诵、默写、历史入口、移动端 CSS 与 reduced-motion 均已检查。
- Local Vite build / desktop-mobile browser runtime QA: 未执行；原因是 bootstrap 按仓库协议进入退出码 20 恢复路径，本地依赖不可用。最终 build gate 由 GitHub Actions 与 Vercel 对唯一提交执行。
- Production status: pending the single Git commit's remote build and production runtime verification.

final result: pending remote build gate

---

# Prior QA history

- 秋夜寄邱员外：双空间秋夜布局；bootstrap 走 exit-20 路径，最终由远端 build gate 验证。
- 村夜：推门见月布局；bootstrap 走 exit-20 路径，生产验证由 Vercel 完成。
- 过分水岭：双轨分流布局；bootstrap 走 exit-20 路径，生产验证由 Vercel 完成。
- 台城：四段历史断面 + 右侧窄幅场景；bootstrap 走 exit-20 路径，生产验证由 Vercel 完成。
- 题金陵渡：四段近远视线轨迹；bootstrap 走 exit-20 路径，最终由 Vercel 完成生产构建与运行时验证。
- 咸阳值雨：四层雨幕构图；桌面/移动与学习交互此前通过生产 QA。
- 枫桥夜泊：夜航舱窗构图；桌面/移动视觉比较与学习交互此前通过 QA。
- 兰溪棹歌：水镜逐句构图；bootstrap 走 exit-20 路径，生产验证由 Vercel 完成。
