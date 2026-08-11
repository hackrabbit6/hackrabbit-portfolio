// Renders each cover HTML to a PNG clipped exactly to the .cover element,
// at deviceScaleFactor 2 (so a 684x520 cover ships as 1368x1040).
import { $ } from 'bun'

const HERE = import.meta.dir
const OUT = `${HERE}/../../public/covers`

// dpr 按「这张图在页面上可能被拉到的最大 CSS 宽度 × 2」来定：
// 横版视觉位被 .work-list 的 max-width 卡在 684，2x 正好够；
// 竖版在窄屏并成单列后最宽会到约 640，所以要 4x 才不糊。
const COVERS = [
  { file: '01-h5-game-sdk.html', out: 'h5-game-sdk.png', dpr: 2 },
  { file: '02-ai-music.html', out: 'ai-music.png', dpr: 4 },
  { file: '03-digital-loved-one.html', out: 'digital-loved-one.png', dpr: 4 },
  { file: '04-onchain-research.html', out: 'onchain-research.png', dpr: 2 },
]

const CHROME = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'
const port = 9500 + Math.floor(Math.random() * 400)
const profile = `/tmp/cdp-cover-${port}`

const proc = Bun.spawn(
  [CHROME, `--remote-debugging-port=${port}`, `--user-data-dir=${profile}`, '--headless=new',
   '--disable-gpu', '--hide-scrollbars', '--no-first-run', '--no-default-browser-check',
   '--allow-file-access-from-files', '--window-size=900,700', 'about:blank'],
  { stdout: 'ignore', stderr: 'ignore' },
)

async function wsUrl(): Promise<string> {
  for (let i = 0; i < 60; i++) {
    try {
      const tabs = (await (await fetch(`http://127.0.0.1:${port}/json/list`)).json()) as any[]
      const page = tabs.find((t) => t.type === 'page')
      if (page?.webSocketDebuggerUrl) return page.webSocketDebuggerUrl
    } catch {}
    await Bun.sleep(200)
  }
  throw new Error('chrome did not start')
}

const ws = new WebSocket(await wsUrl())
await new Promise((res) => (ws.onopen = res))

let id = 0
const pending = new Map<number, (v: any) => void>()
ws.onmessage = (e) => {
  const m = JSON.parse(String(e.data))
  if (m.id && pending.has(m.id)) { pending.get(m.id)!(m); pending.delete(m.id) }
}
const send = (method: string, params: any = {}) =>
  new Promise<any>((res) => {
    const n = ++id
    pending.set(n, res)
    ws.send(JSON.stringify({ id: n, method, params }))
  })

await send('Page.enable')
await send('Runtime.enable')
for (const { file, out, dpr } of COVERS) {
  await send('Emulation.setDeviceMetricsOverride', {
    width: 900, height: 700, deviceScaleFactor: dpr, mobile: false,
  })
  await send('Page.navigate', { url: `file://${HERE}/${file}` })
  await Bun.sleep(700)

  const box = await send('Runtime.evaluate', {
    expression: `(() => { const b = document.querySelector('.cover').getBoundingClientRect();
      return JSON.stringify({x: b.x, y: b.y, width: b.width, height: b.height, scale: 1}) })()`,
    returnByValue: true,
  }).then((r) => JSON.parse(r.result.result.value))

  const { data } = await send('Page.captureScreenshot', {
    format: 'png', clip: box, captureBeyondViewport: true,
  }).then((r) => r.result)

  await Bun.write(`${OUT}/${out}`, Buffer.from(data, 'base64'))
  console.log(`${out.padEnd(26)} ${box.width} x ${box.height} css`)
}

ws.close()
proc.kill()
await $`rm -rf ${profile}`.quiet().nothrow()
