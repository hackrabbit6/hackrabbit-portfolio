# VISUAL-POLISH

一轮视觉整改，不是产品重写。所有方向性决策已经定死，本文档只描述执行。

先读 `AGENTS.md`（边界）与 `CONTEXT.md`（术语），再开始。

**严格按 phase 顺序做。** 每个 phase 结束跑 `bun run lint` 与 `bun run build`，全绿才进入下一个。当前 phase 有回归时停下来修，不要往前推进。

---

## 目标

首页最终形态与视觉权重：

```
NAV
HERO                      ~25%
NOW · CREW（薄带）         ~8%
SELECTED WORK             ~50%   ← 主角
SKILLS                    ~10%
EXPERIENCE                 ~7%
CONTACT / CTA
FOOTER
```

Art direction：**Editorial × Developer × Product**。
Dark、Minimal、Technical、High Contrast、Large Typography、Real Product Visuals、Subtle Motion。
不是 SaaS 官网，不是赛博朋克，不是满屏 Bento Grid。

参考关系：杂志的信息层级 + 开发者网站的克制 + 产品官网的视觉展示。

---

## P0 — 删除与可行性探测

这个 phase 没有任何设计判断，全是机械操作，`astro check` + `astro build` 即可验收。必须最先做完：移除 Lenis 会改变全站滚动行为，任何在它之前做的视觉 QA 都要重做一遍。

### P0.1 移除平滑滚动层

删除文件：

- `src/lib/smoothScroll.ts`
- `src/lib/gsapLenis.ts`

删除 `src/layouts/Base.astro` 中的整个 `<script>` 块（第 25–30 行）。

> 安全性说明：`connectGsap` 唯一的额外作用是全局 `gsap.registerPlugin(ScrollTrigger)`。`Crew.tsx`、`Work.tsx`、`Experience.tsx`、`Skills.tsx` 内部各自都已经调用了 `registerPlugin`，删掉不会导致插件未注册。

从 `package.json` 移除依赖 `lenis`，重新安装锁定文件。

### P0.2 移除未使用的 3D 依赖

从 `package.json` 移除：`three`、`@react-three/fiber`、`@react-three/drei`、`@types/three`。

这四个包当前在 `src/` 下零引用（`HeroField.astro` 是 2D canvas，不用 WebGL）。移除前用全仓搜索确认无引用，移除后重新安装。

### P0.3 移除 Manifesto

删除文件：

- `src/components/Manifesto.tsx`
- `src/components/Manifesto.css`

从 `src/pages/index.astro` 移除 import 与 `<Manifesto client:visible />`。

检查全仓是否还有指向 `#manifesto` 的锚点链接（已知 `Hero.astro` 的 `scroll-cue` 指向它），一并处理 —— 该链接在 P1 会被 CTA 取代。

### P0.4 移除滚动劫持型动画

- `src/components/Crew.tsx`：删除 `pin: true`、`scrub: true`、`end: '+=1200'` 的 ScrollTrigger timeline。Crew 在 P2 会被重做成薄带，这里先把 pin 拆掉即可，卡片可以先退化为普通淡入。
- `src/components/Work.tsx`：**保留** `.work-heading` 的 pin。它是 sticky 标题，不消耗额外滚动距离，属于 editorial 手法，不在删除范围内。

保留下来的动画只允许这四类：**Fade、Translate、Image Reveal、Subtle Scale**。

明确禁止：逐字飞入、大面积 parallax、scroll hijacking、卡片旋转、鼠标跟随特效。

### P0.5 Cover 可行性探测

在做任何 Cover 之前，先确定每一张走真实截图还是设计图。逐个尝试本地运行，**单个项目 30 分钟内跑不起来就判定为「设计图」，不要继续投入**。

| 项目 | 仓库 | 尝试什么 | 已知条件 |
|---|---|---|---|
| onchain-research | `hackrabbit6/onchain-research` | 跑 CLI，截真实终端输出 | `.env.example` 表明默认使用 fixture 数据，**无需 API key** |
| 数字亲人 | `hackrabbit6/digital-loved-one` | 跑起来截真实对话界面 | 需要 `ANTHROPIC_API_KEY`；存储默认本地 JSON |
| AI 音乐 | `hackrabbit6/music` | 跑起来截真实控制台 | 需要 `MINIMAX_API_KEY`（付费） |
| H5 SDK | — | **不尝试** | 受脱敏约束，不公开公司代码与业务数据，只能做设计图 |

**P0 出口：把四张 Cover 各自的最终方式（真图 / 设计图）写进本文件 P3 的表格里，再进入 P1。**

### P0 验收

- [ ] `bun run lint` 绿
- [ ] `bun run build` 绿
- [ ] 全仓搜索 `lenis`、`three`、`@react-three`、`Manifesto` 无残留引用
- [ ] 首页可正常滚动（原生滚动，无平滑滚动库）
- [ ] 四张 Cover 的方式已在 P3 表格中落定

---

## P1 — Hero

只改 Hero。Hero 单独看不成立，不允许进入 P2。

### 结构

```
frontend operator / hackrabbit

HACKRABBIT

4-5 年前端交付。我用第一性原理拆问题，
带着 AI crew 把活干得更快更稳。

[ Selected Work ↓ ]   [ GitHub ↗ ]
```

### 规则

- `HACKRABBIT` 是全页最大的视觉锚点，字号明显高于任何其他文字。
- 说明段落宽度收窄，不允许跨满栏；控制在易读的测量宽度内。
- `HeroField` 的 canvas **只能作为背景氛围层**，不得与主标题竞争注意力。它当前已经是桌面端限定 + `prefers-reduced-motion` 降级，保持这个行为。
- CTA 最多两个，就是上面这两个。移除原有的 `scroll to enter` 链接。
- 保留 `hackrabbit-mark` ASCII 兔子，但它是次级元素，不得抢过 `HACKRABBIT`。
- 保留顶部导航，但同步移除已删除章节的入口（Manifesto）。

### P1 验收

- [ ] 1440 / 1280 / 768 / 430 / 390 / 360 六个宽度均无横向滚动、无文字截断
- [ ] `prefers-reduced-motion: reduce` 下 Hero 完全静态且信息完整
- [ ] 截一张 1440×900 的 Hero 图，单独看能作为这个站的宣传图
- [ ] `bun run lint` / `bun run build` 绿

---

## P2 — NOW · CREW 薄带

Hero 之下的一条薄带，同时回答「现在在做什么」和「用什么方式做」。

由现有 `src/components/Crew.tsx` 改造而来，不新建章节。

### 内容

```
NOW    2026 起 · 独立开发 / AI 工具与前端实验

CREW   Claude Code    规划 / 大段重构 / code review
       Codex 桌面版    执行 / GUI / 截图 / 高频重复
       OpenSpec       规范 / 边界 / 防跑偏
```

### 规则

- 这是**一条带**，不是一个章节。桌面端高度不超过一屏的四分之一，视觉重量明显轻于 Selected Work。
- NOW 行只陈述当下方向，不写时间跨度声明，不写任何无法从公开仓库核实的内容。
- Crew 三行保留现有 `agent` 与 `role` 字段，`flow` 长句在薄带里省略或截短。
- 无 pin、无 scrub。进场动画只允许淡入 + 位移。
- `src/components/Crew.css` 需要相应重写，从卡片布局改为条带布局。

### P2 验收

- [ ] 桌面端该区块高度 ≤ 视口高度的 25%
- [ ] 移动端单列，不出现横向滚动
- [ ] 无 pin / scrub
- [ ] `bun run lint` / `bun run build` 绿

---

## P3 — 四张 Cover

这是本轮视觉价值最高的一步。

### 方式表（P0.5 探测结果）

| # | 项目 | 方式 | 状态 |
|---|---|---|---|
| 01 | H5 游戏发行 SDK | 设计图（架构） | 已定。受脱敏约束，不可改 |
| 02 | AI 音乐生成 | 设计图（生成链路） | 已定。`MINIMAX_API_KEY` 需付费，未取得，按预案走设计图 |
| 03 | 数字亲人 | 设计图（grounding 分支） | 已定。`ANTHROPIC_API_KEY` 未取得，按预案走设计图 |
| 04 | onchain-research | **真实终端输出** | 已定。fixture 数据实跑，无需 API key |

### 产出方式

四张 Cover 由 `tools/covers/` 下的同一套 HTML + CSS 渲染成 PNG，共用 `cover.css`
里的栅格、字体、配色、内边距与描边规则 —— 这是「四张属于同一套视觉语言」的保证方式。

```bash
bun tools/covers/render.ts    # 覆盖写入 public/covers/
```

每张按它在页面上所处视觉位的 CSS 尺寸出图，`Work.css` 用 `aspect-ratio` 锁死同一比例，
因此任何宽度下都不会裁掉图里的概念链与说明行：

| # | 出图尺寸（CSS） | 倍率 | 视觉位 |
|---|---|---|---|
| 01 | 684 × 520 | 2x | `.work-featured` |
| 02 / 03 | 322 × 360 | 4x | `.work-pair`（窄屏并成单列后会被拉到约 640，故需 4x） |
| 04 | 684 × 480 | 2x | `.work-wide` |

04 的终端正文是下面这条命令的**逐字输出**，不是重排的示意文本。

**04 的复现方式**（已实测通过，无需任何 API key）：

```bash
git clone --depth 1 https://github.com/hackrabbit6/onchain-research.git
cd onchain-research && bun install && cp .env.example .env
bun run src/index.ts scan --token 0xccfb3e8b1772bd3a9fc62deaf75127adad597777 --format table
```

输出包含浓度统计、Top holder 表、cluster 置信度评分，以及两行免责警告
（"Cluster output is research evidence, not proof of common control."）。
截图**必须包含那两行警告** —— 它们正是 `Work.tsx` 中该项目「只输出可复核证据，不把聚类包装成归因证明」这句话的直接证据。

### 共同约束

四张 Cover 必须**属于同一套视觉语言**：同一栅格、同一字体、同一配色、同一内边距、同一圆角与描边规则。放在一起要像一套东西，而不是四个人做的。

同时四张必须**各自有独立的概念**。禁止四张都是「网页截图塞进 MacBook mockup」，也禁止用渐变色块或抽象图形糊过去。

Cover 资源放 `public/covers/`，用 `<img>` 引入并写 `alt`；不要用 CSS 背景图（会失去可访问性与懒加载）。

### 各自的视觉概念

**01 H5 SDK —— 系统结构感。** 表达多个游戏共用一条接入链路：

```
              GAME
Account  ──────→  SDK
Payment  ─────────┤
                  ↓
                Game
                  ↓
              Reporting
```

**02 AI 音乐 —— 生成链路与声音。** 提示词进、波形、产出：

```
Prompt
  ↓
████████ waveform ████████
  ↓
Generate
```

**03 数字亲人 —— 记忆与依据。** 重点是 Memory / Grounding，**不要做俗套的 AI 机器人形象**：

```
Memory → Knowledge → Grounding → Conversation
```

**04 onchain-research —— 链上数据关系。**

```
Wallet → Transaction → Capital Flow → Signal
```

### P3 验收

- [ ] 四张并排看是同一套设计语言
- [ ] 四张各自的概念可辨识，无一张是纯装饰
- [ ] 全部有 `alt` 文本
- [ ] 无编造的界面、数字、指标
- [ ] `bun run lint` / `bun run build` 绿

---

## P4 — Selected Work 重做

Cover 完成后才做这里。

### 桌面布局：1 + 2 + 1

```
01 / FEATURED
┌─────────────────────────────────────┐
│           H5 SDK COVER              │   visual min-height 520px
└─────────────────────────────────────┘
H5 游戏发行 SDK 与充值体系
工作项目 · 脱敏案例
（简介）
阅读案例 →

┌─────────────────┐ ┌─────────────────┐
│    AI MUSIC     │ │  DIGITAL MEMORY │   visual min-height 360px
└─────────────────┘ └─────────────────┘

┌─────────────────────────────────────┐
│         ONCHAIN RESEARCH            │   visual 480px（真实终端输出需要行高，≥360 即可）
└─────────────────────────────────────┘

──────────────────────────────────────
05  广告买量系统    中后台 / 投放流程
    工作项目 · 暂无公开材料
    Vue3 · Element Plus · vue-i18n
```

第五个项目是**网格下方的一行纯文字**，没有 Cover，没有大视觉位。

### 数据结构改动

`src/components/Work.tsx` 的 `projects` 数组：把现有的单一 `status` 字段拆成两个字段（术语定义见 `CONTEXT.md`）。

```ts
origin:   '工作项目' | '个人项目'
evidence: '脱敏案例' | '开源代码' | '暂无公开材料'
```

对应值：

| 项目 | origin | evidence |
|---|---|---|
| H5 SDK | 工作项目 | 脱敏案例 |
| 广告买量系统 | 工作项目 | 暂无公开材料 |
| AI 音乐生成 | 个人项目 | 开源代码 |
| 数字亲人 | 个人项目 | 开源代码 |
| onchain-research | 个人项目 | 开源代码 |

卡片上两个值一起展示，格式 `工作项目 · 脱敏案例`。

新增 `cover` 字段指向 `public/covers/` 下的图片；第五个项目无 `cover`。

### 链接文案统一

- 站内案例页：`阅读案例 →`
- 公开仓库：`查看代码 →`

改掉 `src/components/Work.tsx` 里的 `查看案例 →`，使其与 `src/pages/work/index.astro` 一致。

### 占位文案清除

删除 `src/pages/work/index.astro` 第 39 行的「完整脱敏案例整理中，首页已提供职责与结果摘要。」，改写成对该项目职责与结果的直接陈述，不提「整理中」。

> 注意：全仓不存在「visual not published」这个字符串。不要去找它，也不要创造它。

### Hover 规则

只允许两件事：**图片 scale**（幅度克制）与 **箭头 translate**。
禁止卡片位移、旋转、发光、边框动画、阴影跳变。

### 断点

Cover 里的字是画进位图的，不随容器重新排版，所以视觉位不能被压窄也不能被拉宽：

- `< 1024px`：sticky 标题不再占一列，叠回列表上方，把容器宽度让给 Cover；`.work-heading` 的 pin 同步只在 `≥ 1024px` 生效。
- `.work-list` 在单列模式下 `max-width: 684px` —— 再宽只是把位图拉糊。
- `< 768px`：`.work-pair` 并成单列。

### 移动端

全部单列，顺序为：Cover → 标题 → 标签 → 简介 → 链接。

### P4 验收

- [ ] Featured 的 visual 高度 ≥ 520px（桌面）
- [ ] 双列项目的 visual 高度 ≥ 360px（桌面）
- [ ] Selected Work 区块约占首页总高的 50%
- [ ] 五个项目全部显示 `origin · evidence` 两个值
- [ ] 全站无「整理中 / 待补充 / 敬请期待 / Coming soon」类文案
- [ ] hover 只有图片 scale 与箭头 translate
- [ ] 移动端全单列
- [ ] `bun run lint` / `bun run build` 绿

---

## ━━━ 部署门 ━━━

P0–P4 完成后部署一次，交付方 review 后再继续。

Hero、Cover、Selected Work 基本决定这个站最终能不能成立，方向没确认之前不要投入 P5–P7 的打磨。

---

## P5 — Typography 与 Spacing

页面结构定下来之后才做。

统一检查这几级并确保层级差异清晰：`Display / H1 / H2 / H3 / Body / Small / Meta`。
统一检查：`Section Gap / Container / Card Gap / Paragraph Gap`。

**目标不是把所有间距统一成一个值，而是制造节奏变化。**

- Hero → NOW·CREW：近
- NOW·CREW → Selected Work：远
- 项目与项目之间：非常远
- Skills / Experience 内部：紧凑

变量统一收进 `src/styles/tokens.css`，不要在组件 CSS 里散落魔法数字。

### 定下来的字号刻度

相邻两级固定约 1.4 倍，任何两级放在同一屏都能分出主次。桌面满宽取值：

| Token | 桌面 | 用在哪 |
|---|---|---|
| `--fs-display` | 112 | 每页唯一的锚点（首页 HACKRABBIT） |
| `--fs-h1` | 80 | 案例页标题 |
| `--fs-h2` | 56 | 章节标题（Selected Work / Skills / Experience / Contact 现在完全一致） |
| `--fs-h3` | 40 | Featured 项目名、能力卡、时间线条目 |
| `--fs-h4` | 28 | 双列项目名、案例页卡片 |
| `--fs-lead` | 21 | 导语 |
| `--fs-body` | 17 | 正文 |
| `--fs-small` | 15 | 按钮 / 胶囊 |
| `--fs-meta` | 13 | mono 标签 |

改之前章节标题是 96 / 92 / 86 三个值，和 Hero 的 112 挤在同一档；现在 Display 正好是 H2 的两倍。

两处**故意不在刻度上**：窄屏的 `.hero-title` 与 `.case-hero h1` 是单独算的（见 P6，不许等比缩小）；
`.hackrabbit-mark` 的 `font-size` 是 ASCII 图形的缩放参数，不是排版层级。

### 定下来的节奏

间距本身是层级信号。实测渲染值：

| 位置 | 间距 | 对应要求 |
|---|---|---|
| Hero → NOW·CREW | 104 | 近 |
| NOW·CREW → Selected Work | 160 | 远 |
| 项目与项目之间 | 200 | 非常远 |
| 其余章节之间 | 184 | — |
| Skills / Experience 内部 | 16 / 24 | 紧凑 |

章节内边距改成不对称（起始 `--space-section` 120，收尾 `--space-section-end` 64），
否则两个 120 相加会让每个章节边界都是 240，节奏被抹平。

`--container` / `--gutter` 也收进 tokens —— 原先 `calc((100vw - 1180px) / 2 + var(--s5))` 在四个组件里各写了一遍。

### P5 验收

- [ ] 字号层级在同一屏内可分辨主次
- [ ] 章节间距体现出上述节奏差异，而非等距
- [ ] 新增间距值来自 tokens，非硬编码
- [ ] `bun run lint` / `bun run build` 绿

---

## P6 — Mobile QA

单独当作一个任务做。不允许只写一句 "make it responsive" 就算完成。

目标宽度：**360 / 390 / 430**。

### 必做项

- 修正 `src/layouts/Base.astro` 第 15 行的 viewport meta，补上 `initial-scale=1`：
  `<meta name="viewport" content="width=device-width, initial-scale=1" />`
- Hero 大字号**重新计算**，不能只是桌面端等比缩小。
- Selected Work 全部单列。
- 检查所有 Cover 图在窄屏下不变形、不溢出。
- 检查导航在窄屏下可用。

### 查出来并修掉的

用真机模拟（`mobile: true` + 触摸 + DPR 3）跑 3 个页面 × 3 个宽度，逐项审计
横向溢出、文字截断、图片、触摸目标，而不是只看截图：

- **所有图片的 `max-width` 计算值是 `none`。** 之前不溢出只是因为 `.work-visual img`
  写了 `width: 100%`，属于碰巧。tokens.css 加了全局 `img { max-width: 100% }`。
- **触摸目标只有 18px 高**：导航、`.work-link`、`.case-nav` 全部是 18px。
  用 `@media (pointer: coarse)` 加 `padding-block` 撑高 —— 只在触摸设备生效，
  桌面实测 `pointer: coarse` 不命中，布局零变化。
- 顶部两字导航项现在是 26×42。宽度保持 26：过了 WCAG 2.2 的 24×24 下限，
  彼此间距 16px；再加横向 padding 会让导航在 360px 掉成两行，不划算。

### 已知未处理

Cover 是位图，字画在图里。窄屏下整张按比例缩小，04 的终端正文（按 684 宽设计的
11px）在 390px 上只有约 5.5px，认不出字。不变形、不溢出、不裁切都成立，
但内容不可读。要修得给 Cover 出窄屏专版并上 `<picture>` srcset —— 不在 P6 必做项里。

### P6 验收

- [x] 360 / 390 / 430 三个宽度均无横向滚动（3 个页面全部）
- [x] Hero 首屏无文字截断、无重叠
- [x] 所有图片 `max-width: 100%`
- [x] `bun run lint` / `bun run build` 绿

---

## P7 — 可访问性与终检

### 必做项

- `prefers-reduced-motion: reduce` 下全站静态且信息完整（所有组件当前都有这个分支，逐个复核仍然成立）。
- 键盘可达：Tab 能走完导航、所有 CTA、所有项目链接，focus 可见。
- 所有 `<img>` 有有意义的 `alt`；纯装饰元素标 `aria-hidden`。
- 对比度：正文与背景满足 WCAG AA。
- 逐页人工过一遍：`/`、`/work/`、`/work/h5-game-sdk/`、`/resume.pdf`。

### P7 验收

- [ ] 上述五项全部通过
- [ ] `bun run lint` 绿
- [ ] `bun run build` 绿
- [ ] 全仓无 TODO / 占位 / 注释掉的死代码残留

---

## ━━━ 部署 ━━━

第二轮只改具体细节，不允许「感觉不太好所以全部重做」。

修改项要具体到这个粒度：

> Hero title 上移 40px
> 项目 02/03 之间 gap 从 24 调到 32
> Body line-height 太松
> Cover 03 对比度不足

---

## 明确不做

本轮**不**做以下任何一项，即使看起来顺手：

- 新增 AI Chat、CMS、Dashboard、评论、搜索、分析面板
- 新建 `/about/`、`/now/`、`/lab/`、`/writing/` 或任何新路由
- 更换框架、包管理器、部署平台
- 引入 Tailwind / UnoCSS / 组件库 / 状态管理
- 改动 `src/components/Experience.tsx` 的数据
- 编造截图、指标、时间或项目事实
- 大范围重排未涉及文件的代码风格

## 已知但不在本轮范围

记录下来，不要在本轮处理：

- `Base.astro` 没有 OG / Twitter card meta，社交分享无预览图
- 没有 `sitemap.xml` / `robots.txt`
- 没有 404 页面
- 没有 ESLint / Prettier
