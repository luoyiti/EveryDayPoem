# Design QA — 每日古诗文 / 游沙湖

## Visual brief

- 时间：暮雨将收的傍晚；正文内嵌词直接写“萧萧暮雨”，不补造具体年月时刻。
- 地点：由沙湖、麻桥求医转至蕲水清泉寺与兰溪；页面不复原具体古迹，只呈现松间沙路、山泉、溪流与远山寺宇轮廓。
- 天气与色温：雨后湿冷的青灰山色，云隙有极少暖光；冷色为主，暖色只用于“向西”这一转折节点。
- 材质：湿石、松木、沙土路、浅溪、薄雾、雨后草木。
- 核心意象：看田得疾、纸上问诊、“手为口、眼为耳”、清泉甘水、兰溪西流、暮雨子规。
- 视觉命题：**一次求医先让“耳朵”的常规失效，一条溪流又让“向东”的常势失效；页面把全文做成从沙湖到兰溪的五站游踪，读者沿路推进，最后路线不继续向前，而以一条金色短线明确折向“西”。**
- 构图：首屏以雨后山泉与河谷作真实背景，题名压在左侧暗部；正文区不用卡片网格，而以单条纵向路线串联五段原文，右侧只保留当前站边注。移动端将路线收窄成单列，边注移至原文之后。

## Text and source check

- 识典古籍《东坡先生志林·卷一·游沙湖》：核对《记游》篇次、题名、苏轼署名及全文；正文以“君看流水尚能西”系统为准，对影印/OCR造成的断句作现代标点整理。
- 中国哲学书电子化计划《东坡志林·第一卷·游沙湖》：交叉核对全文与“君看流水尚能西”。
- 中国人民大学清史研究所资料页：交叉核对沙湖、蕲水、兰溪等地理叙述；页面不据此扩写未经正文支持的旅行细节。
- 注释按五段原文一一对应；“王逸少”释为王羲之，“黄鸡”只说明与感叹年华相关，不虚构苏轼当日心理；赏析 153 字。
- 《东坡志林》所引末句为“君看流水尚能西”；后世通行《浣溪沙》常见“门前流水尚能西”，仅在注释中提示异文，不混拼正文。
- 本轮候选为 `游沙湖 / 苏轼 / 黄州东南三十里为沙湖`（文）、`水仙子·咏江南 / 张养浩 / 一江烟水照晴岚`（曲）、`书河上亭壁 / 寇准 / 岸阔樯稀波渺茫`（诗）。三项按仓库 matcher 排除预检均返回 0；精确任务 HEAD 的 GitHub 题名检索也均无现有作品命中。
- 发布前最近七篇体裁为：词、诗、文、曲、词、诗、赋；已覆盖五类。选择“文”后最近七篇为文、词、诗、文、曲、词、诗，继续覆盖四类且没有连续三次同体裁；相较再发词或诗，也能补足近期散文比例。

## Asset and implementation

- `public/assets/poems/you-shahu-westward.webp`：本轮 ImageGen 独立生成后裁成 16:9 并转换 WebP，800×450，21556 B；RIFF 声明长度与实际字节数一致，Pillow 解码验证通过。画面含雨后松径、山泉、溪流、薄雾与远处寺宇轮廓，不含文字或 UI。
- `src/ShahuWestwardPage.jsx`：独立页面采用“沙湖—麻桥—纸谈—清泉—西流”五站路线；点击或方向键推进逐段注释，末站停止于兰溪；提供今译、赏析、背诵、默写与历史入口。
- `src/shahu-westward.css`：桌面端为“全宽雨后山谷 + 单线路标原文 + sticky 边注”结构；移动端转为单列路线；包含 `focus-visible`、高对比正文、响应式字号与 `prefers-reduced-motion`。
- 数据契约：唯一 id/layout、5 段原文、5 条对应注释、译文、153 字赏析、学习文案、资源路径及 2026-09-22（Asia/Shanghai）学习记录均已完成源代码级检查。

## Verification

- 精确任务基线 SHA 的 GitHub Actions `Validate poetry content` 已成功，其中 `Network-independent content checks` 明确执行 `npm run verify:offline` 并通过。
- `npm run bootstrap` 本轮返回退出码 20，并输出 `DEPENDENCY_NETWORK_UNAVAILABLE`；因此按仓库协议继续，本地 production build / Sites tests / 桌面与手机浏览器运行时检查未执行。
- 提交前 connector-reconstructed `npm run verify:offline` 已通过：60 + 72 = 132 条计数契约、5 项 matcher checks、daily tests 2/2；资源路径、布局分发、JS/CSS 修改与本文件亦完成源代码级检查。最终提交仍由 GitHub Actions 与 Vercel 对实际 Git 树重新构建，作为权威 build gate。
- 未提交 `dist/`、`.vercel/`、`node_modules/`、`.firecrawl/`、QA 截图或生成器中间文件。

final result: pre-submit source and offline verification completed; remote build gate pending
