import { useEffect } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import './Skills.css'

const capabilities = [
  {
    title: '前端业务交付',
    text: 'Vue / React / TypeScript 交付页面、组件、接口联调与上线。',
    ai: 'agent 搭常规结构，我审业务状态与验收。',
  },
  {
    title: 'H5 / SDK / 支付链路',
    text: '游戏发行 SDK、公众号充值、微信/支付宝支付、小游戏与移动端适配。',
    ai: 'agent 列兼容矩阵，我盯支付链路与线上风险。',
  },
  {
    title: '工具与全栈补位',
    text: 'Node / Bun / Go 把业务原型推到可联调。',
    ai: 'agent 补样板接口，我查边界与可用性。',
  },
  {
    title: 'AI 应用接入',
    text: 'RAG、Function Calling、AI 聊天应用落地。',
    ai: 'agent 试实现路线，我用 grounding 与产品判断收口。',
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
