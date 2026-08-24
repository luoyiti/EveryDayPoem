# Design QA — 每日古诗文 / 台城

## Visual brief

- 时间与地点：金陵台城旧址的细雨时分；诗眼不在复原宫阙，而在“六朝如梦”之后仍然存在的江草与柳堤。
- 天气与色温：霏霏江雨，灰绿与旧纸色为主；右侧夜雨建筑仅作为“旧景残影”，不冒充具体史迹复原。
- 材质与核心意象：湿草、长堤、柳烟、旧墙与被雨气压低的远景。
- 视觉命题：页面左侧像一张留白甚多的历史断面，四句依次刻入；右侧只保留一块幽暗风景，让“人事已去、草木依旧”的反差在空间上成立。
- 转折：前两句由江雨进入“六朝如梦”，后两句把兴亡感压缩到无情柳色。布局因此采用横向四层文字断面 + 右侧窄幅场景，不复用既有雨幕、水镜、斜向远望、雪纸长卷或晨窗构图。

## Asset and implementation

- Background asset: `public/assets/poems/taicheng-rain.webp`, 900 × 700 WebP。素材来自本次任务中 ImageGen 生成图的无文字场景区域，经裁切与色调处理后保存；生产资产本身不含诗文、UI、按钮或表格。
- Layout: `taicheng-rain` 独立 React 分支，样式位于 `src/taicheng-rain.css`。
- 阅读顺序：四句自上而下排列为四个“历史断面”，当前句以短横线与文字位移强调；注释随句切换。
- 学习路径：注释、译文、赏析、背诵、默写五个入口完整；历史抽屉复用现有公共能力。
- Accessibility: 逐句按钮使用 `aria-current`，注释和详情使用 `aria-live`；共享焦点与 reduced-motion 规则继续生效。
- Responsive: 手机端将右侧场景收为顶部横幅，四句断面转为自然文流，五项学习工具固定在底部。

## Verification

- Baseline `npm run verify:offline`: passed before content changes.
- Three candidate exclusion commands: 台城 / 月夜 / 寄人 all exited 0.
- `npm run bootstrap`: exit 20 with `DEPENDENCY_NETWORK_UNAVAILABLE` (`registry.npmjs.org` DNS unavailable).
- Final `npm run verify:offline`: passed; 132-entry exclusion-library contract and both daily-content tests passed.
- Local Vite build / browser desktop-mobile runtime QA: 未执行；原因是 bootstrap 按仓库协议进入退出码 20 恢复路径，本地依赖不可用。已人工检查新资源路径、唯一布局分发、四句/四注释数据契约、CSS 移动端规则以及公共学习/历史入口。
- Production status: pending the single Git commit's Vercel build and production runtime verification.

final result: pending remote build gate

---

# Prior QA history

- 题金陵渡：四段近远视线轨迹；bootstrap 走 exit-20 路径，最终由 Vercel 完成生产构建与运行时验证。
- 咸阳值雨：四层雨幕构图；桌面/移动与学习交互此前通过生产 QA。
- 枫桥夜泊：夜航舱窗构图；桌面/移动视觉比较与学习交互此前通过 QA。
- 兰溪棹歌：水镜逐句构图；bootstrap 走 exit-20 路径，生产验证由 Vercel 完成。
