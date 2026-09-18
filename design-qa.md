# Design QA — 每日古诗文 / 踏莎行·郴州旅舍

## Visual brief

- 时间：以词中“月迷”“斜阳暮”的蒙昧光线组织为暮色意象，不把两个词句机械还原为同一写实时刻。
- 地点：郴州羁旅空间；只取雾中楼台、津渡、孤馆与环山流水的通用景物，不复原具体历史建筑。
- 天气与色温：浓雾、春寒；冷蓝灰为主，仅保留地平线极少暖光，避免夸张夕照。
- 核心意象：雾、楼台、津渡、桃源、孤馆、杜鹃、梅花、尺素、郴江、郴山、潇湘。
- 视觉命题：**上片让地标逐层消失，下片让远方消息逐层堆成离恨；到结尾，唯一仍在移动的是江水。页面因此从“看不见”转向“拦不住”。**
- 构图：不使用居中大卡片。原文六段沿一条偏斜的“雾中水路”展开，主动线从左中部逐步向右下偏移；每段以“失 / 望 / 闭 / 寄 / 砌 / 流”作方向标，注释独立停在右侧岸边。

## Text and source check

- 龙榆生《唐宋名家词选》数字整理页《秦观〈踏莎行〉（雾失楼台）》据汲古本录全文，题下注“郴州旅舍”，正文为“雾失楼台，月迷津渡……为谁流下潇湘去？”。
- 古文岛《踏莎行·郴州旅舍》交叉核对全文，并核对“津渡、可堪、驿寄梅花、鱼传尺素、幸自”等基本词义；背景性说法不写入作品数据，避免将二手考据当作确定史实。
- 本轮候选为 `沉醉东风·渔夫 / 白朴 / 黄芦岸白蘋渡口`（曲）、`踏莎行·郴州旅舍 / 秦观 / 雾失楼台`（词）、`冷泉亭记 / 白居易 / 东南山水，余杭郡为最`（文）。精确 HEAD 的学习记录与现有作品均无已发布同篇；132 篇课程排除库无三篇题名或首句命中，最终选择《踏莎行·郴州旅舍》。

## Asset and implementation

- `public/assets/poems/tashaxing-chenzhou-mist.webp`：本轮 ImageGen 独立生成并转换为 WebP；只保留雾江、远处模糊楼台、渡口、山壁与孤馆意象，无人物、文字或 UI。
- `src/ChenzhouMistPage.jsx`：六段原文沿“雾中水路”错位推进，选中段落在右岸显示逐句注释；译文、赏析、背诵、默写与历史入口完整可用，支持方向键与 Escape。
- `src/chenzhou-mist.css`：桌面为题名 / 雾路 / 岸边注释三域构图，移动端折叠为单列；背诵使用“覆雾 / 拨雾”交互；包含键盘焦点与 `prefers-reduced-motion`。
- 数据契约：唯一 id/layout、6 段原文、6 条一一对应注释、译文、152 字赏析、学习文案、`/assets/poems/` 资源路径与 2026-09-19（Asia/Shanghai）学习记录均已源代码级检查。

## Verification

- 任务基线 exact SHA 的 GitHub Actions `Validate poetry content` 已重新运行 attempt 2，网络无关内容检查、锁定依赖安装、production build 与 Sites tests 全部 success。
- `npm run bootstrap`：本地依赖恢复尝试返回退出码 20 / `DEPENDENCY_NETWORK_UNAVAILABLE`；npm cache 缺包且 `registry.npmjs.org` 无法解析。
- 本地 `npm run build` / `npm run test:sites` / 桌面及手机浏览器运行时检查：未执行；bootstrap=20，按仓库协议改以最终提交的 GitHub Actions / Vercel 为远端 build gate。
- 提交前执行源代码级数据契约、资源存在性、中文字符串、赏析长度、学习记录首项、App layout 分发、CSS 响应式规则与候选重复检查。
- 未提交 `dist/`、`.vercel/`、`node_modules/`、`.firecrawl/`、QA 截图或生成器中间文件。

final result: source review completed; remote build gate pending
