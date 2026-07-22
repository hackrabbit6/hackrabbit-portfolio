import { useEffect } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import './Work.css'

const projects = [
  {
    name: 'H5 游戏发行 SDK 与充值体系',
    status: '脱敏案例',
    type: 'SDK / 支付 / 多端适配',
    direction: '我看到每个游戏重复接账号、支付和活动能力会拖慢上线,所以把问题拆成稳定 SDK 接入链路。',
    collaboration: '这是工作期项目,核心难点我自己和团队一起排查:iframe 通信、微信/支付宝拉起、小游戏限制和移动端兼容。',
    result: '我交付并维护了登录、支付、角色上报、浮窗、实名、防沉迷等能力,支撑多款游戏和充值活动上线。',
    stack: ['Vue3', 'TypeScript', 'Vite', 'H5', 'postMessage', 'WeixinJSBridge'],
    caseUrl: '/work/h5-game-sdk/',
  },
  {
    name: '广告买量系统',
    status: '工作项目',
    type: '中后台 / 业务流程',
    direction: '我看到投放系统最怕误操作和状态不一致,所以优先把复杂流程拆成可确认、可回显、可追踪的界面。',
    collaboration: '工作期项目里我和后端、运营一起对齐字段、状态和异常分支,把复杂表单和接口联调压到可上线范围。',
    result: '我交付了广告创建、投放操作、状态回显、国际化配置等页面,让运营能稳定完成日常投放调整。',
    stack: ['Vue3', 'TypeScript', 'Vite', 'Element Plus', 'Axios', 'vue-i18n'],
  },
  {
    name: 'AI 音乐生成工具',
    status: '已开源',
    type: 'AI 应用 / Audio',
    direction: '我看到 AI 生成产品的关键不是按钮,而是异步任务、失败状态和作品管理,所以先把生成链路产品化。',
    collaboration: '我定流程和验收标准,再用 AI 辅助拆页面、补接口和整理边界状态,最后自己检查播放、持久化和重试体验。',
    result: '我做出了可运行的「提示词 -> 歌词 -> 音乐 -> 封面」控制台,作品可保存、可回放、可复核代码。',
    stack: ['React', 'TypeScript', 'Bun', 'Hono', 'SQLite', 'MiniMax API'],
    repo: 'https://github.com/hackrabbit6/music',
  },
  {
    name: '数字亲人 / 家庭记忆 AI',
    status: '已开源',
    type: 'AI 对话 / RAG',
    direction: '我看到情感类 AI 最大风险是胡说,所以先把证据和解读分开,让系统在证据不足时必须承认不知道。',
    collaboration: '我用 agent 辅助梳理 RAG 流程和前端状态,但 grounding 约束、资料边界和回答原则由我定。',
    result: '我交付了 Go + React 的记忆对话原型,代码里有可检查的 grounding 约束,适合展示 AI 产品判断力。',
    stack: ['Go', 'React', 'TypeScript', 'RAG', 'Grounding', 'AI Chat'],
    repo: 'https://github.com/hackrabbit6/digital-loved-one',
  },
  {
    name: 'onchain-research',
    status: '已开源',
    type: '本地工具 / 链上研究 CLI',
    direction: '我看到链上研究很容易把猜测当结论,所以工具只输出可复核证据,不把聚类包装成归因证明。',
    collaboration: '我定研究边界和报告结构,让 agent 辅助写 CLI、整理 Markdown 输出和补数据处理细节,我检查风险表述。',
    result: '我做出本地优先的 EVM/BSC 研究 CLI,覆盖持有人聚类、集中度分析和钱包追踪,定位是研究辅助而非自动交易。',
    stack: ['TypeScript', 'Bun', 'EVM', 'BSC', 'Moralis', 'CLI'],
    repo: 'https://github.com/hackrabbit6/onchain-research',
  },
]

export function Work() {
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    gsap.registerPlugin(ScrollTrigger)

    const mm = gsap.matchMedia()
    mm.add('(min-width: 768px)', () => {
      ScrollTrigger.create({
        trigger: '.work',
        start: 'top top',
        end: 'bottom bottom',
        pin: '.work-heading',
      })
    })

    gsap.utils.toArray<HTMLElement>('.work-card').forEach((card) => {
      gsap.from(card, {
        y: 60,
        opacity: 0,
        duration: 0.8,
        ease: 'power3.out',
        scrollTrigger: { trigger: card, start: 'top 85%' },
      })
    })

    return () => mm.revert()
  }, [])

  return (
    <section className="work" id="work">
      <div className="work-heading">
        <p className="eyebrow">selected work</p>
        <h2>作品不是陈列柜,是我怎么判断、分工、验收的证据。</h2>
      </div>
      <div className="work-list">
        {projects.map((project) => (
          <article className="work-card" key={project.name}>
            <div className="work-card-head">
              <p>{project.type}</p>
              <span>{project.status}</span>
            </div>
            <h3>{project.name}</h3>
            {[
              ['方向', project.direction],
              ['协作', project.collaboration],
              ['结果', project.result],
            ].map(([label, text]) => (
              <div className="work-point" key={label}>
                <strong>{label}</strong>
                <p>{text}</p>
              </div>
            ))}
            <div className="work-tags">
              {project.stack.map((item) => (
                <span key={item}>{item}</span>
              ))}
            </div>
            {project.caseUrl ? <a className="work-link" href={project.caseUrl}>查看案例 →</a> : null}
            {project.repo ? (
              <a className="work-link" href={project.repo} target="_blank" rel="noreferrer">
                查看代码 →
              </a>
            ) : null}
          </article>
        ))}
      </div>
    </section>
  )
}
