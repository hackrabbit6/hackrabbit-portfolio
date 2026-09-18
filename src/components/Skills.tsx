import { useEffect } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import './Skills.css'

const lead =
  '我的核心不是「会哪些技术」，而是能把跨端、跨链路的业务前端做稳 —— 尤其是支付、SDK、Hybrid 通信这类出错代价高、又没法只靠本地跑通的链路。'

const capabilities = [
  {
    title: '跨端支付与 SDK 链路',
    text: '微信 / 支付宝 / 米大师：从拉起、回调到订单状态与多端兼容；把公共能力封成一套 SDK，供多款游戏接入。',
    ai: 'agent 列兼容矩阵，我盯支付链路与线上风险。',
  },
  {
    title: '复杂中后台',
    text: '多平台广告投放、供应链电子表格：复杂表单与表格、状态以服务端为准、状态回显与国际化。',
    ai: 'agent 搭常规结构，我审业务状态与验收。',
  },
  {
    title: '独立交付：想法 → 上线',
    text: '一个人 + 一支 AI 班底：作品集、RAG 工作台、AI 音乐与数字亲人，从设计、开发到部署自己走完。',
    ai: '用 agent 做原型与排查，我做产品判断与收口。',
  },
  {
    title: 'AI 应用接入',
    text: 'RAG、Function Calling、可解释的 grounding —— 证据不足时，系统必须承认「不知道」。',
    ai: 'agent 试实现路线，我用 grounding 与验收标准收口。',
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
        <p className="eyebrow">能力</p>
        <h2>我能交付什么</h2>
        <p className="skills-lead">{lead}</p>
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
