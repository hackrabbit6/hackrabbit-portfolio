// Renders tools/resume/resume.html to public/resume.pdf via headless Chrome.
import { $ } from 'bun'

const HERE = import.meta.dir
const OUT = `${HERE}/../../public/resume.pdf`

const CHROME = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'
const port = 9700 + Math.floor(Math.random() * 90)
const profile = `/tmp/cdp-resume-${port}`

const proc = Bun.spawn(
  [CHROME, `--remote-debugging-port=${port}`, `--user-data-dir=${profile}`, '--headless=new',
   '--disable-gpu', '--no-first-run', '--no-default-browser-check',
   '--allow-file-access-from-files', '--window-size=900,1200', 'about:blank'],
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
await send('Page.navigate', { url: `file://${HERE}/resume.html` })
await Bun.sleep(900)

const { data } = await send('Page.printToPDF', {
  printBackground: true,
  preferCSSPageSize: true,
}).then((r) => r.result)

await Bun.write(OUT, Buffer.from(data, 'base64'))
console.log('resume.pdf written')

ws.close()
proc.kill()
await $`rm -rf ${profile}`.quiet().nothrow()
