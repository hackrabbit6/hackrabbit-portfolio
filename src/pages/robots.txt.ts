import type { APIRoute } from 'astro'

// robots.txt（构建时生成）。全站都是公开内容，没有需要藏的目录，
// 所以只做两件事：明确允许抓取，并告诉搜索引擎 sitemap 在哪。
// 域名取 astro.config.mjs 的 site，不写死 —— 换域名时这一行自动跟着变。

const SITE = import.meta.env.SITE ?? 'https://hackrabbit.cc.cd'

export const GET: APIRoute = () => {
  const body = `User-agent: *
Allow: /

Sitemap: ${SITE}/sitemap.xml
`
  return new Response(body, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  })
}
