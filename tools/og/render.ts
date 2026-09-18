// Renders the OG / share card (1200×630) from tools/og/share.html to public/og.png.
import { $ } from 'bun'

const HERE = import.meta.dir
const OUT = `${HERE}/../../public/og.png`

const CHROME = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'
const port = 9900 + Math.floor(Math.random() * 90)
const profile = `/tmp/cdp-og-${port}`

const proc = Bun.spawn(
  [CHROME, `--remote-debugging-port=${port}`, `--user-data-dir=${profile}`, '--headless=new',
   '--disable-gpu', '--hide-scrollbars', '--no-first-run', '--no-default-browser-check',
   '--allow-file-access-from-files', '--window-size=1200,630', 'about:blank'],
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
await send('Emulation.setDeviceMetricsOverride', {
  width: 1200, height: 630, deviceScaleFactor: 1, mobile: false,
})
await send('Page.navigate', { url: `file://${HERE}/share.html` })
await Bun.sleep(900)

const box = await send('Runtime.evaluate', {
  expression: `(() => { const b = document.querySelector('.og').getBoundingClientRect();
    return JSON.stringify({x: b.x, y: b.y, width: b.width, height: b.height, scale: 1}) })()`,
  returnByValue: true,
}).then((r) => JSON.parse(r.result.result.value))

const { data } = await send('Page.captureScreenshot', {
  format: 'png', clip: box, captureBeyondViewport: true,
}).then((r) => r.result)

await Bun.write(OUT, Buffer.from(data, 'base64'))
console.log(`og.png ${box.width} x ${box.height} css`)

ws.close()
proc.kill()
await $`rm -rf ${profile}`.quiet().nothrow()
