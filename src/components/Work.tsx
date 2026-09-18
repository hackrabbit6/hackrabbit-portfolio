import { useEffect } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import './Work.css'

type Project = {
  name: string
  origin: '工作项目' | '个人项目'
  evidence: '脱敏案例' | '开源代码' | '暂无公开材料'
  type: string
  summary: string
  stack: string[]
  cover: string
  coverNarrow?: string
  coverAlt: string
  caseUrl?: string
  repo?: string
}

const featured = {
  name: 'H5 游戏发行 SDK 与充值体系',
  origin: '工作项目',
  evidence: '脱敏案例',
  type: 'SDK / 支付 / 多端适配',
  cover: '/covers/h5-game-sdk.webp',
  coverNarrow: '/covers/h5-game-sdk-narrow.webp',
  coverAlt:
    'H5 游戏发行 SDK 的脱敏结构图：登录、支付、角色上报、浮窗、实名、防沉迷六个能力模块汇入同一个 SDK，SDK 再分发给多款游戏，并向下连到 Reporting。',
  direction:
    '我看到每个游戏重复接账号、支付和活动能力会拖慢上线,所以把问题拆成稳定 SDK 接入链路。',
  collaboration:
    '这是工作期项目,核心难点我自己和团队一起排查:iframe 通信、微信/支付宝拉起、小游戏限制和移动端兼容。',
  result:
    '我交付并维护了登录、支付、角色上报、浮窗、实名、防沉迷等能力,支撑多款游戏和充值活动上线。',
  stack: ['Vue3', 'TypeScript', 'Vite', 'H5', 'postMessage', 'WeixinJSBridge'],
  caseUrl: '/work/h5-game-sdk/',
} as const

const projects: Project[] = [
  {
    name: 'AI 音乐生成工具',
    origin: '个人项目',
    evidence: '开源代码',
    type: 'AI 应用 / Audio',
    summary:
      '我做出了可运行的「提示词 -> 歌词 -> 音乐 -> 封面」控制台,作品可保存、可回放、可复核代码。',
    stack: ['React', 'TypeScript', 'Bun', 'Hono', 'SQLite', 'MiniMax API'],
    cover: '/covers/ai-music.webp',
    coverAlt:
      'AI 音乐生成工具的链路图：Prompt 进入生成环节（音频波形），产出歌词、音乐、封面三项，最后进入作品库。',
    repo: 'https://github.com/hackrabbit6/music',
  },
  {
    name: '数字亲人 / 家庭记忆 AI',
    origin: '个人项目',
    evidence: '开源代码',
    type: 'AI 对话 / RAG',
    summary:
      '我交付了 Go + React 的记忆对话原型,代码里有可检查的 grounding 约束,证据不足时系统必须承认不知道。',
    stack: ['Go', 'React', 'TypeScript', 'RAG', 'Grounding', 'AI Chat'],
    cover: '/covers/digital-loved-one.webp',
    coverAlt:
      '数字亲人的 grounding 结构图：Memory 到 Knowledge 到 Grounding，有依据时进入 Conversation，没有依据时走虚线分支，回答「不知道」。',
    repo: 'https://github.com/hackrabbit6/digital-loved-one',
  },
]

function Meta({ origin, evidence }: { origin: string; evidence: string }) {
  return (
    <p className="work-meta">
      <span>{origin}</span>
      <span aria-hidden="true">·</span>
      <span>{evidence}</span>
    </p>
  )
}

/**
 * Cover 是项目的主视觉位；每个有视觉位的项目都必须给出 alt。
 * coverNarrow 是窄屏专版：按 684 出图的那两张在手机上会被缩到 0.5×，
 * 图里的字认不出来。这里的 767px 必须和 Work.css 里的断点一致，
 * 否则换了图但 aspect-ratio 没换，object-fit: cover 会把图裁掉。
 */
function Visual({
  cover,
  coverNarrow,
  alt,
  href,
}: {
  cover: string
  coverNarrow?: string
  alt: string
  href: string
}) {
  const external = href.startsWith('http')
  return (
    <a
      className="work-visual-link"
      href={href}
      {...(external ? { target: '_blank', rel: 'noreferrer' } : {})}
    >
      <div className="work-visual">
        <picture>
          {coverNarrow ? <source media="(max-width: 767px)" srcSet={coverNarrow} /> : null}
          <img src={cover} alt={alt} loading="lazy" decoding="async" />
        </picture>
      </div>
    </a>
  )
}

function Card({ project, index }: { project: Project; index: string }) {
  return (
    <article className="work-card">
      <Visual
        cover={project.cover}
        coverNarrow={project.coverNarrow}
        alt={project.coverAlt}
        href={project.caseUrl ?? project.repo ?? '#'}
      />
      <p className="work-index">
        {index} / {project.type}
      </p>
      <h3>{project.name}</h3>
      <Meta origin={project.origin} evidence={project.evidence} />
      <p className="work-summary">{project.summary}</p>
      <div className="work-tags">
        {project.stack.map((item) => (
          <span key={item}>{item}</span>
        ))}
      </div>
      {project.caseUrl ? (
        <a className="work-link" href={project.caseUrl}>
          阅读案例
        </a>
      ) : null}
      {project.repo ? (
        <a className="work-link" href={project.repo} target="_blank" rel="noreferrer">
          查看代码
        </a>
      ) : null}
    </article>
  )
}

export function Work() {
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    gsap.registerPlugin(ScrollTrigger)

    // 只在两列布局成立时 pin 标题；单列下 pin 会把标题压在内容上。
    const mm = gsap.matchMedia()
    mm.add('(min-width: 1024px)', () => {
      ScrollTrigger.create({
        trigger: '.work',
        start: 'top top',
        end: 'bottom bottom',
        pin: '.work-heading',
      })
    })

    gsap.utils.toArray<HTMLElement>('.work-card, .work-featured').forEach((card) => {
      gsap.from(card, {
        y: 48,
        opacity: 0,
        duration: 0.8,
        ease: 'power3.out',
        scrollTrigger: { trigger: card, start: 'top 88%' },
      })
    })

    return () => mm.revert()
  }, [])

  return (
    <section className="work" id="work">
      <div className="work-heading">
        <p className="eyebrow">作品</p>
        <h2>做过的项目</h2>
        <p className="work-lead">工作项目按脱敏边界展示过程与判断，个人项目公开代码。</p>
      </div>

      <div className="work-list">
        <article className="work-featured">
          <Visual
            cover={featured.cover}
            coverNarrow={featured.coverNarrow}
            alt={featured.coverAlt}
            href={featured.caseUrl}
          />
          <p className="work-index">
            01 / featured — {featured.type}
          </p>
          <h3>{featured.name}</h3>
          <Meta origin={featured.origin} evidence={featured.evidence} />
          <div className="work-points">
            {[
              ['方向', featured.direction],
              ['协作', featured.collaboration],
              ['结果', featured.result],
            ].map(([label, text]) => (
              <div className="work-point" key={label}>
                <strong>{label}</strong>
                <p>{text}</p>
              </div>
            ))}
          </div>
          <div className="work-tags">
            {featured.stack.map((item) => (
              <span key={item}>{item}</span>
            ))}
          </div>
          <a className="work-link" href={featured.caseUrl}>
            阅读案例
          </a>
        </article>

        <div className="work-pair">
          <Card project={projects[0]} index="02" />
          <Card project={projects[1]} index="03" />
        </div>

        {/* 首页只放精选（决定 2）：完整列表在 /work/，包括没上首页的那几个。 */}
        <a className="work-more" href="/work/">
          看完整作品列表
        </a>
      </div>
    </section>
  )
}
