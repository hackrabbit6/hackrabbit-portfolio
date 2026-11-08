---
status: rejected
---

# 评估过迁到 Cloudflare Pages，最终不迁（一次误判的记录）

## 背景

2026-11-07，站主反馈「中国大陆访问不了站点」，并问是不是要换部署平台。

排查过程：

1. 站内直连 `https://hackrabbit.cc.cd/`：TCP 连上（connect ≈ 0.08s）但 **TLS 握手被 RST**
   （`curl: (35) Recv failure: Connection reset by peer`）；走代理则完全正常（Netlify 边缘返回 200）。
2. 域名解析正常：阿里 DNS（223.5.5.5）、腾讯 DNS（119.29.29.29）、Google DNS 都返回同一个
   `75.2.60.5`。**不是 DNS 污染**。
3. `75.2.60.5` 属于 AWS `AS16509`（Netlify 用的美西机房）。据此判断是 GFW 对该 IP 段的干扰，
   并推测 Cloudflare 边缘在国内可达（实测 Cloudflare 域名直连正常，TLS 1.3s）。
4. 于是决定迁移：新增 `wrangler.toml`、`deploy` 脚本，改 `AGENTS.md` 与 `README.md`，
   并写下本 ADR。

## 为什么这个判断是错的

**关键的对照实验在迁移提交之后才做。** 同一条网络、同一台机器、同样不走代理：

| 目标 | 结果 |
|---|---|
| `hackrabbit.cc.cd`（Netlify） | ✗ TLS 被 RST |
| `s3.amazonaws.com` | ✓ TLS 0.52s |
| `www.amazonaws.com` | ✓ TLS 0.39s |
| `console.aws.amazon.com` | ✓ TLS 0.61s |
| `cloudflare.com` | ✓ TLS 0.39s |
| `github.com` / `google.com` | ✗ 超时 |

**同是 AWS 的其它域名全部正常，只有 Netlify 的三个边缘 IP 不通。** 这说明干扰来自
**这台开发机所在网络对特定 IP 段的策略**（企业网络 / 透明代理 / 安全软件），不是针对
Netlify 的普遍封锁，更不是「中国大陆访问不了」。

而站主随后用**手机移动网络实测可以正常访问** —— 真实国内网络是通的。

所以第 3 步的推断错在：把「本机网络环境问题」当成了「全国性可达性问题」，
再拿「Cloudflare 域名在本机可通」当成了「Cloudflare 在国内可通」的证据。

## 决定

**不迁移。站点继续部署在 Netlify。**

- DNS 不动：`hackrabbit.cc.cd` 仍由 `dnshe.org` 托管，CNAME 指向 Netlify。
- `wrangler.toml`、`deploy` 脚本、`AGENTS.md` 与 `README.md` 的迁移相关内容全部撤掉。
- Netlify 配置（`netlify.toml`）保持原样。

## 后果

- **给站主的真实答案**：站点在国内可以访问。遇到打不开时，先查自己所在网络
  （公司网络、代理规则、安全软件），而不是改站点。
- **保留一条运维纪律**：判断「某站点在某地可达」时，**必须有一个来自目标网络的实测**
  （手机流量、异地探针），不能用开发机直连的结果代替。开发机的网络环境会骗人。
- 本 ADR 保留下来而不是删除：它记录的是一次真实的误判与误判的成因，
  比「当时没做这个决定」更有信息量。

## 这次迁移里唯一被保留的改动

`sitemap.xml` 的页面清单改为直接走文件系统（`src/lib/site-pages.ts`），不再依赖
`git ls-files` —— **与部署平台无关**：任何构建环境若没有 `.git`，清单都会是空的
（sitemap 里一个 URL 都没有）。这个修复对 Netlify 同样成立，所以留在 `5093541` 里。
