# Design QA — 每日古诗文 / 冷泉亭记

## Visual brief

- 时间：正文同时写“春之日”与“夏之夜”，页面不锁定为某一史实时刻；生成图采用柔和漫射日光，只作为山水质感，不承担具体时辰叙事。
- 地点：馀杭灵隐寺西南隅的冷泉亭语境；不尝试复原唐代灵隐寺建筑群，只保留“亭在山下、水中央、山树为盖、岩石为屏”的空间关系。
- 天气与色温：湿润、清透、低饱和，青灰水色与深绿树影为主，少量木色；避免通用江南烟雨和夸张霞光。
- 材质：清泉、湿石、苔藓、深林、旧木亭、薄雾。
- 核心意象：水中央小亭、山树、岩石、云气、与阶相平的清泉。
- 视觉命题：**先用“馀杭—灵隐—冷泉亭”把空间一层层收窄，再让亭本身几乎消失进树、石、云、水；阅读末段再从一亭打开到五亭与前人营构，使“述而不作”成为最终落点。**
- 构图：不用居中大卡片。上半屏为大幅泉亭环境；下半屏把六段原文排成左右错位的“石阶水路”，左侧水尺显示阅读位置，右侧仅保留一块随段切换的注脚。

## Text and source check

- 维基文库《冷泉亭记》：页面注明作品收入《全唐文》卷六百七十六与《白氏长庆集》卷四十三；本页采用其“馀杭”“由寺观言”“泉渟渟，风泠泠”“卢给事元辅”等正文系统。
- 识典古籍《白居易集·冷泉亭记》：交叉核对篇章结构、春夏泉亭段、五亭营建与“长庆三年八月十三日记”；其数字整理有个别字形/异文，与主本文本不混拼。
- 本轮候选为 `冷泉亭记 / 白居易 / 东南山水，馀杭郡为最`（文）、`江楼夕望招客 / 白居易 / 海天东望夕茫茫`（诗）、`水仙子·咏江南 / 张养浩 / 一江烟水照晴岚`（曲）。三项均按仓库 matcher 命令返回 0；精确任务 HEAD 的仓库检索亦未发现已发布同篇。最终选择《冷泉亭记》，避免昨日连续散曲，并让最近七篇保持五体裁并存。

## Asset and implementation

- `public/assets/poems/cold-spring-pavilion.webp`：本轮 ImageGen 独立生成后转换为 WebP，1672×941；主体为清泉、湿石、深林与小亭，不含文字或 UI。
- `src/ColdSpringPavilionPage.jsx`：阅读结构为“入亭—春夏—近水—洗尘—五亭—述作”六层；点击原文切换逐段注释，支持键盘上下键、Escape、译文、赏析、背诵、默写与历史入口。
- `src/cold-spring-pavilion.css`：首屏图像与下方错位石阶阅读区分离；桌面为水尺 / 水路 / 注脚三域，移动端改为单列；包含 focus-visible、足够正文对比与 `prefers-reduced-motion`。
- 数据契约：唯一 id/layout、6 段原文、6 条一一对应注释、译文、140 字赏析、学习文案、资源路径与 2026-09-21（Asia/Shanghai）学习记录均完成源代码级检查。

## Verification

- 在干净的 connector-reconstructed 工作区执行三组候选 `check:exclusion`，三项均为 0。
- `npm run bootstrap` 返回退出码 20，并输出 `DEPENDENCY_NETWORK_UNAVAILABLE`；因此按仓库协议继续，未执行本地 production build / Sites tests / 桌面与手机浏览器运行时检查。
- 依赖无关的 `npm run verify:offline` 在重建工作区通过：132 条计数契约、5 项 matcher checks、daily tests 2/2。最终提交仍必须由 GitHub Actions 与 Vercel 对实际 Git 树再次执行，作为权威 build gate。
- 未提交 `dist/`、`.vercel/`、`node_modules/`、`.firecrawl/`、QA 截图或生成器中间文件。

final result: source review completed; remote build gate pending
