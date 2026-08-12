# AGENTS.md

给在本仓库工作的 AI agent 的边界说明。动手前先读这份，再读 `CONTEXT.md`（术语），再读当前任务指定的文档。

## 这是什么

hackrabbit 的个人主页。静态站，无后端，无数据库，无登录态。

读者有两类，缺一不可：**招聘方与技术面试官**（要看得到履历与可核查的交付），
以及**内容读者**（要能知道我在做什么、在看什么、去哪关注我）。
只服务其中一类的改动都是跑偏。

> 2026-08-12 之前这里写的是「个人作品站」，读者只有招聘方。定位已由本人改变。

## 技术栈

| 项 | 值 |
|---|---|
| 框架 | Astro 7（`.astro` 页面 + React 19 岛屿） |
| 交互组件 | React，仅在需要客户端行为处使用 `client:visible` |
| 动画 | GSAP + ScrollTrigger |
| 样式 | 原生 CSS，每个组件一个同名 `.css`，变量在 `src/styles/tokens.css` |
| 包管理 | Bun |
| 部署 | Netlify（`netlify.toml`，`bunx astro build` → `dist`） |

## 命令

```bash
bun run lint     # = astro check（类型与模板诊断，不是代码风格检查）
bun run build    # = astro build
bun run dev      # 本地开发
```

`lint` **不是 linter**。本仓库没有 ESLint，没有 Prettier，没有格式化工具。不要因为「统一风格」去大范围改动未涉及的文件。

## 目录

```
src/
├── components/   组件 + 同名 CSS（Hero.astro / Work.tsx / ...）
├── layouts/      Base.astro
├── lib/          共享脚本
├── pages/        路由（index.astro、work/index.astro、work/*.astro）
└── styles/       tokens.css、case-study.css
public/           favicon.svg、icons.svg、resume.pdf
```

## 硬边界

**不得新增功能。** 不加 AI Chat、CMS、后台、评论、搜索、分析面板、i18n 切换。

**不得换技术。** 不换框架，不换包管理器，不换部署平台，不引入 CSS 框架（Tailwind / UnoCSS 等），不引入组件库，不引入状态管理。

**新增路由需要先在文档里落定。** 当前路由集合是 `/`、`/work/`、`/work/h5-game-sdk/`，加静态文件 `/resume.pdf`。

> 2026-08-12 更新：站点定位由「个人作品站」改为「个人主页」，路由集合允许扩展（`/now/`、`/writing/` 等）。
> 但每条新路由必须先写进对应的规范文档并确定它承载什么真实内容，不允许先建空页面再想内容 ——
> 「不得留占位文案」这条依然有效，没内容就不上这个路由。

**不得编造事实。** 不得虚构截图、指标、用户量、性能数字、时间、公司名、职责范围。找不到真实素材时，用设计图或直接省略，不要填充看起来合理的数字。

**不得改动 `src/components/Experience.tsx` 的数据。** 公司、职位、时间区间均为事实记录，不在任何视觉任务的范围内。

**不得留占位文案。** 任何「整理中」「待补充」「敬请期待」「Coming soon」都不允许出现在交付物里。没有内容就不展示这一块。

## 本仓库是公开仓库

`github.com/hackrabbit6/hackrabbit-portfolio` 对所有人可见，包括本仓库里的所有文档。
不要在任何提交的文件里写入个人隐私、求职策略、对自身弱点的分析或内部权衡过程。文档只写「做什么」和「验收标准」。

## 提交

每个 phase 结束提交一次，`bun run lint` 与 `bun run build` 必须全绿才允许进入下一个 phase。
当前 phase 有回归时不要继续往前做。
