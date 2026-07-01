import { useEffect } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import './Skills.css'

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

export function Skills() {
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    gsap.registerPlugin(ScrollTrigger)
    gsap.from('.skill-card', {
      y: 48,
      opacity: 0,
      stagger: 0.12,
      duration: 0.8,
      ease: 'power3.out',
      scrollTrigger: { trigger: '.skills-grid', start: 'top 78%' },
    })
  }, [])

  return (
    <section className="skills" id="skills">
      <div className="section-kicker">
        <p className="eyebrow">delivery map</p>
        <h2>我能交付什么</h2>
      </div>
      <div className="skills-grid">
        {capabilities.map((item) => (
          <article className="skill-card" key={item.title}>
            <h3>{item.title}</h3>
            <p>{item.text}</p>
            <small>&gt; agent boost: {item.ai}</small>
          </article>
        ))}
      </div>
    </section>
  )
}
