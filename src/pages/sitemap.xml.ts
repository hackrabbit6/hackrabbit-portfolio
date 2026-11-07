import type { APIRoute } from 'astro'
import { pageLastmod } from '../lib/site-pages'

// 站点地图（构建时生成）。零依赖：不用 @astrojs/sitemap。
//
// 为什么要自动生成而不是手写一份 sitemap.xml：
// 手写的清单迟早和实际路由对不上（新增案例页时最容易漏）。URL 列表从 src/pages
// 扫出来，与站点路由永远一致；每页的 lastmod 由 src/lib/site-pages.ts 算出
// （页面文件 + 它引用的本地源文件里最晚的那次提交），不是页面文件自己的日期。
//
// 没有 WebGL / 脚本失败之类的降级与这里无关：这是构建期产物，静态输出。

const SITE = import.meta.env.SITE ?? 'https://hackrabbit.cc.cd'

export const GET: APIRoute = () => {
  const urls = [...pageLastmod.entries()]
    .map(([route, lastmod]) => ({ loc: `${SITE}${route}`, lastmod }))
    .sort((a, b) => a.loc.localeCompare(b.loc))

  const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map((u) => `  <url>\n    <loc>${u.loc}</loc>\n    <lastmod>${u.lastmod}</lastmod>\n  </url>`).join('\n')}
</urlset>
`
  return new Response(body, {
    headers: { 'Content-Type': 'application/xml; charset=utf-8' },
  })
}
