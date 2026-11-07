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
- GSAP ScrollTrigger 负责进场动画
- Three.js「夜间地图」：全站共用的 3D 背景，每个内容区块对应地图上的一个地标（见 `docs/NIGHT-MAP.md`）；无 WebGL、触摸设备和 `prefers-reduced-motion` 自动降级
- Cloudflare Pages 静态部署（见「部署」）

## 页面

- `/`：首页，按阅读位置在夜间地图的地标间导览
- `/work/`：项目案例索引
- `/work/h5-game-sdk/`：H5 游戏发行 SDK 与充值体系脱敏案例
- `/writing/`：公众号长文列表
- `/now/`：近况，最近在想的方向（只放在看的东西）
- `/sitemap.xml`、`/robots.txt`：构建时生成。sitemap 的 URL 列表从 `src/pages` 扫出来，
  每页的 `lastmod` 是「该页用到的所有本地源文件里最晚的那次提交」—— 首页正文在
  `src/components/Hero.astro` 里，只看 `index.astro` 会给出一个过期的日期
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

站点部署在 **Cloudflare Pages**，配置见 `wrangler.toml`：

- Build command：`bunx astro build`
- Output directory：`dist`
- 自定义域名：`hackrabbit.cc.cd`

Pages 构建镜像自带 Bun 1.4.4，检测到 `bun.lock` 会自动用 `bun install`，无需额外配置。
部署走 Dashboard 的 Git 集成自动触发（推 `main` 即部署），CI 里不需要放 Cloudflare token。

### 为什么从 Netlify 迁过来（2026-11-07）

Netlify 把站点放在 AWS 美西（AS16509）。实测在中国大陆直连该 IP 段时，TCP 能连上
（connect ≈ 0.1s）但 **TLS 握手阶段被 RST**（`curl: Recv failure: Connection reset by peer`），
走代理则完全正常 —— 是 GFW 对该 IP 段的干扰，不是 DNS 污染（中国公共 DNS 都能正确解析）。
Cloudflare 边缘直连实测正常（TLS 1.3s / 总 1.6s）。

Netlify 配置（`netlify.toml`）保留着，作为回退路径：若 Cloudflare 在国内表现不佳，
改回 Netlify 只需在 DNS 把 CNAME 指回去，不用改代码。

工作项目只展示脱敏后的背景、职责、技术判断和结果，不公开公司代码、客户信息或未经授权的业务数据。
