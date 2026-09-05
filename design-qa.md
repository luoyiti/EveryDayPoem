# Design QA — 每日古诗文 / 天净沙·秋

## Visual brief

- 时间：秋日黄昏；地点只按曲中“孤村、青山、绿水”组织为泛化乡野，不虚构具体地名。
- 天气与色温：正文无雨雪；前半保持残霞将尽的暖灰与轻烟冷灰，第三句后逐步加入青、绿、白、红、黄。
- 材质与核心意象：暮霞、烟、老树、寒鸦、飞鸿、水面、白草、红叶、黄花。
- 视觉命题：“一只极小飞鸿越过暮色转轴，把六个疏冷意象带入突然展开的五色秋景。”
- 转折：第三句“一点飞鸿影下”是唯一明确运动；页面前三句逐级右移，第四、五句重新横向铺开，以阅读尺度回应由寂寥到清丽的章法变化。

## Text and source check

- 维基文库《天净沙（白朴）》标明“越调”、作者白朴，并收《秋》正文：“孤村落日残霞，轻烟老树寒鸦，一点飞鸿影下。青山绿水，白草红叶黄花。”
- 中华诗库“白朴散曲选”说明所辑散曲据隋树森《全元散曲》，其 `[越调]天净沙 秋` 正文与维基文库一致。
- 候选 `天净沙·秋 / 白朴 / 孤村落日残霞`（曲）、`西江月·阻风山峰下 / 张孝祥 / 满载一船秋色`（词）、`儋耳夜书 / 苏轼 / 己卯上元`（文）均通过排除逻辑（退出码 0），并经当前仓库代码搜索、诗库与学习记录复核无重复。
- 最近已发布记录均为诗，本轮按体裁轮换规则优先采用曲。

## Asset and implementation

- ImageGen 两次错误生成带文字的页面式图像，均未直接作为背景使用。最终只从第二次生成图中裁取完全不含文字、卡片和 UI 的右侧山水像素，重采样并轻度柔化，形成 `public/assets/poems/tianjingsha-autumn.webp`。页面不把生成图中的具体地貌或舟人解释为作品史实。
- `src/TianjingshaAutumnPage.jsx`：独立“五镜曲谱”阅读结构；第三句位于视觉转轴，后两句用不同色带扩展尺度；逐句注释、译文、赏析、背诵、默写、历史入口完整，Escape 可关闭覆盖层。
- `src/tianjingsha-autumn.css`：桌面使用十二列非对称镜头编排，移动端恢复单列曲序；包含键盘焦点和 `prefers-reduced-motion`。
- `src/App.jsx`：新增 `poem.layout === "tianjingsha-autumn"` 独立分发；未修改通用发布测试。
- `data/learning-record.json`：新记录保存 `genre: "曲"`，并为既有记录补足 `genre: "诗"`，使后续体裁轮换可由仓库状态直接判断。

## Verification

- 基线 `npm run verify:offline`：通过；课程排除契约 60 + 72 = 132，5 项 matcher 通过，daily tests 2/2。
- `npm run bootstrap`：退出码 20，输出 `DEPENDENCY_NETWORK_UNAVAILABLE`；按仓库协议继续。
- 提交前 `npm run verify:offline`：通过。
- 本地 `npm run build`：未执行，原因是 bootstrap=20 且依赖不可用。
- 本地 `npm run test:sites`：未执行，同上。
- 桌面/手机运行时浏览器检查：未执行，同上；已完成源代码级响应式、资源路径、入口与数据契约检查，提交后由 Vercel production build 与生产 URL 作为最终 gate。
- 未提交 `dist/`、`.vercel/`、`node_modules/`、`.firecrawl/` 或 QA 截图。

final result: source review passed; remote build gate pending
