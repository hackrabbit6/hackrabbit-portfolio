import type { StopKey } from './night-map'

// 地标的标注信息（NIGHT-MAP.md「排版与地图的耦合」）。
// 单独一个文件是为了让 .astro / .tsx 的 SSR 端能读到它 —— night-map.ts 里有 three，
// 组件只 import type，不会被它拖进客户端包。
export type StopMeta = {
  /** 标注编号：与首页区块顺序一致（00 是首屏全景） */
  code: string
  name: string
  /** 方位：按 night-map.ts 里地标坐标算出的 16 向，北 = 地图深处（-z）。
   *  改地标坐标要一起改这里，否则标注会指错方向。 */
  bearing: string
}

export const STOP_META: Record<StopKey, StopMeta> = {
  start: { code: '00', name: '起点', bearing: 'S' },
  workshop: { code: '01', name: '工坊', bearing: 'WSW' },
  lab: { code: '02', name: '黑兔实验室', bearing: 'NE' },
  tower: { code: '03', name: '作品塔', bearing: 'NNW' },
  pillars: { code: '04', name: '四柱', bearing: 'NNE' },
  stairs: { code: '05', name: '升级台阶', bearing: 'NNW' },
  desk: { code: '06', name: '台灯工作台', bearing: 'N' },
  portal: { code: '07', name: '传送门', bearing: 'N' },
}
