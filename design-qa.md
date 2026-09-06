# Design QA — 每日古诗文 / 黠鼠赋

## Visual brief

- 时间：夜坐至假寝醒转；地点只抽象为木质书斋，不虚构具体宅第、年份或地点。
- 天气与色温：室外冷蓝夜色，室内仅保留一处低照度烛光；冷暖交界服务于“外部小事 → 内在自省”的结构转折。
- 材质与核心意象：木床、粗麻橐、散落谷粒、烛台、书册；鼠不作为夸张主体，只用逃逸后的细小痕迹留下动作结果。
- 视觉命题：“先让读者沿袋中声响追到一次装死脱逃，再在鼠已离场后转入更安静、更窄的自省文字。”
- 转折：第五段以“乌在其为智也”把趣事推成反问；第六段“坐而假寝”以后，阅读轨道由逐步错位的叙事段落切换为向内收束的四段自问。

## Text and source check

- 维基文库《黠鼠赋》收于《东坡全集》，正文作“苏子夜坐，有鼠方啮……余俯而笑，仰而觉。使童子执笔，记余之作”，本页以这一系统为正文。
- 识典古籍《苏文忠公集·黠鼠赋》与正文主体一致，但见“假寐 / 予 / 怍”等字词差异；本页不混拼，只在相关注释简短提示“壁/璧”与末字异文。
- 候选 `黠鼠赋 / 苏轼 / 苏子夜坐`（赋）、`小石城山记 / 柳宗元 / 自西山道口径北`（文）、`临江之麋 / 柳宗元 / 临江之人畋得麋麑`（文）均运行 `npm run check:exclusion`，退出码 0；同时在任务基线 HEAD 的 GitHub 代码搜索中，候选题名与首句均无命中，现有诗库及排除文件无重复。
- 最近记录为：词、曲、诗、诗、诗、诗、诗……最近 7 次已覆盖诗/曲/词三类，但最近 14 次“曲/文/赋”仅有曲；本轮选择“赋”后补足赋体，使轮换更接近协议目标。

## Asset and implementation

- `public/assets/poems/xiamouse-study.webp`：ImageGen 本轮生成夜间书斋、麻袋与烛光的无文字场景；裁切为 16:9 后压缩为 1280×720 WebP。左侧低细节冷暗区承载标题与阅读，右侧烛光和麻袋只表达“声止、倒袋、鼠逸”的环境，不添加故事外人物。
- `src/XiamouseNightPage.jsx`：独立“夜间叙事五段 → 鼠已逸 → 假寝自省四段”阅读结构；注释、译文、赏析、背诵、默写和历史入口完整，Escape 可关闭覆盖层。
- `src/xiamouse-night.css`：桌面三列“题签 / 双阶段阅读轨 / 注释”结构；移动端前半保留场景、后半转为纵向文段；包含键盘焦点与 `prefers-reduced-motion`。
- `src/App.jsx`：新增 `poem.layout === "xiamouse-night"` 独立分发；未修改通用发布测试。
- `data/learning-record.json`：2026-09-07 新记录保存 `genre: "赋"`。

## Verification

- 任务基线 SHA `aa4e89aeed33e94d60374db356a107bb4ff74d6b` 的 GitHub Actions `Validate poetry content` 已完成且成功，证明精确基线仓库树可通过远端内容与 production build gate。
- fresh reconstruction 的 `npm run verify:offline`：通过；课程排除契约 60 + 72 = 132，5 项 matcher 通过，daily tests 2/2。
- `npm run bootstrap`：退出码 20，输出 `DEPENDENCY_NETWORK_UNAVAILABLE`；按仓库协议继续。
- 本地 `npm run build`：未执行，原因是 bootstrap=20 且依赖不可用。
- 本地 `npm run test:sites`：未执行，同上。
- 桌面/手机运行时浏览器检查：未执行，同上；已完成数据契约、资源路径、布局分发、CSS/JS 源码与移动端规则检查，提交后以 GitHub Actions 与 Vercel 精确提交树为最终 gate。
- 未提交 `dist/`、`.vercel/`、`node_modules/`、`.firecrawl/` 或 QA 截图。

final result: source review passed; remote build gate pending
