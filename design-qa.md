# Design QA — 每日古诗文 / 点绛唇·丁未冬过吴松作

## Visual brief

- 时间：词中明确“黄昏”；不另行虚构具体时刻。
- 地点：太湖西畔、吴松一带；不复原第四桥的具体建筑形制，只保留湖岸、远山与可供凭眺的岸边空间。
- 天气与色温：阴云低垂、将雨未雨；冷蓝灰为主，地平线残留极淡暖光。
- 材质与核心意象：开阔湖面、低云、数峰、远雁、疏残柳枝；图像不写词文或 UI。
- 视觉命题：上片让雁和云横向离去，数峰停在将雨天色中；下片把视线压回岸边，最终只剩残柳在风里运动。
- 转折：“拟共天随住”是想要停驻，“今何许”却立即把古人推回不可抵达的过去；页面因此将前两段悬在“云上”，后两段逐步下沉至桥边与柳岸。

## Text and source check

- 《白石道人歌曲（四库全书本）》收《点绛唇》，题下注“丁未冬过吴松作”，正文作“燕雁无心……残柳参差舞”；旧本“凭䦨”在页面数据中采用现代通行字“凭阑”。
- 维基文库独立篇《点绛唇（丁未冬过吴松作）》正文与上述版本一致，作“今何许？凭栏怀古，残柳参差舞”。
- 候选 `点绛唇（丁未冬过吴松作） / 姜夔 / 燕雁无心`、`殿前欢·爱山亭上 / 张可久 / 小阑干`、`点绛唇 / 王禹偁 / 雨恨云愁` 均执行排除检查并返回退出码 0；同时复核当前诗库与学习记录无重复。

## Asset and implementation

- `public/assets/poems/wusong-clouds.webp`：本轮 ImageGen 独立生成；无文字、按钮、印章或现代建筑。左侧为低细节暗湖面，右侧承担远山、雁与残柳，适配桌面文字区与移动裁切。
- `src/WusongCloudsPage.jsx`：独立“云上两段 → 桥边两段”阅读轨迹；逐段注释随点击更新，译文与赏析按需展开；背诵采用“随云而行”的逐段隐显，默写、历史入口完整，Escape 可退出覆盖层。
- `src/wusong-clouds.css`：桌面采用非卡片化的浮动句位与岸边注释，移动端折为纵向句序；包含键盘焦点与 `prefers-reduced-motion`。
- 数据契约：唯一 id/layout、4 段正文、4 条注释、译文、132 字赏析、学习文案、`/assets/poems/` 路径与 2026-09-09（Asia/Shanghai）学习记录已检查。

## Verification

- 基线与提交前 `npm run verify:offline`：通过（本地按精确当前数据契约重建检查；远端精确 tree 由 GitHub Actions / Vercel 再次作为最终 gate）。
- `npm run bootstrap`：退出码 20，输出 `DEPENDENCY_NETWORK_UNAVAILABLE`；按仓库协议继续。
- 本地 `npm run build`：未执行，原因是 bootstrap=20 且依赖不可用。
- 本地 `npm run test:sites`：未执行，同上。
- 桌面/手机运行时浏览器检查：未执行，同上；已完成源代码级响应式、资源路径、布局分发、交互入口与数据契约检查。
- 未提交 `dist/`、`.vercel/`、`node_modules/`、`.firecrawl/` 或 QA 截图。

final result: source review passed; remote build gate pending
