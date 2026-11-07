---
status: accepted
---

# 部署平台从 Netlify 迁到 Cloudflare Pages

## 背景

站点内容面向两类读者：招聘方与技术面试官、以及从公众号／小红书来的内容读者。
后者几乎全部在中国大陆。这意味着**站点在中国大陆打不开，等于内容侧的全部投入作废**。

2026-11-07 实测确认了这个问题：

```
# 直连（不走代理）
https://hackrabbit.cc.cd/   →  curl: (35) Recv failure: Connection reset by peer
                                dns=0.004s connect=0.097s tls=0.000s
https://github.com/         →  Timeout（对照组，同样不通）
```

关键特征是 **TCP 三次握手成功、TLS 握手阶段被 RST**。这不是 DNS 污染——
阿里 DNS（223.5.5.5）和腾讯 DNS（119.29.29.29）都能正确解析到 `75.2.60.5`，
走代理访问完全正常（Netlify 边缘返回 200）。

`75.2.60.5` 属于 AWS `AS16509`（Netlify 用的美西机房）。这是 GFW 对该 IP 段的干扰：
握手包被丢弃并回 RST，表现为「连得上但立刻断开」。

## 决定

**部署平台从 Netlify 迁到 Cloudflare Pages。**

实测 Cloudflare 边缘直连正常：

```
https://cloudflare.com/      →  HTTP 301  tls=0.40s  total=1.36s
https://pages.cloudflare.com/ →  HTTP 301  tls=1.27s  total=1.62s
```

关键取舍：

- **Cloudflare Pages 的构建镜像自带 Bun 1.4.4**，与本机同版本，检测到 `bun.lock`
  会自动用 `bun install`。不新增依赖、不改包管理器（与 ADR 0004 的技术边界一致）。
- **不需要 ICP 备案**：走 CNAME setup，权威 DNS 仍留在 `dnshe.org`，
  只把 `hackrabbit.cc.cd` 的 CNAME 指向 `<项目名>.pages.dev`。
  备案是给「服务器在境内」的站点准备的，这里源站在境外，CNAME setup 足够。
- **Netlify 配置保留**（`netlify.toml`）作为回退路径。若 Cloudflare 在国内表现不佳，
  改回 Netlify 只需把 DNS 的 CNAME 指回去，不用改代码、不用重新部署。

## 与既有边界的关系

`AGENTS.md` 原写「不得换部署平台」。本决定是站主明确指示下的例外，
并已同步更新 `AGENTS.md` 的技术栈表。理由不是「Netlify 不好」，而是
**Netlify 用的 AWS IP 段在大陆不可达**，这一条对本站的内容侧是致命的。

其余硬边界不变：不新增依赖、不引入字体包、不改框架、不动滚动策略。

## 后果

- `wrangler.toml` 成为部署配置；`package.json` 加 `deploy` 脚本用于手动触发。
- 部署由 Cloudflare Dashboard 的 Git 集成自动完成（推 `main` 即部署），
  CI 里不需要放 Cloudflare token。
- 若 Cloudflare 在国内只是「能打开但慢」，下一步的解法是**国内 CDN + ICP 备案**，
  而不是回到 Netlify。
