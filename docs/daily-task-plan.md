# 每日任务运行方案

## 推荐设置

- 任务名称：`每日古诗文`
- 频率：每天一次
- 时间：`07:30 Asia/Shanghai`
- GitHub 仓库：`luoyiti/EveryDayPoem`
- 生产分支：`main`
- 线上地址：`https://poetry-blue.vercel.app`
- 权威提示词：`prompts/chatgpt-work-daily-task.md`

定时任务不要复制整份长提示词。每次运行先通过 GitHub 连接器读取 `main` 的当前 HEAD SHA，再读取该 SHA 下的权威提示词并执行，以避免任务配置与仓库协议长期漂移。

## 每次运行的关卡

1. GitHub 连接器读取一致的 `main` 快照，读取设计规范、诗库、学习记录和排除库。
2. 运行 `npm run verify:offline`，再运行 `npm run bootstrap`。bootstrap 退出码 `20` 仅表示 npm DNS 不可用，不阻断内容工作；其他安装异常才阻断发布。
3. 提出至少 3 个候选，并通过机器排除校验与人工别名复核。
4. 研究、编辑当天内容，生成独立视觉资产并实现页面。
5. 再次执行 `verify:offline`。依赖可用时完成本地 build、Sites 测试和桌面/手机 QA；依赖因 DNS 不可用时，把 GitHub Actions 与 Vercel 远端构建作为最终 build gate。
6. 提交前重新核对 `main` HEAD，只允许在未发生并发更新时产生一个内容 commit 并以非强制快进方式更新 `main`。
7. Vercel Git 集成自动部署；只有新部署对应提交 SHA 且为 `READY`、生产 URL 可访问时才报告发布成功。

## 稳定性设计

- `npm run build` 内置 `verify:offline`，Vercel 构建会自动再次验证当天内容。
- `tests/daily-poem-content.test.mjs` 是通用契约，不需要每天改测试中的篇名。
- `scripts/select-daily-poem.mjs` 固定按 `Asia/Shanghai` 计算日期。
- npm 安装采用本地缓存优先、一次有界联网尝试；已知 DNS 缺口不会造成无限重试。
- 任何远端验证失败都保留原错误证据；同一次任务不再追加第二个提交掩盖失败。

## 排除策略

排除库覆盖教育部现行课程标准中的初中 60 篇（段）和高中 72 篇。它既包括诗词曲，也包括文言文；组篇条目中的子篇和常见别名同样禁止。检查工具采用“篇名/别名 + 作者 + 首句”组合识别，以兼顾同名词牌和同名诗作。
