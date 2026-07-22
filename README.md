# hackrabbit portfolio

个人求职作品集：[hackrabbit.cc.cd](https://hackrabbit.cc.cd)。重点展示业务前端交付、H5 游戏发行 SDK 与支付链路、AI 应用实践和脱敏项目案例。

## 当前定位

- 4–5 年前端开发经验
- 中后台系统、复杂表单、接口联调和上线交付
- H5 游戏发行 SDK、支付链路、Hybrid 通信和多端适配
- AI 音乐生成、数字亲人等 AI 应用原型
- Bun / Node.js / Go 的轻量全栈补位能力

## 技术架构

- Astro 7 负责静态页面、路由和 SEO
- React 19 islands 承载需要交互的首页区块
- Lenis + GSAP ScrollTrigger 驱动滚动叙事
- 原生 Canvas 2D 提供轻量动态 Hero；移动端和 `prefers-reduced-motion` 自动降级
- Netlify 静态部署

## 页面

- `/`：电影感滚动首页
- `/work/`：项目案例索引
- `/work/h5-game-sdk/`：H5 游戏发行 SDK 与充值体系脱敏案例
- `/resume.pdf`：简历

## 本地开发

项目使用 Bun 锁文件：

```bash
bun install
bun run dev
```

## 验证

```bash
bun run lint
bun run build
```

## 部署

站点部署在 Netlify，配置见 `netlify.toml`：

- Build command：`bunx astro build`
- Publish directory：`dist`
- 自定义域名：`hackrabbit.cc.cd`

工作项目只展示脱敏后的背景、职责、技术判断和结果，不公开公司代码、客户信息或未经授权的业务数据。
