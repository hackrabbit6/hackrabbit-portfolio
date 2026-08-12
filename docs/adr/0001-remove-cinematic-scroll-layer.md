---
status: accepted
---

# 移除 cinematic 滚动层

本仓库最初以 `hackrabbit-cinematic-v2` 为名建立，用三个 commit（`3e67009`、`79e8d3d`、`ef0b673`）专门搭了一层电影感滚动：Lenis 平滑滚动（`duration: 1.1`）、Crew 章节的 `pin + scrub`（消耗 1200px 滚动距离）、Manifesto 的全段视差。现在把这一层整体拆掉，只保留 Fade / Translate / Image Reveal / Subtle Scale 四类进场动画，以及 Selected Work 的 sticky 标题。

原因是这个站的读者是招聘方与技术面试官——一群会用触控板快速滚动扫描内容的人。平滑滚动库与 pin/scrub 对他们是阻力而非质感，与本站锁定的 art direction（Editorial × Developer × Product，其中「开发者网站的克制」是核心）方向相反。同时移除 Lenis 让页面回到原生滚动，少三个运行时依赖，移动端卡顿风险一并消失。

## 保留了什么

`Work.tsx` 中 `.work-heading` 的 pin 保留。它是 sticky 标题，不额外消耗滚动距离，属于杂志式排版手法，不构成滚动劫持。

## 后果

仓库名 `hackrabbit-cinematic-v2` 与 `package.json` 的 `name` 字段此后不再描述这个站的实际形态。未来读到这两处的人会以为缺了什么——没有，是故意拆的。
