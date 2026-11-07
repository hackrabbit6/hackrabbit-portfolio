// 站点路由清单：URL 与每页最后改动日期。
//
// 为什么单独一个文件：sitemap.xml 要的是「这个 URL 上一次真的变了是什么时候」，
// 而首页的正文在 src/components/Hero.astro 里，不在 src/pages/index.astro 里。
// 只看页面文件本身的话，首页会一直显示 2026-09-18 —— 给搜索引擎一个错的 lastmod
// 比不给更糟（它会据此决定多久抓一次）。
//
// 所以这里的日期是「这个页面用到的所有本地源文件里，最晚的那次提交」：
// 页面文件 + 它 import 的组件 + 它用到的样式。改动任何一处，日期就跟着变。
//
// 实现：扫 src/pages 下的 .astro 文件，跟着 import 关系往里走（只跟本地的相对路径），
// 收集到的文件交给 git 问最后提交时间。构建机上没有 .git 时退回兜底日期。

import { execFileSync } from 'node:child_process'
import { readFileSync, existsSync, readdirSync, statSync } from 'node:fs'
import { relative, dirname, resolve, join } from 'node:path'

const SRC = 'src'
const PAGES = 'src/pages'
/** 取不到 git 时的兜底日期 */
export const FALLBACK_DATE = '2026-11-07'

type PageEntry = { route: string; files: string[] }

/**
 * 递归列出目录下的 .astro 文件（相对仓库根）。
 *
 * 用文件系统直接走，不用 `git ls-files`：构建环境（Cloudflare Pages 之类）
 * 未必带 git 或完整的 .git 目录，而这份清单一旦列不出来，sitemap 会是空的 ——
 * 那比日期不准严重得多。
 */
const listAstro = (dir: string): string[] => {
  const out: string[] = []
  const walk = (abs: string) => {
    let entries: string[] = []
    try {
      entries = readdirSync(abs)
    } catch {
      return
    }
    for (const name of entries) {
      if (name.startsWith('.') || name === 'node_modules') continue
      const child = join(abs, name)
      let isDir = false
      try {
        isDir = statSync(child).isDirectory()
      } catch {
        continue
      }
      if (isDir) walk(child)
      else if (name.endsWith('.astro')) out.push(relative(process.cwd(), child))
    }
  }
  walk(dir)
  return out
}

/** 文件里的本地 import（相对路径），解析成仓库根下的路径 */
const localImports = (file: string): string[] => {
  let text = ''
  try {
    text = readFileSync(file, 'utf8')
  } catch {
    return []
  }
  const specs = new Set<string>()
  const re = /(?:^|\n)\s*(?:import|export)[^\n]*?from\s+['"](\.[^'"]+)['"]/g
  let m: RegExpExecArray | null
  while ((m = re.exec(text))) {
    specs.add(m[1])
  }
  const dir = dirname(file)
  const out: string[] = []
  for (const spec of specs) {
    const base = resolve(dir, spec)
    for (const cand of [base, `${base}.astro`, `${base}.tsx`, `${base}.ts`, `${base}.css`, `${base}/index.astro`]) {
      const rel = relative(process.cwd(), cand)
      if (rel.startsWith('..')) continue
      if (existsSync(cand)) {
        out.push(rel)
        break
      }
    }
  }
  return out
}

/** 页面文件 + 它（递归）引用的所有本地源文件 */
const collectFiles = (page: string, seen = new Set<string>()): string[] => {
  if (seen.has(page)) return []
  seen.add(page)
  const files = [page]
  for (const dep of localImports(page)) {
    files.push(...collectFiles(dep, seen))
  }
  return files
}

/** 文件路径 → 路由路径（与 Astro 静态输出的目录式规则一致，带尾斜杠） */
const routeOf = (file: string): string => {
  const path = file.replace(/^src\/pages\//, '').replace(/\.astro$/, '')
  if (path === 'index') return '/'
  return `/${path.replace(/\/index$/, '')}/`
}

/** 这些文件里最晚的一次提交日期 */
const lastmodOf = (files: string[]): string => {
  try {
    const out = execFileSync('git', ['log', '-1', '--format=%aI', '--', ...files], {
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'ignore'],
    }).trim()
    if (out) return out.slice(0, 10)
  } catch {
    // 没有 git 历史（源码包构建等）就退回兜底日期
  }
  return FALLBACK_DATE
}

const build = (): PageEntry[] => {
  const pages = listAstro(PAGES)
  return pages
    .map((page) => ({
      route: routeOf(page),
      files: collectFiles(page).filter((f) => f.startsWith(SRC)),
    }))
    .sort((a, b) => a.route.localeCompare(b.route))
}

export const sitePages = build()

/** 路由 → 最后改动日期 */
export const pageLastmod = new Map<string, string>(
  sitePages.map((p) => [p.route, lastmodOf(p.files)] as const),
)
