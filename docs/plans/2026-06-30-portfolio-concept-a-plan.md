# hackrabbit 作品集 · 概念 A 实现计划

> **执行者:Codex 桌面版。** 本计划由 Claude Code 编写、Codex 执行、Claude Code review。
> Codex 拥有本仓库完整读写权。开工前先读 spec:`docs/specs/2026-06-30-portfolio-concept-a-design.md`。
> 步骤用 `- [ ]` 复选框跟踪;每个 Task 结束必须 commit。

**Goal:** 把现有"批量 SaaS 风"作品集改造成概念 A —— "AI 智能体操盘手 × 黑客兔",深色电光控制台质感,第一人称有观点的文案。

**Architecture:** 不推翻现有 React 结构,在 `src/App.tsx` + `src/App.css` + `src/index.css` 上重组。先落地 design token(CSS 变量),再逐区块改造,最后收敛 3D 背景并按完成清单验收。

**Tech Stack:** React 19 + TypeScript + Vite + Bun + lucide-react;现有 `three.js` 背景按 Task 6 处置。

## Global Constraints(每个 Task 都隐含遵守,数值逐字照抄)

- 背景色 `#0B0B0E`;主文字火白 `#F5F3EF` / 灰白 `#A9ABB0`;**主强调 `#39FF8B`(琴荧绿)**;副强调电青 `#22D3EE`。
- 间距阶梯只用:`4 / 8 / 12 / 16 / 24 / 40 / 64`(px)。全部走 CSS 变量,**不允许散落硬编码色值/间距**。
- 等宽字体承载 hacker/operator 身份(标签、状态、代码感元素);标题用一款有性格的字体。
- 文案全程**第一人称、有观点**:禁止"负责…/参与…"式第三人称规格表句,改成"我看到 X,所以我这么做"。
- 质感是"冷、精密、黑客控制台",**克制,不是 gamer RGB**:强调色只点缀,不大面积铺。
- 概念锚点:任何取舍只问"符不符合概念 A?"。不加博客/CMS/主题切换/炫技动效(YAGNI)。
- **站位:信誉打底 + operator 加分。** 4-5 年业务前端交付可信度是地基,AI operator 是差异化加分,绝不写成"放弃稳定前端/轻视写码"。研究类项目诚实标注状态,不包装成成品交付。
- 每个 Task 结束跑 `bun run build` 必须通过,然后 `git commit`。

---

## Task 1:Design Token 地基

**Files:**
- Modify: `src/index.css`(定义 `:root` CSS 变量 + 全局深色底)
- Modify: `src/App.css`(把后续要用的颜色/间距引用改为 `var(--...)`,本 Task 先建变量,不强求全量替换)

- [ ] **Step 1:在 `src/index.css` 的 `:root` 写入 token 变量**

```css
:root {
  /* color */
  --bg: #0B0B0E;
  --bg-elev: #141418;          /* 卡片/抬升面 */
  --ink: #F5F3EF;              /* 主文字 火白 */
  --ink-dim: #A9ABB0;         /* 次文字 灰白 */
  --accent: #39FF8B;          /* 主强调 琴荧绿 */
  --accent-2: #22D3EE;        /* 副强调 电青 */
  --line: rgba(255,255,255,0.08); /* 分隔线 */
  /* spacing scale */
  --s1: 4px; --s2: 8px; --s3: 12px; --s4: 16px; --s5: 24px; --s6: 40px; --s7: 64px;
  /* type */
  --font-mono: 'JetBrains Mono', ui-monospace, SFMono-Regular, Menlo, monospace;
  --font-display: 'Space Grotesk', system-ui, -apple-system, sans-serif;
  --font-body: system-ui, -apple-system, 'PingFang SC', sans-serif;
  color-scheme: dark;
}
html, body { background: var(--bg); color: var(--ink); }
```

- [ ] **Step 2:引入字体**

在 `index.html` `<head>` 加 Google Fonts(JetBrains Mono + Space Grotesk),或在 `index.css` 顶部 `@import`。二选一,优先 `index.html` `<link>`(性能更好)。若离线环境取不到,降级到系统 `ui-monospace` / `system-ui`,不阻塞。

- [ ] **Step 3:验证**

Run: `bun run build`
Expected: 构建通过,无 TS 报错。本地 `bun run dev` 打开应见整页背景变为近黑 `#0B0B0E`。

- [ ] **Step 4:Commit**

```bash
git add src/index.css index.html
git commit -m "feat(tokens): add dark console design tokens and fonts"
```

---

## Task 2:Hero 重建

**Files:**
- Modify: `src/App.tsx`(hero 区块 JSX:约 `eyebrow` / 大标题 / 副文案 / 按钮 / 三个 stat 那一段)
- Modify: `src/App.css`(hero 相关样式)

**目标产出:** Hero 体现人设 + 黑客兔 mark + 四支柱微缩 + crew 状态行。

- [ ] **Step 1:主标题(第一人称人设句)**

文案逐字:
> **4-5 年前端交付** + 我用**第一性原理**思考、指挥一队 **AI 智能体**,把活干得更快更稳。

"4-5 年前端交付""第一性原理""AI 智能体"用 `--accent` 高亮。
**站位:信誉打底 + operator 加分**——先立 4-5 年业务前端交付可信度,operator 是加分,
不否定写码、不显得放弃稳定前端(遵守在案决策,见 spec 第 2 节注)。

- [ ] **Step 2:黑客兔 mark**

加一个自有 mark(纯 CSS/SVG/等宽 ASCII 三选一,优先轻量 inline SVG 或等宽 ASCII):
```
(\(\
(•ᴥ•)
/ づ
```
放 hero 角落,`--font-mono`,`--accent` 描边/着色。全站复用同一 mark 组件。

- [ ] **Step 3:四支柱微缩**

一行小标签:`健康 · 现金流 · 认知 · AI`(`--font-mono`,`--ink-dim`,分隔点用 `--accent` 弱化色)。这是用户世界观,体现"脑子"。

- [ ] **Step 4:crew 状态行**

加一行终端感状态:`> crew: 3 agents online`(`--font-mono`,`--accent`)。呼应 operator 人设。

- [ ] **Step 5:按钮 + 副文案**

保留"查看项目 / 下载简历"两个 CTA,但样式改为深色控制台风(描边按钮 + `--accent` 主按钮)。副文案改第一人称。

- [ ] **Step 6:验证 + Commit**

Run: `bun run build`(通过)→ `bun run dev` 截图 hero。
```bash
git add src/App.tsx src/App.css
git commit -m "feat(hero): rebuild hero as operator persona with hackrabbit mark"
```

---

## Task 3:🐇 My AI Crew(王牌 · 新增区块)

**Files:**
- Modify: `src/App.tsx`(新增一个 `<section id="crew">`,放在 hero 之后、projects 之前;新增一个 `crew` 数据数组)
- Modify: `src/App.css`(crew 区块样式)

**目标产出:** 展示"我怎么指挥 AI 智能体干活" —— 这是全站差异化核心,没有任何前端这样展示自己。

- [ ] **Step 1:新增 `crew` 数据数组**(放在 `projects` 数组附近)

至少 3 条真实工作流,结构:
```ts
const crew = [
  {
    agent: 'Claude Code',
    role: '规划 / 大段重构 / code review',
    flow: '我用第一性原理把问题拆成 spec,它产出实现计划,我 review 后再让它改大段代码。',
  },
  {
    agent: 'Codex 桌面版',
    role: '执行 / GUI / 截图 / 高频重复',
    flow: '我把计划交给它执行落地,浏览器验证和重复活由它跑,我只验收 diff。',
  },
  {
    agent: 'OpenSpec 工作流',
    role: '对齐规范,防 vibe coding 跑偏',
    flow: '每次开工先 /opsx:propose 生成规范,再 apply 实现,先对齐后动手。',
  },
]
```
> Codex 执行时:用真实、属实的工作流描述,不夸大。这是给招聘方看的可信证据。

- [ ] **Step 2:渲染 crew 区块**

标题区:`eyebrow = My AI Crew`,大标题 = 一句话点题(例:"我不是一个人写代码 —— 我管理一队 AI 智能体")。
下面渲染 `crew.map`,每条做成一张"控制台卡片":agent 名(`--font-mono` + `--accent`)、role、flow。可选加 `> status: online` 装饰行。

- [ ] **Step 3:导航加锚点**

顶部导航加一项"AI Crew"指向 `#crew`。

- [ ] **Step 4:验证 + Commit**

Run: `bun run build`(通过)→ 截图 crew 区块。
```bash
git add src/App.tsx src/App.css
git commit -m "feat(crew): add My AI Crew section as the flagship differentiator"
```

---

## Task 4:项目区改写 + 删空假窗口

**Files:**
- Modify: `src/App.tsx`(`projects` 区块:删 `project-visual` 假窗口;每卡按"方向→协作→结果"叙事)
- Modify: `src/App.css`(删 `.project-visual` `.visual-window` `.visual-lines` 等相关样式;卡片改深色控制台风)

- [ ] **Step 1:删除空假浏览器窗口装饰**

移除 JSX 中 `<div className="project-visual" ...>...</div>` 整块(含 `visual-bar`/`visual-content`/`visual-lines`),并删除 `App.css` 里对应样式。这是当前唯一把页面拉到"半成品/模板"档的元素。

- [ ] **Step 2:每个项目卡改"人 × agent"叙事**

把现有 `summary` 等规格罗列,重组为三段(可加到数据或 JSX):
1. **方向** —— 我用第一性原理怎么拆这个问题 / 为什么做
2. **协作** —— 我与哪些 agent 怎么分工(若该项目当时未用 agent,则写"我怎么独立攻克难点",保持第一人称,不要硬编)
3. **结果** —— 交付了什么、可演示/可投递的产出 + repo 链接(已有 `repo` 字段保留)

> 诚实优先:onchain-research / 数字亲人 / AI 音乐 有真实 repo,突出"可复核""grounding 约束"这类有判断力的点。

- [ ] **Step 3:卡片视觉改深色控制台风**

卡片底 `--bg-elev`,描边 `--line`,标签/stack 用 `--font-mono`,强调点用 `--accent`。删掉原 `mint/amber/rose/sky/blue` 彩色 tone,统一到深色 + 单一强调色体系(克制)。

- [ ] **Step 4:验证 + Commit**

Run: `bun run build`(通过)→ 截图项目区,确认无灰色空块。
```bash
git add src/App.tsx src/App.css
git commit -m "feat(projects): reframe as human×agent narrative, remove fake window"
```

---

## Task 5:Skill Map / 经历 / 联系 转第一人称

**Files:**
- Modify: `src/App.tsx`(skill map、experience、contact 区块文案)
- Modify: `src/App.css`(按需对齐深色 token)

- [ ] **Step 1:Skill Map 每项加"我怎么用 AI 放大它"**

保留四类能力,每类补一行 `--font-mono` 的小字:我如何用 agent 放大这项能力(例:中后台 → "我让 agent 生成表单脚手架,我审业务逻辑")。

- [ ] **Step 2:经历转第一人称**

把 `caseStudies` / 经历区的"负责/参与"改成第一人称有判断的句子。保留公司、时间、脱敏原则。

- [ ] **Step 3:联系区**

保留邮箱 `hackrabbit6@gmail.com` / GitHub `hackrabbit6`,文案改第一人称("我在找…我能交付…")。底部放黑客兔 mark 收尾。

- [ ] **Step 4:全站散值清扫**

grep `App.css` 里残留的硬编码 hex 色值与非阶梯 px 间距,替换为 `var(--...)`。
Run: `grep -nE '#[0-9a-fA-F]{3,6}' src/App.css` —— 除 token 定义外应基本为空。

- [ ] **Step 5:验证 + Commit**

Run: `bun run build`(通过)+ `bun run lint`(通过)。
```bash
git add src/App.tsx src/App.css
git commit -m "feat(content): first-person voice across skills, experience, contact"
```

---

## Task 6:3D 背景收敛或移除

**Files:**
- Modify: `src/ThreeBackdrop.tsx` 或 `src/App.tsx`(引用处)

- [ ] **Step 1:二选一(不要无限调)**

- **方案 A(优先,省事更贵):** 直接移除 `ThreeBackdrop`,hero 用纯深色 + 细微网格/噪点背景。删 `three` 依赖引用。
- **方案 B:** 保留但收敛成"有意图"的版本 —— 改成稀疏节点网络(呼应 agent/网络),颜色降到 `--accent` 极低透明度,绝不抢文字。

默认走 A;若 Codex 判断 B 能快速做到克制且加分,可走 B,但**只调一次,不反复**。

- [ ] **Step 2:验证 + Commit**

Run: `bun run build`(通过)。若移除了 three,确认 `package.json` 仍可正常构建。
```bash
git add -A
git commit -m "refactor(backdrop): converge 3D background to intentional/minimal"
```

---

## Task 7:验收(对照完成清单)

**不写代码,只验收。** 逐项核对 spec 第 5 节完成清单:

- [ ] Hero 人设句 + 黑客兔 mark 上线
- [ ] My AI Crew 区块有 ≥3 个真实 agent 工作流
- [ ] 4+ 项目全部转成"人 × agent"叙事,空假窗口已删
- [ ] Design token 落地为 CSS 变量,全站无散值(`grep` 清过)
- [ ] 全站文案第一人称,无"负责/参与"式规格表句
- [ ] `bun run build` 通过 + `bun run lint` 通过
- [ ] 桌面 + 移动两端截图自检无硬伤(更新 `screenshots/`)
- [ ] 全部勾完 → 交回 Claude Code review → 通过后强制 deploy,**不再开新一轮**

- [ ] **截图归档**

把桌面 + 移动截图存到 `screenshots/`,覆盖旧的 `desktop-3d.png` / `mobile-3d.png` 或新增 `*-concept-a.png`。

- [ ] **最终 Commit**

```bash
git add -A
git commit -m "chore: concept A redesign complete, verified against done-checklist"
```

---

## Self-Review(Claude Code 编写时已核对)

- Spec 各节均有对应 Task(token→T1、hero→T2、crew→T3、projects→T4、skill/经历/联系→T5、3D→T6、完成清单→T7)✅
- 无 TODO/占位:每步给了具体文案、变量值、命令 ✅
- 命名一致:token 变量名(`--bg`/`--ink`/`--accent`…)全计划统一 ✅
