# 每日古诗文

一个纯前端、可静态部署的沉浸式古诗文学习产品。首页每天选择一首诗，提供阅读、注释、译文、赏析、背诵和默写；历史诗篇保留独立视觉页面。

- GitHub：[`luoyiti/EveryDayPoem`](https://github.com/luoyiti/EveryDayPoem)
- 生产站：[`poetry-blue.vercel.app`](https://poetry-blue.vercel.app)

## 本地运行

```bash
npm run bootstrap
npm run dev
```

`npm run bootstrap` 会先尝试 npm 离线缓存，再检查 registry DNS；若云端执行环境无法解析 `registry.npmjs.org`，会以退出码 `20` 明确标记为网络能力缺口，而不是把它误判为仓库或依赖声明损坏。

## 校验命令

```bash
npm run verify:offline   # 不依赖第三方包：排除库 + 当天发布契约
npm run build            # 会先自动运行 verify:offline
npm run test:sites
```

Vercel 的生产构建同样执行 `npm run build`，因此即使 ChatGPT 云端任务本地无法安装 npm 依赖，远端部署仍会再次执行内容契约和完整 Vite 构建。

## 内容结构

- `src/data/poems.js`：诗文、注释、译文、赏析与页面布局映射。
- `src/data/daily.js`：当天展示的诗篇。
- `data/learning-record.json`：仓库级发布记录。
- `data/school-curriculum-exclusions.json`：教育部初中 60 篇与高中 72 篇古诗文排除库。
- `skills/poetry-web-design/SKILL.md`：新增诗篇前必须读取的审美与实现规范。
- `public/assets/poems/`：每首诗独立生成的视觉资产。
- `prompts/chatgpt-work-daily-task.md`：每日任务的唯一权威发布协议。
- `scripts/bootstrap-deps.mjs`：云端 npm 缓存/DNS/安装的有界恢复逻辑。
- `tests/daily-poem-content.test.mjs`：不绑定具体篇目的通用每日发布契约。

## 每日发布

当前定时任务为每天 `07:30 Asia/Shanghai`。定时任务本身只需读取 `main` 当前 SHA 下的 `prompts/chatgpt-work-daily-task.md` 并执行，不再复制一份容易漂移的长提示词。

`npm run check:exclusion -- --title "篇名" --author "作者" --incipit "首句"` 可在生成内容前检查单篇候选。`npm run daily` 的日期计算固定使用 `Asia/Shanghai`，避免北京时间清晨运行时被 UTC 记到前一天。

Vercel 已绑定 `main` 分支；GitHub 提交成功后由 Git 集成自动部署，无需在任务中保存 Vercel Token。GitHub Actions 在 push 和 pull request 时先执行网络无关内容校验，再安装锁定依赖、构建和运行托管测试。

生产构建会把提示词、运行方案和排除库同步发布到 `/resources/`，便于线上查看与下载。
