# 性能基线

给「夜间地图」这套视觉留一条可对比的基线。视觉层每加一次效果，都可能在首屏或 3D 启动上留下代价；
没有基线就只能靠感觉，靠感觉的结果通常是慢慢变慢而没人发现。

本文件只记**测量方法**与**结论/预算**。数字过时了就地更新，不要另开一份。

## 怎么测

测**生产构建**，不要测 dev（dev 有 HMR 与未压缩产物）：

```bash
bun run build
bun run preview      # 默认 http://localhost:4322
```

然后用浏览器 DevTools 或脚本采集下面四项。脚本版（Playwright/ego-browser 之类都能用）：

```js
// 在文档开始执行前注入
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

注意两件事，否则数字会骗人：

- **关掉缓存**（DevTools 的 Disable cache，或 CDP `Network.setCacheDisabled`）。第二次加载的 `transferSize` 是 0。
- **本地 preview 没有网络延迟**。这里的 LCP 只反映渲染与解析，不代表线上（Netlify + 真实网络）。

## 2026-11-03 的基线

环境：MacBook（Intel i5-1038NG7，核显，16GB）、本地 preview、缓存禁用、各跑两次取稳定值。

| 指标 | 桌面 1440×900 | 手机 390×844 |
|---|---|---|
| TTFB | 10 ms | 17 ms |
| DOMContentLoaded | 0.8–1.0 s | 0.6 s |
| LCP | 0.6–1.5 s | 0.6 s |
| CLS | 0 | 0 |
| 首屏传输总量 | 172 KB | 172 KB |
| 其中 JS | 143 KB（`night-map` 140 KB + client 少量） | 同 |
| 其中 CSS | 6 KB | 6 KB |
| 其中图片 | 23 KB | 23 KB |
| **3D 就绪（`data-webgl=on`）** | **4.8–5.2 s** | 4.8 s |

3D 就绪时间与像素比无关（DPR 1 与 2 差 0.4 s 以内），瓶颈在 WebGL 上下文创建与着色器编译，
不在填充率。这台机器是核显，独立显卡或 Apple Silicon 会明显更快——**换机器要重测这一行**。

## 预算（超出就要在 PR 里说明理由）

| 项 | 上限 | 现状 |
|---|---|---|
| LCP（本地 preview） | 2.5 s | 0.6–1.5 s |
| CLS | 0.1 | 0 |
| 首屏传输总量 | 250 KB | 172 KB |
| `night-map` chunk（gzip） | 150 KB | 138 KB |
| 3D 就绪 | 6 s（本机基准） | 4.8–5.2 s |

## 结论

- **首屏不被 3D 阻塞**：3D 通道在 `requestIdleCallback` 之后才加载，LCP（文字与标题）在它之前就已发生。
  这是夜间地图能挂在全站固定背景上的前提，改加载策略前先看这一行。
- **3D 启动是本机的主要开销**：约 5 s。期间场景构建是同步代码，会造成一次主线程卡顿；
  地图以 `opacity` 过渡淡入，所以观感上是"慢慢亮起来"，不是白屏。
- 无 WebGL / `prefers-reduced-motion` / 触摸设备各有一条降级路径（见 `NIGHT-MAP.md`），
  这些路径不加载 3D，本表不适用。

## 复测检查清单

- [ ] `bun run build` 与 `bun run lint` 全绿之后再测
- [ ] 缓存禁用
- [ ] 桌面与手机各测一次，手机确认无横向溢出
- [ ] 3D 就绪时间单独看：它变慢通常是新增几何或着色器，不是新增 CSS
- [ ] 数字有变化就更新本文件的表，并把日期改成当天
