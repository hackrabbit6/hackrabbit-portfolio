import type { StopKey } from '../lib/night-map'
import { STOP_META } from '../lib/map-stops'

/**
 * 区块标题前的标注体：编号 · 地标名 · 方位，外加一条指向该地标的引线。
 * 样式在 tokens.css（.map-mark / .map-leader），引线坐标由 NightMap.astro 每帧写进这个
 * 元素上的 --leader-* 变量（两个子元素继承）。读起来像地图上贴的一张注记，
 * 取代原来的圆角标题块（NIGHT-MAP.md「排版与地图的耦合」）。
 */
export function MapMark({ stop }: { stop: StopKey }) {
  const mark = STOP_META[stop]
  return (
    <p className="map-mark" data-map-leader>
      <span className="map-mark-code">{mark.code}</span>
      <span className="map-mark-sep">·</span>
      <span>{mark.name}</span>
      <span className="map-mark-sep">·</span>
      <span className="map-mark-bearing">{mark.bearing}</span>
      {/* 引线两段：先水平拉到正文栏右边界（不穿标题），再斜拉到地标。纯装饰。 */}
      <span className="map-leader" aria-hidden="true" />
      <span className="map-leader-arm" aria-hidden="true" />
    </p>
  )
}
