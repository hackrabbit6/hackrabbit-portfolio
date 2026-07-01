---
type: spec
topic: cinematic-v2 综合个人站 · Phase 1 首页
created: 2026-07-01
status: approved
supersedes-visual-of: concept-a-v1(保留为 tag,不删)
---

# 综合个人站 cinematic-v2 · Phase 1:电影感首页

## 0. 背景

concept-a v1(深色终端 operator 作品集)已上线级别、tag 固化为 `concept-a-v1` 保留。
用户目标升级:不再是"个人说明页",而是一个会长期生长的**综合个人站** ——
博客(自写)、GitHub 项目展示、自媒体文章/视频枢纽,且首页要**获奖级动效**
(电影感滚动:3D + 视差)。

本 spec 只覆盖 **Phase 1 = 电影感首页**(门面)。博客/项目/媒体各自后续独立 spec。

## 1. 整体架构与分期

**技术地基:**
- **Astro** —— 内容壳。内容页(未来博客)近零 JS、秒开、SEO 友好。
- **React island** —— 只在首页加载重型交互/3D,其余页面保持轻。
- **Lenis**(~3kB)—— 全局惯性平滑滚动("高级感"的来源)。
- **GSAP + ScrollTrigger** —— 视差(分层速度差)、pinned 钉住、滚动触发揭示。
- **React Three Fiber + GLSL shader** —— 克制的 WebGL hero(流体/粒子暗场,非重型 3D 世界)。
- 部署:**Netlify**(Astro 静态输出免 adapter;若日后要 SSR 再加 `@astrojs/netlify`)。
  域名 `hackrabbit.cc.cd` 绑定问题另行处理,不属本期实现范围。

**分期(每期独立 spec → Codex 执行 → Claude Code review):**
- **Phase 1**(本 spec):电影感首页。
- Phase 2:博客(Astro 内容集合 + MDX)。
- Phase 3:GitHub 项目展示。
- Phase 4:自媒体枢纽(文章/视频链接)。

**代码位置:** 新分支 `cinematic-v2`。concept-a 分支 + `concept-a-v1` tag 不动。
Astro 是全新脚手架,Phase 1 会重建项目结构(见 Task 计划),旧 Vite 版内容作为文案来源复用。

## 2. 视觉方向:进化黑客兔(保留身份,升级工艺)

保留 concept-a 的**身份与文案**(hackrabbit mark、第一性原理、operator 人设、四支柱、
信誉打底+operator 加分的站位),但把"平面终端绿"升级为**深色电影感**:

- 深色底延续(`#0B0B0E` 系),但引入景深:分层、模糊、发光、细腻渐变。
- 强调色以 concept-a 的琴荧绿 `#39FF8B` 为基,可微调到更"电影"的版本(实现时定 1 个,不反复)。
- 字体保留等宽(operator 身份)+ 标题字,升级排版尺度与留白。
- 新增 design token:景深层级、blur、glow、动画时长/缓动曲线。

## 3. 滚动叙事:7 幕

Lenis 全局惯性滚动;GSAP ScrollTrigger 驱动每幕的分层速度差 / pinned / 文字揭示;
WebGL hero 的 shader uniforms 绑定滚动进度。

1. **Hero** —— shader 流体/粒子暗场(霓虹绿点缀)+ 黑客兔 mark + 人设句
   "4-5 年前端交付 + 我用第一性原理思考、指挥一队 AI 智能体,把活干得更快更稳。" + 滚动提示。
   载入时文字上浮揭示。
2. **第一性原理宣言** —— 视差文字,四支柱(健康/现金流/认知/AI)错位浮入。
3. **My AI Crew** —— pinned 区块,agent 卡(Claude Code / Codex / OpenSpec)随滚动逐个推入。
4. **精选作品** —— pinned 滚动,项目卡带景深/视差(内容复用 concept-a 的 5 个项目:方向/协作/结果)。
5. **我能交付什么** —— 能力交错揭示 + "agent boost" 行。
6. **经历** —— 时间线随滚动点亮(4 段经历复用)。
7. **联系 / footer** —— mark + 邮箱 `hackrabbit6@gmail.com` + GitHub `hackrabbit6`
   + 给 Phase 2-4 留"博客 / 项目 / 媒体 · 即将上线"入口占位。

> 内容一律复用 concept-a 的第一人称、有观点文案(诚实原则:研究类项目不包装成成品)。

## 4. 护栏(获奖级 vs 永远调不完 的分界线,写死)

- **`prefers-reduced-motion`**:关闭 Lenis 惯性 + 重动画,退化为静态可读版(必须验证)。
- **移动端**:WebGL hero 降级为静态渐变/图,视差减弱,保证秒开(必须验证)。
- **性能预算**:Lighthouse 桌面 performance ≥ 90、移动 ≥ 80;首页 3D 走 lazy island,
  非首页内容页近零 JS。
- **无障碍**:语义 HTML、键盘可达、图片 alt、焦点可见。
- **克制**:动效服务叙事,不炫技堆砌;强调色只点缀。

## 5. ✅ Phase 1 完成清单(客观验收,勾完即停,不再开新一轮)

- [ ] Astro + React island 项目结构跑通,`astro build` 通过
- [ ] Lenis 全局惯性滚动生效
- [ ] GSAP ScrollTrigger 视差(分层速度差)+ 至少 2 处 pinned 幕生效
- [ ] WebGL shader hero 跑起来(桌面),移动端降级为静态
- [ ] 7 幕滚动叙事全部完成,内容复用 concept-a 文案
- [ ] `prefers-reduced-motion` 退化版验证通过
- [ ] 移动端降级验证通过(无卡顿、无溢出)
- [ ] Lighthouse 桌面 ≥ 90 / 移动 ≥ 80(截报告)
- [ ] build + lint 通过
- [ ] 桌面 + 移动截图无硬伤,存 `screenshots/`
- [ ] 勾完 → 交回 Claude Code review → 通过后处理域名 + 部署,**不再开新一轮**

## 6. 不做(YAGNI · 防循环)

- ❌ 本期不做博客/项目/媒体的真实内容系统(留占位入口,Phase 2-4 再做)。
- ❌ 不做沉浸式 3D 世界(已否决:工程量大、拖累内容站与招聘方)。
- ❌ 不做主题切换。
- ❌ 域名绑定不在本期(收尾时单独处理)。
- ❌ 勾完清单后不许"再调一版"。
