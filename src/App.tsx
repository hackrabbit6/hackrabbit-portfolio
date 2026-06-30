import {
  ArrowRight,
  Bot,
  BookOpenText,
  BriefcaseBusiness,
  CreditCard,
  Database,
  Download,
  Gamepad2,
  GitBranch,
  LayoutDashboard,
  ListChecks,
  Mail,
  Music2,
  PanelsTopLeft,
  ShieldCheck,
  Sparkles,
  Wrench,
} from 'lucide-react'
import './App.css'

function HackRabbitMark({ compact = false }: { compact?: boolean }) {
  return (
    <pre className={compact ? 'hackrabbit-mark compact' : 'hackrabbit-mark'} aria-label="hackrabbit mark">
{`(\\(\\
(•ᴥ•)
/ づ`}
    </pre>
  )
}

const projects = [
  {
    name: 'H5 游戏发行 SDK 与充值体系',
    status: '脱敏案例',
    type: 'SDK / 支付 / 多端适配',
    direction:
      '我看到每个游戏重复接账号、支付和活动能力会拖慢上线,所以把问题拆成稳定 SDK 接入链路。',
    collaboration:
      '这是工作期项目,核心难点我自己和团队一起排查:iframe 通信、微信/支付宝拉起、小游戏限制和移动端兼容。',
    result:
      '我交付并维护了登录、支付、角色上报、浮窗、实名、防沉迷等能力,支撑多款游戏和充值活动上线。',
    modules: ['SDK 对外 API', '微信/支付宝支付', 'iframe 通信', '小游戏适配'],
    stack: ['Vue3', 'TypeScript', 'Vite', 'H5', 'postMessage', 'WeixinJSBridge'],
    icon: Gamepad2,
  },
  {
    name: '广告买量系统',
    status: '工作项目',
    type: '中后台 / 业务流程',
    direction:
      '我看到投放系统最怕误操作和状态不一致,所以优先把复杂流程拆成可确认、可回显、可追踪的界面。',
    collaboration:
      '工作期项目里我和后端、运营一起对齐字段、状态和异常分支,把复杂表单和接口联调压到可上线范围。',
    result:
      '我交付了广告创建、投放操作、状态回显、国际化配置等页面,让运营能稳定完成日常投放调整。',
    modules: ['广告创建', '投放操作', '复杂表单', '状态回显'],
    stack: ['Vue3', 'TypeScript', 'Vite', 'Element Plus', 'Axios', 'vue-i18n'],
    icon: LayoutDashboard,
  },
  {
    name: 'AI 音乐生成工具',
    status: '已开源',
    type: 'AI 应用 / Audio',
    direction:
      '我看到 AI 生成产品的关键不是按钮,而是异步任务、失败状态和作品管理,所以先把生成链路产品化。',
    collaboration:
      '我定流程和验收标准,再用 AI 辅助拆页面、补接口和整理边界状态,最后自己检查播放、持久化和重试体验。',
    result:
      '我做出了可运行的「提示词 -> 歌词 -> 音乐 -> 封面」控制台,作品可保存、可回放、可复核代码。',
    modules: ['生成任务', '歌词生成', '音频播放', '作品管理'],
    stack: ['React', 'TypeScript', 'Bun', 'Hono', 'SQLite', 'MiniMax API'],
    icon: Music2,
    repo: 'https://github.com/hackrabbit6/music',
  },
  {
    name: '数字亲人 / 家庭记忆 AI',
    status: '已开源',
    type: 'AI 对话 / RAG',
    direction:
      '我看到情感类 AI 最大风险是胡说,所以先把证据和解读分开,让系统在证据不足时必须承认不知道。',
    collaboration:
      '我用 agent 辅助梳理 RAG 流程和前端状态,但 grounding 约束、资料边界和回答原则由我定。',
    result:
      '我交付了 Go + React 的记忆对话原型,代码里有可检查的 grounding 约束,适合展示 AI 产品判断力。',
    modules: ['人物档案', '记忆资料', 'grounding 校验', 'RAG 流程'],
    stack: ['Go', 'React', 'TypeScript', 'RAG', 'Grounding', 'AI Chat'],
    icon: BookOpenText,
    repo: 'https://github.com/hackrabbit6/digital-loved-one',
  },
  {
    name: 'onchain-research',
    status: '已开源',
    type: '本地工具 / 链上研究 CLI',
    direction:
      '我看到链上研究很容易把猜测当结论,所以工具只输出可复核证据,不把聚类包装成归因证明。',
    collaboration:
      '我定研究边界和报告结构,让 agent 辅助写 CLI、整理 Markdown 输出和补数据处理细节,我检查风险表述。',
    result:
      '我做出本地优先的 EVM/BSC 研究 CLI,覆盖持有人聚类、集中度分析和钱包追踪,定位是研究辅助而非自动交易。',
    modules: ['持有人聚类', '集中度分析', '钱包追踪', 'Markdown 报告'],
    stack: ['TypeScript', 'Bun', 'EVM', 'BSC', 'Moralis', 'CLI'],
    icon: Database,
    repo: 'https://github.com/hackrabbit6/onchain-research',
  },
]

const focusItems = [
  ['业务前端', '中后台、复杂表单、接口联调、状态回显和上线交付'],
  ['H5 / SDK', '游戏发行 SDK、充值支付、Hybrid 通信和小游戏适配'],
  ['工具项目', 'WebSocket 数据工具、桌面端封装和轻量全栈补位'],
  ['AI 延展', '用 React、Bun 和 AI API 做可演示的产品原型'],
]

const crew = [
  {
    agent: 'Claude Code',
    role: '规划 / 大段重构 / code review',
    flow: '我先用第一性原理把问题拆成 spec,再让它产出实现计划和 review 意见,最后我收口取舍。',
  },
  {
    agent: 'Codex 桌面版',
    role: '执行 / GUI / 截图 / 高频重复',
    flow: '我把已经对齐的计划交给它落地,浏览器验证、截图和重复检查由它跑,我验收最终 diff。',
  },
  {
    agent: 'OpenSpec 工作流',
    role: '规范 / 边界 / 防跑偏',
    flow: '我先用规范把需求、约束和验收写清楚,再进入实现,避免 vibe coding 把问题越做越散。',
  },
]

const caseStudies = [
  {
    title: 'H5 游戏发行 SDK 与充值体系',
    context:
      '多款 H5 游戏和小游戏需要接入统一账号、支付、浮窗、公告、礼包、实名、防沉迷和客服能力，减少每个游戏重复接入成本。',
    role:
      '我把 SDK 前端模块、充值流程、H5/小游戏适配和联调排查串起来,同时维护老版 Webpack/React SDK,再推进新版 Vue3 + TypeScript SDK 改造。',
    challenge:
      '难点集中在 iframe/postMessage 通信、微信/支付宝支付拉起、微信内置浏览器与普通浏览器差异、小游戏环境限制、移动端输入框和横竖屏兼容。',
    result:
      '支撑多个游戏、公众号充值和活动页面上线，把登录、支付、角色上报等能力沉淀成可复用接入流程。',
  },
  {
    title: '广告买量系统',
    context:
      '业务团队需要在内部系统里完成多平台广告创建、推送、暂停、删除和状态管理，前端需要把复杂投放流程做成稳定可操作的后台界面。',
    role:
      '我用 Vue3 + TypeScript 把复杂表单、状态回显、接口联调、操作确认、异常提示和国际化配置落到可上线页面。',
    challenge:
      '难点包括表单字段多、接口状态多、投放操作不可误触、列表与详情状态一致性、多环境配置和多语言文案维护。',
    result:
      '支持广告投放业务日常配置和迭代上线，提升运营人员创建、调整和排查广告任务的效率。',
  },
  {
    title: 'AI 音乐生成工具',
    context:
      'AIGC 产品需要把提示词、风格参数、异步生成状态、失败提示、作品历史和音频播放组织成稳定的前端流程。',
    role:
      '我先梳理产品原型和交互流程,再搭建生成入口、任务状态、历史记录、作品管理和音频播放等核心页面。',
    challenge:
      '难点包括生成任务不是即时返回、用户需要理解等待/失败/重试状态，作品列表也要和播放、收藏、再次生成等动作保持一致。',
    result:
      '沉淀了 AIGC 应用前端常见的异步任务管理、作品管理和 AI API 接入经验，可作为 AI 应用前端面试案例。',
  },
]

const resumeSignals = [
  {
    title: '稳定业务交付',
    text: '我能从需求评审、页面开发、接口联调、自测走到上线验收,适配中后台、H5、工具平台类岗位。',
    icon: ListChecks,
  },
  {
    title: '复杂链路经验',
    text: '我做过支付、SDK、壳包通信、WebSocket 和多端兼容,能处理比普通页面更长的状态链路。',
    icon: ShieldCheck,
  },
  {
    title: 'AI 应用延展',
    text: '我近期围绕 AI 生成任务、RAG、Tool Use、Prompt 和作品管理,把 AI 能力落到可操作界面。',
    icon: Sparkles,
  },
  {
    title: '轻量全栈补位',
    text: '我能用 Node.js、Bun、Elysia、Go、Gin 补基础接口、CRUD、分页、鉴权思路和前后端联调。',
    icon: Wrench,
  },
]

const capabilities = [
  {
    title: '前端业务交付',
    text: '我用 Vue2 / Vue3、React、TypeScript、Vite、Webpack、Element Plus、Vant 交付页面、组件、接口联调和上线。',
    ai: '我让 agent 先搭常规结构,我集中审业务状态、异常分支和验收路径。',
  },
  {
    title: 'H5 / SDK / 支付链路',
    text: '我做过游戏发行 SDK、公众号充值、微信/支付宝支付、小游戏适配、iframe 通信、移动端兼容和线上问题排查。',
    ai: '我让 agent 帮我列兼容矩阵和回归点,我自己盯支付链路和线上风险。',
  },
  {
    title: '工具与全栈补位',
    text: '我用 Node.js、Bun、Elysia、Go、Gin、REST API、WebSocket 和基础 CRUD 把业务原型推进到可联调版本。',
    ai: '我让 agent 补样板接口和数据处理,我检查边界、错误处理和真实可用性。',
  },
  {
    title: 'AI 应用接入',
    text: '我接 RAG、Function Calling / Tool Use、Prompt、AI 聊天应用和 AI 协同开发,重点盯应用层产品体验。',
    ai: '我让 agent 快速试实现路线,我用 grounding、任务状态和产品判断收口。',
  },
]

const stackGroups = [
  ['前端框架', 'Vue2 / Vue3、React、TypeScript、JavaScript、Vite、Webpack'],
  ['业务组件', 'Element Plus、Vant、复杂表单、复杂表格、状态回显、操作确认'],
  ['移动与跨端', 'H5、微信公众号、微信支付、支付宝支付、Hybrid 通信、小游戏适配'],
  ['数据与接口', 'Axios、REST API、WebSocket、鉴权流程、异常处理、接口联调'],
  ['后端与工具', 'Node.js、Bun、Elysia、Go、Gin、Python、基础 CRUD 和数据处理'],
  ['AI 应用', 'RAG、Function Calling / Tool Use、Prompt 调整、AI 聊天集成、AI 协同开发'],
]

const experience = [
  {
    company: '九月稻田',
    role: '前端开发工程师',
    time: '2024.03 - 2024.08',
    detail: '我在广告买量系统里交付 Vue3 + Vite 页面、接口联调、多平台广告投放流程和国际化配置。',
  },
  {
    company: '602 游戏',
    role: '前端开发工程师',
    time: '2021.10 - 2024.01',
    detail: '我把 H5 SDK、充值活动、公众号业务和桌面端工具推进上线,处理支付对接、移动端适配、壳包通信和 WebSocket 数据解析。',
  },
  {
    company: '嘉仕软件江苏有限公司',
    role: '前端开发工程师',
    time: '2021.03 - 2021.10',
    detail: '我在供应链与数据管理平台里交付复杂表格、数据展示、报表功能、公式计算和性能优化。',
  },
  {
    company: '广州顶点思维教育科技有限公司',
    role: '前端开发工程师',
    time: '2019.11 - 2021.03',
    detail: '我在教育平台里做学生端、教师端和后台维护,把 Vue H5 WebApp、Android 原生能力调用和 Socket 通信接进业务。',
  },
]

function App() {
  return (
    <main>
      <nav className="topbar" aria-label="主导航">
        <a className="brand" href="#top">
          <span>hackrabbit</span>
          <small>Frontend Engineer</small>
        </a>
        <div className="nav-links">
          <a href="#crew">AI Crew</a>
          <a href="#projects">项目</a>
          <a href="#cases">案例</a>
          <a href="#capabilities">能力</a>
          <a href="#experience">经历</a>
          <a href="#contact">联系</a>
        </div>
      </nav>

      <section className="hero" id="top">
        <div className="hero-copy">
          <p className="eyebrow">Frontend operator / hackrabbit</p>
          <h1>
            <span>4-5 年前端交付</span> + 我用<span>第一性原理</span>思考、指挥一队{' '}
            <span>AI 智能体</span>,把活干得更快更稳。
          </h1>
          <p className="lead">
            我先用稳定的业务前端交付建立可信度，再把 AI 当成执行队伍来放大产出。写码、联调、验收我都做，只是现在会把可拆给 agent 的重复活交出去。
          </p>
          <div className="pillar-row" aria-label="四个判断支柱">
            {['健康', '现金流', '认知', 'AI'].map((item) => (
              <span key={item}>{item}</span>
            ))}
          </div>
          <p className="crew-status">&gt; crew: 3 agents online</p>
          <div className="actions">
            <a className="primary" href="#projects">
              查看项目 <ArrowRight size={18} />
            </a>
            <a className="secondary" href="/resume.pdf" target="_blank" rel="noreferrer">
              下载简历 <Download size={18} />
            </a>
          </div>
          <div className="proof-row" aria-label="关键经验">
            <div>
              <strong>4-5 年</strong>
              <span>前端业务开发</span>
            </div>
            <div>
              <strong>H5 SDK</strong>
              <span>支付与多端适配</span>
            </div>
            <div>
              <strong>AI 原型</strong>
              <span>生成任务 / RAG / API 集成</span>
            </div>
          </div>
        </div>

        <aside className="product-board" aria-label="作品集项目面板">
          <HackRabbitMark />
          <div className="board-top">
            <div>
              <span>Current focus</span>
              <strong>Portfolio Launch</strong>
            </div>
            <PanelsTopLeft size={22} />
          </div>
          <div className="board-panel main-panel">
            <span className="panel-label">Resume to portfolio</span>
            <div className="pipeline">
              <span>Resume</span>
              <i />
              <span>Case</span>
              <i />
              <span>Demo</span>
            </div>
          </div>
          <div className="board-grid">
            <div className="board-panel">
              <Gamepad2 size={22} />
              <strong>H5 SDK</strong>
              <span>Login / Pay</span>
            </div>
            <div className="board-panel">
              <LayoutDashboard size={22} />
              <strong>中后台</strong>
              <span>Forms / Tables</span>
            </div>
            <div className="board-panel">
              <CreditCard size={22} />
              <strong>支付链路</strong>
              <span>WeChat / Alipay</span>
            </div>
            <div className="board-panel">
              <Bot size={22} />
              <strong>AI 工具</strong>
              <span>Task / RAG</span>
            </div>
          </div>
        </aside>
      </section>

      <section className="focus-strip" aria-label="当前优先级">
        {focusItems.map(([title, text], index) => (
          <article key={title}>
            <span>{String(index + 1).padStart(2, '0')}</span>
            <h3>{title}</h3>
            <p>{text}</p>
          </article>
        ))}
      </section>

      <section className="section crew-section" id="crew">
        <div className="section-heading wide-heading">
          <p className="eyebrow">My AI Crew</p>
          <h2>我不是一个人写代码,我管理一队 AI 智能体。</h2>
          <p>
            我保留方向判断、业务取舍和最终验收,把能被规范化的执行交给 agent。这样不是少写代码,而是把写码放进更稳的交付系统。
          </p>
        </div>
        <div className="crew-grid">
          {crew.map((item) => (
            <article className="crew-card" key={item.agent}>
              <p>&gt; status: online</p>
              <h3>{item.agent}</h3>
              <strong>{item.role}</strong>
              <span>{item.flow}</span>
            </article>
          ))}
        </div>
      </section>

      <section className="section projects-section" id="projects">
        <div className="section-heading wide-heading">
          <p className="eyebrow">Selected projects</p>
          <h2>先展示真实业务项目，再展示 AI 和工具型项目的延展能力。</h2>
          <p>
            工作项目用脱敏案例说明职责、难点和结果；个人项目展示近期保持开发状态、AI 应用理解和轻量全栈能力。
          </p>
        </div>
        <div className="project-grid">
          {projects.map((project) => {
            const Icon = project.icon

            return (
              <article className="project-card" key={project.name}>
                <div className="card-head">
                  <div>
                    <Icon size={22} />
                    <p>{project.type}</p>
                    <h3>{project.name}</h3>
                  </div>
                  <span>{project.status}</span>
                </div>
                <div className="project-story">
                  <div>
                    <strong>方向</strong>
                    <p>{project.direction}</p>
                  </div>
                  <div>
                    <strong>协作</strong>
                    <p>{project.collaboration}</p>
                  </div>
                  <div>
                    <strong>结果</strong>
                    <p>{project.result}</p>
                  </div>
                </div>
                <div className="module-list">
                  {project.modules.map((module) => (
                    <span key={module}>{module}</span>
                  ))}
                </div>
                <div className="tags">
                  {project.stack.map((item) => (
                    <span key={item}>{item}</span>
                  ))}
                </div>
                {'repo' in project && project.repo ? (
                  <a
                    className="project-link"
                    href={project.repo}
                    target="_blank"
                    rel="noreferrer"
                  >
                    查看代码 →
                  </a>
                ) : null}
              </article>
            )
          })}
        </div>
      </section>

      <section className="section resume-fit" aria-label="简历对应作品集证据">
        <div className="section-heading wide-heading">
          <p className="eyebrow">Resume fit</p>
          <h2>简历里的关键词，在作品集中对应到这些证据。</h2>
        </div>
        <div className="signal-grid">
          {resumeSignals.map((signal) => {
            const Icon = signal.icon

            return (
              <article key={signal.title}>
                <Icon size={22} />
                <h3>{signal.title}</h3>
                <p>{signal.text}</p>
              </article>
            )
          })}
        </div>
      </section>

      <section className="section projects-section" id="cases">
        <div className="section-heading wide-heading">
          <p className="eyebrow">Case studies</p>
          <h2>可用于面试展开的项目案例。</h2>
          <p>每个案例都按背景、我的判断、难点、结果组织,方便从简历快速过渡到具体实现讨论。</p>
        </div>
        <div className="case-study-list" aria-label="脱敏项目案例说明">
          {caseStudies.map((study) => (
            <article className="case-study" key={study.title}>
              <div className="case-title">
                <p className="eyebrow">Case study</p>
                <h3>{study.title}</h3>
              </div>
              <div className="case-points">
                <div>
                  <span>背景</span>
                  <p>{study.context}</p>
                </div>
                <div>
                  <span>我的判断</span>
                  <p>{study.role}</p>
                </div>
                <div>
                  <span>难点</span>
                  <p>{study.challenge}</p>
                </div>
                <div>
                  <span>结果</span>
                  <p>{study.result}</p>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="section split" id="capabilities">
        <div className="section-heading sticky-heading">
          <p className="eyebrow">Skill map</p>
          <h2>我能交付什么</h2>
          <p>偏前端全栈，不追求把每个方向都说满，重点是把业务需求推进到可运行、可联调、可上线。</p>
        </div>
        <div className="capability-list">
          {capabilities.map((item) => (
            <article key={item.title}>
              <h3>{item.title}</h3>
              <p>{item.text}</p>
              <small>&gt; agent boost: {item.ai}</small>
            </article>
          ))}
        </div>
      </section>

      <section className="section stack-section" aria-label="技术栈">
        <div className="section-heading wide-heading">
          <p className="eyebrow">Stack</p>
          <h2>技术栈按岗位价值归类，而不是只列名词。</h2>
        </div>
        <div className="stack-grid">
          {stackGroups.map(([title, text]) => (
            <article key={title}>
              <span>{title}</span>
              <p>{text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="section narrative">
        <div className="narrative-card">
          <BriefcaseBusiness size={26} />
          <div>
            <p className="eyebrow">Positioning</p>
            <h2>先证明我能稳定交付业务前端，再展示我能把 AI 能力接进真实产品流程。</h2>
          </div>
        </div>
      </section>

      <section className="section" id="experience">
        <div className="section-heading">
          <p className="eyebrow">Experience</p>
          <h2>工作经历</h2>
        </div>
        <div className="timeline">
          {experience.map((item) => (
            <article className="timeline-item" key={`${item.company}-${item.time}`}>
              <div>
                <h3>{item.company}</h3>
                <p>{item.role}</p>
              </div>
              <time>{item.time}</time>
              <p>{item.detail}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="contact" id="contact">
        <div>
          <p className="eyebrow">Contact</p>
          <h2>我在找前端、中级前端、偏前端全栈和 AI 应用前端机会,能交付稳定业务,也能把 AI 流程做成可运行产品。</h2>
          <HackRabbitMark compact />
        </div>
        <div className="contact-links">
          <a href="mailto:hackrabbit6@gmail.com">
            <Mail size={18} /> hackrabbit6@gmail.com
          </a>
          <a href="https://github.com/hackrabbit6" target="_blank" rel="noreferrer">
            <GitBranch size={18} /> GitHub
          </a>
        </div>
      </section>
    </main>
  )
}

export default App
