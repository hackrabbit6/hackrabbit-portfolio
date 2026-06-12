# hackrabbit portfolio

个人求职作品集，用于展示前端业务经历、H5 游戏发行 SDK 与充值体系、广告买量系统、AI 应用原型、轻量全栈实践和联系方式。

当前定位：

- 4-5 年前端开发经验
- 中后台系统、复杂表单、接口联调和上线交付
- H5 游戏发行 SDK、支付链路、Hybrid 通信和多端适配
- AI 音乐生成、数字亲人、Web3 研究工具等产品原型实践
- Node.js / Bun / Go 的轻量全栈补位能力

## 展示重点

- 工作项目用脱敏案例说明背景、职责、难点和结果。
- 个人项目展示 AI 应用理解、异步生成任务、RAG / 对话流程、研究工具和本地优先工作流。
- 技术栈按岗位价值归类，减少只堆关键词的观感。

## 技术栈

- React
- TypeScript
- Vite
- Bun
- Three.js

## 本地开发

```bash
bun install
bun run dev
```

## 构建

```bash
bun run build
```

## 部署

推荐迁移到当前可登录的新 Vercel 账号，并连接 `hackrabbit6` GitHub 账号下的作品集仓库，避免继续依赖旧 Vercel 登录。

Vercel 配置：

- Framework Preset: `Vite`
- Build Command: `bun run build`
- Output Directory: `dist`

如果之后改用 GitHub Pages：

- 用户主页仓库 `hackrabbit6.github.io`：保持当前 `vite.config.ts` 不变。
- 普通项目仓库，例如 `hackrabbit-portfolio`：需要在 `vite.config.ts` 里设置 `base: '/hackrabbit-portfolio/'`。

## 检查

```bash
bun run lint
```
