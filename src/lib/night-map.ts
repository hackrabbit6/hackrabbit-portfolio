// 「兔子的夜间地图」3D 场景（docs/NIGHT-MAP.md）。
// 全站共用一张地图：每个地标对应一块内容，化身白兔跟着当前地标跳过去。
// 本模块只负责画面；滚动位置、页面跳转、DOM 提示都由 NightMap.astro 处理。
import * as THREE from 'three'

export const STOP_KEYS = [
  'start',
  'workshop',
  'lab',
  'tower',
  'pillars',
  'stairs',
  'desk',
  'portal',
] as const
export type StopKey = (typeof STOP_KEYS)[number]

export type NightMapOptions = {
  initial: StopKey
  reduceMotion: boolean
  coarse: boolean
}

export type NightMapHandle = {
  setStop: (key: StopKey) => void
  /** 子页面绕地标环视，-1 … 1 */
  setOrbit: (amount: number) => void
  setParallax: (x: number, y: number) => void
  /** 用归一化设备坐标（-1 … 1）拾取地标 */
  pick: (nx: number, ny: number) => StopKey | null
  setHover: (key: StopKey | null) => void
  dispose: () => void
}

const NIGHT = 0x08090c
const LAMP = 0xf2b266
const HEX = 0x5fbfae
const LINE = 0xd8d6d0

type Stop = { p: THREE.Vector3; yaw: number; rabbit: THREE.Vector3 }

// 地标沿首页区块顺序排成一条蜿蜒的路线（z 越小越远）。
const STOPS: Record<StopKey, Stop> = {
  start: { p: new THREE.Vector3(0, 0, 10), yaw: 0, rabbit: new THREE.Vector3(1.1, 0, 0.9) },
  workshop: { p: new THREE.Vector3(-6, 0, 2), yaw: -0.5, rabbit: new THREE.Vector3(-2.4, 0, 1.8) },
  lab: { p: new THREE.Vector3(6, 0, -5), yaw: 0.5, rabbit: new THREE.Vector3(-2.4, 0, 1.4) },
  tower: { p: new THREE.Vector3(-6, 0, -12), yaw: -0.45, rabbit: new THREE.Vector3(-2.0, 0, 1.6) },
  pillars: { p: new THREE.Vector3(6, 0, -19), yaw: 0.45, rabbit: new THREE.Vector3(0.2, 0, 2.4) },
    // 化身站在最高一级台阶上：现在这一级。
  stairs: { p: new THREE.Vector3(-6, 0, -26), yaw: -0.4, rabbit: new THREE.Vector3(0, 2.25, -1.8) },
  // 工作台照头像布置：镜头从右前方看，化身侧脸对着笔记本。
  desk: { p: new THREE.Vector3(6, 0, -33), yaw: 0.6, rabbit: new THREE.Vector3(0.45, 1.12, 0.05) },
  portal: { p: new THREE.Vector3(0, 0, -41), yaw: 0, rabbit: new THREE.Vector3(-2.2, 0, 1.2) },
}

const smooth = (a: number, b: number, x: number) => {
  const t = Math.max(0, Math.min(1, (x - a) / (b - a)))
  return t * t * (3 - 2 * t)
}

// 起伏地形，地标周围压平，让建筑稳稳落地。
const height = (x: number, z: number) => {
  const h =
    1.5 * Math.sin(x * 0.23) * Math.cos(z * 0.19) +
    0.7 * Math.sin(x * 0.55 + z * 0.37) +
    0.35 * Math.sin(z * 0.9 - x * 0.31) +
    0.9 * Math.cos((x + z) * 0.11)
  let f = 1
  for (const key of STOP_KEYS) {
    const s = STOPS[key].p
    f = Math.min(f, smooth(2.8, 6.2, Math.hypot(x - s.x, z - s.z)))
  }
  return h * f
}

const turn = (a: number, b: number, k: number) => {
  const d = ((((b - a + Math.PI) % (Math.PI * 2)) + Math.PI * 2) % (Math.PI * 2)) - Math.PI
  return a + d * k
}

export function bootNightMap(canvas: HTMLCanvasElement, options: NightMapOptions): NightMapHandle {
  const { reduceMotion, coarse } = options
  const disposables: Array<{ dispose: () => void }> = []
  const track = <T extends { dispose: () => void }>(item: T) => {
    disposables.push(item)
    return item
  }

  const renderer = new THREE.WebGLRenderer({ canvas, antialias: !coarse, powerPreference: 'low-power' })
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, coarse ? 1.25 : 2))
  renderer.setClearColor(NIGHT, 1)

  const scene = new THREE.Scene()
  scene.fog = new THREE.FogExp2(NIGHT, 0.03)
  const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 220)

  scene.add(new THREE.AmbientLight(0xffffff, 0.6))
  scene.add(new THREE.HemisphereLight(0xc4cbdd, 0x1c1712, 1.3))
  const moon = new THREE.DirectionalLight(0xc9d2e8, 1.4)
  moon.position.set(-6, 12, 8)
  scene.add(moon)

  // ── 地形：等高线式横线 ──────────────────────────────────────────
  {
    const pts: number[] = []
    const dz = coarse ? 1.1 : 0.55
    const dx = coarse ? 0.7 : 0.45
    for (let z = 18; z > -60; z -= dz) {
      let px = 0
      let py = 0
      for (let x = -30; x <= 30; x += dx) {
        const y = height(x, z) - 0.05
        if (x > -30) pts.push(px, py, z, x, y, z)
        px = x
        py = y
      }
    }
    const geo = track(new THREE.BufferGeometry())
    geo.setAttribute('position', new THREE.Float32BufferAttribute(pts, 3))
    const mat = track(new THREE.LineBasicMaterial({ color: 0x8e939e, transparent: true, opacity: 0.3 }))
    scene.add(new THREE.LineSegments(geo, mat))
  }

  // ── 夜空里的微尘 ────────────────────────────────────────────────
  const dust = (() => {
    const n = coarse ? 500 : 1300
    const a = new Float32Array(n * 3)
    for (let i = 0; i < n; i += 1) {
      a[i * 3] = (Math.random() - 0.5) * 64
      a[i * 3 + 1] = Math.random() * 22
      a[i * 3 + 2] = 22 - Math.random() * 80
    }
    const geo = track(new THREE.BufferGeometry())
    geo.setAttribute('position', new THREE.BufferAttribute(a, 3))
    const pts = new THREE.Points(
      geo,
      track(new THREE.PointsMaterial({ color: 0xa3a6ae, size: 0.07, transparent: true, opacity: 0.7 })),
    )
    scene.add(pts)
    return pts
  })()

  // ── 路线：灰色虚线是全程，暖色实线是已经走过的部分 ────────────────
  const curve = new THREE.CatmullRomCurve3(
    STOP_KEYS.map((k) => STOPS[k].p.clone()),
    false,
    'centripetal',
  )
  const ROUTE_N = 480
  const routePts = curve.getSpacedPoints(ROUTE_N).map((p) => new THREE.Vector3(p.x, height(p.x, p.z) + 0.06, p.z))
  const stopIndex: Record<StopKey, number> = {} as Record<StopKey, number>
  for (const k of STOP_KEYS) {
    let best = 0
    let bestD = Infinity
    routePts.forEach((p, i) => {
      const d = Math.hypot(p.x - STOPS[k].p.x, p.z - STOPS[k].p.z)
      if (d < bestD) {
        bestD = d
        best = i
      }
    })
    stopIndex[k] = best
  }
  {
    const geo = track(new THREE.BufferGeometry().setFromPoints(routePts))
    const line = new THREE.Line(
      geo,
      track(new THREE.LineDashedMaterial({ color: 0x8e939e, dashSize: 0.35, gapSize: 0.3, transparent: true, opacity: 0.55 })),
    )
    line.computeLineDistances()
    scene.add(line)
  }
  const walked = (() => {
    const geo = track(new THREE.BufferGeometry().setFromPoints(routePts.map((p) => p.clone().setY(p.y + 0.01))))
    const line = new THREE.Line(geo, track(new THREE.LineBasicMaterial({ color: LAMP, transparent: true, opacity: 0.85 })))
    geo.setDrawRange(0, 1)
    scene.add(line)
    return geo
  })()

  // ── 地标 ───────────────────────────────────────────────────────
  const glowTexture = (() => {
    const c = document.createElement('canvas')
    c.width = c.height = 128
    const x = c.getContext('2d')
    if (x) {
      const g = x.createRadialGradient(64, 64, 0, 64, 64, 64)
      g.addColorStop(0, 'rgba(242,178,102,1)')
      g.addColorStop(0.25, 'rgba(242,178,102,0.45)')
      g.addColorStop(1, 'rgba(242,178,102,0)')
      x.fillStyle = g
      x.fillRect(0, 0, 128, 128)
    }
    return track(new THREE.CanvasTexture(c))
  })()

  type Landmark = { key: StopKey; group: THREE.Group; mat: THREE.LineBasicMaterial }
  const landmarks: Landmark[] = []
  const pickers: THREE.Mesh[] = []
  const pickMat = track(new THREE.MeshBasicMaterial({ visible: false }))

  const edges = (geo: THREE.BufferGeometry, mat: THREE.Material, x: number, y: number, z: number, parent: THREE.Object3D) => {
    const e = new THREE.LineSegments(track(new THREE.EdgesGeometry(track(geo))), mat)
    e.position.set(x, y, z)
    parent.add(e)
    return e
  }
  const box = (w: number, h: number, d: number, x: number, y: number, z: number, mat: THREE.Material, parent: THREE.Object3D) =>
    edges(new THREE.BoxGeometry(w, h, d), mat, x, y + h / 2, z, parent)
  const hexLoop = (r: number, color: number) => {
    const ps: THREE.Vector3[] = []
    for (let i = 0; i < 6; i += 1) {
      const a = Math.PI / 6 + (i * Math.PI) / 3
      ps.push(new THREE.Vector3(Math.cos(a) * r, Math.sin(a) * r, 0))
    }
    return new THREE.LineLoop(track(new THREE.BufferGeometry().setFromPoints(ps)), track(new THREE.LineBasicMaterial({ color })))
  }

  const makeLandmark = (key: StopKey, size: [number, number, number], build: (g: THREE.Group, m: THREE.LineBasicMaterial) => void) => {
    const group = new THREE.Group()
    group.position.copy(STOPS[key].p)
    const mat = track(new THREE.LineBasicMaterial({ color: LINE, transparent: true, opacity: 0.45 }))
    build(group, mat)
    scene.add(group)
    const pk = new THREE.Mesh(track(new THREE.BoxGeometry(size[0], size[1], size[2])), pickMat)
    pk.position.copy(STOPS[key].p).add(new THREE.Vector3(0, size[1] / 2, 0))
    pk.userData.key = key
    scene.add(pk)
    pickers.push(pk)
    landmarks.push({ key, group, mat })
  }

  let lampGlow: THREE.Sprite | null = null
  let antennaTip: THREE.Mesh<THREE.SphereGeometry, THREE.MeshBasicMaterial> | null = null
  const rings: THREE.LineLoop[] = []

  // 起点：路牌
  makeLandmark('start', [2, 2.6, 1.4], (g, m) => {
    edges(new THREE.CylinderGeometry(0.05, 0.05, 2.2, 6), m, 0, 1.1, 0, g)
    box(1.3, 0.34, 0.06, 0.45, 1.6, 0, m, g)
    box(1.1, 0.3, 0.06, -0.35, 1.1, 0, m, g)
    edges(new THREE.ConeGeometry(0.2, 0.34, 3), m, 1.2, 1.77, 0, g).rotation.z = -Math.PI / 2
  })

  // 工坊：四间小屋，高度 = 进度
  makeLandmark('workshop', [3.6, 2.6, 3.6], (g, m) => {
    const huts: Array<[number, number, number]> = [
      [-1, -1, 1.6],
      [1, -1, 1.6],
      [-1, 1, 1.0],
      [1, 1, 0.45],
    ]
    for (const [x, z, h] of huts) {
      box(1.4, h, 1.4, x, 0, z, m, g)
      edges(new THREE.ConeGeometry(1.05, 0.6, 4), m, x, h + 0.3, z, g).rotation.y = Math.PI / 4
    }
  })

  // 黑兔实验室：带信号灯的天线
  makeLandmark('lab', [3.4, 4, 2.4], (g, m) => {
    box(3.2, 1.4, 2.2, 0, 0, 0, m, g)
    box(2.8, 0.12, 1.8, 0, 1.4, 0, m, g)
    edges(new THREE.CylinderGeometry(0.03, 0.03, 2.2, 6), m, 1.1, 2.6, 0, g)
    antennaTip = new THREE.Mesh(track(new THREE.SphereGeometry(0.09, 10, 8)), track(new THREE.MeshBasicMaterial({ color: LAMP })))
    antennaTip.position.set(1.1, 3.75, 0)
    g.add(antennaTip)
  })

  // 作品塔：三层
  makeLandmark('tower', [2.6, 5.2, 2.6], (g, m) => {
    box(2.4, 1.3, 2.4, 0, 0, 0, m, g)
    box(1.8, 1.3, 1.8, 0, 1.3, 0, m, g)
    box(1.2, 1.3, 1.2, 0, 2.6, 0, m, g)
    edges(new THREE.CylinderGeometry(0.02, 0.02, 1.2, 4), m, 0, 4.5, 0, g)
  })

  // 四柱
  makeLandmark('pillars', [3.4, 3.4, 3.4], (g, m) => {
    box(3, 0.2, 3, 0, 0, 0, m, g)
    for (const [x, z] of [
      [-1.1, -1.1],
      [1.1, -1.1],
      [-1.1, 1.1],
      [1.1, 1.1],
    ]) {
      edges(new THREE.CylinderGeometry(0.18, 0.18, 2, 8), m, x, 1.2, z, g)
    }
    box(3.3, 0.25, 3.3, 0, 2.2, 0, m, g)
    edges(new THREE.ConeGeometry(2.3, 0.9, 4), m, 0, 2.9, 0, g).rotation.y = Math.PI / 4
  })

  // 升级台阶：五级，朝远处升高
  makeLandmark('stairs', [2.2, 2.4, 4.8], (g, m) => {
    for (let i = 0; i < 5; i += 1) box(1.8, 0.45 * (i + 1), 0.8, 0, 0, 1.8 - i * 0.9, m, g)
  })

  // 台灯工作台：照头像布置 —— 笔记本在左，化身在右，台灯在左后，马克杯和绿植在右
  makeLandmark('desk', [3.6, 3, 2.4], (g, m) => {
    box(3.2, 0.12, 1.6, 0, 1.0, 0, m, g)
    for (const [x, z] of [
      [-1.45, -0.65],
      [1.45, -0.65],
      [-1.45, 0.65],
      [1.45, 0.65],
    ]) {
      box(0.08, 1.0, 0.08, x, 0, z, m, g)
    }
    box(0.7, 0.04, 1.0, -0.45, 1.12, 0.05, m, g)
    const screen = new THREE.Group()
    screen.position.set(-0.8, 1.16, 0.05)
    screen.rotation.z = 0.2
    g.add(screen)
    edges(new THREE.BoxGeometry(0.03, 0.68, 1.0), m, 0, 0.34, 0, screen)
    const logo = hexLoop(0.09, HEX)
    logo.position.set(-0.03, 0.36, 0)
    logo.rotation.y = -Math.PI / 2
    screen.add(logo)
    const glow = new THREE.Mesh(
      track(new THREE.PlaneGeometry(0.92, 0.6)),
      track(new THREE.MeshBasicMaterial({ color: 0x9fd9ce, transparent: true, opacity: 0.1, side: THREE.DoubleSide, depthWrite: false })),
    )
    glow.position.set(0.02, 0.36, 0)
    glow.rotation.y = Math.PI / 2
    screen.add(glow)
    const screenLight = new THREE.PointLight(0x9fd9ce, 2.5, 3, 2)
    screenLight.position.set(-0.3, 1.6, 0.05)
    g.add(screenLight)

    edges(new THREE.CylinderGeometry(0.18, 0.2, 0.05, 10), m, -1.25, 1.145, -0.55, g)
    edges(new THREE.CylinderGeometry(0.025, 0.025, 1.1, 6), m, -1.25, 1.7, -0.55, g)
    edges(new THREE.CylinderGeometry(0.025, 0.025, 0.62, 6), m, -1.02, 2.32, -0.46, g).rotation.z = -1.0
    edges(
      new THREE.ConeGeometry(0.3, 0.36, 12, 1, true),
      track(new THREE.LineBasicMaterial({ color: LAMP })),
      -0.74,
      2.36,
      -0.36,
      g,
    ).rotation.z = 0.75
    lampGlow = new THREE.Sprite(
      track(new THREE.SpriteMaterial({ map: glowTexture, transparent: true, blending: THREE.AdditiveBlending, depthWrite: false })),
    )
    lampGlow.scale.set(5, 5, 1)
    lampGlow.position.set(-0.66, 2.2, -0.32)
    g.add(lampGlow)
    const lamp = new THREE.PointLight(LAMP, 14, 10, 2)
    lamp.position.set(-0.55, 2.1, -0.2)
    g.add(lamp)

    edges(new THREE.CylinderGeometry(0.13, 0.12, 0.26, 12), m, 1.2, 1.25, 0.5, g)
    const hc = new THREE.EllipseCurve(0, 0, 0.07, 0.08, -Math.PI / 2, Math.PI / 2)
    const handle = new THREE.Line(
      track(new THREE.BufferGeometry().setFromPoints(hc.getPoints(16).map((p) => new THREE.Vector3(p.x, p.y, 0)))),
      m,
    )
    handle.position.set(1.33, 1.25, 0.5)
    g.add(handle)

    edges(new THREE.CylinderGeometry(0.15, 0.11, 0.24, 10), m, 1.25, 1.24, -0.5, g)
    const leafMat = track(new THREE.LineBasicMaterial({ color: 0x8fb8a0, transparent: true, opacity: 0.8 }))
    for (let i = 0; i < 6; i += 1) {
      const a = (i / 6) * Math.PI * 2
      const r = 0.35 + 0.12 * (i % 2)
      const c = new THREE.QuadraticBezierCurve3(
        new THREE.Vector3(0, 0, 0),
        new THREE.Vector3(Math.cos(a) * r * 0.4, 0.55, Math.sin(a) * r * 0.4),
        new THREE.Vector3(Math.cos(a) * r, 0.42 + 0.1 * (i % 3), Math.sin(a) * r),
      )
      const leaf = new THREE.Line(track(new THREE.BufferGeometry().setFromPoints(c.getPoints(14))), leafMat)
      leaf.position.set(1.25, 1.36, -0.5)
      g.add(leaf)
    }
  })

  // 远程传送门
  makeLandmark('portal', [4.6, 4.8, 1.6], (g, m) => {
    box(3.2, 0.15, 1.2, 0, 0, 0, m, g)
    ;[1.5, 1.85, 2.2].forEach((r, i) => {
      const c = new THREE.EllipseCurve(0, 0, r, r, 0, Math.PI * 2)
      const loop = new THREE.LineLoop(
        track(new THREE.BufferGeometry().setFromPoints(c.getPoints(96).map((p) => new THREE.Vector3(p.x, p.y, 0)))),
        track(new THREE.LineBasicMaterial({ color: LAMP, transparent: true, opacity: 0.75 - i * 0.18 })),
      )
      loop.position.set(0, 2.4, 0)
      g.add(loop)
      rings.push(loop)
    })
  })

  // ── 化身：照头像建模 ────────────────────────────────────────────
  const rabbit = new THREE.Group()
  const head = new THREE.Group()
  const eyes: THREE.Group[] = []
  let earL: THREE.Group
  let earR: THREE.Group
  {
    const fur = track(new THREE.MeshStandardMaterial({ color: 0xf6f2ea, roughness: 0.95, emissive: 0x3a352d }))
    const pink = track(new THREE.MeshStandardMaterial({ color: 0xe9a9a4, roughness: 0.9, emissive: 0x2a1515 }))
    const blush = track(new THREE.MeshBasicMaterial({ color: 0xf2a7a0, transparent: true, opacity: 0.45, depthWrite: false }))
    const eyeMat = track(new THREE.MeshStandardMaterial({ color: 0x1f4650, roughness: 0.2, metalness: 0.1, emissive: 0x08161a }))
    const shine = track(new THREE.MeshBasicMaterial({ color: 0xffffff }))
    const scarf = track(new THREE.MeshStandardMaterial({ color: 0x3a3b44, roughness: 0.95, emissive: 0x0c0c10 }))
    const hexMat = track(new THREE.MeshStandardMaterial({ color: HEX, emissive: 0x1f6b5f, roughness: 0.35, metalness: 0.4 }))
    const sphere = track(new THREE.SphereGeometry(1, 28, 20))
    const sph = (r: number, mat: THREE.Material, sx = 1, sy = 1, sz = 1) => {
      const s = new THREE.Mesh(sphere, mat)
      s.scale.set(r * sx, r * sy, r * sz)
      return s
    }

    const body = sph(0.32, fur, 1, 0.95, 0.9)
    body.position.y = 0.3
    rabbit.add(body)
    for (const x of [-0.13, 0.13]) {
      const paw = sph(0.09, fur, 1, 0.7, 1.3)
      paw.position.set(x, 0.08, 0.24)
      rabbit.add(paw)
    }
    const tail = sph(0.1, fur)
    tail.position.set(0, 0.2, -0.3)
    rabbit.add(tail)

    const ring = new THREE.Mesh(track(new THREE.TorusGeometry(0.2, 0.08, 14, 32)), scarf)
    ring.rotation.x = Math.PI / 2
    ring.position.y = 0.58
    rabbit.add(ring)
    const drape = sph(0.12, scarf, 0.95, 1.35, 0.45)
    drape.position.set(0.05, 0.43, 0.22)
    drape.rotation.z = -0.2
    rabbit.add(drape)
    const pin = new THREE.Group()
    pin.position.set(0.13, 0.58, 0.22)
    pin.rotation.y = 0.6
    rabbit.add(pin)
    const hex = new THREE.Mesh(track(new THREE.CylinderGeometry(0.048, 0.048, 0.025, 6)), hexMat)
    hex.rotation.x = Math.PI / 2
    hex.position.z = 0.03
    pin.add(hex)

    head.position.set(0, 0.84, 0.03)
    rabbit.add(head)
    head.add(sph(0.3, fur, 1.08, 0.95, 0.95))
    for (const s of [-1, 1]) {
      const cheek = sph(0.13, fur, 1, 0.8, 0.9)
      cheek.position.set(s * 0.24, -0.1, 0.05)
      head.add(cheek)
    }
    const tuft = track(new THREE.ConeGeometry(0.05, 0.17, 8))
    for (let i = 0; i < 5; i += 1) {
      const t = new THREE.Mesh(tuft, fur)
      t.position.set(-0.1 + i * 0.05, 0.27, 0.07 + (i % 2) * 0.03)
      t.rotation.z = (i - 2) * -0.28
      t.rotation.x = 0.35
      head.add(t)
    }
    for (const s of [-1, 1]) {
      const eye = new THREE.Group()
      eye.position.set(s * 0.12, -0.01, 0.25)
      eye.add(sph(0.07, eyeMat, 0.85, 1.12, 0.5))
      const h1 = sph(0.019, shine)
      h1.position.set(-0.018, 0.032, 0.03)
      eye.add(h1)
      const h2 = sph(0.009, shine)
      h2.position.set(0.02, -0.025, 0.03)
      eye.add(h2)
      head.add(eye)
      eyes.push(eye)
      const b = sph(0.045, blush, 1, 0.55, 0.3)
      b.position.set(s * 0.18, -0.09, 0.23)
      head.add(b)
    }
    const nose = sph(0.022, pink, 1.2, 0.8, 0.8)
    nose.position.set(0, -0.08, 0.29)
    head.add(nose)

    const ear = (s: number) => {
      const g = new THREE.Group()
      g.position.set(s * 0.11, 0.22, -0.02)
      g.rotation.z = -s * 0.2
      g.rotation.y = s * 0.25
      const outer = sph(0.1, fur, 0.95, 4.2, 0.38)
      outer.position.y = 0.4
      g.add(outer)
      const inner = sph(0.068, pink, 0.85, 3.5, 0.2)
      inner.position.set(0, 0.4, 0.035)
      g.add(inner)
      head.add(g)
      return g
    }
    earL = ear(-1)
    earR = ear(1)
    rabbit.scale.setScalar(0.9)
    // 随身的一点暖光：离开台灯也看得清化身的脸。
    const lantern = new THREE.PointLight(0xfff1dc, 3, 4, 2)
    lantern.position.set(0.6, 1.6, 1.4)
    rabbit.add(lantern)
  }
  scene.add(rabbit)

  const rabbitSpot = (key: StopKey) => {
    const s = STOPS[key]
    const v = s.p.clone().add(s.rabbit)
    if (key !== 'desk' && key !== 'stairs') v.y = Math.max(0, height(v.x, v.z))
    return v
  }

  // ── 镜头 ───────────────────────────────────────────────────────
  const shot = (key: StopKey, orbit: number, narrow: boolean) => {
    if (key === 'start') {
      // 全景：整张地图偏到画面右侧，左侧留给首屏文字。
      return narrow
        ? { pos: new THREE.Vector3(2, 19, 30), look: new THREE.Vector3(0, 0, -12) }
        : { pos: new THREE.Vector3(8 + orbit * 6, 13, 24), look: new THREE.Vector3(-8, 0, -10) }
    }
    const s = STOPS[key]
    const yaw = s.yaw + orbit * 0.45
    const rot = new THREE.Euler(0, yaw, 0)
    const dist = narrow ? 12 : 12.5
    const pos = new THREE.Vector3(0, 5.4, dist).applyEuler(rot).add(s.p)
    // 宽屏把地标放到画面右侧约 3/4 处，给左侧的文字让位；窄屏地标居中、偏上。
    const look = new THREE.Vector3(narrow ? 0 : -4.6, narrow ? 0.2 : 1.4, 0).applyEuler(rot).add(s.p)
    return { pos, look }
  }

  let current: StopKey = options.initial
  let orbit = 0
  let hovered: StopKey | null = null
  const parallax = new THREE.Vector2()
  const par = new THREE.Vector2()
  const isNarrow = () => window.innerWidth < 760

  const first = shot(current, orbit, isNarrow())
  const camPos = first.pos.clone()
  const camLook = first.look.clone()
  const rabbitPos = rabbitSpot(current)
  rabbit.position.copy(rabbitPos)
  rabbit.rotation.y = current === 'desk' ? -1.15 : 0
  let walkedCount = stopIndex[current] + 1

  const resize = () => {
    const w = window.innerWidth
    const h = window.innerHeight
    renderer.setSize(w, h, false)
    camera.aspect = w / h
    camera.fov = w < 760 ? 58 : 45
    camera.updateProjectionMatrix()
  }
  resize()

  // 自己计时：THREE.Clock 在当前版本已废弃。
  let last = performance.now()
  let elapsed = 0
  const ray = new THREE.Raycaster()
  let frame = 0
  let running = false

  const draw = (dt: number, t: number) => {
    const narrow = isNarrow()
    const target = shot(current, orbit, narrow)
    const k = reduceMotion ? 1 : 1 - Math.pow(0.0025, dt)
    // 与帧率无关的缓动系数：rest 是 1 秒后剩下的比例。
    const ease = (rest: number) => 1 - Math.pow(rest, dt)
    if (!reduceMotion) {
      par.x += (parallax.x - par.x) * ease(0.05)
      par.y += (parallax.y - par.y) * ease(0.05)
    }
    camPos.lerp(target.pos, k)
    camLook.lerp(target.look, k)
    camera.position.set(camPos.x + par.x * 1.6, camPos.y - par.y, camPos.z)
    camera.lookAt(camLook)

    for (const l of landmarks) {
      const on = l.key === current || l.key === hovered
      const goal = on ? 0.95 : 0.42
      l.mat.opacity = reduceMotion ? goal : l.mat.opacity + (goal - l.mat.opacity) * ease(0.007)
    }

    const walkGoal = stopIndex[current] + 1
    walkedCount = reduceMotion ? walkGoal : walkedCount + (walkGoal - walkedCount) * Math.min(1, dt * 2.5)
    walked.setDrawRange(0, Math.max(1, Math.round(walkedCount)))

    // 化身：匀速跳到目标点，近了再减速
    const spot = rabbitSpot(current)
    const d = spot.clone().sub(rabbitPos)
    const dist = d.length()
    const moving = dist > 0.08
    if (reduceMotion) rabbitPos.copy(spot)
    else if (moving) rabbitPos.add(d.multiplyScalar(Math.min(1, Math.max(dt * 9, dist * dt * 2.5) / dist)))
    const hop = !reduceMotion && moving ? Math.abs(Math.sin(t * 9)) * 0.55 : 0
    rabbit.position.set(rabbitPos.x, rabbitPos.y + hop, rabbitPos.z)
    let face: number
    if (moving && !reduceMotion) face = Math.atan2(spot.x - rabbitPos.x, spot.z - rabbitPos.z)
    else if (current === 'desk') face = -1.15
    else face = Math.atan2(camera.position.x - rabbitPos.x, camera.position.z - rabbitPos.z)
    rabbit.rotation.y = reduceMotion ? face : turn(rabbit.rotation.y, face, ease(moving ? 0.0005 : 0.05))

    const flop = moving ? hop * 0.9 : reduceMotion ? 0 : Math.sin(t * 1.3) * 0.05
    earL.rotation.x = -0.1 - flop
    earR.rotation.x = -0.1 - flop * 0.8
    const headY = moving ? 0 : par.x * 1.1 + (current === 'desk' ? 0.45 : 0)
    const headX = moving ? 0 : par.y * 0.5
    head.rotation.y += (headY - head.rotation.y) * (reduceMotion ? 1 : ease(0.007))
    head.rotation.x += (headX - head.rotation.x) * (reduceMotion ? 1 : ease(0.007))
    const blink = !reduceMotion && t % 4.2 < 0.13 ? 0.12 : 1
    for (const e of eyes) e.scale.y = blink

    if (!reduceMotion) {
      rings.forEach((r, i) => {
        r.rotation.y = t * (0.25 + i * 0.18) * (i % 2 ? -1 : 1)
        r.rotation.x = Math.sin(t * 0.3 + i) * 0.3
      })
      if (antennaTip) antennaTip.material.color.setHex(Math.sin(t * 3) > 0 ? LAMP : 0x5e4630)
      dust.rotation.y = t * 0.004
      if (lampGlow) {
        const s = 4.6 + Math.sin(t * 1.7) * 0.25
        lampGlow.scale.set(s, s, 1)
      }
    }

    renderer.render(scene, camera)
  }

  const loop = () => {
    frame = requestAnimationFrame(loop)
    const now = performance.now()
    const dt = Math.min((now - last) / 1000, 0.05)
    last = now
    elapsed += dt
    draw(dt, elapsed)
  }
  const start = () => {
    if (running || reduceMotion) return
    running = true
    last = performance.now()
    loop()
  }
  const stop = () => {
    running = false
    cancelAnimationFrame(frame)
  }
  // 减少动态效果：不跑循环，只在状态变化时画一帧。
  const still = () => {
    if (reduceMotion) draw(1, 0)
  }

  const onVisibility = () => (document.hidden ? stop() : start())
  const onResize = () => {
    resize()
    still()
  }
  document.addEventListener('visibilitychange', onVisibility)
  window.addEventListener('resize', onResize, { passive: true })

  draw(1, 0)
  if (!document.hidden) start()

  return {
    setStop(key) {
      if (key === current) return
      current = key
      still()
    },
    setOrbit(amount) {
      orbit = Math.max(-1, Math.min(1, amount))
      still()
    },
    setParallax(x, y) {
      parallax.set(x, y)
    },
    pick(nx, ny) {
      ray.setFromCamera(new THREE.Vector2(nx, ny), camera)
      const hit = ray.intersectObjects(pickers, false)[0]
      return hit ? (hit.object.userData.key as StopKey) : null
    },
    setHover(key) {
      if (key === hovered) return
      hovered = key
      still()
    },
    dispose() {
      stop()
      document.removeEventListener('visibilitychange', onVisibility)
      window.removeEventListener('resize', onResize)
      for (const d of disposables) d.dispose()
      renderer.dispose()
    },
  }
}
