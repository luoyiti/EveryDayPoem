# Design QA — 每日古诗文 / 青玉案·凌波不过横塘路

## Visual brief

- 时间：暮春傍晚；地点按词中“横塘、蘅皋”组织为泛化江南水岸，不虚构具体宅院位置。
- 天气与色温：暮色冷灰绿；结尾以烟草、风絮、梅雨三层密度表现“闲情”逐步扩张，不把作品误画成暴雨场景。
- 材质与核心意象：水岸、远屋、低云、湿草、风絮、细雨；建筑仅作“不可抵达”的远景，不呈现具体人物故事。
- 视觉命题：“目光沿横塘追到看不见的朱戻，暮色转入题句，最后让愁从一川、满城扩散到一季梅雨。”
- 转折：第七句“飞云冉冉蘅皋暮”由想象居处转回眼前暮色；第九句设问以后，页面从折线路径切成三条横向尺度，回应结尾博喻。

## Text and source check

- 龙榆生《唐宋名家词选》贺铸《横塘路（青玉案）》录“凌波不过横塘路……若问闲情都几许？一川烟草，满城风絮，梅子黄时雨”，本页以该版本为正文。
- 维基文库《青玉案（贺铸）》所据《白香词谱笺》保存“月台花谢 / 碧云 / 试问闲愁”等异文，证明该词存在版本差异；正文不混拼，注释仅提示必要异文。
- 候选 `青玉案·凌波不过横塘路 / 贺铸 / 凌波不过横塘路`（词）、`书上元夜游 / 苏轼 / 己卯上元`（文）、`临江仙·梦后楼台高锁 / 晏几道 / 梦后楼台高锁`（词）均执行排除检查，退出码 0；并经当前 HEAD 代码搜索、学习记录复核无重复。
- 最近 7 次记录此前仅覆盖“曲、诗”两类；本轮选择“词”后，最近 7 次可覆盖诗、曲、词三类，符合体裁轮换目标。最近 14 次仍缺“文/赋”中的一类，后续应继续优先补足。

## Asset and implementation

- ImageGen 本轮仍错误生成带文字的通用页面稿，未直接使用。仅从生成图的无文字水岸区域裁取像素，去除导航、诗文与卡片区域后进行降饱和、柔化和暗部处理，得到 `public/assets/poems/hengtang-rain.webp`；页面不把其中建筑或舟只解释为作品史实。
- `src/HengtangRainPage.jsx`：独立“目送折线 → 暮色回折 → 三层闲情”阅读结构；逐句注释、译文、赏析、背诵、默写和历史入口完整，Escape 可关闭覆盖层。
- `src/hengtang-rain.css`：桌面以三段非对秳路径和三重横向博喻构图，移动端恢复单列阅读；包含键盘焦点与 `prefers-reduced-motion`。
- `src/App.jsx`：新增 `poem.layout === "hengtang-rain"` 独立分发；未修改通用发布测试。
- `data/learning-record.json`：2026-09-06 新记录保存 `genre: "词"`。

## Verification

- 任务开始精确 HEAD 的 GitHub Actions 已完成 `Validate poetry content` 且成功，证明基线精确仓库树的网络无关内容契约与 production build 均通过。
- 本轮 `npm run bootstrap`：退出码 20，输出 `DEPENDENCY_NETWORK_UNAVAILABLE`；按仓库协议继续。
- 本地候选排除检查均执行并退出 0；本地 build、`npm run test:sites` 与浏览器运行时检查因 bootstrap=20 未执行。
- 提交前对新数据契约、资源路径、布局分发、CSS/JS 源码进行检查；提交后以 GitHub Actions 与 Vercel 精确提交树的 `npm run verify:offline`、production build、Sites tests 和生产 URL 为最终 gate。
- 未提交 `dist/`、`.vercel/`、`node_modules/`、`.firecrawl/` 或 QA 截图。

final result: source review passed; remote build gate pending
