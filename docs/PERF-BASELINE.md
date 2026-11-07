# 性能基线

给「夜间地图」这套视觉留一条可对比的基线。视觉层每加一次效果，都可能在首屏或 3D 启动上留下代价；
没有基线就只能靠感觉，靠感觉的结果通常是慢慢变慢而没人发现。

本文件只记**测量方法**与**结论/预算**。数字过时了就地更新，不要另开一份。

## 怎么测（三条规矩，不遵守数字就没有意义）

1. **必须测生产构建**，不要测 dev：

   ```bash
   bun run build
   bun run preview     # http://localhost:4322
   ```

   dev 服务器不打包、要发上百个模块请求，实测会把 3D 启动整体放大约 **5 倍**
   （同一份代码：dev 约 4.6 s，preview 约 0.5–0.9 s）。用 dev 的数字下结论会得出错误结论。

2. **关缓存**（DevTools 的 Disable cache，或 CDP `Network.setCacheDisabled`）。
   第二次加载的 `transferSize` 是 0，体积统计会变成几十字节。

3. **多跑几次取范围，不要用单次数字**。同一构建连续三次可以差一倍（机器负载、其他进程）；
   看中位数与范围，不看单点。

采集脚本（在文档开始执行前注入）：

```js
window.__perf = { lcp: 0, cls: 0, webglReady: null }
new PerformanceObserver((l) => {
  for (const e of l.getEntries()) window.__perf.lcp = Math.round(e.startTime)
}).observe({ type: 'largest-contentful-paint', buffered: true })
new PerformanceObserver((l) => {
  for (const e of l.getEntries()) if (!e.hadRecentInput) window.__perf.cls += e.value
}).observe({ type: 'layout-shift', buffered: true })
// 3D 就绪时间：data-webgl 变成 on 的时刻
const timer = setInterval(() => {
  const el = document.querySelector('[data-night-map]')
  if (el && el.dataset.webgl === 'on' && window.__perf.webglReady === null) {
    window.__perf.webglReady = Math.round(performance.now())
    clearInterval(timer)
  }
}, 50)
```

## 2026-11-03 的基线

环境：MacBook（Intel i5-1038NG7，核显，16GB）、**本地 preview**、缓存禁用、各跑三次。

| 指标 | 桌面 1440×900 | 手机 390×844 |
|---|---|---|
| LCP | 0.4–0.9 s | 0.5–0.9 s |
| CLS | 0 | 0 |
| 首屏传输总量 | 172 KB | 172 KB |
| 其中 JS | 143 KB（`night-map` 140 KB gzip） | 同 |
| 其中 CSS | 6 KB | 6 KB |
| 其中图片 | 23 KB | 23 KB |
| 从 load 到开始加载 3D | 5–44 ms | 同量级 |
| **3D 就绪（`data-webgl=on`）** | **1.7–2.9 s** | 1.7–2.9 s |

注意：本地 preview 没有网络延迟，LCP 只反映解析与渲染，**不代表线上**（真实网络 + 真实 CDN）。
线上部署平台 2026-11-07 从 Netlify 迁到 Cloudflare Pages（ADR 0005），CDN 不同则同一份产物的线上时间也不同。

## 3D 启动里各阶段的实际占比

在生产构建上插入临时 `performance.now()` 埋点量出来的（量完即撤，不留在代码里）：

| 阶段 | 耗时 |
|---|---|
| 模块求值（three 已下载，解析 + 初始化） | 20–50 ms |
| `WebGLRenderer` 创建（上下文） | 75–160 ms |
| 地形等高线 | 40–60 ms |
| 夜空虚尘 | 9–15 ms |
| 路线 + 八个地标 | 30–50 ms |
| 化身 | ~5 ms |
| **首帧渲染（含着色器编译）** | **310–500 ms** |
| 合计 | **0.5–0.9 s** |

结论：**场景构建只占约 0.15 s，真正的成本是 three 的解析、WebGL 上下文创建和首帧着色器编译。**
所以「先把地形和当前地标建出来、其余地标延后」这类渐进式优化没有意义——省不到 0.2 s，
却要动状态机与拾取逻辑。同理，`requestIdleCallback` 的超时（1500 ms）在线上构建里几乎没等过：
实测从 `load` 到开始拉 `night-map` 只有 5–44 ms，浏览器很快就进入空闲。不要为了「让地图早点出现」
去调这个值。

## 预算（超出就要在 PR 里说明理由）

| 项 | 上限 | 现状 |
|---|---|---|
| LCP（本地 preview） | 2.5 s | 0.4–0.9 s |
| CLS | 0.1 | 0 |
| 首屏传输总量 | 250 KB | 172 KB |
| `night-map` chunk（gzip） | 150 KB | 138 KB |
| 3D 就绪（本机核显） | 3.5 s | 1.7–2.9 s |

`night-map` 是 3D 的唯一大件，它涨通常意味着加了几何或新增依赖；涨过 150 KB 先看是不是引入了新库。

## 三条降级路径不适用本表

无 WebGL、`prefers-reduced-motion`、触摸设备各有独立路径（见 `NIGHT-MAP.md`），
它们不加载 three，本表的 3D 指标对它们没有意义；这三条路径要单独确认「内容完整、无报错」。

## 复测检查清单

- [ ] `bun run build` 与 `bun run lint` 全绿之后再测
- [ ] 用 preview，不用 dev
- [ ] 缓存禁用
- [ ] 桌面与手机各测三次，记范围
- [ ] 3D 就绪变慢通常是新增几何/材质（着色器变多），不是新增 CSS
- [ ] 数字有变化就更新本文件的表，并把日期改成当天
