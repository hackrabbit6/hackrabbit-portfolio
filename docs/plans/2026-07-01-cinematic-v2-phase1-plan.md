# cinematic-v2 · Phase 1 首页 实现计划

> **执行者:Codex 桌面版。** Claude Code 编写、Codex 执行、Claude Code review。
> 开工前先读 spec:`docs/specs/2026-07-01-cinematic-v2-phase1-homepage-design.md`。
> 每个 Task 结束必须 `bun run build`(或 `bunx astro build`)通过 + commit。用 `- [ ]` 跟踪。

**Goal:** 在新分支 `cinematic-v2` 上,用 Astro + React island + Lenis + GSAP + R3F 做一个电影感滚动的综合个人站首页(Phase 1),进化黑客兔深色气质,内建 reduced-motion / 移动端降级 / 性能护栏。

**Architecture:** Astro 做壳与静态输出;首页交互/3D 封装成 React island,只在首页加载;Lenis 提供全局惯性滚动,与 GSAP ScrollTrigger 的 raf 同步驱动视差与 pinned 幕;WebGL hero 是一个 R3F + GLSL shader island,带静态降级。

**Tech Stack:** Astro 5、@astrojs/react、React 19、lenis、gsap(ScrollTrigger)、three、@react-three/fiber、@react-three/drei、TypeScript、Bun。部署 Netlify。

## Global Constraints(每个 Task 隐含遵守)

- 分支 `cinematic-v2`;不动 `concept-a` 分支和 `concept-a-v1` tag。
- 深色底延续 `#0B0B0E` 系;强调色以 `#39FF8B` 为基,实现时定 1 个最终值写进 token,**不反复调**。
- 内容(人设句、crew、5 个项目的方向/协作/结果、能力、4 段经历、联系方式)**复用 concept-a 文案**,来源:`git show concept-a:src/App.tsx`。第一人称、有观点;研究类项目不包装成成品。
- 人设句逐字:"4-5 年前端交付 + 我用第一性原理思考、指挥一队 AI 智能体,把活干得更快更稳。"
- 站位:信誉打底 + operator 加分,不否定写码。
- **护栏(硬性)**:`prefers-reduced-motion` 退化静态可读版;移动端 WebGL 降级为静态渐变;首页 3D lazy;Lighthouse 桌面 perf ≥ 90 / 移动 ≥ 80;语义 HTML + 键盘可达 + alt。
- 动效服务叙事,克制,不炫技堆砌。YAGNI:本期不做真实博客/项目/媒体系统,只留占位入口。
- 每个 Task 结束跑 build 通过并 commit。

---

## Task 1:Astro 脚手架 + Lenis 全局惯性滚动 + design token

**目标产出:** 一个能跑的 Astro 站,深色底 + design token + Lenis 惯性滚动生效,一个空首页。

**Files:**
- Create: 全新 Astro 项目结构(`astro.config.mjs`、`package.json`、`src/pages/index.astro`、`src/layouts/Base.astro`、`src/styles/tokens.css`、`src/lib/smoothScroll.ts`)
- 注意:Astro 与旧 Vite 结构冲突,本分支重建。保留 `public/resume.pdf`、`docs/`、`screenshots/`。

- [ ] **Step 1:切分支 + 脚手架**

```bash
git checkout concept-a && git checkout -b cinematic-v2
# 备份旧 src 的内容来源(文案),稍后用 git show concept-a:src/App.tsx 取
bunx create-astro@latest . --template minimal --no-install --no-git --yes
bunx astro add react --yes
bun add lenis gsap three @react-three/fiber @react-three/drei
bun add -d @types/three
```
若 `create-astro` 因目录非空报错,先把旧 Vite 文件(`src/`、`index.html`、`vite.config.ts`、`tsconfig*.json`、`eslint.config.js`)移到 `/tmp` 备份再脚手架,`public/resume.pdf`、`docs/`、`screenshots/` 保留。

- [ ] **Step 2:design token**（`src/styles/tokens.css`）

```css
:root {
  --bg: #0B0B0E;
  --bg-elev: #141418;
  --ink: #F5F3EF;
  --ink-dim: #A9ABB0;
  --accent: #39FF8B;          /* 进化黑客兔主强调,最终值定这里,不再反复 */
  --accent-2: #22D3EE;
  --line: rgba(255,255,255,0.08);
  --glow: 0 0 40px rgba(57,255,139,0.25);
  --blur-depth: 24px;
  --s1:4px; --s2:8px; --s3:12px; --s4:16px; --s5:24px; --s6:40px; --s7:64px; --s8:120px;
  --font-mono:'JetBrains Mono',ui-monospace,SFMono-Regular,Menlo,monospace;
  --font-display:'Space Grotesk',system-ui,sans-serif;
  --font-body:system-ui,-apple-system,'PingFang SC',sans-serif;
  --ease-cine: cubic-bezier(0.22, 1, 0.36, 1);
  color-scheme: dark;
}
html,body{margin:0;background:var(--bg);color:var(--ink);font-family:var(--font-body);}
```
在 `Base.astro` 引入 tokens.css 并加 Google Fonts `<link>`(JetBrains Mono + Space Grotesk),离线取不到降级系统字体。

- [ ] **Step 3:Lenis 全局惯性滚动 + reduced-motion 短路**（`src/lib/smoothScroll.ts`）

```ts
import Lenis from 'lenis'

export function initSmoothScroll() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return null
  const lenis = new Lenis({ duration: 1.1, smoothWheel: true })
  function raf(time: number) {
    lenis.raf(time)
    requestAnimationFrame(raf)
  }
  requestAnimationFrame(raf)
  return lenis
}
```
在 `Base.astro` 底部用 `<script>`(client) 调用 `initSmoothScroll()`。import 'lenis/dist/lenis.css'。

- [ ] **Step 4:验证 + Commit**

Run: `bunx astro build`(通过)+ `bun run dev` 打开首页:深色底、滚动有惯性(reduced-motion 开启时无惯性)。
```bash
git add -A && git commit -m "feat(astro): scaffold cinematic-v2 with Lenis smooth scroll and tokens"
```

---

## Task 2:GSAP+Lenis 同步 + WebGL shader Hero(带降级)

**目标产出:** 第 1 幕 Hero:shader 暗场(桌面)/ 静态渐变(移动或降级)+ 黑客兔 mark + 人设句载入揭示;GSAP 与 Lenis 打通。

**Files:**
- Create: `src/lib/gsapLenis.ts`(ScrollTrigger 与 Lenis 同步)、`src/components/HeroCanvas.tsx`(R3F shader island)、`src/components/HeroCanvas.css`、`src/components/Hero.tsx`(island wrapper,含 mark + 文案)、`src/components/HackRabbitMark.tsx`
- Modify: `src/pages/index.astro`

- [ ] **Step 1:GSAP↔Lenis 同步**（`src/lib/gsapLenis.ts`）

```ts
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import type Lenis from 'lenis'

export function connectGsap(lenis: Lenis | null) {
  gsap.registerPlugin(ScrollTrigger)
  if (lenis) {
    lenis.on('scroll', ScrollTrigger.update)
    gsap.ticker.add((t) => lenis.raf(t * 1000))
    gsap.ticker.lagSmoothing(0)
  }
  return { gsap, ScrollTrigger }
}
```
把 Task1 的 `initSmoothScroll()` 返回的 lenis 传进来(在同一 client script 里 `connectGsap(lenis)`)。

- [ ] **Step 2:HackRabbitMark**（复用 concept-a 的 ASCII mark 组件,等宽 + `--accent`）

```tsx
export function HackRabbitMark({ compact = false }: { compact?: boolean }) {
  return (
    <pre className={compact ? 'hackrabbit-mark compact' : 'hackrabbit-mark'} aria-label="hackrabbit mark">
{`(\\(\\
(•ᴥ•)
/ づ`}
    </pre>
  )
}
```

- [ ] **Step 3:HeroCanvas —— R3F + GLSL shader 暗场**（`HeroCanvas.tsx`）

写一个全屏 `<Canvas>`,内含一个铺满的平面,fragment shader 做流体/粒子噪声暗场(深色 + `#39FF8B` 极低强度点缀),uniform `uTime` 动、`uScroll` 预留绑定滚动进度。用 `@react-three/fiber` 的 `useFrame` 推进 `uTime`。**性能**:`dpr={[1,1.5]}`、`frameloop` 合理。
> 具体 shader:简单 fbm/simplex 噪声即可,颜色在 `#0B0B0E`↔暗绿之间。不要重型 3D 模型。

- [ ] **Step 4:Hero island + 降级逻辑**（`Hero.tsx`）

- 检测 `window.innerWidth < 768` 或 `prefers-reduced-motion` → **不渲染 Canvas**,改用 CSS 静态渐变背景 `background: radial-gradient(...accent low alpha... , var(--bg))`。
- 桌面且允许动效 → 渲染 `<HeroCanvas/>`。
- 前景:`<HackRabbitMark/>` + `<h1>` 人设句(逐字见 Global Constraints,关键词 `--accent` 高亮)+ `> crew: 3 agents online` + 滚动提示。
- 文案载入揭示:GSAP `from` y+opacity,`--ease-cine`。

- [ ] **Step 5:挂进首页**（`index.astro`）

用 `<Hero client:only="react" />`(或 `client:load`)。确保 island 只在首页。

- [ ] **Step 6:验证 + Commit**

Run: `bunx astro build` 通过;`bun run dev` 桌面见 shader 暗场 + 文案上浮;缩到移动宽度见静态渐变;开系统 reduced-motion 见静态。
```bash
git add -A && git commit -m "feat(hero): webgl shader hero with static fallback + gsap/lenis sync"
```

---

## Task 3:第一性原理宣言 + 四支柱视差(第 2 幕)

**Files:** Create `src/components/Manifesto.tsx` + css;Modify `index.astro`

- [ ] **Step 1:结构**

一段第一人称宣言(复用 concept-a 的"先证明稳定交付,再展示 AI"定位文案),下面四支柱 `健康 · 现金流 · 认知 · AI`。

- [ ] **Step 2:视差(分层速度差)**

用 GSAP ScrollTrigger:标题层与四支柱层用不同 `y` 速度(`scrub: true`),制造速度差。四支柱错位 `stagger` 浮入。
```ts
gsap.to('.manifesto-title', { yPercent: -15, ease: 'none',
  scrollTrigger: { trigger: '.manifesto', start: 'top bottom', end: 'bottom top', scrub: true } })
gsap.from('.pillar', { y: 40, opacity: 0, stagger: 0.12,
  scrollTrigger: { trigger: '.pillars', start: 'top 80%' } })
```

- [ ] **Step 3:验证 + Commit**（build 通过,滚动见速度差与浮入)
```bash
git add -A && git commit -m "feat(manifesto): first-principles act with parallax pillars"
```

---

## Task 4:My AI Crew — pinned 幕(第 3 幕)

**Files:** Create `src/components/Crew.tsx` + css;Modify `index.astro`

- [ ] **Step 1:数据**(复用 concept-a `crew`:Claude Code / Codex 桌面版 / OpenSpec 工作流,各 role + flow)

- [ ] **Step 2:pinned + 逐个推入**

ScrollTrigger `pin: true`,随滚动进度 agent 卡逐张从右推入/高亮:
```ts
const tl = gsap.timeline({ scrollTrigger: {
  trigger: '.crew', start: 'top top', end: '+=1200', pin: true, scrub: true } })
tl.from('.crew-card', { xPercent: 40, opacity: 0, stagger: 0.5 })
```
标题 "我不是一个人写代码,我管理一队 AI 智能体。" 卡片带 `> status: online`。

- [ ] **Step 3:验证 + Commit**(build 通过;滚到该幕被钉住、卡片依次推入)
```bash
git add -A && git commit -m "feat(crew): pinned AI crew act with scroll-driven reveal"
```

---

## Task 5:精选作品 — pinned 视差(第 4 幕)

**Files:** Create `src/components/Work.tsx` + css;Modify `index.astro`

- [ ] **Step 1:数据**(复用 concept-a 5 个项目:name/type/status/direction/collaboration/result/stack/repo)

- [ ] **Step 2:pinned 横向或景深滚动**

标题幕 pinned,项目卡带景深/视差(卡片内层与背景不同 `y` 速度)。每卡:方向/协作/结果三段 + stack 标签 + `查看代码 →`(有 repo 的)。
```ts
gsap.utils.toArray('.work-card').forEach((card) => {
  gsap.from(card, { y: 60, opacity: 0,
    scrollTrigger: { trigger: card, start: 'top 85%' } })
})
```

- [ ] **Step 3:验证 + Commit**
```bash
git add -A && git commit -m "feat(work): selected projects act with depth parallax"
```

---

## Task 6:能力 + 经历(第 5、6 幕)

**Files:** Create `src/components/Skills.tsx`、`src/components/Experience.tsx` + css;Modify `index.astro`

- [ ] **Step 1:能力**(复用 concept-a `capabilities`:4 类 + `> agent boost:` 行),交错揭示(`stagger` + ScrollTrigger)。

- [ ] **Step 2:经历时间线**(复用 concept-a `experience` 4 段),随滚动逐条点亮(`from` opacity/x + ScrollTrigger)。

- [ ] **Step 3:验证 + Commit**
```bash
git add -A && git commit -m "feat(skills+experience): capability and timeline acts"
```

---

## Task 7:联系 / footer + Phase 2-4 占位入口(第 7 幕)

**Files:** Create `src/components/Contact.tsx` + css;Modify `index.astro`

- [ ] **Step 1:联系**

第一人称联系文案 + `<HackRabbitMark compact/>` + 邮箱 `hackrabbit6@gmail.com` + GitHub `https://github.com/hackrabbit6`。

- [ ] **Step 2:Phase 2-4 占位入口**

三个"即将上线"入口卡:**博客 / GitHub 项目 / 自媒体**,标 `soon` 徽标,暂不链接真实页(留 `#`)。为后续分期埋结构。

- [ ] **Step 3:验证 + Commit**
```bash
git add -A && git commit -m "feat(contact): contact act + phase 2-4 placeholder entries"
```

---

## Task 8:护栏收口 + 验收(不加新幕,只加固 + 验证)

**Files:** 按需 Modify 各组件;Create `netlify.toml`

- [ ] **Step 1:reduced-motion 全局退化**

确保开启 `prefers-reduced-motion` 时:Lenis 不启(Task1 已短路)、所有 GSAP 动画降级为无动画静态(用 `gsap.matchMedia()` 或在每处 ScrollTrigger 外包 `if (!reduced)`)。手动验证:系统开启 reduce motion,页面仍完整可读、无空白。

- [ ] **Step 2:移动端降级验证**

375px 宽:Hero 静态渐变、pinned 幕在窄屏不卡(必要时窄屏关 pin,改普通堆叠)、无横向溢出。

- [ ] **Step 3:Netlify 配置**(`netlify.toml`)

```toml
[build]
  command = "bunx astro build"
  publish = "dist"
```

- [ ] **Step 4:性能 + 构建验收**

Run: `bunx astro build`(通过)、`bun run lint`(若配置了)、本地 `astro preview` 跑 Lighthouse:桌面 perf ≥ 90、移动 ≥ 80。达不到就压 3D dpr / 懒加载 / 减动画数量,直到达标。

- [ ] **Step 5:截图归档**

桌面 + 移动各截全页图存 `screenshots/`(命名 `*-cinematic-v2.png`),不覆盖 concept-a 的截图。

- [ ] **Step 6:对照 spec 第 5 节完成清单逐项核对**,全绿后停下等 Claude Code review,**不要自己 deploy**。
```bash
git add -A && git commit -m "chore(guardrails): reduced-motion, mobile fallback, perf, netlify config"
```

---

## Self-Review(Claude Code 编写时已核对)

- Spec 覆盖:架构/Astro→T1;Lenis→T1;GSAP 同步+Hero shader+降级→T2;视差→T3;pinned→T4/T5;
  7 幕→T2-T7;reduced-motion/移动/性能护栏→T8;Netlify→T8;内容复用→各 Task 标注来源 concept-a。✅
- 无占位:关键集成(Lenis、GSAP↔Lenis 同步、ScrollTrigger、降级、netlify.toml)给了实际代码。✅
- 命名一致:`initSmoothScroll`→`connectGsap`、token 变量、`HackRabbitMark`、组件名跨 Task 统一。✅
- 已知风险留给 Codex:create-astro 目录非空需备份旧 Vite 文件;shader 自行实现简单噪声即可。
