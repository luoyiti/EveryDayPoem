# Design QA — 每日古诗文 / 秋浦途中

## Visual brief

- 时间与地点：深秋行旅，秋浦一带山路与溪岸；不虚构具体行程日期。
- 天气与色温：连绵秋雨、溪风，冷灰绿为主，纸白作为文字层；不额外添加月色、雪景或晴空。
- 材质与核心意象：湿山路、溪岸蒲草、寒沙、新到雁、远方杜陵。
- 视觉命题：前两句让阅读视线贴着雨声与溪岸向前，第三句“为问”突然抬头，后两句把阅读路线从近地面拉向雁群与远方故园。
- 转折：由“脚下行旅”转为“抬头问雁”；空间构图、阅读顺序与既有漂移轴、双空间秋夜、推门见月、双轨分流、历史断面、水镜均不同。

## Asset and implementation

- Image asset: `public/assets/poems/qiupu-rain-texture.webp`, 1200 × 900 WebP。当前任务调用 ImageGen，但运行时两次返回与请求不一致的报告式画面；因此按既有仓库处理惯例，仅从本次生成结果的场景区域裁切，并重度模糊、降饱和与冷灰调色，作为无可辨文字、无可辨 UI 的低细节雨纸纹理。页面不把纹理中的具体物件解释为诗中史实。
- Layout: `qiupu-road` 独立 React 页面，组件 `src/AutumnRoadPage.jsx`，样式 `src/autumn-road.css`。
- 阅读顺序：一、二句沿下方山路错位排列；三、四句抬升到页面右上，中央“抬头”折线只承担空间阅读提示，不绘制写实物件。
- 学习路径：逐句注释、译文、赏析、背诵、默写与历史入口均可达；Escape 可关闭学习层与历史层。
- Accessibility: 逐句按钮使用 `aria-current`，注释/详情使用 `aria-live`，学习层使用 dialog 语义，键盘焦点与 reduced-motion 均保留。
- Responsive: 手机端将四句改为纵向上升序列，底部学习工具固定，详情层与学习层避开工具栏。

## Verification

- Baseline `npm run verify:offline`: passed before content changes in a fresh network-independent reconstruction of the current SHA; exclusion matcher contract 60 + 72 = 132，daily tests 2/2。实际课程排除库、学习记录、诗库与页面路由均通过 GitHub 连接器在基线 SHA 下读取；最终远端构建再次使用仓库中的精确排除库。
- Candidate exclusion checks: 秋浦途中 / 宿业师山房期丁大不至 / 江楼感旧均实际执行 `npm run check:exclusion`，退出码 0；三者均不在现有诗库与学习记录中。
- Text collation: 《全唐诗》卷523与《御定全唐诗》四库本卷523均载杜牧《秋浦途中》；通行正文采用“一岸蒲”“还下杜陵无”，并在注释中记录《全唐诗》所见“一片蒲”等异文。
- `npm run bootstrap`: exit 20 with `DEPENDENCY_NETWORK_UNAVAILABLE` (`registry.npmjs.org` DNS unavailable).
- Final `npm run verify:offline`: passed after final source edits; exclusion matcher contract 60 + 72 = 132，daily tests 2/2。
- Source inspection: daily 数据契约、唯一布局分发、资源路径、四句注释、译文、125 字赏析、背诵、默写、历史入口、移动端 CSS 与 reduced-motion 均已检查。
- Local Vite build / desktop-mobile browser runtime QA: 未执行；原因是 bootstrap 按仓库协议进入退出码 20 恢复路径，本地依赖不可用。最终 build gate 由 GitHub Actions 与 Vercel 对唯一提交执行。
- Production status: pending the single Git commit's remote build and production runtime verification.

final result: pending remote build gate

---

# Prior QA history

- 溪居即事：漂移轴 + 小童奔门布局；bootstrap 走 exit-20 路径，生产验证由 Vercel 完成。
- 秋夜寄邱员外：双空间秋夜布局；bootstrap 走 exit-20 路径，最终由远端 build gate 验证。
- 村夜：推门见月布局；bootstrap 走 exit-20 路径，生产验证由 Vercel 完成。
- 过分水岭：双轨分流布局；bootstrap 走 exit-20 路径，生产验证由 Vercel 完成。
- 台城：四段历史断面 + 右侧窄幅场景；bootstrap 走 exit-20 路径，生产验证由 Vercel 完成。
- 题金陵渡：四段近远视线轨迹；bootstrap 走 exit-20 路径，最终由 Vercel 完成生产构建与运行时验证。
- 咸阳值雨：四层雨幕构图；桌面/移动与学习交互此前通过生产 QA。
- 枫桥夜泊：夜航舱窗构图；桌面/移动视觉比较与学习交互此前通过 QA。
- 兰溪棹歌：水镜逐句构图；bootstrap 走 exit-20 路径，生产验证由 Vercel 完成。
