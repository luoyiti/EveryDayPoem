# 每日古诗文

一个纯前端、可静态部署的沉浸式古诗文学习产品。首页每天选择一首诗，提供阅读、注释、译文、赏析、背诵和默写；历史诗篇保留独立视觉页面。

## 本地运行

```bash
npm install
npm run dev
```

## 内容结构

- `src/data/poems.js`：诗文、注释、译文、赏析与页面布局映射。
- `src/data/daily.js`：当天展示的诗篇。
- `data/learning-record.json`：仓库级发布记录。
- `data/school-curriculum-exclusions.json`：教育部初中 60 篇与高中 72 篇古诗文排除库。
- `skills/poetry-web-design/SKILL.md`：新增诗篇前必须读取的审美与实现规范。
- `public/assets/poems/`：每首诗独立生成的视觉资产。
- `prompts/chatgpt-work-daily-task.md`：可直接用于 ChatGPT Work 每日任务的完整提示词。

## 每日发布

`npm run daily` 会先应用初高中课程标准排除库，再从未发布诗篇中更新当天入口与记录。`npm run check:exclusion -- --title "篇名" --author "作者" --incipit "首句"` 可在生成内容前检查单篇候选。GitHub Actions 每天北京时间 06:30 执行选择流程；仓库连接 Vercel 后，提交会自动触发静态部署。

在 ChatGPT Work 中创建“每天 06:30，Asia/Shanghai”的任务并粘贴 `prompts/chatgpt-work-daily-task.md`，即可把选篇、研究、视觉生成、实现、测试和生产发布串成一次完整运行。更简洁的配置说明见 `docs/daily-task-plan.md`。

生产构建会把提示词、运行方案和排除库同步发布到 `/resources/`，便于线上查看与下载。

新增诗篇时，先按 Design Skill 完成独立视觉方案与页面组件，再把数据加入诗库。当前 MVP 内含《枫桥夜泊》《江雪》《春晓》三种完全不同的页面构图。
