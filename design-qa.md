# Design QA — 每日古诗文 / 题金陵渡

## Visual brief

- 时间与地点：唐代镇江金陵渡（今西津渡一带）的深夜，旅人从临江小楼望向长江北岸。
- 天气与色温：退潮后的清夜，冷蓝黑为主；偏西斜月与远岸两三点灯火形成极少量暖色节点。
- 材质与核心意象：暗木栏、湿石、开阔江面、斜月、远岸星火。
- 视觉命题：读者的视线从近处渡口小楼逐句越过旅人、夜江，最终抵达瓜州两三点灯火；空间越远，旅愁越清晰。
- 转折：前两句直陈地点与旅愁，后两句把情绪交给“潮落—斜月—星火”的远景。页面因此采用四段递进右移的视线轨迹，不复用已有雨幕、水镜、雪纸长卷或晨窗构图。

## Asset and implementation

- Background: `public/assets/poems/jinling-ferry.webp`, 960 × 635 WebP. It is a clean crop derived from an ImageGen-created night-river scene; the cropped production asset contains no baked poem text, report UI, buttons or tables.
- Layout: `jinling-ferry` is a dedicated React branch in `src/App.jsx` with its own component and `src/jinling-ferry.css`.
- Core learning path: four selectable verse/distance steps with per-line annotations; translation and appreciation panels; shared recitation and dictation overlays; history drawer entry.
- Accessibility: semantic buttons, `aria-current` for active verse, `aria-live` annotation/detail regions, global visible focus and reduced-motion rules continue to apply.
- Responsive design: desktop uses a diagonal near-to-far sightline; mobile collapses it into progressively indented verse rows while preserving all five learning controls in a fixed bottom rail.

## Verification

- Baseline `npm run verify:offline`: passed before content changes.
- `npm run bootstrap`: exit 20 with `DEPENDENCY_NETWORK_UNAVAILABLE`; local npm registry DNS is unavailable.
- Final `npm run verify:offline`: passed; 132 curriculum identities validated and both daily-content contract tests passed.
- Local Vite build / browser desktop-mobile runtime QA: not executed because bootstrap followed the repository's exit-20 recovery path. Source inspection confirmed the new image path, unique layout dispatch, data contract, mobile media rules and unchanged shared learning/history flow.
- Production status: pending the single Git commit's Vercel build and production runtime verification.

final result: pending remote build gate

---

# Prior QA history

- 咸阳值雨：dedicated four-layer rain composition; desktop/mobile and learning interactions previously passed production QA.
- 枫桥夜泊：night-cabin composition; desktop/mobile visual comparison and learning interactions previously passed production QA.
- 兰溪棹歌：four horizontal water-mirror lines; local dependency bootstrap used the documented exit-20 path and production verification was delegated to Vercel.
